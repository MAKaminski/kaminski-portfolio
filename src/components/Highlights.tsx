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

  // The four "key metric" tiles that used to sit here are gone. "$10.8B+"
  // contradicted the deal table two sections down (which sums to $11.2B), and
  // "Companies Transformed 4+" / "Industries Served 8+" had no definition
  // behind them at all. The deal table is the sourced version of this claim.

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
          <h2 className="display text-4xl md:text-5xl mb-4 text-white">Career <span className="accent">Highlights</span></h2>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--secondary)' }}>
            Key achievements and milestones from my executive and technical career
          </p>
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
              className="rilla-card p-8 card-hover"
            >
              <div className="flex items-start mb-6">
                <div className="rounded-lg border border-accent/25 bg-accent/10 p-3 mr-4">
                  <highlight.icon className="w-8 h-8 text-accent" />
                </div>
                <div>
                  <span className="inline-block px-3 py-1 rounded-full border border-white/15 bg-white/5 text-sm font-medium text-accent mb-2">
                    {highlight.category}
                  </span>
                  <h3 className="text-xl font-bold text-white mb-3">{highlight.title}</h3>
                  <p className="text-white/70 leading-relaxed">{highlight.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Highlights; 