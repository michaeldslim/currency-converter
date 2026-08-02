import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { formatAppVersion } from '../constants/appVersion';
import { getOptionalCurrencies } from '../constants/currencies';
import { useAppTheme } from '../hooks/useAppTheme';
import { AppColors } from '../theme/colors';
import { OptionalCurrencyCode, OptionalCurrencyPreferences } from '../types';
import { getCurrencyName } from '../utils/currencyName';

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
  const { t } = useTranslation();
  const { colors, isDark } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const optionalCurrencies = getOptionalCurrencies();

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <SafeAreaView style={styles.sheetSafeArea} edges={['bottom']}>
          <View style={styles.sheet}>
            <View style={styles.header}>
              <Text style={styles.title}>{t('settings.title')}</Text>
              <Pressable onPress={onClose} hitSlop={8}>
                <Text style={styles.closeButton}>{t('common.close')}</Text>
              </Pressable>
            </View>

            <Text style={styles.hint}>{t('settings.optionalHint')}</Text>

            {optionalCurrencies.map((currency) => {
              const currencyName = getCurrencyName(t, currency.code);

              return (
                <View key={currency.code} style={styles.optionRow}>
                  <View style={styles.optionInfo}>
                    <Text style={styles.optionFlag}>{currency.flag}</Text>
                    <View style={styles.optionTextBlock}>
                      <Text style={styles.optionName}>{currencyName}</Text>
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
                    accessibilityLabel={t('settings.showCurrencyA11y', { name: currencyName })}
                  />
                </View>
              );
            })}

            <Text style={styles.version}>{formatAppVersion()}</Text>
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
    version: {
      marginTop: 16,
      fontSize: 12,
      fontWeight: '500',
      color: colors.textMuted,
      textAlign: 'center',
    },
  });
}
