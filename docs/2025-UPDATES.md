# 2025 Best Practices & Critical Updates
**Vecia Website V5 - Modern Development Stack**

**Created**: 2025-10-05
**Purpose**: Document breaking changes and 2025 standards implemented in V5
**Status**: ✅ Applied to production codebase

---

## 🚨 Critical Updates Summary

This document outlines the **key differences** between outdated practices and the 2025 standards we've implemented. **All changes below have been applied to the V5 codebase.**

---

## 1. Tailwind CSS v4 (BREAKING CHANGES)

### ❌ OLD METHOD (Deprecated)
```bash
# Don't use this anymore
npm install @astrojs/tailwind
npx astro add tailwind
```

```js
// astro.config.mjs - OLD WAY (doesn't work in v4)
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()]
});
```

```js
// tailwind.config.mjs - OLD WAY
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#5B8BFF',
      },
    },
  },
};
```

### ✅ NEW METHOD (2025 - Astro 5.2+)

**Installation:**
```bash
npm install tailwindcss @tailwindcss/vite
```

**Astro Config:**
```js
// astro.config.mjs - NEW WAY (Vite plugin)
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  }
});
```

**Global CSS with @theme directive:**
```css
/* src/styles/global.css - NEW WAY */
@import "tailwindcss";

@theme {
  --color-primary: #5B8BFF;
  --color-secondary: #9B59F6;
  --font-heading: "Grotesk", sans-serif;
}
```

**Import in Layout:**
```astro
---
// src/layouts/BaseLayout.astro
import '../styles/global.css';
---
```

### Why This Changed
- **Performance**: CSS-first configuration is faster than JS config parsing
- **Simplicity**: One import, no config file needed
- **Official**: Tailwind v4 + Astro 5.2 native support
- **Future-proof**: This is the recommended path forward

### Migration Checklist
- [x] Uninstall `@astrojs/tailwind` if present
- [x] Install `@tailwindcss/vite` plugin
- [x] Move to `vite.plugins[]` in astro.config.mjs
- [x] Create `src/styles/global.css` with `@import "tailwindcss"`
- [x] Use `@theme` directive for design tokens
- [x] Import global.css in base layout

---

## 2. i18n Translation Type Safety

### ❌ OLD METHOD (No Type Safety)
```ts
// Prone to typos, no autocomplete
const translations = {
  fr: {
    'nav.home': 'Accueil',
    'nav.about': 'À Propos'
  },
  en: {
    'nav.home': 'Home',
    'nav.about': 'About'
  }
};

// No type checking - typos slip through
function t(key: string) {
  return translations[lang][key]; // ❌ No autocomplete
}
```

### ✅ NEW METHOD (2025 - Type-Safe)

```ts
// src/i18n/ui.ts - NEW WAY
export const ui = {
  fr: {
    'nav.home': 'Accueil',
    'nav.about': 'À Propos'
  },
  en: {
    'nav.home': 'Home',
    'nav.about': 'About'
  }
} as const; // ✅ Creates literal types

// Type extraction for autocomplete
export type Language = keyof typeof ui;
export type UIKeys = keyof typeof ui['fr'];
```

```ts
// src/i18n/utils.ts - Type-safe helper
import { ui, type Language, type UIKeys } from './ui';

export function useTranslations(lang: Language) {
  return function t(key: UIKeys): string {
    return ui[lang][key] || ui.fr[key] || key;
  };
}
```

**Usage with Autocomplete:**
```astro
---
import { useTranslations } from '../i18n/utils';

const t = useTranslations('fr');
const title = t('nav.home'); // ✅ Autocomplete + Type checking
const invalid = t('nav.typo'); // ❌ TypeScript error at compile time
---
```

### Why This Changed
- **Type Safety**: Catch missing translations at compile time
- **Autocomplete**: Full IDE support for all translation keys
- **Refactoring**: Rename keys safely across entire codebase
- **DX**: Better developer experience with instant feedback

### Migration Checklist
- [x] Add `as const` to translation objects
- [x] Export `UIKeys` type from translation keys
- [x] Type function parameters with `UIKeys`
- [x] Use TypeScript strict mode

---

## 3. Astro Native i18n (NOT astro-i18next)

### ❌ OLD METHOD (Deprecated Library)
```bash
# ⚠️ This library is ARCHIVED and unmaintained
npm install astro-i18next
```

**Why Not to Use:**
- Last commit: 1+ year ago
- Not compatible with Astro 4+
- No TypeScript support
- No official support

### ✅ NEW METHOD (2025 - Native Astro i18n)

**Configuration:**
```js
// astro.config.mjs
export default defineConfig({
  i18n: {
    locales: ['fr', 'en'],
    defaultLocale: 'fr',
    routing: {
      prefixDefaultLocale: false  // FR at /, EN at /en/
    }
  }
});
```

**File Structure:**
```
src/pages/
├── index.astro          # French homepage (/)
├── about.astro          # French about (/about/)
└── en/
    ├── index.astro      # English homepage (/en/)
    └── about.astro      # English about (/en/about/)
```

**Helper Functions:**
```ts
// Built-in Astro helpers (no external lib needed)
import { getLangFromUrl, getRelativeLocaleUrl } from 'astro:i18n';

const lang = getLangFromUrl(Astro.url); // 'fr' or 'en'
const aboutUrl = getRelativeLocaleUrl('en', 'about'); // '/en/about/'
```

### Why This Changed
- **Official Support**: Built into Astro core
- **Type Safety**: Full TypeScript support
- **Maintained**: Regular updates with Astro releases
- **No Dependencies**: One less package to maintain

### Migration Checklist
- [x] Remove `astro-i18next` if installed
- [x] Configure `i18n` in astro.config.mjs
- [x] Create language-based folder structure
- [x] Use Astro's built-in helpers

---

## 4. Design Tokens with @theme Directive

### ❌ OLD METHOD (CSS Variables in :root)
```css
/* ❌ Tailwind won't detect these */
:root {
  --color-primary: #5B8BFF;
  --color-secondary: #9B59F6;
}

/* Manual utility classes needed */
.bg-primary {
  background-color: var(--color-primary);
}
```

### ✅ NEW METHOD (2025 - @theme Directive)

```css
/* src/styles/global.css */
@import "tailwindcss";

@theme {
  /* ✅ Tailwind auto-generates utilities */
  --color-primary: #5B8BFF;
  --color-secondary: #9B59F6;
  --font-heading: "Grotesk", sans-serif;
  --shadow-vecia: 0 10px 40px rgba(91, 139, 255, 0.15);
}
```

**Usage (Auto-generated Classes):**
```html
<!-- ✅ These classes are auto-generated from @theme -->
<div class="bg-primary text-secondary font-heading shadow-vecia">
  Automatic utility classes!
</div>
```

### Why This Changed
- **Automatic**: Tailwind generates utilities from `@theme` tokens
- **Single Source**: Design tokens define both CSS vars and utilities
- **Consistency**: Can't have mismatched variables and utilities
- **Performance**: Tailwind optimizes what's actually used

### Migration Checklist
- [x] Move CSS variables from `:root` to `@theme` block
- [x] Remove manual utility class definitions
- [x] Use semantic token names (`--color-primary` not `--blue-500`)
- [x] Let Tailwind auto-generate utilities

---

## 5. Alpine.js Version Pinning (Production)

### ❌ OLD METHOD (Unpredictable)
```html
<!-- ❌ Uses latest 3.x - can break on updates -->
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
```

### ✅ NEW METHOD (2025 - Version Pinned)

```html
<!-- ✅ Specific version for production stability -->
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.1/dist/cdn.min.js"></script>
```

### Why This Changed
- **Stability**: Prevent breaking changes from auto-updates
- **Testing**: Know exactly which version you're running
- **Debugging**: Easier to reproduce issues
- **Best Practice**: Pin dependencies in production

### When to Update
- Check Alpine.js release notes
- Test in development first
- Update version number manually
- Deploy after verification

---

## 6. Project Structure (V5 Standard)

```
vecia-website-v5/
├── docs/                           # 📚 All documentation
│   ├── 2025-UPDATES.md            # ← This file
│   ├── IMPLEMENTATION-PLAN.md      # Build roadmap
│   ├── PHASE-CHECKLIST.md          # Pre-phase research protocol
│   ├── ASTRO-I18N-REFERENCE.md     # i18n guide
│   ├── TAILWIND-REFERENCE.md       # Tailwind v4 guide
│   └── ALPINEJS-REFERENCE.md       # Alpine.js patterns
│
├── src/
│   ├── i18n/                       # 🌍 Internationalization
│   │   ├── ui.ts                   # Translations (type-safe)
│   │   ├── utils.ts                # Helper functions
│   │   └── pricing.ts              # Currency config
│   │
│   ├── styles/
│   │   └── global.css              # 🎨 Tailwind v4 + @theme
│   │
│   ├── components/                 # Reusable UI components
│   ├── layouts/                    # Page layouts
│   └── pages/                      # File-based routing
│       ├── index.astro             # FR: /
│       ├── about.astro             # FR: /about/
│       └── en/
│           ├── index.astro         # EN: /en/
│           └── about.astro         # EN: /en/about/
│
├── astro.config.mjs                # ⚙️ Astro + i18n + Tailwind Vite plugin
└── package.json
```

---

## 7. Quick Reference: What Changed & Why

| Technology | Old (Deprecated) | New (2025) | Why Changed |
|------------|------------------|------------|-------------|
| **Tailwind Setup** | `@astrojs/tailwind` integration | `@tailwindcss/vite` plugin | Official v4 method, CSS-first config |
| **Design Tokens** | `:root` CSS variables | `@theme` directive | Auto-generates utilities, single source |
| **i18n Library** | `astro-i18next` (archived) | Native Astro i18n | Official support, type-safe, maintained |
| **Translation Types** | Plain objects | `as const` + type extraction | Type safety, autocomplete, refactoring |
| **Alpine.js CDN** | `@3.x.x` wildcard | `@3.14.1` pinned | Production stability, predictable behavior |
| **Config Location** | `tailwind.config.mjs` | `@theme` in CSS | Simpler, faster, modern approach |

---

## 8. Verification Checklist

Use this to verify your project uses 2025 standards:

### Tailwind v4
- [ ] `@tailwindcss/vite` in package.json (NOT `@astrojs/tailwind`)
- [ ] `vite.plugins[]` in astro.config.mjs contains `tailwindcss()`
- [ ] `src/styles/global.css` has `@import "tailwindcss"`
- [ ] Design tokens in `@theme` block (not `:root`)

### i18n Type Safety
- [ ] Translation objects use `as const`
- [ ] `UIKeys` type exported from ui.ts
- [ ] Helper functions typed with `UIKeys`
- [ ] TypeScript strict mode enabled

### Astro Native i18n
- [ ] `i18n` configured in astro.config.mjs
- [ ] No `astro-i18next` in package.json
- [ ] File structure matches routing strategy
- [ ] Using `astro:i18n` helpers

### Production Stability
- [ ] Alpine.js version pinned (not `3.x.x`)
- [ ] All dependencies have specific versions
- [ ] Type checking passes: `npm run astro check`
- [ ] Build succeeds: `npm run build`

---

## 9. Resources & Further Reading

### Official Documentation (2025)
- [Tailwind v4 Astro Guide](https://tailwindcss.com/docs/guides/astro) - Official setup
- [Astro 5.2 Release](https://astro.build/blog/astro-520/) - Native Tailwind v4 support
- [Astro i18n Docs](https://docs.astro.build/en/guides/internationalization/) - Native i18n
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types) - `as const` usage

### Our Documentation
- `docs/TAILWIND-REFERENCE.md` - Complete Tailwind v4 guide with examples
- `docs/ASTRO-I18N-REFERENCE.md` - i18n patterns and helpers
- `docs/IMPLEMENTATION-PLAN.md` - Full V5 build roadmap

---

## 10. Common Migration Issues

### Issue: Tailwind classes not working
**Cause**: Using old `@astrojs/tailwind` integration
**Solution**:
1. Remove `@astrojs/tailwind` from package.json
2. Install `@tailwindcss/vite`
3. Update astro.config.mjs to use Vite plugin
4. Create `src/styles/global.css` with `@import "tailwindcss"`

### Issue: Translation keys have no autocomplete
**Cause**: Missing `as const` or type exports
**Solution**:
1. Add `as const` after translation object
2. Export `type UIKeys = keyof typeof ui['fr']`
3. Type function parameters with `UIKeys`

### Issue: i18n routes not working
**Cause**: Incorrect file structure or config
**Solution**:
1. Check `prefixDefaultLocale` setting in astro.config.mjs
2. Verify file structure matches routing strategy
3. Ensure `locales` and `defaultLocale` are set

---

**Last Updated**: 2025-10-05
**V5 Implementation**: ✅ Complete (Phases 1-3)
**Next Steps**: Phase 4 - Core Components

**For Questions**: Reference `docs/PHASE-CHECKLIST.md` before each phase
