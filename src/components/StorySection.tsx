import { type StoryAct } from '@/data/story-acts';
import { layoutStoryCopy } from '@/lib/pretextAdapter';

type StorySectionProps = {
  act: StoryAct;
  index: number;
};

export function StorySection({ act, index }: StorySectionProps) {
  const isDark = act.tone === 'dark';
  const copy = layoutStoryCopy(act.body);

  return (
    <section
      id={act.id}
      data-tone={act.tone}
      className={`story-section min-h-screen px-6 py-24 md:px-12 lg:px-20 ${
        isDark ? 'bg-black text-white' : 'bg-white text-black'
      }`}
    >
      <div className='mx-auto flex max-w-5xl flex-col gap-8'>
        <p className='story-kicker text-xs uppercase tracking-[0.24em] opacity-70'>
          {String(index + 1).padStart(2, '0')} / {act.label}
        </p>
        <h2 className='story-headline max-w-4xl text-4xl leading-tight md:text-6xl'>
          {act.headline}
        </h2>
        <div className='story-body max-w-2xl space-y-2 text-base leading-8 md:text-xl'>
          {copy.lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
