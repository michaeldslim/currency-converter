import * as Haptics from 'expo-haptics';

export async function playCalculatorKeyHaptic(): Promise<void> {
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch {
    // Haptics unavailable on some devices/emulators.
  }
}
