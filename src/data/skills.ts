// PRERENDER CONTRACT — scripts/prerender.js slices this file between
//   `export const skillCategories: SkillCategory[] =`  and  `export const specializedAreas`
// and again between
//   `export const specializedAreas: SpecializedArea[] =`  and  `export const skillCount`
// and evaluates each slice as plain JavaScript. Inside the array literals:
//   no imports, no identifiers from other modules, no `as const`,
//   no enums / satisfies / type assertions, no template literals that
//   interpolate anything — plain string literals only.
// Helpers and anything clever go BELOW the `export const skillCount` sentinel.

/**
 * The tool stack, in two tiers per category.
 *
 * `core` is the editorial cut: what a hiring manager should see at a glance.
 * `more` is everything else actually used, kept because a skills section is a
 * search surface as much as a résumé line — a recruiter searching "dbt
 * Snowflake Terraform" should land here — but collapsed so the page still
 * reads. Both tiers are rendered into the DOM on the home page and into the
 * prerendered HTML in scripts/prerender.js, so nothing here is invisible to a
 * crawler; `more` is merely hidden until a reader asks for it.
 *
 * Rules for adding to `more`: it has to be something actually shipped with or
 * operated, not something read about. Icons come from src/data/techLogos.ts
 * (scripts/fetch-tech-logos.js); a name without an icon renders as text.
 */
export interface SkillCategory {
  title: string;
  core: string[];
  more: string[];
}

export interface SpecializedArea {
  title: string;
  items: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    title: "Languages",
    core: ["SQL", "Python", "TypeScript", "Java", "C#", "R", "Rust"],
    more: ["Bash", "PHP", "HTML", "CSS", "VBA", "YAML"],
  },
  {
    title: "Backend & Databases",
    core: ["Node.js", "FastAPI", "PostgreSQL", "Redis", "GraphQL", "Supabase", "NeonDB", "Prisma", "MongoDB", "Pinecone", "pgvector"],
    more: ["Express", "Django", "Flask", "MySQL", "SQLite", "MariaDB", "Microsoft SQL Server", "Oracle", "Elasticsearch", "Neo4j", "Cassandra", "Firebase", "Milvus", "Weaviate", "Pydantic", "Jest", "Pytest", "Postman", "OpenAPI"],
  },
  {
    title: "Frontend",
    core: ["React", "TypeScript", "Tailwind"],
    more: ["Next.js", "Vite", "Framer Motion", "Playwright", "Webflow", "WordPress"],
  },
  {
    title: "Cloud & DevOps",
    core: ["AWS", "GCP", "Docker", "Kubernetes", "Serverless", "Vercel", "GitHub", "GitHub Actions"],
    more: ["Terraform", "Cloudflare", "Railway", "Render", "AWS Lambda", "Nginx", "Linux", "Git", "Datadog", "Sentry", "Grafana", "SFTP", "PGP/GPG encryption"],
  },
  {
    title: "Data & Analytics",
    core: ["Snowflake", "BigQuery", "Redshift", "Airflow", "dbt", "Fivetran", "Tableau", "Power BI", "Looker"],
    more: ["Metabase", "ClickHouse", "QlikView", "Apache NiFi", "Apache Spark", "PySpark", "Kafka", "Dask", "Pandas", "NumPy", "SciPy", "Jupyter", "Plotly", "Matplotlib", "Seaborn", "Streamlit", "Parquet", "Excel"],
  },
  {
    title: "AI & ML",
    core: ["OpenAI", "Claude", "Claude Code", "Cursor", "DeepSeek", "Kimi", "LangChain", "MCP", "Hugging Face", "TensorFlow", "PyTorch"],
    more: ["Anthropic API", "Gemini", "Perplexity", "Ollama", "LangGraph", "LlamaIndex", "ElevenLabs", "scikit-learn", "NLTK", "OpenCV", "Tesseract", "FFmpeg", "Transformers", "Text embeddings", "RAG", "Reinforcement learning", "Transfer learning", "n8n", "Zapier", "Make"],
  },
  {
    title: "ERP & Financial Systems",
    core: ["NetSuite", "SAP S/4HANA", "Oracle Hyperion", "QuickBooks", "Ramp", "Brex", "Plaid", "Stripe", "Interactive Brokers"],
    more: ["Microsoft Dynamics", "Great Plains", "Mercury", "PayPal", "Square", "PandaDoc"],
  },
  {
    title: "SEO & Growth Analytics",
    core: ["Ahrefs", "Google Search Console", "Google Analytics", "PostHog", "Mixpanel", "Amplitude", "Segment", "HubSpot", "Salesforce"],
    more: ["SEMrush", "Hotjar", "Marketo", "Mailchimp", "Apollo", "Vercel Analytics", "Schema.org / JSON-LD", "Core Web Vitals", "llms.txt"],
  },
  {
    title: "Product & Collaboration",
    core: ["Jira", "Confluence", "Linear", "Notion", "Monday.com", "Airtable", "Figma", "Lucid", "Canva", "Gamma", "Resend", "Shopify"],
    more: ["Asana", "Trello", "Miro", "Slack", "Zoom", "Calendly", "Google Workspace", "Microsoft 365", "Retool", "Twilio"],
  },
];

export const specializedAreas: SpecializedArea[] = [
  {
    title: "Systems Architecture",
    items: ["Core banking systems", "Payment processors", "IVR"],
  },
  {
    title: "Accounting & Financial Standards",
    items: ["ASC 606 (Revenue Recognition)", "ASC 842 (Leases)", "ASC 326 (Credit Losses)", "ASC 815 (Derivatives)", "ASC 820 (Fair Value)", "GAAP", "IFRS", "SOX Compliance"],
  },
  {
    title: "Compliance & Security",
    items: ["SOC 1 & SOC 2 Readiness", "SOC Compliance", "GDPR", "CCPA", "Basel's Principles for Operational Resilience", "SEC/FINRA", "OCC", "Reg X", "Reg Z", "NACHA", "UDAAP", "SCRA", "FCRA", "MERS", "PCI DSS", "ISO 27001", "HIPAA", "PII handling"],
  },
  {
    title: "Financial Expertise",
    items: ["Treasury", "FX Management", "Share Repurchases", "Market Execution", "VaR", "VWAP"],
  },
  {
    title: "Transaction Experience",
    items: ["Acquisitions", "M&A Advisory", "Global Markets", "Equity & Debt Capital markets", "IPO Readiness (S1)", "Asset Based Lending", "Asset Backed Securitization (Non-Mortgage) (144A)"],
  },
];

/** Total distinct tools across both tiers, for copy that quotes a number. */
export const skillCount = new Set(
  skillCategories.flatMap((c) => [...c.core, ...c.more])
).size;
