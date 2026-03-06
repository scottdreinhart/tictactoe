import React from 'react'

/**
 * ResetButton — Atom (pure presentational)
 *
 * Renders the reset/new-game button.
 * Contains ZERO game logic.
 *
 * @param {{ onClick: () => void, label: string }} props
 */
const ResetButton = ({ onClick, label = 'Reset Game' }) => (
  <button
    type="button"
    className="reset-button"
    onClick={onClick}
  >
    {label}
  </button>
)

export default ResetButton
