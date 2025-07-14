import React from 'react';
import { Linkedin } from 'lucide-react';

const referrals = [
  {
    name: "Sarah Johnson",
    title: "CFO, TechGrowth Ventures",
    linkedin: "https://linkedin.com/in/sarah-johnson-cfo"
  },
  {
    name: "David Chen",
    title: "CEO, InnovateCorp",
    linkedin: "https://linkedin.com/in/david-chen-ceo"
  },
  {
    name: "Lisa Rodriguez",
    title: "Board Member, Strategic Partners Fund",
    linkedin: "https://linkedin.com/in/lisa-rodriguez-board"
  },
  {
    name: "Robert Kim",
    title: "Managing Director, Peak Capital",
    linkedin: "https://linkedin.com/in/robert-kim-md"
  },
  {
    name: "Amanda Foster",
    title: "CPO, DataFlow Solutions",
    linkedin: "https://linkedin.com/in/amanda-foster-cpo"
  },
  {
    name: "James Lee",
    title: "SVP, Operations, Home Depot",
    linkedin: "https://linkedin.com/in/james-lee-hd"
  },
  {
    name: "Priya Patel",
    title: "VP, Product, GreenSky",
    linkedin: "https://linkedin.com/in/priya-patel-greensky"
  }
];

const Referrals: React.FC = () => (
  <section id="referrals" className="section-padding" style={{ background: 'var(--bg)' }}>
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12" style={{ color: 'var(--primary)' }}>
        <h2 className="text-4xl font-bold mb-4">Referrals & Network</h2>
        <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--secondary)' }}>
          Trusted colleagues and leaders who have worked closely with me.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {referrals.map((ref, idx) => (
          <div key={ref.name} className="rounded-xl p-6 flex items-center shadow-sm hover:shadow-md transition-shadow duration-200" style={{ background: '#fff' }}>
            <div className="flex-shrink-0 mr-4">
              <a href={ref.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }} className="hover:opacity-80 transition-opacity duration-200">
                <Linkedin className="w-8 h-8" />
              </a>
            </div>
            <div>
              <a href={ref.linkedin} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold hover:underline" style={{ color: 'var(--primary)' }}>
                {ref.name}
              </a>
              <p className="text-sm" style={{ color: 'var(--secondary)' }}>{ref.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Referrals; 