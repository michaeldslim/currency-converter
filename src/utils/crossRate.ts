import { CurrencyCode } from '../types';

import { formatKrw } from './formatCurrency';

export interface CardConversionRow {
  labelKo: string;
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

export function formatUsd(value: number): string {
  const fractionDigits = value >= 1 ? 2 : 4;
  return `$ ${value.toLocaleString('ko-KR', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })}`;
}

export function formatJpy(value: number): string {
  return `¥ ${Math.round(value).toLocaleString('ko-KR')}`;
}

export function formatCrossAmount(code: CurrencyCode, value: number): string {
  switch (code) {
    case 'KRW':
      return formatKrw(value);
    case 'USD':
      return formatUsd(value);
    case 'JPY':
      return formatJpy(value);
    case 'EUR':
      return `€ ${value.toLocaleString('ko-KR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
  }
}

function buildRow(
  labelKo: string,
  targetCode: CurrencyCode,
  value: number | null,
  emphasized: boolean,
): CardConversionRow {
  return { labelKo, targetCode, value, emphasized };
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
          buildRow('원화', 'KRW', amount !== null ? amount * usdRate : null, true),
        );
      }
      if (usdRate !== undefined && jpyRate !== undefined) {
        rows.push(
          buildRow(
            '엔화',
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
          buildRow('원화', 'KRW', amount !== null ? amount * jpyRate : null, true),
        );
      }
      if (usdRate !== undefined && jpyRate !== undefined) {
        rows.push(
          buildRow(
            '달러',
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
            '달러',
            'USD',
            amount !== null ? convertKrwToForeign(amount, usdRate) : null,
            true,
          ),
        );
      }
      if (jpyRate !== undefined) {
        rows.push(
          buildRow(
            '엔화',
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
        buildRow('원화', 'KRW', amount !== null ? amount * eurRate : null, true),
      ];
  }
}
