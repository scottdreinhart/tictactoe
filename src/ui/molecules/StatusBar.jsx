import React from 'react'

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

export default StatusBar
