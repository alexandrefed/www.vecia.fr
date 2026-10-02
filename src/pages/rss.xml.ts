import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { config } from '../config';
import { site } from '../i18n/en/site';
import { feedItems } from '../lib/feed';

export async function GET(context: APIContext) {
  const origin = context.site?.toString() || config.site.url;
  const items = await feedItems('en', origin);

  return rss({
    title: site.meta.title,
    description: site.meta.description,
    site: origin,
    items: items.map((i) => ({
      title: i.title,
      description: i.summary,
      pubDate: i.date,
      link: i.url,
      categories: i.tags,
    })),
    customData: '<language>en-US</language>',
  });
}
