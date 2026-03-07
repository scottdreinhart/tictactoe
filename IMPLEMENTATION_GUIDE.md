# Implementation Guide — Pending Features

This document provides technical guidance for implementing the 2 remaining performance/architecture improvements identified in the March 7, 2026 feature audit.

## 1. Cross-Platform Dev Script (HIGH PRIORITY)

**Status**: ❌ Not Done  
**Impact**: Enables Windows/macOS native development (currently WSL/Linux only)  
**Effort**: ~15 minutes  
**File**: [package.json](package.json#L6)

### Current Issue
```json
"dev": "fuser -k 5173/tcp 2>/dev/null; vite --host"
```
The `fuser` command only works on Linux/WSL. Native Windows/macOS developers cannot run the dev script.

### Solution
Replace `fuser` with the [`kill-port`](https://www.npmjs.com/package/kill-port) package:

#### Step 1: Install dependency
```bash
pnpm add -D kill-port
```

#### Step 2: Update package.json
```json
"dev": "kill-port --port 5173; vite --host"
```

#### Step 3: Test on Windows
```bash
npm run dev
```

**Benefits**:
- ✅ Works on Windows, macOS, Linux
- ✅ No WSL required for Windows developers
- ✅ Gracefully handles "port not in use" case (doesn't fail)
- ✅ Can kill process trees (child processes of Vite)

**Alternative** (if build size is a concern):
Use Node.js built-in `require('child_process')` to kill processes:
```javascript
// scripts/kill-port.mjs
import { execSync } from 'child_process';
const port = process.argv[2] || 5173;
try {
  if (process.platform === 'win32') {
    execSync(`netstat -ano | findstr :${port} | findstr LISTENING | for /F "tokens=5" %a in ('findstr /R /C:".*"') do taskkill /PID %a /F`, { shell: 'cmd.exe' });
  } else {
    execSync(`lsof -ti:${port} | xargs kill -9`, { stdio: 'ignore' });
  }
} catch (e) {
  // Port not in use, ignore
}
```

Then in package.json:
```json
"dev": "node scripts/kill-port.mjs 5173; vite --host"
```

**Recommendation**: Use `kill-port` package (simpler, well-tested, small footprint ~5KB).

---

## 2. CSS Code-Splitting (MEDIUM PRIORITY)

**Status**: ❌ Not Done  
**Impact**: Smaller initial CSS bundle for users who don't use all 7 themes  
**Effort**: ~45 minutes  
**Files**: [styles.css](src/styles.css), [vite.config.js](vite.config.js), [src/index.jsx](src/index.jsx)

### Current Issue
All 7 theme CSS variants are bundled in a single `styles.css` (~1.4K lines, ~20KB gzipped):
- Classic, Ocean, Sunset, Forest, Rose, Midnight (all in `src/styles.css`)
- High Contrast (in `src/themes/highcontrast.css`)

A user who only uses Ocean theme still downloads CSS for Rose, Sunset, Forest, Midnight.

### Solution
Implement lazy-loaded theme modules using Vite dynamic imports:

#### Step 1: Split theme styles into separate CSS files
Create individual CSS files for theme variants:

```bash
# Already exist:
src/themes/highcontrast.css
src/themes/forest.css
src/themes/midnight.css
src/themes/ocean.css
src/themes/rose.css
src/themes/sunset.css

# Create theme-agnostic base CSS:
src/styles-base.css  # Core layout, animations, a11y (exclude all color themes)
```

#### Step 2: Extract core styles to `src/styles-base.css`
Move all non-theme CSS from `src/styles.css`:
- Layout rules (Grid, containers, responsive)
- Animations (@keyframes)
- Accessibility utilities
- Print styles
- Reduced motion

Keep in `src/styles.css`:
- Classic theme variables (light/dark variants)
- Colorblind overrides

#### Step 3: Create a theme loader in `src/app/useTheme.js`
```javascript
// useTheme.js — enhanced with dynamic imports
const THEME_MODULES = {
  'classic': () => import('../themes/classic.css'),
  'ocean': () => import('../themes/ocean.css'),
  'forest': () => import('../themes/forest.css'),
  'rose': () => import('../themes/rose.css'),
  'sunset': () => import('../themes/sunset.css'),
  'midnight': () => import('../themes/midnight.css'),
  'highcontrast': () => import('../themes/highcontrast.css'),
}

useEffect(() => {
  if (theme !== currentTheme) {
    // Load new theme CSS dynamically
    THEME_MODULES[theme]?.()
    setCurrentTheme(theme)
  }
}, [theme])
```

#### Step 4: Update imports in `src/index.jsx`
```javascript
// Load base CSS synchronously (required for page render)
import './styles-base.css'  // Core layout only

// App loads Classic theme by default (most common)
import './styles.css'  // Classic theme
```

#### Step 5: Verify with Vite
```bash
npm run build
# Check dist/ for:
# - index-*.js (main bundle)
# - index-*.css (base + Classic theme)
# - ocean-*.css (lazy-loaded)
# - forest-*.css (lazy-loaded)
# etc.
```

### Expected Result
**Before**: 
- `index-*.css`: 20 KB gzipped (all 7 themes)

**After**:
- `index-*.css`: 6–8 KB gzipped (base + Classic only)
- `ocean-*.css`: 1–2 KB gzipped (lazy-loaded on demand)
- `forest-*.css`: 1–2 KB gzipped (lazy-loaded on demand)
- etc.

**Total for single user**: Still ~20 KB if they change themes (but deferred until needed)

### Trade-offs
**Pros**:
- ✅ Faster initial page load
- ✅ Users with poor bandwidth benefit from lazy loading
- ✅ Perfect for low-end devices

**Cons**:
- ⚠️ Slight delay when switching themes (imperceptible on modern browsers)
- ⚠️ Adds complexity to theme switching logic
- ⚠️ FOUC (Flash of Unstyled Content) possible if not handled carefully

### Implementation Notes
1. **CSS modules vs dynamic imports**: Use dynamic imports (simpler, Vite-native)
2. **Fallback**: If theme CSS fails to load, use Classic theme as fallback
3. **Preload hint**: Add `<link rel="prefetch"` for frequently used themes in HTML
4. **Progress indicator**: Consider showing a brief spinner during theme load

**Recommendation**: Implement if targeting users on slow networks (3G, LTE, mobile hotspots); otherwise it's a nice-to-have optimization.

---

## 3. CSS Modules or CSS-in-JS (LOW PRIORITY)

**Status**: ❌ Not Done  
**Impact**: Eliminates global class name collisions; improves maintainability  
**Effort**: ~4 hours refactoring  
**Files**: [src/styles.css](src/styles.css), All JSX files in `src/ui/`

### Current Approach
Global stylesheet with data-attribute scoping:
- All selectors prefixed with component class names (`.cell-button`, `.board-grid`, etc.)
- Theme variants via `data-theme`, `data-mode`, `data-colorblind` attributes
- Risk: accidental class name collisions if new component added

### Alternative 1: CSS Modules
```css
/* src/ui/atoms/CellButton.module.css */
.button {
  /* scoped to CellButton only */
  border: 2px solid var(--cell-border);
}

.button.focused {
  outline: 3px solid var(--accent);
}
```

```jsx
// src/ui/atoms/CellButton.jsx
import styles from './CellButton.module.css'

export const CellButton = ({ /* ... */ }) => (
  <button className={styles.button}>
    {/* ... */}
  </button>
)
```

**Pros**: 
- ✅ Zero collision risk
- ✅ Built-in Vite support
- ✅ Type-safe with TypeScript (future migration)
- ✅ Can still use CSS variables for global themes

**Cons**:
- ⚠️ Requires refactoring all 20+ components
- ⚠️ Slightly larger CSS output (class name mangling)

### Alternative 2: CSS-in-JS Library (Styled Components, Emotion)
```jsx
// src/ui/atoms/CellButton.jsx (using Emotion)
import styled from '@emotion/styled'

const StyledButton = styled.button`
  border: 2px solid var(--cell-border);
  
  &:focus {
    outline: 3px solid var(--accent);
  }
`

export const CellButton = ({ /* ... */ }) => (
  <StyledButton>{/* ... */}</StyledButton>
)
```

**Pros**:
- ✅ Zero collision risk
- ✅ Dynamic styles (e.g., `color: ${props.theme}`)
- ✅ Can co-locate styles with components
- ✅ Runtime theme switching simpler

**Cons**:
- ⚠️ Additional runtime overhead (~20-50 KB library)
- ⚠️ Requires refactoring all components
- ⚠️ Harder to debug (generated class names)

### Recommendation
**CSS Modules** is the best choice for this project because:
1. ✅ Zero runtime overhead (compiled at build time)
2. ✅ Vite has native support
3. ✅ Still uses CSS variables for themes
4. ✅ Easier debugging (predictable class names)
5. ✅ No new library dependency

**Not recommended right now**: 
- Bundle is already optimized (175 KB total)
- Global CSS works fine with careful naming
- Refactoring effort is high (20+ components)
- CSS-in-JS adds unnecessary runtime overhead

---

## Timeline Recommendation

### Phase 1 (Now): Cross-Platform Dev Script
- Effort: 15 minutes
- Impact: Unblocks Windows/macOS developers
- **Do this first** ✅

### Phase 2 (Optional): CSS Code-Splitting  
- Effort: 45 minutes
- Impact: ~10-15% CSS savings for slow networks
- **Do if targeting mobile/slow networks**

### Phase 3 (Not Priority): CSS Modules
- Effort: 4 hours
- Impact: Improves maintainability (not performance)
- **Do only if team grows to 2+ developers**

---

## Testing Checklist

After implementation, verify:

### Cross-Platform Dev Script
- [ ] Run `npm run dev` on Windows (PowerShell/CMD)
- [ ] Run `npm run dev` on macOS/Linux
- [ ] Kill script gracefully handles "port already in use"
- [ ] Kill script gracefully handles "port not in use"
- [ ] Dev server starts successfully after port kill

### CSS Code-Splitting
- [ ] Build with `npm run build`
- [ ] Check bundle report for separate theme files
- [ ] Switch themes in UI, verify CSS loads
- [ ] Test on Slow 3G (DevTools throttling)
- [ ] No FOUC (flash of unstyled content)
- [ ] Fallback theme loads if network fails

### CSS Modules (if implemented)
- [ ] All styles scoped to components
- [ ] No global class name collisions
- [ ] Themes still switch correctly
- [ ] Build size unchanged (CSS Modules add ~2% overhead)
- [ ] No broken styles

