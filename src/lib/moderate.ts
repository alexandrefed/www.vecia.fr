/**
 * LLM moderator. Prompt lives in moderation-prompt.ts (changes need Alexandre's approval).
 * Any failure (no key, error, timeout, bad JSON) becomes verdict `queue`: a human decides.
 */

import Anthropic from '@anthropic-ai/sdk';
import { MODERATION_SYSTEM_PROMPT, moderationUserMessage } from './moderation-prompt';

export const MODERATION_MODEL = 'claude-haiku-4-5-20251001';

export type Verdict = 'publish' | 'drop' | 'queue';
export interface ModerationResult {
  verdict: Verdict;
  label: string;
  reason: string;
  model: string | null;
}

const VERDICTS = new Set<Verdict>(['publish', 'drop', 'queue']);
const LABELS = new Set(['constructive', 'useful', 'funny', 'spam', 'abuse', 'manipulation', 'unsure']);

const unsure = (reason: string, model: string | null = null): ModerationResult => ({ verdict: 'queue', label: 'unsure', reason, model });

/** Parse the model's reply. Tolerates a ```json fence; anything else off-spec becomes queue/unsure. */
export function parseVerdict(text: string, model: string | null = MODERATION_MODEL): ModerationResult {
  const cleaned = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  let data: unknown;
  try {
    data = JSON.parse(cleaned);
  } catch {
    return unsure('Moderator reply was not valid JSON.', model);
  }
  if (!data || typeof data !== 'object') return unsure('Moderator reply was not a JSON object.', model);
  const { verdict, label, reason } = data as Record<string, unknown>;
  if (typeof verdict !== 'string' || !VERDICTS.has(verdict as Verdict)) return unsure('Moderator reply had no valid verdict.', model);
  return {
    verdict: verdict as Verdict,
    label: typeof label === 'string' && LABELS.has(label) ? label : 'unsure',
    reason: typeof reason === 'string' ? reason.slice(0, 300) : '',
    model,
  };
}

export type ModerationInput = Parameters<typeof moderationUserMessage>[0];

export async function moderate(input: ModerationInput): Promise<ModerationResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return unsure('No ANTHROPIC_API_KEY configured, nothing was judged.');
  try {
    const client = new Anthropic({ apiKey, maxRetries: 0 });
    const res = await client.messages.create(
      {
        model: MODERATION_MODEL,
        max_tokens: 200,
        system: MODERATION_SYSTEM_PROMPT,
        messages: [{ role: 'user', content: moderationUserMessage(input) }],
      },
      { timeout: 8_000 },
    );
    const block = res.content.find((b) => b.type === 'text');
    if (!block || block.type !== 'text') return unsure('Moderator returned no text.', MODERATION_MODEL);
    return parseVerdict(block.text);
  } catch (err) {
    const why = err instanceof Error ? err.name : 'error';
    return unsure(`Moderator call failed (${why}).`, MODERATION_MODEL);
  }
}

/** shadow (default): always queue but keep the model's verdict. live: act on the verdict. */
export function moderationMode(): 'shadow' | 'live' {
  return process.env.MODERATION_MODE === 'live' ? 'live' : 'shadow';
}

export function statusFor(verdict: Verdict, mode: 'shadow' | 'live'): 'published' | 'queued' | 'dropped' {
  if (mode === 'shadow') return 'queued';
  return verdict === 'publish' ? 'published' : verdict === 'drop' ? 'dropped' : 'queued';
}
