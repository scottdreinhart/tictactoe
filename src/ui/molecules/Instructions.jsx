import React, { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Instructions — Molecule
 *
 * An (ⓘ) info icon that, when tapped/clicked, opens a tooltip with
 * "How to Play" instructions.  The tooltip automatically positions
 * itself toward whichever direction has the most available space so
 * it never overflows the viewport.
 */

/**
 * Measure available space around the button and pick the best side.
 * Returns one of: 'above', 'below', 'left', 'right'.
 */
const bestPlacement = (btnRect) => {
  const vw = document.documentElement.clientWidth
  const vh = document.documentElement.clientHeight

  const above = btnRect.top
  const below = vh - btnRect.bottom
  const left = btnRect.left
  const right = vw - btnRect.right

  const max = Math.max(above, below, left, right)

  if (max === below) return 'below'
  if (max === above) return 'above'
  if (max === right) return 'right'
  return 'left'
}

const Instructions = () => {
  const [open, setOpen] = useState(false)
  const [placement, setPlacement] = useState('below')
  const btnRef = useRef(null)
  const tooltipRef = useRef(null)

  const toggle = useCallback(() => {
    if (!open && btnRef.current) {
      setPlacement(bestPlacement(btnRef.current.getBoundingClientRect()))
    }
    setOpen((prev) => !prev)
  }, [open])

  // Close when clicking outside
  useEffect(() => {
    if (!open) return

    const handleOutside = (e) => {
      if (
        btnRef.current &&
        !btnRef.current.contains(e.target) &&
        tooltipRef.current &&
        !tooltipRef.current.contains(e.target)
      ) {
        setOpen(false)
      }
    }

    // Close on Escape
    const handleKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('touchstart', handleOutside)
    document.addEventListener('keydown', handleKey)

    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('touchstart', handleOutside)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  return (
    <div className="info-icon-wrapper">
      <button
        ref={btnRef}
        className="info-icon-btn"
        onClick={toggle}
        aria-label="How to play"
        aria-expanded={open}
        type="button"
      >
        &#9432; {/* ⓘ  info circle */}
      </button>

      {open && (
        <div
          ref={tooltipRef}
          className={`info-tooltip info-tooltip--${placement}`}
          role="tooltip"
        >
          <h3 className="info-tooltip__title">How to Play</h3>
          <ul className="info-tooltip__list">
            <li>You are <strong>X</strong>, the CPU is <strong>O</strong></li>
            <li>You move first</li>
            <li>
              <strong>Click</strong> a cell, or use{' '}
              <strong>Arrow Keys / WASD</strong> to navigate and{' '}
              <strong>Space/Enter</strong> to select
            </li>
            <li>First to get 3 in a row wins!</li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default Instructions
