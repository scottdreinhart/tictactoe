// TOKENS and WIN_LINES are the single source of truth
export const TOKENS = {
  HUMAN: 'X',
  CPU: 'O',
}

export const BOARD_SIZE = 3

// All 8 winning lines for a 3x3 board
// Indices: 0 1 2
//          3 4 5
//          6 7 8
export const WIN_LINES = [
  // Rows
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // Columns
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // Diagonals
  [0, 4, 8],
  [2, 4, 6],
]
