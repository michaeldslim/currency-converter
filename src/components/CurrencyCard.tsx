import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { AppColors } from '../theme/colors';
import { CurrencyConfig } from '../types';
import { CrossConversion, convertCrossForeign, formatCrossAmount } from '../utils/crossRate';
import { formatKrw, parseAmountInput } from '../utils/formatCurrency';

interface CurrencyCardProps {
  currency: CurrencyConfig;
  krwPerUnit: number;
  crossConversion?: CrossConversion;
  colors: AppColors;
  onInputFocus?: () => void;
  inputResetVersion?: number;
}

export function CurrencyCard({
  currency,
  krwPerUnit,
  crossConversion,
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
  const convertedCross =
    parsedAmount !== null && crossConversion
      ? convertCrossForeign(parsedAmount, krwPerUnit, crossConversion.krwPerTarget)
      : null;

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
        <View
          style={[
            styles.amountInputRow,
            {
              backgroundColor: colors.accentSoft,
              borderColor: colors.accentBorder,
            },
          ]}
        >
          <Text style={[styles.inputSymbol, { color: colors.textSecondary }]}>{currency.symbol}</Text>
          <TextInput
            style={[styles.amountInput, { color: colors.textPrimary }]}
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
        </View>
        <View style={styles.resultsBlock}>
          <View style={styles.resultRow}>
            <Text style={[styles.resultLabel, { color: colors.textMuted }]}>원화</Text>
            <Text style={[styles.krwValue, { color: colors.textPrimary }]}>
              {convertedKrw !== null ? formatKrw(convertedKrw) : '—'}
            </Text>
          </View>
          {crossConversion ? (
            <View style={styles.resultRow}>
              <Text style={[styles.resultLabel, { color: colors.textMuted }]}>
                {crossConversion.labelKo}
              </Text>
              <Text style={[styles.crossValue, { color: colors.textSecondary }]}>
                {convertedCross !== null
                  ? formatCrossAmount(crossConversion.targetCode, convertedCross)
                  : '—'}
              </Text>
            </View>
          ) : null}
        </View>
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
    paddingTop: 10,
    paddingBottom: 12,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
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
    marginTop: 0,
    fontSize: 12,
  },
  baseAmount: {
    fontSize: 18,
    fontWeight: '600',
  },
  converterBlock: {
    alignItems: 'flex-end',
    gap: 4,
    marginTop: -4,
  },
  resultsBlock: {
    alignSelf: 'stretch',
    gap: 2,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'flex-end',
    gap: 10,
  },
  resultLabel: {
    fontSize: 12,
    fontWeight: '600',
    minWidth: 28,
    textAlign: 'right',
  },
  amountInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 132,
    paddingLeft: 12,
    paddingRight: 4,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  inputSymbol: {
    fontSize: 18,
    fontWeight: '600',
    marginRight: 4,
  },
  amountInput: {
    flex: 1,
    minWidth: 80,
    paddingVertical: 0,
    paddingHorizontal: 8,
    fontSize: 18,
    fontWeight: '600',
  },
  krwValue: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
    textAlign: 'right',
  },
  crossValue: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
    textAlign: 'right',
  },
});
