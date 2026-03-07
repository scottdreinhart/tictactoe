import React from 'react'
import PropTypes from 'prop-types'

const LEVELS = ['easy', 'medium', 'hard', 'unbeatable']

/**
 * DifficultyToggle — Atom (pure presentational)
 *
 * A pill-shaped toggle that switches between Easy, Medium, Hard, and Unbeatable AI difficulty.
 *
 * @param {{ difficulty: string, onSelect: (level: string) => void }} props
 */
const DifficultyToggle = React.memo(({ difficulty, onSelect }) => (
  <div className="difficulty-toggle" role="group" aria-label="CPU difficulty">
    {LEVELS.map((level) => (
      <button
        key={level}
        type="button"
        className={`difficulty-option${difficulty === level ? ' difficulty-active' : ''}`}
        onClick={difficulty !== level ? () => onSelect(level) : undefined}
        aria-pressed={difficulty === level}
      >
        {level.charAt(0).toUpperCase() + level.slice(1)}
      </button>
    ))}
  </div>
))

DifficultyToggle.displayName = 'DifficultyToggle'

DifficultyToggle.propTypes = {
  difficulty: PropTypes.oneOf(['easy', 'medium', 'hard', 'unbeatable']).isRequired,
  onSelect: PropTypes.func.isRequired,
}

export default DifficultyToggle
