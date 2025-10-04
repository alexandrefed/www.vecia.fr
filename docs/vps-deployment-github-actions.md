# Astro to VPS Deployment with GitHub Actions CI/CD

Complete guide for deploying Astro websites from Mac to VPS using GitHub Actions, following 2025 security best practices.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Part 1: VPS Server Setup](#part-1-vps-server-setup)
- [Part 2: SSH Key Configuration (2025 Best Practices)](#part-2-ssh-key-configuration-2025-best-practices)
- [Part 3: VPS Web Server Setup](#part-3-vps-web-server-setup)
- [Part 4: GitHub Repository Setup](#part-4-github-repository-setup)
- [Part 5: GitHub Actions Workflow](#part-5-github-actions-workflow)
- [Part 6: First Deployment](#part-6-first-deployment)
- [Security Best Practices](#security-best-practices)
- [Troubleshooting](#troubleshooting)

---

## Overview

### What This Guide Covers

This guide sets up **automated CI/CD deployment** from your Mac to your VPS:

1. **Push code** to GitHub from Mac
2. **GitHub Actions** automatically builds your Astro site
3. **Deployment** via SSH to your VPS
4. **Nginx** serves the static site

### Architecture

```
Mac (Development)
    ↓ git push
GitHub Repository
    ↓ GitHub Actions (Build + Deploy)
VPS (Production)
    ↓ Nginx serves
Users access your site
```

### Benefits

✅ **Automated**: Push code, automatic deployment
✅ **Secure**: SSH key authentication, no passwords
✅ **Fast**: Only changed files are transferred
✅ **Reliable**: Build failures prevent bad deployments
✅ **Cost-effective**: Full control on your VPS

---

## Prerequisites

### On Your Mac

- Git installed
- GitHub account
- Code editor (VS Code recommended)
- Astro project ready

### VPS Requirements

- Ubuntu 22.04/24.04 LTS (or similar Linux)
- Root or sudo access
- Minimum 1GB RAM
- Public IP address
- Domain name (optional but recommended)

**Recommended VPS Providers:**
- [DigitalOcean](https://www.digitalocean.com/) - $6/month
- [Vultr](https://www.vultr.com/) - $6/month
- [Hetzner](https://www.hetzner.com/) - €4/month
- [Linode](https://www.linode.com/) - $5/month

---

## Part 1: VPS Server Setup

### 1.1 Initial Server Access

```bash
# SSH into your VPS (replace with your IP)
ssh root@your-vps-ip
```

### 1.2 Update System

```bash
# Update package lists and upgrade
sudo apt update && sudo apt upgrade -y

# Install essential packages
sudo apt install -y curl wget git ufw nginx
```

### 1.3 Configure Firewall

```bash
# Allow SSH, HTTP, and HTTPS
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

### 1.4 Create Deployment User

**Security Best Practice:** Don't deploy as root.

```bash
# Create deployment user
sudo adduser deploy

# Add to sudo group (if needed)
sudo usermod -aG sudo deploy

# Create web directory
sudo mkdir -p /var/www/yoursite
sudo chown -R deploy:deploy /var/www/yoursite

# Switch to deploy user
su - deploy
```

---

## Part 2: SSH Key Configuration (2025 Best Practices)

### 2.1 Generate ED25519 SSH Key on Mac

**ED25519 is the 2025 standard** - more secure, faster, shorter than RSA.

```bash
# On your Mac - generate ED25519 key
ssh-keygen -t ed25519 -a 200 -f ~/.ssh/deploy_yoursite_2025 -C "deploy+[email protected]"
```

**Explanation:**
- `-t ed25519`: Uses modern ED25519 algorithm
- `-a 200`: 200 KDF rounds (key derivation function)
- `-f ~/.ssh/deploy_yoursite_2025`: Descriptive filename with year
- `-C "comment"`: Meaningful comment (your email or identifier)

**When prompted:**
```
Enter passphrase (empty for no passphrase): [Type a strong passphrase]
Enter same passphrase again: [Repeat passphrase]
```

**⚠️ IMPORTANT:** Always use a passphrase! This protects your key if your Mac is compromised.

### 2.2 Add Public Key to VPS

**On your Mac:**

```bash
# Copy your public key to clipboard
# macOS:
cat ~/.ssh/deploy_yoursite_2025.pub | pbcopy

# Linux:
cat ~/.ssh/deploy_yoursite_2025.pub | xclip -selection clipboard
```

**On your VPS (as deploy user):**

```bash
# Create .ssh directory
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Add public key to authorized_keys
nano ~/.ssh/authorized_keys
# Paste your public key, save (Ctrl+X, Y, Enter)

# Set correct permissions
chmod 600 ~/.ssh/authorized_keys
```

### 2.3 Test SSH Connection

**On your Mac:**

```bash
# Test connection with your new key
ssh -i ~/.ssh/deploy_yoursite_2025 deploy@your-vps-ip

# If successful, add to SSH config for easy access
nano ~/.ssh/config
```

**Add to `~/.ssh/config`:**

```
Host yoursite-vps
    HostName your-vps-ip
    User deploy
    IdentityFile ~/.ssh/deploy_yoursite_2025
    Port 22
```

**Now you can connect with:**

```bash
ssh yoursite-vps
```

### 2.4 Disable Password Authentication (Security Hardening)

**On your VPS:**

```bash
# Edit SSH config
sudo nano /etc/ssh/sshd_config
```

**Find and modify these lines:**

```
PasswordAuthentication no
PubkeyAuthentication yes
PermitRootLogin no
```

**Restart SSH:**

```bash
sudo systemctl restart ssh
```

---

## Part 3: VPS Web Server Setup

### 3.1 Configure Nginx for Static Site

**On your VPS:**

```bash
# Create Nginx site configuration
sudo nano /etc/nginx/sites-available/yoursite
```

**Add this configuration:**

```nginx
server {
    listen 80;
    listen [::]:80;

    server_name yourdomain.com www.yourdomain.com;

    root /var/www/yoursite;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1000;
    gzip_proxied any;
    gzip_types text/plain text/css text/xml text/javascript
               application/x-javascript application/xml+rss
               application/json application/javascript;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Cache control for static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Main location block
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Deny access to hidden files
    location ~ /\. {
        deny all;
    }
}
```

**Enable the site:**

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/yoursite /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### 3.2 Setup SSL with Let's Encrypt (Optional but Recommended)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal is configured automatically
# Test renewal:
sudo certbot renew --dry-run
```

---

## Part 4: GitHub Repository Setup

### 4.1 Add SSH Private Key to GitHub Secrets

**On your Mac:**

```bash
# Copy your PRIVATE key (yes, private - GitHub needs it to SSH to VPS)
cat ~/.ssh/deploy_yoursite_2025
```

**Copy the entire output** (including `-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END OPENSSH PRIVATE KEY-----`)

**On GitHub:**

1. Go to your repository
2. **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Create these secrets:

| Secret Name | Value |
|------------|-------|
| `VPS_HOST` | Your VPS IP address (e.g., `123.45.67.89`) |
| `VPS_USERNAME` | `deploy` (or your deployment user) |
| `VPS_SSH_KEY` | Your entire private key content |
| `VPS_PORT` | `22` (unless you changed SSH port) |
| `VPS_TARGET_DIR` | `/var/www/yoursite` |

**Optional secrets (if using passphrase):**

| Secret Name | Value |
|------------|-------|
| `VPS_SSH_PASSPHRASE` | Your SSH key passphrase |

### 4.2 Get VPS Host Fingerprint (Prevents MITM Attacks)

**On your Mac:**

```bash
# Get host fingerprint
ssh-keyscan -H your-vps-ip
```

**Add to GitHub Secrets:**

| Secret Name | Value |
|------------|-------|
| `VPS_HOST_FINGERPRINT` | Output from ssh-keyscan |

---

## Part 5: GitHub Actions Workflow

### 5.1 Create Workflow File

**In your Astro project:**

```bash
mkdir -p .github/workflows
nano .github/workflows/deploy.yml
```

### 5.2 Basic Deployment Workflow

```yaml
name: Deploy to VPS

on:
  push:
    branches: [main]
  workflow_dispatch:  # Allow manual trigger

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build Astro site
        run: npm run build
        env:
          # Add any build-time environment variables here
          PUBLIC_SITE_URL: ${{ secrets.PUBLIC_SITE_URL }}

      - name: Deploy to VPS via SSH
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USERNAME }}
          key: ${{ secrets.VPS_SSH_KEY }}
          passphrase: ${{ secrets.VPS_SSH_PASSPHRASE }}
          port: ${{ secrets.VPS_PORT }}
          fingerprint: ${{ secrets.VPS_HOST_FINGERPRINT }}
          script: |
            # Backup current deployment
            if [ -d "${{ secrets.VPS_TARGET_DIR }}" ]; then
              sudo cp -r ${{ secrets.VPS_TARGET_DIR }} ${{ secrets.VPS_TARGET_DIR }}.backup.$(date +%Y%m%d_%H%M%S)
            fi

            # Create target directory if it doesn't exist
            sudo mkdir -p ${{ secrets.VPS_TARGET_DIR }}
            sudo chown -R ${{ secrets.VPS_USERNAME }}:${{ secrets.VPS_USERNAME }} ${{ secrets.VPS_TARGET_DIR }}

      - name: Transfer files to VPS
        uses: appleboy/scp-action@v0.1.7
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USERNAME }}
          key: ${{ secrets.VPS_SSH_KEY }}
          passphrase: ${{ secrets.VPS_SSH_PASSPHRASE }}
          port: ${{ secrets.VPS_PORT }}
          source: "dist/*"
          target: ${{ secrets.VPS_TARGET_DIR }}
          strip_components: 1
          overwrite: true

      - name: Set permissions and reload Nginx
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USERNAME }}
          key: ${{ secrets.VPS_SSH_KEY }}
          passphrase: ${{ secrets.VPS_SSH_PASSPHRASE }}
          port: ${{ secrets.VPS_PORT }}
          script: |
            # Set proper permissions
            sudo chown -R www-data:www-data ${{ secrets.VPS_TARGET_DIR }}
            sudo find ${{ secrets.VPS_TARGET_DIR }} -type d -exec chmod 755 {} \;
            sudo find ${{ secrets.VPS_TARGET_DIR }} -type f -exec chmod 644 {} \;

            # Test and reload Nginx
            sudo nginx -t && sudo systemctl reload nginx

            echo "✅ Deployment successful!"
```

### 5.3 Advanced Workflow with Rsync (Recommended)

**Better performance** - only transfers changed files:

```yaml
name: Deploy to VPS (Optimized)

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run type checking
        run: npm run astro check

      - name: Build Astro site
        run: npm run build

      - name: Deploy with rsync
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USERNAME }}
          key: ${{ secrets.VPS_SSH_KEY }}
          passphrase: ${{ secrets.VPS_SSH_PASSPHRASE }}
          port: ${{ secrets.VPS_PORT }}
          fingerprint: ${{ secrets.VPS_HOST_FINGERPRINT }}
          script: |
            # Create temp directory for build
            mkdir -p ~/temp_deploy

      - name: Copy build artifacts to temp
        uses: appleboy/scp-action@v0.1.7
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USERNAME }}
          key: ${{ secrets.VPS_SSH_KEY }}
          passphrase: ${{ secrets.VPS_SSH_PASSPHRASE }}
          port: ${{ secrets.VPS_PORT }}
          source: "dist/*"
          target: "~/temp_deploy/"
          strip_components: 1

      - name: Atomic deployment with rsync
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USERNAME }}
          key: ${{ secrets.VPS_SSH_KEY }}
          passphrase: ${{ secrets.VPS_SSH_PASSPHRASE }}
          port: ${{ secrets.VPS_PORT }}
          script: |
            # Rsync from temp to production (atomic-ish)
            sudo rsync -avz --delete \
              --exclude='.git' \
              --exclude='node_modules' \
              ~/temp_deploy/dist/ \
              ${{ secrets.VPS_TARGET_DIR }}/

            # Set permissions
            sudo chown -R www-data:www-data ${{ secrets.VPS_TARGET_DIR }}
            sudo find ${{ secrets.VPS_TARGET_DIR }} -type d -exec chmod 755 {} \;
            sudo find ${{ secrets.VPS_TARGET_DIR }} -type f -exec chmod 644 {} \;

            # Reload Nginx
            sudo nginx -t && sudo systemctl reload nginx

            # Cleanup
            rm -rf ~/temp_deploy

            echo "✅ Deployment completed successfully!"
```

---

## Part 6: First Deployment

### 6.1 Commit and Push

```bash
# On your Mac
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Actions deployment workflow"
git push origin main
```

### 6.2 Monitor Deployment

1. Go to GitHub repository
2. Click **Actions** tab
3. Watch the workflow run
4. Green checkmark = success!

### 6.3 Verify Deployment

```bash
# Check your site
curl -I http://yourdomain.com

# Or visit in browser
open http://yourdomain.com
```

---

## Security Best Practices

### 1. Secret Management (2025 Standards)

**✅ DO:**
- Rotate SSH keys every 1-2 years
- Use meaningful key names with year: `deploy_site_2025`
- Always use passphrases on SSH keys
- Use ED25519 algorithm (not RSA)
- Limit secret access to specific environments
- Use GitHub's OIDC for cloud deployments when possible

**❌ DON'T:**
- Share private keys
- Commit secrets to repository
- Use the same key everywhere
- Use password authentication
- Leave default SSH comments

### 2. SSH Key Rotation Schedule

```bash
# Every 1-2 years, generate new key
ssh-keygen -t ed25519 -a 200 -f ~/.ssh/deploy_yoursite_2027 -C "deploy+[email protected]"

# Update on VPS
ssh yoursite-vps
nano ~/.ssh/authorized_keys
# Add new key, keep old for transition period
# After confirming new key works, remove old key

# Update GitHub Secret VPS_SSH_KEY with new private key
```

### 3. VPS Security Hardening

```bash
# Install fail2ban (blocks brute force attacks)
sudo apt install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Configure automatic security updates
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades

# Check for open ports
sudo ss -tulpn

# Monitor logs
sudo tail -f /var/log/auth.log
```

### 4. Nginx Security Headers

Add to your Nginx config:

```nginx
# Security headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

### 5. Environment-Based Deployments

For staging/production separation:

```yaml
name: Deploy

on:
  push:
    branches: [main, staging]

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: ${{ github.ref == 'refs/heads/main' && 'production' || 'staging' }}

    steps:
      # Use environment-specific secrets
      # production.VPS_HOST vs staging.VPS_HOST
```

### 6. Deployment Approval for Production

Add to workflow:

```yaml
environment:
  name: production
  # Require manual approval before deploying to production
```

Configure in GitHub: **Settings → Environments → production → Required reviewers**

---

## Troubleshooting

### Issue: "Permission denied (publickey)"

**Solution:**

```bash
# On Mac - test SSH connection with verbose output
ssh -vvv -i ~/.ssh/deploy_yoursite_2025 deploy@your-vps-ip

# Check key is in authorized_keys on VPS
cat ~/.ssh/authorized_keys

# Verify permissions on VPS
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

### Issue: "Host key verification failed"

**Solution:**

```bash
# Remove old host key
ssh-keygen -R your-vps-ip

# Re-add host fingerprint
ssh-keyscan -H your-vps-ip >> ~/.ssh/known_hosts
```

### Issue: GitHub Actions fails at deployment step

**Check:**

1. All secrets are correctly set in GitHub
2. Private key includes header/footer
3. VPS user has sudo permissions
4. Target directory exists and has correct ownership

**Debug in GitHub Actions:**

Add to workflow:

```yaml
- name: Debug SSH connection
  uses: appleboy/ssh-action@v1
  with:
    host: ${{ secrets.VPS_HOST }}
    username: ${{ secrets.VPS_USERNAME }}
    key: ${{ secrets.VPS_SSH_KEY }}
    port: ${{ secrets.VPS_PORT }}
    debug: true
    script: |
      whoami
      pwd
      ls -la ${{ secrets.VPS_TARGET_DIR }}
```

### Issue: Nginx shows default page

**Solution:**

```bash
# On VPS - check Nginx config
sudo nginx -t

# Check site is enabled
ls -la /etc/nginx/sites-enabled/

# Check web root
ls -la /var/www/yoursite/

# Reload Nginx
sudo systemctl reload nginx

# Check error logs
sudo tail -f /var/log/nginx/error.log
```

### Issue: 502 Bad Gateway (if using SSR)

This guide is for **static sites**. For SSR:

```bash
# Install Node.js adapter
npx astro add node

# Configure as standalone server
# See docs/astro-deployment.md for SSR setup
```

### Issue: Build fails in GitHub Actions

**Common causes:**

```yaml
# Make sure you're using the right Node version
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: 20  # Match your local version

# Use npm ci (not npm install) for reproducible builds
- name: Install dependencies
  run: npm ci
```

---

## Deployment Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│ Developer (Mac)                                                 │
│ ┌───────────────────────────────────────────────────────────┐  │
│ │ git push origin main                                       │  │
│ └───────────────────────┬───────────────────────────────────┘  │
└─────────────────────────┼───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│ GitHub                                                          │
│ ┌───────────────────────────────────────────────────────────┐  │
│ │ GitHub Actions Workflow Triggered                          │  │
│ │   1. Checkout code                                         │  │
│ │   2. Setup Node.js                                         │  │
│ │   3. Install dependencies (npm ci)                         │  │
│ │   4. Run type checking (astro check)                       │  │
│ │   5. Build Astro site (npm run build)                      │  │
│ │   6. SSH to VPS and prepare deployment                     │  │
│ │   7. Transfer dist/ files via SCP/rsync                    │  │
│ │   8. Set permissions                                        │  │
│ │   9. Reload Nginx                                          │  │
│ └───────────────────────┬───────────────────────────────────┘  │
└─────────────────────────┼───────────────────────────────────────┘
                          │
                          ▼ (SSH Connection with ED25519 Key)
┌─────────────────────────────────────────────────────────────────┐
│ VPS Server                                                      │
│ ┌───────────────────────────────────────────────────────────┐  │
│ │ Nginx serves static files from /var/www/yoursite          │  │
│ │   - Gzip compression                                       │  │
│ │   - Security headers                                       │  │
│ │   - SSL/TLS (Let's Encrypt)                               │  │
│ │   - Cache control                                         │  │
│ └───────────────────────┬───────────────────────────────────┘  │
└─────────────────────────┼───────────────────────────────────────┘
                          │
                          ▼
                    ┌───────────┐
                    │   Users   │
                    └───────────┘
```

---

## Quick Reference Commands

### Development (Mac)

```bash
# Build locally
npm run build

# Preview production build
npm run preview

# Deploy (via GitHub)
git add .
git commit -m "Update content"
git push origin main
```

### VPS Management

```bash
# SSH to VPS
ssh yoursite-vps

# Check Nginx status
sudo systemctl status nginx

# Reload Nginx
sudo systemctl reload nginx

# View Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Check disk space
df -h

# Monitor deployments
tail -f /var/log/auth.log | grep deploy
```

### GitHub Actions

```bash
# Manually trigger workflow
# Go to: Repository → Actions → Deploy to VPS → Run workflow

# View workflow logs
# Repository → Actions → [Select workflow run]
```

---

## Cost Estimation

**Monthly Costs:**

| Item | Cost |
|------|------|
| VPS (1GB RAM) | $5-6 |
| Domain name | $1-2 |
| SSL Certificate | Free (Let's Encrypt) |
| GitHub Actions | Free (2000 minutes/month) |
| **Total** | **$6-8/month** |

**Compared to managed hosting:**
- Netlify: Free tier limited, $19/month for pro
- Vercel: Free tier limited, $20/month for pro

---

## Next Steps

1. ✅ **Set up monitoring**: Install Uptime Robot or similar
2. ✅ **Add CDN**: Cloudflare (free tier) for caching
3. ✅ **Configure backups**: Automated VPS snapshots
4. ✅ **Set up analytics**: Plausible, Umami, or Google Analytics
5. ✅ **Performance testing**: Lighthouse, WebPageTest
6. ✅ **Create staging environment**: Separate branch/domain

---

## Resources

### Documentation
- **Astro Deployment:** `docs/astro-deployment.md`
- **Astro Reference:** `docs/ASTRO_REFERENCE.md`
- **GitHub Actions SSH:** [appleboy/ssh-action](https://github.com/appleboy/ssh-action)

### Security
- [SSH Key Best Practices 2025](https://www.brandonchecketts.com/archives/ssh-ed25519-key-best-practices-for-2025)
- [GitHub Actions Security](https://docs.github.com/en/actions/security-guides)
- [OWASP Security Headers](https://owasp.org/www-project-secure-headers/)

### Tools
- [Let's Encrypt](https://letsencrypt.org/) - Free SSL
- [Cloudflare](https://www.cloudflare.com/) - CDN and DDoS protection
- [Uptime Robot](https://uptimerobot.com/) - Free uptime monitoring

---

**Last Updated:** January 2025
**Tested with:** Astro 5.x, Ubuntu 24.04 LTS, GitHub Actions, ED25519 SSH keys
