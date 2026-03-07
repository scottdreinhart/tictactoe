import { useCallback, useRef, useState } from 'react'

/**
 * Default auto-dismiss duration for notifications (ms).
 * Use 0 for notifications that should stay until manually dismissed.
 */
const DEFAULT_DURATION = 10000

/**
 * useNotificationQueue — Application hook
 *
 * Manages a FIFO queue of notifications. The `current` notification
 * is the head of the queue — it's what the UI should render.
 *
 * Each notification can auto-dismiss after `duration` milliseconds
 * (set duration to 0 for persistent notifications like countdowns).
 *
 * Designed to feed a single NotificationBanner that overlays the
 * game board — messages queue up when events stack.
 *
 * @returns {{
 *   current: object|null,
 *   enqueue: (notification: object) => void,
 *   dismiss: () => void,
 *   clear: () => void,
 *   updateCurrent: (updates: object) => void,
 * }}
 */
const useNotificationQueue = () => {
  const [queue, setQueue] = useState([])
  const idRef = useRef(0)

  /** Add a notification to the end of the queue. */
  const enqueue = useCallback(
    ({ message, variant = 'info', duration = DEFAULT_DURATION, hasAction = false }) => {
      idRef.current += 1
      const id = idRef.current
      setQueue((prev) => [...prev, { id, message, variant, duration, hasAction }])
    },
    [],
  )

  /** Dismiss the current (head) notification, advancing the queue. */
  const dismiss = useCallback(() => {
    setQueue((prev) => prev.slice(1))
  }, [])

  /** Clear the entire queue (e.g. on game reset). */
  const clear = useCallback(() => {
    setQueue([])
  }, [])

  /** Merge partial updates into the current (head) notification. */
  const updateCurrent = useCallback((updates) => {
    setQueue((prev) => {
      if (prev.length === 0) return prev
      const [head, ...rest] = prev
      return [{ ...head, ...updates }, ...rest]
    })
  }, [])

  const current = queue.length > 0 ? queue[0] : null

  return { current, enqueue, dismiss, clear, updateCurrent }
}

export default useNotificationQueue
