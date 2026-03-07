# Tic-Tac-Toe: Human vs CPU

A clean, modular React Tic-Tac-Toe game with animated SVG marks, dark mode, keyboard and mouse controls, built with **CLEAN Architecture** and **Atomic Design**.

## Project Structure

```
src/
├── domain/                        # Pure, framework-agnostic logic
│   ├── constants.js               # TOKENS, WIN_LINES, BOARD_SIZE, CPU_DELAY_MS
│   ├── board.js                   # Board operations (create, apply move, get empty cells)
│   ├── rules.js                   # Win/draw detection (returns winning line)
│   └── ai.js                     # CPU move selection (random + smart)
├── app/
│   ├── useTicTacToe.js            # Game state + score + difficulty management hook
│   └── useGridKeyboard.js         # Reusable document-level keyboard navigation hook
├── ui/
│   ├── atoms/
│   │   ├── CellButton.jsx         # Single cell with SVG mark rendering + winning highlight
│   │   ├── XMark.jsx              # Animated SVG "X" (React.memo, draw-on effect)
│   │   ├── OMark.jsx              # Animated SVG "O" (React.memo, draw-on effect)
│   │   ├── GameTitle.jsx          # Game heading (React.memo)
│   │   ├── ResetButton.jsx        # Reset/new-game button (React.memo)
│   │   └── DifficultyToggle.jsx   # Easy/Hard AI toggle (React.memo)
│   ├── molecules/
│   │   ├── BoardGrid.jsx          # 3×3 grid with reset animation (uses useGridKeyboard)
│   │   ├── StatusBar.jsx          # Game status display (aria-live)
│   │   ├── ScoreBoard.jsx         # Win/loss/draw score display (React.memo)
│   │   ├── GameControls.jsx       # Action buttons (composes ResetButton)
│   │   └── Instructions.jsx       # How-to-play section
│   └── organisms/
│       └── TicTacToeGame.jsx      # Top-level game component (pure composition)
├── index.jsx                      # React entry point
└── styles.css                     # CSS with dark mode, animations, media queries

index.html                         # HTML entry point
package.json                       # Dependencies & scripts
vite.config.js                     # Vite configuration + rollup-plugin-visualizer
eslint.config.js                   # ESLint flat config (React + hooks + Prettier)
.prettierrc                        # Prettier formatting rules
```

## Features

### Game Logic
- **Human (X) vs CPU (O)**: Human plays first
- **Board Representation**: 9-cell array with immutable updates
- **Win Detection**: All 8 winning lines checked (3 rows, 3 columns, 2 diagonals)
- **Draw Detection**: Board full + no winner = draw
- **CPU Move**: Smart priority AI (default Hard) or random Easy mode — switchable via toggle
- **Score Tracking**: Win/loss/draw tallies persisted across rounds
- **Win-Line Highlight**: Winning 3 cells pulse with animated glow
- **Difficulty Toggle**: Pill-shaped Easy/Hard switch; Easy = random, Hard = smart priority

### Visual Design
- **SVG Marks**: X and O rendered as animated SVGs with stroke-dasharray draw-on effect
- **Dark Mode**: Automatic via `prefers-color-scheme: dark` media query
- **CSS Custom Properties**: All colors/sizes driven by CSS variables for easy theming
- **Cell Animations**: Pop-in effect when marks are placed; winning cells pulse
- **Board Reset Animation**: Fade/scale transition when board is cleared
- **Responsive Layout**: `clamp()` sizing adapts from small phones to large desktops
- **Score Board**: Color-coded X/O/Draw tallies between status bar and board

### Controls
- **Mouse**: Click any empty cell to move
- **Keyboard**: 
  - **Arrow Keys** or **WASD**: Navigate (↑/W up, ↓/S down, ←/A left, →/D right)
  - **Space** or **Enter**: Select focused cell
  - Document-level keydown listener — works regardless of DOM focus

### Accessibility
- ARIA labels on all cells (`Row X, Column Y, empty/X/O`)
- Status bar uses `aria-live="polite"` for screen reader updates
- Roving tabindex for keyboard navigation
- `prefers-reduced-motion: reduce` disables all animations
- `forced-colors: active` support for high-contrast mode
- SVG marks use `aria-hidden="true"` (cell label provides semantics)
- Clear visual focus indicators with accent-colored outline + glow

### Responsive Breakpoints
| Breakpoint | Target |
|---|---|
| ≤ 374px | Small phones (iPhone SE, Galaxy S8) |
| 375–599px | Standard phones |
| 600–899px | Tablets portrait |
| 900–1199px | Tablets landscape / small desktops |
| 1200px+ | Desktops |
| max-height ≤ 500px landscape | Landscape phones (compact layout) |

Also supports high-DPI/Retina displays and print media.

### Architecture
- **CLEAN Layering**: `domain/` (pure) → `app/` (hooks) → `ui/` (components)
- **Atomic Design**: atoms → molecules → organisms (zero inline markup in organisms)
- **Pure Functions**: All domain logic is immutable and deterministic
- **DRY**: Single source of truth for constants (TOKENS, WIN_LINES)
- **No Race Conditions**: CPU timeout managed via ref; cancelled on reset/unmount
- **Reusable Hooks**: `useGridKeyboard` extracted from BoardGrid for document-level keyboard navigation
- **PropTypes**: Runtime prop validation on all components that accept props

## Installation & Running

```bash
# Install dependencies
npm install

# Start development server (accessible on LAN via 0.0.0.0)
npm run dev

# Build for production
npm run build

# Lint
npm run lint          # check for issues
npm run lint:fix      # auto-fix issues

# Format
npm run format        # format all source files
npm run format:check  # check formatting without writing
```

The app will be available at `http://localhost:5173`

## Game Flow

1. **Human's Turn**: Click a cell or use keyboard to select
2. **Board Update**: Cell is marked with animated X, game checks for win/draw
3. **CPU's Turn**: After 400ms delay, smart AI selects a move (animated O)
4. **Game End**: Winning cells pulse; score updates automatically
5. **Reset**: Click "Reset Game" — board fades out/in, score persists

## Domain Layer API

All domain functions are pure — no React, no DOM:

```javascript
// Board operations
createEmptyBoard()           // → Array(9).fill(null)
isCellEmpty(board, idx)      // → boolean
applyMove(board, idx, token) // → new board (throws if occupied)
getEmptyCells(board)         // → number[]

// Game rules
getWinner(board)             // → { token: "X"|"O", line: number[] } | null
getWinnerToken(board)        // → "X" | "O" | null (convenience)
isBoardFull(board)           // → boolean
isDraw(board)                // → boolean
getGameState(board)          // → { winner, winLine, isDraw, isOver }

// AI
chooseCpuMoveRandom(board)                       // Phase A — random
chooseCpuMoveSmart(board, cpuToken, humanToken)   // Phase B — priority-based
```

## Smart AI (Active)

The CPU uses `chooseCpuMoveSmart` with deterministic priority:
1. Win if possible this turn
2. Block human from winning next turn
3. Take center
4. Take corner
5. Take edge

The random AI (`chooseCpuMoveRandom`) remains exported and is used in Easy mode.

## Technical Highlights

- **React 18** with Hooks (`useReducer` for state, `useState` for score + difficulty, `useCallback`/`useMemo` for stable refs)
- **React.memo** on pure atoms (XMark, OMark, GameTitle, ResetButton, DifficultyToggle, ScoreBoard) to skip unnecessary re-renders
- **PropTypes** runtime validation on all components that accept props
- **Vite 5** for fast development and builds (pinned to `^5.4.21` for Node 18 compat)
- **Bundle analysis** via `rollup-plugin-visualizer` — generates `dist/bundle-report.html` on build
- **ESLint + Prettier** for code quality (flat config, React + hooks plugins)
- **Reusable `useGridKeyboard` hook** — document-level keyboard navigation extracted from BoardGrid
- **CSS Grid** with `aspect-ratio: 1` for perfect square cells
- **CSS Custom Properties** with light/dark theme sets
- **SVG Animations** via `stroke-dasharray` / `stroke-dashoffset` draw-on keyframes
- **Win-pulse animation** on the 3 winning cells
- **Board reset animation** (scale + fade transition)
- **Zero TypeScript**: Pure JavaScript for simplicity
- **No external game libraries**: All logic built from scratch

## Accessibility Compliance

- ✅ WCAG 2.1 AA focus indicators
- ✅ Semantic HTML (buttons, grid role)
- ✅ ARIA live regions for status updates
- ✅ Keyboard-only playable (arrows, WASD, Space, Enter)
- ✅ `prefers-reduced-motion` respected (animations disabled)
- ✅ `forced-colors` / high-contrast mode support
- ✅ Print stylesheet (hides controls, uses black/grey marks)

## Potential Improvements

### Technical — AI
- [x] ~~**Activate smart AI**~~ — done (priority: win → block → center → corner → edge)
- [ ] **Minimax AI (Phase C)** — implement full minimax with alpha-beta pruning for unbeatable CPU play
- [x] ~~**Configurable CPU delay**~~ — done (`CPU_DELAY_MS` constant, currently 400ms)
- [x] ~~**Difficulty toggle**~~ — done (Easy = random, Hard = smart; pill-shaped toggle)
- [ ] **Web Worker AI** — move CPU computation to a Web Worker so the UI thread never blocks

### Visual & UX
- [x] ~~**Win-line highlight**~~ — done (winning cells pulse with `win-pulse` animation)
- [x] ~~**Score tracking display**~~ — done (ScoreBoard molecule: You/Draws/CPU tallies)
- [x] ~~**Smooth board reset transition**~~ — done (fade + scale `board-reset` animation)
- [ ] **Sound effects** — move placement, win, draw sounds (respect `prefers-reduced-motion`)
- [ ] **Confetti / particle effect** on win
- [ ] **Move history timeline** — visual sidebar showing each move in order
- [ ] **Theme picker** — user-selectable color schemes beyond auto light/dark
- [ ] **Touch gesture support** — swipe navigation on mobile as alternative to button taps

### Code Quality & Testing
- [x] ~~**ESLint + Prettier**~~ — done (flat config, React + hooks plugins, `lint`/`format` scripts)
- [x] ~~**`getWinner` returns winning line**~~ — done (returns `{ token, line }`, `getWinnerToken` convenience)
- [x] ~~**`React.memo` on atoms**~~ — done (XMark, OMark, GameTitle, ResetButton, DifficultyToggle, ScoreBoard)
- [ ] **Unit tests** — domain functions (`board.js`, `rules.js`, `ai.js`) are pure and test-ready; add Vitest or Jest suite
- [ ] **Component tests** — React Testing Library tests for CellButton, BoardGrid, StatusBar
- [ ] **Integration / E2E tests** — Playwright or Cypress for full game-flow verification
- [x] ~~**PropTypes**~~ — done (runtime prop validation on all components that accept props)
- [ ] **Storybook** — catalog atoms/molecules in isolation for visual regression testing

### Performance
- [ ] **Lazy SVG mount** — only mount `XMark`/`OMark` when `value` transitions from `null` (currently conditional render handles this, but `Suspense` could be used for heavier marks)

### Architecture
- [x] ~~**Extract keyboard hook**~~ — done (`useGridKeyboard.js` — reusable document-level keydown logic)
- [ ] **CSS Modules or CSS-in-JS** — scope styles per component to eliminate global class name collisions

### DevOps & Deployment
- [ ] **CI/CD pipeline** — GitHub Actions workflow for lint → test → build → deploy
- [ ] **GitHub Pages / Vercel deploy** — auto-deploy `dist/` on push to `main`
- [ ] **Dependabot auto-merge** — resolve the existing moderate vulnerability alert and enable auto-updates
- [ ] **PWA support** — add `manifest.json` + service worker for offline play and home-screen install
- [x] ~~**Bundle analysis**~~ — done (`rollup-plugin-visualizer` generates `dist/bundle-report.html` on build)
