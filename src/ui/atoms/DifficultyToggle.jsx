import React from 'react'
import PropTypes from 'prop-types'

/**
 * DifficultyToggle — Atom (pure presentational)
 *
 * A pill-shaped toggle that switches between Easy and Hard AI difficulty.
 *
 * @param {{ difficulty: string, onToggle: () => void }} props
 */
const DifficultyToggle = React.memo(({ difficulty, onToggle }) => (
  <div className="difficulty-toggle" role="group" aria-label="CPU difficulty">
    <button
      type="button"
      className={`difficulty-option${difficulty === 'easy' ? ' difficulty-active' : ''}`}
      onClick={difficulty !== 'easy' ? onToggle : undefined}
      aria-pressed={difficulty === 'easy'}
    >
      Easy
    </button>
    <button
      type="button"
      className={`difficulty-option${difficulty === 'hard' ? ' difficulty-active' : ''}`}
      onClick={difficulty !== 'hard' ? onToggle : undefined}
      aria-pressed={difficulty === 'hard'}
    >
      Hard
    </button>
  </div>
))

DifficultyToggle.displayName = 'DifficultyToggle'

DifficultyToggle.propTypes = {
  difficulty: PropTypes.oneOf(['easy', 'hard']).isRequired,
  onToggle: PropTypes.func.isRequired,
}

export default DifficultyToggle
