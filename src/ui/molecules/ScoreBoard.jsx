import React from 'react'

/**
 * ScoreBoard — Molecule
 *
 * Displays the running score: Human wins, CPU wins, draws.
 *
 * @param {{ score: { X: number, O: number, draws: number } }} props
 */
const ScoreBoard = React.memo(({ score }) => (
  <div className="score-board" aria-label="Score">
    <div className="score-item score-human">
      <span className="score-label">You (X)</span>
      <span className="score-value">{score.X}</span>
    </div>
    <div className="score-item score-draws">
      <span className="score-label">Draws</span>
      <span className="score-value">{score.draws}</span>
    </div>
    <div className="score-item score-cpu">
      <span className="score-label">CPU (O)</span>
      <span className="score-value">{score.O}</span>
    </div>
  </div>
))

ScoreBoard.displayName = 'ScoreBoard'

export default ScoreBoard
