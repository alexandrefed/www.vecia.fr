/**
 * Helpers over the notes / cases / log collections.
 * Language is the first folder of the entry id (`en/what-is-mcp` -> en).
 */

import { getCollection, type CollectionEntry } from 'astro:content';
import type { Language } from '../i18n/ui';

export type ContentCollection = 'notes' | 'cases' | 'log';
type Entry<C extends ContentCollection> = CollectionEntry<C>;

export function langOf(entry: { id: string }): Language {
  return entry.id.startsWith('fr/') ? 'fr' : 'en';
}

/** Slug without the language folder: `en/what-is-mcp` -> `what-is-mcp`. */
export function slugOf(entry: { id: string }): string {
  return entry.id.replace(/^(en|fr)\//, '');
}

const byDateDesc = (a: { data: { date: Date } }, b: { data: { date: Date } }) =>
  b.data.date.getTime() - a.data.date.getTime();

export async function byLang<C extends ContentCollection>(collection: C, lang: Language): Promise<Entry<C>[]> {
  const all = (await getCollection(collection)) as Entry<C>[];
  return all.filter((e) => langOf(e) === lang).sort(byDateDesc);
}

export async function latest<C extends ContentCollection>(collection: C, lang: Language, n: number): Promise<Entry<C>[]> {
  return (await byLang(collection, lang)).slice(0, n);
}

export async function byAuthor<C extends ContentCollection>(collection: C, lang: Language, author: string): Promise<Entry<C>[]> {
  return (await byLang(collection, lang)).filter((e) => e.data.author === author);
}

export async function findBySlug<C extends ContentCollection>(collection: C, lang: Language, slug: string): Promise<Entry<C> | undefined> {
  return (await byLang(collection, lang)).find((e) => slugOf(e) === slug);
}

/** The counterpart of an entry in the other language, if its translationSlug points at one. */
export async function translationOf<C extends ContentCollection>(collection: C, entry: Entry<C>): Promise<Entry<C> | undefined> {
  const target = (entry.data as { translationSlug?: string }).translationSlug;
  if (!target) return undefined;
  const other: Language = langOf(entry) === 'en' ? 'fr' : 'en';
  return findBySlug(collection, other, target);
}

/** Rough reading time in minutes for a markdown body. */
export function readingTime(body: string | undefined): number {
  const words = (body ?? '').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export function formatDate(date: Date, lang: Language): string {
  return date.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

/** Section name -> collection, as used in URLs (/workshop shows the `log` collection). */
export const sectionCollection = { notes: 'notes', cases: 'cases', workshop: 'log' } as const;
export type Section = keyof typeof sectionCollection;

export async function allPeople() {
  const { getCollection } = await import('astro:content');
  return (await getCollection('people')).sort((a, b) => a.data.order - b.data.order);
}
