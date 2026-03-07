import { WIN_LINES } from './constants.js'

/**
 * Determine the winner of the board
 * @param {Array<null|string>} board
 * @returns {{ token: string, line: number[] }|null} - winner info or null
 */
export const getWinner = (board) => {
  for (const line of WIN_LINES) {
    const [a, b, c] = line
    // Check if all three cells in the line are the same non-null token
    if (board[a] !== null && board[a] === board[b] && board[b] === board[c]) {
      return { token: board[a], line }
    }
  }
  return null
}

/**
 * Get just the winning token (convenience for callers that don't need the line)
 * @param {Array<null|string>} board
 * @returns {string|null}
 */
export const getWinnerToken = (board) => {
  const result = getWinner(board)
  return result ? result.token : null
}

/**
 * Check if the board is completely full
 * @param {Array<null|string>} board
 * @returns {boolean}
 */
export const isBoardFull = (board) => board.every((cell) => cell !== null)

/**
 * Check if the game is a draw
 * (Board full AND no winner)
 * @param {Array<null|string>} board
 * @returns {boolean}
 */
export const isDraw = (board) => {
  return isBoardFull(board) && getWinner(board) === null
}

/**
 * Get the complete game state
 * @param {Array<null|string>} board
 * @returns {{ winner: string|null, winLine: number[]|null, isDraw: boolean, isOver: boolean }}
 */
export const getGameState = (board) => {
  const winResult = getWinner(board)
  const winner = winResult ? winResult.token : null
  const winLine = winResult ? winResult.line : null
  const drawState = isDraw(board)

  return {
    winner,
    winLine,
    isDraw: drawState,
    isOver: winner !== null || drawState,
  }
}
