import { BOARD_SIZE } from './constants.js'

/**
 * Create a fresh, empty board (Array of 9 nulls)
 * @returns {Array<null|string>}
 */
export const createEmptyBoard = () => Array(BOARD_SIZE * BOARD_SIZE).fill(null)

/**
 * Check if a specific cell is empty
 * @param {Array<null|string>} board
 * @param {number} idx - 0 to 8
 * @returns {boolean}
 */
export const isCellEmpty = (board, idx) => {
  if (idx < 0 || idx >= board.length) {
    return false
  }
  return board[idx] === null
}

/**
 * Apply a move to the board, returning a new board.
 * Throws an error if the cell is not empty.
 * @param {Array<null|string>} board
 * @param {number} idx - 0 to 8
 * @param {string} token - "X" or "O"
 * @returns {Array<null|string>} - new board (original unmodified)
 * @throws {Error} if cell is not empty
 */
export const applyMove = (board, idx, token) => {
  if (!isCellEmpty(board, idx)) {
    throw new Error(`Cell ${idx} is not empty`)
  }
  const newBoard = [...board]
  newBoard[idx] = token
  return newBoard
}

/**
 * Get all empty cell indices
 * @param {Array<null|string>} board
 * @returns {Array<number>}
 */
export const getEmptyCells = (board) => {
  return board.map((cell, idx) => (cell === null ? idx : null)).filter((idx) => idx !== null)
}
