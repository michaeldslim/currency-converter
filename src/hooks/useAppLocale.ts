import { useEffect } from 'react';
import { AppState } from 'react-native';
import { useTranslation } from 'react-i18next';

import {
  APP_LOCALE_BCP47,
  AppLanguage,
  changeAppLanguage,
  getDeviceLanguage,
  resolveAppLanguage,
} from '../i18n';

export function useAppLocale() {
  const { i18n } = useTranslation();
  const language = resolveAppLanguage(i18n.language);
  const locale = APP_LOCALE_BCP47[language];

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState !== 'active') {
        return;
      }

      const deviceLanguage = getDeviceLanguage();
      if (deviceLanguage !== resolveAppLanguage(i18n.language)) {
        void changeAppLanguage(deviceLanguage);
      }
    });

    return () => subscription.remove();
  }, [i18n]);

  return { language, locale } satisfies { language: AppLanguage; locale: string };
}
