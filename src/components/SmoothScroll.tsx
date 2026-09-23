import React, { useEffect } from 'react';
import type Lenis from 'lenis';

/**
 * Rejouice-style smooth/inertia scrolling via Lenis.
 * No-ops for users who prefer reduced motion. Also upgrades in-page
 * anchor links (#id) to smooth scrolls.
 */
const SmoothScroll: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    // Lenis is a nice-to-have that has no business in the first-paint bundle.
    // Load it once the main thread is idle (Safari has no requestIdleCallback).
    let lenis: Lenis | null = null;
    let raf = 0;
    let cancelled = false;
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement)?.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a || !lenis) return;
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        lenis.scrollTo(el as HTMLElement, { offset: -80 });
      }
    };

    const start = () => {
      import('lenis').then(({ default: LenisCtor }) => {
        if (cancelled) return;
        lenis = new LenisCtor({
          duration: 1.1,
          lerp: 0.1,
          smoothWheel: true,
          wheelMultiplier: 1,
          touchMultiplier: 1.6,
        });
        const loop = (time: number) => {
          lenis?.raf(time);
          raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
        document.addEventListener('click', onClick);
      });
    };
    const w = window as Window & { requestIdleCallback?: (cb: () => void) => number };
    if (typeof w.requestIdleCallback === 'function') w.requestIdleCallback(start);
    else setTimeout(start, 1);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      document.removeEventListener('click', onClick);
      lenis?.destroy();
    };
  }, []);

  return <>{children}</>;
};

export default SmoothScroll;
