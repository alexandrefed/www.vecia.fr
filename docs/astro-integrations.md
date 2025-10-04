# Astro Integrations Guide

Complete guide to installing, configuring, and using Astro integrations.

## Table of Contents

- [What are Integrations?](#what-are-integrations)
- [Installation Methods](#installation-methods)
- [Official UI Framework Integrations](#official-ui-framework-integrations)
- [Adapter Integrations](#adapter-integrations)
- [Feature Integrations](#feature-integrations)
- [Community Integrations](#community-integrations)
- [Creating Custom Integrations](#creating-custom-integrations)

---

## What are Integrations?

Astro integrations add new functionality and behaviors to your project with minimal configuration. They can:

- Unlock UI frameworks (React, Vue, Svelte, etc.)
- Enable SSR with adapters
- Add tools like Tailwind CSS, MDX, Partytown
- Generate sitemaps automatically
- Hook into build process, dev server, and more

---

## Installation Methods

### Automatic (Recommended)

```bash
# Single integration
npx astro add react

# Multiple integrations
npx astro add react tailwind sitemap

# With pnpm
pnpm astro add react

# With yarn
yarn astro add react
```

**What it does:**
1. Installs npm packages
2. Updates `astro.config.mjs`
3. Applies necessary changes (e.g., TypeScript config)

### Manual Installation

1. Install the package:

```bash
npm install @astrojs/react react react-dom
```

2. Update `astro.config.mjs`:

```javascript
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
});
```

---

## Official UI Framework Integrations

### React

**Installation:**
```bash
npx astro add react
```

**Configuration:**
```javascript
import react from '@astrojs/react';

export default defineConfig({
  integrations: [
    react({
      include: ['**/react/*'],
      experimentalReactChildren: true,
    })
  ],
});
```

**Usage:**
```astro
---
import MyReactComponent from '../components/MyReactComponent.jsx';
---

<MyReactComponent client:load />
```

**TypeScript Support:**
```json
// tsconfig.json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  }
}
```

---

### Vue

**Installation:**
```bash
npx astro add vue
```

**Configuration:**
```javascript
import vue from '@astrojs/vue';

export default defineConfig({
  integrations: [
    vue({
      appEntrypoint: '/src/pages/_app',
      jsx: true,
    })
  ],
});
```

**Usage:**
```astro
---
import MyVueComponent from '../components/MyVueComponent.vue';
---

<MyVueComponent client:visible />
```

**App Entrypoint (Optional):**
```javascript
// src/pages/_app.ts
import type { App } from 'vue';

export default (app: App) => {
  app.use(SomePlugin);
};
```

---

### Svelte

**Installation:**
```bash
npx astro add svelte
```

**Configuration:**
```javascript
import svelte from '@astrojs/svelte';

export default defineConfig({
  integrations: [svelte()],
});
```

**Preprocessing (Optional):**
```javascript
// svelte.config.js
import { vitePreprocess } from '@astrojs/svelte';

export default {
  preprocess: vitePreprocess(),
};
```

**Usage:**
```astro
---
import MySvelteComponent from '../components/MySvelteComponent.svelte';
---

<MySvelteComponent client:idle />
```

---

### Solid

**Installation:**
```bash
npx astro add solid-js
```

**Configuration:**
```javascript
import solid from '@astrojs/solid-js';

export default defineConfig({
  integrations: [
    solid({
      devtools: true,
    })
  ],
});
```

**Dev Tools:**
```bash
npm install solid-devtools
```

**Usage:**
```astro
---
import MySolidComponent from '../components/MySolidComponent.jsx';
---

<MySolidComponent client:load />
```

---

### Preact

**Installation:**
```bash
npx astro add preact
```

**Configuration:**
```javascript
import preact from '@astrojs/preact';

export default defineConfig({
  integrations: [
    preact({
      compat: true,  // Enable React compatibility layer
      devtools: true,
    })
  ],
});
```

**Usage:**
```astro
---
import MyPreactComponent from '../components/MyPreactComponent.jsx';
---

<MyPreactComponent client:visible />
```

---

### Alpine.js

**Installation:**
```bash
npx astro add alpinejs
```

**Configuration:**
```javascript
import alpine from '@astrojs/alpinejs';

export default defineConfig({
  integrations: [alpine()],
});
```

**Usage:**
```astro
<div x-data="{ count: 0 }">
  <button @click="count++">Increment</button>
  <span x-text="count"></span>
</div>
```

---

## Adapter Integrations

Adapters enable SSR (Server-Side Rendering) on various platforms.

### Netlify

**Installation:**
```bash
npx astro add netlify
```

**Configuration:**
```javascript
import netlify from '@astrojs/netlify';

export default defineConfig({
  output: 'server',  // or 'hybrid'
  adapter: netlify({
    edgeMiddleware: true,
    functionPerRoute: true,
    devFeatures: {
      images: true,
      environmentVariables: true,
    },
  }),
});
```

**Edge Functions:**
```javascript
export const prerender = false;
export const edgeMiddleware = true;
```

---

### Vercel

**Installation:**
```bash
npx astro add vercel
```

**Configuration:**
```javascript
import vercel from '@astrojs/vercel/serverless';
// Or: import vercel from '@astrojs/vercel/static';

export default defineConfig({
  output: 'server',
  adapter: vercel({
    edgeMiddleware: true,
    functionPerRoute: true,
    imageService: true,
    imagesConfig: {
      sizes: [320, 640, 1280],
      domains: ['example.com'],
    },
  }),
});
```

---

### Cloudflare

**Installation:**
```bash
npx astro add cloudflare
```

**Configuration:**
```javascript
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    mode: 'directory',  // or 'advanced'
  }),
});
```

**Workers/Pages Support:**
- Works with Cloudflare Pages
- Supports Cloudflare Workers
- Access to KV, Durable Objects, etc.

---

### Node

**Installation:**
```bash
npx astro add node
```

**Configuration:**
```javascript
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone',  // or 'middleware'
  }),
});
```

**Standalone Mode:**
```bash
node ./dist/server/entry.mjs
```

**Middleware Mode:**
```javascript
import express from 'express';
import { handler as ssrHandler } from './dist/server/entry.mjs';

const app = express();
app.use(ssrHandler);
app.listen(3000);
```

---

### Deno

**Installation:**
```bash
npx astro add deno
```

**Configuration:**
```javascript
import deno from '@astrojs/deno';

export default defineConfig({
  output: 'server',
  adapter: deno(),
});
```

**Deployment:**
```bash
deno run --allow-net --allow-read --allow-env ./dist/server/entry.mjs
```

---

## Feature Integrations

### Tailwind CSS

**Installation:**
```bash
npx astro add tailwind
```

**Configuration:**
```javascript
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [
    tailwind({
      applyBaseStyles: true,
      config: { path: './custom-tailwind.config.cjs' },
    })
  ],
});
```

**Usage:**
```astro
<div class="bg-blue-500 text-white p-4">
  Tailwind styled content
</div>
```

**Custom Config:**
```javascript
// tailwind.config.cjs
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

---

### MDX

**Installation:**
```bash
npx astro add mdx
```

**Configuration:**
```javascript
import mdx from '@astrojs/mdx';

export default defineConfig({
  integrations: [
    mdx({
      syntaxHighlight: 'shiki',
      shikiConfig: { theme: 'dracula' },
      remarkPlugins: [],
      rehypePlugins: [],
    })
  ],
});
```

**Usage:**
```mdx
---
title: My MDX Post
---

import CustomComponent from '../components/CustomComponent.astro';

# Hello MDX!

<CustomComponent />

export const someVar = 42;
```

---

### Markdoc

**Installation:**
```bash
npx astro add markdoc
```

**Configuration:**
```javascript
// markdoc.config.mjs
import { defineMarkdocConfig } from '@astrojs/markdoc/config';
import Aside from './src/components/Aside.astro';

export default defineMarkdocConfig({
  tags: {
    aside: {
      render: Aside,
      attributes: {
        type: { type: String },
      },
    },
  },
});
```

**Usage:**
```markdoc
# My Document

{% aside type="note" %}
This is a note!
{% /aside %}
```

---

### Sitemap

**Installation:**
```bash
npx astro add sitemap
```

**Configuration:**
```javascript
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://example.com',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('private'),
      customPages: ['https://example.com/external-page'],
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    })
  ],
});
```

**Output:**
- Generates `sitemap-index.xml` and `sitemap-0.xml`
- Automatically includes all pages
- Respects `robots.txt` directives

---

### RSS

**Installation:**
```bash
npm install @astrojs/rss
```

**Usage:**
```typescript
// src/pages/rss.xml.ts
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('blog');
  return rss({
    title: 'My Blog',
    description: 'A blog about web development',
    site: context.site,
    items: posts.map(post => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishDate,
      link: `/blog/${post.slug}/`,
      customData: post.data.customData,
    })),
    customData: `<language>en-us</language>`,
    stylesheet: '/rss-styles.xsl',
  });
}
```

---

### Partytown

**Installation:**
```bash
npx astro add partytown
```

**Configuration:**
```javascript
import partytown from '@astrojs/partytown';

export default defineConfig({
  integrations: [
    partytown({
      config: {
        forward: ['dataLayer.push'],
      },
    })
  ],
});
```

**Usage:**
```astro
<script type="text/partytown" src="https://example.com/analytics.js"></script>
```

**Benefits:**
- Offloads third-party scripts to web worker
- Improves main thread performance
- Better Lighthouse scores

---

### DB (Astro DB)

**Installation:**
```bash
npx astro add db
```

**Configuration:**
```typescript
// db/config.ts
import { defineDb, defineTable, column } from 'astro:db';

const Author = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    name: column.text(),
  },
});

export default defineDb({
  tables: { Author },
});
```

**Usage:**
```astro
---
import { db, Author } from 'astro:db';

const authors = await db.select().from(Author);
---

{authors.map(author => <p>{author.name}</p>)}
```

---

## Community Integrations

Find more at [astro.build/integrations](https://astro.build/integrations)

### Popular Community Integrations

**CSS Frameworks:**
- `astro-unocss` - UnoCSS integration
- `@astrojs/tailwind` - Tailwind CSS (official)

**Tools:**
- `astro-compress` - Compress output files
- `astro-seo` - SEO component
- `astro-icon` - Icon components
- `astro-imagetools` - Advanced image optimization

**CMS:**
- `@astrojs/strapi` - Strapi CMS
- `astro-sanity` - Sanity.io integration
- `astro-wordpress` - WordPress headless CMS

**Analytics:**
- `@astrojs/vercel/analytics` - Vercel Analytics
- `astro-google-analytics` - Google Analytics

---

## Creating Custom Integrations

### Basic Integration

```javascript
// my-integration.mjs
export default function myIntegration(options = {}) {
  return {
    name: 'my-integration',
    hooks: {
      'astro:config:setup': ({ config, command, updateConfig, addMiddleware, injectScript }) => {
        console.log('Config setup hook');

        // Update config
        updateConfig({
          vite: {
            // Vite config
          }
        });

        // Inject client script
        injectScript('page', `console.log('Injected script');`);
      },

      'astro:config:done': ({ config, setAdapter }) => {
        console.log('Config finalized');
      },

      'astro:server:setup': ({ server }) => {
        console.log('Dev server started');
      },

      'astro:build:start': () => {
        console.log('Build started');
      },

      'astro:build:done': ({ dir, routes, pages }) => {
        console.log('Build complete');
      },
    },
  };
}
```

**Using the integration:**
```javascript
import myIntegration from './my-integration.mjs';

export default defineConfig({
  integrations: [myIntegration({ option: 'value' })],
});
```

### Available Hooks

| Hook | When it runs | Use case |
|------|-------------|----------|
| `astro:config:setup` | Before config finalized | Update config, add middleware, inject scripts |
| `astro:config:done` | After config finalized | Read final config, set adapter |
| `astro:server:setup` | Dev server created | Add middleware, websocket handlers |
| `astro:server:start` | Dev server started | React to server start |
| `astro:server:done` | Dev server closed | Cleanup |
| `astro:build:start` | Build starts | Pre-build setup |
| `astro:build:setup` | Before build | Modify Vite config per build target |
| `astro:build:generated` | After static build | Post-process generated files |
| `astro:build:ssr` | After SSR build | Access SSR manifest |
| `astro:build:done` | Build complete | Access all build output |

### Integration with Vite Plugin

```javascript
export default function myIntegration() {
  return {
    name: 'my-integration',
    hooks: {
      'astro:config:setup': ({ updateConfig }) => {
        updateConfig({
          vite: {
            plugins: [
              {
                name: 'my-vite-plugin',
                transform(code, id) {
                  // Transform code
                  return code;
                },
              },
            ],
          },
        });
      },
    },
  };
}
```

---

## Integration Management

### Upgrading Integrations

```bash
# Upgrade all official integrations
npx @astrojs/upgrade

# Upgrade specific integration
npm install @astrojs/react@latest
```

### Removing Integrations

1. Uninstall package:
```bash
npm uninstall @astrojs/react
```

2. Remove from config:
```javascript
export default defineConfig({
  integrations: [
    // react() - removed
  ],
});
```

### Toggling Integrations

```javascript
export default defineConfig({
  integrations: [
    // Conditionally enable
    process.env.NODE_ENV === 'production' && sitemap(),
  ].filter(Boolean),
});
```

---

## Best Practices

### 1. Use Automatic Installation

Prefer `npx astro add` over manual installation to avoid configuration mistakes.

### 2. Keep Integrations Updated

Regularly run `npx @astrojs/upgrade` to get latest features and bug fixes.

### 3. Minimal Configuration

Only configure what you need. Defaults are usually well-optimized.

### 4. Check Compatibility

Ensure integrations are compatible with your Astro version.

### 5. Read Documentation

Each integration has specific options and use cases - check their docs.

---

## Troubleshooting

### Integration not working

1. Check installation: `npm list @astrojs/integration-name`
2. Verify config syntax in `astro.config.mjs`
3. Restart dev server
4. Run `astro sync` for TypeScript issues

### Conflicts between integrations

Some integrations may conflict. Check:
- Order of integrations array
- Duplicate functionality
- Vite plugin conflicts

### Build errors

- Clear `.astro` cache directory
- Delete `node_modules` and reinstall
- Check for version mismatches

---

## Resources

- [Official Integrations](https://docs.astro.build/en/guides/integrations-guide/)
- [Integrations Directory](https://astro.build/integrations/)
- [Integration API Reference](https://docs.astro.build/en/reference/integrations-reference/)
- [Community Discord](https://astro.build/chat)

---

**Last Updated:** January 2025
