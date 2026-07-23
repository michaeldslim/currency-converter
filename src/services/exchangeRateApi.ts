import { CURRENCIES } from '../constants/currencies';
import { CurrencyCode, ExchangeRates } from '../types';

interface FrankfurterResponse {
  amount: number;
  base: 'KRW';
  date: string;
  rates: Partial<Record<CurrencyCode, number>>;
}

const SYMBOLS = CURRENCIES.map((currency) => currency.code).join(',');

function buildApiUrl(date?: string): string {
  if (date) {
    return `https://api.frankfurter.app/${date}?from=KRW&to=${SYMBOLS}`;
  }
  return `https://api.frankfurter.app/latest?from=KRW&to=${SYMBOLS}`;
}

export async function fetchExchangeRates(date?: string): Promise<ExchangeRates> {
  const response = await fetch(buildApiUrl(date));

  if (!response.ok) {
    throw new Error(`환율 API 요청 실패 (${response.status})`);
  }

  const data = (await response.json()) as FrankfurterResponse;
  const krwPerUnit = {} as Record<CurrencyCode, number>;

  for (const currency of CURRENCIES) {
    const krwToForeign = data.rates[currency.code];

    if (!krwToForeign || krwToForeign <= 0) {
      throw new Error(`${currency.code} 환율 데이터를 불러오지 못했습니다.`);
    }

    krwPerUnit[currency.code] = 1 / krwToForeign;
  }

  return {
    date: data.date,
    krwPerUnit,
  };
}
