import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowUpRight, FileText } from 'lucide-react';
import { latestNews, formatNewsDate } from '../data/news';
import { useSectionView } from '../hooks/useSectionView';
import { track } from '../utils/track';
import Reveal from './Reveal';

/** Site routes go through the router; files (PDFs, zips) and other hosts are plain links. */
const isRoute = (href: string) => href.startsWith('/') && !/\.[a-z0-9]+$/i.test(href);

/**
 * The story the hero's "New" banner links to. Sits directly under the hero so the
 * banner's anchor lands a short scroll away, not three sections down.
 */
const NewsStory: React.FC = () => {
  const item = latestNews;
  const ref = useSectionView<HTMLElement>(`news-${item.id}`);
  const links = item.links ?? [];
  const onClick = (href: string) => () => track('News Link Clicked', { item: item.id, href });
  return (
    <section ref={ref} id={item.id} className="scroll-mt-20 border-y border-white/10" style={{ background: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Reveal>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            <Sparkles className="w-4 h-4" />
            What's new · <time dateTime={item.date}>{formatNewsDate(item.date)}</time>
          </p>
          <h2 className="display mt-3 text-3xl md:text-5xl text-white">{item.headline}</h2>
          <p className="mt-4 max-w-3xl text-lg text-white/70">{item.dek}</p>
        </Reveal>
        {item.image && (
          <Reveal>
            <a
              href={links[0]?.href ?? item.image.src}
              onClick={onClick(links[0]?.href ?? item.image.src)}
              className="mt-8 block overflow-hidden rounded-2xl border border-white/10 transition-colors duration-300 hover:border-accent/60"
            >
              <picture>
                {item.image.mobileSrc && <source media="(max-width: 639px)" srcSet={item.image.mobileSrc} />}
                <img
                  src={item.image.src}
                  alt={item.image.alt}
                  width={item.image.width}
                  height={item.image.height}
                  loading="lazy"
                  className="h-auto w-full"
                />
              </picture>
            </a>
          </Reveal>
        )}
        <ul className="mt-8 grid gap-3 md:grid-cols-3">
          {item.points.map((p) => (
            <li
              key={p.title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:bg-accent/[0.06]"
            >
              <p className="font-semibold text-white">{p.title}</p>
              <p className="mt-2 text-sm text-white/65">{p.body}</p>
            </li>
          ))}
        </ul>
        {links.length > 0 && (
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
            {links.map((l, i) => {
              const className =
                i === 0
                  ? 'inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-ink-900 transition-all hover:brightness-90'
                  : 'inline-flex items-center gap-1 text-sm font-semibold text-accent/90 transition-colors hover:text-accent';
              const body = (
                <>
                  {i === 0 && <FileText size={15} />}
                  {l.label}
                  {i > 0 && <ArrowUpRight size={14} />}
                </>
              );
              return isRoute(l.href) ? (
                <Link key={l.href} to={l.href} onClick={onClick(l.href)} className={className}>
                  {body}
                </Link>
              ) : (
                <a key={l.href} href={l.href} onClick={onClick(l.href)} className={className}>
                  {body}
                </a>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsStory;
