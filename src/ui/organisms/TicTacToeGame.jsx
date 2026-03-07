import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react'
import { useTicTacToe } from '../../app/useTicTacToe.js'
import useSoundEffects from '../../app/useSoundEffects.js'
import useTheme from '../../app/useTheme.js'
import useAutoReset from '../../app/useAutoReset.js'
import useNotificationQueue from '../../app/useNotificationQueue.js'
import { TOKENS } from '../../domain/constants.js'
import DifficultyToggle from '../atoms/DifficultyToggle.jsx'
import SoundToggle from '../atoms/SoundToggle.jsx'
import ThemeSelector from '../molecules/ThemeSelector.jsx'
import HamburgerMenu from '../molecules/HamburgerMenu.jsx'
import ConfettiOverlay from '../atoms/ConfettiOverlay.jsx'
import CoinFlip from '../molecules/CoinFlip.jsx'
import NotificationBanner from '../atoms/NotificationBanner.jsx'
import BoardGrid from '../molecules/BoardGrid.jsx'
import Instructions from '../molecules/Instructions.jsx'
import MoveTimeline from '../molecules/MoveTimeline.jsx'
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
    streak,
    bestTime,
    moveHistory,
    currentMoveIndex,
    canUndo,
    canRedo,
    handleHumanSelect,
    handleFocusChange,
    focusedIndex,
    handleReset,
    handleSetDifficulty,
    handleUndo,
    handleRedo,
    setFirstPlayer,
  } = useTicTacToe()

  const { soundEnabled, toggleSound, playMove, playNav, playTap, playWin, playLoss, playDraw } =
    useSoundEffects()
  const { settings, setColorTheme, setMode, setColorblind } = useTheme()

  // Coin flip state - show at app startup
  const [coinFlipDone, setCoinFlipDone] = useState(false)
  const handleCoinFlipComplete = useCallback(
    (isXFirst) => {
      if (!isXFirst) {
        setFirstPlayer(TOKENS.CPU)
      }
      setCoinFlipDone(true)
    },
    [setFirstPlayer],
  )

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
  }, [
    board,
    gameState.isOver,
    gameState.winner,
    status,
    playMove,
    playWin,
    playLoss,
    playDraw,
    enqueue,
    clearNotifications,
  ])

  // Keep countdown notification's text in sync with secondsLeft
  useEffect(() => {
    if (notification?.variant === 'countdown' && secondsLeft !== null && secondsLeft > 0) {
      updateCurrent({
        message: `New game in ${secondsLeft} ${secondsLeft === 1 ? 'second' : 'seconds'}`,
      })
    }
  }, [secondsLeft, notification?.variant, updateCurrent])

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+Z or Cmd+Z for undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        if (canUndo) {
          handleUndo()
        }
      }
      // Ctrl+Y or Cmd+Shift+Z for redo
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault()
        if (canRedo) {
          handleRedo()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [canUndo, canRedo, handleUndo, handleRedo])

  const containerClass = useMemo(() => {
    const outcomeClass = outcome
      ? styles[`outcome${outcome.charAt(0).toUpperCase() + outcome.slice(1)}`]
      : null
    return cx(styles.root, outcomeClass)
  }, [outcome])

  return (
    <div className={styles.page}>
      <header className={styles.appBar}>
        <h1 className={styles.title}>Tic Tac Toe</h1>
        <HamburgerMenu>
          <div className={styles.menuSection} role="group" aria-label="Difficulty">
            <span className={styles.menuLabel}>Difficulty</span>
            <DifficultyToggle difficulty={difficulty} onSelect={handleSetDifficulty} />
          </div>
          <div className={styles.menuSection} role="group" aria-label="Sound">
            <span className={styles.menuLabel}>Sound</span>
            <SoundToggle soundEnabled={soundEnabled} onToggle={toggleSound} />
          </div>
          <div className={styles.menuSection} role="group" aria-label="Theme">
            <span className={styles.menuLabel}>Theme</span>
            <ThemeSelector
              settings={settings}
              onColorTheme={setColorTheme}
              onMode={setMode}
              onColorblind={setColorblind}
            />
          </div>
          <div className={styles.menuSection} role="group" aria-label="Help">
            <span className={styles.menuLabel}>Help</span>
            <Instructions />
          </div>
        </HamburgerMenu>
      </header>

      <div className={containerClass}>
        {!coinFlipDone && <CoinFlip onFlipComplete={handleCoinFlipComplete} />}
        <a href="#game-board" className={styles.skipToContent}>
          Skip to game board
        </a>
        {showConfetti && (
          <ConfettiOverlay
            className={styles.confettiCanvas}
            onDone={() => setShowConfetti(false)}
          />
        )}

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
          <NotificationBanner notification={notification} onDismiss={dismiss} onAction={resetNow} />
        </div>

        <MoveTimeline
          moveHistory={moveHistory}
          currentIndex={currentMoveIndex}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={canUndo}
          canRedo={canRedo}
          score={score}
          streak={streak}
          bestTime={bestTime}
        />
      </div>
    </div>
  )
}

export default TicTacToeGame
