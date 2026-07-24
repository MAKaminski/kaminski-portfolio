import React from 'react';
import { motion } from 'framer-motion';
import { Target, Search, TrendingUp, MessageCircle, CheckCircle, ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import Seo from '../components/Seo';
import Header from '../components/Header';

const ClientOutcomes: React.FC = () => {
  const [openAccordion, setOpenAccordion] = React.useState<number | null>(null);

  const clientPillars = [
    {
      title: "Align on the metrics that matter",
      icon: Target,
      content: "Success starts by defining what the client actually wants to achieve, whether it's operational efficiency, NPS, conversion lift, or cost reduction. We put those metrics in the contract and agree on how they'll be measured and reported.",
      details: [
        "Define clear success metrics (operational efficiency, NPS, conversion lift, cost reduction)",
        "Include metrics in contractual agreements",
        "Establish measurement and reporting frameworks",
        "Ensure alignment on what success looks like"
      ]
    },
    {
      title: "Understand what matters behind the metrics",
      icon: Search,
      content: "I go deeper to uncover what's driving those goals, such as political pressure, executive mandates, financial constraints, or personal stakes. That context allows me to proactively shape our approach, not just react to surface-level requests.",
      details: [
        "Identify underlying drivers (political pressure, executive mandates)",
        "Understand financial constraints and personal stakes",
        "Use context to proactively shape approach",
        "Move beyond surface-level requests to root causes"
      ]
    },
    {
      title: "Identify leading indicators and shifting priorities",
      icon: TrendingUp,
      content: "I monitor early signals of change, including upticks in support tickets, user adoption curves, or stakeholder sentiment, and adjust quickly. Just as importantly, I keep a pulse on when the client's priorities shift, even if the contractual metrics haven't yet.",
      details: [
        "Monitor early signals (support tickets, user adoption curves)",
        "Track stakeholder sentiment changes",
        "Adjust strategies based on leading indicators",
        "Stay alert to shifting client priorities beyond contractual metrics"
      ]
    },
    {
      title: "Communicate consistently and clearly",
      icon: MessageCircle,
      content: "I regularly interface with the client to update them on progress, surface risks early, and ensure we're always aligned. Every solution is tied to a clear timeline, and expectations are actively managed, not assumed.",
      details: [
        "Provide regular progress updates to clients",
        "Surface risks early and proactively",
        "Maintain constant alignment on objectives",
        "Tie all solutions to clear timelines",
        "Actively manage expectations rather than assume understanding"
      ]
    },
    {
      title: "Drive resolution, celebrate wins, and sustain satisfaction",
      icon: CheckCircle,
      content: "Once we solve a problem or reach a milestone, we acknowledge the win and elevate the internal champions. From there, I continue monitoring satisfaction post-resolution to ensure the fix holds and trust continues to build.",
      details: [
        "Acknowledge wins and celebrate milestones",
        "Elevate and recognize internal champions",
        "Monitor post-resolution satisfaction",
        "Ensure solutions are sustainable",
        "Build and maintain long-term trust"
      ]
    }
  ];

  const keyMetrics = [
    { label: "Client Satisfaction", value: "98%+", description: "Sustained post-project" },
    { label: "Projects Delivered", value: "50+", description: "On time & budget" },
    { label: "Client Retention", value: "95%", description: "Long-term partnerships" },
    { label: "ROI Delivered", value: "300%+", description: "Average client impact" }
  ];

  return (
    <div className="min-h-screen bg-ink-900 text-white">
      <Seo
        title="Client Outcomes & Fintech Case Studies | Michael Kaminski"
        description="Measurable client outcomes from Michael Kaminski's fintech finance-and-engineering work — turnarounds, transformations and growth for founders and PE-backed companies in Atlanta and beyond."
        canonicalPath="/client-outcomes"
        breadcrumbName="Client Outcomes"
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
          <h2 className="display text-5xl text-white mb-6">Delivering Meaningful <span className="accent">Client Outcomes</span></h2>
          <p className="text-xl text-white/60 max-w-4xl mx-auto leading-relaxed">
            To deliver meaningful client outcomes, I focus on five core pillars that ensure 
            sustainable success, lasting partnerships, and measurable impact.
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

        {/* Five Pillars Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rilla-card p-8 mb-16"
        >
          <h3 className="text-3xl font-bold mb-8 text-center text-white">Five Pillars of Client Success</h3>
          <div className="space-y-4">
            {clientPillars.map((pillar, index) => (
              <div key={index} className="border border-white/10 rounded-xl overflow-hidden">
                <button
                  className="w-full flex items-center justify-between px-6 py-6 focus:outline-none text-left hover:bg-white/5 transition-colors duration-200"
                  onClick={() => setOpenAccordion(openAccordion === index ? null : index)}
                  aria-expanded={openAccordion === index}
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-white/10 rounded-lg p-3">
                      <pillar.icon className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-white">{index + 1}. {pillar.title}</h4>
                    </div>
                  </div>
                  {openAccordion === index ? (
                    <ChevronUp className="w-5 h-5 text-accent flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-accent flex-shrink-0" />
                  )}
                </button>
                {openAccordion === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-6 border-t border-white/10"
                  >
                    <div className="pt-4">
                      <p className="text-white/80 text-lg leading-relaxed mb-6">{pillar.content}</p>
                      <div className="space-y-3">
                        {pillar.details.map((detail, detailIndex) => (
                          <div key={detailIndex} className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-white/60 leading-relaxed">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="rilla-card p-8 text-center text-white"
        >
          <h3 className="text-2xl font-bold mb-4">Ready to Achieve <span className="accent">Meaningful Outcomes</span>?</h3>
          <p className="text-white/60 mb-6 max-w-2xl mx-auto">
            Let's discuss how these five pillars can drive sustainable success and
            measurable impact for your organization.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://calendly.com/kaminski1337/15min"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pill-accent"
            >
              <Calendar className="w-5 h-5 mr-2" />
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
    </div>
  );
};

export default ClientOutcomes;