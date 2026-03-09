/**
 * Adapter: BrowserHapticsAdapter
 *
 * Production implementation of HapticsPort using navigator.vibrate().
 * Detects vibration support at module load; no-ops on unsupported platforms.
 */
import type { HapticsPort } from '@/domain/ports'

const canVibrate = typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function'

export const BrowserHapticsAdapter: HapticsPort = {
  tick: () => {
    if (canVibrate) navigator.vibrate(10)
  },
  tap: () => {
    if (canVibrate) navigator.vibrate(15)
  },
  heavy: () => {
    if (canVibrate) navigator.vibrate(30)
  },
}
