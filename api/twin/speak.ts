import { guard, type ApiRequest, type ApiResponse } from '../_lib/http';

/**
 * ElevenLabs text-to-speech in Michael's cloned voice.
 *
 * ELEVENLABS_VOICE_ID selects the clone; without it there is nothing to speak in,
 * so the endpoint reports itself unconfigured and the UI silently falls back to
 * text-only rather than speaking in a stranger's voice.
 */
const MAX_CHARS = 1200;

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (!guard(req, res, {
    requiredEnv: ['ELEVENLABS_API_KEY', 'ELEVENLABS_VOICE_ID'],
    limit: 20,
    windowMs: 60_000,
    // Reads into "<feature> isn't configured…", so keep this a singular noun.
    feature: 'Voice playback',
  })) return;

  const { text } = (req.body || {}) as { text?: string };
  if (typeof text !== 'string' || !text.trim()) {
    res.status(400).json({ error: 'Expected text to speak.' });
    return;
  }

  const voiceId = process.env.ELEVENLABS_VOICE_ID as string;
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}`;

  try {
    const upstream = await fetch(url, {
      method: 'POST',
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY as string,
        'Content-Type': 'application/json',
        Accept: 'audio/mpeg',
      },
      body: JSON.stringify({
        text: text.trim().slice(0, MAX_CHARS),
        model_id: 'eleven_turbo_v2_5',
        voice_settings: { stability: 0.45, similarity_boost: 0.8 },
      }),
    });

    if (!upstream.ok) {
      const detail = await upstream.text();
      console.error('[twin/speak]', upstream.status, detail.slice(0, 400));
      res.status(502).json({ error: 'Voice playback is unavailable right now.' });
      return;
    }

    const audio = Buffer.from(await upstream.arrayBuffer());
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).send(audio);
  } catch (err) {
    console.error('[twin/speak]', err instanceof Error ? err.message : err);
    res.status(502).json({ error: 'Voice playback is unavailable right now.' });
  }
}
