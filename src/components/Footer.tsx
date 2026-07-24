import React from 'react';
import { Mail, Phone, Linkedin, Github, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import NewsletterSignup from './NewsletterSignup';

const Footer: React.FC = () => {
  return (
    <footer className="bg-ink-900 text-white border-t-2 border-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="mb-14 max-w-2xl mx-auto">
          <NewsletterSignup />
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <h3 className="display text-2xl mb-3">
              Michael Kaminski<span className="accent">.</span>
            </h3>
            <p className="text-white/60 max-w-xs">
              Atlanta-based fintech leader — fluent in both PE-grade finance and hands-on
              software engineering.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-white/50 mb-4">Explore</h4>
            <ul className="space-y-2">
              {[
                { name: 'Impact', href: '#transactions' },
                { name: 'Experience', href: '#experience' },
                { name: 'Skills', href: '#skills' },
                { name: 'Testimonials', href: '#testimonials' },
              ].map((l) => (
                <li key={l.name}>
                  <a href={l.href} className="text-white/70 hover:text-accent transition-colors">{l.name}</a>
                </li>
              ))}
              <li><Link to="/writing" className="text-white/70 hover:text-accent transition-colors">Writing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-white/50 mb-4">Connect</h4>
            <ul className="space-y-3">
              <li><a href="mailto:mkaminski1337@gmail.com" className="flex items-center gap-2 text-white/70 hover:text-accent transition-colors"><Mail size={16} /> mkaminski1337@gmail.com</a></li>
              <li><a href="tel:+14048388613" className="flex items-center gap-2 text-white/70 hover:text-accent transition-colors"><Phone size={16} /> (404) 838-8613</a></li>
              <li><a href="https://www.linkedin.com/in/michaelxaxkaminski" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/70 hover:text-accent transition-colors"><Linkedin size={16} /> LinkedIn</a></li>
              <li><a href="https://github.com/MAKaminski" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/70 hover:text-accent transition-colors"><Github size={16} /> GitHub</a></li>
              <li><a href="https://calendly.com/kaminski1337/15min" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/70 hover:text-accent transition-colors"><Calendar size={16} /> Book a call</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center text-white/40 text-sm">
          © 2026 Michael Kaminski · Atlanta, GA
        </div>
      </div>
    </footer>
  );
};

export default Footer;
