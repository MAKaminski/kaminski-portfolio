import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Linkedin, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { referrals } from '../data/referrals';
import { useSectionView } from '../hooks/useSectionView';
import { track } from '../utils/track';


const ReferralCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  // Long reviews clamp to six lines; the full text is one tap away.
  const [expanded, setExpanded] = useState(false);
  useEffect(() => setExpanded(false), [currentIndex]);
  const ref = useSectionView<HTMLDivElement>('testimonials');

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % referrals.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % referrals.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + referrals.length) % referrals.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  return (
    <div ref={ref} id="testimonials" className="py-14 bg-ink-800 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="display text-4xl md:text-5xl text-white mb-4">
            What Colleagues <span className="accent">Say</span>
          </h2>
        </div>

        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="hidden md:block absolute left-4 top-1/2 transform -translate-y-1/2 z-10 rounded-full border border-white/15 bg-white/10 p-3 text-white backdrop-blur transition-all duration-200 hover:bg-white/20 hover:scale-110"
          >
            <ChevronLeft size={24} className="text-white/70" />
          </button>

          <button
            onClick={nextSlide}
            className="hidden md:block absolute right-4 top-1/2 transform -translate-y-1/2 z-10 rounded-full border border-white/15 bg-white/10 p-3 text-white backdrop-blur transition-all duration-200 hover:bg-white/20 hover:scale-110"
          >
            <ChevronRight size={24} className="text-white/70" />
          </button>

          {/* Carousel Container */}
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="flex justify-center"
              >
                <div className="max-w-4xl mx-auto">
                  <div className="rilla-card p-8 md:p-12">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
                      <div className="flex-shrink-0">
                        {referrals[currentIndex].avatar ? (
                          <img
                            src={referrals[currentIndex].avatar}
                            alt={referrals[currentIndex].name}
                            loading="lazy"
                            decoding="async"
                            className="w-16 h-16 rounded-full object-cover shadow-lg"
                            onError={(e) => {
                              // Fallback to initials if image fails to load
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div className={`w-16 h-16 rounded-full border border-accent/30 bg-accent/15 flex items-center justify-center text-accent font-bold text-xl ${referrals[currentIndex].avatar ? 'hidden' : ''}`}>
                          {referrals[currentIndex].name.charAt(0)}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-semibold text-white">
                              {referrals[currentIndex].name}
                            </h3>
                            <p className="text-white/60">
                              {referrals[currentIndex].title} at {referrals[currentIndex].company}
                            </p>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <div className="flex">
                              {[...Array(referrals[currentIndex].rating)].map((_, i) => (
                                <Star key={i} size={16} className="text-yellow-400 fill-current" />
                              ))}
                            </div>
                            <a
                              href={referrals[currentIndex].linkedinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-white/60 hover:text-accent transition-colors duration-200"
                            >
                              <Linkedin size={20} />
                            </a>
                          </div>
                        </div>
                        
                        <blockquote
                          className={`text-base sm:text-lg text-white/70 leading-relaxed italic ${expanded ? '' : 'line-clamp-6'}`}
                        >
                          "{referrals[currentIndex].content}"
                        </blockquote>
                        {!expanded && referrals[currentIndex].content.length > 320 && (
                          <button
                            type="button"
                            onClick={() => {
                              setExpanded(true);
                              setIsAutoPlaying(false);
                              track('Section Expanded', { section: 'testimonials', item: referrals[currentIndex].name });
                            }}
                            className="mt-2 text-sm font-semibold text-accent hover:underline underline-offset-4"
                          >
                            Read full review
                          </button>
                        )}
                        
                        <div className="mt-6 text-sm text-white/50">
                          {referrals[currentIndex].date}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center mt-6 space-x-2">
            <button onClick={prevSlide} aria-label="Previous review" className="md:hidden mr-2 p-2 text-white/70">
              <ChevronLeft size={20} />
            </button>
            {referrals.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? 'bg-accent scale-125'
                    : 'bg-white/25 hover:bg-white/45'
                }`}
              />
            ))}
            <button onClick={nextSlide} aria-label="Next review" className="md:hidden ml-2 p-2 text-white/70">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ReferralCarousel; 