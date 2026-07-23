import * as Haptics from 'expo-haptics';

export async function playRefreshSuccessHaptic(): Promise<void> {
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch {
    // Haptics unavailable on some devices/emulators.
  }
}
