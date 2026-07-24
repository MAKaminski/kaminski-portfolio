import React from 'react';

interface MarqueeProps {
  items: string[];
  className?: string;
}

/** Infinite horizontal marquee (duplicated track). Pauses on hover. */
const Marquee: React.FC<MarqueeProps> = ({ items, className }) => {
  const row = [...items, ...items];
  return (
    <div className={`group relative overflow-hidden ${className || ''}`}>
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
    </div>
  );
};

export default Marquee;
