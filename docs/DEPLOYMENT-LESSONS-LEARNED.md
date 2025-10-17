# Deployment Lessons Learned - Hash Mismatch Issue (Oct 17, 2025)

## The Problem

After deploying Astro SSR application via Docker, the website showed 404 errors for CSS and JavaScript assets:

```
GET https://www.vecia.fr/_astro/BaseLayout.astro_astro_type_script_index_0_lang.BHzansSF.js
  → 404 (Not Found)
GET https://www.vecia.fr/_astro/about._o1zf2wA.css
  → 404 (Not Found)
```

**Symptoms**:
- Production HTML referenced new asset hashes (e.g., `_o1zf2wA.css`)
- Nginx returned 404 for these assets
- Assets existed inside the Docker container but not on the host filesystem

## Root Cause

**Nginx was serving static assets from the host filesystem** instead of proxying them to the Docker container.

### The Architecture Mismatch

```
┌─────────────────────────────────────────────────────────────────┐
│ WRONG: What Was Happening                                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Browser Request: /_astro/about._o1zf2wA.css                   │
│         ↓                                                        │
│  Nginx (Port 443/80)                                            │
│         ↓                                                        │
│  Checks: /var/www/vecia-website/client/_astro/about._o1zf2wA.css│
│         ↓                                                        │
│  Result: 404 (File doesn't exist - built Oct 15)               │
│                                                                  │
│  ❌ Docker container has the file (built Oct 17) but nginx      │
│     never asks the container!                                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ CORRECT: What Should Happen (Astro SSR)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Browser Request: /_astro/about._o1zf2wA.css                   │
│         ↓                                                        │
│  Nginx (Port 443/80) - Reverse Proxy ONLY                      │
│         ↓                                                        │
│  Proxy to: http://localhost:4322/_astro/about._o1zf2wA.css    │
│         ↓                                                        │
│  Astro Node.js Server (Inside Docker Container)                │
│         ↓                                                        │
│  Serves from: /app/dist/client/_astro/about._o1zf2wA.css      │
│         ↓                                                        │
│  Result: 200 OK (Correct file from latest build)               │
│                                                                  │
│  ✅ Container always has the freshly built files                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### The Problematic Nginx Configuration

**Lines 456-457 in `/etc/nginx/sites-available/vecia-unified`:**

```nginx
# ❌ WRONG for Astro SSR with Docker
location ~ ^/_astro/|^/images/|^/favicon\.|^/robots\.txt$|^/sitemap.*\.xml$ {
    root /var/www/vecia-website/client;  # ← OLD files from Oct 15!
    try_files $uri =404;
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

**Why This Failed**:
1. Nginx tried to serve `/_astro/*` files from `/var/www/vecia-website/client/`
2. This directory contained OLD files from Oct 15 build
3. The Docker container had NEW files from Oct 17 build
4. Asset hashes changed between builds (Vite non-deterministic hashing)
5. HTML referenced new hashes, nginx looked for old files → 404

## The Solution

**Remove static asset serving from nginx** - let the Astro SSR container handle everything.

### Correct Nginx Configuration for Astro SSR + Docker

```nginx
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;

    server_name vecia.com www.vecia.com vecia.fr www.vecia.fr;

    # SSL configuration
    ssl_certificate /etc/letsencrypt/live/vecia.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/vecia.com/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Proxy ALL requests to Astro Node.js container
    location / {
        proxy_pass http://localhost:4322;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Key Points**:
- ✅ No `location /_astro/` block - everything goes to the container
- ✅ Astro's Node.js server handles both SSR pages AND static assets
- ✅ Container always has the correct files from the latest build
- ✅ No host filesystem dependency

## Why This Happens with Astro SSR

### Astro Static vs SSR Deployment

| Aspect | Static (`output: 'static'`) | SSR (`output: 'server'`) |
|--------|----------------------------|--------------------------|
| **Build Output** | Pure HTML/CSS/JS files | Node.js server + assets |
| **Nginx Role** | Serves files directly from disk | Reverse proxy ONLY |
| **Asset Location** | Host filesystem (`/var/www/`) | Inside container (`/app/dist/`) |
| **Deployment** | Copy `dist/` to `/var/www/` | Load Docker image |

### Our Configuration: SSR with Docker

```javascript
// astro.config.mjs
export default defineConfig({
  output: 'server',  // ← SSR mode
  adapter: node({
    mode: 'standalone'  // ← Standalone Node.js server
  })
});
```

With this configuration:
- Astro builds a Node.js server that serves BOTH pages AND assets
- Static assets are bundled inside the Docker image at `/app/dist/client/_astro/`
- The server runs on port 4322 inside the container
- Nginx should ONLY act as a reverse proxy

## The Fix (Step-by-Step)

### 1. Backup Current Configuration

```bash
sudo cp /etc/nginx/sites-available/vecia-unified \
       /etc/nginx/sites-available/vecia-unified.backup.$(date +%Y%m%d_%H%M%S)
```

**Result**: Created `/etc/nginx/sites-available/vecia-unified.backup.20251017_163206`

### 2. Remove Static Asset Serving Block

```bash
sudo nano /etc/nginx/sites-available/vecia-unified
```

**Removed these lines**:

```nginx
location ~ ^/_astro/|^/images/|^/favicon\.|^/robots\.txt$|^/sitemap.*\.xml$ {
    root /var/www/vecia-website/client;
    try_files $uri =404;
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. Test and Reload Nginx

```bash
# Test configuration syntax
sudo nginx -t
# Output: nginx: configuration file /etc/nginx/nginx.conf test is successful

# Reload nginx (no downtime)
sudo systemctl reload nginx

# Clear nginx cache
sudo rm -rf /var/cache/nginx/* 2>/dev/null || true
```

### 4. Verification

```bash
# Check asset serving
curl -I https://www.vecia.fr/_astro/BaseLayout.astro_astro_type_script_index_0_lang.BHzansSF.js
# Result: HTTP/2 200 ✅

curl -I https://www.vecia.fr/_astro/about._o1zf2wA.css
# Result: HTTP/2 200 ✅

# Check homepage
curl -s https://www.vecia.fr/ | grep -o 'href="[^"]*\.css"'
# Result: Found 3 CSS references, all load correctly ✅
```

## Lessons Learned

### 1. Astro SSR Architecture Understanding

**Key Principle**: With Astro SSR (`output: 'server'`), the Node.js server serves EVERYTHING:
- Dynamic pages (SSR rendered)
- Static assets (`/_astro/*`, images, etc.)
- API routes

**Nginx's ONLY role**:
- SSL termination
- Reverse proxy to the Node.js server
- (Optional) Rate limiting, DDoS protection

### 2. Docker + SSR = Container Serves Assets

With Docker-based SSR deployment:

```
❌ WRONG:
  Nginx → /var/www/static-files/   (Host filesystem)

✅ CORRECT:
  Nginx → http://localhost:4322 → Docker Container → /app/dist/client/_astro/
```

**Why**: The container has the freshly built files. Host filesystem has old files or no files.

### 3. Vite Non-Deterministic Hashing

Vite generates content-based hashes, but they can change between builds even with identical source code:

```
Build 1 (Oct 15): about.BSELGt1H.css
Build 2 (Oct 17): about._o1zf2wA.css
```

**This is why**:
- You can't rely on host filesystem having the "right" assets
- The container ALWAYS has the correct assets from that specific build
- Nginx must proxy to the container, not serve from disk

### 4. Debugging Process

When assets return 404:

1. **Check where nginx thinks files are**: `grep -r "root\|alias" /etc/nginx/sites-available/`
2. **Check where files actually are**: `docker exec <container> ls /app/dist/client/_astro/`
3. **Verify nginx proxies correctly**: `curl -I https://domain.com/_astro/file.js`
4. **Check container logs**: `docker logs vecia-website --tail=50`

### 5. Cache Busting Strategy

With the correct setup:

```
HTML (SSR):   Cache-Control: no-cache (always revalidate)
Assets:       Cache-Control: public, max-age=31536000, immutable
```

**Flow**:
1. User visits site → Gets fresh HTML (no-cache)
2. HTML references `about._o1zf2wA.css` (current hash)
3. Browser requests CSS → Gets it from Astro server (or cache if hash matches)
4. New deployment → New HTML with new hash → Browser fetches new asset

**No manual intervention needed** - the architecture handles it automatically.

## Future Deployments

### What NOT to Do

❌ Add nginx location blocks for `/_astro/`, `/images/`, etc.
❌ Try to sync `dist/` from container to host filesystem
❌ Serve static assets from nginx directly

### What TO Do

✅ Let nginx act as a pure reverse proxy
✅ Trust the container to serve everything
✅ Use `vite:preloadError` handler for graceful client-side recovery (already implemented)
✅ Verify deployments by checking asset URLs return 200

### Deployment Checklist

After each deployment:

```bash
# 1. Check container is running new image
docker ps
docker inspect vecia-website | grep -i created

# 2. Verify assets are accessible
curl -I https://vecia.com/_astro/[some-hash].js

# 3. Check homepage loads correctly
curl -s https://vecia.com/ | grep -o 'src="/_astro/[^"]*"'

# 4. Monitor container logs
docker logs vecia-website --tail=20 --follow
```

## Performance Notes

### Duplicate Cache-Control Headers (Non-Critical)

Currently, assets receive TWO `Cache-Control` headers:

```
cache-control: public, max-age=31536000, immutable  ← From Astro server
cache-control: no-store, no-cache, must-revalidate  ← From nginx location block
```

**Impact**: Harmless - browsers use the more restrictive one
**Fix** (optional): Remove nginx's cache-control for proxied requests

```nginx
location / {
    proxy_pass http://localhost:4322;
    # Remove or comment out:
    # add_header Cache-Control "...";
}
```

## Related Documentation

- **VPS Deployment Guide**: `docs/vps-deployment-github-actions.md`
- **Astro SSR Reference**: `docs/ASTRO_REFERENCE.md`
- **Deployment Workflow**: `.github/workflows/deploy.yml`
- **Deployment Handler**: `src/scripts/deployment-handler.ts` (handles stale assets gracefully)

## Summary

**Problem**: Nginx serving old assets from host filesystem while Docker container has new assets
**Root Cause**: Nginx configuration had `location /_astro/` block serving from disk
**Solution**: Remove static serving, let Astro SSR container serve everything via reverse proxy
**Result**: Assets now serve correctly with HTTP 200, hash mismatches resolved

**Key Takeaway**: With Astro SSR + Docker, nginx should be a PURE reverse proxy. The container serves everything.

---

**Date**: October 17, 2025
**Fixed By**: Removed static asset serving from nginx configuration
**Verification**: All assets return HTTP 200, website loads correctly
