// GitHub API types
export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  created_at: string;
  updated_at: string;
  pushed_at: string;
}

export interface GitHubUser {
  login: string;
  avatar_url: string;
  html_url: string;
  name: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
}

function buildGitHubHeaders() {
  return {
    Accept: "application/vnd.github.v3+json",
    ...(process.env.GITHUB_TOKEN && {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    }),
  } as Record<string, string>;
}

// Fetch GitHub user profile
export async function fetchGitHubUser(
  username: string
): Promise<GitHubUser | null> {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`, {
      headers: buildGitHubHeaders(),
      next: { revalidate: 3 }, // Revalidate every hour
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Failed to fetch GitHub user:", error);
    return null;
  }
}

// Fetch GitHub repositories
export async function fetchGitHubRepos(
  username: string
): Promise<GitHubRepo[]> {
  try {
    const useAuth = Boolean(process.env.GITHUB_TOKEN);
    const url = useAuth
      // Authenticated route: includes private + collaborator repos for the token owner
      ? "https://api.github.com/user/repos?per_page=100&sort=updated&direction=desc&affiliation=owner,collaborator,organization_member"
      // Public fallback: only public repos for the username
      : `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`;

    const response = await fetch(url, {
      headers: buildGitHubHeaders(),
      next: { revalidate: 3 }, // Revalidate every hour
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const repos: GitHubRepo[] = await response.json();

    // If authenticated, restrict to the requested owner's repos to avoid
    // showing unrelated org/collab repos from the token account.
    const scoped = useAuth
      ? repos.filter((r) => r?.full_name?.toLowerCase().startsWith(`${username.toLowerCase()}/`))
      : repos;

    // Sort purely by recently updated (pushed_at)
    return scoped
      .filter((repo) => 
        !repo.name.includes(".github") && 
        repo.name !== "my_portfolio" && 
        repo.name !== "blackscythe123"
      )
      .sort((a, b) => {
        return (
          new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime()
        );
      });
  } catch (error) {
    console.error("Failed to fetch GitHub repos:", error);
    return [];
  }
}
