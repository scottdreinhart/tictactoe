/**
 * Application layer barrel export.
 * Re-exports all React hooks and services.
 *
 * Usage: import { useTheme, useSoundEffects, load } from '@/app'
 */

// ── Services (named exports) ──
export * from './haptics'
export * from './sounds'
export * from './storageService'

// ── Hooks (default → named re-exports) ──
export { default as useAutoReset } from './useAutoReset'
export { default as useCoinFlipAnimation } from './useCoinFlipAnimation'
export { default as useCpuPlayer } from './useCpuPlayer'
export { default as useDropdownBehavior } from './useDropdownBehavior'
export { ACTIONS, type UseGameBoardReturn } from './useGameBoard'
export { default as useGameBoard } from './useGameBoard'
export { default as useGameOrchestration } from './useGameOrchestration'
export { default as useGameStats } from './useGameStats'
export { default as useGridKeyboard } from './useGridKeyboard'
export { default as useKeyboardShortcuts } from './useKeyboardShortcuts'
export { default as useNotificationQueue } from './useNotificationQueue'
export { default as usePrevious } from './usePrevious'
export { default as useSeries } from './useSeries'
export { default as useSmartPosition } from './useSmartPosition'
export { default as useSoundEffects } from './useSoundEffects'
export { default as useSwipeGesture } from './useSwipeGesture'
export { default as useTheme } from './useTheme'
export { useTicTacToe, type UseTicTacToeReturn } from './useTicTacToe'
export { default as useWebWorker } from './useWebWorker'

// ── Architecture governance modules ──
export * from './adapters/index'
export * from './policies/index'
export * from './presenters/index'
export * from './selectors/index'
export * from './strategies/index'
