import { useEffect, useRef } from 'react'

import type { SwipeDirection } from '../domain/types.ts'

const SWIPE_THRESHOLD = 30
const SWIPE_TIMEOUT = 300

const useSwipeGesture = (
  ref: React.RefObject<HTMLElement | null>,
  onSwipe: (direction: SwipeDirection) => void,
): void => {
  const startRef = useRef<{ x: number; y: number; t: number } | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return
      const touch = e.touches[0]
      if (!touch) return
      startRef.current = { x: touch.clientX, y: touch.clientY, t: Date.now() }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (!startRef.current) return
      if (e.changedTouches.length !== 1) return

      const touch = e.changedTouches[0]
      if (!touch) return
      const dx = touch.clientX - startRef.current.x
      const dy = touch.clientY - startRef.current.y
      const dt = Date.now() - startRef.current.t

      startRef.current = null

      if (dt > SWIPE_TIMEOUT) return

      const absDx = Math.abs(dx)
      const absDy = Math.abs(dy)

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
