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

/**
 * Main worker message handler
 * Receives: { board, difficulty, cpuToken, humanToken }
 * Sends back: { index } or { error }
 */
self.onmessage = (event) => {
  try {
    const { board, difficulty, cpuToken, humanToken } = event.data

    let chooseFn
    if (difficulty === 'hard') {
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
