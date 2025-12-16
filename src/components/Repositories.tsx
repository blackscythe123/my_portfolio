"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import type { GitHubRepo } from "@/lib/github";

// Language color mapping
const languageColors: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Rust: "#dea584",
  Go: "#00ADD8",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#ffac45",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  Vue: "#41b883",
  Svelte: "#ff3e00",
};

interface RepoCardProps {
  repo: GitHubRepo;
  index: number;
}

function RepoCard({ repo, index }: RepoCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group block rounded-2xl p-6 border border-border/70 bg-card/70 backdrop-blur transition-all duration-300 cursor-pointer hover:border-primary/50 hover:bg-card hover:shadow-xl hover:shadow-primary/10"
    >
      <div style={{ transform: "translateZ(50px)" }}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-muted"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z" />
            </svg>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
              {repo.name}
            </h3>
          </div>
        </div>

        <p className="text-muted text-sm mb-4 line-clamp-2 min-h-[40px]">
          {repo.description || "No description available"}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {repo.language && (
              <div className="flex items-center gap-1.5">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor:
                      languageColors[repo.language] || "#6e7681",
                  }}
                />
                <span className="text-xs text-muted">{repo.language}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <svg
                className="w-4 h-4 text-muted"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
              </svg>
              <span className="text-xs text-muted">{repo.stargazers_count}</span>
            </div>
            <div className="flex items-center gap-1">
              <svg
                className="w-4 h-4 text-muted"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z" />
              </svg>
              <span className="text-xs text-muted">{repo.forks_count}</span>
            </div>
          </div>
        </div>

        {repo.topics && repo.topics.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {repo.topics.slice(0, 3).map((topic) => (
              <span
                key={topic}
                className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full"
              >
                {topic}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.a>
  );
}

interface RepositoriesProps {
  repos: GitHubRepo[];
}

export function Repositories({ repos }: RepositoriesProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const displayedRepos = repos.slice(0, 4);

  return (
    <section id="repositories" className="py-24 md:py-32">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            GitHub <span className="gradient-text">Repositories</span>
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
            My open source contributions and personal projects
          </p>
        </motion.div>

        <div
          className="grid md:grid-cols-2 gap-6"
          style={{ perspective: "1000px" }}
        >
          {displayedRepos.map((repo, index) => (
            <RepoCard key={repo.id} repo={repo} index={index} />
          ))}
        </div>

        {repos.length > 4 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-3 border border-border/70 hover:border-primary text-foreground rounded-lg font-medium transition-all duration-300 hover:bg-foreground/5"
            >
              View All {repos.length} Repositories
            </button>
          </motion.div>
        )}
      </div>

      {/* All Repos Modal */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-2xl bg-card/90 backdrop-blur border border-border p-6 shadow-2xl transition-all">
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="min-w-0">
                      <Dialog.Title className="text-2xl font-bold">
                        All Repositories
                      </Dialog.Title>
                      <p className="text-sm text-muted">
                        Click a repo to open on GitHub.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 rounded-lg border border-border/70 hover:border-primary transition text-sm font-medium"
                    >
                      Close
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto pr-1" style={{ perspective: "1000px" }}>
                    {repos.map((repo, index) => (
                      <RepoCard key={repo.id} repo={repo} index={index} />
                    ))}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </section>
  );
}
