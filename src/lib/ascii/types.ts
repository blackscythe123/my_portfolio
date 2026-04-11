export type AsciiScene = {
  id: string;
  label: string;
  lines: string[];
  durationMs: number;
  driftStrength: number;
  emitterBoost: number;
  objectAmplitude: number;
};

export type AsciiRepoSnapshot = {
  name: string;
  description: string;
  language: string;
  stars: number;
  topics: string[];
  url: string;
  active: boolean;
  updatedAt: string;
};

export type AsciiPortfolioData = {
  name: string;
  role: string;
  location: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  username: string;
  bio: string;
  followers: number;
  publicRepos: number;
  repos: AsciiRepoSnapshot[];
};

export type SceneSnapshot = {
  scene: AsciiScene;
  sceneIndex: number;
  sceneElapsedMs: number;
  sceneProgress: number;
  cycleProgress: number;
};
