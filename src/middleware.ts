/**
 * Astro Security Middleware
 *
 * Adds security headers to all responses:
 * - Content-Security-Policy (CSP)
 * - X-Frame-Options
 * - X-Content-Type-Options
 * - Strict-Transport-Security (HSTS)
 * - Referrer-Policy
 * - Permissions-Policy
 *
 * @see https://owasp.org/www-project-secure-headers/
 * @see https://securityheaders.com/
 */

import { defineMiddleware, sequence } from 'astro:middleware';
import { getCollection } from 'astro:content';

// Content Security Policy directives
// Each source must be explicitly allowed
const cspDirectives = {
  // Default: only allow same-origin
  'default-src': ["'self'"],

  // Scripts: self + Google Analytics
  'script-src': [
    "'self'",
    "'unsafe-inline'", // Required for inline scripts (Astro, analytics init)
    "'unsafe-eval'", // Required for Alpine.js expression evaluation (x-show, @click, :class, etc.)
    'https://www.googletagmanager.com',
    'https://www.google-analytics.com',
  ],

  // Styles: self + inline + Google Fonts + Hugeicons
  'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com', 'https://use.hugeicons.com'],

  // Fonts: self + Google Fonts CDN + Hugeicons CDN
  'font-src': ["'self'", 'https://fonts.gstatic.com', 'https://use.hugeicons.com', 'https://cdn.hugeicons.com'],

  // Images: self + data URIs + any HTTPS (for external images)
  'img-src': [
    "'self'",
    'data:',
    'https:',
    'https://www.google-analytics.com',
  ],

  // Connect (XHR, fetch, WebSocket): self + Google Analytics
  'connect-src': [
    "'self'",
    'https://www.google-analytics.com',
    'https://analytics.google.com',
    'https://*.google-analytics.com', // GA4 regional endpoints (region1, region2, etc.)
  ],

  // Frames: block all external frames (clickjacking protection)
  'frame-src': ["'self'", 'https://www.youtube.com', 'https://cal.vecia.fr'],

  // Forms: only allow submission to self
  'form-action': ["'self'"],

  // Base URI: prevent base tag hijacking
  'base-uri': ["'self'"],

  // Object/embed: block plugins (Flash, etc.)
  'object-src': ["'none'"],
};

// Build CSP header string
// Note: upgrade-insecure-requests is added only in production (breaks localhost without SSL)
const cspParts = Object.entries(cspDirectives)
  .map(([directive, sources]) => {
    if (sources.length === 0) {
      return directive;
    }
    return `${directive} ${sources.join(' ')}`;
  });

// Add upgrade-insecure-requests only in production
if (import.meta.env.PROD) {
  cspParts.push('upgrade-insecure-requests');
}

const cspHeader = cspParts.join('; ');


// ---------------------------------------------------------------------------
// Host routing: <person>.vecia.fr serves that person's page from the same app
// ---------------------------------------------------------------------------

const MAIN_HOSTS = new Set(['vecia.fr', 'www.vecia.fr', 'localhost', '127.0.0.1']);
const MAIN_ORIGIN = import.meta.env.PROD ? 'https://vecia.fr' : 'http://localhost:4321';

let peopleCache: Set<string> | undefined;
async function peopleSubdomains(): Promise<Set<string>> {
  if (!peopleCache) {
    const people = await getCollection('people');
    peopleCache = new Set(people.map((p) => p.data.subdomain));
  }
  return peopleCache;
}

function requestHost(request: Request): string {
  const raw = request.headers.get('x-forwarded-host') ?? request.headers.get('host') ?? '';
  return raw.split(',')[0].trim().toLowerCase().replace(/:\d+$/, '');
}

/** The subdomain label of <label>.vecia.fr or <label>.localhost, else undefined. */
function personLabel(host: string): string | undefined {
  const m = host.match(/^([a-z0-9-]+)\.(?:vecia\.fr|localhost)$/);
  return m && m[1] !== 'www' ? m[1] : undefined;
}

const hostRouter = defineMiddleware(async (context, next) => {
  const host = requestHost(context.request);
  const { pathname, search } = context.url;

  if (MAIN_HOSTS.has(host) || host === '') {
    // On the main host in production, person pages live on their subdomain.
    const m = import.meta.env.PROD && pathname.match(/^(\/fr)?\/people\/([a-z0-9-]+)(\/.*)?$/);
    if (m) {
      const rest = m[3] === '/vcard.vcf' ? '/vcard.vcf' : m[1] ? '/fr/' : '/';
      return context.redirect(`https://${m[2]}.vecia.fr${rest}`, 301);
    }
    return next();
  }

  const label = personLabel(host);
  if (!label) return next();

  if (!(await peopleSubdomains()).has(label)) {
    return new Response('Not found', { status: 404 });
  }

  if (pathname === '/') return next(`/people/${label}/`);
  if (pathname === '/fr' || pathname === '/fr/') return next(`/fr/people/${label}/`);
  if (pathname === '/vcard.vcf') return next(`/people/${label}/vcard.vcf`);
  if (pathname.startsWith('/_astro/') || pathname.startsWith('/api/')) return next();
  if (/\.[a-z0-9]+$/i.test(pathname) && !pathname.endsWith('.vcf')) return next();

  return context.redirect(`${MAIN_ORIGIN}${pathname}${search}`, 301);
});

// ---------------------------------------------------------------------------
// Legacy redirects: the pre-2026 blog and /en/* URLs
// ---------------------------------------------------------------------------

const technicalPosts: Record<string, string> = {
  '/blog/quest-ce-quun-mcp': '/fr/notes/quest-ce-quun-mcp',
  '/blog/mcps-indispensables': '/fr/notes/mcps-indispensables',
  '/blog/claude-guide-debutant': '/fr/notes/claude-guide-debutant',
  '/blog/docker-mcp-revolution-contexte': '/fr/notes/docker-mcp-revolution-contexte',
  '/en/blog/what-is-mcp': '/notes/what-is-mcp',
  '/en/blog/essential-mcps': '/notes/essential-mcps',
  '/en/blog/claude-beginner-guide': '/notes/claude-beginner-guide',
  '/en/blog/docker-mcp-revolution': '/notes/docker-mcp-revolution',
};

// Exact /en/* paths already redirected by `redirects` in astro.config.mjs (they must not be caught below)
const configRedirects = new Set([
  '/en', '/en/get-started', '/en/contact', '/en/use-cases', '/en/about', '/en/blog',
  '/en/privacy', '/en/terms', '/en/cookies', '/en/ai-ethics', '/en/book',
]);

// Agency posts (retired) and every other post fall back to the notes index.
const legacyRedirects = defineMiddleware(async (context, next) => {
  const pathname = context.url.pathname.replace(/(.)\/$/, '$1');

  const mapped = technicalPosts[pathname];
  if (mapped) return context.redirect(mapped, 301);
  if (pathname.startsWith('/blog/')) return context.redirect('/fr/notes', 301);
  if (pathname.startsWith('/en/blog/')) return context.redirect('/notes', 301);
  if (pathname.startsWith('/en/') && !configRedirects.has(pathname)) {
    return context.redirect(pathname.slice(3) + context.url.search, 301);
  }

  return next();
});

const securityHeaders = defineMiddleware(async (_context, next) => {
  const response = await next();

  // Security headers
  // X-Frame-Options: Prevent clickjacking (legacy browsers)
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');

  // X-Content-Type-Options: Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // Referrer-Policy: Control referrer information
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions-Policy: Restrict browser features
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=()'
  );

  // Strict-Transport-Security: Force HTTPS (1 year, include subdomains)
  // Only set in production to avoid issues with localhost
  if (import.meta.env.PROD) {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  // Content-Security-Policy: XSS protection
  response.headers.set('Content-Security-Policy', cspHeader);

  // X-DNS-Prefetch-Control: Allow DNS prefetching for performance
  response.headers.set('X-DNS-Prefetch-Control', 'on');

  return response;
});

export const onRequest = sequence(hostRouter, legacyRedirects, securityHeaders);
