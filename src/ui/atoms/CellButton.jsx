import React from 'react'
import PropTypes from 'prop-types'
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
 *   onClick: () => void,
 *   ariaLabel: string,
 *   tabIndex: number,
 * }} props
 */
const CellButton = React.forwardRef(
  ({ value, disabled, isFocused, isWinning, onClick, ariaLabel, tabIndex }, ref) => {
    const classes = [
      'cell-button',
      value ? `cell-${value}` : '',
      isFocused ? 'cell-focused' : '',
      disabled ? 'cell-disabled' : '',
      isWinning ? 'cell-winning' : '',
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <button
        ref={ref}
        type="button"
        className={classes}
        onClick={disabled ? undefined : onClick}
        aria-label={ariaLabel}
        aria-disabled={disabled}
        tabIndex={tabIndex}
      >
        {value === 'X' && <XMark />}
        {value === 'O' && <OMark />}
      </button>
    )
  }
)

CellButton.displayName = 'CellButton'

CellButton.propTypes = {
  value: PropTypes.oneOf(['X', 'O', null]),
  disabled: PropTypes.bool.isRequired,
  isFocused: PropTypes.bool.isRequired,
  isWinning: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  ariaLabel: PropTypes.string.isRequired,
  tabIndex: PropTypes.number.isRequired,
}

export default CellButton
