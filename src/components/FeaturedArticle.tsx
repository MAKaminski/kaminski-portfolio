import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { track } from '@vercel/analytics';
import { articles } from '../data/articles';

// A slim strip under the hero pointing at the newest essay. Deliberately not a
// <section>: the home page's sections are py-16, and a banner that tall reads
// as content rather than as a pointer.
//
// It derives from articles[0] rather than a pinned slug because the array is
// hand-ordered newest-first and gains an entry most days. Pinning would mean
// this strip silently goes stale, which is the opposite of what it is for.
const FeaturedArticle: React.FC = () => {
  const article = articles[0];
  if (!article) return null;

  return (
    <motion.div
      className="border-y border-white/10 bg-white/[0.03]"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link
          to={`/writing/${article.slug}`}
          onClick={() => track('Featured Article Clicked', { slug: article.slug, source: 'Home' })}
          className="group flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4"
        >
          <span className="shrink-0 self-start rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wide text-ink-900">
            New
          </span>
          <span className="font-semibold text-white transition-colors group-hover:text-accent">
            {article.title}
          </span>
          <span className="flex shrink-0 items-center gap-3 text-sm text-white/50">
            <time dateTime={article.date}>
              {new Date(article.date + 'T00:00:00').toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <span aria-hidden>·</span>
            <span className="inline-flex items-center gap-1">
              <Clock size={14} /> {article.readMinutes} min read
            </span>
          </span>
          <span className="shrink-0 font-semibold text-accent sm:ml-auto">Read →</span>
        </Link>
      </div>
    </motion.div>
  );
};

export default FeaturedArticle;
