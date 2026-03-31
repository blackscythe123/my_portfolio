export type StoryTone = 'light' | 'dark';

export type StoryAct = {
  id: string;
  label: string;
  headline: string;
  body: string;
  tone: StoryTone;
  cue: 'wave' | 'point-left' | 'point-right';
};

export const storyActs: StoryAct[] = [
  {
    id: 'act-1',
    label: 'Prelude',
    headline: 'Hi. I build systems that move with intent.',
    body: 'This portfolio is now a scroll-play. As you move, I move. The story opens in pure white and black.',
    tone: 'light',
    cue: 'wave',
  },
  {
    id: 'act-2',
    label: 'Origin',
    headline: 'Automation shaped how I think.',
    body: 'I design workflows where precision matters: tools that run repeatedly, predictably, and fast.',
    tone: 'dark',
    cue: 'point-right',
  },
  {
    id: 'act-3',
    label: 'Craft',
    headline: 'Full-stack with product clarity.',
    body: 'From interface choreography to backend integration, each build focuses on useful outcomes.',
    tone: 'light',
    cue: 'point-left',
  },
  {
    id: 'act-4',
    label: 'Web3',
    headline: 'Protocol-native, detail-driven.',
    body: 'I prototype wallet flows, on-chain interactions, and developer tooling without losing UX quality.',
    tone: 'dark',
    cue: 'point-right',
  },
  {
    id: 'act-5',
    label: 'Systems',
    headline: 'Performance is a feature.',
    body: 'I optimize rendering paths, interaction timing, and architecture so products feel immediate.',
    tone: 'light',
    cue: 'point-left',
  },
  {
    id: 'act-6',
    label: 'Projects',
    headline: 'Work that ships and scales.',
    body: 'Each project is built to be read quickly, understood clearly, and extended safely.',
    tone: 'dark',
    cue: 'point-right',
  },
  {
    id: 'act-7',
    label: 'Call',
    headline: 'Let us build the next movement.',
    body: 'If you want a product with strong engineering and intentional motion, let us connect.',
    tone: 'light',
    cue: 'point-left',
  },
];
