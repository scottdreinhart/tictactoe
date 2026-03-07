import { useEffect, useRef } from 'react'
import { BOARD_SIZE } from '../domain/constants.js'

const NAV_KEYS = new Set([
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'w',
  'a',
  's',
  'd',
  'W',
  'A',
  'S',
  'D',
])

/**
 * Compute the next focused index for a given arrow direction.
 * Clamps at grid edges (no wrapping).
 */
const getNextIndex = (current, key) => {
  const row = Math.floor(current / BOARD_SIZE)
  const col = current % BOARD_SIZE
  const k = key.length === 1 ? key.toLowerCase() : key

  switch (k) {
    case 'ArrowUp':
    case 'w':
      return row > 0 ? current - BOARD_SIZE : current
    case 'ArrowDown':
    case 's':
      return row < BOARD_SIZE - 1 ? current + BOARD_SIZE : current
    case 'ArrowLeft':
    case 'a':
      return col > 0 ? current - 1 : current
    case 'ArrowRight':
    case 'd':
      return col < BOARD_SIZE - 1 ? current + 1 : current
    default:
      return current
  }
}

/**
 * useGridKeyboard — Custom hook
 *
 * Registers a document-level keydown listener for grid navigation
 * (arrow keys + WASD) and selection (Space / Enter).
 * Uses mutable refs so the single listener never goes stale.
 *
 * @param {number} focusedIndex  — currently focused cell index
 * @param {(index: number) => void} onFocusChange — callback to move focus
 * @param {(index: number) => void} onSelect — callback to select a cell
 */
const useGridKeyboard = (focusedIndex, onFocusChange, onSelect) => {
  const focusedRef = useRef(focusedIndex)
  const selectRef = useRef(onSelect)
  const focusChangeRef = useRef(onFocusChange)

  focusedRef.current = focusedIndex
  selectRef.current = onSelect
  focusChangeRef.current = onFocusChange

  useEffect(() => {
    const handler = (e) => {
      const key = e.key

      // Navigation
      if (NAV_KEYS.has(key)) {
        e.preventDefault()
        const next = getNextIndex(focusedRef.current, key)
        if (next !== focusedRef.current) {
          focusChangeRef.current(next)
        }
        return
      }

      // Selection
      if (key === ' ' || key === 'Enter') {
        e.preventDefault()
        selectRef.current(focusedRef.current)
      }
    }

    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, []) // empty deps — single listener for lifetime of component
}

export default useGridKeyboard
