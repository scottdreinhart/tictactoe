/**
 * Port: StoragePort
 *
 * Abstracts key-value persistence so domain/app layers never access
 * localStorage directly. Enables testing with in-memory stubs and
 * swapping to IndexedDB, SQLite, or cloud storage without touching
 * business logic.
 */
export interface StoragePort {
  /** Load a value by key, returning fallback if missing or corrupt. */
  load<T>(key: string, fallback: T | null): T | null

  /** Persist a value under the given key. */
  save(key: string, value: unknown): void

  /** Remove a key from storage. */
  remove(key: string): void
}
