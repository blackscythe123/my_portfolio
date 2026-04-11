---
name: pretext
description: >-
  Help developers use @chenglou/pretext, the 15KB TypeScript text measurement library that computes
  exact text metrics without DOM reflows. Use when user mentions pretext, @chenglou/pretext,
  text measurement, text layout without DOM, text reflow, text around obstacles, auto-fit font size,
  layoutNextLine, or asks to measure text height/width in JavaScript without triggering browser reflow.
  Covers API usage, integration patterns, creative demos (ASCII art, obstacle-aware flow, masonry),
  and critical gotchas. Do NOT use for CSS-only text layout questions or general typography.
metadata:
  author: Yaniv Golan
  version: "0.1.0"
  license: MIT
---

# Pretext Integration Guide

You are helping a developer use **@chenglou/pretext** — a 15KB TypeScript library by Cheng Lou that computes exact text metrics using pure math (no DOM reflows). It uses `CanvasRenderingContext2D.measureText` internally, segments text, measures once, caches, then does arithmetic for all subsequent layouts.

## When Pretext Is the Right Tool

Use Pretext when the developer needs to:
- **Know text dimensions before rendering** — virtual scrolling, masonry layouts, card height estimation
- **Auto-fit text to a container** — find the largest font size that keeps text within N lines (CSS has no equivalent)
- **Flow text around obstacles** — magazine-style layouts where text wraps around shapes, images, or interactive elements
- **Measure text in canvas/SVG/WebGL** — Pretext's measurements are exact for `fillText`
- **Measure many text items fast** — each `layout()` call is ~0.0002ms after the first `prepare()` per font

## When NOT to Use Pretext

- **CSS float/flex already handles it** — don't reimplement text flow that CSS does natively
- **Content is HTML, not plain text** — Pretext measures plain text strings. Tables, code blocks, nested elements need DOM measurement
- **TanStack Virtual + Pretext height estimation** — this integration is fragile. Height errors compound over many items, and `measureElement` correction loops cause desyncing. For <500 items, just render all and use CSS transitions. For 1000+, use Pretext estimates as seeds but rely on DOM correction
- **Accordion content height** — if content has HTML structure, use off-screen DOM measurement (`visibility: hidden; position: absolute`)

## Quick Start

```bash
npm install @chenglou/pretext
```

```js
import { prepare, layout } from '@chenglou/pretext';

// 1. Prepare a text+font pair (measures & caches internally)
const prepared = prepare('Hello world', '16px Inter');

// 2. Layout at any width — returns height and line count
const result = layout(prepared, 400, 24); // maxWidth=400, lineHeight=24px
// → { lineCount: 1, height: 24 }

// Reuse for different widths (instant — pure arithmetic)
const narrow = layout(prepared, 120, 24); // → more lines, taller
```

## Critical Gotchas

These are the bugs that will waste your time if you don't know about them. Read this section before writing any Pretext code.

### 1. lineHeight Must Be in Absolute Pixels

`layout()` expects lineHeight in **CSS pixels**, not a multiplier. This is the #1 integration bug.

```js
// WRONG — will compute heights ~14x too small (silent error)
layout(prepared, 500, 1.5);

// CORRECT — convert multiplier to pixels
const fontSize = 14;
const lineHeightPx = fontSize * 1.5; // = 21
layout(prepared, 500, lineHeightPx);
```

The error is silent — Pretext happily computes with `lineHeight: 1.5` pixels, producing plausible-looking `lineCount` values but tiny `height` values.

### 2. prepare() Takes Text First, Font Second

```js
// WRONG — arguments swapped
prepare('16px Georgia', 'Hello world');

// CORRECT
prepare('Hello world', '16px Georgia');
```

### 3. Each Text+Font Pair Needs Its Own prepare()

You cannot cache a single `prepare()` token and reuse it for different text. The library caches segment metrics per font string internally, so repeated calls with the same font are fast.

### 4. Fonts Must Be Loaded First

Pretext measures using currently loaded fonts. If you measure before web fonts load, you get fallback font metrics. Either await `document.fonts.ready` or accept slight inaccuracy.

### 5. system-ui Is Unreliable

On macOS, Canvas resolves `system-ui` to a different optical variant than DOM rendering. Use explicit font names for guaranteed accuracy.

### 6. No Canvas = No Pretext

Pretext requires `CanvasRenderingContext2D.measureText`. It works in all browsers and `OffscreenCanvas` workers, but NOT in Node.js without `node-canvas`.

### 7. Border in Height Estimates

When computing DOM element heights, don't forget `border-width`. A 1px border adds 2px total (top + bottom). Easy to miss, causes cumulative drift in layouts.

## Which API Do I Need?

Start here. Match the developer's goal to the right API path — this avoids the most common mistake (using `prepare` when `prepareWithSegments` is needed, or vice versa).

| Developer wants to... | prepare variant | layout function |
|---|---|---|
| Get text height/line count at a given width | `prepare` | `layout` |
| Auto-fit font size (binary search over sizes) | `prepare` (in a loop) | `layout` |
| Auto-height a textarea | `prepare` with `{ whiteSpace: 'pre-wrap' }` | `layout` |
| Get per-line text content (render, animate) | `prepareWithSegments` | `layoutWithLines` |
| Find widest line (shrink-wrap containers) | `prepareWithSegments` | `walkLineRanges` |
| Flow text around obstacles (variable width/line) | `prepareWithSegments` | `layoutNextLine` in a loop |

**The key decision is `prepare` vs `prepareWithSegments`:**
- `prepare` → only gives you `layout()` (height + line count). Fastest path.
- `prepareWithSegments` → gives you ALL layout functions including `layout()`. Use this the moment you need per-line data or variable widths. There is no reason to call both for the same text.

Common API selection mistakes:
- Using `prepare` then calling `layoutWithLines` → crashes at runtime (no `.segments`)
- Using `layoutWithLines` when only widths are needed → `walkLineRanges` is cheaper (no string allocation)
- Using `layoutWithLines` when width varies per line → must use `layoutNextLine` instead
- Re-calling `prepare` on container resize → just call `layout` again with the new width (it's pure arithmetic)

For full signatures, types, and examples, see the [API Reference](references/api.md).

## Integration Patterns

For detailed code examples of each pattern, see [Patterns Reference](references/patterns.md). Here's when to reach for each:

### Wrapper Module (Recommended First Step)
Create a thin wrapper that converts lineHeight from CSS multiplier to pixels and returns `null` on failure. This prevents the critical lineHeight bug and enables progressive enhancement.

### Auto-Fit Font Size
Binary search for the largest font that keeps text within N lines. **This is Pretext's killer feature** — CSS has no equivalent. Use for hero headlines, card titles, quote displays.

### Height Estimation for Card Layouts
Measure variable text parts with Pretext, add fixed parts (padding, border, gaps) manually. Good for simple cards. Remember: this is inherently approximate — don't use for pixel-perfect virtualization.

### Text Around Obstacles (layoutNextLine)
The creative powerhouse. Feed a different `maxWidth` per line based on obstacle position. This enables magazine layouts, text flowing around images, and all the impressive community demos.

### Progressive Enhancement
Always load Pretext as enhancement — the page should work without it. Use `type="module"` as a natural feature gate.

### Vendoring (No Build Step)
If you don't use a bundler, bundle Pretext into a single ESM file with esbuild first. It ships as multiple ES modules with relative imports that won't work standalone.

## Creative Demos & Advanced Patterns

The [Patterns Reference](references/patterns.md) also covers creative patterns from the community:

- **Fluid ASCII art** — full-screen fluid sim rendered as proportional ASCII characters
- **3D wireframe text** — torus/sphere drawn through a character grid
- **Text-based games** — brick-breaker built entirely with Pretext text
- **Splat editor** — text wrapping around 3D objects in real time
- **Dragon text reflow** — text flowing around a moving 80-segment dragon
- **Accessible editorial engine** — WCAG-compliant magazine layout

All use the same core API (`prepare` + `layout` / `layoutNextLine`) — the difference is how creatively you use obstacle-aware line routing and per-frame reflow.

## Performance Notes

- First `prepare()` per font: ~1-5ms (measures character segments)
- Subsequent `prepare()` with same font: fast (cached segments)
- Each `layout()` call: ~0.0002ms (pure arithmetic)
- 500 texts: ~19ms prepare, ~0.09ms layout
- Safe to call in `requestAnimationFrame`, scroll handlers, workers

## Key Resources

- GitHub: https://github.com/chenglou/pretext
- Official demos: https://chenglou.me/pretext/
- Community showcase (70+ projects): https://pretextwall.xyz/
- Curated collection: https://www.pretext.cool/
