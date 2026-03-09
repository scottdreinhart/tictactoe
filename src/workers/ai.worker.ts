import { chooseCpuMoveMedium, chooseCpuMoveRandom, chooseCpuMoveSmart } from '../domain/ai.ts'
import { getEmptyCells } from '../domain/board.ts'
import { getWinnerToken } from '../domain/rules.ts'
import type { Board, Token, WorkerMessage, WorkerResponse } from '../domain/types.ts'

// ============================================================================
// PHASE C: Minimax AI with Alpha-Beta Pruning (Unbeatable)
// ============================================================================

/**
 * Evaluate board score from CPU's perspective
 */
const evaluateBoard = (board: Board, cpuToken: Token, humanToken: Token): number | null => {
  const winner = getWinnerToken(board)

  if (winner === cpuToken) {
    return 10 // CPU won
  }
  if (winner === humanToken) {
    return -10 // Human won
  }

  // Check if board is full (draw)
  const empty = getEmptyCells(board)
  if (empty.length === 0) {
    return 0 // Draw
  }

  return null // Game still ongoing
}

/**
 * Minimax algorithm with alpha-beta pruning
 */
const minimax = (
  board: Board,
  depth: number,
  initialAlpha: number,
  initialBeta: number,
  isMaximizing: boolean,
  cpuToken: Token,
  humanToken: Token,
): number => {
  // Terminal node: evaluate board
  const score = evaluateBoard(board, cpuToken, humanToken)
  if (score !== null) {
    // Prefer winning sooner, losing later (depth factor for move ordering)
    return isMaximizing ? score + depth : score - depth
  }

  let alpha = initialAlpha
  let beta = initialBeta
  const empty = getEmptyCells(board)

  // Maximizing: CPU's turn (trying to maximize score)
  if (isMaximizing) {
    let maxScore = -Infinity
    for (const idx of empty) {
      const newBoard: Board = [...board]
      newBoard[idx] = cpuToken
      const moveScore = minimax(newBoard, depth + 1, alpha, beta, false, cpuToken, humanToken)
      maxScore = Math.max(maxScore, moveScore)
      alpha = Math.max(alpha, moveScore)
      if (beta <= alpha) break // Beta cutoff (prune branch)
    }
    return maxScore
  }

  // Minimizing: Human's turn (trying to minimize score)
  let minScore = Infinity
  for (const idx of empty) {
    const newBoard: Board = [...board]
    newBoard[idx] = humanToken
    const moveScore = minimax(newBoard, depth + 1, alpha, beta, true, cpuToken, humanToken)
    minScore = Math.min(minScore, moveScore)
    beta = Math.min(beta, moveScore)
    if (beta <= alpha) break // Alpha cutoff (prune branch)
  }
  return minScore
}

/**
 * Unbeatable: Choose optimal move using minimax with alpha-beta pruning
 */
const chooseCpuMoveUnbeatable = (board: Board, cpuToken: Token, humanToken: Token): number => {
  const empty = getEmptyCells(board)
  if (empty.length === 0) throw new Error('No empty cells available')

  // Move ordering: prioritize center and corners for faster pruning
  const prioritized = [4, 0, 2, 6, 8, 1, 3, 5, 7].filter((idx) => empty.includes(idx))

  let bestMove = prioritized[0]
  let bestScore = -Infinity

  // Evaluate each candidate move using minimax
  for (const idx of prioritized) {
    const newBoard: Board = [...board]
    newBoard[idx] = cpuToken
    const score = minimax(newBoard, 0, -Infinity, Infinity, false, cpuToken, humanToken)

    if (score > bestScore) {
      bestScore = score
      bestMove = idx
    }
  }

  if (bestMove === undefined) throw new Error('No valid move found')
  return bestMove
}

declare const self: Worker

/**
 * Main worker message handler
 * Receives: { board, difficulty, cpuToken, humanToken }
 * Sends back: { index } or { error }
 */
self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  try {
    const { board, difficulty, cpuToken, humanToken } = event.data

    let chooseFn: (board: Board, cpuToken: Token, humanToken: Token) => number
    if (difficulty === 'unbeatable') {
      chooseFn = chooseCpuMoveUnbeatable
    } else if (difficulty === 'hard') {
      chooseFn = chooseCpuMoveSmart
    } else if (difficulty === 'medium') {
      chooseFn = chooseCpuMoveMedium
    } else {
      chooseFn = chooseCpuMoveRandom
    }

    const index = chooseFn(board, cpuToken, humanToken)
    self.postMessage({ index } as WorkerResponse)
  } catch (error) {
    self.postMessage({ error: (error as Error).message } as WorkerResponse)
  }
}
