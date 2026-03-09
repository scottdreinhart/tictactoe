/**
 * Domain Contracts — explicit state machine and strategy interfaces.
 *
 * These define the canonical game flow states and the contract that
 * all AI strategy implementations must satisfy.
 */

import type { Board, Difficulty, Token } from '../types.ts'

// ── Finite State Machine: Game Phase ─────────────────────────────────────────

/**
 * Discriminated union of all legal game phases.
 * Components and hooks should render/behave based on the current phase,
 * not by checking multiple scattered boolean flags.
 */
export type GamePhase =
  | { phase: 'idle' }
  | { phase: 'coinFlip' }
  | { phase: 'playerTurn' }
  | { phase: 'cpuThinking' }
  | { phase: 'roundWon'; winner: Token; winLine: number[] }
  | { phase: 'roundDraw' }
  | { phase: 'seriesComplete'; winner: Token }
  | { phase: 'resetting'; secondsLeft: number }
  | { phase: 'error'; message: string }

/** All valid phase names for exhaustive switch checks. */
export type GamePhaseName = GamePhase['phase']

/**
 * Legal transitions between game phases.
 * Centralized here so no component can create an illegal transition.
 */
export const LEGAL_TRANSITIONS: Record<GamePhaseName, readonly GamePhaseName[]> = {
  idle: ['coinFlip', 'playerTurn'],
  coinFlip: ['playerTurn', 'cpuThinking'],
  playerTurn: ['cpuThinking', 'roundWon', 'roundDraw'],
  cpuThinking: ['playerTurn', 'roundWon', 'roundDraw'],
  roundWon: ['resetting', 'seriesComplete'],
  roundDraw: ['resetting'],
  seriesComplete: ['idle'],
  resetting: ['idle', 'playerTurn', 'coinFlip'],
  error: ['idle'],
} as const

/**
 * Guard: assert a transition is legal.
 * Throws in development; returns boolean for conditional checks.
 */
export const isLegalTransition = (from: GamePhaseName, to: GamePhaseName): boolean => {
  return (LEGAL_TRANSITIONS[from] as readonly string[]).includes(to)
}

// ── Strategy Contract: AI Move Selection ─────────────────────────────────────

/**
 * All AI difficulty strategies must implement this interface.
 * The Strategy Pattern encapsulates each algorithm behind a stable contract
 * so the app layer can swap strategies without knowing algorithm internals.
 */
export interface AiStrategy {
  /** Human-readable label for UI display. */
  readonly label: string

  /** Machine key matching the Difficulty type. */
  readonly difficulty: Difficulty

  /**
   * Choose the best move for the given board state.
   * Must be a pure function (no side effects).
   * May accept a RandomSource for testable randomness.
   */
  chooseMove(board: Board, cpuToken: Token, humanToken: Token): number
}

// ── Command Types ────────────────────────────────────────────────────────────

/**
 * All state-changing commands as a discriminated union.
 * These are the only legal ways to mutate game state.
 * Serializable for logging, replay, and debugging.
 */
export type GameCommand =
  | { type: 'PLACE_MARK'; index: number }
  | { type: 'CPU_MOVE_COMMITTED'; index: number }
  | { type: 'SET_DIFFICULTY'; difficulty: Difficulty }
  | { type: 'START_SERIES'; length: number }
  | { type: 'RESET_ROUND' }
  | { type: 'RESET_SERIES' }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'JUMP_TO_MOVE'; moveIndex: number }
  | { type: 'TOGGLE_SOUND' }
  | { type: 'SELECT_THEME'; themeId: string }
  | { type: 'SET_MODE'; mode: string }
  | { type: 'SET_COLORBLIND'; preset: string }
  | { type: 'SET_FIRST_PLAYER'; token: Token }
  | { type: 'COIN_FLIP_COMPLETE'; firstPlayer: Token }
  | { type: 'COUNTDOWN_TICK'; secondsLeft: number }
  | { type: 'AUTO_RESET' }
