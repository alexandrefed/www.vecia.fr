/**
 * Feed items for rss.xml, feed.json and llms.txt.
 * Notes, cases and the workbench log in one list, newest first.
 */

import type { Language } from '../i18n/ui';
import { byLang, slugOf } from './content';
import { site as siteEn } from '../i18n/en/site';
import { site as siteFr } from '../i18n/fr/site';

export interface FeedItem {
  section: 'notes' | 'cases' | 'workshop';
  url: string;
  title: string;
  summary: string;
  date: Date;
  tags: string[];
}

export function absolute(path: string, origin: string): string {
  return new URL(path, origin).href;
}

export async function feedItems(lang: Language, origin: string): Promise<FeedItem[]> {
  const site = lang === 'fr' ? siteFr : siteEn;
  const prefix = lang === 'fr' ? '/fr' : '';
  const [notes, cases, log] = await Promise.all([byLang('notes', lang), byLang('cases', lang), byLang('log', lang)]);

  const items: FeedItem[] = [
    ...notes.map((e) => ({
      section: 'notes' as const,
      url: absolute(`${prefix}/notes/${slugOf(e)}`, origin),
      title: e.data.title,
      summary: e.data.description,
      date: e.data.date,
      tags: e.data.tags,
    })),
    ...cases.map((e) => ({
      section: 'cases' as const,
      url: absolute(`${prefix}/cases/${slugOf(e)}`, origin),
      title: e.data.title,
      summary: e.data.description,
      date: e.data.date,
      tags: [e.data.sector, ...e.data.stack],
    })),
    ...log.map((e) => ({
      section: 'workshop' as const,
      url: absolute(`${prefix}/workshop/${slugOf(e)}`, origin),
      title: e.data.title,
      summary: `${site.workshop.week} ${e.data.week}`,
      date: e.data.date,
      tags: [] as string[],
    })),
  ];
  return items.sort((a, b) => b.date.getTime() - a.date.getTime());
}
