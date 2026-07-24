import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Clock, Calendar, Download } from 'lucide-react';
import Seo from '../components/Seo';
import Header from '../components/Header';
import { getArticle } from '../data/articles';

const SITE_URL = 'https://www.michael-kaminski.io';

const Article: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? getArticle(slug) : undefined;

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-ink-900 text-white text-center px-4">
        <Seo title="Not found | Michael Kaminski" description="Article not found." canonicalPath="/writing" />
        <h1 className="text-3xl font-bold text-white mb-4">Article not found</h1>
        <Link to="/writing" className="text-accent font-semibold">← Back to Writing</Link>
      </div>
    );
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    dateModified: article.date,
    author: {
      '@type': 'Person',
      name: 'Michael Kaminski',
      url: SITE_URL,
    },
    publisher: { '@type': 'Person', name: 'Michael Kaminski' },
    mainEntityOfPage: `${SITE_URL}/writing/${article.slug}`,
    image: `${SITE_URL}/og-image.jpg`,
  };

  return (
    <div className="min-h-screen bg-ink-900 text-white">
      <Seo
        title={`${article.title} | Michael Kaminski`}
        description={article.description}
        canonicalPath={`/writing/${article.slug}`}
        type="article"
        jsonLd={jsonLd}
      />
      <Header />

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        {article.series && (
          <span className="inline-block mb-4 text-xs font-bold uppercase tracking-wide text-accent bg-white/10 rounded-full px-3 py-1">
            {article.series}
          </span>
        )}
        <div className="flex items-center gap-4 text-sm text-white/50 mb-4">
          <span className="inline-flex items-center gap-1">
            <Calendar size={14} />
            <time dateTime={article.date}>
              {new Date(article.date + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </time>
          </span>
          <span className="inline-flex items-center gap-1"><Clock size={14} /> {article.readMinutes} min read</span>
        </div>
        <h1 className="display text-4xl text-white leading-tight mb-8">{article.title}</h1>

        <div className="article-body" dangerouslySetInnerHTML={{ __html: article.body }} />

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row gap-4">
          <a
            href="https://calendly.com/kaminski1337/15min"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pill-accent"
          >
            Book a 15-min call
          </a>
          <a
            href="/docs/Kaminski Resume.pdf"
            download="Kaminski_Resume.pdf"
            className="btn-pill-ghost"
          >
            <Download size={18} className="mr-2" /> Download resume
          </a>
        </div>
      </article>
    </div>
  );
};

export default Article;
