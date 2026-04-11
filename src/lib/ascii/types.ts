export type AsciiScene = {
  id: string;
  label: string;
  lines: string[];
  durationMs: number;
  driftStrength: number;
  emitterBoost: number;
  objectAmplitude: number;
};

export type SceneSnapshot = {
  scene: AsciiScene;
  sceneIndex: number;
  sceneElapsedMs: number;
  sceneProgress: number;
  cycleProgress: number;
};
