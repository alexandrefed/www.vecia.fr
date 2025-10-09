# Getting Started with Vecia Website

**Quick onboarding guide for new developers.**

**Last Updated:** January 2025
**Astro Version:** 5.14.1+
**Estimated Setup Time:** 15 minutes

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Setup](#quick-setup)
3. [Project Overview](#project-overview)
4. [Essential Commands](#essential-commands)
5. [File Structure](#file-structure)
6. [Common Tasks](#common-tasks)
7. [Next Steps](#next-steps)

---

## Prerequisites

Before you begin, ensure you have:

**Required:**
- ✅ **Node.js** v18.14.1 or higher ([Download](https://nodejs.org/))
- ✅ **npm** v9+ (comes with Node.js)
- ✅ **Git** ([Download](https://git-scm.com/))
- ✅ **Code editor** (VS Code recommended)

**Optional but Recommended:**
- 📝 **VS Code Extensions:**
  - Astro (astro-build.astro-vscode)
  - Tailwind CSS IntelliSense (bradlc.vscode-tailwindcss)
  - ESLint (dbaeumer.vscode-eslint)
  - Prettier (esbenp.prettier-vscode)

**Check your versions:**
```bash
node --version  # Should be v18.14.1 or higher
npm --version   # Should be v9 or higher
git --version   # Any recent version
```

---

## Quick Setup

### Step 1: Clone the Repository

```bash
# Clone the repo
git clone https://github.com/vecia/vecia-website-v5.git

# Navigate to project directory
cd vecia-website-v5
```

### Step 2: Install Dependencies

```bash
# Install all packages (~2 minutes)
npm install
```

**Expected output:**
```
added 847 packages, and audited 848 packages in 1m 32s

182 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

### Step 3: Start Development Server

```bash
# Start dev server with hot reload
npm run dev
```

**Expected output:**
```
  🚀  astro  v5.14.1 started in 328ms

  ┃ Local    http://localhost:4321/
  ┃ Network  use --host to expose
```

### Step 4: Open in Browser

```bash
# Mac
open http://localhost:4321/

# Windows
start http://localhost:4321/

# Linux
xdg-open http://localhost:4321/
```

**You should see:** The Vecia homepage with hero section, products, and navigation.

### Step 5: Verify Everything Works

**Test checklist:**
- [ ] Homepage loads correctly
- [ ] Navigation links work (About, Products, Blog)
- [ ] No console errors (F12 → Console)
- [ ] Hot reload works (edit a file, see changes instantly)

**If something doesn't work:** See [Troubleshooting](#troubleshooting) section.

---

## Project Overview

### What is Vecia Website?

**Vecia Website** is the main marketing website for Vecia, an AI automation agency. It showcases:
- 🤖 **AI Products** (Agentic Workforce, AI Brain, Automation Hub)
- 📚 **Use Cases** (industry-specific automation examples)
- 📝 **Blog** (automation guides and insights)
- 👥 **About** (team, mission, values)
- ⚖️ **Legal** (privacy, terms, AI ethics)

### Technology Stack

| Technology | Purpose | Docs |
|------------|---------|------|
| **Astro 5.14.1** | Static site generator | [ASTRO_REFERENCE.md](./ASTRO_REFERENCE.md) |
| **Tailwind CSS v4** | Utility-first CSS | [TAILWIND-REFERENCE.md](./TAILWIND-REFERENCE.md) |
| **Alpine.js** | Lightweight JS framework | [ALPINEJS-REFERENCE.md](./ALPINEJS-REFERENCE.md) |
| **TypeScript** | Type-safe JavaScript | Native Astro support |
| **Content Collections** | Type-safe Markdown | [BLOG-WORKFLOW.md](./BLOG-WORKFLOW.md) |

### Key Features

- 🌍 **Bilingual** (French + English) - See [I18N-ARCHITECTURE.md](./I18N-ARCHITECTURE.md)
- 📱 **Responsive** (mobile-first design)
- ⚡ **Fast** (static generation, optimized images)
- 🎨 **Modern UI** (glassmorphism, gradients, animations)
- 📊 **SEO-optimized** (meta tags, structured data)

---

## Essential Commands

### Development

```bash
# Start dev server (http://localhost:4321)
npm run dev

# Type checking (TypeScript + Zod validation)
npm run astro check

# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Git Workflow

```bash
# Check current branch and status
git status

# Create feature branch
git checkout -b feature/your-feature-name

# Stage changes
git add .

# Commit with message
git commit -m "feat: Add your feature description"

# Push to remote
git push origin feature/your-feature-name
```

### Astro Utilities

```bash
# Add integration (React, Vue, Tailwind, etc.)
npx astro add react

# Upgrade Astro and integrations
npx @astrojs/upgrade

# Generate types for Content Collections
npm run astro sync
```

### Troubleshooting

```bash
# Clear Astro cache (fixes most build issues)
rm -rf .astro node_modules/.astro

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check for outdated packages
npm outdated

# Check for security vulnerabilities
npm audit
```

---

## File Structure

### High-Level Overview

```
vecia-website-v5/
├── docs/                       # 📚 Project documentation (START HERE)
│   ├── GETTING-STARTED.md     # This file
│   ├── ASTRO_REFERENCE.md     # Complete Astro guide
│   ├── BLOG-WORKFLOW.md       # Blog content management
│   ├── I18N-ARCHITECTURE.md   # Translation system
│   └── ...                    # More guides
│
├── public/                     # 🖼️ Static assets (served as-is)
│   ├── images/                # Images, logos
│   └── favicon.svg            # Site favicon
│
├── src/
│   ├── components/            # 🧩 Reusable UI components
│   │   ├── blog/              # Blog-specific components
│   │   ├── sections/          # Page sections (Hero, CTA, etc.)
│   │   └── ...                # Other components
│   │
│   ├── content/               # 📝 Content Collections (Markdown)
│   │   ├── config.ts          # Schema definitions
│   │   └── blog/              # Blog posts (fr/ and en/)
│   │
│   ├── i18n/                  # 🌍 Translations (French + English)
│   │   ├── ui.ts              # Main export (merges all namespaces)
│   │   ├── fr/                # French translations by namespace
│   │   └── en/                # English translations by namespace
│   │
│   ├── layouts/               # 🎨 Page layouts
│   │   └── BaseLayout.astro   # Main layout (nav, footer, meta)
│   │
│   ├── pages/                 # 📄 File-based routing
│   │   ├── index.astro        # Homepage (French)
│   │   ├── about.astro        # About page
│   │   ├── blog.astro         # Blog homepage
│   │   ├── blog/[slug].astro  # Dynamic blog article
│   │   └── en/                # English versions
│   │
│   └── styles/                # 🎨 Global styles
│       └── global.css         # Tailwind imports + custom CSS
│
├── astro.config.mjs           # ⚙️ Astro configuration
├── tailwind.config.mjs        # 🎨 Tailwind configuration
├── tsconfig.json              # 🔷 TypeScript configuration
└── package.json               # 📦 Dependencies and scripts
```

### Key Directories Explained

| Directory | Purpose | When to Edit |
|-----------|---------|--------------|
| **`docs/`** | Project documentation | Adding guides, updating processes |
| **`public/`** | Static assets | Adding images, fonts, favicons |
| **`src/components/`** | Reusable UI components | Creating new components |
| **`src/content/blog/`** | Blog posts (Markdown) | Writing blog articles |
| **`src/i18n/`** | Translations | Adding/updating translations |
| **`src/layouts/`** | Page layouts | Changing site-wide structure |
| **`src/pages/`** | Routes (pages) | Adding new pages |

---

## Common Tasks

### Task 1: Adding a New Page

**Example:** Create a "Pricing" page

**Step 1:** Create page files (French + English)

```bash
touch src/pages/pricing.astro
touch src/pages/en/pricing.astro
```

**Step 2:** Add basic structure

**File:** `src/pages/pricing.astro`
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { ui } from '../i18n/ui';

const lang = 'fr';
const translations = ui[lang];

// Page metadata
const title = 'Tarifs - Vecia';
const description = 'Découvrez nos offres d\'automatisation IA...';
---

<BaseLayout title={title} description={description} lang={lang}>
  <!-- Hero Section -->
  <section class="pt-32 pb-16">
    <div class="container mx-auto px-4">
      <h1 class="text-5xl font-bold text-text mb-6">
        Tarification Simple et Transparente
      </h1>
      <p class="text-xl text-text/70">
        Choisissez l'offre qui correspond à vos besoins
      </p>
    </div>
  </section>

  <!-- Pricing Cards -->
  <section class="py-16">
    <div class="container mx-auto px-4">
      <!-- Your pricing content here -->
    </div>
  </section>
</BaseLayout>
```

**Step 3:** Add navigation link

**File:** `src/components/Navigation.astro`
```astro
<a href="/pricing">{translations['nav.pricing']}</a>
```

**Step 4:** Add translations (see Task 2)

**Step 5:** Test locally
```bash
npm run dev
open http://localhost:4321/pricing
```

### Task 2: Adding Translations

**Example:** Add "Pricing" navigation item

**Step 1:** Add to French common namespace

**File:** `src/i18n/fr/common.ts`
```typescript
export const common = {
  // ... existing translations

  // Navigation
  'nav.home': 'ACCUEIL',
  'nav.pricing': 'TARIFS',  // ← Add this

  // ... rest of file
} as const;
```

**Step 2:** Add to English common namespace

**File:** `src/i18n/en/common.ts`
```typescript
export const common = {
  // ... existing translations

  // Navigation
  'nav.home': 'HOME',
  'nav.pricing': 'PRICING',  // ← Add this

  // ... rest of file
} as const;
```

**Step 3:** Use in component
```astro
<a href="/pricing">{translations['nav.pricing']}</a>
```

**More details:** See [I18N-ARCHITECTURE.md](./I18N-ARCHITECTURE.md)

### Task 3: Creating a Blog Post

**Example:** Write "5 CRM Automation Mistakes" article

**Step 1:** Create Markdown files

```bash
touch src/content/blog/fr/5-erreurs-crm.md
touch src/content/blog/en/5-crm-mistakes.md
```

**Step 2:** Add frontmatter + content

**File:** `src/content/blog/fr/5-erreurs-crm.md`
```markdown
---
title: "5 Erreurs d'Automatisation CRM à Éviter"
description: "Évitez ces 5 erreurs courantes qui ruinent vos projets d'automatisation CRM."
publishDate: 2025-01-20
author: "Alexandre Fedotov"
category: "quick-wins"
tags: ["crm", "automatisation", "erreurs"]
featured: false
---

# 5 Erreurs d'Automatisation CRM à Éviter

Votre CRM automatisé vous fait-il perdre du temps au lieu d'en gagner ?

[... article content ...]
```

**Step 3:** Test locally
```bash
npm run dev
open http://localhost:4321/blog
```

**More details:** See [BLOG-WORKFLOW.md](./BLOG-WORKFLOW.md)

### Task 4: Adding a New Component

**Example:** Create a "Testimonial" component

**Step 1:** Create component file

```bash
touch src/components/Testimonial.astro
```

**Step 2:** Write component

**File:** `src/components/Testimonial.astro`
```astro
---
interface Props {
  quote: string;
  author: string;
  company: string;
  image?: string;
}

const { quote, author, company, image } = Astro.props;
---

<div class="bg-white rounded-xl shadow-lg p-6">
  <p class="text-lg text-text/80 italic mb-4">"{quote}"</p>
  <div class="flex items-center gap-4">
    {image && <img src={image} alt={author} class="w-12 h-12 rounded-full" />}
    <div>
      <p class="font-bold text-text">{author}</p>
      <p class="text-sm text-text/60">{company}</p>
    </div>
  </div>
</div>
```

**Step 3:** Use in page

```astro
---
import Testimonial from '../components/Testimonial.astro';
---

<Testimonial
  quote="Vecia a transformé notre productivité !"
  author="Jean Dupont"
  company="Acme Corp"
  image="/images/testimonials/jean.jpg"
/>
```

### Task 5: Styling with Tailwind

**Tailwind v4 is included** - Use utility classes directly:

```astro
<!-- Layout -->
<div class="container mx-auto px-4">
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

<!-- Typography -->
<h1 class="text-5xl font-bold text-text">
<p class="text-lg text-text/70 leading-relaxed">

<!-- Colors -->
<div class="bg-primary text-white">
<div class="bg-gradient-to-r from-primary to-secondary">

<!-- Spacing -->
<div class="pt-32 pb-16">
<div class="mb-6">

<!-- Responsive -->
<div class="hidden md:block">  <!-- Show on desktop only -->
<div class="md:hidden">        <!-- Show on mobile only -->

<!-- Hover Effects -->
<button class="hover:bg-primary hover:scale-105 transition-all">
```

**More details:** See [TAILWIND-REFERENCE.md](./TAILWIND-REFERENCE.md)

### Task 6: Adding Interactivity with Alpine.js

**Alpine.js is included** - Use `x-data`, `x-show`, `x-on` directives:

```astro
<!-- Simple toggle -->
<div x-data="{ open: false }">
  <button @click="open = !open">Toggle</button>
  <div x-show="open">Content appears when clicked</div>
</div>

<!-- Search filter -->
<div x-data="{ search: '' }">
  <input type="text" x-model="search" placeholder="Search...">
  <p x-show="search.length > 0">You searched for: <span x-text="search"></span></p>
</div>
```

**More details:** See [ALPINEJS-REFERENCE.md](./ALPINEJS-REFERENCE.md)

---

## Next Steps

### 1. Read Core Documentation

**Priority order:**
1. ✅ **This file** (you're reading it!) - Basic setup ✅
2. 📚 **[ASTRO_REFERENCE.md](./ASTRO_REFERENCE.md)** - Learn Astro fundamentals
3. 🌍 **[I18N-ARCHITECTURE.md](./I18N-ARCHITECTURE.md)** - Understand translation system
4. 📝 **[BLOG-WORKFLOW.md](./BLOG-WORKFLOW.md)** - Learn content management
5. 🎨 **[TAILWIND-REFERENCE.md](./TAILWIND-REFERENCE.md)** - Master styling

### 2. Explore the Codebase

**Recommended exploration path:**
1. **Homepage** (`src/pages/index.astro`) - Main landing page structure
2. **BaseLayout** (`src/layouts/BaseLayout.astro`) - Site-wide structure
3. **Navigation** (`src/components/Navigation.astro`) - Nav component
4. **i18n** (`src/i18n/ui.ts`) - Translation system
5. **Blog** (`src/pages/blog.astro`) - Blog homepage with filters

### 3. Make Your First Contribution

**Easy first tasks:**
1. Fix a typo in a translation
2. Add a new navigation link
3. Create a simple component
4. Write a blog post
5. Improve documentation

### 4. Join Development Workflow

**Before coding:**
- Create feature branch: `git checkout -b feature/your-feature`
- Check existing patterns (look at similar components)
- Ask questions if unsure

**While coding:**
- Test frequently: `npm run dev`
- Follow conventions (see CLAUDE.md)
- Write descriptive commit messages

**Before committing:**
- Run type check: `npm run astro check`
- Test in browser (mobile + desktop)
- Verify no console errors

**After committing:**
- Push to GitHub
- Create Pull Request
- Request review from team

---

## Troubleshooting

### Issue: Dev Server Won't Start

**Symptoms:** `npm run dev` fails with errors

**Common causes & fixes:**
1. **Port 4321 already in use**
   ```bash
   # Find and kill process using port 4321
   lsof -ti:4321 | xargs kill
   ```

2. **Node version too old**
   ```bash
   node --version  # Should be v18.14.1+
   # Update Node.js if needed
   ```

3. **Corrupted node_modules**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### Issue: Changes Not Showing in Browser

**Symptoms:** You edit a file but changes don't appear

**Fixes:**
1. **Hard refresh browser** - `Cmd+Shift+R` (Mac) or `Ctrl+Shift+F5` (Windows)
2. **Restart dev server** - `Ctrl+C` then `npm run dev`
3. **Clear Astro cache**
   ```bash
   rm -rf .astro
   npm run dev
   ```

### Issue: TypeScript Errors

**Symptoms:** Red squiggly lines in VS Code or `astro check` fails

**Fixes:**
1. **Restart TypeScript server** - `Cmd+Shift+P` → "TypeScript: Restart TS Server"
2. **Generate types** - `npm run astro sync`
3. **Check for typos** - Translation keys, component props, etc.

### Issue: Build Fails

**Symptoms:** `npm run build` shows errors

**Common causes:**
1. **TypeScript errors** - Fix with `npm run astro check`
2. **Missing files** - Check all imports are correct
3. **Broken links** - Verify all `<a href>` links are valid

### Issue: Translation Shows as `undefined`

**Symptoms:** Component displays `undefined` instead of text

**Checklist:**
- [ ] Translation key exists in both `fr/` and `en/` namespaces
- [ ] Key is spelled correctly (case-sensitive)
- [ ] Namespace is imported in `src/i18n/ui.ts`
- [ ] Dev server was restarted

**Debug:**
```astro
---
import { ui } from '../i18n/ui';
console.log(Object.keys(ui.fr));  // List all keys
---
```

### Still Stuck?

**Resources:**
1. Check `docs/` for more detailed guides
2. Ask team members (Slack/Discord)
3. Search Astro Discord: https://astro.build/chat
4. Check Astro docs: https://docs.astro.build

---

## Quick Reference: Commands Cheat Sheet

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview prod build
npm run astro check      # Type checking

# Git
git status               # Check current status
git checkout -b name     # Create branch
git add .                # Stage all changes
git commit -m "message"  # Commit with message
git push origin branch   # Push to remote

# Troubleshooting
rm -rf .astro            # Clear Astro cache
rm -rf node_modules      # Remove dependencies
npm install              # Reinstall dependencies
lsof -ti:4321 | xargs kill  # Kill process on port 4321

# Astro Utilities
npx astro add react      # Add integration
npx @astrojs/upgrade     # Upgrade Astro
npm run astro sync       # Generate types
```

---

## Additional Resources

### Documentation

| Doc | Purpose | When to Read |
|-----|---------|--------------|
| [ASTRO_REFERENCE.md](./ASTRO_REFERENCE.md) | Complete Astro guide | Learning framework |
| [BLOG-WORKFLOW.md](./BLOG-WORKFLOW.md) | Blog content management | Writing articles |
| [I18N-ARCHITECTURE.md](./I18N-ARCHITECTURE.md) | Translation system | Adding translations |
| [TAILWIND-REFERENCE.md](./TAILWIND-REFERENCE.md) | Styling guide | Designing UI |
| [ALPINEJS-REFERENCE.md](./ALPINEJS-REFERENCE.md) | Interactivity patterns | Adding JS behavior |
| [IMPLEMENTATION-PLAN.md](./IMPLEMENTATION-PLAN.md) | Project roadmap | Understanding scope |

### External Links

- **Astro Docs:** https://docs.astro.build
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Alpine.js:** https://alpinejs.dev
- **TypeScript:** https://www.typescriptlang.org/docs

### Team

- **Alexandre Fedotov** - Co-Founder, Strategy
- **Tanguy Dray** - Co-Founder, Lead Dev

---

## Welcome to the Team! 🎉

You're now ready to start contributing to the Vecia website. Remember:

- 📚 **Read the docs** before coding
- 🧪 **Test frequently** during development
- 💬 **Ask questions** when stuck
- 🎯 **Follow conventions** for consistency
- 🚀 **Have fun** building something awesome!

**Questions?** Reach out to the team or check `docs/` for more guides.

Happy coding! ✨
