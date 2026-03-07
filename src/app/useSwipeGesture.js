import { useEffect, useRef } from 'react'

/**
 * Minimum distance (px) a finger must travel to count as a swipe.
 */
const SWIPE_THRESHOLD = 30

/**
 * Maximum time (ms) allowed for a swipe gesture.
 */
const SWIPE_TIMEOUT = 300

/**
 * useSwipeGesture — Application hook
 *
 * Attaches touchstart / touchend listeners to a ref'd DOM element
 * and invokes a callback with the swipe direction:
 *   'up' | 'down' | 'left' | 'right'
 *
 * Designed for mobile Tic-Tac-Toe grid navigation — swipe in a
 * direction to move focus to the neighbouring cell.
 *
 * @param {React.RefObject<HTMLElement>} ref  — element to listen on
 * @param {(direction: 'up'|'down'|'left'|'right') => void} onSwipe
 */
const useSwipeGesture = (ref, onSwipe) => {
  const startRef = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const handleTouchStart = (e) => {
      if (e.touches.length !== 1) return
      const touch = e.touches[0]
      startRef.current = { x: touch.clientX, y: touch.clientY, t: Date.now() }
    }

    const handleTouchEnd = (e) => {
      if (!startRef.current) return
      if (e.changedTouches.length !== 1) return

      const touch = e.changedTouches[0]
      const dx = touch.clientX - startRef.current.x
      const dy = touch.clientY - startRef.current.y
      const dt = Date.now() - startRef.current.t

      startRef.current = null

      // Too slow — not a swipe
      if (dt > SWIPE_TIMEOUT) return

      const absDx = Math.abs(dx)
      const absDy = Math.abs(dy)

      // Too short — not a swipe
      if (absDx < SWIPE_THRESHOLD && absDy < SWIPE_THRESHOLD) return

      if (absDx > absDy) {
        onSwipe(dx > 0 ? 'right' : 'left')
      } else {
        onSwipe(dy > 0 ? 'down' : 'up')
      }
    }

    el.addEventListener('touchstart', handleTouchStart, { passive: true })
    el.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      el.removeEventListener('touchstart', handleTouchStart)
      el.removeEventListener('touchend', handleTouchEnd)
    }
  }, [ref, onSwipe])
}

export default useSwipeGesture
