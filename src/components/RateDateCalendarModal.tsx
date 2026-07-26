import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppLocale } from '../hooks/useAppLocale';
import { useAppTheme } from '../hooks/useAppTheme';
import { applyCalendarLocale } from '../i18n/calendarLocales';
import { AppColors } from '../theme/colors';
import { formatRateDate } from '../utils/formatCurrency';
import {
  buildMonthMarkedDates,
  getTodayIso,
  isRateDateSelectable,
  MIN_RATE_DATE,
} from '../utils/rateCalendar';

interface RateDateCalendarModalProps {
  visible: boolean;
  displayedDate: string;
  selectedDate: string | null;
  onClose: () => void;
  onSelectDate: (isoDate: string) => void;
}

function getMonthParts(isoMonth: string): { year: number; month: number } {
  const [year, month] = isoMonth.split('-').map(Number);
  return { year, month };
}

export function RateDateCalendarModal({
  visible,
  displayedDate,
  selectedDate,
  onClose,
  onSelectDate,
}: RateDateCalendarModalProps) {
  const { t } = useTranslation();
  const { language, locale } = useAppLocale();
  const { colors, isDark } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const today = getTodayIso();
  const focusDate = selectedDate ?? displayedDate;
  const focusMonth = focusDate.slice(0, 7);
  const [visibleMonth, setVisibleMonth] = useState(focusMonth);
  const [calendarKey, setCalendarKey] = useState(0);

  useEffect(() => {
    applyCalendarLocale(language);
  }, [language]);

  useEffect(() => {
    if (!visible) {
      return;
    }

    setVisibleMonth(focusMonth);
    setCalendarKey((current) => current + 1);
  }, [visible, focusMonth]);

  const markedDates = useMemo(() => {
    const { year, month } = getMonthParts(`${visibleMonth}-01`);
    return buildMonthMarkedDates(year, month, focusDate);
  }, [focusDate, visibleMonth]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <SafeAreaView style={styles.sheetSafeArea} edges={['bottom']}>
          <View style={styles.sheet}>
            <View style={styles.header}>
              <Text style={styles.title}>{t('calendar.title')}</Text>
              <Pressable onPress={onClose} hitSlop={8}>
                <Text style={styles.closeButton}>{t('common.close')}</Text>
              </Pressable>
            </View>

            <Text style={styles.hint}>{t('calendar.hint')}</Text>

            <Calendar
              key={`${calendarKey}-${language}`}
              current={focusDate}
              minDate={MIN_RATE_DATE}
              maxDate={today}
              markedDates={markedDates}
              disableAllTouchEventsForDisabledDays
              onMonthChange={(month) => {
                setVisibleMonth(month.dateString.slice(0, 7));
              }}
              onDayPress={(day) => {
                if (!isRateDateSelectable(day.dateString)) {
                  return;
                }
                onSelectDate(day.dateString);
                onClose();
              }}
              theme={{
                calendarBackground: colors.modalSheet,
                backgroundColor: colors.modalSheet,
                todayTextColor: colors.accent,
                dayTextColor: colors.textPrimary,
                textDisabledColor: colors.textMuted,
                monthTextColor: colors.textPrimary,
                arrowColor: colors.accent,
                selectedDayBackgroundColor: colors.accent,
                selectedDayTextColor: '#FFFFFF',
                textDayFontWeight: '500',
                textMonthFontWeight: '700',
                textDayHeaderFontWeight: '600',
                ...(isDark
                  ? {
                      textSectionTitleColor: colors.textMuted,
                      dotColor: colors.accent,
                    }
                  : {}),
              }}
            />

            {selectedDate ? (
              <Text style={styles.selectedLabel}>
                {t('calendar.selectedDate', { date: formatRateDate(selectedDate, locale) })}
              </Text>
            ) : (
              <Text style={styles.selectedLabel}>{t('calendar.selectedToday')}</Text>
            )}
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
      marginBottom: 8,
    },
    selectedLabel: {
      marginTop: 12,
      fontSize: 14,
      fontWeight: '600',
      color: colors.textSecondary,
      textAlign: 'center',
    },
  });
}
