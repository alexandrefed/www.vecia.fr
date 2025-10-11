# LinkedIn Posting Workflow (2025)

**Quick reference guide for posting blog articles to LinkedIn**

This document explains the step-by-step workflow for promoting a published blog article on LinkedIn using the automated post generator.

---

## Prerequisites

Before you start, ensure:

- ✅ Article is published and live on https://vecia.com
- ✅ Article has `linkedin.caption` and `linkedin.hashtags` in frontmatter
- ✅ You have your LinkedIn account open and ready
- ✅ You know the article slug (e.g., `automatisation-5-signes`)

---

## Step 1: Generate the LinkedIn Post

Run the LinkedIn post generator from your terminal:

```bash
npm run linkedin:generate <article-slug>
```

**Example:**
```bash
npm run linkedin:generate automatisation-5-signes
```

**What it does:**
- Reads the article frontmatter from `src/content/blog/fr/<slug>.md` or `src/content/blog/en/<slug>.md`
- Extracts `linkedin.caption` and `linkedin.hashtags`
- Formats the post with proper spacing for LinkedIn algorithm
- Generates the article URL (FR: `/blog/<slug>`, EN: `/en/blog/<slug>`)
- Displays 2025 LinkedIn best practices in terminal

**Output example:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 Votre entreprise est-elle prête pour l'automatisation IA?

Voici 5 signes révélateurs que vous devez agir maintenant:

✅ Vos équipes passent des heures sur des tâches répétitives
✅ Les erreurs humaines vous coûtent cher
✅ Vous n'arrivez pas à suivre la croissance

Découvrez les 5 signes complets dans notre dernier article 👇

👉 Lire l'article complet : https://vecia.com/blog/automatisation-5-signes

#IA #Automatisation #Business #Productivité
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Step 2: Copy the Generated Post

**Action:**
1. Select all text between the `━━━━━` lines in your terminal
2. Copy to clipboard (`Cmd+C` on Mac, `Ctrl+C` on Windows)
3. Keep the terminal output visible for reference

**Important:**
- ✅ Include the emoji icons (they boost engagement)
- ✅ Include all line breaks (spacing is optimized for LinkedIn algorithm)
- ✅ Include hashtags at the end (3-5 is optimal for 2025)
- ❌ Don't modify the formatting (it's designed for maximum reach)

---

## Step 3: Choose Optimal Posting Time

**2025 LinkedIn Algorithm Best Practices:**

**Best times to post (France/Europe B2B):**
- **Tuesday-Thursday**: 8:00-10:00 AM or 12:00-1:00 PM
- **Avoid**: Weekends, before 7 AM, after 6 PM

**Why timing matters:**
- First 60 minutes are CRITICAL for engagement
- LinkedIn algorithm prioritizes posts with early engagement
- Your network is most active during work hours
- Peak activity: Late morning (coffee break) and lunch hour

**Pro tip:** Schedule your posting when YOU can actively respond to comments in the first hour.

---

## Step 4: Post to LinkedIn (Manual Posting)

**Why manual posting?**
- LinkedIn algorithm favors authentic, human-posted content in 2025
- Automated posting tools are penalized by the algorithm
- Manual posting allows real-time engagement

**Steps:**
1. Go to [LinkedIn.com](https://www.linkedin.com)
2. Click "Start a post" at the top of your feed
3. **Paste the generated post** from Step 2
4. **Preview the post** - verify formatting looks good
5. **DO NOT add the link in the caption** (see Step 6)
6. Click "Post"

**Important:**
- ❌ Don't use "Schedule post" feature (reduces reach)
- ❌ Don't add images initially (post as text-only first for maximum reach)
- ✅ Keep the post text-only for first 60 minutes
- ✅ Post when you can actively engage

---

## Step 5: Engage Within 60 Minutes (CRITICAL)

**The 60-minute engagement window is make-or-break for post reach.**

**Your actions in the first hour:**

1. **Immediately after posting (0-5 min):**
   - Add article link in FIRST COMMENT (see Step 6)
   - Add a follow-up question or insight in that comment

2. **Monitor closely (0-60 min):**
   - Refresh LinkedIn every 10-15 minutes
   - Respond to EVERY comment within 15 minutes
   - Ask follow-up questions to commenters
   - Like every comment

3. **Engagement tactics:**
   - Reply with thoughtful responses (not just "Thanks!")
   - Tag relevant people when appropriate (not spammy)
   - Ask questions to invite more discussion
   - Share personal insights or experiences

**Why this matters:**
- LinkedIn algorithm measures engagement velocity (comments/min)
- Early engagement signals "valuable content" to algorithm
- Posts with high early engagement get shown to more people
- You can 10x your reach by actively engaging in first hour

---

## Step 6: Add Link in First Comment

**Best practice (2025):** Put the article link in the FIRST COMMENT, not in the post caption.

**Why?**
- LinkedIn algorithm penalizes external links in post captions
- Posts with links get ~50% less reach
- Links in comments don't hurt reach
- This strategy maximizes visibility

**How to do it:**

1. Immediately after posting (Step 4), click "Comment" on your own post
2. Write a compelling first comment with the link:

```
Lien vers l'article complet 👇

https://vecia.com/blog/automatisation-5-signes

💡 Dans cet article, vous découvrirez:
- Les 5 indicateurs précis que vous perdez de l'argent
- Des études de cas réels (The Second City, Pisamonas)
- Un plan d'action concret sur 3 mois
- Les erreurs à éviter (70% d'échec viennent de là)

Qu'est-ce qui résonne le plus avec vous? 👇
```

**Pro tips:**
- Add a call-to-action question at the end
- Use bullet points for readability
- Include specific value propositions
- Emoji usage is fine in comments too

---

## Step 7: Monitor Performance (24-48 hours)

**What to track:**

- **Engagement rate**: (Likes + Comments + Shares) / Impressions
- **Top comments**: Identify what resonates with your audience
- **Peak engagement time**: Note when people engage most
- **Click-through rate**: How many people clicked your link (check Google Analytics)

**Good benchmarks (2025 B2B):**
- Engagement rate: 2-5% is good, 5%+ is excellent
- Comments: 5-10+ comments indicates strong interest
- Shares: 2-3+ shares means content is highly valuable

**Learning for next time:**
- Save high-performing post formats
- Note what topics/angles get most engagement
- Identify your most engaged network segments
- Adjust posting times based on when your audience is active

---

## Troubleshooting Common Issues

### Issue: "Article not found" error

**Solution:**
```bash
# Check if article exists in French blog
ls src/content/blog/fr/ | grep <slug>

# Check if article exists in English blog
ls src/content/blog/en/ | grep <slug>

# Verify exact filename matches slug
cat src/content/blog/fr/<slug>.md | head -n 20
```

Make sure the slug matches the filename exactly (without `.md` extension).

---

### Issue: No caption generated, using default text

**Solution:**

Your article is missing `linkedin` frontmatter. Add this to the article's frontmatter:

```yaml
linkedin:
  caption: |
    Your custom LinkedIn caption here.

    Use multiple lines for visual spacing.

    Include emojis and line breaks for readability.
  hashtags: ["Hashtag1", "Hashtag2", "Hashtag3"]
```

**Important:**
- Use `|` after `caption:` for multi-line text
- Indent the caption text with 2 spaces
- Keep hashtags to 3-5 maximum (2025 best practice)
- Don't include `#` in hashtag array (script adds them)

---

### Issue: Post doesn't get engagement

**Common causes:**

1. **Posted at wrong time**
   - Solution: Post Tuesday-Thursday, 8-10 AM or 12-1 PM

2. **Didn't engage in first 60 minutes**
   - Solution: Clear your calendar for 1 hour after posting

3. **Link in caption instead of comment**
   - Solution: Edit post to remove link, add link in comment

4. **Caption is too long or poorly formatted**
   - Solution: Use generated caption as-is (it's optimized)

5. **Used scheduling tool**
   - Solution: Always post manually when you can engage

---

### Issue: Script shows wrong URL

**Solution:**

The script uses this logic:
- French articles: `https://vecia.com/blog/<slug>`
- English articles: `https://vecia.com/en/blog/<slug>`

If you need to change the base URL, edit `scripts/linkedin-generator.js:241`:

```javascript
const baseUrl = 'https://vecia.com'; // Update this if needed
```

---

## Quick Reference: 2025 LinkedIn Algorithm

**What the algorithm favors (2025):**
- ✅ Text-only posts (images can be added after 60 min)
- ✅ 3-5 hashtags (not more!)
- ✅ High engagement velocity in first 60 minutes
- ✅ Authentic conversations in comments
- ✅ Manual posting (not scheduled)
- ✅ Well-spaced text with line breaks
- ✅ Links in first comment (not in caption)

**What the algorithm penalizes (2025):**
- ❌ External links in post caption
- ❌ Too many hashtags (6+ hurts reach)
- ❌ Automated posting tools
- ❌ No engagement from poster
- ❌ Generic "Thanks for sharing!" replies
- ❌ Posting outside of work hours (B2B)

---

## Advanced Tips

### 1. Tag Strategic People

**Do:**
- Tag people who are mentioned in the article
- Tag people who would genuinely find it valuable
- Tag 1-2 thought leaders (not spammy)

**Don't:**
- Tag random people for visibility
- Tag more than 3 people
- Tag competitors

### 2. Follow-Up Posts

**Strategy:**
- 24 hours later: Share a key insight from the article as a separate post
- 48 hours later: Post a carousel with the 5 main points
- 1 week later: Share a client success story related to the topic

**Why:**
- Extends content lifespan
- Reaches people who missed first post
- Reinforces your expertise on the topic

### 3. A/B Test Captions

**Experiment with:**
- Different hooks (question vs statement vs data point)
- Emoji placement and quantity
- Call-to-action variations
- List format vs paragraph format

**Track what works** and update your `linkedin.caption` templates accordingly.

---

## Customizing Article LinkedIn Data

To customize the LinkedIn post for a specific article, edit the frontmatter:

```yaml
---
title: "Your Article Title"
description: "Your article description"
publishDate: 2025-01-15
# ... other frontmatter ...

linkedin:
  caption: |
    🎯 Your compelling hook here.

    Use line breaks for visual spacing.

    Include 2-3 key points:
    ✅ Point 1
    ✅ Point 2
    ✅ Point 3

    End with a teaser or question 👇
  hashtags: ["Tag1", "Tag2", "Tag3", "Tag4"]
---
```

**Caption writing tips:**
- Start with an emoji or strong hook
- Use visual spacing (blank lines between sections)
- Include bullet points with emojis (✅, 🎯, 💡, 🚀)
- End with a call-to-action or question
- Keep it scannable (people skim on mobile)
- Length: 150-300 characters is optimal

**Hashtag tips:**
- 3-5 hashtags is optimal (research shows 5 is the sweet spot)
- Mix broad and niche tags
- Use tags your target audience follows
- Don't use generic tags (#success, #business) - too competitive
- Check tag popularity: Type `#` in LinkedIn search to see follower count

---

## Complete Workflow Checklist

Use this checklist every time you publish an article:

- [ ] Article is published and live on vecia.com
- [ ] Article has `linkedin.caption` and `linkedin.hashtags` in frontmatter
- [ ] Run `npm run linkedin:generate <slug>` in terminal
- [ ] Copy generated post to clipboard
- [ ] Choose optimal posting time (Tue-Thu, 8-10 AM or 12-1 PM)
- [ ] Post manually to LinkedIn (text-only, no link in caption)
- [ ] Immediately add article link in FIRST COMMENT with CTA
- [ ] Set timer for 60 minutes
- [ ] Engage with EVERY comment within 15 minutes
- [ ] Ask follow-up questions to drive discussion
- [ ] Monitor performance for 24-48 hours
- [ ] Note what worked for next time

---

## Resources

- **LinkedIn generator script**: `scripts/linkedin-generator.js`
- **Example article with LinkedIn data**: `src/content/blog/fr/automatisation-5-signes.md`
- **Blog workflow guide**: `docs/BLOG-WORKFLOW.md` (Section 9: LinkedIn Integration)

---

**Last Updated**: 2025-01-15
**Phase**: Phase 8.4.4 Complete
