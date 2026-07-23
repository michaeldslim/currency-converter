import { CurrencyCode, ExchangeRates } from '../types';

interface FrankfurterResponse {
  amount: number;
  base: 'KRW';
  date: string;
  rates: Partial<Record<CurrencyCode, number>>;
}

function buildApiUrl(currencyCodes: CurrencyCode[], date?: string): string {
  const symbols = currencyCodes.join(',');
  if (date) {
    return `https://api.frankfurter.app/${date}?from=KRW&to=${symbols}`;
  }
  return `https://api.frankfurter.app/latest?from=KRW&to=${symbols}`;
}

export async function fetchExchangeRates(
  currencyCodes: CurrencyCode[],
  date?: string,
): Promise<ExchangeRates> {
  if (currencyCodes.length === 0) {
    throw new Error('표시할 통화가 없습니다.');
  }

  const response = await fetch(buildApiUrl(currencyCodes, date));

  if (!response.ok) {
    throw new Error(`환율 API 요청 실패 (${response.status})`);
  }

  const data = (await response.json()) as FrankfurterResponse;
  const krwPerUnit: Partial<Record<CurrencyCode, number>> = {};

  for (const code of currencyCodes) {
    const krwToForeign = data.rates[code];

    if (!krwToForeign || krwToForeign <= 0) {
      throw new Error(`${code} 환율 데이터를 불러오지 못했습니다.`);
    }

    krwPerUnit[code] = 1 / krwToForeign;
  }

  return {
    date: data.date,
    krwPerUnit,
  };
}
