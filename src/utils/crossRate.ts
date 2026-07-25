import { CurrencyCode } from '../types';

export interface CrossConversion {
  labelKo: string;
  targetCode: CurrencyCode;
  krwPerTarget: number;
}

/** Foreign amount → another foreign currency via KRW triangulation. */
export function convertCrossForeign(
  amount: number,
  fromKrwPerUnit: number,
  toKrwPerUnit: number,
): number {
  return (amount * fromKrwPerUnit) / toKrwPerUnit;
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

export function getCrossConversion(
  currencyCode: CurrencyCode,
  krwPerUnit: Partial<Record<CurrencyCode, number>>,
): CrossConversion | undefined {
  if (currencyCode === 'USD') {
    const jpyRate = krwPerUnit.JPY;
    if (jpyRate === undefined) {
      return undefined;
    }
    return { labelKo: '엔화', targetCode: 'JPY', krwPerTarget: jpyRate };
  }

  if (currencyCode === 'JPY') {
    const usdRate = krwPerUnit.USD;
    if (usdRate === undefined) {
      return undefined;
    }
    return { labelKo: '달러', targetCode: 'USD', krwPerTarget: usdRate };
  }

  return undefined;
}
