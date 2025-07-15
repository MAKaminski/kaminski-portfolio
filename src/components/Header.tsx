import React, { useState } from 'react';
import { Menu, X, Calendar, Linkedin, Github } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const headerBackground = useTransform(scrollY, [0, 100], ['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.98)']);
  const headerShadow = useTransform(scrollY, [0, 100], ['0 1px 3px 0 rgba(0, 0, 0, 0.1)', '0 10px 25px -5px rgba(0, 0, 0, 0.1)']);

  const navItems = [
    // Remove Projects from navItems
    { name: 'Experience', href: '#experience' },
    { name: 'Skills', href: '#skills' },
    { name: 'Transactions', href: '#transactions' },
    { name: 'Highlights', href: '#highlights' },
    { name: 'Contact', href: '#contact' },
  ];

  const additionalNavItems: { name: string; href: string }[] = [];

  const handleScheduleCall = () => {
    window.open('https://calendly.com/kaminski1337/15min', '_blank');
  };

  return (
    <motion.header 
      className="fixed top-0 w-full backdrop-blur-sm border-b z-50"
      style={{
        backgroundColor: headerBackground,
        boxShadow: headerShadow,
        borderColor: 'var(--primary)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <div className="flex items-center space-x-3">
              <img
                src="/images/4C877C83-2066-4555-9EBC-977D482075DC_4_5005_c.jpeg"
                alt="Michael Kaminski"
                className="w-8 h-8 rounded-full object-cover border-2"
                style={{ borderColor: 'var(--primary)' }}
              />
              <h1 className="text-xl font-bold" style={{ color: 'var(--primary)' }}>Michael Kaminski</h1>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-primary-600 transition-colors duration-200 font-medium"
                style={{ color: 'var(--primary)' }}
              >
                {item.name}
              </a>
            ))}
            {additionalNavItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-700 hover:text-primary-600 transition-colors duration-200 font-medium"
                style={{ color: 'var(--primary)' }}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Book a Call Button */}
            <button
              onClick={handleScheduleCall}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Calendar size={16} />
              <span>Book a Call</span>
            </button>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary-600 transition-colors duration-200"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors duration-200 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              {additionalNavItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors duration-200 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Book a Call Button */}
              <button
                onClick={() => {
                  handleScheduleCall();
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg"
              >
                <Calendar size={16} />
                <span>Book a Call</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.header>
  );
};

export default Header; 