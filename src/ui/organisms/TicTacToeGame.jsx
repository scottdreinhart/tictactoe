import React from 'react'
import { useTicTacToe } from '../../app/useTicTacToe.js'
import GameTitle from '../atoms/GameTitle.jsx'
import DifficultyToggle from '../atoms/DifficultyToggle.jsx'
import StatusBar from '../molecules/StatusBar.jsx'
import BoardGrid from '../molecules/BoardGrid.jsx'
import GameControls from '../molecules/GameControls.jsx'
import ScoreBoard from '../molecules/ScoreBoard.jsx'
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
    score,
    difficulty,
    handleHumanSelect,
    handleFocusChange,
    focusedIndex,
    handleReset,
    handleToggleDifficulty,
  } = useTicTacToe()

  return (
    <div className="game-container">
      <GameTitle text="Tic-Tac-Toe: Human vs CPU" />

      <DifficultyToggle difficulty={difficulty} onToggle={handleToggleDifficulty} />

      <StatusBar statusText={status} />

      <ScoreBoard score={score} />

      <BoardGrid
        board={board}
        focusedIndex={focusedIndex}
        onFocusChange={handleFocusChange}
        onSelect={handleHumanSelect}
        isGameOver={gameState.isOver}
        winLine={gameState.winLine}
      />

      <GameControls onReset={handleReset} />

      <Instructions />
    </div>
  )
}

export default TicTacToeGame
