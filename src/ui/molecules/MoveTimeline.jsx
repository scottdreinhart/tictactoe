import React, { useState, useEffect, useRef } from 'react'
import styles from './MoveTimeline.module.css'
import { cx } from '../utils/cssModules.js'

/**
 * MoveTimeline - Sliding drawer from the right side showing move history
 * with undo/redo buttons. Slides over the game board when opened.
 */
export const MoveTimeline = ({ moveHistory = [], currentIndex = 0, onUndo, onRedo, canUndo, canRedo }) => {
  const [isOpen, setIsOpen] = useState(false)
  const drawerRef = useRef(null)
  const moves = moveHistory.slice(1) // skip initial empty board

  // Close drawer on Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen])

  return (
    <>
      {/* Toggle tab on right edge */}
      <button
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
            <h3 className={styles.title}>Move History</h3>
            <button
              className={styles.closeBtn}
              onClick={() => setIsOpen(false)}
              aria-label="Close"
            >
              ✕
            </button>
          </div>

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
                        !isCurrentOrBefore && styles.future
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

export default MoveTimeline
