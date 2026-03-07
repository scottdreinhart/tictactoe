import React from 'react'
import PropTypes from 'prop-types'

/**
 * GameTitle — Atom (pure presentational)
 *
 * Renders the main heading for the game.
 *
 * @param {{ text: string }} props
 */
const GameTitle = React.memo(({ text }) => (
  <h1>{text}</h1>
))

GameTitle.displayName = 'GameTitle'

GameTitle.propTypes = {
  text: PropTypes.string.isRequired,
}

export default GameTitle
