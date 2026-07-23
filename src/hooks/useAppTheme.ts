import { useColorScheme } from 'react-native';

import { AppColors, darkColors, lightColors } from '../theme/colors';

export function useAppTheme(): { colors: AppColors; isDark: boolean } {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  return {
    colors: isDark ? darkColors : lightColors,
    isDark,
  };
}
