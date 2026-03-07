import { useReducer, useEffect, useCallback, useMemo } from 'react'
import { createEmptyBoard, applyMove, isCellEmpty } from '../domain/board.js'
import { getGameState } from '../domain/rules.js'
import { TOKENS } from '../domain/constants.js'

// ── Actions ──────────────────────────────────────────────────────────────────

export const ACTIONS = {
  HUMAN_MOVE: 'HUMAN_MOVE',
  CPU_MOVE: 'CPU_MOVE',
  SET_FOCUSED_INDEX: 'SET_FOCUSED_INDEX',
  RESET: 'RESET',
  UNDO: 'UNDO',
  REDO: 'REDO',
  SET_GAME_START_TIME: 'SET_GAME_START_TIME',
  SET_FIRST_PLAYER: 'SET_FIRST_PLAYER',
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
        turn: isOver ? TOKENS.HUMAN : TOKENS.CPU,
      }
    }

    case ACTIONS.CPU_MOVE: {
      if (state.turn !== TOKENS.CPU) return state
      const { index } = action.payload
      const board = applyMove(state.board, index, TOKENS.CPU)

      const newHistory = state.history.slice(0, state.historyIndex + 1)
      newHistory.push(board)

      return {
        ...state,
        board,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        turn: TOKENS.HUMAN,
      }
    }

    case ACTIONS.SET_FOCUSED_INDEX: {
      const idx = action.payload
      if (idx < 0 || idx >= 9) return state
      return { ...state, focusedIndex: idx }
    }

    case ACTIONS.UNDO: {
      if (state.historyIndex <= 0) return state
      const newIndex = state.historyIndex - 1
      const board = state.history[newIndex]
      return {
        ...state,
        board,
        historyIndex: newIndex,
        turn: TOKENS.HUMAN,
      }
    }

    case ACTIONS.REDO: {
      if (state.historyIndex >= state.history.length - 1) return state
      const newIndex = state.historyIndex + 1
      const board = state.history[newIndex]
      return {
        ...state,
        board,
        historyIndex: newIndex,
        turn: TOKENS.HUMAN,
      }
    }

    case ACTIONS.SET_GAME_START_TIME: {
      if (state.gameStartTime !== null) return state
      return { ...state, gameStartTime: action.payload }
    }

    case ACTIONS.RESET:
      return createInitialState()

    case ACTIONS.SET_FIRST_PLAYER: {
      if (state.history.length > 1) return state
      return { ...state, turn: action.payload }
    }

    default:
      return state
  }
}

// ── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useGameBoard — Application hook
 *
 * Manages board state, turn, focus, and move history via a pure reducer.
 * Split from the original useTicTacToe to isolate core board concerns.
 *
 * @returns board state + derived game state + stable action handlers
 */
const useGameBoard = () => {
  const [state, dispatch] = useReducer(gameReducer, null, createInitialState)

  // Derive game state from board (pure, no side-effects)
  const gameState = useMemo(() => getGameState(state.board), [state.board])

  // Set game start time on first move
  useEffect(() => {
    if (state.gameStartTime === null && state.history.length > 1) {
      dispatch({ type: ACTIONS.SET_GAME_START_TIME, payload: Date.now() })
    }
  }, [state.history.length, state.gameStartTime])

  // Derive status text
  const status = useMemo(() => {
    if (gameState.winner) return `${gameState.winner} wins!`
    if (gameState.isDraw) return 'Draw!'
    return `${state.turn}'s turn`
  }, [gameState, state.turn])

  // ── Handlers (stable references via useCallback) ─────────────────────────

  const handleHumanSelect = useCallback((index) => {
    dispatch({ type: ACTIONS.HUMAN_MOVE, payload: { index } })
  }, [])

  const handleFocusChange = useCallback((index) => {
    dispatch({ type: ACTIONS.SET_FOCUSED_INDEX, payload: index })
  }, [])

  const handleReset = useCallback(() => {
    dispatch({ type: ACTIONS.RESET })
  }, [])

  const handleUndo = useCallback(() => {
    dispatch({ type: ACTIONS.UNDO })
  }, [])

  const handleRedo = useCallback(() => {
    dispatch({ type: ACTIONS.REDO })
  }, [])

  const setFirstPlayer = useCallback((token) => {
    dispatch({ type: ACTIONS.SET_FIRST_PLAYER, payload: token })
  }, [])

  return {
    board: state.board,
    turn: state.turn,
    focusedIndex: state.focusedIndex,
    gameState,
    status,
    gameStartTime: state.gameStartTime,
    moveHistory: state.history,
    currentMoveIndex: state.historyIndex,
    canUndo: state.historyIndex > 0,
    canRedo: state.historyIndex < state.history.length - 1,
    handleHumanSelect,
    handleFocusChange,
    handleReset,
    handleUndo,
    handleRedo,
    setFirstPlayer,
    dispatch,
  }
}

export default useGameBoard
