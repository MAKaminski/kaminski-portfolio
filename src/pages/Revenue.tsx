import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Users, BarChart3, Globe, Download, Calendar } from 'lucide-react';
import Seo from '../components/Seo';
import Header from '../components/Header';

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
    <div className="min-h-screen bg-ink-900 text-white">
      <Seo
        title="Fintech Revenue & Growth Leader in Atlanta | Michael Kaminski"
        description="Revenue and go-to-market leadership for fintech and SaaS — GTM 0→1, revenue operations, retention and analytics — from an Atlanta operator who understands the unit economics and can build the systems behind the growth."
        canonicalPath="/revenue"
        breadcrumbName="Fintech Revenue & Growth"
      />
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-lg text-accent font-semibold mb-4">Michael Kaminski is a results-driven Chief Revenue Officer with expertise in revenue strategy, operations, and market expansion.</p>
          <h2 className="display text-5xl text-white mb-6">Chief Revenue Officer</h2>
          <p className="text-xl text-white/60 max-w-4xl mx-auto leading-relaxed">
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
            <div key={index} className="rilla-card p-6 text-center">
              <h3 className="text-3xl font-bold text-accent mb-2">{metric.value}</h3>
              <p className="text-lg font-semibold text-white mb-1">{metric.label}</p>
              <p className="text-white/60">{metric.description}</p>
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
              className="rilla-card p-8"
            >
              <div className="flex items-start space-x-6">
                <div className="bg-accent/15 rounded-xl p-4 flex-shrink-0">
                  <highlight.icon className="w-8 h-8 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-3">{highlight.title}</h3>
                  <p className="text-white/60 mb-4 leading-relaxed">{highlight.description}</p>
                  <div className="grid md:grid-cols-2 gap-3">
                    {highlight.details.map((detail, detailIndex) => (
                      <div key={detailIndex} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-accent rounded-full"></div>
                        <span className="text-white/80">{detail}</span>
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
          className="mt-16 rilla-card p-8 text-center"
        >
          <h3 className="text-2xl font-bold mb-4">Ready to Accelerate Your Revenue?</h3>
          <p className="text-white/70 mb-6 max-w-2xl mx-auto">
            Let's discuss how my experience in revenue strategy, go-to-market execution,
            and growth optimization can accelerate your revenue growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <a
              href="https://calendly.com/kaminski1337/15min"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pill-accent"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Book Call
            </a>
            <a
              href="/docs/Kaminski Resume.pdf"
              download="Kaminski_Resume.pdf"
              className="btn-pill-ghost"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Full Resume
            </a>
          </div>
          <div className="mt-12 flex flex-col items-center space-y-4">
            <a
              href="https://calendly.com/kaminski1337/15min"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pill-accent"
            >
              Schedule a Call
            </a>
            <a
              href="/docs/Kaminski Resume.pdf"
              download="Kaminski_Resume.pdf"
              className="btn-pill-ghost"
            >
              Download Full Resume
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Revenue; 