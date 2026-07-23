import { useMemo } from 'react';
import { Modal, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getOptionalCurrencies } from '../constants/currencies';
import { useAppTheme } from '../hooks/useAppTheme';
import { AppColors } from '../theme/colors';
import { OptionalCurrencyCode, OptionalCurrencyPreferences } from '../types';

interface CurrencySettingsModalProps {
  visible: boolean;
  optionalPreferences: OptionalCurrencyPreferences;
  onClose: () => void;
  onToggleOptionalCurrency: (code: OptionalCurrencyCode, enabled: boolean) => void;
}

export function CurrencySettingsModal({
  visible,
  optionalPreferences,
  onClose,
  onToggleOptionalCurrency,
}: CurrencySettingsModalProps) {
  const { colors, isDark } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const optionalCurrencies = getOptionalCurrencies();

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <SafeAreaView style={styles.sheetSafeArea} edges={['bottom']}>
          <View style={styles.sheet}>
            <View style={styles.header}>
              <Text style={styles.title}>표시 통화</Text>
              <Pressable onPress={onClose} hitSlop={8}>
                <Text style={styles.closeButton}>닫기</Text>
              </Pressable>
            </View>

            <Text style={styles.hint}>미국 달러와 일본 엔은 항상 표시됩니다.</Text>

            {optionalCurrencies.map((currency) => (
              <View key={currency.code} style={styles.optionRow}>
                <View style={styles.optionInfo}>
                  <Text style={styles.optionFlag}>{currency.flag}</Text>
                  <View style={styles.optionTextBlock}>
                    <Text style={styles.optionName}>{currency.nameKo}</Text>
                    <Text style={styles.optionLabel}>{currency.displayLabel}</Text>
                  </View>
                </View>
                <Switch
                  value={optionalPreferences[currency.code]}
                  onValueChange={(enabled) => onToggleOptionalCurrency(currency.code, enabled)}
                  trackColor={{
                    false: colors.cardBorder === 'transparent' ? '#CBD5E1' : colors.cardBorder,
                    true: colors.accent,
                  }}
                  thumbColor={isDark ? '#F8FAFC' : '#FFFFFF'}
                  accessibilityLabel={`${currency.nameKo} 표시`}
                />
              </View>
            ))}
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: colors.modalBackdrop,
      justifyContent: 'flex-end',
    },
    sheetSafeArea: {
      width: '100%',
    },
    sheet: {
      backgroundColor: colors.modalSheet,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 16,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    title: {
      fontSize: 20,
      fontWeight: '800',
      color: colors.textPrimary,
    },
    closeButton: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.accent,
    },
    hint: {
      fontSize: 13,
      color: colors.textMuted,
      marginBottom: 16,
    },
    optionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.cardBorder === 'transparent' ? '#E2E8F0' : colors.cardBorder,
    },
    optionInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      marginRight: 12,
    },
    optionFlag: {
      fontSize: 24,
      marginRight: 12,
    },
    optionTextBlock: {
      flex: 1,
    },
    optionName: {
      fontSize: 15,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    optionLabel: {
      marginTop: 2,
      fontSize: 13,
      color: colors.textMuted,
    },
  });
}
