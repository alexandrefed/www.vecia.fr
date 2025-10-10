# Blog Agent Workflow - Quick Reference Card

**Version**: 1.0
**Last Updated**: January 2025
**For**: Vecia Blog Content Creation

---

## 🚀 Quick Start: 7-Agent Pipeline

```
Topic → Research (90min) → Outline (45min) → Write FR (90min)
     → Translate EN (60min) → QA Check (30min) → Publish → Memory Update (30min)
```

**Total Time**: 2-3 hours per article (vs 3-4 hours manual)

---

## 📋 Agent Commands

### 1️⃣ Research Phase
```
Run blog-researcher agent on topic "[your topic] 2025"
```
**Output**: `research-[topic]-2025.md` with statistics, case studies, trends

---

### 2️⃣ Outline Phase
```
Run blog-outliner agent using research file "research-[topic]-2025.md"
```
**Output**: `outline-[topic].md` with structure, fresh metaphors, hook, CTA

---

### 3️⃣ French Writing
```
Run vecia-french-writer agent using outline "outline-[topic].md" and research file
```
**Output**: `src/content/blog/fr/[slug].md` with frontmatter + 1200-1500 words

---

### 4️⃣ English Translation
```
Run vecia-english-translator agent on "src/content/blog/fr/[slug].md"
```
**Output**: `src/content/blog/en/[slug].md` matching structure/tone

---

### 5️⃣ Quality Check
```
Run blog-quality-checker agent on both "[slug].md" (FR) and (EN)
```
**Output**: `quality-review-[slug].md` with verdict:
- ✅ READY TO PUBLISH → Proceed
- ⚠️ MINOR TWEAKS → Review warnings
- ❌ NEEDS REVISION → Fix critical issues

---

### 6️⃣ Publication
```bash
git add src/content/blog/fr/[slug].md src/content/blog/en/[slug].md
git commit -m "feat: Add blog post - [Title]"
git push origin main
```

---

### 7️⃣ Memory Update (AFTER LIVE)
```
Run blog-memory-updater agent on published article "src/content/blog/fr/[slug].md"
```
**Critical**: Run ONLY after publication

---

## 🧠 Memory KB Cheat Sheet

### Query Used Elements
```
"Query Memory KB for used fitness metaphors"
"Search Memory KB for UPS ORION case study"
"Query Memory KB for Vecia blog tone rules"
```

### Check Health
```
"Check Memory KB health status"
```
**Expected**: 76+ memories, ~1-2 MB, Healthy

---

## 🏷️ Tag System

| Tag | Meaning | Use Case |
|-----|---------|----------|
| `DO-NOT-REUSE` | Never repeat | Metaphors, hooks, CTAs, humor |
| `REUSABLE-SPARINGLY` | Use occasionally | Confrontation phrases |
| `find-new-angle` | Explain differently | Technical concepts |
| `vecia-blog` | Blog content | All blog memories |

---

## ⚡ Time Estimates by Article Type

| Type | Research | Outline | Write | Translate | QA | Total |
|------|----------|---------|-------|-----------|----|----|
| **Quick Win** | 60min | 30min | 60min | 30min | 15min | **3h** |
| **Why Broken** | 75min | 45min | 75min | 45min | 20min | **4h** |
| **Success Story** | 75min | 30min | 60min | 45min | 20min | **3.5h** |
| **Industry Deep Dive** | 90min | 45min | 90min | 60min | 30min | **5h** |
| **Tool Comparison** | 75min | 45min | 75min | 45min | 20min | **4h** |

---

## ✅ Quality Checklist

### Before Running Next Agent
- [ ] Review previous agent output
- [ ] Approve or request revisions
- [ ] Check no errors in console

### Before Publication
- [ ] Quality checker status: READY TO PUBLISH ✅
- [ ] No forbidden words (putain, merde, crever)
- [ ] No repeated metaphors (checked Memory KB)
- [ ] Frontmatter valid (category, date, tags)
- [ ] Both FR + EN versions created
- [ ] Images optimized and placed

### After Publication
- [ ] Verified live on production
- [ ] Ran blog-memory-updater
- [ ] Memory KB updated successfully

---

## 🚨 Troubleshooting

### Agent produces low-quality output
→ Check Memory KB health status

### Repetition detected
→ Verify blog-memory-updater ran on previous articles

### Forbidden word found
→ Replace with allowed: "branlant", "fermez là", "sans s'essouffler"

### Tone inconsistent
→ Re-run vecia-style-analyzer to reinforce patterns

### Quality checker fails
→ Fix critical issues, re-run checker, don't publish until ✅

---

## 🎯 Category Selection

| Category | When to Use | Example |
|----------|-------------|---------|
| `quick-wins` | Fast implementation (30min-2h) | "Automate Email in 30 Min" |
| `why-broken` | Identify problems | "Why Your CRM Fails" |
| `success-stories` | Customer case studies | "How Acme Saved 40h/week" |
| `industry-deep-dives` | Industry-specific | "Healthcare Automation" |
| `tool-comparisons` | Tool reviews | "Zapier vs Make 2025" |

---

## 📦 Frontmatter Template

```yaml
---
title: "[Title - 60 chars max]"
description: "[SEO description - 140-160 chars]"
publishDate: 2025-01-15
author: "Alexandre Fedotov" # or "Tanguy Dray" or "Équipe Vecia"
category: "quick-wins" # See categories above
tags: ["tag1", "tag2", "tag3", "tag4"]
featured: false # Set true for homepage
image: "/images/blog/[slug].jpg" # Optional

linkedin:
  caption: |
    🚀 [Hook question]

    [3 bullet points]
    ✅ Benefit 1
    ✅ Benefit 2
    ✅ Benefit 3

    👉 Link in comments

    #Hashtag1 #Hashtag2 #Hashtag3
  hashtags: ["Hashtag1", "Hashtag2", "Hashtag3"]
---
```

---

## 🔥 Parallel Workflow (3 Articles in 7h)

**Phase 1-5: Run agents in parallel**
```
# Research (parallel)
Run 3 blog-researcher agents simultaneously

# Outline (parallel)
Run 3 blog-outliner agents simultaneously

# Write (parallel)
Run 3 vecia-french-writer agents simultaneously

# Translate (parallel)
Run 3 vecia-english-translator agents simultaneously

# QA (parallel)
Run 3 blog-quality-checker agents simultaneously
```

**Phase 6: Publication (sequential)**
```bash
# Commit/push one at a time
```

**Phase 7: Memory Update (sequential)**
```
# Run blog-memory-updater one at a time
# Prevents Memory KB conflicts
```

**Result**: 3 articles (6 files) in ~7 hours vs 12 hours manual

---

## 💡 Pro Tips

✅ **DO**:
- Review each agent output before next phase
- Query Memory KB for duplicate checking
- Run blog-memory-updater AFTER publication
- Use parallel workflow for multiple articles
- Check Memory KB health monthly

❌ **DON'T**:
- Skip quality checker before publication
- Store in Memory KB before publication
- Force metaphors that feel unnatural
- Use forbidden words (putain, merde, crever)
- Publish without verifying live site

---

## 📞 Need Help?

**Documentation**:
- Full guide: `docs/BLOG-WORKFLOW.md`
- Agent specs: `.claude/agents/`
- Memory KB: MCP integration

**Common Issues**:
- Agents not working → Check MCP connection
- Memory KB empty → Run vecia-style-analyzer
- Quality fails → Fix issues, re-run checker

---

**Quick Reference Card v1.0** | Updated: January 2025 | Vecia Content Team
