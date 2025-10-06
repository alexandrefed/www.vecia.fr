# Product Requirements Document: Vecia AI Agency Website

**Document Version:** 3.1
**Date:** June 20, 2025
**Last Updated:** October 5, 2025 (V5 Implementation with 2025 Best Practices)
**Product Owner:** Vecia AI Agency
**Document Type:** Website Redesign PRD with Effortel-Inspired Design & High-Conversion Strategy

**🔗 Related Documentation:**
- [2025 Best Practices & Updates](./2025-UPDATES.md) - Critical technology updates
- [Implementation Plan](./IMPLEMENTATION-PLAN.md) - Complete V5 build roadmap
- [Tailwind v4 Reference](./TAILWIND-REFERENCE.md) - Modern styling approach
- [Astro i18n Reference](./ASTRO-I18N-REFERENCE.md) - Internationalization guide

---

## 1. Executive Summary

### 1.1 Project Overview
The website will create a high-converting sales funnel that drives qualified leads through multiple conversion points: email capture, content engagement, and ultimately booking 30-minute discovery calls via cal.com. The design leverages clear service categorization while showcasing AI automation case studies and supporting international markets with multi-language and IP-based dynamic pricing.

### 1.2 Primary Objectives
- **Multi-Level Conversion**: Implement 3-tier conversion strategy (email → nurture → appointment)
- **Lead Generation**: Capture 30-40 email leads per month through value-driven lead magnets
- **Appointment Booking**: Achieve 15-20 qualified appointments per month
- **Education**: Demonstrate AI expertise through problem-focused content
- **Trust**: Build credibility with SME decision-makers
- **Scalability**: Start free, scale seamlessly as business grows

### 1.3 Success Metrics
- Email capture rate: 3-5% of visitors
- Email-to-appointment conversion: 30-40%
- Number of Calendly appointments booked per week
- Lead magnet download rate
- Blog engagement metrics (time on page, scroll depth)
- Popup conversion rates
- Source attribution (especially LinkedIn)

---

## 2. Target Audience

### 2.1 Primary Personas

#### **The Overwhelmed Operations Manager**
- **Company Size**: 10-50 employees
- **Industry**: Retail, E-commerce, Logistics
- **Pain Points**: 
  - Spending 10+ hours/week on manual data entry
  - Multiple platforms that don't communicate
  - Can't scale operations without hiring more staff
- **Goals**: Automate repetitive tasks, centralize data, free up time for strategic work
- **Lead Magnet Appeal**: "10 Tasks to Automate Today" checklist

#### **The Ambitious Course Creator**
- **Company Size**: 1-10 employees
- **Industry**: Education, Coaching, Online Courses
- **Pain Points**:
  - Manual marketing campaign management
  - Difficulty targeting the right audience
  - Time-consuming enrollment processes
- **Goals**: Fill courses consistently, automate marketing, improve conversion rates
- **Lead Magnet Appeal**: "Fill Your Courses with AI Marketing" guide

#### **The Growth-Focused Business Owner**
- **Company Size**: 5-30 employees
- **Industry**: Commodity Trading, B2B Services
- **Pain Points**:
  - CRM underutilization
  - Poor customer communication
  - Manual document generation
- **Goals**: Scale without proportional headcount increase, improve customer satisfaction
- **Lead Magnet Appeal**: "AI Readiness Assessment" tool

### 2.2 Geographic Markets
- **Primary**: France, Switzerland, UAE
- **Secondary**: Rest of Europe, USA
- **Note**: No direct geographic mentions on website - remote services globally

---

## 3. Lead Magnet Strategy

### 3.1 Primary Lead Magnets

#### **Quick Win Lead Magnet** (MVP Launch)
- **Title**: "5-Minute AI Automation Assessment"
- **Format**: 2-page google form (or other tool for forms)
- **Content**: 10 questions to identify automation opportunities
- **Value Prop**: "Discover 10+ hours of time savings in 5 minutes"

#### **Persona-Specific Lead Magnets** (Week 1)
1. **For Operations Managers**: "The SME Automation Playbook"
   - 10 most impactful automations for small businesses
   - ROI calculator template
   - Implementation priority matrix

2. **For Course Creators**: "Fill Your Courses with AI Marketing"
   - Meta ads automation guide
   - Email sequence templates
   - Targeting optimization checklist

3. **For Business Owners**: "From Manual to Magical: Business Transformation Guide"
   - Case study compilation
   - Process mapping template
   - Vendor evaluation checklist

### 3.2 Lead Magnet Distribution Strategy
- Homepage hero section secondary CTA
- Blog sidebar prominent placement
- Exit intent popup offer
- In-content contextual offers
- Footer subscription with magnet incentive

---

## 4. Core Features & Functionality

### 4.0 Homepage Structure Overview

**Current V3 Page Order (Top to Bottom)**:
1. Navigation Bar
2. Hero Section with Particle Animation Background
3. AI Technology Logos Carousel
4. AI Implementation Suite (4 Interactive Tabs)
5. AI Products Carousel (7 Service Cards)
6. Customer Journey Section (Bento Grid - Asymmetric Layout)
7. Business Cases Section (4 Industry Slides)
8. Lead Capture Form
9. Final CTA
10. Footer

### 4.1 Section-by-Section Details

#### Section 1: Navigation Bar
**Content**:
- Logo (left) - switches to "V" icon on mobile
- Navigation links: "À Propos", "Blog" and "Contact"
- Language dropdown or toggle (FR/EN toggle with flags)
- Two CTA buttons: "Réserver un Appel" and "Commencer"
- Mobile hamburger menu

#### Section 2: Hero Section
**Content**:
- Headline: "Implémentez l'IA, Économisez Plus de 20h par Semaine, et Accélerez votre croissance"
- Gradient text highlight on "Économisez Plus de 20h par Semaine"
- Subheading about AI automation benefits
- Two CTA buttons: "AUDIT IA GRATUIT" and "ÉCHANGEZ AVEC NOUS"

**Animation**:
- **Particle dots background**
- 4 movement patterns: Fractal Orbit, Golden Spiral, Breathing, Neural Wander
- Intelligent positioning that never overlaps text
- Performance-optimized for mobile (reduced count, simplified motion)
- 60fps continuous smooth animation

#### Section 3: AI Technology Logos Carousel
**Content**:
- Header: "Propulsé par les Technologies IA de Pointe"
- AI tool logos: Claude AI, OpenAI, n8n, LangChain, Neo4j, Supabase, PostgreSQL, Make, Notion, Zapier, Google AI, Azure AI, EBP, Copilot

**Animation**:
- Infinite horizontal scroll
- Hover-to-pause functionality
- Grayscale to color transition on hover

#### Section 4: AI Implementation Suite (Tab-Slider)
**Content**:
- Header: "■ Plateforme IA Complète"
- **4 Interactive Tabs** (Alpine.js powered):
  1. **Data Flow Automations** - Dashboard with metrics (12.4TB processed, 847 workflows, 99.97% success rate)
  2. **CRM Agentic Assistants** - Chat interface showing personalized LinkedIn outreach
  3. **Marketing AI Analytics** - ROI dashboard (342% ROI, 23 active tests, 8.4% conversion)
  4. **Knowledge Base Agents** - Task prioritization chat interface

**Features**:
- Auto-rotation every 8 seconds
- Stops when user is hovering over the card
- Progress bar animation on active tab
- Split layout: 40% description + features, 60% dashboard mockup
- Responsive gradient backgrounds per tab theme

#### Section 5: AI Products Carousel
**Content**:
- Header: "■ Outils IA Spécialisés"
- **7 Product Cards**:
  1. Analyses et Rapports Internes
  2. Sales Pipeline Automation
  3. Onboarding Automation
  4. Proposal Generation
  5. CRM Automation
  6. Invoice/Payment Automation
  7. Deep Personalization Outreach

**Features**:
- Manual navigation (prev/next arrows + dot indicators)
- Responsive: Shows 1-3 cards depending on screen size
- Each card has icon + title + 3 feature bullets

#### Section 6: Customer Journey (Bento Grid)
**Content**:
- Header: "■ Comment nous Procédons"
- **Asymmetric 3-row grid layout**:

**Row 1** (1/3 + 2/3 split):
- **Left Column**:
  - Title: "Comprendre Votre Défi"
  - Content: Consultation initiale et évaluation des besoins
  - Bullets: Identification du défi et alignement des objectifs
  - Visual: Icône cercles concentriques

- **Right Column**:
  - Title: "Votre Feuille de Route Transformation IA"
  - Subtitle: "Une approche structurée pour implémenter l'IA avec des résultats mesurables"
  - Visual: Flux horizontal en 4 étapes:
    1. Atelier Stratégique (€250/CHF300/AED1000/$250)
    2. Rapport Actionnable (insights détaillés et prochaines étapes)
    3. Plan d'Implémentation (calendrier et configuration de l'accord)
    4. Livraison & Support (lancement et optimisation continue)

**Row 2** (2/3 + 1/3 split):
- **Left Column**: Plans d'Investissement (IP-based display)
  - **Victoires Rapides**: €1,900 / CHF 1,850 / AED 8,000 / $2,100
    - 1 automatisation principale
    - Implémentation 2 semaines
    - Support 30 jours
  - **Transformation** (LE PLUS POPULAIRE): €4,500 / CHF 4,400 / AED 19,000 / $4,900
    - 2-3 automatisations intégrées
    - Implémentation 4 semaines
    - Optimisation 90 jours
  - **Accélération Entreprise**: €9,000 / CHF 8,800 / AED 38,000 / $9,900
    - Suite d'automatisation complète
    - Implémentation 6-8 semaines
    - Partenariat 6 mois

- **Right Column**: Impact Business
  - 40% Réduction des Coûts
  - 20+ Heures Économisées par Semaine
  - 300% Augmentation de Productivité

**Row 3** (1/3 + 2/3 split):
- **Left Column**:
  - Title: "Rejoignez les Implémenteurs IA à Succès"
  - Badges: GDPR, SOC2 (in progress), ISO 27001 principles

- **Right Column**:
  - Title: "Pérennisez Votre Entreprise"
  - Subtitle: "Gardez une longueur d'avance avec des solutions IA évolutives"
  - Features (grille 2 colonnes):
    - Infrastructure Prête pour l'IA
    - Intelligence Concurrentielle
    - Solutions Évolutives
    - Partenariats Industriels

**Features**:
- Dynamic pricing with IDs for region-based updates
- Gradient icons and checkmarks
- Responsive grid that reflows on mobile

#### Section 7: Business Cases (Slides)
**Content**:
- Header: "■ Résultats Réels de Vraies Entreprises"
- **4 Études de Cas**:
  1. **Intégration Dashboard E-commerce**
   - Industrie: E-commerce (icône)
   - Défi: "4 boutiques Shopify nécessitant 8 heures mensuelles de rapports manuels"
   - Solution: "Tableau de bord automatisé: Shopify → n8n → Google Analytics"
   - Métrique: "8h économisées par mois"
   - ROI: "96 heures/an × 50€/heure = 4 800€ économisés"

2. **Automatisation Marketing pour Créateurs de Cours**
   - Industrie: Éducation (icône)
   - Défi: "Création manuelle de publicités et ciblage approximatif"
   - Solution: "Automatisation des publicités Meta propulsée par IA avec tests A/B"
   - Métrique: "+47% d'augmentation des inscriptions"
   - Impact: "De 100 à 147 inscriptions/mois en plus"

3. **Assistant IA pour Email & Calendrier**
   - Industrie: Services Professionnels (icône)
   - Défi: "Submergé par les emails, suivis manqués et points d'action oubliés"
   - Solution: "Assistant IA gérant la boîte de réception, planification et suivis automatisés"
   - Métrique: "3x de réponse plus rapide"
   - Impact: "De plus de 24h à 8h en moyenne"

4. **Communication Fournisseurs B2B**
   - Industrie: Logistique (icône)
   - Défi: "Clients frustrés par le manque de visibilité sur les retards fournisseurs"
   - Solution: "Système de notification automatisé suivant les expéditions et alertant les clients"
   - Métrique: "+22% d'augmentation de la fidélisation"
   - Impact: "Clients plus satisfaits"

**Features**:
- Horizontal scroll/swipe navigation
- Each slide: Industry badge, challenge/solution/result structure, metric highlight

#### Section 8: Lead Capture Section
- **Headline**: "Pas Encore Prêt pour un Appel ? Commencez avec Notre Évaluation Gratuite"
- **Form**: Nom, Email, Taille de l'entreprise (menu déroulant)
- **CTA**: "Obtenir Mon Évaluation Gratuite"
- **Privacy**: "Nous respectons votre vie privée. Désinscription à tout moment."

#### Section 9: Final CTA
**Content**:
- Headline: "Prêt à Automatiser et Développer ?"
- Body: "Rejoignez plus de 100 entreprises économisant plus de 20h par semaine avec nos solutions d'automatisation IA"
- Two CTA buttons:
  - "Réserver un Appel Gratuit" (bouton blanc)
  - "Voir Notre Blog" (bouton contour blanc)
- Background: Gradient purple-to-cyan
- Links to: cal.com integration


#### Section 10: Footer
**Content**:
- Vecia logo
- Navigation links: À Propos, Blog, Privacy, Terms, Cookies, AI Ethics
- Social icons: LinkedIn and Twitter with gradient hover
- Copyright: "© 2025 Vecia. Tous droits réservés."

**Layout**:
- Single row on desktop, stacked on mobile
- Minimalist design with gradient accents

### 4.2 Blog Section

#### Blog Homepage Layout
- **Header**: Standard site navigation
- **Main Content Area** (70% width):
  - Featured article with large image
  - Article grid with filters (category, author, date)
  - Pagination or infinite scroll
- **Sidebar** (30% width) - CRITICAL FOR CONVERSION:
  - Lead magnet signup box (top position)
  - "Most Popular Articles" section
  - "Success Stories" rotating widget
  - "Quick Wins" tips box
  - Social media follow buttons
  - Recent testimonial
- **Footer**: Standard site footer

#### Article Template with Conversion Elements
- **Header**: Title, author, date, reading time, category
- **Social Sharing**: Floating sidebar with share buttons
- **Content Area**:
  - Introduction with problem statement
  - Body content with subheadings
  - **In-content CTA boxes** (every 3-4 sections)
  - Related service links within text
  - Pull quotes for engagement
- **Article Footer**:
  - Author bio with photo
  - "Ready to Automate?" CTA box
  - Related articles (3-4)
  - Comments section (Phase 2)
- **Sidebar** (same as blog homepage)

#### Content Categories (Problem-Focused)
- "Why It's Broken" (identifying business inefficiencies)
- "Success Stories" (case studies with metrics)
- "Quick Wins" (immediate value content)
- "Industry Deep Dives" (sector-specific solutions)
- "Tool Comparisons" (objective automation reviews)

### 4.3 Lead Capture Tools & Popups

#### **Exit Intent Popup**
- **Trigger**: Mouse movement toward browser close/back
- **Content**: "Curious about what AI could do for you? Get Your Free AI Assessment Before You Go"
- **Design**: Overlay with dimmed background
- **Form**: Email only for friction reduction
- **Timing**: 30-day cookie to prevent repeat shows

#### **Scroll-Triggered Popup**
- **Trigger**: 50% page scroll on blog articles
- **Content**: "Enjoying This? Get Weekly AI Tips"
- **Design**: Slide-up from bottom right
- **Form**: Email with optional first name
- **Timing**: Once per session

#### **Welcome Mat** (First-Time Visitors)
- **Trigger**: First visit to site
- **Content**: Full-screen value proposition
- **Design**: Branded gradient background
- **Options**: "Book a Call" or "Get Free Assessment"
- **Timing**: Once per visitor (permanent cookie)

#### **Smart Bar** (Sticky Header)
- **Position**: Top of page, appears after 10 seconds
- **Content**: "📊 See How Company X Saved 8 Hours/Week"
- **CTA**: Links to relevant case study
- **Behavior**: Dismissible, reappears after 7 days

### 4.4 Technical Features

#### Multi-language Support
- Auto-detection based on browser settings
- Manual toggle with preference saved in localStorage
- URL structure: Single URL with language parameter
- Initial languages: French and English

#### Analytics & Tracking
- **Basic Analytics**: Plausible or Umami
- **Heat Mapping**: Microsoft Clarity (free)
- **Advanced Tracking**: Event tracking for all CTAs
- **UTM Parameters**: Automatic generation for all external links
- **LinkedIn Insight Tag**: For retargeting and conversion tracking
- **Facebook Pixel**: Audience insights and retargeting
- **Email Platform Tracking**: Open rates, click rates, conversions

#### SEO Optimization
- Schema markup for case studies and articles
- Optimized meta descriptions
- XML sitemap
- Fast Core Web Vitals scores
- Structured data for business information
- Internal linking strategy for topic clusters

---

## 5. Design Specifications

### 5.1 Brand Guidelines - exhaustive in graphic_chart.md

#### Color Palette
- **Primary**: #5B8BFF (Mid blue)
- **Secondary**: #9B59F6 (Purple)
- **Accent 1**: #3BB4FF (Light blue)
- **Accent 2**: #7B6FDE (Purple-blue blend)
- **Accent 3**: #E8F4FF (Very light blue tint)
- **Text**: #1A1A2E (Deep navy)
- **Background**: #FFFFFF (White)

#### Typography
- **Display Font (Titles & Nav Links)**: Space Grotesk, Bold (700), 36px (text-4xl) for section titles
- **Headings**: Space Grotesk (font-display or font-heading)
- **Body**: Inter (font-body)
- **Navigation Links**: Space Grotesk, Bold (700), uppercase, tracking-wide
- **Font Sizes**:
  - Section Titles (H2): 36px (text-4xl) with line-height 2.5rem
  - Hero Headline (H1): Responsive 3rem-4rem (text-5xl to text-7xl)
  - Body: 16px base (responsive 16-20px)
- **CTA Buttons**: 18px bold with adequate padding

#### Design Principles
- **Simplicity**: Clean, uncluttered layouts following Effortel's minimalist approach
- **Movement**: Leverage all existing Effortel animations:
  - Smooth hover effects on all interactive elements
  - Pill button expand/collapse transitions
  - Percentage counter animations (0-100%)
  - Carousel auto-scroll with hover-pause
  - Scroll-triggered reveal animations
  - Button arrow animations on hover
- **Trust**: Professional appearance with AI-focused credibility
- **Clarity**: Clear visual hierarchy with pill-button navigation
- **Interactivity**: Expandable content sections for detailed information

### 5.2 UI Components

#### AI Tab-Slider
- **State Management**:
  - `activeTab` index (0-3)
  - Auto-rotation every 8 seconds
  - Progress bar animation resets on tab change
- **Interactions**:
  - Click tab to switch content
  - Smooth content transitions (fade + slide)
  - Tab expansion/collapse animation
  - Responsive: Vertical stack on mobile
- **Data**: 4 tabs with title, icon (Hugeicons), description, features, color theme

#### AI Products Carousel
- **Navigation**:
  - Previous/Next arrow buttons
  - Dot indicators for slide position
- **Responsive Cards**:
  - 1 card (mobile)
  - 2 cards (tablet)
  - 3 cards (desktop)
- **Behavior**: Smooth CSS transitions, active indicator highlighting
- **Content**: 7 product cards with icon, title, features list

#### Language Dropdown (Alpine.js)
- **Trigger**: Hover to open/close (mouseenter/mouseleave)
- **Animation**: Fade + scale transition (200ms enter, 150ms leave)
- **Options**:
  - Current: 🇫🇷 Français (highlighted)
  - Link: 🇬🇧 English → `/en/`
- **Desktop**: Dropdown menu
- **Mobile**: Consider inline toggle or modal selector

#### Mobile Menu
- **Trigger**: Hamburger icon (3 horizontal lines)
- **State**: `mobileMenuOpen` boolean toggle
- **Animation**: Slide-in navigation panel with backdrop
- **Close**: Click outside, close button, or navigation link

#### CTA Buttons
- **Hover Effects**:
  - Scale up (1.05x)
  - Lift effect: translateY(-4px)
  - Shadow enhancement
- **Styles**:
  - Rounded corners (Tailwind: `rounded-full` or `rounded-lg`)
  - Gradient backgrounds with high contrast
  - Icon animations (optional: arrow slide-in on hover)

#### Metric Counters
- **Class**: `.metric-animated`
- **Attributes**: `data-counter="40"` or `data-metric="50"`
- **Behavior**: Count-up animation on scroll into viewport
- **Usage**: Business impact stats (40% cost reduction, 20+ hours saved, 300% productivity)

#### Cards & Hover Effects
- **Interactive Cards**:
  - Tab cards: Scale on hover with gradient backgrounds
  - Product cards: Border + elevation on hover
  - Business case cards: Horizontal scroll/swipe navigation
- **Links**: Color transition to brand blue (#5B8BFF) on hover
- **Icons**: Rotate or scale animations on hover

#### Forms
- **Style**: Minimal fields with rounded borders
- **Validation**: Inline error messages
- **States**: Focus, error, success animations
- **Fields**: Name, email, dropdown (company size)
- **Privacy**: Checkbox or text below submit button

### 5.3 ChatGPT Image Generation Prompts

#### Lead Magnet Cover Images
```
"Professional ebook cover design for 'AI Automation Assessment', featuring abstract tech patterns in purple (#9B59F6) and blue (#5B8BFF), clean minimalist style, A4 portrait orientation, subtle circuit board pattern in background"
```

#### Blog Sidebar Graphics
```
"Isometric illustration of business automation workflow, showing documents flowing between computer screens, using Vecia brand colors #5B8BFF and #9B59F6, white background, modern tech style"
```

---

## 6. Content Strategy

### 6.1 Problem-Solution Content Framework

#### Content Pillars
1. **Problem Awareness**: "The Hidden Costs of Manual Processes"
2. **Solution Education**: "How AI Automation Works for SMEs"
3. **Success Proof**: "Real Companies, Real Results"
4. **Implementation Guide**: "Your Automation Journey"

#### Article Templates
1. **Problem-Agitation-Solution**:
   - "Why Your CRM Feels Like a Burden"
   - "The True Cost of Manual Invoice Processing"
   - "Is Your Team Drowning in Repetitive Tasks?"

2. **Before-After-Bridge**:
   - "From 8 Hours to 8 Minutes: A Shopify Success Story"
   - "How Course Creator X Filled Every Seat with AI"

3. **Comparison/Alternative**:
   - "Manual vs Automated: The Real Numbers"
   - "Build vs Buy: Automation Decision Guide"

### 6.2 SEO & Content Calendar

#### Launch Month Content
- Week 1: "5 Signs Your Business Needs Automation" (problem awareness)
- Week 2: "The SME Guide to AI Automation" (education)
- Week 3: "Case Study: 47% More Course Enrollments" (proof)
- Week 4: "Your 30-Day Automation Roadmap" (implementation)

#### Ongoing Content Mix
- 40% Problem/Pain Point Articles
- 30% Solution/Education Content
- 20% Case Studies/Success Stories
- 10% Industry News/Trends

---

## 7. Technical Architecture

### 7.1 V5 Tech Stack (Updated October 2025)

**🔗 See Also**: [`docs/2025-UPDATES.md`](./2025-UPDATES.md) for breaking changes & migration guide

#### Frontend Framework
- **Astro 5.x** - Static Site Generator with built-in i18n
  - **Why Astro**: Component-based architecture, excellent performance, native multi-language support
  - **Output**: Static HTML (no server required)
  - **Deployment**: VPS (own server, NOT Vercel)

#### Styling & Interactivity (⚠️ 2025 Updates)
- **Tailwind CSS v4** - Utility-first CSS framework
  - **Method**: `@tailwindcss/vite` plugin (NOT `@astrojs/tailwind` - deprecated)
  - **Config**: `@theme` directive in CSS (NOT tailwind.config.mjs)
  - **Setup**: `@import "tailwindcss"` in global.css
  - Custom theme matching design tokens
  - Auto-generated utilities from `@theme` block
- **Alpine.js 3.14.1** - Lightweight JavaScript (version pinned for production)
  - Tabs, carousels, mobile menu, language switcher
  - CDN delivery (no build step)
  - Version pinned (NOT `3.x.x` wildcard)

#### Hero Particle Animation
- **Vanilla JavaScript** - Custom particle system from V3
  - Canvas-based animation
  - No external library dependencies
  - Extracted from current working implementation

#### Multi-Language Architecture (CRITICAL)

**Strategy: Single Source, Multi-Language**

```
Principle: Components (shared) + Translations (separate)
```

**File Structure:**
```
src/
├── components/          # SHARED across FR/EN (write once)
│   ├── Hero.astro
│   ├── AITabs.astro
│   └── ServiceCards.astro
├── layouts/
│   └── BaseLayout.astro # Shared layout
├── pages/
│   ├── index.astro     # French (no /fr/ prefix)
│   ├── about.astro
│   ├── blog.html
│   └── en/             # English versions
│       ├── index.astro
│       └── about.astro
├── i18n/
│   ├── ui.ts           # All UI strings { fr: {...}, en: {...} }
│   ├── pricing.ts      # Dynamic pricing with IP detection
│   └── utils.ts        # Helper functions (useTranslations, etc.)
└── lib/
    └── particles/      # Hero particle system
```

**Astro i18n Configuration:**
```javascript
// astro.config.mjs
export default defineConfig({
  i18n: {
    locales: ['fr', 'en'],
    defaultLocale: 'fr',
    routing: {
      prefixDefaultLocale: false  // FR at root, EN at /en/
    }
  }
});
```

**Translation System (⚠️ 2025 Type-Safe Pattern):**
- All text in TypeScript files (`src/i18n/ui.ts`)
- **Type-safe with `as const`** → compile-time validation
- **Autocomplete** for all translation keys (TypeScript)
- 140+ strings translated (FR + EN complete)
- Components reference keys, not hardcoded text

```ts
// src/i18n/ui.ts (2025 pattern)
export const ui = {
  fr: { 'nav.home': 'Accueil' },
  en: { 'nav.home': 'Home' }
} as const;  // ← Type-safe literal types

export type UIKeys = keyof typeof ui['fr'];  // ← Autocomplete
```

**Workflow:**
- Change design/layout → Edit ONE Astro component → Both languages update
- Change French text → Edit `ui.ts` French object → TypeScript validates
- Change English text → Edit `ui.ts` English object → TypeScript validates
- Missing translation → **Compile error** (not runtime error)

#### Dynamic Pricing (IP-Based Currency)

**Requirements:**
- Detect user country via IP
- Display appropriate currency (EUR/CHF/AED/USD)
- Allow manual override (localStorage/cookie)

**Implementation:**
```
Country Detection:
- Switzerland (CH) → CHF
- UAE (AE) → AED
- Europe (FR, BE, DE, IT, ES, etc.) → EUR
- Others → USD (fallback)

Detection Method:
- VPS: ipapi.co free tier (1,000 req/day)
- Fallback chain: localStorage → IP API → browser lang → EUR default
```

**Pricing Tiers:**
```
Package              EUR      CHF      AED      USD
─────────────────────────────────────────────────────
Victoire Rapide    €1,900  CHF 1,850  AED 8,000  $2,100
Transformation     €4,500  CHF 4,400  AED 19,000 $4,900
Accélération       €9,000  CHF 8,800  AED 38,000 $9,900
```

---

#### 🔑 Critical 2025 Technology Updates

**The following BREAKING CHANGES have been applied to V5:**

1. **Tailwind CSS v4 Migration**
   - ❌ OLD: `@astrojs/tailwind` integration
   - ✅ NEW: `@tailwindcss/vite` plugin in `vite.plugins[]`
   - ✅ NEW: `@theme` directive replaces `tailwind.config.mjs`

2. **Type-Safe i18n**
   - ❌ OLD: Plain translation objects, runtime errors
   - ✅ NEW: `as const` + TypeScript types = compile-time validation
   - ✅ NEW: Full autocomplete for all translation keys

3. **Native Astro i18n**
   - ❌ OLD: `astro-i18next` (archived/unmaintained)
   - ✅ NEW: Built-in Astro i18n (official, maintained)

**📖 Full migration guide**: See [`docs/2025-UPDATES.md`](./2025-UPDATES.md)

---

#### Content Management
- **Markdown Files** for blog articles
- **Astro Content Collections** for type-safe content
- **Git-based workflow** (no separate CMS initially)
- **Future**: Decap CMS if needed (Phase 2)

#### Blog → LinkedIn Integration

**MVP Approach (Manual with Template Generator):**

1. Write blog article in Markdown with LinkedIn metadata:
```yaml
---
title: "Article Title"
publishDate: 2025-01-20
linkedin:
  caption: |
    🚀 Custom LinkedIn caption
    Key points...
  hashtags: ["AI", "Automation", "Business"]
---
```

2. Run script to generate LinkedIn post template:
```bash
npm run linkedin:generate article-slug
# Outputs ready-to-paste caption + URL + hashtags
```

3. Manually copy/paste to LinkedIn

**Future Options:**
- Semi-automated: Browser automation to pre-fill LinkedIn composer
- Fully automated: LinkedIn API integration (Phase 3)

#### Lead Capture & Email Tools
- **Email Capture Forms**: Custom Astro components
- **Email Storage**: Initially CSV/Google Sheets, then ConvertKit/Mailchimp
- **Popups**: Custom Alpine.js components (no external library for MVP)
- **Future**: Sumo or similar (Phase 2)

#### Analytics Stack
- **Plausible Analytics** - Privacy-first metrics
- **Microsoft Clarity** - Free heat mapping
- **LinkedIn Insight Tag** - B2B tracking
- **Facebook Pixel** - Audience insights (optional)

### 7.2 Performance Requirements
- Lighthouse score > 90 for all metrics
- Page load time < 2 seconds
- Time to Interactive < 3 seconds
- Cumulative Layout Shift < 0.1
- Particle animation smooth (60fps)

---

## 8. Development Phases

### 8.1 Phase 1: MVP Launch (Day 1-2)
**Priority: Launch with core conversion elements**

#### Must-Have Features
- [ ] Homepage with hero, cases, process
- [ ] Blog with sidebar and lead magnet
- [ ] Basic "AI Assessment" lead magnet
- [ ] Exit intent popup (Sumo free)
- [ ] Language toggle (FR/EN)
- [ ] Calendly integration
- [ ] Mobile responsive design
- [ ] Basic legal pages
- [ ] Email capture to Google Sheets (temporary)

### 8.2 Phase 2: Conversion Enhancement (Week 1)
- [ ] 3 persona-specific lead magnets
- [ ] Scroll-triggered popup setup
- [ ] Email automation integration
- [ ] Microsoft Clarity heat mapping
- [ ] LinkedIn Insight Tag
- [ ] Facebook Pixel
- [ ] Blog content optimization
- [ ] Service-specific landing pages

### 8.3 Phase 3: Scale & Optimize (Week 2-4)
- [ ] A/B testing framework
- [ ] Advanced popup targeting
- [ ] Content recommendation engine
- [ ] IP-based pricing display
- [ ] CRM integration
- [ ] Advanced analytics dashboard
- [ ] Retargeting campaigns
- [ ] Custom domain setup

---

## 9. Success Metrics & KPIs

### 9.1 Launch Week Goals
- 50+ website visitors
- 10+ lead magnet downloads
- 3+ Calendly bookings
- 5% email capture rate
- Setup baseline metrics

### 9.2 Month 1 Goals
- 500+ unique visitors
- 30-40 email subscribers
- 15-20 qualified appointments
- 3-5% visitor-to-email conversion
- 30%+ email-to-appointment rate
- 4 blog articles published
- 10+ LinkedIn-attributed visits

### 9.3 Tracking Dashboard
- **Conversion Funnel**:
  - Visitors → Email Signups → Appointments
  - Popup conversion rates by type
  - Lead magnet performance
- **Content Performance**:
  - Top converting blog posts
  - Scroll depth by article
  - In-content CTA clicks
- **Source Attribution**:
  - LinkedIn vs organic vs direct
  - Campaign performance

---

## 10. Budget Considerations

### 10.1 Initial Costs (Minimal)
- Hosting: Vercel free tier
- CMS: Decap CMS (open source)
- Popups: Sumo free tier
- Analytics: Clarity (free) + Plausible trial
- Email: Mailchimp free (up to 500 contacts)
- Domain: Use subdomain initially

### 10.2 Scaling Costs (Monthly)
- Domain: ~€1-2/month
- Analytics: €9/month (Plausible)
- Email: €15-30/month (ConvertKit/Mailchimp)
- Hosting: €20/month (Vercel Pro)
- Popup tools: €39/month (Sumo Pro) - optional
- Total: ~€45-70/month when scaling

---

## 11. Launch Checklist

### Pre-Launch Conversion Setup
- [ ] Lead magnet PDF created and uploaded
- [ ] Email capture forms tested
- [ ] Popup tools installed and configured
- [ ] Analytics tracking verified
- [ ] Blog sidebar components ready
- [ ] All CTAs link correctly

### Launch Day
- [ ] Deploy to production
- [ ] Test all conversion points
- [ ] Verify popup triggers
- [ ] Submit sitemap
- [ ] Announce on LinkedIn with UTM tags
- [ ] Monitor real-time analytics

### Post-Launch Optimization
- [ ] Review heat maps after 100 visits
- [ ] A/B test popup messaging
- [ ] Optimize low-performing CTAs
- [ ] Create more targeted lead magnets
- [ ] Plan retargeting campaigns

---

## 12. Appendices

### A. Popup Copy Templates

#### Exit Intent
**Headline**: "Wait! Don't Leave Empty-Handed"  
**Subhead**: "Get your free AI Automation Assessment"  
**CTA**: "Send My Free Assessment"

#### Scroll Popup
**Headline**: "Enjoying This Article?"  
**Subhead**: "Get weekly automation tips delivered to your inbox"  
**CTA**: "Yes, Send Me Tips!"

### B. Lead Magnet Email Sequence
1. **Immediate**: Deliver lead magnet + welcome
2. **Day 3**: Case study + soft CTA
3. **Day 7**: Problem/solution article
4. **Day 14**: Invitation to book call

### C. Tools & Resources
- [Sumo Setup Guide](https://help.sumo.com/hc/en-us)
- [Microsoft Clarity](https://clarity.microsoft.com)
- [Facebook Pixel Helper](https://developers.facebook.com/docs/meta-pixel)
- [Email Template Library](https://reallygoodemails.com)

---

**Document Status**: Updated with Effortel-Inspired Design Specifications  
**Next Steps**: Clone Effortel structure and adapt content for AI services  
**Priority**: Maintain all animations and interactions from Effortel while customizing content  
**Design Note**: This PRD focuses on design and content mapping only - technical implementation uses existing Effortel codebase