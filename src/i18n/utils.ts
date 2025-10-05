import { ui, type Language, type UIKeys } from './ui';

// Get language from URL pathname
export function getLangFromUrl(url: URL): Language {
  const [, lang] = url.pathname.split('/');
  if (lang === 'en') return 'en';
  return 'fr'; // Default to French
}

// Generate localized URL path
export function getRelativeLocaleUrl(locale: Language, path: string = ''): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  if (locale === 'fr') {
    return `/${cleanPath}`;
  }
  return `/en/${cleanPath}`;
}

// Type-safe translation function with fallback
export function useTranslations(lang: Language) {
  return function t(key: UIKeys): string {
    return ui[lang][key] || ui.fr[key] || key;
  };
}

// Get opposite language for language switcher
export function getOppositeLanguage(currentLang: Language): Language {
  return currentLang === 'fr' ? 'en' : 'fr';
}

// Get language display name
export function getLanguageName(lang: Language): string {
  return lang === 'fr' ? 'Français' : 'English';
}

// Get language flag emoji
export function getLanguageFlag(lang: Language): string {
  return lang === 'fr' ? '🇫🇷' : '🇬🇧';
}
