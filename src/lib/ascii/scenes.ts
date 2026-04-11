import type { AsciiScene, SceneSnapshot } from './types';

export const asciiScenes: AsciiScene[] = [
  {
    id: 'boot',
    label: 'BOOT SEQUENCE',
    lines: [
      'SIMIYON VINCENT SAMUEL',
      'AUTOMATION  |  WEB3  |  FULL STACK',
      'SCENE 01 :: SYSTEM INITIALIZATION',
    ],
    durationMs: 7600,
    driftStrength: 0.95,
    emitterBoost: 1.05,
    objectAmplitude: 0.28,
  },
  {
    id: 'build',
    label: 'BUILD SYSTEMS',
    lines: [
      'I DESIGN AUTOMATED PRODUCT FLOWS',
      'FROM INFRA STRUCTURE TO EXPERIENCES',
      'SCENE 02 :: ARCHITECTURE IN MOTION',
    ],
    durationMs: 8600,
    driftStrength: 1.15,
    emitterBoost: 1.2,
    objectAmplitude: 0.34,
  },
  {
    id: 'ship',
    label: 'SHIP PRODUCTS',
    lines: [
      'SELECTED WORK STREAMS THROUGH HERE',
      'PIPELINES  PROTOCOLS  FRONTENDS',
      'SCENE 03 :: DEPLOYMENT PULSE',
    ],
    durationMs: 8400,
    driftStrength: 1.05,
    emitterBoost: 1.15,
    objectAmplitude: 0.3,
  },
  {
    id: 'contact',
    label: 'CONTACT LINK',
    lines: [
      'READY TO BUILD SOMETHING DISTINCT?',
      'MAIL  ::  SIMIYONVINSCENTSAMUEL@GMAIL.COM',
      'SCENE 04 :: LOOP AND REENTER',
    ],
    durationMs: 7800,
    driftStrength: 0.9,
    emitterBoost: 1,
    objectAmplitude: 0.22,
  },
];

export const asciiSceneCycleDuration = asciiScenes.reduce(
  (sum, scene) => sum + scene.durationMs,
  0,
);

export function resolveScene(totalElapsedMs: number): SceneSnapshot {
  const normalizedElapsed =
    asciiSceneCycleDuration > 0
      ? ((totalElapsedMs % asciiSceneCycleDuration) + asciiSceneCycleDuration) %
        asciiSceneCycleDuration
      : 0;

  let cursor = 0;

  for (let i = 0; i < asciiScenes.length; i += 1) {
    const scene = asciiScenes[i]!;
    const next = cursor + scene.durationMs;
    if (normalizedElapsed < next || i === asciiScenes.length - 1) {
      const sceneElapsedMs = normalizedElapsed - cursor;
      const sceneProgress =
        scene.durationMs > 0 ? sceneElapsedMs / scene.durationMs : 0;

      return {
        scene,
        sceneIndex: i,
        sceneElapsedMs,
        sceneProgress,
        cycleProgress:
          asciiSceneCycleDuration > 0
            ? normalizedElapsed / asciiSceneCycleDuration
            : 0,
      };
    }
    cursor = next;
  }

  const fallback = asciiScenes[0]!;
  return {
    scene: fallback,
    sceneIndex: 0,
    sceneElapsedMs: 0,
    sceneProgress: 0,
    cycleProgress: 0,
  };
}
