# NGINX Security Headers Configuration

**Last Updated**: 2025-01-15
**Target**: Vecia Website Production Deployment
**Compliance**: OWASP 2025 Best Practices

---

## Executive Summary

This document provides **production-ready NGINX security headers** configuration for the Vecia website. All recommendations follow OWASP 2025 guidelines and include:

✅ Content Security Policy (CSP) with nonce-based approach
✅ Cross-Origin Isolation (COEP/CORP/COOP) - **NEW 2025**
✅ HTTPS enforcement (HSTS) with preload
✅ Clickjacking protection (X-Frame-Options)
✅ MIME-sniffing prevention (X-Content-Type-Options)
✅ Referrer policy for privacy
✅ Permissions policy for modern browsers

---

## 🚀 Quick Start: Copy-Paste NGINX Config

Add this to your NGINX server block (`/etc/nginx/sites-available/vecia.com`):

```nginx
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name vecia.com www.vecia.com;

    # SSL Configuration (replace with your cert paths)
    ssl_certificate /etc/letsencrypt/live/vecia.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/vecia.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256';
    ssl_prefer_server_ciphers off;

    root /var/www/vecia.com/dist;
    index index.html;

    # ========================================
    # 🔒 SECURITY HEADERS (2025 OWASP)
    # ========================================

    # Content Security Policy (CSP) - Nonce-based for inline scripts
    # NOTE: Replace 'NONCE_PLACEHOLDER' with dynamic nonce generation
    add_header Content-Security-Policy "
        default-src 'self';
        script-src 'self' 'nonce-NONCE_PLACEHOLDER' https://www.googletagmanager.com https://www.google-analytics.com https://script.google.com;
        style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
        font-src 'self' https://fonts.gstatic.com;
        img-src 'self' data: https:;
        connect-src 'self' https://script.google.com https://www.google-analytics.com;
        frame-ancestors 'none';
        base-uri 'self';
        form-action 'self' https://script.google.com;
        upgrade-insecure-requests;
    " always;

    # Strict Transport Security (HSTS) - 2 years + preload
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;

    # X-Frame-Options - Prevent clickjacking
    add_header X-Frame-Options "DENY" always;

    # X-Content-Type-Options - Prevent MIME sniffing
    add_header X-Content-Type-Options "nosniff" always;

    # Referrer Policy - Balance privacy and analytics
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Permissions Policy - Restrict browser features
    add_header Permissions-Policy "
        geolocation=(),
        microphone=(),
        camera=(),
        payment=(),
        usb=(),
        magnetometer=(),
        gyroscope=(),
        accelerometer=()
    " always;

    # Cross-Origin-Embedder-Policy (COEP) - NEW 2025
    # Use 'credentialless' for compatibility with third-party resources
    add_header Cross-Origin-Embedder-Policy "credentialless" always;

    # Cross-Origin-Opener-Policy (COOP) - NEW 2025
    add_header Cross-Origin-Opener-Policy "same-origin" always;

    # Cross-Origin-Resource-Policy (CORP) - NEW 2025
    add_header Cross-Origin-Resource-Policy "same-site" always;

    # ========================================
    # END SECURITY HEADERS
    # ========================================

    # Astro static files
    location / {
        try_files $uri $uri/ =404;
    }

    # Cache static assets
    location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security: Disable access to hidden files
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name vecia.com www.vecia.com;
    return 301 https://$server_name$request_uri;
}
```

---

## 📚 Header Explanations

### 1. Content-Security-Policy (CSP)

**Purpose**: Prevent XSS attacks by controlling which resources can be loaded.

**2025 Update**: Nonce-based approach instead of `'unsafe-inline'` for better security.

**Configuration**:
```nginx
Content-Security-Policy "
    default-src 'self';
    script-src 'self' 'nonce-NONCE_PLACEHOLDER' https://www.googletagmanager.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com;
    img-src 'self' data: https:;
    connect-src 'self' https://script.google.com;
    frame-ancestors 'none';
    base-uri 'self';
    form-action 'self' https://script.google.com;
    upgrade-insecure-requests;
"
```

**Key Directives**:
- `default-src 'self'`: Only allow resources from same origin by default
- `script-src`: Allow scripts from self + nonce + Google services
- `style-src`: Allow styles from self + inline (needed for Tailwind) + Google Fonts
- `font-src`: Allow fonts from self + Google Fonts CDN
- `img-src`: Allow images from self + data URIs + any HTTPS source
- `connect-src`: Allow AJAX/fetch to self + Google Sheets webhook
- `frame-ancestors 'none'`: Prevent embedding in iframes (same as X-Frame-Options DENY)
- `base-uri 'self'`: Prevent <base> tag injection
- `form-action`: Allow form submissions to self + Google Sheets
- `upgrade-insecure-requests`: Auto-upgrade HTTP to HTTPS

**⚠️ IMPORTANT: Nonce Implementation**

CSP nonces require server-side generation. Since Vecia uses static hosting, there are two options:

**Option A: Remove Nonce (Simpler)**
Replace `'nonce-NONCE_PLACEHOLDER'` with `'unsafe-inline'` if using static hosting without dynamic nonce generation:

```nginx
script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;
```

**Option B: Implement Nonce (More Secure)**
1. Use a reverse proxy (e.g., Cloudflare Workers) to inject nonces
2. Update all inline `<script>` tags with `nonce="GENERATED_NONCE"` attribute
3. Use a CSP nonce generator in your deployment pipeline

**Recommendation**: Start with Option A (unsafe-inline), implement Option B in Phase 12 if needed.

---

### 2. Strict-Transport-Security (HSTS)

**Purpose**: Force browsers to always use HTTPS, preventing downgrade attacks.

**Configuration**:
```nginx
Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
```

**Parameters**:
- `max-age=63072000`: Cache for 2 years (OWASP recommended)
- `includeSubDomains`: Apply to all subdomains
- `preload`: Eligible for HSTS preload list (submit at https://hstspreload.org)

**⚠️ WARNING**: Once preloaded, HTTPS is REQUIRED for 2 years. Only enable after verifying:
- ✅ Valid SSL certificate installed
- ✅ All subdomains support HTTPS
- ✅ No HTTP-only resources

---

### 3. X-Frame-Options

**Purpose**: Prevent clickjacking attacks by blocking iframe embedding.

**Configuration**:
```nginx
X-Frame-Options "DENY" always;
```

**Options**:
- `DENY`: Never allow embedding (recommended for Vecia)
- `SAMEORIGIN`: Allow embedding on same domain only
- `ALLOW-FROM uri`: Allow specific domains (deprecated, use CSP instead)

---

### 4. X-Content-Type-Options

**Purpose**: Prevent browsers from MIME-sniffing responses.

**Configuration**:
```nginx
X-Content-Type-Options "nosniff" always;
```

**Why it matters**: Stops browsers from interpreting files as a different MIME type (e.g., treating a `.txt` file as executable JavaScript).

---

### 5. Referrer-Policy

**Purpose**: Control how much referrer information is sent with requests.

**Configuration**:
```nginx
Referrer-Policy "strict-origin-when-cross-origin" always;
```

**Options** (ordered by privacy):
1. `no-referrer`: Never send referrer (most private, breaks analytics)
2. `same-origin`: Only send to same origin
3. `strict-origin-when-cross-origin`: **Recommended** - Full URL to same origin, origin only to HTTPS cross-origin
4. `unsafe-url`: Always send full URL (not recommended)

---

### 6. Permissions-Policy

**Purpose**: Disable unnecessary browser features to reduce attack surface.

**Configuration**:
```nginx
Permissions-Policy "
    geolocation=(),
    microphone=(),
    camera=(),
    payment=(),
    usb=(),
    magnetometer=(),
    gyroscope=(),
    accelerometer=()
" always;
```

**Rationale**: Vecia website doesn't need device sensors, geolocation, or payments. Disable all unused features.

**Available Policies**: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Permissions-Policy

---

### 7. Cross-Origin Headers (NEW 2025)

#### Cross-Origin-Embedder-Policy (COEP)

**Purpose**: Isolate your origin from cross-origin resources.

**Configuration**:
```nginx
Cross-Origin-Embedder-Policy "credentialless" always;
```

**Options**:
- `require-corp`: Strict (requires CORP on all cross-origin resources)
- `credentialless`: **Recommended** - Relaxed mode for compatibility
- `unsafe-none`: Disabled (not recommended)

---

#### Cross-Origin-Opener-Policy (COOP)

**Purpose**: Prevent other windows from accessing your window object.

**Configuration**:
```nginx
Cross-Origin-Opener-Policy "same-origin" always;
```

**Options**:
- `same-origin`: Isolate completely (recommended)
- `same-origin-allow-popups`: Allow popups
- `unsafe-none`: Disabled (not recommended)

---

#### Cross-Origin-Resource-Policy (CORP)

**Purpose**: Control which sites can embed your resources.

**Configuration**:
```nginx
Cross-Origin-Resource-Policy "same-site" always;
```

**Options**:
- `same-site`: **Recommended** - Allow same-site embedding only
- `same-origin`: Strictest (same-origin only)
- `cross-origin`: Allow all origins (not recommended)

---

## 🔍 Testing Your Configuration

### 1. Security Headers Checker

Test your headers after deployment:

- **Mozilla Observatory**: https://observatory.mozilla.org
  - Target Score: **A+ or better**
  - Checks OWASP compliance

- **SecurityHeaders.com**: https://securityheaders.com
  - Target Score: **A or better**
  - Detailed header analysis

### 2. CSP Validator

- **CSP Evaluator**: https://csp-evaluator.withgoogle.com
  - Paste your CSP policy
  - Check for common mistakes

### 3. Manual Browser Test

1. Open DevTools → Network tab
2. Load https://vecia.com
3. Click on the HTML document
4. Check Response Headers for all security headers

### 4. Command Line Test

```bash
curl -I https://vecia.com | grep -E "Content-Security-Policy|Strict-Transport-Security|X-Frame-Options|X-Content-Type-Options"
```

Expected output should show all headers.

---

## 🚨 Common Issues & Solutions

### Issue 1: CSP Blocks Google Fonts

**Symptom**: Fonts don't load, console shows CSP errors.

**Solution**: Verify these CSP directives:
```nginx
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com;
```

---

### Issue 2: CSP Blocks Google Analytics

**Symptom**: GA4 doesn't track events, console shows CSP errors.

**Solution**: Add GA domains to CSP:
```nginx
script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com;
connect-src 'self' https://www.google-analytics.com;
```

---

### Issue 3: Form Submission to Google Sheets Blocked

**Symptom**: LeadCaptureForm fails with CSP error.

**Solution**: Add Google Apps Script to CSP:
```nginx
form-action 'self' https://script.google.com;
connect-src 'self' https://script.google.com;
```

---

### Issue 4: HSTS Prevents Local Testing

**Symptom**: Can't access localhost or test domains over HTTP.

**Solution**: Clear HSTS cache in browser:
- Chrome: `chrome://net-internals/#hsts` → Delete domain
- Firefox: Clear browsing data → Check "Active Logins"

---

### Issue 5: Mixed Content Warnings

**Symptom**: Console shows "Mixed Content" errors even with HTTPS.

**Solution**: CSP's `upgrade-insecure-requests` directive automatically upgrades HTTP to HTTPS. If issues persist:
1. Check for hardcoded `http://` URLs in code
2. Update to relative URLs (e.g., `//example.com/file.js`)

---

## 📝 Deployment Checklist

Before enabling these headers in production:

- [ ] Valid SSL certificate installed (Let's Encrypt or commercial)
- [ ] HTTPS working for all pages
- [ ] All external resources (fonts, scripts) loaded over HTTPS
- [ ] Google Sheets webhook tested with CSP
- [ ] Newsletter popup tested with CSP
- [ ] GA4 tracking verified after CSP
- [ ] Browser testing: Chrome, Firefox, Safari, Edge
- [ ] Mobile testing: iOS Safari, Android Chrome
- [ ] Security headers validated with Mozilla Observatory
- [ ] CSP validated with Google CSP Evaluator
- [ ] HSTS preload considered (optional but recommended)

---

## 🔧 VPS-Specific Notes

### For Nginx on Ubuntu/Debian:

1. **Edit site configuration**:
   ```bash
   sudo nano /etc/nginx/sites-available/vecia.com
   ```

2. **Test configuration**:
   ```bash
   sudo nginx -t
   ```

3. **Reload Nginx**:
   ```bash
   sudo systemctl reload nginx
   ```

4. **Check status**:
   ```bash
   sudo systemctl status nginx
   ```

### For Nginx with Certbot (Let's Encrypt):

Certbot auto-generates SSL config. Add security headers AFTER the certbot-managed SSL lines:

```nginx
server {
    listen 443 ssl http2;
    server_name vecia.com www.vecia.com;

    # Managed by Certbot
    ssl_certificate /etc/letsencrypt/live/vecia.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/vecia.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # ADD YOUR SECURITY HEADERS HERE
    add_header Content-Security-Policy "..." always;
    add_header Strict-Transport-Security "..." always;
    # ... etc
}
```

---

## 📚 Resources

### Official Documentation
- **OWASP Secure Headers Project**: https://owasp.org/www-project-secure-headers/
- **MDN Security Headers**: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers#security
- **Nginx Headers Module**: https://nginx.org/en/docs/http/ngx_http_headers_module.html

### Testing Tools
- **Mozilla Observatory**: https://observatory.mozilla.org
- **SecurityHeaders.com**: https://securityheaders.com
- **CSP Evaluator**: https://csp-evaluator.withgoogle.com
- **HSTS Preload**: https://hstspreload.org

### 2025 Updates
- **COEP/CORP/COOP Guide**: https://web.dev/articles/coop-coep
- **CSP Nonce Best Practices**: https://web.dev/articles/strict-csp

---

## 🔄 Maintenance

### Quarterly Review (Every 3 Months)
- [ ] Check OWASP updates for new header recommendations
- [ ] Verify all headers still supported in major browsers
- [ ] Review CSP violations in browser console
- [ ] Update Mozilla Observatory score

### After Major Changes
- [ ] New external script added → Update CSP `script-src`
- [ ] New CDN added → Update CSP relevant directive
- [ ] New API endpoint → Update CSP `connect-src`
- [ ] New font provider → Update CSP `font-src`

---

**Document Version**: 1.0
**Author**: Claude Code
**Phase**: 11/12 (Quality & Auditing)
**Next Review**: 2025-04-15
