# Git Quick Start for Vecia Team

**For:** Alexandre & Tanguy
**Last Updated:** January 2025

---

## First Time Setup

```bash
# Clone the repo
git clone https://github.com/alexandrefed/www.vecia.fr.git
cd www.vecia.fr

# Install dependencies
npm install

# Start dev server
npm run dev
# Site runs at http://localhost:4321
```

---

## Daily Workflow

### 1. Before ANY Work

```bash
# Always pull latest changes first!
git checkout main
git pull origin main
```

### 2. Create Feature Branch

```bash
# Create your branch (use your name as prefix)
git checkout -b tanguy/description-of-change
# or
git checkout -b alex/description-of-change

# Examples:
git checkout -b tanguy/update-pricing-page
git checkout -b alex/fix-mobile-menu
```

### 3. Make Changes & Commit

```bash
# ... make your changes ...

# Check what you changed
git status

# Commit with clear message
git add .
git commit -m "feat: description of what you did"

# Push to GitHub
git push origin tanguy/your-branch-name
```

### 4. Create Pull Request

1. Go to GitHub: https://github.com/alexandrefed/www.vecia.fr
2. Click "Compare & pull request" (yellow banner)
3. Add description of changes
4. Click "Create pull request"
5. Merge when ready (or ask for review)

---

## Commit Message Format

```bash
git commit -m "feat: add contact form validation"
git commit -m "fix: correct mobile menu z-index"
git commit -m "style: update hero colors"
git commit -m "docs: add setup instructions"
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `style` - CSS/design changes
- `docs` - Documentation
- `refactor` - Code cleanup

---

## Golden Rules

| ✅ DO | ❌ DON'T |
|-------|----------|
| Always create a branch | Never commit directly to `main` |
| Pull before starting work | Don't work on stale code |
| Small, focused changes | Don't bundle unrelated changes |
| Tell the other person what you're working on | Don't both edit same files |

---

## Communication

Quick message before working:
> "Je travaille sur la page pricing cet après-midi"

This prevents both of us editing the same files = no merge conflicts.

---

## If Something Goes Wrong

```bash
# Undo uncommitted changes
git checkout -- .

# Undo last commit (keep changes)
git reset HEAD~1

# Totally stuck?
git stash           # Save changes aside
git checkout main   # Go back to clean state
git pull            # Get latest
# Ask the other person for help
```

---

## Quick Reference

```bash
# Start of day
git checkout main && git pull

# Start feature
git checkout -b tanguy/feature-name

# Save work
git add . && git commit -m "feat: description"

# Push to GitHub
git push origin tanguy/feature-name

# Then: Create PR on GitHub → Merge
```

---

**Advanced docs:** See [GIT-WORKFLOW.md](./GIT-WORKFLOW.md) for Odoo automation and CI/CD details.
