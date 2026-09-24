import React, { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';
import { track } from '../utils/track';
import { submitLead } from '../utils/lead';
import { identifyVisitor } from '../utils/posthog';

interface Props {
  /** Where on the site the form lives; becomes the `source` on the lead and the event. */
  source: string;
  className?: string;
}

/**
 * Optional "email me a copy" next to the download button. Not a gate: the
 * download stays one click. Anyone who fills this in is identified in PostHog
 * by email, so the download (and every earlier pageview) joins a named person,
 * and /api/lead sends them the resume link and Michael a notification.
 */
const ResumeEmailCapture: React.FC<Props> = ({ source, className }) => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const addr = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addr)) return;
    setState('sending');
    identifyVisitor(addr, { resume_requested: true, source: `resume email ${source}` });
    track('Resume Emailed', { source });
    const ok = await submitLead({ kind: 'resume', email: addr, source });
    setState(ok ? 'done' : 'error');
  };

  if (state === 'done') {
    return (
      <p className={`inline-flex items-center gap-2 text-sm text-white/70 ${className || ''}`}>
        <CheckCircle className="w-4 h-4 text-emerald-400" /> Sent. Check your inbox.
      </p>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          track('Resume Email Opened', { source });
        }}
        className={`inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-accent transition-colors ${className || ''}`}
      >
        <Mail className="w-4 h-4" /> or email me a copy
      </button>
    );
  }

  return (
    <form onSubmit={submit} className={`flex flex-wrap items-center gap-2 ${className || ''}`}>
      <label htmlFor={`resume-email-${source}`} className="sr-only">
        Your email
      </label>
      <input
        id={`resume-email-${source}`}
        type="email"
        required
        autoFocus
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@company.com"
        className="h-10 w-56 rounded-full border border-white/15 bg-white/5 px-4 text-sm text-white placeholder:text-white/40 focus:border-accent focus:outline-none"
      />
      <button
        type="submit"
        disabled={state === 'sending'}
        className="h-10 rounded-full bg-accent px-4 text-sm font-semibold text-ink-900 disabled:opacity-60"
      >
        {state === 'sending' ? 'Sending…' : 'Email me the resume'}
      </button>
      {state === 'error' && (
        <span className="text-sm text-red-300">Could not send. The download above still works.</span>
      )}
    </form>
  );
};

export default ResumeEmailCapture;
