import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Hands-free microphone loop with voice-activity detection.
 *
 * Holds the mic open and watches signal energy, so a turn is delimited by the
 * speaker pausing rather than by a click. It hands each complete utterance to
 * `onUtterance` and then suspends itself — the caller decides when listening
 * resumes, which keeps the twin from transcribing its own reply while that reply
 * is playing through the speakers.
 *
 * The threshold is calibrated against the room on every start. A fixed cutoff
 * works at a quiet desk and fails completely in a café or on a laptop fan.
 */

export type VoicePhase =
  | 'off'
  | 'calibrating'
  | 'listening' // mic open, waiting for speech
  | 'hearing' // speech in progress
  | 'suspended'; // caller is processing a turn

interface Options {
  onUtterance: (audio: Blob, mimeType: string) => void;
  onError: (message: string) => void;
}

const FRAME_MS = 50;
const CALIBRATION_MS = 700;

/** Speech must clear the room by this much. Lower is twitchier, higher misses soft talkers. */
const NOISE_MULTIPLIER = 2.2;
const FLOOR_MIN = 0.008;

const SPEECH_START_FRAMES = 3; //  150ms above threshold before we call it speech
const SILENCE_END_FRAMES = 26; // 1300ms below it before we call the turn over
const MIN_SPEECH_FRAMES = 8; //   400ms — below this it's a cough or a door
const MAX_UTTERANCE_MS = 30_000;

export function useVoiceLoop({ onUtterance, onError }: Options) {
  const [phase, setPhase] = useState<VoicePhase>('off');
  const [level, setLevel] = useState(0);

  const streamRef = useRef<MediaStream | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<number | null>(null);
  const capRef = useRef<number | null>(null);

  const thresholdRef = useRef(FLOOR_MIN);
  const aboveRef = useRef(0);
  const belowRef = useRef(0);
  const speechFramesRef = useRef(0);
  const recordingRef = useRef(false);

  // Kept in refs so the polling loop never closes over a stale callback.
  const onUtteranceRef = useRef(onUtterance);
  const onErrorRef = useRef(onError);
  useEffect(() => {
    onUtteranceRef.current = onUtterance;
    onErrorRef.current = onError;
  }, [onUtterance, onError]);

  const teardown = useCallback(() => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    if (capRef.current) window.clearTimeout(capRef.current);
    timerRef.current = null;
    capRef.current = null;

    if (recorderRef.current?.state === 'recording') {
      recorderRef.current.onstop = null;
      recorderRef.current.stop();
    }
    recorderRef.current = null;
    recordingRef.current = false;

    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;

    ctxRef.current?.close().catch(() => undefined);
    ctxRef.current = null;
    analyserRef.current = null;

    setLevel(0);
  }, []);

  useEffect(() => () => teardown(), [teardown]);

  const stop = useCallback(() => {
    teardown();
    setPhase('off');
  }, [teardown]);

  /** Called by the owner once a turn has been answered and played. */
  const resume = useCallback(() => {
    if (!streamRef.current) return;
    aboveRef.current = 0;
    belowRef.current = 0;
    speechFramesRef.current = 0;
    setPhase('listening');
  }, []);

  const rms = () => {
    const analyser = analyserRef.current;
    if (!analyser) return 0;
    const buf = new Float32Array(analyser.fftSize);
    analyser.getFloatTimeDomainData(buf);
    let sum = 0;
    for (let i = 0; i < buf.length; i++) sum += buf[i] * buf[i];
    return Math.sqrt(sum / buf.length);
  };

  const beginRecording = useCallback(() => {
    const stream = streamRef.current;
    if (!stream || recordingRef.current) return;

    const recorder = new MediaRecorder(stream);
    const chunks: Blob[] = [];
    recorderRef.current = recorder;
    recordingRef.current = true;

    recorder.ondataavailable = (e) => e.data.size && chunks.push(e.data);
    recorder.onstop = () => {
      recordingRef.current = false;
      if (capRef.current) window.clearTimeout(capRef.current);

      const enough = speechFramesRef.current >= MIN_SPEECH_FRAMES;
      speechFramesRef.current = 0;

      if (!enough || !chunks.length) {
        // Too short to be a sentence — go back to waiting without a round trip.
        if (streamRef.current) setPhase('listening');
        return;
      }

      setPhase('suspended');
      const type = recorder.mimeType || 'audio/webm';
      onUtteranceRef.current(new Blob(chunks, { type }), type);
    };

    recorder.start();
    capRef.current = window.setTimeout(() => {
      if (recorderRef.current?.state === 'recording') recorderRef.current.stop();
    }, MAX_UTTERANCE_MS);
  }, []);

  const start = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      onErrorRef.current("This browser won't let me hold the microphone open — type instead.");
      return;
    }

    try {
      // Echo cancellation is what stops the loop hearing the twin's own voice
      // leaking back through the speakers on the next turn.
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
      streamRef.current = stream;

      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      ctxRef.current = ctx;
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      ctx.createMediaStreamSource(stream).connect(analyser);
      analyserRef.current = analyser;

      setPhase('calibrating');
      const samples: number[] = [];
      const calibrationFrames = Math.round(CALIBRATION_MS / FRAME_MS);

      timerRef.current = window.setInterval(() => {
        const energy = rms();
        setLevel(Math.min(1, energy * 12));

        // Learn the room before reacting to it.
        if (samples.length < calibrationFrames) {
          samples.push(energy);
          if (samples.length === calibrationFrames) {
            const floor = samples.reduce((a, b) => a + b, 0) / samples.length;
            thresholdRef.current = Math.max(floor * NOISE_MULTIPLIER, FLOOR_MIN);
            setPhase('listening');
          }
          return;
        }

        setPhase((current) => {
          if (current === 'suspended' || current === 'off') return current;

          const loud = energy > thresholdRef.current;

          if (!recordingRef.current) {
            aboveRef.current = loud ? aboveRef.current + 1 : 0;
            if (aboveRef.current >= SPEECH_START_FRAMES) {
              aboveRef.current = 0;
              belowRef.current = 0;
              speechFramesRef.current = SPEECH_START_FRAMES;
              beginRecording();
              return 'hearing';
            }
            return 'listening';
          }

          if (loud) {
            speechFramesRef.current += 1;
            belowRef.current = 0;
          } else {
            belowRef.current += 1;
            if (belowRef.current >= SILENCE_END_FRAMES) {
              belowRef.current = 0;
              if (recorderRef.current?.state === 'recording') recorderRef.current.stop();
            }
          }
          return 'hearing';
        });
      }, FRAME_MS);
    } catch {
      teardown();
      setPhase('off');
      onErrorRef.current('I need microphone permission for hands-free — or just type.');
    }
  }, [beginRecording, teardown]);

  return { phase, level, start, stop, resume, active: phase !== 'off' };
}
