import React from 'react'
import PropTypes from 'prop-types'
import styles from './ScoreBoard.module.css'
import { cx } from '../utils/cssModules.js'

/**
 * ScoreBoard — Molecule
 *
 * Displays the running score: Human wins, CPU wins, draws.
 * Also shows streak and best win time.
 *
 * @param {{ score: { X: number, O: number, draws: number }, streak?: number, bestTime?: number | null }} props
 */
const ScoreBoard = React.memo(({ score, streak = 0, bestTime = null }) => (
  <div className={styles.root} aria-label="Score">
    <div className={cx(styles.item, styles.humanScore)}>
      <span className={styles.label}>You (X)</span>
      <span className={styles.value}>{score.X}</span>
    </div>
    <div className={cx(styles.item, styles.drawScore)}>
      <span className={styles.label}>Draws</span>
      <span className={styles.value}>{score.draws}</span>
    </div>
    <div className={cx(styles.item, styles.cpuScore)}>
      <span className={styles.label}>CPU (O)</span>
      <span className={styles.value}>{score.O}</span>
    </div>
    {(streak > 0 || bestTime !== null) && (
      <div className={styles.stats}>
        {streak > 0 && (
          <div className={cx(styles.stat, styles.streak)}>
            <span className={styles.statLabel}>Streak</span>
            <span className={styles.statValue}>{streak} 🔥</span>
          </div>
        )}
        {bestTime !== null && (
          <div className={cx(styles.stat, styles.bestTime)}>
            <span className={styles.statLabel}>Best Time</span>
            <span className={styles.statValue}>{bestTime.toFixed(1)}s</span>
          </div>
        )}
      </div>
    )}
  </div>
))

ScoreBoard.displayName = 'ScoreBoard'

ScoreBoard.propTypes = {
  score: PropTypes.shape({
    X: PropTypes.number.isRequired,
    O: PropTypes.number.isRequired,
    draws: PropTypes.number.isRequired,
  }).isRequired,
  streak: PropTypes.number,
  bestTime: PropTypes.number,
}

export default ScoreBoard
