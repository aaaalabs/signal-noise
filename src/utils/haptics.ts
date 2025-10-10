/**
 * Safe haptic feedback wrapper
 * Silently fails if vibration is blocked by browser policy
 */
export function vibrate(pattern: number | number[]): void {
  if (!navigator.vibrate) return;

  try {
    navigator.vibrate(pattern);
  } catch (error) {
    // Silently ignore - user hasn't interacted yet or vibration blocked
    // Browser console warning is expected on first page load
  }
}
