import { useReducer, useRef, useEffect, useCallback, useMemo, useState } from 'react'
import { createEmptyBoard, applyMove, isCellEmpty } from '../domain/board.js'
import { getGameState } from '../domain/rules.js'
import { TOKENS, CPU_DELAY_MS } from '../domain/constants.js'

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
      const { index } = action.payload
      const board = applyMove(state.board, index, TOKENS.CPU)
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
  const workerRef = useRef(null)
  const [score, setScore] = useState({ [TOKENS.HUMAN]: 0, [TOKENS.CPU]: 0, draws: 0 })
  const [difficulty, setDifficulty] = useState('medium')
  const prevGameOverRef = useRef(false)

  // Derive game state from board (pure, no side-effects)
  const gameState = useMemo(() => getGameState(state.board), [state.board])

  // Track score when game ends
  useEffect(() => {
    if (gameState.isOver && !prevGameOverRef.current) {
      setScore((prev) => {
        if (gameState.winner) {
          return { ...prev, [gameState.winner]: prev[gameState.winner] + 1 }
        }
        return { ...prev, draws: prev.draws + 1 }
      })
    }
    prevGameOverRef.current = gameState.isOver
  }, [gameState.isOver, gameState.winner])

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

  const handleSetDifficulty = useCallback((level) => {
    setDifficulty(level)
  }, [])

  // Initialize Web Worker on mount
  useEffect(() => {
    // Create worker instance
    workerRef.current = new Worker(new URL('../workers/ai.worker.js', import.meta.url), {
      type: 'module',
    })

    // Clean up on unmount
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate()
        workerRef.current = null
      }
    }
  }, [])

  // Schedule CPU move when turn switches to CPU (using Web Worker to avoid blocking UI)
  useEffect(() => {
    if (state.turn !== TOKENS.CPU) return
    if (gameState.isOver) return
    if (!workerRef.current) return

    // Set up message handler to receive computed move from worker
    const handleWorkerMessage = (event) => {
      const { index, error } = event.data
      if (error) {
        console.error('AI Worker error:', error)
        return
      }

      cpuTimeoutRef.current = setTimeout(() => {
        dispatch({ type: ACTIONS.CPU_MOVE, payload: { index } })
        cpuTimeoutRef.current = null
      }, CPU_DELAY_MS)
    }

    workerRef.current.onmessage = handleWorkerMessage

    // Send computation request to worker
    // Worker receives: board state, difficulty level, token identifiers
    workerRef.current.postMessage({
      board: state.board,
      difficulty,
      cpuToken: TOKENS.CPU,
      humanToken: TOKENS.HUMAN,
    })

    return () => {
      if (cpuTimeoutRef.current !== null) {
        clearTimeout(cpuTimeoutRef.current)
        cpuTimeoutRef.current = null
      }
      if (workerRef.current) {
        workerRef.current.onmessage = null
      }
    }
  }, [state.turn, gameState.isOver, difficulty, state.board])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cpuTimeoutRef.current !== null) {
        clearTimeout(cpuTimeoutRef.current)
        cpuTimeoutRef.current = null
      }
      if (workerRef.current) {
        workerRef.current.terminate()
        workerRef.current = null
      }
    }
  }, [])

  return {
    board: state.board,
    turn: state.turn,
    focusedIndex: state.focusedIndex,
    gameState,
    status,
    score,
    difficulty,
    handleHumanSelect,
    handleFocusChange,
    handleReset,
    handleSetDifficulty,
  }
}
