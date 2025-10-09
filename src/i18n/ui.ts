/**
 * Main i18n translations file
 *
 * This file merges all namespace-based translation files into a single export.
 * Translations are organized by language and feature for better maintainability.
 *
 * Structure:
 * - fr/: French translations split by feature
 *   - common.ts: Cross-page elements (meta, nav, footer, suite, products, journey, cases)
 *   - about.ts: About page
 *   - legal.ts: Legal pages (privacy, terms, cookies, AI ethics)
 *   - blog.ts: Blog system
 * - en/: English translations (same structure as French)
 */

import { common as frCommon } from './fr/common';
import { about as frAbout } from './fr/about';
import { legal as frLegal } from './fr/legal';
import { blog as frBlog } from './fr/blog';

import { common as enCommon } from './en/common';
import { about as enAbout } from './en/about';
import { legal as enLegal } from './en/legal';
import { blog as enBlog } from './en/blog';

/**
 * Merged translations by language
 * Each language object combines all feature namespaces using spread operator
 */
export const ui = {
  fr: {
    ...frCommon,
    ...frAbout,
    ...frLegal,
    ...frBlog,
  },
  en: {
    ...enCommon,
    ...enAbout,
    ...enLegal,
    ...enBlog,
  },
} as const;

/**
 * Language type inferred from ui keys
 */
export type Language = keyof typeof ui;

/**
 * Translation keys inferred from French translations
 * (using French as the source of truth)
 */
export type TranslationKey = keyof typeof ui.fr;
