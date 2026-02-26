const BOARD = "530070000600195000098000060800060003400803001700020006060000280000419005000080079";

const METHOD_ORDER = [
  "nakedSingle",
  "hiddenSingle",
  "lockedCandidates",
  "nakedPair",
  "hiddenPair",
  "xWing",
  "xyWing",
  "swordfish"
];

const METHODS = {
  nakedSingle: {
    label: "Naked Single",
    level: "Foundation",
    theory: "A naked single is a cell with only one possible digit.",
    puzzles: [
      sc("Example 1", "Select the naked single.", { r1c3: "4", r1c4: "2,6" }, ["r1c3"], "r1c3 is forced to 4."),
      sc("Example 2", "Select the naked single.", { r2c2: "7", r2c3: "2,7" }, ["r2c2"], "r2c2 has one candidate."),
      sc("Example 3", "Select the naked single.", { r8c1: "2", r8c3: "2,6" }, ["r8c1"], "r8c1 is immediately solved.")
    ]
  },
  hiddenSingle: {
    label: "Hidden Single",
    level: "Foundation",
    theory: "A hidden single is the only place for a digit in a unit.",
    puzzles: [
      sc("Row hidden single", "Select the hidden single for 9.", { r4c2: "2,5,7", r4c4: "5,7,9", r4c6: "1,2,7" }, ["r4c4"], "Only r4c4 can take 9."),
      sc("Column hidden single", "Select the hidden single for 1 in column 2.", { r1c2: "3,5", r2c2: "3,4", r5c2: "1,4,9" }, ["r5c2"], "1 appears only at r5c2 in the column."),
      sc("Box hidden single", "Select the hidden single in box 1.", { r1c1: "1,3,5", r1c2: "3,5", r2c1: "1,4,9" }, ["r2c1"], "In this box, only r2c1 can be 9.")
    ]
  },
  lockedCandidates: {
    label: "Locked Candidates",
    level: "Beginner",
    theory: "If a candidate in a box is locked to one row/column, eliminate it outside the box.",
    puzzles: [
      sc("Pointing pair", "Select the two cells that lock digit 6.", { r1c4: "2,6", r1c6: "2,4,6,8", r2c4: "2,3,4" }, ["r1c4", "r1c6"], "6 is locked in row 1 for that box."),
      sc("Pointing triple", "Select the three locked cells in row 3.", { r3c4: "2,3", r3c5: "3,6", r3c6: "2,4,6" }, ["r3c4", "r3c5", "r3c6"], "Candidate is confined to one row inside the box."),
      sc("Claiming", "Select the two cells showing a claiming setup.", { r4c1: "2,8", r5c1: "1,8", r6c1: "3,9" }, ["r4c1", "r5c1"], "Candidate in line is claimed by a single box.")
    ]
  },
  nakedPair: {
    label: "Naked Pair",
    level: "Beginner",
    theory: "Two cells sharing the same two candidates form a naked pair.",
    puzzles: [
      sc("Row pair", "Select the naked pair (3,6).", { r7c3: "3,6", r7c6: "3,6", r7c1: "1,3,6" }, ["r7c3", "r7c6"], "These two cells lock 3/6."),
      sc("Column pair", "Select the naked pair (1,7).", { r2c8: "1,7", r5c8: "1,7", r8c8: "2,7" }, ["r2c8", "r5c8"], "Column pair enables eliminations."),
      sc("Box pair", "Select the naked pair in this box.", { r1c7: "2,9", r1c8: "2,9", r2c9: "2,4,9" }, ["r1c7", "r1c8"], "Exact two-digit match forms a pair.")
    ]
  },
  hiddenPair: {
    label: "Hidden Pair",
    level: "Intermediate",
    theory: "Two digits that only fit in two cells create a hidden pair.",
    puzzles: [
      sc("Row hidden pair", "Select the hidden pair cells for 2/7.", { r4c2: "2,5,7", r4c9: "2,5,7", r4c6: "1,2,7" }, ["r4c2", "r4c9"], "2 and 7 are restricted to these cells."),
      sc("Column hidden pair", "Select the hidden pair cells in column 3.", { r2c3: "1,5,9", r5c3: "1,6,9", r8c3: "2,6,7" }, ["r2c3", "r5c3"], "Digits 1 and 9 are hidden as a pair."),
      sc("Box hidden pair", "Select the hidden pair in the center box.", { r4c4: "1,5,7", r5c5: "2,8", r6c6: "1,2,7" }, ["r4c4", "r6c6"], "Only those cells can hold 1 and 7." )
    ]
  },
  xWing: {
    label: "X-Wing",
    level: "Intermediate",
    theory: "Two rows/columns with matching candidate positions form an X-Wing.",
    puzzles: [
      sc("X-Wing #1", "Select the four X-Wing corners for 6.", { r2c3: "6,7", r2c8: "4,6", r7c3: "3,6", r7c8: "1,6" }, ["r2c3", "r2c8", "r7c3", "r7c8"], "Rows 2 and 7 align in columns 3 and 8."),
      sc("X-Wing #2", "Select the four corners for candidate 4.", { r2c2: "2,4,7", r2c7: "3,4,8", r8c2: "2,4,8", r8c7: "2,4,6" }, ["r2c2", "r2c7", "r8c2", "r8c7"], "Matching row positions create the wing."),
      sc("X-Wing #3", "Select the X-Wing corners in columns 2 and 8.", { r1c2: "1,4,6", r1c8: "1,4", r5c2: "1,4,5", r5c8: "2,6,9" }, ["r1c2", "r1c8", "r5c2", "r5c8"], "Two-row two-column cycle is formed.")
    ]
  },
  xyWing: {
    label: "XY-Wing",
    level: "Advanced",
    theory: "Pivot (X,Y) with wings (X,Z) and (Y,Z) creates Z-elimination.",
    puzzles: [
      sc("XY-Wing #1", "Select pivot + two wings.", { r5c5: "2,8", r5c8: "2,6", r2c5: "6,8" }, ["r5c5", "r5c8", "r2c5"], "Classic XY-Wing structure."),
      sc("XY-Wing #2", "Select pivot + two wings.", { r4c4: "1,7", r4c6: "1,5", r6c4: "5,7" }, ["r4c4", "r4c6", "r6c4"], "Pivot shares one candidate with each wing."),
      sc("XY-Wing #3", "Select pivot + two wings.", { r2c2: "4,9", r2c5: "4,6", r5c2: "6,9" }, ["r2c2", "r2c5", "r5c2"], "Wings connect through the pivot.")
    ]
  },
  swordfish: {
    label: "Swordfish",
    level: "Advanced",
    theory: "A 3-row/3-column fish pattern that extends X-Wing logic.",
    puzzles: [
      sc("Swordfish #1", "Select the 6 base cells.", { r2c2: "2,4,7", r2c7: "3,4,8", r5c2: "1,4,5", r5c7: "4,5,9", r8c2: "2,4,8", r8c7: "2,4,6" }, ["r2c2", "r2c7", "r5c2", "r5c7", "r8c2", "r8c7"], "Three rows share the same candidate columns."),
      sc("Swordfish #2", "Select the 6 base cells for candidate 6.", { r1c3: "4,6", r1c8: "1,6", r4c3: "1,6", r4c8: "4,6,8", r7c3: "3,6", r7c8: "1,6" }, ["r1c3", "r1c8", "r4c3", "r4c8", "r7c3", "r7c8"], "Candidate lines up across three rows."),
      sc("Swordfish #3", "Select the 6 fish base cells.", { r2c1: "1,4,9", r2c5: "6,8", r5c1: "1,2,9", r5c5: "2,8", r8c1: "2,3,9", r8c5: "5,8" }, ["r2c1", "r2c5", "r5c1", "r5c5", "r8c1", "r8c5"], "Another 3-row fish arrangement." )
    ]
  }
};

const PROGRESS_KEY = "sudoku-method-3examples-v1";

const methodSelect = document.getElementById("methodSelect");
const methodTheory = document.getElementById("methodTheory");
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

let currentMethod = METHOD_ORDER[0];
let currentPuzzle = 0;
let selected = new Set();
let hintLevel = 0;
let progress = loadProgress();

function sc(name, instruction, candidates, targets, explanation) {
  return { name, instruction, board: BOARD, candidates, targets, explanation };
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

function saveProgress() { localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress)); }
function currentScenario() { return METHODS[currentMethod].puzzles[currentPuzzle]; }
function methodDone(method) { return progress[method].length >= 3; }
function methodUnlocked(method) {
  const i = METHOD_ORDER.indexOf(method);
  if (i <= 0) return true;
  return methodDone(METHOD_ORDER[i - 1]);
}

function init() {
  METHOD_ORDER.forEach((method) => {
    const o = document.createElement("option");
    o.value = method;
    o.textContent = `${METHODS[method].level}: ${METHODS[method].label}`;
    methodSelect.append(o);
  });

  methodSelect.addEventListener("change", () => {
    const requested = methodSelect.value;
    if (!methodUnlocked(requested)) {
      feedbackEl.textContent = `Finish ${METHODS[METHOD_ORDER[METHOD_ORDER.indexOf(requested)-1]].label} first.`;
      feedbackEl.className = "feedback bad";
      syncMethodSelect();
      return;
    }
    currentMethod = requested;
    currentPuzzle = 0;
    resetRound();
    render();
  });

  document.getElementById("checkBtn").addEventListener("click", checkSelection);
  document.getElementById("hintBtn").addEventListener("click", onHint);
  document.getElementById("nextBtn").addEventListener("click", onNext);

  syncMethodSelect();
  render();
}

function syncMethodSelect() {
  methodSelect.value = currentMethod;
  [...methodSelect.options].forEach((o) => {
    const unlocked = methodUnlocked(o.value);
    o.disabled = !unlocked;
    o.textContent = unlocked
      ? `${METHODS[o.value].level}: ${METHODS[o.value].label}`
      : `${METHODS[o.value].level}: ${METHODS[o.value].label} (locked)`;
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
    li.classList.toggle("locked", !methodUnlocked(method));
    curriculumList.append(li);
  });
}

function renderBoard() {
  const scn = currentScenario();
  const relevant = new Set([...Object.keys(scn.candidates), ...scn.targets]);
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
      cell.disabled = true;
    } else {
      if (hintLevel >= 1 && !relevant.has(key)) cell.classList.add("irrelevant");
      if (selected.has(key)) cell.classList.add("selected");
      if (hintLevel >= 3 && scn.targets[0] === key) cell.classList.add("target");
      cell.addEventListener("click", () => toggleCell(key));
    }

    boardEl.append(cell);
  });
}

function render() {
  const scn = currentScenario();
  methodTheory.textContent = METHODS[currentMethod].theory;
  scenarioTitle.textContent = `${METHODS[currentMethod].label} • ${scn.name}`;
  progressPill.textContent = `${currentPuzzle + 1}/3`;
  instructionEl.textContent = scn.instruction;
  selectedCellsEl.textContent = [...selected].sort().join(", ") || "None";
  hintLevelEl.textContent = hintLevel === 0 ? "No hint" : `Hint ${hintLevel}`;
  feedbackEl.textContent = "";
  feedbackEl.className = "feedback";
  renderBoard();
  renderCurriculum();
}

function toggleCell(key) {
  if (selected.has(key)) selected.delete(key); else selected.add(key);
  selectedCellsEl.textContent = [...selected].sort().join(", ") || "None";
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
  syncMethodSelect();
  renderCurriculum();
}

function onHint() {
  hintLevel = Math.min(3, hintLevel + 1);
  feedbackEl.textContent =
    hintLevel === 1
      ? "Hint 1: irrelevant cells turned gray."
      : hintLevel === 2
        ? "Hint 2: focus on candidate-marked cells for this method."
        : "Hint 3: one key target is highlighted.";
  feedbackEl.className = "feedback";
  hintLevelEl.textContent = `Hint ${hintLevel}`;
  renderBoard();
}

function resetRound() { selected = new Set(); hintLevel = 0; }

function onNext() {
  currentPuzzle = (currentPuzzle + 1) % 3;
  resetRound();
  render();
}

init();

