import React, { useState } from 'react';
import { Download, FileText, BarChart3, Target, TrendingUp, BookOpen, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'whitepaper' | 'checklist' | 'framework' | 'template';
  icon: React.ReactNode;
  color: string;
  downloadUrl: string;
  requiresEmail: boolean;
  category: string;
}

const resources: Resource[] = [
  {
    id: 'due-diligence-checklist',
    title: 'Due Diligence Checklist',
    description: 'Comprehensive checklist for evaluating investment opportunities and strategic partnerships.',
    type: 'checklist',
    icon: <CheckCircle size={24} className="text-green-600" />,
    color: 'green',
    downloadUrl: '/resources/due-diligence-checklist.pdf',
    requiresEmail: true,
    category: 'Finance'
  },
  {
    id: 'strategic-framework',
    title: 'Strategic Transformation Framework',
    description: 'Proven framework for leading organizational change and strategic initiatives.',
    type: 'framework',
    icon: <Target size={24} className="text-blue-600" />,
    color: 'blue',
    downloadUrl: '/resources/strategic-framework.pdf',
    requiresEmail: true,
    category: 'Strategy'
  },
  {
    id: 'financial-model-template',
    title: 'Financial Model Template',
    description: 'Excel template for building comprehensive financial models and projections.',
    type: 'template',
    icon: <BarChart3 size={24} className="text-purple-600" />,
    color: 'purple',
    downloadUrl: '/resources/financial-model-template.xlsx',
    requiresEmail: true,
    category: 'Finance'
  },
  {
    id: 'product-strategy-guide',
    title: 'Product Strategy Guide',
    description: 'Step-by-step guide for developing and executing product strategy.',
    type: 'whitepaper',
    icon: <TrendingUp size={24} className="text-orange-600" />,
    color: 'orange',
    downloadUrl: '/resources/product-strategy-guide.pdf',
    requiresEmail: true,
    category: 'Product'
  },
  {
    id: 'executive-leadership-playbook',
    title: 'Executive Leadership Playbook',
    description: 'Comprehensive playbook for effective executive leadership and team management.',
    type: 'whitepaper',
    icon: <BookOpen size={24} className="text-indigo-600" />,
    color: 'indigo',
    downloadUrl: '/resources/executive-leadership-playbook.pdf',
    requiresEmail: true,
    category: 'Leadership'
  },
  {
    id: 'technology-roadmap-template',
    title: 'Technology Roadmap Template',
    description: 'Template for creating comprehensive technology roadmaps and digital transformation plans.',
    type: 'template',
    icon: <FileText size={24} className="text-red-600" />,
    color: 'red',
    downloadUrl: '/resources/technology-roadmap-template.pptx',
    requiresEmail: true,
    category: 'Technology'
  }
];

// HIDE: Do not render this component in App or anywhere else
const DownloadableResources: React.FC = () => {
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [email, setEmail] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadedResources, setDownloadedResources] = useState<string[]>([]);

  const handleDownload = async (resource: Resource) => {
    if (resource.requiresEmail && !email) {
      setSelectedResource(resource);
      return;
    }

    setIsDownloading(true);
    
    // Simulate download process
    setTimeout(() => {
      // Add to downloaded resources
      setDownloadedResources(prev => [...prev, resource.id]);
      
      // Trigger actual download
      const link = document.createElement('a');
      link.href = resource.downloadUrl;
      link.download = resource.title.replace(/\s+/g, '-').toLowerCase();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsDownloading(false);
      setSelectedResource(null);
      setEmail('');
    }, 1000);
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'whitepaper':
        return 'Whitepaper';
      case 'checklist':
        return 'Checklist';
      case 'framework':
        return 'Framework';
      case 'template':
        return 'Template';
      default:
        return 'Resource';
    }
  };

  const categories = Array.from(new Set(resources.map(r => r.category)));

  return (
    <div className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-gray-900 mb-4"
          >
            Free Executive Resources
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Download Michael Kaminski's proven frameworks, templates, and guides to accelerate your business success.
          </motion.p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category, index) => (
            <motion.button
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-sm font-medium"
            >
              {category}
            </motion.button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource, index) => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {resource.icon}
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {getTypeLabel(resource.type)}
                    </span>
                  </div>
                  {downloadedResources.includes(resource.id) && (
                    <CheckCircle size={20} className="text-green-600" />
                  )}
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {resource.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {resource.description}
                </p>

                <button
                  onClick={() => handleDownload(resource)}
                  disabled={isDownloading}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDownloading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Download size={16} />
                      <span>Download Free</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Email Modal */}
        {selectedResource && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Get Your Free Resource
              </h3>
              <p className="text-gray-600 mb-6">
                Enter your email to download "{selectedResource.title}" and receive exclusive executive insights.
              </p>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                handleDownload(selectedResource);
              }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                />
                
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={isDownloading}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
                  >
                    {isDownloading ? 'Downloading...' : 'Download'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedResource(null)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-xl font-semibold mb-4">
              Need Custom Solutions?
            </h3>
            <p className="text-blue-100 mb-6">
              These resources are just the beginning. Let's discuss how Michael Kaminski can create tailored solutions for your specific challenges.
            </p>
            <a
              href="https://calendly.com/michael-kaminski/executive-consultation"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Schedule a Consultation
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DownloadableResources; 