# VPS Setup Instructions for Vecia Website Deployment

**Purpose**: Complete Phase 12 deployment by configuring the VPS to support Astro SSR with Node.js backend.

**Context**: The GitHub Actions CI/CD pipeline builds and transfers files successfully, but the Node.js server setup fails because the VPS is missing critical configuration. This document contains all VPS-side tasks needed to complete Phase 12.

---

## Prerequisites Check

Run these commands to verify your environment:

```bash
# Check Node.js version (need v20+)
node --version

# Check if PM2 is installed
pm2 --version

# Check Nginx version
nginx -v

# Verify deployment directory exists
ls -la /var/www/vecia/dist/
```

**Required versions:**
- Node.js: v20.x or higher
- PM2: Any recent version (will be installed if missing)
- Nginx: 1.18+ (standard on Ubuntu 20.04+)

---

## Task 1: Install Missing Dependencies

### 1.1 Install PM2 Globally (if not present)

```bash
sudo npm install -g pm2

# Verify installation
pm2 --version
```

### 1.2 Verify Node.js Version

If Node.js is not v20+, upgrade it:

```bash
# Using nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
nvm alias default 20

# OR using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

---

## Task 2: Create Nginx Configuration

### 2.1 Create Nginx Config File

Create the file `/etc/nginx/sites-available/vecia.com`:

```bash
sudo nano /etc/nginx/sites-available/vecia.com
```

Paste this configuration:

```nginx
# Vecia Website - Production Configuration
# Supports: Static site + Node.js SSR API routes

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name vecia.com www.vecia.com;

    # SSL Configuration (update paths if different)
    ssl_certificate /etc/letsencrypt/live/vecia.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/vecia.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Root directory for static files
    root /var/www/vecia/dist/client;
    index index.html;

    # OWASP Security Headers (Phase 11 compliance)
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://unpkg.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.supabase.co;" always;

    # Logging
    access_log /var/log/nginx/vecia.com.access.log;
    error_log /var/log/nginx/vecia.com.error.log warn;

    # Cache static assets (1 year)
    location /_astro/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }

    # Proxy API routes to Node.js server (port 4321)
    location /api/ {
        proxy_pass http://127.0.0.1:4321;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # No caching for API routes
        add_header Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0";

        # Timeouts for API requests
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Static files with fallback for Astro routing
    location / {
        try_files $uri $uri/ $uri.html /index.html;
        expires 1h;
        add_header Cache-Control "public, must-revalidate";
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json image/svg+xml;
    gzip_disable "msie6";

    # Favicon and robots.txt
    location = /favicon.ico {
        log_not_found off;
        access_log off;
    }

    location = /robots.txt {
        log_not_found off;
        access_log off;
    }
}

# HTTP to HTTPS redirect
server {
    listen 80;
    listen [::]:80;
    server_name vecia.com www.vecia.com;

    # Allow Let's Encrypt validation
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    # Redirect all other HTTP traffic to HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}
```

### 2.2 Enable the Site

```bash
# Create symbolic link to enable site
sudo ln -sf /etc/nginx/sites-available/vecia.com /etc/nginx/sites-enabled/vecia.com

# Remove default site if it conflicts
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t
```

**Expected output:**
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### 2.3 Reload Nginx

```bash
sudo systemctl reload nginx

# Verify Nginx is running
sudo systemctl status nginx
```

---

## Task 3: Create Supabase Database Table

### 3.1 Access Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Select your Vecia project
3. Navigate to **SQL Editor**

### 3.2 Create Comments Table

Paste and execute this SQL:

```sql
-- Comments table for blog article discussions
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_slug TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_email TEXT,
  comment_text TEXT NOT NULL,
  parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  is_vecia_member BOOLEAN DEFAULT FALSE,
  approved BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_comments_article_slug ON comments(article_slug);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON comments(parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_comments_approved ON comments(approved);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read approved comments
CREATE POLICY "Public can read approved comments"
  ON comments FOR SELECT
  USING (approved = true);

-- Policy: Anyone can insert comments (validation happens in API)
CREATE POLICY "Public can insert comments"
  ON comments FOR INSERT
  WITH CHECK (true);

-- Policy: Only service role can update/delete (for moderation)
CREATE POLICY "Service role can update comments"
  ON comments FOR UPDATE
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can delete comments"
  ON comments FOR DELETE
  USING (auth.role() = 'service_role');

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE
  ON comments FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();
```

### 3.3 Verify Table Creation

Run this query to verify:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'comments'
ORDER BY ordinal_position;
```

You should see all columns listed.

---

## Task 4: Verify GitHub Secrets

### 4.1 Check Required Secrets

Go to your GitHub repository: **Settings → Secrets and variables → Actions**

Verify these secrets exist:

**VPS Connection:**
- `VPS_HOST` - Your VPS IP address or domain
- `VPS_USERNAME` - SSH username (e.g., `ubuntu`, `root`, `vecia`)
- `VPS_SSH_KEY` - Private SSH key for authentication
- `VPS_PORT` - SSH port (usually `22`)
- `VPS_TARGET_DIR` - Deployment directory (e.g., `/var/www/vecia/dist`)

**Supabase Credentials:**
- `PUBLIC_SUPABASE_URL` - Your Supabase project URL (e.g., `https://xxx.supabase.co`)
- `PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous public key

### 4.2 Get Supabase Credentials

If you need to find/update Supabase credentials:

1. Go to https://supabase.com/dashboard
2. Select your Vecia project
3. Go to **Settings → API**
4. Copy:
   - **Project URL** → `PUBLIC_SUPABASE_URL`
   - **anon public** key → `PUBLIC_SUPABASE_ANON_KEY`

---

## Task 5: Prepare Deployment Directory

### 5.1 Set Correct Permissions

```bash
# Set ownership
sudo chown -R $USER:www-data /var/www/vecia/

# Set directory permissions (755)
sudo find /var/www/vecia/ -type d -exec chmod 755 {} \;

# Set file permissions (644)
sudo find /var/www/vecia/ -type f -exec chmod 644 {} \;
```

### 5.2 Create Directory Structure

```bash
# Ensure deployment directory exists
sudo mkdir -p /var/www/vecia/dist/client
sudo mkdir -p /var/www/vecia/dist/server

# Create logs directory
sudo mkdir -p /var/log/vecia

# Set ownership
sudo chown -R $USER:www-data /var/www/vecia/
sudo chown -R $USER:www-data /var/log/vecia/
```

---

## Task 6: Test Current Deployment (Optional)

If you want to test before the next GitHub Actions deploy:

### 6.1 Manually Start Node.js Server

```bash
cd /var/www/vecia/dist

# Check if server entry point exists
ls -la server/entry.mjs

# Start with PM2 (temporary test)
pm2 start server/entry.mjs --name vecia-website-test \
  --env HOST=127.0.0.1 \
  --env PORT=4321 \
  --env NODE_ENV=production \
  --env PUBLIC_SUPABASE_URL="<your-supabase-url>" \
  --env PUBLIC_SUPABASE_ANON_KEY="<your-supabase-anon-key>"

# Check status
pm2 status

# View logs
pm2 logs vecia-website-test

# Test server locally
curl http://127.0.0.1:4321/api/health

# Stop test server
pm2 delete vecia-website-test
```

### 6.2 Test Nginx Proxy

```bash
# Test API route through Nginx
curl -v https://vecia.com/api/health

# Should return:
# {"status":"ok","timestamp":"2025-01-15T...","version":"..."}
```

---

## Task 7: Setup PM2 Startup Script

### 7.1 Configure PM2 to Start on Boot

```bash
# Generate startup script
pm2 startup systemd

# It will output a command like:
# sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u YOUR_USERNAME --hp /home/YOUR_USERNAME

# Copy and run that command

# Save current PM2 process list
pm2 save
```

This ensures PM2 automatically restarts the Node.js server if the VPS reboots.

---

## Task 8: Post-Setup Verification Checklist

After completing all tasks, verify everything is ready:

```bash
# 1. Check Node.js version
node --version  # Should be v20+

# 2. Check PM2 installation
pm2 --version

# 3. Check Nginx configuration
sudo nginx -t

# 4. Check Nginx is running
sudo systemctl status nginx

# 5. Check deployment directory
ls -la /var/www/vecia/dist/

# 6. Check directory permissions
ls -ld /var/www/vecia/dist/
# Should show: drwxr-xr-x ... YOUR_USERNAME www-data ...

# 7. Test Nginx (should return 200 or redirect)
curl -I https://vecia.com/

# 8. Check SSL certificate
curl -vI https://vecia.com/ 2>&1 | grep "SSL certificate verify"
# Should show: SSL certificate verify ok

# 9. Check if port 4321 is available
sudo lsof -i :4321
# Should show nothing (or only PM2 process after deployment)

# 10. Check logs directory
ls -la /var/log/nginx/vecia.com*.log
```

**All checks should pass before triggering the next GitHub Actions deployment.**

---

## Task 9: Trigger Deployment

Once all VPS setup is complete:

1. **From your local machine**, make a small change and push:
   ```bash
   cd /Users/alex/Desktop/ClaudeMCP/Vecia/Website/vecia-website-v5
   git add .
   git commit -m "chore: trigger deployment after VPS setup"
   git push origin main
   ```

2. **Monitor GitHub Actions**:
   - Go to: https://github.com/YOUR_USERNAME/vecia-website-v5/actions
   - Watch the "Deploy Astro to Vecia VPS" workflow
   - All steps should now succeed

3. **Verify deployment on VPS**:
   ```bash
   # Check PM2 status
   pm2 status

   # Should show:
   # │ name            │ status │ cpu │ memory │
   # │ vecia-website   │ online │ ... │ ...    │

   # Check PM2 logs
   pm2 logs vecia-website --lines 20

   # Test API locally
   curl http://127.0.0.1:4321/api/health

   # Test through Nginx
   curl https://vecia.com/api/health
   ```

4. **Test in browser**:
   - Visit https://vecia.com/
   - Go to blog page: https://vecia.com/blog/automatisation-processus-metier
   - Try submitting a comment
   - Verify comment appears in the list

---

## Troubleshooting

### Issue: Nginx test fails

```bash
# Check syntax errors
sudo nginx -t

# Common fixes:
# 1. SSL certificate paths incorrect - update lines 10-11 in config
# 2. Directory doesn't exist - create with: sudo mkdir -p /var/www/vecia/dist/client
```

### Issue: PM2 fails to start Node.js server

```bash
# Check if entry.mjs exists
ls -la /var/www/vecia/dist/server/entry.mjs

# Check PM2 logs
pm2 logs vecia-website --lines 50

# Common fixes:
# 1. Wrong directory - verify VPS_TARGET_DIR secret
# 2. Missing environment variables - check GitHub secrets
# 3. Port 4321 already in use - run: sudo lsof -i :4321
```

### Issue: API routes return 502 Bad Gateway

```bash
# Check if Node.js server is running
pm2 status

# Check if port 4321 is listening
sudo lsof -i :4321

# Test server directly (bypass Nginx)
curl http://127.0.0.1:4321/api/health

# If server works but Nginx fails:
# 1. Check Nginx error logs: sudo tail -f /var/log/nginx/vecia.com.error.log
# 2. Verify proxy_pass in Nginx config points to 127.0.0.1:4321
```

### Issue: Comments don't appear

```bash
# Check Supabase table exists
# Go to Supabase Dashboard → Table Editor → verify "comments" table

# Check API response
curl https://vecia.com/api/comments/automatisation-processus-metier.json

# Should return:
# {"comments":[],"count":0}  <- Empty is OK
# NOT: {"comments":[],"error":"..."}  <- This means database error
```

---

## Security Notes

1. **SSL Certificates**: This config assumes Let's Encrypt certificates at `/etc/letsencrypt/live/vecia.com/`. If your paths differ, update lines 10-11 in the Nginx config.

2. **Firewall**: Ensure UFW/iptables allows:
   ```bash
   sudo ufw allow 80/tcp    # HTTP
   sudo ufw allow 443/tcp   # HTTPS
   sudo ufw allow 22/tcp    # SSH
   # Port 4321 should NOT be exposed (only localhost)
   ```

3. **Environment Variables**: The PM2 ecosystem config will be created by GitHub Actions with actual secret values. Never commit secrets to Git.

4. **Supabase RLS**: The SQL script enables Row Level Security. Only approved comments are publicly visible.

---

## Next Steps After Deployment

Once deployment succeeds:

1. **Monitor Performance**:
   ```bash
   pm2 monit  # Real-time monitoring
   ```

2. **Check Lighthouse Scores**:
   - Run Lighthouse audit on https://vecia.com/
   - Target: 90+ in all categories

3. **Test Comment System**:
   - Submit test comments on blog articles
   - Verify profanity filter works
   - Test reply threading

4. **Phase 12 Complete** ✅:
   - Update `docs/PHASE-12-IMPLEMENTATION.md` with completion status
   - Mark Phase 12 as COMPLETE in `docs/IMPLEMENTATION-PLAN.md`

---

## Summary

**What this setup accomplishes:**

✅ Nginx configured to serve static files + proxy API routes
✅ PM2 ready to manage Node.js server process
✅ Supabase database table created for comments
✅ Security headers deployed (OWASP compliance)
✅ SSL/TLS configured with modern protocols
✅ Caching strategy implemented (static assets: 1yr, API: no-cache)
✅ Health check endpoint available at `/api/health`
✅ Automatic startup on VPS reboot

**Files modified on VPS:**
- `/etc/nginx/sites-available/vecia.com` (new)
- `/etc/nginx/sites-enabled/vecia.com` (symlink)
- Supabase database (new `comments` table)

**No code changes needed** - GitHub Actions workflow will be updated separately to use the new infrastructure.

---

**Last Updated**: 2025-01-15
**Phase**: 12 - CI/CD and VPS Deployment
**Status**: Ready for execution
