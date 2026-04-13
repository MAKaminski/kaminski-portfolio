import React from 'react';
import { motion } from 'framer-motion';
import { Download, Mail, Linkedin, Github, MapPin, Clock, Trophy, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { track } from '@vercel/analytics';
import CensoredNumber from './CensoredNumber';
import { useTheme } from '../App';
import { Role } from '../App';
import SocialSharing from './SocialSharing';

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

  const stats = [
    { icon: Clock, label: 'Years Experience', value: '20+' },
    { icon: Trophy, label: 'Successful Exits', value: '3' },
    { icon: TrendingUp, label: 'Revenue Impact', value: '$50M+' },
  ];

  const handleRoleClick = (role: Role, path: string) => {
    setTheme(role);
    navigate(path);
    track('Role Page Visited', { role: role, path: path });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="relative min-h-screen pt-24 pb-16 overflow-hidden">
      {/* Enhanced Background with Multiple Gradients */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(168, 85, 247, 0.1) 0%, transparent 50%),
              linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%)
            `,
          }}
          animate={{
            background: [
              `radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
               radial-gradient(circle at 80% 70%, rgba(168, 85, 247, 0.1) 0%, transparent 50%),
               linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%)`,
              `radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
               radial-gradient(circle at 30% 80%, rgba(168, 85, 247, 0.15) 0%, transparent 50%),
               linear-gradient(135deg, rgba(236, 72, 153, 0.05) 0%, rgba(99, 102, 241, 0.05) 100%)`,
              `radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
               radial-gradient(circle at 80% 70%, rgba(168, 85, 247, 0.1) 0%, transparent 50%),
               linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%)`,
            ],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
        {/* Floating Geometric Shapes */}
        <motion.div
          className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-to-br from-pink-400/20 to-indigo-400/20 rounded-full blur-xl"
          animate={{
            x: [0, -25, 0],
            y: [0, 15, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto section-padding">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-2 gap-16 items-center"
        >
          {/* Left Column - Main Content */}
          <div className="flex flex-col items-center lg:items-start space-y-8">
            {/* Profile Image with Enhanced Styling */}
            <motion.div
              variants={itemVariants}
              className="relative"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-2xl opacity-20"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.2, 0.3, 0.2],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              />
              <img
                src="/images/484D0082-4587-4FEF-AE4B-E727C7BF176B_1_105_c.jpeg"
                alt="Michael Kaminski"
                className="relative w-48 h-48 rounded-full object-cover shadow-2xl border-4 border-white ring-4 ring-blue-500/20"
              />
              <motion.div
                className="absolute -bottom-2 -right-2 bg-gradient-to-r from-green-400 to-blue-500 text-white p-3 rounded-full shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
              >
                <Trophy className="w-6 h-6" />
              </motion.div>
            </motion.div>

            {/* Enhanced Typography */}
            <motion.div variants={itemVariants} className="text-center lg:text-left space-y-4">
              <h1 className="text-5xl md:text-7xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                  Michael
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Kaminski
                </span>
              </h1>
              <motion.h2 
                className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                Executive Portfolio
              </motion.h2>
              <motion.p
                className="text-xl font-semibold text-gray-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                Building Modular Futures
              </motion.p>
            </motion.div>

            {/* Stats Section */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-3 gap-6 w-full max-w-md"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100"
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <stat.icon className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <motion.div 
                    className="text-2xl font-bold text-gray-900"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1, type: "spring", stiffness: 200 }}
                  >
                    {stat.value}
                  </motion.div>
                  <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Enhanced Description */}
            <motion.p
              variants={itemVariants}
              className="text-lg text-gray-700 leading-relaxed max-w-2xl"
            >
              Michael Kaminski is a <span className="font-semibold text-blue-700">modular thinker</span>, 
              <span className="font-semibold text-purple-700"> systems builder</span>, and 
              <span className="font-semibold text-indigo-700"> strategic executor</span> with 20+ years in 
              financial technology, services architecture, and engineering. Specializing in bridging the gap 
              between engineering and executive leadership—translating complex technical strategies into 
              <span className="font-semibold text-green-700"> actionable business value</span>.
            </motion.p>

            {/* Key Highlights */}
            <motion.div variants={itemVariants} className="space-y-3 w-full max-w-2xl">
              {[
                { icon: MapPin, label: "Target Compensation:", value: ["$225K Base", "+ $50K Bonus"] },
                { icon: TrendingUp, label: "Focus:", value: ["Performance-based Compensation & Equity"] },
                { icon: Trophy, label: "Specialty:", value: ["Turnarounds & Problem-Solving"] },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-start space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-100"
                  whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">{item.label}</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {item.value.map((val, i) => (
                        <span key={i} className="text-blue-700 font-medium">
                          {typeof val === 'string' && val.includes('$') ? (
                            <CensoredNumber value={val} className="text-blue-700" />
                          ) : (
                            val
                          )}
                          {i < item.value.length - 1 && ' '}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Enhanced Social Links */}
            <motion.div variants={itemVariants} className="flex space-x-4">
              {[
                { icon: Linkedin, href: "https://www.linkedin.com/in/michaelxaxkaminski/", color: "from-blue-600 to-blue-700" },
                { icon: Github, href: "https://github.com/MAKaminski", color: "from-gray-700 to-gray-900" },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r ${social.color} text-white rounded-xl shadow-lg`}
                  whileHover={{ 
                    scale: 1.1, 
                    rotate: 5,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <social.icon className="w-7 h-7" />
                </motion.a>
              ))}
            </motion.div>

            {/* Enhanced CTAs */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
              {[
                {
                  href: "/docs/Kaminski Resume.pdf",
                  download: "Kaminski_Resume.pdf",
                  icon: Download,
                  text: "Download Resume",
                  primary: true,
                  gradient: "from-blue-600 to-purple-600",
                  onClick: () => track('Resume Downloaded', { source: 'Hero Section' })
                },
                {
                  href: "#contact",
                  icon: Mail,
                  text: "Contact Me",
                  primary: false,
                  onClick: () => track('Contact Section Clicked', { source: 'Hero Section' })
                },
                {
                  href: "https://calendly.com/kaminski1337/15min",
                  target: "_blank",
                  icon: Clock,
                  text: "Book Call",
                  primary: true,
                  gradient: "from-green-600 to-emerald-600",
                  onClick: () => track('Calendar Link Clicked', { source: 'Hero Section' })
                },
              ].map((cta, index) => (
                <motion.a
                  key={index}
                  {...cta}
                  className={`inline-flex items-center justify-center px-6 py-4 font-bold rounded-xl transition-all duration-200 text-center flex-1 ${
                    cta.primary
                      ? `bg-gradient-to-r ${cta.gradient} text-white shadow-lg hover:shadow-xl`
                      : "border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
                  }`}
                  whileHover={{ 
                    scale: 1.02,
                    y: -2,
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={cta.onClick}
                >
                  <cta.icon className="w-5 h-5 mr-2" />
                  {cta.text}
                </motion.a>
              ))}
            </motion.div>

            {/* Enhanced Role Selector */}
            <motion.div variants={itemVariants} className="w-full max-w-2xl">
              <h4 className="text-xl font-bold text-gray-900 mb-6 text-center lg:text-left">
                View My Experience By Role:
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {roles.map((role, index) => (
                  <motion.button
                    key={role.key}
                    onClick={() => handleRoleClick(role.key, `/${role.key}`)}
                    className={`px-4 py-3 rounded-xl transition-all duration-200 text-center text-sm font-bold focus:outline-none relative overflow-hidden ${
                      currentRole === role.key ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                    }`}
                    style={currentRole === role.key
                      ? { background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: '#fff' }
                      : { background: 'rgba(255, 255, 255, 0.8)', color: '#374151', border: '2px solid #e5e7eb' }}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 10px 20px -5px rgba(0, 0, 0, 0.1)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1, type: "spring", stiffness: 200 }}
                  >
                    {currentRole === role.key && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-90"
                        layoutId="activeRole"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{role.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Social Sharing */}
            <motion.div variants={itemVariants}>
              <SocialSharing />
            </motion.div>
          </div>

          {/* Right Column - Enhanced Target Profile */}
          <motion.div
            variants={itemVariants}
            className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-gray-100"
          >
            <div className="flex items-center space-x-3 mb-8">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                Target Profile
              </h3>
            </div>
            
            <div className="space-y-8">
              {[
                {
                  title: "Company Size",
                  content: "Revenue: $0MM - $100MM | Headcount: 2 - 100",
                  icon: TrendingUp
                },
                {
                  title: "Target Industries",
                  content: ['Fintech', 'Financial Services', 'Payments', 'Digital Banking', 'Technology', 'SaaS', 'Enterprise Platforms', 'AI/ML', 'Retail', 'Industrial Distribution'],
                  icon: Trophy
                },
                {
                  title: "Location Preferences",
                  content: [
                    { tier: "Tier 1", locations: "Atlanta" },
                    { tier: "Tier 2", locations: "NYC, SF, Seattle, Austin, Miami, Salt Lake City, Denver" },
                    { tier: "Tier 3", locations: "Metropolitan Cities" }
                  ],
                  icon: MapPin
                },
                {
                  title: "Work Style",
                  content: "In Office, Hybrid, or Remote | Full Time",
                  icon: Clock
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="space-y-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-lg">{item.title}</h4>
                  </div>
                  
                  {typeof item.content === 'string' ? (
                    <p className="text-gray-700 ml-11">{item.content}</p>
                  ) : Array.isArray(item.content) && typeof item.content[0] === 'string' ? (
                    <div className="flex flex-wrap gap-2 ml-11">
                      {(item.content as string[]).map((tag, i) => (
                        <motion.span
                          key={i}
                          className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-sm font-medium border border-blue-200"
                          whileHover={{ scale: 1.05 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          {tag}
                        </motion.span>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2 ml-11">
                      {(item.content as { tier: string; locations: string }[]).map((loc, i) => (
                        <p key={i} className="text-gray-700">
                          <span className="font-bold text-blue-700">{loc.tier}:</span> {loc.locations}
                        </p>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero; 