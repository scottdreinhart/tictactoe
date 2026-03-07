import React from 'react'
import PropTypes from 'prop-types'
import styles from './ScoreBoard.module.css'
import { cx } from '../utils/cssModules.js'

/**
 * ScoreBoard — Molecule
 *
 * Displays the running score: Human wins, CPU wins, draws.
 *
 * @param {{ score: { X: number, O: number, draws: number } }} props
 */
const ScoreBoard = React.memo(({ score }) => (
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
  </div>
))

ScoreBoard.displayName = 'ScoreBoard'

ScoreBoard.propTypes = {
  score: PropTypes.shape({
    X: PropTypes.number.isRequired,
    O: PropTypes.number.isRequired,
    draws: PropTypes.number.isRequired,
  }).isRequired,
}

export default ScoreBoard
