import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppLocale } from '../hooks/useAppLocale';
import { AppColors } from '../theme/colors';
import { elevation, radius, spacing, typography } from '../theme/tokens';
import { CurrencyCode, CurrencyConfig } from '../types';
import { getCurrencyName } from '../utils/currencyName';
import { formatCrossAmount, getCardConversionRows } from '../utils/crossRate';

interface CurrencyCardProps {
  currency: CurrencyConfig;
  krwPerUnit: Partial<Record<CurrencyCode, number>>;
  colors: AppColors;
  amountText: string;
  inputDisplayText: string;
  conversionAmount: number | null;
  isCalculatorTarget: boolean;
  isCalculatorSessionActive: boolean;
  onInputFocus?: () => void;
  onResetAmount?: () => void;
}

export function CurrencyCard({
  currency,
  krwPerUnit,
  colors,
  amountText,
  inputDisplayText,
  conversionAmount,
  isCalculatorTarget,
  isCalculatorSessionActive,
  onInputFocus,
  onResetAmount,
}: CurrencyCardProps) {
  const { t } = useTranslation();
  const { locale } = useAppLocale();
  const currencyName = getCurrencyName(t, currency.code);
  const styles = useMemo(() => createStyles(colors), [colors]);
  const showTapHint =
    !isCalculatorSessionActive && !isCalculatorTarget && inputDisplayText.trim() === '';
  const displayValue = showTapHint ? t('calculator.tapToEnter') : inputDisplayText || '0';
  const conversionRows = useMemo(
    () => getCardConversionRows(currency.code, conversionAmount, krwPerUnit),
    [currency.code, conversionAmount, krwPerUnit],
  );

  const resetAmount = () => {
    onResetAmount?.();
  };

  const handleAmountPress = () => {
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
        <Pressable
          onPress={handleAmountPress}
          accessibilityRole="button"
          accessibilityLabel={t('card.amountInputA11y', { name: currencyName })}
          accessibilityHint={t('calculator.tapToEnter')}
        >
          <View
            style={[
              styles.amountInputRow,
              isCalculatorSessionActive && !isCalculatorTarget
                ? {
                    backgroundColor: colors.background,
                    borderColor:
                      colors.cardBorder === 'transparent' ? '#E2E8F0' : colors.cardBorder,
                  }
                : {
                    backgroundColor: colors.accentSoft,
                    borderColor: colors.accentBorder,
                  },
              isCalculatorTarget ? styles.amountInputRowActive : null,
            ]}
          >
            <Text style={[styles.inputSymbol, { color: colors.textSecondary }]}>{currency.symbol}</Text>
            <Text
              style={[
                styles.amountInput,
                { color: showTapHint ? colors.textMuted : colors.textPrimary },
              ]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {displayValue}
            </Text>
          </View>
        </Pressable>
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

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    card: {
      flex: 1,
      borderRadius: radius.lg,
      borderLeftWidth: 5,
      paddingHorizontal: spacing.lg + 2,
      paddingTop: spacing.sm + 2,
      paddingBottom: 0,
      ...elevation.card,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 0,
    },
    flag: {
      fontSize: 24,
      marginRight: spacing.sm + 2,
    },
    titleBlock: {
      flex: 1,
    },
    codeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.sm,
    },
    currencyCode: {
      fontSize: typography.bodySm.fontSize,
      fontWeight: '700',
      letterSpacing: 0.5,
    },
    currencyName: {
      marginTop: 0,
      fontSize: typography.caption.fontSize,
    },
    baseAmount: {
      fontSize: typography.titleSm.fontSize,
      fontWeight: '600',
    },
    converterBlock: {
      alignItems: 'flex-end',
      gap: spacing.xs,
      marginTop: -spacing.xs,
    },
    resultsBlock: {
      alignSelf: 'stretch',
      gap: 2,
    },
    resultRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      justifyContent: 'flex-end',
      gap: spacing.sm + 2,
    },
    resultLabel: {
      fontSize: typography.caption.fontSize + 1,
      fontWeight: '600',
      minWidth: 28,
      textAlign: 'right',
    },
    amountInputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      minWidth: 140,
      paddingLeft: spacing.md,
      paddingRight: spacing.xs,
      paddingVertical: spacing.sm,
      borderRadius: radius.sm,
      borderWidth: 1,
    },
    amountInputRowActive: {
      borderWidth: 1.5,
    },
    inputSymbol: {
      fontSize: typography.titleSm.fontSize,
      fontWeight: '600',
      marginRight: spacing.xs,
    },
    amountInput: {
      flex: 1,
      minWidth: 88,
      paddingVertical: 0,
      paddingHorizontal: spacing.sm,
      fontSize: typography.titleSm.fontSize,
      fontWeight: '600',
      textAlign: 'right',
    },
    primaryValue: {
      ...typography.display,
      textAlign: 'right',
    },
    secondaryValue: {
      fontSize: typography.titleSm.fontSize,
      fontWeight: '700',
      letterSpacing: -0.3,
      textAlign: 'right',
    },
  });
}
