# Blog Workflow Guide

**Complete guide to creating, managing, and publishing blog posts on the Vecia website.**

**Last Updated:** January 2025
**Astro Version:** 5.14.1+

---

## Table of Contents

### Manual Workflow
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

### Agent-Based Workflow (Recommended)
12. [Agent Workflow Overview](#agent-workflow-overview)
13. [Complete Agent Workflow](#complete-agent-workflow)
14. [Agent Reference Guide](#agent-reference-guide)
15. [Memory KB Integration](#memory-kb-integration)
16. [Agent Workflow Examples](#agent-workflow-examples)

---

## ⚠️ TWO WORKFLOWS AVAILABLE

This guide documents **TWO ways** to create blog posts:

### Option 1: Manual Workflow (Sections 1-11)
- **Best for**: Quick updates, minor edits, single-author teams
- **Time**: 3-4 hours per article
- **Pros**: Full control, flexible, simple
- **Cons**: Manual repetition checking, no style enforcement, prone to duplication

### Option 2: Agent-Based Workflow (Sections 12-16) ✨ **RECOMMENDED**
- **Best for**: Consistent quality, multi-article production, style enforcement
- **Time**: 2-3 hours per article (with better quality)
- **Pros**: Automated style checking, Memory KB prevents repetition, scalable, maintains Vecia's aggressive tone
- **Cons**: Initial setup required (one-time)

**💡 TIP**: Use Agent Workflow for French articles (primary), then manual or agent translation for English versions.

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

## Agent Workflow Overview

The **Agent-Based Workflow** uses 7 specialized Claude Code agents to create high-quality, style-consistent blog articles with automated repetition prevention via Memory KB.

### Agent Pipeline Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                         AGENT WORKFLOW PIPELINE                        │
└────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐
│  USER REQUEST   │ Topic: "AI agents enterprise 2025"
│  (Topic Input)  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────┐
│ AGENT 1: blog-researcher (60-90 min)                                │
│ Tools: Tavily, Brave Search, WebFetch, Context7, Memory KB         │
│ Output: research-[topic]-2025.md                                    │
│ • Gathers 2025 statistics from McKinsey, Gartner, PwC             │
│ • Finds real case studies with metrics                             │
│ • Queries Memory KB to avoid duplicate examples                    │
└────────┬────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────┐
│ AGENT 3: blog-outliner (30-45 min)                                  │
│ Tools: Read, Write, Memory KB                                       │
│ Input: research-[topic]-2025.md                                     │
│ Output: outline-[topic].md                                          │
│ • Creates 6-section structure                                       │
│ • Suggests FRESH metaphors (checks Memory KB for DO-NOT-REUSE)     │
│ • Plans hooks, CTAs that haven't been used                         │
└────────┬────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────┐
│ AGENT 4: vecia-french-writer (60-90 min)                            │
│ Tools: Read, Write, Memory KB                                       │
│ Input: outline-[topic].md, research-[topic]-2025.md                │
│ Output: src/content/blog/fr/[slug].md                              │
│ • Writes 1200-1500 word article in Vecia's aggressive tone         │
│ • Uses fresh metaphors verified against Memory KB                  │
│ • Maintains forbidden/allowed language rules                        │
│ • Creates Astro-compatible Markdown with frontmatter               │
└────────┬────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────┐
│ AGENT 5: vecia-english-translator (45-60 min)                       │
│ Tools: Read, Write, Memory KB                                       │
│ Input: src/content/blog/fr/[slug].md                               │
│ Output: src/content/blog/en/[slug].md                              │
│ • Translates while maintaining aggressive tone                      │
│ • Adapts metaphors culturally if needed                            │
│ • Matches structure exactly (same H2 count, same lists)            │
└────────┬────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────┐
│ AGENT 6: blog-quality-checker (15-30 min)                           │
│ Tools: Read, Grep, Memory KB                                        │
│ Input: Both FR and EN articles                                      │
│ Output: quality-review-[slug].md                                    │
│ • Checks for forbidden words (putain, merde, crever)               │
│ • Validates no repeated metaphors/hooks/CTAs                        │
│ • Verifies frontmatter technical correctness                        │
│ • Reports: READY TO PUBLISH / NEEDS REVISION / MINOR TWEAKS        │
└────────┬────────────────────────────────────────────────────────────┘
         │
         ▼ (IF PASSED)
┌─────────────────────────────────────────────────────────────────────┐
│ MANUAL: Review, commit, publish                                     │
│ git add src/content/blog/                                           │
│ git commit -m "feat: Add blog post - [Title]"                      │
│ git push                                                            │
└────────┬────────────────────────────────────────────────────────────┘
         │
         ▼ (AFTER PUBLICATION)
┌─────────────────────────────────────────────────────────────────────┐
│ AGENT 7: blog-memory-updater (20-30 min)                            │
│ Tools: Read, Memory KB store/retrieve                               │
│ Input: Published src/content/blog/fr/[slug].md                     │
│ Output: Memory KB updated with 15-25 new entries                    │
│ • Stores all metaphors with DO-NOT-REUSE tag                       │
│ • Stores hook with DO-NOT-REUSE tag                                │
│ • Stores CTA with DO-NOT-REUSE tag                                 │
│ • Stores case studies, statistics, humor, confrontations           │
│ • Prevents future repetition                                        │
└─────────────────────────────────────────────────────────────────────┘
```

### One-Time Setup Agent

```
┌─────────────────────────────────────────────────────────────────────┐
│ AGENT 2: vecia-style-analyzer (30-45 min, ONE-TIME ONLY)            │
│ Tools: Read, Memory KB store                                        │
│ Input: Published articles from old blog                             │
│ Output: Memory KB populated with style patterns                     │
│ • Extracts tone characteristics                                     │
│ • Documents forbidden/allowed language                              │
│ • Stores all used metaphors, hooks, CTAs from existing articles    │
│ • Creates baseline Memory KB for consistency                        │
│                                                                      │
│ NOTE: Run ONCE after initial setup, or when analyzing new articles  │
└─────────────────────────────────────────────────────────────────────┘
```

### Benefits of Agent Workflow

**Consistency:**
- ✅ All articles maintain Vecia's aggressive tone
- ✅ Style rules enforced automatically (forbidden words blocked)
- ✅ Fresh metaphors every time (Memory KB prevents repetition)
- ✅ Bilingual quality parity (translator preserves tone)

**Quality:**
- ✅ 2025-current research (agents search latest sources)
- ✅ Real case studies with metrics (verified via research)
- ✅ SEO-optimized structure (consistent 6-section pattern)
- ✅ Automated QA checking before publication

**Efficiency:**
- ✅ Faster creation (2-3 hours vs 3-4 hours manual)
- ✅ Scalable (create multiple articles in parallel)
- ✅ Less cognitive load (agents handle repetitive checks)
- ✅ Memory KB tracks everything (no manual tracking needed)

**Learning:**
- ✅ Memory KB grows with each article
- ✅ Style consistency improves over time
- ✅ Duplicate prevention gets more robust
- ✅ Research patterns become more efficient

---

## Complete Agent Workflow

### Prerequisites (One-Time Setup)

**1. Verify Memory KB is Working**

```bash
# Check Memory KB health
# This happens via MCP - should show healthy status
# If not working, consult docs/claude-code-agents.md
```

**2. Run vecia-style-analyzer (One-Time)**

```bash
# In Claude Code, run this agent ONCE:
# "Run vecia-style-analyzer agent on published articles"
#
# This populates Memory KB with:
# - Tone rules
# - Forbidden/allowed language
# - Used metaphors from old blog
# - Used hooks, CTAs, case studies, statistics
#
# Output: ~35-40 baseline memories stored
```

**3. Verify Agent Files Exist**

```bash
ls -la .claude/agents/

# Should show:
# blog-researcher.md
# vecia-style-analyzer.md (already run)
# blog-outliner.md
# vecia-french-writer.md
# vecia-english-translator.md
# blog-quality-checker.md
# blog-memory-updater.md
```

---

### Full Workflow: Creating a Blog Article

**Example Topic:** "AI Agents in Enterprise: 5 Winning Strategies for 2025"

---

#### STEP 1: Research Phase (60-90 min)

**Run Agent:**
```
Run blog-researcher agent on topic "AI agents enterprise strategies 2025"
```

**Agent Will:**
1. Search Tavily, Brave Search, Context7 for 2025 data
2. Find statistics from McKinsey, Gartner, PwC (2025 sources)
3. Identify 3-5 real case studies with metrics
4. Query Memory KB to check for duplicate examples
5. Create `research-ai-agents-enterprise-strategies-2025.md`

**Expected Output File:**
```markdown
# Research Report: AI Agents Enterprise Strategies 2025

**Date**: 2025-01-15
**Category**: industry-deep-dives

## Key Statistics (2025)
- 79% of enterprises adopted agentic AI (PwC 2025)
- Only 17% integrated into core workflows (PwC)
- 40% of projects will be cancelled by 2027 (Gartner)
- [... 5-10 more statistics]

## Real-World Case Studies
### Case Study 1: UPS ORION
- Industry: Logistics
- Problem: Route optimization
- Solution: AI agents + driver training
- Results: $300M/year savings, 100M miles reduced
- Source: UPS Annual Report 2024

[... 3-4 more case studies]

## Latest Trends (2025)
1. Governance frameworks for AI agents
2. Interoperability between agent platforms
3. Human-in-the-loop design patterns

[... more content]
```

**Review:** Scan the research file, approve or request revisions.

---

#### STEP 2: Outline Phase (30-45 min)

**Run Agent:**
```
Run blog-outliner agent using research file "research-ai-agents-enterprise-strategies-2025.md"
```

**Agent Will:**
1. Read research file
2. Query Memory KB for used metaphors, hooks, CTAs
3. Create 6-section outline
4. Suggest FRESH metaphors (avoiding DO-NOT-REUSE entries)
5. Propose hook and CTA that haven't been used
6. Create `outline-ai-agents-enterprise-strategies.md`

**Expected Output File:**
```markdown
# Article Outline: AI Agents Enterprise Strategies 2025

## Metadata
- **Slug**: ia-agentique-entreprise-strategies-2025
- **Category**: industry-deep-dives
- **Target Length**: 1500 words
- **Primary Keyword**: "AI agents enterprise"

## Hook (Opening)
**Proposed**: "79% adoptent, 17% intègrent. Votre stratégie IA agentique va-t-elle rejoindre le cimetière des POCs abandonnés ?"

**Tone Check**: ✅ Aggressive, ✅ Statistics-based, ✅ NOT USED (checked Memory KB)

## Structure (6 Sections)

### Section 1: Le Problème - Pourquoi 83% Échouent
- Opening stat: 79% adoption, 17% integration (PwC)
- Why gap exists: governance, interoperability, change management
- Metaphor: [FRESH] "Form before weight" (gym: technique before adding load)
  - Checked Memory KB: NOT in DO-NOT-REUSE ✅
  - Maps to: Master governance BEFORE scaling agents

### Section 2: Stratégie 1 - Gouvernance Avant Scale
[... detailed outline]

[... Sections 3-6 continue]

## CTA (Closing)
**Proposed**: "Vous voulez pas que votre projet IA rejoigne les 40% qui vont se crasher d'ici 2027 ? Parlons-en."

**Tone Check**: ✅ Confrontational, ✅ Personal, ✅ NOT USED (checked Memory KB)
```

**Review:** Approve outline or request changes to structure/metaphors.

---

#### STEP 3: French Writing Phase (60-90 min)

**Run Agent:**
```
Run vecia-french-writer agent using outline "outline-ai-agents-enterprise-strategies.md" and research file
```

**Agent Will:**
1. Read outline and research
2. Query Memory KB for style guidelines
3. Write 1200-1500 word article in French
4. Use approved metaphors from outline
5. Maintain aggressive-but-professional tone
6. Cite all statistics with 2025 sources
7. Create Astro frontmatter
8. Save to `src/content/blog/fr/ia-agentique-entreprise-strategies-2025.md`

**Expected Output File:**
```markdown
---
title: "L'IA Agentique en Entreprise : 5 Stratégies Gagnantes pour 2025"
description: "79% adoptent, 17% intègrent. Découvrez les 5 stratégies pour réussir votre transformation IA agentique sans rejoindre le cimetière des POCs."
publishDate: 2025-01-15
author: "Alexandre Fedotov"
category: "industry-deep-dives"
tags: ["ia-agentique", "entreprise", "stratégies", "transformation-digitale", "gouvernance"]
featured: true
image: "/images/blog/ai-agents-enterprise-2025.jpg"

linkedin:
  caption: |
    🚨 79% des entreprises ont adopté l'IA agentique en 2025.

    Seules 17% l'ont vraiment intégrée.

    Pourquoi cet échec massif ?

    Dans notre analyse complète, nous révélons :
    ✅ Les 5 stratégies des 17% qui réussissent
    ✅ Les pièges qui tuent 83% des projets
    ✅ Un framework de gouvernance éprouvé
    ✅ 3 cas d'usage réels avec ROI mesurable

    Ne rejoignez pas les 40% de projets qui vont se crasher d'ici 2027.

    👉 Guide complet dans les commentaires (15 min de lecture)

    #IAAgentique #TransformationDigitale #IA #Entreprise #Innovation
  hashtags: ["IAAgentique", "TransformationDigitale", "IA", "Entreprise", "Innovation"]
---

# L'IA Agentique en Entreprise : 5 Stratégies Gagnantes pour 2025

79% des entreprises ont adopté l'IA agentique en 2025. Seules 17% l'ont vraiment intégrée dans leurs workflows principaux.

**Qu'est-ce qui sépare les gagnants des perdants ?**

Ce n'est pas la technologie. Ce n'est pas le budget. C'est la stratégie.

Dans ce guide, vous découvrirez les 5 stratégies que les 17% de succès ont en commun — et comment les appliquer sans claquer des millions pour rien.

## Le Problème : Pourquoi 83% Échouent

[... full article content follows ...]

## Conclusion

L'IA agentique n'est pas une question de technologie, c'est une question de stratégie.

Commencez petit, maîtrisez la gouvernance, formez vos équipes. Ou rejoignez les 40% de projets qui vont se crasher d'ici 2027.

Vous voulez pas que votre projet IA rejoigne les 40% qui vont se crasher d'ici 2027 ? Parlons-en.

---

**Pour aller plus loin :**
- [Lien vers cas d'usage IA agentique]
- [Lien vers guide gouvernance IA]
```

**Review:** Read the French article, check tone, verify statistics are cited.

---

#### STEP 4: English Translation Phase (45-60 min)

**Run Agent:**
```
Run vecia-english-translator agent on "src/content/blog/fr/ia-agentique-entreprise-strategies-2025.md"
```

**Agent Will:**
1. Read French article
2. Query Memory KB for tone patterns
3. Translate to English while maintaining aggressive tone
4. Adapt metaphors culturally if needed
5. Match structure exactly (same H2 count, same lists)
6. Save to `src/content/blog/en/agentic-ai-enterprise-strategies-2025.md`

**Expected Output File:**
```markdown
---
title: "Agentic AI in Enterprise: 5 Winning Strategies for 2025"
description: "79% adopt, 17% integrate. Discover the 5 strategies to succeed with agentic AI without joining the POC graveyard."
publishDate: 2025-01-15
author: "Alexandre Fedotov"
category: "industry-deep-dives"
tags: ["agentic-ai", "enterprise", "strategies", "digital-transformation", "governance"]
featured: true
image: "/images/blog/ai-agents-enterprise-2025.jpg"

linkedin:
  caption: |
    🚨 79% of enterprises adopted agentic AI in 2025.

    Only 17% truly integrated it.

    Why this massive failure rate?

    In our complete analysis, we reveal:
    ✅ The 5 strategies of the 17% that succeed
    ✅ The traps that kill 83% of projects
    ✅ A proven governance framework
    ✅ 3 real use cases with measurable ROI

    Don't join the 40% of projects that will crash by 2027.

    👉 Full guide in comments (15 min read)

    #AgenticAI #DigitalTransformation #AI #Enterprise #Innovation
  hashtags: ["AgenticAI", "DigitalTransformation", "AI", "Enterprise", "Innovation"]
---

# Agentic AI in Enterprise: 5 Winning Strategies for 2025

79% of enterprises adopted agentic AI in 2025. Only 17% truly integrated it into their core workflows.

**What separates the winners from the losers?**

It's not the technology. It's not the budget. It's the strategy.

In this guide, you'll discover the 5 strategies the 17% success stories have in common — and how to apply them without blowing millions for nothing.

[... full translated content follows ...]
```

**Review:** Compare French and English versions for structural match and tone consistency.

---

#### STEP 5: Quality Check Phase (15-30 min)

**Run Agent:**
```
Run blog-quality-checker agent on both "ia-agentique-entreprise-strategies-2025.md" (FR) and "agentic-ai-enterprise-strategies-2025.md" (EN)
```

**Agent Will:**
1. Read both FR and EN articles
2. Use Grep to search for forbidden words (putain, merde, crever)
3. Query Memory KB to check for repeated metaphors, hooks, CTAs
4. Validate frontmatter technical correctness
5. Check word count (1200-1500 target)
6. Verify bilingual consistency
7. Create `quality-review-ia-agentique-entreprise-strategies-2025.md`

**Expected Output File:**
```markdown
# Quality Review Report: ia-agentique-entreprise-strategies-2025

**Date**: 2025-01-15
**Reviewer**: blog-quality-checker agent
**Files Reviewed**: FR + EN

---

## 🔴 Critical Issues (MUST FIX)

None ✅

---

## 🟡 Warnings (SHOULD FIX)

### Content Quality
- ⚠️ Word count FR: 1612 words (target: 1200-1500, slightly over but acceptable)

---

## ✅ Passed Checks

### Language Compliance
- ✅ No forbidden words detected (checked: putain, merde, chier, foutre, crever)
- ✅ Appropriate use of allowed crude language ("branlant" used once in context)

### Repetition Prevention
- ✅ All metaphors are fresh (checked 8 used metaphors in Memory KB)
  - "Form before weight" gym metaphor → NOT in DO-NOT-REUSE ✅
- ✅ Hook is unique (checked against 2 used hooks)
- ✅ CTA is new approach (checked against 2 used CTAs)

### Frontmatter
- ✅ All required fields present
- ✅ Category valid: industry-deep-dives
- ✅ Date format correct: 2025-01-15
- ✅ 5 tags provided (target: 4-6)

### Content Quality
- ✅ 5 statistics cited with sources (all 2025)
- ✅ 3 case studies with metrics
- ✅ CTA is personal and engaging (not generic)

### Tone Compliance
- ✅ Aggressive edge maintained
- ✅ Personal voice present (first-person)
- ✅ Direct confrontation included ("rejoindre le cimetière des POCs")
- ✅ Self-deprecating humor present ("claquer des millions pour rien")

### Markdown Quality
- ✅ Pure Markdown (no HTML)
- ✅ Heading hierarchy correct (H1 → H2 → H3)
- ✅ Proper formatting throughout

### Bilingual Consistency
- ✅ Structure matches (FR ↔ EN): 6 H2 sections both
- ✅ Metadata matches (date, category, featured)
- ✅ Tone consistent across languages

---

## 📊 Statistics

**French Article:**
- Word count: 1612
- H2 sections: 6
- Statistics cited: 5 (all 2025 sources)
- Case studies: 3
- Metaphors: 2 (all fresh ✅)

**English Article:**
- Word count: 1589
- H2 sections: 6
- Statistics cited: 5
- Tone match: Yes ✅

---

## 🎯 Final Verdict

**Status**: READY TO PUBLISH ✅

**Summary**: Excellent quality article. One minor warning (word count slightly over target) but acceptable for in-depth analysis piece. All critical checks passed.

**Next Steps**:
- Review and commit to git
- Publish to production
- THEN run blog-memory-updater to store new examples

---

**Review Complete**
```

**Decision:**
- ✅ If **READY TO PUBLISH** → Proceed to Step 6
- ❌ If **NEEDS REVISION** → Fix issues, re-run quality checker
- ⚠️ If **MINOR TWEAKS** → Review warnings, optionally fix, then proceed

---

#### STEP 6: Manual Review & Publication (15-30 min)

**You review the files:**

```bash
# Open articles in editor
code src/content/blog/fr/ia-agentique-entreprise-strategies-2025.md
code src/content/blog/en/agentic-ai-enterprise-strategies-2025.md

# Test locally
npm run dev
open http://localhost:4321/blog

# Verify:
# - Article displays correctly
# - Featured badge shows
# - Category filter works
# - Both FR/EN versions render
```

**If satisfied, commit and push:**

```bash
git add src/content/blog/fr/ia-agentique-entreprise-strategies-2025.md
git add src/content/blog/en/agentic-ai-enterprise-strategies-2025.md
git commit -m "feat: Add blog post - Agentic AI Enterprise Strategies 2025

- French and English versions
- Industry deep dive category
- 5 winning strategies with real case studies
- 2025 statistics from PwC, Gartner
- Fresh gym metaphor (form before weight)
- LinkedIn promotion metadata with engagement hook
"
git push origin main
```

**Wait for deployment to complete** (GitHub Actions → VPS)

**Verify live:**
```bash
# Check live site
open https://vecia.com/blog/ia-agentique-entreprise-strategies-2025
open https://vecia.com/en/blog/agentic-ai-enterprise-strategies-2025
```

---

#### STEP 7: Post-Publication Memory Update (20-30 min)

**CRITICAL: Run AFTER publication only**

**Run Agent:**
```
Run blog-memory-updater agent on published article "src/content/blog/fr/ia-agentique-entreprise-strategies-2025.md"
```

**Agent Will:**
1. Read published French article
2. Extract all metaphors used
3. Extract hook, CTA
4. Extract case studies, statistics
5. Extract humor examples, confrontation phrases
6. Store in Memory KB with appropriate tags:
   - Metaphors → DO-NOT-REUSE
   - Hooks → DO-NOT-REUSE
   - CTAs → DO-NOT-REUSE
   - Case studies → used-case-study (can reuse with different angle)
   - Statistics → used-statistic (foundational can reuse)
   - Humor → DO-NOT-REUSE
   - Confrontations → REUSABLE-SPARINGLY
7. Create memory update report

**Expected Console Output:**
```markdown
## Memory KB Updated ✅

**Article**: L'IA Agentique en Entreprise : 5 Stratégies Gagnantes pour 2025
**Slug**: ia-agentique-entreprise-strategies-2025
**Date**: 2025-01-15
**Category**: industry-deep-dives

---

**Elements Stored:**

### Metaphors (DO-NOT-REUSE)
1. Form before weight (technique before adding load)
2. Training split (separating AI agents by function like push/pull/legs)
**Total**: 2 metaphors stored

### Hooks (DO-NOT-REUSE)
1. "79% adoptent, 17% intègrent. Votre stratégie IA agentique va-t-elle rejoindre le cimetière des POCs ?"
**Total**: 1 hook stored

### CTAs (DO-NOT-REUSE)
1. "Vous voulez pas que votre projet IA rejoigne les 40% qui vont se crasher d'ici 2027 ? Parlons-en."
**Total**: 1 CTA stored

### Case Studies
1. UPS ORION ($300M savings)
2. South American bank (WhatsApp PIX)
3. Manufacturing company (predictive maintenance)
**Total**: 3 case studies stored

### Statistics
1. 79% adoption, 17% integration (PwC 2025)
2. 40% projects cancelled by 2027 (Gartner)
3. 70% failures from people/process not tech (McKinsey 2024)
4. 53% cite security as challenge (Deloitte)
5. 15% autonomous decisions by 2028 (Forrester)
**Total**: 5 statistics stored

### Humor Examples (DO-NOT-REUSE)
1. "claquer des millions pour rien" (blow millions for nothing)
**Total**: 1 humor example stored

### Confrontation Phrases (REUSABLE-SPARINGLY)
1. "rejoindre le cimetière des POCs abandonnés" (join POC graveyard)
**Total**: 1 confrontation phrase stored

### Explained Concepts (find-new-angle)
1. AI agent governance - Used framework approach (policies, roles, accountability)
2. Interoperability - Compared to training different muscle groups
**Total**: 2 concepts stored

### Article Metadata
1. Published article metadata with topics (ia-agentique, entreprise, stratégies, gouvernance)

---

**Memory KB Status:**
- Total new memories added: 16
- All tagged appropriately for retrieval
- Ready for next article creation

**Next Article Will Avoid:**
- 2 used metaphors ✅
- 1 used hook ✅
- 1 used CTA ✅
- 1 exact duplicate humor ✅
```

**Verify Memory KB:**
```
# Test retrieval in Claude Code
"Query Memory KB for 'used metaphor form before weight'"

# Should return the newly stored metaphor entry
```

---

## WORKFLOW COMPLETE ✅

**Total Time:** 4-5 hours (Research → Publication → Memory Update)

**Next Steps:**
1. Promote on LinkedIn (copy `linkedin.caption` from frontmatter)
2. Monitor engagement
3. Plan next article (agents ready to go!)

---

## Agent Reference Guide

Quick reference for each agent's purpose, tools, inputs, and outputs.

### AGENT 1: blog-researcher

**Purpose:** Research specialist for gathering 2025 data, statistics, case studies, and trends.

**When to Use:**
- Starting a new blog article
- Need current data and examples
- Topic requires industry research

**Tools:**
- mcp__tavily-mcp__tavily-search
- mcp__brave-search__brave_web_search
- mcp__fetch__fetch
- mcp__context7__resolve-library-id
- mcp__context7__get-library-docs
- WebFetch
- Write
- mcp__mcp-kb-memory__retrieve_memory
- mcp__mcp-kb-memory__store_memory

**Input:**
- Topic description (from user)
- Optional: Target category, specific focus areas

**Output:**
- `research-[topic]-2025.md` file with:
  - Key statistics (5-10 entries with sources)
  - Real case studies (3-5 with metrics)
  - Latest trends (2025 specific)
  - Memory KB check results (duplicate prevention)

**Example Command:**
```
Run blog-researcher agent on topic "workflow automation best practices 2025"
```

**Tips:**
- Be specific with topic (helps agent focus research)
- Mention target category if known (quick-wins, industry-deep-dives, etc.)
- Agent will query Memory KB to avoid duplicate case studies

---

### AGENT 2: vecia-style-analyzer

**Purpose:** One-time setup agent to extract writing style from existing published articles and populate Memory KB.

**When to Use:**
- Initial setup (run once)
- After publishing new articles you want to analyze for patterns
- When updating style guidelines

**Tools:**
- Read
- mcp__mcp-kb-memory__store_memory
- mcp__mcp-kb-memory__retrieve_memory

**Input:**
- Published articles from old blog (Markdown files)
- `docs/Blog/BLOG_AGENTS_AND_ARTICLES_GUIDE.md` (legacy guide)

**Output:**
- Memory KB populated with:
  - Core style rules (6 entries)
  - Used metaphors (DO-NOT-REUSE tagged)
  - Used hooks (DO-NOT-REUSE)
  - Used CTAs (DO-NOT-REUSE)
  - Allowed/forbidden language patterns
  - Tone characteristics

**Example Command:**
```
Run vecia-style-analyzer agent on articles in "docs/Blog/"
```

**Tips:**
- **Run ONCE** during initial setup
- Can re-run if you want to analyze additional published articles
- Creates baseline Memory KB for all other agents

---

### AGENT 3: blog-outliner

**Purpose:** Creates structured article outlines while querying Memory KB to avoid repetition.

**When to Use:**
- After research phase complete
- Before writing phase
- Need to plan article structure

**Tools:**
- Read
- Write
- mcp__mcp-kb-memory__retrieve_memory
- mcp__mcp-kb-memory__search_by_tag

**Input:**
- `research-[topic]-2025.md` (from blog-researcher)

**Output:**
- `outline-[topic].md` file with:
  - Article metadata (slug, category, length)
  - Hook proposal (verified against Memory KB)
  - 6-section structure with H2 titles
  - Fresh metaphor suggestions (checked DO-NOT-REUSE)
  - CTA proposal (verified not used)

**Example Command:**
```
Run blog-outliner agent using research file "research-workflow-automation-2025.md"
```

**Tips:**
- Review outline and approve before writing phase
- Agent suggests metaphors but you can request alternatives
- Checks Memory KB for DO-NOT-REUSE patterns automatically

---

### AGENT 4: vecia-french-writer

**Purpose:** Core content writer creating French articles in Vecia's aggressive-but-professional tone.

**When to Use:**
- After outline approved
- Writing French version (primary language)
- Creating Astro-compatible Markdown

**Tools:**
- Read
- Write
- mcp__mcp-kb-memory__retrieve_memory
- mcp__mcp-kb-memory__search_by_tag

**Input:**
- `outline-[topic].md` (from blog-outliner)
- `research-[topic]-2025.md` (from blog-researcher)

**Output:**
- `src/content/blog/fr/[slug].md` file with:
  - Complete Astro frontmatter (title, description, publishDate, category, tags, LinkedIn metadata)
  - 1200-1500 word article in French
  - Aggressive tone with fresh metaphors
  - Statistics cited with 2025 sources
  - Personal, engaging CTA

**Example Command:**
```
Run vecia-french-writer agent using outline "outline-workflow-automation.md" and research file
```

**Tips:**
- Agent queries Memory KB for style guidelines automatically
- Uses forbidden/allowed language rules
- Maintains first-person perspective ("je", "moi")
- Creates Markdown (not HTML like old blog)

---

### AGENT 5: vecia-english-translator

**Purpose:** Translates French articles to English while preserving aggressive tone and adapting metaphors culturally.

**When to Use:**
- After French article complete
- Creating English version
- Need bilingual content

**Tools:**
- Read
- Write
- mcp__mcp-kb-memory__retrieve_memory

**Input:**
- `src/content/blog/fr/[slug].md` (from vecia-french-writer)

**Output:**
- `src/content/blog/en/[slug].md` file with:
  - Translated frontmatter (English title, description, tags, LinkedIn)
  - Structurally matched content (same H2 count, same lists)
  - Tone-preserved aggressive edge
  - Culturally adapted metaphors if needed

**Example Command:**
```
Run vecia-english-translator agent on "src/content/blog/fr/workflow-automation-2025.md"
```

**Tips:**
- NOT literal translation (cultural adaptation)
- Maintains aggressive tone ("your strategy will fail" not "may face challenges")
- Fitness metaphors usually translate directly
- Structure must match French version exactly

---

### AGENT 6: blog-quality-checker

**Purpose:** Automated QA checking forbidden language, repetition, technical correctness, and bilingual consistency.

**When to Use:**
- After both French and English articles complete
- Before publication
- Quality assurance check

**Tools:**
- Read
- Grep
- mcp__mcp-kb-memory__retrieve_memory
- mcp__mcp-kb-memory__search_by_tag

**Input:**
- `src/content/blog/fr/[slug].md` (French article)
- `src/content/blog/en/[slug].md` (English article, optional)

**Output:**
- `quality-review-[slug].md` report with:
  - 🔴 Critical issues (forbidden words, repeated content, frontmatter errors)
  - 🟡 Warnings (word count, title length, tone suggestions)
  - ✅ Passed checks
  - Final verdict: READY TO PUBLISH / NEEDS REVISION / MINOR TWEAKS

**Example Command:**
```
Run blog-quality-checker agent on both "workflow-automation-2025.md" (FR) and (EN)
```

**Tips:**
- Uses Grep to search for forbidden words: putain, merde, crever
- Queries Memory KB to check metaphor/hook/CTA repetition
- Validates frontmatter against Zod schema requirements
- If CRITICAL issues found, fix before publication

---

### AGENT 7: blog-memory-updater

**Purpose:** Post-publication agent that stores new examples in Memory KB to prevent future repetition.

**When to Use:**
- **AFTER** article published (approved and live)
- NEVER before publication (content might change)

**Tools:**
- Read
- mcp__mcp-kb-memory__store_memory
- mcp__mcp-kb-memory__retrieve_memory
- mcp__mcp-kb-memory__search_by_tag

**Input:**
- `src/content/blog/fr/[slug].md` (PUBLISHED French article)

**Output:**
- Memory KB updated with 15-25 new entries:
  - Used metaphors (DO-NOT-REUSE)
  - Used hook (DO-NOT-REUSE)
  - Used CTA (DO-NOT-REUSE)
  - Used case studies (reusable with different angles)
  - Used statistics (foundational can reuse)
  - Humor examples (DO-NOT-REUSE)
  - Confrontation phrases (REUSABLE-SPARINGLY)
  - Explained concepts (find-new-angle)
  - Article metadata for reference

**Example Command:**
```
Run blog-memory-updater agent on published article "src/content/blog/fr/workflow-automation-2025.md"
```

**Tips:**
- **CRITICAL: Run AFTER publication only**
- Prevents future articles from repeating creative elements
- French version is source (English is translation)
- Verify Memory KB updated successfully after run

---

## Memory KB Integration

The **Memory KB (MCP)** is the backbone of the agent workflow, enabling:
- **Style consistency** via stored tone rules
- **Repetition prevention** via DO-NOT-REUSE tracking
- **Quality improvement** via learning from published articles

### Memory KB Architecture

**Backend:** sqlite-vec (vector database)
**Embedding Model:** all-MiniLM-L6-v2
**Storage Format:** Content + Metadata (with tags)
**Location:** Managed by MCP server (persistent across sessions)

**Example Memory Entry:**
```json
{
  "content": "USED METAPHOR: Gym beginner loading 100kg on bench press day 1 to explain trying to implement full AI stack without preparation. Article: ai-implementation-mistakes, Date: 2025-01-10",
  "metadata": {
    "tags": ["used-metaphor", "fitness", "gym", "vecia-blog", "DO-NOT-REUSE"]
  }
}
```

### Tag System

**Critical Tags:**
- `DO-NOT-REUSE` → Never use this exact example again (metaphors, hooks, CTAs, humor)
- `REUSABLE-SPARINGLY` → Can reuse occasionally (confrontation phrases, certain stats)
- `find-new-angle` → Can explain concept again but from different perspective
- `vecia-blog` → All blog-related memories (for filtering)

**Category Tags:**
- `used-metaphor`, `used-hook`, `used-cta`, `used-case-study`, `used-statistic`, `used-humor`, `used-confrontation`, `explained-concept`
- `fitness`, `gym`, `nutrition`, `training` (metaphor subcategories)

**Operational Tags:**
- `published-article` (article metadata)
- Specific company names (for case study tracking)
- Source organizations (PwC, Gartner, McKinsey)

### Common Memory KB Operations

#### 1. Query for Used Metaphors

**In Claude Code:**
```
"Query Memory KB for used fitness metaphors"
```

**What happens:**
- Agent uses `retrieve_memory("used metaphor fitness")` or `search_by_tag(["used-metaphor", "fitness"])`
- Returns all fitness metaphors tagged DO-NOT-REUSE
- Agent proposes DIFFERENT metaphor

**Use case:** blog-outliner and vecia-french-writer check this before suggesting/using metaphors

---

#### 2. Check for Duplicate Case Studies

**In Claude Code:**
```
"Search Memory KB for UPS ORION case study"
```

**What happens:**
- Agent uses `retrieve_memory("UPS ORION case study")`
- Returns previous usage with what angle was covered
- Agent decides: new angle OK, exact duplicate NOT OK

**Use case:** blog-researcher checks this when gathering case studies

---

#### 3. Store New Article Elements (Post-Publication)

**In Claude Code:**
```
"Run blog-memory-updater agent on published article"
```

**What happens:**
- Agent reads published article
- Extracts metaphors, hook, CTA, case studies, etc.
- Stores each with appropriate tags:
  ```
  store_memory(
    content: "USED METAPHOR: [description]. Article: [slug], Date: [date]",
    metadata: {"tags": ["used-metaphor", "fitness", "DO-NOT-REUSE", "vecia-blog"]}
  )
  ```

**Use case:** Prevents future articles from repeating creative elements

---

#### 4. Verify Style Guidelines

**In Claude Code:**
```
"Query Memory KB for Vecia blog tone rules"
```

**What happens:**
- Agent retrieves tone characteristics, allowed/forbidden language
- Uses rules during writing

**Use case:** vecia-french-writer queries this automatically

---

### Memory KB Maintenance

**Check Health:**
```
"Check Memory KB health status"
```

**Expected Output:**
- Total memories: 76+ (40 pre-existing + 36+ from blog setup)
- Database size: ~1-2 MB
- Status: Healthy
- Backend: sqlite-vec with all-MiniLM-L6-v2

**Cleanup Duplicates (if needed):**
```
"Run Memory KB cleanup duplicates"
```

**Delete Outdated Entries (if needed):**
```
"Delete Memory KB entries before date 2024-01-01 with tag 'temporary'"
```

**Backup (recommended monthly):**
```
"Create Memory KB backup"
```

---

### Memory KB Best Practices

**DO:**
- ✅ Store metaphors immediately after publication (via blog-memory-updater)
- ✅ Use descriptive content (include context: article, date, usage)
- ✅ Tag appropriately (DO-NOT-REUSE vs REUSABLE-SPARINGLY)
- ✅ Query before suggesting creative elements (outliner, writer)
- ✅ Check duplicates during research phase

**DON'T:**
- ❌ Store before publication (content might change)
- ❌ Use vague tags (be specific: "used-metaphor" not "metaphor")
- ❌ Skip tagging with article slug (needed for tracking)
- ❌ Assume case studies can't be reused (different angles OK)
- ❌ Over-store (don't store every sentence, just key creative elements)

---

## Agent Workflow Examples

### Example 1: Quick Win Article (3 hours)

**Topic:** "Automate Your Email Responses in 30 Minutes"

**Timeline:**
- **0:00-1:00** (60 min): blog-researcher gathers no-code tools, quick setup guides, before/after metrics
- **1:00-1:30** (30 min): blog-outliner creates 5-section structure with tutorial steps
- **1:30-2:30** (60 min): vecia-french-writer writes 1000-word tutorial in aggressive tone
- **2:30-3:00** (30 min): vecia-english-translator creates EN version
- **3:00-3:15** (15 min): blog-quality-checker validates (READY TO PUBLISH)
- **3:15-3:30** (15 min): Manual review, git commit, push
- **AFTER LIVE**: blog-memory-updater stores examples (20 min)

**Total:** 3 hours (research to publish) + 20 min post-publication

---

### Example 2: Industry Deep Dive (5 hours)

**Topic:** "Healthcare Automation: Compliance & Best Practices 2025"

**Timeline:**
- **0:00-1:30** (90 min): blog-researcher gathers healthcare-specific regulations, HIPAA compliance, 5 case studies from hospitals
- **1:30-2:15** (45 min): blog-outliner creates 7-section structure with compliance framework
- **2:15-3:45** (90 min): vecia-french-writer writes 2000-word comprehensive guide
- **3:45-4:45** (60 min): vecia-english-translator creates EN version with medical terminology checks
- **4:45-5:15** (30 min): blog-quality-checker validates (MINOR TWEAKS: word count over target)
- **5:15-5:30** (15 min): Review warnings, decide to keep length (in-depth article justifies it)
- **5:30-5:45** (15 min): Manual review, git commit, push
- **AFTER LIVE**: blog-memory-updater stores healthcare case studies, compliance frameworks (30 min)

**Total:** 5 hours 45 min (research to publish) + 30 min post-publication

---

### Example 3: Tool Comparison (4 hours)

**Topic:** "Zapier vs Make vs n8n: Which Automation Tool in 2025?"

**Timeline:**
- **0:00-1:15** (75 min): blog-researcher gathers 2025 pricing, feature comparisons, user reviews, ROI data
- **1:15-2:00** (45 min): blog-outliner creates comparison table structure, use case scenarios
- **2:00-3:15** (75 min): vecia-french-writer writes 1500-word comparison with verdict section
- **3:15-4:00** (45 min): vecia-english-translator creates EN version
- **4:00-4:20** (20 min): blog-quality-checker validates (READY TO PUBLISH)
- **4:20-4:35** (15 min): Manual review, git commit, push
- **AFTER LIVE**: blog-memory-updater stores tool comparison approach, pricing data (25 min)

**Total:** 4 hours 35 min (research to publish) + 25 min post-publication

---

### Example 4: Fixing Quality Check Failures

**Scenario:** blog-quality-checker reports CRITICAL ISSUES

**Issue Found:**
```markdown
## 🔴 Critical Issues (MUST FIX)

### Language Violations
- ❌ Found forbidden word "merde" in section "Erreur #3"

### Repeated Content
- ❌ Metaphor "gym membership never used" already used in article automating-crm-mistakes (DO-NOT-REUSE tag)

**Fix Required**: YES (cannot publish until resolved)
```

**Fix Workflow:**

1. **Fix Forbidden Word:**
   ```bash
   # Open French article
   code src/content/blog/fr/workflow-mistakes-2025.md

   # Search for "merde" (Cmd+F)
   # Replace with allowed crude alternative:
   # "c'est de la merde" → "c'est branlant"
   ```

2. **Fix Repeated Metaphor:**
   ```
   # Query Memory KB for FRESH alternatives
   "Query Memory KB for used gym metaphors, suggest fresh alternative"

   # Agent suggests: "Rest days metaphor (recovery is growth) - NOT in DO-NOT-REUSE"

   # Replace section with fresh metaphor:
   # "C'est comme acheter un abonnement de gym qu'on n'utilise jamais"
   # → "C'est comme zapper les jours de repos en pensant que plus c'est mieux"
   ```

3. **Update English Version:**
   ```
   # Manually update EN version to match
   # OR re-run vecia-english-translator on updated FR version
   ```

4. **Re-run Quality Check:**
   ```
   Run blog-quality-checker agent on both updated FR and EN versions
   ```

5. **Expected Result:**
   ```markdown
   ## 🔴 Critical Issues (MUST FIX)

   None ✅

   ---

   ## 🎯 Final Verdict

   **Status**: READY TO PUBLISH ✅
   ```

6. **Proceed to publication**

---

### Example 5: Parallel Article Creation (Scalable)

**Scenario:** Creating 3 articles simultaneously

**Topics:**
1. "5 CRM Automation Mistakes" (Quick Win)
2. "AI Agents in Finance Sector" (Industry Deep Dive)
3. "No-Code Tools Comparison 2025" (Tool Comparison)

**Workflow:**

**Phase 1: Research (Parallel - 90 min)**
```
Run blog-researcher agent on topic "CRM automation mistakes 2025"
Run blog-researcher agent on topic "AI agents finance sector regulations 2025"
Run blog-researcher agent on topic "no-code automation tools comparison 2025"

# All 3 agents run concurrently
# Wait for all research files to complete
```

**Phase 2: Outline (Parallel - 45 min)**
```
Run blog-outliner agent using research file "research-crm-automation-mistakes-2025.md"
Run blog-outliner agent using research file "research-ai-agents-finance-2025.md"
Run blog-outliner agent using research file "research-no-code-tools-2025.md"

# All 3 agents run concurrently
# Review and approve all outlines
```

**Phase 3: French Writing (Parallel - 90 min)**
```
Run vecia-french-writer agent using outline "outline-crm-automation-mistakes.md"
Run vecia-french-writer agent using outline "outline-ai-agents-finance.md"
Run vecia-french-writer agent using outline "outline-no-code-tools.md"

# All 3 agents run concurrently
# Wait for all FR articles complete
```

**Phase 4: English Translation (Parallel - 60 min)**
```
Run vecia-english-translator agent on "src/content/blog/fr/crm-automation-mistakes.md"
Run vecia-english-translator agent on "src/content/blog/fr/ai-agents-finance.md"
Run vecia-english-translator agent on "src/content/blog/fr/no-code-tools-comparison.md"

# All 3 agents run concurrently
```

**Phase 5: Quality Check (Parallel - 30 min)**
```
Run blog-quality-checker agent on both FR and EN versions of "crm-automation-mistakes"
Run blog-quality-checker agent on both FR and EN versions of "ai-agents-finance"
Run blog-quality-checker agent on both FR and EN versions of "no-code-tools-comparison"

# All 3 agents run concurrently
# Review all quality reports
```

**Phase 6: Publication (Sequential - 45 min)**
```bash
# Article 1
git add src/content/blog/fr/crm-automation-mistakes.md
git add src/content/blog/en/crm-automation-mistakes.md
git commit -m "feat: Add blog post - 5 CRM Automation Mistakes"
git push

# Article 2
git add src/content/blog/fr/ai-agents-finance.md
git add src/content/blog/en/ai-agents-finance.md
git commit -m "feat: Add blog post - AI Agents in Finance Sector"
git push

# Article 3
git add src/content/blog/fr/no-code-tools-comparison.md
git add src/content/blog/en/no-code-tools-comparison.md
git commit -m "feat: Add blog post - No-Code Tools Comparison 2025"
git push
```

**Phase 7: Post-Publication Memory Update (Sequential - 60 min)**
```
# Wait for all 3 articles to be live

Run blog-memory-updater agent on published article "src/content/blog/fr/crm-automation-mistakes.md"
Run blog-memory-updater agent on published article "src/content/blog/fr/ai-agents-finance.md"
Run blog-memory-updater agent on published article "src/content/blog/fr/no-code-tools-comparison.md"

# Each runs sequentially to avoid Memory KB conflicts
```

**Total Time:**
- **Parallel phases:** 90 + 45 + 90 + 60 + 30 = 315 min (5.25 hours)
- **Sequential phases:** 45 + 60 = 105 min (1.75 hours)
- **TOTAL:** ~7 hours to create **3 complete bilingual articles**

**vs Manual Workflow:**
- 3 articles × 4 hours each = **12 hours**
- **Time saved:** 5 hours (42% faster)
- **Quality improvement:** Automated repetition checking, style consistency

---

### Tips for Agent Workflow Success

**Efficiency:**
- Run agents in **parallel** when possible (research, outlining, writing, translation, QA)
- Use **sequential** for Memory KB updates (prevents conflicts)
- Batch similar tasks (e.g., research 3 topics at once)

**Quality:**
- Always review agent output before next phase
- Don't skip quality checker (catches forbidden words, repetition)
- Run blog-memory-updater AFTER publication (not before)

**Maintenance:**
- Check Memory KB health monthly
- Backup Memory KB quarterly
- Re-run vecia-style-analyzer when publishing exceptional articles

**Troubleshooting:**
- If agent produces low-quality output, check if Memory KB is healthy
- If repetition detected, verify blog-memory-updater ran on previous articles
- If tone inconsistent, re-run vecia-style-analyzer to reinforce patterns

---

## Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2025-01-15 | 1.1.0 | Added Agent-Based Workflow sections 12-16: Agent pipeline, complete workflow, reference guide, Memory KB integration, examples |
| 2025-01-15 | 1.0.0 | Initial creation - Complete workflow guide |

---

**Need help?** Contact the Vecia team or check `docs/` for more guides.
