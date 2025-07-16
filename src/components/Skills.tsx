import React from 'react';
import { motion } from 'framer-motion';
import { Code, Database, Cloud, BarChart3, Settings, Globe, ChevronDown, ChevronUp } from 'lucide-react';
import TechLogo from './TechLogos';

const Skills: React.FC = () => {
  const [openAccordion, setOpenAccordion] = React.useState<number | null>(null);
  const skillCategories = [
    {
      title: "ERP Systems",
      icon: Settings,
      skills: ["NetSuite", "SAP", "SAP/4HANA", "Automatica", "Microsoft Dynamics", "Great Plains", "Oracle Hyperion"]
    },
    {
      title: "Analytics & BI",
      icon: BarChart3,
      skills: ["QlikView", "Tableau", "PowerBI", "Looker", "Metabase", "ClickHouse"]
    },
    {
      title: "Accounting & Finance",
      icon: BarChart3,
      skills: ["QuickBooks", "Ramp", "Brex"]
    },
    {
      title: "Product Analytics",
      icon: BarChart3,
      skills: ["Mixpanel", "Amplitude", "Google Analytics", "Segment", "Hotjar", "Posthog"]
    },
    {
      title: "Marketing & Growth",
      icon: Globe,
      skills: ["HubSpot", "Salesforce", "Marketo", "Ahrefs", "SEMrush", "Mailchimp"]
    },
    {
      title: "Programming Languages",
      icon: Code,
      skills: ["SQL", "Python", "R", "VBA", "HTML", "CSS", "PHP", "Java", "C#", "Rust"]
    },
    {
      title: "Backend & Databases",
      icon: Database,
      skills: ["Node.js", "FastAPI", "PostgreSQL", "Redis", "NeonDB", "Supabase", "GraphQL"]
    },
    {
      title: "Frontend",
      icon: Code,
      skills: ["React", "TypeScript", "Tailwind"]
    },
    {
      title: "Infrastructure & Cloud",
      icon: Cloud,
      skills: ["Docker", "AWS", "GCP", "Vercel", "K8 (Infra)", "Lambda", "Serverless", "Render"]
    },
    {
      title: "Data & Analytics Platforms",
      icon: Database,
      skills: ["Snowflake", "Redshift", "BigQuery"]
    },
    {
      title: "Observability",
      icon: Settings,
      skills: ["DataDog"]
    },
    {
      title: "AI & ML",
      icon: Code,
      skills: ["OpenAI", "ElevenLabs", "MCP", "Langchain"]
    },
    {
      title: "General Tools",
      icon: Settings,
      skills: ["Confluence", "JIRA", "Asana", "Trello", "Miro", "Notion", "Lucid"]
    },
    {
      title: "Collaboration & Productivity",
      icon: Settings,
      skills: ["Slack", "Zoom", "Google Workspace", "Microsoft 365", "Monday.com", "GitHub", "Figma", "Zapier"]
    },
    {
      title: "Vector Databases",
      icon: Database,
      skills: ["Milvus", "Pinecone", "Weaviate", "pgvector"]
    },
    {
      title: "Audio & Video Processing",
      icon: Settings,
      skills: ["FFmpeg", "OpenCV", "Tesseract", "Audacity"]
    },
    {
      title: "Libraries & Tools",
      icon: Code,
      skills: ["SciPy", "Matplotlib", "Seaborn", "Scikit-learn", "TensorFlow", "Jupyter", "Plotly", "FastAPI", "Axios", "PySpark", "Hugging Face", "Streamlit"]
    },
    {
      title: "ML Concepts",
      icon: Code,
      skills: ["Self-Supervised Learning", "Transfer Learning", "Reinforcement Learning", "Transformers", "LLMs", "Text Embeddings", "GPT"]
    },
    {
      title: "ETL & Pipeline Tools",
      icon: Settings,
      skills: ["Apache Airflow", "Apache NiFi", "Fivetran", "DBT", "Foreign Data Wrappers", "Encryption (PGP/GPG)", "System Profiling"]
    },
    {
      title: "Orchestration & Containerization",
      icon: Cloud,
      skills: ["Kubernetes", "Docker"]
    },
    {
      title: "Testing & Validation",
      icon: Settings,
      skills: ["Pydantic", "Jest", "Pytest"]
    },
    {
      title: "Relational Databases",
      icon: Database,
      skills: ["PostgreSQL", "MySQL", "SQLite", "MariaDB", "Oracle", "Microsoft SQL Server", "Amazon Redshift", "Snowflake", "BigQuery"]
    },
    {
      title: "Non-Relational Databases",
      icon: Database,
      skills: ["MongoDB", "Redis", "Cassandra", "Neo4j", "Elasticsearch", "Firebase"]
    },
    {
      title: "File Formats",
      icon: Settings,
      skills: ["Excel", "CSV", "Parquet", "JSON", "XML"]
    },
    {
      title: "File Transfer",
      icon: Settings,
      skills: ["SFTP", "FTP", "FTPS"]
    },
    {
      title: "Data Processing & Parsing",
      icon: Code,
      skills: ["FFmpeg", "OpenCV", "Tesseract", "NLTK", "PyTorch", "Dask"]
    },
    {
      title: "CI/CD & DevOps",
      icon: Settings,
      skills: ["YAML", "GitHub Actions"]
    },
    {
      title: "Low-Code/No-Code & Internal Tools",
      icon: Settings,
      skills: ["Retool, Make, AirTable, Lucid"]
    },
    {
      title: "Compliance & Security",
      icon: Settings,
      skills: ["PII Compliance", "HIPPA Compliance", "GDPR", "PCI DSS", "ISO 27001"]
    },
  ];

  const specializedAreas = [
    {
      title: "Systems",
      items: ["Core banking systems", "Payment processors", "IVR"]
    },
    {
      title: "Accounting & Financial Standards",
      items: ["ASC 606 (Revenue Recognition)", "ASC 842 (Leases)", "ASC 326 (Credit Losses)", "ASC 815 (Derivatives)", "ASC 820 (Fair Value)", "GAAP", "IFRS", "SOX Compliance"]
    },
    {
      title: "Compliance & Security",
      items: ["SOC 1 & SOC 2 Readiness", "SOC Compliance", "GDPR", "CCPA", "Basel's Principles for Operational Resilience", "SEC/FINRA", "OCC", "Reg X", "Reg Z", "NACHA", "UDAAP", "SCRA", "FCRA", "MERS"]
    },
    {
      title: "Expertise",
      items: ["Treasury", "FX Management", "Share Repurchases", "Market Execution", "VaR", "VWAP"]
    },
    {
      title: "Transactions",
      items: ["Acquisitions", "M&A Advisory", "Global Markets", "Equity & Debt Capital markets", "IPO Readiness (S1)", "Asset Based Lending", "Asset Backed Securitization (Non-Mortgage) (144A)"]
    }
  ];

  return (
    <section id="skills" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Software Experience & Skills</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive expertise across enterprise systems, analytics, development, and specialized financial technologies
          </p>
        </motion.div>

        {/* Software Experience */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {skillCategories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-50 rounded-xl p-6 card-hover"
            >
              <div className="flex items-center mb-4">
                <category.icon className="w-6 h-6 text-primary-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">{category.title}</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {category.skills.map((skill) => (
                  <motion.div
                    key={skill}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-primary-50 hover:border-primary-200 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <TechLogo name={skill} className="w-5 h-5" />
                    <span className="text-sm font-medium text-gray-700">{skill}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Specialized Areas Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="rounded-2xl p-8"
          style={{ background: 'linear-gradient(90deg, var(--bg), #e0e7ff)' }}
        >
          <h3 className="text-2xl font-bold mb-8 text-center" style={{ color: 'var(--primary)' }}>Specialized Expertise</h3>
          <div className="space-y-4">
            {specializedAreas.map((area, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm">
                <button
                  className="w-full flex items-center justify-between px-6 py-4 focus:outline-none text-left hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => setOpenAccordion(openAccordion === index ? null : index)}
                  aria-expanded={openAccordion === index}
                >
                  <span className="text-lg font-semibold text-gray-900">{area.title}</span>
                  {openAccordion === index ? (
                    <ChevronUp className="w-5 h-5 text-primary-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-primary-600" />
                  )}
                </button>
                {openAccordion === index && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-4 space-y-2 overflow-hidden"
                  >
                    {area.items.map((item) => (
                      <div key={item} className="flex items-center">
                        <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills; 