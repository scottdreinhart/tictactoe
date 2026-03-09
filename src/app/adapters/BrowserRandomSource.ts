/**
 * Adapter: BrowserRandomSource
 *
 * Production implementation of RandomSource using Math.random().
 * For testing, inject a SeededRandomSource or FixedRandomSource instead.
 */
import type { RandomSource } from '@/domain/ports'

export const BrowserRandomSource: RandomSource = {
  random: () => Math.random(),
}
