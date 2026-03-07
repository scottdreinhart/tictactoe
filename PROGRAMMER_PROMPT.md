You are a senior React + JavaScript engineer. Generate a prompt that is in clean well-structured markdown that does the following:

Build a single-player Tic Tac Toe game in React using JavaScript and functional components.

Requirements:
Human plays "X" and the computer plays "O".  
The human always goes first.

The board is a 3×3 grid (9 cells). Represent it as an array of 9 values: null | "X" | "O".

Empty board example:
***
***
***

Each cell must support:
• mouse click selection
• keyboard navigation (arrow keys AND WASD move focus)
• space/enter selects the focused cell
• keyboard navigation via document-level keydown listener (NOT per-button onKeyDown)

Once a cell is selected it cannot be selected again.

Game rules:
Check for wins after every move. A win occurs when 3 identical tokens occur in a row horizontally, vertically, or diagonally.

Winning line indices:
[0,1,2]
[3,4,5]
[6,7,8]
[0,3,6]
[1,4,7]
[2,5,8]
[0,4,8]
[2,4,6]

A draw occurs when the board is full with no winner.

Turn flow:
1. Human clicks/selects a cell → place "X"
2. Check win/draw; if win, highlight winning 3 cells and update score
3. If game not over → CPU places "O" after `CPU_DELAY_MS` (400ms) delay
4. CPU move happens automatically once per human move
5. Score (wins/losses/draws) persists across rounds until page refresh

CPU logic (smart AI — active):
Deterministic priority: win → block → center → corner → edge.
Random AI (`chooseCpuMoveRandom`) remains exported for easy-mode use.

Architecture expectations:
Use CLEAN architecture + Atomic Design and keep code modular.

• Separate game logic from UI (Separation of Concerns)
• Use pure helper functions for board logic (winner detection, available moves, etc.)
• Follow CLEAN and DRY principles
• Avoid putting all logic in one component

Required structure:
```
src/
  domain/                        # Pure, framework-agnostic
    constants.js                 # TOKENS, WIN_LINES, BOARD_SIZE, CPU_DELAY_MS
    board.js                     # createEmptyBoard, isCellEmpty, applyMove, getEmptyCells
    rules.js                     # getWinner → {token, line}, getWinnerToken, isBoardFull, isDraw, getGameState
    ai.js                        # chooseCpuMoveRandom, chooseCpuMoveSmart (active)
  app/
    useTicTacToe.js              # useReducer + useState (score) + CPU scheduling
  ui/
    atoms/
      CellButton.jsx             # Single cell with SVG mark rendering + winning highlight
      XMark.jsx                  # Animated SVG "X" (React.memo, draw-on effect)
      OMark.jsx                  # Animated SVG "O" (React.memo, draw-on effect)
      GameTitle.jsx              # Game heading atom (React.memo)
      ResetButton.jsx            # Reset button atom (React.memo)
    molecules/
      BoardGrid.jsx              # 3×3 grid + keyboard nav + reset animation
      StatusBar.jsx              # Game status display (aria-live)
      ScoreBoard.jsx             # Win/loss/draw score display (React.memo)
      GameControls.jsx           # Composes ResetButton
      Instructions.jsx           # How-to-play section
    organisms/
      TicTacToeGame.jsx          # Top-level game (pure composition, zero inline markup)
  index.jsx
  styles.css                     # CSS variables, dark mode, animations, media queries
eslint.config.js                 # ESLint flat config (React + hooks + Prettier)
.prettierrc                      # Prettier formatting rules
```

Visual requirements:
• SVG marks (X = two crossing lines, O = circle) with animated stroke-dasharray draw-on effect
• Dark mode via `@media (prefers-color-scheme: dark)` with CSS custom properties
• `@media (prefers-reduced-motion: reduce)` disables all animations
• Responsive media queries for phone → tablet → desktop → large screens
• Landscape phone layout (compact, side-by-side)
• High-contrast mode (`forced-colors: active`) support
• Print stylesheet
• CSS Grid for the board with `aspect-ratio: 1` cells

UI requirements:
Display current game status above the board:
"X's turn"
"O's turn"
"X wins!"
"O wins!"
"Draw!"

Display a score board between the status bar and the board grid:
You (X): N | Draws: N | CPU (O): N

After a win, highlight the 3 winning cells with a pulsing glow animation.
On reset, animate the board with a fade/scale transition.

Code quality:
• ESLint (flat config) + Prettier configured with `lint`, `lint:fix`, `format`, `format:check` scripts
• React.memo on pure atoms (XMark, OMark, GameTitle, ResetButton) and ScoreBoard molecule
• `getWinner` returns `{ token, line }` — UI uses `winLine` to highlight winning cells
• `CPU_DELAY_MS` constant in `constants.js` (currently 400ms)

Include a Reset button to restart the game.

Accessibility requirements:
• `aria-live="polite"` on status bar
• `aria-label` on every cell (Row X, Column Y, value)
• `aria-disabled` instead of HTML `disabled` on buttons
• Roving tabindex for keyboard navigation
• `aria-hidden="true"` on SVG marks

Keyboard navigation critical rule:
Use `document.addEventListener('keydown', handler)` in a `useEffect` with empty deps.
Keep latest state in mutable refs (`useRef`) to avoid stale closures.
Do NOT use `onKeyDown` on individual buttons — it fails when focus is elsewhere.

Ensure:
• cells cannot be overwritten
• CPU never moves after game end
• CPU only moves once per human move
• reset clears board, cancels pending CPU timeout, restores initial state
• organism contains ZERO inline HTML — only composed atoms and molecules