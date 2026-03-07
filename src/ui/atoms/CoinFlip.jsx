import React, { useEffect, useRef, useState } from 'react'
import styles from './CoinFlip.module.css'

/**
 * CoinFlip - Animated coin with X and O sides
 * Auto-flips on mount, returns winner (who goes first)
 */
export const CoinFlip = ({ onFlipComplete }) => {
  const [isFlipping, setIsFlipping] = useState(true)
  const [result, setResult] = useState(null)
  const callbackRef = useRef(onFlipComplete)
  callbackRef.current = onFlipComplete

  useEffect(() => {
    // Flip for 1.5 seconds
    const flipDuration = 1500
    let resultTimer = null
    const flipTimer = setTimeout(() => {
      setIsFlipping(false)
      // Randomly choose X or O to go first
      const isXFirst = Math.random() > 0.5
      setResult(isXFirst ? 'X' : 'O')
      // Call callback after a short delay to show result
      resultTimer = setTimeout(() => {
        callbackRef.current(isXFirst)
      }, 800)
    }, flipDuration)

    return () => {
      clearTimeout(flipTimer)
      if (resultTimer) clearTimeout(resultTimer)
    }
  }, []) // run once on mount

  return (
    <div className={styles.container}>
      <div className={styles.backdrop} />
      <div className={styles.content}>
        <h2 className={styles.title}>Who goes first?</h2>
        <div className={styles.coinWrapper}>
          <div className={isFlipping ? styles.coinFlipping : styles.coinStatic}>
            <div className={styles.coinFace}>
              <span className={styles.xSide}>✕</span>
            </div>
            <div className={styles.coinBack}>
              <span className={styles.oSide}>○</span>
            </div>
          </div>
        </div>
        {result && (
          <p className={styles.result}>
            {result === 'X' ? 'You go first!' : 'CPU goes first!'}
          </p>
        )}
      </div>
    </div>
  )
}

export default CoinFlip
