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
    name: "Dawn Goad",
    title: "",
    company: "Momnt",
    linkedinUrl: "https://www.linkedin.com/in/dawn-jeffries-goad/",
    content: `I had the pleasure of working with Michael, and I can confidently say he is an outstanding Product Engineer. He has exceptional communication skills and a unique ability to break down complex technical challenges into clear, actionable solutions, making collaboration seamless across teams.

What truly makes Michael stand out is his problem solving mindset. He doesn’t just fix issues; he digs deep to identify root causes and proactively implements long-term solutions that improve both product performance and processes. His understanding of regulatory compliance is particularly impressive. He recognizes its critical role in product development and ensures that every solution aligns with industry standards.

Beyond his technical expertise, Michael is also highly skilled in documenting processes and simplifying complex systems so that both technical and non-technical users can understand them. He has a knack for translating intricate engineering concepts into clear, accessible documentation that enhances efficiency, knowledge sharing, and overall user experience.

Michael’s expertise, attention to detail, and commitment to excellence make him an invaluable asset to any team. I highly recommend him to anyone looking for a skilled and strategic engineer who drives meaningful impact.`,
    rating: 5,
    date: "2025",
    avatar: ""
  },
  {
    id: 2,
    name: "Brien Mizell",
    title: "Senior Technical Product Engineer",
    company: "Momnt",
    linkedinUrl: "https://www.linkedin.com/in/brienmizell/",
    content: "Working with Michael was transformative for our business. His insights into finance and technology helped us scale rapidly and achieve our goals ahead of schedule.",
    rating: 5,
    date: "2025",
    avatar: ""
  },
  {
    id: 3,
    name: "Abby Martin",
    title: "Senior Product Manager",
    company: "Momnt",
    linkedinUrl: "https://www.linkedin.com/in/martin-abby/",
    content: "",
    rating: 5,
    date: "2025",
    avatar: ""
  },
  {
    id: 4,
    name: "EJ Shramek",
    title: "Director of Project Management",
    company: "Superior Contracting & Maintenance",
    linkedinUrl: "https://www.linkedin.com/in/ejshramek/",
    content: "",
    rating: 5,
    date: "2025",
    avatar: ""
  },
  {
    id: 5,
    name: "Kyle McDonald,
    title: "Senior Financial Analyst",
    company: "Momnt",
    linkedinUrl: "https://www.linkedin.com/in/mcdonaldkyle/",
    content: "",
    rating: 5,
    date: "2025",
    avatar: ""
  },
  {
    id: 6,
    name: "Daniel Walker",
    title: "Director of Construction",
    company: "Superior Contracting & Maintenance",
    linkedinUrl: "https://www.linkedin.com/in/daniel-walker-479646205/",
    content: "",
    rating: 5,
    date: "2025",
    avatar: ""
  },
  {
    id: 7,
    name: "Peter Doro",
    title: "Product Manager",
    company: "Momnt",
    linkedinUrl: "https://www.linkedin.com/in/peter-doro2000/",
    content: "",
    rating: 5,
    date: "2025",
    avatar: ""
  },
  {
    id: 8,
    name: "Jessica Almariri",
    title: "Compliance Analyst",
    company: "Momnt",
    linkedinUrl: "  https://www.linkedin.com/in/jessica-almariri-b3684a10/",
    content: "",
    rating: 5,
    date: "2025",
    avatar: ""
  },
  {
    id: 9,
    name: "Vedran Karačić",
    title: "Software Developer",
    company: "Momnt",
    linkedinUrl: "https://www.linkedin.com/in/vedrankaracic/",
    content: "",
    rating: 5,
    date: "2025",
    avatar: ""
  },
  {
    id: 10,
    name: "Natalie Uribe",
    title: "Enterprise Admin, Manager",
    company: "Momnt",
    linkedinUrl: "https://www.linkedin.com/in/natalie-uribe-aab000a1/",
    content: "",
    rating: 5,
    date: "2025",
    avatar: ""
  },
  {
    id: 11,
    name: "Michael Hill",
    title: "Manager, GPS EFA",
    company: "Deloitte",
    linkedinUrl: "https://www.linkedin.com/in/michael-hill-0391991b/",
    content: "",
    rating: 5,
    date: "2011",
    avatar: ""
  },
  {
    id: 12,
    name: "Genna Brown",
    title: "CIO",
    company: "Financial Success",
    linkedinUrl: "https://www.linkedin.com/in/genna-brown-11385ab/",
    content: "",
    rating: 5,
    date: "2011",
    avatar: ""
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
              href="https://calendly.com/kaminski1337/15min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Schedule a Consultation
            </a>
            <a
              href="https://www.linkedin.com/in/michaelxaxkaminski"
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