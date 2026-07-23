import { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppTheme } from '../hooks/useAppTheme';
import { AppColors } from '../theme/colors';
import { formatRateDate } from '../utils/formatCurrency';
import {
  buildMonthMarkedDates,
  getTodayIso,
  isRateDateSelectable,
  MIN_RATE_DATE,
} from '../utils/rateCalendar';

LocaleConfig.locales.ko = {
  monthNames: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  monthNamesShort: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘',
};
LocaleConfig.defaultLocale = 'ko';

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
  const { colors, isDark } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const today = getTodayIso();
  const focusDate = selectedDate ?? displayedDate;
  const focusMonth = focusDate.slice(0, 7);
  const [visibleMonth, setVisibleMonth] = useState(focusMonth);
  const [calendarKey, setCalendarKey] = useState(0);

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
              <Text style={styles.title}>기준일 선택</Text>
              <Pressable onPress={onClose} hitSlop={8}>
                <Text style={styles.closeButton}>닫기</Text>
              </Pressable>
            </View>

            <Text style={styles.hint}>
              주말, 공휴일, 미래 날짜는 선택할 수 없습니다.
            </Text>

            <Calendar
              key={calendarKey}
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
                선택된 기준일: {formatRateDate(selectedDate)}
              </Text>
            ) : (
              <Text style={styles.selectedLabel}>선택된 기준일: 오늘 환율</Text>
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
