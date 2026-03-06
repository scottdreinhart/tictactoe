You are a senior React + JavaScript engineer. Generate a prompt that is in clean well structured markdown that does the following:

Build a single-player Tic Tac Toe game in React using JavaScript and functional components.

Requirements:
Human plays "X" and the computer plays "O".  
The human always goes first.

The board is a 3x3 grid (9 cells). Represent it as an array of 9 values: null | "X" | "O".

Empty board example:
***
***
***

Each cell must support:
• mouse click selection
• keyboard navigation (arrow keys move focus)
• space/enter selects the focused cell

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
1. Human clicks/selects a cell -> place "X"
2. Check win/draw
3. If game not over -> CPU places "O"
4. CPU move happens automatically once per human move

CPU logic (basic version):
Choose a random empty cell from the available moves.

Architecture expectations:
Use good React architecture and keep code modular.

• Separate game logic from UI (Separation of Concerns)
• Use pure helper functions for board logic (winner detection, available moves, etc.)
• Follow CLEAN and DRY principles
• Avoid putting all logic in one component

Suggested structure:
Game container component
Board component (renders 3x3 grid)
Cell/Square component
Game logic helpers

UI requirements:
Display current game status above the board:
"X's turn"
"O's turn"
"X wins"
"O wins"
"Draw"

Include a Reset button to restart the game.
Use CSS grid or flexbox to render the 3x3 board.

Ensure:
• cells cannot be overwritten
• CPU never moves after game end
• CPU only moves once per human move
• reset clears board and state