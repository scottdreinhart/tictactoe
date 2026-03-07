import { useCallback, useRef, useState } from 'react'
import { playMoveSound, playWinSound, playDrawSound } from '../domain/sounds.js'

/**
 * Check if the user prefers reduced motion.
 * Sound is treated as a "motion" cue — we mute when reduced-motion is active.
 */
const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * useSoundEffects — application hook
 *
 * Manages a sound-enabled toggle and exposes play functions
 * that respect both the toggle and prefers-reduced-motion.
 *
 * Returns:
 *   soundEnabled  — current on/off state
 *   toggleSound   — stable callback to flip the toggle
 *   playMove      — call after a move is placed
 *   playWin       — call when a player wins
 *   playDraw      — call when the game is a draw
 */
const useSoundEffects = () => {
  const [soundEnabled, setSoundEnabled] = useState(true)
  const soundEnabledRef = useRef(soundEnabled)
  soundEnabledRef.current = soundEnabled

  const shouldPlay = useCallback(() => {
    return soundEnabledRef.current && !prefersReducedMotion()
  }, [])

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => !prev)
  }, [])

  const playMove = useCallback(() => {
    if (shouldPlay()) playMoveSound()
  }, [shouldPlay])

  const playWin = useCallback(() => {
    if (shouldPlay()) playWinSound()
  }, [shouldPlay])

  const playDraw = useCallback(() => {
    if (shouldPlay()) playDrawSound()
  }, [shouldPlay])

  return { soundEnabled, toggleSound, playMove, playWin, playDraw }
}

export default useSoundEffects
