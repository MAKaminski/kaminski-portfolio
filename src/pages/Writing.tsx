import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import Seo from '../components/Seo';
import { articles } from '../data/articles';

const Writing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Seo
        title="Writing — Fintech Finance & Engineering | Michael Kaminski"
        description="Essays on the fintech finance × engineering intersection — fractional CFO/CTO strategy, quality of earnings, and building finance and product as one system. By Michael Kaminski, Atlanta."
        canonicalPath="/writing"
        breadcrumbName="Writing"
      />
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
              <ArrowLeft size={20} />
              <span>Back to Portfolio</span>
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Writing</h1>
            <span className="w-24" />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">Notes from the finance × engineering intersection</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Practical essays for fintech founders and operators — where PE-grade finance and hands-on
            engineering meet.
          </p>
        </div>

        <div className="space-y-6">
          {articles.map((a) => (
            <Link
              key={a.slug}
              to={`/writing/${a.slug}`}
              className="block bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow p-8 border border-gray-100"
            >
              <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
                <time dateTime={a.date}>
                  {new Date(a.date + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </time>
                <span aria-hidden>·</span>
                <span className="inline-flex items-center gap-1"><Clock size={14} /> {a.readMinutes} min read</span>
                {a.series && (
                  <>
                    <span aria-hidden>·</span>
                    <span className="px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-purple-700 bg-purple-100 rounded-full">
                      {a.series}{a.seriesPart ? ` #${a.seriesPart}` : ''}
                    </span>
                  </>
                )}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{a.title}</h3>
              <p className="text-gray-600">{a.description}</p>
              <span className="inline-block mt-4 text-blue-600 font-semibold">Read →</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Writing;
