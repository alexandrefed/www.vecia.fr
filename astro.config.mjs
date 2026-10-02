// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
// Bundle analyzer - only needed for local development, not production
// import { visualizer } from 'rollup-plugin-visualizer';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: 'https://vecia.fr',  // Production URL for canonical links and sitemap
  output: 'server',  // Server mode: SSR by default, static for prerender: true routes
  adapter: node({
    mode: 'standalone'  // Standalone server for VPS deployment
  }),
  i18n: {
    locales: ['en', 'fr'],
    defaultLocale: 'en',
    routing: {
      prefixDefaultLocale: false  // EN at /, FR at /fr/
    }
  },
  // Trust X-Forwarded-Host only for our own hosts (people live on <name>.vecia.fr)
  security: {
    allowedDomains: [
      { hostname: '**.vecia.fr', protocol: 'https' },
      { hostname: 'vecia.fr', protocol: 'https' },
    ],
  },
  // 301s for retired pages. Old blog post URLs are handled in src/middleware.ts (legacyRedirects).
  redirects: {
    '/bilan': { status: 301, destination: '/fr/office-hours' },
    '/commencer': { status: 301, destination: '/fr/office-hours' },
    '/contact': { status: 301, destination: '/fr/office-hours' },
    '/cas-usage': { status: 301, destination: '/fr/cases' },
    '/about': { status: 301, destination: '/fr/crew' },
    '/blog': { status: 301, destination: '/fr/notes' },
    '/en': { status: 301, destination: '/' },
    '/en/get-started': { status: 301, destination: '/office-hours' },
    '/en/contact': { status: 301, destination: '/office-hours' },
    '/en/use-cases': { status: 301, destination: '/cases' },
    '/en/about': { status: 301, destination: '/crew' },
    '/en/blog': { status: 301, destination: '/notes' },
    '/en/privacy': { status: 301, destination: '/privacy' },
    '/en/terms': { status: 301, destination: '/terms' },
    '/en/cookies': { status: 301, destination: '/cookies' },
    '/en/ai-ethics': { status: 301, destination: '/ai-ethics' },
    '/en/book': { status: 308, destination: 'https://cal.vecia.fr/alexandre/rendez-vous' },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en-US',
          fr: 'fr-FR',
        },
      },
    }),
  ],
  vite: {
    // node:sqlite (comments) is a Node built-in: keep it out of the bundle
    ssr: { external: ['node:sqlite'] },
    plugins: [
      tailwindcss(),
      // Bundle analyzer - generates stats.html after build
      // Commented out for production deployment - uncomment locally if needed
      // visualizer({
      //   open: false,  // Set to true to auto-open in browser
      //   filename: './dist/stats.html',
      //   gzipSize: true,
      //   brotliSize: true,
      // }),
    ]
  }
});
