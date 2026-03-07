/**
 * storageService.js — Application service
 *
 * Thin wrapper around localStorage that handles:
 * - JSON serialization / deserialization
 * - Corrupt or missing data → returns fallback
 * - Full or unavailable storage → silent no-op
 *
 * Every call is synchronous (localStorage is sync) and exception-safe.
 */

/**
 * Load a JSON value from localStorage.
 *
 * @param {string} key       — localStorage key
 * @param {*}      fallback  — value to return when key is missing or corrupt
 * @returns {*} parsed value or fallback
 */
export const load = (key, fallback = null) => {
  try {
    const raw = localStorage.getItem(key)
    if (raw !== null) return JSON.parse(raw)
  } catch {
    /* corrupt JSON or storage unavailable */
  }
  return fallback
}

/**
 * Save a JSON-serialisable value to localStorage.
 *
 * @param {string} key   — localStorage key
 * @param {*}      value — any JSON-serialisable value
 */
export const save = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage full or unavailable — silently ignore */
  }
}

/**
 * Remove a key from localStorage.
 *
 * @param {string} key — localStorage key to remove
 */
export const remove = (key) => {
  try {
    localStorage.removeItem(key)
  } catch {
    /* storage unavailable — silently ignore */
  }
}
