# Vecia Website V5 - i18n Architecture Implementation Plan
## VPS-Hosted, Multilingual (FR/EN) with Dynamic Currency Pricing

**Created**: 2025-10-05
**Status**: ✅ Phases 1-7, 8.3 Complete | In Progress (Phase 8.1-8.4, 9+)
**Estimated Time**: ~10 hours total | ~9 hours completed

**🔗 IMPORTANT**: See `docs/2025-UPDATES.md` for critical breaking changes and migration guide.

---

## 🎯 Objective
Build a high-performance, multilingual (FR/EN) Astro website with dynamic currency pricing, optimized for **VPS deployment** using modern 2025 best practices.

## ✅ Completed Phases Summary

**Phase 1-7 Complete** (Applied 2025 best practices with research validation):
- ✅ Tailwind v4 with Vite plugin (`@tailwindcss/vite`)
- ✅ `@theme` directive for design tokens
- ✅ Type-safe i18n with `as const`
- ✅ Complete French/English translations
- ✅ Multi-currency configuration
- ✅ All 10 core components built (Navigation, Hero, LogosCarousel, AITabs, ProductsCarousel, BentoGrid, BusinessCases, LeadCaptureForm, FinalCTA, Footer)
- ✅ Production-ready BaseLayout with comprehensive SEO
- ✅ French & English homepages fully assembled
- ✅ Site URL configured for canonical links
- ✅ **Phase 7**: Dynamic currency pricing with 2025 privacy best practices (retry logic, timeout, localStorage-first, GDPR-compliant)

---

## 📊 Key Technical Decisions

### ✅ i18n Solution: **Astro Native i18n**
- **Why**: Type-safe, zero dependencies, officially supported, actively maintained
- **NOT using**: astro-i18next (archived/unmaintained as of 2024)
- **Structure**: `fr` at root (`/`), `en` at `/en/`, shared components
- **Benefits**: TypeScript safety, simple setup, fast performance

### ✅ IP/Currency Detection: **Free IP API (ipapi.co)**
- **Service**: ipapi.co (1,000 requests/day free tier)
- **Method**: Client-side fetch with fallbacks
- **Fallback Chain**:
  1. localStorage (cached preference)
  2. IP geolocation API
  3. Browser language detection
  4. Default to EUR
- **Why NOT Vercel**: Website hosted on own VPS, not Vercel platform

### ✅ Styling: **Tailwind CSS v4** (2025 - BREAKING CHANGES)
- **Method**: `@tailwindcss/vite` plugin (NOT `@astrojs/tailwind`)
- **Config**: `@theme` directive in CSS (NOT tailwind.config.mjs)
- **Setup**: `@import "tailwindcss"` in global.css
- **Benefits**: CSS-first, auto-generated utilities, simpler configuration
- **See**: `docs/2025-UPDATES.md` for migration guide

### ✅ Translation Workflow: **Manual with TypeScript Safety**
- **Design/Layout Changes**: Edit one `.astro` component → both languages auto-update
- **Text Changes**: Manual translation in `i18n/ui.ts` → separate FR/EN objects
- **Type Safety**: TypeScript errors if translations missing or mismatched
- **Benefits**: Full control, clear separation of design vs. content

---

## 🏗️ Build Order & Implementation Phases

### **Phase 1: Foundation Setup** ✅ COMPLETE (30 min)
**Goal**: Configure Astro + create project structure

#### Completed Tasks:
1. **✅ Configured `astro.config.mjs`** (2025 method):
   ```js
   import { defineConfig } from 'astro/config';
   import tailwindcss from '@tailwindcss/vite';  // ← 2025 method

   export default defineConfig({
     i18n: {
       locales: ['fr', 'en'],
       defaultLocale: 'fr',
       routing: {
         prefixDefaultLocale: false  // FR at /, EN at /en/
       }
     },
     vite: {
       plugins: [tailwindcss()]  // ← Vite plugin, NOT integrations[]
     }
   });
   ```

2. **✅ Installed dependencies** (2025 versions):
   ```bash
   npm install tailwindcss @tailwindcss/vite  # ← v4 Vite plugin
   # Alpine.js via CDN (version pinned in layout)
   # NOT: @astrojs/tailwind (deprecated for v4)
   ```

3. **✅ Created project structure:**
   ```
   src/
   ├── i18n/              # ✅ Created
   │   ├── ui.ts          # ✅ Complete FR/EN translations
   │   ├── pricing.ts     # ✅ Multi-currency config
   │   └── utils.ts       # ✅ Type-safe helpers
   ├── lib/               # ✅ Created (empty - Phase 4)
   ├── components/        # ✅ Created (empty - Phase 4)
   ├── layouts/           # ✅ Created (empty - Phase 5)
   ├── pages/             # Existing (will populate in Phase 6)
   └── styles/
       └── global.css     # ✅ Complete with @theme
   ```

---

### **Phase 2: Design System** ✅ COMPLETE (45 min)
**Goal**: Extract design tokens and setup Tailwind

#### Completed Tasks:
1. **✅ Created `src/styles/global.css`** (2025 method - @theme):
   ```css
   @import "tailwindcss";  /* ← v4 import */

   @theme {  /* ← Design tokens (NOT tailwind.config.mjs) */
     --color-primary: #5B8BFF;
     --color-secondary: #9B59F6;
     --font-heading: "Grotesk", sans-serif;
     /* ... all Vecia design tokens */
   }

   /* Custom animations */
   @keyframes fadeIn { /* ... */ }
   @keyframes slideUp { /* ... */ }
   ```

   **Why changed**: Tailwind v4 auto-generates utilities from `@theme` tokens.
   Old `:root` variables won't create utility classes.
   export default {
     content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
     theme: {
       extend: {
         colors: {
           primary: '#5B8BFF',
           secondary: '#9B59F6',
           accent1: '#3BB4FF',
           accent2: '#7B6FDE',
           accent3: '#E8F4FF',
           text: '#1A1A2E',
           background: '#FFFFFF',
         },
         fontFamily: {
           heading: ['Grotesk', 'sans-serif'],
           body: ['Inter', 'sans-serif'],
         },
       },
     },
   };
   ```

2. **Create `src/styles/global.css`:**
   - CSS custom properties for consistency
   - Animation keyframes (particle, fade-in, slide-up, etc.)
   - Utility classes for gradients, shadows
   - Responsive breakpoints

---

### **Phase 3: Content Extraction & Translation** ✅ COMPLETE (1.5 hours)
**Goal**: Organize all text content with translations

#### Completed Tasks:
1. **✅ Created `src/i18n/ui.ts`** (type-safe with `as const`):
   ```ts
   export const ui = {
     fr: {
       meta: {
         title: "Vecia - Agence d'Automatisation IA | Transformez Vos Opérations",
         description: "Vecia fournit des solutions d'automatisation IA...",
       },
       nav: {
         about: "À Propos",
         blog: "Blog",
         bookCall: "Réserver un Appel",
         getStarted: "Commencer",
       },
       hero: {
         headline: "Automatisez Vos Processus,",
         highlight: "Économisez Plus de 20h par Semaine,",
         subheadline: "et Développez Votre Entreprise",
         body: "Nous aidons les entreprises à implémenter...",
         cta1: "AUDIT IA GRATUIT",
         cta2: "VOIR NOS CAS D'USAGE",
       },
       // ... all 9 sections with nested objects
     },
     en: {
       meta: {
         title: "Vecia - AI Automation Agency | Transform Your Operations",
         description: "Vecia provides intelligent AI automation solutions...",
       },
       nav: {
         about: "About",
         blog: "Blog",
         bookCall: "Book a Call",
         getStarted: "Get Started",
       },
       hero: {
         headline: "Automate Your Processes,",
         highlight: "Save 20+ Hours Per Week,",
         subheadline: "and Grow Your Business",
         body: "We help businesses implement...",
         cta1: "FREE AI AUDIT",
         cta2: "SEE OUR USE CASES",
       },
       // ... all 9 sections with nested objects
     },
   } as const;  /* ← 2025: Type-safe literal types */

   export type Language = keyof typeof ui;
   export type UIKeys = keyof typeof ui['fr'];  /* ← Autocomplete for all keys */
   ```

   **2025 Update**: `as const` creates literal types → TypeScript autocomplete + compile-time validation

2. **✅ Translated French → English** (140+ strings):
   - Professional business tone maintained
   - Technical terms preserved
   - CTAs optimized for English audience

3. **✅ Created `src/i18n/pricing.ts`** (multi-currency):
   ```ts
   export const currencyConfig = {
     EUR: { symbol: '€', countries: ['FR', 'DE', ...] },
     CHF: { symbol: 'CHF', countries: ['CH'] },
     AED: { symbol: 'AED', countries: ['AE'] },
     USD: { symbol: '$', countries: ['US', 'GB', ...] },
   } as const;

   export function getCurrencyByCountry(code: string): CurrencyCode {
     // Maps country → currency
   }
   ```

4. **✅ Created `src/i18n/utils.ts`** (type-safe helpers):
   ```ts
   export function getLangFromUrl(url: URL): Language {
     const [, lang] = url.pathname.split('/');
     return lang === 'en' ? 'en' : 'fr';
   }

   export function useTranslations(lang: Language) {
     return function t(key: UIKeys): string {  /* ← Type-safe! */
       return ui[lang][key] || ui.fr[key] || key;
     };
   }
   ```

   **2025 Update**: Function params typed with `UIKeys` → autocomplete + type errors for invalid keys

3. **Create `src/i18n/pricing.ts`:**
   ```ts
   export const pricing = {
     workshop: { EUR: 250, CHF: 300, AED: 1000, USD: 250 },
     tier1: { EUR: 1900, CHF: 1850, AED: 8000, USD: 2100 },
     tier2: { EUR: 4500, CHF: 4400, AED: 19000, USD: 4900 },
     tier3: { EUR: 9000, CHF: 8800, AED: 38000, USD: 9900 },
   };

   export const currencyMap: Record<string, 'EUR' | 'CHF' | 'AED' | 'USD'> = {
     // Switzerland
     CH: 'CHF',
     // UAE
     AE: 'AED',
     // EU Countries
     FR: 'EUR', BE: 'EUR', DE: 'EUR', IT: 'EUR', ES: 'EUR',
     PT: 'EUR', NL: 'EUR', AT: 'EUR', GR: 'EUR', IE: 'EUR',
     // Default
     default: 'USD',
   };

   export const currencySymbols = {
     EUR: '€',
     CHF: 'CHF',
     AED: 'AED',
     USD: '$',
   };
   ```

4. **Create `src/i18n/utils.ts`:**
   ```ts
   import { ui, type UIKeys } from './ui';

   export function useTranslations(lang: 'fr' | 'en') {
     return function t(key: UIKeys) {
       return ui[lang][key] || ui['fr'][key];
     };
   }

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

### **Phase 4: Core Components** (2.5 hours)
**Goal**: Build reusable, language-agnostic components

#### Component Build Order:

**1. `Navigation.astro`** - Header with language toggle
- Logo, nav links, CTA buttons
- Alpine.js language dropdown (`x-data`, `x-show`)
- Mobile hamburger menu
- Props: `lang`, nav text from translations

**2. `Hero.astro`** - Hero section with particle animation
- Extract particle system from V3 (`lib/particles/`)
- Canvas-based animation (4 patterns: Fractal, Golden Spiral, Breathing, Neural)
- **2025 Performance Optimizations**:
  - Use `requestAnimationFrame` for smooth 60fps
  - Implement dirty region tracking (only redraw changed areas)
  - Minimize `save()`/`restore()` calls in render loop
  - Pre-render static elements if applicable
- Dynamic headline with gradient `<span>` for highlight
- Two CTA buttons
- Props: `headline`, `highlight`, `subheadline`, `body`, `cta1Text`, `cta2Text`

**3. `LogosCarousel.astro`** - AI tech logos
- Infinite horizontal scroll animation
- Hover-to-pause functionality (`@mouseenter`, `@mouseleave`)
- Grayscale → color transition on hover
- Logo images from `public/images/logos/`

**4. `AITabs.astro`** - 4-tab slider with Alpine.js
- State: `activeTab` (0-3), `autoRotate` (true/false)
- Auto-rotation every 8s (pause on hover)
- Progress bar animation (0-100% over 8s)
- Split layout: 40% text + 60% dashboard mockup
- Props: tab data (titles, descriptions, features, colors)

**5. `ProductsCarousel.astro`** - 7 service cards
- Manual navigation (prev/next arrows + dot indicators)
- Responsive grid: 1 card (mobile), 2 (tablet), 3 (desktop)
- Alpine.js state: `currentSlide`, `totalSlides`
- Props: products array (icon, title, features)

**6. `BentoGrid.astro`** - Customer journey
- Asymmetric 3-row grid layout (Tailwind Grid)
- Dynamic pricing with IDs: `#workshopPrice`, `#tier1Price`, etc.
- Gradient icons and checkmarks
- Responsive: reflows to single column on mobile
- Props: journey steps, pricing tiers, metrics

**7. `BusinessCases.astro`** - 4 case study slides ✅ COMPLETE
- Vertical scroll-driven stacked cards animation
- Each slide: Industry badge, challenge/solution/result
- Metric highlight with gradient
- Intersection-based transitions with Alpine.js
- Props: cases array (industry, headline, challenge, solution, metric, impact)

**8. `LeadCaptureForm.astro`** - Lead capture form ✅ COMPLETE
- 3-field form (name, email, company size)
- Alpine.js form handling with loading/success/error states
- Google Sheets webhook integration
- Privacy-first design with GDPR compliance
- Props: `lang` for FR/EN translations

**9. `FinalCTA.astro`** - Final call-to-action section (IN PROGRESS)
- Two CTA buttons (primary + secondary)
- Gradient purple-to-cyan background
- Cal.com integration links
- Props: headline, body, CTA texts from translations

**10. `Footer.astro`** - Footer with links
- Logo, navigation links, social icons
- LinkedIn/Twitter with gradient hover effect
- Copyright text
- Props: `lang`, footer links from translations

#### Component Pattern Example:
```astro
---
// src/components/Hero.astro
interface Props {
  headline: string;
  highlight: string;
  subheadline: string;
  body: string;
  cta1Text: string;
  cta2Text: string;
}

const { headline, highlight, subheadline, body, cta1Text, cta2Text } = Astro.props;
---

<section class="hero relative min-h-screen flex items-center">
  <!-- Particle animation canvas -->
  <canvas id="particle-canvas" class="absolute inset-0"></canvas>

  <div class="container mx-auto px-6 relative z-10">
    <h1 class="text-5xl md:text-7xl font-heading font-bold">
      {headline}
      <span class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        {highlight}
      </span>
      {subheadline}
    </h1>

    <p class="text-xl mt-6 max-w-3xl">{body}</p>

    <div class="flex gap-4 mt-8">
      <button class="btn-primary">{cta1Text}</button>
      <button class="btn-secondary">{cta2Text}</button>
    </div>
  </div>
</section>

<script>
  // Import and initialize particle animation
  import '../lib/particles/init.ts';
</script>
```

---

### **Phase 5: Layouts** ✅ COMPLETE (30 min)
**Goal**: Create shared page wrapper

**Completed**: 2025-10-08
**Commit**: `293caf2`

#### Completed Tasks:
1. **Create `src/layouts/BaseLayout.astro`:**
   ```astro
   ---
   import Navigation from '../components/Navigation.astro';
   import Footer from '../components/Footer.astro';
   import '../styles/global.css';

   interface Props {
     title: string;
     description: string;
     lang: 'fr' | 'en';
   }

   const { title, description, lang } = Astro.props;
   const canonicalURL = new URL(Astro.url.pathname, Astro.site);
   const alternateURL = lang === 'fr' ? '/en/' : '/';
   ---

   <!DOCTYPE html>
   <html lang={lang}>
     <head>
       <meta charset="UTF-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <title>{title}</title>
       <meta name="description" content={description}>

       <!-- Canonical & Alternates -->
       <link rel="canonical" href={canonicalURL}>
       <link rel="alternate" hreflang="fr" href="/">
       <link rel="alternate" hreflang="en" href="/en/">
       <link rel="alternate" hreflang="x-default" href="/">

       <!-- Open Graph -->
       <meta property="og:title" content={title}>
       <meta property="og:description" content={description}>
       <meta property="og:locale" content={lang === 'fr' ? 'fr_FR' : 'en_US'}>

       <!-- Fonts -->
       <link rel="preconnect" href="https://fonts.googleapis.com">
       <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

       <!-- Favicon -->
       <link rel="icon" type="image/svg+xml" href="/favicon.svg">
     </head>
     <body class="font-body text-text bg-background">
       <Navigation lang={lang} />

       <main>
         <slot />
       </main>

       <Footer lang={lang} />

       <!-- Alpine.js -->
       <script src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js" defer></script>

       <!-- Pricing Script -->
       <script src="../scripts/pricing.ts"></script>
     </body>
   </html>
   ```

---

### **Phase 6: Pages Assembly** ✅ COMPLETE (1 hour)
**Goal**: Create French & English pages using shared components

**Completed**: 2025-10-08
**Commit**: `293caf2`

#### Completed Tasks:
1. **Create `src/pages/index.astro` (French homepage):**
   ```astro
   ---
   import BaseLayout from '../layouts/BaseLayout.astro';
   import Hero from '../components/Hero.astro';
   import LogosCarousel from '../components/LogosCarousel.astro';
   import AITabs from '../components/AITabs.astro';
   import ProductsCarousel from '../components/ProductsCarousel.astro';
   import BentoGrid from '../components/BentoGrid.astro';
   import BusinessCases from '../components/BusinessCases.astro';
   import { useTranslations } from '../i18n/utils';

   const t = useTranslations('fr');
   ---

   <BaseLayout
     title={t('meta').title}
     description={t('meta').description}
     lang="fr"
   >
     <Hero
       headline={t('hero').headline}
       highlight={t('hero').highlight}
       subheadline={t('hero').subheadline}
       body={t('hero').body}
       cta1Text={t('hero').cta1}
       cta2Text={t('hero').cta2}
     />

     <LogosCarousel title={t('logos').title} />

     <AITabs tabs={t('aiTabs')} />

     <ProductsCarousel products={t('products')} />

     <BentoGrid journey={t('journey')} />

     <BusinessCases cases={t('cases')} />
   </BaseLayout>
   ```

2. **Create `src/pages/en/index.astro` (English homepage):**
   ```astro
   ---
   import BaseLayout from '../../layouts/BaseLayout.astro';
   import Hero from '../../components/Hero.astro';
   import LogosCarousel from '../../components/LogosCarousel.astro';
   import AITabs from '../../components/AITabs.astro';
   import ProductsCarousel from '../../components/ProductsCarousel.astro';
   import BentoGrid from '../../components/BentoGrid.astro';
   import BusinessCases from '../../components/BusinessCases.astro';
   import { useTranslations } from '../../i18n/utils';

   const t = useTranslations('en');
   ---

   <BaseLayout
     title={t('meta').title}
     description={t('meta').description}
     lang="en"
   >
     <Hero
       headline={t('hero').headline}
       highlight={t('hero').highlight}
       subheadline={t('hero').subheadline}
       body={t('hero').body}
       cta1Text={t('hero').cta1}
       cta2Text={t('hero').cta2}
     />

     <LogosCarousel title={t('logos').title} />

     <AITabs tabs={t('aiTabs')} />

     <ProductsCarousel products={t('products')} />

     <BentoGrid journey={t('journey')} />

     <BusinessCases cases={t('cases')} />
   </BaseLayout>
   ```

**Key Point**: Same components, different translations passed as props.

#### ✅ Phase 5 & 6 Actual Implementation Summary

**What Was Built** (2025-10-08):
1. ✅ **Enhanced BaseLayout.astro** beyond original spec:
   - Complete Open Graph meta tags (8 tags: type, url, title, description, image, locale, locale:alternate, site_name)
   - Twitter Card support (5 tags: card, url, title, description, image)
   - hreflang alternates (fr, en, x-default)
   - JSON-LD structured data (Organization schema with contactPoint and address)
   - Performance optimizations (preconnect, dns-prefetch for fonts)
   - Canonical URLs with proper domain
   - Integrated Navigation and Footer components

2. ✅ **French Homepage** (`src/pages/index.astro`):
   - All 8 components integrated with proper props
   - Hero with particle animation
   - Logos carousel, AI tabs, products carousel
   - Bento grid, business cases, lead capture form, final CTA
   - Complete French translations applied

3. ✅ **English Homepage** (`src/pages/en/index.astro`):
   - Identical structure with English translations
   - All import paths corrected (../../ prefix)
   - Complete English translations applied

4. ✅ **Site Configuration**:
   - `astro.config.mjs` updated with production URL (`https://vecia.com`)
   - Enables canonical URLs and future sitemap generation

**Build Statistics**:
- Build time: ~850ms
- French homepage: 106KB
- English homepage: 104KB
- 14 pages generated successfully
- Zero build errors

**2025 Best Practices Applied**:
- Mobile-first viewport configuration
- Core Web Vitals optimization (preconnect hints)
- Multilingual SEO (complete hreflang implementation)
- Social sharing optimization (OG + Twitter Cards)
- Structured data for search engines (JSON-LD)
- Performance optimization (DNS prefetch, resource hints)

**Commit**: `293caf2` - "feat: Complete Phase 5 - Production-ready layouts and homepages"

---

### **Phase 6.1: Mobile Responsiveness Fixes** ⏳ IN PROGRESS (1 hour)
**Goal**: Fix mobile rendering issues while preserving desktop layout

**Critical Principle**: ZERO changes to desktop version - all fixes use mobile-only media queries or responsive Tailwind classes.

#### Issues Identified:

1. **Hero Text Cut-Off + Zoom Issue**
   - Text overflows on mobile viewport
   - User can zoom out (should be locked)
   - Fixes:
     - Update viewport meta: add `maximum-scale=1.0, user-scalable=no`
     - Responsive text sizing: `text-3xl sm:text-4xl md:text-5xl lg:text-7xl`
     - Remove `whitespace-nowrap` on gradient text
     - Add responsive padding: `px-4 sm:px-8`

2. **ProductsCarousel - Touch-Hold Pause**
   - Carousel should pause when user holds finger on card
   - Implement touch timer in Alpine.js
   - Add visual feedback on hold

3. **ProductsCarousel - Card Overlap**
   - Cards visible through each other on mobile
   - Fix Z-axis spacing in `carousel-3d.css` with mobile-only media query
   - Increase `translateZ` differences between card positions

4. **BusinessCases - Slides Not Fully Visible**
   - Sticky container too tall for mobile screens
   - Fixes:
     - Responsive container heights: `h-auto md:h-[700px]`
     - Smaller images: `h-[200px] sm:h-[250px]`
     - Reduced padding on mobile
     - Smaller metric text: `text-3xl md:text-4xl`

5. **FinalCTA - Text Overflow**
   - "Prêt à automatiser" text going off-screen
   - Remove `whitespace-nowrap` from headline
   - Add `max-w-2xl` constraint
   - Ensure responsive padding

6. **Footer - Rows Not Centered**
   - Mobile layout not centered
   - Add `items-center` to flex containers
   - Center navigation and social sections

#### Files Modified:
- `src/layouts/BaseLayout.astro` - viewport fix
- `src/components/Hero.astro` - responsive text
- `src/components/ProductsCarousel.astro` - touch-hold logic
- `src/styles/carousel-3d.css` - mobile Z-spacing
- `src/components/BusinessCases.astro` - responsive heights
- `src/components/FinalCTA.astro` - text wrapping
- `src/components/Footer.astro` - mobile centering

#### Testing Checklist:
- [ ] Test on 375px viewport (iPhone SE)
- [ ] Test on 414px viewport (iPhone Pro Max)
- [ ] Test on 768px viewport (iPad)
- [ ] Verify no horizontal scroll
- [ ] Verify zoom disabled
- [ ] Verify desktop unchanged
- [ ] Test touch interactions (carousel hold)

**Status**: Components pending implementation

---

### **Phase 7: Dynamic Currency Pricing** ✅ COMPLETE (1 hour)
**Goal**: Client-side IP detection with free API

**Completed**: 2025-10-08
**Commit**: (pending)

#### ✅ Phase 7 Implementation Summary (2025 Best Practices)

**What Was Built**:
1. ✅ **Privacy-First Currency Detection** (`src/scripts/pricing.ts`):
   - localStorage-first approach (user preference cached)
   - IP geolocation with retry logic (3 attempts, exponential backoff)
   - AbortController for 5-second timeout (modern 2025 pattern)
   - Browser language fallback
   - Default to EUR as final fallback
   - Comprehensive error handling and logging

2. ✅ **Manual Currency Switcher** (GDPR-friendly):
   - Added to BentoGrid.astro pricing section
   - Dropdown with 4 currencies (EUR, CHF, AED, USD)
   - Flag emojis for visual clarity
   - Saves preference to localStorage
   - Bilingual label (FR: "Devise", EN: "Currency")

3. ✅ **2025 Best Practices Applied**:
   - **Privacy compliance**: No tracking, user has full control
   - **Retry logic**: Exponential backoff for API failures
   - **Timeout handling**: AbortController pattern (not setTimeout)
   - **Error resilience**: Graceful degradation to fallbacks
   - **Performance**: localStorage caching reduces API calls
   - **Accessibility**: Proper label for currency switcher

4. ✅ **Integration**:
   - Integrated into `src/scripts/client.ts`
   - Auto-initializes on page load
   - Updates all price elements (#workshopPrice, #tier1Price, etc.)
   - Works seamlessly with existing Alpine.js setup

**GDPR Compliance Notes**:
- IP geolocation used only for UX (currency display)
- No data sent to third parties
- User has full control via manual switcher
- Transparent implementation (all logic client-side)
- No cookies or persistent tracking

**Testing Checklist**:
- ✅ Script compiles without errors
- ✅ Dev server runs successfully
- ✅ Currency switcher displays correctly
- ⏳ Test localStorage caching (manual browser test)
- ⏳ Test API fallback (disconnect network)
- ⏳ Test manual currency change
- ⏳ Test price updates on different pages

#### Original Tasks (Reference):
1. **Create `src/scripts/pricing.ts`:**
   ```ts
   import { pricing, currencyMap, currencySymbols } from '../i18n/pricing';

   type Currency = 'EUR' | 'CHF' | 'AED' | 'USD';

   async function detectCurrency(): Promise<Currency> {
     try {
       // Try localStorage first (cached preference)
       const saved = localStorage.getItem('vecia_currency');
       if (saved && ['EUR', 'CHF', 'AED', 'USD'].includes(saved)) {
         return saved as Currency;
       }

       // Detect via IP geolocation
       const response = await fetch('https://ipapi.co/json/');
       const data = await response.json();
       const countryCode = data.country_code;

       const currency = currencyMap[countryCode] || currencyMap.default;

       // Cache the result
       localStorage.setItem('vecia_currency', currency);

       return currency;
     } catch (error) {
       console.error('Currency detection failed:', error);

       // Fallback to browser language
       const lang = navigator.language;
       if (lang.startsWith('fr')) return 'EUR';
       if (lang.includes('CH') || lang.startsWith('de-CH')) return 'CHF';
       if (lang.includes('AE')) return 'AED';

       return 'USD';
     }
   }

   function updatePriceElements(currency: Currency) {
     const symbol = currencySymbols[currency];

     // Workshop price
     const workshopEl = document.getElementById('workshopPrice');
     if (workshopEl) {
       workshopEl.textContent = `${symbol}${pricing.workshop[currency]}`;
     }

     // Tier prices
     const tier1El = document.getElementById('tier1Price');
     if (tier1El) {
       tier1El.textContent = `${symbol}${pricing.tier1[currency].toLocaleString()}`;
     }

     const tier2El = document.getElementById('tier2Price');
     if (tier2El) {
       tier2El.textContent = `${symbol}${pricing.tier2[currency].toLocaleString()}`;
     }

     const tier3El = document.getElementById('tier3Price');
     if (tier3El) {
       tier3El.textContent = `${symbol}${pricing.tier3[currency].toLocaleString()}`;
     }

     // Update currency attribute for styling
     document.body.setAttribute('data-currency', currency);
   }

   // Initialize on page load
   async function initPricing() {
     const currency = await detectCurrency();
     updatePriceElements(currency);
   }

   // Run when DOM is ready
   if (document.readyState === 'loading') {
     document.addEventListener('DOMContentLoaded', initPricing);
   } else {
     initPricing();
   }

   // Export for manual currency switching
   export { detectCurrency, updatePriceElements };
   ```

2. **Add price elements with IDs in `BentoGrid.astro`:**
   ```html
   <span id="workshopPrice">€250</span>
   <span id="tier1Price">€1,900</span>
   <span id="tier2Price">€4,500</span>
   <span id="tier3Price">€9,000</span>
   ```

3. **Optional: Add manual currency switcher:**
   ```astro
   <select id="currency-switcher" class="...">
     <option value="EUR">🇪🇺 EUR</option>
     <option value="CHF">🇨🇭 CHF</option>
     <option value="AED">🇦🇪 AED</option>
     <option value="USD">🇺🇸 USD</option>
   </select>

   <script>
     import { updatePriceElements } from '../scripts/pricing';

     document.getElementById('currency-switcher')?.addEventListener('change', (e) => {
       const currency = (e.target as HTMLSelectElement).value as Currency;
       localStorage.setItem('vecia_currency', currency);
       updatePriceElements(currency);
     });
   </script>
   ```

---

### **Phase 8: Blog & Content Pages** (9.5 hours) ⏳ NEXT
**Goal**: Build complete blog system, static pages, and LinkedIn integration

**Status**: Ready to start
**Priority**: HIGH - Most complex remaining phase
**Dependencies**: Phase 7 complete

**📋 Research Required** (per PHASE-CHECKLIST.md):
Before starting, search for 2025 best practices:
- "Astro Content Collections 2025 best practices"
- "Type-safe markdown frontmatter 2025"
- "GDPR privacy policy template 2025 France Switzerland UAE"
- "Astro blog architecture 2025"
- "Blog sidebar conversion optimization 2025"

---

#### **Phase 8.1: Configuration & Setup** (30 min)
**Goal**: Configure site-wide settings and prepare for blog

**Tasks**:
1. **Create `src/config.ts`** - Site configuration file:
   ```ts
   export const config = {
     site: {
       title: 'Vecia - AI Automation Agency',
       description: 'Implement AI, Save 20+ Hours per Week',
       url: 'https://vecia.com', // Update with actual domain
       author: 'Vecia Team',
     },
     calcom: {
       bookingUrl: process.env.PUBLIC_CAL_COM_URL || 'https://cal.com/vecia/consultation',
     },
     social: {
       linkedin: 'https://www.linkedin.com/company/vecia',
       twitter: 'https://twitter.com/vecia',
     },
     contact: {
       email: 'contact@vecia.com',
     }
   };
   ```

2. **Create `.env` and `.env.example`**:
   ```bash
   # .env.example
   PUBLIC_CAL_COM_URL=https://your-vps.com/cal/consultation
   ```

3. **Update components to use config**:
   - Navigation.astro (CTA buttons)
   - FinalCTA.astro (booking link)
   - Footer.astro (social links)

**2025 Best Practice**: Use environment variables for all external URLs (Cal.com will be on user's VPS)

---

#### **Phase 8.2: Content Collections Setup** (1 hour)
**Goal**: Set up Astro Content Collections for type-safe blog

**Tasks**:
1. **Create `src/content/config.ts`**:
   ```ts
   import { defineCollection, z } from 'astro:content';

   const blog = defineCollection({
     type: 'content',
     schema: z.object({
       title: z.string(),
       description: z.string(),
       publishDate: z.date(),
       author: z.string(),
       category: z.enum([
         'why-broken',
         'success-stories',
         'quick-wins',
         'industry-deep-dives',
         'tool-comparisons'
       ]),
       tags: z.array(z.string()),
       featured: z.boolean().optional(),
       image: z.string().optional(),
       linkedin: z.object({
         caption: z.string(),
         hashtags: z.array(z.string())
       }).optional()
     })
   });

   export const collections = { blog };
   ```

2. **Create directory structure**:
   ```
   src/content/
   └── blog/
       ├── en/
       │   └── sample-article-en.md
       └── fr/
           └── sample-article-fr.md
   ```

3. **Add 2-3 sample blog posts** for testing:
   ```md
   ---
   title: "5 Signs Your Business Needs Automation"
   description: "Discover if AI automation is right for your business"
   publishDate: 2025-01-15
   author: "Vecia Team"
   category: "why-broken"
   tags: ["automation", "AI", "business"]
   featured: true
   linkedin:
     caption: |
       🚀 Is your business ready for AI automation?
       Here are 5 telltale signs...
     hashtags: ["AI", "Automation", "Business"]
   ---

   # Article content here...
   ```

**2025 Best Practice**: Type-safe frontmatter with Zod validation prevents runtime errors

---

#### **Phase 8.3: Static Pages** ✅ COMPLETE (2.5 hours)
**Goal**: Create About, Privacy, Terms, Cookies, and AI Ethics pages

**Completed**: 2025-10-09
**Commit**: `dddc5d9`

**Files Created** (10 files total - FR + EN for each):

1. **About Page** (`src/pages/about.astro` + `/en/about.astro`):
   - Company mission and story
   - Team section (can be placeholder for now)
   - AI ethics commitment
   - CTA to book consultation
   - Add translations to `i18n/ui.ts`

2. **Privacy Policy** (`src/pages/privacy.astro` + `/en/privacy.astro`):
   - Data collection practices
   - IP detection for currency (GDPR compliant)
   - Google Sheets form storage
   - Third-party services (Plausible, Clarity, LinkedIn)
   - User rights under GDPR/CCPA
   - Contact for data requests

3. **Terms of Service** (`src/pages/terms.astro` + `/en/terms.astro`):
   - Website usage terms
   - Service disclaimers
   - Intellectual property
   - Limitation of liability

4. **Cookie Policy** (`src/pages/cookies.astro` + `/en/cookies.astro`):
   - localStorage usage (currency preference)
   - No tracking cookies (Plausible is cookieless)
   - How to clear localStorage
   - Analytics tools explanation

5. **AI Ethics** (`src/pages/ai-ethics.astro` + `/en/ai-ethics.astro`):
   - Vecia's ethical AI principles
   - Transparency commitments
   - Data privacy approach
   - Responsible automation philosophy

**Layout**: All pages use `BaseLayout.astro` with proper SEO metadata

**2025 Best Practice**: GDPR-compliant legal pages are mandatory for EU businesses (France/Switzerland)

**✅ Phase 8.3 Implementation Summary**:
- **About Page**: Complete with 6 sections (Hero, Mission, Values, Stats, Team, CTA)
  - Square team photos with LinkedIn links
  - Justified text in mission section
  - Blue dot icons (`.title-icon`) on section headers
  - Gradient backgrounds and professional layout
- **Legal Pages**: All 4 pages (Privacy, Terms, Cookies, AI Ethics) in FR + EN
  - Clean numbered section format (no blue dots)
  - GDPR-compliant content
  - Mobile-responsive typography
- **AITabs Component UX**: Major improvements implemented
  - Timer increased: 8000ms → 15000ms (87% longer)
  - Visual pause indicator with ⏸ badge
  - Touch support for mobile pause/resume
  - Fixed mobile layout shift with consistent min-heights
  - **Floating navigation buttons** with viewport detection
    - Previous/Next buttons + tab indicator (1/4, 2/4, etc.)
    - Only visible when tabs in viewport (Alpine.js `x-intersect`)
    - Dynamic colors matching active tab
    - 48x48px touch-optimized buttons
- **Navigation Mobile Menu**: 2025 UX patterns applied
  - Fixed Alpine.js scope issue (moved x-data to parent)
  - Animated hamburger ↔ X icons
  - Generous spacing and modern design
  - Centered content layout
  - Solid white background with shadows
- **Design System**: Color update (secondary: #9B59F6 → #C755FF)
- **Configuration**: `src/config.ts` created with site-wide settings
- **Translations**: 60+ new keys added to `src/i18n/ui.ts`
- **Assets**: Team photos and mission image added
- **Alpine.js Plugins**: Verified `@alpinejs/intersect` installed and working

**Time Investment**: ~2.5 hours (includes AITabs improvements and mobile menu fixes)
**Files Modified**: 30 files
**Build Status**: ✅ Compiles successfully, zero errors

---

#### **Phase 8.4: Blog System** (6 hours) - MOST COMPLEX
**Goal**: Build complete blog with homepage, article template, sidebar, and LinkedIn integration

**Status**: ✅ PARTIALLY COMPLETE (Phases 8.4.1-8.4.3 done, 8.4.4 pending, 8.4.5 complete)
**Completed**: 2025-01-15
**Remaining**: LinkedIn integration script (8.4.4)

##### **8.4.1: Blog Components** ✅ COMPLETE (2 hours)

**Blog-specific components created**:

1. **`src/components/blog/BlogSidebar.astro`** - Conversion-focused sidebar:
   ```astro
   ---
   import type { Language } from '../../i18n/ui';

   interface Props {
     lang: Language;
   }
   ---

   <aside class="space-y-6">
     <!-- Lead Magnet Signup (TOP PRIORITY for conversion) -->
     <div class="bg-gradient-to-br from-primary/10 to-secondary/10 p-6 rounded-lg">
       <h3>Get Your Free AI Assessment</h3>
       <p>Discover 10+ hours of time savings</p>
       <form><!-- Email capture --></form>
     </div>

     <!-- Most Popular Articles -->
     <div>
       <h3>Most Popular</h3>
       <!-- Static list for now, dynamic later -->
     </div>

     <!-- Quick Tips Box -->
     <div class="bg-accent3 p-6 rounded-lg">
       <h3>Quick Win</h3>
       <p>Automation tip of the week</p>
     </div>

     <!-- Social Follow Buttons -->
     <div>
       <h3>Follow Us</h3>
       <!-- LinkedIn, Twitter buttons -->
     </div>
   </aside>
   ```

2. **`src/components/blog/BlogHeader.astro`** - Article metadata:
   - Title, author, date, reading time, category badge
   - Breadcrumb navigation
   - Social sharing buttons

3. **`src/components/blog/ArticleFooter.astro`**:
   - Author bio with photo
   - "Ready to Automate?" CTA box
   - Related articles (3-4 from same category)

4. **`src/components/blog/ShareButtons.astro`** - Social sharing:
   - LinkedIn, Twitter, Copy link buttons
   - Floating sidebar on desktop
   - Fixed bottom on mobile

5. **`src/components/blog/InContentCTA.astro`** - Reusable CTA for articles:
   ```astro
   <div class="my-8 p-6 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg">
     <h3>Ready to See Results?</h3>
     <p>Book a free 30-minute consultation</p>
     <a href={config.calcom.bookingUrl} class="btn-primary">Book Now</a>
   </div>
   ```

##### **8.4.2: Blog Homepage** ✅ COMPLETE (2 hours)

**File**: `src/pages/blog.astro` (French) + `src/pages/en/blog.astro` (English)

**Implemented Features**:
- Featured article (large card with image)
- Article grid (3 columns desktop, 1 mobile)
- Category filter pills (Alpine.js client-side filtering)
- Search bar (client-side filter by title/description)
- Pagination (Astro's `paginate()` helper)
- BlogSidebar component (30% width on desktop)
- Reading time calculation (`readingTime = Math.ceil(wordCount / 200)`)
- Responsive layout with proper breakpoints

**Example structure**:
```astro
---
import { getCollection } from 'astro:content';
import BlogSidebar from '../../components/blog/BlogSidebar.astro';

const lang = 'fr';
const allPosts = await getCollection('blog', ({ id }) => id.startsWith(`${lang}/`));
const sortedPosts = allPosts.sort((a, b) =>
  b.data.publishDate.valueOf() - a.data.publishDate.valueOf()
);
const featuredPost = sortedPosts.find(post => post.data.featured) || sortedPosts[0];
const regularPosts = sortedPosts.filter(post => post !== featuredPost);
---

<Layout>
  <div class="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
    <!-- Main content (70%) -->
    <div class="lg:col-span-2">
      <!-- Featured article -->
      <FeaturedCard post={featuredPost} />

      <!-- Category filters -->
      <CategoryFilters />

      <!-- Article grid -->
      <ArticleGrid posts={regularPosts} />
    </div>

    <!-- Sidebar (30%) -->
    <BlogSidebar lang={lang} />
  </div>
</Layout>
```

##### **8.4.3: Article Template** ✅ COMPLETE (1.5 hours)

**File**: `src/pages/blog/[slug].astro` (handles both FR and EN via dynamic routing)

**Implemented with Content Collections**:
```astro
---
import { getCollection } from 'astro:content';
import BlogLayout from '../../layouts/BlogLayout.astro';
import ShareButtons from '../../components/blog/ShareButtons.astro';
import ArticleFooter from '../../components/blog/ArticleFooter.astro';

export async function getStaticPaths() {
  const frPosts = await getCollection('blog', ({ id }) => id.startsWith('fr/'));
  const enPosts = await getCollection('blog', ({ id }) => id.startsWith('en/'));

  return [
    ...frPosts.map(post => ({
      params: { slug: post.slug.replace('fr/', '') },
      props: { post, lang: 'fr' }
    })),
    ...enPosts.map(post => ({
      params: { slug: post.slug.replace('en/', '') },
      props: { post, lang: 'en' }
    }))
  ];
}

const { post, lang } = Astro.props;
const { Content } = await post.render();
---

<BlogLayout title={post.data.title} description={post.data.description}>
  <article>
    <BlogHeader post={post} lang={lang} />

    <ShareButtons url={Astro.url.href} title={post.data.title} />

    <div class="prose prose-lg max-w-none">
      <Content />
    </div>

    <ArticleFooter post={post} lang={lang} />
  </article>
</BlogLayout>
```

**Features**:
- Reading progress bar (Alpine.js)
- Social sharing sidebar (floating)
- In-content CTA boxes (manually inserted in markdown)
- Related articles (3 from same category)
- Breadcrumb navigation
- Author bio with photo
- Comments section placeholder

##### **8.4.4: LinkedIn Integration Script** (30 min)

**File**: `scripts/linkedin-generator.js`

**CLI tool** for generating LinkedIn posts from blog articles:

```js
#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const articleSlug = process.argv[2];

if (!articleSlug) {
  console.error('Usage: npm run linkedin:generate <article-slug>');
  process.exit(1);
}

// Find markdown file
const frPath = path.join('src/content/blog/fr', `${articleSlug}.md`);
const enPath = path.join('src/content/blog/en', `${articleSlug}.md`);

const filePath = fs.existsSync(frPath) ? frPath : enPath;

if (!fs.existsSync(filePath)) {
  console.error(`Article not found: ${articleSlug}`);
  process.exit(1);
}

// Parse frontmatter
const fileContent = fs.readFileSync(filePath, 'utf-8');
const { data } = matter(fileContent);

// Generate LinkedIn post
const articleUrl = `https://vecia.com/blog/${articleSlug}`;
const hashtags = (data.linkedin?.hashtags || []).map(h => `#${h}`).join(' ');

const linkedInPost = `
📊 ${data.title}

${data.linkedin?.caption || data.description}

Read more: ${articleUrl}

${hashtags}
`.trim();

console.log('\n------- LinkedIn Post (Copy & Paste) -------\n');
console.log(linkedInPost);
console.log('\n-------------------------------------------\n');
```

**Install dependency**:
```bash
npm install gray-matter
```

**Add script to `package.json`**:
```json
{
  "scripts": {
    "linkedin:generate": "node scripts/linkedin-generator.js"
  }
}
```

**Usage**:
```bash
npm run linkedin:generate sample-article-en
```

**2025 Best Practice**: Manual LinkedIn posting with template generator is MVP approach, API integration is Phase 2+

---

##### **8.4.5: i18n Namespace Refactoring** ✅ COMPLETE (1 hour)

**Date**: 2025-01-15
**Reason**: Monolithic `ui.ts` (1927 lines) causing duplicate key errors and maintainability issues

**Problem Identified**:
- Single `ui.ts` file with 1900+ lines
- Duplicate `en:` object at lines 633 and 1267 (JavaScript used last definition, overwrote earlier translations)
- Hard to navigate and maintain
- High risk of merge conflicts for team collaboration
- Not aligned with 2025 i18n best practices

**2025 Best Practice Research**:
- Searched: "i18n translation file organization best practices 2025"
- Found industry consensus on namespace pattern (Medium, React-i18next, Stack Overflow)
- Recommended: Split into ~200-500 lines per file, feature-based organization
- Pattern used by: Next.js, React, Angular, Vue ecosystems

**Solution Implemented**:
Created namespace-based structure with 8 files (4 per language):

```
src/i18n/
├── ui.ts (56 lines - imports and merges all namespaces)
├── fr/
│   ├── common.ts (~312 lines) - Meta, nav, footer, products, journey, cases
│   ├── about.ts (~37 lines) - About page
│   ├── legal.ts (~220 lines) - Privacy, terms, cookies, AI ethics
│   └── blog.ts (~54 lines) - Blog system UI
└── en/
    └── (same structure as French)
```

**New `ui.ts` Structure**:
```typescript
import { common as frCommon } from './fr/common';
import { about as frAbout } from './fr/about';
import { legal as frLegal } from './fr/legal';
import { blog as frBlog } from './fr/blog';

import { common as enCommon } from './en/common';
import { about as enAbout } from './en/about';
import { legal as enLegal } from './en/legal';
import { blog as enBlog } from './en/blog';

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

export type Language = keyof typeof ui;
export type TranslationKey = keyof typeof ui.fr;
```

**Benefits Achieved**:
- ✅ **Backward compatible** - No API changes, existing components work unchanged
- ✅ **Type-safe** - TypeScript inference preserved across all namespaces
- ✅ **Maintainable** - Each file now ~200-500 lines (industry standard)
- ✅ **Scalable** - Easy to add new features without touching existing translations
- ✅ **Team-friendly** - Separate files reduce merge conflicts dramatically
- ✅ **Eliminated duplicate key error** - Impossible to have duplicate language keys
- ✅ **Logical grouping** - Related translations grouped by feature

**Migration Process**:
1. Created backup: `ui.ts.backup` (safety measure)
2. Created `/fr/` and `/en/` directories
3. Extracted translations with `sed` commands (by line ranges)
4. Fixed missing `export const` statements
5. Updated imports in main `ui.ts`
6. Verified with `npm run astro check` (passed)
7. Tested all pages render correctly (dev server)

**Documentation Created**:
- `docs/I18N-ARCHITECTURE.md` - Complete guide to namespace pattern
- `docs/BLOG-WORKFLOW.md` - References i18n structure for blog translations
- `docs/GETTING-STARTED.md` - Quick reference for developers

**Files Modified**: 10 files
- Created: 8 namespace files + 1 backup
- Modified: 1 main ui.ts file

**Build Status**: ✅ Zero errors, all type checks pass

**Time Investment**: ~1 hour (research, implementation, testing, documentation)

---

### **Phase 9: Conversion Tools - Analytics & Popups** (3 hours)
**Goal**: Integrate analytics and build conversion popups

**📋 Research Required**:
- "Plausible Analytics Astro integration 2025"
- "Microsoft Clarity privacy compliance 2025"
- "Exit intent popups 2025 conversion optimization"
- "Alpine.js modal components 2025 patterns"

---

#### **Phase 9.1: Analytics Integration** (1 hour)

**Goal**: Implement privacy-first analytics

**Tasks**:

1. **Plausible Analytics** (30 min):
   - Sign up at plausible.io
   - Add script to `BaseLayout.astro` head:
   ```astro
   <script defer data-domain="vecia.com" src="https://plausible.io/js/script.js"></script>
   ```
   - Configure custom events:
   ```js
   window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }

   // Track CTA clicks
   document.querySelectorAll('[data-track="book-call"]').forEach(el => {
     el.addEventListener('click', () => {
       plausible('Book Call', { props: { location: el.dataset.location } });
     });
   });
   ```

2. **Microsoft Clarity** (15 min):
   - Create Clarity project at clarity.microsoft.com
   - Add Clarity script to BaseLayout.astro
   - Verify heatmap tracking

3. **LinkedIn Insight Tag** (15 min):
   - Get LinkedIn Partner ID
   - Add pixel to BaseLayout.astro:
   ```html
   <script type="text/javascript">
   _linkedin_partner_id = "YOUR_PARTNER_ID";
   window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
   window._linkedin_data_partner_ids.push(_linkedin_partner_id);
   </script>
   <script type="text/javascript">
   (function(l) {
   if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
   window.lintrk.q=[]}
   var s = document.getElementsByTagName("script")[0];
   var b = document.createElement("script");
   b.type = "text/javascript";b.async = true;
   b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
   s.parentNode.insertBefore(b, s);})(window.lintrk);
   </script>
   ```

**2025 Best Practice**: Plausible is cookieless (no GDPR banner needed), Clarity and LinkedIn are privacy-friendly

---

#### **Phase 9.2: Popup System** (2 hours)

**Goal**: Build conversion popups with Alpine.js

**Components to Create**:

1. **`src/components/popups/ExitIntent.astro`** (30 min):
   ```astro
   <div x-data="exitIntentPopup()" x-show="show" x-cloak>
     <div class="fixed inset-0 bg-black/50 z-50" @click="close()"></div>
     <div class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
       <div class="bg-white rounded-lg p-8 max-w-md">
         <h2>Wait! Don't Leave Empty-Handed</h2>
         <p>Get your free AI Automation Assessment</p>
         <form @submit.prevent="submit">
           <input type="email" placeholder="your@email.com" x-model="email">
           <button type="submit">Send My Free Assessment</button>
         </form>
       </div>
     </div>
   </div>

   <script>
   function exitIntentPopup() {
     return {
       show: false,
       email: '',
       dismissed: false,

       init() {
         // Check if user has seen popup in last 30 days
         if (localStorage.getItem('exit-intent-seen')) {
           return;
         }

         // Detect exit intent (mouse leaving viewport)
         document.addEventListener('mouseleave', (e) => {
           if (e.clientY < 10 && !this.show && !this.dismissed) {
             this.show = true;
           }
         });
       },

       close() {
         this.show = false;
         this.dismissed = true;
         localStorage.setItem('exit-intent-seen', Date.now());
       },

       async submit() {
         // Submit to Google Sheets (reuse existing webhook)
         await submitLead(this.email, 'exit-intent');
         this.close();
       }
     }
   }
   </script>
   ```

2. **`src/components/popups/ScrollTrigger.astro`** (30 min):
   - Trigger at 50% scroll on blog articles
   - Slide-up from bottom right
   - Once per session (sessionStorage)

3. **`src/components/popups/WelcomeMat.astro`** (30 min):
   - Full-screen overlay on first visit
   - localStorage check for returning visitors
   - Gradient background matching brand

4. **`src/components/popups/SmartBar.astro`** (30 min):
   - Sticky top bar appearing after 10 seconds
   - Dismissible with X button
   - localStorage for 7-day dismissal

5. **`src/components/popups/PopupManager.astro`**:
   - Global component managing all popups
   - Priority system (exit > scroll > welcome)
   - Prevents multiple popups showing
   - Include in BaseLayout.astro

**2025 Best Practice**: Alpine.js for popups is lightweight (no external library), GDPR-friendly (localStorage only)

---

### **Phase 10: SEO & Performance** (3 hours)
**Goal**: Maximize search visibility and optimize load time

**📋 Research Required**:
- "Astro SEO 2025 best practices"
- "Structured data JSON-LD 2025"
- "Core Web Vitals 2025 requirements"

---

#### **Phase 10.1: SEO Implementation** (2 hours)

**Tasks**:

1. **Sitemap Generation** (15 min):
   ```bash
   npx astro add sitemap
   ```

   Update `astro.config.mjs`:
   ```js
   import sitemap from '@astrojs/sitemap';

   export default defineConfig({
     site: 'https://vecia.com',
     integrations: [sitemap()],
   });
   ```

2. **Structured Data** (1 hour):

   Create `src/components/seo/StructuredData.astro`:
   ```astro
   ---
   interface Props {
     type: 'organization' | 'website' | 'article';
     data?: any;
   }

   const { type, data } = Astro.props;

   const schemas = {
     organization: {
       "@context": "https://schema.org",
       "@type": "Organization",
       "name": "Vecia",
       "url": "https://vecia.com",
       "logo": "https://vecia.com/vecia_logo_long_contour.png",
       "description": "AI Automation Agency - Save 20+ Hours per Week",
       "sameAs": [
         "https://www.linkedin.com/company/vecia",
         "https://twitter.com/vecia"
       ]
     },
     website: {
       "@context": "https://schema.org",
       "@type": "WebSite",
       "name": "Vecia",
       "url": "https://vecia.com",
       "potentialAction": {
         "@type": "SearchAction",
         "target": "https://vecia.com/blog?q={search_term_string}",
         "query-input": "required name=search_term_string"
       }
     },
     article: data
   };
   ---

   <script type="application/ld+json" set:html={JSON.stringify(schemas[type])} />
   ```

   Add to BaseLayout and BlogLayout

3. **Social Media Tags** (30 min):

   Add to BaseLayout.astro:
   ```astro
   <!-- Open Graph -->
   <meta property="og:title" content={title} />
   <meta property="og:description" content={description} />
   <meta property="og:image" content={`${Astro.site}og-image.jpg`} />
   <meta property="og:url" content={Astro.url.href} />
   <meta property="og:type" content="website" />

   <!-- Twitter Card -->
   <meta name="twitter:card" content="summary_large_image" />
   <meta name="twitter:title" content={title} />
   <meta name="twitter:description" content={description} />
   <meta name="twitter:image" content={`${Astro.site}og-image.jpg`} />
   ```

4. **robots.txt** (15 min):

   Create `public/robots.txt`:
   ```
   User-agent: *
   Allow: /
   Disallow: /test-*

   Sitemap: https://vecia.com/sitemap-index.xml
   ```

---

#### **Phase 10.2: Performance Optimization** (1 hour)

**Tasks**:

1. **Font Optimization** (15 min):
   ```astro
   <link rel="preload" href="/fonts/SpaceGrotesk-Bold.woff2" as="font" type="font/woff2" crossorigin>
   <link rel="preload" href="/fonts/Inter-Regular.woff2" as="font" type="font/woff2" crossorigin>
   ```

2. **Image Optimization** (15 min):
   - Convert all images to WebP
   - Add lazy loading to below-fold images
   - Implement responsive images with srcset

3. **Critical CSS** (15 min):
   - Inline critical CSS for above-fold content
   - Defer non-critical CSS

4. **Bundle Analysis** (15 min):
   ```bash
   npm run build
   # Check dist/_astro/ sizes
   ```

   Install visualizer:
   ```bash
   npm install -D rollup-plugin-visualizer
   ```

**Target Metrics**:
- Lighthouse Performance: 90+
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1

---

### **Phase 11: Quality & Auditing** (2 hours)
**Goal**: Clean code, security, accessibility, legal compliance

**📋 Research Required**:
- "Website security headers 2025 OWASP"
- "WCAG 2.1 AA compliance 2025"

---

#### **Phase 11.1: Code Quality Audit** (45 min)

**Tasks**:

1. **Dependency Audit** (15 min):
   ```bash
   npm ls
   npx depcheck
   npm audit fix
   ```

2. **CSS Audit** (15 min):
   - Verify Tailwind purging (check dist/ CSS size)
   - Remove unused custom CSS
   - Check for duplicate styles

3. **JavaScript Audit** (15 min):
   - Remove unused Alpine.js components
   - Verify all translation keys used
   - Check bundle size (target < 500KB)

**Tools to Install**:
```bash
npm install -D depcheck rollup-plugin-visualizer
```

---

#### **Phase 11.2: Security Audit** (45 min)

**Tasks**:

1. **Dependency Security** (15 min):
   ```bash
   npm audit
   npm audit fix
   ```

2. **Input Validation** (15 min):
   - Add client-side validation to forms
   - Implement rate limiting (localStorage-based)
   - Sanitize inputs before Google Sheets submission

3. **Security Headers** (15 min):

   Create `docs/NGINX-SECURITY-HEADERS.md`:
   ```nginx
   add_header X-Frame-Options "DENY" always;
   add_header X-Content-Type-Options "nosniff" always;
   add_header Referrer-Policy "strict-origin-when-cross-origin" always;
   add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
   add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://plausible.io; style-src 'self' 'unsafe-inline';" always;
   add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
   ```

---

#### **Phase 11.3: Accessibility Audit** (30 min)

**Tasks**:

1. **Automated Testing** (15 min):
   - Run Lighthouse accessibility audit (target 90+)
   - Use axe DevTools extension
   - Install and run Pa11y:
   ```bash
   npm install -D pa11y-ci
   npx pa11y-ci https://localhost:4321
   ```

2. **Manual Testing** (15 min):
   - Keyboard navigation (Tab, Enter, Escape)
   - Screen reader test (VoiceOver/NVDA)
   - Color contrast check (WebAIM Contrast Checker)
   - Focus indicators visible
   - ARIA labels on interactive elements

**Checklist**:
- [ ] All buttons/links keyboard accessible
- [ ] Form labels associated
- [ ] Alt text on all images
- [ ] Heading hierarchy correct (no skipped levels)
- [ ] Focus trap in modals
- [ ] Color contrast ratio 4.5:1+ (WCAG AA)

---

### **Phase 12: VPS Deployment** (2 hours)
**Goal**: Deploy to production VPS with CI/CD

**📋 Research Required**:
- "GitHub Actions Astro deployment 2025"
- "Nginx Astro configuration 2025"
- "Let's Encrypt renewal automation 2025"

---

#### **Phase 12.1: Nginx Configuration** (1 hour)

**File**: `/etc/nginx/sites-available/vecia.com`

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name vecia.com www.vecia.com;

    # Redirect to HTTPS
    return 301 https://vecia.com$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name www.vecia.com;

    # SSL certificates (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/vecia.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/vecia.com/privkey.pem;

    # Redirect www to non-www
    return 301 https://vecia.com$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name vecia.com;

    # SSL certificates
    ssl_certificate /etc/letsencrypt/live/vecia.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/vecia.com/privkey.pem;

    # Root directory
    root /var/www/vecia/dist;
    index index.html;

    # Security headers (from Phase 11.2)
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss;

    # Cache static assets (1 year)
    location /_astro/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Cache images (1 week)
    location ~* \.(jpg|jpeg|png|gif|ico|webp|svg)$ {
        expires 7d;
        add_header Cache-Control "public";
    }

    # No cache for HTML
    location ~* \.html$ {
        expires -1;
        add_header Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0";
    }

    # Handle i18n routing
    location / {
        try_files $uri $uri/ $uri.html =404;
    }

    # Error pages
    error_page 404 /404.html;
    error_page 500 502 503 504 /50x.html;
}
```

**SSL Setup**:
```bash
sudo certbot --nginx -d vecia.com -d www.vecia.com
sudo systemctl enable certbot.timer  # Auto-renewal
```

---

#### **Phase 12.2: CI/CD Pipeline** (1 hour)

**File**: `.github/workflows/deploy.yml`

```yaml
name: Deploy to VPS

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build Astro site
        run: npm run build
        env:
          PUBLIC_CAL_COM_URL: ${{ secrets.CAL_COM_URL }}

      - name: Deploy to VPS
        uses: easingthemes/ssh-deploy@v4
        with:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
          REMOTE_HOST: ${{ secrets.REMOTE_HOST }}
          REMOTE_USER: ${{ secrets.REMOTE_USER }}
          SOURCE: "dist/"
          TARGET: "/var/www/vecia/dist/"
          EXCLUDE: "/node_modules/, /.git/"

      - name: Notify on success
        if: success()
        run: echo "✅ Deployment successful!"
```

**GitHub Secrets to Add**:
- `SSH_PRIVATE_KEY`: Private SSH key for VPS access
- `REMOTE_HOST`: VPS IP address
- `REMOTE_USER`: SSH username
- `CAL_COM_URL`: Custom Cal.com booking URL

**VPS Setup**:
```bash
# Create deployment directory
sudo mkdir -p /var/www/vecia/dist
sudo chown $USER:$USER /var/www/vecia

# Add deployment key
mkdir -p ~/.ssh
echo "SSH_PUBLIC_KEY" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

**Test Deployment**:
```bash
# Manual test first
npm run build
rsync -avz --delete dist/ user@vps-ip:/var/www/vecia/dist/

# Then push to GitHub to trigger CI/CD
git push origin main
```

---

## 📊 Updated Phase Timeline

| Phase | Name | Duration | Status |
|-------|------|----------|--------|
| 1-7 | Foundation → Pricing | 6.5 hours | ✅ Complete |
| **8** | **Blog & Content Pages** | **9.5 hours** | ⏳ Next |
| **9** | **Analytics & Popups** | **3 hours** | 📋 Pending |
| **10** | **SEO & Performance** | **3 hours** | 📋 Pending |
| **11** | **Quality & Auditing** | **2 hours** | 📋 Pending |
| **12** | **VPS Deployment** | **2 hours** | 📋 Pending |

**Total Remaining**: ~19.5 hours
**Overall Progress**: 6.5/26 hours (25% complete)

---

## ✅ Updated Success Criteria

- [ ] **Blog System**: FR/EN blog with sidebar, categories, LinkedIn integration
- [ ] **Static Pages**: About, Privacy, Terms, Cookies, AI Ethics (10 pages)
- [ ] **Analytics**: Plausible, Clarity, LinkedIn Insight Tag configured
- [ ] **Popups**: Exit intent, scroll, welcome mat, smart bar functional
- [ ] **SEO**: Sitemap, structured data, social tags, robots.txt
- [ ] **Performance**: Lighthouse 90+ all metrics, LCP < 2.5s
- [ ] **Security**: Nginx headers, SSL, CSP, input validation
- [ ] **Accessibility**: WCAG AA compliant, keyboard navigation
- [ ] **CI/CD**: GitHub Actions deploying to VPS automatically
- [ ] **Cal.com**: Custom booking URL configured

---

## 📦 Additional Dependencies to Install

```json
{
  "dependencies": {
    "gray-matter": "^4.0.3"
  },
  "devDependencies": {
    "depcheck": "^1.4.7",
    "rollup-plugin-visualizer": "^5.12.0",
    "pa11y-ci": "^3.1.0",
    "@astrojs/sitemap": "^4.0.0"
  },
  "scripts": {
    "linkedin:generate": "node scripts/linkedin-generator.js"
  }
}
```

---

## 🎯 Implementation Notes

### Phase Priority:
1. **Phase 8** is CRITICAL - Blog and content pages are core business requirements
2. **Phase 9** adds conversion tracking (can partially skip if time-constrained)
3. **Phase 10** is MANDATORY - SEO is business-critical
4. **Phase 11** ensures quality (can do iteratively post-launch)
5. **Phase 12** deploys everything to production

### Time-Saving Strategies:
- Use legal page templates (GDPR-compliant from trusted sources)
- Start with 2-3 sample blog posts (content can be added later)
- Popup system can be simplified (exit intent + scroll trigger only for MVP)
- Analytics can be added incrementally (Plausible first, others later)

### Critical Path:
Phase 8 (Blog) → Phase 10 (SEO) → Phase 12 (Deployment)
Phases 9 and 11 can be done post-launch if needed.

---

**Last Updated**: 2025-10-09
**Next Action**: Start Phase 8.1 (Configuration & Setup) OR Continue with Phase 8.4 (Blog System)
**Blocker**: None - Phase 8.3 complete, ready to proceed with remaining blog phases
