import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { AppColors } from '../theme/colors';
import { CurrencyConfig } from '../types';
import { getCurrencyName } from '../utils/currencyName';

interface CurrencyCardUnavailableProps {
  currency: CurrencyConfig;
  colors: AppColors;
}

export function CurrencyCardUnavailable({ currency, colors }: CurrencyCardUnavailableProps) {
  const { t } = useTranslation();
  const currencyName = getCurrencyName(t, currency.code);

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
          <Text style={[styles.currencyName, { color: colors.textMuted }]}>{currencyName}</Text>
        </View>
      </View>
      <Text style={[styles.message, { color: colors.textMuted }]}>
        {t('card.rateUnavailable', { name: currencyName })}
      </Text>
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
    paddingBottom: 0,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
  message: {
    marginTop: 16,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
});
