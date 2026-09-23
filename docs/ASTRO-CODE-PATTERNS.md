# Astro code patterns and project structure

Moved verbatim out of the root `CLAUDE.md` on 2026-09-23 (ICM migration, task
`c1a473f7`) — Astro-specific code reference, not routing. Nothing below was rewritten.
For the framework guide itself see `docs/ASTRO_REFERENCE.md`; this file holds this
project's own patterns and conventions.

## Project Structure

```
vecia-website-v5/
├── docs/                       # Project documentation (READ THESE FIRST!)
│   ├── ASTRO_REFERENCE.md     # Complete Astro guide
│   ├── astro-quick-start.md   # Quick reference
│   ├── astro-integrations.md  # Integration setup
│   └── astro-deployment.md    # Deployment guides
├── public/                     # Static assets (served as-is)
│   ├── favicon.svg
│   └── images/
├── src/
│   ├── components/            # Reusable UI components
│   ├── layouts/               # Page layouts
│   ├── pages/                 # File-based routing
│   ├── content/               # Content collections (if using)
│   └── styles/                # CSS/styling files
├── astro.config.mjs           # Astro configuration
└── package.json
```

## Code Style Guidelines

### Astro Components (.astro files)

**DO:**
```astro
---
// Component script (runs at build time on server)
import Layout from '../layouts/Layout.astro';
import Card from '../components/Card.astro';

const title = "My Page";
const data = await fetch('https://api.example.com/data').then(r => r.json());
---

<Layout title={title}>
  <h1>{title}</h1>
  <Card client:visible>
    <!-- Only hydrate when visible -->
  </Card>
</Layout>

<style>
  /* Scoped CSS - only applies to this component */
  h1 {
    color: var(--primary);
  }
</style>
```

**DON'T:**
- Add `client:load` to every component (kills performance)
- Forget scoped styles are default
- Mix server-only code with client directives incorrectly

### JavaScript/TypeScript

**Prefer:**
- ES modules: `import { foo } from 'bar'`
- Destructured imports when possible
- TypeScript for type safety
- Async/await over promises chains

**Example:**
```typescript
// Good
import { getCollection } from 'astro:content';

const posts = await getCollection('blog');

// Bad
const astro = require('astro:content'); // Don't use CommonJS
```

### Component Patterns

**UI Framework Components:**
```astro
---
import ReactCounter from './ReactCounter.jsx';
import VueChart from './VueChart.vue';
---

<!-- Static HTML (no JS) -->
<ReactCounter />

<!-- Hydrate on page load -->
<ReactCounter client:load />

<!-- Hydrate when visible (RECOMMENDED for below-fold content) -->
<VueChart client:visible />

<!-- Hydrate when idle -->
<ReactCounter client:idle />
```

## Astro Best Practices (2025)

### 1. Performance First

✅ **DO:**
- Use `client:visible` for below-the-fold interactive components
- Optimize images with `<Image>` component from `astro:assets`
- Enable prefetching for navigation
- Use static generation when possible
- Leverage content collections for type-safe Markdown

❌ **DON'T:**
- Add client-side JS unnecessarily
- Skip image optimization
- Use `client:load` everywhere
- Ignore accessibility

### 2. Image Optimization

```astro
---
import { Image } from 'astro:assets';
import heroImage from '../assets/hero.jpg';
---

<!-- Optimized, responsive images -->
<Image
  src={heroImage}
  alt="Hero image"
  width={800}
  height={600}
  format="webp"
  quality={80}
/>
```

### 3. Content Collections (if using Markdown/MDX)

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
  }),
});

export const collections = { blog };
```

### 4. Islands Architecture

- **Default:** Components render to static HTML (zero JS)
- **Islands:** Add `client:*` directives only where interactivity is needed
- **Goal:** Minimal JavaScript shipped to browser

## Common Patterns

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
// src/pages/api/data.json.ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const data = { message: 'Hello' };

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
```

### Environment Variables

```env
# .env
PUBLIC_API_URL=https://api.example.com  # Available client-side
SECRET_KEY=secret123                     # Server-only
```

```astro
---
const apiUrl = import.meta.env.PUBLIC_API_URL;
const secret = import.meta.env.SECRET_KEY;
---
```

## Integrations (if needed)

### Adding UI Framework

```bash
# Automatic (recommended)
npx astro add react
npx astro add vue
npx astro add svelte

# Multiple at once
npx astro add react tailwind sitemap
```

### Adding Features

```bash
npx astro add tailwind    # Tailwind CSS
npx astro add mdx         # MDX support
npx astro add sitemap     # Auto sitemap generation
```

**For detailed integration setup, see:** `docs/astro-integrations.md`

## Deployment

### Build Configuration

```javascript
// astro.config.mjs
export default defineConfig({
  site: 'https://vecia.com',  // Production URL
  output: 'static',            // or 'server' for SSR
});
```

### Deployment Checklist

- [ ] Set production `site` URL
- [ ] Configure environment variables
- [ ] Test production build (`npm run preview`)
- [ ] Run type checking (`npm run astro check`)
- [ ] Optimize images
- [ ] Test on multiple devices

**For platform-specific deployment, see:** `docs/astro-deployment.md`

## Resources

### Official Documentation
- Astro Docs: https://docs.astro.build
- GitHub: https://github.com/withastro/astro

### Project Documentation
- **Main Reference:** `docs/ASTRO_REFERENCE.md`
- **Quick Start:** `docs/astro-quick-start.md`
- **Integrations:** `docs/astro-integrations.md`
- **Deployment:** `docs/astro-deployment.md`
- **AI Agents:** `docs/claude-code-agents.md`
- **VPS CI/CD:** `docs/vps-deployment-github-actions.md`
