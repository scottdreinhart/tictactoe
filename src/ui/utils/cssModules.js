/**
 * cssModules.js — CSS-in-JS Utility for Component-Scoped Styling
 *
 * Provides a lightweight alternative to CSS Modules and CSS-in-JS libraries.
 * Generates scoped class names and enables gradual migration to CSS Modules.
 *
 * Usage:
 *   // Define scoped styles for a component
 *   const classes = createComponentStyles('Button', {
 *     root: { padding: '8px 16px', borderRadius: '4px' },
 *     primary: { backgroundColor: 'var(--accent)', color: 'white' },
 *   })
 *
 *   // In JSX:
 *   <button className={classes.root + ' ' + classes.primary}>Click Me</button>
 *
 * Benefits:
 * - No global class name collisions (scoped to component)
 * - Supports computed styles and CSS variables
 * - Easy migration path: convert to CSS Modules or CSS-in-JS later
 * - Zero runtime overhead (computed once on module load)
 */

/**
 * Create a scoped style object for a component.
 *
 * @param {string} componentName - Component name for scope (e.g., 'Button')
 * @param {Object} styleDefinitions - Object where keys are style names, values are style objects
 * @returns {Object} Object with scoped class names
 *
 * @example
 * const styles = createComponentStyles('CellButton', {
 *   root: {
 *     display: 'grid',
 *     placeItems: 'center',
 *     gap: '4px',
 *   },
 *   empty: {
 *     cursor: 'pointer',
 *     ':hover': { backgroundColor: 'var(--cell-hover-bg)' },
 *   },
 * })
 */
export const createComponentStyles = (componentName, styleDefinitions) => {
  const scopedStyles = {}

  // Inject scoped styles into <head> if not already injected
  const styleId = `scoped-${componentName}`
  if (!document.getElementById(styleId)) {
    const styleEl = document.createElement('style')
    styleEl.id = styleId
    styleEl.textContent = generateScopedCSS(componentName, styleDefinitions)
    document.head.appendChild(styleEl)
  }

  // Generate scoped class names
  Object.keys(styleDefinitions).forEach((key) => {
    scopedStyles[key] = `${componentName}__${key}`
  })

  return scopedStyles
}

/**
 * Generate CSS text for scoped styles.
 * @private
 */
const generateScopedCSS = (componentName, styleDefinitions) => {
  let css = ''

  Object.entries(styleDefinitions).forEach(([key, styles]) => {
    const className = `${componentName}__${key}`

    // Convert style object to CSS rules
    const rules = Object.entries(styles)
      .map(([prop, value]) => {
        // Skip pseudo-selectors and nested rules (marked with ':')
        if (prop.startsWith(':')) return null
        // Convert camelCase to kebab-case
        const cssProp = prop.replace(/([A-Z])/g, (m) => `-${m.toLowerCase()}`)
        return `${cssProp}: ${value};`
      })
      .filter(Boolean)
      .join(' ')

    css += `.${className} { ${rules} }\n`

    // Handle pseudo-selectors and nested rules
    Object.entries(styles).forEach(([selector, value]) => {
      if (selector.startsWith(':') && typeof value === 'object') {
        const nestedRules = Object.entries(value)
          .map(([prop, val]) => {
            const cssProp = prop.replace(/([A-Z])/g, (m) => `-${m.toLowerCase()}`)
            return `${cssProp}: ${val};`
          })
          .join(' ')
        css += `.${className}${selector} { ${nestedRules} }\n`
      }
    })
  })

  return css
}

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

/**
 * Merge multiple scope objects (useful when combining scoped styles).
 *
 * @param {...Object} scopes - Scope objects to merge
 * @returns {Object} Merged scope object
 *
 * @example
 * const classes = mergeScopes(
 *   createComponentStyles('Base', {...}),
 *   createComponentStyles('Variant', {...})
 * )
 */
export const mergeScopes = (...scopes) => {
  return scopes.reduce((acc, scope) => ({ ...acc, ...scope }), {})
}

/**
 * Create CSS variables namespace for a component.
 * Enables consistent custom property naming across your app.
 *
 * @param {string} componentName - Component name (e.g., 'Button')
 * @param {Object} variables - Variable definitions { colorPrimary: '#007bff', ... }
 * @returns {Object} CSS variable object { colorPrimary: '--button-color-primary', ... }
 *
 * @example
 * const vars = createComponentVars('Button', {
 *   colorPrimary: '#007bff',
 *   colorSecondary: '#6c757d',
 * })
 * // vars.colorPrimary === '--button-color-primary'
 */
export const createComponentVars = (componentName, variables) => {
  const result = {}
  Object.keys(variables).forEach((key) => {
    result[key] = `--${componentName.toLowerCase()}-${key.replace(/([A-Z])/g, (m) => `-${m.toLowerCase()}`)}`
  })
  return result
}
