import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Calendar, Github, Globe } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  publishDate: string;
  githubUrl?: string;
  liveUrl?: string;
  tags: string[];
  featured?: boolean;
}

const projects: Project[] = [
  {
    id: 'fintech-pulse',
    name: 'FintechPulse LinkedIn Agent',
    description: 'Advanced automated LinkedIn posting agent that creates and publishes optimized fintech-focused content twice daily with comprehensive analytics and engagement optimization.',
    publishDate: '2025-01-20',
    githubUrl: 'https://github.com/MAKaminski/fintech-pulse',
    tags: ['Fintech', 'Automation', 'LinkedIn', 'AI', 'Analytics'],
    featured: true
  },
  {
    id: 'kaminski-portfolio',
    name: 'Michael Kaminski Portfolio',
    description: 'Executive portfolio showcasing 20+ years of experience in financial technology, strategic leadership, and organizational transformation.',
    publishDate: '2024-12-15',
    githubUrl: 'https://github.com/MAKaminski/kaminski-portfolio',
    liveUrl: 'https://michaelkaminski.com',
    tags: ['Portfolio', 'React', 'TypeScript', 'Executive Leadership'],
    featured: true
  }
  // To add a new project, copy this template and fill in the details:
  // {
  //   id: 'project-id',
  //   name: 'Project Name',
  //   description: 'Brief description of the project and its key features.',
  //   publishDate: 'YYYY-MM-DD',
  //   githubUrl: 'https://github.com/MAKaminski/project-repo',
  //   liveUrl: 'https://live-demo-url.com', // Optional
  //   tags: ['Tag1', 'Tag2', 'Tag3'],
  //   featured: false // Set to true for featured projects
  // }
];

const Projects: React.FC = () => {
  const [showAll, setShowAll] = useState(false);
  const displayCount = showAll ? projects.length : Math.min(3, projects.length);

  return (
    <section id="projects" className="section-padding" style={{ background: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
          style={{ color: 'var(--primary)' }}
        >
          <h2 className="text-4xl font-bold mb-4">Latest Projects</h2>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--secondary)' }}>
            Recent tools, platforms, and initiatives I've launched to drive innovation in fintech and executive leadership.
          </p>
        </motion.div>

        <div className="grid gap-6">
          {projects.slice(0, displayCount).map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`bg-white rounded-2xl shadow-lg p-8 border-l-4 transition-all duration-300 hover:shadow-xl ${
                project.featured ? 'border-blue-500' : 'border-gray-300'
              }`}
              style={{ borderLeftColor: project.featured ? 'var(--primary)' : undefined }}
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{project.name}</h3>
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>Published {new Date(project.publishDate).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                    </div>
                    {project.featured && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Featured
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col gap-3 lg:flex-shrink-0">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium"
                    >
                      <Github className="w-4 h-4 mr-2" />
                      View on GitHub
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                    >
                      <Globe className="w-4 h-4 mr-2" />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {projects.length > 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-8"
          >
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {showAll ? 'Show Less' : `View All ${projects.length} Projects`}
            </button>
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-xl font-semibold mb-4">
              Interested in Collaborating?
            </h3>
            <p className="text-blue-100 mb-6">
              Let's discuss how we can work together on your next fintech innovation or strategic initiative.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://calendly.com/kaminski1337/15min"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Schedule a Call
              </a>
              <a
                href="https://github.com/MAKaminski"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 border border-white text-white rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-200 font-medium"
              >
                <Github className="w-4 h-4 mr-2" />
                View GitHub
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects; 