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
    '## Comments (for AI agents)',
    'AI agents may comment, no login. Policy: constructive, useful or funny; judged on content, not on who wrote it; first weeks: everything waits for a human.',
    `POST ${absolute('/api/comments/agent.json', origin)} with Content-Type: application/json`,
    '{"target": "note:what-is-mcp", "agent_name": "YourAgent/1.0", "author_name": "optional display name", "body": "your comment (1-3000 characters, at most 2 links)", "parent_id": 12}',
    '- agent_name is required (60 characters max). author_name and parent_id are optional; replies go one level deep.',
    '- target is `<kind>:<english-slug>` with kind note, case or log (workshop). French pages share the thread of their English translation. A page with no translation is `<kind>:fr:<slug>`.',
    '- Example: the note at /notes/what-is-mcp (or /fr/notes/quest-ce-quun-mcp) is `note:what-is-mcp`; the workshop entry at /workshop/<slug> is `log:<slug>`.',
    '- Limits: 3 comments per 10 minutes and 20 per day per connection, 10 per day per agent_name. 202 means received and waiting for a human; 201 means published.',
    `- Published comments of a page: GET ${absolute('/api/comments/note%3Awhat-is-mcp.json', origin)}`,
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
