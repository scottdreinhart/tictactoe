import { useCallback, useRef, useState } from 'react'

/**
 * Lazily load the sounds module on first play attempt.
 * Keeps domain/sounds.js out of the critical rendering path.
 */
let soundsPromise = null
const getSounds = () => {
  if (!soundsPromise) {
    soundsPromise = import('./sounds.js')
  }
  return soundsPromise
}

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
 *   playNav       — call on keyboard/swipe navigation (focus change)
 *   playTap       — call on cell selection tap
 *   playWin       — call when a player wins
 *   playLoss      — call when the player loses
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
    if (shouldPlay()) getSounds().then((m) => m.playMoveSound())
  }, [shouldPlay])

  const playNav = useCallback(() => {
    if (shouldPlay()) getSounds().then((m) => m.playNavSound())
  }, [shouldPlay])

  const playTap = useCallback(() => {
    if (shouldPlay()) getSounds().then((m) => m.playTapSound())
  }, [shouldPlay])

  const playWin = useCallback(() => {
    if (shouldPlay()) getSounds().then((m) => m.playWinMusic())
  }, [shouldPlay])

  const playLoss = useCallback(() => {
    if (shouldPlay()) getSounds().then((m) => m.playLossMusic())
  }, [shouldPlay])

  const playDraw = useCallback(() => {
    if (shouldPlay()) getSounds().then((m) => m.playDrawSound())
  }, [shouldPlay])

  return { soundEnabled, toggleSound, playMove, playNav, playTap, playWin, playLoss, playDraw }
}

export default useSoundEffects
