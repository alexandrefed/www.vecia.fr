/**
 * Shared pipeline behind the human door and the agent door:
 * content checks (length, name, links, profanity), target and parent lookup, moderator, storage, notification.
 * The doors (rate limit, honeypot, form token) stay in the endpoints.
 */

import { profanity } from '@2toad/profanity';
import { findBySlug, sectionCollection } from './content';
import { LIMITS, checkRate, clientIp, countLinks, parseTarget, randomName, saltedHash } from './comments-core';
import { countByAgent, countByIp, getComment, insertComment, toPublic, type AuthorKind, type CommentRow } from './comments-db';
import { moderate, moderationMode, statusFor, type ModerationResult } from './moderate';
import { notifyQueued } from './notify';

export const json = (data: unknown, status = 200, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...extra } });

export const fail = (error: string, status = 400) => json({ success: false, error }, status);

/** The page behind a target, or undefined when it does not exist. */
export async function resolveTarget(target: unknown) {
  const t = parseTarget(target);
  if (!t) return undefined;
  const entry = await findBySlug(sectionCollection[t.section], t.lang, t.slug);
  if (!entry) return undefined;
  const data = entry.data as { title: string; claim?: string };
  return { title: data.title, claim: data.claim };
}

export interface CommentInput {
  target: unknown;
  body: unknown;
  authorName?: unknown;
  parentId?: unknown;
  kind: AuthorKind;
  agentName?: string;
  teamMember?: string;
  /** Display name to use for a team member when none was typed. */
  teamDisplayName?: string;
  ipHash: string;
  uaHash: string;
}

export async function processComment(input: CommentInput): Promise<Response> {
  if (typeof input.body !== 'string') return fail('Comment text is required.');
  const body = input.body.trim();
  if (body.length < 1) return fail('Comment cannot be empty.');
  if (body.length > LIMITS.bodyMax) return fail(`Comment is too long (max ${LIMITS.bodyMax} characters).`);

  let name = typeof input.authorName === 'string' ? input.authorName.trim() : '';
  if (!name) name = input.teamDisplayName ?? randomName();
  if (name.length > LIMITS.nameMax) return fail(`Name is too long (max ${LIMITS.nameMax} characters).`);

  const links = countLinks(body);
  if (links > LIMITS.linksMax) return fail(`Too many links (max ${LIMITS.linksMax}).`);

  if (profanity.exists(body) || profanity.exists(name)) return fail('Please keep the language civil.');

  const page = await resolveTarget(input.target);
  if (!page) return fail('Unknown page.');
  const target = input.target as string;

  // Replies: one level. Replying to a reply attaches to the same top-level comment.
  let parent: CommentRow | undefined;
  let parentId: number | null = null;
  if (input.parentId !== undefined && input.parentId !== null && input.parentId !== '') {
    const pid = Number(input.parentId);
    parent = Number.isInteger(pid) ? getComment(pid) : undefined;
    if (!parent || parent.target !== target || parent.status !== 'published') return fail('Parent comment not found.');
    if (parent.parent_id) {
      parent = getComment(parent.parent_id);
      if (!parent || parent.status !== 'published') return fail('Parent comment not found.');
    }
    parentId = parent.id;
  }

  const now = new Date().toISOString();
  let status: CommentRow['status'];
  let verdict: ModerationResult | undefined;

  if (input.kind === 'team') {
    status = 'published';
  } else {
    verdict = await moderate({
      pageTitle: page.title,
      pageClaim: page.claim,
      authorName: name,
      authorKind: input.kind === 'agent' ? 'agent' : 'human',
      agentName: input.agentName,
      parentText: parent?.body,
      body,
    });
    status = statusFor(verdict.verdict, moderationMode());
  }

  const id = insertComment({
    target,
    parent_id: parentId,
    author_name: name,
    author_kind: input.kind,
    agent_name: input.agentName ?? null,
    team_member: input.teamMember ?? null,
    body,
    link_count: links,
    ip_hash: input.ipHash,
    ua_hash: input.uaHash,
    created_at: now,
    status,
    verdict: verdict?.verdict ?? null,
    verdict_label: verdict?.label ?? null,
    verdict_reason: verdict?.reason ?? null,
    model: verdict?.model ?? null,
    moderated_at: input.kind === 'team' || (verdict && moderationMode() === 'live' && status !== 'queued') ? now : null,
    moderated_by: input.kind === 'team' ? null : verdict && moderationMode() === 'live' && status !== 'queued' ? 'model' : null,
  });
  const row = getComment(id)!;

  if (status === 'queued') await notifyQueued(row, page.title);

  if (status === 'published') {
    return json({ success: true, status, message: 'Comment published.', comment: { ...toPublic(row), replies: [] } }, 201);
  }
  if (status === 'dropped') return json({ success: true, status, message: 'Thanks. This comment was not published.' }, 202);
  return json({ success: true, status, message: 'Thanks, a human reads every comment before it appears.' }, 202);
}


/** Door: per-ip rate limit. Returns a 429 response, or undefined when the caller may go on. */
export function rateLimited(ipHash: string): Response | undefined {
  const ago = (ms: number) => new Date(Date.now() - ms).toISOString();
  const ok = checkRate({ last10min: countByIp(ipHash, ago(10 * 60_000)), last24h: countByIp(ipHash, ago(24 * 3_600_000)) });
  return ok.ok ? undefined : fail('Too many comments from this connection, try again later.', 429);
}

/** Door for agents: 10 per 24 h per declared agent name. */
export function agentRateLimited(agentName: string): Response | undefined {
  const since = new Date(Date.now() - 24 * 3_600_000).toISOString();
  return countByAgent(agentName, since) >= LIMITS.agentRate24h ? fail('Too many comments from this agent, try again later.', 429) : undefined;
}

export function requestHashes(request: Request, fallbackIp: () => string | undefined, salt: string) {
  return {
    ipHash: saltedHash(salt, clientIp(request.headers, fallbackIp)),
    uaHash: saltedHash(salt, request.headers.get('user-agent') ?? ''),
  };
}
