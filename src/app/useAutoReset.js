import { useCallback, useEffect, useRef, useState } from 'react'

const AUTO_RESET_SECONDS = 30

/**
 * useAutoReset — Application hook
 *
 * When `isGameOver` flips to true, starts a countdown from 30 → 0.
 * Calls `onReset` automatically when the timer hits 0.
 * Exposes `secondsLeft` and a `resetNow` callback for early reset.
 *
 * @param {boolean} isGameOver  — whether the game has ended
 * @param {() => void} onReset  — callback to reset the game
 * @returns {{ secondsLeft: number|null, resetNow: () => void }}
 */
const useAutoReset = (isGameOver, onReset) => {
  const [secondsLeft, setSecondsLeft] = useState(null)
  const intervalRef = useRef(null)

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setSecondsLeft(null)
  }, [])

  const resetNow = useCallback(() => {
    clearTimer()
    onReset()
  }, [clearTimer, onReset])

  useEffect(() => {
    if (isGameOver) {
      setSecondsLeft(AUTO_RESET_SECONDS)

      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev === null || prev <= 1) return 0
          return prev - 1
        })
      }, 1000)
    } else {
      clearTimer()
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isGameOver, clearTimer])

  // Auto-reset when countdown reaches 0
  useEffect(() => {
    if (secondsLeft === 0) {
      resetNow()
    }
  }, [secondsLeft, resetNow])

  return { secondsLeft, resetNow }
}

export default useAutoReset
