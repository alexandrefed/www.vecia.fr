# Claude Code Configuration for Vecia Website (Astro)

## Project Overview

This is an **Astro-based website** for Vecia, built with modern web development best practices. The project uses Astro's server-first architecture for optimal performance.

**Important Documentation References:**
- 📚 Main Astro Reference: `docs/ASTRO_REFERENCE.md` - Complete Astro framework guide
- ⚡ Quick Start Guide: `docs/astro-quick-start.md` - Common commands and patterns
- 🔌 Integrations Guide: `docs/astro-integrations.md` - UI frameworks and adapters
- 🚀 Deployment Guide: `docs/astro-deployment.md` - Platform-specific deployment instructions
- 🤖 **Claude Code Agents Guide: `docs/claude-code-agents.md` - Create specialized AI agents/subagents**
- 🔧 **VPS Deployment with GitHub Actions: `docs/vps-deployment-github-actions.md` - Complete CI/CD setup from Mac to VPS**

**V5 Implementation Documentation (2025):**
- 📋 **Implementation Plan: `docs/IMPLEMENTATION-PLAN.md` - Complete build roadmap for V5**
- 🌍 **i18n Reference: `docs/ASTRO-I18N-REFERENCE.md` - Astro internationalization guide**
- 🎨 **Tailwind Reference: `docs/TAILWIND-REFERENCE.md` - Tailwind CSS v4 configuration**
- ⚡ **Alpine.js Reference: `docs/ALPINEJS-REFERENCE.md` - Interactive component patterns**
- 📝 **Content Extraction: `docs/TEXT-EXTRACTION-Homepage.md` - French/English content source**
- ✨ **2025 Best Practices: `docs/2025-UPDATES.md` - Critical updates for modern development**

**IMPORTANT:** Always refer to these documentation files when working with Astro-specific features, configurations, or deployment. They contain the latest 2025 best practices.

---

## 🚨 Phase Implementation Protocol (MANDATORY)

**BEFORE implementing ANY phase, you MUST:**

1. **Open** `docs/PHASE-CHECKLIST.md`
2. **Search** Tavily/Context7 for "2025 best practices [phase technology]"
3. **Report** findings to user in this format:
   ```
   ## Phase X Best Practices Check ✅
   **Searched**: [queries]
   **Findings**: [summary]
   **Changes Needed**: [Yes/No]
   **Recommendation**: [proceed/update]
   ```
4. **WAIT** for user approval before coding
5. **Update** todo list with phase tasks

**If user says "Check phase checklist"** → immediately reference `docs/PHASE-CHECKLIST.md`

**NO EXCEPTIONS** - This ensures we always use 2025 best practices.

---

## Essential Commands

### Development
```bash
# Start development server (default: http://localhost:4321)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Type checking
npm run astro check

# Add integration
npx astro add <integration-name>

# Upgrade Astro and integrations
npx @astrojs/upgrade
```

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/description

# Stage and commit
git add .
git commit -m "feat: description"

# Push and create PR
git push origin feature/description
```

---

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

---

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

---

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

---

## Testing

### Before Committing

**ALWAYS run these checks:**

```bash
# Type checking
npm run astro check

# Build test
npm run build

# Preview build locally
npm run preview
```

**Test in browser:**
- Check console for errors
- Verify responsive design (mobile/tablet/desktop)
- Test interactive components
- Check Lighthouse scores (aim for 90+ in all categories)

---

## Workflow Best Practices

### When Starting a New Task

1. **Read relevant documentation first** - Check `docs/` for Astro patterns
2. **Plan before coding** - Use Plan Mode (Shift+Tab twice) for complex tasks
3. **Make small, focused changes** - Easier to review and debug
4. **Test frequently** - `npm run dev` has hot reload
5. **Commit often** - Small, descriptive commits

### When Implementing Features

1. **Check existing patterns** - Look at similar components/pages
2. **Follow Astro patterns** - Reference `docs/ASTRO_REFERENCE.md`
3. **Optimize from the start** - Use proper client directives
4. **Type safety** - Use TypeScript when possible
5. **Accessibility** - Semantic HTML, ARIA labels, keyboard navigation

### When Fixing Bugs or User Reports Issues

**🚨 CRITICAL: NEVER make blind changes. ALWAYS diagnose first.**

**MANDATORY Debugging Protocol (DO THIS FIRST):**

1. **Ask user to hard refresh browser** - `Cmd+Shift+R` (Mac) or `Ctrl+Shift+F5` (Windows)
   - Clears browser cache that might be showing old CSS/JS
   - Fixes 80% of "not working" issues

2. **Check browser DevTools BEFORE making any changes:**
   - Open DevTools (F12 or Cmd+Option+I)
   - **Elements tab**: Inspect the actual rendered HTML
   - **Computed styles**: See what CSS is actually applied
   - **Console tab**: Look for errors/warnings
   - **Network tab**: Check if CSS/JS files are loading (200 vs 404)
   - **Application tab**: Clear site data if needed

3. **Verify the actual problem:**
   - Screenshot or describe what you see in DevTools
   - Check if the classes are in the HTML
   - Check if the CSS rules exist
   - Check if something is overriding the styles

4. **Only THEN make targeted changes:**
   - Fix the specific root cause you identified
   - Don't try random "fixes" hoping something works
   - Test the fix immediately in browser

**Common Root Causes (check these first):**
- ❌ Browser cache (hard refresh fixes it)
- ❌ CSS not loading (check Network tab)
- ❌ Tailwind not generating the utility (check generated CSS)
- ❌ Specificity issues (something overriding your styles)
- ❌ Typo in class name
- ❌ Hot reload didn't pick up change (restart dev server)

**Anti-Patterns to AVOID:**
- ❌ Making changes without inspecting DevTools first
- ❌ Trying multiple "fixes" hoping one works
- ❌ Assuming the code is wrong without verification
- ❌ Relying on your memory of how something works
- ❌ Not asking user to hard refresh before debugging

---

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

---

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

---

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

---

## Important Reminders

### For Claude Code AI

**CRITICAL - Read Documentation First:**
1. **Before implementing Astro features**, read the relevant section in `docs/ASTRO_REFERENCE.md`
2. **For quick reference**, check `docs/astro-quick-start.md`
3. **For integrations**, consult `docs/astro-integrations.md`
4. **For deployment**, refer to `docs/astro-deployment.md`
5. **For creating specialized agents**, see `docs/claude-code-agents.md`
6. **For VPS deployment with CI/CD**, see `docs/vps-deployment-github-actions.md`

**When Planning:**
- Use Plan Mode (Shift+Tab twice) for complex tasks
- Break down large features into smaller steps
- Verify approach against documentation first

**When Coding:**
- **ALWAYS use Context7/documentation FIRST** - Don't rely on generic knowledge
- Follow Astro best practices from documentation
- Use proper client directives (prefer `client:visible`)
- Optimize images with `<Image>` component
- Keep JavaScript minimal (islands architecture)
- Test frequently during development
- **When something doesn't work**: Follow the Debugging Protocol (see "When Fixing Bugs" section)

**When Committing:**
- Write clear, descriptive commit messages
- Follow conventional commits: `feat:`, `fix:`, `docs:`, `style:`, etc.
- Run `npm run astro check` before committing
- Create focused commits (one feature/fix per commit)

**When in Doubt:**
- Ask questions before making assumptions
- Check existing code patterns
- Reference the documentation in `docs/`
- Use `/clear` to start fresh conversation when context is lost

---

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

---

**Last Updated:** January 2025
**Astro Version:** 4.x+
**Project:** Vecia Website v5
