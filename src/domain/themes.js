/**
 * themes.js — Domain-level theme definitions
 *
 * Pure data: color theme palettes, colorblind-safe mark colors,
 * and mode (light/dark) variants. Zero React dependencies.
 */

/** Available color themes */
export const COLOR_THEMES = [
  { id: 'classic', label: 'Classic', accent: '#667eea', gradient: ['#667eea', '#764ba2'] },
  { id: 'ocean', label: 'Ocean', accent: '#0ea5e9', gradient: ['#0369a1', '#0ea5e9'] },
  { id: 'sunset', label: 'Sunset', accent: '#f97316', gradient: ['#dc2626', '#f97316'] },
  { id: 'forest', label: 'Forest', accent: '#22c55e', gradient: ['#166534', '#22c55e'] },
  { id: 'rose', label: 'Rose', accent: '#f43f5e', gradient: ['#be123c', '#fb7185'] },
  { id: 'midnight', label: 'Midnight', accent: '#a78bfa', gradient: ['#312e81', '#7c3aed'] },
]

/** Display modes */
export const MODES = ['system', 'light', 'dark']

/** Colorblind presets — null means "none" (default) */
export const COLORBLIND_MODES = [
  { id: 'none', label: 'None' },
  { id: 'protanopia', label: 'Protanopia', description: 'Red-blind' },
  { id: 'deuteranopia', label: 'Deuteranopia', description: 'Green-blind' },
  { id: 'tritanopia', label: 'Tritanopia', description: 'Blue-blind' },
  { id: 'achromatopsia', label: 'Achromatopsia', description: 'Total color blindness' },
]

/** Default settings */
export const DEFAULT_SETTINGS = {
  colorTheme: 'classic',
  mode: 'system',
  colorblind: 'none',
}
