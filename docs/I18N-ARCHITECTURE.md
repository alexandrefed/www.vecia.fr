# i18n Architecture

**Complete guide to the internationalization (i18n) system for the Vecia website.**

**Last Updated:** January 2025
**Astro Version:** 5.14.1+
**Pattern:** Namespace-based organization (2025 best practice)

---

## Table of Contents

1. [Overview](#overview)
2. [Why Namespace Pattern?](#why-namespace-pattern)
3. [Directory Structure](#directory-structure)
4. [How It Works](#how-it-works)
5. [Adding New Translations](#adding-new-translations)
6. [Adding New Languages](#adding-new-languages)
7. [Migration Notes](#migration-notes)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)

---

## Overview

The Vecia website uses a **namespace-based i18n pattern** to organize translations across multiple files instead of a monolithic translation object. This approach improves maintainability, reduces merge conflicts, and makes it easier to scale as the website grows.

**Supported Languages:**
- 🇫🇷 French (`fr`) - Primary
- 🇬🇧 English (`en`)

**Key Benefits:**
- ✅ **Maintainable** - Each file is ~200-500 lines instead of 1900+
- ✅ **Scalable** - Add new features without touching existing translations
- ✅ **Team-friendly** - Multiple developers can work on different namespaces simultaneously
- ✅ **Type-safe** - TypeScript ensures all translations exist across languages
- ✅ **Backward compatible** - Existing code requires zero changes

---

## Why Namespace Pattern?

### The Problem (Before Refactoring)

**File:** `src/i18n/ui.ts` (1927 lines)

```typescript
export const ui = {
  fr: {
    'meta.title': 'Vecia - Automatisation IA',
    'nav.home': 'ACCUEIL',
    // ... 900+ more lines
    'about.hero.headline': 'Nous transformons...',
    // ... 300+ more lines
    'legal.privacy.title': 'Politique de Confidentialité',
    // ... 400+ more lines
    'blog.meta.title': 'Blog - Vecia',
    // ... 100+ more lines
  },
  en: {
    // Another 900+ lines duplicating the French structure
  }
} as const;
```

**Issues:**
- 🔴 **Hard to navigate** - Finding a specific translation required scrolling through 1900+ lines
- 🔴 **Merge conflicts** - Multiple team members editing the same file
- 🔴 **Duplicate key errors** - Easy to accidentally create duplicate keys (e.g., two `en:` objects)
- 🔴 **Slow to load in editor** - Large file size impacts IDE performance
- 🔴 **No logical grouping** - Homepage, about page, and legal pages mixed together

### The Solution (After Refactoring)

**Files:** Organized by feature namespace

```
src/i18n/
├── ui.ts (56 lines - imports and merges)
├── fr/
│   ├── common.ts (312 lines)
│   ├── about.ts (37 lines)
│   ├── legal.ts (220 lines)
│   └── blog.ts (54 lines)
└── en/
    ├── common.ts (312 lines)
    ├── about.ts (37 lines)
    ├── legal.ts (220 lines)
    └── blog.ts (54 lines)
```

**Benefits:**
- ✅ **Easy to navigate** - Each file corresponds to a website feature
- ✅ **No merge conflicts** - Developers work on separate namespace files
- ✅ **Impossible to duplicate** - Each namespace is a separate module
- ✅ **Fast editor** - Smaller files load instantly
- ✅ **Logical grouping** - Related translations grouped together

---

## Directory Structure

### Current Organization

```
src/i18n/
├── ui.ts                    # Main export file (56 lines)
│   └── Imports and merges all namespaces
│
├── fr/                      # French translations
│   ├── common.ts            # Cross-page elements (~312 lines)
│   │   ├── Meta & SEO
│   │   ├── Navigation
│   │   ├── Footer
│   │   ├── Products Suite
│   │   ├── Products Page
│   │   ├── Journey Section
│   │   └── Case Studies
│   │
│   ├── about.ts             # About page (~37 lines)
│   │   ├── Hero section
│   │   ├── Mission & Values
│   │   ├── Team bios
│   │   └── CTA
│   │
│   ├── legal.ts             # Legal pages (~220 lines)
│   │   ├── Privacy Policy
│   │   ├── Terms of Service
│   │   ├── Cookie Policy
│   │   └── AI Ethics Charter
│   │
│   └── blog.ts              # Blog system (~54 lines)
│       ├── Blog homepage
│       ├── Categories
│       ├── Sidebar (lead magnet)
│       ├── Article page
│       └── Share/social
│
└── en/                      # English translations
    └── (Same structure as fr/)
```

### Namespace Responsibilities

| Namespace | File | What It Contains | When to Edit |
|-----------|------|------------------|--------------|
| **common** | `common.ts` | Shared elements across multiple pages (nav, footer, meta) | Adding new nav items, footer links, or cross-page components |
| **about** | `about.ts` | About page specific content | Updating team bios, mission statement, or values |
| **legal** | `legal.ts` | Legal pages (privacy, terms, cookies, AI ethics) | Updating legal policies |
| **blog** | `blog.ts` | Blog system UI (not article content) | Adding blog categories, sidebar elements, or UI labels |

---

## How It Works

### Step 1: Namespace Files Export Objects

Each namespace file exports a const object with translation keys:

**File:** `src/i18n/fr/common.ts`
```typescript
export const common = {
  // Meta & SEO
  'meta.title': 'Vecia - Agence d\'Automatisation IA',
  'meta.description': 'Vecia fournit des solutions d\'automatisation...',

  // Navigation
  'nav.home': 'ACCUEIL',
  'nav.products': 'PRODUITS',
  'nav.useCases': 'CAS D\'USAGE',

  // ... more translations
} as const;
```

**File:** `src/i18n/en/common.ts`
```typescript
export const common = {
  // Meta & SEO
  'meta.title': 'Vecia - AI Automation Agency',
  'meta.description': 'Vecia provides intelligent automation solutions...',

  // Navigation
  'nav.home': 'HOME',
  'nav.products': 'PRODUCTS',
  'nav.useCases': 'USE CASES',

  // ... more translations
} as const;
```

### Step 2: Main File Imports and Merges

**File:** `src/i18n/ui.ts`
```typescript
/**
 * Main i18n translations file
 * Merges all namespace-based translation files into a single export
 */

// Import French namespaces
import { common as frCommon } from './fr/common';
import { about as frAbout } from './fr/about';
import { legal as frLegal } from './fr/legal';
import { blog as frBlog } from './fr/blog';

// Import English namespaces
import { common as enCommon } from './en/common';
import { about as enAbout } from './en/about';
import { legal as enLegal } from './en/legal';
import { blog as enBlog } from './en/blog';

/**
 * Merged translations by language
 * Each language object combines all feature namespaces using spread operator
 */
export const ui = {
  fr: {
    ...frCommon,
    ...frAbout,
    ...frLegal,
    ...frBlog,
  },
  en: {
    ...enCommon,
    ...enAbout,
    ...enLegal,
    ...enBlog,
  },
} as const;

// Type exports for type safety
export type Language = keyof typeof ui;
export type TranslationKey = keyof typeof ui.fr;
```

**How it works:**
1. Each namespace file exports an object with translation keys
2. Main `ui.ts` imports all namespaces
3. Spread operator (`...`) merges all objects into a single object per language
4. Result: Same structure as before, but organized across multiple files

### Step 3: Usage in Components (Unchanged)

**Components use translations exactly as before:**

```astro
---
// src/components/Navigation.astro
import { ui } from '../i18n/ui';

const lang = Astro.currentLocale || 'fr';
const translations = ui[lang];
---

<nav>
  <a href="/">{translations['nav.home']}</a>
  <a href="/products">{translations['nav.products']}</a>
  <a href="/use-cases">{translations['nav.useCases']}</a>
</nav>
```

**No changes required** - The merged `ui` object has the same structure as before.

---

## Adding New Translations

### Scenario 1: Adding to Existing Namespace

**Example:** Add new navigation item "Blog"

**Step 1:** Identify the correct namespace
- Navigation = `common.ts` (shared across pages)

**Step 2:** Add to French version

**File:** `src/i18n/fr/common.ts`
```typescript
export const common = {
  // ... existing translations

  // Navigation (add to this section)
  'nav.home': 'ACCUEIL',
  'nav.products': 'PRODUITS',
  'nav.blog': 'BLOG',  // ← New translation

  // ... rest of file
} as const;
```

**Step 3:** Add to English version

**File:** `src/i18n/en/common.ts`
```typescript
export const common = {
  // ... existing translations

  // Navigation
  'nav.home': 'HOME',
  'nav.products': 'PRODUCTS',
  'nav.blog': 'BLOG',  // ← New translation

  // ... rest of file
} as const;
```

**Step 4:** Use in component
```astro
<a href="/blog">{translations['nav.blog']}</a>
```

### Scenario 2: Adding New Section to Existing Namespace

**Example:** Add "Testimonials" section to About page

**File:** `src/i18n/fr/about.ts`
```typescript
export const about = {
  // ... existing translations

  // Team section
  'about.team.title': 'L\'équipe Vecia',
  'about.team.subtitle': 'Une équipe passionnée...',

  // Testimonials section (NEW)
  'about.testimonials.title': 'Ce Que Disent Nos Clients',
  'about.testimonials.subtitle': 'Témoignages authentiques',
  'about.testimonials.client1.name': 'Jean Dupont',
  'about.testimonials.client1.company': 'Acme Corp',
  'about.testimonials.client1.quote': 'Vecia a transformé notre productivité...',

  // CTA
  'about.cta.headline': 'Prêt à transformer votre entreprise ?',
} as const;
```

**File:** `src/i18n/en/about.ts` (same additions in English)

**No changes needed in `ui.ts`** - Merging happens automatically.

### Scenario 3: Creating New Namespace

**Example:** Add "Pricing" page with its own namespace

**Step 1:** Create namespace files

```bash
touch src/i18n/fr/pricing.ts
touch src/i18n/en/pricing.ts
```

**Step 2:** Define translations

**File:** `src/i18n/fr/pricing.ts`
```typescript
export const pricing = {
  // Pricing Page
  'pricing.meta.title': 'Tarifs - Vecia',
  'pricing.meta.description': 'Découvrez nos offres d\'automatisation IA...',
  'pricing.hero.title': 'Tarification Simple et Transparente',
  'pricing.plan.starter.name': 'Starter',
  'pricing.plan.starter.price': '499€',
  'pricing.plan.starter.features.1': 'Jusqu\'à 5 automatisations',
  'pricing.plan.starter.features.2': 'Support email',
  'pricing.cta.button': 'Commencer',
} as const;
```

**File:** `src/i18n/en/pricing.ts` (English version)

**Step 3:** Import in main file

**File:** `src/i18n/ui.ts`
```typescript
// Add imports
import { pricing as frPricing } from './fr/pricing';
import { pricing as enPricing } from './en/pricing';

export const ui = {
  fr: {
    ...frCommon,
    ...frAbout,
    ...frLegal,
    ...frBlog,
    ...frPricing,  // ← Add to merge
  },
  en: {
    ...enCommon,
    ...enAbout,
    ...enLegal,
    ...enBlog,
    ...enPricing,  // ← Add to merge
  },
} as const;
```

**Step 4:** Update documentation comment

**File:** `src/i18n/ui.ts` (top comment)
```typescript
/**
 * Structure:
 * - fr/: French translations split by feature
 *   - common.ts: Cross-page elements (meta, nav, footer, suite, products, journey, cases)
 *   - about.ts: About page
 *   - legal.ts: Legal pages (privacy, terms, cookies, AI ethics)
 *   - blog.ts: Blog system
 *   - pricing.ts: Pricing page  ← Add to list
 * - en/: English translations (same structure as French)
 */
```

**Done!** New namespace is available everywhere.

---

## Adding New Languages

**Example:** Add Spanish (`es`) support

### Step 1: Create Language Directory

```bash
mkdir src/i18n/es
```

### Step 2: Copy and Translate Namespace Files

```bash
# Copy French files as templates
cp src/i18n/fr/common.ts src/i18n/es/common.ts
cp src/i18n/fr/about.ts src/i18n/es/about.ts
cp src/i18n/fr/legal.ts src/i18n/es/legal.ts
cp src/i18n/fr/blog.ts src/i18n/es/blog.ts
```

### Step 3: Translate Content

**File:** `src/i18n/es/common.ts`
```typescript
export const common = {
  // Meta & SEO
  'meta.title': 'Vecia - Agencia de Automatización IA',
  'meta.description': 'Vecia proporciona soluciones de automatización...',

  // Navigation
  'nav.home': 'INICIO',
  'nav.products': 'PRODUCTOS',
  'nav.useCases': 'CASOS DE USO',

  // ... translate all keys
} as const;
```

### Step 4: Import in Main File

**File:** `src/i18n/ui.ts`
```typescript
// Add Spanish imports
import { common as esCommon } from './es/common';
import { about as esAbout } from './es/about';
import { legal as esLegal } from './es/legal';
import { blog as esBlog } from './es/blog';

export const ui = {
  fr: {
    ...frCommon,
    ...frAbout,
    ...frLegal,
    ...frBlog,
  },
  en: {
    ...enCommon,
    ...enAbout,
    ...enLegal,
    ...enBlog,
  },
  es: {  // ← New language
    ...esCommon,
    ...esAbout,
    ...esLegal,
    ...esBlog,
  },
} as const;
```

### Step 5: Update Astro Config

**File:** `astro.config.mjs`
```javascript
export default defineConfig({
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en', 'es'],  // ← Add 'es'
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
```

### Step 6: Create Spanish Pages

```bash
mkdir -p src/pages/es
cp src/pages/index.astro src/pages/es/index.astro
cp src/pages/about.astro src/pages/es/about.astro
# ... etc.
```

**Done!** Spanish is now fully supported with the same namespace pattern.

---

## Migration Notes

### From Monolithic to Namespace Pattern

**Date:** January 2025
**Reason:** Fix duplicate key errors, improve maintainability, align with 2025 best practices

**Before:**
- Single `ui.ts` file with 1927 lines
- All translations in one object
- Duplicate `en` key causing issues

**After:**
- Main `ui.ts` (56 lines) + 8 namespace files (4 per language)
- Translations organized by feature
- No duplicate keys possible

**Breaking Changes:**
- ✅ **NONE** - API is identical, only internal structure changed

**Migration Steps (Completed):**
1. ✅ Created `/fr/` and `/en/` directories
2. ✅ Extracted translations into namespace files
3. ✅ Rewrote `ui.ts` to import and merge
4. ✅ Verified type safety with `npm run astro check`
5. ✅ Tested all pages render correctly
6. ✅ Created backup of original file (`ui.ts.backup`)

**Rollback Plan:**
If needed, restore from backup:
```bash
cp src/i18n/ui.ts.backup src/i18n/ui.ts
rm -rf src/i18n/fr src/i18n/en
```

---

## Best Practices

### 1. Naming Conventions

**Translation Keys:**
- Use dot notation: `section.subsection.element`
- Start with page/feature name: `about.hero.title`, `nav.home`
- Be specific but concise: `blog.sidebar.leadMagnet.placeholder`
- Use camelCase for multi-word elements: `leadMagnet` not `lead_magnet`

**Good Examples:**
- ✅ `about.team.alexandre.bio` (clear hierarchy)
- ✅ `nav.products` (short and clear)
- ✅ `legal.privacy.section1.title` (structured)

**Bad Examples:**
- ❌ `text1` (no context)
- ❌ `about_page_hero_title` (use dots, not underscores)
- ❌ `aboutPageHeroTitleTextContent` (too verbose)

### 2. File Organization

**When to create a new namespace:**
- ✅ **Do:** When adding a new page (e.g., `pricing.ts` for pricing page)
- ✅ **Do:** When a section has 50+ translation keys
- ❌ **Don't:** For every small feature (leads to too many files)
- ❌ **Don't:** If translations are used across multiple pages (use `common.ts`)

**Keep namespace files under 500 lines:**
- If a namespace grows beyond 500 lines, consider splitting into sub-namespaces
- Example: `legal.ts` could become `legal/privacy.ts`, `legal/terms.ts`, `legal/cookies.ts`

### 3. Maintaining Consistency

**CRITICAL:** Every key in French MUST exist in English (and vice versa).

**How to verify:**
```bash
# Compare keys between languages
diff <(grep -o "'[^']*':" src/i18n/fr/common.ts | sort) \
     <(grep -o "'[^']*':" src/i18n/en/common.ts | sort)

# No output = perfect match ✅
# Output shows differences = missing translations ❌
```

**Type safety helps too:**
```typescript
// TypeScript will error if keys don't match
export type TranslationKey = keyof typeof ui.fr;

// This ensures all components use valid keys
const t: TranslationKey = 'nav.home';  // ✅ Valid
const t: TranslationKey = 'nav.invalid';  // ❌ Type error
```

### 4. Adding Translations Checklist

When adding new translations, always:
- [ ] Add to French namespace file first
- [ ] Add to English namespace file with same key
- [ ] Verify key naming follows convention
- [ ] Run `npm run astro check` to verify types
- [ ] Test in browser (dev server)
- [ ] Commit both language files together

### 5. Comments in Namespace Files

**Use comments to organize sections:**

```typescript
export const common = {
  // ============================================
  // Meta & SEO
  // ============================================
  'meta.title': 'Vecia - Automatisation IA',
  'meta.description': 'Vecia fournit...',

  // ============================================
  // Navigation
  // ============================================
  'nav.home': 'ACCUEIL',
  'nav.products': 'PRODUITS',

  // ============================================
  // Footer
  // ============================================
  'footer.company': 'Entreprise',
  'footer.about': 'À Propos',
} as const;
```

---

## Troubleshooting

### Issue 1: TypeScript Error "Property does not exist"

**Symptom:**
```
Error: Property 'nav.blog' does not exist on type '{ ... }'
```

**Cause:** Key exists in one language but not the other.

**Fix:**
1. Check which file has the key
2. Add matching key to other language file
3. Run `npm run astro check` to verify

### Issue 2: Translation Shows as `undefined`

**Symptom:** Component displays `undefined` instead of translation text.

**Checklist:**
- [ ] Key exists in namespace file?
- [ ] Key is spelled correctly? (case-sensitive)
- [ ] Namespace is imported in `ui.ts`?
- [ ] Namespace is merged in `ui` object?
- [ ] Dev server was restarted? (if hot reload didn't work)

**Debug:**
```astro
---
import { ui } from '../i18n/ui';
console.log(Object.keys(ui.fr));  // List all available keys
console.log(ui.fr['your.key']);   // Check specific key
---
```

### Issue 3: New Namespace Not Available

**Symptom:** Namespace file created but translations don't appear.

**Checklist:**
- [ ] Namespace file exports object with `export const [name] = { ... }`?
- [ ] Namespace is imported in `ui.ts`?
- [ ] Namespace is spread in language object (`...frNamespace`)?
- [ ] No syntax errors? (`npm run astro check`)

**Example Fix:**

**File:** `src/i18n/ui.ts`
```typescript
// Missing import
import { pricing as frPricing } from './fr/pricing';  // ← Add this

export const ui = {
  fr: {
    ...frCommon,
    ...frPricing,  // ← Add this
  },
} as const;
```

### Issue 4: Duplicate Key Warning

**Symptom:**
```
Duplicate key 'nav.home' in object literal
```

**Cause:** Same key exists in multiple namespace files.

**Fix:** Keys must be unique across ALL namespaces.

**Check for duplicates:**
```bash
# Find duplicate keys across all French files
grep -h "'.*':" src/i18n/fr/*.ts | sort | uniq -d
```

**Solution:** Rename one of the duplicate keys to make it unique.

### Issue 5: Large Number of Translation Keys

**Symptom:** Namespace file growing beyond 500 lines.

**Solution:** Split into sub-namespaces.

**Before:**
```
src/i18n/fr/legal.ts (800 lines)
```

**After:**
```
src/i18n/fr/legal/
├── privacy.ts (250 lines)
├── terms.ts (200 lines)
├── cookies.ts (150 lines)
└── ethics.ts (200 lines)
```

**Update imports:**
```typescript
// Before
import { legal as frLegal } from './fr/legal';

// After
import { privacy as frPrivacy } from './fr/legal/privacy';
import { terms as frTerms } from './fr/legal/terms';
import { cookies as frCookies } from './fr/legal/cookies';
import { ethics as frEthics } from './fr/legal/ethics';

export const ui = {
  fr: {
    ...frPrivacy,
    ...frTerms,
    ...frCookies,
    ...frEthics,
  },
} as const;
```

---

## Reference: Complete File Tree

```
src/i18n/
├── ui.ts (56 lines)
│   /**
│    * Main i18n translations file
│    * Imports all namespaces and merges them into single export
│    */
│
├── fr/ (French translations - 623 lines total)
│   ├── common.ts (312 lines)
│   │   ├── Meta & SEO
│   │   ├── Navigation
│   │   ├── Footer
│   │   ├── Products Suite (3 products: Agentic Workforce, AI Brain, Automation Hub)
│   │   ├── Products Page
│   │   ├── Journey Section
│   │   └── Case Studies
│   │
│   ├── about.ts (37 lines)
│   │   ├── Hero
│   │   ├── Mission & Story
│   │   ├── Values (4 values)
│   │   ├── Stats (4 metrics)
│   │   ├── Team (2 founders)
│   │   └── CTA
│   │
│   ├── legal.ts (220 lines)
│   │   ├── Privacy Policy
│   │   ├── Terms of Service
│   │   ├── Cookie Policy
│   │   └── AI Ethics Charter
│   │
│   └── blog.ts (54 lines)
│       ├── Blog homepage (hero, search, filters, badges, read time)
│       ├── Categories (5 categories)
│       ├── Sidebar (lead magnet, popular posts, social)
│       ├── Article page (breadcrumb, share buttons)
│       ├── Article footer (author bio, CTA, related posts)
│       └── No results state
│
└── en/ (English translations - same structure as French)
    ├── common.ts (312 lines)
    ├── about.ts (37 lines)
    ├── legal.ts (220 lines)
    └── blog.ts (54 lines)
```

**Total:** 1302 lines of translations across 9 files (vs 1927 lines in single file)

---

## Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2025-01-15 | 2.0.0 | Refactored from monolithic to namespace pattern |
| 2025-01-15 | 2.0.1 | Added blog namespace for Phase 8.4 |

---

## Additional Resources

- **Astro i18n Docs:** https://docs.astro.build/en/guides/internationalization/
- **TypeScript const assertions:** https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions
- **Industry i18n patterns:** See `docs/PHASE-CHECKLIST.md` for research sources

**Need help?** Contact the Vecia team or open an issue on GitHub.
