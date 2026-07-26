/**
 * Skills data, shared by the condensed homepage overview (`components/Skills`)
 * and the full breakdown at /skills (`pages/SkillsPage`).
 *
 * Keeping it here means the two surfaces can never drift apart — the homepage
 * highlights are derived from the same source as the full listing.
 */

export interface SkillCategory {
  title: string;
  /** Lucide icon name, resolved by the rendering component. */
  icon: 'code' | 'database' | 'cloud' | 'chart' | 'settings' | 'globe' | 'award' | 'brain';
  skills: string[];
  gradient: string;
}

export interface SpecializedArea {
  title: string;
  icon: 'code' | 'database' | 'cloud' | 'chart' | 'settings' | 'globe' | 'award' | 'brain';
  items: string[];
  gradient: string;
}

/** Technical / tooling breadth. */
export const skillCategories: SkillCategory[] = [
  {
    title: 'Languages',
    icon: 'code',
    skills: ['SQL', 'Python', 'TypeScript', 'JavaScript', 'Java', 'C#', 'Swift', 'R', 'Rust', 'Bash', 'HogQL'],
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    title: 'Backend & APIs',
    icon: 'database',
    skills: ['Node.js', 'FastAPI', 'GraphQL', 'REST', 'Prisma', 'Serverless Functions', 'Webhooks', 'OAuth 2.0'],
    gradient: 'from-teal-500 to-cyan-500',
  },
  {
    title: 'Databases & Storage',
    icon: 'database',
    skills: ['PostgreSQL', 'Supabase', 'NeonDB', 'MongoDB', 'Redis', 'ClickHouse', 'Pinecone', 'pgvector'],
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    title: 'Frontend',
    icon: 'code',
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'React Router', 'Vite', 'Canvas API', 'Responsive & A11y'],
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    title: 'Cloud & DevOps',
    icon: 'cloud',
    skills: ['AWS', 'GCP', 'Vercel', 'Cloudflare', 'Docker', 'Kubernetes', 'GitHub Actions', 'CI/CD', 'CodeQL', 'Secret Scanning'],
    gradient: 'from-sky-500 to-blue-500',
  },
  {
    title: 'Data & Analytics Engineering',
    icon: 'chart',
    skills: ['Snowflake', 'BigQuery', 'Redshift', 'Airflow', 'dbt', 'Fivetran', 'Tableau', 'Power BI', 'Looker'],
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    title: 'AI, LLMs & Agents',
    icon: 'brain',
    skills: ['Claude', 'Claude Code', 'Claude Agent SDK', 'OpenAI', 'MCP', 'LangChain', 'Cursor', 'RAG', 'Prompt Engineering', 'Whisper', 'Hugging Face', 'TensorFlow', 'PyTorch'],
    gradient: 'from-fuchsia-500 to-pink-500',
  },
  {
    title: 'Product Analytics & Growth',
    icon: 'chart',
    skills: ['PostHog', 'Google Analytics 4', 'Vercel Analytics', 'Mixpanel', 'Amplitude', 'Segment', 'Ahrefs', 'Google Search Console', 'SEO / AEO', 'Session Replay', 'Funnel & Cohort Analysis'],
    gradient: 'from-orange-500 to-red-500',
  },
  {
    title: 'Fintech & Payments Infrastructure',
    icon: 'settings',
    skills: ['Plaid', 'Stripe', 'Interactive Brokers API', 'Card Networks', 'ACH / NACHA', 'Loan Origination', 'Loan Servicing', 'Collections Systems', 'IVR'],
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'ERP & Financial Systems',
    icon: 'settings',
    skills: ['NetSuite', 'SAP S/4HANA', 'Oracle Hyperion', 'QuickBooks', 'Ramp', 'Brex', 'Workday', 'Excel / Financial Modeling'],
    gradient: 'from-indigo-500 to-blue-500',
  },
  {
    title: 'Product & Collaboration',
    icon: 'settings',
    skills: ['Jira', 'Confluence', 'Linear', 'Notion', 'Monday.com', 'Airtable', 'Figma', 'Lucid', 'Canva', 'Gamma', 'Shopify', 'Resend'],
    gradient: 'from-indigo-500 to-violet-500',
  },
  {
    title: 'Native & Systems',
    icon: 'code',
    skills: ['SwiftUI', 'WidgetKit', 'IOKit', 'launchd', 'macOS Internals', 'ffmpeg', 'Vision OCR'],
    gradient: 'from-slate-500 to-gray-600',
  },
];

/** Domain depth — the finance-and-regulation side of the profile. */
export const specializedAreas: SpecializedArea[] = [
  {
    title: 'Systems Architecture',
    icon: 'database',
    items: ['Core banking systems', 'Payment processors', 'Loan servicing platforms', 'IVR', 'Event-driven architecture', 'Data warehousing'],
    gradient: 'from-blue-600 to-cyan-600',
  },
  {
    title: 'Accounting & Financial Standards',
    icon: 'chart',
    items: ['ASC 606 (Revenue Recognition)', 'ASC 842 (Leases)', 'ASC 326 (Credit Losses / CECL)', 'ASC 815 (Derivatives)', 'ASC 820 (Fair Value)', 'GAAP', 'IFRS', 'SOX Compliance'],
    gradient: 'from-green-600 to-emerald-600',
  },
  {
    title: 'Compliance & Security',
    icon: 'settings',
    items: ['SOC 1 & SOC 2 Readiness', 'GDPR', 'CCPA', "Basel Principles for Operational Resilience", 'SEC / FINRA', 'OCC', 'Reg X', 'Reg Z', 'NACHA', 'UDAAP', 'SCRA', 'FCRA', 'MERS'],
    gradient: 'from-red-600 to-pink-600',
  },
  {
    title: 'Treasury & Markets',
    icon: 'award',
    items: ['Treasury operations', 'FX management', 'Share repurchases', 'Market execution', 'VaR', 'VWAP', 'Options strategy', 'Portfolio margin'],
    gradient: 'from-purple-600 to-violet-600',
  },
  {
    title: 'Transaction Experience',
    icon: 'globe',
    items: ['Acquisitions', 'M&A advisory', 'Global markets', 'Equity & debt capital markets', 'IPO readiness (S-1)', 'Asset-based lending', 'Asset-backed securitization (non-mortgage, 144A)', 'Quality of earnings'],
    gradient: 'from-orange-600 to-red-600',
  },
  {
    title: 'Leadership & Operating',
    icon: 'award',
    items: ['Fractional CFO / CTO', 'Engineering leadership', 'Product management', 'Agile / Scrum', 'Org design & restructuring', 'Vendor & partner management', 'Board & investor reporting'],
    gradient: 'from-amber-600 to-orange-600',
  },
];

/**
 * The homepage cut — the handful of headline capabilities worth a recruiter's
 * first ten seconds. Everything else lives on /skills.
 */
export const topSkills: { label: string; detail: string; icon: SkillCategory['icon'] }[] = [
  {
    label: 'Finance + Engineering',
    detail: 'PE-grade finance and hands-on full-stack engineering in one person',
    icon: 'award',
  },
  {
    label: 'Fintech & Payments',
    detail: 'Lending, card rails, collections, and the systems underneath them',
    icon: 'settings',
  },
  {
    label: 'AI & Agents',
    detail: 'Claude, MCP, agent tooling, and RAG shipped into production',
    icon: 'brain',
  },
  {
    label: 'Data & Analytics',
    detail: 'Warehouses, pipelines, and product analytics end to end',
    icon: 'chart',
  },
];

export const totalSkillCount =
  skillCategories.reduce((n, c) => n + c.skills.length, 0) +
  specializedAreas.reduce((n, a) => n + a.items.length, 0);
