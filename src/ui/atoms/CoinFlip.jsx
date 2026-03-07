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
  const flipTimerRef = useRef(null)
  const resultTimerRef = useRef(null)
  callbackRef.current = onFlipComplete

  const stopFlip = () => {
    if (!isFlipping) return
    // Clear the auto-stop timer since user tapped early
    if (flipTimerRef.current) clearTimeout(flipTimerRef.current)
    setIsFlipping(false)
    const isXFirst = Math.random() > 0.5
    setResult(isXFirst ? 'X' : 'O')
    resultTimerRef.current = setTimeout(() => {
      callbackRef.current(isXFirst)
    }, 1200)
  }

  useEffect(() => {
    // Auto-stop after 3.5 seconds if user doesn't tap
    flipTimerRef.current = setTimeout(() => {
      stopFlip()
    }, 3500)

    return () => {
      if (flipTimerRef.current) clearTimeout(flipTimerRef.current)
      if (resultTimerRef.current) clearTimeout(resultTimerRef.current)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={styles.container}>
      <div className={styles.backdrop} />
      <div className={styles.content}>
        <h2 className={styles.title}>Who goes first?</h2>
        <p className={styles.hint}>{isFlipping ? 'Tap coin to stop' : ''}</p>
        <div
          className={styles.coinWrapper}
          onClick={stopFlip}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') stopFlip() }}
          role="button"
          tabIndex={0}
          aria-label="Tap to stop coin flip"
        >
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
