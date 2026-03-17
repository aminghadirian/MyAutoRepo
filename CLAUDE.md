# CLAUDE.md — Sudoku Technique Trainer

This file describes the codebase, conventions, and workflows for AI assistants working on this project.

## Project Overview

A self-contained, client-side **Sudoku Technique Trainer** web application. It teaches 8 solving techniques through interactive puzzles with a progressive hint system. No build tools, no framework, no backend — runs directly in the browser.

## File Structure

```
MyAutoRepo/
├── index.html    # HTML structure (70 lines)
├── app.js        # All application logic (419 lines)
└── styles.css    # All styling (45 lines)
```

No package manager, no dependencies, no build step. Open `index.html` directly in a browser.

## Application Architecture

### Data Layer (`app.js` top section)

**Constants:**
- `BOARD` — 81-character string representing the shared puzzle board (`"0"` = empty cell)
- `METHOD_ORDER` — Ordered array of the 8 technique keys (determines curriculum sequence)
- `METHODS` — Object keyed by technique name; each entry has `label`, `level`, `theory`, and `puzzles[]`
- `PROGRESS_KEY` / `SESSION_KEY` — localStorage keys for persistence

**Technique levels (in order):**
| Key | Label | Level |
|---|---|---|
| `nakedSingle` | Naked Single | Foundation |
| `hiddenSingle` | Hidden Single | Foundation |
| `lockedCandidates` | Locked Candidates | Beginner |
| `nakedPair` | Naked Pair | Beginner |
| `hiddenPair` | Hidden Pair | Intermediate |
| `xWing` | X-Wing | Intermediate |
| `xyWing` | XY-Wing | Advanced |
| `swordfish` | Swordfish | Advanced |

**Scenario/puzzle shape** (created via `sc()` helper):
```js
{ name, instruction, board, candidates, targets, explanation }
// candidates: { "r#c#": "digit,digit,...", ... }
// targets:    ["r#c#", ...]  — correct answer cells
```

**Cell key format:** `r#c#` — 1-indexed row/column. Example: `r1c1` through `r9c9`.

### State Variables

```js
let currentMethod  // string key into METHODS
let currentPuzzle  // 0|1|2 (index into method's puzzles array)
let selected       // Set<string> of currently selected cell keys
let hintLevel      // 0–3
let progress       // { [method]: number[] } — completed puzzle indices, persisted
let noteMode       // boolean — pencil mark mode vs digit entry mode
let activeCellKey  // string|null — the last-clicked empty cell
let highlightedDigit // string|null — digit shown with same-digit highlighting
const userMarks    // { [scenarioId]: { [cellKey]: { value: string, notes: string[] } } }
```

### Rendering Model

Full UI re-render on every state change — no incremental/virtual DOM. Key render functions:

- `render()` — Top-level: updates text nodes, calls `renderBoard()` + `renderCurriculum()`, saves session
- `renderBoard()` — Clears and rebuilds all 81 cell `<button>` elements
- `renderCurriculum()` — Updates progress bar, mastery pill, and curriculum list

### Persistence

Two localStorage keys:
- `sudoku-method-3examples-v1` — progress (which puzzles are completed per method)
- `sudoku-method-session-v2` — session (last active method, puzzle index, noteMode)

### Hint System

Four levels (0–3), incremental:
1. **Level 0** — No hint
2. **Level 1** — Irrelevant cells grayed out (`.irrelevant` class)
3. **Level 2** — Scenario candidate notes shown on relevant cells (`.hint-candidates` class)
4. **Level 3** — One key target cell highlighted (`.target` class, only `targets[0]`)

### Check Logic

`checkSelection()` compares sorted `[...selected]` against sorted `scn.targets`. Exact match required. On success, records puzzle index in `progress[currentMethod]` and saves.

## Styling Conventions (`styles.css`)

- **CSS custom properties** defined in `:root` for all colors: `--bg`, `--panel`, `--text`, `--accent`, `--muted`, `--ok`, `--bad`
- **Minified single-line rules** — the entire file is intentionally compact; keep additions in this style
- **Mobile-first** — single-column layout by default, 3-column actions row at `@media (min-width: 720px)`
- **Board grid** — 9×9 CSS grid with thick borders every 3 cells using `:nth-child(3n)` and `[data-row="2"]`/`[data-row="5"]`
- **Cell states** (CSS classes): `.given`, `.selected`, `.active`, `.target`, `.irrelevant`, `.same-digit`

## HTML Conventions (`index.html`)

- Semantic structure: `<main>`, `<header>`, `<section>`, `<details>`/`<summary>`
- All interactive elements are `<button type="button">` except the primary check action
- IDs match exactly what `app.js` queries via `document.getElementById()`
- Script loaded at end of `<body>` (no defer/async needed)

## Development Workflow

Since there is no build step:

1. Edit files directly
2. Open/refresh `index.html` in a browser to test
3. Use browser DevTools console to debug
4. Clear localStorage via DevTools if testing fresh state: `localStorage.clear()`

**No linter, formatter, or test runner is configured.** Follow existing code style manually (see conventions below).

## Code Conventions

### JavaScript
- **`camelCase`** for variables and functions
- **`SCREAMING_SNAKE_CASE`** for module-level constants
- **Functional style** — no classes, no OOP patterns
- **`const`** for everything that doesn't need reassignment; `let` for mutable state
- Arrow functions for short helpers and event listeners; `function` declarations for named top-level functions
- DOM queries via `document.getElementById()` stored in `const` at module top; never re-query the DOM
- Immutable Set updates: create new Set or mutate then spread (e.g., `[...set].sort()`)
- Error-safe localStorage access: always wrap in `try/catch` with a fallback

### Adding a New Technique

1. Add key to `METHOD_ORDER` array
2. Add entry to `METHODS` object with `label`, `level`, `theory`, and exactly 3 `puzzles` using `sc()`
3. No other changes needed — the UI auto-generates dropdowns, curriculum entries, and progress tracking

### Adding a New Puzzle to an Existing Technique

Replace or add to the `puzzles` array for that method. Each puzzle uses `sc(name, instruction, candidates, targets, explanation)`:
- `candidates` — object mapping cell keys (`r#c#`) to comma-separated candidate strings shown at hint level 2
- `targets` — array of cell keys the user must select; order matters for hint level 3 (first = highlighted)
- `explanation` — text shown after correct answer

### Modifying the Hint System

The hint levels are stepped in `onHint()` (capped at 3). Visual rendering of hints is entirely in `renderBoard()`. `hintLevel` is reset to 0 in `resetRound()` whenever the method or puzzle changes.

## Git Branch

Active development branch: `claude/add-claude-documentation-jHvaB`

Remote: `origin` → `http://local_proxy@127.0.0.1:39729/git/aminghadirian/MyAutoRepo`

Push with: `git push -u origin claude/add-claude-documentation-jHvaB`

## Key IDs Referenced in `app.js`

| ID | Element | Purpose |
|---|---|---|
| `methodSelect` | `<select>` | Technique picker |
| `methodTheory` | `<p>` | Theory text for current method |
| `curriculumPreview` | `<span>` | Collapsed curriculum summary |
| `curriculumList` | `<ul>` | Expanded curriculum list |
| `masteryPill` | `<span>` | Overall mastery percentage |
| `masteryFill` | `<div>` | Progress bar fill |
| `board` | `<div>` | 9×9 cell grid |
| `scenarioTitle` | `<h2>` | Puzzle title |
| `progressPill` | `<span>` | Puzzle index (e.g., 1/3) |
| `instruction` | `<p>` | Per-puzzle instruction text |
| `feedback` | `<p>` | Check result / hint message |
| `selectedCells` | `<p>` | Currently selected cell keys |
| `hintLevel` | `<p>` | Current hint level label |
| `explanation` | `<p>` | Post-solve explanation |
| `noteModeBtn` | `<button>` | Toggle pencil/note mode |
| `clearCellBtn` | `<button>` | Clear active cell marks |
| `digitPad` | `<div>` | Container for digit 1–9 buttons |
| `checkBtn` | `<button>` | Submit selection for checking |
| `hintBtn` | `<button>` | Advance hint level |
| `nextBtn` | `<button>` | Advance to next puzzle |
