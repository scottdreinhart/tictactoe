# Tic-Tac-Toe: Human vs CPU

A clean, modular React Tic-Tac-Toe game with keyboard and mouse controls, built with **Separation of Concerns** and **Atomic Design**.

## Project Structure

```
src/
├── domain/                  # Pure, framework-agnostic logic
│   ├── constants.js         # TOKENS, WIN_LINES, BOARD_SIZE
│   ├── board.js             # Board operations (create, apply move, get empty cells)
│   ├── rules.js             # Win/draw detection
│   └── ai.js                # CPU move selection (Phase A: random)
├── app/
│   └── useTicTacToe.js      # Game state management hook
├── ui/
│   ├── atoms/
│   │   └── CellButton.jsx   # Single cell button
│   ├── molecules/
│   │   ├── BoardGrid.jsx    # 3x3 grid with keyboard navigation
│   │   └── StatusBar.jsx    # Game status display
│   └── organisms/
│       └── TicTacToeGame.jsx # Main game component
├── index.jsx                # React entry point
└── styles.css               # Styling

index.html                  # HTML entry point
package.json                # Dependencies
vite.config.js             # Vite configuration
```

## Features

### Game Logic
- **Human (X) vs CPU (O)**: Human plays first
- **Board Representation**: 9-cell array with immutable updates
- **Win Detection**: All 8 winning lines checked (3 rows, 3 columns, 2 diagonals)
- **Draw Detection**: Board full + no winner = draw
- **CPU Move**: Phase A uses random selection from empty cells

### Controls
- **Mouse**: Click any empty cell to move
- **Keyboard**: 
  - **Arrow Keys** or **WASD**: Navigate (↑/W up, ↓/S down, ←/A left, →/D right)
  - **Space** or **Enter**: Select focused cell
  - Visible focus ring for accessibility

### Accessibility
- ARIA labels on all cells
- Status bar uses `aria-live="polite"` for screen reader updates
- Keyboard navigation with proper tabindex management
- Clear visual focus indicators

### Architecture
- **Separation of Concerns**: Domain logic completely separate from React
- **Pure Functions**: All domain logic is immutable and deterministic
- **Atomic Design**: Components broken into atoms (CellButton) → molecules (BoardGrid, StatusBar) → organisms (TicTacToeGame)
- **DRY**: Single source of truth for constants (TOKENS, WIN_LINES)
- **No Race Conditions**: CPU timeout properly managed and cancelled on reset/unmount

## Installation & Running

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The app will be available at `http://localhost:5173`

## Game Flow

1. **Human's Turn**: Click a cell or use keyboard to select
2. **Board Update**: Cell is marked with X, game checks for win/draw
3. **CPU's Turn**: After 200ms delay, CPU automatically selects a random empty cell
4. **Game End**: When someone wins or board is full
5. **Reset**: Click "Reset Game" to start over

## Domain Layer API

All domain functions are pure and tested independently:

```javascript
// Board operations
createEmptyBoard()
isCellEmpty(board, idx)
applyMove(board, idx, token)
getEmptyCells(board)

// Game rules
getWinner(board)
isBoardFull(board)
isDraw(board)
getGameState(board)

// AI
chooseCpuMoveRandom(board)
chooseCpuMoveSmart(board, cpuToken, humanToken) // Phase B available
```

## Phase B Upgrade

To enable smarter AI, replace `chooseCpuMoveRandom` with `chooseCpuMoveSmart` in `useTicTacToe.js`:

```javascript
// Current (Phase A - random)
const cpuMoveIdx = chooseCpuMoveRandom(state.board)

// Upgrade to Phase B (smart)
const cpuMoveIdx = chooseCpuMoveSmart(state.board, TOKENS.CPU, TOKENS.HUMAN)
```

Smart AI priority:
1. Win if possible
2. Block human from winning
3. Take center
4. Take corner
5. Take edge

## Technical Highlights

- **React 18** with Hooks (useReducer for state management)
- **Vite** for fast development and builds
- **CSS Grid** for responsive board layout
- **Zero TypeScript**: Pure JavaScript for simplicity
- **No external game libraries**: All logic built from scratch

## Accessibility Compliance

- ✅ WCAG 2.1 AA focus indicators
- ✅ Semantic HTML (buttons, roles)
- ✅ ARIA live regions for status updates
- ✅ Keyboard-only playable
- ✅ Clear, descriptive labels

## Future Enhancements

- Add score tracking across multiple games
- Implement difficulty levels (easy/hard AI)
- Add animation feedback for moves
- Dark mode theme
- Multiplayer support
