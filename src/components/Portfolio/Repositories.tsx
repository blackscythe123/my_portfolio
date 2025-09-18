import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Github, ExternalLink, Calendar, Star, GitFork } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

type GithubRepo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage?: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  pushed_at: string;
  archived: boolean;
  fork: boolean;
  topics?: string[];
  languages?: string[];
};

const USERNAME = import.meta.env.VITE_GITHUB_USERNAME || "blackscythe123";
// Try serverless proxy first; if it fails locally, fallback to direct GitHub
const fetchRepos = async (): Promise<GithubRepo[]> => {
  const proxyUrl = `/api/github?username=${USERNAME}&limit=12`;
  try {
    const r = await fetch(proxyUrl, { headers: { Accept: "application/json" } });
    if (!r.ok) throw new Error(`Proxy error ${r.status}`);
    const data = (await r.json()) as GithubRepo[];
    return data;
  } catch {
    const url = `https://api.github.com/users/${USERNAME}/repos?per_page=12&sort=pushed&direction=desc`;
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    };
    const res = await fetch(url, { headers });
    if (!res.ok) {
      let msg = await res.text().catch(() => "");
      throw new Error(`GitHub API error ${res.status}: ${msg || res.statusText}`);
    }
    const data = (await res.json()) as any[];
    const filtered = data.filter((r) => !r.archived && !r.fork);
    const picked = (filtered.length ? filtered : data)
      .sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime())
      .slice(0, 12);
    // Fetch languages directly
    const withLangs = await Promise.all(
      picked.map(async (repo) => {
        try {
          const lr = await fetch(repo.languages_url, { headers });
          if (!lr.ok) throw new Error("languages api error");
          const langs: Record<string, number> = await lr.json();
          const ordered = Object.entries(langs)
            .sort((a, b) => b[1] - a[1])
            .map(([name]) => name);
          return { ...repo, languages: ordered } as GithubRepo;
        } catch {
          return { ...repo, languages: repo.language ? [repo.language] : [] } as GithubRepo;
        }
      })
    );
    return withLangs;
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const RepoSkeleton = () => (
  <Card className="bg-card border-border">
    <CardHeader>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 w-full">
          <Skeleton className="h-6 w-6 rounded" />
          <Skeleton className="h-6 w-40" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-32" />
      </div>
    </CardHeader>
    <CardContent>
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6 mb-4" />
      <div className="flex gap-2 mb-4">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-14" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-9 w-9" />
      </div>
    </CardContent>
  </Card>
);

const Repositories = () => {
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["github-repos", USERNAME],
    queryFn: fetchRepos,
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });

  const repositories = data || [];

  return (
    <section className="py-20 px-6 bg-gradient-secondary">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            GitHub Repositories
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Open source projects and code repositories showcasing development journey
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <RepoSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="max-w-xl mx-auto text-center">
            <p className="text-destructive font-medium mb-4">
              Failed to load repositories. {(error as Error).message}
            </p>
            <Button onClick={() => refetch()} disabled={isFetching}>
              Try Again
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {repositories.length === 0 ? (
              <div className="col-span-1 md:col-span-2 text-center text-muted-foreground">
                No repositories found.
              </div>
            ) : (
              repositories.map((repo) => (
              <Card
                key={repo.id}
                className={
                  "bg-card border-border hover:shadow-card transition-all duration-300 hover:scale-105"
                }
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Github className="w-6 h-6 text-primary" />
                      <CardTitle className="text-xl">{repo.name}</CardTitle>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Star className="w-4 h-4" /> {repo.stargazers_count}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <GitFork className="w-4 h-4" /> {repo.forks_count}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Last push {formatDate(repo.pushed_at || repo.updated_at)}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {repo.description || "No description provided."}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-2">
                    {repo.topics && repo.topics.length > 0 && (
                      <>
                        {repo.topics.slice(0, 6).map((t) => (
                          <Badge
                            key={t}
                            variant="secondary"
                            className="text-xs bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                          >
                            {t}
                          </Badge>
                        ))}
                      </>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 mb-6">
                    {repo.languages && repo.languages.length > 0 ? (
                      repo.languages.slice(0, 8).map((lang) => (
                        <Badge
                          key={lang}
                          variant="secondary"
                          className="text-xs bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                          title="Repository languages"
                        >
                          {lang}
                        </Badge>
                      ))
                    ) : repo.language ? (
                      <Badge
                        variant="secondary"
                        className="text-xs bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        {repo.language}
                      </Badge>
                    ) : null}
                  </div>

                  <div className="flex gap-2">
                    <Button asChild className="flex-1 bg-gradient-primary hover:shadow-glow">
                      <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                        <Github className="w-4 h-4 mr-2" />
                        View Repository
                      </a>
                    </Button>
                    {repo.homepage && repo.homepage.trim().length > 0 ? (
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                        title="Open project website"
                      >
                        <a href={repo.homepage} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-muted-foreground text-muted-foreground opacity-60"
                        disabled
                        title="No website available"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))) }
          </div>
        )}

        <div className="text-center mt-12">
          <Button 
            asChild
            size="lg"
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <a 
              href={`https://github.com/${USERNAME}`}
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Github className="w-5 h-5 mr-2" />
              View All Repositories
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Repositories;