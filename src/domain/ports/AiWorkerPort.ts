/**
 * Port: AiWorkerPort
 *
 * Abstracts AI computation messaging so app layer doesn't depend on
 * the Web Worker API directly. Enables testing with synchronous stubs
 * and swapping to SharedWorker or WASM backends.
 */
import type { Board, Difficulty, Token } from '../types.ts'

export interface AiMoveRequest {
  board: Board
  difficulty: Difficulty
  cpuToken: Token
  humanToken: Token
}

export interface AiMoveResponse {
  index?: number
  error?: string
}

export interface AiWorkerPort {
  /** Send a move computation request to the AI backend. */
  requestMove(request: AiMoveRequest): void

  /** Register a handler for AI computation results. */
  onResult(handler: (response: AiMoveResponse) => void): void

  /** Clean up resources (terminate worker, remove listeners). */
  dispose(): void
}
