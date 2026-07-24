import React from 'react';
import { motion } from 'framer-motion';

const RILLA_EASE = [0.445, 0.05, 0.55, 0.95] as const;

interface SplitRevealProps {
  /** Each entry is one masked line that slides up into view. */
  lines: React.ReactNode[];
  className?: string;
  delay?: number;
  stagger?: number;
  /**
   * Fire on mount (`animate`) instead of on scroll (`whileInView`). Use for
   * above-the-fold content — it's always in view, and it sidesteps the
   * react-snap prerender + IntersectionObserver freeze where a serialized
   * initial transform never re-triggers after hydration.
   */
  immediate?: boolean;
}

/** Line-mask reveal: each line rises from behind an overflow-hidden mask, staggered. */
const SplitReveal: React.FC<SplitRevealProps> = ({
  lines,
  className,
  delay = 0,
  stagger = 0.09,
  immediate = false,
}) => (
  <span className={className}>
    {lines.map((line, i) => {
      const anim = { y: 0 };
      const trigger = immediate
        ? { animate: anim }
        : { whileInView: anim, viewport: { once: true, margin: '-10%' } };
      return (
        <span key={i} className="block overflow-hidden pb-[0.06em]">
          <motion.span
            className="block"
            initial={{ y: '115%' }}
            {...trigger}
            transition={{ duration: 0.9, ease: RILLA_EASE, delay: delay + i * stagger }}
          >
            {line}
          </motion.span>
        </span>
      );
    })}
  </span>
);

export default SplitReveal;
