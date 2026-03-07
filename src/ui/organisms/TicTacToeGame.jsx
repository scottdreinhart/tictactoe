import React, { useCallback, useMemo, useState } from 'react'
import { useTicTacToe } from '../../app/useTicTacToe.js'
import useSoundEffects from '../../app/useSoundEffects.js'
import useTheme from '../../app/useTheme.js'
import useAutoReset from '../../app/useAutoReset.js'
import useNotificationQueue from '../../app/useNotificationQueue.js'
import useKeyboardShortcuts from '../../app/useKeyboardShortcuts.js'
import useGameOrchestration from '../../app/useGameOrchestration.js'
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
 * Top-level game component. Orchestrates the application hooks
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

  // Stable references for orchestration hook
  const sounds = useMemo(
    () => ({ playMove, playWin, playLoss, playDraw }),
    [playMove, playWin, playLoss, playDraw],
  )
  const notifications = useMemo(
    () => ({ enqueue, clear: clearNotifications, updateCurrent }),
    [enqueue, clearNotifications, updateCurrent],
  )

  // Outcome styles lookup for orchestration
  const outcomeStyles = useMemo(
    () => ({
      win: styles.outcomeWin,
      loss: styles.outcomeLoss,
      draw: styles.outcomeDraw,
    }),
    [],
  )

  // Game orchestration — sounds, confetti, notifications, outcome CSS
  const { showConfetti, setShowConfetti, containerClass } = useGameOrchestration({
    board,
    gameState,
    status,
    secondsLeft,
    notification,
    sounds,
    notifications,
    outcomeStyles,
    rootClass: styles.root,
    cx,
  })

  // Keyboard shortcuts for undo/redo
  const shortcuts = useMemo(
    () => [
      { key: 'z', ctrl: true, shift: false, handler: handleUndo, enabled: canUndo },
      { key: 'y', ctrl: true, handler: handleRedo, enabled: canRedo },
      { key: 'z', ctrl: true, shift: true, handler: handleRedo, enabled: canRedo },
    ],
    [canUndo, canRedo, handleUndo, handleRedo],
  )
  useKeyboardShortcuts(shortcuts)

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
