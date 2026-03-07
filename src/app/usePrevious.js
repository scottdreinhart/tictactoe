import { useEffect, useRef } from 'react'

/**
 * usePrevious — Application hook
 *
 * Captures the previous value of any variable across renders.
 * Returns `undefined` on the first render (no previous value yet).
 *
 * @template T
 * @param {T} value — the value to track
 * @returns {T|undefined} — the value from the previous render
 */
const usePrevious = (value) => {
  const ref = useRef(undefined)

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}

export default usePrevious
