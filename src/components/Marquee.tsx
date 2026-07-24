import React from 'react';
import { motion, useScroll, useVelocity, useTransform, useSpring } from 'framer-motion';

interface MarqueeProps {
  items: string[];
  className?: string;
}

/** Infinite marquee whose track skews with scroll velocity. Pauses on hover. */
const Marquee: React.FC<MarqueeProps> = ({ items, className }) => {
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { stiffness: 200, damping: 50, mass: 0.2 });
  const skew = useTransform(smooth, [-2500, 0, 2500], [-9, 0, 9], { clamp: true });
  const row = [...items, ...items];

  return (
    <div className={`group relative overflow-hidden ${className || ''}`}>
      <motion.div style={{ skewX: skew }} className="will-change-transform">
        <div className="flex w-max animate-marquee gap-12 group-hover:[animation-play-state:paused] motion-reduce:animate-none motion-reduce:flex-wrap motion-reduce:justify-center">
          {row.map((item, i) => (
            <span
              key={i}
              className="display whitespace-nowrap text-2xl md:text-3xl text-white/35"
              aria-hidden={i >= items.length}
            >
              {item}
              <span className="accent px-6">/</span>
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Marquee;
