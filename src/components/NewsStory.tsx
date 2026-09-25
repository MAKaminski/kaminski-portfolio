import React from 'react';
import { Sparkles } from 'lucide-react';
import { latestNews, formatNewsDate } from '../data/news';
import { useSectionView } from '../hooks/useSectionView';
import Reveal from './Reveal';

/**
 * The story the hero's "New" banner links to. Sits directly under the hero so the
 * banner's anchor lands a short scroll away, not three sections down.
 */
const NewsStory: React.FC = () => {
  const item = latestNews;
  const ref = useSectionView<HTMLElement>(`news-${item.id}`);
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
      </div>
    </section>
  );
};

export default NewsStory;
