import React from 'react'
import PropTypes from 'prop-types'
import styles from './SoundToggle.module.css'

/**
 * SoundToggle — Atom (pure presentational)
 *
 * A small button to toggle sound on/off.
 * Uses speaker emoji for visual clarity; aria-label for accessibility.
 *
 * @param {{ soundEnabled: boolean, onToggle: () => void }} props
 */
const SoundToggle = React.memo(({ soundEnabled, onToggle }) => (
  <button
    type="button"
    className={styles.root}
    onClick={onToggle}
    aria-label={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
    title={soundEnabled ? 'Sound on' : 'Sound off'}
  >
    {soundEnabled ? '🔊' : '🔇'}
  </button>
))

SoundToggle.displayName = 'SoundToggle'

SoundToggle.propTypes = {
  soundEnabled: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
}

export default SoundToggle
