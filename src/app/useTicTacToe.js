import { useCallback } from 'react'
import { TOKENS } from '../domain/constants.js'
import useGameBoard, { ACTIONS } from './useGameBoard.js'
import useGameStats from './useGameStats.js'
import useCpuPlayer from './useCpuPlayer.js'

// ── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useTicTacToe — application hook (composition layer)
 *
 * Composes three focused hooks into a single public API:
 *   useGameBoard  – reducer, turn, focus, history
 *   useGameStats  – score, streak, best time
 *   useCpuPlayer  – AI difficulty, Web Worker scheduling
 *
 * The returned object is identical to the original monolithic hook,
 * so no consumers need to change.
 */
export const useTicTacToe = () => {
  // ── Board state ──────────────────────────────────────────────────────────
  const {
    board,
    turn,
    focusedIndex,
    gameState,
    status,
    gameStartTime,
    moveHistory,
    currentMoveIndex,
    canUndo,
    canRedo,
    handleHumanSelect,
    handleFocusChange,
    handleReset: boardReset,
    handleUndo,
    handleRedo,
    setFirstPlayer,
    dispatch,
  } = useGameBoard()

  // ── Stats ────────────────────────────────────────────────────────────────
  const { score, streak, bestTime } = useGameStats(gameState, currentMoveIndex, gameStartTime)

  // ── CPU / AI ─────────────────────────────────────────────────────────────
  const onCpuMove = useCallback(
    (index) => {
      dispatch({ type: ACTIONS.CPU_MOVE, payload: { index } })
    },
    [dispatch],
  )

  const { difficulty, handleSetDifficulty, cancelPendingMove } = useCpuPlayer({
    turn,
    board,
    isGameOver: gameState.isOver,
    onCpuMove,
  })

  // Wrap reset to also cancel any pending CPU move
  const handleReset = useCallback(() => {
    cancelPendingMove()
    boardReset()
  }, [cancelPendingMove, boardReset])

  return {
    board,
    turn,
    focusedIndex,
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
    handleReset,
    handleSetDifficulty,
    handleUndo,
    handleRedo,
    setFirstPlayer,
  }
}
