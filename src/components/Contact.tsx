import React from 'react';
import { Mail, Phone, MapPin, Linkedin } from 'lucide-react';
import { track } from '../utils/track';
import ContactIntent from './ContactIntent';
import { PROFILES } from '../data/profiles';
import { useSectionView } from '../hooks/useSectionView';

/**
 * The end of every path. The intent picker leads (it runs the three contact
 * experiments); the direct details sit underneath as one row. They used to be
 * two full cards that repeated the footer word for word.
 */
const Contact: React.FC = () => {
  const ref = useSectionView<HTMLElement>('contact');
  const direct = (channel: string) => track('Contact Direct Clicked', { channel });

  return (
    <section ref={ref} id="contact" className="section-padding scroll-mt-20" style={{ background: 'var(--bg)' }}>
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="display text-4xl md:text-5xl text-white">
          Get in <span className="accent">touch</span>
        </h2>
        <p className="mt-4 text-lg text-white/60">
          Senior product roles on agent platforms and agent infrastructure: Technical Product Manager, Senior
          Product Owner, or PM for an agent platform. Fractional and full-time both work, and I can start
          immediately.
        </p>
      </div>

      <ContactIntent />

      <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-white/65">
        <li>
          <a href="mailto:mkaminski1337@gmail.com" onClick={() => direct('email')} className="inline-flex items-center gap-2 hover:text-accent">
            <Mail className="w-4 h-4" /> mkaminski1337@gmail.com
          </a>
        </li>
        <li>
          <a href="tel:+14048388613" onClick={() => direct('phone')} className="inline-flex items-center gap-2 hover:text-accent">
            <Phone className="w-4 h-4" /> (404) 838-8613
          </a>
        </li>
        <li>
          <a
            href={PROFILES.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => direct('linkedin')}
            className="inline-flex items-center gap-2 hover:text-accent"
          >
            <Linkedin className="w-4 h-4" /> LinkedIn
          </a>
        </li>
        <li className="inline-flex items-center gap-2">
          <MapPin className="w-4 h-4" /> Atlanta, GA · open to relocation
        </li>
      </ul>
      <p className="mt-4 text-center text-sm text-white/45">
        Looking for: teams shipping agents into production, regulated domains where the evidence trail matters,
        ownership of tools, evals, and approval gates, and performance-based pay with equity.
      </p>
    </section>
  );
};

export default Contact;
