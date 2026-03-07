import React, { useEffect, useRef } from 'react'
import { useTicTacToe } from '../../app/useTicTacToe.js'
import useSoundEffects from '../../app/useSoundEffects.js'
import useTheme from '../../app/useTheme.js'
import GameTitle from '../atoms/GameTitle.jsx'
import DifficultyToggle from '../atoms/DifficultyToggle.jsx'
import SoundToggle from '../atoms/SoundToggle.jsx'
import ThemeSelector from '../atoms/ThemeSelector.jsx'
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
 *
 * Sound effects are wired here by reacting to game-state changes.
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
    handleSetDifficulty,
  } = useTicTacToe()

  const { soundEnabled, toggleSound, playMove, playWin, playDraw } = useSoundEffects()
  const { settings, setColorTheme, setMode, setColorblind } = useTheme()

  // Track previous board to detect moves (for move sound)
  const prevBoardRef = useRef(board)
  const prevGameOverRef = useRef(false)

  useEffect(() => {
    const boardChanged = prevBoardRef.current !== board
    const justEnded = gameState.isOver && !prevGameOverRef.current

    if (boardChanged && !justEnded) {
      // A move was placed but game didn't just end — play move sound
      playMove()
    }

    if (justEnded) {
      // Game just ended — play appropriate sound
      if (gameState.winner) {
        playWin()
      } else {
        playDraw()
      }
    }

    prevBoardRef.current = board
    prevGameOverRef.current = gameState.isOver
  }, [board, gameState.isOver, gameState.winner, playMove, playWin, playDraw])

  return (
    <div className="game-container">
      <GameTitle text="Tic-Tac-Toe: Human vs CPU" />

      <div className="game-toolbar">
        <DifficultyToggle difficulty={difficulty} onSelect={handleSetDifficulty} />
        <SoundToggle soundEnabled={soundEnabled} onToggle={toggleSound} />
        <ThemeSelector
          settings={settings}
          onColorTheme={setColorTheme}
          onMode={setMode}
          onColorblind={setColorblind}
        />
      </div>

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
