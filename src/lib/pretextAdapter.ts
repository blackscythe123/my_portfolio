type PretextLineLayout = {
  lines: string[];
  engine: 'pretext' | 'fallback';
};

// Adapter contract for upcoming Pretext-backed layout wiring.
export function layoutStoryCopy(input: string): PretextLineLayout {
  const lines = input
    .split(/(?<=[.!?])\s+/)
    .map((line) => line.trim())
    .filter(Boolean);

  return {
    lines: lines.length > 0 ? lines : [input],
    engine: 'fallback',
  };
}
