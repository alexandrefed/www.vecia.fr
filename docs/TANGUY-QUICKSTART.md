# Quick Start Guide for Tanguy

Welcome to the Vecia website project! This guide will help you get started with creating content and contributing to the website.

## 📋 Table of Contents

- [Repository Overview](#repository-overview)
- [Quick Start: Create Your First Blog Post](#quick-start-create-your-first-blog-post)
- [Local Development Setup](#local-development-setup-optional)
- [Project Structure](#project-structure)
- [Common Tasks](#common-tasks)
- [CI/CD: How Deployments Work](#cicd-how-deployments-work)
- [Troubleshooting](#troubleshooting)

---

## Repository Overview

- **Repository**: https://github.com/alexandrefed/www.vecia.fr
- **Tech Stack**: Astro 5 (SSR) + Tailwind CSS v4 + Alpine.js
- **Live Site**: https://vecia.com
- **Deployment**: Auto-deploys to production when you push to `main` branch

---

## Quick Start: Create Your First Blog Post

**Easiest method - No local setup required!**

### Via GitHub Web UI

1. **Navigate to blog folder**:
   - For French: https://github.com/alexandrefed/www.vecia.fr/tree/main/src/content/blog/fr
   - For English: https://github.com/alexandrefed/www.vecia.fr/tree/main/src/content/blog/en

2. **Create new file**:
   - Click "Add file" → "Create new file"
   - Name it: `my-blog-post-slug.md` (use lowercase, hyphens)

3. **Add frontmatter and content**:
   ```markdown
   ---
   title: "Titre de l'article"
   description: "Description courte pour SEO (150-160 caractères)"
   publishDate: 2025-01-14
   author: "Tanguy"
   category: "quick-wins"  # or: "strategic-automation", "enterprise-case-studies"
   tags: ["automation", "ai", "productivity"]
   featured: false
   readingTime: "5 min"
   ---

   # Introduction

   Votre contenu ici...

   ## Section 1

   Plus de contenu...
   ```

4. **Commit the file**:
   - Scroll down to "Commit new file"
   - Add commit message: `feat: Add blog post about [topic]`
   - Click "Commit directly to the main branch"

5. **Watch it deploy**:
   - Go to: https://github.com/alexandrefed/www.vecia.fr/actions
   - Your deployment will start automatically
   - Green checkmark = success (takes ~5 minutes)
   - Live at: `https://vecia.com/blog/your-post-slug`

**That's it! Your blog post is live on the website.**

---

## Local Development Setup (Optional)

**For more advanced work (creating pages, forms, components), you'll want to work locally.**

### Prerequisites

1. **Install Node.js** (v20.18.1+):
   ```bash
   # Using nvm (recommended)
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   nvm install 20.18.1
   nvm use 20.18.1
   ```

2. **Install Git**:
   - Download from: https://git-scm.com/downloads
   - Configure:
     ```bash
     git config --global user.name "Your Name"
     git config --global user.email "your.email@example.com"
     ```

3. **Code Editor**:
   - **VS Code** (recommended): https://code.visualstudio.com
   - Install Astro extension: "Astro" by Astro

### Setup Steps

```bash
# 1. Clone the repository
git clone https://github.com/alexandrefed/www.vecia.fr.git
cd vecia-website-v5

# 2. Install dependencies
npm install

# 3. Copy environment variables (ask Alexandre for credentials)
cp .env.example .env
# Edit .env and add Supabase credentials

# 4. Start development server
npm run dev
# Opens at: http://localhost:4321
```

### Development Workflow

```bash
# 1. Create a feature branch
git checkout -b feature/tanguy-new-blog

# 2. Make your changes
# - Edit files in src/
# - See live preview at http://localhost:4321

# 3. Test your changes
npm run build  # Check for errors
npm run preview  # Test production build

# 4. Commit your changes
git add .
git commit -m "feat: Add new blog post about automation"

# 5. Push to GitHub
git push origin feature/tanguy-new-blog

# 6. Create Pull Request on GitHub
# - Go to repository on GitHub
# - Click "Compare & pull request"
# - Add description of changes
# - Request review from Alexandre

# 7. After approval, merge PR
# - Auto-deploys to production!
```

---

## Project Structure

```
vecia-website-v5/
├── src/
│   ├── pages/               # Pages (file-based routing)
│   │   ├── index.astro      # Homepage (/)
│   │   ├── about.astro      # About page (/about)
│   │   ├── blog/[...slug].astro  # Blog post pages (dynamic)
│   │   └── en/              # English pages (/en/*)
│   │
│   ├── content/             # Markdown content
│   │   └── blog/
│   │       ├── fr/          # French blog posts
│   │       └── en/          # English blog posts
│   │
│   ├── components/          # Reusable UI components
│   │   ├── Navigation.astro
│   │   ├── LeadCaptureForm.astro
│   │   └── blog/            # Blog-specific components
│   │
│   ├── layouts/             # Page layouts
│   │   └── BaseLayout.astro
│   │
│   └── styles/              # Global CSS
│
├── public/                  # Static assets (images, fonts)
│   └── images/
│
├── docs/                    # Documentation
│   ├── CLAUDE.md            # Main project guide
│   ├── ASTRO_REFERENCE.md   # Astro framework guide
│   └── TANGUY-QUICKSTART.md # This file!
│
└── .github/
    └── workflows/
        └── deploy.yml       # CI/CD deployment config
```

---

## Common Tasks

### 1. Create a Blog Post (Local)

```bash
# 1. Create new Markdown file
touch src/content/blog/fr/my-new-post.md

# 2. Add frontmatter and content (see template above)

# 3. Preview locally
npm run dev
# Visit: http://localhost:4321/blog/my-new-post

# 4. Commit and push
git add src/content/blog/fr/my-new-post.md
git commit -m "feat: Add blog post about [topic]"
git push origin main  # or your feature branch
```

### 2. Create a New Page

```bash
# 1. Create .astro file
touch src/pages/my-page.astro

# 2. Add basic structure
cat > src/pages/my-page.astro << 'EOF'
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout
  title="My Page Title"
  description="Page description for SEO"
>
  <h1>My Page</h1>
  <p>Content goes here...</p>
</BaseLayout>
EOF

# 3. Preview at http://localhost:4321/my-page

# 4. For bilingual site, also create:
touch src/pages/en/my-page.astro
```

### 3. Edit Existing Content

```bash
# Find the file you want to edit
# Examples:
# - Homepage: src/pages/index.astro
# - About page: src/pages/about.astro
# - Blog post: src/content/blog/fr/existing-post.md

# Make your changes, then:
git add .
git commit -m "fix: Update homepage hero section"
git push origin main
```

### 4. Add Images

```bash
# 1. Add image to public folder
cp ~/Downloads/my-image.jpg public/images/

# 2. Reference in Markdown or Astro
# In Markdown:
![Alt text](/images/my-image.jpg)

# In Astro:
<img src="/images/my-image.jpg" alt="Alt text" />
```

---

## CI/CD: How Deployments Work

### Auto-Deployment Pipeline

**Every time you push to `main` branch**:

1. **GitHub Actions starts** (visible at: https://github.com/alexandrefed/www.vecia.fr/actions)
2. **Builds Docker image** with your changes (~2-3 min)
3. **Transfers to VPS** (Alexandre's server)
4. **Restarts container** with new code
5. **Clears nginx cache** (important for CSS/JS updates)
6. **Runs health checks**
7. **Goes live** at https://vecia.com

**Total time**: ~5 minutes from push to live

### Checking Deployment Status

1. **Go to Actions tab**: https://github.com/alexandrefed/www.vecia.fr/actions
2. **Find your commit**: Look for your commit message
3. **Status indicators**:
   - 🟡 Yellow circle = In progress
   - ✅ Green checkmark = Success
   - ❌ Red X = Failed (click to see logs)

### If Deployment Fails

1. **Click on the failed workflow**
2. **Read the error logs** (usually build errors)
3. **Common issues**:
   - TypeScript errors → Run `npm run astro check` locally
   - Syntax errors → Check file you edited
   - Missing frontmatter → Blog posts need all required fields
4. **Fix the error locally**
5. **Commit and push again** → triggers new deployment

---

## Troubleshooting

### Problem: Changes don't appear on website

**Solution 1: Hard refresh browser**
```
Mac: Cmd + Shift + R
Windows: Ctrl + Shift + F5
```

**Solution 2: Check deployment status**
- Go to GitHub Actions
- Make sure deployment succeeded (green checkmark)
- Wait 5 minutes after push

**Solution 3: Ask Alexandre to clear nginx cache**
- Sometimes CDN caching causes delays

### Problem: Build fails with TypeScript errors

**Solution: Check types locally before pushing**
```bash
npm run astro check
# Fix any errors shown
# Then commit and push
```

### Problem: Blog post not showing in list

**Checklist**:
- [ ] File is in `src/content/blog/fr/` or `/en/`
- [ ] Frontmatter is valid (check commas, quotes)
- [ ] `publishDate` is not in the future
- [ ] File has `.md` extension
- [ ] All required fields present (title, description, publishDate, author, category)

### Problem: Local dev server won't start

**Solutions**:
```bash
# 1. Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# 2. Make sure you're using Node 20+
node --version  # Should be 20.18.1 or higher

# 3. Check for port conflicts
lsof -i :4321  # If something is using port 4321
# Kill it or change port in astro.config.mjs
```

### Problem: Can't push to GitHub

**Solutions**:
```bash
# 1. Make sure you're on the right branch
git branch  # Should show * main or * feature/your-branch

# 2. Pull latest changes first
git pull origin main

# 3. If conflicts, resolve them
git status  # Shows conflicted files
# Edit files to resolve conflicts
git add .
git commit -m "fix: Resolve merge conflicts"
git push origin main

# 4. If still stuck, ask Alexandre for help
```

---

## Best Practices

### Writing Commit Messages

**Good examples**:
```
feat: Add blog post about AI automation tips
fix: Correct typo in homepage hero section
docs: Update README with deployment steps
style: Improve mobile responsiveness for blog list
refactor: Simplify LeadCaptureForm component
```

**Bad examples**:
```
update
changes
stuff
asdf
```

### Branch Naming

**For features**:
```
feature/tanguy-contact-form
feature/tanguy-newsletter-signup
```

**For bug fixes**:
```
fix/tanguy-footer-typo
fix/tanguy-blog-date-format
```

**For content**:
```
content/tanguy-january-blogs
content/tanguy-about-page-update
```

### Before Committing

**Always run**:
```bash
npm run build  # Check for build errors
# Fix any errors before committing
```

---

## Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build
npm run astro check      # Check for errors

# Git
git status               # See what changed
git add .                # Stage all changes
git commit -m "message"  # Commit changes
git push origin main     # Push to GitHub
git pull origin main     # Get latest changes
git checkout -b name     # Create new branch
git checkout main        # Switch to main branch

# View logs
git log                  # See commit history
git log --oneline        # Compact history
```

---

## Getting Help

### Resources

1. **Project Documentation**:
   - Main guide: `docs/CLAUDE.md`
   - Astro reference: `docs/ASTRO_REFERENCE.md`
   - Deployment guide: `docs/astro-deployment.md`

2. **External Documentation**:
   - Astro docs: https://docs.astro.build
   - Tailwind CSS: https://tailwindcss.com/docs
   - Alpine.js: https://alpinejs.dev/start-here

3. **Ask Alexandre**:
   - Via GitHub PR comments
   - Direct message
   - Email

### Quick Questions?

**Before asking, try**:
1. Check if deployment succeeded (GitHub Actions)
2. Hard refresh browser (Cmd+Shift+R)
3. Search for error message in documentation
4. Run `npm run astro check` to find issues

**Then ask with**:
- What you're trying to do
- What error you're seeing
- What you've already tried
- Screenshots if helpful

---

## Next Steps

**This week**:
1. ✅ Accept GitHub invitation
2. ✅ Read this guide
3. ✅ Create your first blog post via GitHub web UI
4. ✅ Watch it deploy and go live

**Next week** (optional):
1. Set up local development environment
2. Clone repository
3. Make a small edit locally
4. Push and see CI/CD in action

**Ongoing**:
- Create content regularly
- Experiment with pages and components
- Ask questions when stuck
- Suggest improvements

---

**Welcome to the team! 🚀**

Questions? Ask Alexandre or create a GitHub issue.
