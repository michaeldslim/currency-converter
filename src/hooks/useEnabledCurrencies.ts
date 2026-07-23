import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  DEFAULT_OPTIONAL_PREFERENCES,
  getEnabledCurrencies,
} from '../constants/currencies';
import { CurrencyConfig, OptionalCurrencyCode, OptionalCurrencyPreferences } from '../types';

const STORAGE_KEY = 'currency-converter:optional-currencies';

function parseStoredPreferences(raw: string | null): OptionalCurrencyPreferences {
  if (!raw) {
    return { ...DEFAULT_OPTIONAL_PREFERENCES };
  }

  try {
    const parsed = JSON.parse(raw) as Partial<OptionalCurrencyPreferences>;
    return {
      EUR: parsed.EUR === true,
    };
  } catch {
    return { ...DEFAULT_OPTIONAL_PREFERENCES };
  }
}

interface UseEnabledCurrenciesResult {
  enabledCurrencies: CurrencyConfig[];
  optionalPreferences: OptionalCurrencyPreferences;
  preferencesReady: boolean;
  setOptionalCurrencyEnabled: (code: OptionalCurrencyCode, enabled: boolean) => Promise<void>;
}

export function useEnabledCurrencies(): UseEnabledCurrenciesResult {
  const [optionalPreferences, setOptionalPreferences] = useState<OptionalCurrencyPreferences>({
    ...DEFAULT_OPTIONAL_PREFERENCES,
  });
  const [preferencesReady, setPreferencesReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (cancelled) {
        return;
      }

      setOptionalPreferences(parseStoredPreferences(stored));
      setPreferencesReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const setOptionalCurrencyEnabled = useCallback(
    async (code: OptionalCurrencyCode, enabled: boolean) => {
      const nextPreferences: OptionalCurrencyPreferences = {
        ...optionalPreferences,
        [code]: enabled,
      };

      setOptionalPreferences(nextPreferences);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextPreferences));
    },
    [optionalPreferences],
  );

  const enabledCurrencies = useMemo(
    () => getEnabledCurrencies(optionalPreferences),
    [optionalPreferences],
  );

  return {
    enabledCurrencies,
    optionalPreferences,
    preferencesReady,
    setOptionalCurrencyEnabled,
  };
}
