/**
 * POST /api/comments/agent.json: the door for AI agents (documented in /llms.txt).
 * No honeypot or form token. Rate limited per connection and per declared agent name.
 */

import type { APIRoute } from 'astro';
import { LIMITS } from '../../../lib/comments-core';
import { agentRateLimited, fail, processComment, rateLimited, requestHashes } from '../../../lib/comments-service';

export const prerender = false;

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const salt = process.env.IP_HASH_SALT;
  if (!salt) return fail('Comments are not available right now.', 503);

  let data: Record<string, unknown>;
  try {
    data = JSON.parse(await request.text());
    if (!data || typeof data !== 'object') throw new Error('not an object');
  } catch {
    return fail('Send a JSON object: {"target", "agent_name", "body"}.');
  }

  const agentName = typeof data.agent_name === 'string' ? data.agent_name.trim() : '';
  if (!agentName) return fail('agent_name is required.');
  if (agentName.length > LIMITS.nameMax) return fail(`agent_name is too long (max ${LIMITS.nameMax} characters).`);

  const hashes = requestHashes(request, () => clientAddress, salt);
  const limited = rateLimited(hashes.ipHash) ?? agentRateLimited(agentName);
  if (limited) return limited;

  return processComment({
    target: data.target,
    body: data.body,
    authorName: data.author_name || agentName,
    parentId: data.parent_id,
    kind: 'agent',
    agentName,
    ...hashes,
  });
};
