import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Hammer, Calendar, ChevronDown, ChevronUp, Linkedin, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BuildLogPost {
  id: string;
  entry: number;
  title: string;
  date: string;
  tags: string[];
  summary: string;
  body: string[];
}

const posts: BuildLogPost[] = [
  {
    id: 'seo-aeo-overhaul',
    entry: 1,
    title: "My Website Scored a D+, So I Rebuilt Its Personality Before Coffee Got Cold",
    date: 'July 20, 2026',
    tags: ['SEO', 'AEO', 'Performance', 'Yak Shaving'],
    summary:
      "An SEO audit handed this very site a 47/100 on a domain with zero authority. Here's the unglamorous, commit-by-commit fix — one canonical domain, one clear identity, and a lot of image files finally getting dressed for the occasion.",
    body: [
      "Every so often you get handed a brutally honest report card, and today's came from an SEO audit that graded this very site a 47 out of 100. A D+. On a domain with a Domain Rating of exactly zero — the search-engine equivalent of a ghost town. Somewhere out there, Google was looking directly at this page and shrugging.",
      "So today's build log is about fixing that, one unglamorous commit at a time.",
      "First problem: the site didn't know what it wanted to be. It talked about finance. It talked about engineering. It talked about being a CFO, a CPO, a strategist, and a technologist, sometimes all four in the same paragraph, and it left both robots and recruiters mildly confused. Step one was ruthless positioning: pick a lane. Atlanta-based fintech leader, fluent in both the boardroom and the codebase. Say it everywhere, consistently, until even an AI answer engine parroting a search result gets it right.",
      "Then came the technical debt that's invisible until you go looking. Three different domain variants were all quietly competing with each other for the same search authority, like triplets arguing over who's actually the firstborn. One redirect rule later, they're all bowing to a single canonical URL.",
      "The images were next. A folder full of professional headshots and referral photos, all sitting around in original JPEG format like they were still getting dressed for a 2009 MySpace page. A quick WebP conversion script later, and the page got noticeably lighter without anyone losing a single pixel of professionalism.",
      "Then the fun part: telling Google to actually look. A Search Console verification token, dropped in as an HTML file with a name so ugly it looks like a cat walked across a keyboard — but it's the digital equivalent of raising your hand in a packed auditorium and saying \"I'm here, please call on me.\"",
      "Along the way there was an editorial cut — trimming a Skills section that had ballooned to nearly 200 lines, because nobody, human or crawler, wants to read a résumé that reads like a ransom note assembled from every tech conference badge since 2015.",
      "Lesson of the day: SEO isn't a switch, it's a small stack of boring, correct decisions — one canonical domain, one clear positioning statement, one lighter image format — that add up to a site actually worth finding. Domain Rating: still zero. Confidence: considerably higher.",
    ],
  },
];

const BuildLog: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(posts[0]?.id ?? null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors duration-200">
              <ArrowLeft size={20} />
              <span>Back to Portfolio</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">The Build Log</h1>
            <div className="flex items-center space-x-4">
              <a
                href="https://www.linkedin.com/in/michaelxaxkaminski"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary-600 transition-colors duration-200"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://github.com/MAKaminski"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary-600 transition-colors duration-200"
              >
                <Github size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="flex items-center justify-center mb-4">
            <Hammer className="w-8 h-8 mr-3 text-primary-600" />
            <h2 className="text-4xl font-bold text-gray-900">The Build Log</h2>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A running, mostly-honest series about the coding sessions behind this site — what broke,
            what shipped, and what it felt like at the time. New entries whenever something's worth writing up.
          </p>
        </motion.div>

        <div className="space-y-6">
          {posts.map((post, index) => {
            const isOpen = openId === post.id;
            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
                style={{ borderTopWidth: '3px', borderTopColor: 'var(--primary, #0ea5e9)' }}
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : post.id)}
                  className="w-full text-left px-7 py-6 flex items-start justify-between gap-4 hover:bg-gray-50 transition-colors duration-200"
                  aria-expanded={isOpen}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full bg-primary-100 text-primary-700">
                        Build Log #{post.entry}
                      </span>
                      <span className="flex items-center text-xs text-gray-400">
                        <Calendar className="w-3.5 h-3.5 mr-1" />
                        {post.date}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 leading-snug">{post.title}</h3>
                    {!isOpen && (
                      <p className="text-gray-600 mt-2 leading-relaxed">{post.summary}</p>
                    )}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-primary-600 flex-shrink-0 mt-1" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-primary-600 flex-shrink-0 mt-1" />
                  )}
                </button>

                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                    className="px-7 pb-8 border-t border-gray-100"
                  >
                    <div className="pt-6 space-y-4">
                      {post.body.map((paragraph, i) => (
                        <p key={i} className="text-gray-700 leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-gray-500 italic text-sm">
            More entries land whenever a session produces a story worth telling.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default BuildLog;
