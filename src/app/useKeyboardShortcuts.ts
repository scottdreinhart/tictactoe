import { useEffect } from 'react'

interface ShortcutDescriptor {
  key: string
  ctrl?: boolean
  shift?: boolean
  handler: () => void
  enabled?: boolean
}

const useKeyboardShortcuts = (shortcuts: ShortcutDescriptor[]): void => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      for (const s of shortcuts) {
        if (s.enabled === false) {
          continue
        }

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
