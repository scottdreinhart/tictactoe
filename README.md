# Tic-Tac-Toe

**⚠️ PROPRIETARY SOFTWARE — All Rights Reserved**

© 2026 Scott Reinhart. This software is proprietary and confidential. 
Unauthorized reproduction, distribution, or use is strictly prohibited.
See [LICENSE](LICENSE) file for complete terms and conditions.

## Project Structure

```
src/
├── domain/                           # Pure, framework-agnostic logic
│   ├── constants.js                  # TOKENS, WIN_LINES, BOARD_SIZE, CPU_DELAY_MS
│   ├── board.js                      # Board operations (create, apply move, get empty cells)
│   ├── rules.js                      # Win/draw detection (returns winning line)
│   ├── ai.js                         # CPU move selection (random / medium / smart / minimax unbeatable)
│   ├── sounds.js                     # Web Audio API synthesized SFX + jingles
│   └── themes.js                     # Color theme, mode & colorblind definitions
├── app/
│   ├── useTicTacToe.js               # Game state + score + difficulty management hook
│   ├── useGridKeyboard.js            # Reusable document-level keyboard navigation hook
│   ├── useSoundEffects.js            # Sound toggle + play functions (respects reduced-motion)
│   ├── useTheme.js                   # Theme / mode / colorblind persistence + DOM sync
│   ├── useAutoReset.js               # 30-second auto-reset countdown after game end
│   ├── useSwipeGesture.js            # Touch swipe detection for mobile grid navigation
│   └── useNotificationQueue.js       # FIFO notification queue (enqueue / dismiss / update)
├── ui/
│   ├── atoms/
│   │   ├── CellButton.jsx            # Single cell with SVG mark rendering + winning highlight
│   │   ├── XMark.jsx                 # Animated SVG "X" (React.memo, draw-on effect)
│   │   ├── OMark.jsx                 # Animated SVG "O" (React.memo, draw-on effect)
│   │   ├── HamburgerMenu.jsx         # Accessible ☰ menu with focus trap + animated panel
│   │   ├── DifficultyToggle.jsx      # Easy/Medium/Hard/Unbeatable AI toggle (React.memo)
│   │   ├── SoundToggle.jsx           # Sound on/off toggle (React.memo)
│   │   ├── ThemeSelector.jsx         # Collapsible theme/mode/colorblind settings panel
│   │   ├── ConfettiOverlay.jsx       # Canvas-based confetti particle animation on win
│   │   └── NotificationBanner.jsx    # Floating queued notification overlay on board center
│   ├── molecules/
│   │   ├── BoardGrid.jsx             # 3×3 grid with reset animation (uses useGridKeyboard)
│   │   ├── ScoreBoard.jsx            # Win/loss/draw score display (React.memo)
│   │   └── Instructions.jsx          # ⓘ info icon with auto-positioned tooltip
│   └── organisms/
│       └── TicTacToeGame.jsx         # Top-level game component (pure composition)
├── index.jsx                         # React entry point
└── styles.css                        # CSS with themes, animations, media queries

index.html                            # HTML entry point
package.json                          # Dependencies & scripts
vite.config.js                        # Vite configuration + rollup-plugin-visualizer
eslint.config.js                      # ESLint flat config (React + hooks + Prettier)
.prettierrc                           # Prettier formatting rules
```

## Features

### Game Logic
- **Human (X) vs CPU (O)**: Human plays first
- **Board Representation**: 9-cell array with immutable updates
- **Win Detection**: All 8 winning lines checked (3 rows, 3 columns, 2 diagonals)
- **Draw Detection**: Board full + no winner = draw
- **CPU Move**: Four difficulty levels — Easy (random), Medium (win/block + random), Hard (heuristic priority: win → block → center → corner → edge), Unbeatable (minimax with alpha-beta pruning, cannot be beaten)
- **Score Tracking**: Win/loss/draw tallies persisted across rounds
- **Win-Line Highlight**: Winning 3 cells pulse with animated glow
- **Difficulty Toggle**: Pill-shaped Easy/Medium/Hard/Unbeatable switch
- **Auto-Reset**: 30-second countdown after game end; auto-starts a new round ("Reset Now" button available)
- **Sound Effects**: Synthesized via Web Audio API — move pop, win fanfare (C-major arpeggio + chord ~2s), loss jingle (descending E-minor ~2s), draw tone (toggleable, respects `prefers-reduced-motion`)

### Visual Design
- **SVG Marks**: X and O rendered as animated SVGs with stroke-dasharray draw-on effect
- **6 Color Themes**: Classic, Ocean, Sunset, Forest, Rose, Midnight — each with unique accent gradient
- **Light / Dark Mode**: System (auto), Light (forced), or Dark (forced) — persisted to localStorage
- **4 Colorblind Modes**: Red Weakness, Green Weakness, Blue Weakness, Monochrome — overrides X/O colors for visibility
- **CSS Custom Properties**: All colors/sizes driven by CSS variables for easy theming
- **Cell Animations**: Pop-in effect when marks are placed; winning cells pulse
- **Outcome Animations**: Win glow, loss shake, draw fade — CSS class applied to game container
- **Confetti Overlay**: Canvas-based 80-particle confetti burst on human win (~3s)
- **Board Reset Animation**: Fade/scale transition when board is cleared
- **Responsive Layout**: `clamp()` sizing adapts from small phones to large desktops
- **Score Board**: Color-coded X/O/Draw tallies above the board

### Controls
- **Mouse**: Click any empty cell to move
- **Hamburger Menu** (☰): Sound, Theme, and Help settings organized in a dropdown panel with:
  - `aria-haspopup` + `aria-expanded` on trigger button
  - `role="menu"` on panel with labeled sections
  - Focus trap (Tab/Shift+Tab cycle within panel)
  - Close on Escape, outside click, or outside touch
  - Animated ☰ → ✕ transition on open/close
- **Keyboard**: 
  - **Arrow Keys** or **WASD**: Navigate (↑/W up, ↓/S down, ←/A left, →/D right)
  - **Space** or **Enter**: Select focused cell
  - Document-level keydown listener — works regardless of DOM focus
- **Touch / Gesture**:
  - Tap to select cell (with haptic feedback via `navigator.vibrate()`)
  - Swipe to navigate (30px threshold, 300ms timeout) — `useSwipeGesture` hook
  - `touch-action: none` on board, `touch-action: manipulation` on interactive elements
  - `-webkit-tap-highlight-color: transparent` for clean mobile UX

### Accessibility
- ARIA labels on all cells (`Row X, Column Y, empty/X/O`)
- Notification banner uses `role="status"` + `aria-live="polite"` for screen reader updates
- Roving tabindex for keyboard navigation
- `prefers-reduced-motion: reduce` disables all animations and sounds
- `forced-colors: active` support for high-contrast mode
- 4 colorblind presets override X/O mark colors for improved visibility (Standard, Red Weakness, Green Weakness, Blue Weakness, Monochrome)
- SVG marks use `aria-hidden="true"` (cell label provides semantics)
- Clear visual focus indicators with accent-colored outline + glow
- Theme selector uses `aria-pressed` on all buttons and `role="dialog"` for the panel

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

### Notifications
- **Unified Notification Queue**: All game messages (outcome, countdown, info) flow through a single FIFO queue displayed as a floating banner over the board's center row
- **Auto-Dismiss**: Notifications disappear after their configured duration (default 10s); countdown notifications persist until reset
- **Outcome → Countdown Flow**: Game-end enqueues an outcome notification (4s), followed by a persistent countdown notification with live-updating "New game in Ns" text and a "Reset Now" action button
- **Variant Styles**: Win (golden gradient), Loss (red gradient), Draw (blue-grey gradient), Countdown (theme accent gradient)

### Architecture

#### Design Principles (Enforced)

The project enforces four complementary design patterns:

1. **CLEAN Architecture** (Layer Separation)
   - `domain/` layer: Pure, framework-agnostic logic (zero React dependencies)
   - `app/` layer: React hooks for state management & side effects
   - `ui/` layer: Presentational components (atoms → molecules → organisms)
   - **Benefit**: Domain logic is testable, reusable, and framework-independent

2. **Atomic Design** (Component Hierarchy)
   - **Atoms** (9): Basic UI elements (`CellButton`, `XMark`, `OMark`, reusable toggles, etc.)
   - **Molecules** (3): Composed atoms (`BoardGrid`, `ScoreBoard`, `Instructions`)
   - **Organisms** (1): Full-page composition (`TicTacToeGame`)
   - **Rule**: Organisms contain zero inline markup; all composition happens in JSX
   - **Benefit**: Components are predictable, composable, and reusable across contexts

3. **SOLID Principles** (Code-Level Design)
   - **Single Responsibility**: Each hook, function, and component has one reason to change
   - **Open/Closed**: Domain logic (`board.js`, `rules.js`, `ai.js`) extended without modification via rules/constants
   - **Liskov Substitution**: Theme, sound, and difficulty toggles are interchangeable (uniform `aria-pressed` toggle interface)
   - **Interface Segregation**: Components expose only essential props; UI constants keep config separate
   - **Dependency Inversion**: High-level modules (components) depend on low-level abstractions (hooks, domain exports)
   - **Benefit**: Code is maintainable, testable, and resistant to side effects

4. **DRY Principle** (No Duplication)
   - Constants extracted to single sources: `TOKENS`, `WIN_LINES`, `DIFFICULTIES`, `SOUND_PRESETS`
   - Reusable hooks eliminate component duplication: `useSmartPosition`, `useDropdownBehavior` (Phase 6 refactor)
   - Positioning logic previously duplicated in `ThemeSelector` & `Instructions` now centralized
   - **Benefit**: Changes propagate consistently; less code to maintain

#### Supporting Patterns

- **Pure Functions**: All domain logic is immutable and deterministic
- **No Race Conditions**: CPU timeout managed via ref; cancelled on reset/unmount
- **Reusable Hooks**: `useGridKeyboard`, `useSwipeGesture`, `useNotificationQueue`, `useAutoReset`, `useSmartPosition`, `useDropdownBehavior` — all extracted as composable application hooks
- **PropTypes**: Runtime prop validation on all components that accept props

## Installation & Running

```bash
# Install dependencies
npm install

# Start development server (accessible on LAN via 0.0.0.0)
# Cross-platform: works on Windows, macOS, Linux (uses kill-port instead of fuser)
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

1. **Human's Turn**: Click, tap, or use keyboard/swipe to select a cell
2. **Board Update**: Cell is marked with animated X + move sound; game checks for win/draw
3. **CPU's Turn**: After 400ms delay, AI selects a move (animated O)
4. **Game End**: Winning cells pulse, outcome animation plays (glow/shake/fade), music jingle fires, score updates — on win, confetti bursts
5. **Notification**: Outcome message floats over board center (4s), then countdown notification with "Reset Now" button
6. **Auto-Reset**: New round starts automatically after 30 seconds, or immediately on "Reset Now" — board fades out/in, scores persist

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
chooseCpuMoveRandom(board)                       // Easy — random
chooseCpuMoveSmart(board, cpuToken, humanToken)   // Hard — priority-based

// Sound effects (Web Audio API)
playMoveSound()   // short 600Hz pop on move placement
playWinMusic()    // C-major arpeggio + sustained chord (~2s fanfare)
playLossMusic()   // descending E-minor phrase + Bb3 drone (~2s)
playDrawSound()   // descending A4→F4 two-note tone

// Themes
COLOR_THEMES      // 6 themes: classic, ocean, sunset, forest, rose, midnight
MODES             // ['system', 'light', 'dark']
COLORBLIND_MODES  // none, protanopia (red weakness), deuteranopia (green weakness), tritanopia (blue weakness), achromatopsia (monochrome)
DEFAULT_SETTINGS  // { colorTheme: 'classic', mode: 'system', colorblind: 'none' }
```

## AI Difficulty Levels

| Level | Strategy | Implementation | Notes |
|-------|----------|-----------------|-------|
| **Easy** | Purely random choice | `chooseCpuMoveRandom` | Weakest, beatable in 1-2 moves |
| **Medium** | Win/block + random | `chooseCpuMoveMedium` | Defensive but tactical; loses to perfect play |
| **Hard** | Priority-based heuristic | `chooseCpuMoveSmart` | Center → corners → edges with blocking; competent opponent |
| **Unbeatable** | Minimax with alpha-beta pruning (Phase C) | `chooseCpuMoveUnbeatable` | Exhaustive game-tree search; cannot be beaten (best result: draw) |

### Hard AI Strategy (Priority-Based)
1. Win if possible this turn
2. Block human from winning next turn
3. Take center (index 4)
4. Take corner (0, 2, 6, or 8)
5. Take edge (1, 3, 5, or 7)

### Unbeatable AI Strategy (Minimax)
- **Algorithm**: Minimax with alpha-beta pruning
- **Execution**: Web Worker off-main-thread (Phase 7, `src/workers/ai.worker.js`)
- **Move ordering**: Center → corners → edges (accelerates pruning)
- **Complexity**: O(9! / (2^k)) calls with pruning; ~100K–500K evaluations per move
- **Strength**: Perfect play against optimal defense; guaranteed draw if human also plays optimally
- **Responsiveness**: CPU_DELAY_MS simulates thinking time; UI remains responsive on 60 FPS

## Technical Highlights

### React & State Management
- **React 18** with Hooks (`useReducer` for state, `useState` for score + difficulty, `useCallback`/`useMemo` for stable refs)
- **React.memo** on pure atoms (XMark, OMark, DifficultyToggle, SoundToggle, ScoreBoard, ThemeSelector) to skip unnecessary re-renders
- **PropTypes** runtime validation on all components that accept props (stripped from production builds)
- **8 application hooks**: `useTicTacToe`, `useGridKeyboard`, `useSoundEffects`, `useTheme`, `useAutoReset`, `useSwipeGesture`, `useNotificationQueue`, `useSmartPosition`, `useDropdownBehavior` — extracted for composability and reuse

### Build & Performance Optimization
- **Vite 5** for fast development and builds (pinned to `^5.4.21` for Node 18 compat)
- **Production build optimizations**:
  - Vendor chunk splitting — React/ReactDOM cached independently from app code
  - PropTypes stripped from production via `babel-plugin-transform-react-remove-prop-types`
  - Modern build target (`es2020`) — no legacy polyfills
  - Sounds module lazy-loaded via dynamic `import()` — deferred from critical path
  - `modulePreload` polyfill removed — modern browsers handle it natively
- **CSS Code-Splitting** (Vite + dynamic imports):
  - Theme CSS split into separate chunks (ocean, sunset, forest, rose, midnight, highcontrast)
  - Classic theme bundled in main stylesheet (~6 KB gzipped)
  - Non-classic themes lazy-loaded on-demand (~0.5–1 KB each, gzipped)
  - All themes preloaded at app startup for instant theme-switching (<1 ms per switch)
  - See [CSS_ARCHITECTURE.md](CSS_ARCHITECTURE.md) for full details
- **Web Worker for AI** (Phase 7):
  - CPU move computation runs in `ai.worker.js` off the main thread
  - Smart/Medium AI algorithms never block UI animations or interactions
  - Maintains 60 FPS even during complex AI calculations
  - Worker bundled separately (~1.2 KB gzipped), loaded on demand
- **Bundle analysis** via `rollup-plugin-visualizer` — generates `dist/bundle-report.html` on build
- **Sound synthesis** via Web Audio API — zero audio files, synthesized tones + music jingles (~3KB lazy chunk)

### Code Quality & Maintainability
- **ESLint + Prettier** for code quality (flat config, React + hooks plugins, `lint`/`lint:fix`/`format`/`format:check` scripts)
- **Zero TypeScript**: Pure JavaScript for simplicity and fast iteration
- **No external game libraries**: All logic built from scratch — board, rules, AI, sounds, themes
- **SOLID principles** enforced: dependency inversion, single responsibility, open/closed principle via hooks and constants

### Interactive Features
- **Sound effects** — move pop (600Hz), navigation beep (800Hz), win fanfare (C-E-G arpeggio), loss jingle (A-F descending), draw tone — all synthesized, toggleable, respects `prefers-reduced-motion`
- **Canvas confetti** — 80-particle burst with gravity, air friction, rotation, and opacity fade (~3s animation on human win)
- **Unified notification queue** — FIFO queue system for status + countdown + reset messages; auto-dismiss with configurable duration
- **Keyboard navigation** — Arrow keys + WASD for grid movement, Space/Enter to select, Escape for menu close
- **Touch & gesture support** — swipe navigation (30px threshold), haptic feedback, optimized `touch-action` properties for mobile

### Visuals & Animations
- **CSS Grid** with `aspect-ratio: 1` for perfect square cells responsive across all screen sizes
- **SVG Animations** via `stroke-dasharray` / `stroke-dashoffset` draw-on keyframes for X and O marks
- **Outcome animations** — win glow pulse, loss shake, draw fade CSS classes + confetti canvas overlay
- **Board reset animation** — scale + fade transition (300ms cubic-bezier easing)
- **Menu animation** — hamburger ☰→✕ icon transition + panel slide-in (250ms bounce easing)
- **Kinetic animations** — directional slide-in effects for cell focus (up/down/left/right based on navigation direction)

### Theming & Customization
- **6 color themes**: Classic, Ocean, Sunset, Forest, Rose, Midnight — light/dark variants + High Contrast mode
- **Light / Dark / System modes** — auto-detect via `prefers-color-scheme`, manual override via selector, persisted to localStorage
- **4 colorblind-safe presets**: Red Weakness, Green Weakness, Blue Weakness, Monochrome — all with distinct X/O mark colors
- **CSS Custom Properties** with theme-driven color sets via `data-theme` / `data-mode` / `data-colorblind` attributes
- **Smart dropdown positioning** — `useSmartPosition` hook auto-detects viewport overflow, positions menus left/right intelligently

## Accessibility Compliance

- ✅ WCAG 2.1 AA focus indicators
- ✅ Semantic HTML (buttons, grid role, dialog role)
- ✅ ARIA live regions for notification updates (`role="status"`, `aria-live="polite"`)
- ✅ `aria-pressed` on all toggle/selection buttons
- ✅ Keyboard-only playable (arrows, WASD, Space, Enter)
- ✅ Touch/swipe playable with haptic feedback
- ✅ `prefers-reduced-motion` respected (animations and sounds disabled)
- ✅ `forced-colors` / high-contrast mode support
- ✅ 4 colorblind presets (Protanopia, Deuteranopia, Tritanopia, Achromatopsia)
- ✅ Print stylesheet (hides controls + notifications, uses black/grey marks)

## Completed Features (Phases 1–7)

### Technical — AI ✅
- **Activate smart AI** (priority: win → block → center → corner → edge)
- **Minimax AI with alpha-beta pruning** — unbeatable CPU difficulty level
- **Configurable CPU delay** — `CPU_DELAY_MS` constant (currently 400ms)
- **Difficulty toggle** — Easy/Medium/Hard/Unbeatable; pill-shaped toggle
- **Web Worker AI** — CPU computation off-main-thread in `ai.worker.js`, 60 FPS guaranteed

### Visual & UX ✅
- **Win-line highlight** — winning cells pulse with `win-pulse` animation
- **Score tracking display** — ScoreBoard molecule: You/Draws/CPU tallies
- **Smooth board reset transition** — fade + scale `board-reset` animation
- **Sound effects** — Web Audio API: move pop, win arpeggio, draw tone; toggleable + reduced-motion aware
- **Confetti / particle effect** — canvas-based 80-particle burst with gravity + fade on human win
- **Theme picker** — 6 color themes + light/dark/system mode + 4 colorblind presets; persisted to localStorage
- **Touch gesture support** — swipe navigation via `useSwipeGesture`, haptic feedback, `touch-action` CSS

### Code Quality ✅
- **ESLint + Prettier** — flat config, React + hooks plugins, `lint`/`format` scripts
- **`getWinner` returns winning line** — returns `{ token, line }`, `getWinnerToken` convenience
- **`React.memo` on atoms** — XMark, OMark, DifficultyToggle, SoundToggle, ScoreBoard, ThemeSelector
- **PropTypes on all components** — runtime prop validation on all components that accept props
- **Dead code cleanup** — removed 5 orphaned files (CountdownOverlay, ResetDialog, ResetButton, StatusBar, GameControls); removed unused CSS variables and rules

### Performance ✅
- **Lazy SVG mount** — `React.lazy` + `Suspense` fallback in [CellButton.jsx](src/ui/atoms/CellButton.jsx#L4-L5)
- **Service Worker caching** — precache critical shell + cache-first for `/assets/*` in [sw.js](public/sw.js)
- **CSS code-splitting** — theme CSS split into separate chunks; classic bundled in main, others lazy-loaded on-demand; all preloaded at startup for instant switching

### Architecture ✅
- **Extract keyboard hook** — `useGridKeyboard.js` — reusable document-level keydown logic
- **Cross-platform dev script** — replaced `fuser -k 5173/tcp` with `kill-port` (works on Windows, macOS, Linux)

### Accessibility ✅
- **Remove `user-scalable=no`** — viewport meta tag has `user-scalable=yes` in [index.html](index.html#L5), fully WCAG 2.1 SC 1.4.4 compliant
- **Skip-to-content link** — hidden `<a href="#game-board">Skip to game board</a>` in [TicTacToeGame.jsx](src/ui/organisms/TicTacToeGame.jsx#L125), visible on focus
- **High-contrast theme** — dedicated [highcontrast.css](src/themes/highcontrast.css) + `@media (forced-colors: active)` support in [styles.css](src/styles.css#L1370)

### DevOps & Deployment ✅
- **Proprietary license** — LICENSE file with full terms and copyright holder identification
- **PWA support** — `manifest.json` + service worker for offline play and home-screen install
- **Bundle analysis** — `rollup-plugin-visualizer` generates `dist/bundle-report.html` on build
- **Dependency updates** — React 19.2.4, eslint 10.0.3, @vitejs/plugin-react 5.1.4 upgraded March 7, 2026

## Remaining Work

### Visual & UX
- [ ] **Move history timeline** — visual sidebar showing each move in order with undo/redo support
- [ ] **Player name customization** — editable labels for "You" and "CPU" on the scoreboard
- [ ] **Game statistics dashboard** — track lifetime stats (total games, win rate, win streaks) persisted to localStorage

### Code Quality & Testing
- [ ] **Unit tests** — domain functions (`board.js`, `rules.js`, `ai.js`) are pure and test-ready; add Vitest or Jest suite
- [ ] **Component tests** — React Testing Library tests for CellButton, BoardGrid, NotificationBanner
- [ ] **Integration / E2E tests** — Playwright or Cypress for full game-flow verification
- [ ] **Storybook** — catalog atoms/molecules in isolation for visual regression testing
- [ ] **TypeScript migration** — gradual opt-in via `.jsx` → `.tsx` conversion; domain layer is pure and would benefit most from type safety

### Architecture
- ✅ **CSS Modules or CSS-in-JS** — scope styles per component to eliminate global class name collisions
  - ✅ **Phase 1 (Atoms)**: 6 atoms converted to CSS Modules with scoped class names
  - ✅ **Phase 2 (Molecules)**: 3 molecules converted to CSS Modules with scoped class names
  - ✅ **Phase 3 (Organisms)**: TicTacToeGame converted to CSS Modules with outcome animations
  - ✅ **Phase 4 (Cleanup)**: Removed 560 lines of migrated component styles from global stylesheet
    - Global stylesheet now contains: theme variables, base typography, responsive media queries
    - All 10 UI components now use scoped CSS Modules for styling
    - CSS bundle reduced: 34.39 KB → 25.86 KB (5.48 KB gzip, previously 6.12 KB gzip)
  - **Result**: 100% of atomic design components now use scoped CSS Modules
  - See [CSS_ARCHITECTURE.md](CSS_ARCHITECTURE.md) for migration guide and `src/ui/utils/cssModules.js` utility

### DevOps & Deployment
- [ ] **CI/CD pipeline** — GitHub Actions workflow for lint → test → build → deploy
- [ ] **GitHub Pages / Vercel deploy** — auto-deploy `dist/` on push to `main`
- [ ] **Dependabot auto-merge** — resolve existing moderate vulnerability alert and enable auto-updates
- [ ] **Browser compatibility documentation** — minimum versions (Chrome 80+, Firefox 80+, Safari 14+, Edge 80+)

### Gameplay
- [ ] **Local multiplayer** — human vs human mode on the same device (remove CPU AI, alternate turns)
- [ ] **Online multiplayer** — real-time two-player via WebSockets (would need a lightweight server)
- [ ] **Undo / redo** — step backward/forward through move history (domain layer is already immutable, making this straightforward)
- [ ] **First-move choice** — let the player choose to go first (X) or second (O) at round start
- [ ] **Streak & best-time tracking** — track consecutive wins and fastest win, display on the scoreboard

## Future Game Ideas

Simple browser games of similar scope and effort that could be built with the same React + CLEAN architecture stack:

| Game | Description | Complexity vs Tic-Tac-Toe |
|------|-------------|---------------------------|
| **Shut the Box** | Roll dice, flip numbered tiles to match the total; lowest remaining sum wins | Similar — grid UI + dice logic |
| **Mancala (Kalah)** | Two-row pit-and-stones capture game; simple rules, satisfying chain moves | Slightly higher — seed-sowing animation |
| **Connect Four** | Drop discs into a 7×6 grid; first to four in a row wins | Similar — larger grid, same win-check pattern |
| **Simon Says** | Repeat a growing sequence of colors/sounds; memory challenge | Similar — leverages existing Web Audio API |
| **Lights Out** | Toggle a 5×5 grid of lights; goal is to turn them all off | Similar — grid + toggle logic |
| **Nim** | Players take turns removing objects from piles; last to take loses | Simpler — minimal UI, pure strategy |
| **Hangman** | Guess letters to reveal a hidden word before the stick figure completes | Similar — alphabet grid + SVG drawing |
| **Memory / Concentration** | Flip cards to find matching pairs on a grid | Similar — grid + flip animation |
| **2048** | Slide numbered tiles on a 4×4 grid; merge matching tiles to reach 2048 | Slightly higher — swipe input + merge logic |
| **Reversi (Othello)** | Place discs to flip opponent's pieces; most discs wins | Moderately higher — flip-chain logic + AI |
| **Checkers** | Classic diagonal-move capture board game | Higher — move validation + multi-jump |
| **Battleship** | Place ships on a grid, take turns guessing opponent locations | Moderately higher — two-board UI + ship placement |
| **Snake** | Steer a growing snake to eat food without hitting walls or itself | Different — real-time game loop instead of turn-based |
| **Monchola** | Traditional dice/board race game with capture mechanics | Similar — dice roll + board path + capture rules |
| **Rock Paper Scissors** | Best-of-N rounds against the CPU with hand animations | Simpler — minimal state, animation-focused |
