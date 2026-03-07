import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import styles from './NotificationBanner.module.css'
import { cx } from '../utils/cssModules.js'

/**
 * NotificationBanner — Atom
 *
 * A floating banner that displays over the center of the board.
 * Renders the current notification from the queue and auto-dismisses
 * after the notification's `duration` (if > 0).
 *
 * Supports an optional action button (e.g. "Reset Now" during countdown).
 *
 * @param {{
 *   notification: object|null,
 *   onDismiss: () => void,
 *   onAction: () => void,
 * }} props
 */
const NotificationBanner = ({ notification, onDismiss, onAction }) => {
  const timerRef = useRef(null)

  // Derive primitive deps so the effect doesn't depend on the full object.
  const nId = notification?.id
  const nDuration = notification?.duration ?? 0

  // Auto-dismiss after duration
  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    if (!nId || nDuration <= 0) return

    timerRef.current = setTimeout(onDismiss, nDuration)

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [nId, nDuration, onDismiss])

  if (!notification) return null

  return (
    <div
      className={cx(
        styles.root,
        notification.variant === 'win' && styles.win,
        notification.variant === 'loss' && styles.loss,
        notification.variant === 'draw' && styles.draw,
        notification.variant === 'countdown' && styles.countdown,
        notification.variant === 'info' && styles.info,
      )}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      key={notification.id}
    >
      <p className={styles.message}>{notification.message}</p>
      {notification.hasAction && onAction && (
        <button type="button" className={styles.action} onClick={onAction}>
          Reset Now
        </button>
      )}
    </div>
  )
}

NotificationBanner.propTypes = {
  notification: PropTypes.shape({
    id: PropTypes.number.isRequired,
    message: PropTypes.string.isRequired,
    variant: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
    hasAction: PropTypes.bool,
  }),
  onDismiss: PropTypes.func.isRequired,
  onAction: PropTypes.func,
}

export default NotificationBanner
