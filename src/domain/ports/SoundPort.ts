/**
 * Port: SoundPort
 *
 * Abstracts audio playback so domain/app layers never call Web Audio API
 * directly. Enables a NullSoundAdapter for tests, SSR, or when the user
 * has sounds disabled.
 */
export interface SoundPort {
  playMove(): void
  playNav(): void
  playTap(): void
  playWin(): void
  playLoss(): void
  playDraw(): void
}
