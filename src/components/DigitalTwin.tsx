import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Radio, Send, Square, Volume2, VolumeX, X, Loader2 } from 'lucide-react';
import { useVoiceLoop } from '../hooks/useVoiceLoop';

interface Turn {
  role: 'user' | 'assistant';
  content: string;
}

const GREETING =
  "Hey — I'm Michael's digital twin. Ask me about the work, the exits, or how finance and engineering actually fit together. What do you want to know?";

/** Recording ceiling. The transcribe endpoint rejects anything much past this. */
const MAX_RECORDING_MS = 60_000;

const blobToBase64 = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.slice(result.indexOf(',') + 1));
    };
    reader.readAsDataURL(blob);
  });

const DigitalTwin: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const [turns, setTurns] = useState<Turn[]>([{ role: 'assistant', content: GREETING }]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [voiceOn, setVoiceOn] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const stopTimerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  // Lets the close/unmount effect stop the loop without depending on it.
  const voiceRef = useRef<{ stop: () => void } | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [turns, thinking]);

  const stopAudio = useCallback(() => {
    audioRef.current?.pause();
    audioRef.current = null;
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
  }, []);

  // Release the mic and any in-flight audio when the panel closes or unmounts.
  useEffect(() => {
    if (open) return;
    stopAudio();
    voiceRef.current?.stop();
    recorderRef.current?.stream.getTracks().forEach((t) => t.stop());
    recorderRef.current = null;
  }, [open, stopAudio]);

  useEffect(() => () => stopAudio(), [stopAudio]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  /** Resolves when playback finishes, so hands-free knows when to listen again. */
  const speak = useCallback(async (text: string) => {
    try {
      const res = await fetch('/api/twin/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      // Voice is a bonus, not the feature — if it isn't configured or fails,
      // the reply is already on screen and we say nothing about it.
      if (!res.ok) return;

      stopAudio();
      const url = URL.createObjectURL(await res.blob());
      audioUrlRef.current = url;
      const audio = new Audio(url);
      audioRef.current = audio;

      await new Promise<void>((resolve) => {
        let settled = false;
        const done = () => {
          if (settled) return;
          settled = true;
          resolve();
        };
        audio.onended = done;
        audio.onerror = done;
        audio.play().catch(done);
      });
    } catch {
      /* silent — text is the deliverable */
    }
  }, [stopAudio]);

  const send = useCallback(async (text: string) => {
    const question = text.trim();
    if (!question || thinking) return;

    stopAudio();
    setNotice(null);
    setInput('');

    const history = [...turns, { role: 'user' as const, content: question }];
    setTurns(history);
    setThinking(true);

    let reply = '';
    let failed = false;

    try {
      const res = await fetch('/api/twin/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history.map(({ role, content }) => ({ role, content })) }),
      });

      if (!res.ok || !res.body) {
        const body = await res.json().catch(() => ({}));
        setNotice(
          (body as { error?: string }).error ||
            "The twin isn't reachable right now — email michael@modularequity.com instead."
        );
        setThinking(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      // Newline-delimited JSON: one event per line, partial lines held back.
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim()) continue;
          let event: { type?: string; text?: string; message?: string };
          try {
            event = JSON.parse(line);
          } catch {
            continue;
          }

          if (event.type === 'text' && event.text) {
            reply += event.text;
            setThinking(false);
            setTurns((prev) => {
              const next = [...prev];
              if (next[next.length - 1]?.role === 'assistant' && next.length > history.length) {
                next[next.length - 1] = { role: 'assistant', content: reply };
              } else {
                next.push({ role: 'assistant', content: reply });
              }
              return next;
            });
          } else if (event.type === 'error') {
            failed = true;
            setNotice(event.message || 'Something went wrong.');
          }
        }
      }
    } catch {
      failed = true;
      setNotice("Lost the connection. Try again, or email michael@modularequity.com.");
    } finally {
      setThinking(false);
    }

    // Awaited so a hands-free turn resumes listening only once the twin has
    // finished speaking, rather than transcribing its own voice.
    if (reply && !failed && voiceOn) await speak(reply);
  }, [turns, thinking, voiceOn, speak, stopAudio]);

  /** Shared by the push-to-talk button and the hands-free loop. */
  const transcribe = useCallback(async (blob: Blob, mimeType: string): Promise<string | null> => {
    setTranscribing(true);
    try {
      const res = await fetch('/api/twin/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audio: await blobToBase64(blob), mimeType }),
      });
      const data = (await res.json().catch(() => ({}))) as { text?: string; error?: string };
      if (!res.ok) {
        setNotice(data.error || "I couldn't transcribe that.");
        return null;
      }
      return data.text?.trim() || null;
    } catch {
      setNotice('Transcription failed — type it instead?');
      return null;
    } finally {
      setTranscribing(false);
    }
  }, []);

  // The loop hands us an utterance, we answer it, then hand control back. Held
  // in a ref because the handler needs `voice.resume`, which the hook returns.
  const utteranceRef = useRef<(blob: Blob, mimeType: string) => void>(() => undefined);
  const voice = useVoiceLoop({
    onUtterance: (blob, mimeType) => utteranceRef.current(blob, mimeType),
    onError: setNotice,
  });

  utteranceRef.current = async (blob, mimeType) => {
    const text = await transcribe(blob, mimeType);
    if (text) await send(text);
    voice.resume();
  };
  voiceRef.current = voice;

  const stopRecording = useCallback(() => {
    if (stopTimerRef.current) {
      window.clearTimeout(stopTimerRef.current);
      stopTimerRef.current = null;
    }
    recorderRef.current?.stop();
  }, []);

  const startRecording = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setNotice("This browser won't let me record audio — type your question instead.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      recorderRef.current = recorder;

      recorder.ondataavailable = (e) => e.data.size && chunks.push(e.data);

      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        setRecording(false);
        recorderRef.current = null;
        if (!chunks.length) return;

        const type = recorder.mimeType || 'audio/webm';
        const text = await transcribe(new Blob(chunks, { type }), type);
        if (text) await send(text);
        else setNotice((n) => n ?? "I didn't catch anything in that clip.");
      };

      stopAudio();
      setNotice(null);
      recorder.start();
      setRecording(true);
      stopTimerRef.current = window.setTimeout(stopRecording, MAX_RECORDING_MS);
    } catch {
      setNotice('I need microphone permission for voice — or just type.');
    }
  }, [send, transcribe, stopAudio, stopRecording]);

  const busy = thinking || transcribing;

  const toggleHandsFree = useCallback(() => {
    setNotice(null);
    if (voice.active) {
      voice.stop();
    } else {
      stopRecording();
      stopAudio();
      voice.start();
    }
  }, [voice, stopRecording, stopAudio]);

  const handsFreeStatus =
    voice.phase === 'calibrating'
      ? 'Getting a read on the room…'
      : voice.phase === 'hearing'
        ? 'Listening — pause when you’re done'
        : voice.phase === 'listening'
          ? 'Go ahead, I’m listening'
          : transcribing
            ? 'Transcribing…'
            : thinking
              ? 'Thinking…'
              : 'Speaking…';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Talk to Michael Kaminski's digital twin"
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 260 }}
            onClick={(e) => e.stopPropagation()}
            className="flex h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl border border-white/10 bg-ink-900 sm:h-[70vh] sm:rounded-2xl"
          >
            <header className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4">
              <div className="min-w-0">
                <h2 className="display text-lg text-white">Michael's Digital Twin</h2>
                <p className="truncate text-xs text-white/45">
                  An AI trained on his background — not Michael himself.
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  onClick={() => {
                    setVoiceOn((v) => !v);
                    stopAudio();
                  }}
                  aria-label={voiceOn ? 'Mute spoken replies' : 'Unmute spoken replies'}
                  aria-pressed={voiceOn}
                  className="rounded-full p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                >
                  {voiceOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
                </button>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="rounded-full p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>
            </header>

            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
              {turns.map((turn, i) => (
                <div key={i} className={turn.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                  <div
                    className={
                      turn.role === 'user'
                        ? 'max-w-[85%] rounded-2xl rounded-br-sm bg-accent px-4 py-2.5 text-[15px] leading-relaxed text-ink-900'
                        : 'max-w-[85%] rounded-2xl rounded-bl-sm border border-white/10 bg-white/[0.04] px-4 py-2.5 text-[15px] leading-relaxed text-white/90'
                    }
                  >
                    {turn.content}
                  </div>
                </div>
              ))}

              {busy && !voice.active && (
                <div className="flex items-center gap-2 text-sm text-white/45">
                  <Loader2 size={15} className="animate-spin" />
                  {transcribing ? 'Transcribing…' : 'Thinking…'}
                </div>
              )}

              {voice.active && (
                <div className="flex items-center gap-3 rounded-xl border border-accent/25 bg-accent/[0.06] px-3 py-2.5">
                  {/* Level meter — makes it obvious the mic is live and where the
                      speech threshold sits, which is otherwise invisible. */}
                  <span className="flex h-5 items-end gap-[3px]" aria-hidden="true">
                    {[0.25, 0.55, 0.85, 0.55, 0.25].map((peak, i) => (
                      <span
                        key={i}
                        className="w-[3px] rounded-full bg-accent transition-[height] duration-100"
                        style={{
                          height: `${Math.max(3, Math.min(1, voice.level / peak) * 20)}px`,
                          opacity: voice.phase === 'hearing' ? 1 : 0.4,
                        }}
                      />
                    ))}
                  </span>
                  <span role="status" className="text-sm text-accent">
                    {handsFreeStatus}
                  </span>
                </div>
              )}

              {notice && (
                <p role="status" className="rounded-lg border border-accent/30 bg-accent/5 px-3 py-2 text-sm text-accent">
                  {notice}
                </p>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 border-t border-white/10 px-4 py-3"
            >
              <button
                type="button"
                onClick={toggleHandsFree}
                aria-label={voice.active ? 'Stop hands-free conversation' : 'Start hands-free conversation'}
                aria-pressed={voice.active}
                title="Hands-free — talk, pause, and it answers"
                className={`shrink-0 rounded-full p-3 transition-colors ${
                  voice.active
                    ? 'bg-accent text-ink-900'
                    : 'border border-white/15 text-white/70 hover:border-accent/60 hover:text-white'
                }`}
              >
                <Radio size={17} />
              </button>

              <button
                type="button"
                onClick={recording ? stopRecording : startRecording}
                disabled={busy || voice.active}
                aria-label={recording ? 'Stop recording' : 'Ask by voice'}
                className={`shrink-0 rounded-full p-3 transition-colors disabled:opacity-40 ${
                  recording
                    ? 'bg-accent text-ink-900'
                    : 'border border-white/15 text-white/70 hover:border-accent/60 hover:text-white'
                }`}
              >
                {recording ? <Square size={17} /> : <Mic size={17} />}
              </button>

              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={busy || recording || voice.active}
                placeholder={
                  voice.active ? 'Hands-free is on…' : recording ? 'Listening…' : 'Ask about the work…'
                }
                aria-label="Your question"
                className="min-w-0 flex-1 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2.5 text-[15px] text-white placeholder:text-white/35 focus:border-accent/60 focus:outline-none disabled:opacity-50"
              />

              <button
                type="submit"
                disabled={busy || recording || voice.active || !input.trim()}
                aria-label="Send"
                className="shrink-0 rounded-full bg-accent p-3 text-ink-900 transition-opacity disabled:opacity-30"
              >
                <Send size={17} />
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DigitalTwin;
