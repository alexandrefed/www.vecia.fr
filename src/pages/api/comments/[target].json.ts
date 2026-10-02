/**
 * GET /api/comments/<target>.json: published comments of a page as a thread.
 * Target is URL-encoded (`note:what-is-mcp` -> /api/comments/note%3Awhat-is-mcp.json). Never returns hashes.
 */

import type { APIRoute } from 'astro';
import { parseTarget } from '../../../lib/comments-core';
import { buildThread, publishedFor } from '../../../lib/comments-db';
import { fail, json } from '../../../lib/comments-service';

export const prerender = false;

export const GET: APIRoute = ({ params }) => {
  // Astro hands the param over still percent-encoded (note%3Aslug)
  let target = params.target ?? '';
  try {
    target = decodeURIComponent(target);
  } catch {}
  if (!parseTarget(target)) return fail('Unknown target.');
  const comments = buildThread(publishedFor(target));
  return json({ target, comments });
};
