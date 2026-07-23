import { StyleSheet, View } from 'react-native';

import { AppColors } from '../theme/colors';
import { CurrencyConfig } from '../types';

import { SkeletonBone } from './SkeletonBone';

interface CurrencyCardSkeletonProps {
  currency: CurrencyConfig;
  colors: AppColors;
}

export function CurrencyCardSkeleton({ currency, colors }: CurrencyCardSkeletonProps) {
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
        <SkeletonBone colors={colors} style={styles.flag} />
        <View style={styles.titleBlock}>
          <SkeletonBone colors={colors} style={styles.codeBone} />
          <SkeletonBone colors={colors} style={styles.nameBone} />
        </View>
      </View>
      <SkeletonBone colors={colors} style={styles.amountBone} />
      <SkeletonBone colors={colors} style={styles.valueBone} />
      <SkeletonBone colors={colors} style={styles.captionBone} />
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
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  titleBlock: {
    flex: 1,
    gap: 6,
  },
  codeBone: {
    width: 48,
    height: 16,
  },
  nameBone: {
    width: 88,
    height: 14,
  },
  amountBone: {
    width: 72,
    height: 24,
    marginBottom: 8,
  },
  valueBone: {
    width: 160,
    height: 34,
  },
  captionBone: {
    width: 120,
    height: 12,
    marginTop: 10,
  },
});
