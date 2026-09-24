import React, { useState } from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { track } from '../utils/track';
import { identifyVisitor } from '../utils/posthog';
import { submitLead } from '../utils/lead';

/**
 * Sits in the footer, so it is on every page including every article. This used
 * to wait one second on a setTimeout and say "you're on the list" without
 * storing the address anywhere. The address now goes to /api/lead, which
 * records it server-side where ad blockers cannot drop it (see utils/lead.ts);
 * the posthog-js identify and event alongside it are analytics only.
 */
const NewsletterSignup: React.FC<{ source?: string }> = ({ source = 'footer' }) => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const page = typeof window !== 'undefined' ? window.location.pathname : '';
    // submitLead first: it reads the anonymous id before identify replaces it.
    void submitLead({ kind: 'newsletter', email, source });
    identifyVisitor(email, { newsletter_subscribed: true, newsletter_source: source });
    track('Newsletter Subscribed', { source, page });
    setIsSubscribed(true);
    setEmail('');
  };

  if (isSubscribed) {
    return (
      <p className="flex items-center justify-center gap-2 text-white/80">
        <CheckCircle className="w-5 h-5 text-emerald-400" />
        You're on the list: new field notes only, nothing else.
      </p>
    );
  }

  return (
    <div className="text-center">
      <h3 className="font-bold text-white">Field notes on agent infrastructure</h3>
      <p className="mt-1 text-sm text-white/60">
        New essays on MCP servers, eval harnesses, and getting agents through review. No cadence promises.
      </p>
      <form onSubmit={handleSubmit} className="mt-4 flex gap-2 max-w-md mx-auto">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          aria-label="Email for field notes"
          required
          className="min-w-0 flex-1 px-4 py-2.5 rounded-lg border border-white/15 bg-white/5 text-white placeholder-white/40 focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/40"
        />
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2.5 text-sm font-bold text-ink-900 hover:brightness-90"
        >
          Subscribe <ArrowRight size={15} />
        </button>
      </form>
    </div>
  );
};

export default NewsletterSignup;
