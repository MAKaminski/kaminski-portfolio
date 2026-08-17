import React, { useState } from 'react';
import { Menu, X, Calendar, Linkedin, Github, Sparkles } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const headerBackground = useTransform(
    scrollY,
    [0, 100],
    ['rgba(6, 6, 6, 0.55)', 'rgba(6, 6, 6, 0.9)']
  );
  const headerShadow = useTransform(
    scrollY, 
    [0, 100], 
    ['0 1px 3px 0 rgba(0, 0, 0, 0.1)', '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)']
  );
  const headerBlur = useTransform(scrollY, [0, 100], ['blur(0px)', 'blur(20px)']);

  // Absolute /#… anchors so nav works from any route (not just the home page).
  const navItems = [
    { name: 'Impact', href: '/#transactions' },
    { name: 'Experience', href: '/#experience' },
    { name: 'Skills', href: '/#skills' },
    { name: 'Testimonials', href: '/#testimonials' },
    { name: 'Contact', href: '/#contact' },
  ];

  const additionalNavItems: { name: string; href: string }[] = [
    { name: 'Websites', href: '/websites' },
    { name: 'Products', href: '/products' },
    { name: 'Writing', href: '/writing' },
    { name: 'Clips', href: '/clips' },
    { name: 'Changelog', href: '/changelog' },
    { name: 'Client Outcomes', href: '/client-outcomes' },
  ];

  const handleScheduleCall = () => {
    window.open('https://calendly.com/kaminski1337/15min', '_blank');
  };

  return (
    <motion.header 
      className="fixed top-0 w-full backdrop-blur-lg border-b z-50"
      style={{
        backgroundColor: headerBackground,
        boxShadow: headerShadow,
        backdropFilter: headerBlur,
        borderColor: 'rgba(255, 255, 255, 0.1)',
      }}
    >
      {/* Decorative accent line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Wordmark — links home from any page */}
          <motion.div
            className="flex-shrink-0 mr-6"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link to="/" className="group flex items-center gap-2.5" aria-label="Michael Kaminski — home">
              <span className="h-2.5 w-2.5 rounded-full bg-accent transition-transform duration-200 group-hover:scale-125" />
              <span className="text-xl font-bold tracking-tight text-white transition-colors duration-200 group-hover:text-accent">
                Michael Kaminski
              </span>
            </Link>
          </motion.div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-5 lg:space-x-6">
            {navItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                className="relative whitespace-nowrap text-white/75 hover:text-accent transition-colors duration-200 font-medium group"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ y: -2 }}
              >
                {item.name}
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent origin-left transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"
                />
              </motion.a>
            ))}
            {additionalNavItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * (navItems.length + index) }}
              >
                <Link
                  to={item.href}
                  className="relative whitespace-nowrap text-white/75 hover:text-accent transition-colors duration-200 font-medium group"
                >
                  {item.name}
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent origin-left transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"
                  />
                </Link>
              </motion.div>
            ))}
            
            {/* Enhanced Book a Call Button */}
            <motion.button
              onClick={handleScheduleCall}
              className="relative flex flex-shrink-0 items-center whitespace-nowrap space-x-2 px-5 py-2.5 bg-accent text-ink-900 rounded-full font-bold shadow-lg hover:brightness-90 transition-all duration-200 overflow-hidden group"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Animated background shine */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: 'loop',
                  ease: 'linear'
                }}
              />
              <Calendar size={16} />
              <span>Book a Call</span>
              <motion.div
                className="ml-1"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles size={14} />
              </motion.div>
            </motion.button>
          </nav>

          {/* Mobile menu button */}
          <motion.div 
            className="md:hidden"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative p-2 text-white hover:text-accent transition-colors duration-200 rounded-lg hover:bg-white/10"
            >
              <motion.div
                animate={{ rotate: isMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.div>
            </button>
          </motion.div>
        </div>

        {/* Enhanced Mobile Navigation */}
        <motion.div
          initial={false}
          animate={{
            height: isMenuOpen ? 'auto' : 0,
            opacity: isMenuOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="md:hidden overflow-hidden"
        >
          <motion.div
            className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-ink-900/95 backdrop-blur-lg border-t border-white/10 rounded-b-2xl shadow-lg"
            initial={{ y: -20 }}
            animate={{ y: isMenuOpen ? 0 : -20 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {navItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                className="block px-4 py-3 text-white/80 hover:text-accent hover:bg-white/5 transition-all duration-200 font-medium rounded-lg"
                onClick={() => setIsMenuOpen(false)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: isMenuOpen ? 1 : 0, x: isMenuOpen ? 0 : -20 }}
                transition={{ duration: 0.3, delay: 0.05 * index }}
                whileHover={{ x: 5 }}
              >
                {item.name}
              </motion.a>
            ))}
            {additionalNavItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: isMenuOpen ? 1 : 0, x: isMenuOpen ? 0 : -20 }}
                transition={{ duration: 0.3, delay: 0.05 * (navItems.length + index) }}
              >
                <Link
                  to={item.href}
                  className="block px-4 py-3 text-white/80 hover:text-accent hover:bg-white/5 transition-all duration-200 font-medium rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
            
            {/* Mobile Book a Call Button */}
            <motion.button
              onClick={() => {
                handleScheduleCall();
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-accent text-ink-900 rounded-full hover:brightness-90 transition-all duration-200 font-bold shadow-lg mt-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ 
                opacity: isMenuOpen ? 1 : 0, 
                scale: isMenuOpen ? 1 : 0.9 
              }}
              transition={{ duration: 0.3, delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Calendar size={16} />
              <span>Book a Call</span>
              <Sparkles size={14} />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header; 