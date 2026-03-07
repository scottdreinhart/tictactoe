import { useState, useEffect, useCallback } from 'react'
import { DEFAULT_SETTINGS } from '../domain/themes.js'

const STORAGE_KEY = 'ttt-theme-settings'

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

  // Sync to DOM + localStorage whenever settings change
  useEffect(() => {
    applyToDOM(settings)
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
