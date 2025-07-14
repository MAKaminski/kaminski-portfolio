import React, { useState } from 'react';
import { Mail, CheckCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const NewsletterSignup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call - replace with actual newsletter service integration
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
      setEmail('');
    }, 1000);
  };

  if (isSubscribed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 text-center"
      >
        <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-green-800 mb-2">Welcome to the Network!</h3>
        <p className="text-green-700">
          You'll receive exclusive insights on strategy, finance, and executive leadership from Michael Kaminski.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6"
    >
      <div className="text-center mb-6">
        <Mail className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Get Executive Insights from Michael Kaminski
        </h3>
        <p className="text-gray-600">
          Join 500+ executives receiving strategic insights on finance, technology, and leadership.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>Subscribe to Insights</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      <p className="text-xs text-gray-500 text-center mt-4">
        No spam. Unsubscribe anytime. We respect your privacy.
      </p>
    </motion.div>
  );
};

export default NewsletterSignup; 