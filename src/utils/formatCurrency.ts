export function formatKrw(value: number): string {
  return `₩ ${Math.round(value).toLocaleString('ko-KR')}`;
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

export function formatRateDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');
  return `${year}년 ${Number(month)}월 ${Number(day)}일`;
}

export function formatFetchedAt(date: Date): string {
  return date.toLocaleString('ko-KR', {
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}
