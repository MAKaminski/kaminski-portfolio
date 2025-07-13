import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, Target, Users, BarChart3, Globe, Download, Linkedin, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

const Revenue: React.FC = () => {
  const revenueHighlights = [
    {
      icon: TrendingUp,
      title: "Revenue Strategy & Growth",
      description: "Developed and executed revenue strategies that accelerated growth and maximized value creation",
      details: ["Revenue optimization", "Growth strategy execution", "Market expansion", "Value proposition development"]
    },
    {
      icon: Target,
      title: "Go-to-Market Strategy",
      description: "Built comprehensive GTM strategies that drove market penetration and revenue acceleration",
      details: ["GTM 0-1 execution", "Market entry strategies", "Channel optimization", "Sales enablement"]
    },
    {
      icon: Users,
      title: "Customer Success & Retention",
      description: "Implemented customer success frameworks that maximized lifetime value and retention",
      details: ["Customer journey optimization", "Retention strategies", "Success metrics", "Customer feedback loops"]
    },
    {
      icon: BarChart3,
      title: "Revenue Operations & Analytics",
      description: "Built data-driven revenue operations that optimized performance and drove insights",
      details: ["Revenue analytics", "Sales operations", "Performance metrics", "Data-driven decisions"]
    },
    {
      icon: Globe,
      title: "Market Expansion & Partnerships",
      description: "Led market expansion initiatives and strategic partnerships that accelerated revenue growth",
      details: ["New market entry", "Strategic partnerships", "Channel development", "Revenue diversification"]
    }
  ];

  const keyMetrics = [
    { label: "Revenue Growth", value: "300%+", description: "Average improvement" },
    { label: "Market Expansions", value: "5+", description: "Successful entries" },
    { label: "Customer Acquisition", value: "10K+", description: "New customers" },
    { label: "Revenue Optimization", value: "$50M+", description: "Value created" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors duration-200">
              <ArrowLeft size={20} />
              <span>Back to Portfolio</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Chief Revenue Officer</h1>
            <div className="flex items-center space-x-4">
              <a 
                href="/resume-revenue.pdf" 
                download="Michael_Kaminski_Revenue_Resume.pdf"
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
              >
                <Download size={16} />
                <span>Revenue Resume</span>
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
          <h2 className="text-5xl font-bold text-gray-900 mb-6">Chief Revenue Officer</h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Revenue leader with proven track record in accelerating growth, optimizing 
            revenue operations, and scaling go-to-market strategies. Expert in revenue 
            strategy, customer success, and market expansion.
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

        {/* Revenue Highlights */}
        <div className="space-y-8">
          {revenueHighlights.map((highlight, index) => (
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
          <h3 className="text-2xl font-bold mb-4">Ready to Accelerate Your Revenue?</h3>
          <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
            Let's discuss how my experience in revenue strategy, go-to-market execution, 
            and growth optimization can accelerate your revenue growth.
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

export default Revenue; 