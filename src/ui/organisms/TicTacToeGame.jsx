import React, { useEffect, useRef, useState, useMemo } from 'react'
import { useTicTacToe } from '../../app/useTicTacToe.js'
import useSoundEffects from '../../app/useSoundEffects.js'
import useTheme from '../../app/useTheme.js'
import useAutoReset from '../../app/useAutoReset.js'
import useNotificationQueue from '../../app/useNotificationQueue.js'
import { TOKENS } from '../../domain/constants.js'
import DifficultyToggle from '../atoms/DifficultyToggle.jsx'
import SoundToggle from '../atoms/SoundToggle.jsx'
import ThemeSelector from '../atoms/ThemeSelector.jsx'
import HamburgerMenu from '../atoms/HamburgerMenu.jsx'
import ConfettiOverlay from '../atoms/ConfettiOverlay.jsx'
import NotificationBanner from '../atoms/NotificationBanner.jsx'
import BoardGrid from '../molecules/BoardGrid.jsx'
import ScoreBoard from '../molecules/ScoreBoard.jsx'
import Instructions from '../molecules/Instructions.jsx'
import styles from './TicTacToeGame.module.css'
import { cx } from '../utils/cssModules.js'

/**
 * TicTacToeGame — Organism
 *
 * Top-level game component. Orchestrates the application hook
 * and composes atoms / molecules — contains ZERO inline markup
 * beyond the wrapping container div.
 *
 * All transient status (outcome, countdown, reset) is communicated
 * via a notification queue that renders over the board's center row.
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

  const { soundEnabled, toggleSound, playMove, playNav, playTap, playWin, playLoss, playDraw } = useSoundEffects()
  const { settings, setColorTheme, setMode, setColorblind } = useTheme()

  // Auto-reset countdown (30 s)
  const { secondsLeft, resetNow } = useAutoReset(gameState.isOver, handleReset)

  // Notification queue — unified status / countdown / reset messaging
  const {
    current: notification,
    enqueue,
    dismiss,
    clear: clearNotifications,
    updateCurrent,
  } = useNotificationQueue()

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
      playMove()
    }

    if (justEnded) {
      let outcomeType = 'draw'
      if (gameState.winner === TOKENS.HUMAN) {
        playWin()
        outcomeType = 'win'
        setShowConfetti(true)
      } else if (gameState.winner === TOKENS.CPU) {
        playLoss()
        outcomeType = 'loss'
      } else {
        playDraw()
      }
      setOutcome(outcomeType)

      // Queue: outcome announcement → countdown with reset action
      enqueue({ message: status, variant: outcomeType, duration: 4000 })
      enqueue({
        message: 'New game in 30 seconds',
        variant: 'countdown',
        duration: 0,
        hasAction: true,
      })
    }

    // Clear everything when game resets
    if (!gameState.isOver && prevGameOverRef.current) {
      setOutcome(null)
      setShowConfetti(false)
      clearNotifications()
    }

    prevBoardRef.current = board
    prevGameOverRef.current = gameState.isOver
  }, [board, gameState.isOver, gameState.winner, status, playMove, playWin, playLoss, playDraw, enqueue, clearNotifications])

  // Keep countdown notification's text in sync with secondsLeft
  useEffect(() => {
    if (notification?.variant === 'countdown' && secondsLeft !== null && secondsLeft > 0) {
      updateCurrent({
        message: `New game in ${secondsLeft} ${secondsLeft === 1 ? 'second' : 'seconds'}`,
      })
    }
  }, [secondsLeft, notification?.variant, updateCurrent])

  const containerClass = useMemo(() => {
    const outcomeClass = outcome ? styles[`outcome${outcome.charAt(0).toUpperCase() + outcome.slice(1)}`] : null
    return cx(styles.root, outcomeClass)
  }, [outcome])

  return (
    <div className={containerClass}>
      <a href="#game-board" className={styles.skipToContent}>Skip to game board</a>
      {showConfetti && (
        <ConfettiOverlay onDone={() => setShowConfetti(false)} />
      )}
      <HamburgerMenu>
        <div className="menu-section" role="group" aria-label="Difficulty">
          <span className="menu-section-label">Difficulty</span>
          <DifficultyToggle difficulty={difficulty} onSelect={handleSetDifficulty} />
        </div>
        <div className="menu-section" role="group" aria-label="Sound">
          <span className="menu-section-label">Sound</span>
          <SoundToggle soundEnabled={soundEnabled} onToggle={toggleSound} />
        </div>
        <div className="menu-section" role="group" aria-label="Theme">
          <span className="menu-section-label">Theme</span>
          <ThemeSelector
            settings={settings}
            onColorTheme={setColorTheme}
            onMode={setMode}
            onColorblind={setColorblind}
          />
        </div>
        <div className="menu-section" role="group" aria-label="Help">
          <span className="menu-section-label">Help</span>
          <Instructions />
        </div>
      </HamburgerMenu>

      <ScoreBoard score={score} />

      <div className={styles.boardArea} id="game-board">
        <BoardGrid
          board={board}
          focusedIndex={focusedIndex}
          onFocusChange={handleFocusChange}
          onSelect={handleHumanSelect}
          isGameOver={gameState.isOver}
          winLine={gameState.winLine}
          onNav={playNav}
          onTap={playTap}
        />
        <NotificationBanner
          notification={notification}
          onDismiss={dismiss}
          onAction={resetNow}
        />
      </div>
    </div>
  )
}

export default TicTacToeGame
