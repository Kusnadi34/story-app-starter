import { configureLocalization } from '@lit/localize';
import { sourceLocale, targetLocales } from '../generated/locale-codes';

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
