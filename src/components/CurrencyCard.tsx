import { StyleSheet, Text, View } from 'react-native';

import { AppColors } from '../theme/colors';
import { CurrencyConfig } from '../types';
import { formatKrw } from '../utils/formatCurrency';

interface CurrencyCardProps {
  currency: CurrencyConfig;
  krwPerUnit: number;
  colors: AppColors;
}

export function CurrencyCard({ currency, krwPerUnit, colors }: CurrencyCardProps) {
  const krwValue = krwPerUnit * currency.displayAmount;

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

      <Text style={[styles.krwValue, { color: colors.textPrimary }]}>{formatKrw(krwValue)}</Text>
      <Text style={[styles.caption, { color: colors.textMuted }]}>기준 통화: 원화 (KRW)</Text>
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
    marginBottom: 6,
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
  krwValue: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  caption: {
    marginTop: 3,
    fontSize: 10,
  },
});
