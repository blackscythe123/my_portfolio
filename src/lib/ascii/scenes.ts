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

export function buildAsciiScenes(portfolio?: AsciiPortfolioData): AsciiScene[] {
  const source = portfolio ?? fallbackAsciiPortfolioData;

  const baseScenes: AsciiScene[] = [
    {
      id: 'boot',
      label: 'BOOT SEQUENCE',
      lines: [
        cleanLine(source.name),
        cleanLine(`${source.role} :: ${source.location}`),
        cleanLine('ASCII CINEMATIC PORTFOLIO MODE'),
      ],
      durationMs: 7600,
      driftStrength: 0.95,
      emitterBoost: 1.06,
      objectAmplitude: 0.28,
    },
    {
      id: 'profile',
      label: 'PROFILE SIGNAL',
      lines: [
        cleanLine(source.bio || 'BUILDING AUTOMATION WEB3 FULL STACK SYSTEMS'),
        cleanLine(`GITHUB :: ${source.username} | FOLLOWERS :: ${source.followers}`),
        cleanLine(`TOP RECENT PROJECTS :: ${source.repos.length}`),
      ],
      durationMs: 8600,
      driftStrength: 1.08,
      emitterBoost: 1.14,
      objectAmplitude: 0.33,
    },
  ];

  const projectScenes: AsciiScene[] = source.repos.map((repo, index) => {
    const primaryDetail = repo.description
      ? cleanLine(repo.description, 68)
      : repo.topics.length > 0
        ? cleanLine(repo.topics.slice(0, 4).join(' | '), 68)
        : 'NO DESCRIPTION AVAILABLE';

    return {
      id: `project-${index + 1}`,
      label: `PROJECT ${index + 1}/${Math.max(1, source.repos.length)}`,
      lines: [
        cleanLine(repo.name, 58),
        cleanLine(
          `${repo.language} :: STARS ${repo.stars} :: ${repo.active ? 'ACTIVE' : 'ARCHIVE'} :: ${formatDateLabel(repo.updatedAt)}`,
          70,
        ),
        primaryDetail,
      ],
      durationMs: 3600,
      driftStrength: 0.92 + (index % 5) * 0.05,
      emitterBoost: 1 + (index % 4) * 0.06,
      objectAmplitude: 0.2 + (index % 6) * 0.02,
    };
  });

  const endingScene: AsciiScene = {
    id: 'contact',
    label: 'CONTACT LINK',
    lines: [
      cleanLine('HAVE A PROJECT IN MIND? LET US BUILD SOMETHING TOGETHER.'),
      cleanLine(`MAIL :: ${source.email}`),
      cleanLine(`GITHUB :: ${source.githubUrl} | LINKEDIN :: ${source.linkedinUrl}`, 70),
    ],
    durationMs: 8000,
    driftStrength: 0.88,
    emitterBoost: 0.98,
    objectAmplitude: 0.2,
  };

  return [...baseScenes, ...projectScenes, endingScene];
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
