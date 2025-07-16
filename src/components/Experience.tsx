import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Award } from 'lucide-react';

const Experience: React.FC = () => {
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

  const jobTimeline = [
    {
      company: "Fyxed""
      title: "Interim CEO",
      period: "2025 - 2025",
      description: "Interim CEO of Fyxed, a fintech company that provides a platform for small businesses to manage their finances.",
      link: "https://www.fyxed.com/",
      exit: "Established GTM strategy, built product, hired team, and scaled to $50k MRR"
    },
    {
      company: "Momnt",
      title: "Senior Manager, Product Engineering",
      period: "2023 - 2025",
      description: "Fintech platform development and credit reporting systems",
      link: "https://www.momnt.com/",
      exit: "Launched credit reporting, accounting engine product owner, departed after founders left - culture change"
    },
    {
      company: "Property Walk",
      title: "Founder",
      period: "October 2022 - July 2023",
      description: "Founder of Property Walk, a real estate technology company that provides a platform for property managers to reduce service calls and overbillings of residential home services.",
      exit: "5k MRR, PMF not found"
    },
    {
      company: "Superior Contracting & Maintenance",
      title: "Co-Founder",
      period: "2018 - 2023",
      description: "Co-founder of Superior Contracting & Maintenance, a construction company that provides services to the residential and commercial sectors.",
      link: "https://www.superior-maintenance.com",
      exit: "Installed CEO & NetSuite ERP, left to focus on high-growth fintech"
    },
    {
      company: "GreenSky",
      title: "Product Manager, Credit & Strategy",
      period: "2016 - 2018",
      description: "Product management and strategy for the GreenSky credit platform",
      link: "https://www.greensky.com/",
      exit: "Post IPO, left to found Residential Services company with brother"
    },
    {
      company: "HD Supply",
      title: "Senior Analyst, Strategic Finance",
      period: "2015 - 2016",
      description: "Divestiture transactions and operational transformation",
      link: "https://www.hdsupply.com/",
      exit: "Post 2,500 FTE restructuring, changed focus to grow revenue, rather than enhance margins through OpEx cost out"
    },
    {
      company: "KPMG",
      title: "Senior Consultant, Advisory Services",
      period: "2014 - 2015",
      description: "Dispute advisory services, tax structuring, & data analytics",
      link: "https://www.kpmg.com/",
      exit: "Found wife in consulting, left for M&A work @ HD Supply"
    },
    {
      company: "ModularEquity / MEK Capital",
      title: "Founder, Managing Partner",
      period: "2011 - 2025",
      description: "Long-Only diversified investments across PE, Real Estate, Equities, & Debt, managing $3mm in capital",
      link: "https://www.modularequity.com/",
      exit: "Active Management"
    },
    {
      company: "Home Depot",
      title: "Senior Analyst, Merchandising Finance & Treasury",
      period: "2011 - 2014",
      description: "Share repurchase programs and financial strategy",
      link: "https://www.modularequity.com/",
      exit: "Departed to obtian diversified experiences within other companies/industries"
    },
    {
      company: "Chorus",
      title: "Full Stack Intern",
      period: "2009 - 2009",
      description: "Generate social media app, with a focus on user experience and engagement",
      exit: "Internship ended"
    },
    {
      company: "Two Brothers Landscaping",
      title: "Founder",
      period: "2007 - 2011",
      description: "Co-founder of Two Brothers Landscaping, a landscaping company that provides services to the residential and commercial sectors.",
      exit: "Exited for $50k to focus on asset management"
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
          <h2 className="text-4xl font-bold mb-4">Experience & Leadership</h2>
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
          className="bg-white rounded-2xl shadow-lg p-8 mb-12"
        >
          <h3 className="text-2xl font-bold mb-6" style={{ color: 'var(--primary)' }}>Professional Timeline</h3>
          <div className="space-y-4">
            {jobTimeline.map((job, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex-shrink-0 w-24 text-sm font-medium text-gray-500">{job.period}</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{job.title}</h4>
                  <p className="text-primary-600 font-medium">{job.company}</p>
                  <p className="text-gray-600 text-sm mt-1">{job.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Education */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-12"
        >
          <div className="flex items-center mb-6">
            <GraduationCap className="w-8 h-8 mr-3" style={{ color: 'var(--primary)' }} />
            <h3 className="text-2xl font-bold text-gray-900">Education</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border-l-4 pl-6" style={{ borderColor: 'var(--primary)' }}>
              <h4 className="text-lg font-semibold text-gray-900">Masters of Business Administration</h4>
              <p className="text-gray-600">Georgia State University</p>
              <p className="text-gray-500">2011</p>
            </div>
            <div className="border-l-4 pl-6" style={{ borderColor: 'var(--primary)' }}>
              <h4 className="text-lg font-semibold text-gray-900">Bachelors of Computer Science</h4>
              <p className="text-gray-600">DeVry University</p>
              <p className="text-gray-500">2008</p>
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
              className="bg-white rounded-2xl shadow-lg p-8 card-hover"
            >
              <div className="flex items-start mb-4">
                <Award className="w-6 h-6 mr-3 mt-1 flex-shrink-0" style={{ color: 'var(--primary)' }} />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 mb-4 italic">"{item.question}"</p>
                  <p className="text-gray-700 leading-relaxed">{item.answer}</p>
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