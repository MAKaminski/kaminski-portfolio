import React from 'react';
import { articleLogos } from '../data/articleLogos';
import { track } from '../utils/track';

/**
 * The companies and tools an article covers. On the Writing index the whole
 * card is already a link, so the marks are plain images there; on the article
 * page each one links out to its site.
 */
const ArticleLogos: React.FC<{ names?: string[]; slug: string; linked?: boolean; className?: string }> = ({
  names,
  slug,
  linked = false,
  className = '',
}) => {
  const items = (names || []).filter((n) => articleLogos[n]);
  if (!items.length) return null;
  return (
    <ul className={`flex flex-wrap items-center gap-x-4 gap-y-2 ${className}`} aria-label="Covers">
      {items.map((name) => {
        const logo = articleLogos[name];
        const img = (
          <img
            src={logo.src}
            alt={name}
            title={name}
            height={20}
            width={logo.shape === 'wordmark' ? 76 : 20}
            loading="lazy"
            decoding="async"
            className="h-5 w-auto opacity-75 transition group-hover:opacity-100"
          />
        );
        return (
          <li key={name}>
            {linked ? (
              <a
                href={logo.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('Article Logo Clicked', { logo: name, slug })}
                className="group inline-flex items-center gap-2 text-xs font-medium text-white/60 hover:text-accent"
              >
                {img}
                <span>{name}</span>
              </a>
            ) : (
              <span className="group inline-flex">{img}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default ArticleLogos;
