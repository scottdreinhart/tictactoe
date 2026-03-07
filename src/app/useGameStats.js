import { useEffect, useState } from 'react'
import { TOKENS } from '../domain/constants.js'
import usePrevious from './usePrevious.js'

/**
 * useGameStats — Application hook
 *
 * Tracks score, win-streak, and best win time.
 * Reacts to game-over transitions detected via `usePrevious`.
 *
 * Split from useTicTacToe to isolate statistics concerns.
 *
 * @param {{ isOver: boolean, winner: string|null }} gameState
 * @param {number} historyIndex — current undo/redo position
 * @param {number|null} gameStartTime — timestamp of first move
 *
 * @returns {{ score, streak, bestTime }}
 */
const useGameStats = (gameState, historyIndex, gameStartTime) => {
  const [score, setScore] = useState({ [TOKENS.HUMAN]: 0, [TOKENS.CPU]: 0, draws: 0 })
  const [streak, setStreak] = useState(0)
  const [bestTime, setBestTime] = useState(null)

  const prevGameOver = usePrevious(gameState.isOver)
  const prevHistoryIndex = usePrevious(historyIndex)

  // Track score and streak when game ends
  useEffect(() => {
    const justEnded = gameState.isOver && !prevGameOver

    if (!justEnded) return

    // Check if undo happened since last move (streak break)
    const undoHappened = prevHistoryIndex !== undefined && historyIndex < prevHistoryIndex

    if (undoHappened && gameState.winner === TOKENS.HUMAN) {
      setStreak(0)
    }

    setScore((prev) => {
      const newScore = { ...prev }
      if (gameState.winner) {
        newScore[gameState.winner] = prev[gameState.winner] + 1

        if (gameState.winner === TOKENS.HUMAN && !undoHappened) {
          setStreak((s) => s + 1)
        } else if (gameState.winner === TOKENS.HUMAN && undoHappened) {
          setStreak(0)
        } else if (gameState.winner === TOKENS.CPU) {
          setStreak(0)
        }

        if (gameState.winner === TOKENS.HUMAN && gameStartTime !== null) {
          const winTime = (Date.now() - gameStartTime) / 1000
          setBestTime((prev) => (prev === null || winTime < prev ? winTime : prev))
        }
      } else {
        newScore.draws = prev.draws + 1
        setStreak(0)
      }
      return newScore
    })
  }, [
    gameState.isOver,
    gameState.winner,
    historyIndex,
    gameStartTime,
    prevGameOver,
    prevHistoryIndex,
  ])

  return { score, streak, bestTime }
}

export default useGameStats
