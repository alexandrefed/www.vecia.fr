# Astro Deployment Guide

Complete guide for deploying Astro sites to various hosting platforms.

## Table of Contents

- [Deployment Overview](#deployment-overview)
- [Static Site Deployment](#static-site-deployment)
- [SSR Deployment](#ssr-deployment)
- [Platform-Specific Guides](#platform-specific-guides)
- [Environment Variables](#environment-variables)
- [CI/CD Setup](#cicd-setup)
- [Performance Optimization](#performance-optimization)

---

## Deployment Overview

### Build Output Modes

Astro supports three output modes:

```javascript
// astro.config.mjs
export default defineConfig({
  output: 'static',  // Default: Pre-render all pages
  // output: 'server',  // SSR: Render all pages on-demand
  // output: 'hybrid',  // Mix: Pre-render by default, opt-in to SSR
});
```

### Build Commands

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Default Output

- **Output directory:** `dist/`
- **Static files:** `dist/` contains all HTML, CSS, JS, assets
- **SSR output:** `dist/server/` contains server entry point

---

## Static Site Deployment

### Prerequisites

1. Site configured with production URL:

```javascript
export default defineConfig({
  site: 'https://example.com',
});
```

2. Build the site:

```bash
npm run build
```

3. Upload `dist/` folder to hosting provider

### Quick Deploy Platforms

**Zero-config deployment** - just connect your Git repo:

- Netlify
- Vercel
- Cloudflare Pages
- GitHub Pages
- GitLab Pages
- Azure Static Web Apps

---

## SSR Deployment

### Requirements

1. Install an adapter:

```bash
npx astro add netlify
npx astro add vercel
npx astro add node
npx astro add cloudflare
```

2. Configure output mode:

```javascript
import netlify from '@astrojs/netlify';

export default defineConfig({
  output: 'server',  // or 'hybrid'
  adapter: netlify(),
});
```

3. Deploy to compatible platform

---

## Platform-Specific Guides

### Netlify

#### Static Deployment

**Auto-deploy via Git:**

1. Push code to GitHub/GitLab/Bitbucket
2. Connect repo to Netlify
3. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Deploy

**Manual deploy:**

```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod
```

#### SSR Deployment

```bash
npx astro add netlify
```

```javascript
import netlify from '@astrojs/netlify';

export default defineConfig({
  output: 'server',
  adapter: netlify({
    edgeMiddleware: true,
    functionPerRoute: false,
  }),
});
```

**Edge Functions:**
```javascript
// Enable edge middleware
adapter: netlify({
  edgeMiddleware: true,
})
```

**Environment Variables:**
- Set in Netlify dashboard: Site Settings > Environment Variables
- Access with `import.meta.env.VARIABLE_NAME`

---

### Vercel

#### Static Deployment

**Auto-deploy via Git:**

1. Push to GitHub/GitLab/Bitbucket
2. Import project to Vercel
3. Auto-detected settings:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Deploy

#### SSR Deployment

```bash
npx astro add vercel
```

```javascript
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  output: 'server',
  adapter: vercel({
    edgeMiddleware: true,
    functionPerRoute: true,
    imageService: true,
  }),
});
```

**Edge Functions:**
```javascript
import vercel from '@astrojs/vercel/edge';

export default defineConfig({
  adapter: vercel(),
});
```

**Image Optimization:**
```javascript
adapter: vercel({
  imageService: true,
  imagesConfig: {
    sizes: [320, 640, 1280],
    domains: ['example.com'],
  },
}),
```

---

### Cloudflare Pages

#### Static Deployment

**Via Git:**

1. Push to GitHub/GitLab
2. Connect repo in Cloudflare Pages
3. Build settings:
   - **Build command:** `npm run build`
   - **Build output:** `dist`

**Via Wrangler CLI:**

```bash
npm install -g wrangler
npm run build
wrangler pages deploy dist
```

#### SSR Deployment

```bash
npx astro add cloudflare
```

```javascript
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    mode: 'directory',
  }),
});
```

**Access Cloudflare Runtime:**
```astro
---
const { env } = Astro.locals.runtime;
const value = await env.MY_KV.get('key');
---
```

---

### GitHub Pages

#### Configuration

```javascript
export default defineConfig({
  site: 'https://username.github.io',
  base: '/repo-name',  // If using project page
});
```

#### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

**Enable GitHub Pages:**
Settings > Pages > Source: GitHub Actions

---

### AWS

#### S3 + CloudFront

**Build and upload:**

```bash
npm run build
aws s3 sync dist/ s3://my-bucket --delete
```

**CloudFront cache invalidation:**

```bash
aws cloudfront create-invalidation \
  --distribution-id DISTRIBUTION_ID \
  --paths "/*"
```

#### Amplify

**Automatically deploy via Git:**

1. Connect repo to AWS Amplify
2. Build settings:
   - **Build command:** `npm run build`
   - **Output directory:** `dist`

**amplify.yml:**

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

---

### Azure Static Web Apps

#### Configuration

```yaml
# .github/workflows/azure-static-web-apps.yml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches: [main]

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Build And Deploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: 'upload'
          app_location: '/'
          api_location: ''
          output_location: 'dist'
```

---

### Deno Deploy

#### SSR Deployment

```bash
npx astro add deno
```

```javascript
import deno from '@astrojs/deno';

export default defineConfig({
  output: 'server',
  adapter: deno(),
});
```

**Deploy via GitHub Actions:**

```yaml
name: Deploy to Deno Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: read

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - run: npm ci
      - run: npm run build

      - name: Deploy to Deno Deploy
        uses: denoland/deployctl@v1
        with:
          project: my-project
          entrypoint: dist/server/entry.mjs
```

---

### Railway

#### Automatic Deployment

1. Connect GitHub repo to Railway
2. Railway auto-detects Astro
3. Builds and deploys automatically

#### Manual Configuration

**railway.toml:**

```toml
[build]
builder = "NIXPACKS"
buildCommand = "npm run build"

[deploy]
startCommand = "npm run preview"
```

**For SSR:**

```bash
npx astro add node
```

```json
// package.json
{
  "scripts": {
    "start": "node ./dist/server/entry.mjs"
  }
}
```

---

### Render

#### Static Site

1. Create new Static Site
2. Build settings:
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`

#### SSR with Node

```bash
npx astro add node
```

**Render configuration:**
- **Build Command:** `npm run build`
- **Start Command:** `node ./dist/server/entry.mjs`

---

### Fly.io

#### Dockerfile

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY package.json ./

EXPOSE 3000
CMD ["node", "./dist/server/entry.mjs"]
```

#### Deploy

```bash
fly launch
fly deploy
```

---

## Environment Variables

### Setting Up

**Development (.env):**

```env
# Server-only variables
SECRET_API_KEY=secret123
DATABASE_URL=postgresql://...

# Client-accessible (must start with PUBLIC_)
PUBLIC_API_URL=https://api.example.com
PUBLIC_SITE_NAME=My Site
```

**Type-safe environment variables:**

```javascript
// astro.config.mjs
import { defineConfig, envField } from 'astro/config';

export default defineConfig({
  experimental: {
    env: {
      schema: {
        PUBLIC_API_URL: envField.string({
          context: 'client',
          access: 'public',
        }),
        SECRET_API_KEY: envField.string({
          context: 'server',
          access: 'secret',
        }),
      },
    },
  },
});
```

### Accessing Variables

```astro
---
// Server-only
const secretKey = import.meta.env.SECRET_API_KEY;

// Public (available client-side)
const apiUrl = import.meta.env.PUBLIC_API_URL;
---

<script>
  // Public variables work in client scripts
  const apiUrl = import.meta.env.PUBLIC_API_URL;
</script>
```

### Platform-Specific

**Netlify:**
- Dashboard: Site Settings > Environment Variables
- CLI: `netlify env:set KEY value`

**Vercel:**
- Dashboard: Project Settings > Environment Variables
- CLI: `vercel env add KEY`

**Cloudflare:**
- Dashboard: Workers & Pages > Settings > Environment Variables
- CLI: `wrangler secret put KEY`

**GitHub Actions:**
```yaml
env:
  PUBLIC_API_URL: ${{ secrets.PUBLIC_API_URL }}
  SECRET_KEY: ${{ secrets.SECRET_KEY }}
```

---

## CI/CD Setup

### GitHub Actions Template

```yaml
name: Deploy Astro Site

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npm run astro check

      - name: Build
        run: npm run build
        env:
          PUBLIC_API_URL: ${{ secrets.PUBLIC_API_URL }}

      - name: Upload build artifact
        uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - name: Download artifact
        uses: actions/download-artifact@v4
        with:
          name: dist
          path: dist/

      - name: Deploy
        # Platform-specific deployment step
        run: echo "Deploy to hosting"
```

### GitLab CI

```yaml
# .gitlab-ci.yml
image: node:20

stages:
  - build
  - deploy

cache:
  paths:
    - node_modules/

build:
  stage: build
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/

deploy:
  stage: deploy
  only:
    - main
  script:
    - npm run deploy
```

---

## Performance Optimization

### Build Optimization

**1. Enable build caching:**

```yaml
# GitHub Actions
- uses: actions/cache@v4
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
```

**2. Parallel builds:**

```javascript
export default defineConfig({
  build: {
    concurrency: 2,  // Build 2 pages in parallel
  },
});
```

**3. Asset optimization:**

```javascript
export default defineConfig({
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
  build: {
    inlineStylesheets: 'auto',
  },
});
```

### CDN Configuration

**CloudFront example:**

```javascript
export default defineConfig({
  build: {
    assetsPrefix: 'https://d123456.cloudfront.net',
  },
});
```

**Caching headers:**

```javascript
// For Netlify (_headers file)
/*
  Cache-Control: public, max-age=31536000, immutable

/sw.js
  Cache-Control: no-cache
```

### Compression

**Netlify/Vercel:** Automatic Brotli/Gzip

**Custom server:**

```javascript
// Node.js with compression
import compression from 'compression';
import { handler } from './dist/server/entry.mjs';

app.use(compression());
app.use(handler);
```

---

## Deployment Checklist

### Pre-Deployment

- [ ] Set production `site` URL in config
- [ ] Configure environment variables
- [ ] Test production build locally (`npm run preview`)
- [ ] Run type checking (`astro check`)
- [ ] Optimize images
- [ ] Add sitemap integration
- [ ] Configure robots.txt
- [ ] Set up analytics

### Post-Deployment

- [ ] Test live site functionality
- [ ] Verify environment variables
- [ ] Check Lighthouse scores
- [ ] Test on multiple devices
- [ ] Set up monitoring/error tracking
- [ ] Configure CDN if needed
- [ ] Set up custom domain
- [ ] Enable HTTPS

---

## Troubleshooting

### Build Errors

**Issue:** Module not found
**Solution:** Run `npm ci` to ensure dependencies match lock file

**Issue:** TypeScript errors
**Solution:** Run `astro sync` to regenerate types

**Issue:** Out of memory
**Solution:** Increase Node memory: `NODE_OPTIONS=--max-old-space-size=4096 npm run build`

### Runtime Errors

**Issue:** Environment variables undefined
**Solution:** Ensure variables are set in hosting platform, use `PUBLIC_` prefix for client-side

**Issue:** 404 on dynamic routes
**Solution:** Verify `getStaticPaths()` returns all paths for SSG mode

**Issue:** Assets not loading
**Solution:** Check `base` config matches deployment path

---

## Resources

- [Deployment Docs](https://docs.astro.build/en/guides/deploy/)
- [Adapter Reference](https://docs.astro.build/en/guides/integrations-guide/#official-integrations)
- [Environment Variables](https://docs.astro.build/en/guides/environment-variables/)

---

**Last Updated:** January 2025
