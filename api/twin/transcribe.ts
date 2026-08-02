import { guard, type ApiRequest, type ApiResponse } from '../_lib/http';

const WHISPER_URL = 'https://api.openai.com/v1/audio/transcriptions';
const MODEL = 'whisper-1';

/**
 * Vercel caps a request body at 4.5MB, and base64 inflates by ~4/3 — so the
 * decoded ceiling is ~3MB, which is a couple of minutes of Opus. The client
 * stops recording well before this; the check is here for anything that doesn't.
 */
const MAX_AUDIO_BYTES = 3 * 1024 * 1024;

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (!guard(req, res, {
    requiredEnv: ['OPENAI_API_KEY'],
    limit: 20,
    windowMs: 60_000,
    feature: 'Voice input',
  })) return;

  const { audio, mimeType } = (req.body || {}) as { audio?: string; mimeType?: string };
  if (typeof audio !== 'string' || !audio) {
    res.status(400).json({ error: 'Expected base64 audio.' });
    return;
  }

  const bytes = Buffer.from(audio, 'base64');
  if (!bytes.length) {
    res.status(400).json({ error: 'Audio was empty or not valid base64.' });
    return;
  }
  if (bytes.length > MAX_AUDIO_BYTES) {
    res.status(413).json({ error: 'That clip is too long — keep it under about two minutes.' });
    return;
  }

  // Whisper picks its decoder from the file extension, so the container type has
  // to survive the round trip; MediaRecorder gives us webm/opus in practice.
  const type = typeof mimeType === 'string' && mimeType ? mimeType.split(';')[0] : 'audio/webm';
  const ext = type.split('/')[1] || 'webm';

  const form = new FormData();
  form.append('file', new Blob([bytes], { type }), `speech.${ext}`);
  form.append('model', MODEL);
  form.append('language', 'en');

  try {
    const upstream = await fetch(WHISPER_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: form,
    });

    if (!upstream.ok) {
      const detail = await upstream.text();
      console.error('[twin/transcribe]', upstream.status, detail.slice(0, 400));
      res.status(502).json({ error: "I couldn't make out that recording. Try again?" });
      return;
    }

    const { text } = (await upstream.json()) as { text?: string };
    res.status(200).json({ text: (text || '').trim() });
  } catch (err) {
    console.error('[twin/transcribe]', err instanceof Error ? err.message : err);
    res.status(502).json({ error: "Transcription is unavailable right now." });
  }
}
