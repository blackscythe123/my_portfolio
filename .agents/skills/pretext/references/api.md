# Pretext API Reference

Complete API reference for `@chenglou/pretext` v0.0.3+.

## Table of Contents

1. [prepare](#prepare)
2. [layout](#layout)
3. [prepareWithSegments](#preparewithsegments)
4. [layoutWithLines](#layoutwithlines)
5. [layoutNextLine](#layoutnextline)
6. [walkLineRanges](#walklineranges)
7. [clearCache](#clearcache)
8. [setLocale](#setlocale)
9. [profilePrepare](#profileprepare)
10. [Types](#types)

---

## prepare

```typescript
prepare(text: string, font: string, options?: PrepareOptions): PreparedText
```

Segments text using `Intl.Segmenter` following Unicode line-break rules, measures each segment's glyph width via Canvas `measureText()`, and caches results.

**Arguments:**
- `text` (string) — the text to measure. **TEXT IS THE FIRST ARGUMENT.**
- `font` (string) — CSS font shorthand: `"14px Georgia, serif"`, `"bold 16px Inter"`, etc.
- `options` (optional):
  - `whiteSpace`: `'normal'` (default) or `'pre-wrap'`

**Returns:** An opaque `PreparedText` token (branded type). Cannot be inspected — pass it to `layout()`.

**Caching behavior:** Segment metrics are cached per font string. Repeated `prepare()` calls with the same font reuse the cache, so measuring 100 different texts in the same font is fast after the first call.

```js
import { prepare } from '@chenglou/pretext';

const p1 = prepare('Hello world', '16px Inter');
const p2 = prepare('Different text', '16px Inter'); // reuses font cache
const p3 = prepare('Bold text', 'bold 16px Inter'); // different font = new cache entry
```

---

## layout

```typescript
layout(prepared: PreparedText, maxWidth: number, lineHeight: number): LayoutResult
```

Computes line breaks and total height using pure arithmetic — no DOM access.

**Arguments:**
- `prepared` — token from `prepare()`
- `maxWidth` (number) — available width in CSS pixels
- `lineHeight` (number) — **ABSOLUTE CSS PIXELS, NOT A MULTIPLIER.** If your CSS says `line-height: 1.5` on a 14px font, pass `21` (= 14 × 1.5)

**Returns:**
```typescript
{ lineCount: number, height: number }
```

**Performance:** ~0.0002ms per call. Safe to call every animation frame.

```js
import { prepare, layout } from '@chenglou/pretext';

const prepared = prepare('Some text content here', '14px Georgia');
const fontSize = 14;
const lineHeightMultiplier = 1.5;
const lineHeightPx = fontSize * lineHeightMultiplier; // = 21

const result = layout(prepared, 500, lineHeightPx);
// → { lineCount: 1, height: 21 }

// Instant re-layout at different widths
const narrow = layout(prepared, 100, lineHeightPx);
// → { lineCount: 3, height: 63 }
```

---

## prepareWithSegments

```typescript
prepareWithSegments(
  text: string,
  font: string,
  options?: PrepareOptions
): PreparedTextWithSegments
```

Like `prepare()`, but returns a richer structure that includes segment information. Required for `layoutWithLines()`, `layoutNextLine()`, and `walkLineRanges()`.

```js
import { prepareWithSegments, layoutWithLines } from '@chenglou/pretext';

const prepared = prepareWithSegments('Hello world, this is a test.', '16px Inter');
// Use with layoutWithLines, layoutNextLine, or walkLineRanges
```

---

## layoutWithLines

```typescript
layoutWithLines(
  prepared: PreparedTextWithSegments,
  maxWidth: number,
  lineHeight: number
): LayoutWithLinesResult
```

Returns per-line text content and widths — useful for character-level animation, syntax highlighting per line, or custom rendering.

**Returns:**
```typescript
{
  height: number,
  lineCount: number,
  lines: LayoutLine[]
}
```

Each `LayoutLine`:
```typescript
{
  text: string,    // full text content of the line
  width: number,   // measured pixel width
  start: LayoutCursor,  // inclusive start position
  end: LayoutCursor     // exclusive end position
}
```

```js
import { prepareWithSegments, layoutWithLines } from '@chenglou/pretext';

const prepared = prepareWithSegments(
  'The quick brown fox jumps over the lazy dog.',
  '16px Georgia'
);
const result = layoutWithLines(prepared, 200, 24);

result.lines.forEach((line, i) => {
  console.log(`Line ${i}: "${line.text}" (${line.width}px)`);
});
// Line 0: "The quick brown fox " (162px)
// Line 1: "jumps over the lazy " (158px)
// Line 2: "dog." (38px)
```

---

## layoutNextLine

```typescript
layoutNextLine(
  prepared: PreparedTextWithSegments,
  start: LayoutCursor,
  maxWidth: number
): LayoutLine | null
```

Routes text one line at a time with a potentially different `maxWidth` each call. **This is the key API for obstacle-aware text flow** — text wrapping around shapes, images, or interactive elements.

Returns `null` when all text has been laid out.

**Arguments:**
- `prepared` — from `prepareWithSegments()`
- `start` — cursor position to start from. First call: `{ segmentIndex: 0, graphemeIndex: 0 }`
- `maxWidth` — available width for THIS specific line (can vary per line)

```js
import { prepareWithSegments, layoutNextLine } from '@chenglou/pretext';

const prepared = prepareWithSegments(longText, '14px Georgia');

// Text flowing around a circular obstacle
let cursor = { segmentIndex: 0, graphemeIndex: 0 };
let y = 0;
const lineHeight = 21;

while (true) {
  // Calculate available width based on obstacle position
  const availableWidth = getWidthAroundObstacle(y, circleX, circleY, circleRadius);

  const line = layoutNextLine(prepared, cursor, availableWidth);
  if (!line) break;

  renderLine(line.text, y);
  cursor = line.end;       // advance cursor to start of next line
  y += lineHeight;
}
```

---

## walkLineRanges

```typescript
walkLineRanges(
  prepared: PreparedTextWithSegments,
  maxWidth: number,
  onLine: (line: LayoutLineRange) => void
): number
```

Low-level line iteration — calls a callback for each line without building text strings. More efficient than `layoutWithLines` when you only need widths and positions, not the actual text.

**Returns:** total line count.

Each `LayoutLineRange`:
```typescript
{
  width: number,
  start: LayoutCursor,  // inclusive
  end: LayoutCursor     // exclusive
}
```

```js
import { prepareWithSegments, walkLineRanges } from '@chenglou/pretext';

const prepared = prepareWithSegments(text, font);

// Find the widest line (for shrink-wrap containers)
let maxLineWidth = 0;
const lineCount = walkLineRanges(prepared, containerWidth, (line) => {
  maxLineWidth = Math.max(maxLineWidth, line.width);
});
// maxLineWidth is now the pixel width of the widest line
```

---

## clearCache

```typescript
clearCache(): void
```

Clears internal measurement caches. Rarely needed — the cache is small and improves performance for repeated measurements with the same font.

Use if you're dynamically loading many different fonts and want to free memory.

---

## setLocale

```typescript
setLocale(locale: string): void
```

Sets the locale for `Intl.Segmenter`, which affects how text is segmented for line breaking. Default behavior uses the browser's locale.

Useful for multilingual applications where you need to ensure correct word/character breaking for CJK, Thai, Arabic, etc.

```js
import { setLocale } from '@chenglou/pretext';
setLocale('ja'); // Japanese segmentation rules
```

---

## profilePrepare

```typescript
profilePrepare(text: string, font: string): TimingInfo
```

Returns timing information for the `prepare()` step. Useful for benchmarking.

---

## Types

### LayoutCursor
```typescript
{
  segmentIndex: number,    // position in the segment stream
  graphemeIndex: number     // grapheme position within segment (0 at boundaries)
}
```

Initial cursor for `layoutNextLine`: `{ segmentIndex: 0, graphemeIndex: 0 }`

### LayoutLine
```typescript
{
  text: string,
  width: number,
  start: LayoutCursor,  // inclusive
  end: LayoutCursor     // exclusive
}
```

### LayoutLineRange
```typescript
{
  width: number,
  start: LayoutCursor,  // inclusive
  end: LayoutCursor     // exclusive
}
```

### PrepareOptions
```typescript
{
  whiteSpace?: 'normal' | 'pre-wrap'
}
```

## Language Support

Pretext handles these script families correctly via `Intl.Segmenter`:

- **Latin, Greek, Cyrillic** — word-level breaking at spaces
- **CJK (Chinese, Japanese, Korean)** — character-level breaking
- **Thai** — segmented at word boundaries despite no spaces
- **Arabic, Hebrew** — RTL text with bidi support
- **Hindi, other Indic scripts** — proper grapheme clustering
- **Emoji** — width correction for cross-platform consistency (though some platform-specific quirks remain)
- **Soft hyphens** — respected as break opportunities
- **Punctuation merging** — "word." treated as a single unit for break purposes
