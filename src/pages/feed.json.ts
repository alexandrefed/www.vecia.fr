/**
 * JSON Feed 1.1 (English): notes, cases and the workbench log, newest first.
 * https://www.jsonfeed.org/version/1.1/
 */
import type { APIContext } from 'astro';
import { config } from '../config';
import { site } from '../i18n/en/site';
import { feedItems } from '../lib/feed';

export async function GET(context: APIContext) {
  const origin = context.site?.toString() || config.site.url;
  const items = await feedItems('en', origin);

  const feed = {
    version: 'https://jsonfeed.org/version/1.1',
    title: site.meta.title,
    home_page_url: origin,
    feed_url: new URL('/feed.json', origin).href,
    description: site.meta.description,
    language: 'en-US',
    items: items.map((i) => ({
      id: i.url,
      url: i.url,
      title: i.title,
      summary: i.summary,
      date_published: i.date.toISOString(),
      tags: i.tags,
    })),
  };

  return new Response(JSON.stringify(feed, null, 2), {
    headers: { 'Content-Type': 'application/feed+json; charset=utf-8' },
  });
}
