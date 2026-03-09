/**
 * App Presenters — pure functions that transform domain/app state into
 * display-ready view models consumed by UI components.
 *
 * Presenter / ViewModel pattern:
 *   domain state  →  presenter fn  →  ViewModel  →  JSX
 *
 * Every presenter is a pure function — no hooks, no side-effects, no React
 * imports.  This keeps them trivially testable and boundary-safe.
 */

import { TOKENS } from '@/domain/constants.ts'
import type { Difficulty, GameState, Outcome, Score, SeriesScore, Token } from '@/domain/types.ts'

// ── Outcome Presentation ─────────────────────────────────────────────────────

export interface OutcomePresentation {
  headline: string
  subtext: string
  outcomeType: Outcome
}

/**
 * Shape a game-over state into display strings.
 * Returns `null` when the game is still in progress.
 */
export const presentOutcome = (gameState: GameState): OutcomePresentation | null => {
  if (!gameState.isOver) return null

  if (gameState.winner === TOKENS.HUMAN) {
    return { headline: 'YOU WIN!', subtext: 'Great job!', outcomeType: 'win' }
  }
  if (gameState.winner === TOKENS.CPU) {
    return { headline: 'YOU LOSE!', subtext: 'Better luck next time.', outcomeType: 'loss' }
  }
  return { headline: 'DRAW!', subtext: "It's a tie.", outcomeType: 'draw' }
}

// ── Score Presentation ───────────────────────────────────────────────────────

export interface ScorePresentation {
  humanLabel: string
  cpuLabel: string
  drawLabel: string
  leader: 'human' | 'cpu' | 'tied'
}

export const presentScore = (score: Score): ScorePresentation => {
  let leader: 'human' | 'cpu' | 'tied' = 'tied'
  if (score.X > score.O) leader = 'human'
  else if (score.O > score.X) leader = 'cpu'

  return {
    humanLabel: `You: ${score.X}`,
    cpuLabel: `CPU: ${score.O}`,
    drawLabel: `Draws: ${score.draws}`,
    leader,
  }
}

// ── Series Presentation ──────────────────────────────────────────────────────

export interface SeriesPresentation {
  title: string
  progress: string
  isActive: boolean
  isComplete: boolean
  winnerLabel: string | null
}

export const presentSeries = (
  seriesLength: number,
  seriesScore: SeriesScore,
  seriesWinner: Token | null,
  gamesPlayed: number,
): SeriesPresentation => {
  if (seriesLength === 0) {
    return {
      title: 'Free Play',
      progress: `${gamesPlayed} game${gamesPlayed === 1 ? '' : 's'} played`,
      isActive: false,
      isComplete: false,
      winnerLabel: null,
    }
  }

  const winsNeeded = Math.ceil(seriesLength / 2)
  const progress = `You ${seriesScore.X} – ${seriesScore.O} CPU`

  let winnerLabel: string | null = null
  if (seriesWinner === TOKENS.HUMAN) winnerLabel = 'You win the series!'
  else if (seriesWinner === TOKENS.CPU) winnerLabel = 'CPU wins the series!'

  return {
    title: `Best of ${seriesLength} (first to ${winsNeeded})`,
    progress,
    isActive: true,
    isComplete: seriesWinner !== null,
    winnerLabel,
  }
}

// ── Difficulty Presentation ──────────────────────────────────────────────────

export const presentDifficulty = (d: Difficulty): string => d.charAt(0).toUpperCase() + d.slice(1)

// ── Countdown Presentation ───────────────────────────────────────────────────

export const presentCountdown = (secondsLeft: number): string =>
  `New game in ${secondsLeft} ${secondsLeft === 1 ? 'second' : 'seconds'}`

// ── Cell Presentation ────────────────────────────────────────────────────────

export const presentCellPosition = (index: number): string => {
  const row = Math.floor(index / 3) + 1
  const col = (index % 3) + 1
  return `Row ${row}, Column ${col}`
}

export const presentCellAriaLabel = (index: number, value: Token | null): string => {
  const position = presentCellPosition(index)
  const content = value ?? 'empty'
  return `${position}, ${content}`
}

// ── Streak Presentation ──────────────────────────────────────────────────────

export const presentStreak = (streak: number): string => (streak > 0 ? `${streak} 🔥` : '0')

// ── Best Time Presentation ───────────────────────────────────────────────────

export const presentBestTime = (bestTime: number | null): string =>
  bestTime !== null ? `${bestTime.toFixed(1)}s` : '—'

// ── Turn Presentation ────────────────────────────────────────────────────────

export const presentTurn = (turn: Token): string =>
  turn === TOKENS.HUMAN ? 'Your turn' : 'CPU is thinking…'

// ── First Player Presentation ────────────────────────────────────────────────

export const presentFirstPlayer = (token: Token): string =>
  token === TOKENS.HUMAN ? 'You go first' : 'CPU goes first'
