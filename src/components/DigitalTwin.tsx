import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Send, Square, Volume2, VolumeX, X, Loader2 } from 'lucide-react';

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
      await audio.play().catch(() => undefined);
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

    if (reply && !failed && voiceOn) speak(reply);
  }, [turns, thinking, voiceOn, speak, stopAudio]);

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

        setTranscribing(true);
        try {
          const blob = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' });
          const res = await fetch('/api/twin/transcribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              audio: await blobToBase64(blob),
              mimeType: recorder.mimeType || 'audio/webm',
            }),
          });
          const data = await res.json().catch(() => ({}));

          if (!res.ok) {
            setNotice((data as { error?: string }).error || "I couldn't transcribe that.");
          } else if ((data as { text?: string }).text) {
            await send((data as { text: string }).text);
          } else {
            setNotice("I didn't catch anything in that clip.");
          }
        } catch {
          setNotice('Transcription failed — type it instead?');
        } finally {
          setTranscribing(false);
        }
      };

      stopAudio();
      setNotice(null);
      recorder.start();
      setRecording(true);
      stopTimerRef.current = window.setTimeout(stopRecording, MAX_RECORDING_MS);
    } catch {
      setNotice('I need microphone permission for voice — or just type.');
    }
  }, [send, stopAudio, stopRecording]);

  const busy = thinking || transcribing;

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

              {busy && (
                <div className="flex items-center gap-2 text-sm text-white/45">
                  <Loader2 size={15} className="animate-spin" />
                  {transcribing ? 'Transcribing…' : 'Thinking…'}
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
                onClick={recording ? stopRecording : startRecording}
                disabled={busy}
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
                disabled={busy || recording}
                placeholder={recording ? 'Listening…' : 'Ask about the work…'}
                aria-label="Your question"
                className="min-w-0 flex-1 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2.5 text-[15px] text-white placeholder:text-white/35 focus:border-accent/60 focus:outline-none disabled:opacity-50"
              />

              <button
                type="submit"
                disabled={busy || recording || !input.trim()}
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
