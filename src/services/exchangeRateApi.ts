import { CurrencyCode, ExchangeRates, ForeignCurrencyCode } from '../types';

interface FrankfurterResponse {
  amount: number;
  base: 'KRW';
  date: string;
  rates: Partial<Record<ForeignCurrencyCode, number>>;
}

export type ExchangeRateErrorKey =
  | 'errors.noCurrencies'
  | 'errors.apiRequestFailed'
  | 'errors.missingRate';

export class ExchangeRateError extends Error {
  constructor(
    readonly key: ExchangeRateErrorKey,
    readonly params?: Record<string, string | number>,
  ) {
    super(key);
    this.name = 'ExchangeRateError';
  }
}

function buildApiUrl(currencyCodes: ForeignCurrencyCode[], date?: string): string {
  const symbols = currencyCodes.join(',');
  if (date) {
    return `https://api.frankfurter.app/${date}?from=KRW&to=${symbols}`;
  }
  return `https://api.frankfurter.app/latest?from=KRW&to=${symbols}`;
}

export async function fetchExchangeRates(
  currencyCodes: ForeignCurrencyCode[],
  date?: string,
): Promise<ExchangeRates> {
  if (currencyCodes.length === 0) {
    throw new ExchangeRateError('errors.noCurrencies');
  }

  const response = await fetch(buildApiUrl(currencyCodes, date));

  if (!response.ok) {
    throw new ExchangeRateError('errors.apiRequestFailed', { status: response.status });
  }

  const data = (await response.json()) as FrankfurterResponse;
  const krwPerUnit: Partial<Record<CurrencyCode, number>> = {};

  for (const code of currencyCodes) {
    const krwToForeign = data.rates[code];

    if (!krwToForeign || krwToForeign <= 0) {
      throw new ExchangeRateError('errors.missingRate', { code });
    }

    krwPerUnit[code] = 1 / krwToForeign;
  }

  return {
    date: data.date,
    krwPerUnit,
  };
}
