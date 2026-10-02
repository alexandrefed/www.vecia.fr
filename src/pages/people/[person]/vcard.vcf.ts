/**
 * GET /people/<person>/vcard.vcf - a vCard 3.0 for the person. No phone number, by design.
 * On <person>.vecia.fr the host router rewrites /vcard.vcf here.
 */
import type { APIRoute } from 'astro';
import { allPeople } from '../../../lib/content';

const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');

export const GET: APIRoute = async ({ params }) => {
  const person = (await allPeople()).find((p) => p.data.subdomain === params.person);
  if (!person) return new Response(null, { status: 404, statusText: 'Not found' });

  const p = person.data;
  const parts = p.name.split(' ');
  const family = parts.length > 1 ? parts[parts.length - 1] : '';
  const given = parts.length > 1 ? parts.slice(0, -1).join(' ') : p.name;

  const card = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${esc(p.name)}`,
    `N:${esc(family)};${esc(given)};;;`,
    'ORG:Vecia',
    `TITLE:${esc(p.role.en)}`,
    `EMAIL;TYPE=INTERNET,WORK:${p.links.email}`,
    `URL:https://${p.subdomain}.vecia.fr/`,
    `URL;TYPE=LinkedIn:${p.links.linkedin}`,
    'END:VCARD',
    '',
  ].join('\r\n');

  return new Response(card, {
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      'Content-Disposition': `attachment; filename="${p.subdomain}.vcf"`,
    },
  });
};
