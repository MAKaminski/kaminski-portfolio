import React from 'react';
import { motion } from 'framer-motion';
import { Target, Cpu, Building2, Users, Zap, Lightbulb, ArrowRight, CheckCircle } from 'lucide-react';

const About: React.FC = () => {
  const coreCompetencies = [
    {
      icon: Target,
      title: "Strategic Leadership",
      description: "Driving technology transformation and organizational alignment",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50"
    },
    {
      icon: Cpu,
      title: "Modular Architecture",
      description: "Designing scalable, maintainable, and composable systems",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50"
    },
    {
      icon: Building2,
      title: "Fintech Innovation",
      description: "Expertise in payments, digital banking, and financial services platforms",
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50"
    },
    {
      icon: Users,
      title: "Engineering Excellence",
      description: "Building high-performing teams and fostering a culture of accountability",
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50"
    },
    {
      icon: Zap,
      title: "Operational Rigor",
      description: "Implementing structured processes for predictable and efficient delivery",
      gradient: "from-indigo-500 to-blue-500",
      bgGradient: "from-indigo-50 to-blue-50"
    }
  ];

  const careerHighlights = [
    {
      icon: Building2,
      title: "Enterprise Transformation",
      description: "Led the re-architecture of a legacy financial platform into a modular, cloud-native solution, enhancing scalability and reducing time-to-market.",
      stats: ["40% faster deployment", "60% cost reduction", "99.9% uptime"],
      gradient: "from-blue-600 to-cyan-600"
    },
    {
      icon: Users,
      title: "Team Leadership",
      description: "Built and managed cross-functional teams that delivered critical fintech products, resulting in significant revenue growth.",
      stats: ["50+ team members", "$50M+ revenue impact", "95% retention rate"],
      gradient: "from-purple-600 to-pink-600"
    },
    {
      icon: Zap,
      title: "Process Optimization",
      description: "Implemented structured methodologies that improved operational efficiency and reduced technical debt.",
      stats: ["70% faster delivery", "50% less bugs", "90% client satisfaction"],
      gradient: "from-green-600 to-emerald-600"
    }
  ];

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
    hidden: { opacity: 0, y: 30 },
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
    <section id="about" className="relative py-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-pink-400/10 to-indigo-400/10 rounded-full blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 25, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto section-padding">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Section Header */}
          <motion.div
            variants={itemVariants}
            className="text-center mb-20"
          >
            <motion.h2 
              className="text-5xl md:text-6xl font-black mb-6"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                About Me
              </span>
            </motion.h2>
            <motion.p 
              className="text-2xl font-bold mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Michael Kaminski is a CXO, CTO, and executive leader based in Atlanta,<br />
                specializing in fintech, technology, and strategic transformation.
              </span>
            </motion.p>
            <motion.p 
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Background, philosophy, and core competencies
            </motion.p>
          </motion.div>

          {/* Core Competencies Grid */}
          <motion.div variants={itemVariants} className="mb-24">
            <h3 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
              Core Competencies
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {coreCompetencies.map((competency, index) => (
                <motion.div
                  key={index}
                  className={`relative bg-gradient-to-br ${competency.bgGradient} rounded-3xl p-8 border border-white/50 shadow-xl backdrop-blur-sm`}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    duration: 0.7, 
                    delay: index * 0.1, 
                    type: "spring", 
                    stiffness: 100 
                  }}
                  viewport={{ once: true, margin: "-50px" }}
                  whileHover={{ 
                    y: -10, 
                    scale: 1.03,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)"
                  }}
                >
                  {/* Floating Icon */}
                  <motion.div 
                    className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${competency.gradient} rounded-2xl shadow-lg mb-6`}
                    whileHover={{ 
                      rotate: 10,
                      scale: 1.1
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <competency.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{competency.title}</h3>
                  <p className="text-gray-700 leading-relaxed text-lg">{competency.description}</p>
                  
                  {/* Decorative Element */}
                  <motion.div
                    className={`absolute top-4 right-4 w-12 h-12 bg-gradient-to-r ${competency.gradient} rounded-full opacity-10`}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.1, 0.2, 0.1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: index * 0.5,
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Executive Spotlight */}
          <motion.div
            variants={itemVariants}
            className="relative mb-24"
          >
            <div className="bg-gradient-to-r from-white/80 to-blue-50/80 backdrop-blur-lg rounded-3xl shadow-2xl p-12 border border-white/50">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur-2xl opacity-20"
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
                    src="/images/EC43565C-9160-4DC8-98F9-2B362A4F6778_1_105_c.jpeg"
                    alt="Michael Kaminski - Executive Leader"
                    className="relative w-full max-w-sm mx-auto rounded-3xl object-cover shadow-2xl border-4 border-white ring-4 ring-blue-500/20"
                  />
                  <motion.div
                    className="absolute -bottom-4 -right-4 bg-gradient-to-r from-green-400 to-blue-500 text-white p-4 rounded-2xl shadow-lg"
                    initial={{ scale: 0, rotate: -15 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                    viewport={{ once: true }}
                  >
                    <CheckCircle className="w-8 h-8" />
                  </motion.div>
                </motion.div>
                
                <div className="space-y-6">
                  <h3 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                    Executive Leadership
                  </h3>
                  <p className="text-xl text-gray-700 leading-relaxed">
                    With over two decades of experience leading scalable, modular technology initiatives across financial services, 
                    payments, and enterprise platforms, I bring a unique blend of technical expertise and executive leadership 
                    to drive transformational change.
                  </p>
                  <div className="flex items-center space-x-4 text-blue-600">
                    <ArrowRight className="w-6 h-6" />
                    <span className="font-semibold text-lg">Ready to drive your next transformation</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Career Highlights */}
          <motion.div variants={itemVariants} className="mb-24">
            <h3 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
              Career Highlights
            </h3>
            <div className="space-y-8">
              {careerHighlights.map((highlight, index) => (
                <motion.div
                  key={index}
                  className="relative bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 border border-gray-100"
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true, margin: "-50px" }}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)"
                  }}
                >
                  <div className="grid md:grid-cols-4 gap-8 items-center">
                    {/* Icon */}
                    <motion.div 
                      className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${highlight.gradient} rounded-3xl shadow-lg`}
                      whileHover={{ 
                        rotate: 360,
                        scale: 1.1
                      }}
                      transition={{ duration: 0.6 }}
                    >
                      <highlight.icon className="w-10 h-10 text-white" />
                    </motion.div>
                    
                    {/* Content */}
                    <div className="md:col-span-2 space-y-4">
                      <h4 className="text-2xl font-bold text-gray-900">{highlight.title}</h4>
                      <p className="text-gray-700 leading-relaxed text-lg">{highlight.description}</p>
                    </div>
                    
                    {/* Stats */}
                    <div className="space-y-3">
                      {highlight.stats.map((stat, i) => (
                        <motion.div
                          key={i}
                          className="flex items-center space-x-2 text-sm font-semibold"
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                          viewport={{ once: true }}
                        >
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="text-gray-800">{stat}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Philosophy Section */}
          <motion.div
            variants={itemVariants}
            className="relative"
          >
            <div className="relative bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 rounded-3xl p-12 text-white overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <defs>
                    <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                      <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>
              
              <div className="relative grid md:grid-cols-2 gap-12 items-center">
                <motion.div 
                  className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="bg-white/20 rounded-2xl p-4">
                      <Lightbulb className="w-10 h-10" />
                    </div>
                    <h3 className="text-3xl font-bold">My Philosophy</h3>
                  </div>
                  
                  <div className="space-y-6">
                    <p className="text-white/90 leading-relaxed text-lg">
                      I believe in telling it like it is—clear, direct, and without sugar-coating. I approach challenges 
                      with a high-level perspective before delving into details, ensuring that solutions are both strategic 
                      and executable.
                    </p>
                    <p className="text-white/90 leading-relaxed text-lg">
                      Building in a modular manner is not just a technical preference but a business imperative for 
                      adaptability and resilience. My leadership style is grounded in structured thinking, direct 
                      communication, and a relentless focus on execution.
                    </p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="space-y-6"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  {[
                    "Direct, honest communication",
                    "Strategic thinking with tactical execution",
                    "Modular, scalable solutions",
                    "Data-driven decision making"
                  ].map((principle, i) => (
                    <motion.div
                      key={i}
                      className="flex items-center space-x-4"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                      viewport={{ once: true }}
                    >
                      <div className="bg-gradient-to-r from-blue-400 to-purple-400 p-2 rounded-lg">
                        <CheckCircle className="w-6 h-6" />
                      </div>
                      <span className="text-xl font-medium">{principle}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About; 