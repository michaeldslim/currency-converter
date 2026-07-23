import { useCallback, useEffect, useRef, useState } from 'react';

import { fetchExchangeRates } from '../services/exchangeRateApi';
import { ExchangeRates } from '../types';
import { playRefreshSuccessHaptic } from '../utils/haptics';
import { getTodayIso, isRateDateSelectable } from '../utils/rateCalendar';

import { useLocalToday } from './useLocalToday';

interface UseExchangeRatesResult {
  rates: ExchangeRates | null;
  selectedDate: string | null;
  lastFetchedAt: Date | null;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  needsTodayRefresh: boolean;
  refresh: () => Promise<void>;
  selectDate: (isoDate: string) => Promise<void>;
  resetToLatest: () => Promise<void>;
}

export function useExchangeRates(): UseExchangeRatesResult {
  const today = useLocalToday();
  const [rates, setRates] = useState<ExchangeRates | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [lastTodayRefreshDate, setLastTodayRefreshDate] = useState<string | null>(null);
  const [lastFetchedAt, setLastFetchedAt] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasLoadedRef = useRef(false);
  const selectedDateRef = useRef<string | null>(null);

  const loadRates = useCallback(async (date: string | null, showInitialLoader: boolean) => {
    const shouldCelebrate = hasLoadedRef.current && !showInitialLoader;

    if (showInitialLoader) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    try {
      const nextRates = await fetchExchangeRates(date ?? undefined);
      setRates(nextRates);
      setError(null);
      setLastFetchedAt(new Date());
      hasLoadedRef.current = true;

      if (date === null) {
        setLastTodayRefreshDate(getTodayIso());
      }

      if (shouldCelebrate) {
        void playRefreshSuccessHaptic();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '환율을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    const isInitialLoad = !hasLoadedRef.current;
    await loadRates(selectedDateRef.current, isInitialLoad);
  }, [loadRates]);

  const selectDate = useCallback(
    async (isoDate: string) => {
      if (!isRateDateSelectable(isoDate)) {
        return;
      }

      selectedDateRef.current = isoDate;
      setSelectedDate(isoDate);
      await loadRates(isoDate, false);
    },
    [loadRates],
  );

  const resetToLatest = useCallback(async () => {
    selectedDateRef.current = null;
    setSelectedDate(null);
    await loadRates(null, false);
  }, [loadRates]);

  useEffect(() => {
    void loadRates(null, true);
  }, [loadRates]);

  const needsTodayRefresh =
    selectedDate === null &&
    lastTodayRefreshDate !== null &&
    today > lastTodayRefreshDate;

  return {
    rates,
    selectedDate,
    lastFetchedAt,
    loading,
    refreshing,
    error,
    needsTodayRefresh,
    refresh,
    selectDate,
    resetToLatest,
  };
}
