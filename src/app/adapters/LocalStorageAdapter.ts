/**
 * Adapter: LocalStorageAdapter
 *
 * Production implementation of StoragePort backed by window.localStorage.
 * Handles JSON serialization and silently swallows errors when storage
 * is unavailable or corrupt (graceful degradation).
 */
import type { StoragePort } from '@/domain/ports'

export const LocalStorageAdapter: StoragePort = {
  load<T>(key: string, fallback: T | null = null): T | null {
    try {
      const raw = localStorage.getItem(key)
      if (raw !== null) return JSON.parse(raw) as T
    } catch {
      /* corrupt JSON or storage unavailable */
    }
    return fallback
  },

  save(key: string, value: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* storage full or unavailable — silently ignore */
    }
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch {
      /* storage unavailable — silently ignore */
    }
  },
}
