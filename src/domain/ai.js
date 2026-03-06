import { getEmptyCells } from './board.js'
import { getWinner } from './rules.js'

/**
 * PHASE A: Choose CPU move randomly from available cells
 * @param {Array<null|string>} board
 * @returns {number} - index of chosen move (0-8)
 * @throws {Error} if no empty cells available
 */
export const chooseCpuMoveRandom = (board) => {
  const empty = getEmptyCells(board)
  if (empty.length === 0) {
    throw new Error('No empty cells available for CPU move')
  }
  // Pick a random empty cell
  const randomIdx = Math.floor(Math.random() * empty.length)
  return empty[randomIdx]
}

// ============================================================================
// PHASE B: Smart AI (helpers for deterministic priority-based selection)
// Uncomment and use these when upgrading from Phase A
// ============================================================================

/**
 * Find a winning move for a given token if one exists
 * @param {Array<null|string>} board
 * @param {string} token - "X" or "O"
 * @returns {number|null} - index of winning move, or null
 */
const findWinningMove = (board, token) => {
  const empty = getEmptyCells(board)
  for (const idx of empty) {
    const testBoard = [...board]
    testBoard[idx] = token
    if (getWinner(testBoard) === token) {
      return idx
    }
  }
  return null
}

/**
 * PHASE B: Choose CPU move with smart priority
 * 1) Win if possible this turn
 * 2) Block X if X could win next turn
 * 3) Take center if available
 * 4) Take a corner if available
 * 5) Else take an edge
 *
 * @param {Array<null|string>} board
 * @param {string} cpuToken - "O"
 * @param {string} humanToken - "X"
 * @returns {number} - index of chosen move
 * @throws {Error} if no empty cells available
 */
export const chooseCpuMoveSmart = (board, cpuToken, humanToken) => {
  const empty = getEmptyCells(board)
  if (empty.length === 0) {
    throw new Error('No empty cells available for CPU move')
  }

  // 1) Can CPU win this turn?
  const winMove = findWinningMove(board, cpuToken)
  if (winMove !== null) {
    return winMove
  }

  // 2) Can human win next turn? Block it.
  const blockMove = findWinningMove(board, humanToken)
  if (blockMove !== null) {
    return blockMove
  }

  // 3) Take center (index 4) if available
  if (empty.includes(4)) {
    return 4
  }

  // 4) Take a corner if available
  const corners = [0, 2, 6, 8]
  const availableCorner = corners.find((idx) => empty.includes(idx))
  if (availableCorner !== undefined) {
    return availableCorner
  }

  // 5) Take any edge
  // Edges are [1, 3, 5, 7]
  return empty[0]
}
