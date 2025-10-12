// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { visualizer } from 'rollup-plugin-visualizer';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: 'https://vecia.com',  // Production URL for canonical links and sitemap
  output: 'static',  // Astro v5: static mode now supports selective SSR with prerender: false
  adapter: node({
    mode: 'standalone'  // Standalone server for VPS deployment (enables SSR for prerender: false routes)
  }),
  i18n: {
    locales: ['fr', 'en'],
    defaultLocale: 'fr',
    routing: {
      prefixDefaultLocale: false  // FR at /, EN at /en/
    }
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'fr',
        locales: {
          fr: 'fr-FR',
          en: 'en-US',
        },
      },
    }),
  ],
  vite: {
    plugins: [
      tailwindcss(),
      // Bundle analyzer - generates stats.html after build
      visualizer({
        open: false,  // Set to true to auto-open in browser
        filename: './dist/stats.html',
        gzipSize: true,
        brotliSize: true,
      }),
    ]
  }
});
