/**
 * App Policies — extracted magic numbers, thresholds, and configurable
 * behavior parameters.  Centralises "tuning knobs" so they live in one
 * discoverable module rather than scattered across hooks and components.
 *
 * Design-by-Contract: every numeric policy includes a JSDoc range or
 * invariant so callers know what values are legal.
 *
 * Rule: if you find a bare literal in a hook or component, extract it
 * here first, then import it.
 */

import type { Difficulty } from '@/domain/types.ts'

// ── Timing Policies ──────────────────────────────────────────────────────────

/** Delay before CPU plays its move (ms). Must be > 0. */
export const CPU_MOVE_DELAY_MS = 400

/** Auto-reset countdown length after a round ends (seconds). Must be >= 1. */
export const AUTO_RESET_SECONDS = 15

/** Tick interval for the countdown timer (ms). */
export const COUNTDOWN_TICK_MS = 1000

/** Default notification auto-dismiss duration (ms). Must be > 0. */
export const NOTIFICATION_DURATION_MS = 10_000

// ── Animation Policies ───────────────────────────────────────────────────────

/** Board reset cross-fade duration (ms). */
export const RESET_ANIMATION_MS = 300

/** Kinetic cell press animation duration (ms). */
export const KINETIC_ANIMATION_MS = 300

/** Hamburger / dropdown menu open/close animation (ms). */
export const MENU_ANIMATION_MS = 250

/** Outcome overlay display lifetime before auto-hide (ms). */
export const OUTCOME_OVERLAY_MS = 3000

/** Coin-flip animation auto-stop (ms). */
export const COIN_FLIP_AUTO_STOP_MS = 3500

/** Coin-flip reveal pause after landing (ms). */
export const COIN_FLIP_REVEAL_MS = 1200

/** Confetti particle shower duration (ms). */
export const CONFETTI_DURATION_MS = 2000

// ── Confetti Policies ────────────────────────────────────────────────────────

/** Number of confetti particles to spawn. Must be > 0. */
export const CONFETTI_PARTICLE_COUNT = 80

/** Gravity acceleration for confetti particles. */
export const CONFETTI_GRAVITY = 0.003

/** Palette used for confetti particles (hex). */
export const CONFETTI_COLORS: readonly string[] = [
  '#667eea',
  '#764ba2',
  '#f97316',
  '#22c55e',
  '#f43f5e',
  '#0ea5e9',
  '#a78bfa',
  '#fbbf24',
]

// ── Gesture Policies ─────────────────────────────────────────────────────────

/** Minimum pixel distance for a touch to count as a swipe. */
export const SWIPE_THRESHOLD_PX = 30

/** Maximum elapsed time for a gesture to count as a swipe (ms). */
export const SWIPE_TIMEOUT_MS = 300

// ── Layout Policies ──────────────────────────────────────────────────────────

/** Minimum dropdown/menu panel width (px). */
export const MENU_PANEL_MIN_WIDTH_PX = 240

/** Viewport safe-margin for dropdown positioning (px). */
export const VIEWPORT_PADDING_PX = 16

/** Theme selector panel width override (px). */
export const THEME_PANEL_MIN_WIDTH_PX = 280

// ── Sound Policies ───────────────────────────────────────────────────────────

/** Default master volume for synthesised sounds (0–1). */
export const DEFAULT_SOUND_VOLUME = 0.15

// ── Series Policies ──────────────────────────────────────────────────────────

/**
 * Legal series length options shown in the UI.
 *  0 = Free Play (unlimited), odd numbers only for best-of-N.
 */
export const SERIES_LENGTH_OPTIONS: readonly number[] = [0, 3, 5, 7] as const

// ── Difficulty Policies ──────────────────────────────────────────────────────

/** Ordered list of difficulty levels (easiest → hardest). */
export const DIFFICULTY_ORDER: readonly Difficulty[] = [
  'easy',
  'medium',
  'hard',
  'unbeatable',
] as const

/** Default difficulty for a fresh game session. */
export const DEFAULT_DIFFICULTY: Difficulty = 'medium'
