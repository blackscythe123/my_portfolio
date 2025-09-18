import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ExternalLink, Code, Star, GitFork } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";

type Repo = {
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
  languages_url: string;
  languages?: string[];
};

const USERNAME = import.meta.env.VITE_GITHUB_USERNAME || "blackscythe123";
const fetchTopRepos = async (): Promise<Repo[]> => {
  const proxyUrl = `/api/github?username=${USERNAME}&limit=6`;
  try {
    const r = await fetch(proxyUrl, { headers: { Accept: "application/json" } });
    if (!r.ok) throw new Error(`Proxy error ${r.status}`);
    return (await r.json()) as Repo[];
  } catch {
    const url = `https://api.github.com/users/${USERNAME}/repos?per_page=30&sort=pushed&direction=desc`;
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    };
    const res = await fetch(url, { headers });
    if (!res.ok) {
      let msg = await res.text().catch(() => "");
      throw new Error(`GitHub API error ${res.status}: ${msg || res.statusText}`);
    }
    const all = (await res.json()) as any[];
    const base = all
      .filter((r) => !r.archived && !r.fork)
      .sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime())
      .slice(0, 6);
    const withLangs = await Promise.all(
      base.map(async (repo) => {
        try {
          const lr = await fetch(repo.languages_url, { headers });
          if (!lr.ok) throw new Error("languages api error");
          const langs: Record<string, number> = await lr.json();
          const ordered = Object.entries(langs)
            .sort((a, b) => b[1] - a[1])
            .map(([name]) => name);
          return { ...repo, languages: ordered } as Repo;
        } catch {
          return { ...repo, languages: repo.language ? [repo.language] : [] } as Repo;
        }
      })
    );
    return withLangs;
  }
};

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

const ProjectSkeleton = () => (
  <Card className="bg-card border-border">
    <CardHeader>
      <div className="flex items-start justify-between gap-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-5 w-16" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-28" />
      </div>
    </CardHeader>
    <CardContent>
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6 mb-4" />
      <div className="flex gap-2 mb-4">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-16" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-8 w-8" />
      </div>
    </CardContent>
  </Card>
);

const Projects = () => {
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["github-top6", USERNAME],
    queryFn: fetchTopRepos,
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });
  const projects = data || [];

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Featured Projects
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Innovative solutions showcasing full-stack development and problem-solving skills
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProjectSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="max-w-xl mx-auto text-center">
            <p className="text-destructive font-medium mb-4">
              Failed to load featured projects. {(error as Error).message}
            </p>
            <Button onClick={() => refetch()} disabled={isFetching}>Try Again</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((repo) => (
              <Card
                key={repo.id}
                className="bg-card border-border hover:shadow-card transition-all duration-300 hover:scale-105"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg leading-tight">
                      {repo.name}
                    </CardTitle>
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
                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                    {repo.description || "No description provided."}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-4">
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
                  <div className="flex flex-wrap gap-1 mb-4">
                    {repo.languages && repo.languages.length > 0 ? (
                      repo.languages.slice(0, 8).map((lang) => (
                        <Badge
                          key={lang}
                          variant="secondary"
                          className="text-xs bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
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
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="flex-1 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                        <Code className="w-4 h-4 mr-2" />
                        View Code
                      </a>
                    </Button>
                    {repo.homepage && repo.homepage.trim().length > 0 ? (
                      <Button size="sm" asChild className="bg-gradient-primary hover:shadow-glow" title="Open project website">
                        <a href={repo.homepage} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    ) : (
                      <Button size="sm" className="bg-muted text-muted-foreground" disabled title="No website available">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;