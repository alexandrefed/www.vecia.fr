# Supabase Setup Guide for Blog Comments

This guide walks you through setting up Supabase for the blog comment system.

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in:
   - **Name**: `vecia-blog-comments` (or any name you prefer)
   - **Database Password**: Generate a secure password (save it!)
   - **Region**: Choose closest to your users (e.g., `eu-west-1` for Europe)
   - **Pricing Plan**: Free tier is perfect for starting

4. Wait 2-3 minutes for project creation

## Step 2: Create Comments Table

1. In your Supabase project dashboard, go to **SQL Editor**
2. Click "New Query"
3. Paste the following SQL:

```sql
-- Create comments table
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  article_slug TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_email TEXT,
  comment_text TEXT NOT NULL,
  parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  is_vecia_member BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved BOOLEAN DEFAULT TRUE,
  CONSTRAINT comment_text_length CHECK (char_length(comment_text) >= 1 AND char_length(comment_text) <= 5000),
  CONSTRAINT author_name_length CHECK (char_length(author_name) >= 1 AND char_length(author_name) <= 100)
);

-- Create indexes for better performance
CREATE INDEX idx_comments_article_slug ON comments(article_slug);
CREATE INDEX idx_comments_parent_id ON comments(parent_comment_id);
CREATE INDEX idx_comments_created_at ON comments(created_at DESC);

-- Enable Row Level Security
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read approved comments
CREATE POLICY "Anyone can read approved comments"
  ON comments
  FOR SELECT
  USING (approved = true);

-- Policy: Anyone can insert comments
CREATE POLICY "Anyone can insert comments"
  ON comments
  FOR INSERT
  WITH CHECK (true);

-- Add helpful comment
COMMENT ON TABLE comments IS 'Blog comments with nested threading support';
COMMENT ON COLUMN comments.parent_comment_id IS 'NULL for top-level comments, UUID of parent for replies';
COMMENT ON COLUMN comments.is_vecia_member IS 'TRUE if author is Alex or Tanguy from Vecia team';
```

4. Click "Run" to execute the SQL
5. Verify the table was created by going to **Table Editor** → **comments**

## Step 3: Get API Keys

1. Go to **Project Settings** (gear icon in sidebar)
2. Click **API** in the left menu
3. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGc...` (long string)

## Step 4: Add Environment Variables

1. Create/update `.env` file in project root:

```env
# Supabase Configuration
PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-key-here...
```

2. Add `.env` to `.gitignore` if not already there:

```bash
echo ".env" >> .gitignore
```

**IMPORTANT**: Never commit `.env` to git! The keys should remain private.

## Step 5: Test Connection (Optional)

After completing the setup, you can test the connection:

```bash
# Install Supabase client
npm install @supabase/supabase-js

# Test connection with Node REPL
node
```

Then in Node REPL:
```javascript
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'YOUR_SUPABASE_URL',
  'YOUR_SUPABASE_ANON_KEY'
);

// Test query
(async () => {
  const { data, error } = await supabase.from('comments').select('*');
  console.log('Connection successful!', { data, error });
})();
```

## Database Schema Reference

### `comments` table

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key, auto-generated |
| `article_slug` | TEXT | Article identifier (e.g., `ia-ne-marche-pas`) |
| `author_name` | TEXT | Comment author name (1-100 chars) |
| `author_email` | TEXT | Optional email (not displayed publicly) |
| `comment_text` | TEXT | Comment content (1-5000 chars) |
| `parent_comment_id` | UUID | NULL for top-level, parent UUID for replies |
| `is_vecia_member` | BOOLEAN | TRUE if author is Alex/Tanguy |
| `created_at` | TIMESTAMP | Auto-generated timestamp |
| `approved` | BOOLEAN | Moderation flag (default TRUE) |

## Security Features

✅ **Row Level Security (RLS)**: Enabled
✅ **Read Policy**: Only approved comments are visible
✅ **Write Policy**: Anyone can submit comments
✅ **Input Validation**: Length constraints on text fields
✅ **Cascade Delete**: Deleting a comment removes all replies

## Next Steps

Once you've completed this setup:
1. Verify you have the `.env` file with correct keys
2. Return to the main implementation - we'll install dependencies next
3. Test the connection before proceeding

## Troubleshooting

**Issue**: "relation 'comments' does not exist"
- **Solution**: Re-run the SQL query in SQL Editor

**Issue**: "permission denied for table comments"
- **Solution**: Check RLS policies are created correctly

**Issue**: Can't connect from code
- **Solution**: Verify `.env` file has correct `PUBLIC_` prefix on variables

## Free Tier Limits

Supabase free tier includes:
- 500MB database space
- 2GB bandwidth/month
- 50MB file storage
- 2 projects max

This is more than enough for a blog comment system!

---

**Last Updated**: January 2025
