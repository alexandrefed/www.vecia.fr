# Phase 9.1 Analytics Research: GA4 vs Plausible (2025)

**Research Date**: 2025-01-15
**Purpose**: Determine best analytics solution for Vecia website based on 2025 best practices, privacy requirements, and business needs.

---

## Executive Summary

Based on comprehensive 2025 research, here's the recommendation for Vecia:

**🎯 RECOMMENDED: Start with Plausible, Keep GA4 as Optional**

**Why this hybrid approach:**
- ✅ **Plausible for public-facing analytics** - Privacy-first, no consent banner, lightweight, GDPR-compliant by default
- ✅ **GA4 as optional power user tool** - For deep-dive analysis, marketing attribution, and advanced insights when needed
- ✅ **Best of both worlds** - Respect user privacy while maintaining analytical depth
- ✅ **Cost-effective** - Plausible at $9/month for starter tier is budget-friendly

---

## Research Findings

### 1. Google Analytics 4 (GA4) - 2025 State

#### ✅ Strengths

**Advanced Features:**
- Predictive analytics (purchase probability, churn prediction)
- Customer journey tracking across multiple touchpoints
- Deep integration with Google Ads and Google ecosystem
- Attribution modeling for multi-channel campaigns
- Machine learning insights
- Unlimited free tier
- Robust event tracking and custom dimensions

**2025 Improvements:**
- Google Consent Mode v2 (mandatory since March 2024)
- Enhanced granular consent controls
- Better privacy tools (IP anonymization, data retention controls)
- Improved server-side tagging for privacy
- Automatic trend detection
- Enhanced measurement features

#### ❌ Challenges & Requirements

**Privacy & Compliance (CRITICAL for EU/France):**
- **NOT automatically GDPR-compliant** - Requires extensive configuration
- **Cookie consent banner MANDATORY** - Must obtain explicit user consent
- **Consent Management Platform (CMP) required** - Additional tool/cost needed
- **Data transferred to US servers** - EU privacy concerns
- **Complex privacy setup** - Requires legal + technical expertise

**Technical Challenges:**
- **Heavy script weight** - Slows down page load (bad for SEO and UX)
- **Complex implementation** - Steep learning curve
- **2-month default data retention** - Must manually extend to 14 months
- **Setup complexity** - Easy to misconfigure and lose data
- **Requires Google Tag Manager** - Adds another layer of complexity

**Setup Requirements for 2025:**
```
Required Steps:
1. ✅ Install Google Tag Manager (GTM)
2. ✅ Configure Consent Mode v2
3. ✅ Integrate Consent Management Platform (e.g., Cookiebot, CookieYes)
4. ✅ Enable IP anonymization
5. ✅ Set data retention to 14 months (default is 2 months!)
6. ✅ Filter internal traffic
7. ✅ Configure privacy policy and cookie policy
8. ✅ Set up server-side tagging (recommended)
9. ✅ Regular audits for compliance
10. ✅ Team training on GA4
```

**Consent Management Platforms (Additional Cost):**
- Cookiebot: ~€25-50/month
- CookieYes: ~$10-30/month
- Termly: ~$10-40/month
- Beautiful Cookie Consent Banner (WordPress): Free plugin

**Total GA4 Cost:**
- GA4: Free
- GTM: Free
- CMP: $10-50/month
- Development time: 4-8 hours setup + ongoing maintenance
- Legal review: $500-2000 (GDPR compliance audit)

#### 🎯 Best Use Cases for GA4

- Enterprise with dedicated analytics team
- Heavy Google Ads spend (attribution modeling critical)
- Need customer journey across multiple channels
- Advanced segmentation and predictive analytics required
- Have legal/compliance team for GDPR setup
- Already have CMP infrastructure

---

### 2. Plausible Analytics - 2025 State

#### ✅ Strengths

**Privacy by Default:**
- **GDPR, CCPA, PECR compliant out-of-the-box** - No configuration needed
- **No cookies** - No consent banner required
- **No personal data collection** - Anonymous by design
- **24-hour visitor salt rotation** - Can't track users across days
- **EU-hosted servers** - Data stays in Europe (Estonia-based company)
- **Open-source** - Transparent code, can self-host

**Performance:**
- **Lightweight script: <3kb** - 45x smaller than GA4 (~130kb)
- **Minimal page load impact** - Better SEO, faster site
- **Fast, real-time dashboards** - No data sampling
- **One web stream per site** - Simple, clean data

**User Experience:**
- **Simple, clean interface** - Learn in 5 minutes
- **No learning curve** - Anyone can read reports
- **Public dashboard sharing** - Great for transparency
- **Email/Slack reports** - Automated insights
- **Goal conversions and funnels** - Track what matters
- **UTM tracking built-in** - Campaign attribution

**Business:**
- **Affordable pricing** - $9/month for 10k pageviews
- **Predictable costs** - No surprises
- **Quick setup** - 5-minute installation
- **Can self-host** - Full data ownership (open-source)
- **No vendor lock-in** - Export data anytime

#### ❌ Limitations

**Feature Gaps vs GA4:**
- **No customer journey tracking** - Can't see multi-channel paths
- **No Google Ads integration** - Separate attribution
- **Limited segmentation** - Basic filters only
- **No predictive analytics** - No ML-powered insights
- **Fewer integrations** - Smaller ecosystem
- **No custom dimensions** (limited custom properties available)
- **Basic event tracking** - Not as flexible as GA4

**Accuracy Considerations:**
- **Unique visitors count differently** - 24-hour salt rotation
- **Blocked by privacy extensions** - Less than GA4 due to non-invasive nature
- **No cross-day visitor tracking** - Privacy trade-off

#### 🎯 Best Use Cases for Plausible

- **Privacy-conscious brands** - Vecia fits this perfectly
- **EU-based businesses** - GDPR compliance is default
- **Content/blog-focused sites** - Track what matters
- **Small-medium businesses** - Simple analytics needs
- **Fast, lightweight sites** - Performance matters
- **No dedicated analytics team** - Easy to understand

---

### 3. Astro Integration - 2025 Best Practices

#### GA4 + GTM Integration with Astro

**Recommended Approach:**
```astro
---
// src/layouts/BaseLayout.astro
const { GA_MEASUREMENT_ID } = import.meta.env;
---

<!DOCTYPE html>
<html lang={lang}>
  <head>
    <!-- Google Tag Manager -->
    <script is:inline>
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','GTM-XXXXXXX');
    </script>
    <!-- End Google Tag Manager -->
  </head>
  <body>
    <!-- Google Tag Manager (noscript) -->
    <noscript>
      <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
      height="0" width="0" style="display:none;visibility:hidden"></iframe>
    </noscript>
    <!-- End Google Tag Manager (noscript) -->

    <slot />
  </body>
</html>
```

**With Astro View Transitions:**
```astro
---
import { ViewTransitions } from 'astro:transitions';
---

<head>
  <ViewTransitions />
  <!-- GTM script here -->
</head>

<script>
  // Re-trigger pageview on View Transitions navigation
  document.addEventListener('astro:page-load', () => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'page_view');
    }
  });
</script>
```

**Environment Variables (.env):**
```env
PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
PUBLIC_GTM_ID=GTM-XXXXXXX
```

#### Plausible Integration with Astro

**Simple Script Integration:**
```astro
---
// src/layouts/BaseLayout.astro
const { PUBLIC_PLAUSIBLE_DOMAIN } = import.meta.env;
---

<!DOCTYPE html>
<html lang={lang}>
  <head>
    <!-- Plausible Analytics -->
    <script
      defer
      data-domain={PUBLIC_PLAUSIBLE_DOMAIN}
      src="https://plausible.io/js/script.js"
    ></script>
    <!-- End Plausible Analytics -->
  </head>
  <body>
    <slot />
  </body>
</html>
```

**With Custom Events:**
```astro
<script>
  // Track custom events
  document.addEventListener('astro:page-load', () => {
    // Works with View Transitions
    if (typeof window.plausible !== 'undefined') {
      window.plausible('pageview');
    }
  });

  // Track button clicks
  document.querySelectorAll('[data-event]').forEach(el => {
    el.addEventListener('click', (e) => {
      const eventName = e.target.dataset.event;
      window.plausible(eventName);
    });
  });
</script>
```

**Environment Variables (.env):**
```env
PUBLIC_PLAUSIBLE_DOMAIN=vecia.com
```

---

### 4. Competitive Analysis: Other Privacy-Focused Options

#### Fathom Analytics
- **Price**: $15/month (1M data points)
- **Privacy**: GDPR-compliant, no cookies
- **Pros**: Beautiful UI, great UX, email reports
- **Cons**: Not open-source, pricier than Plausible
- **Best for**: Premium brands wanting simplicity

#### Simple Analytics
- **Price**: $9/month (100k pageviews)
- **Privacy**: GDPR-compliant, no cookies
- **Pros**: Very simple, clean
- **Cons**: Limited features, not open-source
- **Best for**: Minimalists

#### Umami
- **Price**: Free (self-hosted)
- **Privacy**: GDPR-compliant, open-source
- **Pros**: Completely free, self-hosted, unlimited
- **Cons**: Requires technical setup, hosting costs
- **Best for**: Developers comfortable with self-hosting

#### Matomo (formerly Piwik)
- **Price**: €19/month or self-hosted (free)
- **Privacy**: GDPR-compliant, open-source
- **Pros**: Most feature-rich GA alternative, enterprise-ready
- **Cons**: More complex than Plausible, heavier script
- **Best for**: Enterprise needing GA-level features with privacy

**Why Plausible Wins for Vecia:**
- ✅ Best balance of features, price, and simplicity
- ✅ Open-source (can self-host later if needed)
- ✅ Lightweight script (performance matters for Vecia)
- ✅ EU-hosted by default (GDPR compliance)
- ✅ Active development and community
- ✅ Beautiful, simple dashboards (not overwhelming)

---

## Decision Framework for Vecia

### Business Context
- **Industry**: B2B enterprise automation/AI
- **Target market**: France/EU (privacy-sensitive)
- **Website type**: Content marketing + lead generation
- **Team size**: Small (no dedicated analytics team)
- **Budget**: Startup/SME (cost-conscious)
- **Privacy stance**: Strong (Vecia helps enterprises with automation - privacy is brand-aligned)

### Key Requirements
1. ✅ **GDPR compliance** - Non-negotiable for EU business
2. ✅ **No cookie consent banner** - Better UX, higher conversion
3. ✅ **Fast page load** - SEO and UX critical
4. ✅ **Simple to use** - No analytics specialist on team
5. ✅ **Cost-effective** - Under $50/month
6. ✅ **Track blog engagement** - Main content type
7. ✅ **Track conversions** - Contact form, demos
8. ✅ **UTM campaign tracking** - LinkedIn, email campaigns

### Recommendation Matrix

| Requirement | GA4 | Plausible | Winner |
|------------|-----|-----------|--------|
| GDPR compliance | ❌ Requires setup | ✅ Default | Plausible |
| No consent banner | ❌ Required | ✅ Not needed | Plausible |
| Fast page load | ❌ Heavy (~130kb) | ✅ Light (~3kb) | Plausible |
| Simple to use | ❌ Complex | ✅ Simple | Plausible |
| Cost | ✅ Free (+ CMP $10-50) | ✅ $9/month | Tie |
| Blog tracking | ✅ Advanced | ✅ Sufficient | Tie |
| Conversion tracking | ✅ Advanced | ✅ Goal tracking | Tie |
| UTM tracking | ✅ Advanced | ✅ Built-in | Tie |
| Advanced features | ✅ Extensive | ❌ Limited | GA4 |
| Setup time | ❌ 4-8 hours | ✅ 5 minutes | Plausible |

**Score**: Plausible 6 | GA4 1 | Tie 3

---

## Final Recommendation: Hybrid Approach

### Phase 9.1 Implementation Plan

**Primary: Plausible Analytics**
- ✅ Install Plausible as main analytics
- ✅ No consent banner needed
- ✅ Track all public metrics
- ✅ Share dashboard publicly for transparency (brand win!)
- ✅ Setup: 5-10 minutes

**Optional: GA4 (for deep-dive only)**
- ✅ Install GA4 with proper consent management
- ✅ Only loads if user consents via cookie banner
- ✅ Used for deep marketing analysis when needed
- ✅ Not required for day-to-day decisions
- ✅ Setup: 2-3 hours (Phase 9.2 or later)

### Implementation Steps

#### Step 1: Plausible Setup (Phase 9.1 - 30 minutes)

**1.1 Create Plausible Account**
- Go to plausible.io
- Sign up for $9/month plan (10k pageviews)
- Add domain: `vecia.com`
- Get tracking script

**1.2 Add to Astro BaseLayout**
```astro
---
// src/layouts/BaseLayout.astro
const { PUBLIC_PLAUSIBLE_DOMAIN } = import.meta.env;
---

<head>
  <!-- Plausible Analytics -->
  <script
    defer
    data-domain={PUBLIC_PLAUSIBLE_DOMAIN}
    src="https://plausible.io/js/script.js"
  ></script>
</head>
```

**1.3 Environment Variables**
```env
# .env
PUBLIC_PLAUSIBLE_DOMAIN=vecia.com
```

**1.4 Configure Goals**
In Plausible dashboard, add goals:
- Contact form submission: `/contact/success` pageview
- Demo request: Custom event `Demo Request`
- Blog engagement: Scroll depth 75%
- Newsletter signup: Custom event `Newsletter Signup`

**1.5 Test**
- Visit website
- Check Plausible dashboard (real-time)
- Verify events firing

**Total time**: 30 minutes
**Cost**: $9/month

#### Step 2: GA4 Setup (Optional - Phase 9.2 or later - 3 hours)

Only implement if you need:
- Deep customer journey analysis
- Google Ads attribution
- Predictive analytics
- Advanced segmentation

**Requirements:**
- Google Analytics account
- Google Tag Manager account
- Consent Management Platform (CookieYes recommended - $10/month)
- Cookie policy page
- Privacy policy update

**See GA4 implementation guide** in separate document if needed.

---

## Cost Comparison

### Option 1: Plausible Only (RECOMMENDED)
- **Plausible**: $9/month ($108/year)
- **Setup time**: 30 minutes
- **Maintenance**: None
- **GDPR compliance**: Included
- **Total Year 1**: $108

### Option 2: GA4 Only
- **GA4**: Free
- **Consent Management Platform**: $10-50/month ($120-600/year)
- **Setup time**: 4-8 hours ($200-800 if hiring)
- **Legal review**: $500-2000 (one-time)
- **Maintenance**: Ongoing audits (2-4 hours/year)
- **Total Year 1**: $820-3400

### Option 3: Hybrid (Plausible + GA4)
- **Plausible**: $9/month ($108/year)
- **GA4**: Free
- **CMP**: $10/month ($120/year)
- **Setup time**: 1 hour Plausible + 4 hours GA4
- **Legal review**: $500-2000 (one-time)
- **Total Year 1**: $728-2228

**Winner**: Plausible only at $108/year

---

## Metrics to Track (Plausible-Based)

### Blog Performance
- **Top pages** - Which articles get most traffic
- **Time on page** - Engagement level
- **Bounce rate** - Content quality indicator
- **Exit pages** - Where visitors leave

### Traffic Sources
- **Referrers** - Where visitors come from
- **UTM campaigns** - LinkedIn, email, ads performance
- **Direct traffic** - Brand awareness
- **Search engines** - SEO effectiveness

### Conversions
- **Goal completions**:
  - Contact form: `/contact/success`
  - Demo requests: Custom event
  - Newsletter signups: Custom event
  - Blog shares: Custom event (if implemented)

### Geographic
- **Countries** - Market penetration
- **Cities** - Regional focus

### Technology
- **Browsers** - Testing priority
- **Devices** - Mobile vs desktop
- **Screen sizes** - Design optimization

### Engagement
- **Visit duration** - Overall engagement
- **Pages per session** - Content depth
- **Return visitors** - Brand loyalty

---

## Privacy Comparison

### GA4 Privacy Concerns
❌ **Collects personal data** (IP, device ID, cookies)
❌ **Requires explicit consent** (GDPR Article 6)
❌ **Data transferred to US** (Schrems II concerns)
❌ **Cookie-based tracking** (invasive)
❌ **Complex to configure** (easy to violate GDPR)
❌ **User profiling** (across Google services)
❌ **Data retention** (up to 14 months)

### Plausible Privacy Strengths
✅ **No personal data collection** (anonymous by design)
✅ **No consent required** (GDPR Article 6(1)(f) - legitimate interest)
✅ **Data stays in EU** (Estonia-based servers)
✅ **No cookies** (100% cookie-free)
✅ **Simple compliance** (GDPR/CCPA out-of-box)
✅ **No user profiling** (24-hour salt rotation)
✅ **Transparent** (open-source code)

**For Vecia's brand**: Plausible aligns with privacy-conscious enterprise values.

---

## Migration Path

### If Starting Fresh (Now - Phase 9.1)
1. ✅ Install Plausible immediately
2. ✅ Track for 3-6 months
3. ✅ Evaluate if GA4 needed
4. ✅ Add GA4 only if clear business case

### If Adding GA4 Later (Phase 9.2+)
1. ✅ Keep Plausible as primary
2. ✅ Add GA4 with consent management
3. ✅ Compare data quality for 1 month
4. ✅ Decide which to keep/both

### Self-Hosting Plausible (Future)
- If traffic grows significantly (>100k/month)
- Self-hosting costs: $10-20/month VPS
- One-time setup: 2-4 hours
- Full data ownership
- Unlimited pageviews

---

## Technical Implementation Details

### Plausible Custom Events (Advanced)

```astro
---
// src/components/ContactForm.astro
---

<form id="contact-form">
  <!-- form fields -->
  <button type="submit">Send</button>
</form>

<script>
  document.getElementById('contact-form').addEventListener('submit', (e) => {
    e.preventDefault();

    // Track custom event
    if (typeof window.plausible !== 'undefined') {
      window.plausible('Contact Form Submit', {
        props: {
          form: 'contact',
          page: window.location.pathname
        }
      });
    }

    // Submit form
    e.target.submit();
  });
</script>
```

### Plausible with Astro View Transitions

```astro
---
// src/layouts/BaseLayout.astro
import { ViewTransitions } from 'astro:transitions';
---

<head>
  <ViewTransitions />

  <!-- Plausible with manual pageviews for View Transitions -->
  <script
    defer
    data-domain="vecia.com"
    src="https://plausible.io/js/script.manual.js"
  ></script>
</head>

<script>
  // Trigger pageview on View Transitions navigation
  document.addEventListener('astro:page-load', () => {
    if (typeof window.plausible !== 'undefined') {
      window.plausible('pageview');
    }
  });
</script>
```

### Plausible Outbound Link Tracking

```astro
<head>
  <!-- Use Plausible's automatic outbound link tracker -->
  <script
    defer
    data-domain="vecia.com"
    src="https://plausible.io/js/script.outbound-links.js"
  ></script>
</head>
```

### Plausible File Download Tracking

```astro
<head>
  <!-- Track PDF, ZIP, etc downloads automatically -->
  <script
    defer
    data-domain="vecia.com"
    src="https://plausible.io/js/script.file-downloads.js"
  ></script>
</head>
```

### Combined Extensions

```astro
<head>
  <!-- All-in-one: manual pageviews + outbound links + file downloads -->
  <script
    defer
    data-domain="vecia.com"
    src="https://plausible.io/js/script.manual.outbound-links.file-downloads.js"
  ></script>
</head>
```

---

## Resources

### Official Documentation
- **Plausible Docs**: https://plausible.io/docs
- **GA4 Docs**: https://support.google.com/analytics/answer/10089681
- **Astro Integration**: https://docs.astro.build/en/guides/integrations-guide/

### Plausible Astro Integration
- **NPM Package**: `@astro-community/astro-embed-plausible`
- **Installation**: `npx astro add @astro-community/astro-embed-plausible`

### Consent Management (if going GA4 route)
- **CookieYes**: https://www.cookieyes.com (Recommended, $10/month)
- **Cookiebot**: https://www.cookiebot.com (~€25/month)
- **Termly**: https://termly.io ($10/month)

### Privacy Regulations
- **GDPR**: https://gdpr.eu
- **CCPA**: https://oag.ca.gov/privacy/ccpa
- **PECR** (UK): https://ico.org.uk/for-organisations/pecr/

### Research Sources (2025)
- Analytics Mania: GA4 Best Practices
- Plausible Blog: Time on Page Accuracy Study
- Matomo: Open-Source Analytics Comparison
- WP Statistics: Privacy-Focused Analytics Guide
- Various implementation guides (Astro + analytics)

---

## Action Items for Phase 9.1

- [ ] **Decision**: Confirm Plausible as primary analytics (recommended)
- [ ] **Budget**: Allocate $9/month for Plausible subscription
- [ ] **Setup**: Create Plausible account and add domain
- [ ] **Integration**: Add Plausible script to BaseLayout.astro
- [ ] **Configuration**: Set up goals (contact form, demo request)
- [ ] **Testing**: Verify tracking works in dev and production
- [ ] **Documentation**: Document setup in project docs
- [ ] **Monitor**: Check dashboard weekly for first month
- [ ] **Decide GA4**: Evaluate need for GA4 after 3 months (Phase 9.2 or skip)

**Estimated Time**: 30-60 minutes for Plausible setup
**Estimated Cost**: $9/month

---

## Conclusion

**For Vecia, Plausible is the clear winner:**

1. ✅ **Privacy-first** - Aligns with brand values
2. ✅ **GDPR compliant** - No legal headaches
3. ✅ **No consent banner** - Better UX, higher conversions
4. ✅ **Lightweight** - Fast page load, better SEO
5. ✅ **Simple** - Anyone can understand reports
6. ✅ **Affordable** - $9/month is startup-friendly
7. ✅ **Sufficient features** - Covers 90% of needs
8. ✅ **Quick setup** - Live in 30 minutes

**GA4 can wait** until there's a clear business case for advanced features like multi-channel attribution or predictive analytics.

**Next Step**: Proceed with Phase 9.1 implementation using Plausible.

---

**Last Updated**: 2025-01-15
**Research Phase**: Complete
**Recommendation**: Plausible Analytics (Primary) | GA4 (Optional Future)
**Implementation**: Phase 9.1 - Ready to proceed
