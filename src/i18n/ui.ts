/**
 * Legal-page translations (privacy, terms, cookies, AI ethics).
 *
 * The site's own copy lives in en/site.ts and fr/site.ts (typed as SiteCopy).
 * Only the long legal texts still use this key/value dictionary.
 */

import { legal as frLegal } from './fr/legal';
import { legal as enLegal } from './en/legal';

export const ui = {
  fr: { ...frLegal },
  en: { ...enLegal },
} as const;

/** Language type inferred from ui keys */
export type Language = keyof typeof ui;

/** Translation keys inferred from French translations (French is the source of truth) */
export type TranslationKey = keyof typeof ui.fr;
