/**
 * Content Collections
 *
 * - people: one markdown file per crew member (frontmatter only), served at <subdomain>.vecia.fr
 * - notes: dated claims about AI with evidence (en/ and fr/ folders; language = folder)
 * - cases: case files, one deployment each (en/ and fr/)
 * - log: the weekly workbench log (en/ and fr/)
 *
 * Helpers for reading them live in src/lib/content.ts.
 */

import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const bilingual = z.object({ en: z.string(), fr: z.string() });

const people = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/people' }),
  schema: z.object({
    name: z.string(),
    subdomain: z.string(),
    order: z.number(),
    role: bilingual,
    bio: bilingual,
    now: bilingual,
    nowUpdated: z.coerce.date(),
    how: bilingual,
    building: z.array(z.object({ name: z.string(), line: bilingual })),
    offKeyboard: bilingual,
    links: z.object({
      email: z.string(),
      linkedin: z.string(),
      calFree: z.string(),
      cv: z.string().optional(),
    }),
  }),
});

const notes = defineCollection({
  loader: glob({ pattern: '{en,fr}/*.md', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    author: z.string().default('alexandre'),
    claim: z.string().optional(),
    verdict: z.enum(['good', 'bad', 'changing']).optional(),
    evidence: z.array(z.object({ label: z.string(), url: z.string().optional() })).default([]),
    models: z.array(z.string()).default([]),
    updates: z.array(z.object({ date: z.coerce.date(), text: z.string() })).default([]),
    archive: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    translationSlug: z.string().optional(),
    image: z.string().optional(),
  }),
});

const cases = defineCollection({
  loader: glob({ pattern: '{en,fr}/*.md', base: './src/content/cases' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    author: z.string().default('alexandre'),
    sector: z.string(),
    stack: z.array(z.string()).default([]),
    translationSlug: z.string().optional(),
  }),
});

const log = defineCollection({
  loader: glob({ pattern: '{en,fr}/*.md', base: './src/content/log' }),
  schema: z.object({
    title: z.string(),
    week: z.string(), // e.g. '2026-W41'
    date: z.coerce.date(),
    author: z.string().default('alexandre'),
    fleet: z.record(z.string(), z.union([z.number(), z.string()])).optional(),
    translationSlug: z.string().optional(),
  }),
});

export const collections = { people, notes, cases, log };
