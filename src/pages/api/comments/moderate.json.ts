/**
 * POST /api/comments/moderate.json: Publish / Drop buttons from the ntfy notification.
 * Body {id, action: "publish" | "drop", sig}; sig = HMAC(MODERATION_HMAC_KEY, `${id}:${action}`).
 */

import type { APIRoute } from 'astro';
import { moderationSig, safeEqual } from '../../../lib/comments-core';
import { getComment, setStatus } from '../../../lib/comments-db';
import { fail, json } from '../../../lib/comments-service';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const key = process.env.MODERATION_HMAC_KEY;
  if (!key) return fail('Not available.', 503);

  let data: Record<string, unknown>;
  try {
    data = JSON.parse(await request.text());
  } catch {
    return fail('Invalid request.');
  }
  const id = Number(data?.id);
  const action = data?.action;
  if (!Number.isInteger(id) || (action !== 'publish' && action !== 'drop')) return fail('Invalid request.');
  if (typeof data.sig !== 'string' || !safeEqual(data.sig, moderationSig(key, id, action))) return fail('Forbidden.', 403);

  if (!getComment(id)) return fail('Not found.', 404);
  setStatus(id, action === 'publish' ? 'published' : 'dropped', 'alexandre');
  return json({ success: true, id, status: action === 'publish' ? 'published' : 'dropped' });
};
