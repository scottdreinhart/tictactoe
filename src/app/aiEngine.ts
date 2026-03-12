// ============================================================================
// AI Engine — runs on main thread with WASM acceleration + JS fallback
//
// For a 3×3 board, minimax completes in <1ms — no Web Worker needed.
// WASM is decoded from the base64-embedded binary on first import.
// ============================================================================

import { chooseCpuMoveMedium, chooseCpuMoveRandom, chooseCpuMoveSmart } from '../domain/ai.ts'
import { getEmptyCells } from '../domain/board.ts'
import { getWinnerToken } from '../domain/rules.ts'
import type { Board, CellValue, Difficulty, Token } from '../domain/types.ts'
import { AI_WASM_BASE64 } from '../wasm/ai-wasm.ts'

// ── WASM function signatures ─────────────────────────────────────────────────

type WasmMoveFn11 = (
  c0: number,
  c1: number,
  c2: number,
  c3: number,
  c4: number,
  c5: number,
  c6: number,
  c7: number,
  c8: number,
  cpuToken: number,
  humanToken: number,
) => number

type WasmMoveFn10 = (
  c0: number,
  c1: number,
  c2: number,
  c3: number,
  c4: number,
  c5: number,
  c6: number,
  c7: number,
  c8: number,
  rand: number,
) => number

type WasmMoveFn12 = (
  c0: number,
  c1: number,
  c2: number,
  c3: number,
  c4: number,
  c5: number,
  c6: number,
  c7: number,
  c8: number,
  cpuToken: number,
  humanToken: number,
  rand: number,
) => number

// ── WASM singleton state ─────────────────────────────────────────────────────

let wasmFindRandomMove: WasmMoveFn10 | null = null
let wasmFindMediumMove: WasmMoveFn12 | null = null
let wasmFindSmartMove: WasmMoveFn11 | null = null
let wasmFindBestMove: WasmMoveFn11 | null = null
let wasmReady = false

/** Decode base64 WASM binary and instantiate (runs once) */
const initPromise: Promise<void> = (async () => {
  try {
    const binary = atob(AI_WASM_BASE64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }
    const imports = { env: { abort: () => {} } }
    const { instance } = await WebAssembly.instantiate(bytes, imports)
    wasmFindRandomMove = instance.exports.findRandomMove as WasmMoveFn10
    wasmFindMediumMove = instance.exports.findMediumMove as WasmMoveFn12
    wasmFindSmartMove = instance.exports.findSmartMove as WasmMoveFn11
    wasmFindBestMove = instance.exports.findBestMove as WasmMoveFn11
    wasmReady = true
  } catch {
    // WASM unavailable — JS fallback will be used silently
  }
})()

/** Wait for WASM to finish loading (resolves immediately after first load) */
export const ensureWasmReady = (): Promise<void> => initPromise

// ── JS minimax fallback (unbeatable only) ────────────────────────────────────

const evaluateBoard = (board: Board, cpuToken: Token, humanToken: Token): number | null => {
  const winner = getWinnerToken(board)
  if (winner === cpuToken) {
    return 10
  }
  if (winner === humanToken) {
    return -10
  }
  if (getEmptyCells(board).length === 0) {
    return 0
  }
  return null
}

const minimax = (
  board: Board,
  depth: number,
  initialAlpha: number,
  initialBeta: number,
  isMaximizing: boolean,
  cpuToken: Token,
  humanToken: Token,
): number => {
  const score = evaluateBoard(board, cpuToken, humanToken)
  if (score !== null) {
    return isMaximizing ? score + depth : score - depth
  }

  let alpha = initialAlpha
  let beta = initialBeta
  const empty = getEmptyCells(board)

  if (isMaximizing) {
    let maxScore = -Infinity
    for (const idx of empty) {
      const newBoard: Board = [...board]
      newBoard[idx] = cpuToken
      const moveScore = minimax(newBoard, depth + 1, alpha, beta, false, cpuToken, humanToken)
      maxScore = Math.max(maxScore, moveScore)
      alpha = Math.max(alpha, moveScore)
      if (beta <= alpha) {
        break
      }
    }
    return maxScore
  }

  let minScore = Infinity
  for (const idx of empty) {
    const newBoard: Board = [...board]
    newBoard[idx] = humanToken
    const moveScore = minimax(newBoard, depth + 1, alpha, beta, true, cpuToken, humanToken)
    minScore = Math.min(minScore, moveScore)
    beta = Math.min(beta, moveScore)
    if (beta <= alpha) {
      break
    }
  }
  return minScore
}

const chooseCpuMoveUnbeatable = (board: Board, cpuToken: Token, humanToken: Token): number => {
  const empty = getEmptyCells(board)
  if (empty.length === 0) {
    throw new Error('No empty cells available')
  }
  const prioritized = [4, 0, 2, 6, 8, 1, 3, 5, 7].filter((idx) => empty.includes(idx))

  let bestMove = prioritized[0]
  let bestScore = -Infinity

  for (const idx of prioritized) {
    const newBoard: Board = [...board]
    newBoard[idx] = cpuToken
    const score = minimax(newBoard, 0, -Infinity, Infinity, false, cpuToken, humanToken)
    if (score > bestScore) {
      bestScore = score
      bestMove = idx
    }
  }

  if (bestMove === undefined) {
    throw new Error('No valid move found')
  }
  return bestMove
}

// ── WASM helpers ─────────────────────────────────────────────────────────────

const cellToNum = (cell: CellValue): number => {
  if (cell === 'X') {
    return 1
  }
  if (cell === 'O') {
    return 2
  }
  return 0
}

const tokenToNum = (token: Token): number => (token === 'X' ? 1 : 2)

const boardNums = (
  board: Board,
): [number, number, number, number, number, number, number, number, number] => [
  cellToNum(board[0] ?? null),
  cellToNum(board[1] ?? null),
  cellToNum(board[2] ?? null),
  cellToNum(board[3] ?? null),
  cellToNum(board[4] ?? null),
  cellToNum(board[5] ?? null),
  cellToNum(board[6] ?? null),
  cellToNum(board[7] ?? null),
  cellToNum(board[8] ?? null),
]

// ── Public API ───────────────────────────────────────────────────────────────

export interface AiResult {
  index: number
  engine: 'wasm' | 'js'
}

/**
 * Compute the CPU's move for the given board and difficulty.
 * Uses WASM when available, otherwise falls back to JS.
 */
export const computeAiMove = (
  board: Board,
  difficulty: Difficulty,
  cpuToken: Token,
  humanToken: Token,
): AiResult => {
  const cells = boardNums(board)

  if (difficulty === 'easy') {
    if (wasmReady && wasmFindRandomMove) {
      const rand = (Math.random() * 9) | 0
      return { index: wasmFindRandomMove(...cells, rand), engine: 'wasm' }
    }
    return { index: chooseCpuMoveRandom(board), engine: 'js' }
  }

  if (difficulty === 'medium') {
    if (wasmReady && wasmFindMediumMove) {
      const rand = (Math.random() * 9) | 0
      return {
        index: wasmFindMediumMove(...cells, tokenToNum(cpuToken), tokenToNum(humanToken), rand),
        engine: 'wasm',
      }
    }
    return { index: chooseCpuMoveMedium(board, cpuToken, humanToken), engine: 'js' }
  }

  if (difficulty === 'hard') {
    if (wasmReady && wasmFindSmartMove) {
      return {
        index: wasmFindSmartMove(...cells, tokenToNum(cpuToken), tokenToNum(humanToken)),
        engine: 'wasm',
      }
    }
    return { index: chooseCpuMoveSmart(board, cpuToken, humanToken), engine: 'js' }
  }

  // unbeatable
  if (wasmReady && wasmFindBestMove) {
    return {
      index: wasmFindBestMove(...cells, tokenToNum(cpuToken), tokenToNum(humanToken)),
      engine: 'wasm',
    }
  }
  return { index: chooseCpuMoveUnbeatable(board, cpuToken, humanToken), engine: 'js' }
}
