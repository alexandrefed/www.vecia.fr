/**
 * POST /api/comments/submit.json: the human door.
 * Order: honeypot, signed form token, rate limit, then the shared content checks and the moderator.
 */

import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { safeEqual, teamKey, verifyFormToken } from '../../../lib/comments-core';
import { fail, json, processComment, rateLimited, requestHashes } from '../../../lib/comments-service';

export const prerender = false;

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const key = process.env.MODERATION_HMAC_KEY;
  const salt = process.env.IP_HASH_SALT;
  if (!key || !salt) return fail('Comments are not available right now.', 503);

  let data: Record<string, unknown>;
  try {
    data = JSON.parse(await request.text());
    if (!data || typeof data !== 'object') throw new Error('not an object');
  } catch {
    return fail('Invalid request.');
  }

  // a. honeypot: pretend it worked, store nothing
  if (data.website || data.url || data.honey) return json({ success: true });

  // b. signed form token
  const token = verifyFormToken(key, String(data.target ?? ''), data.ts, data.sig);
  if (!token.ok) return fail(token.error);

  // c. rate limit
  const hashes = requestHashes(request, () => clientAddress, salt);
  const limited = rateLimited(hashes.ipHash);
  if (limited) return limited;

  // team badge: only with the key for a person in the people collection
  let team: { subdomain: string; name: string } | undefined;
  if (typeof data.team_key === 'string' && data.team_key) {
    for (const p of await getCollection('people')) {
      if (safeEqual(data.team_key, teamKey(key, p.data.subdomain))) team = { subdomain: p.data.subdomain, name: p.data.name };
    }
  }

  return processComment({
    target: data.target,
    body: data.body,
    authorName: data.author_name,
    parentId: data.parent_id,
    kind: team ? 'team' : 'human',
    teamMember: team?.subdomain,
    teamDisplayName: team?.name,
    ...hashes,
  });
};
