import React from 'react'
import PropTypes from 'prop-types'
import ResetButton from '../atoms/ResetButton.jsx'

/**
 * GameControls — Molecule
 *
 * Groups game action buttons (currently just reset).
 * Composes the ResetButton atom.
 *
 * @param {{ onReset: () => void }} props
 */
const GameControls = ({ onReset }) => (
  <div className="game-controls">
    <ResetButton onClick={onReset} />
  </div>
)

GameControls.propTypes = {
  onReset: PropTypes.func.isRequired,
}

export default GameControls
