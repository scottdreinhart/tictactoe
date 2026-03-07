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
  {
    id: 'highcontrast',
    label: 'High Contrast',
    accent: '#ffcc00',
    gradient: ['#000000', '#1a1a1a'],
  },
]

/** Display modes */
export const MODES = ['system', 'light', 'dark']

/** Colorblind presets — null means "none" (default) */
export const COLORBLIND_MODES = [
  { id: 'none', label: 'Standard' },
  { id: 'protanopia', label: 'Red Weakness', description: 'Protanopia' },
  { id: 'deuteranopia', label: 'Green Weakness', description: 'Deuteranopia' },
  { id: 'tritanopia', label: 'Blue Weakness', description: 'Tritanopia' },
  { id: 'achromatopsia', label: 'Monochrome', description: 'Complete Achromatopsia' },
]

/** Default settings */
export const DEFAULT_SETTINGS = {
  colorTheme: 'highcontrast',
  mode: 'system',
  colorblind: 'none',
}
