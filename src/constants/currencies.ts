import { CurrencyCode, CurrencyConfig, ForeignCurrencyCode, OptionalCurrencyCode, OptionalCurrencyPreferences } from '../types';

export const CORE_CURRENCY_CODES: CurrencyCode[] = ['USD', 'JPY'];

export const CURRENCY_REGISTRY: Record<CurrencyCode, CurrencyConfig> = {
  USD: {
    code: 'USD',
    nameKo: '미국 달러',
    nameEn: 'US Dollar',
    symbol: '$',
    displayAmount: 1,
    displayLabel: '$1',
    accentColor: '#2563EB',
    flag: '🇺🇸',
  },
  JPY: {
    code: 'JPY',
    nameKo: '일본 엔',
    nameEn: 'Japanese Yen',
    symbol: '¥',
    displayAmount: 100,
    displayLabel: '¥100',
    accentColor: '#DC2626',
    flag: '🇯🇵',
  },
  EUR: {
    code: 'EUR',
    nameKo: '유로',
    nameEn: 'Euro',
    symbol: '€',
    displayAmount: 1,
    displayLabel: '€1',
    accentColor: '#059669',
    flag: '🇪🇺',
  },
  KRW: {
    code: 'KRW',
    nameKo: '대한민국 원',
    nameEn: 'Korean Won',
    symbol: '₩',
    displayAmount: 1000,
    displayLabel: '₩1,000',
    accentColor: '#1E3A8A',
    flag: '🇰🇷',
  },
};

export const OPTIONAL_CURRENCY_CODES: OptionalCurrencyCode[] = ['KRW', 'EUR'];

export const DEFAULT_OPTIONAL_PREFERENCES: OptionalCurrencyPreferences = {
  KRW: false,
  EUR: false,
};

/** @deprecated Use getEnabledCurrencies() with user preferences. */
export const CURRENCIES: CurrencyConfig[] = CORE_CURRENCY_CODES.map((code) => CURRENCY_REGISTRY[code]);

export function getOptionalCurrencies(): Array<CurrencyConfig & { code: OptionalCurrencyCode }> {
  return OPTIONAL_CURRENCY_CODES.map((code) => CURRENCY_REGISTRY[code]) as Array<
    CurrencyConfig & { code: OptionalCurrencyCode }
  >;
}

export function getEnabledCurrencies(preferences: OptionalCurrencyPreferences): CurrencyConfig[] {
  const core = CORE_CURRENCY_CODES.map((code) => CURRENCY_REGISTRY[code]);
  const optional = OPTIONAL_CURRENCY_CODES.filter((code) => preferences[code]).map(
    (code) => CURRENCY_REGISTRY[code],
  );
  return [...core, ...optional];
}

export function getRateFetchCodes(enabledCurrencies: CurrencyConfig[]): ForeignCurrencyCode[] {
  const codes = new Set<ForeignCurrencyCode>(['USD', 'JPY']);

  for (const currency of enabledCurrencies) {
    if (currency.code !== 'KRW') {
      codes.add(currency.code);
    }
  }

  return [...codes];
}

export function isCardRatesReady(
  currencyCode: CurrencyCode,
  krwPerUnit: Partial<Record<CurrencyCode, number>>,
): boolean {
  if (currencyCode === 'KRW') {
    return krwPerUnit.USD !== undefined && krwPerUnit.JPY !== undefined;
  }

  return krwPerUnit[currencyCode] !== undefined;
}
