import React from 'react'

/**
 * GameTitle — Atom (pure presentational)
 *
 * Renders the main heading for the game.
 *
 * @param {{ text: string }} props
 */
const GameTitle = ({ text }) => (
  <h1>{text}</h1>
)

export default GameTitle
