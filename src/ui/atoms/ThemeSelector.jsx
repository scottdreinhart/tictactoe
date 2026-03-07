import React, { useCallback, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { COLOR_THEMES, MODES, COLORBLIND_MODES } from '../../domain/themes.js'
import useSmartPosition from '../../app/useSmartPosition.js'
import useDropdownBehavior from '../../app/useDropdownBehavior.js'
import { THEME_PANEL_LABEL } from '../../domain/ui-constants.js'
import styles from './ThemeSelector.module.css'
import { cx } from '../utils/cssModules.js'

/**
 * ThemeSelector — Atom (pure presentational)
 *
 * Collapsible settings panel with:
 *   - 6 color theme swatches
 *   - Light / System / Dark mode toggle
 *   - Colorblind mode selector
 *
 * Uses useSmartPosition + useDropdownBehavior for smart alignment & lifecycle management.
 * SOLID: Components depend on hook abstractions, not concrete implementation.
 *
 * @param {{
 *   settings: { colorTheme: string, mode: string, colorblind: string },
 *   onColorTheme: (id: string) => void,
 *   onMode: (mode: string) => void,
 *   onColorblind: (id: string) => void,
 * }} props
 */
const ThemeSelector = React.memo(({ settings, onColorTheme, onMode, onColorblind }) => {
  const [open, setOpen] = useState(false)
  const btnRef = useRef(null)
  const panelRef = useRef(null)

  // Smart positioning: auto-detect left/right to prevent viewport overflow
  const alignment = useSmartPosition({
    trigger: btnRef,
    panel: panelRef,
    minPanelWidth: 280,
    viewportPadding: 16,
    preferredAlignment: 'right',
  })

  const toggle = useCallback(() => {
    setOpen((prev) => !prev)
  }, [])

  // Close on outside click / touch / Escape + focus restoration
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
        className={styles.toggle}
        onClick={toggle}
        aria-expanded={open}
        aria-label="Theme settings"
        title="Theme settings"
      >
        🎨
      </button>

      {open && (
        <div
          ref={panelRef}
          className={alignment === 'left' ? styles.panelLeft : styles.panel}
          role="dialog"
          aria-label={THEME_PANEL_LABEL}
        >
          {/* ── Color Themes ── */}
          <fieldset className={styles.section}>
            <legend className={styles.sectionLegend}>Theme</legend>
            <div className={styles.swatches}>
              {COLOR_THEMES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={cx(styles.swatch, settings.colorTheme === t.id && styles.swatchActive)}
                  style={{ background: `linear-gradient(135deg, ${t.gradient[0]}, ${t.gradient[1]})` }}
                  onClick={() => onColorTheme(t.id)}
                  aria-label={t.label}
                  aria-pressed={settings.colorTheme === t.id}
                  title={t.label}
                />
              ))}
            </div>
          </fieldset>

          {/* ── Light / Dark Mode ── */}
          <fieldset className={styles.section}>
            <legend className={styles.sectionLegend}>Mode</legend>
            <div className={styles.modeGroup}>
              {MODES.map((m) => (
                <button
                  key={m}
                  type="button"
                  className={cx(styles.modeBtn, settings.mode === m && styles.modeActive)}
                  onClick={() => onMode(m)}
                  aria-pressed={settings.mode === m}
                >
                  {m === 'system' ? '⚙️' : m === 'light' ? '☀️' : '🌙'}{' '}
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </button>
              ))}
            </div>
          </fieldset>

          {/* ── Colorblind ── */}
          <fieldset className={styles.section}>
            <legend className={styles.sectionLegend}>Colorblind</legend>
            <div className={styles.colorblindGroup}>
              {COLORBLIND_MODES.map((cb) => (
                <button
                  key={cb.id}
                  type="button"
                  className={cx(styles.colorblindBtn, settings.colorblind === cb.id && styles.colorblindActive)}
                  onClick={() => onColorblind(cb.id)}
                  aria-pressed={settings.colorblind === cb.id}
                  title={cb.description || cb.label}
                >
                  {cb.label}
                </button>
              ))}
            </div>
          </fieldset>
        </div>
      )}
    </div>
  )
})

ThemeSelector.displayName = 'ThemeSelector'

ThemeSelector.propTypes = {
  settings: PropTypes.shape({
    colorTheme: PropTypes.string.isRequired,
    mode: PropTypes.string.isRequired,
    colorblind: PropTypes.string.isRequired,
  }).isRequired,
  onColorTheme: PropTypes.func.isRequired,
  onMode: PropTypes.func.isRequired,
  onColorblind: PropTypes.func.isRequired,
}

export default ThemeSelector
