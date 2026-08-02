import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useAppLocale } from '../hooks/useAppLocale';
import { AppColors } from '../theme/colors';
import { CurrencyCode, CurrencyConfig } from '../types';
import { getCurrencyName } from '../utils/currencyName';
import { formatCrossAmount, getCardConversionRows } from '../utils/crossRate';
import { parseAmountInput } from '../utils/formatCurrency';

interface CurrencyCardProps {
  currency: CurrencyConfig;
  krwPerUnit: Partial<Record<CurrencyCode, number>>;
  colors: AppColors;
  onInputFocus?: () => void;
}

export function CurrencyCard({
  currency,
  krwPerUnit,
  colors,
  onInputFocus,
}: CurrencyCardProps) {
  const { t } = useTranslation();
  const { locale } = useAppLocale();
  const currencyName = getCurrencyName(t, currency.code);
  const inputRef = useRef<TextInput>(null);
  const [amountText, setAmountText] = useState(String(currency.displayAmount));

  useEffect(() => {
    setAmountText(String(currency.displayAmount));
  }, [currency.code, currency.displayAmount]);

  const parsedAmount = useMemo(() => parseAmountInput(amountText), [amountText]);
  const conversionRows = useMemo(
    () => getCardConversionRows(currency.code, parsedAmount, krwPerUnit),
    [currency.code, parsedAmount, krwPerUnit],
  );

  const resetAmount = () => {
    inputRef.current?.blur();
    setAmountText(String(currency.displayAmount));
  };

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
      <Pressable onPress={resetAmount}>
        <View style={styles.headerRow}>
          <Text style={styles.flag}>{currency.flag}</Text>
          <View style={styles.titleBlock}>
            <View style={styles.codeRow}>
              <Text style={[styles.currencyCode, { color: colors.textPrimary }]}>{currency.code}</Text>
              <Text style={[styles.baseAmount, { color: colors.textSecondary }]}>
                {currency.displayLabel}
              </Text>
            </View>
            <Text style={[styles.currencyName, { color: colors.textMuted }]}>{currencyName}</Text>
          </View>
        </View>
      </Pressable>

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
            ref={inputRef}
            style={[styles.amountInput, { color: colors.textPrimary }]}
            value={amountText}
            onChangeText={setAmountText}
            onFocus={handleInputFocus}
            keyboardType="numeric"
            inputMode="decimal"
            textAlign="right"
            placeholder="0"
            placeholderTextColor={colors.textMuted}
            accessibilityLabel={t('card.amountInputA11y', { name: currencyName })}
          />
        </View>
        <Pressable onPress={resetAmount}>
          <View style={styles.resultsBlock}>
            {conversionRows.map((row) => (
              <View key={row.labelKey} style={styles.resultRow}>
                <Text style={[styles.resultLabel, { color: colors.textMuted }]}>{t(row.labelKey)}</Text>
                <Text
                  style={[
                    row.emphasized ? styles.primaryValue : styles.secondaryValue,
                    { color: row.emphasized ? colors.textPrimary : colors.textSecondary },
                  ]}
                >
                  {row.value !== null ? formatCrossAmount(row.targetCode, row.value, locale) : '—'}
                </Text>
              </View>
            ))}
          </View>
        </Pressable>
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
  primaryValue: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
    textAlign: 'right',
  },
  secondaryValue: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
    textAlign: 'right',
  },
});
