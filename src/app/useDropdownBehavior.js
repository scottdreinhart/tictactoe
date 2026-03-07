import { useCallback, useEffect } from 'react'

/**
 * useDropdownBehavior — Application hook
 *
 * Encapsulates common dropdown/popover behavior:
 * - Close on outside click/touch
 * - Close on Escape key
 * - Focus restoration on close
 *
 * SOLID: Single Responsibility Principle
 * - This hook has ONE job: manage open/close lifecycle
 * - Components compose it rather than duplicate logic
 *
 * @param {Object} config
 *   - open: boolean (is dropdown open?)
 *   - onClose: function (called when dropdown should close)
 *   - triggerRef: ref to trigger element (for focus restoration)
 *   - panelRef: ref to dropdown panel
 *   - onOutsideClick: optional custom handler before close
 *
 * @returns void (hook manages event listeners internally)
 */
const useDropdownBehavior = ({
  open,
  onClose,
  triggerRef,
  panelRef,
  onOutsideClick,
} = {}) => {
  // Close on outside click / touch / Escape
  useEffect(() => {
    if (!open) return

    const handleOutside = (e) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target) &&
        panelRef.current &&
        !panelRef.current.contains(e.target)
      ) {
        onOutsideClick?.()
        onClose()
      }
    }

    const handleKey = (e) => {
      if (e.key === 'Escape') {
        onClose()
        triggerRef.current?.focus()
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
  }, [open, onClose, triggerRef, panelRef, onOutsideClick])
}

export default useDropdownBehavior
