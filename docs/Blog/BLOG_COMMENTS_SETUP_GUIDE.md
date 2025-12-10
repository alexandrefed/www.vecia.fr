# Blog Comments Setup Guide - www.vecia.fr

## ✅ Setup Complete!

Your Supabase comment system is now ready to use on your VPS. All database tables, indexes, and Row Level Security (RLS) policies have been configured.

---

## 📋 Configuration Summary

### Supabase Connection Details
- **API URL**: `http://85.25.172.47:8100`
- **Anonymous Key**: `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlLWRlbW8iLCJpYXQiOjE2NDE3NjkyMDAsImV4cCI6MTc5OTUzNTYwMH0.Jp4HPK5Cr7GM2j5eu4SMSYrmyPnL_moGV_olTHvcZbQ`
- **Database**: `postgres` (Supabase PostgreSQL 15)
- **Table**: `comments`

### Database Schema
```sql
Table: comments
├── id (uuid) - Primary key, auto-generated
├── article_slug (text) - Blog post identifier (e.g., "my-first-post")
├── author_name (text) - Commenter name (1-100 characters)
├── author_email (text, optional) - Email for notifications/gravatar
├── comment_text (text) - Comment content (1-5000 characters)
├── parent_comment_id (uuid, optional) - For nested replies
├── is_vecia_member (boolean) - Flag for verified Vecia team members
├── created_at (timestamp) - Auto-generated creation time
└── approved (boolean) - Moderation flag (default: true)
```

### Security (RLS Policies)
✅ **Enabled**: Row Level Security is active

**Public Users Can:**
- ✅ Read approved comments (`approved = true`)
- ✅ Insert new comments (auto-approved by default)

**Public Users Cannot:**
- ❌ Update existing comments
- ❌ Delete comments
- ❌ Read unapproved comments

---

## 🚀 Frontend Integration

### Step 1: Install Supabase Client
```bash
npm install @supabase/supabase-js
# or
yarn add @supabase/supabase-js
# or
pnpm add @supabase/supabase-js
```

### Step 2: Create Environment File
Copy `/tmp/vecia-blog-comments.env` to your project as `.env.local`:

```bash
# For Vite/Vue projects
VITE_SUPABASE_URL=http://85.25.172.47:8100
VITE_SUPABASE_ANON_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlLWRlbW8iLCJpYXQiOjE2NDE3NjkyMDAsImV4cCI6MTc5OTUzNTYwMH0.Jp4HPK5Cr7GM2j5eu4SMSYrmyPnL_moGV_olTHvcZbQ

# For Next.js projects - rename to NEXT_PUBLIC_
# For Create React App - rename to REACT_APP_
```

### Step 3: Initialize Supabase Client

**For Vue/Vite:**
```javascript
// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

**For Next.js:**
```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

---

## 💻 Usage Examples

### 1. Fetch All Comments for a Blog Post
```javascript
import { supabase } from './lib/supabase'

async function getComments(articleSlug) {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('article_slug', articleSlug)
    .is('parent_comment_id', null) // Only top-level comments
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching comments:', error)
    return []
  }

  return data
}

// Usage
const comments = await getComments('my-blog-post-slug')
```

### 2. Fetch Comments with Nested Replies
```javascript
async function getCommentsWithReplies(articleSlug) {
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      replies:comments!parent_comment_id(*)
    `)
    .eq('article_slug', articleSlug)
    .is('parent_comment_id', null)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching comments:', error)
    return []
  }

  return data
}
```

### 3. Post a New Comment
```javascript
async function postComment(commentData) {
  const { data, error } = await supabase
    .from('comments')
    .insert([
      {
        article_slug: commentData.articleSlug,
        author_name: commentData.authorName,
        author_email: commentData.authorEmail, // Optional
        comment_text: commentData.text,
        parent_comment_id: commentData.parentId || null, // For replies
      }
    ])
    .select()

  if (error) {
    console.error('Error posting comment:', error)
    return { success: false, error }
  }

  return { success: true, data: data[0] }
}

// Usage
const result = await postComment({
  articleSlug: 'my-blog-post-slug',
  authorName: 'John Doe',
  authorEmail: 'john@example.com',
  text: 'Great article! Very informative.',
})
```

### 4. Post a Reply to a Comment
```javascript
async function replyToComment(parentCommentId, replyData) {
  return await postComment({
    ...replyData,
    parentId: parentCommentId
  })
}

// Usage
await replyToComment('uuid-of-parent-comment', {
  articleSlug: 'my-blog-post-slug',
  authorName: 'Jane Smith',
  text: 'Thanks for sharing!'
})
```

### 5. Real-time Comment Subscription
```javascript
function subscribeToComments(articleSlug, callback) {
  const subscription = supabase
    .channel('comments')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'comments',
        filter: `article_slug=eq.${articleSlug}`
      },
      callback
    )
    .subscribe()

  return subscription
}

// Usage
const subscription = subscribeToComments('my-blog-post-slug', (payload) => {
  console.log('New comment:', payload.new)
  // Update your UI with the new comment
})

// Don't forget to unsubscribe when component unmounts
// subscription.unsubscribe()
```

### 6. Count Comments for a Blog Post
```javascript
async function getCommentCount(articleSlug) {
  const { count, error } = await supabase
    .from('comments')
    .select('*', { count: 'exact', head: true })
    .eq('article_slug', articleSlug)

  if (error) {
    console.error('Error counting comments:', error)
    return 0
  }

  return count
}
```

---

## 🎨 Vue 3 Composable Example

```javascript
// composables/useComments.js
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'

export function useComments(articleSlug) {
  const comments = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Fetch comments
  async function fetchComments() {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('comments')
        .select('*')
        .eq('article_slug', articleSlug.value)
        .is('parent_comment_id', null)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      comments.value = data
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  // Post comment
  async function postComment(commentData) {
    loading.value = true
    error.value = null

    try {
      const { data, error: postError } = await supabase
        .from('comments')
        .insert([{
          article_slug: articleSlug.value,
          ...commentData
        }])
        .select()

      if (postError) throw postError

      // Add new comment to the list
      comments.value.unshift(data[0])
      return { success: true }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Computed
  const commentCount = computed(() => comments.value.length)

  return {
    comments,
    loading,
    error,
    commentCount,
    fetchComments,
    postComment
  }
}

// Usage in component:
// const { comments, loading, fetchComments, postComment } = useComments(ref('my-blog-post'))
// onMounted(() => fetchComments())
```

---

## 🔧 Advanced: Form Validation

```javascript
function validateComment(data) {
  const errors = {}

  // Validate author name
  if (!data.author_name || data.author_name.trim().length === 0) {
    errors.author_name = 'Name is required'
  } else if (data.author_name.length > 100) {
    errors.author_name = 'Name must be less than 100 characters'
  }

  // Validate email (optional, but must be valid if provided)
  if (data.author_email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.author_email)) {
      errors.author_email = 'Invalid email address'
    }
  }

  // Validate comment text
  if (!data.comment_text || data.comment_text.trim().length === 0) {
    errors.comment_text = 'Comment cannot be empty'
  } else if (data.comment_text.length > 5000) {
    errors.comment_text = 'Comment must be less than 5000 characters'
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  }
}
```

---

## 🔐 Optional: Setup HTTPS Access

Currently, your Supabase instance is accessible via HTTP. To enable HTTPS:

### 1. Configure nginx Reverse Proxy
```bash
# On your VPS
sudo nano /etc/nginx/sites-available/vecia-unified
```

Add this server block:
```nginx
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name api.vecia.fr;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/api.vecia.fr/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.vecia.fr/privkey.pem;

    # Proxy to Supabase Kong Gateway
    location / {
        proxy_pass http://localhost:8100;
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

### 2. Generate SSL Certificate
```bash
sudo certbot certonly --webroot -w /var/www/html -d api.vecia.fr
sudo nginx -t && sudo systemctl reload nginx
```

### 3. Update Your Frontend .env
```bash
VITE_SUPABASE_URL=https://api.vecia.fr
```

---

## 🛠️ Admin Tasks

### View All Comments (psql)
```bash
PGPASSWORD=$SUPABASE_DB_PASSWORD docker compose -f /opt/vecia/supabase/docker/docker/docker-compose.yml exec -T db psql -U postgres -d postgres -c "SELECT * FROM comments ORDER BY created_at DESC LIMIT 10;"
```

### Moderate Comments (Approve/Unapprove)
```bash
# Unapprove a comment
PGPASSWORD=$SUPABASE_DB_PASSWORD docker compose -f /opt/vecia/supabase/docker/docker/docker-compose.yml exec -T db psql -U postgres -d postgres -c "UPDATE comments SET approved = false WHERE id = 'comment-uuid';"

# Approve a comment
PGPASSWORD=$SUPABASE_DB_PASSWORD docker compose -f /opt/vecia/supabase/docker/docker/docker-compose.yml exec -T db psql -U postgres -d postgres -c "UPDATE comments SET approved = true WHERE id = 'comment-uuid';"
```

### Delete Spam Comment
```bash
PGPASSWORD=$SUPABASE_DB_PASSWORD docker compose -f /opt/vecia/supabase/docker/docker/docker-compose.yml exec -T db psql -U postgres -d postgres -c "DELETE FROM comments WHERE id = 'comment-uuid';"
```

> **Note:** Set `SUPABASE_DB_PASSWORD` environment variable before running these commands, or replace with your actual password.

---

## 📊 Database Statistics

### Comment Count by Article
```sql
SELECT
  article_slug,
  COUNT(*) as comment_count,
  MAX(created_at) as latest_comment
FROM comments
GROUP BY article_slug
ORDER BY comment_count DESC;
```

### Recent Comments
```sql
SELECT
  article_slug,
  author_name,
  LEFT(comment_text, 50) as preview,
  created_at
FROM comments
ORDER BY created_at DESC
LIMIT 20;
```

---

## 🔍 Troubleshooting

### CORS Issues
If you encounter CORS errors, ensure your Kong Gateway is properly configured. The Supabase setup should handle CORS automatically, but you may need to add your domain to the allowed origins.

### Connection Refused
- Verify Supabase containers are running: `docker ps | grep supabase`
- Check Kong is listening on port 8100: `netstat -tlnp | grep 8100`
- Verify firewall allows port 8100: `sudo ufw status`

### RLS Policy Blocking Inserts
If inserts fail, check the RLS policies:
```sql
SELECT * FROM pg_policies WHERE tablename = 'comments';
```

---

## 📚 Resources

- **Supabase Docs**: https://supabase.com/docs
- **Supabase JS Client**: https://supabase.com/docs/reference/javascript
- **PostgreSQL Row Level Security**: https://www.postgresql.org/docs/current/ddl-rowsecurity.html

---

## ✅ Next Steps

1. Copy `/tmp/vecia-blog-comments.env` to your frontend project
2. Install `@supabase/supabase-js` package
3. Implement comment components using the examples above
4. Test posting and fetching comments
5. (Optional) Setup HTTPS access via api.vecia.fr

---

*Setup completed on: 2025-10-10*
*VPS: 85.25.172.47*
*Contact: alexandre.fedotov@vecia.fr*
