import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, BookOpen, Heart, Calendar } from 'lucide-react';

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
      description: "A profound insight into the fundamental difference between how makers and managers organize their time, and why context switching is so destructive to creative work.",
      publishDate: "July 2009",
      tags: ["Productivity", "Management", "Deep Work"],
      category: "Leadership & Management"
    }
  ];

  const categories = Array.from(new Set(favoritePieces.map(piece => piece.category)));

  return (
    <section id="favorite-pieces" className="section-padding" style={{ background: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 mr-3" style={{ color: 'var(--primary)' }} />
            <h2 className="text-4xl font-bold" style={{ color: 'var(--primary)' }}>
              Favorite Pieces
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Curated articles, essays, and content that have shaped my thinking and approach to leadership, technology, and business.
          </p>
        </motion.div>

        {categories.map((category, categoryIndex) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h3 className="text-2xl font-semibold mb-8 text-center" style={{ color: 'var(--primary)' }}>
              {category}
            </h3>
            
            <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-1">
              {favoritePieces
                .filter(piece => piece.category === category)
                .map((piece, index) => (
                  <motion.div
                    key={piece.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="group"
                  >
                    <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-opacity-60"
                         style={{ borderColor: 'var(--primary)' }}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <BookOpen className="w-6 h-6" style={{ color: 'var(--primary)' }} />
                          <div>
                            <h4 className="text-xl font-semibold text-gray-900 group-hover:text-opacity-80 transition-colors">
                              {piece.title}
                            </h4>
                            <p className="text-sm font-medium" style={{ color: 'var(--primary)' }}>
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
                          className="inline-flex items-center px-4 py-2 rounded-lg text-white font-medium transition-all duration-300 hover:shadow-lg hover:opacity-90"
                          style={{ 
                            backgroundColor: 'var(--primary)'
                          }}
                        >
                          Read
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </motion.a>
                      </div>

                      <p className="text-gray-700 leading-relaxed mb-6">
                        {piece.description}
                      </p>

                      <div className="flex flex-wrap items-center justify-between">
                        <div className="flex flex-wrap gap-2 mb-2 sm:mb-0">
                          {piece.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-1 text-xs font-medium rounded-full"
                              style={{ 
                                backgroundColor: 'var(--primary)',
                                color: 'white',
                                opacity: 0.8
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        {piece.publishDate && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="w-4 h-4 mr-1" />
                            {piece.publishDate}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 italic">
            More pieces will be added regularly. Each one represents a significant shift in my thinking or a fundamental insight that continues to influence my work.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default FavoritePieces;