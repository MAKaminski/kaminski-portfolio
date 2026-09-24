import React, { useEffect, useRef } from 'react';

/**
 * Rejouice-style custom cursor: a lerp-trailing ring + dot that grows over
 * interactive elements. Fine-pointer (desktop) only; disabled for touch and
 * for users who prefer reduced motion.
 */
const Cursor: React.FC = () => {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  // Soft neon halo. Lags the ring so the light seems to pour after the pointer.
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return;

    document.body.classList.add('has-custom-cursor');

    const ring = ringRef.current!;
    const dot = dotRef.current!;
    const glow = glowRef.current!;
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let gx = mx;
    let gy = my;
    let scale = 1;
    let targetScale = 1;
    let visible = false;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      if (!visible) {
        visible = true;
        ring.style.opacity = '1';
        dot.style.opacity = '1';
        glow.style.opacity = '1';
      }
      const interactive = (e.target as HTMLElement)?.closest('a, button, input, textarea, [data-cursor]');
      targetScale = interactive ? 2.4 : 1;
    };

    const onLeave = () => {
      visible = false;
      ring.style.opacity = '0';
      dot.style.opacity = '0';
      glow.style.opacity = '0';
    };

    let raf = 0;
    const loop = () => {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      scale += (targetScale - scale) * 0.15;
      gx += (mx - gx) * 0.08;
      gy += (my - gy) * 0.08;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%) scale(${scale})`;
      // The halo swells a little over interactive elements, less than the ring does.
      glow.style.transform = `translate(${gx}px, ${gy}px) translate(-50%, -50%) scale(${0.85 + scale * 0.15})`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.body.classList.remove('has-custom-cursor');
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] hidden md:block" aria-hidden>
      <div
        ref={glowRef}
        className="cursor-glow fixed left-0 top-0 h-56 w-56 rounded-full opacity-0 transition-opacity duration-500"
        style={{ willChange: 'transform' }}
      />
      <div
        ref={ringRef}
        className="fixed left-0 top-0 h-9 w-9 rounded-full border border-accent opacity-0 mix-blend-difference transition-opacity duration-300"
        style={{ willChange: 'transform' }}
      />
      <div
        ref={dotRef}
        className="fixed left-0 top-0 h-1.5 w-1.5 rounded-full bg-accent opacity-0 mix-blend-difference"
        style={{ willChange: 'transform' }}
      />
    </div>
  );
};

export default Cursor;
