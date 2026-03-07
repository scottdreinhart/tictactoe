import React, { useEffect, useRef, useState, useMemo } from 'react'
import { useTicTacToe } from '../../app/useTicTacToe.js'
import useSoundEffects from '../../app/useSoundEffects.js'
import useTheme from '../../app/useTheme.js'
import { TOKENS } from '../../domain/constants.js'
import GameTitle from '../atoms/GameTitle.jsx'
import DifficultyToggle from '../atoms/DifficultyToggle.jsx'
import SoundToggle from '../atoms/SoundToggle.jsx'
import ThemeSelector from '../atoms/ThemeSelector.jsx'
import ConfettiOverlay from '../atoms/ConfettiOverlay.jsx'
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

  const { soundEnabled, toggleSound, playMove, playWin, playLoss, playDraw } = useSoundEffects()
  const { settings, setColorTheme, setMode, setColorblind } = useTheme()

  // Outcome visual state: 'win' | 'loss' | 'draw' | null
  const [outcome, setOutcome] = useState(null)
  const [showConfetti, setShowConfetti] = useState(false)

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
      // Game just ended — play appropriate sound + set outcome effect
      if (gameState.winner === TOKENS.HUMAN) {
        playWin()
        setOutcome('win')
        setShowConfetti(true)
      } else if (gameState.winner === TOKENS.CPU) {
        playLoss()
        setOutcome('loss')
      } else {
        playDraw()
        setOutcome('draw')
      }
    }

    // Clear outcome when game resets (board goes empty after being non-empty)
    if (!gameState.isOver && prevGameOverRef.current) {
      setOutcome(null)
      setShowConfetti(false)
    }

    prevBoardRef.current = board
    prevGameOverRef.current = gameState.isOver
  }, [board, gameState.isOver, gameState.winner, playMove, playWin, playLoss, playDraw])

  const containerClass = useMemo(() => {
    const classes = ['game-container']
    if (outcome) classes.push(`outcome-${outcome}`)
    return classes.join(' ')
  }, [outcome])

  return (
    <div className={containerClass}>
      {showConfetti && (
        <ConfettiOverlay onDone={() => setShowConfetti(false)} />
      )}
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
