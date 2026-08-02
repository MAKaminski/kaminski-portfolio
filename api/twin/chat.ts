import Anthropic from '@anthropic-ai/sdk';
import { TWIN_SYSTEM_PROMPT } from '../_lib/persona';
import { guard, type ApiRequest, type ApiResponse } from '../_lib/http';

const MODEL = 'claude-opus-5';

/** Conversational latency matters more than depth here, and the persona caps length anyway. */
const EFFORT = 'low';

/** Headroom for thinking plus the reply — thinking is on by default on this model. */
const MAX_TOKENS = 4096;

const MAX_TURNS = 24;
const MAX_CHARS = 2000;

interface Turn {
  role: 'user' | 'assistant';
  content: string;
}

function parseTurns(body: unknown): Turn[] | null {
  const raw = (body as { messages?: unknown } | undefined)?.messages;
  if (!Array.isArray(raw) || raw.length === 0) return null;

  const turns: Turn[] = [];
  for (const item of raw.slice(-MAX_TURNS)) {
    const role = (item as Turn)?.role;
    const content = (item as Turn)?.content;
    if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string') return null;
    const trimmed = content.trim();
    if (trimmed) turns.push({ role, content: trimmed.slice(0, MAX_CHARS) });
  }

  // The API requires the conversation to start and end with a user turn.
  while (turns.length && turns[0].role !== 'user') turns.shift();
  if (!turns.length || turns[turns.length - 1].role !== 'user') return null;
  return turns;
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (!guard(req, res, {
    requiredEnv: ['ANTHROPIC_API_KEY'],
    limit: 20,
    windowMs: 60_000,
    feature: 'The digital twin',
  })) return;

  const messages = parseTurns(req.body);
  if (!messages) {
    res.status(400).json({ error: 'Expected a non-empty messages array ending in a user turn.' });
    return;
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  // Newline-delimited JSON so a mid-stream failure can be reported as a normal
  // event instead of a truncated body the client would render as a real answer.
  res.setHeader('Content-Type', 'application/x-ndjson; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');

  try {
    const stream = client.messages.stream({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      thinking: { type: 'adaptive' },
      output_config: { effort: EFFORT },
      // The persona is a large, byte-stable prefix — cache it so only the
      // conversation tail is billed at full rate on every turn.
      system: [
        {
          type: 'text',
          text: TWIN_SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages,
    });

    stream.on('text', (delta) => {
      res.write(`${JSON.stringify({ type: 'text', text: delta })}\n`);
    });

    const final = await stream.finalMessage();

    if (final.stop_reason === 'refusal') {
      res.write(`${JSON.stringify({
        type: 'error',
        message: "I'd rather not go down that road — ask me something about the work instead.",
      })}\n`);
    }

    res.write(`${JSON.stringify({ type: 'done', stop_reason: final.stop_reason })}\n`);
    res.end();
  } catch (err) {
    const status = err instanceof Anthropic.APIError ? err.status : undefined;
    const message =
      err instanceof Anthropic.RateLimitError
        ? 'The twin is getting a lot of traffic right now — try again shortly.'
        : "Something broke on my end. Try again, or just email me.";

    console.error('[twin/chat]', status ?? '', err instanceof Error ? err.message : err);
    res.write(`${JSON.stringify({ type: 'error', message })}\n`);
    res.end();
  }
}
