/**
 * llms.txt: a plain-text map of the site for language models.
 */
import type { APIContext } from 'astro';
import { config } from '../config';
import { site } from '../i18n/en/site';
import { feedItems, absolute } from '../lib/feed';
import { allPeople } from '../lib/content';

export async function GET(context: APIContext) {
  const origin = context.site?.toString() || config.site.url;
  const [en, fr, people] = await Promise.all([feedItems('en', origin), feedItems('fr', origin), allPeople()]);
  const all = [...en, ...fr];

  const section = (heading: string, key: 'notes' | 'cases' | 'workshop') => {
    const lines = all.filter((i) => i.section === key).map((i) => `- ${i.url}: ${i.title}. ${i.summary}`);
    return [`## ${heading}`, ...(lines.length ? lines : ['- (none yet)']), ''];
  };

  const lines = [
    '# Vecia',
    '',
    `> ${site.meta.title}`,
    `> ${site.meta.description}`,
    `> English at ${origin}, French under ${absolute('/fr/', origin)}.`,
    '',
    ...section('Field notes', 'notes'),
    ...section('Case files', 'cases'),
    ...section('Workbench', 'workshop'),
    '## People',
    ...people.map((p) => `- https://${p.data.subdomain}.vecia.fr/: ${p.data.name}. ${p.data.role.en}`),
    ...people.map((p) => `- https://${p.data.subdomain}.vecia.fr/fr/: ${p.data.name}. ${p.data.role.fr}`),
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
