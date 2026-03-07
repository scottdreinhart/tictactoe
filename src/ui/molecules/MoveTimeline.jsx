import React from 'react'
import styles from './MoveTimeline.module.css'
import { cx } from '../utils/cssModules.js'

/**
 * MoveTimeline - Sidebar showing move history with undo/redo buttons
 * Displays each move in a timeline, highlight current position
 */
export const MoveTimeline = ({ moveHistory = [], currentIndex = 0, onUndo, onRedo, canUndo, canRedo }) => {
  const moves = moveHistory.slice(1) // skip initial empty board

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Move History</h3>
        <div className={styles.controls}>
          <button
            className={cx(styles.button, styles.undoBtn, !canUndo && styles.disabled)}
            onClick={onUndo}
            disabled={!canUndo}
            aria-label="Undo"
            title="Undo (Ctrl+Z)"
          >
            ↶
          </button>
          <button
            className={cx(styles.button, styles.redoBtn, !canRedo && styles.disabled)}
            onClick={onRedo}
            disabled={!canRedo}
            aria-label="Redo"
            title="Redo (Ctrl+Y)"
          >
            ↷
          </button>
        </div>
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
                    !isCurrentOrBefore && styles.future
                  )}
                  onClick={() => {
                    // Click to jump to this move
                    if (currentIndex > moveIndex) {
                      // Need to undo
                      for (let i = 0; i < currentIndex - moveIndex; i++) {
                        onUndo()
                      }
                    } else if (currentIndex < moveIndex) {
                      // Need to redo
                      for (let i = 0; i < moveIndex - currentIndex; i++) {
                        onRedo()
                      }
                    }
                  }}
                  role="button"
                  tabIndex={0}
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
  )
}

export default MoveTimeline
