# syntax=docker/dockerfile:1

# =========================================
# Build Stage: Install dependencies and build Astro
# =========================================
ARG NODE_VERSION=20.18.1
FROM node:${NODE_VERSION}-alpine AS builder

# Install build dependencies for native modules
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy dependency manifests first (cache optimization)
COPY package.json package-lock.json ./

# Install ALL dependencies (including devDependencies for build)
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# Copy application source code
COPY . .

# Build Astro site (outputs to dist/)
ARG PUBLIC_SITE_URL=https://vecia.fr
ARG PUBLIC_CAL_EMBED_URL=https://cal.vecia.fr
ENV PUBLIC_SITE_URL=${PUBLIC_SITE_URL}
ENV PUBLIC_CAL_EMBED_URL=${PUBLIC_CAL_EMBED_URL}

RUN npm run build

# =========================================
# Runtime Stage: Minimal production image
# =========================================
FROM node:${NODE_VERSION}-alpine AS runtime

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

WORKDIR /app

# Copy only production dependencies
COPY package.json package-lock.json ./

RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

# Copy built Astro output from builder
COPY --from=builder /app/dist ./dist

# Set ownership to non-root user
RUN chown -R node:node /app

# Switch to non-root user
USER node

# Runtime environment variables
ENV HOST=0.0.0.0
ENV PORT=4322
ENV NODE_ENV=production

# Expose port
EXPOSE 4322

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:4322/api/health.json', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Use dumb-init for signal handling
ENTRYPOINT ["dumb-init", "--"]

# Start the Astro server
CMD ["node", "./dist/server/entry.mjs"]
