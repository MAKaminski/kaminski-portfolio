import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Award } from 'lucide-react';
import ExperienceTimeline from './ExperienceTimeline';
import { jobTimeline } from '../data/experience';

const Experience: React.FC = () => {
  // Shared hover state links the Gantt rail and the role list in both directions.
  const [activeCompany, setActiveCompany] = React.useState<string | null>(null);

  const experienceQuestions = [
    {
      title: "Leadership + Culture",
      question: "Tell me about a time when your leadership directly influenced a shift in team performance or company culture. What changed and how did you approach it?",
      answer: "Led organizational transformation initiatives that resulted in measurable improvements in team productivity and cultural alignment. Implemented data-driven performance metrics and transparent communication channels that fostered accountability and collaboration across departments."
    },
    {
      title: "Finance + Strategic Decision Making",
      question: "How have you used financial data to make a tough operational or investment decision? What metrics mattered most to you, and what was the outcome?",
      answer: "At HD Supply, I reorganized our largest business unit containing 2,500 FTEs from San Diego to Atlanta. I analyzed inventory and sales plans, identifying $50MM of excess on-hand inventory. By analyzing sales trends and salvage options, we created plans to maximize salvage value while rationalizing product offerings. Key metrics included liquidation of slow-moving inventory, $ sales per week per SKU, $ on-hand inventory, and gross margin % per SKU."
    },
    {
      title: "PE Reporting & Quality of Earnings",
      question: "Describe your experience with PE sponsor reporting and quality of earnings analysis. What frameworks did you implement?",
      answer: "Led comprehensive PE reporting for Bain Capital, Carlyle Group, and Clayton Dubilier & Rice. Implemented Quality of Earnings frameworks including normalized EBITDA analysis, working capital optimization, and cash flow quality assessment. Developed board presentation templates with executive dashboards, KPI tracking, and variance analysis. Created user stories for reporting automation and delivered Property Peak @ Superior and Credit Reporting @ Momnt platforms."
    },
    {
      title: "Technology Implementation + Change Management",
      question: "Describe your experience leading a digital or system transformation (ERP, CRM, automation, etc.). How did you gain internal buy-in and ensure adoption across departments?",
      answer: "Led comprehensive digital transformations across multiple organizations using a proven CBA Framework. Successfully implemented ERP systems, CRM platforms, and automation solutions while managing change through clear communication, training programs, and measurable ROI tracking. Focused on financial benefits, technology implementation, and CAPEX framework alignment."
    },
    {
      title: "Organizational Alignment + Operational Execution",
      question: "How do you prioritize competing business needs—people, process, profitability—especially during periods of change or growth?",
      answer: "Create a plan that allows for balanced growth of each area, providing capacity for changing requirements while clearly prioritizing goals. When timelines or resources are impacted, priorities remain clear through transparent communication and data-driven decision making."
    },
    {
      title: "Vision + Business Evolution",
      question: "What's a moment in your career when you saw a market shift coming and positioned your team or company ahead of it? What did that look like in practice?",
      answer: "Successfully identified and capitalized on market opportunities through strategic positioning and proactive team development. Led initiatives that positioned organizations for growth in emerging markets and technology trends."
    }
  ];

  return (
    <section id="experience" className="section-padding" style={{ background: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
          style={{ color: 'var(--primary)' }}
        >
          <h2 className="display text-4xl md:text-5xl mb-4 text-white">Experience &amp; <span className="accent">Leadership</span></h2>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--secondary)' }}>
            Proven track record in executive leadership, strategic decision-making, and organizational transformation with 20+ years of experience
          </p>
        </motion.div>

        {/* Job Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="rilla-card p-8 mb-12"
        >
          <h3 className="display text-2xl mb-6 text-white">Professional <span className="accent">Timeline</span></h3>

          <div className="flex items-stretch gap-6">
            {/* Gantt rail. Hidden below md, where there isn't room for it to be
                legible — the dated list alone carries the information there. */}
            <ExperienceTimeline
              className="hidden md:block w-[150px] flex-shrink-0 lg:w-[190px]"
              activeCompany={activeCompany}
              onHover={setActiveCompany}
            />

            <div className="min-w-0 flex-1 space-y-3">
              {jobTimeline.map((job, index) => {
                const isActive = activeCompany === job.company;
                return (
                  <motion.div
                    key={job.company}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.06 }}
                    viewport={{ once: true }}
                    onMouseEnter={() => setActiveCompany(job.company)}
                    onMouseLeave={() => setActiveCompany(null)}
                    className={`flex items-start space-x-4 rounded-lg border-l-2 p-4 transition-colors duration-200 ${
                      isActive ? 'bg-white/5' : 'hover:bg-white/5'
                    }`}
                    style={{ borderLeftColor: job.color }}
                  >
                    <div className="w-24 flex-shrink-0 text-sm font-medium tabular-nums text-white/50">
                      {job.period}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">{job.title}</h4>
                      {job.link ? (
                        <a
                          href={job.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block font-medium text-accent underline-offset-2 hover:underline"
                        >
                          {job.company}
                        </a>
                      ) : (
                        <p className="font-medium text-accent">{job.company}</p>
                      )}
                      <p className="text-white/60 text-sm mt-1">{job.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Education */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="rilla-card p-8 mb-12"
        >
          <div className="flex items-center mb-6">
            <GraduationCap className="w-8 h-8 mr-3 text-accent" />
            <h3 className="display text-2xl text-white">Education</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border-l-4 border-accent pl-6">
              <h4 className="text-lg font-semibold text-white">Masters of Business Administration</h4>
              <p className="text-white/60">Georgia State University</p>
              <p className="text-white/50">2011</p>
            </div>
            <div className="border-l-4 border-accent pl-6">
              <h4 className="text-lg font-semibold text-white">Bachelors of Computer Science</h4>
              <p className="text-white/60">DeVry University</p>
              <p className="text-white/50">2008</p>
            </div>
          </div>
        </motion.div>

        {/* Experience Questions */}
        <div className="space-y-8">
          {experienceQuestions.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: index * 0.15, type: "spring", stiffness: 100 }}
              viewport={{ once: true, margin: "-100px" }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="rilla-card p-8 card-hover"
            >
              <div className="flex items-start mb-4">
                <Award className="w-6 h-6 mr-3 mt-1 flex-shrink-0 text-accent" />
                <div>
                  <h3 className="display text-xl text-white mb-2">{item.title}</h3>
                  <p className="text-white/60 mb-4 italic">"{item.question}"</p>
                  <p className="text-white/80 leading-relaxed">{item.answer}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience; 