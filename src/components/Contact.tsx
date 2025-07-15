import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Linkedin, Download, Calendar } from 'lucide-react';
import CensoredNumber from './CensoredNumber';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="section-padding" style={{ background: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Get In Touch</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ready to discuss executive opportunities? Let's connect and explore how we can drive transformational growth together.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
            
            {/* Professional Headshot */}
            <div className="flex items-center mb-6">
              <img
                src="/images/FA82E2EA-5B88-4FF0-AFBA-2FDFA2FEEDFE_1_105_c.jpeg"
                alt="Michael Kaminski - Contact"
                className="w-20 h-20 rounded-full object-cover shadow-lg border-2 mr-4"
                style={{ borderColor: 'var(--primary)' }}
              />
              <div>
                <h4 className="text-lg font-semibold text-gray-900">Michael Kaminski</h4>
                <p className="text-gray-600">Executive Leader & Technology Strategist</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center">
                <Mail className="w-6 h-6 text-primary-600 mr-4" />
                <div>
                  <p className="font-semibold text-gray-900">Email</p>
                  <a href="mailto:mkaminski1337@gmail.com" className="text-primary-600 hover:text-primary-700 transition-colors duration-200">
                    mkaminski1337@gmail.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-center">
                <Phone className="w-6 h-6 text-primary-600 mr-4" />
                <div>
                  <p className="font-semibold text-gray-900">Phone</p>
                  <a href="tel:+14048388613" className="text-primary-600 hover:text-primary-700 transition-colors duration-200">
                    (404) 838-8613
                  </a>
                </div>
              </div>
              
              <div className="flex items-center">
                <MapPin className="w-6 h-6 text-primary-600 mr-4" />
                <div>
                  <p className="font-semibold text-gray-900">Location</p>
                  <p className="text-gray-600">Atlanta, GA (Preferred)</p>
                  <p className="text-gray-600">Open to relocation for the right opportunity</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Linkedin className="w-6 h-6 text-primary-600 mr-4" />
                <div>
                  <p className="font-semibold text-gray-900">LinkedIn</p>
                  <a href="https://linkedin.com/in/michaelxaxkaminski" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 transition-colors duration-200">
                    linkedin.com/in/michaelxaxkaminski
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3">Current Status</h4>
              <div className="space-y-2">
                <p className="text-gray-600">• Actively seeking executive opportunities</p>
                <p className="text-gray-600">• Open to PE industry return</p>
                <p className="text-gray-600">• Available for immediate start</p>
              </div>
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="rounded-2xl shadow-lg p-8 text-white"
            style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}
          >
            <h3 className="text-2xl font-bold mb-6">Ready to Connect?</h3>
            <p className="mb-8 leading-relaxed" style={{ color: 'var(--secondary)' }}>
              I'm looking for opportunities where I can leverage my executive experience in turnarounds, strategic transformations, and scaling operations. Let's discuss how we can create value together.
            </p>
            
            <div className="space-y-4">
              <a 
                href="https://calendly.com/kaminski1337/15min" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full bg-white text-primary-600 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Book Call
              </a>
              
              <a 
                href="/docs/Kaminski Resume.pdf" 
                download="Michael_Kaminski_Resume.pdf"
                className="w-full border border-white text-white font-semibold py-3 px-6 rounded-lg hover:bg-white hover:text-primary-600 transition-colors duration-200 flex items-center justify-center"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Full Resume
              </a>
            </div>

            <div className="mt-8 pt-6 border-t border-primary-500">
              <h4 className="font-semibold mb-3">What I'm Looking For</h4>
              <div className="space-y-2 text-primary-100">
                <p>• Action-oriented, transformational culture</p>
                <p>• Performance-based compensation & equity</p>
                <p>• Clear timelines and measurable targets</p>
                <p>• Opportunity to drive significant impact</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 grid md:grid-cols-3 gap-6"
        >
          <div className="bg-white rounded-xl p-6 text-center shadow-lg">
            <CensoredNumber value="$225K" className="text-2xl text-primary-600" />
            <p className="text-gray-600">Target Base Salary</p>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-lg">
            <CensoredNumber value="$50K+" className="text-2xl text-primary-600" />
            <p className="text-gray-600">Performance Bonus</p>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-lg">
            <h4 className="text-2xl font-bold text-primary-600 mb-2">Equity</h4>
            <p className="text-gray-600">Performance-based</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact; 