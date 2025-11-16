# GitHub Collaboration Setup - Summary for Alexandre

## Quick Action Items for You

### 1. Add Tanguy as GitHub Collaborator (5 minutes)

**Steps**:
1. Go to: https://github.com/alexandrefed/www.vecia.fr/settings/access
2. Click "Add people"
3. Enter Tanguy's GitHub username
4. Select role: **"Write"**
5. Click "Send invitation"

**Why "Write" access?**
- ✅ Can create branches, push code, create/merge PRs
- ✅ Can trigger CI/CD deployments (push to main)
- ❌ Cannot access GitHub Secrets (VPS SSH keys, Supabase credentials)
- ❌ Cannot modify repository settings or delete repo
- ❌ Cannot manage collaborators

**Security**: Your VPS SSH keys and production secrets remain protected.

---

### 2. Share Information with Tanguy

**Send to Tanguy**:

```
Hi Tanguy,

You now have access to the Vecia website repository!

Repository: https://github.com/alexandrefed/www.vecia.fr
Quick Start Guide: docs/TANGUY-QUICKSTART.md

Getting started:
1. Accept the GitHub invitation (check your email)
2. Read the Quick Start guide in the repo
3. Try creating a blog post via GitHub web UI (no local setup needed)

The site auto-deploys to https://vecia.com when you push to main branch.
Takes about 5 minutes from commit to live.

Let me know if you have any questions!
```

**If he needs local development** (for creating pages/forms):
- Share the `.env` file contents with Supabase credentials
- Point him to "Local Development Setup" section in his guide

---

### 3. Optional: Configure Branch Protection

**If you want to review Tanguy's changes before they go live**:

1. Go to: https://github.com/alexandrefed/www.vecia.fr/settings/branches
2. Click "Add branch protection rule"
3. Branch name pattern: `main`
4. Enable:
   - ✅ Require a pull request before merging
   - ✅ Require approvals: 1 (you)
   - ✅ Dismiss stale pull request approvals
   - ✅ Allow specified actors to bypass (add yourself for emergencies)
5. Save changes

**Workflow with protection**:
- Tanguy creates feature branch → makes changes → creates PR
- You review → approve → Tanguy merges
- Auto-deploys to production

**Workflow without protection** (current):
- Tanguy pushes to main → auto-deploys immediately
- Faster iteration, more trust required

**Recommendation**: Start without protection. Add it later if you notice issues or want code review gates.

---

## What Tanguy Can Do

### Content Creation

**Blog Posts** (Easiest):
- Create Markdown files in `src/content/blog/fr/` or `/en/`
- Via GitHub web UI (no local setup) OR locally
- Auto-deploys to https://vecia.com/blog/[slug]

**Pages**:
- Create `.astro` files in `src/pages/`
- Requires Astro knowledge
- Best done with local development

**Forms**:
- Build using Alpine.js + Astro components
- Example: `src/components/LeadCaptureForm.astro`
- More complex, requires review

**Components**:
- Edit UI components in `src/components/`
- Shared across pages

---

## CI/CD Pipeline

### What Happens on Push to Main

1. **GitHub Actions triggers** (.github/workflows/deploy.yml)
2. **Docker build** (~2-3 min with layer caching)
3. **Image transfer** to VPS via rsync
4. **Container restart** with new code
5. **Nginx cache clear** (critical for CSS/JS hash changes)
6. **Health check** (POST /api/health.json)
7. **Live** at https://vecia.com

**Total time**: ~5 minutes

### Monitoring Deployments

**GitHub Actions**: https://github.com/alexandrefed/www.vecia.fr/actions
- ✅ Green = Success
- ❌ Red = Failed (click for logs)
- 🟡 Yellow = In progress

**Tanguy can see all deployment logs** (but not secrets)

---

## Rollback Strategy

### If Tanguy Breaks Something

**Option 1: Revert Commit (Recommended)**
```bash
git revert HEAD
git push origin main
# Triggers new deployment with previous version
```

**Option 2: Direct VPS Rollback** (Alexandre only)
```bash
ssh vecia-vps
cd /var/www/vecia-website
docker compose down
# Load previous image version
docker compose up -d
```

**Option 3: Redeploy Specific Commit**
```bash
git checkout <good-commit-hash>
git push --force origin main  # Use with caution
```

---

## Security Considerations

### What Tanguy CANNOT Access

❌ GitHub Actions Secrets:
- `VPS_SSH_KEY`
- `VPS_HOST`
- `VPS_PORT`
- `VPS_USERNAME`
- `VPS_TARGET_DIR`
- Supabase production credentials

❌ VPS Server:
- No SSH access to 85.25.172.47
- Cannot modify nginx config
- Cannot access Docker logs
- Cannot restart services

❌ Repository Settings:
- Cannot delete repository
- Cannot modify branch protection rules
- Cannot manage other collaborators
- Cannot change repository visibility

### What Tanguy CAN Access

✅ Full source code (read/write)
✅ Commit history
✅ Create/merge pull requests
✅ Trigger deployments (via push to main)
✅ View GitHub Actions logs (but not secrets)
✅ Clone repository locally

---

## Recommended Workflows

### Scenario 1: Simple Blog Post

**Fast Track**:
1. GitHub web UI → create `.md` file in `src/content/blog/fr/`
2. Commit directly to `main`
3. Auto-deploys in 5 minutes
4. Live at `https://vecia.com/blog/[slug]`

**No review needed** for straightforward content.

---

### Scenario 2: New Page or Complex Feature

**With Review**:
1. Tanguy creates feature branch: `feature/tanguy-contact-page`
2. Pushes changes to branch
3. Creates Pull Request
4. You review code (check for errors, security issues)
5. Approve PR
6. Tanguy merges → auto-deploys

**Benefits**: Catch errors before production, discuss approach, mentor Tanguy.

---

### Scenario 3: Urgent Fix

**Direct Push**:
1. Tanguy fixes typo/bug locally or via GitHub UI
2. Commits to `main` with message: `fix: Correct typo in homepage`
3. Auto-deploys immediately

**Trust required**, but fast for critical issues.

---

## Common Issues & Solutions

### Issue: Deployment Fails

**Check GitHub Actions logs**:
- Go to Actions tab
- Click failed workflow
- Read error message

**Common causes**:
- TypeScript errors → Run `npm run astro check`
- Syntax errors in Astro/Markdown
- Missing frontmatter in blog posts
- Build failures

**Fix**: Tanguy commits correction → new deployment triggered

---

### Issue: Changes Don't Appear on Site

**Troubleshooting**:
1. Hard refresh browser (Cmd+Shift+R)
2. Check deployment succeeded (GitHub Actions ✅)
3. Wait 5 minutes (deployment in progress)
4. Clear nginx cache (you can do this via SSH)

**Nginx cache clear** (if needed):
```bash
ssh vecia-vps
docker exec vecia-website sh -c "rm -rf /app/client/_astro/*"
# Or restart nginx
sudo systemctl reload nginx
```

---

### Issue: Merge Conflicts

**When**: Multiple people edit same file

**Resolution**:
1. Tanguy pulls latest: `git pull origin main`
2. Resolves conflicts in editor
3. Commits resolved version
4. Pushes again

**GitHub UI** can also resolve simple conflicts.

---

## Monitoring & Analytics

### Site Health

**Health endpoint**: https://vecia.com/api/health.json
- Should return: `{"status": "healthy", "timestamp": "..."}`
- Part of deployment pipeline (health check)

**Logs Access**:
- **GitHub Actions**: Tanguy can see (deployment logs)
- **Docker logs**: Only you (SSH access)
- **Nginx logs**: Only you (VPS access)

---

## Environment Variables

### Production (GitHub Secrets)

**Already configured** (no action needed):
```
VPS_SSH_KEY = <base64-encoded-private-key>
VPS_HOST = 85.25.172.47
VPS_PORT = 22
VPS_USERNAME = deploy
VPS_TARGET_DIR = /var/www/vecia-website
```

### Local Development (.env file)

**If Tanguy needs local dev** (Supabase comments testing):

```env
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**Share this via secure channel** (Signal, password manager).

**Note**: `.env` is gitignored (not in repository).

---

## Documentation for Tanguy

### Essential Reading

1. **TANGUY-QUICKSTART.md** (this was created for him)
   - First steps
   - How to create blog posts
   - Local dev setup
   - Common tasks
   - Troubleshooting

2. **CLAUDE.md** (project overview)
   - Architecture decisions
   - Best practices
   - Coding standards
   - Command reference

3. **ASTRO_REFERENCE.md** (framework guide)
   - Astro concepts
   - Component patterns
   - Routing
   - Content Collections

### For Specific Features

- **i18n**: `docs/ASTRO-I18N-REFERENCE.md`
- **Styling**: `docs/TAILWIND-REFERENCE.md`
- **Interactivity**: `docs/ALPINEJS-REFERENCE.md`
- **Deployment**: `docs/astro-deployment.md`

---

## Future Considerations

### Option A: Add Staging Environment

**Create `staging` branch**:
- Tanguy pushes to `staging` first
- Auto-deploys to staging.vecia.com (separate subdomain)
- You approve → merges to `main` (production)

**Requires**:
- Second VPS container or Vercel/Netlify preview
- Modified GitHub Actions workflow
- DNS configuration for staging.vecia.com

---

### Option B: Add CMS (Content Management System)

**If Tanguy prefers GUI over Git**:

**Options**:
- Sanity Studio (headless CMS)
- Contentful
- Decap CMS (formerly Netlify CMS)

**Workflow**:
- Tanguy edits content in web UI
- CMS saves to Git repository
- CI/CD deploys automatically

**Benefits**: No Git/code knowledge required for content.
**Tradeoffs**: Extra cost (~$20/month), setup complexity.

---

### Option C: Vercel/Netlify Preview Deployments

**Every PR gets preview URL**:
- Tanguy creates PR
- Vercel builds preview: `pr-123-vecia.vercel.app`
- You review live preview
- Merge → deploys to production

**Benefits**: Test changes before production merge.
**Tradeoffs**: Migration from VPS to Vercel/Netlify, cost.

---

## Communication Plan

### Initial Onboarding (This Week)

**30-min call with Tanguy**:
1. Walk through repository structure
2. Demonstrate creating blog post via GitHub UI
3. Show GitHub Actions deployment pipeline
4. Answer questions
5. Assign first task: "Create a blog post about [topic]"

### Ongoing

**GitHub Issues**: For feature requests, bugs
**PR Comments**: For code discussion
**Direct Messages**: For urgent questions

---

## Success Metrics

### Week 1
- [ ] Tanguy creates 1-2 blog posts successfully
- [ ] Blog posts go live without errors
- [ ] Tanguy understands CI/CD pipeline

### Week 2
- [ ] Tanguy sets up local development (if needed)
- [ ] Creates feature branch, makes changes, pushes
- [ ] Understands PR workflow

### Month 1
- [ ] Tanguy works independently on content
- [ ] Minimal intervention from you
- [ ] Potentially creates pages/components with review

---

## Checklist

**Before Tanguy Starts**:
- [ ] Add Tanguy as GitHub collaborator (Write access)
- [ ] Send him repository URL + Quick Start guide link
- [ ] Share `.env` credentials if he needs local dev
- [ ] Optional: Configure branch protection
- [ ] Schedule 30-min onboarding call

**After Onboarding**:
- [ ] Tanguy accepts GitHub invitation
- [ ] Tanguy reads TANGUY-QUICKSTART.md
- [ ] Tanguy creates first blog post (test run)
- [ ] Watch deployment together
- [ ] Answer questions

**Ongoing**:
- [ ] Review PRs when needed
- [ ] Monitor deployments for issues
- [ ] Provide feedback on content
- [ ] Adjust permissions/workflow as trust builds

---

## Contact Information

**Repository**: https://github.com/alexandrefed/www.vecia.fr
**Live Site**: https://vecia.com
**Actions**: https://github.com/alexandrefed/www.vecia.fr/actions

**VPS Details** (Alexandre only):
- Host: 85.25.172.47
- SSH: `ssh vecia-vps`
- Container: `vecia-website`
- Directory: `/var/www/vecia-website/`

---

**Ready to onboard Tanguy! 🚀**

Next step: Add him as collaborator on GitHub.
