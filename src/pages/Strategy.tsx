import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Compass, TrendingUp, Target, Globe, Zap, Download, Calendar, Linkedin, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

const Strategy: React.FC = () => {
  const strategyHighlights = [
    {
      icon: Compass,
      title: "Strategic Planning & Vision",
      description: "Developed and executed comprehensive strategic plans that transformed organizations and drove market leadership",
      details: ["Long-term strategic planning", "Market opportunity analysis", "Competitive positioning", "Vision development"]
    },
    {
      icon: TrendingUp,
      title: "Growth Strategy & Execution",
      description: "Led strategic initiatives that accelerated growth and created sustainable competitive advantages",
      details: ["Market expansion strategies", "Revenue optimization", "Operational scaling", "Performance transformation"]
    },
    {
      icon: Target,
      title: "M&A & Corporate Development",
      description: "Led complex strategic transactions and corporate development initiatives that created significant value",
      details: ["$10.8B+ in transactions", "IPO strategy & execution", "Divestiture planning", "Strategic partnerships"]
    },
    {
      icon: Globe,
      title: "Market Strategy & Positioning",
      description: "Developed market entry and positioning strategies that established market leadership",
      details: ["Market entry strategies", "Competitive analysis", "Brand positioning", "Go-to-market planning"]
    },
    {
      icon: Zap,
      title: "Operational Strategy",
      description: "Transformed operations through strategic initiatives that improved efficiency and performance",
      details: ["Process optimization", "Technology transformation", "Organizational design", "Performance metrics"]
    }
  ];

  const keyMetrics = [
    { label: "Strategic Transactions", value: "$10.8B+", description: "Total value led" },
    { label: "Companies Transformed", value: "4+", description: "Strategic initiatives" },
    { label: "Market Expansions", value: "5+", description: "Successful entries" },
    { label: "Performance Improvements", value: "300%+", description: "Average growth" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors duration-200">
              <ArrowLeft size={20} />
              <span>Back to Portfolio</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Michael Kaminski – Chief Strategy Officer</h1>
            <div className="flex items-center space-x-4">
              <a 
                href="/docs/Kaminski Resume.pdf" 
                download="Kaminski_Resume.pdf"
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
              >
                <Download size={16} />
                <span>Download Full Resume</span>
              </a>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-lg text-primary-700 font-semibold mb-4">Michael Kaminski is a visionary Chief Strategy Officer with deep expertise in strategic planning, M&A, and organizational transformation.</p>
          <h2 className="text-5xl font-bold text-gray-900 mb-6">Chief Strategy Officer</h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Strategic leader with proven track record in developing and executing transformative 
            strategies that drive growth, create value, and establish market leadership. 
            Expert in strategic planning, M&A, and organizational transformation.
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

        {/* Strategy Highlights */}
        <div className="space-y-8">
          {strategyHighlights.map((highlight, index) => (
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
          <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Strategy?</h3>
          <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
            Let's discuss how my experience in strategic planning, M&A, and organizational 
            transformation can accelerate your company's growth and market position.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <a
              href="https://calendly.com/kaminski1337/15min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Book Call
            </a>
            <a
              href="/docs/Kaminski Resume.pdf"
              download="Kaminski_Resume.pdf"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors duration-200"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Full Resume
            </a>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://calendly.com/kaminski1337/15min"
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
        <div className="mt-12 flex flex-col items-center space-y-4">
          <a
            href="https://calendly.com/kaminski1337/15min"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors duration-200 text-lg shadow-lg"
          >
            Schedule a Call
          </a>
          <a
            href="/docs/Kaminski Resume.pdf"
            download="Kaminski_Resume.pdf"
            className="inline-flex items-center justify-center px-8 py-4 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-700 transition-colors duration-200 text-lg shadow-lg"
          >
            Download Full Resume
          </a>
        </div>
      </div>
    </div>
  );
};

export default Strategy; 