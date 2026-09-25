import React, { useState } from 'react';
import { jobTimeline, type Job } from '../data/experience';
import { ChevronDown, GraduationCap } from 'lucide-react';
import { track } from '../utils/track';
import { useSectionView } from '../hooks/useSectionView';

// Most recent roles shown up front; the rest of the timeline is one click away.
const ROLES_SHOWN = 4;

/**
 * Initials for roles without a mark, from the name before any "/":
 * "Property Walk" -> "PW", "ModularEquity / MEK Capital" -> "ME".
 */
const initials = (company: string) => {
  const name = company.split('/')[0].trim();
  const caps = name.match(/[A-Z]/g) || [];
  return (caps.length >= 2 ? caps : name.split(/\s+/).map((w) => w[0].toUpperCase())).slice(0, 2).join('');
};

/** The employer's logo, above the title on phones and in a fixed 120px column from sm up (initials when there is none), linked out when it has a site. */
const EmployerMark: React.FC<{ job: Job }> = ({ job }) => {
  const mark = job.logo ? (
    <img
      src={job.logo.src}
      alt=""
      width={job.logo.width}
      height={job.logo.height}
      loading="lazy"
      decoding="async"
      className="h-auto max-h-8 max-w-full opacity-70 transition duration-300 group-hover/mark:opacity-100"
    />
  ) : (
    <span className="flex h-8 w-8 items-center justify-center rounded-md border border-white/15 text-xs font-bold text-white/60 transition group-hover/mark:border-accent/60 group-hover/mark:text-white">
      {initials(job.company)}
    </span>
  );
  const box = 'group/mark flex h-8 max-w-[120px] flex-shrink-0 items-center sm:w-[120px] sm:justify-end';
  return job.link ? (
    <a
      href={job.link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${job.company} website`}
      onClick={() => track('Employer Link Clicked', { company: job.company, placement: 'logo' })}
      className={box}
    >
      {mark}
    </a>
  ) : (
    <span className={box} aria-hidden="true">
      {mark}
    </span>
  );
};

const Experience: React.FC = () => {
  const ref = useSectionView<HTMLElement>('experience');
  const [showAll, setShowAll] = useState(false);
  const [openQ, setOpenQ] = useState<number | null>(null);
  const roles = showAll ? jobTimeline : jobTimeline.slice(0, ROLES_SHOWN);

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


  const toggleAll = () => {
    if (!showAll) track('Section Expanded', { section: 'experience', item: 'full_timeline' });
    setShowAll((v) => !v);
  };

  const toggleQ = (i: number) => {
    if (openQ !== i) track('Section Expanded', { section: 'experience', item: experienceQuestions[i].title });
    setOpenQ(openQ === i ? null : i);
  };

  return (
    <section ref={ref} id="experience" className="section-padding scroll-mt-20" style={{ background: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h2 className="display text-4xl md:text-5xl text-white">
            Experience &amp; <span className="accent">leadership</span>
          </h2>
          <p className="mt-3 text-lg text-white/60 max-w-2xl">
            20+ years across finance and engineering, from PE-backed operators to the agent layer.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Timeline */}
          <div className="min-w-0 lg:col-span-3">
            <ol className="rilla-card divide-y divide-white/10">
              {roles.map((job) => (
                <li key={`${job.company}-${job.period}`} className="flex gap-4 p-5 transition-colors duration-300 hover:bg-white/[0.03]">
                  <div className="w-24 flex-shrink-0 text-sm font-medium text-white/50">{job.period}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-white">{job.title}</h3>
                        {job.link ? (
                          <a
                            href={job.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => track('Employer Link Clicked', { company: job.company, placement: 'name' })}
                            className="text-sm font-medium text-accent underline-offset-2 hover:underline"
                          >
                            {job.company}
                          </a>
                        ) : (
                          <p className="text-sm font-medium text-accent">{job.company}</p>
                        )}
                      </div>
                      <EmployerMark job={job} />
                    </div>
                    <p className="mt-1 text-sm text-white/60">{job.description}</p>
                  </div>
                </li>
              ))}
            </ol>
            <button
              type="button"
              onClick={toggleAll}
              aria-expanded={showAll}
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline underline-offset-4"
            >
              {showAll ? 'Show fewer roles' : `Show all ${jobTimeline.length} roles`}
              <ChevronDown className={`w-4 h-4 transition-transform ${showAll ? 'rotate-180' : ''}`} />
            </button>

            <div className="mt-6 flex items-start gap-3 text-sm text-white/70">
              <GraduationCap className="w-5 h-5 flex-shrink-0 text-accent" />
              <p>
                <span className="font-semibold text-white">MBA</span>, Georgia State University (2011) ·{' '}
                <span className="font-semibold text-white">BS Computer Science</span>, DeVry University (2008)
              </p>
            </div>
          </div>

          {/* Interview answers, collapsed */}
          <div className="lg:col-span-2">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-white/50">
              How I work
            </h3>
            <div className="rilla-card divide-y divide-white/10">
              {experienceQuestions.map((item, i) => (
                <div key={item.title}>
                  <button
                    type="button"
                    onClick={() => toggleQ(i)}
                    aria-expanded={openQ === i}
                    className="flex w-full items-center justify-between gap-3 p-4 text-left hover:bg-white/[0.03]"
                  >
                    <span className="font-semibold text-white">{item.title}</span>
                    <ChevronDown
                      className={`w-4 h-4 flex-shrink-0 text-accent transition-transform ${openQ === i ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {openQ === i && (
                    <div className="px-4 pb-4 text-sm">
                      <p className="italic text-white/55">"{item.question}"</p>
                      <p className="mt-2 leading-relaxed text-white/80">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
