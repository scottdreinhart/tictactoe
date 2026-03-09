/**
 * Adapter: WebAudioSoundAdapter
 *
 * Production implementation of SoundPort using the Web Audio API.
 * Wraps the existing sounds.ts synthesis functions behind the port contract.
 */
import type { SoundPort } from '@/domain/ports'

import {
  playDrawSound,
  playLossMusic,
  playMoveSound,
  playNavSound,
  playTapSound,
  playWinMusic,
} from '../sounds.ts'

export const WebAudioSoundAdapter: SoundPort = {
  playMove: playMoveSound,
  playNav: playNavSound,
  playTap: playTapSound,
  playWin: playWinMusic,
  playLoss: playLossMusic,
  playDraw: playDrawSound,
}
