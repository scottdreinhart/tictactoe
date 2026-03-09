/**
 * Adapter: NullHapticsAdapter
 *
 * Null Object implementation of HapticsPort.
 * Used in environments without vibration support, tests, or SSR.
 */
import type { HapticsPort } from '@/domain/ports'

export const NullHapticsAdapter: HapticsPort = {
  tick: () => {},
  tap: () => {},
  heavy: () => {},
}
