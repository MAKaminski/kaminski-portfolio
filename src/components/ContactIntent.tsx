import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, CheckCircle, Download } from 'lucide-react';
import { track } from '../utils/track';
import {
  POSTHOG_KEY,
  getExperimentVariant,
  identifyVisitor,
  setVisitorProperties,
} from '../utils/posthog';
import {
  CALENDLY_URL,
  CONTACT_EXPERIMENTS,
  ContactExperiment,
} from '../data/contactExperiments';

const CONTACT_ENDPOINT = process.env.REACT_APP_CONTACT_ENDPOINT;
const INBOX = 'mkaminski1337@gmail.com';

const inputClass =
  'w-full px-4 py-3 rounded-lg border border-white/15 bg-white/5 text-white placeholder-white/40 outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/40';
const primaryBtn =
  'w-full bg-accent text-ink-900 font-bold py-3 px-6 rounded-lg hover:brightness-90 transition-all duration-200 flex items-center justify-center';

type Stage = 'pick' | 'loading' | 'ask' | 'done';

/**
 * One click to say who you are, then the smallest ask we can get away with.
 * Which ask each visitor sees is decided by the intent's PostHog experiment;
 * see src/data/contactExperiments.ts for the variants and the funnel.
 */
const ContactIntent: React.FC = () => {
  const [stage, setStage] = useState<Stage>('pick');
  const [exp, setExp] = useState<ContactExperiment | null>(null);
  const [variant, setVariant] = useState('');
  const [started, setStarted] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [email, setEmail] = useState('');
  const [detail, setDetail] = useState('');

  const props = () => ({ intent: exp?.intent ?? '', variant });

  const choose = async (e: ContactExperiment) => {
    setExp(e);
    setStage('loading');
    // Known before they type anything: the answer to "who is interested".
    setVisitorProperties({ contact_intent: e.intent }, { first_contact_intent: e.intent });
    track('Contact Intent Selected', { intent: e.intent });
    const v = (await getExperimentVariant(e.flagKey)) === e.test ? e.test : e.control;
    setVariant(v);
    setStage('ask');
  };

  const markStarted = () => {
    if (started) return;
    setStarted(true);
    track('Contact Ask Started', props());
  };

  const deliver = (payload: Record<string, string>) => {
    if (CONTACT_ENDPOINT) {
      void fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => undefined);
      return;
    }
    // PostHog's person record is the inbox when it is on. With neither PostHog
    // nor an endpoint configured, fall back to the visitor's mail client.
    if (!POSTHOG_KEY) {
      const subject = encodeURIComponent(`Portfolio: ${payload.intent}`);
      const body = encodeURIComponent(`${payload.detail || ''}\n\nFrom: ${payload.email}`);
      window.location.href = `mailto:${INBOX}?subject=${subject}&body=${body}`;
    }
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!exp || !email) return;
    identifyVisitor(email, {
      contact_intent: exp.intent,
      contact_variant: variant,
      ...(detail ? { contact_detail: detail } : {}),
      source: 'portfolio contact intent',
    });
    track('Contact Lead Captured', { ...props(), method: 'form' });
    deliver({ intent: exp.intent, variant, email, detail });
    setStage('done');
  };

  const openCalendar = () => {
    markStarted();
    track('Contact Lead Captured', { ...props(), method: 'calendar' });
    track('Calendar Link Clicked', { source: `Contact Intent (${exp?.intent})` });
  };

  const reset = () => {
    setStage('pick');
    setExp(null);
    setVariant('');
    setStarted(false);
    setExpanded(false);
    setEmail('');
    setDetail('');
  };

  const emailInput = (
    <input
      type="email"
      required
      value={email}
      onFocus={markStarted}
      onChange={(e) => setEmail(e.target.value)}
      placeholder="Your email"
      aria-label="Your email"
      className={inputClass}
    />
  );

  const renderAsk = () => {
    if (!exp) return null;

    if (variant === 'calendar_first') {
      return (
        <div className="space-y-4">
          <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" onClick={openCalendar} className={primaryBtn}>
            <Calendar className="w-5 h-5 mr-2" />
            Grab 15 minutes
          </a>
          {expanded ? (
            <form onSubmit={submit} className="flex gap-2">
              {emailInput}
              <button type="submit" className="bg-accent text-ink-900 font-bold px-4 rounded-lg" aria-label="Send">
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => { markStarted(); setExpanded(true); }}
              className="w-full text-sm text-white/60 hover:text-white underline underline-offset-4"
            >
              Not ready for a call? Just leave your email.
            </button>
          )}
        </div>
      );
    }

    if (variant === 'two_step' && !expanded) {
      return (
        <button type="button" onClick={() => { markStarted(); setExpanded(true); }} className={primaryBtn}>
          Keep me posted
          <ArrowRight className="w-5 h-5 ml-2" />
        </button>
      );
    }

    const detailField =
      variant === 'short_form'
        ? { placeholder: 'What are you building? (one line)', label: 'What are you building' }
        : variant === 'email_and_role'
        ? { placeholder: 'Role link or title', label: 'Role link or title' }
        : null;

    return (
      <form onSubmit={submit} className="space-y-3">
        {emailInput}
        {detailField && (
          <input
            value={detail}
            required
            onFocus={markStarted}
            onChange={(e) => setDetail(e.target.value)}
            placeholder={detailField.placeholder}
            aria-label={detailField.label}
            className={inputClass}
          />
        )}
        <button type="submit" className={primaryBtn}>
          {exp.intent === 'reader' ? 'Send me the next one' : 'Send'}
          <ArrowRight className="w-5 h-5 ml-2" />
        </button>
      </form>
    );
  };

  const renderDone = () => {
    if (!exp) return null;
    const copy = {
      fractional: 'Got it. I reply to these within one business day.',
      recruiter: "Got it. I'll reply within one business day — here's the resume in the meantime.",
      reader: "You're on the list. New field notes only, nothing else.",
    }[exp.intent];
    return (
      <div className="text-center space-y-4">
        <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
        <p className="text-white/80">{copy}</p>
        {exp.intent === 'recruiter' && (
          <a
            href="/resume.pdf"
            download
            onClick={() => track('Resume Downloaded', { source: 'Contact Intent' })}
            className={primaryBtn}
          >
            <Download className="w-5 h-5 mr-2" />
            Download resume
          </a>
        )}
        {exp.intent === 'fractional' && (
          <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" onClick={openCalendar} className="text-accent underline underline-offset-4">
            Or skip the wait and grab 15 minutes
          </a>
        )}
        {exp.intent === 'reader' && (
          <a href="/writing" className="text-accent underline underline-offset-4">
            Read what's already out
          </a>
        )}
      </div>
    );
  };

  return (
    <motion.div
      id="contact-form"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="mt-12 max-w-2xl mx-auto rilla-card p-8"
    >
      <h3 className="text-2xl font-bold text-white mb-2 text-center">
        {stage === 'pick' || !exp ? 'What brings you here?' : exp.label}
      </h3>
      {stage === 'pick' && (
        <>
          <p className="text-white/50 text-center mb-6 text-sm">One click. No form until you want one.</p>
          <div className="grid gap-3">
            {CONTACT_EXPERIMENTS.map((e) => (
              <button
                key={e.intent}
                type="button"
                onClick={() => void choose(e)}
                className="text-left rounded-lg border border-white/15 bg-white/5 p-4 hover:border-accent/60 hover:bg-accent/[0.06] transition-colors"
              >
                <span className="block font-semibold text-white">{e.label}</span>
                <span className="block text-sm text-white/60">{e.blurb}</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-white/50 text-center mt-4">
            Something else?{' '}
            <a
              href={`mailto:${INBOX}?subject=Portfolio%20inquiry`}
              onClick={() => track('Contact Intent Selected', { intent: 'other' })}
              className="underline underline-offset-4 hover:text-white"
            >
              Email me directly
            </a>
            .
          </p>
        </>
      )}
      {stage === 'loading' && (
        <div className="flex justify-center py-6" aria-live="polite">
          <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {stage === 'ask' && (
        <div className="mt-6">
          {renderAsk()}
          <button type="button" onClick={reset} className="block mx-auto mt-4 text-xs text-white/40 hover:text-white/70">
            ← Pick something else
          </button>
        </div>
      )}
      {stage === 'done' && <div className="mt-6">{renderDone()}</div>}
    </motion.div>
  );
};

export default ContactIntent;
