import { useReducer, useRef, useEffect, useCallback, useMemo } from 'react'
import { createEmptyBoard, applyMove, isCellEmpty } from '../domain/board.js'
import { getGameState } from '../domain/rules.js'
import { chooseCpuMoveRandom } from '../domain/ai.js'
import { TOKENS } from '../domain/constants.js'

// ── Actions ──────────────────────────────────────────────────────────────────

const ACTIONS = {
  HUMAN_MOVE: 'HUMAN_MOVE',
  CPU_MOVE: 'CPU_MOVE',
  SET_FOCUSED_INDEX: 'SET_FOCUSED_INDEX',
  RESET: 'RESET',
}

// ── Initial state factory ────────────────────────────────────────────────────

const createInitialState = () => ({
  board: createEmptyBoard(),
  turn: TOKENS.HUMAN,
  focusedIndex: 4, // center cell
})

// ── Reducer ──────────────────────────────────────────────────────────────────
// All game-state transitions happen here, using domain functions.
// No side-effects, no async — pure state machine.

const gameReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.HUMAN_MOVE: {
      const { index } = action.payload
      if (state.turn !== TOKENS.HUMAN) return state
      if (!isCellEmpty(state.board, index)) return state

      const board = applyMove(state.board, index, TOKENS.HUMAN)
      const { isOver } = getGameState(board)

      return {
        ...state,
        board,
        // If game ended, keep turn as HUMAN (no CPU move needed).
        // Otherwise signal that CPU should play.
        turn: isOver ? TOKENS.HUMAN : TOKENS.CPU,
      }
    }

    case ACTIONS.CPU_MOVE: {
      if (state.turn !== TOKENS.CPU) return state

      const { isOver: alreadyOver } = getGameState(state.board)
      if (alreadyOver) return state

      let cpuIndex
      try {
        cpuIndex = chooseCpuMoveRandom(state.board)
      } catch {
        return state // no moves available
      }

      const board = applyMove(state.board, cpuIndex, TOKENS.CPU)
      return {
        ...state,
        board,
        turn: TOKENS.HUMAN, // always return control to human
      }
    }

    case ACTIONS.SET_FOCUSED_INDEX: {
      const idx = action.payload
      if (idx < 0 || idx >= 9) return state
      return { ...state, focusedIndex: idx }
    }

    case ACTIONS.RESET:
      return createInitialState()

    default:
      return state
  }
}

// ── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useTicTacToe — application hook
 *
 * Manages board state, turn state, focus state, and CPU scheduling.
 * All game logic delegates to domain/ pure functions via the reducer.
 */
export const useTicTacToe = () => {
  const [state, dispatch] = useReducer(gameReducer, null, createInitialState)
  const cpuTimeoutRef = useRef(null)

  // Derive game state from board (pure, no side-effects)
  const gameState = useMemo(() => getGameState(state.board), [state.board])

  // Derive status text
  const status = useMemo(() => {
    if (gameState.winner) return `${gameState.winner} wins!`
    if (gameState.isDraw) return 'Draw!'
    return `${state.turn}'s turn`
  }, [gameState, state.turn])

  // ── Handlers (stable references via useCallback) ─────────────────────────

  const handleHumanSelect = useCallback(
    (index) => {
      dispatch({ type: ACTIONS.HUMAN_MOVE, payload: { index } })
    },
    []
  )

  const handleFocusChange = useCallback(
    (index) => {
      dispatch({ type: ACTIONS.SET_FOCUSED_INDEX, payload: index })
    },
    []
  )

  const handleReset = useCallback(() => {
    if (cpuTimeoutRef.current !== null) {
      clearTimeout(cpuTimeoutRef.current)
      cpuTimeoutRef.current = null
    }
    dispatch({ type: ACTIONS.RESET })
  }, [])

  // ── Effects ──────────────────────────────────────────────────────────────

  // Schedule CPU move when turn switches to CPU
  useEffect(() => {
    if (state.turn !== TOKENS.CPU) return
    if (gameState.isOver) return

    cpuTimeoutRef.current = setTimeout(() => {
      dispatch({ type: ACTIONS.CPU_MOVE })
      cpuTimeoutRef.current = null
    }, 250)

    return () => {
      if (cpuTimeoutRef.current !== null) {
        clearTimeout(cpuTimeoutRef.current)
        cpuTimeoutRef.current = null
      }
    }
  }, [state.turn, gameState.isOver])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cpuTimeoutRef.current !== null) {
        clearTimeout(cpuTimeoutRef.current)
      }
    }
  }, [])

  return {
    board: state.board,
    turn: state.turn,
    focusedIndex: state.focusedIndex,
    gameState,
    status,
    handleHumanSelect,
    handleFocusChange,
    handleReset,
  }
}
