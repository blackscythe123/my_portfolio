'use client';

import { useEffect, useRef, useState } from 'react';

export type ScrollProgressState = {
  progress: number;
  direction: 'up' | 'down';
  velocity: number;
};

const DEFAULT_STATE: ScrollProgressState = {
  progress: 0,
  direction: 'down',
  velocity: 0,
};

export function useScrollProgress(): ScrollProgressState {
  const [state, setState] = useState<ScrollProgressState>(DEFAULT_STATE);
  const previousScrollRef = useRef(0);
  const previousTimeRef = useRef(0);
  const tickingRef = useRef(false);

  useEffect(() => {
    const update = () => {
      const now = performance.now();
      const scrollTop = window.scrollY;
      const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, scrollTop / maxScroll));
      const deltaScroll = scrollTop - previousScrollRef.current;
      const deltaTime = Math.max(1, now - previousTimeRef.current);
      const direction: 'up' | 'down' = deltaScroll < 0 ? 'up' : 'down';
      const velocity = Math.abs(deltaScroll / deltaTime);

      setState({ progress, direction, velocity });

      previousScrollRef.current = scrollTop;
      previousTimeRef.current = now;
      tickingRef.current = false;
    };

    const onScroll = () => {
      if (tickingRef.current) {
        return;
      }

      tickingRef.current = true;
      window.requestAnimationFrame(update);
    };

    previousScrollRef.current = window.scrollY;
    previousTimeRef.current = performance.now();
    update();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return state;
}
