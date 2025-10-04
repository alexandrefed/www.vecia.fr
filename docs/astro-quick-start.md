# Astro Quick Start Guide

A quick reference for common Astro commands, patterns, and configurations.

## Table of Contents

- [Installation](#installation)
- [Essential Commands](#essential-commands)
- [File Structure Cheat Sheet](#file-structure-cheat-sheet)
- [Component Syntax](#component-syntax)
- [Client Directives](#client-directives)
- [Common Config Snippets](#common-config-snippets)
- [Frequently Used Patterns](#frequently-used-patterns)

---

## Installation

### Create New Project

```bash
npm create astro@latest
pnpm create astro@latest
yarn create astro
```

### Install Dependencies

```bash
npm install
pnpm install
yarn install
```

---

## Essential Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server at `localhost:4321` |
| `npm run build` | Build production site to `./dist/` |
| `npm run preview` | Preview production build locally |
| `npm run astro -- --help` | Show Astro CLI help |
| `npx astro add <integration>` | Add integration automatically |
| `npx @astrojs/upgrade` | Upgrade Astro and integrations |

---

## File Structure Cheat Sheet

```
my-astro-project/
├── public/                 # Static files (copied as-is)
│   ├── favicon.svg
│   └── robots.txt
├── src/
│   ├── components/         # Reusable components
│   │   ├── Header.astro
│   │   └── Button.jsx
│   ├── layouts/           # Page layouts
│   │   └── Layout.astro
│   ├── pages/             # Routes (file-based routing)
│   │   ├── index.astro
│   │   ├── about.astro
│   │   └── blog/
│   │       └── [slug].astro
│   ├── content/           # Content collections
│   │   ├── config.ts
│   │   └── blog/
│   │       └── post-1.md
│   └── styles/            # Global styles
│       └── global.css
├── astro.config.mjs       # Astro configuration
├── package.json
└── tsconfig.json
```

---

## Component Syntax

### Basic Astro Component

```astro
---
// Component Script (runs at build time on server)
import Header from '../components/Header.astro';

const title = "My Page";
const data = await fetch('https://api.example.com/data').then(r => r.json());
---

<!-- Template (HTML with dynamic content) -->
<html>
  <head>
    <title>{title}</title>
  </head>
  <body>
    <Header />
    <h1>{title}</h1>
    <p>Data: {data.message}</p>
  </body>
</html>

<style>
  /* Scoped CSS - only applies to this component */
  h1 {
    color: blue;
  }
</style>

<script>
  // Client-side JavaScript
  console.log('Runs in the browser');
</script>
```

### Props

```astro
---
// Receiving props
interface Props {
  title: string;
  description?: string;
}

const { title, description = 'Default description' } = Astro.props;
---

<h1>{title}</h1>
<p>{description}</p>
```

### Slots

```astro
---
// Layout.astro
---
<div class="layout">
  <slot />  <!-- Default slot -->
  <aside>
    <slot name="sidebar" />  <!-- Named slot -->
  </aside>
</div>
```

```astro
---
// Using the layout
import Layout from '../layouts/Layout.astro';
---

<Layout>
  <p>Main content</p>
  <div slot="sidebar">Sidebar content</div>
</Layout>
```

---

## Client Directives

Add interactivity to framework components:

```astro
---
import ReactCounter from './ReactCounter.jsx';
---

<!-- No JS - renders to static HTML -->
<ReactCounter />

<!-- Load and hydrate immediately -->
<ReactCounter client:load />

<!-- Hydrate when visible in viewport -->
<ReactCounter client:visible />

<!-- Hydrate when browser is idle -->
<ReactCounter client:idle />

<!-- Hydrate based on media query -->
<ReactCounter client:media="(max-width: 768px)" />

<!-- Only render on client (skip SSR) -->
<ReactCounter client:only="react" />
```

---

## Common Config Snippets

### Minimal Config

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://example.com',
});
```

### With Integrations

```javascript
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://example.com',
  integrations: [
    react(),
    tailwind(),
    sitemap(),
  ],
});
```

### SSR Configuration

```javascript
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';

export default defineConfig({
  output: 'server',  // or 'hybrid'
  adapter: netlify(),
  site: 'https://example.com',
});
```

### Image Optimization

```javascript
export default defineConfig({
  image: {
    domains: ['images.example.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
      },
    ],
  },
});
```

### Redirects

```javascript
export default defineConfig({
  redirects: {
    '/old-page': '/new-page',
    '/blog/[slug]': '/articles/[slug]',
  },
});
```

---

## Frequently Used Patterns

### Image Component

```astro
---
import { Image } from 'astro:assets';
import heroImage from '../assets/hero.jpg';
---

<Image
  src={heroImage}
  alt="Hero"
  width={800}
  height={600}
  format="webp"
/>
```

### Content Collections

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    publishDate: z.date(),
  }),
});

export const collections = { blog };
```

```astro
---
// Query content
import { getCollection } from 'astro:content';

const posts = await getCollection('blog');
---

{posts.map(post => (
  <article>
    <h2>{post.data.title}</h2>
  </article>
))}
```

### Dynamic Routes

```astro
---
// src/pages/blog/[slug].astro
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();
---

<h1>{post.data.title}</h1>
<Content />
```

### API Routes

```typescript
// src/pages/api/hello.json.ts
export const GET = () => {
  return new Response(
    JSON.stringify({ message: 'Hello, world!' }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
};
```

### View Transitions

```astro
---
// Add to layout
import { ViewTransitions } from 'astro:transitions';
---

<html>
  <head>
    <ViewTransitions />
  </head>
  <body>
    <slot />
  </body>
</html>
```

### Environment Variables

```env
# .env
PUBLIC_API_URL=https://api.example.com
SECRET_KEY=secret123
```

```astro
---
const publicApiUrl = import.meta.env.PUBLIC_API_URL;  // Available everywhere
const secretKey = import.meta.env.SECRET_KEY;         // Server-only
---
```

### Middleware

```typescript
// src/middleware.ts
import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware((context, next) => {
  console.log('URL:', context.url.pathname);
  return next();
});
```

### RSS Feed

```bash
npx astro add rss
```

```typescript
// src/pages/rss.xml.ts
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('blog');
  return rss({
    title: 'My Blog',
    description: 'My awesome blog',
    site: context.site,
    items: posts.map(post => ({
      title: post.data.title,
      pubDate: post.data.publishDate,
      link: `/blog/${post.slug}/`,
    })),
  });
}
```

---

## Quick Tips

### Performance

✅ Use `client:visible` for below-the-fold components
✅ Enable prefetching for faster navigation
✅ Optimize images with `<Image>` component
✅ Use content collections for type safety

### SEO

✅ Set `site` in config for canonical URLs
✅ Add sitemap integration
✅ Use semantic HTML
✅ Add meta tags and Open Graph

### Development

✅ Use TypeScript for better DX
✅ Install Astro VS Code extension
✅ Use `astro check` for type checking
✅ Leverage hot module replacement in dev

### Deployment

✅ Set environment variables on host
✅ Use appropriate adapter for SSR
✅ Test with `npm run preview` before deploying
✅ Enable caching headers for static assets

---

## Troubleshooting

### Common Issues

**Issue:** Component not hydrating
**Solution:** Add appropriate `client:*` directive

**Issue:** Image not optimizing
**Solution:** Use `import` for local images, configure `domains` for remote

**Issue:** TypeScript errors
**Solution:** Run `astro sync` to generate types

**Issue:** Build errors with dynamic imports
**Solution:** Ensure proper `getStaticPaths()` implementation

---

## Next Steps

- Read full [Astro Reference Guide](./ASTRO_REFERENCE.md)
- Explore [Integrations Guide](./astro-integrations.md)
- Check [Deployment Guide](./astro-deployment.md)
- Visit [Official Docs](https://docs.astro.build)

---

**Last Updated:** January 2025
