import { StatusBar } from 'expo-status-bar';
import { initialWindowMetrics, SafeAreaProvider } from 'react-native-safe-area-context';

import { useAppTheme } from './src/hooks/useAppTheme';
import { HomeScreen } from './src/screens/HomeScreen';

function AppContent() {
  const { colors } = useAppTheme();

  return (
    <>
      <StatusBar style={colors.statusBar} />
      <HomeScreen />
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <AppContent />
    </SafeAreaProvider>
  );
}
