import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
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
import { useAppLocale } from '../hooks/useAppLocale';
import { useAppTheme } from '../hooks/useAppTheme';
import { useEnabledCurrencies } from '../hooks/useEnabledCurrencies';
import { useExchangeRates } from '../hooks/useExchangeRates';
import { useLocalToday } from '../hooks/useLocalToday';
import { AppColors } from '../theme/colors';
import { isCardRatesReady } from '../constants/currencies';
import { formatFetchedAt, formatRateDate } from '../utils/formatCurrency';

const CARD_GAP = 12;
const CARD_HEIGHT = 192;
const CARD_STACK_MARGIN_TOP = 12;
const VERTICAL_PADDING = 24;

export function HomeScreen() {
  const { t } = useTranslation();
  const { locale } = useAppLocale();
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const scrollRef = useRef<ScrollView>(null);
  const headerHeightRef = useRef(0);
  const cardOffsetRef = useRef<Record<string, number>>({});
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [keyboardPadding, setKeyboardPadding] = useState(0);
  const [inputResetVersion, setInputResetVersion] = useState(0);
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
    isOffline,
    isUsingCachedRates,
    refresh,
    selectDate,
    resetToLatest,
  } = useExchangeRates({ enabledCurrencies, preferencesReady });
  const today = useLocalToday();
  const showStaleRateHint =
    rates !== null && selectedDate === null && rates.date < today;

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', (event) => {
      setKeyboardPadding(event.endCoordinates.height);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardPadding(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const resetAllCardInputs = () => {
    Keyboard.dismiss();
    setInputResetVersion((version) => version + 1);
  };

  const scrollToCardInput = (currencyCode: string) => {
    const cardOffset = cardOffsetRef.current[currencyCode];
    if (cardOffset === undefined) {
      return;
    }

    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        y: Math.max(0, headerHeightRef.current + CARD_STACK_MARGIN_TOP + cardOffset - 24),
        animated: true,
      });
    });
  };

  const cardStack = (
    <View style={styles.cardStack} pointerEvents="box-none">
      {enabledCurrencies.map((currency) => {
        const cardRatesReady = rates ? isCardRatesReady(currency.code, rates.krwPerUnit) : false;

        return (
          <View
            key={currency.code}
            style={[styles.cardSlot, { height: CARD_HEIGHT }]}
            onLayout={(event) => {
              cardOffsetRef.current[currency.code] = event.nativeEvent.layout.y;
            }}
            onStartShouldSetResponder={() => true}
            onResponderTerminationRequest={() => false}
          >
            {cardRatesReady ? (
              <CurrencyCard
                currency={currency}
                krwPerUnit={rates!.krwPerUnit}
                colors={colors}
                inputResetVersion={inputResetVersion}
                onInputFocus={() => scrollToCardInput(currency.code)}
              />
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
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
      >
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
          ref={scrollRef}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: VERTICAL_PADDING + keyboardPadding },
          ]}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets
          showsVerticalScrollIndicator={false}
        >
          <Pressable style={styles.outsideTapArea} onPress={resetAllCardInputs}>
            <View
              style={styles.header}
              onLayout={(event) => {
                headerHeightRef.current = event.nativeEvent.layout.height;
              }}
            >
            <View style={styles.titleRow}>
              <Text style={styles.title}>{t('home.title')}</Text>
              <Pressable
                style={styles.settingsButton}
                onPress={() => setSettingsVisible(true)}
                accessibilityRole="button"
                accessibilityLabel={t('home.displayCurrenciesA11y')}
              >
                <Text style={styles.settingsButtonText}>{t('home.displayCurrencies')}</Text>
              </Pressable>
            </View>
            <Text style={styles.subtitle}>{t('home.subtitle')}</Text>
            {lastFetchedAt ? (
              <Text style={styles.fetchedAt}>
                {t('home.lastFetched', { time: formatFetchedAt(lastFetchedAt, locale) })}
              </Text>
            ) : null}

            {rates ? (
              <View style={styles.dateRow}>
                <Pressable
                  style={styles.dateBadge}
                  onPress={() => setCalendarVisible(true)}
                  accessibilityRole="button"
                  accessibilityLabel={t('home.rateDateSelectA11y')}
                >
                  <Text style={styles.dateLabel}>{t('home.rateDateLabel')}</Text>
                  <Text style={styles.dateValue}>{formatRateDate(rates.date, locale)}</Text>
                  <Text style={styles.dateHint}>
                    {showStaleRateHint ? t('home.staleRateHint') : t('home.tapToChangeDate')}
                  </Text>
                </Pressable>

                <Pressable
                  style={[styles.todayButton, isOffline && styles.todayButtonDisabled]}
                  onPress={() => void resetToLatest()}
                  disabled={refreshing || isOffline}
                  accessibilityRole="button"
                  accessibilityLabel={t('home.todayRatesRefreshA11y')}
                >
                  {refreshing ? (
                    <ActivityIndicator color={colors.todayButtonText} size="small" />
                  ) : (
                    <Text style={styles.todayButtonText}>{t('home.todayRates')}</Text>
                  )}
                </Pressable>
              </View>
            ) : null}

            </View>

            {isOffline && rates ? (
              <View style={styles.offlineBanner}>
                <Text style={styles.offlineBannerText}>
                  {t('home.offlineRates', { date: formatRateDate(rates.date, locale) })}
                </Text>
              </View>
            ) : null}

            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
                {!isOffline || !rates ? (
                  <Pressable style={styles.retryButton} onPress={() => void refresh()}>
                    <Text style={styles.retryButtonText}>{t('common.retry')}</Text>
                  </Pressable>
                ) : null}
              </View>
            ) : null}

            {isUsingCachedRates && !isOffline && rates ? (
              <View style={styles.offlineBanner}>
                <Text style={styles.offlineBannerText}>
                  {t('home.cachedRatesHint', { date: formatRateDate(rates.date, locale) })}
                </Text>
              </View>
            ) : null}

            {loading && !rates ? (
              <Text style={styles.loadingHint}>{t('home.loading')}</Text>
            ) : null}

            {cardStack}
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    keyboardAvoid: {
      flex: 1,
    },
    header: {
      paddingHorizontal: 4,
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
    todayButtonDisabled: {
      opacity: 0.5,
    },
    offlineBanner: {
      backgroundColor: colors.refreshBannerBg,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.refreshBannerBorder,
      paddingHorizontal: 14,
      paddingVertical: 10,
      marginBottom: 12,
    },
    offlineBannerText: {
      color: colors.accentText,
      fontSize: 13,
      fontWeight: '600',
      lineHeight: 18,
    },
    scrollContent: {
      paddingHorizontal: 20,
      flexGrow: 1,
    },
    outsideTapArea: {
      flexGrow: 1,
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
