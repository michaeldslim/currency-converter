export function formatKrw(value: number, locale = 'ko-KR'): string {
  return `₩ ${Math.round(value).toLocaleString(locale)}`;
}

export function parseAmountInput(text: string): number | null {
  const normalized = text.replace(/,/g, '').trim();
  if (normalized === '' || normalized === '.') {
    return null;
  }

  const value = Number(normalized);
  if (!Number.isFinite(value) || value < 0) {
    return null;
  }

  return value;
}

export function formatRateDate(isoDate: string, locale = 'ko-KR'): string {
  const date = new Date(`${isoDate}T12:00:00`);
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function formatFetchedAt(date: Date, locale = 'ko-KR'): string {
  return date.toLocaleString(locale, {
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}
