import AsyncStorage from '@react-native-async-storage/async-storage';

import { ExchangeRates, ForeignCurrencyCode } from '../types';

const STORAGE_KEY = 'currency-converter:rate-cache';

export interface RateCacheEntry {
  rates: ExchangeRates;
  lastFetchedAt: string;
  currencyCodes: ForeignCurrencyCode[];
}

function isForeignCurrencyCode(value: string): value is ForeignCurrencyCode {
  return value === 'USD' || value === 'JPY' || value === 'EUR';
}

function isValidKrwPerUnit(value: unknown): value is ExchangeRates['krwPerUnit'] {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  return Object.entries(value).every(([code, rate]) => {
    return (
      (code === 'USD' || code === 'JPY' || code === 'EUR' || code === 'KRW') &&
      typeof rate === 'number' &&
      rate > 0
    );
  });
}

function parseRateCacheEntry(raw: string | null): RateCacheEntry | null {
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<RateCacheEntry>;
    if (
      typeof parsed.lastFetchedAt !== 'string' ||
      !parsed.rates ||
      typeof parsed.rates.date !== 'string' ||
      !isValidKrwPerUnit(parsed.rates.krwPerUnit) ||
      !Array.isArray(parsed.currencyCodes) ||
      !parsed.currencyCodes.every(isForeignCurrencyCode)
    ) {
      return null;
    }

    return {
      rates: {
        date: parsed.rates.date,
        krwPerUnit: parsed.rates.krwPerUnit,
      },
      lastFetchedAt: parsed.lastFetchedAt,
      currencyCodes: parsed.currencyCodes,
    };
  } catch {
    return null;
  }
}

export async function loadRateCache(): Promise<RateCacheEntry | null> {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  return parseRateCacheEntry(stored);
}

export async function saveRateCache(
  rates: ExchangeRates,
  lastFetchedAt: Date,
  currencyCodes: ForeignCurrencyCode[],
): Promise<void> {
  const entry: RateCacheEntry = {
    rates,
    lastFetchedAt: lastFetchedAt.toISOString(),
    currencyCodes,
  };

  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entry));
}
