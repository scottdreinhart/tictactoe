import React, { useRef, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { BOARD_SIZE } from '../../domain/constants.js'
import CellButton from '../atoms/CellButton.jsx'
import useGridKeyboard from '../../app/useGridKeyboard.js'

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
 * }} props
 */
const BoardGrid = ({ board, focusedIndex, onFocusChange, onSelect, isGameOver, winLine }) => {
  const cellRefs = useRef([])
  const [isResetting, setIsResetting] = useState(false)
  const prevBoardRef = useRef(board)

  // Keyboard navigation via reusable hook
  useGridKeyboard(focusedIndex, onFocusChange, onSelect)

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
            onClick={() => onSelect(index)}
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
