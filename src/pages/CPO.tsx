import React from 'react';
import { motion } from 'framer-motion';
import { Target, Users, BarChart3, Zap, Globe, Download, Calendar } from 'lucide-react';
import Seo from '../components/Seo';
import Header from '../components/Header';

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
    <div className="min-h-screen bg-ink-900 text-white">
      <Seo
        title="Fintech Product Leader (CPO) in Atlanta | Michael Kaminski"
        description="Fintech and payments product leadership from an Atlanta operator who is bilingual in product, engineering and finance — GTM 0→1, product analytics and roadmap execution backed by real technical and P&L depth."
        canonicalPath="/cpo"
        breadcrumbName="Fintech Product Leader"
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
          <p className="text-lg text-accent font-semibold mb-4">Michael Kaminski is a strategic Chief Product Officer with a proven track record in product leadership, analytics, and market growth.</p>
          <h1 className="display text-5xl text-white mb-6">Product ownership at the agent layer</h1>
          <p className="text-xl text-white/60 max-w-4xl mx-auto leading-relaxed">
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
            <div key={index} className="rilla-card p-6 text-center">
              <h3 className="text-3xl font-bold text-accent mb-2">{metric.value}</h3>
              <p className="text-lg font-semibold text-white mb-1">{metric.label}</p>
              <p className="text-white/60">{metric.description}</p>
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
          <h3 className="text-2xl font-bold mb-4">Ready to Build Your Next Great Product?</h3>
          <p className="text-white/70 mb-6 max-w-2xl mx-auto">
            Let's discuss how my experience in product strategy, user experience, and
            data-driven product development can accelerate your product's success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
            <a
              href=""
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
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://calendly.com/kaminski1337/15min"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pill-accent"
            >
              Schedule a Call
            </a>
            <a
              href="mailto:mkaminski1337@gmail.com"
              className="btn-pill-ghost"
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
      </div>
    </div>
  );
};

export default CPO; 