import { CurrencyCode } from '../types';

import { formatKrw } from './formatCurrency';

export interface CardConversionRow {
  labelKey: string;
  targetCode: CurrencyCode;
  value: number | null;
  emphasized: boolean;
}

/** Foreign amount → another foreign currency via KRW triangulation. */
export function convertCrossForeign(
  amount: number,
  fromKrwPerUnit: number,
  toKrwPerUnit: number,
): number {
  return (amount * fromKrwPerUnit) / toKrwPerUnit;
}

/** KRW amount → foreign currency. */
export function convertKrwToForeign(krwAmount: number, krwPerUnit: number): number {
  return krwAmount / krwPerUnit;
}

export function formatUsd(value: number, locale = 'ko-KR'): string {
  const fractionDigits = value >= 1 ? 2 : 4;
  return `$ ${value.toLocaleString(locale, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })}`;
}

export function formatJpy(value: number, locale = 'ko-KR'): string {
  return `¥ ${Math.round(value).toLocaleString(locale)}`;
}

export function formatCrossAmount(code: CurrencyCode, value: number, locale = 'ko-KR'): string {
  switch (code) {
    case 'KRW':
      return formatKrw(value, locale);
    case 'USD':
      return formatUsd(value, locale);
    case 'JPY':
      return formatJpy(value, locale);
    case 'EUR':
      return `€ ${value.toLocaleString(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
  }
}

function buildRow(
  labelKey: string,
  targetCode: CurrencyCode,
  value: number | null,
  emphasized: boolean,
): CardConversionRow {
  return { labelKey, targetCode, value, emphasized };
}

export function getCardConversionRows(
  currencyCode: CurrencyCode,
  amount: number | null,
  krwPerUnit: Partial<Record<CurrencyCode, number>>,
): CardConversionRow[] {
  const usdRate = krwPerUnit.USD;
  const jpyRate = krwPerUnit.JPY;
  const eurRate = krwPerUnit.EUR;

  switch (currencyCode) {
    case 'USD': {
      const rows: CardConversionRow[] = [];
      if (usdRate !== undefined) {
        rows.push(
          buildRow('row.krw', 'KRW', amount !== null ? amount * usdRate : null, true),
        );
      }
      if (usdRate !== undefined && jpyRate !== undefined) {
        rows.push(
          buildRow(
            'row.jpy',
            'JPY',
            amount !== null ? convertCrossForeign(amount, usdRate, jpyRate) : null,
            false,
          ),
        );
      }
      return rows;
    }
    case 'JPY': {
      const rows: CardConversionRow[] = [];
      if (jpyRate !== undefined) {
        rows.push(
          buildRow('row.krw', 'KRW', amount !== null ? amount * jpyRate : null, true),
        );
      }
      if (usdRate !== undefined && jpyRate !== undefined) {
        rows.push(
          buildRow(
            'row.usd',
            'USD',
            amount !== null ? convertCrossForeign(amount, jpyRate, usdRate) : null,
            false,
          ),
        );
      }
      return rows;
    }
    case 'KRW': {
      const rows: CardConversionRow[] = [];
      if (usdRate !== undefined) {
        rows.push(
          buildRow(
            'row.usd',
            'USD',
            amount !== null ? convertKrwToForeign(amount, usdRate) : null,
            true,
          ),
        );
      }
      if (jpyRate !== undefined) {
        rows.push(
          buildRow(
            'row.jpy',
            'JPY',
            amount !== null ? convertKrwToForeign(amount, jpyRate) : null,
            false,
          ),
        );
      }
      return rows;
    }
    case 'EUR':
      if (eurRate === undefined) {
        return [];
      }
      return [
        buildRow('row.krw', 'KRW', amount !== null ? amount * eurRate : null, true),
      ];
  }
}
