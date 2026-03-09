/**
 * Adapter: InMemoryStorageAdapter
 *
 * In-memory implementation of StoragePort for testing.
 * Stores data in a plain Map — no localStorage dependency.
 */
import type { StoragePort } from '@/domain/ports'

export const createInMemoryStorageAdapter = (): StoragePort & { store: Map<string, string> } => {
  const store = new Map<string, string>()

  return {
    store,

    load<T>(key: string, fallback: T | null = null): T | null {
      const raw = store.get(key)
      if (raw !== undefined) {
        try {
          return JSON.parse(raw) as T
        } catch {
          /* corrupt JSON */
        }
      }
      return fallback
    },

    save(key: string, value: unknown): void {
      store.set(key, JSON.stringify(value))
    },

    remove(key: string): void {
      store.delete(key)
    },
  }
}
