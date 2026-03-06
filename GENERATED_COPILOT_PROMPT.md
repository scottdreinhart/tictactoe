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
- Arrow keys move the selection focus around the 3×3 grid.
- Space bar (and/or Enter) selects the currently focused cell.
- Once selected, the cell becomes taken and can no longer be selected by either player.

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

VALID WIN PATTERNS (ASTERISK MEANS “EITHER X OR O”):
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

CPU MOVE LOGIC (PHASED IMPLEMENTATION):
Phase A (baseline correctness — REQUIRED):
- CPU selects a random empty cell after the human move (use availableMoves list).
- CPU does NOT move if winner exists or draw reached after human move.

Phase B (upgrade path — OPTIONAL if time permits):
Replace random with deterministic priority:
1) Win if possible this turn
2) Block X if X could win next turn
3) Take center if available
4) Take a corner if available
5) Else take an edge
Keep CPU logic isolated in /domain as pure functions.

ARCHITECTURE REQUIREMENTS (SOC + CLEAN + ATOMIC + DRY):
Use CLEAN-style layering + Atomic Design:

1) domain/ (PURE — NO React imports)
   - board representation, validation, win/draw evaluation, move generation, AI choice
   - functions are pure/immutable and unit-test friendly
   - NO DOM, NO window usage

2) app/ (React hook orchestrating gameplay)
   - state management: board, turn, winner/draw, focus index
   - CPU scheduling, prevention of double moves, cleanup

3) ui/ (presentational components; no win logic)
   - atoms: small UI primitives
   - molecules: composed UI parts
   - organisms: complete game assembly

DRY RULES (NON-NEGOTIABLE):
- Define TOKENS and WIN_LINES once (domain/constants).
- UI must never re-implement win checking.
- No in-place mutation of board arrays; use immutable updates.

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
    molecules/
      BoardGrid.jsx
      StatusBar.jsx
    organisms/
      TicTacToeGame.jsx
  index.jsx
  styles.css

DOMAIN CONTRACTS:
- board: Array(9) where each value is null | "X" | "O"
- all domain functions deterministic and pure

DOMAIN FILE REQUIREMENTS:

src/domain/constants.js
- export TOKENS = { HUMAN: "X", CPU: "O" }
- export WIN_LINES = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]]
- export BOARD_SIZE = 3

src/domain/board.js
- export createEmptyBoard() => Array(9).fill(null)
- export isCellEmpty(board, idx) => boolean
- export applyMove(board, idx, token) => returns NEW board OR throws on invalid move (pick one and be consistent)

src/domain/rules.js
- export getWinner(board) => "X" | "O" | null
- export isBoardFull(board) => boolean
- export isDraw(board) => boolean
- export getGameState(board) => { winner, isDraw, isOver }
- (optional) export getAvailableMoves(board) => number[]

src/domain/ai.js
Phase A (required):
- export chooseCpuMoveRandom(board) => idx (from empty cells)
Phase B (optional):
- export chooseCpuMoveSmart(board) => idx
- helper: findWinningMove(board, token) => idx | null

HOOK REQUIREMENTS:

src/app/useTicTacToe.js
Must manage:
- board state
- turn state (whose turn: "X" or "O")
- focusedIndex state (0..8) for keyboard navigation
- status state (string) OR derived from game state
- gameOver derived from getGameState(board)

Must implement:
- handleHumanSelect(index):
  - ignore if game over OR not human’s turn
  - ignore if cell not empty
  - apply X move immutably
  - compute game state; if over, stop
  - else schedule CPU move with short delay (150–350ms)
- handleCpuMove():
  - compute CPU index from AI (random is OK)
  - apply O move immutably
  - compute game state; if over, stop
  - set turn back to human

Race-condition avoidance (MUST):
- CPU should never play twice
- CPU should not play after reset
- CPU should not play if human move ends game
Implementation guidance:
- store pending CPU timeout id in a ref; clear on reset/unmount
- re-check gameOver from latest board before CPU applies its move

UI + ACCESSIBILITY REQUIREMENTS:
- Board rendered as a 3×3 grid of <button> cells
- Each cell:
  - focusable (keyboard reachable)
  - shows "X" / "O" / empty
  - disabled if occupied or game over (avoid trapping focus)
- Keyboard behavior:
  - ArrowUp/Down/Left/Right moves focusedIndex within grid (clamp at edges; do NOT wrap unless explicitly documented)
  - Space OR Enter selects the focused cell
- Provide visible focus ring for the currently focused cell
- StatusBar uses aria-live="polite" to announce:
  - “X’s turn”, “O’s turn”, “X wins”, “O wins”, “Draw”

ATOMIC COMPONENT RESPONSIBILITIES:

src/ui/atoms/CellButton.jsx
- Presentational only
- props: value, disabled, isFocused, onClick, ariaLabel, tabIndex
- apply focus style via className when isFocused

src/ui/molecules/BoardGrid.jsx
- Maps board -> 9 CellButtons
- Handles key events (Arrow keys + Space/Enter)
- props: board, focusedIndex, onFocusChange(nextIndex), onSelect(index), isGameOver
- Ensures arrow keys update focus index

src/ui/molecules/StatusBar.jsx
- props: statusText
- includes aria-live

src/ui/organisms/TicTacToeGame.jsx
- Uses useTicTacToe hook
- Renders StatusBar + BoardGrid + Reset button

STYLING REQUIREMENTS:
styles.css:
- Use CSS grid: 3 columns × 3 rows
- Square sizing (80–120px)
- Distinct styling for X vs O (simple is fine)
- Visible focus ring

DELIVERABLE OUTPUT FORMAT:
1) Print complete code for every file in the structure above.
2) Each file must include correct imports/exports.
3) Code must run in a standard React JS project (Vite React).
4) No TypeScript.

QUALITY CHECKLIST (MUST PASS):
- Single user: Human is X, CPU is O
- CPU moves automatically after human (unless game over)
- Mouse + keyboard selection both work
- Win/draw detection correct for all 8 lines
- Taken cells cannot be overwritten
- Reset clears board and cancels any pending CPU move
- Domain logic is pure and not duplicated in UI
- DRY: WIN_LINES defined once

BEGIN IMPLEMENTATION NOW.