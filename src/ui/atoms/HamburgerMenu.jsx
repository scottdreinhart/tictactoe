import React, { useCallback, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import useSmartPosition from '../../app/useSmartPosition.js'
import useDropdownBehavior from '../../app/useDropdownBehavior.js'
import styles from './HamburgerMenu.module.css'

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
 *   - Smart positioning: auto-detects left vs. right alignment to avoid viewport overflow
 *   - Animated via CSS (`panelEnter` keyframe)
 *
 * @param {{ children: React.ReactNode }} props
 */
const HamburgerMenu = ({ children }) => {
  const [open, setOpen] = useState(false)
  const btnRef = useRef(null)
  const panelRef = useRef(null)

  // Smart positioning: depends on DIP abstraction
  const alignment = useSmartPosition({
    trigger: btnRef,
    panel: panelRef,
    minPanelWidth: 240,
    viewportPadding: 16,
    preferredAlignment: 'right',
  })

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

      {open && (
        <div
          ref={panelRef}
          id="game-menu-panel"
          className={alignment === 'left' ? styles.panelLeft : styles.panel}
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
