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
          <View style={styles.codeRow}>
            <SkeletonBone colors={colors} style={styles.codeBone} />
            <SkeletonBone colors={colors} style={styles.amountBone} />
          </View>
          <SkeletonBone colors={colors} style={styles.nameBone} />
        </View>
      </View>
      <View style={styles.converterBlock}>
        <SkeletonBone colors={colors} style={styles.inputBone} />
        <SkeletonBone colors={colors} style={styles.valueBone} />
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
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 10,
  },
  titleBlock: {
    flex: 1,
    gap: 6,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  codeBone: {
    width: 44,
    height: 14,
  },
  nameBone: {
    width: 80,
    height: 12,
  },
  amountBone: {
    width: 52,
    height: 18,
  },
  converterBlock: {
    alignItems: 'flex-end',
    gap: 6,
  },
  inputBone: {
    width: 132,
    height: 38,
    borderRadius: 10,
  },
  valueBone: {
    width: 120,
    height: 24,
  },
});
