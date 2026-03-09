/**
 * Domain layer barrel export.
 * Re-exports all pure, framework-agnostic game logic.
 *
 * Usage: import { Board, createEmptyBoard, getWinner } from '@/domain'
 */

export * from './ai'
export * from './board'
export * from './constants'
export * from './rules'
export * from './themes'
export * from './types'

// Architecture governance modules
export * from './contracts/index'
export * from './ports/index'
export * from './selectors/index'
