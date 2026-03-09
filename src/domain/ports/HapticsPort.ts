/**
 * Port: HapticsPort
 *
 * Abstracts vibration/haptic feedback so app layer never calls
 * navigator.vibrate() directly. Enables a NullHapticsAdapter for
 * environments that lack vibration support.
 */
export interface HapticsPort {
  /** Subtle pulse for focus / navigation changes. */
  tick(): void

  /** Medium pulse for cell selection / button taps. */
  tap(): void

  /** Heavier pulse for emphasis or error feedback. */
  heavy(): void
}
