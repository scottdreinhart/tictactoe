/**
 * App Selectors — derive presentation-ready view data from application state.
 *
 * These sit between domain selectors (pure game logic) and UI components.
 * They shape raw game state into display-ready structures so JSX stays
 * declarative and lean (Presenter / ViewModel pattern).
 */

import { TOKENS } from '@/domain/constants.ts'
import type {
  Board,
  Difficulty,
  GameState,
  Outcome,
  Score,
  SeriesScore,
  Token,
} from '@/domain/types.ts'

// ── Scoreboard ViewModel ─────────────────────────────────────────────────────

export interface ScoreboardView {
  humanScore: number
  cpuScore: number
  draws: number
  activeToken: Token
  isGameOver: boolean
}

export const selectScoreboardView = (
  score: Score,
  turn: Token,
  isGameOver: boolean,
): ScoreboardView => ({
  humanScore: score.X,
  cpuScore: score.O,
  draws: score.draws,
  activeToken: turn,
  isGameOver,
})

// ── Outcome ViewModel ────────────────────────────────────────────────────────

export interface OutcomeView {
  outcome: Outcome
  label: string
  isHumanWin: boolean
  isCpuWin: boolean
  isDraw: boolean
}

export const selectOutcomeView = (gameState: GameState): OutcomeView | null => {
  if (!gameState.isOver) return null

  if (gameState.winner === TOKENS.HUMAN) {
    return { outcome: 'win', label: 'YOU WIN!', isHumanWin: true, isCpuWin: false, isDraw: false }
  }
  if (gameState.winner === TOKENS.CPU) {
    return { outcome: 'loss', label: 'YOU LOSE!', isHumanWin: false, isCpuWin: true, isDraw: false }
  }
  return { outcome: 'draw', label: 'DRAW!', isHumanWin: false, isCpuWin: false, isDraw: true }
}

// ── Series ViewModel ─────────────────────────────────────────────────────────

export interface SeriesView {
  isActive: boolean
  label: string
  humanWins: number
  cpuWins: number
  winsNeeded: number
  gamesPlayed: number
  isComplete: boolean
  seriesWinner: Token | null
}

export const selectSeriesView = (
  seriesLength: number,
  seriesScore: SeriesScore,
  seriesWinner: Token | null,
  gamesPlayed: number,
): SeriesView => {
  const isActive = seriesLength > 0
  const winsNeeded = isActive ? Math.ceil(seriesLength / 2) : 0
  const label = isActive ? `Best of ${seriesLength}` : 'Free Play'

  return {
    isActive,
    label,
    humanWins: seriesScore.X,
    cpuWins: seriesScore.O,
    winsNeeded,
    gamesPlayed,
    isComplete: seriesWinner !== null,
    seriesWinner,
  }
}

// ── Cell ViewModel ───────────────────────────────────────────────────────────

export interface CellView {
  index: number
  value: Token | null
  isEmpty: boolean
  isFocused: boolean
  isWinning: boolean
  isInteractive: boolean
  ariaLabel: string
}

export const selectCellView = (
  board: Board,
  index: number,
  focusedIndex: number,
  winLine: number[] | null,
  canInteract: boolean,
): CellView => {
  const value = (board[index] ?? null) as Token | null
  const isEmpty = value === null
  const row = Math.floor(index / 3) + 1
  const col = (index % 3) + 1
  const cellLabel = isEmpty ? 'empty' : value

  return {
    index,
    value,
    isEmpty,
    isFocused: index === focusedIndex,
    isWinning: winLine !== null && winLine.includes(index),
    isInteractive: canInteract && isEmpty,
    ariaLabel: `Row ${row}, Column ${col}, ${cellLabel}`,
  }
}

// ── Move Timeline ViewModel ──────────────────────────────────────────────────

export interface MoveTimelineEntry {
  moveNumber: number
  token: Token
  isCurrent: boolean
}

export const selectMoveTimeline = (
  moveHistory: Board[],
  currentMoveIndex: number,
): MoveTimelineEntry[] => {
  const entries: MoveTimelineEntry[] = []

  for (let i = 1; i < moveHistory.length; i++) {
    const prev = moveHistory[i - 1]
    const curr = moveHistory[i]
    if (!prev || !curr) continue

    // Find which cell changed
    let token: Token = TOKENS.HUMAN
    for (let j = 0; j < curr.length; j++) {
      if (prev[j] === null && curr[j] !== null) {
        token = curr[j] as Token
        break
      }
    }

    entries.push({
      moveNumber: i,
      token,
      isCurrent: i === currentMoveIndex,
    })
  }

  return entries
}

// ── Difficulty ViewModel ─────────────────────────────────────────────────────

export interface DifficultyOption {
  value: Difficulty
  label: string
  isSelected: boolean
}

export const DIFFICULTY_OPTIONS: readonly Difficulty[] = ['easy', 'medium', 'hard', 'unbeatable']

export const selectDifficultyOptions = (current: Difficulty): DifficultyOption[] => {
  return DIFFICULTY_OPTIONS.map((d) => ({
    value: d,
    label: d.charAt(0).toUpperCase() + d.slice(1),
    isSelected: d === current,
  }))
}

// ── Stats ViewModel ──────────────────────────────────────────────────────────

export interface StatsView {
  streak: number
  streakDisplay: string
  bestTime: string
  hasBestTime: boolean
}

export const selectStatsView = (streak: number, bestTime: number | null): StatsView => {
  const hasBestTime = bestTime !== null
  const bestTimeDisplay = hasBestTime ? `${bestTime.toFixed(1)}s` : '—'
  const streakDisplay = streak > 0 ? `${streak} 🔥` : '0'

  return {
    streak,
    streakDisplay,
    bestTime: bestTimeDisplay,
    hasBestTime,
  }
}
