import React from 'react';
import { motion } from 'framer-motion';
import { Star, TrendingUp, Rocket, Target } from 'lucide-react';

const Highlights: React.FC = () => {
  const highlights = [
    {
      title: "Scale 0→1→10 Superior",
      description: "Successfully scaled operations from startup to enterprise level, implementing strategic frameworks and operational excellence across all business functions.",
      icon: Rocket,
      category: "Scaling & Growth"
    },
    {
      title: "Secondary + 3 Divestitures @ HD Supply",
      description: "Led complex divestiture transactions totaling over $1.8B, including strategic planning, execution, and post-transaction integration.",
      icon: TrendingUp,
      category: "M&A & Divestitures"
    },
    {
      title: "IPO @ GreenSky",
      description: "Supported the initial public offering process through delivery and market analysis, contributing to successful S1 preparation and execution.",
      icon: Star,
      category: "Capital Markets"
    },
    {
      title: "GTM 0-1 Fyxed",
      description: "Built and executed go-to-market strategy from ground zero, establishing market presence and driving customer acquisition.",
      icon: Target,
      category: "Strategy & Execution"
    }
  ];

  const keyMetrics = [
    { label: "Total Transaction Value", value: "$10.8B+", description: "Across all deal types" },
    { label: "Companies Transformed", value: "4+", description: "Major organizational changes" },
    { label: "Years of Experience", value: "20+", description: "Executive leadership" },
    { label: "Industries Served", value: "8+", description: "Diverse sector expertise" }
  ];

  return (
    <section id="highlights" className="section-padding" style={{ background: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
          style={{ color: 'var(--primary)' }}
        >
          <h2 className="text-4xl font-bold mb-4">Career Highlights</h2>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--secondary)' }}>
            Key achievements and milestones from my executive and technical career
          </p>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {keyMetrics.map((metric, index) => (
            <div key={index} className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-xl p-6 text-center">
              <h3 className="text-3xl font-bold text-primary-600 mb-2">{metric.value}</h3>
              <p className="text-lg font-semibold text-gray-900 mb-1">{metric.label}</p>
              <p className="text-gray-600">{metric.description}</p>
            </div>
          ))}
        </motion.div>

        {/* Highlights Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {highlights.map((highlight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, rotateX: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2, type: "spring", stiffness: 80 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ 
                y: -8, 
                rotateY: 2,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
              }}
              className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 card-hover"
            >
              <div className="flex items-start mb-6">
                <div className="bg-primary-100 rounded-lg p-3 mr-4">
                  <highlight.icon className="w-8 h-8 text-primary-600" />
                </div>
                <div>
                  <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-2">
                    {highlight.category}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{highlight.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{highlight.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-gray-50 to-primary-50 rounded-2xl p-8"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Additional Achievements</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Led organizational transformation of 2,500+ FTEs",
              "Identified and resolved $50MM inventory optimization opportunity",
              "Implemented comprehensive digital transformation frameworks",
              "Established data-driven performance metrics across organizations",
              "Successfully navigated complex regulatory environments",
              "Built and scaled high-performing executive teams"
            ].map((achievement, index) => (
              <div key={index} className="flex items-center">
                <div className="w-2 h-2 bg-primary-500 rounded-full mr-3 flex-shrink-0"></div>
                <span className="text-gray-700">{achievement}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Highlights; 