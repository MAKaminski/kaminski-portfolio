import React from 'react';
import { ExternalLink, Play, Mic, Newspaper } from 'lucide-react';
import { motion } from 'framer-motion';

interface MediaItem {
  id: number;
  title: string;
  outlet: string;
  type: 'podcast' | 'article' | 'video' | 'conference';
  url: string;
  date: string;
  description: string;
  logo?: string;
}

const mediaItems: MediaItem[] = [
  {
    id: 1,
    title: "Strategic Leadership in the Digital Age",
    outlet: "Harvard Business Review",
    type: 'article',
    url: "https://hbr.org/strategic-leadership-digital-age",
    date: "2024",
    description: "Featured insights on executive leadership and digital transformation strategies.",
    logo: "/images/hbr-logo.png"
  },
  {
    id: 2,
    title: "The Future of FinTech Leadership",
    outlet: "TechCrunch",
    type: 'article',
    url: "https://techcrunch.com/fintech-leadership-future",
    date: "2024",
    description: "Expert commentary on the evolving landscape of financial technology leadership.",
    logo: "/images/techcrunch-logo.png"
  },
  {
    id: 3,
    title: "Executive Insights Podcast",
    outlet: "Leadership Today",
    type: 'podcast',
    url: "https://leadership-today.com/episode/michael-kaminski",
    date: "2024",
    description: "In-depth discussion on strategic decision-making and executive leadership.",
    logo: "/images/leadership-today-logo.png"
  },
  {
    id: 4,
    title: "Digital Transformation Summit",
    outlet: "MIT Sloan",
    type: 'conference',
    url: "https://mitsloan.mit.edu/digital-transformation-summit",
    date: "2024",
    description: "Keynote speaker on strategic transformation and technology adoption.",
    logo: "/images/mit-logo.png"
  },
  {
    id: 5,
    title: "The Strategic CFO",
    outlet: "CFO Magazine",
    type: 'article',
    url: "https://cfo.com/strategic-cfo-michael-kaminski",
    date: "2024",
    description: "Cover story on modern CFO responsibilities and strategic leadership.",
    logo: "/images/cfo-magazine-logo.png"
  },
  {
    id: 6,
    title: "Innovation in Financial Services",
    outlet: "Forbes",
    type: 'article',
    url: "https://forbes.com/innovation-financial-services",
    date: "2024",
    description: "Expert analysis on innovation strategies in financial services.",
    logo: "/images/forbes-logo.png"
  }
];

const FeaturedIn: React.FC = () => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'podcast':
        return <Mic size={20} className="text-purple-600" />;
      case 'video':
        return <Play size={20} className="text-red-600" />;
      case 'conference':
        return <ExternalLink size={20} className="text-blue-600" />;
      default:
        return <Newspaper size={20} className="text-green-600" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'podcast':
        return 'Podcast';
      case 'video':
        return 'Video';
      case 'conference':
        return 'Conference';
      default:
        return 'Article';
    }
  };

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Featured In
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Michael Kaminski's insights and expertise have been featured in leading publications, podcasts, and conferences.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mediaItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {getIcon(item.type)}
                    <span className="text-sm font-medium text-gray-500">
                      {getTypeLabel(item.type)}
                    </span>
                  </div>
                  <ExternalLink size={16} className="text-gray-400 group-hover:text-blue-600 transition-colors duration-200" />
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {item.outlet}
                  </p>
                  <p className="text-sm text-gray-500">
                    {item.date}
                  </p>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </a>
            </motion.div>
          ))}
        </div>

        {/* Press Kit CTA */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Press & Media Inquiries
            </h3>
            <p className="text-gray-600 mb-6">
              For press interviews, speaking engagements, or media appearances, please contact Michael Kaminski directly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:press@michaelkaminski.com"
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Contact Press
              </a>
              <a
                href="/press-kit"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                Download Press Kit
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedIn; 