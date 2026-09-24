import { useEffect, useRef } from 'react';
import { track } from '../utils/track';

/**
 * Fires `Home Section Viewed` once per page load, the first time a section's
 * top edge reaches 60% of the way up the viewport. A ratio threshold would never
 * fire on sections taller than the screen, which on a phone is most of them.
 * Across sections this is the scroll-depth funnel: which part of the home page
 * people actually reach.
 */
export const useSectionView = <T extends HTMLElement>(section: string) => {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          track('Home Section Viewed', { section });
          obs.disconnect();
        }
      },
      { rootMargin: '0px 0px -40% 0px', threshold: 0 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [section]);
  return ref;
};
