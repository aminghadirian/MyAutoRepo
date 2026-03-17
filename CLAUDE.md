# CLAUDE.md — Sudoku Technique Trainer

This file describes the codebase, conventions, and workflows for AI assistants working on this project.

## Project Overview

A self-contained, client-side **Sudoku Technique Trainer** web application. It teaches 8 solving techniques through interactive puzzles with a progressive hint system. No backend — runs directly in the browser. Tooling (ESLint, Jest) is available for linting and unit-testing pure functions.

## File Structure

```
MyAutoRepo/
├── index.html          # HTML structure
├── app.js              # All application logic (ES module)
├── data.js             # Static data, pure utilities — imported by app.js and tests
├── styles.css          # All styling (dark-mode aware, compact single-file)
├── eslint.config.js    # ESLint 9 flat config
├── package.json        # Dev tooling only (ESLint, Jest) — no runtime deps
├── .gitignore
└── tests/
    └── unit.test.js    # Jest unit tests for pure functions in data.js
```

Open `index.html` in a browser to run the app — no build step required.

## Running Tooling

```bash
npm install          # install ESLint + Jest (dev deps only)
npm run lint         # lint app.js and data.js
npm test             # run Jest tests (uses --experimental-vm-modules for ESM)
```

## Application Architecture

### Module split

| File | Responsibility |
|---|---|
| `data.js` | Boards, techniques, `parseCellKey`, `sc()`, storage key constants |
| `app.js` | DOM refs, state, rendering, event wiring — imports from `data.js` |

Both files are ES modules (`type="module"` in `<script>`). Strict mode is implicit.

### Boards (`data.js`)

Four different Sudoku boards are assigned by difficulty tier so each technique group uses a distinct visual backdrop:

| Key | Used by |
|---|---|
| `A` | Foundation: Naked Single, Hidden Single |
| `B` | Beginner: Locked Candidates, Naked Pair |
| `C` | Intermediate: Hidden Pair, X-Wing |
| `D` | Advanced: XY-Wing, Swordfish |

### Techniques (`data.js`)

```
METHOD_ORDER = [ nakedSingle, hiddenSingle, lockedCandidates, nakedPair,
                 hiddenPair, xWing, xyWing, swordfish ]
```

Each entry in `METHODS` has: `label`, `level`, `theory`, `puzzles[]`.

**Scenario shape** (created via `sc()` helper):
```js
{ name, instruction, board, candidates, targets, explanation }
// candidates: { "r#c#": "digit,digit,..." }  — shown at hint level 2
// targets:    ["r#c#", ...]                  — correct answer cells; [0] highlighted at hint 3
```

**Cell key format:** `r#c#` — 1-indexed. Example: `r1c1` through `r9c9`.
`parseCellKey("r3c7")` → `{ row: 2, col: 6 }` (0-indexed).

### Centralised state (`app.js`)

All mutable state lives in one `state` object:

```js
const state = {
  currentMethod,    // string key into METHODS
  currentPuzzle,    // 0 | 1 | 2
  selected,         // Set<string> of selected cell keys
  hintLevel,        // 0–3
  noteMode,         // boolean — pencil marks vs digit entry
  activeCellKey,    // string | null — last-clicked empty cell
  highlightedDigit, // string | null — same-digit highlight
  progress,         // { [method]: number[] } — completed puzzle indices
  darkMode,         // boolean
};
```

**Pencil marks** live in `userMarks` (separate from `state` because it's keyed by scenario):
```js
userMarks[scenarioId()][cellKey] = { value: string, notes: string[] }
```

### Persistence (localStorage)

| Key | Content |
|---|---|
| `sudoku-method-3examples-v1` | progress per method |
| `sudoku-method-session-v2` | currentMethod, currentPuzzle, noteMode |
| `sudoku-method-marks-v1` | all userMarks (pencil marks now survive refresh) |
| `sudoku-theme-v1` | `"dark"` or `"light"` |

### Rendering model

Full re-render on every state change — no virtual DOM.

- `render()` — top-level: updates all text, calls `renderBoard()`, `renderCurriculum()`, `renderDigitPad()`
- `renderBoard()` — clears and rebuilds all 81 cell `<button>` elements; restores focus to active cell
- `renderCurriculum()` — progress bar + curriculum list
- `renderDigitPad(boardStr)` — dims digit buttons for digits that appear as givens

### Hint system

| Level | Effect |
|---|---|
| 0 | No hint |
| 1 | Irrelevant cells grayed (`.irrelevant`) |
| 2 | Scenario candidates shown on relevant cells (`.hint-candidates`) |
| 3 | First target cell highlighted (`.target`) |

Reset to 0 in `resetRound()` on method/puzzle change.

### Undo / Redo

Per-scenario stacks (`undoStack[scenarioId()]`, `redoStack[scenarioId()]`).
`pushUndo()` snapshots current marks before any mutation. Undo/redo also available via `Ctrl/Cmd+Z` / `Ctrl/Cmd+Shift+Z`.

### Timer

`puzzleStartTime` (ms epoch) set at puzzle start; `setInterval` updates `#timerDisplay` every second.
Timer stops (`stopTimer()`) on correct answer; restarts on method/puzzle change.

### Dark mode

Toggle sets `data-theme="dark"` on `<html>`. CSS custom properties in `:root` are overridden by `[data-theme="dark"]` selector. Preference persisted in `THEME_KEY`.

### Keyboard navigation

| Key | Action |
|---|---|
| Arrow keys | Move between cells (Shift+Arrow extends selection) |
| 1–9 | Fill active cell |
| Backspace / Delete | Clear active cell |
| Ctrl/Cmd+Z | Undo |
| Ctrl/Cmd+Shift+Z / Ctrl/Cmd+Y | Redo |

## Styling Conventions (`styles.css`)

- **Compact single-file** — intentionally minified; keep additions in this style
- **CSS custom properties** in `:root` + `[data-theme="dark"]` overrides
- **Mobile-first** — single-column layout; 3-column actions at `@media (min-width: 720px)`
- **Board grid** — 9×9 CSS grid; thick borders every 3 cells via `:nth-child(3n)` and `[data-row="2"/"5"]`
- **Minimum tap target** — `.cell` has `min-height: 36px; min-width: 36px; touch-action: manipulation`
- **Cell state classes:** `.given`, `.selected`, `.active`, `.target`, `.irrelevant`, `.same-digit`
- **Digit pad:** `.digit-given` dims buttons for digits already present as givens in the board

## HTML Conventions (`index.html`)

- Semantic: `<main>`, `<header>`, `<section>`, `<details>`/`<summary>`
- All buttons have explicit `type="button"` except where form submission is intended
- IDs match exactly what `app.js` queries via `getElementById()`
- Completion overlay uses `hidden` attribute; toggled in JS via `.hidden`
- Script loaded as `<script type="module" src="app.js">` at end of `<body>`

## Development Workflow

1. Edit files directly
2. Open/refresh `index.html` in a browser to test
3. Use browser DevTools console to debug
4. Reset state: DevTools → Application → Storage → `localStorage.clear()`
5. Run `npm test` to verify data integrity and pure function correctness
6. Run `npm run lint` before committing

## Code Conventions

### JavaScript
- **`camelCase`** for variables and functions; **`SCREAMING_SNAKE_CASE`** for module-level constants
- **`const`** by default; `let` only for values that are reassigned; no `var`
- **Functional style** — no classes, no OOP patterns
- Arrow functions for short helpers and listeners; `function` declarations for named top-level functions
- DOM references stored as `const` at module top — never re-query the DOM mid-function
- localStorage access always wrapped in `try/catch` with a validated fallback
- ES module `import`/`export` — no CommonJS

### Adding a New Technique

1. Choose an appropriate board from `BOARDS` (or add a new entry)
2. Add key to `METHOD_ORDER` in `data.js`
3. Add entry to `METHODS` with `label`, `level`, `theory`, and exactly 3 `puzzles` using `sc()`
4. The UI auto-generates the dropdown, curriculum entry, and progress tracking

### Adding a New Puzzle to an Existing Technique

Replace or add to the `puzzles` array. `sc(name, instruction, board, candidates, targets, explanation)`:
- `board` — 81-char board string from `BOARDS`
- `candidates` — `{ "r#c#": "digit,digit,..." }` shown at hint level 2
- `targets` — `["r#c#", ...]`; first entry is highlighted at hint level 3
- `explanation` — shown after correct answer

## Key DOM IDs

| ID | Element | Purpose |
|---|---|---|
| `methodSelect` | `<select>` | Technique picker |
| `methodTheory` | `<p>` | Theory text |
| `curriculumPreview` | `<span>` | Collapsed curriculum summary |
| `curriculumList` | `<ul>` | Expanded curriculum list |
| `masteryPill` | `<span>` | Overall mastery percentage |
| `masteryFill` | `<div>` | Progress bar fill |
| `board` | `<div>` | 9×9 cell grid |
| `scenarioTitle` | `<h2>` | Puzzle title |
| `progressPill` | `<span>` | Puzzle index (1/3) |
| `timerDisplay` | `<span>` | Elapsed time (MM:SS) |
| `instruction` | `<p>` | Per-puzzle instruction |
| `feedback` | `<p>` | Check result / hint message |
| `selectedCells` | `<p>` | Selected cell keys |
| `hintLevel` | `<p>` | Current hint level label |
| `explanation` | `<p>` | Post-solve explanation |
| `noteModeBtn` | `<button>` | Toggle pencil/note mode |
| `clearCellBtn` | `<button>` | Clear active cell |
| `undoBtn` | `<button>` | Undo last mark |
| `redoBtn` | `<button>` | Redo last undone mark |
| `digitPad` | `<div>` | Container for digit 1–9 buttons |
| `checkBtn` | `<button>` | Submit selection |
| `hintBtn` | `<button>` | Advance hint level |
| `nextBtn` | `<button>` | Next puzzle |
| `darkModeBtn` | `<button>` | Toggle dark/light theme |
| `resetBtn` | `<button>` | Reset all progress |
| `completionOverlay` | `<div>` | Full-screen completion modal |
| `closeCompletionBtn` | `<button>` | Dismiss completion overlay |
