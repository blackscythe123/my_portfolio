export type Project = {
  title: string;
  description: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
};

// IMPORTANT:
// Add ONLY real projects here. If this array is empty, the Projects section won't render.
export const projects: Project[] = [];
