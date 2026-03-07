import { useEffect, useRef, useState, useCallback } from 'react'

/**
 * useCoinFlipAnimation — Application hook
 *
 * Encapsulates the coin-flip animation lifecycle:
 * - Auto-stops after a configurable timeout
 * - Exposes `stopFlip` for early user interaction
 * - Fires `onComplete(isXFirst)` after a reveal delay
 * - Handles StrictMode double-mount via requestAnimationFrame guard
 *
 * @param {{ onComplete: (isXFirst: boolean) => void, autoStopMs?: number, revealMs?: number }} config
 *
 * @returns {{
 *   isFlipping: boolean,
 *   result: 'X'|'O'|null,
 *   ready: boolean,
 *   stopFlip: () => void,
 * }}
 */
const useCoinFlipAnimation = ({ onComplete, autoStopMs = 3500, revealMs = 1200 }) => {
  const [isFlipping, setIsFlipping] = useState(true)
  const [result, setResult] = useState(null)
  const [ready, setReady] = useState(false)

  const callbackRef = useRef(onComplete)
  const flipTimerRef = useRef(null)
  const resultTimerRef = useRef(null)
  const isFlippingRef = useRef(true)

  callbackRef.current = onComplete

  const stopFlip = useCallback(() => {
    if (!isFlippingRef.current) return
    isFlippingRef.current = false

    if (flipTimerRef.current) clearTimeout(flipTimerRef.current)
    setIsFlipping(false)

    const isXFirst = Math.random() > 0.5
    setResult(isXFirst ? 'X' : 'O')

    resultTimerRef.current = setTimeout(() => {
      callbackRef.current(isXFirst)
    }, revealMs)
  }, [revealMs])

  // Delay rendering by one frame to avoid StrictMode double-mount flash
  useEffect(() => {
    const rafId = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(rafId)
  }, [])

  // Auto-stop after timeout
  useEffect(() => {
    if (!ready) return

    flipTimerRef.current = setTimeout(() => {
      stopFlip()
    }, autoStopMs)

    return () => {
      if (flipTimerRef.current) clearTimeout(flipTimerRef.current)
      if (resultTimerRef.current) clearTimeout(resultTimerRef.current)
    }
  }, [ready, autoStopMs, stopFlip])

  return { isFlipping, result, ready, stopFlip }
}

export default useCoinFlipAnimation
