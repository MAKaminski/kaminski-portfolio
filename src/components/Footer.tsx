import React from 'react';
import { Mail, Phone, Linkedin, Github, Calendar, PenLine, AtSign } from 'lucide-react';
import { PROFILES } from '../data/profiles';
import { Link } from 'react-router-dom';
import NewsletterSignup from './NewsletterSignup';
import { track } from '../utils/track';

// Everything the header no longer carries lives here, on every page.
const EXPLORE = [
  { name: 'Projects', href: '/projects' },
  { name: 'Writing', href: '/writing' },
  { name: 'About', href: '/about' },
  { name: 'Websites', href: '/websites' },
  { name: 'Products', href: '/products' },
  { name: 'Papers', href: '/papers' },
  { name: 'Clips', href: '/clips' },
  { name: 'Changelog', href: '/changelog' },
];

const BY_ROLE = [
  { name: 'Product', href: '/cpo', role: 'cpo' },
  { name: 'Strategy', href: '/strategy', role: 'strategy' },
  { name: 'Technology', href: '/technology', role: 'technology' },
];

const Footer: React.FC = () => {
  return (
    <footer className="bg-ink-900 text-white border-t-2 border-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10 pb-10 border-b border-white/10">
          <NewsletterSignup />
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <h3 className="display text-2xl mb-3">
              Michael Kaminski<span className="accent">.</span>
            </h3>
            <p className="text-white/60 max-w-xs">
              Technical product manager at the agent layer — AI agents, MCP servers, and
              eval harnesses that survive compliance review.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-white/50 mb-4">Explore</h4>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2">
              {EXPLORE.map((l) => (
                <li key={l.name}>
                  <Link
                    to={l.href}
                    onClick={() => track('Nav Clicked', { item: l.name, location: 'footer' })}
                    className="text-white/70 hover:text-accent transition-colors"
                  >
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-white/50 mt-6 mb-3">By role</h4>
            <ul className="flex gap-4">
              {BY_ROLE.map((l) => (
                <li key={l.name}>
                  <Link
                    to={l.href}
                    onClick={() => track('Role Page Visited', { role: l.role, path: l.href })}
                    className="text-white/70 hover:text-accent transition-colors"
                  >
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-white/50 mb-4">Connect</h4>
            <ul className="space-y-3">
              <li><a href="mailto:mkaminski1337@gmail.com" className="flex items-center gap-2 text-white/70 hover:text-accent transition-colors"><Mail size={16} /> mkaminski1337@gmail.com</a></li>
              <li><a href="tel:+14048388613" className="flex items-center gap-2 text-white/70 hover:text-accent transition-colors"><Phone size={16} /> (404) 838-8613</a></li>
              <li><a href={PROFILES.linkedin} target="_blank" rel="noopener noreferrer me" className="flex items-center gap-2 text-white/70 hover:text-accent transition-colors"><Linkedin size={16} /> LinkedIn</a></li>
              <li><a href={PROFILES.github} target="_blank" rel="noopener noreferrer me" className="flex items-center gap-2 text-white/70 hover:text-accent transition-colors"><Github size={16} /> GitHub</a></li>
              <li><a href={PROFILES.devto} target="_blank" rel="noopener noreferrer me" className="flex items-center gap-2 text-white/70 hover:text-accent transition-colors"><PenLine size={16} /> DEV</a></li>
              <li><a href={PROFILES.x} target="_blank" rel="noopener noreferrer me" className="flex items-center gap-2 text-white/70 hover:text-accent transition-colors"><AtSign size={16} /> X</a></li>
              <li><a href="https://calendly.com/kaminski1337/15min" target="_blank" rel="noopener noreferrer" onClick={() => track('Calendar Link Clicked', { source: 'Footer' })} className="flex items-center gap-2 text-white/70 hover:text-accent transition-colors"><Calendar size={16} /> Book a call</a></li>
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
