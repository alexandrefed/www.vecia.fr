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

import { defineMiddleware } from 'astro:middleware';

// Content Security Policy directives
// Each source must be explicitly allowed
const cspDirectives = {
  // Default: only allow same-origin
  'default-src': ["'self'"],

  // Scripts: self + analytics + tracking
  'script-src': [
    "'self'",
    "'unsafe-inline'", // Required for inline scripts (Astro, analytics init)
    'https://www.googletagmanager.com',
    'https://www.google-analytics.com',
    'https://connect.facebook.net',
    'https://snap.licdn.com',
    'https://plausible.io',
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
    'https://www.facebook.com',
    'https://px.ads.linkedin.com',
  ],

  // Connect (XHR, fetch, WebSocket): self + analytics + webhooks
  'connect-src': [
    "'self'",
    'https://www.google-analytics.com',
    'https://analytics.google.com',
    'https://graph.facebook.com',
    'https://srvdev2025.taildb74a2.ts.net', // n8n webhook (Tailscale Funnel)
    'https://plausible.io',
    'https://ipapi.co', // IP geolocation for currency detection
    'https://px.ads.linkedin.com', // LinkedIn attribution tracking
  ],

  // Frames: block all external frames (clickjacking protection)
  'frame-src': ["'self'", 'https://www.youtube.com', 'https://cal.vecia.fr'],

  // Forms: only allow submission to self and webhooks
  'form-action': ["'self'", 'https://srvdev2025.taildb74a2.ts.net'],

  // Base URI: prevent base tag hijacking
  'base-uri': ["'self'"],

  // Object/embed: block plugins (Flash, etc.)
  'object-src': ["'none'"],

  // Upgrade insecure requests
  'upgrade-insecure-requests': [],
};

// Build CSP header string
const cspHeader = Object.entries(cspDirectives)
  .map(([directive, sources]) => {
    if (sources.length === 0) {
      return directive;
    }
    return `${directive} ${sources.join(' ')}`;
  })
  .join('; ');

export const onRequest = defineMiddleware(async (_context, next) => {
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
