const BOARD = "530070000600195000098000060800060003400803001700020006060000280000419005000080079";

const LEVEL_ORDER = ["Foundation", "Beginner", "Intermediate", "Advanced", "Expert", "Master"];

const LEVELS = {
  Foundation: {
    theory: "Singles techniques from SudokuWiki: Naked Single and Hidden Single.",
    puzzles: [
      scenario("Naked Single", "Select the naked single.", { r1c3: "4", r1c4: "2,6" }, ["r1c3"], "Only r1c3 has one candidate."),
      scenario("Hidden Single (Row)", "Select the hidden single for 9.", { r4c2: "2,5,7", r4c4: "5,7,9", r4c6: "1,2,7" }, ["r4c4"], "9 appears only once in the row."),
      scenario("Hidden Single (Box)", "Select the hidden single in box 1.", { r1c1: "1,3,5", r1c2: "3,5,6", r2c1: "1,4,9" }, ["r2c1"], "Only r2c1 can take 9 in this box.")
    ]
  },
  Beginner: {
    theory: "Entry pattern tools: Locked Candidates, Naked Pair, Hidden Pair.",
    puzzles: [
      scenario("Locked Candidates", "Select the pointing pair cells.", { r1c4: "2,6", r1c6: "2,4,6,8", r2c4: "2,3,4" }, ["r1c4", "r1c6"], "Digit 6 is locked to row 1 in the box."),
      scenario("Naked Pair", "Select the naked pair (3,6).", { r7c3: "3,6", r7c6: "3,6", r7c1: "1,3,6" }, ["r7c3", "r7c6"], "These two cells form a naked pair."),
      scenario("Hidden Pair", "Select the hidden pair cells for 2/7.", { r4c2: "2,5,7", r4c9: "2,5,7", r4c6: "1,2,7" }, ["r4c2", "r4c9"], "2 and 7 are restricted to two cells.")
    ]
  },
  Intermediate: {
    theory: "Classic line patterns: X-Wing and XY-Wing style structures.",
    puzzles: [
      scenario("X-Wing", "Select the 4 corners for digit 6.", { r2c3: "6,7", r2c8: "4,6", r7c3: "3,6", r7c8: "1,6" }, ["r2c3", "r2c8", "r7c3", "r7c8"], "Rows 2 and 7 align in columns 3 and 8."),
      scenario("XY-Wing", "Select pivot + two wings.", { r5c5: "2,8", r5c8: "2,6", r2c5: "6,8" }, ["r5c5", "r5c8", "r2c5"], "Pivot links both wings."),
      scenario("W-Wing", "Select the two bivalue endpoints.", { r2c2: "4,7", r2c8: "4,7", r7c2: "4,9" }, ["r2c2", "r2c8"], "Same bivalue cells connected by a strong link.")
    ]
  },
  Advanced: {
    theory: "Bigger fish and coloring from SudokuWiki: Swordfish, XYZ-Wing, Simple Coloring.",
    puzzles: [
      scenario("Swordfish", "Select the 6 base cells.", { r2c2: "2,4,7", r2c7: "3,4,8", r5c2: "1,4,5", r5c7: "4,5,9", r8c2: "2,4,8", r8c7: "2,4,6" }, ["r2c2", "r2c7", "r5c2", "r5c7", "r8c2", "r8c7"], "Three rows restrict one digit to shared columns."),
      scenario("XYZ-Wing", "Select pivot + two wing cells.", { r4c4: "2,5,8", r4c6: "2,8", r6c5: "5,8" }, ["r4c4", "r4c6", "r6c5"], "Tri-value pivot with two bivalue wings."),
      scenario("Simple Coloring", "Select one conjugate chain path.", { r1c3: "6", r4c3: "6", r7c3: "6" }, ["r1c3", "r4c3", "r7c3"], "Coloring tracks alternating truth on conjugate links.")
    ]
  },
  Expert: {
    theory: "Expert toolbox: Jellyfish, Unique Rectangles, Finned X-Wing.",
    puzzles: [
      scenario("Jellyfish", "Select the 4-row fish footprint cells.", { r2c2: "4", r2c7: "4", r5c2: "4", r5c7: "4", r8c2: "4", r8c7: "4", r1c2: "4", r1c7: "4" }, ["r2c2", "r2c7", "r5c2", "r5c7"], "Jellyfish extends fish logic to 4 rows/columns."),
      scenario("Unique Rectangle", "Select the four rectangle corners.", { r2c2: "2,7", r2c3: "2,7", r5c2: "2,7", r5c3: "2,7,9" }, ["r2c2", "r2c3", "r5c2", "r5c3"], "UR avoids a deadly pattern."),
      scenario("Finned X-Wing", "Select the X-Wing corners + fin cell.", { r2c3: "6", r2c8: "6", r7c3: "6", r7c8: "6", r3c8: "6" }, ["r2c3", "r2c8", "r7c3", "r7c8", "r3c8"], "Fin constrains where eliminations are valid.")
    ]
  },
  Master: {
    theory: "Chain/exotic set: Skyscraper, 2-String Kite, AIC.",
    puzzles: [
      scenario("Skyscraper", "Select the four key skyscraper cells.", { r2c3: "6", r7c3: "6", r2c8: "6", r7c8: "6" }, ["r2c3", "r7c3", "r2c8", "r7c8"], "Two strong links create two towers."),
      scenario("2-String Kite", "Select the 3 key kite cells.", { r2c3: "6", r2c8: "6", r7c3: "6" }, ["r2c3", "r2c8", "r7c3"], "Row and column strong links intersect for elimination."),
      scenario("AIC", "Select one valid AIC chain path.", { r2c2: "4,7", r2c8: "4,7", r7c8: "4,7" }, ["r2c2", "r2c8", "r7c8"], "Alternating strong/weak links create a contradiction path.")
    ]
  }
};

const PROGRESS_KEY = "sudoku-trainer-levels-v1";

const levelSelect = document.getElementById("levelSelect");
const levelTheory = document.getElementById("levelTheory");
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

let currentLevel = LEVEL_ORDER[0];
let currentPuzzle = 0;
let selected = new Set();
let hintLevel = 0;
let progress = loadProgress();

function scenario(name, instruction, candidates, targets, explanation) {
  return { name, instruction, board: BOARD, candidates, targets, explanation };
}

function loadProgress() {
  const fallback = Object.fromEntries(LEVEL_ORDER.map((l) => [l, []]));
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    LEVEL_ORDER.forEach((l) => { if (!Array.isArray(parsed[l])) parsed[l] = []; });
    return parsed;
  } catch { return fallback; }
}

function saveProgress() { localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress)); }
function currentScenario() { return LEVELS[currentLevel].puzzles[currentPuzzle]; }
function levelDone(level) { return progress[level].length >= 3; }
function levelUnlocked(level) {
  const i = LEVEL_ORDER.indexOf(level);
  if (i <= 0) return true;
  return levelDone(LEVEL_ORDER[i - 1]);
}

function init() {
  LEVEL_ORDER.forEach((level) => {
    const o = document.createElement("option");
    o.value = level;
    o.textContent = level;
    levelSelect.append(o);
  });

  levelSelect.addEventListener("change", () => {
    const requested = levelSelect.value;
    if (!levelUnlocked(requested)) {
      feedbackEl.textContent = `Finish ${LEVEL_ORDER[LEVEL_ORDER.indexOf(requested)-1]} first.`;
      feedbackEl.className = "feedback bad";
      syncLevelSelect();
      return;
    }
    currentLevel = requested;
    currentPuzzle = 0;
    resetRound();
    render();
  });

  document.getElementById("checkBtn").addEventListener("click", checkSelection);
  document.getElementById("hintBtn").addEventListener("click", onHint);
  document.getElementById("nextBtn").addEventListener("click", onNext);

  syncLevelSelect();
  render();
}

function syncLevelSelect() {
  levelSelect.value = currentLevel;
  [...levelSelect.options].forEach((o) => {
    o.disabled = !levelUnlocked(o.value);
    o.textContent = levelUnlocked(o.value) ? o.value : `${o.value} (locked)`;
  });
}

function collapsedPreview() {
  const i = LEVEL_ORDER.indexOf(currentLevel);
  const parts = [LEVEL_ORDER[i], LEVEL_ORDER[i + 1], LEVEL_ORDER[i + 2]].filter(Boolean);
  return `${parts.join(" · ")} ${i + 3 < LEVEL_ORDER.length ? "..." : ""}`.trim();
}

function renderCurriculum() {
  const doneCount = LEVEL_ORDER.filter(levelDone).length;
  masteryPill.textContent = `${Math.round((doneCount / LEVEL_ORDER.length) * 100)}%`;
  masteryFill.style.width = `${(doneCount / LEVEL_ORDER.length) * 100}%`;
  curriculumPreview.textContent = collapsedPreview();

  curriculumList.innerHTML = "";
  LEVEL_ORDER.forEach((level) => {
    const li = document.createElement("li");
    li.textContent = `${level} — ${progress[level].length}/3 puzzles`;
    li.classList.toggle("active", level === currentLevel);
    li.classList.toggle("done", levelDone(level));
    li.classList.toggle("locked", !levelUnlocked(level));
    curriculumList.append(li);
  });
}

function renderBoard() {
  const sc = currentScenario();
  const relevant = new Set([...Object.keys(sc.candidates), ...sc.targets]);
  boardEl.innerHTML = "";

  sc.board.split("").forEach((v, idx) => {
    const row = Math.floor(idx / 9);
    const col = idx % 9;
    const key = `r${row + 1}c${col + 1}`;
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
      if (hintLevel >= 3 && sc.targets[0] === key) cell.classList.add("target");
      cell.addEventListener("click", () => toggleCell(key));
    }

    boardEl.append(cell);
  });
}

function render() {
  const sc = currentScenario();
  levelTheory.textContent = LEVELS[currentLevel].theory;
  scenarioTitle.textContent = `${currentLevel} • ${sc.name}`;
  progressPill.textContent = `${currentPuzzle + 1}/3`;
  instructionEl.textContent = sc.instruction;
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
  const sc = currentScenario();
  const a = [...selected].sort();
  const b = [...sc.targets].sort();
  const ok = a.length === b.length && a.every((v, i) => v === b[i]);

  if (!ok) {
    feedbackEl.textContent = "Not quite. Try another hint level.";
    feedbackEl.className = "feedback bad";
    return;
  }

  if (!progress[currentLevel].includes(currentPuzzle)) {
    progress[currentLevel].push(currentPuzzle);
    progress[currentLevel].sort((x, y) => x - y);
    saveProgress();
  }

  feedbackEl.textContent = "Correct!";
  feedbackEl.className = "feedback ok";
  explanationEl.textContent = sc.explanation;
  renderBoard();
  syncLevelSelect();
  renderCurriculum();
}

function onHint() {
  hintLevel = Math.min(3, hintLevel + 1);
  if (hintLevel === 1) feedbackEl.textContent = "Hint 1: irrelevant cells turned gray.";
  else if (hintLevel === 2) feedbackEl.textContent = "Hint 2: focus on candidate-marked cells for this method.";
  else feedbackEl.textContent = "Hint 3: one key target is highlighted.";
  feedbackEl.className = "feedback";
  renderBoard();
  hintLevelEl.textContent = `Hint ${hintLevel}`;
}

function resetRound() { selected = new Set(); hintLevel = 0; }

function onNext() {
  currentPuzzle = (currentPuzzle + 1) % 3;
  resetRound();
  render();
}

init();
