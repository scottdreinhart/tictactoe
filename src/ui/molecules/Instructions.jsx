import React from 'react'

/**
 * Instructions — Molecule
 *
 * Renders the "How to Play" section with control hints.
 * Composed of heading + unordered list — more than one element,
 * so it qualifies as a molecule in Atomic Design.
 */
const Instructions = () => (
  <div className="instructions">
    <h2>How to Play</h2>
    <ul>
      <li>You are X, the CPU is O</li>
      <li>You move first</li>
      <li>
        <strong>Click</strong> a cell, or use{' '}
        <strong>Arrow Keys / WASD</strong> to navigate and{' '}
        <strong>Space/Enter</strong> to select
      </li>
      <li>First to get 3 in a row wins!</li>
    </ul>
  </div>
)

export default Instructions
