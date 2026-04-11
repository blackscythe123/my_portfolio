# Pretext Integration & Creative Patterns

Proven patterns for using Pretext in real projects, from simple measurement to creative demos.

## Table of Contents

1. [Wrapper Module](#wrapper-module)
2. [Auto-Fit Font Size](#auto-fit-font-size)
3. [Height Estimation for Cards](#height-estimation-for-cards)
4. [Text Around Obstacles](#text-around-obstacles)
5. [Progressive Enhancement](#progressive-enhancement)
6. [Vendoring Without a Bundler](#vendoring-without-a-bundler)
7. [Animation Patterns](#animation-patterns)
8. [Creative Demo Patterns](#creative-demo-patterns)

---

## Wrapper Module

Create this first. It prevents the lineHeight bug and enables graceful fallback.

```js
import { prepare, layout } from '@chenglou/pretext';

/**
 * Measure text dimensions. Returns null on failure for graceful fallback.
 * @param {string} text - The text to measure
 * @param {string} fontFamily - CSS font-family (without size), e.g. "Georgia, serif"
 * @param {number} fontSize - Font size in px
 * @param {number} maxWidth - Container width in px
 * @param {number} [lineHeight=1.5] - CSS line-height MULTIPLIER (not pixels!)
 * @returns {{ width: number, height: number, lines: number } | null}
 */
export function measureText(text, fontFamily, fontSize, maxWidth, lineHeight) {
  lineHeight = lineHeight || 1.5;
  const lineHeightPx = fontSize * lineHeight; // Convert to absolute px
  const cssFont = fontSize + 'px ' + fontFamily;
  try {
    const prepared = prepare(text, cssFont);
    const result = layout(prepared, maxWidth, lineHeightPx);
    return { width: maxWidth, height: result.height, lines: result.lineCount };
  } catch (e) {
    return null;
  }
}
```

The wrapper does two things: converts lineHeight from the CSS multiplier developers think in to the absolute pixels Pretext expects, and returns `null` on failure so callers can implement progressive enhancement.

---

## Auto-Fit Font Size

Binary search for the largest font size that keeps text within N lines. CSS has no equivalent — this is Pretext's killer feature.

```js
/**
 * Find the largest font size that keeps text within targetMaxLines.
 * @param {string} text
 * @param {string} fontFamily - e.g. "Georgia, serif"
 * @param {number} maxWidth - container width in px
 * @param {number} [lineHeight=1.5] - CSS multiplier
 * @param {number} [targetMaxLines=3]
 * @param {number} [minFont=14]
 * @param {number} [maxFont=34]
 * @returns {number | null} - best font size in px, or null on failure
 */
function autoFitFontSize(text, fontFamily, maxWidth, lineHeight, targetMaxLines, minFont, maxFont) {
  minFont = minFont || 14;
  maxFont = maxFont || 34;
  targetMaxLines = targetMaxLines || 3;
  lineHeight = lineHeight || 1.5;
  let lo = minFont, hi = maxFont, bestSize = minFont;

  for (let i = 0; i < 20; i++) {
    const mid = (lo + hi) / 2;
    const result = measureText(text, fontFamily, mid, maxWidth, lineHeight);
    if (!result) return null;

    if (result.lines <= targetMaxLines) {
      bestSize = mid;
      lo = mid;
    } else {
      hi = mid;
    }
  }
  return Math.round(bestSize * 10) / 10;
}
```

**Tuning tips:**
- `maxFont: 34` works well for serif body text in ~500px containers
- Above 40px looks comically large for most content
- Below 14px defeats the purpose
- `targetMaxLines: 3` is a good default for headlines
- Short text (<10 words) may hit maxFont and still be 1 line — that's fine
- 20 iterations gives sub-pixel precision; 10 is usually enough

**Use cases:** Hero headlines, card titles, quote displays, anywhere text length varies but visual block size should feel consistent.

---

## Height Estimation for Cards

Measure variable text with Pretext, sum fixed parts manually.

```js
function estimateCardHeight(cardData, containerWidth) {
  const PADDING_Y = 16 + 16;   // top + bottom padding
  const BORDER_Y = 1 + 1;      // top + bottom border (EASY TO FORGET)
  const GAP = 8;                // margin between internal elements
  const innerWidth = containerWidth - 36; // subtract horizontal padding

  // Variable part: measure with Pretext
  const textHeight = measureText(cardData.text, 'Georgia, serif', 14, innerWidth, 1.5);
  if (!textHeight) return null;

  // Fixed parts
  const headerHeight = 24;
  const footerHeight = cardData.hasFooter ? 28 : 0;

  return PADDING_Y + BORDER_Y + headerHeight + GAP + textHeight.height + GAP + footerHeight;
}
```

**Important caveats:**
- This is inherently approximate — wrapping content (tags, multi-line metadata) adds uncertainty
- Don't use for pixel-perfect virtualization of hundreds of items
- Works well for ~100 items where small errors don't compound visibly
- Always account for `border-width` — it's the most commonly forgotten component

---

## Text Around Obstacles

The creative powerhouse of Pretext. Use `layoutNextLine()` with a different `maxWidth` per line based on obstacle geometry.

### Basic Circle Obstacle

```js
import { prepareWithSegments, layoutNextLine } from '@chenglou/pretext';

function layoutAroundCircle(text, font, containerWidth, lineHeight, circle) {
  const prepared = prepareWithSegments(text, font);
  let cursor = { segmentIndex: 0, graphemeIndex: 0 };
  const lines = [];
  let y = 0;

  while (true) {
    // Calculate how much width the circle eats at this Y position
    const dy = y + lineHeight / 2 - circle.y; // distance from line center to circle center
    let availableWidth = containerWidth;

    if (Math.abs(dy) < circle.radius) {
      // Line intersects the circle — reduce available width
      const chordHalf = Math.sqrt(circle.radius * circle.radius - dy * dy);
      // Assuming circle is on the right side
      availableWidth = Math.max(50, circle.x - chordHalf);
    }

    const line = layoutNextLine(prepared, cursor, availableWidth);
    if (!line) break;

    lines.push({ text: line.text, width: line.width, y, maxWidth: availableWidth });
    cursor = line.end;
    y += lineHeight;
  }

  return lines;
}
```

### Animated Obstacle (60fps Reflow)

```js
function animate(timestamp) {
  // Move the obstacle
  circle.x = 300 + Math.sin(timestamp / 1000) * 100;
  circle.y = 200 + Math.cos(timestamp / 1000) * 80;

  // Re-layout text around new obstacle position
  // layout() is ~0.0002ms — safe to call every frame
  const lines = layoutAroundCircle(text, font, width, lineHeight, circle);
  renderLines(lines);

  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
```

### Multiple Obstacles

```js
function getAvailableWidth(y, lineHeight, obstacles, containerWidth) {
  let width = containerWidth;
  for (const obs of obstacles) {
    const dy = y + lineHeight / 2 - obs.y;
    if (Math.abs(dy) < obs.radius) {
      const chordHalf = Math.sqrt(obs.radius * obs.radius - dy * dy);
      // Adjust width based on obstacle position
      if (obs.side === 'right') {
        width = Math.min(width, obs.x - chordHalf);
      } else {
        // Left-side obstacle: shift start position
        // (would need to offset the text rendering, not just reduce width)
      }
    }
  }
  return Math.max(50, width);
}
```

---

## Progressive Enhancement

Always load Pretext as enhancement — the page should work without it.

```html
<!-- Base functionality (no Pretext needed) -->
<script src="app.js"></script>

<!-- Enhancement (Pretext-powered, fails silently) -->
<script type="module" src="enhance.js"></script>
```

The `type="module"` attribute is a natural feature gate:
- Browsers without ES module support ignore it
- If the import fails (network, missing file), the module doesn't execute
- The base script already rendered the page

In the enhancement module:
```js
import { prepare, layout } from '@chenglou/pretext';

try {
  // Pretext-powered enhancement (auto-fit, precise heights, etc.)
  enhanceWithPretext();
} catch (e) {
  // Page already works without enhancement
  console.warn('Pretext enhancement unavailable:', e.message);
}
```

---

## Vendoring Without a Bundler

Pretext ships as multiple ES modules with relative imports. To use without a bundler:

```bash
npm pack @chenglou/pretext
tar -xzf chenglou-pretext-*.tgz
cd package

# Bundle into a single ESM file
npx esbuild src/index.ts --bundle --format=esm --outfile=pretext.esm.min.js --minify
```

Then commit `pretext.esm.min.js` to your repo:

```html
<script type="module">
import { prepare, layout } from '/static/vendor/pretext.esm.min.js';
</script>
```

Size: ~30KB bundled uncompressed, ~15KB gzipped.

---

## Animation Patterns

### Cycling Text with Auto-Fit

Rotate through different text strings, auto-fitting each to the same container:

```js
const CYCLE_INTERVAL = 4000;
const FADE_DURATION = 500;

setInterval(() => {
  const nextText = pickNext();
  const newSize = autoFitFontSize(nextText, fontFamily, width, 1.5, 3);

  // Slide up + fade out
  el.style.opacity = '0';
  el.style.transform = 'translateY(-30px)';

  setTimeout(() => {
    el.textContent = nextText;
    el.style.fontSize = newSize + 'px';

    // Reset position (no transition)
    el.style.transition = 'none';
    el.style.transform = 'translateY(30px)';

    // Double-rAF forces a paint between state changes
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = 'opacity 500ms, transform 500ms';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    });
  }, FADE_DURATION);
}, CYCLE_INTERVAL);
```

**The double-rAF is essential.** Without it, the browser batches the transition reset + new position + restored transition into one frame, producing no visible animation.

### Animated Filter (CSS Collapse/Expand)

For filtering a list of items, render all items as normal DOM and use CSS transitions — not Pretext + virtualization:

```js
function applyFilter(query) {
  items.forEach((item, i) => {
    const wrapper = wrappers[i];
    if (matches(item, query)) {
      wrapper.classList.remove('hidden');
      wrapper.style.opacity = '';
      wrapper.style.marginBottom = '';
      wrapper.style.maxHeight = wrapper.scrollHeight + 'px';
    } else {
      wrapper.style.maxHeight = wrapper.scrollHeight + 'px';
      wrapper.offsetHeight; // force reflow
      wrapper.style.maxHeight = '0';
      wrapper.style.opacity = '0';
      wrapper.style.marginBottom = '0';
      wrapper.classList.add('hidden');
    }
  });
}
```

```css
.card-wrapper {
  overflow: hidden;
  opacity: 1;
  transition: max-height 0.3s ease-out, opacity 0.25s ease-out, margin-bottom 0.3s ease-out;
}
```

Use inline styles for collapse values — CSS class `max-height: 0` gets overridden by the inline `max-height` from the scrollHeight snapshot.

---

## Creative Demo Patterns

These patterns come from the community showcase. All use the same core API — the creativity is in how you compute widths and render output.

### ASCII Art with Pretext

Use `layoutWithLines()` to get per-line text, then render each character at computed positions. The fluid smoke demos use a physics simulation to compute character densities, then lay out proportional-width ASCII characters.

```js
// Concept: render a grid of characters where each cell
// uses Pretext to measure the character's exact width
const chars = ' .:-=+*#%@';

function renderFrame(densityGrid) {
  for (let row = 0; row < rows; row++) {
    let x = 0;
    for (let col = 0; col < cols; col++) {
      const density = densityGrid[row][col];
      const char = chars[Math.floor(density * (chars.length - 1))];
      ctx.fillText(char, x, row * lineHeight);
      x += charWidths[char]; // Pre-measured with Pretext
    }
  }
}
```

### Magazine / Editorial Layout

The Editorial Engine demo combines obstacle-aware text routing with multi-column layout:

```js
// Simplified editorial layout concept
function layoutEditorial(articles, columns, obstacles) {
  let y = 0;

  for (const article of articles) {
    const prepared = prepareWithSegments(article.text, article.font);
    let cursor = { segmentIndex: 0, graphemeIndex: 0 };

    while (cursor) {
      for (let col = 0; col < columns; col++) {
        const colWidth = getColumnWidth(col, y, obstacles);
        const line = layoutNextLine(prepared, cursor, colWidth);
        if (!line) { cursor = null; break; }

        renderInColumn(line, col, y);
        cursor = line.end;
      }
      y += lineHeight;
    }
  }
}
```

### Shrink-Wrap Chat Bubbles

Use `walkLineRanges()` to find the widest line, then set bubble width to that:

```js
import { prepareWithSegments, walkLineRanges } from '@chenglou/pretext';

function getBubbleWidth(text, font, maxWidth, lineHeight) {
  const prepared = prepareWithSegments(text, font);
  let widestLine = 0;

  walkLineRanges(prepared, maxWidth, (line) => {
    widestLine = Math.max(widestLine, line.width);
  });

  return Math.ceil(widestLine) + padding * 2;
}
```

This is the "CSS can't do this" demo — multiline text where the bubble shrinks to the width of the longest line, not the container width.

### 3D Text Wrapping

The splat-editor and torus demos project 3D geometry into 2D obstacle masks, then use `layoutNextLine()` with the projected widths:

```js
// Each frame:
// 1. Project 3D object into 2D silhouette
// 2. For each text line Y, compute available width from silhouette
// 3. Feed width to layoutNextLine()
// 4. Render text — the text appears to flow around the 3D shape
```

### Streaming AI Chat with Pretext

Compute bubble dimensions as tokens arrive:

```js
let textSoFar = '';
for await (const token of stream) {
  textSoFar += token;
  const prepared = prepare(textSoFar, '16px sans-serif');
  const { height } = layout(prepared, 400, 24);
  bubble.style.height = height + 'px';
  bubble.textContent = textSoFar;
}
```

Because `layout()` is ~0.0002ms, this runs comfortably at 60fps even with rapid token delivery.
