import React, { useRef, useEffect, useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { BOARD_SIZE } from '../../domain/constants.js'
import CellButton from '../atoms/CellButton.jsx'
import useGridKeyboard from '../../app/useGridKeyboard.js'
import useSwipeGesture from '../../app/useSwipeGesture.js'

/**
 * BoardGrid — Molecule
 *
 * Renders the 3×3 grid of CellButtons.
 * Keyboard navigation is handled by the useGridKeyboard hook.
 *
 * @param {{
 *   board: Array<null|string>,
 *   focusedIndex: number,
 *   onFocusChange: (index: number) => void,
 *   onSelect: (index: number) => void,
 *   isGameOver: boolean,
 *   winLine: number[]|null,
 *   onNav: () => void,
 *   onTap: () => void,
 * }} props
 */
const BoardGrid = ({ board, focusedIndex, onFocusChange, onSelect, isGameOver, winLine, onNav, onTap }) => {
  const cellRefs = useRef([])
  const gridRef = useRef(null)
  const [isResetting, setIsResetting] = useState(false)
  const [focusDirection, setFocusDirection] = useState(null)
  const prevBoardRef = useRef(board)
  const prevFocusedRef = useRef(focusedIndex)

  // Keyboard navigation via reusable hook
  useGridKeyboard(focusedIndex, onFocusChange, onSelect, onNav)

  // Track focus direction for kinetic animation
  useEffect(() => {
    if (focusedIndex !== prevFocusedRef.current) {
      const prev = prevFocusedRef.current
      const curr = focusedIndex
      const prevRow = Math.floor(prev / BOARD_SIZE)
      const prevCol = prev % BOARD_SIZE
      const currRow = Math.floor(curr / BOARD_SIZE)
      const currCol = curr % BOARD_SIZE

      let direction = null
      if (currRow < prevRow) direction = 'up'
      else if (currRow > prevRow) direction = 'down'
      else if (currCol < prevCol) direction = 'left'
      else if (currCol > prevCol) direction = 'right'

      setFocusDirection(direction)
      prevFocusedRef.current = focusedIndex
    }
  }, [focusedIndex])

  // Swipe gestures — map swipe direction to focus movement
  const handleSwipe = useCallback(
    (direction) => {
      const row = Math.floor(focusedIndex / BOARD_SIZE)
      const col = focusedIndex % BOARD_SIZE
      let next = focusedIndex

      switch (direction) {
        case 'up':    next = row > 0 ? focusedIndex - BOARD_SIZE : focusedIndex; break
        case 'down':  next = row < BOARD_SIZE - 1 ? focusedIndex + BOARD_SIZE : focusedIndex; break
        case 'left':  next = col > 0 ? focusedIndex - 1 : focusedIndex; break
        case 'right': next = col < BOARD_SIZE - 1 ? focusedIndex + 1 : focusedIndex; break
      }

      if (next !== focusedIndex) {
        onFocusChange(next)
        onNav()
        // Haptic feedback for swipe navigation
        if (navigator.vibrate) navigator.vibrate(10)
      }
    },
    [focusedIndex, onFocusChange, onNav]
  )
  useSwipeGesture(gridRef, handleSwipe)

  // Wrapped onSelect with haptic feedback and sound for touch taps
  const handleSelect = useCallback(
    (index) => {
      onTap()
      if (navigator.vibrate) navigator.vibrate(15)
      onSelect(index)
    },
    [onSelect, onTap]
  )

  // Detect board reset (board went from having marks to all empty)
  useEffect(() => {
    const hadMarks = prevBoardRef.current.some((cell) => cell !== null)
    const nowEmpty = board.every((cell) => cell === null)
    if (hadMarks && nowEmpty) {
      setIsResetting(true)
      const timer = setTimeout(() => setIsResetting(false), 300)
      return () => clearTimeout(timer)
    }
    prevBoardRef.current = board
  }, [board])

  // Sync DOM focus whenever focusedIndex changes
  useEffect(() => {
    const el = cellRefs.current[focusedIndex]
    if (el) {
      el.focus()
    }
  }, [focusedIndex])

  return (
    <div
      ref={gridRef}
      className={`board-grid${isResetting ? ' board-resetting' : ''}`}
      role="grid"
      aria-label="Tic-Tac-Toe board"
    >
      {board.map((value, index) => {
        const isDisabled = isGameOver || value !== null
        const isWinning = winLine ? winLine.includes(index) : false

        return (
          <CellButton
            ref={(el) => { cellRefs.current[index] = el }}
            key={index}
            value={value}
            disabled={isDisabled}
            isFocused={focusedIndex === index}
            isWinning={isWinning}
            focusDirection={focusedIndex === index ? focusDirection : null}
            onClick={() => handleSelect(index)}
            ariaLabel={`Row ${Math.floor(index / BOARD_SIZE) + 1}, Column ${(index % BOARD_SIZE) + 1}, ${value ?? 'empty'}`}
            tabIndex={focusedIndex === index ? 0 : -1}
          />
        )
      })}
    </div>
  )
}

BoardGrid.propTypes = {
  board: PropTypes.arrayOf(PropTypes.oneOf(['X', 'O', null])).isRequired,
  focusedIndex: PropTypes.number.isRequired,
  onFocusChange: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  isGameOver: PropTypes.bool.isRequired,
  winLine: PropTypes.arrayOf(PropTypes.number),
}

export default BoardGrid
