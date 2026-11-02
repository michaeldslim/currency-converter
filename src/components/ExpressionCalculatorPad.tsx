import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppColors } from '../theme/colors';
import { calculatorPad, radius, spacing, typography } from '../theme/tokens';
import { DISPLAY_DIV, DISPLAY_MUL } from '../utils/evaluateExpression';
import { playCalculatorKeyHaptic } from '../utils/calculatorHaptics';

type KeyKind = 'digit' | 'operator' | 'action';

interface CalculatorKey {
  label: string;
  token: string;
  kind: KeyKind;
  flex?: number;
  accessibilityKey: string;
}

interface ExpressionCalculatorPadProps {
  activeCurrencyLabel: string | null;
  expression: string;
  errorMessage: string | null;
  colors: AppColors;
  onDigitOrOperator: (token: string) => void;
  onBackspace: () => void;
  onClear: () => void;
  onApply: () => void;
  onResetAll: () => void;
  onDone: () => void;
}

const ROWS: CalculatorKey[][] = [
  [
    { label: 'C', token: 'clear', kind: 'action', accessibilityKey: 'clear' },
    { label: '⌫', token: 'backspace', kind: 'action', accessibilityKey: 'backspace' },
    { label: DISPLAY_DIV, token: DISPLAY_DIV, kind: 'operator', accessibilityKey: 'divide' },
    { label: DISPLAY_MUL, token: DISPLAY_MUL, kind: 'operator', accessibilityKey: 'multiply' },
  ],
  [
    { label: '7', token: '7', kind: 'digit', accessibilityKey: '7' },
    { label: '8', token: '8', kind: 'digit', accessibilityKey: '8' },
    { label: '9', token: '9', kind: 'digit', accessibilityKey: '9' },
    { label: '−', token: '-', kind: 'operator', accessibilityKey: 'subtract' },
  ],
  [
    { label: '4', token: '4', kind: 'digit', accessibilityKey: '4' },
    { label: '5', token: '5', kind: 'digit', accessibilityKey: '5' },
    { label: '6', token: '6', kind: 'digit', accessibilityKey: '6' },
    { label: '+', token: '+', kind: 'operator', accessibilityKey: 'add' },
  ],
  [
    { label: '1', token: '1', kind: 'digit', accessibilityKey: '1' },
    { label: '2', token: '2', kind: 'digit', accessibilityKey: '2' },
    { label: '3', token: '3', kind: 'digit', accessibilityKey: '3' },
    { label: '=', token: 'apply', kind: 'action', flex: 1, accessibilityKey: 'apply' },
  ],
  [
    { label: '0', token: '0', kind: 'digit', flex: 3, accessibilityKey: '0' },
    { label: '.', token: '.', kind: 'digit', accessibilityKey: 'decimal' },
  ],
];

export function ExpressionCalculatorPad({
  activeCurrencyLabel,
  expression,
  errorMessage,
  colors,
  onDigitOrOperator,
  onBackspace,
  onApply,
  onClear,
  onResetAll,
  onDone,
}: ExpressionCalculatorPadProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const displayText = errorMessage ? errorMessage : expression || '0';

  const handleKey = (key: CalculatorKey) => {
    void playCalculatorKeyHaptic();

    if (key.token === 'clear') {
      onClear();
      return;
    }
    if (key.token === 'backspace') {
      onBackspace();
      return;
    }
    if (key.token === 'apply') {
      onApply();
      return;
    }

    onDigitOrOperator(key.token);
  };

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, spacing.xs) }]}>
      <View style={styles.displayRow}>
        <View style={styles.displayHeader}>
          <Text
            style={styles.displayLabel}
            accessibilityRole="text"
            accessibilityLabel={t('calculator.expressionA11y')}
          >
            {t('calculator.title')}
          </Text>
          {activeCurrencyLabel ? (
            <Text style={styles.activeCurrency} numberOfLines={1}>
              {activeCurrencyLabel}
            </Text>
          ) : (
            <View style={styles.headerSpacer} />
          )}
          <View style={styles.headerActions}>
            <Pressable
              onPress={onResetAll}
              accessibilityRole="button"
              accessibilityLabel={t('calculator.resetAllA11y')}
              style={({ pressed }) => [styles.chip, styles.chipSecondary, pressed && styles.chipPressed]}
            >
              <Text style={styles.chipSecondaryText}>{t('calculator.resetAll')}</Text>
            </Pressable>
            <Pressable
              onPress={onDone}
              accessibilityRole="button"
              accessibilityLabel={t('calculator.done')}
              style={({ pressed }) => [styles.chip, styles.chipPrimary, pressed && styles.chipPressed]}
            >
              <Text style={styles.chipPrimaryText}>{t('calculator.done')}</Text>
            </Pressable>
          </View>
        </View>
        <Text
          style={[styles.displayValue, errorMessage ? styles.displayError : null]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.75}
          accessibilityLiveRegion="polite"
        >
          {displayText}
        </Text>
      </View>

      <View style={styles.keyGrid}>
        {ROWS.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.keyRow}>
            {row.map((key) => (
              <Pressable
                key={key.accessibilityKey}
                style={({ pressed }) => [
                  styles.key,
                  key.flex !== undefined ? { flex: key.flex } : null,
                  key.kind === 'operator' ? styles.keyOperator : null,
                  key.token === 'apply' ? styles.keyApply : null,
                  key.token === 'clear' || key.token === 'backspace' ? styles.keyMuted : null,
                  pressed ? styles.keyPressed : null,
                ]}
                onPress={() => handleKey(key)}
                accessibilityRole="button"
                accessibilityLabel={t(`calculator.key.${key.accessibilityKey}`)}
              >
                <Text
                  style={[
                    styles.keyText,
                    key.kind === 'operator' ? styles.keyTextStrong : null,
                    key.token === 'apply' ? styles.keyTextApply : null,
                  ]}
                >
                  {key.label}
                </Text>
              </Pressable>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

export function getCalculatorPadOccupiedHeight(safeAreaBottom: number): number {
  return calculatorPad.bodyHeight + Math.max(safeAreaBottom, spacing.xs);
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    container: {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.cardBorder === 'transparent' ? '#CBD5E1' : colors.cardBorder,
      backgroundColor: colors.modalSheet,
      paddingHorizontal: spacing.sm + 2,
      paddingTop: spacing.xs,
      minHeight: calculatorPad.bodyHeight,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 12,
    },
    displayRow: {
      marginBottom: spacing.xs,
      paddingHorizontal: spacing.xs,
    },
    displayHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    headerSpacer: {
      flex: 1,
    },
    activeCurrency: {
      flex: 1,
      ...typography.bodySm,
      color: colors.accentText,
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      flexShrink: 0,
    },
    chip: {
      paddingHorizontal: spacing.sm + 2,
      paddingVertical: spacing.xs + 2,
      borderRadius: radius.md,
      borderWidth: 1,
    },
    chipSecondary: {
      backgroundColor: colors.resetChipBg,
      borderColor: colors.resetChipBorder,
    },
    chipPrimary: {
      backgroundColor: colors.accentSoft,
      borderColor: colors.accentBorder,
    },
    chipPressed: {
      opacity: 0.82,
    },
    chipSecondaryText: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.resetChipText,
    },
    chipPrimaryText: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.accentTextStrong,
    },
    displayLabel: {
      ...typography.caption,
      color: colors.textMuted,
      textTransform: 'uppercase',
    },
    displayValue: {
      marginTop: 2,
      fontSize: calculatorPad.displayFontSize,
      fontWeight: '700',
      color: colors.textPrimary,
      textAlign: 'right',
      letterSpacing: -0.5,
    },
    displayError: {
      color: colors.errorText,
      fontSize: typography.bodySm.fontSize,
    },
    keyGrid: {
      gap: calculatorPad.keyGap,
    },
    keyRow: {
      flexDirection: 'row',
      gap: calculatorPad.keyGap,
    },
    key: {
      flex: 1,
      minHeight: calculatorPad.keyMinHeight,
      borderRadius: radius.sm - 2,
      backgroundColor: colors.background,
      alignItems: 'center',
      justifyContent: 'center',
    },
    keyOperator: {
      backgroundColor: colors.accentSoft,
    },
    keyApply: {
      backgroundColor: colors.accent,
    },
    keyMuted: {
      backgroundColor: colors.todayButtonBg,
      borderWidth: 1,
      borderColor: colors.todayButtonBorder,
    },
    keyPressed: {
      opacity: 0.75,
    },
    keyText: {
      fontSize: calculatorPad.keyFontSize,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    keyTextStrong: {
      fontWeight: '800',
      color: colors.accentTextStrong,
    },
    keyTextApply: {
      fontWeight: '800',
      color: '#FFFFFF',
    },
  });
}
