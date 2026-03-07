/**
 * cssModules.js — CSS Utility for Component-Scoped Styling
 *
 * Provides the `cx` class name combiner utility used across all
 * CSS Module-based components.
 */

/**
 * Combine multiple class names (similar to clsx/classnames).
 * Useful with scoped styles and conditional classes.
 *
 * @param {...(string|Object|null|undefined)} args - Class names or objects
 * @returns {string} Combined class names
 *
 * @example
 * <div className={cx(classes.root, isActive && classes.active)}>
 */
export const cx = (...args) => {
  return args
    .flatMap((arg) => {
      if (typeof arg === 'string') return arg
      if (typeof arg === 'object' && arg !== null && !Array.isArray(arg)) {
        return Object.entries(arg)
          .filter(([, value]) => value)
          .map(([key]) => key)
      }
      return []
    })
    .filter(Boolean)
    .join(' ')
}
