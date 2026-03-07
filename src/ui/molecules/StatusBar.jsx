import React from 'react'
import PropTypes from 'prop-types'

/**
 * StatusBar: Displays current game status with aria-live for accessibility
 *
 * @param {{
 *   statusText: string,
 * }} props
 */
const StatusBar = ({ statusText }) => {
  return (
    <div className="status-bar" role="status" aria-live="polite" aria-atomic="true">
      <p>{statusText}</p>
    </div>
  )
}

StatusBar.propTypes = {
  statusText: PropTypes.string.isRequired,
}

export default StatusBar
