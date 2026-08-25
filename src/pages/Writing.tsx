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
        title="Writing — Agent Infrastructure & Evals | Michael Kaminski"
        description="Field notes on AI agent infrastructure, MCP servers, eval harnesses, and shipping agents inside a regulated lender. By Michael Kaminski, Atlanta."
        canonicalPath="/writing"
        breadcrumbName="Writing"
      />
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        <div className="text-center mb-12">
          <h1 className="display text-4xl text-white mb-3">Field notes on <span className="accent">agent infrastructure</span></h1>
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
              {a.series && (
                <span className="inline-block mb-2 text-xs font-bold uppercase tracking-wide text-accent bg-white/10 rounded-full px-3 py-1">
                  {a.series}
                </span>
              )}
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
