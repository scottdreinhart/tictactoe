/**
 * App Strategies — concrete AI move strategy implementations.
 *
 * Each strategy satisfies the AiStrategy contract from domain/contracts.
 * The Strategy Pattern encapsulates each algorithm so the app layer can
 * swap difficulty levels without knowing algorithm internals.
 *
 * Note: The 'unbeatable' strategy runs in a Web Worker (minimax with
 * alpha-beta pruning). Its chooseMove() here throws — use the
 * AiWorkerPort adapter for actual unbeatable computation. The strategy
 * object is still registered for metadata (label, difficulty key).
 */

import { chooseCpuMoveMedium, chooseCpuMoveRandom, chooseCpuMoveSmart } from '@/domain/ai.ts'
import type { AiStrategy } from '@/domain/contracts'
import type { Board, Difficulty, Token } from '@/domain/types.ts'

// ── Strategy Implementations ─────────────────────────────────────────────────

export const EasyAiStrategy: AiStrategy = {
  label: 'Easy',
  difficulty: 'easy',
  chooseMove: (board: Board, _cpuToken: Token, _humanToken: Token): number => {
    return chooseCpuMoveRandom(board)
  },
}

export const MediumAiStrategy: AiStrategy = {
  label: 'Medium',
  difficulty: 'medium',
  chooseMove: (board: Board, cpuToken: Token, humanToken: Token): number => {
    return chooseCpuMoveMedium(board, cpuToken, humanToken)
  },
}

export const HardAiStrategy: AiStrategy = {
  label: 'Hard',
  difficulty: 'hard',
  chooseMove: (board: Board, cpuToken: Token, humanToken: Token): number => {
    return chooseCpuMoveSmart(board, cpuToken, humanToken)
  },
}

export const UnbeatableAiStrategy: AiStrategy = {
  label: 'Unbeatable',
  difficulty: 'unbeatable',
  chooseMove: (_board: Board, _cpuToken: Token, _humanToken: Token): number => {
    throw new Error(
      'UnbeatableAiStrategy.chooseMove runs in Web Worker via AiWorkerPort, not synchronously.',
    )
  },
}

// ── Strategy Registry ────────────────────────────────────────────────────────

/** All registered strategies, keyed by difficulty level. */
export const AI_STRATEGIES: Record<Difficulty, AiStrategy> = {
  easy: EasyAiStrategy,
  medium: MediumAiStrategy,
  hard: HardAiStrategy,
  unbeatable: UnbeatableAiStrategy,
}

/** Look up a strategy by difficulty key. */
export const getAiStrategy = (difficulty: Difficulty): AiStrategy => {
  return AI_STRATEGIES[difficulty]
}
