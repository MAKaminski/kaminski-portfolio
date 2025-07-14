import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Linkedin, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Referral {
  id: number;
  name: string;
  title: string;
  company: string;
  linkedinUrl: string;
  content: string;
  rating: number;
  date: string;
  avatar?: string;
}

const referrals: Referral[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    title: "Chief Financial Officer",
    company: "TechGrowth Ventures",
    linkedinUrl: "https://linkedin.com/in/sarah-johnson-cfo",
    content: "Michael's strategic vision and execution capabilities are exceptional. He transformed our financial operations and drove 40% revenue growth within 18 months. His ability to bridge finance and technology is rare and invaluable.",
    rating: 5,
    date: "2024",
    avatar: "/images/avatar1.jpg"
  },
  {
    id: 2,
    name: "David Chen",
    title: "CEO & Founder",
    company: "InnovateCorp",
    linkedinUrl: "https://linkedin.com/in/david-chen-ceo",
    content: "Working with Michael was a game-changer for our startup. His expertise in both finance and product strategy helped us secure Series A funding and scale from 10 to 100 employees. Highly recommend for any growth-stage company.",
    rating: 5,
    date: "2024",
    avatar: "/images/avatar2.jpg"
  },
  {
    id: 3,
    name: "Lisa Rodriguez",
    title: "Board Member",
    company: "Strategic Partners Fund",
    linkedinUrl: "https://linkedin.com/in/lisa-rodriguez-board",
    content: "Michael's analytical approach and strategic thinking are outstanding. He consistently delivers results and has a unique ability to identify opportunities others miss. His track record speaks for itself.",
    rating: 5,
    date: "2024",
    avatar: "/images/avatar3.jpg"
  },
  {
    id: 4,
    name: "Robert Kim",
    title: "Managing Director",
    company: "Peak Capital",
    linkedinUrl: "https://linkedin.com/in/robert-kim-md",
    content: "Michael's combination of financial acumen and operational expertise is rare. He's helped us evaluate and improve multiple portfolio companies. His insights are always spot-on and actionable.",
    rating: 5,
    date: "2024",
    avatar: "/images/avatar4.jpg"
  },
  {
    id: 5,
    name: "Amanda Foster",
    title: "Chief Product Officer",
    company: "DataFlow Solutions",
    linkedinUrl: "https://linkedin.com/in/amanda-foster-cpo",
    content: "Michael's product strategy and market analysis skills are exceptional. He helped us pivot our product roadmap and achieve product-market fit. His data-driven approach is invaluable.",
    rating: 5,
    date: "2024",
    avatar: "/images/avatar5.jpg"
  }
];

const ReferralCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

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
    <div className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            What Colleagues Say About Michael Kaminski
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Trusted by executives and board members across finance, technology, and strategic consulting.
          </p>
        </div>

        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
          >
            <ChevronLeft size={24} className="text-gray-700" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
          >
            <ChevronRight size={24} className="text-gray-700" />
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
                  <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                    <div className="flex items-start space-x-6">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                          {referrals[currentIndex].name.charAt(0)}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">
                              {referrals[currentIndex].name}
                            </h3>
                            <p className="text-gray-600">
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
                              className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
                            >
                              <Linkedin size={20} />
                            </a>
                          </div>
                        </div>
                        
                        <blockquote className="text-lg text-gray-700 leading-relaxed italic">
                          "{referrals[currentIndex].content}"
                        </blockquote>
                        
                        <div className="mt-6 text-sm text-gray-500">
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
          <div className="flex justify-center mt-8 space-x-2">
            {referrals.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? 'bg-blue-600 scale-125'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Ready to work with Michael Kaminski?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://calendly.com/michael-kaminski/executive-consultation"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Schedule a Consultation
            </a>
            <a
              href="https://linkedin.com/in/michael-kaminski"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
            >
              Connect on LinkedIn
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralCarousel; 