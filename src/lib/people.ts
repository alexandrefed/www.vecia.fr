/**
 * Person URLs. In production each person lives on <subdomain>.vecia.fr;
 * in dev (and anywhere else) they are served from /people/<subdomain>/.
 */

import type { Language } from '../i18n/ui';

export function personUrl(subdomain: string, lang: Language, path: string = ''): string {
  const clean = path.replace(/^\//, '');
  const prefix = lang === 'fr' ? 'fr/' : '';
  if (import.meta.env.PROD) {
    return `https://${subdomain}.vecia.fr/${prefix}${clean}`;
  }
  return `/${prefix}people/${subdomain}/${clean}`;
}
