import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';
import TechLogo from '../components/TechLogos';
import { useTheme, Role } from '../App';

const projects = [
  {
    title: 'kaminski-portfolio',
    company: 'Personal',
    description: 'Personal portfolio starter: React frontend, Python backend, Neon/Prisma/pgvector for projects & AI chatbot messaging. Built to showcase executive and technical experience, with a focus on modular, scalable architecture and AI integration.',
    tech: ['React', 'Python', 'Neon', 'Prisma', 'pgvector'],
    role: 'Architect, Full Stack Developer',
    github: 'https://github.com/MAKaminski/kaminski-portfolio',
    demo: '',
    people: 1,
    budget: '$5K',
    timeline: '3 months',
    cost: '$5K',
    value: 'Showcases executive/technical brand, used for job search and consulting.'
  },
  {
    title: 'SysMemory',
    company: 'Personal',
    description: 'Systems/memory utility library developed to optimize or analyze system memory usage, reflecting systems engineering expertise.',
    tech: ['Python', 'C++'],
    role: 'Systems Engineer',
    github: 'https://github.com/MAKaminski/SysMemory',
    demo: '',
    people: 1,
    budget: '$2K',
    timeline: '2 months',
    cost: '$2K',
    value: 'Improved diagnostics for enterprise systems.'
  },
  {
    title: 'data_analysis',
    company: 'Personal',
    description: 'Advanced data analysis toolkit for business intelligence and decision-making.',
    tech: ['Python', 'Pandas', 'Jupyter'],
    role: 'Data Engineer',
    github: 'https://github.com/MAKaminski/data_analysis',
    demo: '',
    people: 1,
    budget: '$1K',
    timeline: '1 month',
    cost: '$1K',
    value: 'Enabled data-driven insights for business.'
  },
  {
    title: 'IconGenerator',
    company: 'Personal',
    description: 'Tool for automating icon generation for design systems and product interfaces.',
    tech: ['Python', 'JavaScript'],
    role: 'Developer',
    github: 'https://github.com/MAKaminski/IconGenerator',
    demo: '',
    people: 1,
    budget: '$1K',
    timeline: '1 month',
    cost: '$1K',
    value: 'Streamlined UI/UX design workflows.'
  },
  {
    title: 'Enterprise Platform Re-architecture',
    company: 'Confidential Fintech',
    description: 'Led the re-architecture of a legacy financial platform into a modular, cloud-native solution, enhancing scalability and reducing time-to-market.',
    tech: ['Cloud', 'Microservices', 'Docker', 'Kubernetes'],
    role: 'Executive Sponsor, Systems Architect',
    github: '',
    demo: '',
    people: 25,
    budget: '$2.5M',
    timeline: '18 months',
    cost: '$2.2M',
    value: 'Reduced technical debt, enabled rapid growth, improved reliability.'
  },
  {
    title: 'Fintech Product Launch',
    company: 'Confidential Fintech',
    description: 'Built and managed cross-functional teams to deliver critical fintech products, resulting in significant revenue growth.',
    tech: ['Payments', 'Digital Banking', 'API Integrations'],
    role: 'Product Owner, Team Lead',
    github: '',
    demo: '',
    people: 15,
    budget: '$1.2M',
    timeline: '12 months',
    cost: '$1.1M',
    value: 'Launched new products, drove revenue and market expansion.'
  },
  {
    title: 'Process Optimization Initiative',
    company: 'Confidential Fintech',
    description: 'Implemented structured methodologies that improved operational efficiency and reduced technical debt.',
    tech: ['Lean', 'Agile', 'Automation Tools'],
    role: 'Transformation Lead',
    github: '',
    demo: '',
    people: 10,
    budget: '$500K',
    timeline: '6 months',
    cost: '$400K',
    value: 'Increased delivery predictability, reduced costs, improved quality.'
  }
];

// Map roles to relevant project titles (or add a 'roles' field to each project for more flexibility)
const roleProjectMap: Record<Role, string[]> = {
  default: projects.map(p => p.title),
  cfo: [
    'Enterprise Platform Re-architecture',
    'Process Optimization Initiative',
    'kaminski-portfolio',
  ],
  cpo: [
    'Fintech Product Launch',
    'kaminski-portfolio',
    'IconGenerator',
  ],
  strategy: [
    'Enterprise Platform Re-architecture',
    'Process Optimization Initiative',
    'kaminski-portfolio',
  ],
  technology: [
    'kaminski-portfolio',
    'SysMemory',
    'Enterprise Platform Re-architecture',
    'IconGenerator',
  ],
  revenue: [
    'Fintech Product Launch',
    'Process Optimization Initiative',
    'kaminski-portfolio',
  ],
};

const radius = 180;
const center = 220;

const ProjectWheel: React.FC = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const { currentRole } = useTheme();
  const filteredProjects = projects.filter(p => roleProjectMap[currentRole].includes(p.title));

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[600px]" style={{ background: 'var(--bg)' }}>
      <div className="relative w-[440px] h-[440px] mx-auto">
        {filteredProjects.map((project, idx) => {
          const angle = (2 * Math.PI * idx) / filteredProjects.length;
          const y = center + radius * Math.sin(angle) - 40;
          const x = center + radius * Math.cos(angle) - 40;
          return (
            <motion.div
              key={project.title}
              className={`absolute cursor-pointer group`}
              style={{ top: y, left: x, borderColor: 'var(--primary)' }}
              initial={{ scale: 0.8, opacity: 0.7 }}
              animate={{ scale: selected === idx ? 1.15 : 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              onClick={() => setSelected(idx)}
              onMouseEnter={() => setSelected(idx)}
              onMouseLeave={() => setSelected(null)}
              title={project.title}
            >
              <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg bg-white border-2 relative`} style={{ borderColor: 'var(--primary)' }}>
                <TechLogo name={project.tech[0]} className="w-10 h-10" />
                {/* Tooltip */}
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20">
                  {project.title}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      <AnimatePresence>
        {selected !== null && filteredProjects[selected] && (
          <motion.div
            key={filteredProjects[selected].title}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3 }}
            className="absolute top-[480px] left-1/2 -translate-x-1/2 w-full max-w-xl z-10"
          >
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-shrink-0">
                <TechLogo name={filteredProjects[selected].tech[0]} className="w-16 h-16 mb-2" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-primary-700 mb-1">{filteredProjects[selected].title}</h3>
                <div className="text-sm text-gray-500 mb-2">{filteredProjects[selected].company}</div>
                <p className="text-gray-700 mb-3">{filteredProjects[selected].description}</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {filteredProjects[selected].tech.map((tech) => (
                    <span key={tech} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">{tech}</span>
                  ))}
                </div>
                <div className="text-sm text-gray-500 mb-1">Role: <span className="font-semibold text-gray-700">{filteredProjects[selected].role}</span></div>
                <div className="text-xs text-gray-500 mb-1">People Managed: <span className="font-semibold text-gray-700">{filteredProjects[selected].people}</span></div>
                <div className="text-xs text-gray-500 mb-1">Budget Managed: <span className="font-semibold text-gray-700">{filteredProjects[selected].budget}</span></div>
                <div className="text-xs text-gray-500 mb-1">Timeline: <span className="font-semibold text-gray-700">{filteredProjects[selected].timeline}</span></div>
                <div className="text-xs text-gray-500 mb-1">Cost: <span className="font-semibold text-gray-700">{filteredProjects[selected].cost}</span></div>
                <div className="text-xs text-gray-500 mb-2">Value Delivered: <span className="font-semibold text-gray-700">{filteredProjects[selected].value}</span></div>
                <div className="flex gap-4 mt-2">
                  {filteredProjects[selected].github && (
                    <a href={filteredProjects[selected].github} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-primary-700 flex items-center">
                      <Github className="w-5 h-5 mr-1" /> GitHub
                    </a>
                  )}
                  {filteredProjects[selected].demo && (
                    <a href={filteredProjects[selected].demo} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-primary-700 flex items-center">
                      <ExternalLink className="w-5 h-5 mr-1" /> Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-primary-600 text-lg font-bold"
              onClick={() => setSelected(null)}
              aria-label="Close"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const BoardPEReporting: React.FC = () => (
  <section className="mb-12 px-6 py-8 rounded-2xl shadow-lg" style={{ background: 'linear-gradient(90deg, var(--primary), var(--secondary))', color: '#fff' }}>
    <h2 className="text-2xl font-bold mb-2">Board & PE Sponsor Reporting</h2>
    <p className="mb-2 text-lg">Extensive experience designing and delivering Board and Private Equity sponsor reporting for multi-entity structures, including:</p>
    <ul className="list-disc pl-6 mb-2 text-base">
      <li>Bain Capital</li>
      <li>The Carlyle Group</li>
      <li>Clayton, Dubilier & Rice</li>
    </ul>
    <p className="mb-0">Expertise in consolidations, KPI dashboards, and executive reporting for complex, multi-entity organizations. Delivered actionable insights to C-suite, sponsors, and board members, driving strategic decisions and value creation.</p>
  </section>
);

const Projects: React.FC = () => (
  <section className="min-h-screen" style={{ background: 'var(--bg)' }}>
    <div className="max-w-7xl mx-auto py-12 px-4">
      <BoardPEReporting />
      <h1 className="text-4xl font-bold mb-8" style={{ color: 'var(--primary)' }}>Projects</h1>
      <ProjectWheel />
    </div>
  </section>
);

export default Projects; 