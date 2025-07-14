import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Target, Users, BarChart3, Zap, Globe, Download, Linkedin, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

const CPO: React.FC = () => {
  const cpoHighlights = [
    {
      icon: Target,
      title: "Product Strategy & Vision",
      description: "Developed and executed product strategies that drove market leadership and user growth",
      details: ["GTM 0-1 strategy execution", "Product-market fit optimization", "Competitive positioning", "Market expansion"]
    },
    {
      icon: Users,
      title: "User Experience & Analytics",
      description: "Built data-driven product experiences with comprehensive analytics and user insights",
      details: ["Mixpanel & Amplitude implementation", "User journey optimization", "A/B testing frameworks", "Customer feedback loops"]
    },
    {
      icon: BarChart3,
      title: "Product Analytics & Metrics",
      description: "Established KPIs and analytics frameworks to measure product success and drive decisions",
      details: ["Product metrics definition", "Growth analytics", "Performance tracking", "Data-driven decisions"]
    },
    {
      icon: Zap,
      title: "Product Operations",
      description: "Scaled product operations and processes to support rapid growth and innovation",
      details: ["Product development workflows", "Cross-functional collaboration", "Agile methodologies", "Release management"]
    },
    {
      icon: Globe,
      title: "Market Expansion",
      description: "Led product initiatives that expanded market reach and drove revenue growth",
      details: ["New market entry", "Feature development", "Partnership strategies", "Revenue optimization"]
    }
  ];

  const keyMetrics = [
    { label: "Products Launched", value: "10+", description: "Successful market entries" },
    { label: "User Growth", value: "0→1→10", description: "Scale achieved" },
    { label: "Analytics Platforms", value: "5+", description: "Implemented & optimized" },
    { label: "Market Expansion", value: "3+", description: "New markets entered" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors duration-200">
              <ArrowLeft size={20} />
              <span>Back to Portfolio</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Michael Kaminski – Chief Product Officer</h1>
            <div className="flex items-center space-x-4">
              <a 
                href="/resume-cpo.pdf" 
                download="Michael_Kaminski_CPO_Resume.pdf"
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
              >
                <Download size={16} />
                <span>CPO Resume</span>
              </a>
              <a 
                href="https://linkedin.com/in/michaelxaxkaminski" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary-600 transition-colors duration-200"
              >
                <Linkedin size={20} />
              </a>
              <a 
                href="https://github.com/michaelxaxkaminski" 
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-lg text-primary-700 font-semibold mb-4">Michael Kaminski is a strategic Chief Product Officer with a proven track record in product leadership, analytics, and market growth.</p>
          <h2 className="text-5xl font-bold text-gray-900 mb-6">Chief Product Officer</h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Strategic product leader with proven track record in building and scaling products 
            from concept to market leadership. Expert in product strategy, user experience, 
            analytics, and driving product-led growth.
          </p>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {keyMetrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg text-center">
              <h3 className="text-3xl font-bold text-primary-600 mb-2">{metric.value}</h3>
              <p className="text-lg font-semibold text-gray-900 mb-1">{metric.label}</p>
              <p className="text-gray-600">{metric.description}</p>
            </div>
          ))}
        </motion.div>

        {/* CPO Highlights */}
        <div className="space-y-8">
          {cpoHighlights.map((highlight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <div className="flex items-start space-x-6">
                <div className="bg-primary-100 rounded-xl p-4 flex-shrink-0">
                  <highlight.icon className="w-8 h-8 text-primary-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{highlight.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{highlight.description}</p>
                  <div className="grid md:grid-cols-2 gap-3">
                    {highlight.details.map((detail, detailIndex) => (
                      <div key={detailIndex} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                        <span className="text-gray-700">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-center text-white"
        >
          <h3 className="text-2xl font-bold mb-4">Ready to Build Your Next Great Product?</h3>
          <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
            Let's discuss how my experience in product strategy, user experience, and 
            data-driven product development can accelerate your product's success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://calendly.com/mkaminski1337/executive-consultation"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-primary-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              Schedule a Call
            </a>
            <a
              href="mailto:mkaminski1337@gmail.com"
              className="border border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white hover:text-primary-600 transition-colors duration-200"
            >
              Send Email
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CPO; 