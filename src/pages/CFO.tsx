import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Shield, Calculator, BarChart3 } from 'lucide-react';
import Seo from '../components/Seo';
import Header from '../components/Header';

const CFO: React.FC = () => {
  const cfoHighlights = [
    {
      icon: DollarSign,
      title: "Financial Leadership",
      description: "Led $10.8B+ in complex financial transactions including IPOs, debt facilities, and M&A deals",
      details: ["GreenSky IPO ($1B+)", "HD Supply divestitures ($1.8B+)", "Home Depot share repurchase ($4B)"]
    },
    {
      icon: TrendingUp,
      title: "Strategic Financial Planning",
      description: "Developed and executed financial strategies that drove significant value creation",
      details: ["Scaled operations 0→1→10", "Optimized $50MM inventory", "Implemented CAPEX frameworks"]
    },
    {
      icon: Shield,
      title: "Risk Management & Compliance",
      description: "Established robust risk management frameworks and ensured regulatory compliance",
      details: ["SOC 1 & SOC 2 readiness", "ASC 606 implementation", "SOX compliance", "Regulatory frameworks"]
    },
    {
      icon: Calculator,
      title: "Financial Operations",
      description: "Transformed financial operations through technology and process optimization",
      details: ["ERP implementations (SAP, NetSuite)", "Financial systems integration", "Process automation", "KPI development"]
    },
    {
      icon: BarChart3,
      title: "Analytics & Reporting",
      description: "Built data-driven financial reporting and analytics capabilities",
      details: ["Financial modeling", "Board reporting", "Investor relations", "Performance metrics"]
    }
  ];

  const keyMetrics = [
    { label: "Transaction Value Led", value: "$10.8B+", description: "Across all deal types" },
    { label: "Companies Transformed", value: "4+", description: "Financial operations" },
    { label: "Years CFO Experience", value: "13+", description: "Executive leadership" },
    { label: "Regulatory Frameworks", value: "15+", description: "Implemented & managed" }
  ];

  return (
    <div className="min-h-screen bg-ink-900 text-white">
      <Seo
        title="Fractional CFO for Fintech & PE-Backed Startups | Michael Kaminski, Atlanta"
        description="Atlanta-based fractional & full-time CFO for fintech, payments and PE-backed startups. PE-grade FP&A, treasury, quality of earnings, ASC/SOC/SOX compliance and $10.8B+ in transactions — from a leader who also ships software."
        canonicalPath="/cfo"
        breadcrumbName="Fractional CFO for Fintech"
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
          <p className="text-lg text-accent font-semibold mb-4">Michael Kaminski is an Atlanta-based finance leader who pairs 20+ years of PE-grade financial expertise with hands-on software engineering — an uncommon combination for fintech.</p>
          <h2 className="display text-5xl text-white mb-6">Fractional &amp; Full-Time CFO for Fintech</h2>
          <p className="text-xl text-white/60 max-w-4xl mx-auto leading-relaxed">
            Financial leadership for founders and private-equity-backed fintech, payments and
            SaaS companies — from FP&amp;A, treasury and quality of earnings to board and sponsor
            reporting. A CFO who can build the model the board expects and understand the code
            that ships the product.
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

        {/* CFO Highlights */}
        <div className="space-y-8">
          {cfoHighlights.map((highlight, index) => (
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
          <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Financial Operations?</h3>
          <p className="text-white/70 mb-6 max-w-2xl mx-auto">
            Let's discuss how my experience in financial leadership, strategic planning,
            and operational transformation can drive value for your organization.
          </p>
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
    </div>
  );
};

export default CFO; 