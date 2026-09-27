import React from 'react';

/** Initials for things with no icon of their own: "Demand Desk" -> "DD", "OurAI" -> "OA". */
export const initials = (name: string) => {
  const words = name.replace(/^The\s+/i, '').split(/[\s_-]+/).filter(Boolean);
  if (words.length > 1) return (words[0][0] + words[1][0]).toUpperCase();
  const caps = words[0].match(/[A-Z]/g) || [];
  return (caps.length >= 2 ? caps.slice(0, 2).join('') : words[0].slice(0, 2)).toUpperCase();
};

/**
 * A site's or product's own icon, or its initials when it ships none, so a
 * card never shows a borrowed or generic mark. Shared by /websites, /products
 * and the /projects index.
 */
const NameMark: React.FC<{ name: string; icon?: string; size?: 'sm' | 'md' }> = ({ name, icon, size = 'md' }) => {
  const box = size === 'sm' ? 'h-6 w-6' : 'h-7 w-7';
  const px = size === 'sm' ? 24 : 28;
  return icon ? (
    <img
      src={icon}
      alt=""
      width={px}
      height={px}
      loading="lazy"
      decoding="async"
      className={`${box} flex-shrink-0 rounded-md`}
    />
  ) : (
    <span
      aria-hidden="true"
      className={`flex ${box} flex-shrink-0 items-center justify-center rounded-md border border-white/15 bg-white/[0.04] text-[10px] font-bold text-white/60`}
    >
      {initials(name)}
    </span>
  );
};

export default NameMark;
