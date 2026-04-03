'use client';

import { useEffect, useRef } from 'react';

type FontStyle = 'normal' | 'italic';

type PaletteEntry = {
  char: string;
  weight: 300 | 500 | 800;
  style: FontStyle;
  width: number;
  brightness: number;
};

const FONT_SIZE = 14;
const LINE_HEIGHT = 17;
const PROP_FAMILY = '"Cormorant Garamond", Georgia, "Times New Roman", serif';
const CHARSET =
  ' .,:;!+-=*#@%&abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const WEIGHTS: Array<300 | 500 | 800> = [300, 500, 800];
const FONT_STYLES: FontStyle[] = ['normal', 'italic'];

function escapeHtml(char: string): string {
  if (char === '&') return '&amp;';
  if (char === '<') return '&lt;';
  if (char === '>') return '&gt;';
  if (char === '"') return '&quot;';
  return char;
}

function weightClass(weight: 300 | 500 | 800, style: FontStyle): string {
  const wClass = weight === 300 ? 'w3' : weight === 500 ? 'w5' : 'w8';
  return style === 'italic' ? `${wClass} it` : wClass;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function FluidAsciiSmoke() {
  const artRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const artNode = artRef.current;
    const statsNode = statsRef.current;

    if (!artNode || !statsNode) {
      return;
    }

    const artEl: HTMLDivElement = artNode;
    const statsEl: HTMLDivElement = statsNode;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 900;

    const maxCols = isMobile ? 130 : 190;
    const maxRows = isMobile ? 55 : 78;
    const bCanvas = document.createElement('canvas');
    bCanvas.width = 30;
    bCanvas.height = 30;

    const brightnessContext = bCanvas.getContext('2d', { willReadFrequently: true });
    if (!brightnessContext) {
      return;
    }
    const bCtx: CanvasRenderingContext2D = brightnessContext;

    function estimateBrightness(ch: string, font: string): number {
      bCtx.clearRect(0, 0, 30, 30);
      bCtx.font = font;
      bCtx.fillStyle = '#fff';
      bCtx.textBaseline = 'middle';
      bCtx.fillText(ch, 1, 15);
      const data = bCtx.getImageData(0, 0, 30, 30).data;
      let sum = 0;
      for (let i = 3; i < data.length; i += 4) {
        sum += data[i] ?? 0;
      }
      return sum / (255 * 900);
    }

    const palette: PaletteEntry[] = [];
    for (const style of FONT_STYLES) {
      for (const weight of WEIGHTS) {
        const font = `${style === 'italic' ? 'italic ' : ''}${weight} ${FONT_SIZE}px ${PROP_FAMILY}`;
        bCtx.font = font;
        for (const ch of CHARSET) {
          if (ch === ' ') {
            continue;
          }
          const width = bCtx.measureText(ch).width;
          if (width <= 0) {
            continue;
          }
          palette.push({
            char: ch,
            weight,
            style,
            width,
            brightness: estimateBrightness(ch, font),
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

    const avgCharW =
      palette.reduce((sum, entry) => sum + entry.width, 0) /
      Math.max(1, palette.length);
    const aspect = avgCharW / LINE_HEIGHT;
    const aspect2 = aspect * aspect;
    const spaceW = FONT_SIZE * 0.27;

    function findBest(targetBrightness: number, targetWidth: number): PaletteEntry {
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

      let best = palette[lo] ?? palette[0];
      let bestScore = Number.POSITIVE_INFINITY;

      for (let i = Math.max(0, lo - 16); i < Math.min(palette.length, lo + 16); i += 1) {
        const candidate = palette[i];
        if (!candidate) {
          continue;
        }
        const brightnessDelta = Math.abs(candidate.brightness - targetBrightness) * 2.6;
        const widthDelta = Math.abs(candidate.width - targetWidth) / Math.max(1, targetWidth);
        const score = brightnessDelta + widthDelta;

        if (score < bestScore) {
          bestScore = score;
          best = candidate;
        }
      }

      return best;
    }

    let cols = 0;
    let rows = 0;
    let density = new Float32Array(1);
    let tempDensity = new Float32Array(1);
    const rowEls: HTMLDivElement[] = [];

    const emitters = [
      { cx: 0.25, cy: 0.4, orbitR: 0.14, freq: 0.3, phase: 0, strength: 0.17 },
      { cx: 0.7, cy: 0.35, orbitR: 0.1, freq: 0.25, phase: 2.1, strength: 0.14 },
      { cx: 0.45, cy: 0.65, orbitR: 0.16, freq: 0.35, phase: 4.2, strength: 0.2 },
      { cx: 0.8, cy: 0.6, orbitR: 0.08, freq: 0.4, phase: 1, strength: 0.12 },
    ];

    function getVelocity(c: number, r: number, t: number): [number, number] {
      const nx = c / Math.max(1, cols);
      const ny = r / Math.max(1, rows);

      const vx =
        Math.sin(ny * 6.28 + t * 0.3) * 2 +
        Math.cos((nx + ny) * 12.5 + t * 0.55) * 0.7 +
        Math.sin(nx * 25 + ny * 18 + t * 0.8) * 0.25;

      let vy =
        Math.cos(nx * 5 + t * 0.4) * 1.5 +
        Math.sin((nx - ny) * 10 + t * 0.4) * 0.8 +
        Math.cos(nx * 18 - ny * 25 + t * 0.7) * 0.25;

      vy *= aspect;
      return [vx, vy];
    }

    function updateSimulation(t: number): void {
      for (let r = 0; r < rows; r += 1) {
        for (let c = 0; c < cols; c += 1) {
          const [vx, vy] = getVelocity(c, r, t);
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
              ((density[index - cols] ?? 0) + (density[index + cols] ?? 0)) * aspect2) /
            (2 + 2 * aspect2);
          tempDensity[index] = (density[index] ?? 0) * 0.92 + avg * 0.08;
        }
      }

      [density, tempDensity] = [tempDensity, density];

      const spread = isMobile ? 3 : 4;
      for (const emitter of emitters) {
        const ex = (emitter.cx + Math.cos(t * emitter.freq + emitter.phase) * emitter.orbitR) * cols;
        const ey =
          (emitter.cy +
            Math.sin(t * emitter.freq * 0.7 + emitter.phase) * emitter.orbitR * 0.8) *
          rows;

        const ec = ex | 0;
        const er = ey | 0;

        for (let dr = -spread; dr <= spread; dr += 1) {
          for (let dc = -spread; dc <= spread; dc += 1) {
            const rr = er + dr;
            const cc = ec + dc;
            if (rr < 0 || rr >= rows || cc < 0 || cc >= cols) {
              continue;
            }

            const drScaled = dr / Math.max(0.001, aspect);
            const dist = Math.sqrt(drScaled * drScaled + dc * dc);
            const contribution = Math.max(0, 1 - dist / (spread + 1));
            const i = rr * cols + cc;
            density[i] = Math.min(1, (density[i] ?? 0) + contribution * emitter.strength);
          }
        }
      }

      for (let i = 0; i < cols * rows; i += 1) {
        density[i] = (density[i] ?? 0) * 0.984;
      }
    }

    function initGrid(): void {
      cols = clamp(Math.floor(window.innerWidth / avgCharW), 56, maxCols);
      rows = clamp(Math.floor(window.innerHeight / LINE_HEIGHT), 26, maxRows);

      density = new Float32Array(cols * rows);
      tempDensity = new Float32Array(cols * rows);
      artEl.innerHTML = '';
      rowEls.length = 0;

      for (let r = 0; r < rows; r += 1) {
        const row = document.createElement('div');
        row.className = 'fluid-row';
        row.style.height = `${LINE_HEIGHT}px`;
        row.style.lineHeight = `${LINE_HEIGHT}px`;
        artEl.appendChild(row);
        rowEls.push(row);
      }
    }

    function renderStaticFrame(): void {
      const targetCellWidth = window.innerWidth / Math.max(1, cols);

      for (let r = 0; r < rows; r += 1) {
        let html = '';
        for (let c = 0; c < cols; c += 1) {
          const nx = c / Math.max(1, cols - 1);
          const ny = r / Math.max(1, rows - 1);
          const wave = Math.sin(nx * 8.2 + ny * 5.8) * 0.24 + Math.cos(nx * 3.9 - ny * 7.1) * 0.22;
          const radial = 1 - Math.sqrt((nx - 0.5) ** 2 + (ny - 0.45) ** 2) * 1.45;
          const b = clamp(radial + wave, 0, 1);

          if (b < 0.03) {
            html += ' ';
          } else {
            const match = findBest(b, targetCellWidth);
            const alphaIndex = clamp(Math.round(b * 10), 1, 10);
            html += `<span class="${weightClass(match.weight, match.style)} a${alphaIndex}">${escapeHtml(
              match.char,
            )}</span>`;
          }
        }

        const rowEl = rowEls[r];
        if (rowEl) {
          rowEl.innerHTML = html;
        }
      }

      statsEl.textContent = `${cols}x${rows} | static mode`;
    }

    initGrid();

    if (reducedMotion) {
      renderStaticFrame();
      const onResizeStatic = () => {
        initGrid();
        renderStaticFrame();
      };
      window.addEventListener('resize', onResizeStatic);
      return () => {
        window.removeEventListener('resize', onResizeStatic);
      };
    }

    let frameCount = 0;
    let lastFpsStamp = 0;
    let shownFps = 0;
    let rafId = 0;
    let lastTick = 0;
    let resizeTimer = 0;
    const frameInterval = isMobile ? 1000 / 40 : 1000 / 54;

    const onResize = () => {
      if (resizeTimer) {
        window.clearTimeout(resizeTimer);
      }
      resizeTimer = window.setTimeout(() => {
        initGrid();
      }, 140);
    };

    window.addEventListener('resize', onResize);

    const render = (now: number) => {
      if (now - lastTick < frameInterval) {
        rafId = window.requestAnimationFrame(render);
        return;
      }
      lastTick = now;

      const t = now / 1000;
      updateSimulation(t);

      const targetCellWidth = window.innerWidth / Math.max(1, cols);
      const rowWidths: number[] = [];

      for (let r = 0; r < rows; r += 1) {
        let html = '';
        let measuredWidth = 0;

        for (let c = 0; c < cols; c += 1) {
          const b = density[r * cols + c] ?? 0;
          if (b < 0.024) {
            html += ' ';
            measuredWidth += spaceW;
            continue;
          }

          const match = findBest(b, targetCellWidth);
          const alphaIndex = clamp(Math.round(b * 10), 1, 10);
          html += `<span class="${weightClass(match.weight, match.style)} a${alphaIndex}">${escapeHtml(
            match.char,
          )}</span>`;
          measuredWidth += match.width;
        }

        const rowEl = rowEls[r];
        if (rowEl) {
          rowEl.innerHTML = html;
        }
        rowWidths.push(measuredWidth);
      }

      const maxRowWidth = rowWidths.length > 0 ? Math.max(...rowWidths) : 0;
      const blockOffset = Math.max(0, (window.innerWidth - maxRowWidth) / 2);

      for (let r = 0; r < rows; r += 1) {
        const rowEl = rowEls[r];
        if (rowEl) {
          const rowWidth = rowWidths[r] ?? 0;
          rowEl.style.paddingLeft = `${blockOffset + (maxRowWidth - rowWidth) / 2}px`;
        }
      }

      frameCount += 1;
      if (now - lastFpsStamp > 500) {
        shownFps = Math.round(frameCount / ((now - lastFpsStamp) / 1000));
        frameCount = 0;
        lastFpsStamp = now;
        statsEl.textContent = `${cols}x${rows} | ${palette.length} variants | ${shownFps} fps`;
      }

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
  }, []);

  return (
    <div aria-hidden='true' className='fluid-layer'>
      <div ref={artRef} className='fluid-art' />
      <div ref={statsRef} className='fluid-stats' />
    </div>
  );
}
