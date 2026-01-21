# Git Workflow for Vecia Website (Advanced)

**Odoo Integration & CI/CD Documentation**

**Last Updated:** January 2025
**Quick Start:** See [GIT-QUICK-START.md](./GIT-QUICK-START.md) for daily developer workflow.

---

## Overview

With Odoo blog posts auto-syncing to the Astro codebase, we need clear rules to prevent conflicts and maintain code quality.

---

## Branch Strategy

```
main (protected)
    ├── alexandre/feature-hero-redesign
    ├── alexandre/fix-mobile-nav
    ├── odoo-blog-sync (automated)
    └── content-updates (automated from Odoo)
```

### Branch Types

**1. `main` Branch**
- **Protected**: ❌ No direct commits allowed
- **Auto-deploys**: ✅ Every merge triggers deployment
- **Only accepts**: Pull requests after review

**2. Feature Branches** (`alexandre/*`)
- **Created by**: Alexandre (manual)
- **Purpose**: Code changes, design updates, new features
- **Naming**: `alexandre/feature-name` or `alexandre/fix-issue-name`
- **Merges via**: Pull request

**3. Automated Branches** (`odoo-blog-sync`, `content-updates`)
- **Created by**: n8n workflows (automated)
- **Purpose**: Blog posts from Odoo, content syncs
- **Merges**: Automatically or via PR (configurable)

---

## Workflows by Role

### Alexandre (Developer)

**For Code Changes (components, layouts, styles):**

```bash
# 1. Start from latest main
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b alexandre/improve-performance

# 3. Make changes
# ... edit files ...

# 4. Commit with clear message
git add .
git commit -m "perf: optimize images and reduce bundle size

- Compress hero images to WebP
- Lazy load below-fold images
- Remove unused CSS
Reduces page load by 40%"

# 5. Push to GitHub
git push origin alexandre/improve-performance

# 6. Create Pull Request on GitHub
# - Add description of changes
# - Request review (optional if solo)
# - Merge when ready

# 7. GitHub Actions auto-deploys to production
```

**For Quick Fixes:**

```bash
# Can still use feature branch, but faster merge
git checkout -b alexandre/hotfix-broken-link
# ... fix ...
git commit -m "fix: correct broken blog link"
git push origin alexandre/hotfix-broken-link
# Merge PR immediately
```

### Odoo Blog Posts (Automated via n8n)

**What Happens Automatically:**

```bash
# 1. You publish blog post in Odoo
# 2. n8n detects webhook
# 3. n8n workflow:
git checkout odoo-blog-sync
# OR create new branch each time:
git checkout -b odoo/blog-post-slug-$(date +%Y%m%d)

# 4. n8n creates Markdown file
echo "---
title: Your Post Title
date: 2025-01-12
author: Alexandre
lang: fr
---

Your content here..." > src/content/blog/fr/your-post-slug.md

# 5. n8n commits
git add src/content/blog/fr/your-post-slug.md
git commit -m "content: add blog post 'Your Post Title'

Auto-synced from Odoo Blog
Post ID: 123
Published: 2025-01-12"

# 6. n8n pushes
git push origin odoo-blog-sync

# 7. Options:
#    A. Auto-merge to main (fast, no review)
#    B. Create PR (safer, can review)

# 8. GitHub Actions builds and deploys
```

**You Don't Need to Touch Git for Blog Posts** ✅

---

## Conflict Prevention Rules

### **RULE 1: File Ownership**

| Path | Owner | Auto-Edited | Manual Edit |
|------|-------|-------------|-------------|
| `src/components/**` | Alexandre | ❌ Never | ✅ Yes |
| `src/layouts/**` | Alexandre | ❌ Never | ✅ Yes |
| `src/pages/**` | Alexandre | ❌ Never | ✅ Yes |
| `src/content/blog/**` | Odoo (n8n) | ✅ Yes | ⚠️ Avoid |
| `public/**` | Alexandre | ❌ Never | ✅ Yes |
| `docs/**` | Alexandre | ❌ Never | ✅ Yes |

**Why:** If Odoo auto-generates blog posts and you manually edit them, next sync will overwrite your changes.

### **RULE 2: If You Must Edit Odoo-Synced Content**

**Option A: Edit in Odoo (Recommended)**
1. Go to Odoo Blog
2. Find post
3. Edit there
4. Republish
5. n8n syncs to Git automatically

**Option B: Edit in Git (Advanced)**
1. Edit Markdown file
2. Commit as usual
3. **ALSO** update in Odoo
4. Add comment in Markdown:
   ```markdown
   <!-- MANUALLY EDITED: Keep this content on next sync -->
   ```
5. Configure n8n to check for this comment and skip overwrite

### **RULE 3: Branch Protection**

**Protected Branches:**
- `main` - Cannot push directly
- Requires PR
- Optional: Require review from Tanguy (if desired)

**Configuration (GitHub):**
```
Settings → Branches → Add rule
Branch name pattern: main
✅ Require pull request before merging
✅ Require status checks (CI/CD)
❌ Don't require review (solo developer)
✅ Include administrators (you can't bypass either)
```

---

## Merge Strategies

### Manual Code Changes (Alexandre)

```bash
# After PR is created and approved
git checkout main
git pull origin main
git merge --no-ff alexandre/feature-name
# The --no-ff creates a merge commit (better history)
git push origin main
```

**OR** use GitHub's "Squash and merge" button:
- Cleaner history
- All commits in PR become one commit
- Recommended for small features

### Automated Content (n8n)

**Strategy A: Auto-Merge** (Fastest)
```javascript
// n8n workflow after commit
const { exec } = require('child_process');

exec('git push origin odoo-blog-sync', () => {
  // Merge to main automatically
  exec('gh pr create --base main --head odoo-blog-sync --title "Blog: ${postTitle}" --body "Auto-synced from Odoo" --auto-merge');
});
```

**Strategy B: PR with Auto-Merge** (Safer)
- n8n creates PR
- GitHub checks pass
- Auto-merges if checks pass
- You can review if needed

**Recommended: Start with Strategy A**, switch to B if issues arise.

---

## Common Scenarios

### Scenario 1: Alexandre Wants to Update Blog Post Design

**Goal:** Change how blog posts look (CSS, layout)

```bash
# 1. Edit component, not content
git checkout -b alexandre/blog-redesign

# 2. Edit these files (safe):
# - src/layouts/BlogPost.astro
# - src/components/BlogCard.astro
# - src/styles/blog.css

# 3. DO NOT edit:
# - src/content/blog/fr/*.md (Odoo owns this)

# 4. Commit, PR, merge as usual
```

**Result:** All blog posts (including future Odoo posts) get new design.

### Scenario 2: Odoo Publishes Two Blog Posts Simultaneously

**What Happens:**

```bash
# n8n detects both posts (within seconds)

# Workflow 1 (Post A):
git checkout -b odoo/post-a
# ... create post-a.md ...
git commit -m "content: Post A"
git push

# Workflow 2 (Post B):
git checkout -b odoo/post-b
# ... create post-b.md ...
git commit -m "content: Post B"
git push

# Both merge to main independently
# No conflict (different files)
```

**No Issues** ✅ - Different files, different branches.

### Scenario 3: Alexandre and Odoo Change Same File

**Problem:**
- Alexandre edits `src/pages/blog.astro` (blog index page)
- Odoo publishes post, n8n also touches `blog.astro` (adds to list)

**Prevention:**
- ❌ **DON'T** have n8n edit index files
- ✅ **DO** use Astro's automatic content collections
  - Astro automatically detects new `.md` files
  - No need to edit index manually

**Astro Config (automatic):**
```typescript
// src/pages/blog.astro
const posts = await getCollection('blog');
// Automatically includes all .md files in src/content/blog/
```

**Result:** No conflict possible.

### Scenario 4: Alexandre Needs to Rollback a Deploy

```bash
# Find last good commit
git log

# Rollback main branch
git checkout main
git revert HEAD~1  # Undo last commit
# OR
git reset --hard <commit-hash>  # Go back to specific commit

# Force push (dangerous, use carefully)
git push origin main --force

# GitHub Actions redeploys
```

**Better:** Use GitHub's "Revert" button in PR view.

---

## Commit Message Convention

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `perf`: Performance improvement
- `style`: Design/CSS changes
- `refactor`: Code restructuring (no behavior change)
- `docs`: Documentation
- `content`: Blog posts, text content
- `chore`: Build process, dependencies

### Examples

**Alexandre (manual):**
```bash
git commit -m "feat(hero): add animated particle background

Implements interactive particle animation on homepage hero
using vanilla JS (no libraries).

Performance: 60fps on all devices
Bundle size: +2KB"
```

```bash
git commit -m "fix(mobile): correct navigation menu z-index

Mobile menu was appearing behind hero section.
Increased z-index to 100.

Fixes #42"
```

**Odoo (automated):**
```bash
git commit -m "content(blog): add 'AI Automation Benefits' article

Auto-synced from Odoo Blog
Post ID: 456
Author: Alexandre
Published: 2025-01-12
Language: fr"
```

---

## GitHub Actions (CI/CD)

### Automatic Deployment Workflow

**File:** `.github/workflows/deploy.yml`

```yaml
name: Deploy to Production

on:
  push:
    branches:
      - main  # Only deploy main branch

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Build Astro site
        run: npm run build

      - name: Run tests (optional)
        run: npm run test:a11y  # Accessibility tests

      - name: Deploy to server
        run: |
          rsync -avz --delete \
            dist/ \
            tanguy@server:/var/www/vecia.fr/
        env:
          SSH_KEY: ${{ secrets.SSH_PRIVATE_KEY }}

      - name: Notify success
        run: |
          curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
            -d '{"text": "✅ vecia.fr deployed successfully"}'
```

### Branch Protection Checks

**Required checks before merge:**
- ✅ Build passes (`npm run build`)
- ✅ Type checking passes (`npm run astro check`)
- ✅ Accessibility tests pass (if enabled)

---

## n8n Integration with Git

### Workflow: Odoo Blog → Git

**n8n Nodes:**

```
1. Webhook Trigger (Odoo sends when blog published)
    ↓
2. Odoo Node (Fetch full blog post content)
    ↓
3. Function Node (Convert to Markdown)
    ↓
4. GitHub Node (Create/update file)
    ↓
5. GitHub Node (Create commit)
    ↓
6. Conditional Node (Auto-merge or PR?)
    ↓
7. GitHub Node (Merge or create PR)
    ↓
8. Slack/Email Node (Notify success)
```

**Configuration:**

```json
{
  "nodes": [
    {
      "name": "Odoo Blog Published",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "odoo-blog-published",
        "method": "POST"
      }
    },
    {
      "name": "Fetch Blog Post",
      "type": "n8n-nodes-base.odoo",
      "parameters": {
        "operation": "get",
        "resource": "blog.post",
        "id": "={{$json.body.post_id}}"
      }
    },
    {
      "name": "Convert to Markdown",
      "type": "n8n-nodes-base.function",
      "parameters": {
        "functionCode": "// See N8N-WORKFLOWS.md for full code"
      }
    },
    {
      "name": "Commit to GitHub",
      "type": "n8n-nodes-base.github",
      "parameters": {
        "operation": "create",
        "resource": "file",
        "owner": "alexandrefed",
        "repository": "vecia-website-v5",
        "path": "={{$json.filepath}}",
        "message": "content(blog): add '{{$json.title}}'\n\nAuto-synced from Odoo"
      }
    }
  ]
}
```

---

## Troubleshooting

### Problem: Merge Conflict

**Cause:** Two branches edited same file.

**Solution:**

```bash
# Update your branch with latest main
git checkout alexandre/my-feature
git fetch origin
git merge origin/main

# If conflict occurs:
# 1. Open conflicting file
# 2. Resolve conflicts (choose which changes to keep)
# 3. Save file
git add .
git commit -m "merge: resolve conflict with main"
git push
```

### Problem: Odoo Sync Overwrote Manual Edit

**Cause:** Edited Markdown file manually, then Odoo synced.

**Prevention:**
1. Always edit in Odoo for content
2. Edit in Git for code/layout only

**Recovery:**
```bash
# Find your lost changes
git log -- src/content/blog/fr/post.md
git show <commit-hash>

# Copy your changes
# Re-apply in Odoo
# Or create new commit with manual changes
```

### Problem: GitHub Actions Deploy Failed

**Check:**

```bash
# View GitHub Actions logs
# Go to: github.com/<org>/<repo>/actions

# Common issues:
# - Build failed: Check syntax errors
# - SSH failed: Check SSH keys in secrets
# - Tests failed: Run locally first
```

**Fix:**
```bash
# Fix code
git commit -m "fix: resolve build error"
git push

# Automatically retriggers deployment
```

---

## Quick Reference

### Daily Commands (Alexandre)

```bash
# Start work
git checkout main && git pull

# Create feature
git checkout -b alexandre/feature-name

# After work
git add .
git commit -m "type: description"
git push origin alexandre/feature-name

# Create PR on GitHub, merge when ready
```

### Never Use

```bash
# ❌ Don't commit directly to main
git checkout main
git commit -m "quick fix"  # NO!

# ❌ Don't force push to main
git push origin main --force  # DANGEROUS!

# ❌ Don't edit auto-generated content manually
vim src/content/blog/fr/post.md  # Edit in Odoo instead
```

### Emergency Rollback

```bash
# 1. GitHub UI method (safest):
# - Go to repo → Pull Requests
# - Find merged PR
# - Click "Revert"
# - Merge revert PR

# 2. Command line (advanced):
git checkout main
git pull
git revert HEAD  # Undo last commit
git push origin main
```

---

## Summary

**Simple Rules:**

1. ✅ **Alexandre**: Use feature branches, create PRs, merge to main
2. ✅ **Odoo (n8n)**: Auto-commits blog posts, auto-merges or creates PRs
3. ✅ **Content**: Edit in Odoo, not in Git
4. ✅ **Code**: Edit in Git, not in Odoo
5. ❌ **Never**: Direct commits to `main`

**Result:** Clean history, no conflicts, automated blog publishing, safe deployments.

---

**Next:** See [N8N-WORKFLOWS.md](./N8N-WORKFLOWS.md) for n8n configuration details.
