import React from 'react';
import { motion, useScroll, useVelocity, useTransform, useSpring } from 'framer-motion';

export interface MarqueeLogo {
  /** Company name — used as the accessible label and the alt-text fallback. */
  name: string;
  /** Path to a white-on-transparent mark under /images/logos. */
  src: string;
  /**
   * Rendered size in CSS px (assets ship at 2x). Both are required and set as real
   * width/height attributes: the track scrolls continuously, so an image without an
   * intrinsic box collapses to zero width and shunts the whole row when it decodes.
   */
  width: number;
  height: number;
}

interface MarqueeProps {
  items: MarqueeLogo[];
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
        <div className="flex w-max items-center animate-marquee gap-12 group-hover:[animation-play-state:paused] motion-reduce:animate-none motion-reduce:flex-wrap motion-reduce:justify-center">
          {row.map((item, i) => {
            const duplicate = i >= items.length;
            return (
              <span key={i} className="flex items-center whitespace-nowrap" aria-hidden={duplicate}>
                <img
                  src={item.src}
                  alt={duplicate ? '' : item.name}
                  width={item.width}
                  height={item.height}
                  decoding="async"
                  className="opacity-45 transition-opacity duration-300 group-hover:opacity-90"
                />
                <span className="accent display px-6 text-2xl md:text-3xl">/</span>
              </span>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default Marquee;
