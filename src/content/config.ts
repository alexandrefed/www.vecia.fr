/**
 * Content Collections Configuration
 *
 * Defines type-safe content collections for the Vecia website.
 * Uses Astro 5.0 glob() loader pattern for automatic content discovery.
 *
 * Collections:
 * - blog: Markdown blog posts with frontmatter validation
 *
 * 2025 Best Practices:
 * - glob() loader for Astro 5.0 compatibility
 * - Zod schema for runtime validation + TypeScript types
 * - z.coerce.date() for flexible date parsing
 * - Optional fields for LinkedIn metadata
 */

import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  // Astro 5.0 glob loader - auto-generates URL-friendly IDs from filenames
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),

  // Zod schema for type-safe frontmatter validation
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(), // Flexible date parsing (YYYY-MM-DD, etc.)
    updatedDate: z.coerce.date().optional(), // Optional last update date
    author: z.string(),

    // Blog categories (type-safe enum)
    category: z.enum([
      'why-broken',           // "Why Current Systems Are Broken"
      'success-stories',      // Customer success stories
      'quick-wins',           // Fast implementation guides
      'industry-deep-dives',  // Industry-specific automation
      'tool-comparisons'      // Tool reviews and comparisons
    ]),

    tags: z.array(z.string()),

    // Optional fields
    featured: z.boolean().optional(),      // Featured on homepage
    image: z.string().optional(),          // Cover image path

    // LinkedIn metadata (for social sharing)
    linkedin: z.object({
      caption: z.string(),                 // Post caption for LinkedIn
      hashtags: z.array(z.string())        // LinkedIn hashtags
    }).optional()
  })
});

export const collections = { blog };
