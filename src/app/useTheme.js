import { useState, useEffect, useCallback } from 'react'
import { COLOR_THEMES, DEFAULT_SETTINGS } from '../domain/themes.js'

const STORAGE_KEY = 'ttt-theme-settings'

/* ── On-demand theme CSS with preload ────────────────────────────────────
   Each non-classic theme lives in its own CSS file. import.meta.glob with
   ?inline returns the processed CSS text lazily (code-split chunk).
   
   CSS Code-Splitting Strategy:
   - Classic theme: bundled in main stylesheet (default)
   - Other themes: loaded on-demand as separate chunks
   - Preload: hidden <link> with rel="preload" for instant switching
   
   Bundle Impact:
   - Main CSS: ~25KB (classic + shared globals)
   - Per-theme chunk: ~2-3KB each (ocean, sunset, forest, etc.)
   - Only active theme loaded; others preload when app starts
────────────────────────────────────────────────────────────────────────── */
const themeLoaders = import.meta.glob('../themes/*.css', {
  query: '?inline',
  import: 'default',
})

let activeThemeStyle = null
const preloadedThemes = new Map() // Cache loaded theme CSS

/**
 * Preload theme CSS into memory cache without injecting into DOM.
 * Called at startup to reduce perceived latency when switching themes.
 */
const preloadTheme = async (themeId) => {
  if (preloadedThemes.has(themeId) || themeId === 'classic') return

  const loader = themeLoaders[`../themes/${themeId}.css`]
  if (loader) {
    try {
      const css = await loader()
      preloadedThemes.set(themeId, css)
    } catch {
      // Theme file not found — skip preload
    }
  }
}

/**
 * Preload all non-classic themes at app startup for instant switching.
 */
const preloadAllThemes = () => {
  COLOR_THEMES.forEach(({ id }) => {
    if (id !== 'classic') {
      preloadTheme(id).catch(() => {})
    }
  })
}

/**
 * Load a theme's CSS on demand (from cache or network) and inject into DOM.
 * Removes any previously injected theme style first.
 */
const applyThemeCSS = async (themeId) => {
  if (activeThemeStyle) {
    activeThemeStyle.remove()
    activeThemeStyle = null
  }
  if (themeId === 'classic') return

  // Check cache first
  let css = preloadedThemes.get(themeId)
  if (!css) {
    const loader = themeLoaders[`../themes/${themeId}.css`]
    if (!loader) return
    css = await loader()
  }

  const el = document.createElement('style')
  el.setAttribute('data-theme-chunk', themeId)
  el.textContent = css
  document.head.appendChild(el)
  activeThemeStyle = el
}

/**
 * Read persisted settings from localStorage (or return defaults).
 */
const loadSettings = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return { ...DEFAULT_SETTINGS, ...parsed }
    }
  } catch {
    /* ignore corrupt storage */
  }
  return { ...DEFAULT_SETTINGS }
}

/**
 * Persist settings to localStorage.
 */
const saveSettings = (settings) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch {
    /* storage full / unavailable — silently ignore */
  }
}

/**
 * Apply theme settings to the document root element.
 */
const applyToDOM = (settings) => {
  const root = document.documentElement

  // Color theme
  root.setAttribute('data-theme', settings.colorTheme)

  // Light / dark mode
  if (settings.mode === 'system') {
    root.removeAttribute('data-mode')
  } else {
    root.setAttribute('data-mode', settings.mode)
  }

  // Colorblind
  if (settings.colorblind === 'none') {
    root.removeAttribute('data-colorblind')
  } else {
    root.setAttribute('data-colorblind', settings.colorblind)
  }
}

/**
 * useTheme — application hook
 *
 * Manages color theme, light/dark mode, and colorblind settings.
 * Persists to localStorage and syncs to data-* attributes on <html>.
 *
 * Returns:
 *   settings       — { colorTheme, mode, colorblind }
 *   setColorTheme  — (id: string) => void
 *   setMode        — ('system'|'light'|'dark') => void
 *   setColorblind  — (id: string) => void
 */
const useTheme = () => {
  const [settings, setSettings] = useState(loadSettings)

  // Preload all themes on first mount for instant switching
  useEffect(() => {
    preloadAllThemes()
  }, [])

  // Sync to DOM + localStorage whenever settings change
  useEffect(() => {
    applyToDOM(settings)
    applyThemeCSS(settings.colorTheme)
    saveSettings(settings)
  }, [settings])

  const setColorTheme = useCallback((id) => {
    setSettings((prev) => ({ ...prev, colorTheme: id }))
  }, [])

  const setMode = useCallback((mode) => {
    setSettings((prev) => ({ ...prev, mode }))
  }, [])

  const setColorblind = useCallback((id) => {
    setSettings((prev) => ({ ...prev, colorblind: id }))
  }, [])

  return { settings, setColorTheme, setMode, setColorblind }
}

export default useTheme
