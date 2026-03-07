/**
 * haptics.js — Domain service
 *
 * Centralises haptic feedback behind a safe API.
 * Degrades gracefully when the Vibration API is unavailable
 * (desktop browsers, older iOS, test environments).
 *
 * Preset durations follow Material Design conventions:
 *   tick  – subtle navigation pulse (10 ms)
 *   tap   – affirmative selection pulse (15 ms)
 *   heavy – emphasis / error pulse (30 ms)
 */

const canVibrate = typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function'

/** Subtle pulse for focus / navigation changes. */
export const tick = () => {
  if (canVibrate) navigator.vibrate(10)
}

/** Medium pulse for cell selection / button taps. */
export const tap = () => {
  if (canVibrate) navigator.vibrate(15)
}

/** Heavier pulse for emphasis or error feedback. */
export const heavy = () => {
  if (canVibrate) navigator.vibrate(30)
}
