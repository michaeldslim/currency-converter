import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { applyCalendarLocale } from './calendarLocales';
import en from './locales/en.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';

export type AppLanguage = 'en' | 'ko' | 'ja';

export const APP_LOCALE_BCP47: Record<AppLanguage, string> = {
  en: 'en-US',
  ko: 'ko-KR',
  ja: 'ja-JP',
};

const resources = {
  en: { translation: en },
  ko: { translation: ko },
  ja: { translation: ja },
};

export function resolveAppLanguage(languageCode?: string | null): AppLanguage {
  const code = (languageCode ?? 'en').toLowerCase().split('-')[0];

  if (code === 'ko' || code === 'ja' || code === 'en') {
    return code;
  }

  return 'en';
}

export function getDeviceLanguage(): AppLanguage {
  return resolveAppLanguage(getLocales()[0]?.languageCode);
}

export function getAppLocaleBcp47(language?: string): string {
  return APP_LOCALE_BCP47[resolveAppLanguage(language ?? i18n.language)];
}

export async function changeAppLanguage(language: AppLanguage): Promise<void> {
  await i18n.changeLanguage(language);
  applyCalendarLocale(language);
}

const initialLanguage = getDeviceLanguage();

void i18n.use(initReactI18next).init({
  resources,
  lng: initialLanguage,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: 'v4',
});

applyCalendarLocale(initialLanguage);

export default i18n;
