import React from 'react';
import { motion } from 'framer-motion';
import { Compass, TrendingUp, Target, Globe, Zap, Download, Calendar } from 'lucide-react';
import Seo from '../components/Seo';
import Header from '../components/Header';

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
    <div className="min-h-screen bg-ink-900 text-white">
      <Seo
        title="Fintech Strategy & M&A Advisor in Atlanta | Michael Kaminski"
        description="Fintech strategy, corporate development and M&A advisory from an Atlanta operator who has led $10.8B+ in transactions across IPOs, divestitures and share repurchases — and can execute the finance and the technology behind the plan."
        canonicalPath="/strategy"
        breadcrumbName="Fintech Strategy & M&A"
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
          <p className="text-lg text-accent font-semibold mb-4">Michael Kaminski is an Atlanta-based strategy and M&amp;A advisor for fintech — pairing 20+ years of corporate development with the finance and engineering depth to actually execute the plan.</p>
          <h2 className="display text-5xl text-white mb-6">Fintech Strategy &amp; M&amp;A Advisor</h2>
          <p className="text-xl text-white/60 max-w-4xl mx-auto leading-relaxed">
            Strategy, corporate development and M&amp;A for fintech, payments and PE-backed
            companies. Proven across $10.8B+ in transactions — IPOs, divestitures and
            capital-return programs — with a rare ability to carry a plan from the boardroom
            through the financial model and into the product.
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

        {/* Strategy Highlights */}
        <div className="space-y-8">
          {strategyHighlights.map((highlight, index) => (
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
          <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Strategy?</h3>
          <p className="text-white/70 mb-6 max-w-2xl mx-auto">
            Let's discuss how my experience in strategic planning, M&A, and organizational
            transformation can accelerate your company's growth and market position.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
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

export default Strategy; 