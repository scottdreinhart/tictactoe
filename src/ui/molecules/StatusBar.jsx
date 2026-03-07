import React from 'react'
import PropTypes from 'prop-types'

/**
 * StatusBar: Displays current game status with aria-live for accessibility.
 *
 * When `isOverlay` is true the bar renders as a floating banner on top
 * of the board (used for win / loss / draw announcements).
 *
 * @param {{ statusText: string, isOverlay: boolean, outcome: string|null }} props
 */
const StatusBar = ({ statusText, isOverlay = false, outcome = null }) => {
  const className = [
    'status-bar',
    isOverlay ? 'status-bar--overlay' : '',
    outcome ? `status-bar--${outcome}` : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={className} role="status" aria-live="polite" aria-atomic="true">
      <p>{statusText}</p>
    </div>
  )
}

StatusBar.propTypes = {
  statusText: PropTypes.string.isRequired,
  isOverlay: PropTypes.bool,
  outcome: PropTypes.string,
}

export default StatusBar
