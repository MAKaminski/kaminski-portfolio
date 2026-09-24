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
    items: ["Core banking systems", "Loan origination systems (LOS)", "Loan management & servicing platforms", "Payment processors & rails (ACH, card, RTP, wire)", "Stripe Connect & Plaid disbursement architecture", "IVR / Genesys contact-center routing", "Omni-channel orchestration (voice, SMS, email)", "Dialer strategy & contact governance", "Salesforce CRM & case management", "NetSuite ERP architecture & integrations", "MuleSoft / API gateway integration patterns", "Event-driven & queue-based pipelines", "Data warehouse & lakehouse design", "Identity & role provisioning automation", "Multi-tenant SaaS architecture", "Architecture decision records (ADRs)", "Build-vs-buy & vendor architecture", "Data residency & cost-per-resolution modeling", "Disaster recovery & business continuity", "Zero-to-one platform builds"],
  },
  {
    title: "AI Agents & Governance",
    items: ["Agentic workflow design", "Multi-agent orchestration", "Custom MCP servers & tool design", "Eval harnesses & statistical gating", "Human approval gates on irreversible actions", "Voice AI agents in production (10,000+ hours/month)", "Prompt & instruction-file governance", "Model risk management (SR 11-7)", "RAG & retrieval evaluation", "AI security, legal & compliance review", "Agent observability & evidence trails", "Cost-per-resolution economics"],
  },
  {
    title: "Accounting & Financial Standards",
    items: ["ASC 606 (Revenue Recognition)", "ASC 842 (Leases)", "ASC 326 / CECL (Credit Losses)", "ASC 815 (Derivatives & Hedging)", "ASC 820 (Fair Value)", "ASC 985-20 (Software Revenue)", "ASC 350-40 (Internal-Use Software Capitalization)", "ASC 310 (Receivables)", "ASC 450 (Contingencies)", "ASC 740 (Income Taxes)", "ASC 805 (Business Combinations)", "ASC 350 (Goodwill & Intangibles)", "ASC 718 (Stock Compensation)", "ASC 830 (Foreign Currency)", "GAAP", "IFRS", "SOX Compliance & ICFR", "Purchase price allocation", "Chart of accounts design", "Multi-entity consolidation & intercompany", "Month-end close acceleration", "Audit readiness & auditor management", "Quality of earnings (QoE)", "GAAP-to-tax reconciliation", "Revenue & fee recognition for lending products"],
  },
  {
    title: "FP&A & Controllership",
    items: ["Driver-based forecasting", "13-week cash flow forecasting", "Budgeting & variance analysis", "Board packs & KPI trees", "Investor & lender reporting", "Covenant dashboards & compliance", "Unit economics (CAC, LTV, NRR, payback)", "Cohort & vintage analysis", "Pricing & rate-card design", "Utilization & delivery-pyramid modeling", "Working capital & DSO optimization", "Scenario & sensitivity modeling", "Headcount & workforce planning", "Capex approval & portfolio analytics", "Segment & LOB P&L ownership", "Supplier contract renegotiation", "Cost-out & margin expansion programs", "QuickBooks → NetSuite ERP migration", "Payroll, AP/AR & business collections", "Cap-table & equity management (Carta)"],
  },
  {
    title: "Capital Markets & Treasury",
    items: ["Treasury operations", "Share repurchase programs ($6B+)", "Commercial paper & revolving credit facilities", "Debt facility structuring & lender negotiations", "Asset-backed lending (ABL)", "Asset-backed securitization (non-mortgage, 144A)", "Warehouse lines & forward-flow agreements", "Liquidity & cash pooling", "FX management & hedging", "Interest rate swaps & hedge accounting", "Rating agency & bank relationship management", "Market execution", "VaR", "VWAP", "Options, Greeks & portfolio hedging", "Long-only portfolio management"],
  },
  {
    title: "Transactions & Corporate Development",
    items: ["Acquisitions & tuck-ins", "M&A advisory", "Buy-and-build roll-ups", "Divestitures & carve-outs ($1.8B program)", "IPO readiness (S-1)", "Series B & growth equity raises", "144(a) debt raises ($400M)", "LBO modeling & sponsor returns", "DCF, comps & precedent transactions", "Synergy modeling & integration planning", "Transition service agreements (TSAs)", "Data-room & diligence management", "Post-merger systems integration", "PE exit readiness", "Term-sheet negotiation", "Global markets", "Equity & debt capital markets"],
  },
  {
    title: "Credit, Risk & Collections",
    items: ["Credit policy & underwriting strategy", "Scorecard & decision-model oversight", "FICO Decision Modeler & optimization", "Vintage, roll-rate & delinquency analytics", "Loss mitigation & treatment strategy", "Collections strategy & segmentation", "Contact strategy & containment policy", "Credit reporting (Metro 2)", "Portfolio segmentation & pricing", "Fraud & KYC controls", "AML / OFAC screening", "Fair lending analytics", "Loan servicing operations", "Repossession, remarketing & recovery", "Bankruptcy & SCRA handling", "Dispute handling & escalation"],
  },
  {
    title: "Compliance & Security",
    items: ["SOC 1 & SOC 2 readiness", "PCI DSS", "ISO 27001", "HIPAA", "GDPR", "CCPA", "GLBA / Reg P", "FDCPA & Reg F", "UDAAP", "FCRA", "SCRA", "TCPA", "TILA / Reg Z", "RESPA / Reg X", "ECOA / Reg B", "Reg E", "NACHA operating rules", "OCC & CFPB examination readiness", "SEC / FINRA", "MERS", "Basel principles for operational resilience", "State lending & licensing requirements", "PII handling & data minimization", "Vendor risk management", "Quality control & audit functions"],
  },
  {
    title: "Product & Delivery Leadership",
    items: ["Product roadmaps & NPV-based prioritization", "PRDs, Gherkin acceptance criteria & release trains", "Agile / Scrum at scale (multi-squad)", "Enterprise program governance & PMO", "Change management & adoption", "UAT, business readiness & super-user programs", "Vendor selection, RFPs & SOWs", "Executive & board reporting", "Budget ownership ($25M+)", "Hiring, team building & succession planning", "Cross-functional leadership without direct authority", "Operating model & process design", "SLA management & dispatch operations", "Marketplace & multi-sided product strategy"],
  },
  {
    title: "Industries",
    items: ["Consumer auto finance (retail & lease)", "Point-of-sale & home-improvement lending", "Fintech & embedded payments", "B2B SaaS & marketplaces", "Residential & commercial services", "Construction & property management", "Real estate technology", "Wholesale distribution & manufacturing", "Big-box retail", "Professional services & advisory"],
  },
];

/** Total distinct tools across both tiers, for copy that quotes a number. */
export const skillCount = new Set(
  skillCategories.flatMap((c) => [...c.core, ...c.more])
).size;
