import { useCallback, useEffect, useState } from 'react';

import { CurrencyConfig } from '../types';

export function useCardAmounts(enabledCurrencies: CurrencyConfig[]) {
  const [amountsByCode, setAmountsByCode] = useState<Record<string, string>>({});

  useEffect(() => {
    setAmountsByCode((previous) => {
      const next: Record<string, string> = {};
      for (const currency of enabledCurrencies) {
        next[currency.code] =
          previous[currency.code] ?? String(currency.displayAmount);
      }
      return next;
    });
  }, [enabledCurrencies]);

  const setAmountForCode = useCallback((code: string, amountText: string) => {
    setAmountsByCode((previous) => ({
      ...previous,
      [code]: amountText,
    }));
  }, []);

  const resetAmountForCurrency = useCallback((currency: CurrencyConfig) => {
    setAmountForCode(currency.code, String(currency.displayAmount));
  }, [setAmountForCode]);

  const resetAllAmountsToDefault = useCallback((allCurrencies: CurrencyConfig[]) => {
    setAmountsByCode(() => {
      const next: Record<string, string> = {};
      for (const item of allCurrencies) {
        next[item.code] = String(item.displayAmount);
      }
      return next;
    });
  }, []);

  /** Clears the focused card for entry; all other enabled cards revert to displayAmount. */
  const focusCardForEntry = useCallback(
    (currency: CurrencyConfig, allCurrencies: CurrencyConfig[]) => {
      setAmountsByCode(() => {
        const next: Record<string, string> = {};
        for (const item of allCurrencies) {
          next[item.code] =
            item.code === currency.code ? '' : String(item.displayAmount);
        }
        return next;
      });
    },
    [],
  );

  return {
    amountsByCode,
    setAmountForCode,
    resetAmountForCurrency,
    resetAllAmountsToDefault,
    focusCardForEntry,
  };
}
