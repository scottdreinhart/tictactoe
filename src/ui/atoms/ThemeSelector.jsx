import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { COLOR_THEMES, MODES, COLORBLIND_MODES } from '../../domain/themes.js'

/**
 * ThemeSelector — Atom (pure presentational)
 *
 * Collapsible settings panel with:
 *   - 6 color theme swatches
 *   - Light / System / Dark mode toggle
 *   - Colorblind mode selector
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

  return (
    <div className="theme-selector">
      <button
        type="button"
        className="theme-selector-toggle"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label="Theme settings"
        title="Theme settings"
      >
        🎨
      </button>

      {open && (
        <div className="theme-panel" role="dialog" aria-label="Theme settings">
          {/* ── Color Themes ── */}
          <fieldset className="theme-section">
            <legend>Theme</legend>
            <div className="theme-swatches">
              {COLOR_THEMES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`theme-swatch${settings.colorTheme === t.id ? ' swatch-active' : ''}`}
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
          <fieldset className="theme-section">
            <legend>Mode</legend>
            <div className="theme-mode-group">
              {MODES.map((m) => (
                <button
                  key={m}
                  type="button"
                  className={`theme-mode-btn${settings.mode === m ? ' mode-active' : ''}`}
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
          <fieldset className="theme-section">
            <legend>Colorblind</legend>
            <div className="theme-colorblind-group">
              {COLORBLIND_MODES.map((cb) => (
                <button
                  key={cb.id}
                  type="button"
                  className={`theme-cb-btn${settings.colorblind === cb.id ? ' cb-active' : ''}`}
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
