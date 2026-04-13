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
    ['rgba(255, 255, 255, 0.80)', 'rgba(255, 255, 255, 0.95)']
  );
  const headerShadow = useTransform(
    scrollY, 
    [0, 100], 
    ['0 1px 3px 0 rgba(0, 0, 0, 0.1)', '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)']
  );
  const headerBlur = useTransform(scrollY, [0, 100], ['blur(0px)', 'blur(20px)']);

  const navItems = [
    { name: 'About', href: '#about' },
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
      className="fixed top-0 w-full backdrop-blur-lg border-b z-50"
      style={{
        backgroundColor: headerBackground,
        boxShadow: headerShadow,
        backdropFilter: headerBlur,
        borderColor: 'rgba(59, 130, 246, 0.2)',
      }}
    >
      {/* Decorative gradient line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <motion.div 
            className="flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center space-x-3">
              <motion.div
                className="relative"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <img
                  src="/images/4C877C83-2066-4555-9EBC-977D482075DC_4_5005_c.jpeg"
                  alt="Michael Kaminski"
                  className="w-10 h-10 rounded-full object-cover border-2 border-blue-500 shadow-lg"
                />
                <motion.div
                  className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.7, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
              </motion.div>
              <div>
                <motion.h1 
                  className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Michael Kaminski
                </motion.h1>
                <motion.p
                  className="text-xs text-gray-500 font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  Executive Portfolio
                </motion.p>
              </div>
            </div>
          </motion.div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                className="relative text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium group"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ y: -2 }}
              >
                {item.name}
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 origin-left transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"
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
                  className="relative text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium group"
                >
                  {item.name}
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 origin-left transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"
                  />
                </Link>
              </motion.div>
            ))}
            
            {/* Enhanced Book a Call Button */}
            <motion.button
              onClick={handleScheduleCall}
              className="relative flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
              style={{ backgroundSize: '200% 100%' }}
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
              className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 rounded-lg hover:bg-blue-50"
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
            className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/80 backdrop-blur-lg border-t border-gray-200/50 rounded-b-2xl shadow-lg"
            initial={{ y: -20 }}
            animate={{ y: isMenuOpen ? 0 : -20 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {navItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 font-medium rounded-lg"
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
                  className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 font-medium rounded-lg"
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
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-bold shadow-lg mt-4"
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