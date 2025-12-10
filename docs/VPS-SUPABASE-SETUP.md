# VPS Supabase Configuration for Vecia Website

This document describes the manual VPS configuration required for the Vecia website's comment system. These changes are not tracked in git and must be applied manually on the VPS.

## Overview

The Vecia website uses a dedicated `vecia` schema in PostgreSQL to isolate its data from the main Supabase `public` schema. This provides:

- **Data isolation**: Vecia's tables don't interfere with other Supabase applications
- **Security**: Separate RLS policies and permissions
- **Clean separation**: Easy to identify Vecia-specific tables

## Architecture

```
┌─────────────────────┐     ┌─────────────────────┐
│  vecia-website      │────▶│  supabase-kong      │
│  (Docker container) │     │  (API Gateway)      │
└─────────────────────┘     └──────────┬──────────┘
                                       │
                           ┌───────────▼───────────┐
                           │   supabase-rest       │
                           │   (PostgREST)         │
                           └───────────┬───────────┘
                                       │
                           ┌───────────▼───────────┐
                           │   PostgreSQL          │
                           │   └── vecia schema    │
                           │       └── comments    │
                           └───────────────────────┘
```

## Configuration Steps

### 1. PostgreSQL Schema Creation

Connect to the PostgreSQL database on the VPS:

```bash
ssh vecia-vps
docker exec -it supabase-db psql -U postgres
```

Create the `vecia` schema and `comments` table:

```sql
-- Create dedicated schema for Vecia website
CREATE SCHEMA IF NOT EXISTS vecia;

-- Create comments table
CREATE TABLE vecia.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  article_slug TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_email TEXT,
  comment_text TEXT NOT NULL,
  parent_comment_id UUID REFERENCES vecia.comments(id) ON DELETE CASCADE,
  is_vecia_member BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved BOOLEAN DEFAULT TRUE,

  -- Constraints
  CONSTRAINT author_name_length CHECK (char_length(author_name) >= 2 AND char_length(author_name) <= 100),
  CONSTRAINT comment_text_length CHECK (char_length(comment_text) >= 1 AND char_length(comment_text) <= 5000),
  CONSTRAINT author_email_format CHECK (author_email IS NULL OR author_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create indexes for performance
CREATE INDEX idx_comments_article_slug ON vecia.comments(article_slug);
CREATE INDEX idx_comments_created_at ON vecia.comments(created_at DESC);
CREATE INDEX idx_comments_parent_id ON vecia.comments(parent_comment_id);

-- Enable Row Level Security
ALTER TABLE vecia.comments ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Anyone can read approved comments
CREATE POLICY "Anyone can read approved comments"
  ON vecia.comments
  FOR SELECT
  USING (approved = true);

-- RLS Policy: Anyone can insert comments (will be moderated)
CREATE POLICY "Anyone can insert comments"
  ON vecia.comments
  FOR INSERT
  WITH CHECK (true);
```

### 2. PostgREST Configuration

PostgREST needs to be configured to expose the `vecia` schema. Edit the Supabase environment file:

```bash
ssh vecia-vps
nano /opt/vecia/supabase/docker/docker/.env
```

Find the `PGRST_DB_SCHEMAS` line and add `vecia`:

```env
# Before
PGRST_DB_SCHEMAS=public,storage,graphql_public

# After
PGRST_DB_SCHEMAS=public,storage,graphql_public,vecia
```

Recreate the PostgREST container to apply the change:

```bash
cd /opt/vecia/supabase/docker/docker
docker compose up -d supabase-rest --force-recreate
```

### 3. Schema Permissions

Grant the necessary permissions to Supabase roles:

```sql
-- Connect to PostgreSQL
docker exec -it supabase-db psql -U postgres

-- Grant schema usage to all relevant roles
GRANT USAGE ON SCHEMA vecia TO anon, authenticated, service_role;

-- Grant table permissions
GRANT SELECT, INSERT ON vecia.comments TO anon, authenticated;
GRANT ALL ON vecia.comments TO service_role;
```

## Verification

### Test the API endpoint

From the VPS, test the comments API:

```bash
# Test GET endpoint
curl -s http://127.0.0.1:4322/api/comments/test-article.json | jq

# Test POST endpoint
curl -X POST http://127.0.0.1:4322/api/comments/test-article.json \
  -H "Content-Type: application/json" \
  -d '{"author_name": "Test User", "comment_text": "Test comment"}'
```

### Check PostgREST schemas

Verify the vecia schema is exposed:

```bash
docker exec supabase-rest curl -s http://localhost:3000/ | jq '.paths | keys'
```

You should see `/vecia.comments` in the output.

## Docker Networking

The `vecia-website` container connects directly to the `supabase_default` network for internal communication:

- **Client-side (browser)**: Uses `PUBLIC_SUPABASE_URL=http://85.25.172.47:8100`
- **Server-side (SSR/API routes)**: Uses `SUPABASE_URL=http://supabase-kong:8000`

This is configured in `docker-compose.yml`:

```yaml
services:
  vecia-website:
    networks:
      - default
      - supabase_default

networks:
  supabase_default:
    external: true
```

## Troubleshooting

### Error: "The schema must be one of the following: public, storage, graphql_public"

**Cause**: PostgREST doesn't know about the vecia schema.

**Fix**: Add `vecia` to `PGRST_DB_SCHEMAS` and recreate the supabase-rest container.

### Error: "permission denied for schema vecia"

**Cause**: PostgreSQL roles don't have access to the vecia schema.

**Fix**: Run the permission grants:
```sql
GRANT USAGE ON SCHEMA vecia TO anon, authenticated, service_role;
GRANT SELECT, INSERT ON vecia.comments TO anon, authenticated;
```

### Error: "fetch failed" or connection timeout

**Cause**: Container networking issue - vecia-website can't reach Supabase.

**Fix**: Ensure vecia-website is on the `supabase_default` network and uses `http://supabase-kong:8000` for server-side requests.

## Related Files

- `docker-compose.yml` - Docker networking configuration
- `.github/workflows/deploy.yml` - Deployment workflow with .env creation
- `src/lib/supabase-server.ts` - Supabase client with vecia schema
- `src/pages/api/comments/[slug].json.ts` - Comments API endpoint

---

**Last Updated**: December 2024
**VPS Location**: `/opt/vecia/supabase/docker/docker/`
