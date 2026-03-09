/**
 * Domain Selectors — pure functions that derive read-only view data
 * from game state. These follow the Selector / CQRS-Lite pattern:
 * mutations go through commands/actions, reads go through selectors.
 *
 * All selectors are pure, deterministic, and framework-agnostic.
 */

import { getEmptyCells } from '../board.ts'
import { BOARD_SIZE, TOKENS, WIN_LINES } from '../constants.ts'
import { getGameState, getWinner } from '../rules.ts'
import type { Board, GameState, Score, SeriesScore, Token } from '../types.ts'

// ── Game State Selectors ─────────────────────────────────────────────────────

/** Derive the full game state (winner, winLine, isDraw, isOver) from a board. */
export const selectGameState = (board: Board): GameState => getGameState(board)

/** Get the winning token, or null if no winner. */
export const selectWinner = (board: Board): Token | null => {
  const result = getWinner(board)
  return result ? result.token : null
}

/** Get the winning line indices, or null. */
export const selectWinLine = (board: Board): number[] | null => {
  const result = getWinner(board)
  return result ? result.line : null
}

/** Get all available (empty) cell indices. */
export const selectAvailableMoves = (board: Board): number[] => getEmptyCells(board)

/** Whether the current player can interact with the board. */
export const selectCanInteract = (board: Board, turn: Token, isGameOver: boolean): boolean => {
  return !isGameOver && turn === TOKENS.HUMAN && getEmptyCells(board).length > 0
}

/** Count total moves played on the board. */
export const selectMoveCount = (board: Board): number => {
  return BOARD_SIZE * BOARD_SIZE - getEmptyCells(board).length
}

// ── Score Selectors ──────────────────────────────────────────────────────────

/** Determine the outcome label for display. */
export const selectOutcomeMessage = (gameState: GameState): string | null => {
  if (!gameState.isOver) return null
  if (gameState.winner === TOKENS.HUMAN) return 'YOU WIN!'
  if (gameState.winner === TOKENS.CPU) return 'YOU LOSE!'
  return 'DRAW!'
}

/** Determine which player is leading in score. */
export const selectScoreLeader = (score: Score): Token | 'tied' => {
  if (score.X > score.O) return 'X'
  if (score.O > score.X) return 'O'
  return 'tied'
}

/** Determine the series leader, or 'tied'. */
export const selectSeriesLeader = (seriesScore: SeriesScore): Token | 'tied' => {
  if (seriesScore.X > seriesScore.O) return 'X'
  if (seriesScore.O > seriesScore.X) return 'O'
  return 'tied'
}

/** Whether a specific series length is a valid Best-of-N value. */
export const selectIsValidSeriesLength = (length: number): boolean => {
  return [0, 3, 5, 7].includes(length)
}

// ── Board Query Selectors ────────────────────────────────────────────────────

/** Get the row index (0-2) for a cell index (0-8). */
export const selectCellRow = (index: number): number => Math.floor(index / BOARD_SIZE)

/** Get the column index (0-2) for a cell index (0-8). */
export const selectCellCol = (index: number): number => index % BOARD_SIZE

/** Get all winning lines that contain a specific cell index. */
export const selectWinLinesForCell = (index: number): number[][] => {
  return WIN_LINES.filter((line) => line.includes(index))
}

/** Whether a cell is part of the winning line. */
export const selectIsCellInWinLine = (index: number, winLine: number[] | null): boolean => {
  return winLine !== null && winLine.includes(index)
}
