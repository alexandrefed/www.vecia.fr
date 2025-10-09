# Phase 8.3: Static Pages - Implementation Checklist

**Duration**: 2 hours
**Status**: Ready to implement
**Last Updated**: 2025-10-08

---

## 📋 Pre-Implementation Checks

### ✅ 2025 Best Practices Research
- [x] **GDPR/FADP 2025**: France, Switzerland (CHF 250k fines), UAE DIFC requirements
- [x] **AI Ethics Standards**: UNESCO principles, transparency, fairness, accountability
- [x] **About Page Design**: Story-driven, mission clarity, trust signals, clear CTA
- [x] **Design Consistency**: Match homepage gradients, typography, spacing

### 📝 User Input Required

**Company Legal Details** (for Privacy/Terms):
- [ ] Legal entity name: Vecia
- [ ] Registration country: `[X] France [ ] Switzerland [ ] UAE`
- [ ] Official company address: `14 Avenue du Trays, 06590 Théoule`
- [ ] Data controller contact: `contact@vecia.com` ✓

**Assets/Images**:
- [ ] Team photos available? `[X] Yes [ ] No - use placeholder`
- [ ] Company certifications/badges? `[ ] Yes [X] No`
- [ ] Logo variations needed? `[ ] Yes [X] No`

**Content Decisions**:
- [ ] About page team section: `[X] Full team [ ] Founders only [ ] Placeholder` (2 people, check 8.3-About-us.md)
- [ ] Terms jurisdiction: `[X] France [ ] Switzerland [ ] UAE`
- [ ] AI Ethics: Any specific commitments beyond standards? `No`
- [ ] Legal pages tone: `[X] Plain language [ ] Formal legal`

---

## 🎨 Design Consistency Guidelines

### Colors (from homepage)
- Primary gradient: `from-primary to-secondary` (#5B8BFF → #9B59F6)
- Accent gradient: `from-secondary to-accent1` (#9B59F6 → #3BB4FF)
- Background: `bg-background` (white)
- Text: `text-gray-700` for body

### Typography
- Headings: `font-heading font-bold` (Space Grotesk)
- Display: `text-4xl md:text-5xl lg:text-6xl`
- Body: `font-body` (Inter), `text-base md:text-lg`

### Spacing
- Section padding: `py-20`
- Container: `max-w-6xl mx-auto px-8`
- Cards: `rounded-lg p-6` with `shadow-lg`

### Buttons (match Hero CTAs)
- Primary: `bg-primary hover:bg-primary/90 hover:shadow-xl hover:-translate-y-1`
- Gradient: `bg-gradient-to-r from-secondary to-accent1 hover:scale-105`

---

## 📄 Files to Create (10 files)

### 1. About Page (30 min)
- [ ] `src/pages/about.astro` (French)
- [ ] `src/pages/en/about.astro` (English)

**Sections**:
- [ ] Hero: Mission statement with gradient headline
- [ ] Story: Why Vecia exists (problem → solution)
- [ ] Values: 3-4 core principles (cards with icons)
- [ ] Team: Placeholder or real photos
- [ ] AI Ethics: Link to dedicated page
- [ ] CTA: Book consultation

**Translation keys** (`src/i18n/ui.ts`):
```ts
about: {
  meta: { title, description },
  hero: { headline, subheadline },
  story: { title, paragraph1, paragraph2, paragraph3 },
  values: {
    title,
    value1: { icon, title, description },
    value2: { icon, title, description },
    value3: { icon, title, description },
    value4: { icon, title, description }
  },
  team: { title, placeholder },
  cta: { headline, body, button }
}
```

---

### 2. Privacy Policy (25 min)
- [ ] `src/pages/privacy.astro` (French)
- [ ] `src/pages/en/privacy.astro` (English)

**GDPR/FADP Required Sections**:
- [ ] **1. Introduction**: Data controller info
- [ ] **2. Data We Collect**:
  - [ ] IP address (currency detection - temporary)
  - [ ] Form data (name, email, company size)
  - [ ] localStorage (currency preference)
- [ ] **3. How We Use Data**: Service provision, analytics
- [ ] **4. Third-Party Services**:
  - [ ] Google Sheets (form storage)
  - [ ] Plausible Analytics (EU-hosted, GDPR)
  - [ ] Microsoft Clarity (heatmaps)
  - [ ] LinkedIn Insight Tag
  - [ ] Cal.com (booking - VPS)
- [ ] **5. Your Rights** (GDPR/FADP):
  - [ ] Right to access
  - [ ] Right to deletion
  - [ ] Right to correction
  - [ ] Right to portability
  - [ ] Right to opt-out
- [ ] **6. Data Retention**: Until service completion
- [ ] **7. Contact**: contact@vecia.com
- [ ] **8. Last Updated**: Date stamp

**Translation keys**:
```ts
privacy: {
  meta: { title, description },
  title: "Privacy Policy",
  lastUpdated: "Last Updated: [DATE]",
  intro: { title, company, controller },
  dataCollected: { title, ip, forms, localStorage },
  dataUse: { title, purpose },
  thirdParty: { title, list },
  rights: { title, access, deletion, correction, portability, optout },
  retention: { title, description },
  contact: { title, email }
}
```

---

### 3. Terms of Service (20 min)
- [ ] `src/pages/terms.astro` (French)
- [ ] `src/pages/en/terms.astro` (English)

**Sections**:
- [ ] **1. Acceptance**: Agreement by use
- [ ] **2. Services**: AI automation consulting
- [ ] **3. User Obligations**: Accurate info, no misuse
- [ ] **4. Intellectual Property**: Vecia owns content
- [ ] **5. Disclaimers**: "As-is" services
- [ ] **6. Liability**: Limited liability
- [ ] **7. Modifications**: Right to update
- [ ] **8. Governing Law**: Jurisdiction (France/Switzerland/UAE)
- [ ] **9. Contact**: Questions

**Translation keys**:
```ts
terms: {
  meta: { title, description },
  title: "Terms of Service",
  acceptance: { title, description },
  services: { title, description },
  obligations: { title, description },
  ip: { title, description },
  disclaimers: { title, description },
  liability: { title, description },
  modifications: { title, description },
  law: { title, description },
  contact: { title }
}
```

---

### 4. Cookie Policy (15 min)
- [ ] `src/pages/cookies.astro` (French)
- [ ] `src/pages/en/cookies.astro` (English)

**Sections**:
- [ ] **Good News**: No tracking cookies! 🎉
- [ ] **localStorage Usage**:
  - [ ] Currency preference (`vecia_currency`)
  - [ ] Browser-side only, no server storage
- [ ] **Analytics (Cookieless)**:
  - [ ] Plausible (no cookies, EU-hosted)
  - [ ] Microsoft Clarity (anonymized)
  - [ ] LinkedIn Insight Tag
- [ ] **How to Opt-Out**: Clear localStorage, browser extensions
- [ ] **Why No Cookies**: Privacy-first philosophy

**Translation keys**:
```ts
cookies: {
  meta: { title, description },
  title: "Cookie Policy",
  goodNews: { title, description },
  localStorage: { title, description, whatWeStore },
  analytics: { title, plausible, clarity, linkedin },
  optout: { title, steps },
  why: { title, description }
}
```

---

### 5. AI Ethics (30 min)
- [ ] `src/pages/ai-ethics.astro` (French)
- [ ] `src/pages/en/ai-ethics.astro` (English)

**UNESCO/IBM 2025 Principles**:
- [ ] **Hero**: "Our Commitment to Ethical AI"
- [ ] **Core Principles**:
  - [ ] Transparency: Disclosure when AI is used
  - [ ] Human-Centric: AI augments, doesn't replace
  - [ ] Privacy-First: Data minimization
  - [ ] Fairness: No discriminatory algorithms
  - [ ] Accountability: We're responsible
  - [ ] Sustainability: Energy-efficient AI
- [ ] **How We Apply This**:
  - [ ] Clear tool disclosure
  - [ ] No client data for AI training
  - [ ] Human review of recommendations
  - [ ] Opt-out rights
- [ ] **Our Promise**:
  - [ ] Never harm workers
  - [ ] Prioritize upskilling
  - [ ] Respect data sovereignty
- [ ] **Contact**: Open dialogue

**Translation keys**:
```ts
aiEthics: {
  meta: { title, description },
  hero: { headline, subheadline },
  principles: {
    title,
    transparency: { icon, title, description },
    humanCentric: { icon, title, description },
    privacy: { icon, title, description },
    fairness: { icon, title, description },
    accountability: { icon, title, description },
    sustainability: { icon, title, description }
  },
  application: { title, disclosure, noTraining, humanReview, optout },
  promise: { title, noHarm, upskilling, sovereignty },
  contact: { title, description }
}
```

---

## ✅ Implementation Steps

### Phase 1: Translation Keys (20 min)
- [ ] Add all translation keys to `src/i18n/ui.ts`
- [ ] Verify French translations are accurate
- [ ] Ensure English mirrors French structure

### Phase 2: About Page (30 min)
- [ ] Create hero section with gradient
- [ ] Add story section (3 paragraphs)
- [ ] Create values cards (4 items with icons)
- [ ] Add team placeholder section
- [ ] Add CTA section
- [ ] Test FR + EN versions

### Phase 3: Privacy Policy (25 min)
- [ ] Create structured legal content
- [ ] List all third-party services accurately
- [ ] Include GDPR/FADP user rights
- [ ] Add contact email
- [ ] Test FR + EN versions

### Phase 4: Terms of Service (20 min)
- [ ] Write clear, plain-language terms
- [ ] Specify jurisdiction
- [ ] Add disclaimers and liability limits
- [ ] Test FR + EN versions

### Phase 5: Cookie Policy (15 min)
- [ ] Celebrate no-cookie approach
- [ ] Explain localStorage usage
- [ ] List analytics tools
- [ ] Provide opt-out instructions
- [ ] Test FR + EN versions

### Phase 6: AI Ethics (30 min)
- [ ] Create principle cards with icons
- [ ] Explain application in practice
- [ ] Make promises clear and specific
- [ ] Test FR + EN versions

---

## 🧪 Testing Checklist

### Functionality
- [ ] All 10 pages render without errors
- [ ] Navigation footer links work correctly
- [ ] Internal links (About → AI Ethics) work
- [ ] CTAs link to correct destinations (Cal.com, contact)
- [ ] Language switcher works on all pages

### Design Consistency
- [ ] Gradients match homepage style
- [ ] Typography hierarchy consistent
- [ ] Button styles match Hero CTAs
- [ ] Spacing consistent (`py-20` sections)
- [ ] Cards use proper `rounded-lg` + `shadow-lg`

### Responsive Design
- [ ] Mobile (< 640px): Single column, readable text
- [ ] Tablet (640-1024px): Proper breakpoints
- [ ] Desktop (> 1024px): Max-width containers
- [ ] Large screens (> 1440px): Centered, not stretched

### Content
- [ ] All legal pages have required GDPR sections
- [ ] Third-party services accurately listed
- [ ] Contact emails correct
- [ ] Last updated dates present
- [ ] No lorem ipsum placeholders (unless intentional)

### SEO
- [ ] All pages have `<title>` tags
- [ ] Meta descriptions present
- [ ] Proper heading hierarchy (h1 → h2 → h3)
- [ ] Alt text for images (if any)

---

## 📝 Notes

**Placeholder Content**: If company details not ready, use:
- Company: "Vecia SAS" (placeholder)
- Address: "Paris, France" (generic)
- Jurisdiction: "France" (default)

**Can be updated later** before production launch.

**Legal Disclaimer**: These pages are based on GDPR/FADP best practices but should be reviewed by a lawyer before going live.

---

## ✅ Completion Criteria

- [ ] All 10 files created and working
- [ ] All translation keys added
- [ ] Design matches homepage consistency
- [ ] Mobile responsive
- [ ] Links functional
- [ ] No console errors
- [ ] Ready for Phase 8.4 (Blog System)

**Estimated Time**: 2 hours
**Actual Time**: `_____` hours

---

**Status**: [ ] Not Started [ ] In Progress [ ] Complete [ ] Needs Review
