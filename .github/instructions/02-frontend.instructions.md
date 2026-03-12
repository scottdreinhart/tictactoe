# Frontend Instructions — React / Vite / UI

> **Scope**: Frontend stack, CLEAN architecture layers, component hierarchy, styling, testing, linting, formatting, and type checking.
> Subordinate to `AGENTS.md` §3 (architecture) and §4 (path discipline).

---

## Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI library (hooks, memo, lazy, context) |
| TypeScript | 5.9 | Static type checking (strict mode) |
| Vite | 7 | Build tool + dev server |
| Vitest | 4 | Unit testing framework |
| ESLint | 10 | Linting (flat config + `react`, `react-hooks`, `boundaries`, `jsx-a11y`, `simple-import-sort`, `prettier`) |
| Prettier | 3 | Code formatting |
| CSS Modules | — | Scoped component styling |

---

## Architecture — CLEAN Layers

| Layer | Path | May Import | Must Not Import |
|---|---|---|---|
| **Domain** | `src/domain/` | `domain/` only | `app/`, `ui/`, React, any framework |
| **App** | `src/app/` | `domain/`, `app/` | `ui/` |
| **UI** | `src/ui/` | `domain/`, `app/`, `ui/` | — |
| **Workers** | `src/workers/` | `domain/` only | `app/`, `ui/`, React |
| **Themes** | `src/themes/` | nothing (pure CSS) | everything |

Boundaries are enforced at lint time by `eslint-plugin-boundaries` (see `eslint.config.js`).

### Domain Layer (`src/domain/`)

- Pure, framework-agnostic game logic. Zero React dependencies.
- Files: `types.ts`, `constants.ts`, `board.ts`, `rules.ts`, `ai.ts`, `themes.ts`, `layers.ts`, `sprites.ts`.
- Co-located tests: `ai.test.ts`, `board.test.ts`, `constants.test.ts`, `rules.test.ts`.
- All exported through barrel `src/domain/index.ts`.

### App Layer (`src/app/`)

- React hooks, context providers, and services.
- Core hooks: `useTheme.ts`, `useSoundEffects.ts`, `useTicTacToe.ts`, `useGameBoard.ts`, `useCpuPlayer.ts`, `useGameOrchestration.ts`, `useGameStats.ts`, `useSeries.ts`.
- Utility hooks: `useAutoReset.ts`, `useCoinFlipAnimation.ts`, `useDropdownBehavior.ts`, `useGridKeyboard.ts`, `useKeyboardShortcuts.ts`, `useNotificationQueue.ts`, `usePrevious.ts`, `useSmartPosition.ts`, `useSwipeGesture.ts`, `useWebWorker.ts`.
- Services: `aiEngine.ts`, `haptics.ts`, `sounds.ts`, `storageService.ts`.
- Context providers: `ThemeContext.tsx`, `SoundContext.tsx`.

### UI Layer (`src/ui/`)

- Presentational React components following Atomic Design.
- `atoms/` → smallest reusable primitives (CellButton, ConfettiOverlay, DifficultyToggle, ErrorBoundary, GameOutcomeOverlay, NotificationBanner, OMark, SeriesSelector, SoundToggle, WinLine, XMark).
- `molecules/` → composed atom groups (BoardGrid, CoinFlip, HamburgerMenu, Instructions, MoveTimeline, Scoreboard, ThemeSelector).
- `organisms/` → full feature components (TicTacToeGame).
- `utils/` → UI utilities (e.g., `cssModules.ts` for `cx()` class binding).

---

## Component Hierarchy (Atomic Design)

```
atoms/ → molecules/ → organisms/
```

- Data flows unidirectionally: **Hooks → Organism → Molecules → Atoms**.
- Organisms contain zero inline markup; all composition happens in JSX.
- Components are predictable, composable, and reusable across contexts.

---

## Import Conventions

- **Path aliases**: `@/domain/...`, `@/app/...`, `@/ui/...` (configured in `tsconfig.json` paths + `vite.config.js` resolve.alias).
- **Barrel imports**: Always import from `index.ts`, never from internal module files.
- **No cross-layer relative imports**: Never use `../../` to cross layer boundaries.

```typescript
// ✅ Correct
import { createBoard, checkGameResult } from '@/domain';
import { useTheme } from '@/app';

// ❌ Wrong — cross-layer relative import
import { createBoard } from '../../domain/board';
```

---

## Entry Point

`src/index.tsx` wires the provider tree:

```
ThemeProvider > SoundProvider > ErrorBoundary > App
```

- `ThemeProvider` — theme state via React Context.
- `SoundProvider` — sound state + guarded play functions via React Context.
- `ErrorBoundary` — crash isolation with themed fallback UI + retry button.

---

## Styling

- Global styles and CSS custom properties in `src/styles.css`.
- Theme files in `src/themes/` — lazy-loaded CSS chunks (pure data, no imports).
- Component-scoped styles via CSS Modules (`.module.css` files co-located with components).
- UI layout constants in `src/ui/ui-constants.ts`.

---

## Testing

- **Vitest** for unit tests with **@testing-library/react** and **jsdom**.
- Domain tests are co-located: `src/domain/*.test.ts`.
- Test setup: `src/__tests__/setup.ts`.
- Coverage via `@vitest/coverage-v8` → `coverage/` directory.

```bash
pnpm test              # Run tests
pnpm test:watch        # Watch mode
pnpm test:ci           # CI mode with coverage
pnpm test:coverage     # Generate coverage report
```

---

## Quality Workflow

All commands run in **Bash (WSL: Ubuntu)** (default shell).

```bash
pnpm lint           # ESLint check
pnpm lint:fix       # ESLint auto-fix
pnpm format         # Prettier format
pnpm format:check   # Prettier check (no write)
pnpm typecheck      # tsc --noEmit
pnpm check          # lint + format:check + typecheck (quality gate)
pnpm fix            # lint:fix + format (auto-fix everything)
pnpm validate       # check + build (full pre-push validation)
```

Run `pnpm validate` before pushing.

---

## Language Guardrails

Frontend code uses **TypeScript** for logic and **CSS** for styling.

Do not introduce orphaned helper scripts or alternate runtimes.
Do not create Python, Bash, PowerShell, Ruby, Go, Rust, Java, C#, or other side-language utilities.
Prefer existing `package.json` scripts and repository-native tooling (Vite, ESLint, Prettier, Vitest).
Modern ESM syntax; match existing code conventions.
