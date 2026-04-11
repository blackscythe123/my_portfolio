import { fetchGitHubRepos, fetchGitHubUser } from '@/lib/github';
import type { AsciiPortfolioData, AsciiRepoSnapshot } from './types';

const USERNAME = 'blackscythe123';
const ACTIVE_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;
const RECENT_PROJECT_LIMIT = 6;

export const fallbackAsciiPortfolioData: AsciiPortfolioData = {
  name: 'Simiyon Vinscent Samuel',
  role: 'Engineering Student & Developer',
  location: 'Chennai, India',
  email: 'samsamuel234567@gmail.com',
  githubUrl: 'https://github.com/blackscythe123',
  linkedinUrl: 'https://www.linkedin.com/in/simiyonvinscentsamuel/',
  username: USERNAME,
  bio: 'I build intelligent systems at the intersection of automation, web3, and full-stack development.',
  followers: 0,
  publicRepos: 0,
  repos: [],
};

function repoToSnapshot(repo: Awaited<ReturnType<typeof fetchGitHubRepos>>[number]): AsciiRepoSnapshot {
  const active = new Date(repo.pushed_at).getTime() > Date.now() - ACTIVE_WINDOW_MS;

  return {
    name: repo.name,
    description: repo.description ?? '',
    language: repo.language ?? 'Project',
    stars: repo.stargazers_count,
    topics: repo.topics ?? [],
    url: repo.html_url,
    active,
    updatedAt: repo.pushed_at,
  };
}

export async function getAsciiPortfolioData(): Promise<AsciiPortfolioData> {
  const [user, repos] = await Promise.all([
    fetchGitHubUser(USERNAME),
    fetchGitHubRepos(USERNAME),
  ]);

  const mappedRepos = repos.map(repoToSnapshot);

  // Show the top recent projects only (sorted in fetchGitHubRepos by pushed_at desc),
  // capped to keep the cinematic loop concise and readable.
  const selectedRepos = mappedRepos.slice(0, RECENT_PROJECT_LIMIT);

  return {
    name: user?.name ?? fallbackAsciiPortfolioData.name,
    role: fallbackAsciiPortfolioData.role,
    location: fallbackAsciiPortfolioData.location,
    email: fallbackAsciiPortfolioData.email,
    githubUrl: fallbackAsciiPortfolioData.githubUrl,
    linkedinUrl: fallbackAsciiPortfolioData.linkedinUrl,
    username: user?.login ?? fallbackAsciiPortfolioData.username,
    bio: user?.bio ?? fallbackAsciiPortfolioData.bio,
    followers: user?.followers ?? fallbackAsciiPortfolioData.followers,
    publicRepos: user?.public_repos ?? selectedRepos.length,
    repos: selectedRepos,
  };
}
