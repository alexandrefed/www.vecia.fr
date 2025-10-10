/**
 * API Route: GET /api/comments/[slug].json
 *
 * Fetches all approved comments for a specific blog article.
 * Returns comments in chronological order with threading support.
 */

import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import type { Comment } from '../../../lib/supabase';

// Enable server-side rendering for dynamic route
export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const { slug } = params;

  if (!slug) {
    return new Response(
      JSON.stringify({
        comments: [],
        error: 'Article slug is required',
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    // Fetch all approved comments for this article
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('article_slug', slug)
      .eq('approved', true)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('[API] Error fetching comments:', error);
      return new Response(
        JSON.stringify({
          comments: [],
          error: 'Failed to fetch comments',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Organize comments into threaded structure
    const comments = data as Comment[];
    const organizedComments = organizeThreadedComments(comments);

    return new Response(
      JSON.stringify({
        comments: organizedComments,
        count: comments.length,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=60', // Cache for 1 minute
        },
      }
    );
  } catch (err) {
    console.error('[API] Unexpected error:', err);
    return new Response(
      JSON.stringify({
        comments: [],
        error: 'An unexpected error occurred',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

/**
 * Organizes flat comments array into threaded structure
 * Top-level comments first, followed by their replies
 */
function organizeThreadedComments(comments: Comment[]): Comment[] {
  // Separate top-level comments and replies
  const topLevel: Comment[] = [];
  const repliesMap = new Map<string, Comment[]>();

  for (const comment of comments) {
    if (comment.parent_comment_id) {
      // It's a reply
      const parentId = comment.parent_comment_id;
      if (!repliesMap.has(parentId)) {
        repliesMap.set(parentId, []);
      }
      repliesMap.get(parentId)!.push(comment);
    } else {
      // It's a top-level comment
      topLevel.push(comment);
    }
  }

  // Build threaded structure (top-level + nested replies)
  const result: Comment[] = [];

  for (const topComment of topLevel) {
    result.push(topComment);

    // Add its replies (if any)
    const replies = repliesMap.get(topComment.id) || [];
    for (const reply of replies) {
      result.push(reply);

      // Add nested replies (depth 2)
      const nestedReplies = repliesMap.get(reply.id) || [];
      result.push(...nestedReplies);
    }
  }

  return result;
}
