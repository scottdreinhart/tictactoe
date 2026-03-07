import React from 'react'
import PropTypes from 'prop-types'

/**
 * ResetButton — Atom (pure presentational)
 *
 * Renders the reset/new-game button.
 * Contains ZERO game logic.
 *
 * @param {{ onClick: () => void, label: string }} props
 */
const ResetButton = React.memo(({ onClick, label = 'Reset Game' }) => (
  <button
    type="button"
    className="reset-button"
    onClick={onClick}
  >
    {label}
  </button>
))

ResetButton.displayName = 'ResetButton'

ResetButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  label: PropTypes.string,
}

export default ResetButton
