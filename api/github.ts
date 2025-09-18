// Vercel Serverless Function: /api/github
// Fetches public repos and languages for a user, sorts by push, caches for 10 min
import type { VercelRequest, VercelResponse } from "vercel";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const BASE = "https://api.github.com";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const username = (req.query.username as string) || "blackscythe123";
  const limit = parseInt((req.query.limit as string) || "12", 10);
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (GITHUB_TOKEN) headers["Authorization"] = `Bearer ${GITHUB_TOKEN}`;

  try {
    const repoRes = await fetch(
      `${BASE}/users/${username}/repos?per_page=100&sort=pushed&direction=desc`,
      { headers }
    );
    if (!repoRes.ok) {
      const msg = await repoRes.text().catch(() => "");
      return res.status(repoRes.status).json({ error: msg || repoRes.statusText });
    }
    let repos = (await repoRes.json()) as any[];
    repos = repos.filter((r) => !r.archived && !r.fork);
    repos = repos
      .sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime())
      .slice(0, limit);

    // Fetch languages for each repo in parallel
    const withLangs = await Promise.all(
      repos.map(async (repo) => {
        try {
          const lr = await fetch(repo.languages_url, { headers });
          if (!lr.ok) throw new Error("languages api error");
          const langs: Record<string, number> = await lr.json();
          const ordered = Object.entries(langs)
            .sort((a, b) => b[1] - a[1])
            .map(([name]) => name);
          return {
            id: repo.id,
            name: repo.name,
            description: repo.description,
            html_url: repo.html_url,
            homepage: repo.homepage,
            language: repo.language,
            stargazers_count: repo.stargazers_count,
            forks_count: repo.forks_count,
            updated_at: repo.updated_at,
            pushed_at: repo.pushed_at,
            archived: repo.archived,
            fork: repo.fork,
            topics: repo.topics,
            languages: ordered,
          };
        } catch {
          return {
            id: repo.id,
            name: repo.name,
            description: repo.description,
            html_url: repo.html_url,
            homepage: repo.homepage,
            language: repo.language,
            stargazers_count: repo.stargazers_count,
            forks_count: repo.forks_count,
            updated_at: repo.updated_at,
            pushed_at: repo.pushed_at,
            archived: repo.archived,
            fork: repo.fork,
            topics: repo.topics,
            languages: repo.language ? [repo.language] : [],
          };
        }
      })
    );

    // Cache for 10 minutes at edge
    res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate=300");
    return res.status(200).json(withLangs);
  } catch (e: any) {
    return res.status(500).json({ error: e.message || "Internal error" });
  }
}
