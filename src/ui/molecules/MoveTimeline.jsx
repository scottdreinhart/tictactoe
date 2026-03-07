import React, { useState, useRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import useDropdownBehavior from '../../app/useDropdownBehavior.js'
import styles from './MoveTimeline.module.css'
import { cx } from '../utils/cssModules.js'

/**
 * MoveTimeline - Sliding drawer from the right side showing move history,
 * score, streak, best time, and undo/redo controls.
 */
export const MoveTimeline = ({
  moveHistory = [],
  currentIndex = 0,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  score,
  streak = 0,
  bestTime = null,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const drawerRef = useRef(null)
  const toggleRef = useRef(null)
  const moves = moveHistory.slice(1) // skip initial empty board

  const handleClose = useCallback(() => setIsOpen(false), [])

  // Close drawer on Escape / outside click via reusable hook
  useDropdownBehavior({
    open: isOpen,
    onClose: handleClose,
    triggerRef: toggleRef,
    panelRef: drawerRef,
  })

  return (
    <>
      {/* Toggle tab on right edge */}
      <button
        ref={toggleRef}
        className={cx(styles.toggleBtn, isOpen && styles.active)}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? 'Close move history' : 'Open move history'}
        title={isOpen ? 'Close move history' : 'Open move history'}
      >
        <span className={cx(styles.toggleIcon, isOpen && styles.flipped)}>◀</span>
      </button>

      {/* Backdrop */}
      <div
        className={cx(styles.backdrop, isOpen && styles.visible)}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        className={cx(styles.drawer, isOpen && styles.open)}
        role="dialog"
        aria-label="Move History"
        aria-hidden={!isOpen}
      >
        <div className={styles.container}>
          <div className={styles.header}>
            <h3 className={styles.title}>Game Info</h3>
            <button className={styles.closeBtn} onClick={() => setIsOpen(false)} aria-label="Close">
              ✕
            </button>
          </div>

          {/* Score */}
          {score && (
            <div className={styles.scoreSection} aria-label="Score">
              <div className={cx(styles.scoreItem, styles.humanScore)}>
                <span className={styles.scoreLabel}>You (X)</span>
                <span className={styles.scoreValue}>{score.X}</span>
              </div>
              <div className={cx(styles.scoreItem, styles.drawScore)}>
                <span className={styles.scoreLabel}>Draw</span>
                <span className={styles.scoreValue}>{score.draws}</span>
              </div>
              <div className={cx(styles.scoreItem, styles.cpuScore)}>
                <span className={styles.scoreLabel}>CPU (O)</span>
                <span className={styles.scoreValue}>{score.O}</span>
              </div>
            </div>
          )}

          {/* Streak & Best Time */}
          {(streak > 0 || bestTime !== null) && (
            <div className={styles.statsRow}>
              {streak > 0 && (
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Streak</span>
                  <span className={cx(styles.statValue, styles.streakValue)}>{streak} 🔥</span>
                </div>
              )}
              {bestTime !== null && (
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Best</span>
                  <span className={cx(styles.statValue, styles.bestTimeValue)}>
                    {bestTime.toFixed(1)}s
                  </span>
                </div>
              )}
            </div>
          )}

          <div className={styles.controls}>
            <button
              className={cx(styles.button, !canUndo && styles.disabled)}
              onClick={onUndo}
              disabled={!canUndo}
              aria-label="Undo"
              title="Undo (Ctrl+Z)"
            >
              ↶ <span className={styles.buttonLabel}>Undo</span>
            </button>
            <button
              className={cx(styles.button, !canRedo && styles.disabled)}
              onClick={onRedo}
              disabled={!canRedo}
              aria-label="Redo"
              title="Redo (Ctrl+Y)"
            >
              ↷ <span className={styles.buttonLabel}>Redo</span>
            </button>
          </div>

          <div className={styles.timeline}>
            {moves.length === 0 ? (
              <p className={styles.empty}>No moves yet</p>
            ) : (
              <ul className={styles.list}>
                {moves.map((_, moveNumber) => {
                  const moveIndex = moveNumber + 1 // account for initial board
                  const moveCount = moveNumber + 1
                  const isX = moveNumber % 2 === 0 // first move is X (human)
                  const token = isX ? '✕' : '○'
                  const isCurrentOrBefore = currentIndex >= moveIndex
                  const isCurrent = currentIndex === moveIndex

                  return (
                    <li
                      key={moveNumber}
                      className={cx(
                        styles.move,
                        isCurrent && styles.current,
                        !isCurrentOrBefore && styles.future,
                      )}
                      onClick={() => {
                        if (currentIndex > moveIndex) {
                          for (let i = 0; i < currentIndex - moveIndex; i++) {
                            onUndo()
                          }
                        } else if (currentIndex < moveIndex) {
                          for (let i = 0; i < moveIndex - currentIndex; i++) {
                            onRedo()
                          }
                        }
                      }}
                      role="button"
                      tabIndex={isOpen ? 0 : -1}
                      aria-label={`Move ${moveCount}: ${isX ? 'Human' : 'CPU'}`}
                    >
                      <span className={cx(styles.number, isX ? styles.human : styles.cpu)}>
                        {moveCount}
                      </span>
                      <span className={cx(styles.token, isX ? styles.tokenX : styles.tokenO)}>
                        {token}
                      </span>
                      {isCurrent && <span className={styles.indicator}>→</span>}
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          <div className={styles.status}>
            <span className={styles.position}>
              Move {currentIndex}/{moveHistory.length - 1}
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

MoveTimeline.propTypes = {
  moveHistory: PropTypes.array,
  currentIndex: PropTypes.number,
  onUndo: PropTypes.func.isRequired,
  onRedo: PropTypes.func.isRequired,
  canUndo: PropTypes.bool.isRequired,
  canRedo: PropTypes.bool.isRequired,
  score: PropTypes.shape({
    X: PropTypes.number.isRequired,
    O: PropTypes.number.isRequired,
    draws: PropTypes.number.isRequired,
  }),
  streak: PropTypes.number,
  bestTime: PropTypes.number,
}

export default MoveTimeline
