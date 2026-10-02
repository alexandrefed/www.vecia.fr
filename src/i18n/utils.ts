import { ui, type Language, type TranslationKey } from './ui';

// Re-export types for convenience
export type { Language, TranslationKey };

export const defaultLang: Language = 'en';

/** English is the default language at `/`; French lives under `/fr/`. */
export function getLangFromUrl(url: URL): Language {
  const [, first] = url.pathname.split('/');
  return first === 'fr' ? 'fr' : 'en';
}

/** Localized URL path: ('fr', 'notes') -> /fr/notes, ('en', 'notes') -> /notes. */
export function getRelativeLocaleUrl(locale: Language, path: string = ''): string {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return locale === 'fr' ? `/fr/${cleanPath}` : `/${cleanPath}`;
}

/** Translation lookup with fallback to English. */
export function useTranslations(lang: Language) {
  return function t(key: TranslationKey): string {
    const dict = ui as Record<Language, Record<string, string>>;
    return dict[lang][key] || dict.en[key] || key;
  };
}

/** Maps a path to its counterpart in the other language: /x <-> /fr/x. */
export function alternatePath(pathname: string): string {
  if (pathname === '/fr' || pathname === '/fr/') return '/';
  if (pathname.startsWith('/fr/')) return pathname.slice(3);
  return pathname === '/' ? '/fr/' : `/fr${pathname}`;
}

// Get opposite language for language switcher
export function getOppositeLanguage(currentLang: Language): Language {
  return currentLang === 'fr' ? 'en' : 'fr';
}

// Get language display name
export function getLanguageName(lang: Language): string {
  return lang === 'fr' ? 'Français' : 'English';
}
