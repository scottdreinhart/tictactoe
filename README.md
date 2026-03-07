# Tic-Tac-Toe: Human vs CPU

A clean, modular React Tic-Tac-Toe game with animated SVG marks, dark mode, keyboard and mouse controls, built with **CLEAN Architecture** and **Atomic Design**.

## Project Structure

```
src/
├── domain/                        # Pure, framework-agnostic logic
│   ├── constants.js               # TOKENS, WIN_LINES, BOARD_SIZE
│   ├── board.js                   # Board operations (create, apply move, get empty cells)
│   ├── rules.js                   # Win/draw detection
│   └── ai.js                     # CPU move selection (random + smart)
├── app/
│   └── useTicTacToe.js            # Game state management hook (useReducer)
├── ui/
│   ├── atoms/
│   │   ├── CellButton.jsx         # Single cell with SVG mark rendering
│   │   ├── XMark.jsx              # Animated SVG "X" (draw-on effect)
│   │   ├── OMark.jsx              # Animated SVG "O" (draw-on effect)
│   │   ├── GameTitle.jsx          # Game heading
│   │   └── ResetButton.jsx        # Reset/new-game button
│   ├── molecules/
│   │   ├── BoardGrid.jsx          # 3×3 grid with document-level keyboard navigation
│   │   ├── StatusBar.jsx          # Game status display (aria-live)
│   │   ├── GameControls.jsx       # Action buttons (composes ResetButton)
│   │   └── Instructions.jsx       # How-to-play section
│   └── organisms/
│       └── TicTacToeGame.jsx      # Top-level game component (pure composition)
├── index.jsx                      # React entry point
└── styles.css                     # CSS with dark mode, animations, media queries

index.html                         # HTML entry point
package.json                       # Dependencies & scripts
vite.config.js                     # Vite configuration (host, port, strictPort)
```

## Features

### Game Logic
- **Human (X) vs CPU (O)**: Human plays first
- **Board Representation**: 9-cell array with immutable updates
- **Win Detection**: All 8 winning lines checked (3 rows, 3 columns, 2 diagonals)
- **Draw Detection**: Board full + no winner = draw
- **CPU Move**: Phase A (random) active; Phase B (smart priority) available

### Visual Design
- **SVG Marks**: X and O rendered as animated SVGs with stroke-dasharray draw-on effect
- **Dark Mode**: Automatic via `prefers-color-scheme: dark` media query
- **CSS Custom Properties**: All colors/sizes driven by CSS variables for easy theming
- **Cell Animations**: Pop-in effect when marks are placed
- **Responsive Layout**: `clamp()` sizing adapts from small phones to large desktops

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
- **Document-Level Keyboard**: Uses `document.addEventListener('keydown')` with mutable refs to avoid stale closures

## Installation & Running

```bash
# Install dependencies
npm install

# Start development server (accessible on LAN via 0.0.0.0)
npm run dev

# Build for production
npm run build
```

The app will be available at `http://localhost:5173`

## Game Flow

1. **Human's Turn**: Click a cell or use keyboard to select
2. **Board Update**: Cell is marked with animated X, game checks for win/draw
3. **CPU's Turn**: After 250ms delay, CPU automatically selects an empty cell (animated O)
4. **Game End**: When someone wins or board is full
5. **Reset**: Click "Reset Game" to start over

## Domain Layer API

All domain functions are pure — no React, no DOM:

```javascript
// Board operations
createEmptyBoard()           // → Array(9).fill(null)
isCellEmpty(board, idx)      // → boolean
applyMove(board, idx, token) // → new board (throws if occupied)
getEmptyCells(board)         // → number[]

// Game rules
getWinner(board)             // → "X" | "O" | null
isBoardFull(board)           // → boolean
isDraw(board)                // → boolean
getGameState(board)          // → { winner, isDraw, isOver }

// AI
chooseCpuMoveRandom(board)                       // Phase A — random
chooseCpuMoveSmart(board, cpuToken, humanToken)   // Phase B — priority-based
```

## Phase B Upgrade

To enable smarter AI, replace `chooseCpuMoveRandom` with `chooseCpuMoveSmart` in `useTicTacToe.js`:

```javascript
// Current (Phase A — random)
cpuIndex = chooseCpuMoveRandom(state.board)

// Upgrade to Phase B (smart priority)
cpuIndex = chooseCpuMoveSmart(state.board, TOKENS.CPU, TOKENS.HUMAN)
```

Smart AI priority:
1. Win if possible
2. Block human from winning
3. Take center
4. Take corner
5. Take edge

## Technical Highlights

- **React 18** with Hooks (`useReducer` for state, `useCallback`/`useMemo` for stable refs)
- **Vite 5** for fast development and builds
- **CSS Grid** with `aspect-ratio: 1` for perfect square cells
- **CSS Custom Properties** with light/dark theme sets
- **SVG Animations** via `stroke-dasharray` / `stroke-dashoffset` draw-on keyframes
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
- [ ] **Activate smart AI** — `chooseCpuMoveSmart` is already exported but not wired; add a difficulty toggle (Easy/Hard) in the UI that swaps the AI function
- [ ] **Minimax AI (Phase C)** — implement full minimax with alpha-beta pruning for unbeatable CPU play
- [ ] **Configurable CPU delay** — expose the 250ms timeout as a UI setting (or remove for instant play)
- [ ] **Web Worker AI** — move CPU computation to a Web Worker so the UI thread never blocks

### Visual & UX
- [ ] **Win-line highlight** — after a win, animate/glow the 3 winning cells (return winning indices from `getWinner`)
- [ ] **Score tracking display** — persist win/loss/draw tallies across rounds (in-memory or `localStorage`) and show a scoreboard
- [ ] **Sound effects** — move placement, win, draw sounds (respect `prefers-reduced-motion`)
- [ ] **Confetti / particle effect** on win
- [ ] **Move history timeline** — visual sidebar showing each move in order
- [ ] **Theme picker** — user-selectable color schemes beyond auto light/dark
- [ ] **Smooth board reset transition** — fade-out / fade-in on reset instead of instant clear
- [ ] **Touch gesture support** — swipe navigation on mobile as alternative to button taps

### Code Quality & Testing
- [ ] **Unit tests** — domain functions (`board.js`, `rules.js`, `ai.js`) are pure and test-ready; add Vitest or Jest suite
- [ ] **Component tests** — React Testing Library tests for CellButton, BoardGrid, StatusBar
- [ ] **Integration / E2E tests** — Playwright or Cypress for full game-flow verification
- [ ] **PropTypes or TypeScript** — add runtime prop validation (PropTypes) or migrate to TypeScript for static type safety
- [ ] **ESLint + Prettier** — enforce consistent code style and catch common issues
- [ ] **Storybook** — catalog atoms/molecules in isolation for visual regression testing
- [ ] **`getWinner` returns winning line** — change return type to `{ token, line }` so UI can highlight winning cells

### Performance
- [ ] **`React.memo` on atoms** — `CellButton`, `XMark`, `OMark` are pure; wrapping in `memo()` would skip re-renders for unchanged cells
- [ ] **Lazy SVG mount** — only mount `XMark`/`OMark` when `value` transitions from `null` (currently conditional render handles this, but `Suspense` could be used for heavier marks)

### Architecture
- [ ] **Extract keyboard hook** — pull document-level keydown logic from `BoardGrid` into a reusable `useGridKeyboard` hook
- [ ] **CSS Modules or CSS-in-JS** — scope styles per component to eliminate global class name collisions

### DevOps & Deployment
- [ ] **CI/CD pipeline** — GitHub Actions workflow for lint → test → build → deploy
- [ ] **GitHub Pages / Vercel deploy** — auto-deploy `dist/` on push to `main`
- [ ] **Dependabot auto-merge** — resolve the existing moderate vulnerability alert and enable auto-updates
- [ ] **PWA support** — add `manifest.json` + service worker for offline play and home-screen install
- [ ] **Bundle analysis** — add `rollup-plugin-visualizer` to audit production bundle size
