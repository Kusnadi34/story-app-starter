import { configureLocalization } from '@lit/localize';

// Default fallback jika file generated belum ada
const defaultSourceLocale = 'en';
const defaultTargetLocales = ['id'];
const defaultAllLocales = ['en', 'id'];

let sourceLocale = defaultSourceLocale;
let targetLocales = defaultTargetLocales;
let allLocales = defaultAllLocales;

// Coba load generated codes (akan ada setelah build:locales dijalankan)
try {
  const codes = await import('../generated/locale-codes');
  sourceLocale = codes.sourceLocale || defaultSourceLocale;
  targetLocales = codes.targetLocales || defaultTargetLocales;
  allLocales = codes.allLocales || defaultAllLocales;
} catch {
  console.warn('Locale codes not found, using defaults');
}

export const { getLocale, setLocale } = configureLocalization({
  sourceLocale,
  targetLocales,
  async loadLocale(locale: string) {
    return import(`../generated/locales/${locale}.js`);
  },
});

export const setLocaleFromUrl = async (): Promise<void> => {
  const url = new URL(window.location.href);
  const locale = url.searchParams.get('lang') || sourceLocale;
  await setLocale(locale);
};

export const localeNames: Record<string, string> = {
  en: 'English',
  id: 'Indonesia',
};

export { allLocales };
