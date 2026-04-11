import { fallbackAsciiPortfolioData } from './portfolio';
import type { AsciiPortfolioData, AsciiScene, SceneSnapshot } from './types';

function cleanLine(value: string, maxLength = 72): string {
  return value
    .replace(/[^\x20-\x7E]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength)
    .toUpperCase();
}

function formatDateLabel(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return 'UNKNOWN';
  }
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function buildAsciiScenes(portfolio?: AsciiPortfolioData): AsciiScene[] {
  const source = portfolio ?? fallbackAsciiPortfolioData;

  const introScenes: AsciiScene[] = [
    {
      id: 'void-boot',
      label: 'VOID BOOT',
      lines: [
        cleanLine('SIGNAL LOCKED TO THE OUTER VOID'),
        cleanLine(`${source.name} :: ${source.role}`),
        cleanLine('SYSTEM TEMPERATURE :: 1 OF 10'),
      ],
      durationMs: 6200,
      driftStrength: 0.82,
      emitterBoost: 0.88,
      objectAmplitude: 0.12,
      actorMode: 'neutral',
      effectProfile: 'calm',
      textMode: 'centered',
      intensity: 0.22,
    },
    {
      id: 'angel-arrival',
      label: 'ANGEL ARRIVAL',
      lines: [
        cleanLine('A CELESTIAL ASCII GUIDE WALKS INTO FRAME'),
        cleanLine('FOLLOW THE WINGS TOWARD THE ARTIFACT VAULT'),
        cleanLine('NO LIMITS TODAY. ONLY ASCENT.'),
      ],
      durationMs: 6800,
      driftStrength: 0.96,
      emitterBoost: 1.02,
      objectAmplitude: 0.24,
      actorMode: 'angel',
      effectProfile: 'calm',
      textMode: 'obstacle-flow',
      intensity: 0.36,
    },
    {
      id: 'identity-reveal',
      label: 'IDENTITY REVEAL',
      lines: [
        cleanLine(source.name, 62),
        cleanLine(source.bio || 'I BUILD AUTOMATION, WEB3, AND FULL STACK WORLDS', 70),
        cleanLine(`GITHUB :: ${source.username} :: FOLLOWERS ${source.followers}`),
      ],
      durationMs: 6200,
      driftStrength: 1.04,
      emitterBoost: 1.14,
      objectAmplitude: 0.29,
      actorMode: 'angel',
      effectProfile: 'embers',
      textMode: 'centered',
      intensity: 0.52,
    },
    {
      id: 'artifact-vault',
      label: 'VAULT UNLOCK',
      lines: [
        cleanLine('THE ARTIFACT VAULT IS NOW OPEN'),
        cleanLine(`RECENT ARTIFACTS ONLINE :: ${Math.max(1, source.repos.length)}`),
        cleanLine('EACH RELIC IS A SYSTEM I FORGED IN REAL BATTLES'),
      ],
      durationMs: 5200,
      driftStrength: 1,
      emitterBoost: 1.18,
      objectAmplitude: 0.26,
      actorMode: 'angel',
      effectProfile: 'embers',
      textMode: 'spray',
      intensity: 0.6,
    },
  ];

  const artifactScenes: AsciiScene[] =
    source.repos.length > 0
      ? source.repos.map((repo, index) => {
          const detail = repo.description
            ? cleanLine(repo.description, 68)
            : repo.topics.length > 0
              ? cleanLine(repo.topics.slice(0, 4).join(' | '), 68)
              : 'NO DESCRIPTION AVAILABLE';

          return {
            id: `artifact-${index + 1}`,
            label: `ARTIFACT ${index + 1}/${source.repos.length}`,
            lines: [
              cleanLine(`RELIC :: ${repo.name}`, 64),
              cleanLine(
                `${repo.language} CORE :: STARS ${repo.stars} :: ${repo.active ? 'ACTIVE' : 'ARCHIVE'} :: ${formatDateLabel(repo.updatedAt)}`,
                70,
              ),
              detail,
            ],
            durationMs: 4200 + (index % 2) * 400,
            driftStrength: 0.94 + (index % 4) * 0.06,
            emitterBoost: 1.06 + (index % 3) * 0.08,
            objectAmplitude: 0.2 + (index % 4) * 0.02,
            actorMode: index % 2 === 0 ? 'angel' : 'neutral',
            effectProfile: index % 2 === 0 ? 'embers' : 'flare',
            textMode: index % 3 === 0 ? 'obstacle-flow' : 'centered',
            intensity: clamp(0.54 + index * 0.07, 0.54, 0.9),
          };
        })
      : [
          {
            id: 'artifact-placeholder',
            label: 'ARTIFACT SIGNAL',
            lines: [
              cleanLine('ARTIFACT TELEMETRY IS INITIALIZING'),
              cleanLine('NO REPOSITORIES RETURNED YET'),
              cleanLine('ANGEL GUARD MODE ACTIVE UNTIL SYNC COMPLETES'),
            ],
            durationMs: 4600,
            driftStrength: 0.98,
            emitterBoost: 1.08,
            objectAmplitude: 0.2,
            actorMode: 'angel',
            effectProfile: 'calm',
            textMode: 'centered',
            intensity: 0.5,
          },
        ];

  const climaxScenes: AsciiScene[] = [
    {
      id: 'false-calm',
      label: 'FALSE CALM',
      lines: [
        cleanLine('THE GRID GOES SILENT FOR ONE BREATH'),
        cleanLine('A SHADOW CUTS THE HORIZON'),
        cleanLine('SYSTEM TEMPERATURE :: 6 OF 10'),
      ],
      durationMs: 3600,
      driftStrength: 0.74,
      emitterBoost: 0.78,
      objectAmplitude: 0.1,
      actorMode: 'neutral',
      effectProfile: 'calm',
      textMode: 'centered',
      intensity: 0.58,
    },
    {
      id: 'dragon-breach',
      label: 'DRAGON BREACH',
      lines: [
        cleanLine('DRAGON INSTANCE HAS BREACHED THE FRAME'),
        cleanLine('BOUNDARY LIMITERS ARE SHATTERING'),
        cleanLine('HOLD COURSE. BUILD THROUGH CHAOS.'),
      ],
      durationMs: 4800,
      driftStrength: 1.22,
      emitterBoost: 1.36,
      objectAmplitude: 0.35,
      actorMode: 'dragon',
      effectProfile: 'shockwave',
      textMode: 'obstacle-flow',
      intensity: 0.88,
    },
    {
      id: 'flamethrower-manifesto',
      label: 'FLAMETHROWER MANIFESTO',
      lines: [
        cleanLine('BREAK LIMITS // IMAGINE BEYOND WORLDS', 70),
        cleanLine('BUILD THE IMPOSSIBLE WITH RELENTLESS COURAGE', 70),
        cleanLine('SPRAY IDEAS INTO REALITY. NEVER SHRINK.'),
      ],
      durationMs: 5600,
      driftStrength: 1.18,
      emitterBoost: 1.42,
      objectAmplitude: 0.3,
      actorMode: 'dragon',
      effectProfile: 'embers',
      textMode: 'spray',
      intensity: 1,
    },
    {
      id: 'transcendence',
      label: 'BEYOND BOUNDARIES',
      lines: [
        cleanLine('LET US GO BEYOND THE KNOWN WORLD TOGETHER'),
        cleanLine(`MAIL :: ${source.email}`),
        cleanLine(`GITHUB :: ${source.githubUrl} | LINKEDIN :: ${source.linkedinUrl}`, 70),
      ],
      durationMs: 7600,
      driftStrength: 0.9,
      emitterBoost: 1.04,
      objectAmplitude: 0.19,
      actorMode: 'angel',
      effectProfile: 'flare',
      textMode: 'centered',
      intensity: 0.62,
    },
  ];

  return [...introScenes, ...artifactScenes, ...climaxScenes];
}

export const defaultAsciiScenes = buildAsciiScenes();

export function getAsciiSceneCycleDuration(scenes: AsciiScene[]): number {
  return scenes.reduce((sum, scene) => sum + scene.durationMs, 0);
}

export function resolveScene(totalElapsedMs: number, scenes: AsciiScene[]): SceneSnapshot {
  const fallbackScenes = scenes.length > 0 ? scenes : defaultAsciiScenes;
  const cycleDuration = getAsciiSceneCycleDuration(fallbackScenes);

  const normalizedElapsed =
    cycleDuration > 0
      ? ((totalElapsedMs % cycleDuration) + cycleDuration) % cycleDuration
      : 0;

  let cursor = 0;

  for (let i = 0; i < fallbackScenes.length; i += 1) {
    const scene = fallbackScenes[i]!;
    const next = cursor + scene.durationMs;

    if (normalizedElapsed < next || i === fallbackScenes.length - 1) {
      const sceneElapsedMs = normalizedElapsed - cursor;
      const sceneProgress = scene.durationMs > 0 ? sceneElapsedMs / scene.durationMs : 0;

      return {
        scene,
        sceneIndex: i,
        sceneElapsedMs,
        sceneProgress,
        cycleProgress: cycleDuration > 0 ? normalizedElapsed / cycleDuration : 0,
      };
    }

    cursor = next;
  }

  const fallback = fallbackScenes[0]!;
  return {
    scene: fallback,
    sceneIndex: 0,
    sceneElapsedMs: 0,
    sceneProgress: 0,
    cycleProgress: 0,
  };
}
