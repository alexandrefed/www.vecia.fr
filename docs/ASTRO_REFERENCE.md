# Astro Web Framework - Complete Reference Guide (2025)

**Last Updated:** January 2025
**Version:** Astro 4.x+

## Table of Contents

- [What is Astro?](#what-is-astro)
- [Core Design Principles](#core-design-principles)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Islands Architecture](#islands-architecture)
- [Best Practices 2025](#best-practices-2025)
- [Performance Optimization](#performance-optimization)
- [UI Frameworks](#ui-frameworks)
- [Content Management](#content-management)
- [Server-Side Rendering](#server-side-rendering)
- [Deployment](#deployment)
- [Common Patterns](#common-patterns)

---

## What is Astro?

Astro is **the web framework for building content-driven websites** like blogs, marketing sites, documentation, and e-commerce platforms. It's best known for pioneering a new frontend architecture to reduce JavaScript overhead and complexity.

### Key Features

- **Islands Architecture**: Component-based web architecture optimized for content-driven websites
- **UI-Agnostic**: Supports React, Preact, Svelte, Vue, Solid, HTMX, web components, and more
- **Server-First**: Moves expensive rendering off visitors' devices
- **Zero JS by Default**: Less client-side JavaScript means faster sites
- **Content Collections**: Organize, validate, and provide TypeScript type-safety for Markdown content
- **Highly Customizable**: Hundreds of integrations available

### Performance Stats

- **40% faster** page loads with **90% less JavaScript** compared to popular React frameworks
- Impossible to build a slow website with Astro's default settings
- Ships only the JavaScript you explicitly need

---

## Core Design Principles

### 1. Content-Driven

Astro was designed for **content-rich websites**:
- Marketing sites
- Publishing sites & blogs
- Documentation sites
- Portfolios & landing pages
- Community sites
- E-commerce sites

Unlike frameworks built for web applications (dashboards, social networks), Astro focuses on delivering content to readers quickly.

### 2. Server-First

Astro leverages **server rendering** over client-side rendering:
- Same approach as PHP, WordPress, Laravel, Ruby on Rails
- Everything is HTML, CSS, and JavaScript (or TypeScript)
- Contrasts with Single-Page Apps (SPAs) which render in the browser
- Creates **Multi-Page Apps (MPAs)** by default

You can opt into client-side rendering when needed using UI framework components.

### 3. Fast by Default

Performance is critical:
- Every 100ms faster → 1% more conversions
- 50% faster → 12% more sales
- 20% faster → 10% more conversions

**Astro's goal**: It should be nearly impossible to build a slow website.

### 4. Easy to Use

- `.astro` UI language is a **superset of HTML** - any valid HTML is valid Astro
- Combines favorite features from JSX (React), CSS scoping (Svelte/Vue)
- No complex reactivity, hooks, closures, refs needed on the server
- **Opt in to complexity** - start with HTML/CSS, add power as needed

### 5. Developer-Focused

- Great CLI experience
- Official VS Code extension with syntax highlighting, TypeScript, Intellisense
- Active documentation in 14 languages
- Welcoming Discord community
- Regular live events and community calls

---

## Getting Started

### Installation

```bash
# Using npm
npm create astro@latest

# Using pnpm
pnpm create astro@latest

# Using yarn
yarn create astro
```

### Essential Commands

```bash
# Start development server (usually http://localhost:4321)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run Astro CLI commands
npm run astro -- --help
```

### Development Workflow

1. **Development**: `npm run dev` - Hot module replacement, instant updates
2. **Build**: `npm run build` - Optimized production build
3. **Preview**: `npm run preview` - Test production build locally
4. **Deploy**: Push to hosting platform

---

## Project Structure

### Basic Structure

```
/
├── public/              # Static assets (favicon, images, etc.)
├── src/
│   ├── components/      # UI components (.astro, .jsx, .vue, etc.)
│   ├── content/         # Content collections (Markdown/MDX)
│   ├── layouts/         # Page layouts
│   ├── pages/           # File-based routing
│   └── styles/          # CSS/styling files
├── astro.config.mjs     # Astro configuration
├── package.json         # Project dependencies
└── tsconfig.json        # TypeScript configuration
```

### Key Directories

- **`public/`**: Served as-is, not processed by Astro
- **`src/pages/`**: File-based routing - each file becomes a page
- **`src/components/`**: Reusable UI components
- **`src/layouts/`**: Shared page layouts
- **`src/content/`**: Type-safe content collections for Markdown/MDX

---

## Configuration

### Basic astro.config.mjs

```javascript
import { defineConfig } from 'astro/config';

export default defineConfig({
  // Site URL for canonical URLs and sitemaps
  site: 'https://example.com',

  // Base path if deployed to subdirectory
  base: '/my-app',

  // Output mode: 'static' or 'hybrid' or 'server'
  output: 'static',

  // Build options
  build: {
    // Output directory (default: 'dist')
    outDir: './dist',

    // Assets directory within outDir
    assets: '_astro',

    // Build concurrency (pages built in parallel)
    concurrency: 1,

    // CDN prefix for assets
    assetsPrefix: 'https://cdn.example.com',
  },

  // Integrations
  integrations: [],

  // Vite configuration
  vite: {
    // Vite-specific options
  },
});
```

### Important Configuration Options

#### Site Configuration

```javascript
export default defineConfig({
  site: 'https://example.com',  // Required for sitemap generation
  base: '/docs',                 // Base path for subdirectory deployment
  trailingSlash: 'always',       // URL format: 'always', 'never', 'ignore'
});
```

#### Image Configuration

```javascript
import { defineConfig } from 'astro/config';

export default defineConfig({
  image: {
    // Image service: 'sharp' (default) or 'squoosh'
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        limitInputPixels: false, // For large images
      },
    },

    // Authorized remote image domains
    domains: ['astro.build', 'example.com'],

    // Remote image patterns
    remotePatterns: [
      { protocol: 'https' }
    ],
  },
});
```

#### Prefetching

```javascript
export default defineConfig({
  prefetch: true,  // Enable core prefetching

  // Or configure advanced options
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
});
```

#### Redirects

```javascript
export default defineConfig({
  redirects: {
    '/old-page': '/new-page',
    '/blog/[...slug]': '/articles/[...slug]',
  },
});
```

---

## Islands Architecture

### What are Islands?

**Islands Architecture** is Astro's pattern for building fast websites:
- Static HTML by default
- Interactive components (islands) only where needed
- Each island loads independently
- Parallel loading for better performance

### Island Directives

```astro
---
import MyReactComponent from './MyReactComponent.jsx';
---

<!-- No hydration - static HTML only -->
<MyReactComponent />

<!-- Load immediately on page load -->
<MyReactComponent client:load />

<!-- Load when visible in viewport -->
<MyReactComponent client:visible />

<!-- Load when browser is idle -->
<MyReactComponent client:idle />

<!-- Load based on media query -->
<MyReactComponent client:media="(max-width: 768px)" />

<!-- Only render client-side (skip SSR) -->
<MyReactComponent client:only="react" />
```

### Server Islands (NEW in Astro 4.x)

Server islands allow **on-demand server rendering** for dynamic content:

```astro
---
import Avatar from '../components/Avatar.astro';
import GenericAvatar from '../components/GenericAvatar.astro';
---

<!-- Defer rendering to server on-demand -->
<Avatar server:defer>
  <GenericAvatar slot="fallback" />
</Avatar>
```

**Use cases:**
- User-specific content (avatars, personalized data)
- Dynamic database queries
- Real-time data that can't be pre-rendered

**Requirements:**
- Adapter must support on-demand rendering
- Use `output: 'server'` or `output: 'hybrid'` mode

---

## Best Practices 2025

### 1. Performance First

✅ **Do:**
- Use static generation (`output: 'static'`) when possible
- Minimize client-side JavaScript with islands
- Optimize images with Astro's built-in `<Image>` component
- Enable prefetching for faster navigation
- Use content collections for type-safe Markdown

❌ **Don't:**
- Add `client:load` to every component
- Import heavy libraries without code splitting
- Ignore image optimization
- Skip accessibility best practices

### 2. Modern Image Optimization

```astro
---
import { Image } from 'astro:assets';
import myImage from '../assets/hero.png';
---

<!-- Optimized, responsive images -->
<Image
  src={myImage}
  alt="Hero image"
  width={800}
  height={600}
  format="webp"
  quality={80}
/>
```

**Benefits:**
- Automatic format conversion (WebP, AVIF)
- Responsive image generation
- Lazy loading by default
- Size optimization

### 3. Content Collections

Organize and validate Markdown content:

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
    tags: z.array(z.string()),
  }),
});

export const collections = { blog };
```

```astro
---
import { getCollection } from 'astro:content';

const posts = await getCollection('blog');
---

{posts.map(post => (
  <article>
    <h2>{post.data.title}</h2>
    <p>{post.data.description}</p>
  </article>
))}
```

### 4. TypeScript Setup

```json
// tsconfig.json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "jsx": "preserve",
    "jsxImportSource": "react"  // Or vue, solid, etc.
  }
}
```

### 5. Environment Variables

```javascript
// astro.config.mjs
import { defineConfig, envField } from 'astro/config';

export default defineConfig({
  experimental: {
    env: {
      schema: {
        PUBLIC_API_URL: envField.string({
          context: 'client',
          access: 'public'
        }),
        API_SECRET: envField.string({
          context: 'server',
          access: 'secret'
        }),
      },
    },
  },
});
```

### 6. View Transitions

Add smooth page transitions:

```astro
---
// In your layout
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

Persist component state across navigation:

```astro
<Counter client:load transition:persist />
```

---

## Performance Optimization

### 1. Build Optimization

```javascript
export default defineConfig({
  build: {
    // Build pages in parallel (use cautiously)
    concurrency: 2,

    // Inline stylesheets under certain size
    inlineStylesheets: 'auto',
  },

  // Enable compression
  vite: {
    build: {
      minify: 'terser',
      cssMinify: true,
    },
  },
});
```

### 2. Prefetch Strategies

```javascript
export default defineConfig({
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',  // 'hover', 'load', 'viewport', 'tap'
  },
});
```

Manual prefetching:

```astro
---
---
<a href="/about" data-astro-prefetch>About</a>
<a href="/blog" data-astro-prefetch="viewport">Blog</a>
```

### 3. Code Splitting

Astro automatically splits code, but you can optimize further:

```javascript
// Dynamic imports for heavy components
const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

### 4. CDN Configuration

```javascript
export default defineConfig({
  build: {
    assetsPrefix: 'https://cdn.example.com',
  },
});
```

---

## UI Frameworks

### Installing Integrations

```bash
# Automatic setup (recommended)
npx astro add react
npx astro add vue
npx astro add svelte
npx astro add solid-js
npx astro add preact

# Multiple at once
npx astro add react vue svelte
```

### Manual Configuration

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vue from '@astrojs/vue';
import svelte from '@astrojs/svelte';

export default defineConfig({
  integrations: [
    react(),
    vue(),
    svelte(),
  ],
});
```

### Framework-Specific Options

#### React

```javascript
integrations: [
  react({
    include: ['**/react/*'],
    experimentalReactChildren: true,
  })
]
```

#### Vue

```javascript
integrations: [
  vue({
    appEntrypoint: '/src/pages/_app',
  })
]
```

#### Preact

```javascript
integrations: [
  preact({
    devtools: true,  // Enable Preact devtools in dev
  })
]
```

#### Solid

```javascript
integrations: [
  solidJs({
    devtools: true,
  })
]
```

### Mixing Frameworks

You can use multiple frameworks in the same project:

```astro
---
import ReactCounter from './ReactCounter.jsx';
import VueChart from './VueChart.vue';
import SvelteForm from './SvelteForm.svelte';
---

<ReactCounter client:load />
<VueChart client:visible />
<SvelteForm client:idle />
```

---

## Content Management

### Content Collections

```
src/
└── content/
    ├── config.ts        # Collection schemas
    ├── blog/
    │   ├── post-1.md
    │   └── post-2.md
    └── docs/
        ├── intro.md
        └── guide.md
```

### Schema Definition

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()),
    image: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
```

### Querying Content

```astro
---
import { getCollection, getEntry } from 'astro:content';

// Get all entries
const allPosts = await getCollection('blog');

// Filter entries
const publishedPosts = await getCollection('blog', ({ data }) => {
  return !data.draft;
});

// Get single entry
const post = await getEntry('blog', 'post-1');

// Render content
const { Content } = await post.render();
---

<Content />
```

### MDX Support

```bash
npx astro add mdx
```

```mdx
---
title: My MDX Post
---

import CustomComponent from '../components/CustomComponent.astro';

# Hello from MDX!

<CustomComponent />
```

---

## Server-Side Rendering

### Enabling SSR

```bash
# Add an adapter
npx astro add netlify
npx astro add vercel
npx astro add node
npx astro add cloudflare
```

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';

export default defineConfig({
  output: 'server',  // or 'hybrid'
  adapter: netlify(),
});
```

### Output Modes

- **`static`**: Pre-render all pages (default)
- **`server`**: Server-render all pages on-demand
- **`hybrid`**: Pre-render by default, opt into SSR per-page

### Hybrid Mode

```astro
---
// This page is server-rendered
export const prerender = false;
---

<h1>Dynamic Page</h1>
```

### Adapter Configuration

#### Netlify

```javascript
import netlify from '@astrojs/netlify';

export default defineConfig({
  adapter: netlify({
    edgeMiddleware: true,
    functionPerRoute: true,
  }),
});
```

#### Vercel

```javascript
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  adapter: vercel({
    edgeMiddleware: true,
    functionPerRoute: true,
  }),
});
```

#### Node

```javascript
import node from '@astrojs/node';

export default defineConfig({
  adapter: node({
    mode: 'standalone',  // or 'middleware'
  }),
});
```

---

## Deployment

### Static Deployment

Build command: `npm run build`
Output directory: `dist/`

**Popular platforms:**
- Netlify
- Vercel
- GitHub Pages
- Cloudflare Pages
- AWS Amplify
- Azure Static Web Apps

### SSR Deployment

Requires an adapter. Popular options:

#### Netlify

```bash
npx astro add netlify
git push
```

#### Vercel

```bash
npx astro add vercel
git push
```

#### Cloudflare Pages

```bash
npx astro add cloudflare
```

#### Deno Deploy

```bash
npx astro add deno
```

### Environment Variables

```env
# .env
PUBLIC_API_URL=https://api.example.com
SECRET_KEY=your-secret-key
```

```astro
---
// Access in Astro components
const apiUrl = import.meta.env.PUBLIC_API_URL;
const secret = import.meta.env.SECRET_KEY;
---
```

### CI/CD Example (GitHub Actions)

```yaml
name: Deploy to Netlify
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: netlify/actions/cli@master
        with:
          args: deploy --prod
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

---

## Common Patterns

### Dynamic Routes

```
src/pages/
├── blog/
│   └── [slug].astro
└── products/
    └── [...path].astro
```

```astro
---
// src/pages/blog/[slug].astro
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

<article>
  <h1>{post.data.title}</h1>
  <Content />
</article>
```

### API Routes

```typescript
// src/pages/api/posts.json.ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ params, request }) => {
  const posts = await fetchPosts();

  return new Response(JSON.stringify(posts), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const POST: APIRoute = async ({ request }) => {
  const data = await request.json();
  // Handle POST request

  return new Response(JSON.stringify({ success: true }), {
    status: 201,
  });
};
```

### Middleware

```typescript
// src/middleware.ts
import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware((context, next) => {
  // Run before page renders
  console.log('Request:', context.url.pathname);

  // Continue to next middleware or page
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
    description: 'A blog about web development',
    site: context.site,
    items: posts.map(post => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishDate,
      link: `/blog/${post.slug}/`,
    })),
  });
}
```

### Sitemap

```bash
npx astro add sitemap
```

```javascript
// astro.config.mjs
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://example.com',
  integrations: [sitemap()],
});
```

---

## Official Integrations

### Core Integrations

- **Adapters**: `@astrojs/netlify`, `@astrojs/vercel`, `@astrojs/node`, `@astrojs/cloudflare`, `@astrojs/deno`
- **UI Frameworks**: `@astrojs/react`, `@astrojs/vue`, `@astrojs/svelte`, `@astrojs/solid-js`, `@astrojs/preact`, `@astrojs/alpinejs`
- **Features**: `@astrojs/mdx`, `@astrojs/markdoc`, `@astrojs/db`, `@astrojs/sitemap`, `@astrojs/rss`, `@astrojs/partytown`

### Installing Integrations

```bash
# Automatic (recommended)
npx astro add <integration-name>

# Manual
npm install @astrojs/<integration-name>
```

Then update `astro.config.mjs`:

```javascript
import integration from '@astrojs/integration-name';

export default defineConfig({
  integrations: [integration()],
});
```

---

## Resources

### Official Documentation
- Main Docs: https://docs.astro.build
- GitHub: https://github.com/withastro/astro
- Discord: https://astro.build/chat
- Twitter: https://twitter.com/astrodotbuild

### Useful Links
- Astro Themes: https://astro.build/themes
- Integrations Directory: https://astro.build/integrations
- VS Code Extension: Search "Astro" in VS Code extensions

### Community
- Discord Community: Active support and discussions
- GitHub Discussions: Feature requests and Q&A
- Community Showcase: Share your projects

---

## Migration & Upgrade

### Upgrading Astro

```bash
# Upgrade to latest
npx @astrojs/upgrade

# Upgrade specific packages
npm install astro@latest
npm install @astrojs/react@latest
```

### Breaking Changes

Always check the [changelog](https://github.com/withastro/astro/blob/main/packages/astro/CHANGELOG.md) before upgrading major versions.

---

**This guide is based on Astro 4.x and best practices as of January 2025.**
