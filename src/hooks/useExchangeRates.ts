import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { getRateFetchCodes } from '../constants/currencies';
import i18n from '../i18n';
import { ExchangeRateError, fetchExchangeRates } from '../services/exchangeRateApi';
import { loadRateCache, saveRateCache } from '../services/rateCache';
import { CurrencyConfig, ExchangeRates } from '../types';
import { playRefreshSuccessHaptic } from '../utils/haptics';
import { getTodayIso, isRateDateSelectable, resolveLatestFetchDate } from '../utils/rateCalendar';

import { useLocalToday } from './useLocalToday';
import { useNetworkStatus } from './useNetworkStatus';

interface UseExchangeRatesOptions {
  enabledCurrencies: CurrencyConfig[];
  preferencesReady: boolean;
}

interface UseExchangeRatesResult {
  rates: ExchangeRates | null;
  selectedDate: string | null;
  lastFetchedAt: Date | null;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  isOffline: boolean;
  isUsingCachedRates: boolean;
  needsTodayRefresh: boolean;
  refresh: () => Promise<void>;
  selectDate: (isoDate: string) => Promise<void>;
  resetToLatest: () => Promise<void>;
}

function applyCachedRates(
  cache: Awaited<ReturnType<typeof loadRateCache>>,
): { rates: ExchangeRates; lastFetchedAt: Date } | null {
  if (!cache) {
    return null;
  }

  return {
    rates: cache.rates,
    lastFetchedAt: new Date(cache.lastFetchedAt),
  };
}

export function useExchangeRates({
  enabledCurrencies,
  preferencesReady,
}: UseExchangeRatesOptions): UseExchangeRatesResult {
  const today = useLocalToday();
  const { isConnected, networkReady } = useNetworkStatus();
  const [rates, setRates] = useState<ExchangeRates | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [lastTodayRefreshDate, setLastTodayRefreshDate] = useState<string | null>(null);
  const [lastFetchedAt, setLastFetchedAt] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [isUsingCachedRates, setIsUsingCachedRates] = useState(false);
  const hasLoadedRef = useRef(false);
  const selectedDateRef = useRef<string | null>(null);
  const wasOfflineRef = useRef(false);

  const currencyCodes = useMemo(
    () => getRateFetchCodes(enabledCurrencies),
    [enabledCurrencies],
  );
  const currencyCodesKey = currencyCodes.join(',');

  const applyCacheFallback = useCallback(async (): Promise<boolean> => {
    const cached = applyCachedRates(await loadRateCache());
    if (!cached) {
      return false;
    }

    setRates(cached.rates);
    setLastFetchedAt(cached.lastFetchedAt);
    setError(null);
    setIsUsingCachedRates(true);
    hasLoadedRef.current = true;
    return true;
  }, []);

  const loadRates = useCallback(
    async (date: string | null, showInitialLoader: boolean) => {
      const shouldCelebrate = hasLoadedRef.current && !showInitialLoader;

      if (showInitialLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setIsOffline(!isConnected);

      if (!isConnected) {
        const usedCache = await applyCacheFallback();
        if (!usedCache) {
          setError(i18n.t('errors.noCachedRates'));
        }

        setLoading(false);
        setRefreshing(false);
        return;
      }

      try {
        const requestDate = date !== null ? date : resolveLatestFetchDate();
        const nextRates = await fetchExchangeRates(currencyCodes, requestDate);
        const fetchedAt = new Date();

        setRates(nextRates);
        setError(null);
        setLastFetchedAt(fetchedAt);
        setIsUsingCachedRates(false);
        setIsOffline(false);
        hasLoadedRef.current = true;

        await saveRateCache(nextRates, fetchedAt, currencyCodes);

        if (date === null) {
          setLastTodayRefreshDate(getTodayIso());
        }

        if (shouldCelebrate) {
          void playRefreshSuccessHaptic();
        }
      } catch (err) {
        const usedCache = await applyCacheFallback();

        if (usedCache) {
          setIsOffline(false);
          setError(null);
        } else if (err instanceof ExchangeRateError) {
          setError(i18n.t(err.key, err.params));
        } else {
          setError(i18n.t('errors.fetchFailed'));
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [applyCacheFallback, currencyCodes, isConnected],
  );

  const refresh = useCallback(async () => {
    const isInitialLoad = !hasLoadedRef.current;
    await loadRates(selectedDateRef.current, isInitialLoad);
  }, [loadRates]);

  const resetToLatest = useCallback(async () => {
    if (!isConnected) {
      setIsOffline(true);
      setError(i18n.t('errors.offlineCannotRefresh'));
      return;
    }

    selectedDateRef.current = null;
    setSelectedDate(null);
    await loadRates(null, false);
  }, [isConnected, loadRates]);

  const selectDate = useCallback(
    async (isoDate: string) => {
      if (!isRateDateSelectable(isoDate)) {
        return;
      }

      if (!isConnected) {
        setIsOffline(true);
        setError(i18n.t('errors.offlineCannotChangeDate'));
        return;
      }

      if (isoDate === getTodayIso()) {
        await resetToLatest();
        return;
      }

      selectedDateRef.current = isoDate;
      setSelectedDate(isoDate);
      await loadRates(isoDate, false);
    },
    [isConnected, loadRates, resetToLatest],
  );

  useEffect(() => {
    if (!preferencesReady || currencyCodesKey.length === 0 || !networkReady) {
      return;
    }

    const isInitialLoad = !hasLoadedRef.current;
    void loadRates(selectedDateRef.current, isInitialLoad);
  }, [preferencesReady, currencyCodesKey, loadRates, networkReady]);

  useEffect(() => {
    if (!networkReady || !preferencesReady || currencyCodesKey.length === 0) {
      return;
    }

    if (!isConnected) {
      wasOfflineRef.current = true;
      setIsOffline(true);
      return;
    }

    if (wasOfflineRef.current && hasLoadedRef.current) {
      wasOfflineRef.current = false;
      void loadRates(selectedDateRef.current, false);
      return;
    }

    wasOfflineRef.current = false;
    setIsOffline(false);
  }, [currencyCodesKey, isConnected, loadRates, networkReady, preferencesReady]);

  const needsTodayRefresh =
    selectedDate === null &&
    lastTodayRefreshDate !== null &&
    today > lastTodayRefreshDate &&
    !isOffline &&
    !isUsingCachedRates;

  return {
    rates,
    selectedDate,
    lastFetchedAt,
    loading,
    refreshing,
    error,
    isOffline,
    isUsingCachedRates,
    needsTodayRefresh,
    refresh,
    selectDate,
    resetToLatest,
  };
}
