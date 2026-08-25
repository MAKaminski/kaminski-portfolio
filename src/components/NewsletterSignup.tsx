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
        className="rounded-rilla border border-emerald-400/30 bg-emerald-400/[0.07] p-6 text-center"
      >
        <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">You're on the list</h3>
        <p className="text-white/70">
          You'll get new field notes on agent infrastructure, evals, and shipping agents into
          production — nothing else.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rilla-card p-6"
    >
      <div className="text-center mb-6">
        <Mail className="w-12 h-12 text-accent mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">
          Field notes on agent infrastructure
        </h3>
        <p className="text-white/60">
          New essays on MCP servers, eval harnesses, and getting agents through review. No cadence promises.
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
            className="w-full px-4 py-3 rounded-lg border border-white/15 bg-white/5 text-white placeholder-white/40 focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/40"
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

      <p className="text-xs text-white/50 text-center mt-4">
        No spam. Unsubscribe anytime. We respect your privacy.
      </p>
    </motion.div>
  );
};

export default NewsletterSignup; 