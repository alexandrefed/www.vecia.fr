/**
 * Pure helpers for the comment system: signed tokens, hashing, rate limits, link counting, targets.
 * No Astro, no database, no network: everything here is unit-tested in tests/.
 */

import { createHmac, createHash, timingSafeEqual } from 'node:crypto';

export const LIMITS = {
  bodyMax: 3000,
  nameMax: 60,
  linksMax: 2,
  rate10min: 3,
  rate24h: 20,
  agentRate24h: 10,
  tokenMinAgeMs: 4_000,
  tokenMaxAgeMs: 6 * 60 * 60 * 1000,
} as const;

export function hmac(key: string, message: string): string {
  return createHmac('sha256', key).update(message).digest('hex');
}

/** Constant-time string comparison (false on length mismatch). */
export function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

/** Salted hash of an IP or user-agent. The raw value is never stored. */
export function saltedHash(salt: string, value: string): string {
  return sha256(`${salt}${value}`);
}

// --- signed form token -------------------------------------------------

export function signFormToken(key: string, target: string, ts: number = Date.now()): { ts: number; sig: string } {
  return { ts, sig: hmac(key, `${ts}:${target}`) };
}

export type TokenCheck = { ok: true } | { ok: false; error: string };

export function verifyFormToken(key: string, target: string, ts: unknown, sig: unknown, now: number = Date.now()): TokenCheck {
  const t = typeof ts === 'number' ? ts : typeof ts === 'string' && /^\d+$/.test(ts) ? Number(ts) : NaN;
  if (!Number.isFinite(t) || typeof sig !== 'string' || !sig) return { ok: false, error: 'Missing form token, reload the page.' };
  if (!safeEqual(sig, hmac(key, `${t}:${target}`))) return { ok: false, error: 'Invalid form token, reload the page.' };
  const age = now - t;
  if (age < LIMITS.tokenMinAgeMs) return { ok: false, error: 'Too fast, try again in a few seconds.' };
  if (age > LIMITS.tokenMaxAgeMs) return { ok: false, error: 'Form expired, reload the page.' };
  return { ok: true };
}

// --- team key and moderation signatures -----------------------------------

export function teamKey(key: string, subdomain: string): string {
  return hmac(key, `team:${subdomain}`);
}

export function moderationSig(key: string, id: number, action: string): string {
  return hmac(key, `${id}:${action}`);
}

// --- rate limit ------------------------------------------------------------

export type RateCheck = { ok: true } | { ok: false };

export function checkRate(counts: { last10min: number; last24h: number }, limits: { per10min: number; per24h: number } = { per10min: LIMITS.rate10min, per24h: LIMITS.rate24h }): RateCheck {
  return counts.last10min >= limits.per10min || counts.last24h >= limits.per24h ? { ok: false } : { ok: true };
}

// --- content checks --------------------------------------------------------

/** Number of links: occurrences of `http` or `www.` (case-insensitive). */
export function countLinks(text: string): number {
  return (text.match(/https?:\/\/|www\./gi) ?? []).length;
}

const ADJECTIVES = ['Happy', 'Clever', 'Brave', 'Swift', 'Bright', 'Kind', 'Bold', 'Wise'];
const ANIMALS = ['Fox', 'Eagle', 'Wolf', 'Bear', 'Hawk', 'Tiger', 'Lion', 'Owl'];

export function randomName(rand: () => number = Math.random): string {
  return `${ADJECTIVES[Math.floor(rand() * ADJECTIVES.length)]} ${ANIMALS[Math.floor(rand() * ANIMALS.length)]}`;
}

// --- targets ---------------------------------------------------------------

export type CommentSection = 'notes' | 'cases' | 'workshop';
const PREFIX: Record<CommentSection, string> = { notes: 'note', cases: 'case', workshop: 'log' };

/**
 * Thread id of a page. FR pages map to their EN translation so both languages share one thread;
 * a page with no translation is `<prefix>:fr:<slug>`. Slugs are without the language folder.
 */
export function targetFor(section: CommentSection, lang: 'en' | 'fr', slug: string, translationSlug?: string): string {
  const p = PREFIX[section];
  if (lang === 'en') return `${p}:${slug}`;
  return translationSlug ? `${p}:${translationSlug}` : `${p}:fr:${slug}`;
}

/** Split a target back into collection, language and slug; undefined if malformed. */
export function parseTarget(target: unknown): { section: CommentSection; lang: 'en' | 'fr'; slug: string } | undefined {
  if (typeof target !== 'string') return undefined;
  const m = target.match(/^(note|case|log):(fr:)?([a-z0-9][a-z0-9-]*)$/);
  if (!m) return undefined;
  const section = (Object.entries(PREFIX).find(([, v]) => v === m[1])![0]) as CommentSection;
  return { section, lang: m[2] ? 'fr' : 'en', slug: m[3] };
}

/** Client IP: Caddy sets x-real-ip from Cloudflare; otherwise whatever Astro knows. */
export function clientIp(headers: Headers, fallback: () => string | undefined): string {
  const real = headers.get('x-real-ip')?.trim();
  if (real) return real;
  try {
    return fallback() ?? 'unknown';
  } catch {
    return 'unknown';
  }
}
