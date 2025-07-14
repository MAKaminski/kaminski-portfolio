import React from 'react';
import { motion } from 'framer-motion';
import { Download, Mail, Linkedin, Github, Network } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import CensoredNumber from './CensoredNumber';
import { useTheme } from '../App';
import { Role } from '../App';

const Hero: React.FC = () => {
  const { setTheme, currentRole } = useTheme();
  const navigate = useNavigate();

  const roles: { key: Role; label: string; color: string; hover: string }[] = [
    { key: 'cfo', label: 'CFO', color: 'bg-blue-100 text-blue-700', hover: 'hover:bg-blue-200' },
    { key: 'cpo', label: 'CPO', color: 'bg-purple-100 text-purple-700', hover: 'hover:bg-purple-200' },
    { key: 'strategy', label: 'Strategy', color: 'bg-green-100 text-green-700', hover: 'hover:bg-green-200' },
    { key: 'technology', label: 'Technology', color: 'bg-indigo-100 text-indigo-700', hover: 'hover:bg-indigo-200' },
    { key: 'revenue', label: 'Revenue', color: 'bg-orange-100 text-orange-700', hover: 'hover:bg-orange-200' },
  ];

  const handleRoleClick = (role: Role, path: string) => {
    setTheme(role);
    navigate(path);
  };

  return (
    <section className="pt-24 pb-16 relative overflow-hidden" style={{ background: 'linear-gradient(to bottom right, var(--bg), #fff)' }}>
      {/* Background decoration */}
      <motion.div
        className="absolute inset-0 opacity-10"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        style={{
          backgroundImage: 'radial-gradient(circle at 20% 80%, var(--primary) 0%, transparent 50%), radial-gradient(circle at 80% 20%, var(--primary) 0%, transparent 50%)',
          backgroundSize: '400px 400px',
        }}
      />
      <div className="max-w-7xl mx-auto section-padding">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col items-center lg:items-start mb-8 lg:mb-0"
          >
            <img
              src="/images/484D0082-4587-4FEF-AE4B-E727C7BF176B_1_105_c.jpeg"
              alt="Michael Kaminski"
              className="w-40 h-40 rounded-full object-cover shadow-lg border-4 border-white mb-6"
              style={{ background: '#f3f4f6' }}
            />
            <div className="w-full">
              <h1 className="text-5xl md:text-6xl font-extrabold text-primary-700 mb-2 tracking-tight animate-fade-in">
                Michael Kaminski | Executive Portfolio
              </h1>
              <h2 className="text-2xl md:text-3xl font-semibold gradient-text mb-4">
                Building Modular Futures
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Michael Kaminski is a modular thinker, systems builder, and strategic executor with 20+ years in financial technology, 
                services architecture, and engineering. Specializing in bridging the gap between engineering 
                and executive leadership—translating complex technical strategies into actionable business value.
              </p>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                <span className="text-gray-700">Target Compensation: </span>
                <CensoredNumber value="$225K" className="text-primary-600" label="Base +" />
                <CensoredNumber value="$50K+" className="text-primary-600" label="Bonus" />
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                <span className="text-gray-700">Focus: Performance-based Compensation & Equity</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                <span className="text-gray-700">Specialty: Turnarounds & Problem-Solving</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4 mb-6">
              <a 
                href="https://linkedin.com/in/michaelxaxkaminski" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-12 h-12 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
              >
                <Linkedin className="w-6 h-6" />
              </a>
              <a 
                href="https://github.com/michaelxaxkaminski" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-12 h-12 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors duration-200"
              >
                <Github className="w-6 h-6" />
              </a>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="/resume.pdf" 
                download="Michael_Kaminski_Resume.pdf"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors duration-200"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Resume
              </a>
              <a 
                href="#contact"
                className="inline-flex items-center justify-center px-6 py-3 border border-primary-600 text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transition-colors duration-200"
              >
                <Mail className="w-5 h-5 mr-2" />
                Contact Me
              </a>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Link
                to="/knowledge-graph"
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg"
              >
                <Network className="w-5 h-5 mr-2" />
                Explore Knowledge Graph
              </Link>
            </div>
            
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">View My Experience By Role:</h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {roles.map((role) => (
                  <button
                    key={role.key}
                    onClick={() => handleRoleClick(role.key, `/${role.key}`)}
                    className={`px-4 py-2 rounded-lg transition-colors duration-200 text-center text-sm font-medium focus:outline-none 
                      ${currentRole === role.key ? 'ring-2 ring-offset-2 font-bold' : ''}`}
                    style={currentRole === role.key
                      ? { background: 'var(--primary)', color: '#fff', border: '2px solid var(--primary)' }
                      : { background: 'var(--secondary)', color: '#222', border: '2px solid var(--primary)', opacity: 0.85 }}
                  >
                    {role.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex space-x-4 mt-6">
              <a 
                href="https://linkedin.com/in/michaelxaxkaminski" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-12 h-12 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
              >
                <Linkedin className="w-6 h-6" />
              </a>
              <a 
                href="https://github.com/michaelxaxkaminski" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-12 h-12 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors duration-200"
              >
                <Github className="w-6 h-6" />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Target Profile</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Company Size</h4>
                <p className="text-gray-600">Revenue: $0MM - $100MM | Headcount: 2 - 100</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Target Industries</h4>
                <div className="flex flex-wrap gap-2">
                  {['Fintech', 'Financial Services', 'Payments', 'Digital Banking', 'Technology', 'SaaS', 'Enterprise Platforms', 'AI/ML', 'Retail', 'Industrial Distribution'].map((industry) => (
                    <span key={industry} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                      {industry}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Location Preferences</h4>
                <div className="space-y-1">
                  <p className="text-gray-600"><span className="font-medium">Tier 1:</span> Atlanta</p>
                  <p className="text-gray-600"><span className="font-medium">Tier 2:</span> NYC, SF, Seattle, Austin, Miami, Salt Lake City, Denver</p>
                  <p className="text-gray-600"><span className="font-medium">Tier 3:</span> Metropolitan Cities</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Work Style</h4>
                <p className="text-gray-600">In Office, Hybrid, or Remote | Full Time</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 