import React from 'react'
import PropTypes from 'prop-types'

/**
 * XMark — Atom
 * Animated SVG "X" drawn with two crossing lines.
 * Uses CSS stroke-dasharray / stroke-dashoffset for a draw-on effect.
 */
const XMark = React.memo(({ className }) => (
  <svg className={className} viewBox="0 0 100 100" aria-hidden="true">
    <line x1="20" y1="20" x2="80" y2="80" />
    <line x1="80" y1="20" x2="20" y2="80" />
  </svg>
))

XMark.displayName = 'XMark'

XMark.propTypes = {
  className: PropTypes.string,
}

export default XMark
