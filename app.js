// app.js — Sudoku Technique Trainer: application logic
// ES modules are always in strict mode — no "use strict" directive needed.

import {
  METHOD_ORDER, METHODS,
  PROGRESS_KEY, SESSION_KEY, MARKS_KEY, THEME_KEY,
  parseCellKey,
} from "./data.js";

// ── DOM refs ──────────────────────────────────────────────────────────────────
const $ = (id) => document.getElementById(id);
const methodSelect      = $("methodSelect");
const methodTheory      = $("methodTheory");
const curriculumPreview = $("curriculumPreview");
const curriculumList    = $("curriculumList");
const masteryPill       = $("masteryPill");
const masteryFill       = $("masteryFill");
const boardEl           = $("board");
const scenarioTitle     = $("scenarioTitle");
const progressPill      = $("progressPill");
const instructionEl     = $("instruction");
const feedbackEl        = $("feedback");
const selectedCellsEl   = $("selectedCells");
const hintLevelEl       = $("hintLevel");
const explanationEl     = $("explanation");
const noteModeBtn       = $("noteModeBtn");
const clearCellBtn      = $("clearCellBtn");
const digitPad          = $("digitPad");
const timerEl           = $("timerDisplay");
const darkModeBtn       = $("darkModeBtn");
const resetBtn          = $("resetBtn");
const undoBtn           = $("undoBtn");
const redoBtn           = $("redoBtn");
const completionOverlay = $("completionOverlay");

// ── Centralised state ─────────────────────────────────────────────────────────
const state = {
  currentMethod:    METHOD_ORDER[0],
  currentPuzzle:    0,
  selected:         new Set(),
  hintLevel:        0,
  noteMode:         false,
  activeCellKey:    null,
  highlightedDigit: null,
  progress:         loadProgress(),
  darkMode:         localStorage.getItem(THEME_KEY) === "dark",
};

// Persisted pencil marks — { [scenarioId]: { [cellKey]: { value, notes[] } } }
const userMarks = loadMarks();

// Undo / redo stacks per scenario
const undoStack = {};
const redoStack = {};

// ── Timer state ───────────────────────────────────────────────────────────────
let timerInterval  = null;
let puzzleStartTime = null;

// ── Pure helpers ──────────────────────────────────────────────────────────────
function scenarioId() {
  return `${state.currentMethod}-${state.currentPuzzle}`;
}

function currentScenario() {
  return METHODS[state.currentMethod].puzzles[state.currentPuzzle];
}

function methodDone(method) {
  return state.progress[method].length >= 3;
}

function allDone() {
  return METHOD_ORDER.every(methodDone);
}

function marksForScenario() {
  const id = scenarioId();
  if (!userMarks[id]) userMarks[id] = {};
  return userMarks[id];
}

// ── Persistence ───────────────────────────────────────────────────────────────
function loadProgress() {
  const fallback = Object.fromEntries(METHOD_ORDER.map((m) => [m, []]));
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return fallback;
    METHOD_ORDER.forEach((m) => {
      if (!Array.isArray(parsed[m])) {
        parsed[m] = [];
      } else {
        // Reject out-of-range or non-numeric entries
        parsed[m] = parsed[m].filter((v) => typeof v === "number" && v >= 0 && v <= 2);
      }
    });
    return parsed;
  } catch {
    return fallback;
  }
}

function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return null;
    if (!METHOD_ORDER.includes(parsed.currentMethod)) return null;
    const maxPuzzle = METHODS[parsed.currentMethod].puzzles.length - 1;
    return {
      currentMethod: parsed.currentMethod,
      currentPuzzle: Math.min(Math.max(Number(parsed.currentPuzzle) || 0, 0), maxPuzzle),
      noteMode:      Boolean(parsed.noteMode),
    };
  } catch {
    return null;
  }
}

function loadMarks() {
  try {
    const raw = localStorage.getItem(MARKS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return (typeof parsed === "object" && parsed !== null) ? parsed : {};
  } catch {
    return {};
  }
}

function saveProgress() { localStorage.setItem(PROGRESS_KEY, JSON.stringify(state.progress)); }
function saveSession()  {
  localStorage.setItem(SESSION_KEY, JSON.stringify({
    currentMethod: state.currentMethod,
    currentPuzzle: state.currentPuzzle,
    noteMode:      state.noteMode,
  }));
}
function saveMarks()    { localStorage.setItem(MARKS_KEY, JSON.stringify(userMarks)); }
function saveTheme()    { localStorage.setItem(THEME_KEY, state.darkMode ? "dark" : "light"); }

// ── Undo / Redo ───────────────────────────────────────────────────────────────
function snapshotMarks() {
  return JSON.parse(JSON.stringify(userMarks[scenarioId()] || {}));
}

function pushUndo() {
  const id = scenarioId();
  if (!undoStack[id]) undoStack[id] = [];
  if (!redoStack[id]) redoStack[id] = [];
  undoStack[id].push(snapshotMarks());
  redoStack[id] = []; // new action clears redo history
}

function undo() {
  const id = scenarioId();
  if (!undoStack[id] || !undoStack[id].length) return;
  if (!redoStack[id]) redoStack[id] = [];
  redoStack[id].push(snapshotMarks());
  userMarks[id] = undoStack[id].pop();
  saveMarks();
  renderBoard();
  updateUndoRedoBtns();
}

function redo() {
  const id = scenarioId();
  if (!redoStack[id] || !redoStack[id].length) return;
  if (!undoStack[id]) undoStack[id] = [];
  undoStack[id].push(snapshotMarks());
  userMarks[id] = redoStack[id].pop();
  saveMarks();
  renderBoard();
  updateUndoRedoBtns();
}

function updateUndoRedoBtns() {
  const id = scenarioId();
  undoBtn.disabled = !(undoStack[id] && undoStack[id].length);
  redoBtn.disabled = !(redoStack[id] && redoStack[id].length);
}

// ── Timer ─────────────────────────────────────────────────────────────────────
function startTimer() {
  stopTimer();
  puzzleStartTime = Date.now();
  timerInterval = setInterval(updateTimerDisplay, 1000);
  updateTimerDisplay();
}

function stopTimer() {
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
}

function updateTimerDisplay() {
  if (!puzzleStartTime) return;
  const elapsed = Math.floor((Date.now() - puzzleStartTime) / 1000);
  const m = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const s = String(elapsed % 60).padStart(2, "0");
  timerEl.textContent = `${m}:${s}`;
}

// ── Dark mode ─────────────────────────────────────────────────────────────────
function applyTheme() {
  document.documentElement.setAttribute("data-theme", state.darkMode ? "dark" : "light");
  darkModeBtn.textContent = state.darkMode ? "Light Mode" : "Dark Mode";
}

// ── Rendering ─────────────────────────────────────────────────────────────────
function collapsedPreview() {
  const i = METHOD_ORDER.indexOf(state.currentMethod);
  const parts = [METHOD_ORDER[i], METHOD_ORDER[i + 1], METHOD_ORDER[i + 2]]
    .filter(Boolean)
    .map((k) => METHODS[k].label);
  return `${parts.join(" · ")} ${i + 3 < METHOD_ORDER.length ? "..." : ""}`.trim();
}

function renderCurriculum() {
  const doneCount = METHOD_ORDER.filter(methodDone).length;
  masteryPill.textContent = `${Math.round((doneCount / METHOD_ORDER.length) * 100)}%`;
  masteryFill.style.width  = `${(doneCount / METHOD_ORDER.length) * 100}%`;
  curriculumPreview.textContent = collapsedPreview();
  curriculumList.innerHTML = "";
  METHOD_ORDER.forEach((method) => {
    const li = document.createElement("li");
    li.textContent = `${METHODS[method].level}: ${METHODS[method].label} — ${state.progress[method].length}/3`;
    li.classList.toggle("active", method === state.currentMethod);
    li.classList.toggle("done",   methodDone(method));
    curriculumList.append(li);
  });
}

function renderDigitPad(boardStr) {
  // Dim digit-pad buttons for digits that appear as givens in the current board.
  const givenDigits = new Set(boardStr.split("").filter((v) => v !== "0"));
  [...digitPad.children].forEach((btn) => {
    btn.classList.toggle("digit-given", givenDigits.has(btn.textContent));
  });
}

function renderBoard() {
  const scn      = currentScenario();
  const relevant = new Set([...Object.keys(scn.candidates), ...scn.targets]);
  const marks    = marksForScenario();
  boardEl.innerHTML = "";

  scn.board.split("").forEach((v, idx) => {
    const row  = Math.floor(idx / 9);
    const col  = idx % 9;
    const key  = `r${row + 1}c${col + 1}`;
    const cell = document.createElement("button");
    cell.className    = "cell";
    cell.dataset.key  = key;
    cell.dataset.row  = String(row);
    cell.type         = "button";

    if (v !== "0") {
      // Given (pre-filled) cell
      cell.classList.add("given");
      cell.textContent = v;
      cell.setAttribute("aria-label", `Row ${row + 1} column ${col + 1}, given ${v}`);
      if (state.highlightedDigit === v) cell.classList.add("same-digit");
      cell.addEventListener("click", () => {
        state.highlightedDigit = state.highlightedDigit === v ? null : v;
        renderBoard();
      });
    } else {
      // Empty cell — user-interactive
      const mark     = marks[key] || { value: "", notes: [] };
      const hasValue = Boolean(mark.value);

      if (state.hintLevel >= 1 && !relevant.has(key))         cell.classList.add("irrelevant");
      if (state.selected.has(key))                             cell.classList.add("selected");
      if (state.activeCellKey === key)                         cell.classList.add("active");
      if (state.hintLevel >= 3 && scn.targets[0] === key)     cell.classList.add("target");
      if (hasValue && state.highlightedDigit === mark.value)   cell.classList.add("same-digit");

      // ARIA label
      let ariaLabel = `Row ${row + 1} column ${col + 1}`;
      if (hasValue)              ariaLabel += `, filled ${mark.value}`;
      else if (mark.notes.length) ariaLabel += `, notes ${mark.notes.join(" ")}`;
      else                        ariaLabel += ", empty";
      if (state.selected.has(key)) ariaLabel += ", selected";
      cell.setAttribute("aria-label", ariaLabel);

      if (hasValue) {
        cell.textContent = mark.value;
      } else if (mark.notes.length) {
        const span = document.createElement("span");
        span.className   = "notes";
        span.textContent = mark.notes.join(" ");
        cell.append(span);
      } else if (state.hintLevel >= 2 && scn.candidates[key]) {
        const span = document.createElement("span");
        span.className   = "notes hint-candidates";
        span.textContent = scn.candidates[key];
        cell.append(span);
      }

      cell.addEventListener("click", () => {
        state.activeCellKey = key;
        if (state.selected.has(key)) state.selected.delete(key); else state.selected.add(key);
        if (hasValue) state.highlightedDigit = state.highlightedDigit === mark.value ? null : mark.value;
        selectedCellsEl.textContent = [...state.selected].sort().join(", ") || "None";
        renderBoard();
      });
    }

    boardEl.append(cell);
  });

  // Restore keyboard focus to the active cell without scrolling
  if (state.activeCellKey) {
    const activeEl = boardEl.querySelector(`[data-key="${state.activeCellKey}"]`);
    if (activeEl && document.activeElement !== activeEl) {
      activeEl.focus({ preventScroll: true });
    }
  }

  updateUndoRedoBtns();
}

function render() {
  saveSession();
  const scn = currentScenario();
  methodTheory.textContent  = METHODS[state.currentMethod].theory;
  scenarioTitle.textContent = `${METHODS[state.currentMethod].label} • ${scn.name}`;
  progressPill.textContent  = `${state.currentPuzzle + 1}/3`;
  instructionEl.textContent = scn.instruction;
  selectedCellsEl.textContent = [...state.selected].sort().join(", ") || "None";
  hintLevelEl.textContent   = state.hintLevel === 0 ? "No hint" : `Hint ${state.hintLevel}`;
  noteModeBtn.textContent   = state.noteMode ? "Pencil On" : "Pencil Off";
  feedbackEl.textContent    = "";
  feedbackEl.className      = "feedback";
  explanationEl.textContent = "Solve and check to see explanation.";
  renderBoard();
  renderCurriculum();
  renderDigitPad(scn.board);
}

// ── User actions ──────────────────────────────────────────────────────────────
function applyDigit(digit) {
  if (!state.activeCellKey) return;
  const { row, col } = parseCellKey(state.activeCellKey);
  if (currentScenario().board[row * 9 + col] !== "0") return;

  pushUndo();
  const marks = marksForScenario();
  if (!marks[state.activeCellKey]) marks[state.activeCellKey] = { value: "", notes: [] };

  if (state.noteMode) {
    const set = new Set(marks[state.activeCellKey].notes);
    if (set.has(digit)) set.delete(digit); else set.add(digit);
    marks[state.activeCellKey].notes = [...set].sort();
    marks[state.activeCellKey].value = "";
  } else {
    marks[state.activeCellKey].value = digit;
    marks[state.activeCellKey].notes = [];
    state.highlightedDigit = digit;
  }

  saveMarks();
  renderBoard();
}

function clearActiveCell() {
  if (!state.activeCellKey) return;
  pushUndo();
  marksForScenario()[state.activeCellKey] = { value: "", notes: [] };
  saveMarks();
  renderBoard();
}

function checkSelection() {
  const scn = currentScenario();
  const a   = [...state.selected].sort();
  const b   = [...scn.targets].sort();
  const ok  = a.length === b.length && a.every((v, i) => v === b[i]);

  if (!ok) {
    feedbackEl.textContent = "Not quite. Try another hint level.";
    feedbackEl.className   = "feedback bad";
    return;
  }

  stopTimer();

  if (!state.progress[state.currentMethod].includes(state.currentPuzzle)) {
    state.progress[state.currentMethod].push(state.currentPuzzle);
    state.progress[state.currentMethod].sort((x, y) => x - y);
    saveProgress();
  }

  feedbackEl.textContent    = "Correct!";
  feedbackEl.className      = "feedback ok";
  explanationEl.textContent = scn.explanation;
  renderBoard();
  renderCurriculum();

  if (allDone()) completionOverlay.hidden = false;
}

function onHint() {
  state.hintLevel = Math.min(3, state.hintLevel + 1);
  feedbackEl.textContent =
    state.hintLevel === 1
      ? "Hint 1: irrelevant cells turned gray."
      : state.hintLevel === 2
        ? "Hint 2: scenario candidate notes are now shown on relevant cells."
        : "Hint 3: one key target is highlighted.";
  feedbackEl.className    = "feedback";
  hintLevelEl.textContent = `Hint ${state.hintLevel}`;
  renderBoard();
}

function resetRound() {
  state.selected        = new Set();
  state.hintLevel       = 0;
  state.activeCellKey   = null;
  state.highlightedDigit = null;
}

function onNext() {
  state.currentPuzzle = (state.currentPuzzle + 1) % 3;
  resetRound();
  saveSession();
  startTimer();
  render();
}

function resetProgress() {
  if (!confirm("Reset all progress? This cannot be undone.")) return;
  localStorage.removeItem(PROGRESS_KEY);
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(MARKS_KEY);
  state.progress      = Object.fromEntries(METHOD_ORDER.map((m) => [m, []]));
  state.currentMethod = METHOD_ORDER[0];
  state.currentPuzzle = 0;
  Object.keys(userMarks).forEach((k) => delete userMarks[k]);
  Object.keys(undoStack).forEach((k) => delete undoStack[k]);
  Object.keys(redoStack).forEach((k) => delete redoStack[k]);
  completionOverlay.hidden = true;
  resetRound();
  syncMethodSelect();
  startTimer();
  render();
}

// ── Keyboard navigation ───────────────────────────────────────────────────────
const ARROW_DIRS = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] };

function handleKeydown(e) {
  const activeEl = document.activeElement;

  // Arrow keys: move between cells
  if (ARROW_DIRS[e.key] && activeEl && activeEl.classList.contains("cell")) {
    e.preventDefault();
    const key = activeEl.dataset.key;
    if (!key) return;
    const { row, col } = parseCellKey(key);
    const [dr, dc]     = ARROW_DIRS[e.key];
    const nr           = Math.min(8, Math.max(0, row + dr));
    const nc           = Math.min(8, Math.max(0, col + dc));
    const nextKey      = `r${nr + 1}c${nc + 1}`;
    const nextEl       = boardEl.querySelector(`[data-key="${nextKey}"]`);
    if (!nextEl) return;
    nextEl.focus();
    if (!nextEl.classList.contains("given")) {
      state.activeCellKey = nextKey;
      if (e.shiftKey) {
        state.selected.add(nextKey);
      } else {
        state.selected = new Set([nextKey]);
      }
      selectedCellsEl.textContent = [...state.selected].sort().join(", ") || "None";
      renderBoard();
    }
    return;
  }

  // Digit keys: fill active cell
  if (/^[1-9]$/.test(e.key) && state.activeCellKey) {
    applyDigit(e.key);
    return;
  }

  // Backspace / Delete: clear active cell
  if ((e.key === "Backspace" || e.key === "Delete") && state.activeCellKey) {
    clearActiveCell();
    return;
  }

  // Ctrl/Cmd+Z: undo, Ctrl/Cmd+Shift+Z or Ctrl/Cmd+Y: redo
  if ((e.ctrlKey || e.metaKey) && e.key === "z") {
    e.preventDefault();
    if (e.shiftKey) redo(); else undo();
    return;
  }
  if ((e.ctrlKey || e.metaKey) && e.key === "y") {
    e.preventDefault();
    redo();
  }
}

// ── Initialisation ────────────────────────────────────────────────────────────
function syncMethodSelect() {
  methodSelect.value = state.currentMethod;
  [...methodSelect.options].forEach((o) => {
    o.textContent = `${METHODS[o.value].level}: ${METHODS[o.value].label}`;
  });
}

function init() {
  // Populate method selector
  METHOD_ORDER.forEach((method) => {
    const o       = document.createElement("option");
    o.value       = method;
    o.textContent = `${METHODS[method].level}: ${METHODS[method].label}`;
    methodSelect.append(o);
  });

  // Populate digit pad
  for (let d = 1; d <= 9; d++) {
    const btn       = document.createElement("button");
    btn.type        = "button";
    btn.className   = "secondary";
    btn.textContent = String(d);
    btn.addEventListener("click", () => applyDigit(String(d)));
    digitPad.append(btn);
  }

  // Wire controls
  noteModeBtn.addEventListener("click", () => {
    state.noteMode        = !state.noteMode;
    noteModeBtn.textContent = state.noteMode ? "Pencil On" : "Pencil Off";
    saveSession();
  });

  clearCellBtn.addEventListener("click", clearActiveCell);

  methodSelect.addEventListener("change", () => {
    state.currentMethod = methodSelect.value;
    state.currentPuzzle = 0;
    resetRound();
    saveSession();
    startTimer();
    render();
  });

  $("checkBtn").addEventListener("click", checkSelection);
  $("hintBtn").addEventListener("click", onHint);
  $("nextBtn").addEventListener("click", onNext);

  darkModeBtn.addEventListener("click", () => {
    state.darkMode = !state.darkMode;
    applyTheme();
    saveTheme();
  });

  resetBtn.addEventListener("click", resetProgress);
  undoBtn.addEventListener("click",  undo);
  redoBtn.addEventListener("click",  redo);

  $("closeCompletionBtn").addEventListener("click", () => {
    completionOverlay.hidden = true;
  });

  document.addEventListener("keydown", handleKeydown);

  // Restore last session
  const saved = loadSession();
  if (saved) {
    state.currentMethod = saved.currentMethod;
    state.currentPuzzle = saved.currentPuzzle;
    state.noteMode      = saved.noteMode;
  }

  applyTheme();
  syncMethodSelect();
  startTimer();
  render();
}

init();
