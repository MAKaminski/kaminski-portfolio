import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, BookOpen, Heart, Calendar, Filter } from 'lucide-react';

interface FavoritePiece {
  id: string;
  title: string;
  author: string;
  url: string;
  description: string;
  publishDate?: string;
  tags: string[];
  category: string;
}

const FavoritePieces: React.FC = () => {
  const favoritePieces: FavoritePiece[] = [
    {
      id: '1',
      title: "Maker's Schedule, Manager's Schedule",
      author: "Paul Graham",
      url: "https://paulgraham.com/makersschedule.html",
      description: "A profound insight into the fundamental difference between how makers and managers organize their time, and why context switching is so destructive to creative work. Essential reading for any technical leader navigating the maker-to-manager transition.",
      publishDate: "July 2009",
      tags: ["Productivity", "Management", "Deep Work"],
      category: "Leadership & Management"
    },
    {
      id: '2',
      title: "The Hard Thing About Hard Things",
      author: "Ben Horowitz",
      url: "https://a16z.com/2014/03/03/the-hard-thing-about-hard-things/",
      description: "Horowitz's no-bullshit guide to the brutal realities of running a company — layoffs, performance management, hiring for the right stage, and making decisions without a playbook. The most honest account of what executive leadership actually feels like.",
      publishDate: "March 2014",
      tags: ["Startups", "Executive Leadership", "Operations"],
      category: "Leadership & Management"
    },
    {
      id: '3',
      title: "Good Strategy, Bad Strategy",
      author: "Richard Rumelt",
      url: "https://www.mckinsey.com/capabilities/strategy-and-corporate-finance/our-insights/the-perils-of-bad-strategy",
      description: "Rumelt's concept of the 'kernel of strategy' — diagnosis, guiding policy, coherent actions — is the clearest framework I've found for separating genuine strategic thinking from aspirational fluff. Changes how you read every strategic plan forever.",
      publishDate: "2011",
      tags: ["Strategy", "Business", "Decision Making"],
      category: "Strategy & Business"
    },
    {
      id: '4',
      title: "Conway's Law and Modern Software Systems",
      author: "Mel Conway",
      url: "https://www.melconway.com/Home/Conways_Law.html",
      description: "\"Organizations which design systems are constrained to produce designs which are copies of the communication structures of those organizations.\" Understanding Conway's Law is indispensable for any architect designing microservices or leading a platform reorganization — the org chart IS the architecture.",
      publishDate: "1967",
      tags: ["Architecture", "Engineering", "Org Design"],
      category: "Engineering & Architecture"
    },
    {
      id: '5',
      title: "No Silver Bullet — Essence and Accident in Software Engineering",
      author: "Fred Brooks",
      url: "https://www.cs.unc.edu/techreports/86-020.pdf",
      description: "Brooks argues that there is no single breakthrough that will give an order-of-magnitude improvement in software productivity. Decades later, this observation still holds — and every time a new tool promises to change everything, this essay is the right calibration.",
      publishDate: "April 1986",
      tags: ["Software Engineering", "Complexity", "Classic"],
      category: "Engineering & Architecture"
    },
    {
      id: '6',
      title: "The Future of Fintech: Embedded Finance",
      author: "a16z Fintech",
      url: "https://a16z.com/fintech-scales-vertical-saas/",
      description: "The thesis that every SaaS company will become a fintech company, and every fintech will embed into vertical workflows, has proven accurate. Understanding the embedded finance shift is foundational for any product or technology leader in financial services.",
      publishDate: "2020",
      tags: ["Fintech", "Payments", "Product Strategy"],
      category: "Fintech & Payments"
    },
    {
      id: '7',
      title: "Stevey's Google Platforms Rant",
      author: "Steve Yegge",
      url: "https://gist.github.com/chitchcock/1281611",
      description: "A leaked internal Google memo comparing Amazon's API-first, platform-first culture to Google's approach. Jeff Bezos's famous \"all teams will expose data and functionality through service interfaces\" mandate is referenced here — it's the clearest case study in why platform thinking wins over the long term.",
      publishDate: "October 2011",
      tags: ["Platforms", "APIs", "Engineering Culture"],
      category: "Engineering & Architecture"
    },
    {
      id: '8',
      title: "The Innovator's Dilemma",
      author: "Clayton Christensen",
      url: "https://hbr.org/2015/12/what-is-disruptive-innovation",
      description: "Christensen's framework for understanding why well-managed incumbents consistently lose to disruptive entrants continues to explain everything from traditional banking vs. neobanks to enterprise software vs. SaaS. The mental model that makes you see disruption before it fully arrives.",
      publishDate: "1997",
      tags: ["Innovation", "Disruption", "Strategy"],
      category: "Strategy & Business"
    }
  ];

  const categories = Array.from(new Set(favoritePieces.map(piece => piece.category)));
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredPieces = activeCategory
    ? favoritePieces.filter(p => p.category === activeCategory)
    : favoritePieces;

  return (
    <section id="favorite-pieces" className="section-padding" style={{ background: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 mr-3" style={{ color: 'var(--primary)' }} />
            <h2 className="text-4xl font-bold" style={{ color: 'var(--primary)' }}>
              Favorite Pieces
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Curated articles, essays, and ideas that have shaped my thinking on leadership, technology, and business. Each one represents a significant shift in perspective.
          </p>
        </motion.div>

        {/* Category filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-3 justify-center mb-10"
        >
          <div className="flex items-center gap-2 text-sm text-gray-500 mr-2">
            <Filter className="w-4 h-4" />
            <span>Filter:</span>
          </div>
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
              activeCategory === null
                ? 'text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            style={activeCategory === null ? { backgroundColor: 'var(--primary)' } : {}}
          >
            All ({favoritePieces.length})
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? 'text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              style={activeCategory === cat ? { backgroundColor: 'var(--primary)' } : {}}
            >
              {cat} ({favoritePieces.filter(p => p.category === cat).length})
            </button>
          ))}
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {filteredPieces.map((piece, index) => (
            <motion.div
              key={piece.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.07 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-white rounded-xl p-7 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 h-full flex flex-col"
                   style={{ borderTopWidth: '3px', borderTopColor: 'var(--primary)' }}>
                <div className="flex items-start justify-between mb-3 gap-3">
                  <div className="flex items-start space-x-3 min-w-0">
                    <BookOpen className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--primary)' }} />
                    <div className="min-w-0">
                      <h4 className="text-lg font-semibold text-gray-900 leading-snug">
                        {piece.title}
                      </h4>
                      <p className="text-sm font-medium mt-0.5" style={{ color: 'var(--primary)' }}>
                        by {piece.author}
                      </p>
                    </div>
                  </div>

                  <motion.a
                    href={piece.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center px-3 py-1.5 rounded-lg text-white font-medium text-sm transition-all duration-300 hover:opacity-90 flex-shrink-0"
                    style={{ backgroundColor: 'var(--primary)' }}
                  >
                    Read
                    <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                  </motion.a>
                </div>

                <p className="text-gray-700 leading-relaxed text-sm mb-4 flex-1">
                  {piece.description}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 mt-auto">
                  <div className="flex flex-wrap gap-1.5">
                    {piece.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 text-xs font-medium rounded-full"
                        style={{
                          backgroundColor: 'var(--primary)',
                          color: 'white',
                          opacity: 0.75
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {piece.publishDate && (
                    <div className="flex items-center text-xs text-gray-400">
                      <Calendar className="w-3.5 h-3.5 mr-1" />
                      {piece.publishDate}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <p className="text-gray-500 italic text-sm">
            More pieces added regularly — each one a significant shift in thinking or a fundamental insight that continues to influence my work.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default FavoritePieces;
