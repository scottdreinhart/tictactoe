import React, { useCallback, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'

/**
 * HamburgerMenu — Atom
 *
 * Accessible hamburger (☰) menu button + dropdown panel.
 * Renders its `children` inside a collapsible panel with:
 *
 *   - `aria-haspopup="true"` + `aria-expanded` on the trigger
 *   - `role="menu"` + `aria-label` on the panel
 *   - Focus trap: Tab / Shift+Tab cycles within the panel
 *   - Closes on Escape, outside click, or outside touch
 *   - Animated via CSS (`menu-panel-enter` keyframe)
 *
 * @param {{ children: React.ReactNode }} props
 */
const HamburgerMenu = ({ children }) => {
  const [open, setOpen] = useState(false)
  const btnRef = useRef(null)
  const panelRef = useRef(null)

  const toggle = useCallback(() => {
    setOpen((prev) => !prev)
  }, [])

  // Close on outside click / touch / Escape
  useEffect(() => {
    if (!open) return

    const handleOutside = (e) => {
      if (
        btnRef.current &&
        !btnRef.current.contains(e.target) &&
        panelRef.current &&
        !panelRef.current.contains(e.target)
      ) {
        setOpen(false)
      }
    }

    const handleKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        btnRef.current?.focus()
      }
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

  // Focus trap: cycle Tab within the panel
  useEffect(() => {
    if (!open || !panelRef.current) return

    const handleTrap = (e) => {
      if (e.key !== 'Tab') return

      const focusable = panelRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    panelRef.current.addEventListener('keydown', handleTrap)
    const panel = panelRef.current
    return () => panel.removeEventListener('keydown', handleTrap)
  }, [open])

  return (
    <div className="hamburger-menu">
      <button
        ref={btnRef}
        type="button"
        className="hamburger-btn"
        onClick={toggle}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls="game-menu-panel"
        aria-label={open ? 'Close menu' : 'Open menu'}
        title="Menu"
      >
        <span className="hamburger-icon" aria-hidden="true">
          <span className={`hamburger-line${open ? ' line-open' : ''}`} />
          <span className={`hamburger-line${open ? ' line-open' : ''}`} />
          <span className={`hamburger-line${open ? ' line-open' : ''}`} />
        </span>
      </button>

      {open && (
        <div
          ref={panelRef}
          id="game-menu-panel"
          className="menu-panel"
          role="menu"
          aria-label="Game settings"
        >
          {children}
        </div>
      )}
    </div>
  )
}

HamburgerMenu.propTypes = {
  children: PropTypes.node.isRequired,
}

export default HamburgerMenu
