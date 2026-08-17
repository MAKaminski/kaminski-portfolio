import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import Header from '../components/Header';
import VideoEmbed from '../components/VideoEmbed';
import { clips } from '../data/clips';
import { getArticle } from '../data/articles';

const SITE_URL = 'https://www.michael-kaminski.io';

/** ISO 8601 duration, e.g. 10 -> PT10S. VideoObject requires this format. */
const iso8601Duration = (seconds: number): string => `PT${seconds}S`;

const Clips: React.FC = () => {
  const jsonLd = clips.map((c) => ({
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    '@id': `${SITE_URL}/clips#${c.slug}`,
    name: c.title,
    description: c.description,
    thumbnailUrl: [`${SITE_URL}${c.poster}`],
    contentUrl: `${SITE_URL}${c.src}`,
    uploadDate: c.uploadDate,
    duration: iso8601Duration(c.durationSec),
    width: c.width,
    height: c.height,
    transcript: c.transcript,
    inLanguage: 'en',
    isFamilyFriendly: true,
    creator: { '@id': `${SITE_URL}/#person` },
    publisher: { '@id': `${SITE_URL}/#person` },
  }));

  return (
    <div className="min-h-screen bg-ink-900 text-white">
      <Seo
        title="Field Clips — Agent & Pipeline Infrastructure | Michael Kaminski"
        description="Ten-second field clips on agent and pipeline infrastructure: statistical gates that never bind, and dealer-gamma levels that move on zero trades. Each clip carries its full transcript and links to the underlying write-up."
        canonicalPath="/clips"
        image={clips[0]?.poster}
        breadcrumbName="Field Clips"
        jsonLd={jsonLd}
      />
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        <div className="text-center mb-12">
          <h1 className="display text-4xl text-white mb-3">
            Field <span className="accent">clips</span>
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            One finding, ten seconds. Each clip compresses a single result from something I
            actually run — the full arithmetic lives in the write-up underneath it.
          </p>
        </div>

        <div className="space-y-10">
          {clips.map((c) => {
            const article = c.relatedArticleSlug ? getArticle(c.relatedArticleSlug) : undefined;
            return (
              <section key={c.slug} id={c.slug} className="rilla-card p-6 sm:p-8 scroll-mt-24">
                <div className="grid gap-8 md:grid-cols-[340px_1fr] md:items-start">
                  <VideoEmbed clip={c} />

                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{c.title}</h2>
                    <p className="text-white/60 mb-6">{c.description}</p>

                    <div
                      className="article-body text-white/70"
                      dangerouslySetInnerHTML={{ __html: c.context }}
                    />

                    <div className="mt-6 pt-6 border-t border-white/10">
                      <h3 className="text-xs font-bold uppercase tracking-wide text-accent mb-2">
                        Transcript
                      </h3>
                      <blockquote className="text-white/70 italic">“{c.transcript}”</blockquote>
                    </div>

                    {article && (
                      <Link
                        to={`/writing/${article.slug}`}
                        className="inline-block mt-6 text-accent font-semibold"
                      >
                        Read the full arithmetic: {article.title} →
                      </Link>
                    )}
                  </div>
                </div>
              </section>
            );
          })}
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <Link to="/writing" className="text-accent font-semibold">
            All essays →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Clips;
