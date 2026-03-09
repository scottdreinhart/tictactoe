/**
 * Port: RandomSource
 *
 * Abstracts random number generation so domain logic remains deterministic
 * and testable. Production adapter uses Math.random(); tests can inject
 * a seeded or fixed implementation.
 */
export interface RandomSource {
  /** Returns a pseudo-random number in [0, 1). */
  random(): number
}
