import { configureLocalization } from '@lit/localize';
// Gunakan import dinamis untuk menghindari error jika file belum ada
import type { sourceLocale, targetLocales } from '../generated/locale-codes';

// Fallback jika file generated belum ada
let sourceLocale = 'en';
let targetLocales: string[] = ['id'];

try {
  const codes = await import('../generated/locale-codes');
  sourceLocale = codes.sourceLocale;
  targetLocales = codes.targetLocales;
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
