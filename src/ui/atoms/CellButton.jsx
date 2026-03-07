import React from 'react'
import PropTypes from 'prop-types'
import styles from './CellButton.module.css'
import { cx } from '../utils/cssModules.js'
import XMark from './XMark.jsx'
import OMark from './OMark.jsx'

/**
 * CellButton — Atom (pure presentational)
 *
 * Renders a single board cell as a <button> with SVG marks.
 * Contains ZERO game logic or navigation logic.
 * Keyboard handling lives at the document level in BoardGrid.
 *
 * @param {{
 *   value: string|null,
 *   disabled: boolean,
 *   isFocused: boolean,
 *   isWinning: boolean,
 *   focusDirection: 'up'|'down'|'left'|'right'|null,
 *   onClick: () => void,
 *   ariaLabel: string,
 *   tabIndex: number,
 * }} props
 */
const CellButton = React.forwardRef(
  (
    { value, disabled, isFocused, isWinning, focusDirection, onClick, ariaLabel, tabIndex },
    ref,
  ) => {
    const focusClassName =
      isFocused && focusDirection
        ? styles[`focus${focusDirection.charAt(0).toUpperCase() + focusDirection.slice(1)}`]
        : ''

    return (
      <button
        ref={ref}
        type="button"
        className={cx(
          styles.root,
          value === 'X' && styles.tokenX,
          value === 'O' && styles.tokenO,
          isFocused && styles.focused,
          focusClassName,
          disabled && styles.disabled,
          isWinning && styles.winning,
        )}
        onClick={disabled ? undefined : onClick}
        aria-label={ariaLabel}
        aria-disabled={disabled}
        tabIndex={tabIndex}
      >
        {value === 'X' && <XMark className={cx(styles.mark, styles.markx)} />}
        {value === 'O' && <OMark className={cx(styles.mark, styles.marko)} />}
      </button>
    )
  },
)

CellButton.displayName = 'CellButton'

CellButton.propTypes = {
  value: PropTypes.oneOf(['X', 'O', null]),
  disabled: PropTypes.bool.isRequired,
  isFocused: PropTypes.bool.isRequired,
  isWinning: PropTypes.bool.isRequired,
  focusDirection: PropTypes.oneOf(['up', 'down', 'left', 'right', null]),
  onClick: PropTypes.func.isRequired,
  ariaLabel: PropTypes.string.isRequired,
  tabIndex: PropTypes.number.isRequired,
}

export default CellButton
