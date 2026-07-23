import { MarkedDates } from 'react-native-calendars/src/types';

export const MIN_RATE_DATE = '1999-01-04';

const holidayCache = new Map<number, Set<string>>();

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

export function toIsoDate(year: number, month: number, day: number): string {
  return `${year}-${pad2(month)}-${pad2(day)}`;
}

export function getTodayIso(): string {
  const today = new Date();
  return toIsoDate(today.getFullYear(), today.getMonth() + 1, today.getDate());
}

function parseIsoDate(isoDate: string): { year: number; month: number; day: number } {
  const [year, month, day] = isoDate.split('-').map(Number);
  return { year, month, day };
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function dateToIso(date: Date): string {
  return toIsoDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

/** Anonymous Gregorian algorithm — used for Good Friday / Easter Monday. */
function getEasterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

/** TARGET closing days used by ECB reference rates (Frankfurter source). */
function getTargetHolidays(year: number): Set<string> {
  const cached = holidayCache.get(year);
  if (cached) {
    return cached;
  }

  const easterSunday = getEasterSunday(year);
  const holidays = new Set([
    toIsoDate(year, 1, 1),
    dateToIso(addDays(easterSunday, -2)),
    dateToIso(addDays(easterSunday, 1)),
    toIsoDate(year, 5, 1),
    toIsoDate(year, 12, 25),
    toIsoDate(year, 12, 26),
  ]);

  holidayCache.set(year, holidays);
  return holidays;
}

export function isWeekend(isoDate: string): boolean {
  const { year, month, day } = parseIsoDate(isoDate);
  const weekday = new Date(year, month - 1, day).getDay();
  return weekday === 0 || weekday === 6;
}

export function isFutureDate(isoDate: string): boolean {
  return isoDate > getTodayIso();
}

export function isBeforeMinRateDate(isoDate: string): boolean {
  return isoDate < MIN_RATE_DATE;
}

export function isTargetHoliday(isoDate: string): boolean {
  const { year } = parseIsoDate(isoDate);
  return getTargetHolidays(year).has(isoDate);
}

export function isRateDateSelectable(isoDate: string): boolean {
  if (isBeforeMinRateDate(isoDate)) {
    return false;
  }
  if (isFutureDate(isoDate)) {
    return false;
  }
  if (isWeekend(isoDate)) {
    return false;
  }
  if (isTargetHoliday(isoDate)) {
    return false;
  }
  return true;
}

export function buildMonthMarkedDates(
  year: number,
  month: number,
  selectedDate?: string | null,
): MarkedDates {
  const marked: MarkedDates = {};
  const daysInMonth = new Date(year, month, 0).getDate();

  for (let day = 1; day <= daysInMonth; day += 1) {
    const isoDate = toIsoDate(year, month, day);
    if (!isRateDateSelectable(isoDate)) {
      marked[isoDate] = {
        disabled: true,
        disableTouchEvent: true,
      };
    }
  }

  if (selectedDate && isRateDateSelectable(selectedDate)) {
    marked[selectedDate] = {
      ...(marked[selectedDate] ?? {}),
      selected: true,
      selectedColor: '#2563EB',
      disabled: false,
      disableTouchEvent: false,
    };
  }

  return marked;
}
