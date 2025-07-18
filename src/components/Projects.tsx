import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Github, Globe, Star } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  publishDate: string;
  githubUrl?: string;
  liveUrl?: string;
  tags: string[];
  featured?: boolean;
  stars?: number;
  language?: string;
  updatedAt?: string;
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGitHubRepos();
  }, []);

  const fetchGitHubRepos = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://api.github.com/users/MAKaminski/repos?sort=updated&per_page=100');
      
      if (!response.ok) {
        throw new Error('Failed to fetch repositories');
      }

      const repos = await response.json();
      
      // Filter for public repos and transform to Project format
      const projectData: Project[] = repos
        .filter((repo: any) => !repo.fork && !repo.private)
        .map((repo: any) => ({
          id: repo.id.toString(),
          name: repo.name,
          description: repo.description || 'No description available',
          publishDate: repo.created_at.split('T')[0],
          githubUrl: repo.html_url,
          liveUrl: repo.homepage || undefined,
          tags: [repo.language || 'Other'].filter(Boolean),
          featured: false,
          stars: repo.stargazers_count,
          language: repo.language,
          updatedAt: repo.updated_at
        }))
        .sort((a: Project, b: Project) => new Date(b.updatedAt || b.publishDate).getTime() - new Date(a.updatedAt || a.publishDate).getTime());

      setProjects(projectData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <section id="projects" className="section-padding" style={{ background: 'var(--bg)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading projects...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="projects" className="section-padding" style={{ background: 'var(--bg)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <p className="text-red-600">Error loading projects: {error}</p>
            <button 
              onClick={fetchGitHubRepos}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 transition-all duration-300 hover:shadow-xl hover:border-blue-300"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900 truncate flex-1 mr-2">
                  {project.name}
                </h3>
                {project.stars && project.stars > 0 && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Star className="w-4 h-4 mr-1 fill-current" />
                    <span>{project.stars}</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center text-xs text-gray-500 mb-3">
                <Calendar className="w-3 h-3 mr-1" />
                <span>Updated {formatDate(project.updatedAt || project.publishDate)}</span>
              </div>
              
              <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-3">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {project.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {tag}
                  </span>
                ))}
                {project.tags.length > 3 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    +{project.tags.length - 3}
                  </span>
                )}
              </div>
              
              <div className="flex gap-2">
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 text-sm font-medium"
                >
                  <Github className="w-3 h-3 mr-1" />
                  GitHub
                </a>
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                  >
                    <Globe className="w-3 h-3" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>

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