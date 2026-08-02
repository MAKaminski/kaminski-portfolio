/**
 * Zero-import health probe. Temporary.
 *
 * The three twin functions deployed and routed correctly but failed at
 * invocation. This has no imports of any kind, so it separates "the runtime
 * can't load our compiled output at all" from "one of our imports is the
 * problem". Remove once the twin endpoints are confirmed healthy.
 */
export default function handler(_req: unknown, res: { status(c: number): { json(b: unknown): void } }) {
  res.status(200).json({
    ok: true,
    node: process.version,
    hasAnthropicKey: Boolean(process.env.ANTHROPIC_API_KEY),
    hasOpenAIKey: Boolean(process.env.OPENAI_API_KEY),
    hasElevenLabsKey: Boolean(process.env.ELEVENLABS_API_KEY),
    hasElevenLabsVoice: Boolean(process.env.ELEVENLABS_VOICE_ID),
  });
}
