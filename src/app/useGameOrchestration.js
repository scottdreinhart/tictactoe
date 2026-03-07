import { useEffect, useMemo, useState } from 'react'
import { TOKENS } from '../domain/constants.js'
import usePrevious from './usePrevious.js'

/**
 * useGameOrchestration — Application hook
 *
 * Bridges game-state transitions to side-effects (sounds, confetti,
 * notifications, countdown sync). Extracted from TicTacToeGame to
 * keep the organism free of imperative orchestration logic.
 *
 * @param {{
 *   board: Array,
 *   gameState: { isOver: boolean, winner: string|null, isDraw: boolean },
 *   status: string,
 *   secondsLeft: number|null,
 *   notification: object|null,
 *   sounds: { playMove, playWin, playLoss, playDraw },
 *   notifications: { enqueue, clear, updateCurrent },
 * }} deps
 *
 * @returns {{ outcome: string|null, showConfetti: boolean, setShowConfetti, containerClass: string }}
 */
const useGameOrchestration = ({
  board,
  gameState,
  status,
  secondsLeft,
  notification,
  sounds,
  notifications,
  outcomeStyles,
  rootClass,
  cx,
}) => {
  const [outcome, setOutcome] = useState(null)
  const [showConfetti, setShowConfetti] = useState(false)

  const prevBoard = usePrevious(board)
  const prevGameOver = usePrevious(gameState.isOver)

  // Detect moves, game-over, and reset
  useEffect(() => {
    const boardChanged = prevBoard !== undefined && prevBoard !== board
    const justEnded = gameState.isOver && !prevGameOver

    if (boardChanged && !justEnded) {
      sounds.playMove()
    }

    if (justEnded) {
      let outcomeType = 'draw'
      if (gameState.winner === TOKENS.HUMAN) {
        sounds.playWin()
        outcomeType = 'win'
        setShowConfetti(true)
      } else if (gameState.winner === TOKENS.CPU) {
        sounds.playLoss()
        outcomeType = 'loss'
      } else {
        sounds.playDraw()
      }
      setOutcome(outcomeType)

      notifications.enqueue({ message: status, variant: outcomeType, duration: 4000 })
      notifications.enqueue({
        message: 'New game in 30 seconds',
        variant: 'countdown',
        duration: 0,
        hasAction: true,
      })
    }

    // Clear everything when game resets
    if (!gameState.isOver && prevGameOver) {
      setOutcome(null)
      setShowConfetti(false)
      notifications.clear()
    }
  }, [
    board,
    gameState.isOver,
    gameState.winner,
    status,
    sounds,
    notifications,
    prevBoard,
    prevGameOver,
  ])

  // Keep countdown notification's text in sync with secondsLeft
  useEffect(() => {
    if (notification?.variant === 'countdown' && secondsLeft !== null && secondsLeft > 0) {
      notifications.updateCurrent({
        message: `New game in ${secondsLeft} ${secondsLeft === 1 ? 'second' : 'seconds'}`,
      })
    }
  }, [secondsLeft, notification?.variant, notifications])

  // Container CSS class reflecting outcome
  const containerClass = useMemo(() => {
    const outcomeClass = outcome ? outcomeStyles[outcome] : null
    return cx(rootClass, outcomeClass)
  }, [outcome, outcomeStyles, rootClass, cx])

  return { outcome, showConfetti, setShowConfetti, containerClass }
}

export default useGameOrchestration
