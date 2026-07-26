import { TFunction } from 'i18next';

import { CurrencyCode } from '../types';

export function getCurrencyNameKey(code: CurrencyCode): string {
  return `currency.${code.toLowerCase()}.name`;
}

export function getCurrencyName(t: TFunction, code: CurrencyCode): string {
  return t(getCurrencyNameKey(code));
}
