export type CurrencyCode = 'USD' | 'JPY' | 'EUR';

export type OptionalCurrencyCode = 'EUR';

export interface CurrencyConfig {
  code: CurrencyCode;
  nameKo: string;
  nameEn: string;
  symbol: string;
  /** Foreign-currency units shown on the card (e.g. 1 for $1, 100 for ¥100). */
  displayAmount: number;
  displayLabel: string;
  accentColor: string;
  flag: string;
}

export interface ExchangeRates {
  date: string;
  /** KRW per 1 unit of foreign currency. */
  krwPerUnit: Partial<Record<CurrencyCode, number>>;
}

export type OptionalCurrencyPreferences = Record<OptionalCurrencyCode, boolean>;
