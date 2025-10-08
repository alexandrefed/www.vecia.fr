// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://vecia.com',  // Production URL for canonical links and sitemap
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
