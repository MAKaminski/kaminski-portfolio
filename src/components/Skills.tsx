import React from 'react';
import { motion } from 'framer-motion';
import { Code, Database, Cloud, BarChart3, Settings, Globe, ChevronDown, ChevronUp, Sparkles, Award } from 'lucide-react';
import TechLogo from './TechLogos';

const Skills: React.FC = () => {
  const [openAccordion, setOpenAccordion] = React.useState<number | null>(0); // Open first by default
  
  const skillCategories = [
    {
      title: "ERP Systems",
      icon: Settings,
      skills: ["NetSuite", "SAP", "SAP/4HANA", "Automatica", "Microsoft Dynamics", "Great Plains", "Oracle Hyperion"],
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50"
    },
    {
      title: "Analytics & BI",
      icon: BarChart3,
      skills: ["QlikView", "Tableau", "PowerBI", "Looker", "Metabase", "ClickHouse"],
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50"
    },
    {
      title: "Accounting & Finance",
      icon: BarChart3,
      skills: ["QuickBooks", "Ramp", "Brex"],
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50"
    },
    {
      title: "Product Analytics",
      icon: BarChart3,
      skills: ["Mixpanel", "Amplitude", "Google Analytics", "Segment", "Hotjar", "Posthog"],
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50"
    },
    {
      title: "Marketing & Growth",
      icon: Globe,
      skills: ["HubSpot", "Salesforce", "Marketo", "Ahrefs", "SEMrush", "Mailchimp"],
      gradient: "from-indigo-500 to-blue-500",
      bgGradient: "from-indigo-50 to-blue-50"
    },
    {
      title: "Programming Languages",
      icon: Code,
      skills: ["SQL", "Python", "R", "VBA", "HTML", "CSS", "PHP", "Java", "C#", "Rust"],
      gradient: "from-pink-500 to-rose-500",
      bgGradient: "from-pink-50 to-rose-50"
    },
    {
      title: "Backend & Databases",
      icon: Database,
      skills: ["Node.js", "FastAPI", "PostgreSQL", "Redis", "NeonDB", "Supabase", "GraphQL"],
      gradient: "from-teal-500 to-cyan-500",
      bgGradient: "from-teal-50 to-cyan-50"
    },
    {
      title: "Frontend",
      icon: Code,
      skills: ["React", "TypeScript", "Tailwind"],
      gradient: "from-violet-500 to-purple-500",
      bgGradient: "from-violet-50 to-purple-50"
    },
    {
      title: "Infrastructure & Cloud",
      icon: Cloud,
      skills: ["Docker", "AWS", "GCP", "Vercel", "K8 (Infra)", "Lambda", "Serverless", "Render"],
      gradient: "from-sky-500 to-blue-500",
      bgGradient: "from-sky-50 to-blue-50"
    },
    {
      title: "Data & Analytics Platforms",
      icon: Database,
      skills: ["Snowflake", "Redshift", "BigQuery"],
      gradient: "from-emerald-500 to-green-500",
      bgGradient: "from-emerald-50 to-green-50"
    },
    {
      title: "Observability",
      icon: Settings,
      skills: ["DataDog"],
      gradient: "from-amber-500 to-orange-500",
      bgGradient: "from-amber-50 to-orange-50"
    },
    {
      title: "AI & ML",
      icon: Code,
      skills: ["OpenAI", "ElevenLabs", "MCP", "Langchain"],
      gradient: "from-fuchsia-500 to-pink-500",
      bgGradient: "from-fuchsia-50 to-pink-50"
    },
    {
      title: "General Tools",
      icon: Settings,
      skills: ["Confluence", "JIRA", "Asana", "Trello", "Miro", "Notion", "Lucid"],
      gradient: "from-slate-500 to-gray-500",
      bgGradient: "from-slate-50 to-gray-50"
    },
    {
      title: "Collaboration & Productivity",
      icon: Settings,
      skills: ["Slack", "Zoom", "Google Workspace", "Microsoft 365", "Monday.com", "GitHub", "Figma", "Zapier"],
      gradient: "from-rose-500 to-pink-500",
      bgGradient: "from-rose-50 to-pink-50"
    },
    {
      title: "Vector Databases",
      icon: Database,
      skills: ["Milvus", "Pinecone", "Weaviate", "pgvector"],
      gradient: "from-cyan-500 to-teal-500",
      bgGradient: "from-cyan-50 to-teal-50"
    },
    {
      title: "Audio & Video Processing",
      icon: Settings,
      skills: ["FFmpeg", "OpenCV", "Tesseract", "Audacity"],
      gradient: "from-lime-500 to-green-500",
      bgGradient: "from-lime-50 to-green-50"
    },
    {
      title: "Libraries & Tools",
      icon: Code,
      skills: ["SciPy", "Matplotlib", "Seaborn", "Scikit-learn", "TensorFlow", "Jupyter", "Plotly", "FastAPI", "Axios", "PySpark", "Hugging Face", "Streamlit"],
      gradient: "from-blue-500 to-indigo-500",
      bgGradient: "from-blue-50 to-indigo-50"
    },
    {
      title: "ML Concepts",
      icon: Code,
      skills: ["Self-Supervised Learning", "Transfer Learning", "Reinforcement Learning", "Transformers", "LLMs", "Text Embeddings", "GPT"],
      gradient: "from-purple-500 to-violet-500",
      bgGradient: "from-purple-50 to-violet-50"
    },
    {
      title: "ETL & Pipeline Tools",
      icon: Settings,
      skills: ["Apache Airflow", "Apache NiFi", "Fivetran", "DBT", "Foreign Data Wrappers", "Encryption (PGP/GPG)", "System Profiling"],
      gradient: "from-indigo-500 to-purple-500",
      bgGradient: "from-indigo-50 to-purple-50"
    },
    {
      title: "Orchestration & Containerization",
      icon: Cloud,
      skills: ["Kubernetes", "Docker"],
      gradient: "from-gray-500 to-slate-500",
      bgGradient: "from-gray-50 to-slate-50"
    },
    {
      title: "Testing & Validation",
      icon: Settings,
      skills: ["Pydantic", "Jest", "Pytest"],
      gradient: "from-green-500 to-teal-500",
      bgGradient: "from-green-50 to-teal-50"
    },
    {
      title: "Relational Databases",
      icon: Database,
      skills: ["PostgreSQL", "MySQL", "SQLite", "MariaDB", "Oracle", "Microsoft SQL Server", "Amazon Redshift", "Snowflake", "BigQuery"],
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50"
    },
    {
      title: "Non-Relational Databases",
      icon: Database,
      skills: ["MongoDB", "Redis", "Cassandra", "Neo4j", "Elasticsearch", "Firebase"],
      gradient: "from-red-500 to-pink-500",
      bgGradient: "from-red-50 to-pink-50"
    },
    {
      title: "File Formats",
      icon: Settings,
      skills: ["Excel", "CSV", "Parquet", "JSON", "XML"],
      gradient: "from-yellow-500 to-orange-500",
      bgGradient: "from-yellow-50 to-orange-50"
    },
    {
      title: "File Transfer",
      icon: Settings,
      skills: ["SFTP", "FTP", "FTPS"],
      gradient: "from-teal-500 to-green-500",
      bgGradient: "from-teal-50 to-green-50"
    },
    {
      title: "Data Processing & Parsing",
      icon: Code,
      skills: ["FFmpeg", "OpenCV", "Tesseract", "NLTK", "PyTorch", "Dask"],
      gradient: "from-violet-500 to-fuchsia-500",
      bgGradient: "from-violet-50 to-fuchsia-50"
    },
    {
      title: "CI/CD & DevOps",
      icon: Settings,
      skills: ["YAML", "GitHub Actions"],
      gradient: "from-slate-500 to-zinc-500",
      bgGradient: "from-slate-50 to-zinc-50"
    },
    {
      title: "Low-Code/No-Code & Internal Tools",
      icon: Settings,
      skills: ["Retool, Make, AirTable, Lucid"],
      gradient: "from-pink-500 to-rose-500",
      bgGradient: "from-pink-50 to-rose-50"
    },
    {
      title: "Compliance & Security",
      icon: Settings,
      skills: ["PII Compliance", "HIPPA Compliance", "GDPR", "PCI DSS", "ISO 27001"],
      gradient: "from-red-500 to-orange-500",
      bgGradient: "from-red-50 to-orange-50"
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section id="skills" className="relative py-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-40 left-10 w-96 h-96 bg-gradient-to-br from-blue-400/5 to-purple-400/5 rounded-full blur-3xl"
          animate={{
            x: [0, 40, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
        <motion.div
          className="absolute bottom-40 right-10 w-80 h-80 bg-gradient-to-br from-pink-400/5 to-indigo-400/5 rounded-full blur-3xl"
          animate={{
            x: [0, -35, 0],
            y: [0, 25, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto section-padding">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.div
            className="inline-flex items-center space-x-3 mb-6"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            viewport={{ once: true }}
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              Skills & Expertise
            </h2>
          </motion.div>
          <motion.p 
            className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            viewport={{ once: true }}
          >
            Comprehensive expertise across enterprise systems, analytics, development, and specialized financial technologies.
            <span className="block mt-2 font-semibold text-blue-700">
              20+ years of hands-on experience with cutting-edge technologies.
            </span>
          </motion.p>
        </motion.div>

        {/* Software Experience Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24"
        >
          {skillCategories.map((category, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`relative bg-gradient-to-br ${category.bgGradient} rounded-3xl p-8 border border-white/50 shadow-xl backdrop-blur-sm overflow-hidden group`}
              whileHover={{ 
                scale: 1.02,
                y: -5,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)"
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* Background decoration */}
              <motion.div
                className={`absolute top-4 right-4 w-16 h-16 bg-gradient-to-r ${category.gradient} rounded-full opacity-10`}
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  delay: index * 0.2,
                }}
              />
              
              <div className="relative z-10">
                <motion.div 
                  className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r ${category.gradient} rounded-2xl shadow-lg mb-6`}
                  whileHover={{ 
                    rotate: 15,
                    scale: 1.1
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <category.icon className="w-7 h-7 text-white" />
                </motion.div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-6">{category.title}</h3>
                
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, skillIndex) => (
                    <motion.div
                      key={skill}
                      className="flex items-center space-x-2 px-3 py-2 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl hover:bg-white hover:shadow-md transition-all duration-200 group/skill"
                      whileHover={{ 
                        scale: 1.05,
                        y: -2
                      }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 + skillIndex * 0.02, duration: 0.3 }}
                    >
                      <TechLogo name={skill} className="w-4 h-4 transition-transform group-hover/skill:scale-110" />
                      <span className="text-sm font-medium text-gray-700 group-hover/skill:text-gray-900">
                        {skill}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Specialized Areas */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="text-center mb-16">
            <motion.h3 
              className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent"
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Specialized Expertise
            </motion.h3>
            <p className="text-lg text-gray-600">
              Deep domain knowledge in financial services, compliance, and enterprise systems
            </p>
          </div>

          <div className="space-y-6">
            {specializedAreas.map((area, index) => (
              <motion.div 
                key={index} 
                className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ scale: 1.01 }}
              >
                <motion.button
                  className="w-full flex items-center justify-between p-8 focus:outline-none text-left transition-all duration-200"
                  onClick={() => setOpenAccordion(openAccordion === index ? null : index)}
                  whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.05)" }}
                >
                  <div className="flex items-center space-x-6">
                    <motion.div 
                      className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${area.gradient} rounded-2xl shadow-lg`}
                      whileHover={{ 
                        rotate: 10,
                        scale: 1.1
                      }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <area.icon className="w-8 h-8 text-white" />
                    </motion.div>
                    <div>
                      <h4 className="text-2xl font-bold text-gray-900">{area.title}</h4>
                      <p className="text-sm text-gray-500 mt-1">
                        {area.items.length} areas of expertise
                      </p>
                    </div>
                  </div>
                  
                  <motion.div
                    animate={{ rotate: openAccordion === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    <div className="bg-blue-100 p-3 rounded-xl">
                      <ChevronDown className="w-6 h-6 text-blue-600" />
                    </div>
                  </motion.div>
                </motion.button>
                
                <motion.div
                  initial={false}
                  animate={{
                    height: openAccordion === index ? 'auto' : 0,
                    opacity: openAccordion === index ? 1 : 0,
                  }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="px-8 pb-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {area.items.map((item, itemIndex) => (
                        <motion.div
                          key={item}
                          className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ 
                            opacity: openAccordion === index ? 1 : 0,
                            y: openAccordion === index ? 0 : 10
                          }}
                          transition={{ delay: itemIndex * 0.05, duration: 0.3 }}
                          whileHover={{ 
                            scale: 1.02,
                            backgroundColor: "rgba(59, 130, 246, 0.1)"
                          }}
                        >
                          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex-shrink-0" />
                          <span className="text-gray-700 font-medium text-sm">{item}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills; 