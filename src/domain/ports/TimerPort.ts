/**
 * Port: TimerPort
 *
 * Abstracts timing/scheduling so application logic never calls
 * setTimeout/clearTimeout/Date.now directly. Enables deterministic
 * testing of countdown, auto-reset, and CPU delay behavior.
 */
export interface TimerPort {
  /** Schedule a callback after the given delay (ms). Returns a handle for cancellation. */
  setTimeout(callback: () => void, delayMs: number): number

  /** Cancel a previously scheduled timeout. */
  clearTimeout(handle: number): void

  /** Returns the current wall-clock timestamp in milliseconds. */
  now(): number
}
