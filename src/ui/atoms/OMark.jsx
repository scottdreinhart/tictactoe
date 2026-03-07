import React from 'react'

/**
 * OMark — Atom
 * Animated SVG "O" drawn as a circle.
 * Uses CSS stroke-dasharray / stroke-dashoffset for a draw-on effect.
 */
const OMark = React.memo(() => (
  <svg
    className="mark mark-o"
    viewBox="0 0 100 100"
    aria-hidden="true"
  >
    <circle cx="50" cy="50" r="30" />
  </svg>
))

OMark.displayName = 'OMark'

export default OMark
