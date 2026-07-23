import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CurrencyCard } from '../components/CurrencyCard';
import { CurrencyCardSkeleton } from '../components/CurrencyCardSkeleton';
import { CurrencySettingsModal } from '../components/CurrencySettingsModal';
import { RateDateCalendarModal } from '../components/RateDateCalendarModal';
import { useAppTheme } from '../hooks/useAppTheme';
import { useEnabledCurrencies } from '../hooks/useEnabledCurrencies';
import { useExchangeRates } from '../hooks/useExchangeRates';
import { AppColors } from '../theme/colors';
import { formatFetchedAt, formatRateDate } from '../utils/formatCurrency';

const CARD_GAP = 12;
const CARD_HEIGHT = 138;
const VERTICAL_PADDING = 24;

export function HomeScreen() {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const {
    enabledCurrencies,
    optionalPreferences,
    preferencesReady,
    setOptionalCurrencyEnabled,
  } = useEnabledCurrencies();
  const {
    rates,
    selectedDate,
    lastFetchedAt,
    loading,
    refreshing,
    error,
    needsTodayRefresh,
    refresh,
    selectDate,
    resetToLatest,
  } = useExchangeRates({ enabledCurrencies, preferencesReady });

  const cardStack = (
    <View style={styles.cardStack}>
      {enabledCurrencies.map((currency) => {
        const krwPerUnit = rates?.krwPerUnit[currency.code];

        return (
          <View key={currency.code} style={[styles.cardSlot, { height: CARD_HEIGHT }]}>
            {krwPerUnit !== undefined ? (
              <CurrencyCard currency={currency} krwPerUnit={krwPerUnit} colors={colors} />
            ) : (
              <CurrencyCardSkeleton currency={currency} colors={colors} />
            )}
          </View>
        );
      })}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>환율 변환기</Text>
          <Pressable
            style={styles.settingsButton}
            onPress={() => setSettingsVisible(true)}
            accessibilityRole="button"
            accessibilityLabel="표시 통화 설정"
          >
            <Text style={styles.settingsButtonText}>표시 통화</Text>
          </Pressable>
        </View>
        <Text style={styles.subtitle}>기준 통화: 원화 (KRW)</Text>
        {lastFetchedAt ? (
          <Text style={styles.fetchedAt}>
            마지막 업데이트: {formatFetchedAt(lastFetchedAt)}
          </Text>
        ) : null}

        {rates ? (
          <View style={styles.dateRow}>
            <Pressable
              style={styles.dateBadge}
              onPress={() => setCalendarVisible(true)}
              accessibilityRole="button"
              accessibilityLabel="기준일 선택"
            >
              <Text style={styles.dateLabel}>기준일</Text>
              <Text style={styles.dateValue}>{formatRateDate(rates.date)}</Text>
              <Text style={styles.dateHint}>탭하여 날짜 변경</Text>
            </Pressable>

            {selectedDate ? (
              <Pressable style={styles.todayButton} onPress={() => void resetToLatest()}>
                <Text style={styles.todayButtonText}>오늘 환율</Text>
              </Pressable>
            ) : null}
          </View>
        ) : null}

        {!selectedDate && needsTodayRefresh ? (
          <Pressable
            style={styles.refreshBanner}
            onPress={() => void resetToLatest()}
            disabled={refreshing}
            accessibilityRole="button"
            accessibilityLabel="오늘 환율 새로고침"
          >
            {refreshing ? (
              <ActivityIndicator color={colors.accentText} size="small" />
            ) : (
              <>
                <Text style={styles.refreshBannerTitle}>새로고침</Text>
                <Text style={styles.refreshBannerHint}>
                  날짜가 변경되었습니다. 오늘 환율을 불러오세요.
                </Text>
              </>
            )}
          </Pressable>
        ) : null}
      </View>

      {rates ? (
        <RateDateCalendarModal
          visible={calendarVisible}
          displayedDate={rates.date}
          selectedDate={selectedDate}
          onClose={() => setCalendarVisible(false)}
          onSelectDate={(isoDate) => void selectDate(isoDate)}
        />
      ) : null}

      <CurrencySettingsModal
        visible={settingsVisible}
        optionalPreferences={optionalPreferences}
        onClose={() => setSettingsVisible(false)}
        onToggleOptionalCurrency={(code, enabled) => void setOptionalCurrencyEnabled(code, enabled)}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          rates ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => void refresh()}
              colors={[colors.accent]}
              tintColor={colors.accent}
            />
          ) : undefined
        }
        showsVerticalScrollIndicator={false}
      >
        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable style={styles.retryButton} onPress={() => void refresh()}>
              <Text style={styles.retryButtonText}>다시 시도</Text>
            </Pressable>
          </View>
        ) : null}

        {loading && !rates ? (
          <Text style={styles.loadingHint}>환율을 불러오는 중...</Text>
        ) : null}

        {cardStack}
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: 24,
      paddingTop: 12,
      paddingBottom: 8,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
    },
    title: {
      flex: 1,
      fontSize: 30,
      fontWeight: '800',
      color: colors.textPrimary,
    },
    settingsButton: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 10,
      backgroundColor: colors.todayButtonBg,
      borderWidth: 1,
      borderColor: colors.todayButtonBorder,
    },
    settingsButtonText: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.todayButtonText,
    },
    subtitle: {
      marginTop: 6,
      fontSize: 16,
      color: colors.textSecondary,
    },
    fetchedAt: {
      marginTop: 4,
      fontSize: 13,
      color: colors.textMuted,
    },
    dateRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
      marginTop: 14,
    },
    dateBadge: {
      flexShrink: 1,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 14,
      backgroundColor: colors.accentSoft,
      borderWidth: 1.5,
      borderColor: colors.accentBorder,
    },
    dateLabel: {
      fontSize: 11,
      fontWeight: '700',
      color: colors.accentText,
      letterSpacing: 0.8,
      textTransform: 'uppercase',
    },
    dateValue: {
      marginTop: 4,
      fontSize: 18,
      fontWeight: '800',
      color: colors.accentTextStrong,
      letterSpacing: -0.3,
    },
    dateHint: {
      marginTop: 6,
      fontSize: 10,
      fontWeight: '600',
      color: colors.accent,
    },
    todayButton: {
      alignSelf: 'flex-start',
      marginTop: 4,
      paddingHorizontal: 14,
      paddingVertical: 12,
      borderRadius: 12,
      backgroundColor: colors.todayButtonBg,
      borderWidth: 1,
      borderColor: colors.todayButtonBorder,
    },
    todayButtonText: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.todayButtonText,
    },
    refreshBanner: {
      marginTop: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderRadius: 14,
      backgroundColor: colors.refreshBannerBg,
      borderWidth: 1.5,
      borderColor: colors.refreshBannerBorder,
      alignItems: 'center',
      gap: 4,
    },
    refreshBannerTitle: {
      fontSize: 16,
      fontWeight: '800',
      color: colors.accentText,
    },
    refreshBannerHint: {
      fontSize: 13,
      fontWeight: '500',
      color: colors.accent,
      textAlign: 'center',
    },
    scrollContent: {
      paddingHorizontal: 20,
      paddingBottom: VERTICAL_PADDING,
    },
    loadingHint: {
      marginTop: 12,
      marginBottom: 4,
      fontSize: 15,
      color: colors.textMuted,
      textAlign: 'center',
    },
    cardStack: {
      gap: CARD_GAP,
      marginTop: 12,
    },
    cardSlot: {
      width: '100%',
    },
    errorBox: {
      backgroundColor: colors.errorBg,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
    },
    errorText: {
      color: colors.errorText,
      fontSize: 14,
      lineHeight: 20,
    },
    retryButton: {
      alignSelf: 'flex-start',
      marginTop: 12,
      backgroundColor: colors.errorButton,
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical: 8,
    },
    retryButtonText: {
      color: '#FFFFFF',
      fontWeight: '600',
      fontSize: 14,
    },
  });
}
