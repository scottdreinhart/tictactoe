import { useEffect, useRef, useCallback } from 'react'

/**
 * useWebWorker — Application hook
 *
 * Manages the lifecycle of a Web Worker instance:
 * - Creates the worker on mount
 * - Terminates the worker on unmount
 * - Provides a stable `postMessage` function
 * - Allows setting an `onMessage` callback that can change over time
 *
 * @param {() => Worker} factory — zero-arg function that creates the Worker
 *   Example: () => new Worker(new URL('../workers/ai.worker.js', import.meta.url), { type: 'module' })
 *
 * @returns {{
 *   postMessage: (data: *) => void,
 *   setOnMessage: (handler: ((event: MessageEvent) => void) | null) => void,
 *   workerRef: React.MutableRefObject<Worker|null>,
 * }}
 */
const useWebWorker = (factory) => {
  const workerRef = useRef(null)

  // Create worker on mount, terminate on unmount
  useEffect(() => {
    workerRef.current = factory()

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate()
        workerRef.current = null
      }
    }
    // factory identity should be stable (caller wraps in useCallback or module-level fn)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /** Send a message to the worker (no-op if worker is terminated). */
  const postMessage = useCallback((data) => {
    workerRef.current?.postMessage(data)
  }, [])

  /** Replace the worker's onmessage handler (pass null to clear). */
  const setOnMessage = useCallback((handler) => {
    if (workerRef.current) {
      workerRef.current.onmessage = handler
    }
  }, [])

  return { postMessage, setOnMessage, workerRef }
}

export default useWebWorker
