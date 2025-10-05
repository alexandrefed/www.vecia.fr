# Astro i18n (Internationalization) Reference
## Complete Guide for Vecia Website V5

**Source**: Context7 - Astro Official Documentation
**Created**: 2025-10-05
**Purpose**: Quick reference for implementing i18n in Astro

---

## 📋 Table of Contents
1. [Basic Configuration](#basic-configuration)
2. [Routing Options](#routing-options)
3. [Helper Functions](#helper-functions)
4. [Middleware](#middleware)
5. [Best Practices](#best-practices)

---

## Basic Configuration

### Minimal Setup
```js
// astro.config.mjs
import { defineConfig } from "astro/config"

export default defineConfig({
  i18n: {
    locales: ["fr", "en"],
    defaultLocale: "fr"
  }
})
```

### Our Vecia Configuration
```js
// astro.config.mjs
import { defineConfig } from "astro/config"

export default defineConfig({
  i18n: {
    locales: ["fr", "en"],
    defaultLocale: "fr",
    routing: {
      prefixDefaultLocale: false  // FR at /, EN at /en/
    }
  }
})
```

---

## Routing Options

### Option 1: No Prefix for Default (✅ Our Choice)
```js
routing: {
  prefixDefaultLocale: false
}
```
- French pages: `/`, `/about/`, `/blog/`
- English pages: `/en/`, `/en/about/`, `/en/blog/`
- **Benefit**: Cleaner URLs for primary language

### Option 2: Prefix All Languages
```js
routing: {
  prefixDefaultLocale: true
}
```
- French pages: `/fr/`, `/fr/about/`, `/fr/blog/`
- English pages: `/en/`, `/en/about/`, `/en/blog/`
- **Benefit**: Consistent URL structure

### Option 3: Manual Routing
```js
routing: "manual"
```
- Full control over routing logic
- Requires custom middleware
- **Use Case**: Complex routing requirements

---

## Routing Configuration Details

### Redirect to Default Locale
```js
routing: {
  prefixDefaultLocale: false,
  redirectToDefaultLocale: true,  // Redirect / to /fr/ (if prefixed)
  fallbackType: "redirect",       // "redirect" or "rewrite"
}
```

### Fallback Strategy
```js
i18n: {
  locales: ["fr", "en"],
  defaultLocale: "fr",
  fallback: {
    en: "fr"  // If EN page missing, show FR version
  },
  routing: {
    fallbackType: "rewrite"  // Show FR content at EN URL
  }
}
```

---

## Helper Functions

### Import
```js
import {
  getRelativeLocaleUrl,
  getAbsoluteLocaleUrl,
  getLangFromUrl
} from 'astro:i18n';
```

### Get Localized URL
```astro
---
import { getRelativeLocaleUrl } from 'astro:i18n';

const aboutURL = getRelativeLocaleUrl("en", "about");
// Returns: /en/about/
---

<a href={getRelativeLocaleUrl('fr', 'blog')}>Blog</a>
<!-- Output: <a href="/blog">Blog</a> -->
```

### Get Current Language from URL
```astro
---
import { getLangFromUrl } from 'astro:i18n';

const lang = getLangFromUrl(Astro.url);  // 'fr' or 'en'
---
```

### Custom Utility (Our Implementation)
```ts
// src/i18n/utils.ts
export function getLangFromUrl(url: URL): 'fr' | 'en' {
  const [, lang] = url.pathname.split('/');
  if (lang === 'en') return 'en';
  return 'fr';
}

export function getRelativeLocaleUrl(locale: 'fr' | 'en', path: string = '') {
  if (locale === 'fr') return `/${path}`;
  return `/en/${path}`;
}
```

---

## Middleware

### Custom i18n Middleware (Manual Mode)
```js
// src/middleware/index.js
import { defineMiddleware } from "astro:middleware"
import { redirectToDefaultLocale } from "astro:i18n"

export const onRequest = defineMiddleware(async (ctx, next) => {
  if (ctx.url.pathname.startsWith("/about")) {
    return next()
  } else {
    return redirectToDefaultLocale(302)
  }
})
```

### Sequence with Astro's Built-in Middleware
```js
import { defineMiddleware, sequence } from "astro:middleware";
import { middleware } from "astro:i18n";

const customLogic = defineMiddleware(async (ctx, next) => {
  const response = await next();
  // Custom logic here
  return response;
});

export const onRequest = sequence(
  customLogic,
  middleware({
    prefixDefaultLocale: true,
    redirectToDefaultLocale: false
  })
)
```

### Check if Request Has Locale
```js
import { defineMiddleware } from "astro:middleware";
import { requestHasLocale } from "astro:i18n";

export const onRequest = defineMiddleware(async (context, next) => {
  if (requestHasLocale(context)) {
    return next();
  }
  return new Response("Not found", { status: 404 });
})
```

---

## File Structure

### Our Project Structure (prefixDefaultLocale: false)
```
src/pages/
├── index.astro          # French homepage (/)
├── about.astro          # French about (/about/)
├── blog.astro           # French blog (/blog/)
└── en/
    ├── index.astro      # English homepage (/en/)
    ├── about.astro      # English about (/en/about/)
    └── blog.astro       # English blog (/en/blog/)
```

### Alternative Structure (prefixDefaultLocale: true)
```
src/pages/
├── fr/
│   ├── index.astro      # French homepage (/fr/)
│   └── about.astro      # French about (/fr/about/)
└── en/
    ├── index.astro      # English homepage (/en/)
    └── about.astro      # English about (/en/about/)
```

---

## Best Practices

### 1. Use Shared Components
```astro
---
// ✅ GOOD: One component, multiple languages
// src/components/Hero.astro
interface Props {
  headline: string;
  body: string;
}
const { headline, body } = Astro.props;
---
<section>
  <h1>{headline}</h1>
  <p>{body}</p>
</section>
```

```astro
---
// ❌ BAD: Duplicate components per language
// src/components/HeroFR.astro
// src/components/HeroEN.astro
---
```

### 2. Centralize Translations
```ts
// ✅ GOOD: Single source of truth
// src/i18n/ui.ts
export const ui = {
  fr: {
    nav: { about: "À Propos", blog: "Blog" },
    hero: { headline: "Bienvenue" }
  },
  en: {
    nav: { about: "About", blog: "Blog" },
    hero: { headline: "Welcome" }
  }
} as const;
```

### 3. Type-Safe Translations
```ts
// src/i18n/utils.ts
import { ui, type UIKeys } from './ui';

export function useTranslations(lang: 'fr' | 'en') {
  return function t(key: UIKeys) {
    return ui[lang][key] || ui['fr'][key];
  };
}
```

Usage:
```astro
---
import { useTranslations } from '../i18n/utils';

const t = useTranslations('fr');
// TypeScript will autocomplete and error if key is invalid
---
<h1>{t('hero').headline}</h1>
```

### 4. SEO: Hreflang Tags
```astro
---
// src/layouts/BaseLayout.astro
const { lang } = Astro.props;
const canonicalURL = new URL(Astro.url.pathname, Astro.site);
---
<head>
  <link rel="canonical" href={canonicalURL}>
  <link rel="alternate" hreflang="fr" href="/">
  <link rel="alternate" hreflang="en" href="/en/">
  <link rel="alternate" hreflang="x-default" href="/">
</head>
```

### 5. Language Switcher
```astro
---
const currentLang = getLangFromUrl(Astro.url);
const currentPath = Astro.url.pathname.replace(/^\/(en\/)?/, '');
---
<nav>
  <a href={`/${currentPath}`}
     class={currentLang === 'fr' ? 'active' : ''}>
    🇫🇷 Français
  </a>
  <a href={`/en/${currentPath}`}
     class={currentLang === 'en' ? 'active' : ''}>
    🇬🇧 English
  </a>
</nav>
```

---

## Common Patterns

### Pattern 1: Page with i18n
```astro
---
// src/pages/index.astro
import BaseLayout from '../layouts/BaseLayout.astro';
import { useTranslations } from '../i18n/utils';

const t = useTranslations('fr');
---
<BaseLayout title={t('meta').title} lang="fr">
  <h1>{t('hero').headline}</h1>
</BaseLayout>
```

### Pattern 2: Dynamic Routes with i18n
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
---
```

### Pattern 3: API Routes with Locale Detection
```ts
// src/pages/api/data.json.ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  const acceptLanguage = request.headers.get('accept-language');
  const lang = acceptLanguage?.startsWith('fr') ? 'fr' : 'en';

  const data = {
    message: lang === 'fr' ? 'Bonjour' : 'Hello'
  };

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
};
```

---

## Troubleshooting

### Error: Missing Index for Internationalization
**Problem**: Astro can't find the root index page.
**Solution**: Ensure `src/pages/index.astro` exists (even if `prefixDefaultLocale: true`)

### Error: i18n Not Enabled
**Problem**: Using i18n helpers without configuration.
**Solution**: Add `i18n` object to `astro.config.mjs`

### Language Not Switching
**Problem**: Same content shown for all languages.
**Solution**:
1. Check file structure matches routing configuration
2. Verify translation files are imported correctly
3. Ensure `lang` prop is passed correctly

---

## Resources

- **Astro i18n Docs**: https://docs.astro.build/en/guides/internationalization/
- **Astro i18n API**: https://docs.astro.build/en/reference/modules/astro-i18n/
- **Our Implementation**: See `src/i18n/` folder

---

**Last Updated**: 2025-10-05
**Status**: Reference for Vecia V5 implementation
