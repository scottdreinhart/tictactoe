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
  UNDO: 'UNDO',
  REDO: 'REDO',
  SET_GAME_START_TIME: 'SET_GAME_START_TIME',
  UPDATE_STREAK: 'UPDATE_STREAK',
}

// ── Initial state factory ────────────────────────────────────────────────────

const createInitialState = () => ({
  board: createEmptyBoard(),
  turn: TOKENS.HUMAN,
  focusedIndex: 4, // center cell
  history: [createEmptyBoard()], // track all board states
  historyIndex: 0, // current position in history (for undo/redo)
  gameStartTime: null, // timestamp when game started
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

      // Add new board state to history and reset redo stack
      const newHistory = state.history.slice(0, state.historyIndex + 1)
      newHistory.push(board)

      return {
        ...state,
        board,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        // If game ended, keep turn as HUMAN (no CPU move needed).
        // Otherwise signal that CPU should play.
        turn: isOver ? TOKENS.HUMAN : TOKENS.CPU,
      }
    }

    case ACTIONS.CPU_MOVE: {
      if (state.turn !== TOKENS.CPU) return state
      const { index } = action.payload
      const board = applyMove(state.board, index, TOKENS.CPU)

      // Add new board state to history
      const newHistory = state.history.slice(0, state.historyIndex + 1)
      newHistory.push(board)

      return {
        ...state,
        board,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        turn: TOKENS.HUMAN, // always return control to human
      }
    }

    case ACTIONS.SET_FOCUSED_INDEX: {
      const idx = action.payload
      if (idx < 0 || idx >= 9) return state
      return { ...state, focusedIndex: idx }
    }

    case ACTIONS.UNDO: {
      if (state.historyIndex <= 0) return state // can't undo past start
      const newIndex = state.historyIndex - 1
      const board = state.history[newIndex]
      return {
        ...state,
        board,
        historyIndex: newIndex,
        turn: TOKENS.HUMAN, // reset to human's turn after undo
      }
    }

    case ACTIONS.REDO: {
      if (state.historyIndex >= state.history.length - 1) return state // can't redo past end
      const newIndex = state.historyIndex + 1
      const board = state.history[newIndex]
      return {
        ...state,
        board,
        historyIndex: newIndex,
        turn: TOKENS.HUMAN, // reset to human's turn after redo
      }
    }

    case ACTIONS.SET_GAME_START_TIME: {
      if (state.gameStartTime !== null) return state // only set once per game
      return {
        ...state,
        gameStartTime: action.payload,
      }
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
  const [streak, setStreak] = useState(0) // consecutive human wins
  const [bestTime, setBestTime] = useState(null) // fastest win in seconds
  const prevGameOverRef = useRef(false)
  const prevHistoryIndexRef = useRef(0) // track if undo happened (streak break)

  // Derive game state from board (pure, no side-effects)
  const gameState = useMemo(() => getGameState(state.board), [state.board])

  // Set game start time on first move
  useEffect(() => {
    if (state.gameStartTime === null && state.history.length > 1) {
      dispatch({ type: ACTIONS.SET_GAME_START_TIME, payload: Date.now() })
    }
  }, [state.history.length, state.gameStartTime])

  // Track score and streak when game ends
  useEffect(() => {
    if (gameState.isOver && !prevGameOverRef.current) {
      // Check if undo happened since last move (streak break)
      const undoHappened = state.historyIndex < prevHistoryIndexRef.current
      if (undoHappened && gameState.winner === TOKENS.HUMAN) {
        setStreak(0) // break streak on undo
      }

      setScore((prev) => {
        const newScore = { ...prev }
        if (gameState.winner) {
          newScore[gameState.winner] = prev[gameState.winner] + 1

          // Update streak
          if (gameState.winner === TOKENS.HUMAN && !undoHappened) {
            setStreak((prevStreak) => prevStreak + 1)
          } else if (gameState.winner === TOKENS.HUMAN && undoHappened) {
            setStreak(0)
          } else if (gameState.winner === TOKENS.CPU) {
            setStreak(0) // CPU win breaks streak
          }

          // Update best time if human won
          if (gameState.winner === TOKENS.HUMAN && state.gameStartTime !== null) {
            const winTime = (Date.now() - state.gameStartTime) / 1000
            setBestTime((prev) => (prev === null || winTime < prev ? winTime : prev))
          }
        } else {
          newScore.draws = prev.draws + 1
          setStreak(0) // draw breaks streak
        }
        return newScore
      })
    }
    prevGameOverRef.current = gameState.isOver
    prevHistoryIndexRef.current = state.historyIndex
  }, [gameState.isOver, gameState.winner, state.historyIndex, state.gameStartTime])

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

  const handleUndo = useCallback(() => {
    dispatch({ type: ACTIONS.UNDO })
  }, [])

  const handleRedo = useCallback(() => {
    dispatch({ type: ACTIONS.REDO })
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
        // eslint-disable-next-line no-console
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
    streak,
    bestTime,
    moveHistory: state.history,
    currentMoveIndex: state.historyIndex,
    canUndo: state.historyIndex > 0,
    canRedo: state.historyIndex < state.history.length - 1,
    handleHumanSelect,
    handleFocusChange,
    handleReset,
    handleSetDifficulty,
    handleUndo,
    handleRedo,
  }
}
