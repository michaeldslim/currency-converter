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
          <Text style={[styles.currencyCode, { color: colors.textPrimary }]}>{currency.code}</Text>
          <Text style={[styles.currencyName, { color: colors.textMuted }]}>{currency.nameKo}</Text>
        </View>
      </View>

      <Text style={[styles.baseAmount, { color: colors.textSecondary }]}>{currency.displayLabel}</Text>
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
    paddingHorizontal: 20,
    paddingVertical: 18,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  flag: {
    fontSize: 28,
    marginRight: 12,
  },
  titleBlock: {
    flex: 1,
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  currencyName: {
    marginTop: 2,
    fontSize: 14,
  },
  baseAmount: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 4,
  },
  krwValue: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  caption: {
    marginTop: 6,
    fontSize: 12,
  },
});
