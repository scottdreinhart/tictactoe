import { useEffect } from 'react'

/**
 * useKeyboardShortcuts — Application hook
 *
 * Registers global keyboard shortcuts and tears them down on unmount.
 *
 * @param {Array<{
 *   key: string,
 *   ctrl?: boolean,
 *   shift?: boolean,
 *   handler: () => void,
 *   enabled?: boolean,
 * }>} shortcuts — array of shortcut descriptors
 *
 * Each descriptor:
 *   key     – the `event.key` value to match (case-insensitive)
 *   ctrl    – require Ctrl / Cmd (default false)
 *   shift   – require Shift (default false)
 *   handler – callback to invoke when matched
 *   enabled – whether this shortcut is active (default true)
 */
const useKeyboardShortcuts = (shortcuts) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      for (const s of shortcuts) {
        if (s.enabled === false) continue

        const keyMatch = e.key.toLowerCase() === s.key.toLowerCase()
        const ctrlMatch = s.ctrl ? e.ctrlKey || e.metaKey : true
        const shiftMatch = s.shift !== undefined ? e.shiftKey === s.shift : true

        if (keyMatch && ctrlMatch && shiftMatch) {
          e.preventDefault()
          s.handler()
          return
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])
}

export default useKeyboardShortcuts
