'use client';

import { motion } from 'framer-motion';
import { storyActs } from '@/data/story-acts';
import { useScrollStory } from '@/contexts/ScrollStoryContext';

type CharacterState = 'wave' | 'point-left' | 'point-right';

function getCharacterState(activeActIndex: number): CharacterState {
  const cue = storyActs[activeActIndex]?.cue;

  if (cue === 'point-left' || cue === 'point-right' || cue === 'wave') {
    return cue;
  }

  return 'wave';
}

export function WalkingBoyCharacter() {
  const { progress, activeActIndex } = useScrollStory();
  const state = getCharacterState(activeActIndex);
  const x = `${8 + progress * 84}vw`;

  const leftArmRotation =
    state === 'wave' ? [-18, 22, -18] : state === 'point-left' ? -54 : -14;
  const rightArmRotation =
    state === 'wave' ? [35, -16, 35] : state === 'point-right' ? 54 : 18;

  return (
    <motion.div
      aria-hidden
      className='pointer-events-none fixed bottom-8 left-0 z-40'
      style={{ x }}
      transition={{ type: 'spring', stiffness: 120, damping: 18, mass: 0.7 }}
    >
      <svg width='96' height='132' viewBox='0 0 96 132' fill='none'>
        <motion.g
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 0.45, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
          stroke='currentColor'
          strokeWidth='3.5'
          strokeLinecap='round'
        >
          <circle cx='48' cy='20' r='12' />
          <path d='M48 32V68' />

          <motion.line
            x1='48'
            y1='42'
            x2='24'
            y2='56'
            animate={{ rotate: leftArmRotation }}
            transformBox='fill-box'
            transformOrigin='48px 42px'
            transition={{ duration: 0.35, repeat: state === 'wave' ? Number.POSITIVE_INFINITY : 0 }}
          />

          <motion.line
            x1='48'
            y1='42'
            x2='72'
            y2='56'
            animate={{ rotate: rightArmRotation }}
            transformBox='fill-box'
            transformOrigin='48px 42px'
            transition={{ duration: 0.35, repeat: state === 'wave' ? Number.POSITIVE_INFINITY : 0 }}
          />

          <motion.line
            x1='48'
            y1='68'
            x2='34'
            y2='98'
            animate={{ y2: [98, 104, 98] }}
            transition={{ duration: 0.45, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
          />

          <motion.line
            x1='48'
            y1='68'
            x2='62'
            y2='98'
            animate={{ y2: [104, 98, 104] }}
            transition={{ duration: 0.45, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
          />
        </motion.g>
      </svg>
    </motion.div>
  );
}
