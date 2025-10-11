# Phase 10 Start: SEO & Performance Optimization

## Context Summary
You are continuing work on Vecia V5 website. **Phase 9 (Analytics & Newsletter Popup) is COMPLETE.**

---

## Current Status
- **Phases 1-9**: ✅ Complete
- **Current Phase**: Phase 10 - SEO & Performance (3 hours)
- **Progress**: ~24/33 hours (75% complete)
- **Last Commit**: `37f4647` - Phase 9 complete with GA4, Cookie Consent, Newsletter Popup

---

## Phase 9 Achievements (Just Completed)
- ✅ Google Analytics 4 with Consent Mode V2 (Measurement ID: G-3RQR1S5ZK3)
- ✅ FREE GDPR-compliant cookie consent banner (custom, no dependencies)
- ✅ Newsletter popup with Alpine.js (smart timing + exit intent)
- ✅ Automated testing with Playwright MCP (60% coverage complete)
- ✅ Environment variable fix (Astro 5.x compatibility)
- 💰 **$0/month cost** (vs $60-130/month paid alternatives)

### Test Results Documentation
- `docs/PHASE-9-TEST-RESULTS.md` - 17,000 word comprehensive test report
- `docs/PHASE-9-IMPLEMENTATION.md` - 930+ line setup guide
- Test screenshots in `.playwright-mcp/` directory

---

## Known Issues from Phase 9 (Low Priority)
⚠️ **Production build blocked**: Requires SSR adapter for API routes (defer to Phase 12)
⚠️ **Newsletter form**: Email submission not fully tested (works in console)
⚠️ **Mobile**: Responsiveness not verified yet (expected to work)

---

## Your Task: Phase 10 - SEO & Performance Optimization

### 📋 MANDATORY: Pre-Phase Research (Read docs/PHASE-CHECKLIST.md)

**Before writing ANY code, search for 2025 best practices:**
```
1. "Astro SEO 2025 best practices"
2. "JSON-LD structured data 2025"
3. "Core Web Vitals 2025 requirements"
4. "Astro sitemap configuration 2025"
```

Report findings to user in format:
```
## Phase 10 Best Practices Check ✅
**Searched**: [list queries]
**Findings**: [summary of key updates]
**Changes Needed**: [Yes/No + what changed since our docs]
**Recommendation**: [proceed as planned / update approach]
```

**WAIT for user approval before coding.**

---

### Phase 10.1: SEO Implementation (2 hours)

#### 1. Sitemap Generation (15 min)
```bash
npx astro add sitemap
```

Update `astro.config.mjs`:
```javascript
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://vecia.com',
  integrations: [sitemap()],
});
```

**Verify**:
- Run `npm run build`
- Check `dist/sitemap-index.xml` exists
- Verify all pages included (FR + EN)

#### 2. Structured Data Enhancement (1 hour)

**Review existing implementation:**
- `src/layouts/BaseLayout.astro` already has Organization JSON-LD (lines 40-59)
- DO NOT duplicate this

**Create `src/components/seo/StructuredData.astro`:**
- Article schema for blog posts
- WebSite schema with search action
- BreadcrumbList schema for navigation

**Add to blog posts:**
```astro
<StructuredData
  type="article"
  data={{
    headline: post.data.title,
    datePublished: post.data.publishDate,
    author: post.data.author,
    // ...
  }}
/>
```

#### 3. robots.txt (15 min)

**Create `public/robots.txt`:**
```
User-agent: *
Allow: /

# Disallow test pages
Disallow: /test-*

# Sitemap
Sitemap: https://vecia.com/sitemap-index.xml
```

#### 4. Social Media Tags Verification (30 min)

**Check BaseLayout.astro (lines 79-94):**
- ✅ Open Graph tags already complete (8 tags)
- ✅ Twitter Card tags already present (5 tags)

**Missing:**
- Create `public/og-image.jpg` (1200x630px)
- Social media preview image for shares

---

### Phase 10.2: Performance Optimization (1 hour)

#### 1. Font Optimization (15 min)

**Check `src/layouts/BaseLayout.astro`:**
- Already has preconnect (line 100)
- Verify font-display strategy

**Add to `<head>` if missing:**
```astro
<link rel="preload" href="/fonts/SpaceGrotesk-Bold.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/Inter-Regular.woff2" as="font" type="font/woff2" crossorigin>
```

#### 2. Image Optimization (15 min)

**Task:**
- Convert images to WebP format
- Add `loading="lazy"` to below-fold images
- Implement responsive `srcset`

**Example:**
```astro
<img
  src="/images/hero.webp"
  srcset="/images/hero-480w.webp 480w, /images/hero-800w.webp 800w"
  sizes="(max-width: 768px) 480px, 800px"
  loading="lazy"
  alt="Hero image"
/>
```

#### 3. Bundle Analysis (15 min)

```bash
npm install -D rollup-plugin-visualizer
```

Add to `astro.config.mjs`:
```javascript
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  vite: {
    plugins: [
      visualizer({ open: true })
    ]
  }
});
```

**Run build and analyze:**
```bash
npm run build
# Check stats.html opens automatically
```

**Target**: < 500KB total JavaScript bundle

#### 4. Lighthouse Audit (15 min)

**Run Lighthouse on key pages:**
```bash
# Homepage (FR + EN)
# Blog homepage
# Sample blog article
# About page
```

**Success Criteria:**
- ✅ Performance: 90+
- ✅ Accessibility: 90+
- ✅ Best Practices: 90+
- ✅ SEO: 90+

**Core Web Vitals Targets:**
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

**If scores < 90:**
- Document issues
- Fix critical items
- Re-run audit

---

## What's Already Done (DON'T Duplicate)

### BaseLayout.astro SEO:
- ✅ Canonical URLs (line 30)
- ✅ hreflang alternates (FR, EN, x-default) (lines 73-77)
- ✅ Open Graph tags (8 tags) (lines 79-87)
- ✅ Twitter Card tags (5 tags) (lines 89-94)
- ✅ JSON-LD Organization schema (lines 40-59)
- ✅ Preconnect/DNS-prefetch (line 100)
- ✅ Mobile-first viewport (line 66)

### Performance:
- ✅ Partytown for GA4 (runs in web worker)
- ✅ Alpine.js lazy loaded
- ✅ Tailwind v4 optimized CSS

---

## Success Criteria

- [ ] Sitemap generated at `/sitemap-index.xml`
- [ ] JSON-LD Article schema on all blog posts
- [ ] WebSite schema with search action
- [ ] robots.txt configured correctly
- [ ] og-image.jpg created (1200x630px)
- [ ] Lighthouse Performance 90+ on all pages
- [ ] LCP < 2.5s, FID < 100ms, CLS < 0.1
- [ ] Bundle size < 500KB JavaScript
- [ ] All images lazy-loaded below fold
- [ ] Font preloading optimized

---

## Files to Read First

1. `docs/PHASE-CHECKLIST.md` - **MANDATORY pre-phase protocol**
2. `docs/IMPLEMENTATION-PLAN.md` (Phase 10 section, lines 1586-1728)
3. `docs/IMPLEMENTATION-STATUS.md` (updated status)
4. `src/layouts/BaseLayout.astro` - Review existing SEO
5. `docs/ASTRO_REFERENCE.md` - Astro patterns

---

## After Phase 10

**Phase 11: Quality & Auditing** (2 hours)
- Security audit (npm audit, CSP headers, input validation)
- Accessibility audit (WCAG AA compliance, keyboard nav)
- Code quality review (depcheck, bundle analysis)

**Phase 12: VPS Deployment** (2 hours)
- Nginx configuration with security headers
- SSL setup (Let's Encrypt)
- GitHub Actions CI/CD pipeline
- Production deployment

---

## Common Mistakes to Avoid

❌ **DON'T** duplicate existing SEO in BaseLayout
❌ **DON'T** skip pre-phase research (2025 updates are critical)
❌ **DON'T** add sitemap to git (auto-generated in dist/)
❌ **DON'T** over-optimize (target 90+, not 100)
❌ **DON'T** forget to test on multiple pages

✅ **DO** check existing implementation first
✅ **DO** run Lighthouse on all key pages
✅ **DO** document any issues found
✅ **DO** focus on Core Web Vitals
✅ **DO** use todo list to track progress

---

## Important Notes

- **Production build**: Still requires SSR adapter (defer to Phase 12)
- **Dev server**: Running at http://localhost:4321 (background process)
- **Git status**: Phase 9 committed, working tree clean
- **Next commit**: Will be Phase 10 implementation

---

## Ready to Start?

**Step 1:** Read `docs/PHASE-CHECKLIST.md`
**Step 2:** Research 2025 best practices (4 queries above)
**Step 3:** Report findings and WAIT for approval
**Step 4:** Begin implementation with todo list

**Prompt to use:**
```
I'm ready to start Phase 10 (SEO & Performance Optimization).

First, I'll check the PHASE-CHECKLIST.md and research 2025 best practices before coding.
```

---

**Generated**: 2025-01-15
**Context**: Vecia V5 - Phase 9 Complete, Phase 10 Next
**Time Estimate**: 3 hours total
**Risk**: Low (mostly configuration and optimization)
