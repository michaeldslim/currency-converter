export interface AppColors {
  background: string;
  card: string;
  cardBorder: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentSoft: string;
  accentBorder: string;
  accentText: string;
  accentTextStrong: string;
  skeleton: string;
  skeletonHighlight: string;
  errorBg: string;
  errorText: string;
  errorButton: string;
  refreshBannerBg: string;
  refreshBannerBorder: string;
  todayButtonBg: string;
  todayButtonBorder: string;
  todayButtonText: string;
  modalBackdrop: string;
  modalSheet: string;
  shadow: string;
  statusBar: 'light' | 'dark' | 'auto';
}

export const lightColors: AppColors = {
  background: '#F1F5F9',
  card: '#FFFFFF',
  cardBorder: 'transparent',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#64748B',
  accent: '#2563EB',
  accentSoft: '#DBEAFE',
  accentBorder: '#2563EB',
  accentText: '#1D4ED8',
  accentTextStrong: '#1E3A8A',
  skeleton: '#E2E8F0',
  skeletonHighlight: '#F8FAFC',
  errorBg: '#FEF2F2',
  errorText: '#B91C1C',
  errorButton: '#DC2626',
  refreshBannerBg: '#EFF6FF',
  refreshBannerBorder: '#2563EB',
  todayButtonBg: '#FFFFFF',
  todayButtonBorder: '#CBD5E1',
  todayButtonText: '#334155',
  modalBackdrop: 'rgba(15, 23, 42, 0.45)',
  modalSheet: '#FFFFFF',
  shadow: '#0F172A',
  statusBar: 'dark',
};

export const darkColors: AppColors = {
  background: '#0F172A',
  card: '#1E293B',
  cardBorder: '#334155',
  textPrimary: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textMuted: '#94A3B8',
  accent: '#3B82F6',
  accentSoft: '#1E3A8A',
  accentBorder: '#3B82F6',
  accentText: '#93C5FD',
  accentTextStrong: '#BFDBFE',
  skeleton: '#334155',
  skeletonHighlight: '#475569',
  errorBg: '#450A0A',
  errorText: '#FCA5A5',
  errorButton: '#DC2626',
  refreshBannerBg: '#172554',
  refreshBannerBorder: '#3B82F6',
  todayButtonBg: '#1E293B',
  todayButtonBorder: '#475569',
  todayButtonText: '#E2E8F0',
  modalBackdrop: 'rgba(0, 0, 0, 0.6)',
  modalSheet: '#1E293B',
  shadow: '#000000',
  statusBar: 'light',
};
