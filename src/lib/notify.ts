/**
 * ntfy notification for every queued comment, with Publish / Drop buttons signed for the moderate endpoint.
 * Never throws; logs one line on failure; never logs secrets.
 */

import { moderationSig } from './comments-core';
import type { CommentRow } from './comments-db';

/** HTTP header values must be latin-1: strip accents, replace the rest. */
function asciiHeader(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\x20-\x7e]/g, '?').replace(/[\r\n]+/g, ' ');
}

export async function notifyQueued(c: CommentRow, pageTitle: string): Promise<void> {
  try {
    const base = process.env.NTFY_URL || 'https://ntfy.vecia.fr';
    const topic = process.env.NTFY_TOPIC || 'alex-alerts';
    const site = process.env.SITE_URL || 'https://vecia.fr';
    const key = process.env.MODERATION_HMAC_KEY;
    const token = process.env.NTFY_TOKEN;

    const headers: Record<string, string> = {
      Title: asciiHeader(`New comment on ${pageTitle}`).slice(0, 200),
      Tags: 'speech_balloon',
    };
    if (token) headers.Authorization = `Bearer ${token}`;
    if (key) {
      const action = (label: string, a: 'publish' | 'drop') =>
        `http, ${label}, ${site}/api/comments/moderate.json, method=POST, body='${JSON.stringify({ id: c.id, action: a, sig: moderationSig(key, c.id, a) })}', clear=true`;
      headers.Actions = `${action('Publish', 'publish')}; ${action('Drop', 'drop')}`;
    }

    const who = c.agent_name ? `${c.author_name} (${c.author_kind}, ${c.agent_name})` : `${c.author_name} (${c.author_kind})`;
    const body = [
      `${who}: ${c.body.slice(0, 300)}`,
      '',
      `Model: ${c.verdict ?? 'none'} / ${c.verdict_label ?? '-'}: ${c.verdict_reason ?? ''}`,
    ].join('\n');

    const res = await fetch(`${base}/${topic}`, { method: 'POST', headers, body, signal: AbortSignal.timeout(5_000) });
    if (!res.ok) console.warn(`[comments] ntfy answered ${res.status}`);
  } catch (err) {
    console.warn(`[comments] ntfy failed: ${err instanceof Error ? err.name : 'error'}`);
  }
}
