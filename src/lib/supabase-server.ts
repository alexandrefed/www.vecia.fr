/**
 * Server-Side Supabase Client for SSR API Routes
 *
 * This client is specifically designed for Server-Side Rendering (SSR) routes
 * with `prerender: false`. It uses ONLY process.env to avoid Vite's static
 * replacement behavior.
 *
 * **Why this file exists:**
 * - Vite performs static replacement on `import.meta.env.*` during build time
 * - This converts env vars to literal strings in the bundled code
 * - SSR routes need runtime access to env vars from PM2's ecosystem config
 * - Using ONLY `process.env` prevents Vite from doing static replacement
 *
 * **Usage:**
 * Import this in API routes with `prerender: false`:
 * ```typescript
 * import { supabaseServer as supabase } from '../../../lib/supabase-server';
 * ```
 *
 * **Do NOT use this for:**
 * - Static pages (use `src/lib/supabase.ts` instead)
 * - Client-side code (use `src/lib/supabase.ts` instead)
 */

import { createClient } from '@supabase/supabase-js';

// Use non-PUBLIC prefixed env vars to prevent Vite static replacement
// Vite replaces ALL PUBLIC_* variables at build time, even in process.env
// Using plain SUPABASE_* names keeps them dynamic at runtime
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase runtime environment variables.\n' +
    'Required: SUPABASE_URL and SUPABASE_ANON_KEY (without PUBLIC_ prefix)\n' +
    'These should be provided by PM2 ecosystem config at runtime.'
  );
}

/**
 * Supabase client configured for SSR routes
 * Reads credentials from process.env at runtime
 * Uses 'vecia' schema for complete isolation from other projects
 */
export const supabaseServer = createClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: 'vecia', // Use dedicated vecia schema instead of public
  },
});

/**
 * Re-export types from main supabase module for convenience
 */
export type { Comment, CommentsResponse, SubmitCommentResponse } from './supabase';
