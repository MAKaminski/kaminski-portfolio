import React from 'react';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import Seo from '../components/Seo';
import Header from '../components/Header';
import { articles } from '../data/articles';

const Writing: React.FC = () => {
  return (
    <div className="min-h-screen bg-ink-900 text-white">
      <Seo
        title="Writing — Fintech Finance & Engineering | Michael Kaminski"
        description="Essays on the fintech finance × engineering intersection — fractional CFO/CTO strategy, quality of earnings, and building finance and product as one system. By Michael Kaminski, Atlanta."
        canonicalPath="/writing"
        breadcrumbName="Writing"
      />
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        <div className="text-center mb-12">
          <h2 className="display text-4xl text-white mb-3">Notes from the finance <span className="accent">×</span> engineering intersection</h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Practical essays for fintech founders and operators — where PE-grade finance and hands-on
            engineering meet.
          </p>
        </div>

        <div className="space-y-6">
          {articles.map((a) => (
            <Link
              key={a.slug}
              to={`/writing/${a.slug}`}
              className="block rilla-card hover:border-white/25 transition-colors p-8"
            >
              <div className="flex items-center gap-3 text-sm text-white/50 mb-2">
                <time dateTime={a.date}>
                  {new Date(a.date + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </time>
                <span aria-hidden>·</span>
                <span className="inline-flex items-center gap-1"><Clock size={14} /> {a.readMinutes} min read</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{a.title}</h3>
              <p className="text-white/60">{a.description}</p>
              <span className="inline-block mt-4 text-accent font-semibold">Read →</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Writing;
