import { useEffect, useState } from 'react'

/**
 * useSmartPosition — Application hook
 *
 * Detects the best horizontal alignment (left/right) for a dropdown/tooltip
 * to avoid viewport overflow. Encapsulates positioning logic for reuse.
 *
 * SOLID: Dependency Inversion + Open/Closed
 * - Dropdowns (Hamburger, Instructions) depend on this abstraction, not impl details
 * - Positioning logic in one place — extend via config, not modification
 *
 * @param {Object} config
 *   - trigger: ref to trigger button
 *   - panel: ref to panel element
 *   - minPanelWidth: panel's minimum width (px)
 *   - viewportPadding: safe margin from viewport edge (px)
 *   - preferredAlignment: 'left' | 'right' (default preferred)
 *
 * @returns {string} — 'left' | 'right'
 */
const useSmartPosition = ({
  trigger,
  panel,
  minPanelWidth = 240,
  viewportPadding = 16,
  preferredAlignment = 'right',
} = {}) => {
  const [alignment, setAlignment] = useState(preferredAlignment)

  useEffect(() => {
    if (!trigger?.current || !panel?.current) return

    // Measure trigger position
    const triggerRect = trigger.current.getBoundingClientRect()

    // Compute overflow for each direction
    const rightEdge = triggerRect.right + minPanelWidth
    const wouldOverflowRight = rightEdge + viewportPadding > window.innerWidth

    const leftEdge = triggerRect.left - minPanelWidth
    const wouldOverflowLeft = leftEdge - viewportPadding < 0

    // Smart selection: prefer requested, flip if it would overflow
    let newAlignment = preferredAlignment
    if (preferredAlignment === 'right' && wouldOverflowRight && !wouldOverflowLeft) {
      newAlignment = 'left'
    } else if (preferredAlignment === 'left' && wouldOverflowLeft && !wouldOverflowRight) {
      newAlignment = 'right'
    }

    setAlignment(newAlignment)
  }, [trigger, panel, minPanelWidth, viewportPadding, preferredAlignment])

  return alignment
}

export default useSmartPosition
