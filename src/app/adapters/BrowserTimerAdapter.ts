/**
 * Adapter: BrowserTimerAdapter
 *
 * Production implementation of TimerPort using window.setTimeout,
 * window.clearTimeout, and Date.now().
 */
import type { TimerPort } from '@/domain/ports'

export const BrowserTimerAdapter: TimerPort = {
  setTimeout: (callback: () => void, delayMs: number): number => {
    return window.setTimeout(callback, delayMs) as unknown as number
  },
  clearTimeout: (handle: number): void => {
    window.clearTimeout(handle)
  },
  now: (): number => Date.now(),
}
