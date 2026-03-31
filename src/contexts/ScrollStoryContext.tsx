'use client';

import { createContext, useContext, useMemo } from 'react';
import { storyActs } from '@/data/story-acts';
import { useScrollProgress } from '@/hooks/useScrollProgress';

type ScrollStoryContextValue = {
  progress: number;
  direction: 'up' | 'down';
  velocity: number;
  activeActIndex: number;
};

const ScrollStoryContext = createContext<ScrollStoryContextValue>({
  progress: 0,
  direction: 'down',
  velocity: 0,
  activeActIndex: 0,
});

export function ScrollStoryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { progress, direction, velocity } = useScrollProgress();

  const value = useMemo<ScrollStoryContextValue>(() => {
    const activeActIndex = Math.min(
      storyActs.length - 1,
      Math.floor(progress * storyActs.length)
    );

    return {
      progress,
      direction,
      velocity,
      activeActIndex,
    };
  }, [progress, direction, velocity]);

  return (
    <ScrollStoryContext.Provider value={value}>
      {children}
    </ScrollStoryContext.Provider>
  );
}

export function useScrollStory() {
  return useContext(ScrollStoryContext);
}
