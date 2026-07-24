import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Download, Send, Linkedin, Calendar } from 'lucide-react';
import { track } from '@vercel/analytics';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const CONTACT_ENDPOINT = process.env.REACT_APP_CONTACT_ENDPOINT;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    track('Contact Form Submission', { email: formData.email });

    // When a form endpoint is configured (e.g. Formspree/Resend), POST to it.
    // Otherwise fall back to opening the visitor's email client.
    if (CONTACT_ENDPOINT) {
      try {
        const res = await fetch(CONTACT_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        alert('Thank you for your message! I will get back to you soon.');
        setFormData({ name: '', email: '', message: '' });
        return;
      } catch (err) {
        // fall through to mailto on failure
      }
    }

    const subject = encodeURIComponent(`Portfolio inquiry from ${formData.name || 'a visitor'}`);
    const body = encodeURIComponent(`${formData.message}\n\nFrom: ${formData.name} (${formData.email})`);
    window.location.href = `mailto:mkaminski1337@gmail.com?subject=${subject}&body=${body}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

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
          <h2 className="display text-4xl md:text-5xl text-white mb-4">Get In <span className="accent">Touch</span></h2>
          <p className="text-xl text-white/60 max-w-3xl mx-auto">
            Building something in fintech, payments, or financial services? Let's talk about fractional CFO/CTO work, product &amp; engineering leadership, or a full-time executive role.
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
              <picture>
                <source srcSet="/images/FA82E2EA-5B88-4FF0-AFBA-2FDFA2FEEDFE_1_105_c.webp" type="image/webp" />
                <img
                  src="/images/FA82E2EA-5B88-4FF0-AFBA-2FDFA2FEEDFE_1_105_c.jpeg"
                  alt="Michael Kaminski - Contact"
                  loading="lazy"
                  decoding="async"
                  className="w-20 h-20 rounded-full object-cover shadow-lg border-2 mr-4"
                  style={{ borderColor: 'var(--primary)' }}
                />
              </picture>
              <div>
                <h4 className="text-lg font-semibold text-gray-900">Michael Kaminski</h4>
                <p className="text-gray-600">Fintech Finance &amp; Engineering Leader · Atlanta</p>
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
                onClick={() => track('Calendar Link Clicked', { source: 'Contact Section' })}
                className="w-full bg-white text-primary-600 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Book Call
              </a>
              
              <a
                href="mailto:mkaminski1337@gmail.com?subject=Portfolio%20inquiry"
                onClick={() => track('Contact Email Clicked', { source: 'Contact Section' })}
                className="w-full bg-transparent border-2 border-white text-white font-semibold py-3 px-6 rounded-lg hover:bg-white hover:text-primary-600 transition-colors duration-200 flex items-center justify-center"
              >
                <Send className="w-5 h-5 mr-2" />
                Send Message
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

        {/* Message form — POSTs to REACT_APP_CONTACT_ENDPOINT if set, else opens email */}
        <motion.form
          id="contact-form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Send a Message</h3>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Your name"
              aria-label="Your name"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Your email"
              aria-label="Your email"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            required
            rows={5}
            placeholder="How can I help?"
            aria-label="Message"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none mb-4"
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
          >
            <Send className="w-5 h-5 mr-2" />
            Send Message
          </button>
          <p className="text-xs text-gray-400 text-center mt-3">Goes straight to my inbox.</p>
        </motion.form>
      </div>
    </section>
  );
};

export default Contact; 