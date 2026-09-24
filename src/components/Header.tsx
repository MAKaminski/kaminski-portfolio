import React, { useState } from 'react';
import { Menu, X, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { track } from '../utils/track';

const CALENDLY_URL = 'https://calendly.com/kaminski1337/15min';

// Four destinations, one per visitor path plus contact. Everything else lives
// in the footer and the mobile menu: the old bar had thirteen links, which ran
// off the right edge at 1440px and took the Book a Call button with it.
const PRIMARY = [
  { name: 'Projects', href: '/projects' },
  { name: 'Writing', href: '/writing' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/#contact' },
];

const SECONDARY = [
  { name: 'Websites', href: '/websites' },
  { name: 'Products', href: '/products' },
  { name: 'Papers', href: '/papers' },
  { name: 'Clips', href: '/clips' },
  { name: 'Changelog', href: '/changelog' },
];

const navClick = (item: string, location: string) => track('Nav Clicked', { item, location });

/** Hash links need a plain anchor so the browser scrolls; routes use <Link>. */
const NavLink: React.FC<{ href: string; className: string; onClick: () => void; children: React.ReactNode }> = ({
  href,
  className,
  onClick,
  children,
}) =>
  href.includes('#') ? (
    <a href={href} className={className} onClick={onClick}>
      {children}
    </a>
  ) : (
    <Link to={href} className={className} onClick={onClick}>
      {children}
    </Link>
  );

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 border-b border-white/10 bg-ink-900/85 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="group flex items-center gap-2.5"
            aria-label="Michael Kaminski — home"
            onClick={() => navClick('Home', 'header')}
          >
            <span className="h-2.5 w-2.5 rounded-full bg-accent" />
            <span className="text-lg font-bold tracking-tight text-white group-hover:text-accent transition-colors">
              Michael Kaminski
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-7">
            {PRIMARY.map((item) => (
              <NavLink
                key={item.name}
                href={item.href}
                onClick={() => navClick(item.name, 'header')}
                className="text-sm font-medium text-white/70 hover:text-white transition-colors"
              >
                {item.name}
              </NavLink>
            ))}
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track('Calendar Link Clicked', { source: 'Header' })}
              className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-bold text-ink-900 hover:brightness-90 transition"
            >
              <Calendar size={15} />
              Book a call
            </a>
          </nav>

          <button
            onClick={() => setIsMenuOpen((o) => !o)}
            className="md:hidden p-2 text-white hover:text-accent rounded-lg"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <motion.div
          initial={false}
          animate={{ height: isMenuOpen ? 'auto' : 0, opacity: isMenuOpen ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="md:hidden overflow-hidden"
        >
          <div className="pb-4 pt-1 space-y-1 border-t border-white/10">
            {[...PRIMARY, ...SECONDARY].map((item, i) => (
              <NavLink
                key={item.name}
                href={item.href}
                onClick={() => {
                  navClick(item.name, 'mobile_menu');
                  setIsMenuOpen(false);
                }}
                className={`block px-3 py-2.5 rounded-lg hover:bg-white/5 ${
                  i < PRIMARY.length ? 'text-white font-medium' : 'text-white/60 text-sm'
                }`}
              >
                {item.name}
              </NavLink>
            ))}
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                track('Calendar Link Clicked', { source: 'Header (mobile)' });
                setIsMenuOpen(false);
              }}
              className="mt-3 flex items-center justify-center gap-2 rounded-full bg-accent px-4 py-3 font-bold text-ink-900"
            >
              <Calendar size={16} />
              Book a call
            </a>
          </div>
        </motion.div>
      </div>
    </header>
  );
};

export default Header;
