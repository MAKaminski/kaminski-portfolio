import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, Download } from 'lucide-react';
import Seo from '../components/Seo';
import { getArticle } from '../data/articles';

const SITE_URL = 'https://www.michael-kaminski.io';

const Article: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? getArticle(slug) : undefined;

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center px-4">
        <Seo title="Not found | Michael Kaminski" description="Article not found." canonicalPath="/writing" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Article not found</h1>
        <Link to="/writing" className="text-blue-600 font-semibold">← Back to Writing</Link>
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
    <div className="min-h-screen bg-white">
      <Seo
        title={`${article.title} | Michael Kaminski`}
        description={article.description}
        canonicalPath={`/writing/${article.slug}`}
        type="article"
        jsonLd={jsonLd}
      />
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link to="/writing" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
              <ArrowLeft size={20} />
              <span>All writing</span>
            </Link>
          </div>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <span className="inline-flex items-center gap-1">
            <Calendar size={14} />
            <time dateTime={article.date}>
              {new Date(article.date + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </time>
          </span>
          <span className="inline-flex items-center gap-1"><Clock size={14} /> {article.readMinutes} min read</span>
        </div>
        <h1 className="text-4xl font-black text-gray-900 leading-tight mb-8">{article.title}</h1>

        <div className="article-body" dangerouslySetInnerHTML={{ __html: article.body }} />

        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row gap-4">
          <a
            href="https://calendly.com/kaminski1337/15min"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:shadow-xl transition-all"
          >
            Book a 15-min call
          </a>
          <a
            href="/docs/Kaminski Resume.pdf"
            download="Kaminski_Resume.pdf"
            className="inline-flex items-center justify-center px-6 py-3 border-2 border-blue-600 text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Download size={18} className="mr-2" /> Download resume
          </a>
        </div>
      </article>
    </div>
  );
};

export default Article;
