import React from 'react';
import { motion } from 'framer-motion';
import { Target, Cpu, Building2, Users, Zap, Lightbulb } from 'lucide-react';

const About: React.FC = () => {
  const coreCompetencies = [
    {
      icon: Target,
      title: "Strategic Leadership",
      description: "Driving technology transformation and organizational alignment"
    },
    {
      icon: Cpu,
      title: "Modular Architecture",
      description: "Designing scalable, maintainable, and composable systems"
    },
    {
      icon: Building2,
      title: "Fintech Innovation",
      description: "Expertise in payments, digital banking, and financial services platforms"
    },
    {
      icon: Users,
      title: "Engineering Excellence",
      description: "Building high-performing teams and fostering a culture of accountability"
    },
    {
      icon: Zap,
      title: "Operational Rigor",
      description: "Implementing structured processes for predictable and efficient delivery"
    }
  ];

  const careerHighlights = [
    {
      icon: Building2,
      title: "Enterprise Transformation",
      description: "Led the re-architecture of a legacy financial platform into a modular, cloud-native solution, enhancing scalability and reducing time-to-market."
    },
    {
      icon: Users,
      title: "Team Leadership",
      description: "Built and managed cross-functional teams that delivered critical fintech products, resulting in significant revenue growth."
    },
    {
      icon: Zap,
      title: "Process Optimization",
      description: "Implemented structured methodologies that improved operational efficiency and reduced technical debt."
    }
  ];

  return (
    <section id="about" className="section-padding" style={{ background: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
          style={{ color: 'var(--primary)' }}
        >
          <h2 className="text-4xl font-bold mb-4">About Me</h2>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--secondary)' }}>
            Background, philosophy, and core competencies
          </p>
        </motion.div>

        {/* Core Competencies */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {coreCompetencies.map((competency, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: index * 0.15, type: "spring", stiffness: 100 }}
              viewport={{ once: true, margin: "-100px" }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white rounded-2xl shadow-lg p-8 card-hover"
            >
              <div className="flex items-start space-x-4">
                <div className="bg-primary-100 rounded-xl p-4 flex-shrink-0">
                  <competency.icon className="w-8 h-8 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{competency.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{competency.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Professional Headshot Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center gap-8 mb-16 bg-white rounded-2xl shadow-lg p-8"
        >
          <div className="flex-shrink-0">
            <img
              src="/images/EC43565C-9160-4DC8-98F9-2B362A4F6778_1_105_c.jpeg"
              alt="Michael Kaminski - Executive Leader"
              className="w-48 h-48 rounded-full object-cover shadow-lg border-4 border-white"
              style={{ borderColor: 'var(--primary)' }}
            />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--primary)' }}>Executive Leadership</h3>
            <p className="text-lg text-gray-700 leading-relaxed">
              With over two decades of experience leading scalable, modular technology initiatives across financial services, 
              payments, and enterprise platforms, I bring a unique blend of technical expertise and executive leadership 
              to drive transformational change.
            </p>
          </div>
        </motion.div>

        {/* Career Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Career Highlights</h3>
          <div className="space-y-8">
            {careerHighlights.map((highlight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <div className="flex items-start space-x-6">
                  <div className="bg-primary-100 rounded-xl p-4 flex-shrink-0">
                    <highlight.icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-3">{highlight.title}</h4>
                    <p className="text-gray-600 leading-relaxed">{highlight.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Philosophy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="rounded-2xl p-8 text-white"
          style={{ background: 'linear-gradient(90deg, var(--primary), var(--secondary))' }}
        >
          <div className="flex items-start space-x-6">
            <div className="bg-white bg-opacity-20 rounded-xl p-4 flex-shrink-0">
              <Lightbulb className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">My Philosophy</h3>
              <p className="text-primary-100 leading-relaxed mb-4">
                I believe in telling it like it is—clear, direct, and without sugar-coating. I approach challenges 
                with a high-level perspective before delving into details, ensuring that solutions are both strategic 
                and executable.
              </p>
              <p className="text-primary-100 leading-relaxed">
                Building in a modular manner is not just a technical preference but a business imperative for 
                adaptability and resilience. My leadership style is grounded in structured thinking, direct 
                communication, and a relentless focus on execution.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About; 