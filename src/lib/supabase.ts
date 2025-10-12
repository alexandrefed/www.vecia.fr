/**
 * Supabase Client Utility
 *
 * Creates and exports a configured Supabase client for server-side operations.
 * Uses environment variables for configuration.
 */

import { createClient } from '@supabase/supabase-js';

// Support both build-time (import.meta.env) and runtime (process.env) environments
// Build-time: Static pages use bundled values from import.meta.env
// Runtime: SSR API routes use process.env from PM2
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file.\n' +
    'Required: PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Comment type definition matching database schema
 */
export interface Comment {
  id: string;
  article_slug: string;
  author_name: string;
  author_email?: string | null;
  comment_text: string;
  parent_comment_id?: string | null;
  is_vecia_member: boolean;
  created_at: string;
  approved: boolean;
}

/**
 * API response type for comments
 */
export interface CommentsResponse {
  comments: Comment[];
  error?: string;
}

/**
 * API response type for comment submission
 */
export interface SubmitCommentResponse {
  success: boolean;
  comment?: Comment;
  error?: string;
}
