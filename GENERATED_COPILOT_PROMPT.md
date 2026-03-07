# TITLE: REACT (JAVASCRIPT) SINGLE-PLAYER TIC TAC TOE — HUMAN=X VS CPU=O (MOUSE + KEYBOARD) — SOC + CLEAN + ATOMIC + DRY

ROLE / VOICE:
You are an AI/LLM coding copilot acting as a senior React + JavaScript engineer.
Generate code that is clean, modular, accessible, and testable.
Avoid monolithic components. Keep domain logic pure and UI logic declarative.

PRIMARY OBJECTIVE:
Program a single-player (Human vs CPU) Tic Tac Toe game in React where:
- Human token: "X"
- CPU token: "O"
- 3×3 grid, 9 cells
- Human moves first
- Empty board renders conceptually as:
  ***
  ***
  ***
  Where "*" represents an unselected cell.

INPUT CONTROLS (MUST SUPPORT BOTH):
1) Mouse
- Clicking a cell selects it for the current player if the cell is empty and the game is active.

2) Keyboard
- Arrow keys AND WASD move the selection focus around the 3×3 grid.
- Space bar (and/or Enter) selects the currently focused cell.
- Once selected, the cell becomes taken and can no longer be selected by either player.

CRITICAL KEYBOARD IMPLEMENTATION:
- Use `document.addEventListener('keydown', handler)` in a `useEffect` with EMPTY dependency array.
- Store latest `focusedIndex`, `onSelect`, and `onFocusChange` in mutable refs (`useRef`) — update refs on every render.
- This prevents stale closures and works regardless of which element has DOM focus.
- Do NOT use `onKeyDown` on individual `<button>` elements — it fails when buttons lose focus.
- Use `aria-disabled` instead of HTML `disabled` attribute to avoid trapping keyboard focus.

TURN & MOVE RULES (MUST IMPLEMENT):
- Human (X) always plays first.
- Turns alternate X then O then X then O…
- After every valid human move, CPU automatically plays exactly once (if game not over).
- A cell cannot be overwritten once set.
- After every move, evaluate:
  1) Winner
  2) Draw (board full and no winner)
- When game ends (win/draw), stop accepting moves until Reset.
- Provide a Reset button to clear board and restore initial state.
- Prevent double CPU moves and race conditions (cancel pending CPU moves on reset/unmount).

WIN CONDITIONS (MUST IMPLEMENT EXACTLY):
A win occurs when any horizontal, vertical, or diagonal line contains 3 of the same token ("X" or "O").

Board indices:
0 1 2
3 4 5
6 7 8

Winning lines (single source of truth):
- Rows:  [0,1,2], [3,4,5], [6,7,8]
- Cols:  [0,3,6], [1,4,7], [2,5,8]
- Diags: [0,4,8], [2,4,6]

Winner occurs when any line has 3 identical non-null tokens.
Draw occurs when board is full AND winner is null.

VALID WIN PATTERNS (ASTERISK MEANS "EITHER X OR O"):
X vertical wins:
X**      *X*     **X
X**      *X*     **X
X**      *X*     **X

X horizontal wins:
XXX      ***     ***
***      XXX     ***
***      ***     XXX

X diagonal wins:
X**      **X
*X*      *X*
**X      X**

O vertical wins:
O**      *O*     **O
O**      *O*     **O
O**      *O*     **O

O horizontal wins:
OOO      ***     ***
***      OOO     ***
***      ***     OOO

O diagonal wins:
O**      **O
*O*      *O*
**O      O**

CPU MOVE LOGIC:
Smart AI (ACTIVE — chooseCpuMoveSmart):
Deterministic priority:
1) Win if possible this turn
2) Block X if X could win next turn
3) Take center if available
4) Take a corner if available
5) Else take an edge
- CPU does NOT move if winner exists or draw reached after human move.
- CPU move scheduled via `setTimeout` (CPU_DELAY_MS = 400ms) with ref cleanup.
- Random AI (`chooseCpuMoveRandom`) remains exported for easy-mode or testing use.
Keep CPU logic isolated in /domain as pure functions.

ARCHITECTURE REQUIREMENTS (SOC + CLEAN + ATOMIC + DRY):
Use CLEAN-style layering + Atomic Design:

1) domain/ (PURE — NO React imports)
   - board representation, validation, win/draw evaluation, move generation, AI choice
   - functions are pure/immutable and unit-test friendly
   - NO DOM, NO window usage

2) app/ (React hook orchestrating gameplay)
   - useReducer for state management (board, turn, focusedIndex)
   - CPU scheduling via useEffect + setTimeout
   - Stable handler refs via useCallback
   - Derived state via useMemo (gameState, status text)

3) ui/ (presentational components; no win logic)
   - atoms: smallest UI primitives (CellButton, XMark, OMark, GameTitle, ResetButton)
   - molecules: composed UI parts (BoardGrid, StatusBar, GameControls, Instructions)
   - organisms: complete game assembly (TicTacToeGame — ZERO inline markup)

DRY RULES (NON-NEGOTIABLE):
- Define TOKENS and WIN_LINES once (domain/constants).
- UI must never re-implement win checking.
- No in-place mutation of board arrays; use immutable updates.
- Organisms must ONLY compose atoms/molecules — no raw HTML elements.

REQUIRED FILE STRUCTURE (CREATE THESE FILES):
src/
  domain/
    constants.js
    board.js
    rules.js
    ai.js
  app/
    useTicTacToe.js
  ui/
    atoms/
      CellButton.jsx
      XMark.jsx
      OMark.jsx
      GameTitle.jsx
      ResetButton.jsx
    molecules/
      BoardGrid.jsx
      StatusBar.jsx
      ScoreBoard.jsx
      GameControls.jsx
      Instructions.jsx
    organisms/
      TicTacToeGame.jsx
  index.jsx
  styles.css
eslint.config.js
.prettierrc

DOMAIN CONTRACTS:
- board: Array(9) where each value is null | "X" | "O"
- all domain functions deterministic and pure

DOMAIN FILE REQUIREMENTS:

src/domain/constants.js
- export TOKENS = { HUMAN: "X", CPU: "O" }
- export BOARD_SIZE = 3
- export CPU_DELAY_MS = 400
- export WIN_LINES = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]]

src/domain/board.js
- export createEmptyBoard() => Array(9).fill(null)
- export isCellEmpty(board, idx) => boolean (bounds-checked)
- export applyMove(board, idx, token) => returns NEW board; throws on occupied cell
- export getEmptyCells(board) => number[]

src/domain/rules.js
- export getWinner(board) => { token: "X"|"O", line: number[] } | null
- export getWinnerToken(board) => "X" | "O" | null (convenience helper)
- export isBoardFull(board) => boolean
- export isDraw(board) => boolean (full AND no winner)
- export getGameState(board) => { winner, winLine, isDraw, isOver }

src/domain/ai.js
- export chooseCpuMoveRandom(board) => idx (from empty cells) — exported but not active
- export chooseCpuMoveSmart(board, cpuToken, humanToken) => idx — ACTIVE in useTicTacToe
  Priority: 1) win, 2) block, 3) center, 4) corner, 5) edge
- helper: findWinningMove(board, token) => idx | null (uses getWinnerToken)

HOOK REQUIREMENTS:

src/app/useTicTacToe.js
Must manage via useReducer:
- board state (Array of 9)
- turn state ("X" or "O")
- focusedIndex state (0..8, initial: 4 for center)

Reducer actions:
- HUMAN_MOVE: validate turn + empty cell, apply X, set turn to CPU (or keep HUMAN if game over)
- CPU_MOVE: validate turn, apply O via AI, set turn back to HUMAN
- SET_FOCUSED_INDEX: clamp 0..8
- RESET: return createInitialState()

Must implement:
- handleHumanSelect(index) via useCallback → dispatch HUMAN_MOVE
- handleFocusChange(index) via useCallback → dispatch SET_FOCUSED_INDEX
- handleReset() via useCallback → clear timeout + dispatch RESET

CPU scheduling:
- useEffect watching [state.turn, gameState.isOver]
- if turn === CPU && !isOver → setTimeout(dispatch CPU_MOVE, CPU_DELAY_MS)
- store timeout ID in ref; clear on cleanup and reset

Derived state:
- gameState via useMemo → getGameState(state.board)
- status text via useMemo → winner/draw/turn message

Must also manage:
- score state via useState: { X: number, O: number, draws: number }
- useEffect to track game-over transitions and increment score
- score persists across resets (only resets on page refresh)

Return: { board, turn, focusedIndex, gameState, status, score, handleHumanSelect, handleFocusChange, handleReset }

UI + ACCESSIBILITY REQUIREMENTS:
- Board rendered as a 3×3 CSS grid of <button> cells with `role="grid"`
- Each cell:
  - focusable (keyboard reachable via roving tabindex)
  - shows SVG X mark or O mark (no text)
  - uses `aria-disabled` (NOT HTML disabled) when occupied or game over
  - `aria-label` with "Row X, Column Y, empty/X/O"
- Keyboard behavior:
  - ArrowUp/Down/Left/Right AND W/A/S/D moves focusedIndex within grid
  - Clamp at edges (do NOT wrap)
  - Space OR Enter selects the focused cell
  - Implemented via document.addEventListener('keydown') with mutable refs
- Provide visible focus ring for the currently focused cell
- StatusBar uses `aria-live="polite"` and `aria-atomic="true"`

VISUAL REQUIREMENTS:

SVG Marks:
- XMark: two crossing `<line>` elements in `<svg viewBox="0 0 100 100">`
- OMark: one `<circle cx="50" cy="50" r="30">` in `<svg viewBox="0 0 100 100">`
- Both use `className="mark mark-x"` / `className="mark mark-o"` and `aria-hidden="true"`
- CSS animates stroke-dasharray/stroke-dashoffset for draw-on effect

CSS Custom Properties:
- Define all colors, shadows, stroke widths as CSS variables in `:root`
- Override variables inside `@media (prefers-color-scheme: dark)` for dark mode

Animations:
- `@keyframes draw-stroke` for SVG mark draw-on effect
- `@keyframes cell-pop` for cell placement pop-in
- `@keyframes win-pulse` for winning cell pulsing glow
- `@keyframes board-reset` for board clear transition (scale + fade)
- Disable all via `@media (prefers-reduced-motion: reduce)`

Responsive Breakpoints:
- ≤ 374px: Small phones (compact padding)
- 375–599px: Standard phones
- 600–899px: Tablets portrait
- 900–1199px: Tablets landscape / small desktops
- 1200px+: Desktops (generous spacing)
- max-height ≤ 500px landscape: Compact side-by-side layout
- High-DPI: geometricPrecision on SVG strokes
- Print: hide controls, use black/grey marks
- forced-colors: active: use system colors

STYLING REQUIREMENTS:
styles.css:
- Use CSS grid: 3 columns × 3 rows with `aspect-ratio: 1`
- Cell sizing via `clamp()` for fluid responsiveness
- Board has `inset box-shadow` for depth
- Cells have hover scale transform + accent glow
- X color: blue (#4a6cf7 light / #6c8cff dark)
- O color: purple (#9b59b6 light / #c084fc dark)
- Background: gradient (purple-blue light / dark navy dark)

ATOMIC COMPONENT RESPONSIBILITIES:

src/ui/atoms/XMark.jsx
- React.memo
- SVG with two crossing lines, className="mark mark-x", aria-hidden="true"
- CSS handles all animation

src/ui/atoms/OMark.jsx
- React.memo
- SVG with circle, className="mark mark-o", aria-hidden="true"
- CSS handles all animation

src/ui/atoms/CellButton.jsx
- React.forwardRef
- props: value, disabled, isFocused, isWinning, onClick, ariaLabel, tabIndex
- Renders XMark when value==="X", OMark when value==="O"
- apply focus/disabled/token/winning CSS classes (cell-winning)
- Uses aria-disabled (NOT HTML disabled)

src/ui/atoms/GameTitle.jsx
- React.memo
- props: text
- Renders <h1>{text}</h1>

src/ui/atoms/ResetButton.jsx
- React.memo
- props: onClick, label (default "Reset Game")
- Renders styled <button>

src/ui/molecules/BoardGrid.jsx
- props: board, focusedIndex, onFocusChange, onSelect, isGameOver, winLine
- Maps board → 9 CellButtons with refs; passes isWinning based on winLine
- Document-level keydown listener (useEffect, empty deps, mutable refs)
- Syncs DOM focus via useEffect watching focusedIndex
- Detects board reset and applies board-resetting class (300ms fade/scale animation)
- role="grid", aria-label="Tic-Tac-Toe board"

src/ui/molecules/ScoreBoard.jsx
- React.memo
- props: score ({ X: number, O: number, draws: number })
- Displays 3 score items: You (X), Draws, CPU (O) with color-coded values
- aria-label="Score"

src/ui/molecules/StatusBar.jsx
- props: statusText
- role="status", aria-live="polite", aria-atomic="true"

src/ui/molecules/GameControls.jsx
- props: onReset
- Wraps ResetButton in a div.game-controls

src/ui/molecules/Instructions.jsx
- No props (static content)
- Renders how-to-play heading + list

src/ui/organisms/TicTacToeGame.jsx
- Uses useTicTacToe hook
- Renders ONLY: GameTitle, StatusBar, ScoreBoard, BoardGrid, GameControls, Instructions
- Passes winLine to BoardGrid and score to ScoreBoard
- ZERO inline HTML — pure composition of atoms/molecules
- Wrapping container div.game-container is the ONLY raw element

DELIVERABLE OUTPUT FORMAT:
1) Print complete code for every file in the structure above.
2) Each file must include correct imports/exports.
3) Code must run in a standard React JS project (Vite React).
4) No TypeScript.

QUALITY CHECKLIST (MUST PASS):
- Single user: Human is X, CPU is O
- CPU uses smart AI (win → block → center → corner → edge)
- CPU moves automatically after human (unless game over)
- Mouse + keyboard selection both work (arrows + WASD)
- Win/draw detection correct for all 8 lines
- Winning 3 cells highlighted with pulsing glow animation
- Score (wins/losses/draws) tracks across rounds, persists through resets
- Taken cells cannot be overwritten
- Reset clears board, cancels pending CPU timeout, restores initial state
- Board reset triggers fade/scale animation
- Domain logic is pure and not duplicated in UI
- DRY: WIN_LINES and TOKENS defined once
- Organism has ZERO inline HTML beyond container div
- SVG marks animate with draw-on effect
- Pure atoms wrapped in React.memo (XMark, OMark, GameTitle, ResetButton, ScoreBoard)
- Dark mode works automatically via prefers-color-scheme
- Animations disabled when prefers-reduced-motion: reduce
- Responsive across phone → tablet → desktop
- All ARIA attributes present and correct
- Keyboard navigation works via document-level listener (not per-button onKeyDown)
- ESLint + Prettier configured with lint/format npm scripts

BEGIN IMPLEMENTATION NOW.
