import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, FileText, Loader2, Copy, CheckCheck, AlertCircle,
  ChevronDown, ChevronUp, Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// --- Types ---

interface UserStory {
  as: string;
  iWant: string;
  soThat: string;
}

interface SuccessMetric {
  metric: string;
  target: string;
}

interface TimelinePhase {
  phase: string;
  duration: string;
  deliverables: string[];
}

interface PRD {
  title: string;
  overview: string;
  problemStatement: string;
  goals: string[];
  userStories: UserStory[];
  acceptanceCriteria: string[];
  technicalRequirements: string[];
  successMetrics: SuccessMetric[];
  timeline: TimelinePhase[];
  openQuestions: string[];
}

interface FormData {
  featureName: string;
  problem: string;
  targetUsers: string;
  goals: string;
  userStories: string;
  constraints: string;
  timeline: string;
}

// --- Sub-components ---

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 text-xs text-gray-400 hover:text-blue-500 transition-colors duration-150"
    >
      {copied ? <CheckCheck size={13} className="text-green-500" /> : <Copy size={13} />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode; copyText?: string }> = ({
  title, children, copyText
}) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-3 bg-gray-50 hover:bg-gray-100 transition-colors duration-150"
      >
        <span className="font-semibold text-gray-800 text-sm tracking-wide uppercase">{title}</span>
        <div className="flex items-center gap-3">
          {copyText && open && <CopyButton text={copyText} />}
          {open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
        </div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 py-4 bg-white">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const BulletList: React.FC<{ items: string[] }> = ({ items }) => (
  <ul className="space-y-2">
    {items.map((item, i) => (
      <li key={i} className="flex items-start gap-2 text-gray-700 text-sm">
        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
        {item}
      </li>
    ))}
  </ul>
);

const PRDResult: React.FC<{ prd: PRD }> = ({ prd }) => {
  const fullText = JSON.stringify(prd, null, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-3"
    >
      {/* Title bar */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">{prd.title}</h2>
        <CopyButton text={fullText} />
      </div>

      <Section title="Overview" copyText={prd.overview}>
        <p className="text-gray-700 text-sm leading-relaxed">{prd.overview}</p>
      </Section>

      <Section title="Problem Statement" copyText={prd.problemStatement}>
        <p className="text-gray-700 text-sm leading-relaxed">{prd.problemStatement}</p>
      </Section>

      <Section title="Goals" copyText={prd.goals.join('\n')}>
        <BulletList items={prd.goals} />
      </Section>

      <Section
        title="User Stories"
        copyText={prd.userStories
          .map(s => `As ${s.as}, I want ${s.iWant}, so that ${s.soThat}.`)
          .join('\n')}
      >
        <div className="space-y-3">
          {prd.userStories.map((story, i) => (
            <div key={i} className="bg-blue-50 rounded-lg p-3 text-sm text-gray-700">
              <span className="font-medium">As</span> {story.as},{' '}
              <span className="font-medium">I want</span> {story.iWant},{' '}
              <span className="font-medium">so that</span> {story.soThat}.
            </div>
          ))}
        </div>
      </Section>

      <Section title="Acceptance Criteria" copyText={prd.acceptanceCriteria.join('\n')}>
        <BulletList items={prd.acceptanceCriteria} />
      </Section>

      <Section title="Technical Requirements" copyText={prd.technicalRequirements.join('\n')}>
        <BulletList items={prd.technicalRequirements} />
      </Section>

      <Section
        title="Success Metrics"
        copyText={prd.successMetrics.map(m => `${m.metric}: ${m.target}`).join('\n')}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {prd.successMetrics.map((m, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-3">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">{m.metric}</p>
              <p className="text-gray-900 font-semibold mt-0.5">{m.target}</p>
            </div>
          ))}
        </div>
      </Section>

      {prd.timeline.length > 0 && (
        <Section
          title="Timeline & Milestones"
          copyText={prd.timeline
            .map(p => `${p.phase} (${p.duration}): ${p.deliverables.join(', ')}`)
            .join('\n')}
        >
          <div className="space-y-4">
            {prd.timeline.map((phase, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mt-1 flex-shrink-0" />
                  {i < prd.timeline.length - 1 && (
                    <div className="w-0.5 flex-1 bg-blue-200 mt-1" />
                  )}
                </div>
                <div className="pb-4">
                  <p className="font-semibold text-gray-800 text-sm">
                    {phase.phase}
                    <span className="ml-2 text-xs font-normal text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                      {phase.duration}
                    </span>
                  </p>
                  <ul className="mt-1 space-y-0.5">
                    {phase.deliverables.map((d, j) => (
                      <li key={j} className="text-gray-600 text-sm">• {d}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {prd.openQuestions.length > 0 && (
        <Section title="Open Questions" copyText={prd.openQuestions.join('\n')}>
          <div className="space-y-2">
            {prd.openQuestions.map((q, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="font-bold text-amber-500 flex-shrink-0">{i + 1}.</span>
                {q}
              </div>
            ))}
          </div>
        </Section>
      )}
    </motion.div>
  );
};

// --- Main Page ---

const REQUIRED_FIELDS = ['featureName', 'problem', 'targetUsers', 'goals'] as const;

const JiraPRD: React.FC = () => {
  const [form, setForm] = useState<FormData>({
    featureName: '',
    problem: '',
    targetUsers: '',
    goals: '',
    userStories: '',
    constraints: '',
    timeline: '',
  });
  const [loading, setLoading] = useState(false);
  const [prd, setPrd] = useState<PRD | null>(null);
  const [rawText, setRawText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const isValid = REQUIRED_FIELDS.every(f => form[f].trim().length > 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setLoading(true);
    setPrd(null);
    setRawText(null);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/generate-prd`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Server error: ${res.status}`);
      }

      if (data.prd) {
        setPrd(data.prd);
      } else if (data.rawText) {
        setRawText(data.rawText);
      } else {
        throw new Error('Unexpected response from server.');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPrd(null);
    setRawText(null);
    setError(null);
  };

  const inputClass =
    'w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-150 bg-white text-gray-900 placeholder-gray-400';
  const textareaClass = `${inputClass} resize-none`;
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              to="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              <ArrowLeft size={20} />
              <span>Back to Portfolio</span>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <FileText size={16} className="text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Jira PRD Generator</h1>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Zap size={13} className="text-blue-400" />
              Powered by Claude
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className={`grid gap-8 ${prd || rawText ? 'lg:grid-cols-2' : 'max-w-2xl mx-auto'}`}>

          {/* Left: Form */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Generate a PRD</h2>
                <p className="text-gray-500 text-sm mt-1">
                  Fill in the details below and Claude will produce a structured,
                  Jira-ready Product Requirements Document.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Required */}
                <div>
                  <label className={labelClass}>
                    Feature / Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="featureName"
                    value={form.featureName}
                    onChange={handleChange}
                    placeholder="e.g. Real-time Notification Center"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Problem Statement <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="problem"
                    value={form.problem}
                    onChange={handleChange}
                    rows={3}
                    placeholder="What problem does this solve? Who is affected and how?"
                    className={textareaClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Target Users / Personas <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="targetUsers"
                    value={form.targetUsers}
                    onChange={handleChange}
                    placeholder="e.g. B2B SaaS power users, mobile-first consumers"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Goals & Success Metrics <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="goals"
                    value={form.goals}
                    onChange={handleChange}
                    rows={3}
                    placeholder="e.g. Reduce churn by 15%, increase DAU by 20%, NPS +10 within 90 days"
                    className={textareaClass}
                  />
                </div>

                {/* Optional */}
                <div>
                  <label className={labelClass}>
                    Initial User Stories{' '}
                    <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <textarea
                    name="userStories"
                    value={form.userStories}
                    onChange={handleChange}
                    rows={2}
                    placeholder="e.g. As an admin, I want to configure alert rules so that I'm notified of anomalies instantly."
                    className={textareaClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Technical Constraints{' '}
                    <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    name="constraints"
                    value={form.constraints}
                    onChange={handleChange}
                    placeholder="e.g. Must integrate with existing Kafka pipeline, no new infra spend"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Timeline{' '}
                    <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    name="timeline"
                    value={form.timeline}
                    onChange={handleChange}
                    placeholder="e.g. Q3 2026, 8-week sprint, must ship before annual conference"
                    className={inputClass}
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <motion.button
                    type="submit"
                    disabled={!isValid || loading}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200"
                    whileHover={{ scale: isValid && !loading ? 1.02 : 1 }}
                    whileTap={{ scale: isValid && !loading ? 0.98 : 1 }}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Generating PRD…
                      </>
                    ) : (
                      <>
                        <Zap size={16} />
                        Generate PRD
                      </>
                    )}
                  </motion.button>
                  {(prd || rawText || error) && (
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-4 py-3 text-sm text-gray-500 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-150"
                    >
                      Reset
                    </button>
                  )}
                </div>

                {loading && (
                  <p className="text-center text-xs text-gray-400">
                    Claude is generating your PRD — this usually takes 5–15 seconds.
                  </p>
                )}
              </form>
            </motion.div>
          </div>

          {/* Right: Output */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
              >
                <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Generation failed</p>
                  <p className="mt-0.5">{error}</p>
                </div>
              </motion.div>
            )}

            {prd && <PRDResult prd={prd} />}

            {rawText && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900">Generated PRD</h2>
                  <CopyButton text={rawText} />
                </div>
                <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-xl p-4 overflow-auto max-h-[70vh]">
                  {rawText}
                </pre>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default JiraPRD;
