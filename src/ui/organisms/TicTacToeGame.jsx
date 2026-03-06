import React from 'react'
import { useTicTacToe } from '../../app/useTicTacToe.js'
import GameTitle from '../atoms/GameTitle.jsx'
import StatusBar from '../molecules/StatusBar.jsx'
import BoardGrid from '../molecules/BoardGrid.jsx'
import GameControls from '../molecules/GameControls.jsx'
import Instructions from '../molecules/Instructions.jsx'

/**
 * TicTacToeGame — Organism
 *
 * Top-level game component. Orchestrates the application hook
 * and composes atoms / molecules — contains ZERO inline markup
 * beyond the wrapping container div.
 */
const TicTacToeGame = () => {
  const {
    board,
    gameState,
    status,
    handleHumanSelect,
    handleFocusChange,
    focusedIndex,
    handleReset,
  } = useTicTacToe()

  return (
    <div className="game-container">
      <GameTitle text="Tic-Tac-Toe: Human vs CPU" />

      <StatusBar statusText={status} />

      <BoardGrid
        board={board}
        focusedIndex={focusedIndex}
        onFocusChange={handleFocusChange}
        onSelect={handleHumanSelect}
        isGameOver={gameState.isOver}
      />

      <GameControls onReset={handleReset} />

      <Instructions />
    </div>
  )
}

export default TicTacToeGame
