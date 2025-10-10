// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://vecia.com',  // Production URL for canonical links and sitemap
  // output: 'static' is default in v5 and now supports selective SSR with prerender: false
  i18n: {
    locales: ['fr', 'en'],
    defaultLocale: 'fr',
    routing: {
      prefixDefaultLocale: false  // FR at /, EN at /en/
    }
  },
  vite: {
    plugins: [tailwindcss()]
  }
});
