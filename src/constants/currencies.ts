import { CurrencyConfig } from '../types';

export const CURRENCIES: CurrencyConfig[] = [
  {
    code: 'USD',
    nameKo: '미국 달러',
    nameEn: 'US Dollar',
    symbol: '$',
    displayAmount: 1,
    displayLabel: '$1',
    accentColor: '#2563EB',
    flag: '🇺🇸',
  },
  {
    code: 'JPY',
    nameKo: '일본 엔',
    nameEn: 'Japanese Yen',
    symbol: '¥',
    displayAmount: 100,
    displayLabel: '¥100',
    accentColor: '#DC2626',
    flag: '🇯🇵',
  },
];
