const METHOD_ORDER = ["nakedSingle", "hiddenSingle", "lockedCandidates", "nakedPair", "hiddenPair", "xWing", "xyWing", "swordfish"];

const METHODS = {
  nakedSingle: {
    label: "Naked Single",
    level: "Foundation",
    theory: "A naked single is a cell with only one possible digit.",
    link: "https://www.sudokuwiki.org/Naked_Candidates",
    puzzles: [
      sc("Example 1", "Select the naked single.", "400000938032094100095300240370609004529001673604703090957008300003900400240030709", { r2c2: "7", r2c3: "2,7" }, ["r2c2"], "This is a SudokuWiki naked-candidates example board."),
      sc("Example 2", "Select the naked single.", "080090030030000069902063158020804590851907046394605870563040987200000015010050020", { r1c1: "4", r1c3: "4,7" }, ["r1c1"], "Only one candidate remains in that cell."),
      sc("Example 3", "Select the naked single.", "070408029002000004854020007008374200020000000003261700000093612200000403130642070", { r5c5: "5", r5c4: "1,5" }, ["r5c5"], "Naked single from another SudokuWiki example grid.")
    ]
  },
  hiddenSingle: {
    label: "Hidden Single",
    level: "Foundation",
    theory: "A hidden single is the only place for a digit in a unit.",
    link: "https://www.sudokuwiki.org/Hidden_Candidates",
    puzzles: [
      sc("Row hidden single", "Select the hidden single for 9.", "000000000904607000076804100309701080008000300050308702007502610000403208000000000", { r4c4: "5,7,9", r4c2: "2,5,7" }, ["r4c4"], "Only one cell in the row takes digit 9."),
      sc("Column hidden single", "Select the hidden single for 1 in column 2.", "720408030080000047401076802810739000000851000000264080209680413340000008168943275", { r2c2: "3,4", r5c2: "1,4,9" }, ["r5c2"], "Digit 1 appears in only one place in the column."),
      sc("Box hidden single", "Select the hidden single in box 1.", "007030000500400060800100009092500700000000000030009510300008007070006008000020600", { r1c1: "1,3,5", r2c1: "1,4,9" }, ["r2c1"], "Hidden single appears when only one cell can take the digit in the box.")
    ]
  },
  lockedCandidates: {
    label: "Locked Candidates",
    level: "Beginner",
    theory: "If a candidate in a box is locked to one row/column, eliminate it outside the box.",
    link: "https://www.sudokuwiki.org/Intersection_Removal",
    puzzles: [
      sc("Pointing pair", "Select the two cells that lock digit 6.", "010903600000080000900000507002010430000402000064070200701000005000030000005601020", { r1c4: "2,6", r1c6: "2,4,6,8" }, ["r1c4", "r1c6"], "Pointing pair structure from SudokuWiki intersection-removal examples."),
      sc("Pointing triple", "Select the three locked cells in row 3.", "032006100410000000000901000500090004060000070300020005000508000000000019007000860", { r3c4: "2,3", r3c5: "3,6", r3c6: "2,4,6" }, ["r3c4", "r3c5", "r3c6"], "Candidate is confined to one row in the box."),
      sc("Claiming", "Select the two cells showing a claiming setup.", "000903010004000600750000040000480000200000003000052000040000081005000260090208000", { r4c1: "2,8", r5c1: "1,8" }, ["r4c1", "r5c1"], "Claiming interaction example from SudokuWiki grids.")
    ]
  },
  nakedPair: {
    label: "Naked Pair",
    level: "Beginner",
    theory: "Two cells sharing the same two candidates form a naked pair.",
    link: "https://www.sudokuwiki.org/Naked_Candidates",
    puzzles: [
      sc("Row pair", "Select the naked pair (3,6).", "400000038002004100005300240070609004020000070600703090057008300003900400240000009", { r7c3: "3,6", r7c6: "3,6", r7c1: "1,3,6" }, ["r7c3", "r7c6"], "Naked pair from SudokuWiki naked-candidates examples."),
      sc("Column pair", "Select the naked pair (1,7).", "080090030030000000002060108020800500800907006004005070503040900000000010010050020", { r2c8: "1,7", r5c8: "1,7", r8c8: "2,7" }, ["r2c8", "r5c8"], "Column naked pair example."),
      sc("Box pair", "Select the naked pair in this box.", "070008029002000004854020000008374200000000000003261700000090612200000400130600070", { r1c7: "2,9", r1c8: "2,9", r2c9: "2,4,9" }, ["r1c7", "r1c8"], "Box-level naked pair from SudokuWiki grid set.")
    ]
  },
  hiddenPair: {
    label: "Hidden Pair",
    level: "Intermediate",
    theory: "Two digits that only fit in two cells create a hidden pair.",
    link: "https://www.sudokuwiki.org/Hidden_Candidates",
    puzzles: [
      sc("Row hidden pair", "Select the hidden pair cells for 2/7.", "000001030231090000065003100678924300103050006000136700009360570006019843300000000", { r4c2: "2,5,7", r4c9: "2,5,7", r4c6: "1,2,7" }, ["r4c2", "r4c9"], "Hidden pair appears where the two digits can only fit in the same two cells."),
      sc("Column hidden pair", "Select the hidden pair cells in column 3.", "000000000231090000065003100008924000100050006000136700009300570000010843000000000", { r2c3: "1,5,9", r5c3: "1,6,9", r8c3: "2,6,7" }, ["r2c3", "r5c3"], "Column hidden-pair structure from SudokuWiki examples."),
      sc("Box hidden pair", "Select the hidden pair in the center box.", "720400030000000047001076802010039000000801000000260080209680400340000000060003075", { r4c4: "1,5,7", r6c6: "1,2,7", r5c5: "2,8" }, ["r4c4", "r6c6"], "Center-box hidden pair from SudokuWiki hidden-candidates page.")
    ]
  },
  xWing: {
    label: "X-Wing",
    level: "Intermediate",
    theory: "Two rows/columns with matching candidate positions form an X-Wing.",
    link: "https://www.sudokuwiki.org/X_Wing_Strategy",
    puzzles: [
      sc("X-Wing #1", "Select the four X-Wing corners for 6.", "100000569402000008050009040000640801000010000208035000040500010900000402621000005", { r2c3: "6,7", r2c8: "4,6", r7c3: "3,6", r7c8: "1,6" }, ["r2c3", "r2c8", "r7c3", "r7c8"], "X-Wing example board from SudokuWiki strategy page."),
      sc("X-Wing #2", "Select the four corners for candidate 4.", "000000004760010050090002081070050010000709000080030060240100070010090045900000000", { r2c2: "2,4,7", r2c7: "3,4,8", r8c2: "2,4,8", r8c7: "2,4,6" }, ["r2c2", "r2c7", "r8c2", "r8c7"], "Matching row positions create the wing."),
      sc("X-Wing #3", "Select the X-Wing corners in columns 2 and 8.", "000001008700030009020000061080009003001040900900300020240000080600090005100600000", { r1c2: "1,4,6", r1c8: "1,4", r5c2: "1,4,5", r5c8: "2,6,9" }, ["r1c2", "r1c8", "r5c2", "r5c8"], "Another SudokuWiki X-Wing teaching grid.")
    ]
  },
  xyWing: {
    label: "XY-Wing",
    level: "Advanced",
    theory: "Pivot (X,Y) with wings (X,Z) and (Y,Z) creates Z-elimination.",
    link: "https://www.sudokuwiki.org/Y_Wing_Strategy",
    puzzles: [
      sc("XY-Wing #1", "Select pivot + two wings.", "034500000802060400600008000003900004050000090900005800000300008001040605000007120", { r5c5: "2,8", r5c8: "2,6", r2c5: "6,8" }, ["r5c5", "r5c8", "r2c5"], "Classic XY-Wing style from SudokuWiki Y-Wing page examples."),
      sc("XY-Wing #2", "Select pivot + two wings.", "050000080000086000000201070009020601280000054703060900090605000000170000030000010", { r4c4: "1,7", r4c6: "1,5", r6c4: "5,7" }, ["r4c4", "r4c6", "r6c4"], "Pivot shares one candidate with each wing."),
      sc("XY-Wing #3", "Select pivot + two wings.", "009600000000025090400001078901040800000000000002070906370800002020510000000002400", { r2c2: "4,9", r2c5: "4,6", r5c2: "6,9" }, ["r2c2", "r2c5", "r5c2"], "Another SudokuWiki Y/XY-Wing example grid.")
    ]
  },
  swordfish: {
    label: "Swordfish",
    level: "Advanced",
    theory: "A 3-row/3-column fish pattern that extends X-Wing logic.",
    link: "https://www.sudokuwiki.org/Sword_Fish_Strategy",
    puzzles: [
      sc("Swordfish #1", "Select the 6 base cells.", "500010003006003002003200000002300076000050000190007500000009400200800600900040005", { r2c2: "2,4,7", r2c7: "3,4,8", r5c2: "1,4,5", r5c7: "4,5,9", r8c2: "2,4,8", r8c7: "2,4,6" }, ["r2c2", "r2c7", "r5c2", "r5c7", "r8c2", "r8c7"], "Swordfish demo grid from SudokuWiki strategy page."),
      sc("Swordfish #2", "Select the 6 base cells for candidate 6.", "900000000037010420840000603000034810000060000068120000102000084085070360000000001", { r1c3: "4,6", r1c8: "1,6", r4c3: "1,6", r4c8: "4,6,8", r7c3: "3,6", r7c8: "1,6" }, ["r1c3", "r1c8", "r4c3", "r4c8", "r7c3", "r7c8"], "Candidate lines up across three rows."),
      sc("Swordfish #3", "Select the 6 fish base cells.", "020040069003806200060020000890500010000000000030001026000010070009604300270050090", { r2c1: "1,4,9", r2c5: "6,8", r5c1: "1,2,9", r5c5: "2,8", r8c1: "2,3,9", r8c5: "5,8" }, ["r2c1", "r2c5", "r5c1", "r5c5", "r8c1", "r8c5"], "Third SudokuWiki swordfish example board.")
    ]
  }
};

const PROGRESS_KEY = "sudoku-method-3examples-v1";
const SESSION_KEY = "sudoku-method-session-v3";

const methodSelect = document.getElementById("methodSelect");
const methodTheory = document.getElementById("methodTheory");
const methodLink = document.getElementById("methodLink");
const curriculumPreview = document.getElementById("curriculumPreview");
const curriculumList = document.getElementById("curriculumList");
const masteryPill = document.getElementById("masteryPill");
const masteryFill = document.getElementById("masteryFill");
const boardEl = document.getElementById("board");
const scenarioTitle = document.getElementById("scenarioTitle");
const progressPill = document.getElementById("progressPill");
const instructionEl = document.getElementById("instruction");
const feedbackEl = document.getElementById("feedback");
const selectedCellsEl = document.getElementById("selectedCells");
const hintLevelEl = document.getElementById("hintLevel");
const explanationEl = document.getElementById("explanation");
const noteModeBtn = document.getElementById("noteModeBtn");
const clearCellBtn = document.getElementById("clearCellBtn");
const digitPad = document.getElementById("digitPad");

let currentMethod = METHOD_ORDER[0];
let currentPuzzle = 0;
let selected = new Set();
let hintLevel = 0;
let progress = loadProgress();
let noteMode = false;
let activeCellKey = null;
let highlightedDigit = null;
const userMarks = {};

function sc(name, instruction, board, candidates, targets, explanation) {
  return { name, instruction, board, candidates, targets, explanation };
}

function scenarioId() { return `${currentMethod}-${currentPuzzle}`; }
function marksForScenario() {
  const id = scenarioId();
  if (!userMarks[id]) userMarks[id] = {};
  return userMarks[id];
}

function parseCellKey(key) {
  const m = key.match(/^r(\d+)c(\d+)$/);
  return { row: Number(m[1]) - 1, col: Number(m[2]) - 1 };
}

function loadProgress() {
  const fallback = Object.fromEntries(METHOD_ORDER.map((m) => [m, []]));
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    METHOD_ORDER.forEach((m) => { if (!Array.isArray(parsed[m])) parsed[m] = []; });
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
    if (!METHOD_ORDER.includes(parsed.currentMethod)) return null;
    return {
      currentMethod: parsed.currentMethod,
      currentPuzzle: Math.min(Math.max(Number(parsed.currentPuzzle) || 0, 0), 2)
    };
  } catch {
    return null;
  }
}

function saveProgress() { localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress)); }
function saveSession() { localStorage.setItem(SESSION_KEY, JSON.stringify({ currentMethod, currentPuzzle, noteMode })); }

function currentScenario() { return METHODS[currentMethod].puzzles[currentPuzzle]; }
function methodDone(method) { return progress[method].length >= 3; }

function init() {
  METHOD_ORDER.forEach((method) => {
    const o = document.createElement("option");
    o.value = method;
    o.textContent = `${METHODS[method].level}: ${METHODS[method].label}`;
    methodSelect.append(o);
  });

  for (let d = 1; d <= 9; d += 1) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "secondary";
    btn.textContent = String(d);
    btn.addEventListener("click", () => applyDigit(String(d)));
    digitPad.append(btn);
  }

  noteModeBtn.addEventListener("click", () => {
    noteMode = !noteMode;
    noteModeBtn.textContent = noteMode ? "Pencil On" : "Pencil Off";
    saveSession();
  });

  clearCellBtn.addEventListener("click", clearActiveCell);

  methodSelect.addEventListener("change", () => {
    currentMethod = methodSelect.value;
    currentPuzzle = 0;
    resetRound();
    saveSession();
    render();
  });

  document.getElementById("checkBtn").addEventListener("click", checkSelection);
  document.getElementById("hintBtn").addEventListener("click", onHint);
  document.getElementById("nextBtn").addEventListener("click", onNext);

  const saved = loadSession();
  if (saved) {
    currentMethod = saved.currentMethod;
    currentPuzzle = saved.currentPuzzle;
  }

  syncMethodSelect();
  render();
}

function syncMethodSelect() {
  methodSelect.value = currentMethod;
  [...methodSelect.options].forEach((o) => {
    o.disabled = false;
    o.textContent = `${METHODS[o.value].level}: ${METHODS[o.value].label}`;
  });
}

function collapsedPreview() {
  const i = METHOD_ORDER.indexOf(currentMethod);
  const parts = [METHOD_ORDER[i], METHOD_ORDER[i + 1], METHOD_ORDER[i + 2]].filter(Boolean).map((k) => METHODS[k].label);
  return `${parts.join(" · ")} ${i + 3 < METHOD_ORDER.length ? "..." : ""}`.trim();
}

function renderCurriculum() {
  const doneCount = METHOD_ORDER.filter(methodDone).length;
  masteryPill.textContent = `${Math.round((doneCount / METHOD_ORDER.length) * 100)}%`;
  masteryFill.style.width = `${(doneCount / METHOD_ORDER.length) * 100}%`;
  curriculumPreview.textContent = collapsedPreview();

  curriculumList.innerHTML = "";
  METHOD_ORDER.forEach((method) => {
    const li = document.createElement("li");
    li.textContent = `${METHODS[method].level}: ${METHODS[method].label} — ${progress[method].length}/3`;
    li.classList.toggle("active", method === currentMethod);
    li.classList.toggle("done", methodDone(method));
    curriculumList.append(li);
  });
}

function toggleHighlightDigit(digit) {
  highlightedDigit = highlightedDigit === digit ? null : digit;
}

function renderBoard() {
  const scn = currentScenario();
  const relevant = new Set([...Object.keys(scn.candidates), ...scn.targets]);
  const marks = marksForScenario();
  boardEl.innerHTML = "";

  scn.board.split("").forEach((v, idx) => {
    const row = Math.floor(idx / 9);
    const key = `r${row + 1}c${(idx % 9) + 1}`;
    const cell = document.createElement("button");
    cell.className = "cell";
    cell.dataset.key = key;
    cell.dataset.row = String(row);
    cell.type = "button";

    if (v !== "0") {
      cell.classList.add("given");
      cell.textContent = v;
      if (highlightedDigit === v) cell.classList.add("same-digit");
      cell.addEventListener("click", () => {
        toggleHighlightDigit(v);
        renderBoard();
      });
    } else {
      const mark = marks[key] || { value: "", notes: [] };
      const hasValue = Boolean(mark.value);

      if (hintLevel >= 1 && !relevant.has(key)) cell.classList.add("irrelevant");
      if (selected.has(key)) cell.classList.add("selected");
      if (activeCellKey === key) cell.classList.add("active");
      if (hintLevel >= 3 && scn.targets[0] === key) cell.classList.add("target");
      if (hasValue && highlightedDigit === mark.value) cell.classList.add("same-digit");

      if (hasValue) {
        cell.textContent = mark.value;
      } else if (mark.notes.length) {
        const span = document.createElement("span");
        span.className = "notes";
        span.textContent = mark.notes.join(" ");
        cell.append(span);
      }

      cell.addEventListener("click", () => {
        activeCellKey = key;
        if (selected.has(key)) selected.delete(key); else selected.add(key);
        if (hasValue) toggleHighlightDigit(mark.value);
        selectedCellsEl.textContent = [...selected].sort().join(", ") || "None";
        renderBoard();
      });
    }

    boardEl.append(cell);
  });
}

function render() {
  saveSession();
  const scn = currentScenario();
  const method = METHODS[currentMethod];
  methodTheory.textContent = method.theory;
  methodLink.href = method.link;
  scenarioTitle.textContent = `${method.label} • ${scn.name}`;
  progressPill.textContent = `${currentPuzzle + 1}/3`;
  instructionEl.textContent = scn.instruction;
  selectedCellsEl.textContent = [...selected].sort().join(", ") || "None";
  hintLevelEl.textContent = hintLevel === 0 ? "No hint" : `Hint ${hintLevel}`;
  noteModeBtn.textContent = noteMode ? "Pencil On" : "Pencil Off";
  feedbackEl.textContent = "";
  feedbackEl.className = "feedback";
  renderBoard();
  renderCurriculum();
}

function applyDigit(digit) {
  if (!activeCellKey) return;
  const { row, col } = parseCellKey(activeCellKey);
  if (currentScenario().board[row * 9 + col] !== "0") return;

  const marks = marksForScenario();
  if (!marks[activeCellKey]) marks[activeCellKey] = { value: "", notes: [] };

  if (noteMode) {
    const set = new Set(marks[activeCellKey].notes);
    if (set.has(digit)) set.delete(digit); else set.add(digit);
    marks[activeCellKey].notes = [...set].sort();
    marks[activeCellKey].value = "";
  } else {
    marks[activeCellKey].value = digit;
    marks[activeCellKey].notes = [];
    highlightedDigit = digit;
  }

  renderBoard();
}

function clearActiveCell() {
  if (!activeCellKey) return;
  const marks = marksForScenario();
  marks[activeCellKey] = { value: "", notes: [] };
  renderBoard();
}

function checkSelection() {
  const scn = currentScenario();
  const a = [...selected].sort();
  const b = [...scn.targets].sort();
  const ok = a.length === b.length && a.every((v, i) => v === b[i]);

  if (!ok) {
    feedbackEl.textContent = "Not quite. Try another hint level.";
    feedbackEl.className = "feedback bad";
    return;
  }

  if (!progress[currentMethod].includes(currentPuzzle)) {
    progress[currentMethod].push(currentPuzzle);
    progress[currentMethod].sort((x, y) => x - y);
    saveProgress();
  }

  feedbackEl.textContent = "Correct!";
  feedbackEl.className = "feedback ok";
  explanationEl.textContent = scn.explanation;
  renderBoard();
  renderCurriculum();
}

function onHint() {
  hintLevel = Math.min(3, hintLevel + 1);
  feedbackEl.textContent = hintLevel === 1
    ? "Hint 1: irrelevant cells turned gray."
    : hintLevel === 2
      ? "Hint 2: focus on candidate-marked cells for this method."
      : "Hint 3: one key target is highlighted.";
  feedbackEl.className = "feedback";
  hintLevelEl.textContent = `Hint ${hintLevel}`;
  renderBoard();
}

function resetRound() {
  selected = new Set();
  hintLevel = 0;
  activeCellKey = null;
  highlightedDigit = null;
}

function onNext() {
  currentPuzzle = (currentPuzzle + 1) % 3;
  resetRound();
  saveSession();
  render();
}

init();
