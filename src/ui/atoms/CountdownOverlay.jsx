import React from 'react'
import PropTypes from 'prop-types'

/**
 * CountdownOverlay — Atom
 *
 * Semi-transparent overlay displayed on top of the board grid
 * showing the seconds remaining until auto-reset.
 *
 * @param {{ seconds: number }} props
 */
const CountdownOverlay = React.memo(({ seconds }) => (
  <div className="countdown-overlay" aria-live="polite" aria-atomic="true">
    <span className="countdown-overlay__number">{seconds}</span>
    <span className="countdown-overlay__label">seconds</span>
  </div>
))

CountdownOverlay.displayName = 'CountdownOverlay'

CountdownOverlay.propTypes = {
  seconds: PropTypes.number.isRequired,
}

export default CountdownOverlay
