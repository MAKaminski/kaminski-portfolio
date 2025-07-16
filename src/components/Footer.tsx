import React from 'react';
import NewsletterSignup from './NewsletterSignup';

const Footer: React.FC = () => {
  return (
    <footer className="py-12" style={{ background: 'var(--primary)', color: '#fff' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <div className="mb-12">
          <div className="max-w-2xl mx-auto">
            <NewsletterSignup />
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Executive Portfolio</h3>
            <p className="mb-4" style={{ color: 'var(--secondary)' }}>
              CXO/CSTO specializing in Strategy, Finance, Product, and Analytics. 
              Proven track record in turnarounds and strategic transformations.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#experience" className="text-gray-400 hover:text-white transition-colors duration-200">Experience</a></li>
              <li><a href="#skills" className="text-gray-400 hover:text-white transition-colors duration-200">Skills</a></li>
              <li><a href="#transactions" className="text-gray-400 hover:text-white transition-colors duration-200">Transactions</a></li>
              <li><a href="#highlights" className="text-gray-400 hover:text-white transition-colors duration-200">Highlights</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors duration-200">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Target Profile</h4>
            <ul className="space-y-2 text-gray-400">
              <li>• Revenue: $0 - $100MM</li>
              <li>• Headcount: 2 - 200</li>
              <li>• Action-oriented culture</li>
              <li>• Performance-based compensation</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 Executive Portfolio. All rights reserved. | 
            <span className="ml-2">Target Compensation: $225K Base + $50K+ Bonus</span>
          </p>
        </div>
        <div className="text-center text-gray-500 text-sm mt-4">
          © 2024 Michael Kaminski. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer; 