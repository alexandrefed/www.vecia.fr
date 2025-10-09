# Blog Workflow Guide

**Complete guide to creating, managing, and publishing blog posts on the Vecia website.**

**Last Updated:** January 2025
**Astro Version:** 5.14.1+

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Blog System Architecture](#blog-system-architecture)
3. [Creating a New Blog Post](#creating-a-new-blog-post)
4. [Frontmatter Reference](#frontmatter-reference)
5. [Writing Content](#writing-content)
6. [Image Management](#image-management)
7. [Local Testing](#local-testing)
8. [SEO Optimization](#seo-optimization)
9. [LinkedIn Integration](#linkedin-integration)
10. [Publishing Workflow](#publishing-workflow)
11. [Troubleshooting](#troubleshooting)

---

## Quick Start

**5-Minute Blog Post Creation:**

```bash
# 1. Create new blog post files (French + English)
touch src/content/blog/fr/my-article-slug.md
touch src/content/blog/en/my-article-slug.md

# 2. Copy frontmatter template (see below)
# 3. Write content in Markdown
# 4. Test locally
npm run dev

# 5. Preview at http://localhost:4321/blog
# 6. Commit and push
git add src/content/blog/
git commit -m "feat: Add new blog post - [Article Title]"
git push
```

---

## Blog System Architecture

### Directory Structure

```
src/
├── content/
│   ├── config.ts           # Content Collections schema
│   └── blog/
│       ├── fr/             # French blog posts
│       │   ├── article-1.md
│       │   └── article-2.md
│       └── en/             # English blog posts
│           ├── article-1.md
│           └── article-2.md
├── pages/
│   ├── blog.astro          # French blog homepage
│   ├── en/
│   │   └── blog.astro      # English blog homepage
│   └── blog/
│       └── [slug].astro    # Dynamic article template
└── components/blog/
    ├── BlogSidebar.astro   # Sidebar with lead magnet
    ├── BlogHeader.astro    # Article header
    ├── ArticleFooter.astro # Related posts + CTA
    └── ShareButtons.astro  # Social sharing
```

### File Naming Convention

**IMPORTANT:** File names become URL slugs automatically.

- ✅ **Good:** `how-to-automate-crm.md` → `/blog/how-to-automate-crm`
- ✅ **Good:** `5-automation-mistakes.md` → `/blog/5-automation-mistakes`
- ❌ **Bad:** `How to Automate CRM.md` (spaces, capitals)
- ❌ **Bad:** `article_final_v2.md` (underscores, generic name)

**Rules:**
- Use lowercase only
- Use hyphens (`-`) instead of spaces
- Keep URLs short and descriptive
- Match the slug between French and English versions
- No special characters (é, è, à, etc.)

**Example:**
```
src/content/blog/fr/automatiser-crm-2025.md
src/content/blog/en/automate-crm-2025.md
```

---

## Creating a New Blog Post

### Step 1: Plan Your Content

**Before writing, decide:**
- ✅ Primary language (French or English first?)
- ✅ Article category (see [Frontmatter Reference](#frontmatter-reference))
- ✅ Target audience (SMBs, enterprises, specific industry?)
- ✅ SEO keywords (for title, description, tags)
- ✅ Featured image (if needed)
- ✅ LinkedIn promotion strategy

### Step 2: Create Files

Create **both French and English versions** with matching slugs:

```bash
# Example: Article about CRM automation
touch src/content/blog/fr/automatiser-crm-2025.md
touch src/content/blog/en/automate-crm-2025.md
```

### Step 3: Add Frontmatter

Copy the appropriate template below:

#### French Template

```markdown
---
title: "Titre de l'Article en Français"
description: "Description concise de 140-160 caractères pour le SEO et les aperçus sociaux. Doit donner envie de cliquer."
publishDate: 2025-01-15
author: "Alexandre Fedotov" # or "Tanguy Dray" or "Équipe Vecia"
category: "quick-wins" # See category options below
tags: ["automatisation", "crm", "productivité", "no-code"]
featured: false # Set to true for homepage featured spot
image: "/images/blog/automate-crm-2025.jpg" # Optional cover image

# LinkedIn metadata (optional but recommended)
linkedin:
  caption: |
    🚀 Comment automatiser votre CRM et gagner 10h/semaine ?

    Dans notre dernier article, nous révélons :
    ✅ Les 5 tâches CRM à automatiser en priorité
    ✅ Les meilleurs outils no-code en 2025
    ✅ Un cas d'usage réel avec ROI mesurable

    👉 Lien dans les commentaires

    #Automatisation #CRM #Productivité #NoCode #B2B
  hashtags: ["Automatisation", "CRM", "Productivité", "NoCode", "B2B"]
---

# Titre Principal (H1)

Paragraphe d'introduction captivant...

## Sous-titre (H2)

Contenu de la section...

### Sous-sous-titre (H3)

Plus de détails...
```

#### English Template

```markdown
---
title: "Article Title in English"
description: "Concise 140-160 character description for SEO and social previews. Must be compelling."
publishDate: 2025-01-15
author: "Alexandre Fedotov" # or "Tanguy Dray" or "Vecia Team"
category: "quick-wins" # See category options below
tags: ["automation", "crm", "productivity", "no-code"]
featured: false # Set to true for homepage featured spot
image: "/images/blog/automate-crm-2025.jpg" # Optional cover image

# LinkedIn metadata (optional but recommended)
linkedin:
  caption: |
    🚀 How to automate your CRM and save 10h/week?

    In our latest article, we reveal:
    ✅ The 5 CRM tasks to automate first
    ✅ Best no-code tools in 2025
    ✅ Real use case with measurable ROI

    👉 Link in comments

    #Automation #CRM #Productivity #NoCode #B2B
  hashtags: ["Automation", "CRM", "Productivity", "NoCode", "B2B"]
---

# Main Title (H1)

Compelling introduction paragraph...

## Subheading (H2)

Section content...

### Sub-subheading (H3)

More details...
```

---

## Frontmatter Reference

### Required Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `title` | string | Article title (50-60 chars recommended) | `"5 Erreurs d'Automatisation à Éviter"` |
| `description` | string | SEO meta description (140-160 chars) | `"Découvrez les 5 erreurs courantes qui ruinent vos projets d'automatisation et comment les éviter."` |
| `publishDate` | date | Publication date (YYYY-MM-DD) | `2025-01-15` |
| `author` | string | Author name | `"Alexandre Fedotov"` |
| `category` | enum | Article category (see below) | `"quick-wins"` |
| `tags` | array | SEO tags (3-6 recommended) | `["automatisation", "crm", "no-code"]` |

### Optional Fields

| Field | Type | Description | Default |
|-------|------|-------------|---------|
| `featured` | boolean | Show as featured on homepage | `false` |
| `image` | string | Cover image path | `null` (placeholder shown) |
| `linkedin` | object | LinkedIn sharing metadata | `null` |
| `linkedin.caption` | string | LinkedIn post caption | - |
| `linkedin.hashtags` | array | LinkedIn hashtags | - |

### Category Options

**Choose ONE category that best fits your article:**

| Category | French Label | When to Use | Example Topics |
|----------|--------------|-------------|----------------|
| `why-broken` | "Pourquoi Cassé" | Identify problems with current systems | "Why Your Sales Process is Costing You Clients" |
| `success-stories` | "Succès Client" | Customer case studies and results | "How Acme Corp Saved 40h/week with AI Automation" |
| `quick-wins` | "Victoires Rapides" | Fast implementation guides | "Automate Your Email Responses in 30 Minutes" |
| `industry-deep-dives` | "Analyses Sectorielles" | Industry-specific automation | "Healthcare Automation: Compliance & Best Practices" |
| `tool-comparisons` | "Comparaisons d'Outils" | Tool reviews and comparisons | "Zapier vs Make vs n8n: Which Tool in 2025?" |

**Content Strategy Tips:**
- ⚡ **Quick Wins** = High volume, SEO-focused, actionable (Target: 1-2/week)
- 🎯 **Why Broken** = Problem-aware audience, top of funnel (Target: 1/month)
- 🏆 **Success Stories** = Social proof, bottom of funnel (Target: 1/quarter)
- 🔬 **Industry Deep Dives** = Authority building, long-form (Target: 1/month)
- 🛠️ **Tool Comparisons** = High-intent keywords, affiliate potential (Target: 1/month)

---

## Writing Content

### Markdown Syntax

The blog uses **standard Markdown** with Astro's built-in renderer.

#### Supported Elements

```markdown
# Heading 1 (H1) - Use once for main title
## Heading 2 (H2) - Main sections
### Heading 3 (H3) - Subsections

**Bold text** or __bold__
*Italic text* or _italic_
***Bold and italic***

[Link text](https://example.com)
![Alt text](/images/blog/image.jpg)

- Unordered list item
- Another item
  - Nested item

1. Ordered list item
2. Another item

> Blockquote for important notes or quotes

`inline code`

```javascript
// Code block with syntax highlighting
function automate() {
  console.log("Hello Vecia!");
}
```

---

Horizontal rule for section breaks

| Table | Syntax | Example |
|-------|--------|---------|
| Cell 1 | Cell 2 | Cell 3 |
```

#### Astro-Specific Features

**IMPORTANT:** Regular Markdown files do NOT support:
- ❌ Astro components inside Markdown
- ❌ JSX syntax
- ❌ Client-side JavaScript

**If you need interactive elements, convert to `.mdx` format** (requires `@astrojs/mdx` integration).

### Content Best Practices

#### Structure

1. **Hook (First 2-3 sentences):** Grab attention with a problem or surprising stat
2. **Preview (Next paragraph):** Tell readers what they'll learn
3. **Body (Multiple H2 sections):** Deliver value with clear structure
4. **Conclusion (Final section):** Summarize key takeaways
5. **CTA (Automatic):** ArticleFooter component adds CTA automatically

#### Writing Style

- ✅ **Use "vous" (formal) in French** - Professional B2B tone
- ✅ **Short paragraphs** - 2-4 sentences max
- ✅ **Bullet points** - Break up text for scannability
- ✅ **Concrete examples** - Real numbers, real tools, real results
- ✅ **Action-oriented** - Tell readers what to DO
- ❌ **Avoid jargon** - Explain technical terms
- ❌ **No fluff** - Every sentence should add value

#### SEO Optimization

- ✅ **Primary keyword in H1** (title)
- ✅ **Primary keyword in first 100 words**
- ✅ **Secondary keywords in H2 headings**
- ✅ **Natural keyword density** (1-2% of content)
- ✅ **Internal links** to other Vecia pages/articles
- ✅ **External links** to authoritative sources
- ✅ **Alt text on images** with keywords

**Example:**
```markdown
# Comment Automatiser Votre CRM en 2025 [Primary keyword]

Automatiser votre CRM peut vous faire gagner 10 heures par semaine [keyword in intro]...

## Les 5 Meilleures Pratiques d'Automatisation CRM [Secondary keyword in H2]
```

---

## Image Management

### Adding Images

1. **Save images to public folder:**
   ```
   public/images/blog/your-article-slug.jpg
   ```

2. **Reference in frontmatter:**
   ```yaml
   image: "/images/blog/your-article-slug.jpg"
   ```

3. **Reference in content:**
   ```markdown
   ![Descriptive alt text](/images/blog/inline-image.jpg)
   ```

### Image Requirements

| Type | Dimensions | Format | Max Size | When to Use |
|------|-----------|--------|----------|-------------|
| Cover Image | 1200x630px | JPG/WebP | 200KB | Featured image in cards |
| Inline Image | 800-1200px wide | JPG/PNG/WebP | 150KB | Screenshots, diagrams |
| Social Share | 1200x630px | JPG | 100KB | Open Graph preview |

### Optimization Tips

**IMPORTANT:** Always optimize images before uploading.

```bash
# Compress with ImageOptim (Mac) or TinyPNG.com
# Convert to WebP for better compression
npx @squoosh/cli --webp auto your-image.jpg

# Resize to correct dimensions
convert input.jpg -resize 1200x630^ -gravity center -extent 1200x630 output.jpg
```

**Naming Convention:**
- ✅ `automate-crm-2025-hero.jpg` (descriptive, lowercase, hyphens)
- ✅ `workflow-diagram-step-3.png` (clear purpose)
- ❌ `IMG_1234.jpg` (generic)
- ❌ `Screenshot 2025-01-15 at 14.23.45.png` (too long)

### Alt Text Best Practices

```markdown
<!-- ❌ Bad: Generic or empty alt text -->
![Image](/images/blog/screenshot.png)
![Screenshot](/images/blog/screenshot.png)

<!-- ✅ Good: Descriptive with keywords -->
![Workflow automation dashboard showing 10 active automations](/images/blog/dashboard-screenshot.png)
![Comparison table of Zapier vs Make pricing plans 2025](/images/blog/tool-comparison.png)
```

---

## Local Testing

### Development Server

```bash
# Start dev server (hot reload enabled)
npm run dev

# Open in browser
open http://localhost:4321/blog

# Test article directly
open http://localhost:4321/blog/your-article-slug
```

### Testing Checklist

Before committing, verify:

**Functionality:**
- [ ] Article appears on `/blog` homepage
- [ ] Article opens at `/blog/[slug]` route
- [ ] Featured image displays correctly (or placeholder shown)
- [ ] Category badge shows correct label
- [ ] Author and date display correctly
- [ ] Reading time calculates correctly
- [ ] Share buttons work
- [ ] Related articles appear (ArticleFooter)

**Content:**
- [ ] Title displays without truncation
- [ ] Description is compelling and complete
- [ ] No markdown syntax visible (check for unescaped characters)
- [ ] Images load and are optimized
- [ ] Links work (internal and external)
- [ ] Code blocks have syntax highlighting

**Responsive Design:**
- [ ] Mobile (375px width) - Text readable, images fit
- [ ] Tablet (768px width) - Layout adapts correctly
- [ ] Desktop (1440px width) - Sidebar visible, proper spacing

**SEO:**
- [ ] Meta title in browser tab
- [ ] Meta description for social sharing
- [ ] Open Graph tags (check with debugger below)

### Testing Tools

```bash
# Type checking (TypeScript + Zod validation)
npm run astro check

# Build test (catches most issues)
npm run build

# Preview production build
npm run preview
```

**Browser DevTools:**
- Console: Check for errors (F12 → Console)
- Lighthouse: Run SEO/Performance audit (F12 → Lighthouse)
- Mobile view: Toggle device toolbar (Cmd+Shift+M)

**Social Share Preview:**
- Facebook Debugger: https://developers.facebook.com/tools/debug/
- LinkedIn Inspector: https://www.linkedin.com/post-inspector/
- Twitter Card Validator: https://cards-dev.twitter.com/validator

---

## SEO Optimization

### On-Page SEO Checklist

**Automated by Astro/Components:**
- ✅ Meta title (`<title>` tag from frontmatter)
- ✅ Meta description (`<meta name="description">`)
- ✅ Canonical URL (`<link rel="canonical">`)
- ✅ Open Graph tags (Facebook/LinkedIn preview)
- ✅ Twitter Card tags
- ✅ Structured data (JSON-LD schema.org Article)

**Your Responsibility:**
- [ ] **Keyword research** - Use SEMrush, Ahrefs, or Google Keyword Planner
- [ ] **Title optimization** - 50-60 characters, primary keyword first
- [ ] **Description optimization** - 140-160 characters, call to action
- [ ] **Heading structure** - H1 → H2 → H3 (no skipping levels)
- [ ] **Internal linking** - Link to 2-3 relevant Vecia pages
- [ ] **External linking** - 1-2 links to authoritative sources
- [ ] **Image alt text** - Descriptive with keywords
- [ ] **URL slug** - Short, lowercase, hyphens, keywords

### Keyword Strategy

**Primary Keyword = Main topic (high volume, medium difficulty)**

Example: "automate crm"
- Title: "Comment **Automatiser Votre CRM** en 2025"
- Meta Description: "Découvrez comment **automatiser votre CRM**..."
- H1: Same as title
- First 100 words: Include primary keyword naturally

**Secondary Keywords = Related topics (medium volume, low difficulty)**

Example: "crm automation tools", "best crm software"
- H2: "Les Meilleurs **Outils d'Automatisation CRM**"
- H2: "**Logiciels CRM** Recommandés en 2025"
- Throughout content: Sprinkle naturally

**Long-Tail Keywords = Specific queries (low volume, low difficulty)**

Example: "how to automate crm email follow-ups"
- H3: "**Automatiser les Follow-ups par Email** dans votre CRM"
- FAQ section: "Comment **automatiser les relances client** ?"

### Content Length Guidelines

| Article Type | Word Count | Reading Time | When to Use |
|--------------|-----------|--------------|-------------|
| Quick Win | 800-1200 | 4-6 min | Actionable guides, tutorials |
| Why Broken | 1200-1800 | 6-9 min | Problem-solution posts |
| Success Story | 1000-1500 | 5-8 min | Case studies |
| Industry Deep Dive | 2000-3000 | 10-15 min | Comprehensive guides |
| Tool Comparison | 1500-2500 | 8-12 min | Review posts |

**SEO Truth:** Longer content ranks better, BUT only if every word adds value. Quality > Quantity.

---

## LinkedIn Integration

### Automatic LinkedIn Caption Generation

The blog system includes LinkedIn metadata in frontmatter for easy social sharing.

#### Caption Formula

**B2B SaaS Hook Formula (Proven):**

```
🚀 [Hook Question/Statement]

[Preview of value - 3 bullet points with checkmarks]
✅ Benefit 1
✅ Benefit 2
✅ Benefit 3

[Social proof or urgency]
[Call to action]

👉 Link in comments

#Hashtag1 #Hashtag2 #Hashtag3 #Hashtag4 #Hashtag5
```

**Example:**

```yaml
linkedin:
  caption: |
    🚀 Votre équipe perd-elle 15h/semaine sur des tâches manuelles ?

    Dans notre dernier guide, nous révélons :
    ✅ Les 5 processus à automatiser en priorité
    ✅ Les outils no-code les plus rentables en 2025
    ✅ Un framework pour mesurer le ROI de vos automatisations

    Plus de 50 entreprises ont économisé 6 chiffres avec ces méthodes.

    👉 Lien complet dans les commentaires

    #Automatisation #ProductivitéEntreprise #NoCode #TransformationDigitale #B2BSaaS
  hashtags: ["Automatisation", "ProductivitéEntreprise", "NoCode", "TransformationDigitale", "B2BSaaS"]
```

### Hashtag Strategy

**Optimal:** 3-5 hashtags (LinkedIn algorithm change 2024)

**Format:**
1. **Primary Niche** (100K-500K followers) - e.g., #Automatisation
2. **Industry** (50K-200K followers) - e.g., #B2BSaaS
3. **Topic** (10K-100K followers) - e.g., #ProductivitéEntreprise
4. **Brand/Unique** (<10K followers) - e.g., #IAAgentique
5. **Campaign** (if applicable) - e.g., #AutomatisationQuébec

**Tools:**
- LinkedIn Hashtag Analytics (check follower count)
- Hashtagify.me (trending hashtags)
- Competitor analysis (what hashtags do competitors use?)

### LinkedIn Publishing Workflow

**Option 1: Manual Post (Recommended)**

1. Copy `linkedin.caption` from frontmatter
2. Create LinkedIn post from your profile or company page
3. Paste caption
4. Add article link in **first comment** (LinkedIn algo prefers this)
5. Include cover image as post image
6. Tag relevant people if applicable

**Option 2: Automated with Script (Future Enhancement)**

```bash
# TODO: Create LinkedIn auto-post script
# Location: scripts/publish-to-linkedin.js
# Reads frontmatter, posts via LinkedIn API
npm run linkedin:publish -- --article=automate-crm-2025
```

**Best Posting Times (B2B):**
- Tuesday-Thursday: 8-10am, 12pm, 5-6pm (CET)
- Avoid: Weekends, Mondays before 9am, Fridays after 3pm

---

## Publishing Workflow

### Pre-Publish Checklist

**Before `git commit`, verify:**

**Content Quality:**
- [ ] Article provides clear value (would I share this?)
- [ ] No spelling/grammar errors (use Grammarly or LanguageTool)
- [ ] All links work (test each one)
- [ ] Images display correctly
- [ ] Code examples are tested and correct
- [ ] Facts and stats are sourced/accurate

**SEO:**
- [ ] Primary keyword in title, H1, first paragraph
- [ ] Meta description is compelling
- [ ] 2-3 internal links to Vecia pages
- [ ] Alt text on all images
- [ ] Proper heading hierarchy (H1 → H2 → H3)

**Technical:**
- [ ] Both French AND English versions created
- [ ] Frontmatter passes validation (`npm run astro check`)
- [ ] Article displays on `/blog` homepage
- [ ] Article route works (`/blog/[slug]`)
- [ ] Category filter works
- [ ] Search finds article

**LinkedIn:**
- [ ] LinkedIn caption is written
- [ ] Hashtags are relevant and optimized
- [ ] Cover image is social-media-ready (1200x630px)

### Git Commit

```bash
# Stage blog files
git add src/content/blog/fr/your-article.md
git add src/content/blog/en/your-article.md
git add public/images/blog/your-article-*.jpg # If images added

# Commit with descriptive message
git commit -m "feat: Add blog post - How to Automate Your CRM in 2025

- French and English versions
- Cover image optimized
- LinkedIn promotion metadata
- Internal links to pricing and use cases pages
"

# Push to main (or feature branch for review)
git push origin main
```

**Commit Message Format:**
```
feat: Add blog post - [Article Title]

- [Key detail 1]
- [Key detail 2]
- [Key detail 3]
```

### Post-Publish Tasks

**Within 1 hour:**
1. ✅ Verify live site displays article correctly
2. ✅ Test all links on live site
3. ✅ Post to LinkedIn (company page + personal profiles)
4. ✅ Add link in first comment of LinkedIn post

**Within 24 hours:**
1. ✅ Share in relevant LinkedIn groups (if applicable)
2. ✅ Email to newsletter subscribers (if applicable)
3. ✅ Add to Google Search Console for indexing
4. ✅ Monitor LinkedIn post engagement

**Within 1 week:**
1. ✅ Check Google Analytics for traffic
2. ✅ Monitor keyword rankings (SEMrush/Ahrefs)
3. ✅ Respond to LinkedIn comments
4. ✅ Add article to internal link library for future posts

### Content Calendar

**Recommended Publishing Frequency:**

| Priority | Type | Frequency | Est. Time |
|----------|------|-----------|-----------|
| P0 | Quick Wins | 1/week | 3-4h |
| P1 | Why Broken | 1/month | 4-5h |
| P1 | Tool Comparison | 1/month | 5-6h |
| P2 | Industry Deep Dive | 1/quarter | 8-10h |
| P2 | Success Story | 1/quarter | 4-5h |

**Total Commitment:** ~15-20h/month for consistent blog growth

---

## Troubleshooting

### Common Issues

#### Issue 1: Article Not Appearing on Blog Homepage

**Symptoms:** New article doesn't show on `/blog`

**Checklist:**
- [ ] File is in correct directory (`src/content/blog/fr/` or `src/content/blog/en/`)
- [ ] File extension is `.md` (not `.txt` or `.markdown`)
- [ ] Frontmatter is valid YAML (check spacing, colons, quotes)
- [ ] `publishDate` is not in the future
- [ ] Dev server has been restarted (`Cmd+C` then `npm run dev`)

**Fix:**
```bash
# Run Astro type checking
npm run astro check

# Check for specific errors in output
```

#### Issue 2: Frontmatter Validation Error

**Symptoms:** Error message like `"category" must be one of...` or `ZodError`

**Checklist:**
- [ ] All required fields present (title, description, publishDate, author, category, tags)
- [ ] `category` matches one of: `why-broken`, `success-stories`, `quick-wins`, `industry-deep-dives`, `tool-comparisons`
- [ ] `publishDate` format is `YYYY-MM-DD`
- [ ] `tags` is an array with square brackets: `["tag1", "tag2"]`
- [ ] No smart quotes (`""` instead of `""`
- [ ] YAML indentation is correct (2 spaces)

**Fix:**
```bash
# Validate YAML syntax
npm run astro check

# Or use online YAML validator
# https://www.yamllint.com/
```

#### Issue 3: Images Not Loading

**Symptoms:** Broken image icon or alt text displayed

**Checklist:**
- [ ] Image file exists in `public/images/blog/`
- [ ] Path in frontmatter/markdown starts with `/` (e.g., `/images/blog/image.jpg`)
- [ ] File name matches exactly (case-sensitive)
- [ ] Image format is supported (JPG, PNG, WebP, GIF)
- [ ] File size is reasonable (<500KB)

**Fix:**
```bash
# Verify file exists
ls -lh public/images/blog/

# Check path in browser DevTools Network tab
# Should return 200 (not 404)
```

#### Issue 4: Markdown Not Rendering

**Symptoms:** Markdown syntax visible in article (e.g., `**bold**` instead of **bold**)

**Checklist:**
- [ ] Frontmatter ends with `---` on its own line
- [ ] No missing closing characters (e.g., unclosed `**` for bold)
- [ ] Code blocks have proper opening and closing ` ``` `
- [ ] No special characters breaking parser (e.g., `<` or `>`)

**Fix:**
```bash
# Check for unclosed markdown elements
# Look for odd number of **, `, etc.
grep -o '\*\*' your-article.md | wc -l  # Should be even number
```

#### Issue 5: Category Filter Not Working

**Symptoms:** Clicking category filter doesn't show/hide articles

**Checklist:**
- [ ] Alpine.js is loaded (check browser console for errors)
- [ ] Article has `data-category` attribute in HTML (inspect in DevTools)
- [ ] Category value matches frontmatter exactly
- [ ] JavaScript is enabled in browser

**Fix:**
```bash
# Check browser console for Alpine.js errors
# Verify category value is correct
npm run astro check
```

#### Issue 6: LinkedIn Metadata Not Showing

**Symptoms:** LinkedIn preview shows wrong image/title/description

**Checklist:**
- [ ] Open Graph meta tags exist (view page source, search for `<meta property="og:`)
- [ ] Image path is absolute URL (not relative): `https://vecia.com/images/...`
- [ ] Image is at least 1200x630px
- [ ] Cache cleared on LinkedIn Post Inspector

**Fix:**
```bash
# Test Open Graph tags
curl -s https://vecia.com/blog/your-article | grep 'og:'

# Clear LinkedIn cache
# Visit: https://www.linkedin.com/post-inspector/
# Enter article URL and click "Inspect"
```

### Getting Help

**Internal Resources:**
1. Check `docs/ASTRO_REFERENCE.md` for Astro-specific issues
2. Check `docs/IMPLEMENTATION-PLAN.md` for blog system architecture
3. Review existing blog posts for examples

**External Resources:**
1. Astro Docs: https://docs.astro.build/en/guides/content-collections/
2. Astro Discord: https://astro.build/chat (active community)
3. GitHub Issues: https://github.com/withastro/astro/issues

**Report a Bug:**
```bash
# Create an issue with details
git add docs/BLOG-WORKFLOW.md # Include this file
git commit -m "docs: Add troubleshooting note for [issue]"
```

---

## Appendix: Example Workflow (Real Article)

### Scenario: Creating "5 CRM Automation Mistakes to Avoid"

**Goal:** Quick Win article targeting B2B companies struggling with CRM automation.

**Step 1: Research & Planning (30 min)**
- Keyword research: "crm automation mistakes" (300 searches/month, low difficulty)
- Competitor analysis: 3 existing articles found, none from 2025
- Outline: 5 mistakes + 1 bonus tip + real example + tool recommendations

**Step 2: Create Files (2 min)**
```bash
touch src/content/blog/fr/5-erreurs-automatisation-crm.md
touch src/content/blog/en/5-crm-automation-mistakes.md
```

**Step 3: Write French Version (90 min)**
```markdown
---
title: "5 Erreurs d'Automatisation CRM Qui Coûtent des Milliers d'Euros"
description: "Évitez ces 5 erreurs courantes qui ruinent vos projets d'automatisation CRM. Guide pratique avec exemples réels et solutions concrètes pour 2025."
publishDate: 2025-01-20
author: "Alexandre Fedotov"
category: "quick-wins"
tags: ["crm", "automatisation", "erreurs", "meilleures-pratiques", "no-code"]
featured: true
image: "/images/blog/crm-mistakes-2025.jpg"

linkedin:
  caption: |
    🚨 Votre automatisation CRM vous fait-elle PERDRE de l'argent ?

    5 erreurs que 80% des entreprises font :
    ✅ Automatiser trop tôt (avant d'optimiser le processus)
    ✅ Ignorer la qualité des données
    ✅ Ne pas former les équipes
    ✅ Choisir le mauvais outil
    ✅ Négliger la maintenance

    +1 BONUS : L'erreur fatale que personne ne vous dit

    👉 Guide complet dans les commentaires (lecture 6 min)

    #CRM #Automatisation #Productivité #B2B #TransformationDigitale
  hashtags: ["CRM", "Automatisation", "Productivité", "B2B", "TransformationDigitale"]
---

# 5 Erreurs d'Automatisation CRM Qui Coûtent des Milliers d'Euros

Vous avez investi dans un CRM. Vous avez configuré des automatisations. Mais au lieu de gagner du temps, vos équipes passent encore plus d'heures à corriger des erreurs...

**Sound familiar?**

Vous n'êtes pas seul. 67% des projets d'automatisation CRM échouent dans les 6 premiers mois. Pas parce que la technologie ne fonctionne pas, mais parce que ces 5 erreurs évitables ruinent tout.

Dans ce guide, vous découvrirez :
- Les 5 erreurs qui font échouer 80% des automatisations CRM
- Comment les détecter dans VOTRE système dès aujourd'hui
- Les solutions concrètes pour les corriger en moins d'une semaine

## Erreur #1 : Automatiser un Processus Cassé

**Le piège :** "Notre processus est inefficace, automatisons-le pour le réparer."

**La réalité :** Automatiser un mauvais processus le rend juste plus rapide à échouer.

### Comment le détecter
- Vos équipes contournent le processus "officiel"
- Le même prospect est contacté par 3 commerciaux différents
- Les données importantes se perdent entre les étapes

### La solution
1. **Mappez le processus actuel** (tel qu'il est, pas tel qu'il devrait être)
2. **Identifiez les points de friction** (où les équipes improvisent)
3. **Optimisez AVANT d'automatiser** (éliminez les étapes inutiles)

**Exemple réel :** Une entreprise de services B2B automatisait l'envoi de devis. Problème : les commerciaux créaient souvent 3-4 versions du même devis avant validation. Résultat ? 80% des devis envoyés automatiquement étaient obsolètes.

**Fix :** Ils ont d'abord optimisé le processus de validation (1 seul devis approuvé), PUIS automatisé l'envoi. Taux d'erreur : 90% → 2%.

[... Continue with remaining 4 mistakes ...]

## Erreur BONUS : Négliger le Plan de Maintenance

[... Bonus content ...]

## Prochaines Étapes : Auditez Votre CRM en 15 Minutes

Téléchargez notre checklist gratuite "CRM Automation Health Check" :
- ✅ 20 points de contrôle critiques
- ✅ Scoring automatique
- ✅ Plan d'action priorisé

[Bouton CTA dans ArticleFooter]

---

**Ressources mentionnées :**
- [Lien interne vers page Use Cases]
- [Lien vers outil recommandé]
- [Étude de cas citée]
```

**Step 4: Translate to English (60 min)**
```markdown
---
title: "5 CRM Automation Mistakes That Cost Thousands of Dollars"
description: "Avoid these 5 common mistakes that ruin CRM automation projects. Practical guide with real examples and concrete solutions for 2025."
publishDate: 2025-01-20
author: "Alexandre Fedotov"
category: "quick-wins"
tags: ["crm", "automation", "mistakes", "best-practices", "no-code"]
featured: true
image: "/images/blog/crm-mistakes-2025.jpg"

linkedin:
  caption: |
    🚨 Is your CRM automation LOSING you money?

    5 mistakes 80% of companies make:
    ✅ Automating too early (before optimizing the process)
    ✅ Ignoring data quality
    ✅ Not training teams
    ✅ Choosing the wrong tool
    ✅ Neglecting maintenance

    +1 BONUS: The fatal mistake no one tells you

    👉 Full guide in comments (6 min read)

    #CRM #Automation #Productivity #B2B #DigitalTransformation
  hashtags: ["CRM", "Automation", "Productivity", "B2B", "DigitalTransformation"]
---

[English translation of content...]
```

**Step 5: Add Cover Image (15 min)**
```bash
# Create cover image with Canva/Figma
# Template: 1200x630px
# Elements: Title + Visual metaphor (broken gears?) + Vecia branding

# Optimize image
npx @squoosh/cli --webp auto crm-mistakes-2025.jpg

# Save to public folder
mv crm-mistakes-2025.webp public/images/blog/crm-mistakes-2025.jpg
```

**Step 6: Local Testing (15 min)**
```bash
npm run dev
open http://localhost:4321/blog

# Verify:
# - Featured badge shows
# - Image displays
# - Category filter works
# - Both FR and EN versions render
# - No console errors
```

**Step 7: Commit & Push (5 min)**
```bash
git add src/content/blog/fr/5-erreurs-automatisation-crm.md
git add src/content/blog/en/5-crm-automation-mistakes.md
git add public/images/blog/crm-mistakes-2025.jpg
git commit -m "feat: Add blog post - 5 CRM Automation Mistakes to Avoid

- French and English versions
- Cover image optimized (WebP, 87KB)
- Featured article for homepage
- LinkedIn promotion metadata with hook formula
- Internal links to CRM use case page
"
git push origin main
```

**Step 8: LinkedIn Promotion (10 min)**
```
1. Copy linkedin.caption from frontmatter
2. Create LinkedIn post (Vecia company page)
3. Upload cover image
4. Post without link
5. Immediately add article link in first comment:
   "📖 Lire le guide complet : https://vecia.com/blog/5-erreurs-automatisation-crm"
6. Tag Alexandre Fedotov and Tanguy Dray
7. Schedule personal shares (Alexandre + Tanguy profiles) for +2h, +6h
```

**Step 9: Monitor & Engage (Ongoing)**
```
Day 1:
- Respond to LinkedIn comments within 1 hour
- Share in 2-3 relevant LinkedIn groups
- Add to Google Search Console

Day 7:
- Check LinkedIn analytics (impressions, clicks)
- Check Google Analytics (traffic, bounce rate)
- Add article to internal link library for future posts

Month 1:
- Check keyword ranking (SEMrush/Ahrefs)
- Update article if needed (new data, broken links)
- Consider related content (e.g., "Best CRM Tools 2025")
```

**Total Time:** ~4 hours (Research to Publish)

---

## Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2025-01-15 | 1.0.0 | Initial creation - Complete workflow guide |

---

**Need help?** Contact the Vecia team or check `docs/` for more guides.
