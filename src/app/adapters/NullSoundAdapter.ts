/**
 * Adapter: NullSoundAdapter
 *
 * Null Object implementation of SoundPort.
 * Used when sounds are disabled, for tests, or in SSR contexts.
 * All methods are no-ops — avoids repetitive null checks throughout the app.
 */
import type { SoundPort } from '@/domain/ports'

export const NullSoundAdapter: SoundPort = {
  playMove: () => {},
  playNav: () => {},
  playTap: () => {},
  playWin: () => {},
  playLoss: () => {},
  playDraw: () => {},
}
