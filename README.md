# Tic-Tac-Toe: Human vs CPU

A clean, modular React Tic-Tac-Toe game with animated SVG marks, 6 color themes (light/dark + colorblind modes), keyboard/mouse/touch controls, synthesized sound effects, and a unified notification queue — built with **CLEAN Architecture** and **Atomic Design**.

## Project Structure

```
src/
├── domain/                           # Pure, framework-agnostic logic
│   ├── constants.js                  # TOKENS, WIN_LINES, BOARD_SIZE, CPU_DELAY_MS
│   ├── board.js                      # Board operations (create, apply move, get empty cells)
│   ├── rules.js                      # Win/draw detection (returns winning line)
│   ├── ai.js                         # CPU move selection (random / medium / smart)
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
│   │   ├── GameTitle.jsx             # Game heading (React.memo)
│   │   ├── ResetButton.jsx           # Reset/new-game button (React.memo)
│   │   ├── DifficultyToggle.jsx      # Easy/Medium/Hard AI toggle (React.memo)
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
- **CPU Move**: Three difficulty levels — Easy (random), Medium (random + occasional blocking), Hard (deterministic priority: win → block → center → corner → edge)
- **Score Tracking**: Win/loss/draw tallies persisted across rounds
- **Win-Line Highlight**: Winning 3 cells pulse with animated glow
- **Difficulty Toggle**: Pill-shaped Easy/Medium/Hard switch
- **Auto-Reset**: 30-second countdown after game end; auto-starts a new round ("Reset Now" button available)
- **Sound Effects**: Synthesized via Web Audio API — move pop, win fanfare (C-major arpeggio + chord ~2s), loss jingle (descending E-minor ~2s), draw tone (toggleable, respects `prefers-reduced-motion`)

### Visual Design
- **SVG Marks**: X and O rendered as animated SVGs with stroke-dasharray draw-on effect
- **6 Color Themes**: Classic, Ocean, Sunset, Forest, Rose, Midnight — each with unique accent gradient
- **Light / Dark Mode**: System (auto), Light (forced), or Dark (forced) — persisted to localStorage
- **4 Colorblind Modes**: Protanopia, Deuteranopia, Tritanopia, Achromatopsia — overrides X/O colors for visibility
- **CSS Custom Properties**: All colors/sizes driven by CSS variables for easy theming
- **Cell Animations**: Pop-in effect when marks are placed; winning cells pulse
- **Outcome Animations**: Win glow, loss shake, draw fade — CSS class applied to game container
- **Confetti Overlay**: Canvas-based 80-particle confetti burst on human win (~3s)
- **Board Reset Animation**: Fade/scale transition when board is cleared
- **Responsive Layout**: `clamp()` sizing adapts from small phones to large desktops
- **Score Board**: Color-coded X/O/Draw tallies above the board

### Controls
- **Mouse**: Click any empty cell to move
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
- 4 colorblind presets override X/O mark colors for improved visibility
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
- **CLEAN Layering**: `domain/` (pure) → `app/` (hooks) → `ui/` (components)
- **Atomic Design**: atoms → molecules → organisms (zero inline markup in organisms)
- **Pure Functions**: All domain logic is immutable and deterministic
- **DRY**: Single source of truth for constants (TOKENS, WIN_LINES)
- **No Race Conditions**: CPU timeout managed via ref; cancelled on reset/unmount
- **Reusable Hooks**: `useGridKeyboard`, `useSwipeGesture`, `useNotificationQueue`, `useAutoReset` — all extracted as composable application hooks
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
playWinSound()    // legacy ascending C-E-G arpeggio
playWinMusic()    // C-major arpeggio + sustained chord (~2s fanfare)
playLossMusic()   // descending E-minor phrase + Bb3 drone (~2s)
playDrawSound()   // descending A4→F4 two-note tone

// Themes
COLOR_THEMES      // 6 themes: classic, ocean, sunset, forest, rose, midnight
MODES             // ['system', 'light', 'dark']
COLORBLIND_MODES  // none, protanopia, deuteranopia, tritanopia, achromatopsia
DEFAULT_SETTINGS  // { colorTheme: 'classic', mode: 'system', colorblind: 'none' }
```

## AI Difficulty Levels

| Level | Strategy | Function |
|-------|----------|----------|
| **Easy** | Purely random move selection | `chooseCpuMoveRandom` |
| **Medium** | Random with occasional smart blocking | hybrid logic in `useTicTacToe` |
| **Hard** | Deterministic priority (default) | `chooseCpuMoveSmart` |

The **Hard** AI uses `chooseCpuMoveSmart` with priority:
1. Win if possible this turn
2. Block human from winning next turn
3. Take center
4. Take corner
5. Take edge

## Technical Highlights

- **React 18** with Hooks (`useReducer` for state, `useState` for score + difficulty, `useCallback`/`useMemo` for stable refs)
- **React.memo** on pure atoms (XMark, OMark, GameTitle, ResetButton, DifficultyToggle, SoundToggle, ScoreBoard, ThemeSelector) to skip unnecessary re-renders
- **PropTypes** runtime validation on all components that accept props (stripped from production builds)
- **Vite 5** for fast development and builds (pinned to `^5.4.21` for Node 18 compat)
- **Production build optimizations**:
  - Vendor chunk splitting — React/ReactDOM cached independently from app code
  - PropTypes stripped from production via `babel-plugin-transform-react-remove-prop-types`
  - Modern build target (`es2020`) — no legacy polyfills
  - Sounds module lazy-loaded via dynamic `import()` — deferred from critical path
  - `modulePreload` polyfill removed — modern browsers handle it natively
- **Bundle analysis** via `rollup-plugin-visualizer` — generates `dist/bundle-report.html` on build
- **ESLint + Prettier** for code quality (flat config, React + hooks plugins)
- **7 application hooks**: `useTicTacToe`, `useGridKeyboard`, `useSoundEffects`, `useTheme`, `useAutoReset`, `useSwipeGesture`, `useNotificationQueue`
- **Sound effects** via Web Audio API — zero audio files, synthesized tones + music jingles (~3KB lazy chunk)
- **Canvas confetti** — 80-particle burst with gravity, air friction, rotation, and opacity fade (~3s)
- **Unified notification queue** — FIFO queue replaces static status bar; auto-dismiss with configurable duration
- **6 color themes** with light/dark/system modes + 4 colorblind presets — all persisted to localStorage
- **Touch & gesture support** — swipe navigation, haptic feedback, optimized touch-action properties
- **CSS Grid** with `aspect-ratio: 1` for perfect square cells
- **CSS Custom Properties** with theme-driven color sets via `data-theme` / `data-mode` / `data-colorblind` attributes
- **SVG Animations** via `stroke-dasharray` / `stroke-dashoffset` draw-on keyframes
- **Outcome animations** — win glow, loss shake, draw fade CSS classes + confetti canvas overlay
- **Board reset animation** (scale + fade transition)
- **Zero TypeScript**: Pure JavaScript for simplicity
- **No external game libraries**: All logic built from scratch

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
- [x] ~~**Sound effects**~~ — done (Web Audio API: move pop, win arpeggio, draw tone; toggleable + reduced-motion aware)
- [x] ~~**Confetti / particle effect**~~ — done (canvas-based 80-particle burst with gravity + fade on human win)
- [ ] **Move history timeline** — visual sidebar showing each move in order with undo/redo support
- [x] ~~**Theme picker**~~ — done (6 color themes + light/dark/system mode + 4 colorblind presets; persisted to localStorage)
- [x] ~~**Touch gesture support**~~ — done (swipe navigation via `useSwipeGesture`, haptic feedback, `touch-action` CSS)
- [ ] **Player name customization** — editable labels for "You" and "CPU" on the scoreboard
- [ ] **Game statistics dashboard** — track lifetime stats (total games, win rate, win streaks) persisted to localStorage

### Code Quality & Testing
- [x] ~~**ESLint + Prettier**~~ — done (flat config, React + hooks plugins, `lint`/`format` scripts)
- [x] ~~**`getWinner` returns winning line**~~ — done (returns `{ token, line }`, `getWinnerToken` convenience)
- [x] ~~**`React.memo` on atoms**~~ — done (XMark, OMark, GameTitle, ResetButton, DifficultyToggle, SoundToggle, ScoreBoard)
- [ ] **Unit tests** — domain functions (`board.js`, `rules.js`, `ai.js`) are pure and test-ready; add Vitest or Jest suite
- [ ] **Component tests** — React Testing Library tests for CellButton, BoardGrid, NotificationBanner
- [ ] **Integration / E2E tests** — Playwright or Cypress for full game-flow verification
- [x] ~~**PropTypes**~~ — done (runtime prop validation on all components that accept props)
- [ ] **Storybook** — catalog atoms/molecules in isolation for visual regression testing
- [x] ~~**Dead code cleanup**~~ — done (removed 5 orphaned files: CountdownOverlay, ResetDialog, ResetButton, StatusBar, GameControls; removed unused CSS variables and rules)
- [ ] **TypeScript migration** — gradual opt-in via `.jsx` → `.tsx` conversion; domain layer is pure and would benefit most from type safety

### Performance
- [ ] **Lazy SVG mount** — only mount `XMark`/`OMark` when `value` transitions from `null` (currently conditional render handles this, but `Suspense` could be used for heavier marks)
- [ ] **CSS code-splitting** — split theme-variant CSS into on-demand chunks so unused themes don't ship in the initial stylesheet
- [ ] **Service Worker caching** — precache built assets for instant repeat-visit loads (pairs with PWA support)

### Architecture
- [x] ~~**Extract keyboard hook**~~ — done (`useGridKeyboard.js` — reusable document-level keydown logic)
- [ ] **CSS Modules or CSS-in-JS** — scope styles per component to eliminate global class name collisions
- [ ] **Cross-platform dev script** — replace `fuser -k 5173/tcp` in `npm run dev` with a cross-platform port-kill (e.g. `kill-port` package) so it works on native Windows/macOS, not just WSL/Linux

### Accessibility
- [ ] **Remove `user-scalable=no`** — the viewport meta tag currently disables pinch-to-zoom, which conflicts with WCAG 2.1 SC 1.4.4 (Resize Text); removing it would make the AA compliance claim fully accurate
- [ ] **Skip-to-content link** — hidden link that becomes visible on focus to let keyboard/screen-reader users jump past the toolbar
- [ ] **High-contrast theme** — a dedicated theme designed for maximal contrast beyond what `forced-colors` provides

### DevOps & Deployment
- [ ] **Add LICENSE file** — the repo is public on GitHub but has no license; add MIT (or preferred) so others can legally use/fork the code
- [ ] **CI/CD pipeline** — GitHub Actions workflow for lint → test → build → deploy
- [ ] **GitHub Pages / Vercel deploy** — auto-deploy `dist/` on push to `main`
- [ ] **Dependabot auto-merge** — resolve the existing moderate vulnerability alert and enable auto-updates
- [ ] **PWA support** — add `manifest.json` + service worker for offline play and home-screen install
- [x] ~~**Bundle analysis**~~ — done (`rollup-plugin-visualizer` generates `dist/bundle-report.html` on build)
- [ ] **Browser compatibility documentation** — document minimum browser versions (Chrome 80+, Firefox 80+, Safari 14+, Edge 80+) given `es2020` target, `aspect-ratio`, Web Audio API, and CSS `translate` usage

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
