import React, { Component, ReactNode, Suspense, lazy, useEffect, useState } from 'react';
import { RefreshCw, X } from 'lucide-react';
import { track } from '../utils/track';
import { captureException } from '../utils/posthog';

// The twin (framer-motion panel + voice loop + audio APIs) is ~25 KB of source that
// nobody needs until they click. Its own Suspense boundary matters: without one the
// first render would suspend up to App's RouteFallback and paint "Loading" instead
// of the hero. React.lazy caches a rejected import, so a retry needs a new one.
const lazyTwin = () =>
  lazy(() =>
    import('./DigitalTwin').then((m) => {
      track('Digital Twin Loaded');
      return m;
    }),
  );

class TwinBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    captureException(error, { component: 'DigitalTwin' });
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/**
 * A chunk that fails to download (flaky network, a blocked request, a deploy that
 * replaced the file) used to throw past every boundary and unmount the whole page.
 * This keeps the failure inside the twin's own dialog.
 */
const LoadFailed: React.FC<{ onRetry: () => void; onClose: () => void }> = ({ onRetry, onClose }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Digital twin failed to load"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-t-2xl border border-white/10 bg-ink-900 p-6 sm:rounded-2xl"
      >
        <h2 className="display text-lg text-white">The digital twin didn't load</h2>
        <p className="mt-2 text-sm text-white/60">Check your connection, then try again.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" onClick={onRetry} className="btn-pill-accent text-sm">
            <RefreshCw className="h-4 w-4" /> Try again
          </button>
          <button type="button" onClick={onClose} className="btn-pill-ghost text-sm">
            <X className="h-4 w-4" /> Close
          </button>
        </div>
      </div>
    </div>
  );
};

const DigitalTwinLoader: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [DigitalTwin, setDigitalTwin] = useState(lazyTwin);
  const [attempt, setAttempt] = useState(0);

  const retry = () => {
    setDigitalTwin(lazyTwin);
    setAttempt((a) => a + 1);
  };

  return (
    <TwinBoundary key={attempt} fallback={<LoadFailed onRetry={retry} onClose={onClose} />}>
      <Suspense fallback={null}>
        <DigitalTwin open onClose={onClose} />
      </Suspense>
    </TwinBoundary>
  );
};

export default DigitalTwinLoader;
