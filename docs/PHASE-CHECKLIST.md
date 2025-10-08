# Phase Implementation Checklist
## Mandatory Pre-Phase Protocol for Claude Code

**Purpose**: Ensure 2025 best practices are verified before implementing each phase.

---

## 🚨 BEFORE STARTING ANY PHASE - MANDATORY STEPS

### Step 1: Read Documentation
- [ ] Read relevant section in `IMPLEMENTATION-PLAN.md`
- [ ] Review related reference docs (ASTRO-I18N-REFERENCE.md, TAILWIND-REFERENCE.md, ALPINEJS-REFERENCE.md)
- [ ] Understand the phase requirements completely

### Step 2: Research 2025 Best Practices
- [ ] **Search Tavily** for: `"[phase technology] 2025 best practices"`
  - Example: "Astro i18n 2025 best practices"
  - Example: "Tailwind CSS v4 2025 configuration best practices"
- [ ] **Search Context7** for latest library documentation
- [ ] Document findings in a brief summary

### Step 3: Compare & Validate
- [ ] Compare findings with IMPLEMENTATION-PLAN.md approach
- [ ] Identify any conflicts or newer methods
- [ ] Determine if plan needs updates

### Step 4: Report to User
- [ ] **REPORT FINDINGS** before implementing:
  ```
  ## Phase X Best Practices Check ✅

  **Searched**: [search queries used]
  **Findings**: [brief summary]
  **Changes Needed**: [Yes/No - list if yes]
  **Recommendation**: [proceed as planned / update approach]
  ```

### Step 5: Wait for Approval
- [ ] **WAIT** for user confirmation before proceeding
- [ ] Update plan if user requests changes

### Step 6: Update Todo List
- [ ] Mark "Research phase X best practices" as completed
- [ ] Move to implementation todos

---

## Phase-Specific Research Topics

### Phase 1: Foundation Setup
**Search Terms**:
- "Astro 5.x i18n 2025 best practices configuration"
- "Tailwind CSS v4 2025 setup Astro integration"
- "Alpine.js 3.x CDN vs npm 2025"

**Key Areas**:
- i18n routing strategy updates
- Tailwind v4 config changes
- Package versions and compatibility

---

### Phase 2: Design System
**Search Terms**:
- "Tailwind CSS v4 2025 theme customization @theme directive"
- "CSS custom properties vs Tailwind config 2025"
- "Design tokens best practices 2025"

**Key Areas**:
- @theme directive vs config file
- CSS variable naming conventions
- Performance optimization

---

### Phase 3: Content & Translation
**Search Terms**:
- "Astro i18n translation file structure 2025"
- "TypeScript type-safe i18n 2025 patterns"
- "AI translation tools 2025 accuracy"

**Key Areas**:
- Translation file organization
- Type safety approaches
- Translation automation tools

---

### Phase 4: Core Components ✅ NEARLY COMPLETE
**Search Terms**:
- "Astro component patterns 2025 best practices"
- "Alpine.js reactive components 2025"
- "Canvas animation performance 2025"
- "Lead capture form 2025 best practices" ✅
- "Scroll-driven animations 2025 CSS" ✅

**Key Areas**:
- Component composition ✅
- Props typing ✅
- Animation performance ✅
- Form UX and validation ✅
- Privacy compliance (GDPR) ✅

**Completed Components**:
1. ✅ Hero.astro - Particle animation system
2. ✅ Navigation.astro - Responsive nav with language toggle
3. ✅ LogosCarousel.astro - Infinite scroll carousel
4. ✅ ProductsCarousel.astro - Manual navigation carousel
5. ✅ AITabs.astro - Auto-rotating tabs with progress
6. ✅ BentoGrid.astro - Asymmetric grid layout
7. ✅ BusinessCases.astro - Scroll-driven stacked cards
8. ✅ LeadCaptureForm.astro - 3-field form with Google Sheets

**Remaining**:
- FinalCTA.astro (next)
- Footer.astro

---

### Phase 5: Layouts
**Search Terms**:
- "Astro layouts SEO 2025 best practices"
- "Meta tags hreflang 2025 standards"
- "Core Web Vitals 2025 requirements"

**Key Areas**:
- Layout structure
- SEO meta tags
- Performance optimization

---

### Phase 6: Pages Assembly
**Search Terms**:
- "Astro pages i18n 2025 structure"
- "Static site generation 2025 best practices"

**Key Areas**:
- Page organization
- Build optimization
- Route generation

---

### Phase 7: Dynamic Pricing
**Search Terms**:
- "IP geolocation 2025 privacy compliance"
- "Client-side location detection 2025 best practices"
- "GDPR IP detection 2025 requirements"

**Key Areas**:
- Privacy compliance
- API alternatives
- Fallback strategies

---

### Phase 8: Interactive Features
**Search Terms**:
- "Alpine.js 2025 performance patterns"
- "Accessibility interactive components 2025"
- "ARIA attributes 2025 standards"

**Key Areas**:
- Accessibility (a11y)
- Performance optimization
- Browser compatibility

---

### Phase 9: SEO & Polish
**Search Terms**:
- "SEO 2025 best practices static sites"
- "Structured data 2025 Google requirements"
- "Sitemap generation 2025 standards"

**Key Areas**:
- Schema.org updates
- Google algorithm changes
- Lighthouse score requirements

---

### Phase 10: VPS Deployment
**Search Terms**:
- "Static site VPS deployment 2025 best practices"
- "Nginx Astro 2025 configuration"
- "Let's Encrypt 2025 SSL setup"

**Key Areas**:
- Server configuration
- Security headers
- Caching strategies

---

## Enforcement Rules

### For Claude Code:
1. **NEVER skip Step 2** (Research 2025 Best Practices)
2. **ALWAYS report findings** to user before implementation (Step 4)
3. **WAIT for approval** before coding (Step 5)
4. If user says "Check phase checklist", immediately reference this file

### For User:
- Remind Claude: **"Check phase checklist"** if research is skipped
- Review findings before approving implementation
- Request plan updates if best practices have changed

---

## Quick Verification Questions

Before implementing, ask yourself:
1. ✅ Did I search Tavily for 2025 best practices?
2. ✅ Did I check Context7 for latest docs?
3. ✅ Did I report findings to the user?
4. ✅ Did I wait for user approval?

If any answer is **NO**, stop and complete the missed step.

---

## Example Research Report Template

```markdown
## Phase 3 Best Practices Check ✅

**Searched**:
- Tavily: "Astro i18n translation file structure 2025"
- Context7: /withastro/docs (i18n patterns)

**Findings**:
- ✅ Our approach aligns with 2025 standards
- ⚠️  New recommendation: Use Astro.glob() for dynamic imports
- 📌 TypeScript 5.6+ has better type inference for translations

**Changes Needed**:
- Minor: Update import pattern in ui.ts (5 min)

**Recommendation**:
Proceed with plan + minor TypeScript optimization

**Waiting for approval...**
```

---

**Last Updated**: 2025-10-05
**Status**: Mandatory reference before each phase
**Enforcement**: Multi-layered (Checklist + CLAUDE.md + Todo list)
