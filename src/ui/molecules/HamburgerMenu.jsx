import React, { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import useDropdownBehavior from '../../app/useDropdownBehavior.js'
import styles from './HamburgerMenu.module.css'

/**
 * HamburgerMenu — Molecule
 *
 * Accessible hamburger (☰) menu button + dropdown panel.
 * Renders its `children` inside a collapsible panel with:
 *
 *   - `aria-haspopup="true"` + `aria-expanded` on the trigger
 *   - `role="menu"` + `aria-label` on the panel
 *   - Focus trap: Tab / Shift+Tab cycles within the panel
 *   - Closes on Escape, outside click, or outside touch
 *   - Smart positioning: auto-detects left vs. right alignment to avoid viewport overflow
 *   - Animated via CSS (`panelEnter` keyframe)
 *
 * @param {{ children: React.ReactNode }} props
 */
const HamburgerMenu = ({ children }) => {
  const [open, setOpen] = useState(false)
  const [panelPos, setPanelPos] = useState(null)
  const btnRef = useRef(null)
  const panelRef = useRef(null)

  // Compute fixed position from button bounding rect, aligned to board's right edge
  useLayoutEffect(() => {
    if (!open || !btnRef.current) return
    const rect = btnRef.current.getBoundingClientRect()
    // Find the board grid element to align the panel's right edge with the board's right edge
    const boardEl = document.getElementById('game-board')
    const boardRect = boardEl ? boardEl.getBoundingClientRect() : { left: 0, right: window.innerWidth }
    const panelWidth = 240
    const pad = 8
    // Align panel's right edge to the board's right edge
    let left = boardRect.right - panelWidth
    // If that overflows left of the board, clamp to board's left edge
    if (left < boardRect.left + pad) left = boardRect.left + pad
    setPanelPos({ top: rect.bottom + 8, left })
  }, [open])

  const toggle = useCallback(() => {
    setOpen((prev) => !prev)
  }, [])

  // Close on outside click / touch / Escape + focus trap via shared hook
  useDropdownBehavior({
    open,
    onClose: () => setOpen(false),
    triggerRef: btnRef,
    panelRef: panelRef,
  })

  return (
    <div className={styles.root}>
      <button
        ref={btnRef}
        type="button"
        className={styles.button}
        onClick={toggle}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls="game-menu-panel"
        aria-label={open ? 'Close menu' : 'Open menu'}
        title="Menu"
      >
        <span className={styles.icon} aria-hidden="true">
          <span className={`${styles.line}${open ? ` ${styles.lineOpen}` : ''}`} />
          <span className={`${styles.line}${open ? ` ${styles.lineOpen}` : ''}`} />
          <span className={`${styles.line}${open ? ` ${styles.lineOpen}` : ''}`} />
        </span>
      </button>

      {open && createPortal(
        <div
          ref={panelRef}
          id="game-menu-panel"
          className={styles.panel}
          role="menu"
          aria-label="Game settings"
          style={panelPos ? { top: panelPos.top, left: panelPos.left } : { visibility: 'hidden' }}
        >
          {children}
        </div>,
        document.body
      )}
    </div>
  )
}

HamburgerMenu.propTypes = {
  children: PropTypes.node.isRequired,
}

export default HamburgerMenu
