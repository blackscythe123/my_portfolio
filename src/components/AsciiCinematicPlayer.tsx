'use client';

import { useEffect, useRef } from 'react';
import { defaultAsciiScenes, resolveScene } from '@/lib/ascii/scenes';
import type {
  AsciiActorMode,
  AsciiEffectProfile,
  AsciiScene,
  AsciiTextMode,
} from '@/lib/ascii/types';
import styles from './AsciiCinematicPlayer.module.css';

type FontStyle = 'normal' | 'italic';

type PaletteEntry = {
  char: string;
  weight: 300 | 500 | 800;
  style: FontStyle;
  brightness: number;
};

type CellStyle = {
  char: string;
  weight: 300 | 500 | 800;
  style: FontStyle;
  alpha: number;
};

const FONT_SIZE = 13;
const LINE_HEIGHT = 14;
const FONT_FAMILY = '"Courier New", "Consolas", monospace';
const CHARSET =
  ' .,:;!+-=*#@%&abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const WEIGHTS: Array<300 | 500 | 800> = [300, 500, 800];
const STYLES: FontStyle[] = ['normal', 'italic'];

const EMITTERS = [
  { cx: 0.14, cy: 0.22, orbitR: 0.12, freq: 0.28, phase: 0, strength: 0.13 },
  { cx: 0.84, cy: 0.3, orbitR: 0.1, freq: 0.36, phase: 1.7, strength: 0.16 },
  { cx: 0.24, cy: 0.78, orbitR: 0.08, freq: 0.33, phase: 2.8, strength: 0.15 },
  { cx: 0.72, cy: 0.74, orbitR: 0.14, freq: 0.26, phase: 4.3, strength: 0.17 },
];

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function escapeHtml(char: string): string {
  if (char === '&') return '&amp;';
  if (char === '<') return '&lt;';
  if (char === '>') return '&gt;';
  if (char === '"') return '&quot;';
  return char;
}

function objectPosition(
  sceneIndex: number,
  sceneProgress: number,
  cols: number,
  rows: number,
  amplitude: number,
  actorMode: AsciiActorMode,
  intensity: number,
): { x: number; y: number } {
  const ease = 0.5 - Math.cos(clamp(sceneProgress, 0, 1) * Math.PI) * 0.5;

  if (actorMode === 'angel') {
    const nx = -0.16 + ease * 1.3;
    const wave = Math.sin(sceneProgress * Math.PI * 2.3 + sceneIndex * 0.58);
    const ny = clamp(0.4 + wave * amplitude * 0.82, 0.14, 0.82);

    return {
      x: nx * cols,
      y: ny * rows,
    };
  }

  if (actorMode === 'dragon') {
    const nx = 1.18 - ease * 1.4;
    const swoop = Math.sin(sceneProgress * Math.PI) * (0.1 + intensity * 0.12);
    const wave = Math.sin(sceneProgress * Math.PI * 4.6 + sceneIndex * 0.44);
    const ny = clamp(0.3 + swoop + wave * amplitude * 1.18, 0.12, 0.88);

    return {
      x: nx * cols,
      y: ny * rows,
    };
  }

  const direction = sceneIndex % 2 === 0 ? 1 : -1;
  const nx = direction === 1 ? -0.18 + ease * 1.36 : 1.18 - ease * 1.36;
  const wave = Math.sin(sceneProgress * Math.PI * 2 + sceneIndex * 0.9);
  const ny = clamp(0.5 + wave * amplitude, 0.18, 0.82);

  return {
    x: nx * cols,
    y: ny * rows,
  };
}

function actorCell(
  actorMode: AsciiActorMode,
  dx: number,
  dy: number,
  sceneProgress: number,
): CellStyle | null {
  if (actorMode === 'angel') {
    const wingPhase = Math.sin(sceneProgress * Math.PI * 6) > 0 ? '~' : '=';
    if (Math.abs(dx) <= 1 && Math.abs(dy) <= 1) {
      return {
        char: dx === 0 && dy === 0 ? 'A' : '*',
        weight: 800,
        style: dy === -1 ? 'italic' : 'normal',
        alpha: 10,
      };
    }
    if (dy === 0 && Math.abs(dx) === 2) {
      return {
        char: wingPhase,
        weight: 500,
        style: 'italic',
        alpha: 9,
      };
    }
    return null;
  }

  if (actorMode === 'dragon') {
    if (Math.abs(dx) <= 2 && Math.abs(dy) <= 1) {
      return {
        char: dx === 0 && dy === 0 ? 'D' : '#',
        weight: 800,
        style: dy === 0 ? 'normal' : 'italic',
        alpha: 10,
      };
    }
    if (dy === -2 && Math.abs(dx) <= 1) {
      return {
        char: '^',
        weight: 500,
        style: 'normal',
        alpha: 9,
      };
    }
    return null;
  }

  if (Math.abs(dx) <= 1 && Math.abs(dy) <= 1) {
    return {
      char: '@',
      weight: 800,
      style: 'normal',
      alpha: 10,
    };
  }

  return null;
}

type TextPlacement = {
  start: number;
  text: string;
  index: number;
};

type AsciiCinematicPlayerProps = {
  scenes?: AsciiScene[];
  summaryLine?: string;
};

export function AsciiCinematicPlayer({
  scenes = defaultAsciiScenes,
  summaryLine,
}: AsciiCinematicPlayerProps) {
  const artRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLParagraphElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const artNode = artRef.current;
    const statsNode = statsRef.current;

    if (!artNode || !statsNode) {
      return;
    }

    const artEl: HTMLDivElement = artNode;
    const statsEl: HTMLDivElement = statsNode;
    const sceneEl = sceneRef.current;
    const progressEl = progressRef.current;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 900;

    const maxCols = isMobile ? 150 : 210;
    const maxRows = isMobile ? 52 : 70;

    const canvas = document.createElement('canvas');
    canvas.width = 30;
    canvas.height = 30;

    const rawContext = canvas.getContext('2d', { willReadFrequently: true });
    if (!rawContext) {
      return;
    }
    const context: CanvasRenderingContext2D = rawContext;

    function estimateBrightness(char: string, font: string): number {
      context.clearRect(0, 0, 30, 30);
      context.font = font;
      context.fillStyle = '#fff';
      context.textBaseline = 'middle';
      context.fillText(char, 2, 15);
      const data = context.getImageData(0, 0, 30, 30).data;
      let sum = 0;
      for (let i = 3; i < data.length; i += 4) {
        sum += data[i] ?? 0;
      }
      return sum / (255 * 900);
    }

    const palette: PaletteEntry[] = [];
    for (const style of STYLES) {
      for (const weight of WEIGHTS) {
        const font = `${style === 'italic' ? 'italic ' : ''}${weight} ${FONT_SIZE}px ${FONT_FAMILY}`;
        for (const char of CHARSET) {
          if (char === ' ') {
            continue;
          }
          palette.push({
            char,
            weight,
            style,
            brightness: estimateBrightness(char, font),
          });
        }
      }
    }

    if (palette.length === 0) {
      return;
    }

    const maxBrightness = Math.max(...palette.map((entry) => entry.brightness));
    if (maxBrightness > 0) {
      for (const entry of palette) {
        entry.brightness /= maxBrightness;
      }
    }

    palette.sort((a, b) => a.brightness - b.brightness);

    function findBest(targetBrightness: number): PaletteEntry {
      let lo = 0;
      let hi = palette.length - 1;

      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if ((palette[mid]?.brightness ?? 0) < targetBrightness) {
          lo = mid + 1;
        } else {
          hi = mid;
        }
      }

      let best = palette[lo] ?? palette[0]!;
      let bestScore = Number.POSITIVE_INFINITY;

      for (let i = Math.max(0, lo - 14); i < Math.min(palette.length, lo + 14); i += 1) {
        const candidate = palette[i];
        if (!candidate) {
          continue;
        }
        const score = Math.abs(candidate.brightness - targetBrightness);
        if (score < bestScore) {
          bestScore = score;
          best = candidate;
        }
      }

      return best;
    }

    const alphaClasses = [
      '',
      styles.a1,
      styles.a2,
      styles.a3,
      styles.a4,
      styles.a5,
      styles.a6,
      styles.a7,
      styles.a8,
      styles.a9,
      styles.a10,
    ];

    const weightClasses: Record<300 | 500 | 800, string> = {
      300: styles.w3,
      500: styles.w5,
      800: styles.w8,
    };

    let cols = 0;
    let rows = 0;
    let density = new Float32Array(1);
    let tempDensity = new Float32Array(1);
    const rowEls: HTMLDivElement[] = [];

    function injectDensity(cx: number, cy: number, spread: number, amount: number): void {
      const ec = cx | 0;
      const er = cy | 0;

      for (let dr = -spread; dr <= spread; dr += 1) {
        for (let dc = -spread; dc <= spread; dc += 1) {
          const rr = er + dr;
          const cc = ec + dc;

          if (rr < 0 || rr >= rows || cc < 0 || cc >= cols) {
            continue;
          }

          const dist = Math.sqrt(dr * dr + dc * dc);
          const influence = Math.max(0, 1 - dist / (spread + 1));
          const index = rr * cols + cc;
          density[index] = Math.min(1, (density[index] ?? 0) + influence * amount);
        }
      }
    }

    function velocity(c: number, r: number, t: number, driftStrength: number): [number, number] {
      const nx = c / Math.max(1, cols - 1);
      const ny = r / Math.max(1, rows - 1);

      const vx =
        (Math.sin(ny * 7 + t * 0.38) * 1.75 +
          Math.cos((nx + ny) * 10.2 + t * 0.47) * 0.88 +
          Math.sin(nx * 22 - ny * 15 + t * 0.68) * 0.34) *
        driftStrength;

      const vy =
        (Math.cos(nx * 6 + t * 0.44) * 1.4 +
          Math.sin((nx - ny) * 12 + t * 0.56) * 0.74 +
          Math.cos(nx * 17 + ny * 21 + t * 0.74) * 0.31) *
        driftStrength;

      return [vx, vy];
    }

    function initGrid(): void {
      cols = clamp(Math.floor(window.innerWidth / 8), 72, maxCols);
      rows = clamp(Math.floor(window.innerHeight / LINE_HEIGHT), 28, maxRows);

      density = new Float32Array(cols * rows);
      tempDensity = new Float32Array(cols * rows);
      artEl.innerHTML = '';
      rowEls.length = 0;

      for (let r = 0; r < rows; r += 1) {
        const row = document.createElement('div');
        row.className = styles.row;
        row.style.height = `${LINE_HEIGHT}px`;
        row.style.lineHeight = `${LINE_HEIGHT}px`;
        artEl.appendChild(row);
        rowEls.push(row);
      }
    }

    function updateSimulation(nowMs: number): {
      objectX: number;
      objectY: number;
      sceneLabel: string;
      sceneProgress: number;
      cycleProgress: number;
      lines: string[];
      actorMode: AsciiActorMode;
      effectProfile: AsciiEffectProfile;
      textMode: AsciiTextMode;
      intensity: number;
    } {
      const snapshot = resolveScene(nowMs, scenes);
      const t = nowMs / 1000;
      const driftStrength =
        snapshot.scene.driftStrength * (0.86 + snapshot.scene.intensity * 0.24);

      for (let r = 0; r < rows; r += 1) {
        for (let c = 0; c < cols; c += 1) {
          const [vx, vy] = velocity(c, r, t, driftStrength);
          const sx = clamp(c - vx, 0, cols - 1.001);
          const sy = clamp(r - vy, 0, rows - 1.001);

          const x0 = sx | 0;
          const y0 = sy | 0;
          const x1 = Math.min(x0 + 1, cols - 1);
          const y1 = Math.min(y0 + 1, rows - 1);

          const fx = sx - x0;
          const fy = sy - y0;
          const index = r * cols + c;

          tempDensity[index] =
            (density[y0 * cols + x0] ?? 0) * (1 - fx) * (1 - fy) +
            (density[y0 * cols + x1] ?? 0) * fx * (1 - fy) +
            (density[y1 * cols + x0] ?? 0) * (1 - fx) * fy +
            (density[y1 * cols + x1] ?? 0) * fx * fy;
        }
      }

      [density, tempDensity] = [tempDensity, density];

      for (let r = 1; r < rows - 1; r += 1) {
        for (let c = 1; c < cols - 1; c += 1) {
          const index = r * cols + c;
          const avg =
            ((density[index - 1] ?? 0) +
              (density[index + 1] ?? 0) +
              (density[index - cols] ?? 0) +
              (density[index + cols] ?? 0)) /
            4;
          tempDensity[index] = (density[index] ?? 0) * 0.91 + avg * 0.09;
        }
      }

      [density, tempDensity] = [tempDensity, density];

      const sceneEnergy = snapshot.scene.emitterBoost * (0.8 + snapshot.scene.intensity * 0.55);
      const emitterSpread =
        snapshot.scene.effectProfile === 'shockwave'
          ? isMobile
            ? 4
            : 6
          : snapshot.scene.effectProfile === 'embers'
            ? isMobile
              ? 4
              : 5
            : isMobile
              ? 3
              : 4;

      for (const emitter of EMITTERS) {
        const ex =
          (emitter.cx + Math.cos(t * emitter.freq + emitter.phase) * emitter.orbitR) * cols;
        const ey =
          (emitter.cy + Math.sin(t * emitter.freq * 0.65 + emitter.phase) * emitter.orbitR) * rows;
        const flicker =
          snapshot.scene.effectProfile === 'embers'
            ? 0.72 + (Math.sin(t * 8 + emitter.phase) + 1) * 0.23
            : 1;

        injectDensity(ex, ey, emitterSpread, emitter.strength * sceneEnergy * flicker);
      }

      const object = objectPosition(
        snapshot.sceneIndex,
        snapshot.sceneProgress,
        cols,
        rows,
        snapshot.scene.objectAmplitude,
        snapshot.scene.actorMode,
        snapshot.scene.intensity,
      );

      if (snapshot.scene.effectProfile === 'shockwave' || snapshot.scene.effectProfile === 'flare') {
        const ringPoints = snapshot.scene.effectProfile === 'shockwave' ? 18 : 14;
        const radius = (0.12 + snapshot.sceneProgress * 0.38) * Math.min(cols, rows);
        const ringPower =
          snapshot.scene.effectProfile === 'shockwave'
            ? 0.11 + snapshot.scene.intensity * 0.13
            : 0.08 + snapshot.scene.intensity * 0.08;

        for (let i = 0; i < ringPoints; i += 1) {
          const angle = (i / ringPoints) * Math.PI * 2 + t * 0.2;
          const ringX = object.x + Math.cos(angle) * radius;
          const ringY = object.y + Math.sin(angle) * radius * 0.45;
          injectDensity(ringX, ringY, isMobile ? 2 : 3, ringPower);
        }
      }

      const actorSpread = snapshot.scene.actorMode === 'dragon' ? (isMobile ? 6 : 7) : isMobile ? 4 : 5;
      const actorPower = (0.3 + snapshot.scene.intensity * 0.3) * snapshot.scene.emitterBoost;
      injectDensity(object.x, object.y, actorSpread, actorPower);

      if (snapshot.scene.actorMode === 'angel') {
        const haloX = object.x + Math.cos(t * 3.8 + snapshot.sceneIndex) * 2.4;
        const haloY = object.y - 1.8;
        injectDensity(haloX, haloY, isMobile ? 3 : 4, 0.18 + snapshot.scene.intensity * 0.14);
      }

      if (snapshot.scene.actorMode === 'dragon') {
        const segments = isMobile ? 5 : 7;
        const direction = object.x > cols * 0.5 ? -1 : 1;

        for (let i = 0; i < segments; i += 1) {
          const sprayX = object.x + direction * (i + 1) * 2.1;
          const sprayY =
            object.y + Math.sin(t * 9.4 + i * 0.7) * (0.45 + snapshot.scene.intensity * 0.8);
          const sprayPower = Math.max(0.04, (0.23 - i * 0.025) * snapshot.scene.intensity);
          injectDensity(sprayX, sprayY, isMobile ? 3 : 4, sprayPower);
        }
      }

      for (let i = 0; i < density.length; i += 1) {
        const decay = snapshot.scene.effectProfile === 'shockwave' ? 0.989 : 0.986;
        density[i] = (density[i] ?? 0) * decay;
      }

      return {
        objectX: object.x,
        objectY: object.y,
        sceneLabel: snapshot.scene.label,
        sceneProgress: snapshot.sceneProgress,
        cycleProgress: snapshot.cycleProgress,
        lines: snapshot.scene.lines,
        actorMode: snapshot.scene.actorMode,
        effectProfile: snapshot.scene.effectProfile,
        textMode: snapshot.scene.textMode,
        intensity: snapshot.scene.intensity,
      };
    }

    function renderFrame(
      nowMs: number,
      fps: number,
      objectX: number,
      objectY: number,
      sceneLabel: string,
      sceneProgress: number,
      cycleProgress: number,
      lines: string[],
      actorMode: AsciiActorMode,
      effectProfile: AsciiEffectProfile,
      textMode: AsciiTextMode,
      intensity: number,
    ): void {
      const frameLeft = Math.floor(cols * 0.08);
      const frameRight = Math.floor(cols * 0.92);
      const frameTop = Math.floor(rows * 0.16);
      const frameBottom = Math.floor(rows * 0.86);
      const lineStartRow = Math.floor((frameTop + frameBottom) / 2) - Math.floor(lines.length);

      const placements = new Map<number, TextPlacement>();
      const sprayPhase = nowMs / 170;

      for (let index = 0; index < lines.length; index += 1) {
        const line = lines[index] ?? '';
        if (!line) {
          continue;
        }

        let laneLeft = frameLeft + 2;
        let laneRight = frameRight - 2;

        if (textMode === 'obstacle-flow') {
          if (objectX < cols * 0.5) {
            laneLeft = Math.max(frameLeft + 2, Math.floor(cols * 0.52));
          } else {
            laneRight = Math.min(frameRight - 2, Math.floor(cols * 0.48));
          }
        }

        const laneWidth = Math.max(10, laneRight - laneLeft + 1);
        const visibleLine = line.length > laneWidth ? line.slice(0, laneWidth) : line;

        let row = lineStartRow + index * 2;
        let start = laneLeft + Math.floor((laneWidth - visibleLine.length) / 2);

        if (textMode === 'spray') {
          const jitterRow = Math.round(Math.sin(sprayPhase + index * 1.6) * (1 + intensity * 2));
          const jitterCol = Math.round(Math.cos(sprayPhase * 1.18 + index * 2.2) * (2 + intensity * 8));
          row = frameTop + 3 + index * 4 + jitterRow;
          start += jitterCol;
        }

        row = clamp(row, frameTop + 2, frameBottom - 2);
        start = clamp(start, frameLeft + 1, Math.max(frameLeft + 1, frameRight - visibleLine.length));

        while (placements.has(row) && row < frameBottom - 2) {
          row += 1;
        }

        placements.set(row, {
          start,
          text: visibleLine,
          index,
        });
      }

      const fracturedFrame = effectProfile === 'shockwave' && sceneProgress > 0.24;
      const radiantFrame = effectProfile === 'flare' || (effectProfile === 'embers' && intensity > 0.76);

      for (let r = 0; r < rows; r += 1) {
        let html = '';

        for (let c = 0; c < cols; c += 1) {
          let cell: CellStyle | null = null;

          const onTop = r === frameTop && c >= frameLeft && c <= frameRight;
          const onBottom = r === frameBottom && c >= frameLeft && c <= frameRight;
          const onLeft = c === frameLeft && r >= frameTop && r <= frameBottom;
          const onRight = c === frameRight && r >= frameTop && r <= frameBottom;

          if (onTop || onBottom || onLeft || onRight) {
            let frameChar = '-';
            if ((r === frameTop || r === frameBottom) && (c === frameLeft || c === frameRight)) {
              frameChar = '+';
            } else if (c === frameLeft || c === frameRight) {
              frameChar = '|';
            }

            if (fracturedFrame && frameChar !== '+') {
              const crack = (Math.floor(nowMs / 42) + r * 2 + c * 3) % 17 === 0;
              if (crack) {
                frameChar = '.';
              }
            }

            if (radiantFrame && (r === frameTop || r === frameBottom) && c % 7 === 0) {
              frameChar = '*';
            }

            cell = {
              char: frameChar,
              weight: 800,
              style: 'normal',
              alpha: 10,
            };
          }

          const placement = placements.get(r);
          if (!cell && placement) {
            const rel = c - placement.start;
            if (rel >= 0 && rel < placement.text.length) {
              const char = placement.text[rel] ?? ' ';
              const emphasis = textMode === 'spray' || effectProfile === 'shockwave';
              cell = {
                char,
                weight: placement.index === 0 || emphasis ? 800 : 500,
                style:
                  placement.index === 2 || (textMode === 'spray' && placement.index === 1)
                    ? 'italic'
                    : 'normal',
                alpha: placement.index === 0 ? 10 : emphasis ? 10 : 9,
              };
            }
          }

          if (!cell) {
            const actor = actorCell(actorMode, c - objectX, r - objectY, sceneProgress);
            if (actor) {
              cell = actor;
            }
          }

          if (!cell) {
            const b = density[r * cols + c] ?? 0;
            if (b < 0.024) {
              html += ' ';
              continue;
            }

            const matched = findBest(b);
            cell = {
              char: matched.char,
              weight: matched.weight,
              style: matched.style,
              alpha: clamp(Math.round(b * 10), 1, 10),
            };
          }

          if (cell.char === ' ') {
            html += ' ';
            continue;
          }

          const weightClass = weightClasses[cell.weight];
          const italicClass = cell.style === 'italic' ? ` ${styles.it}` : '';
          const alphaClass = alphaClasses[cell.alpha] ?? styles.a10;

          html += `<span class="${weightClass}${italicClass} ${alphaClass}">${escapeHtml(cell.char)}</span>`;
        }

        const row = rowEls[r];
        if (row) {
          row.innerHTML = html;
        }
      }

      if (sceneEl) {
        sceneEl.textContent = `${sceneLabel} :: ${actorMode.toUpperCase()} :: ${textMode.toUpperCase()}`;
      }

      if (progressEl) {
        progressEl.style.width = `${Math.round(sceneProgress * 100)}%`;
      }

      statsEl.textContent = `${cols}x${rows} | ${effectProfile} | cycle ${Math.round(cycleProgress * 100)}% | ${fps} fps`;
    }

    initGrid();

    if (reducedMotion) {
      const snapshot = resolveScene(0, scenes);
      for (let i = 0; i < 18; i += 1) {
        updateSimulation(i * 30);
      }
      const object = objectPosition(
        0,
        0.35,
        cols,
        rows,
        snapshot.scene.objectAmplitude,
        snapshot.scene.actorMode,
        snapshot.scene.intensity,
      );
      renderFrame(
        0,
        0,
        object.x,
        object.y,
        snapshot.scene.label,
        0,
        0,
        snapshot.scene.lines,
        snapshot.scene.actorMode,
        snapshot.scene.effectProfile,
        snapshot.scene.textMode,
        snapshot.scene.intensity,
      );
      statsEl.textContent = `${cols}x${rows} | reduced motion mode`;
      return;
    }

    let frameCount = 0;
    let lastFpsStamp = 0;
    let shownFps = 0;
    let lastTick = 0;
    let rafId = 0;
    let resizeTimer = 0;

    const frameInterval = isMobile ? 1000 / 34 : 1000 / 48;

    const onResize = () => {
      if (resizeTimer) {
        window.clearTimeout(resizeTimer);
      }

      resizeTimer = window.setTimeout(() => {
        initGrid();
      }, 150);
    };

    window.addEventListener('resize', onResize);

    const render = (now: number) => {
      if (now - lastTick < frameInterval) {
        rafId = window.requestAnimationFrame(render);
        return;
      }

      lastTick = now;
      const state = updateSimulation(now);
      frameCount += 1;

      if (now - lastFpsStamp > 500) {
        shownFps = Math.round(frameCount / ((now - lastFpsStamp) / 1000));
        frameCount = 0;
        lastFpsStamp = now;
      }

      renderFrame(
        now,
        shownFps,
        state.objectX,
        state.objectY,
        state.sceneLabel,
        state.sceneProgress,
        state.cycleProgress,
        state.lines,
        state.actorMode,
        state.effectProfile,
        state.textMode,
        state.intensity,
      );

      rafId = window.requestAnimationFrame(render);
    };

    rafId = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      if (resizeTimer) {
        window.clearTimeout(resizeTimer);
      }
    };
  }, [scenes]);

  return (
    <div className={styles.cinematicRoot}>
      <div ref={artRef} className={styles.art} aria-hidden='true' />

      <div className={styles.hud} aria-hidden='true'>
        <p ref={sceneRef} className={styles.sceneLabel} />
        <div className={styles.progressTrack}>
          <div ref={progressRef} className={styles.progressFill} />
        </div>
      </div>

      <div ref={statsRef} className={styles.stats} aria-hidden='true' />

      <div className={styles.srOnly}>
        {summaryLine ??
          'ASCII cinematic portfolio mode is running in passive autoplay scenes that cycle through profile, capabilities, work focus, and contact information.'}
      </div>
    </div>
  );
}
