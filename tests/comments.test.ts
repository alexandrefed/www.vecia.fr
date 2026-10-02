import { describe, expect, it } from 'vitest';
import { LIMITS, checkRate, countLinks, hmac, parseTarget, signFormToken, targetFor, verifyFormToken } from '../src/lib/comments-core';
import { parseVerdict, statusFor } from '../src/lib/moderate';

const KEY = 'test-key';

describe('form token', () => {
  const now = 1_000_000_000_000;
  const { sig } = signFormToken(KEY, 'note:x', now);

  it('accepts a token inside the age window', () => {
    expect(verifyFormToken(KEY, 'note:x', now, sig, now + 5_000)).toEqual({ ok: true });
    expect(verifyFormToken(KEY, 'note:x', String(now), sig, now + LIMITS.tokenMaxAgeMs - 1)).toEqual({ ok: true });
  });
  it('rejects too fast, expired, wrong target, wrong key, missing', () => {
    expect(verifyFormToken(KEY, 'note:x', now, sig, now + 1_000)).toMatchObject({ ok: false, error: expect.stringMatching(/fast/i) });
    expect(verifyFormToken(KEY, 'note:x', now, sig, now + LIMITS.tokenMaxAgeMs + 1)).toMatchObject({ ok: false, error: expect.stringMatching(/expired/i) });
    expect(verifyFormToken(KEY, 'note:y', now, sig, now + 5_000).ok).toBe(false);
    expect(verifyFormToken('other', 'note:x', now, sig, now + 5_000).ok).toBe(false);
    expect(verifyFormToken(KEY, 'note:x', undefined, undefined, now + 5_000).ok).toBe(false);
    expect(verifyFormToken(KEY, 'note:x', now, sig.slice(0, -1), now + 5_000).ok).toBe(false);
  });
  it('hmac is deterministic', () => {
    expect(hmac(KEY, 'a')).toBe(hmac(KEY, 'a'));
    expect(hmac(KEY, 'a')).not.toBe(hmac(KEY, 'b'));
  });
});

describe('rate limiter', () => {
  it('allows below the limits', () => {
    expect(checkRate({ last10min: 2, last24h: 19 }).ok).toBe(true);
  });
  it('blocks at 3 per 10 minutes and at 20 per day', () => {
    expect(checkRate({ last10min: 3, last24h: 3 }).ok).toBe(false);
    expect(checkRate({ last10min: 0, last24h: 20 }).ok).toBe(false);
  });
  it('takes custom limits (agent: 10 per day)', () => {
    expect(checkRate({ last10min: 0, last24h: 10 }, { per10min: 99, per24h: 10 }).ok).toBe(false);
  });
});

describe('link counter', () => {
  it('counts http(s) and www.', () => {
    expect(countLinks('no links here')).toBe(0);
    expect(countLinks('see https://a.com and http://b.com')).toBe(2);
    expect(countLinks('www.a.com HTTPS://B.COM www.c.com')).toBe(3);
  });
});

describe('moderator reply parsing', () => {
  it('parses a good verdict, with or without a code fence', () => {
    const json = '{"verdict":"publish","label":"useful","reason":"Adds a source."}';
    expect(parseVerdict(json)).toMatchObject({ verdict: 'publish', label: 'useful', reason: 'Adds a source.' });
    expect(parseVerdict('```json\n' + json + '\n```').verdict).toBe('publish');
  });
  it('bad JSON becomes queue/unsure', () => {
    expect(parseVerdict('Sure! Here is my answer')).toMatchObject({ verdict: 'queue', label: 'unsure' });
    expect(parseVerdict('')).toMatchObject({ verdict: 'queue', label: 'unsure' });
    expect(parseVerdict('null')).toMatchObject({ verdict: 'queue' });
    expect(parseVerdict('{"verdict":"approve","label":"useful","reason":"x"}')).toMatchObject({ verdict: 'queue', label: 'unsure' });
  });
  it('an unknown label becomes unsure but keeps the verdict', () => {
    expect(parseVerdict('{"verdict":"drop","label":"rude","reason":"x"}')).toMatchObject({ verdict: 'drop', label: 'unsure' });
  });
  it('shadow mode always queues, live mode follows the verdict', () => {
    expect(statusFor('publish', 'shadow')).toBe('queued');
    expect(statusFor('publish', 'live')).toBe('published');
    expect(statusFor('drop', 'live')).toBe('dropped');
    expect(statusFor('queue', 'live')).toBe('queued');
  });
});

describe('targets', () => {
  it('EN pages use their own slug', () => {
    expect(targetFor('notes', 'en', 'what-is-mcp')).toBe('note:what-is-mcp');
    expect(targetFor('workshop', 'en', '2026-w41')).toBe('log:2026-w41');
  });
  it('FR pages map to their EN translation', () => {
    expect(targetFor('notes', 'fr', 'quest-ce-quun-mcp', 'what-is-mcp')).toBe('note:what-is-mcp');
    expect(targetFor('cases', 'fr', 'dossier', 'case')).toBe('case:case');
  });
  it('FR pages without a translation get their own thread', () => {
    expect(targetFor('notes', 'fr', 'seul')).toBe('note:fr:seul');
  });
  it('parses targets back and rejects junk', () => {
    expect(parseTarget('note:what-is-mcp')).toEqual({ section: 'notes', lang: 'en', slug: 'what-is-mcp' });
    expect(parseTarget('note:fr:seul')).toEqual({ section: 'notes', lang: 'fr', slug: 'seul' });
    expect(parseTarget('log:2026-w41')?.section).toBe('workshop');
    expect(parseTarget('../etc')).toBeUndefined();
    expect(parseTarget('page:x')).toBeUndefined();
    expect(parseTarget(5)).toBeUndefined();
  });
});
