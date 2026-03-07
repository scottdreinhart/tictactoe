import { getEmptyCells } from '../domain/board.js'
import { getWinnerToken } from '../domain/rules.js'

/**
 * Find a winning move for a given token if one exists
 * @param {Array<null|string>} board
 * @param {string} token - "X" or "O"
 * @returns {number|null}
 */
const findWinningMove = (board, token) => {
  const empty = getEmptyCells(board)
  for (const idx of empty) {
    const testBoard = [...board]
    testBoard[idx] = token
    if (getWinnerToken(testBoard) === token) {
      return idx
    }
  }
  return null
}

/**
 * Random: Choose random move from available cells
 */
const chooseCpuMoveRandom = (board) => {
  const empty = getEmptyCells(board)
  if (empty.length === 0) throw new Error('No empty cells available')
  const randomIdx = Math.floor(Math.random() * empty.length)
  return empty[randomIdx]
}

/**
 * Smart: Priority-based move (win > block > center > corner > edge)
 */
const chooseCpuMoveSmart = (board, cpuToken, humanToken) => {
  const empty = getEmptyCells(board)
  if (empty.length === 0) throw new Error('No empty cells available')

  // 1) Can CPU win this turn?
  const winMove = findWinningMove(board, cpuToken)
  if (winMove !== null) return winMove

  // 2) Block human's winning move
  const blockMove = findWinningMove(board, humanToken)
  if (blockMove !== null) return blockMove

  // 3) Take center (index 4) if available
  if (empty.includes(4)) return 4

  // 4) Take a corner if available
  const corners = [0, 2, 6, 8]
  const availableCorner = corners.find((idx) => empty.includes(idx))
  if (availableCorner !== undefined) return availableCorner

  // 5) Take any edge
  return empty[0]
}

/**
 * Medium: Tactical moves (win / block) but random otherwise
 */
const chooseCpuMoveMedium = (board, cpuToken, humanToken) => {
  const empty = getEmptyCells(board)
  if (empty.length === 0) throw new Error('No empty cells available')

  // 1) Can CPU win this turn?
  const winMove = findWinningMove(board, cpuToken)
  if (winMove !== null) return winMove

  // 2) Block human's winning move
  const blockMove = findWinningMove(board, humanToken)
  if (blockMove !== null) return blockMove

  // 3) Pick randomly from remaining cells
  const randomIdx = Math.floor(Math.random() * empty.length)
  return empty[randomIdx]
}

// ============================================================================
// PHASE C: Minimax AI with Alpha-Beta Pruning (Unbeatable)
// ============================================================================

/**
 * Evaluate board score from CPU's perspective
 * @param {Array<null|string>} board
 * @param {string} cpuToken
 * @param {string} humanToken
 * @returns {number|null} - positive if CPU winning, negative if human winning, 0 if draw, null if ongoing
 */
const evaluateBoard = (board, cpuToken, humanToken) => {
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
 * Explores all possible game states to find optimal move
 *
 * @param {Array<null|string>} board - current board state
 * @param {number} depth - current recursion depth (for move ordering)
 * @param {number} alpha - best value for maximizer (CPU)
 * @param {number} beta - best value for minimizer (human)
 * @param {boolean} isMaximizing - true if CPU's turn, false if human's turn
 * @param {string} cpuToken - "O"
 * @param {string} humanToken - "X"
 * @returns {number} - score of best move
 */
const minimax = (board, depth, alpha, beta, isMaximizing, cpuToken, humanToken) => {
  // Terminal node: evaluate board
  const score = evaluateBoard(board, cpuToken, humanToken)
  if (score !== null) {
    // Prefer winning sooner, losing later (depth factor for move ordering)
    return isMaximizing ? score + depth : score - depth
  }

  const empty = getEmptyCells(board)

  // Maximizing: CPU's turn (trying to maximize score)
  if (isMaximizing) {
    let maxScore = -Infinity
    for (const idx of empty) {
      const newBoard = [...board]
      newBoard[idx] = cpuToken
      const score = minimax(newBoard, depth + 1, alpha, beta, false, cpuToken, humanToken)
      maxScore = Math.max(maxScore, score)
      alpha = Math.max(alpha, score)
      if (beta <= alpha) break // Beta cutoff (prune branch)
    }
    return maxScore
  }

  // Minimizing: Human's turn (trying to minimize score)
  let minScore = Infinity
  for (const idx of empty) {
    const newBoard = [...board]
    newBoard[idx] = humanToken
    const score = minimax(newBoard, depth + 1, alpha, beta, true, cpuToken, humanToken)
    minScore = Math.min(minScore, score)
    beta = Math.min(beta, score)
    if (beta <= alpha) break // Alpha cutoff (prune branch)
  }
  return minScore
}

/**
 * Unbeatable: Choose optimal move using minimax with alpha-beta pruning
 * Explores full game tree, making perfect play
 *
 * @param {Array<null|string>} board
 * @param {string} cpuToken - "O"
 * @param {string} humanToken - "X"
 * @returns {number} - index of optimal move
 */
const chooseCpuMoveUnbeatable = (board, cpuToken, humanToken) => {
  const empty = getEmptyCells(board)
  if (empty.length === 0) throw new Error('No empty cells available')

  // Move ordering: prioritize center and corners for faster pruning
  const prioritized = [4, 0, 2, 6, 8, 1, 3, 5, 7].filter((idx) => empty.includes(idx))

  let bestMove = prioritized[0]
  let bestScore = -Infinity

  // Evaluate each candidate move using minimax
  for (const idx of prioritized) {
    const newBoard = [...board]
    newBoard[idx] = cpuToken
    const score = minimax(newBoard, 0, -Infinity, Infinity, false, cpuToken, humanToken)

    if (score > bestScore) {
      bestScore = score
      bestMove = idx
    }
  }

  return bestMove
}

/**
 * Main worker message handler
 * Receives: { board, difficulty, cpuToken, humanToken }
 * Sends back: { index } or { error }
 */
self.onmessage = (event) => {
  try {
    const { board, difficulty, cpuToken, humanToken } = event.data

    let chooseFn
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
    self.postMessage({ index })
  } catch (error) {
    self.postMessage({ error: error.message })
  }
}
