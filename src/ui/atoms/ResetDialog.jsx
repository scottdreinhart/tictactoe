import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'

/**
 * ResetDialog — Atom
 *
 * A modal dialog shown when the game ends, displaying a countdown
 * and offering an early-reset button so the player doesn't have to
 * wait the full 30 seconds.
 *
 * Uses the native <dialog> element for accessibility (focus trap,
 * Escape-to-close, backdrop).
 *
 * @param {{ seconds: number, onReset: () => void }} props
 */
const ResetDialog = ({ seconds, onReset }) => {
  const dialogRef = useRef(null)

  useEffect(() => {
    const el = dialogRef.current
    if (el && !el.open) {
      el.showModal()
    }
  }, [])

  return (
    <dialog ref={dialogRef} className="reset-dialog" onClose={onReset}>
      <div className="reset-dialog__body">
        <p className="reset-dialog__text">
          New game in{' '}
          <strong className="reset-dialog__countdown">{seconds}</strong>
          {seconds === 1 ? ' second' : ' seconds'}…
        </p>
        <button
          type="button"
          className="reset-button reset-dialog__btn"
          onClick={onReset}
        >
          Reset Now
        </button>
      </div>
    </dialog>
  )
}

ResetDialog.propTypes = {
  seconds: PropTypes.number.isRequired,
  onReset: PropTypes.func.isRequired,
}

export default ResetDialog
