import React from 'react'
import { useTicTacToe } from '../../app/useTicTacToe.js'
import StatusBar from '../molecules/StatusBar.jsx'
import BoardGrid from '../molecules/BoardGrid.jsx'

/**
 * TicTacToeGame: Main game organism
 * Orchestrates the hook and UI molecules
 */
const TicTacToeGame = () => {
  const { board, gameState, status, handleHumanSelect, handleFocusChange, focusedIndex, handleReset } =
    useTicTacToe()

  return (
    <div className="game-container">
      <h1>Tic-Tac-Toe: Human vs CPU</h1>

      <StatusBar statusText={status} />

      <BoardGrid
        board={board}
        focusedIndex={focusedIndex}
        onFocusChange={handleFocusChange}
        onSelect={handleHumanSelect}
        isGameOver={gameState.isOver}
      />

      <div className="game-controls">
        <button className="reset-button" onClick={handleReset}>
          Reset Game
        </button>
      </div>

      <div className="instructions">
        <h2>How to Play</h2>
        <ul>
          <li>You are X, the CPU is O</li>
          <li>You move first</li>
          <li><strong>Click</strong> a cell, or use <strong>Arrow Keys / WASD</strong> to navigate and <strong>Space/Enter</strong> to select</li>
          <li>First to get 3 in a row wins!</li>
        </ul>
      </div>
    </div>
  )
}

export default TicTacToeGame
