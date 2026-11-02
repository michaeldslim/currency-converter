/** Shared layout and typography tokens for screens and components. */

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
} as const;

export const radius = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 24,
  sheet: 24,
} as const;

export const typography = {
  caption: { fontSize: 11, fontWeight: '600' as const, letterSpacing: 0.6 },
  bodySm: { fontSize: 13, fontWeight: '600' as const },
  body: { fontSize: 15, fontWeight: '600' as const },
  titleSm: { fontSize: 18, fontWeight: '800' as const, letterSpacing: -0.3 },
  title: { fontSize: 28, fontWeight: '800' as const },
  display: { fontSize: 22, fontWeight: '800' as const, letterSpacing: -0.5 },
} as const;

export const elevation = {
  card: {
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
} as const;

/** Expression calculator pad layout (excluding safe-area inset). */
export const calculatorPad = {
  bodyHeight: 232,
  keyMinHeight: 38,
  keyGap: 4,
  keyFontSize: 17,
  displayFontSize: 20,
} as const;
