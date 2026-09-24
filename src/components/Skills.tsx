import React from 'react';
import { Code, Database, Cloud, BarChart3, Settings, Globe, ChevronDown, Award } from 'lucide-react';
import TechLogo from './TechLogos';
import { track } from '../utils/track';
import { useSectionView } from '../hooks/useSectionView';

const Skills: React.FC = () => {
  const ref = useSectionView<HTMLElement>('skills');
  // All collapsed: the tool list is the skim, the domain depth is on request.
  const [openAccordion, setOpenAccordion] = React.useState<number | null>(null);
  
  // Editorial cut: consolidated to the highest-signal categories for a
  // fintech finance + engineering hire (was 29 exhaustive lists).
  const skillCategories = [
    {
      title: "Languages",
      icon: Code,
      skills: ["SQL", "Python", "TypeScript", "Java", "C#", "R", "Rust"],
      gradient: "from-pink-500 to-rose-500"
    },
    {
      title: "Backend & Databases",
      icon: Database,
      skills: ["Node.js", "FastAPI", "PostgreSQL", "Redis", "GraphQL", "Supabase", "NeonDB", "Prisma", "MongoDB", "Pinecone", "pgvector"],
      gradient: "from-teal-500 to-cyan-500"
    },
    {
      title: "Frontend",
      icon: Code,
      skills: ["React", "TypeScript", "Tailwind"],
      gradient: "from-violet-500 to-purple-500"
    },
    {
      title: "Cloud & DevOps",
      icon: Cloud,
      skills: ["AWS", "GCP", "Docker", "Kubernetes", "Serverless", "Vercel", "GitHub", "GitHub Actions"],
      gradient: "from-sky-500 to-blue-500"
    },
    {
      title: "Data & Analytics",
      icon: BarChart3,
      skills: ["Snowflake", "BigQuery", "Redshift", "Airflow", "dbt", "Fivetran", "Tableau", "Power BI", "Looker"],
      gradient: "from-purple-500 to-pink-500"
    },
    {
      title: "AI & ML",
      icon: Code,
      skills: ["OpenAI", "Claude", "Claude Code", "Cursor", "DeepSeek", "Kimi", "LangChain", "MCP", "Hugging Face", "TensorFlow", "PyTorch"],
      gradient: "from-fuchsia-500 to-pink-500"
    },
    {
      title: "ERP & Financial Systems",
      icon: Settings,
      skills: ["NetSuite", "SAP S/4HANA", "Oracle Hyperion", "QuickBooks", "Ramp", "Brex", "Plaid", "Stripe", "Interactive Brokers"],
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "SEO & Growth Analytics",
      icon: BarChart3,
      skills: ["Ahrefs", "Google Search Console", "Google Analytics", "PostHog", "Mixpanel", "Amplitude", "Segment", "HubSpot", "Salesforce"],
      gradient: "from-orange-500 to-red-500"
    },
    {
      title: "Product & Collaboration",
      icon: Settings,
      skills: ["Jira", "Confluence", "Linear", "Notion", "Monday.com", "Airtable", "Figma", "Lucid", "Canva", "Gamma", "Resend", "Shopify"],
      gradient: "from-indigo-500 to-violet-500"
    },
  ];

  const specializedAreas = [
    {
      title: "Systems Architecture",
      icon: Database,
      items: ["Core banking systems", "Payment processors", "IVR"],
      gradient: "from-blue-600 to-cyan-600"
    },
    {
      title: "Accounting & Financial Standards",
      icon: BarChart3,
      items: ["ASC 606 (Revenue Recognition)", "ASC 842 (Leases)", "ASC 326 (Credit Losses)", "ASC 815 (Derivatives)", "ASC 820 (Fair Value)", "GAAP", "IFRS", "SOX Compliance"],
      gradient: "from-green-600 to-emerald-600"
    },
    {
      title: "Compliance & Security",
      icon: Settings,
      items: ["SOC 1 & SOC 2 Readiness", "SOC Compliance", "GDPR", "CCPA", "Basel's Principles for Operational Resilience", "SEC/FINRA", "OCC", "Reg X", "Reg Z", "NACHA", "UDAAP", "SCRA", "FCRA", "MERS"],
      gradient: "from-red-600 to-pink-600"
    },
    {
      title: "Financial Expertise",
      icon: Award,
      items: ["Treasury", "FX Management", "Share Repurchases", "Market Execution", "VaR", "VWAP"],
      gradient: "from-purple-600 to-violet-600"
    },
    {
      title: "Transaction Experience",
      icon: Globe,
      items: ["Acquisitions", "M&A Advisory", "Global Markets", "Equity & Debt Capital markets", "IPO Readiness (S1)", "Asset Based Lending", "Asset Backed Securitization (Non-Mortgage) (144A)"],
      gradient: "from-orange-600 to-red-600"
    }
  ];

  const toggle = (i: number) => {
    if (openAccordion !== i) track('Section Expanded', { section: 'skills', item: specializedAreas[i].title });
    setOpenAccordion(openAccordion === i ? null : i);
  };

  return (
    <section ref={ref} id="skills" className="section-padding scroll-mt-20" style={{ background: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h2 className="display text-4xl md:text-5xl text-white">
            Skills &amp; <span className="accent">expertise</span>
          </h2>
          <p className="mt-3 text-lg text-white/60 max-w-2xl">
            The stack I ship with, and the finance and compliance depth behind it.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Tools, one row per category */}
          <dl className="lg:col-span-3 rilla-card divide-y divide-white/10">
            {skillCategories.map((category) => (
              <div key={category.title} className="grid gap-2 p-4 sm:grid-cols-[10rem_1fr] sm:gap-4">
                <dt className="flex items-center gap-2 text-sm font-semibold text-white">
                  <category.icon className="w-4 h-4 text-accent" />
                  {category.title}
                </dt>
                <dd className="flex flex-wrap gap-1.5">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs font-medium text-white/80"
                    >
                      <TechLogo name={skill} className="w-3.5 h-3.5" />
                      {skill}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>

          {/* Domain depth, collapsed */}
          <div className="lg:col-span-2">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-white/50">
              Specialized expertise
            </h3>
            <div className="rilla-card divide-y divide-white/10">
              {specializedAreas.map((area, i) => (
                <div key={area.title}>
                  <button
                    type="button"
                    onClick={() => toggle(i)}
                    aria-expanded={openAccordion === i}
                    className="flex w-full items-center justify-between gap-3 p-4 text-left hover:bg-white/[0.03]"
                  >
                    <span className="flex items-center gap-3">
                      <area.icon className="w-4 h-4 text-accent" />
                      <span className="font-semibold text-white">{area.title}</span>
                      <span className="text-xs text-white/45">{area.items.length}</span>
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 flex-shrink-0 text-accent transition-transform ${openAccordion === i ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {openAccordion === i && (
                    <ul className="flex flex-wrap gap-1.5 px-4 pb-4">
                      {area.items.map((item) => (
                        <li
                          key={item}
                          className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs font-medium text-white/80"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
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

export default Skills;
