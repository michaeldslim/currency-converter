import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { AppColors } from '../theme/colors';
import { CurrencyConfig } from '../types';
import { formatKrw, parseAmountInput } from '../utils/formatCurrency';

interface CurrencyCardProps {
  currency: CurrencyConfig;
  krwPerUnit: number;
  colors: AppColors;
  onInputFocus?: () => void;
  inputResetVersion?: number;
}

export function CurrencyCard({
  currency,
  krwPerUnit,
  colors,
  onInputFocus,
  inputResetVersion = 0,
}: CurrencyCardProps) {
  const [amountText, setAmountText] = useState(String(currency.displayAmount));

  useEffect(() => {
    setAmountText(String(currency.displayAmount));
  }, [currency.code, currency.displayAmount, inputResetVersion]);

  const parsedAmount = useMemo(() => parseAmountInput(amountText), [amountText]);
  const convertedKrw = parsedAmount !== null ? parsedAmount * krwPerUnit : null;

  const handleInputFocus = () => {
    setAmountText('');
    onInputFocus?.();
  };

  return (
    <View
      style={[
        styles.card,
        {
          borderLeftColor: currency.accentColor,
          backgroundColor: colors.card,
          shadowColor: colors.shadow,
        },
      ]}
    >
      <View style={styles.headerRow}>
        <Text style={styles.flag}>{currency.flag}</Text>
        <View style={styles.titleBlock}>
          <View style={styles.codeRow}>
            <Text style={[styles.currencyCode, { color: colors.textPrimary }]}>{currency.code}</Text>
            <Text style={[styles.baseAmount, { color: colors.textSecondary }]}>
              {currency.displayLabel}
            </Text>
          </View>
          <Text style={[styles.currencyName, { color: colors.textMuted }]}>{currency.nameKo}</Text>
        </View>
      </View>

      <View style={styles.converterBlock}>
        <TextInput
          style={[
            styles.amountInput,
            {
              color: colors.textPrimary,
              backgroundColor: colors.accentSoft,
              borderColor: colors.accentBorder,
            },
          ]}
          value={amountText}
          onChangeText={setAmountText}
          onFocus={handleInputFocus}
          keyboardType="numeric"
          inputMode="decimal"
          textAlign="right"
          placeholder="0"
          placeholderTextColor={colors.textMuted}
          accessibilityLabel={`${currency.nameKo} 금액 입력`}
        />
        <Text style={[styles.krwValue, { color: colors.textPrimary }]}>
          {convertedKrw !== null ? formatKrw(convertedKrw) : '—'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 20,
    borderLeftWidth: 5,
    paddingHorizontal: 18,
    paddingVertical: 12,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  flag: {
    fontSize: 22,
    marginRight: 10,
  },
  titleBlock: {
    flex: 1,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  currencyCode: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  currencyName: {
    marginTop: 2,
    fontSize: 12,
  },
  baseAmount: {
    fontSize: 18,
    fontWeight: '600',
  },
  converterBlock: {
    alignItems: 'flex-end',
    gap: 6,
  },
  amountInput: {
    minWidth: 132,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 18,
    fontWeight: '600',
  },
  krwValue: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
    textAlign: 'right',
  },
});
