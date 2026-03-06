import React, { useRef, useEffect } from 'react'
import { BOARD_SIZE } from '../../domain/constants.js'
import CellButton from '../atoms/CellButton.jsx'

const NAV_KEYS = new Set([
  'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
  'w', 'a', 's', 'd',
  'W', 'A', 'S', 'D',
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
 * BoardGrid — Molecule
 *
 * Renders the 3×3 grid of CellButtons.
 * Owns all keyboard navigation logic (arrows + WASD) via a
 * document-level keydown listener — works regardless of which
 * element currently holds DOM focus.
 *
 * @param {{
 *   board: Array<null|string>,
 *   focusedIndex: number,
 *   onFocusChange: (index: number) => void,
 *   onSelect: (index: number) => void,
 *   isGameOver: boolean,
 * }} props
 */
const BoardGrid = ({ board, focusedIndex, onFocusChange, onSelect, isGameOver }) => {
  const cellRefs = useRef([])

  // Keep mutable refs to latest values so the listener closure never goes stale
  const focusedRef = useRef(focusedIndex)
  const selectRef = useRef(onSelect)
  const focusChangeRef = useRef(onFocusChange)

  focusedRef.current = focusedIndex
  selectRef.current = onSelect
  focusChangeRef.current = onFocusChange

  // Sync DOM focus whenever focusedIndex changes
  useEffect(() => {
    const el = cellRefs.current[focusedIndex]
    if (el) {
      el.focus()
    }
  }, [focusedIndex])

  // Document-level keydown listener — always active, no dependency on button focus
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

  return (
    <div
      className="board-grid"
      role="grid"
      aria-label="Tic-Tac-Toe board"
    >
      {board.map((value, index) => {
        const isDisabled = isGameOver || value !== null

        return (
          <CellButton
            ref={(el) => { cellRefs.current[index] = el }}
            key={index}
            value={value}
            disabled={isDisabled}
            isFocused={focusedIndex === index}
            onClick={() => onSelect(index)}
            ariaLabel={`Row ${Math.floor(index / BOARD_SIZE) + 1}, Column ${(index % BOARD_SIZE) + 1}, ${value ?? 'empty'}`}
            tabIndex={focusedIndex === index ? 0 : -1}
          />
        )
      })}
    </div>
  )
}

export default BoardGrid
