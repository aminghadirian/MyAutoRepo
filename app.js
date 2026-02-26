const BASE_BOARD =
  "530070000600195000098000060800060003400803001700020006060000280000419005000080079";

const CURRICULUM_ORDER = [
  "nakedSingle",
  "hiddenSingle",
  "lockedCandidates",
  "nakedPair",
  "hiddenPair",
  "xWing",
  "xyWing",
  "swordfish",
  "xyzWing",
  "wWing",
  "simpleColoring",
  "jellyfish",
  "uniqueRectangles",
  "finnedXWing",
  "skyscraper",
  "twoStringKite",
  "remotePairs",
  "xyChains",
  "aic",
  "sueDeCoq"
];

const TECHNIQUES = {
  nakedSingle: method("Naked Single", "Foundation", "A naked single means one unsolved cell has only one candidate left.", {
    title: "Only one candidate remains",
    instruction: "Tap the naked single.",
    candidates: { r1c3: "4", r1c4: "2,6", r1c6: "2,4,6,8" },
    targets: ["r1c3"],
    explanation: "r1c3 has only candidate 4, so it is solved immediately."
  }),
  hiddenSingle: method("Hidden Single", "Foundation", "A hidden single is the only place for a digit in a row, column, or box.", {
    title: "Hidden single in row 4",
    instruction: "Tap the cell where 9 is a hidden single.",
    candidates: { r4c2: "2,5,7", r4c4: "5,7,9", r4c6: "1,2,7", r4c8: "1,4,5" },
    targets: ["r4c4"],
    explanation: "Only r4c4 can take 9 in that row."
  }),
  lockedCandidates: method("Locked Candidates", "Beginner", "If a digit in one box is locked to one row/column, remove it elsewhere in that line.", {
    title: "Pointing pair",
    instruction: "Select the two cells forming the pointing pair for 6.",
    candidates: { r1c4: "2,6", r1c6: "2,4,6,8", r2c4: "2,3,4", r3c6: "2,4" },
    targets: ["r1c4", "r1c6"],
    explanation: "6 is locked to row 1 in that box."
  }),
  nakedPair: method("Naked Pair", "Beginner", "Two cells with exactly the same two candidates form a naked pair.", {
    title: "Naked pair (3,6)",
    instruction: "Tap both cells of the naked pair.",
    candidates: { r7c3: "3,6", r7c6: "3,6", r7c1: "1,3,6", r7c4: "3,5,7" },
    targets: ["r7c3", "r7c6"],
    explanation: "r7c3 and r7c6 lock digits 3 and 6."
  }),
  hiddenPair: method("Hidden Pair", "Intermediate", "Two digits that only appear in the same two cells form a hidden pair.", {
    title: "Hidden pair (2,7)",
    instruction: "Tap the two hidden-pair cells.",
    candidates: { r4c2: "2,5,7", r4c9: "2,5,7", r4c6: "1,2,7", r4c8: "1,4,5" },
    targets: ["r4c2", "r4c9"],
    explanation: "2 and 7 are restricted to r4c2/r4c9."
  }),
  xWing: method("X-Wing", "Intermediate", "Two rows and two columns with matching candidate positions form an X-Wing.", {
    title: "X-Wing on 6",
    instruction: "Select the four X-Wing corners.",
    candidates: { r2c3: "6,7", r2c8: "4,6", r7c3: "3,6", r7c8: "1,6", r5c3: "1,6,9" },
    targets: ["r2c3", "r2c8", "r7c3", "r7c8"],
    explanation: "Rows 2 and 7 align digit 6 in columns 3 and 8."
  }),
  xyWing: method("XY-Wing", "Advanced", "Pivot (X,Y) + wings (X,Z) and (Y,Z) eliminate Z from shared peers.", {
    title: "XY-Wing structure",
    instruction: "Select pivot plus two wings.",
    candidates: { r5c5: "2,8", r5c8: "2,6", r2c5: "6,8", r2c8: "1,6,9" },
    targets: ["r5c5", "r5c8", "r2c5"],
    explanation: "Pivot r5c5 connects both wings and forces a Z-elimination."
  }),
  swordfish: method("Swordfish", "Advanced", "A 3-row/3-column fish pattern extends X-Wing logic.", {
    title: "Swordfish base cells",
    instruction: "Select the six base cells used by this swordfish.",
    candidates: { r2c2: "2,4,7", r2c7: "3,4,8", r5c2: "1,4,5", r5c7: "4,5,9", r8c2: "2,4,8", r8c7: "2,4,6" },
    targets: ["r2c2", "r2c7", "r5c2", "r5c7", "r8c2", "r8c7"],
    explanation: "Rows 2/5/8 confine digit 4 to the same columns."
  }),
  xyzWing: studyMethod("XYZ-Wing", "Advanced", "Like XY-Wing but with a tri-value pivot (X,Y,Z) and two bivalue wings.", ["r4c4", "r4c6", "r6c5"]),
  wWing: studyMethod("W-Wing", "Advanced", "Two identical bivalue cells connected by a strong link can eliminate a shared candidate.", ["r2c2", "r2c8"]),
  simpleColoring: studyMethod("Simple Coloring", "Advanced", "Color conjugate links in two colors; contradictions remove candidates.", ["r1c3", "r4c3", "r7c3"]),
  jellyfish: studyMethod("Jellyfish", "Expert", "A 4-row/4-column fish pattern for one digit.", ["r2c2", "r2c7", "r5c2", "r5c7"]),
  uniqueRectangles: studyMethod("Unique Rectangles", "Expert", "Use uniqueness to avoid deadly patterns and remove candidates.", ["r2c2", "r2c3", "r5c2", "r5c3"]),
  finnedXWing: studyMethod("Finned X-Wing", "Expert", "An almost X-Wing with an extra fin still allows restricted eliminations.", ["r2c3", "r2c8", "r3c8"]),
  skyscraper: studyMethod("Skyscraper", "Expert", "Two strong links for one digit create a two-tower elimination pattern.", ["r2c3", "r7c3", "r7c8", "r2c8"]),
  twoStringKite: studyMethod("2-String Kite", "Expert", "One row strong link plus one column strong link on same digit give a kite elimination.", ["r2c3", "r2c8", "r7c3"]),
  remotePairs: studyMethod("Remote Pairs", "Expert", "A chain of bivalue identical pairs can eliminate seen endpoints.", ["r1c3", "r3c3", "r5c3", "r7c3"]),
  xyChains: studyMethod("XY-Chains", "Master", "Alternating bivalue chain endpoints sharing a candidate allow eliminations.", ["r2c2", "r3c4", "r5c5", "r7c6"]),
  aic: studyMethod("Alternating Inference Chains", "Master", "General strong/weak link chains derive contradictions and eliminations.", ["r2c2", "r2c8", "r7c8"]),
  sueDeCoq: studyMethod("Sue de Coq", "Master", "Box-line intersection with disjoint candidate sets gives multiple eliminations.", ["r4c4", "r4c5", "r5c4", "r5c5"])
};

const PROGRESS_KEY = "sudoku-trainer-progress-v4";

const techniqueSelect = document.getElementById("technique");
const theoryEl = document.getElementById("techniqueTheory");
const boardEl = document.getElementById("board");
const instructionEl = document.getElementById("instruction");
const feedbackEl = document.getElementById("feedback");
const explanationEl = document.getElementById("explanation");
const selectedCellsEl = document.getElementById("selectedCells");
const titleEl = document.getElementById("scenarioTitle");
const progressEl = document.getElementById("progressPill");
const masteryPillEl = document.getElementById("masteryPill");
const masteryFillEl = document.getElementById("masteryFill");
const curriculumTextEl = document.getElementById("curriculumText");
const curriculumListEl = document.getElementById("curriculumList");

let currentTechnique = CURRICULUM_ORDER[0];
let currentScenarioIndex = 0;
let selected = new Set();
let progress = loadProgress();

function method(label, level, theory, scenario) {
  return { label, level, theory, scenarios: [{ ...scenario, board: BASE_BOARD, studyOnly: false }] };
}

function studyMethod(label, level, theory, keyCells) {
  return {
    label,
    level,
    theory,
    scenarios: [
      {
        title: `${label} pattern familiarization`,
        instruction: "Select the highlighted key cells to mark this method as studied.",
        board: BASE_BOARD,
        candidates: Object.fromEntries(keyCells.map((k) => [k, "•"])),
        targets: keyCells,
        explanation: `Great. You marked the key cells typically inspected for ${label}.`,
        studyOnly: true
      }
    ]
  };
}

function init() {
  CURRICULUM_ORDER.forEach((key) => {
    const option = document.createElement("option");
    const info = TECHNIQUES[key];
    option.value = key;
    option.textContent = `${info.level}: ${info.label}`;
    techniqueSelect.append(option);
  });

  techniqueSelect.addEventListener("change", () => {
    const requested = techniqueSelect.value;
    if (!isTechniqueUnlocked(requested)) {
      feedbackEl.textContent = `Finish ${getPreviousTechniqueLabel(requested)} first to unlock this lesson.`;
      feedbackEl.className = "feedback bad";
      syncTechniqueSelect();
      return;
    }

    currentTechnique = requested;
    currentScenarioIndex = 0;
    selected = new Set();
    renderScenario();
  });

  document.getElementById("checkBtn").addEventListener("click", checkSelection);
  document.getElementById("hintBtn").addEventListener("click", showHint);
  document.getElementById("nextBtn").addEventListener("click", nextScenario);

  syncTechniqueSelect();
  renderScenario();
}

function loadProgress() {
  const fallback = Object.fromEntries(CURRICULUM_ORDER.map((k) => [k, []]));
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    CURRICULUM_ORDER.forEach((k) => {
      if (!Array.isArray(parsed[k])) parsed[k] = [];
    });
    return parsed;
  } catch {
    return fallback;
  }
}

function saveProgress() {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

function getCompletedCount(techniqueKey) {
  return progress[techniqueKey].length;
}

function isTechniqueCompleted(techniqueKey) {
  return getCompletedCount(techniqueKey) >= TECHNIQUES[techniqueKey].scenarios.length;
}

function isTechniqueUnlocked(techniqueKey) {
  const index = CURRICULUM_ORDER.indexOf(techniqueKey);
  if (index <= 0) return true;
  return isTechniqueCompleted(CURRICULUM_ORDER[index - 1]);
}

function getPreviousTechniqueLabel(techniqueKey) {
  const previous = CURRICULUM_ORDER[CURRICULUM_ORDER.indexOf(techniqueKey) - 1];
  return TECHNIQUES[previous].label;
}

function syncTechniqueSelect() {
  techniqueSelect.value = currentTechnique;
  Array.from(techniqueSelect.options).forEach((option) => {
    const unlocked = isTechniqueUnlocked(option.value);
    option.disabled = !unlocked;
    option.textContent = unlocked
      ? `${TECHNIQUES[option.value].level}: ${TECHNIQUES[option.value].label}`
      : `${TECHNIQUES[option.value].level}: ${TECHNIQUES[option.value].label} (locked)`;
  });
}

function getScenario() {
  return TECHNIQUES[currentTechnique].scenarios[currentScenarioIndex];
}

function renderCurriculum() {
  const completedTechniques = CURRICULUM_ORDER.filter((k) => isTechniqueCompleted(k)).length;
  const percent = Math.round((completedTechniques / CURRICULUM_ORDER.length) * 100);
  masteryPillEl.textContent = `${percent}% mastered`;
  masteryFillEl.style.width = `${percent}%`;
  curriculumTextEl.textContent =
    "Top-20 curriculum based on popular SudokuWiki and community strategies from foundation to master level.";

  curriculumListEl.innerHTML = "";
  CURRICULUM_ORDER.forEach((k) => {
    const info = TECHNIQUES[k];
    const item = document.createElement("li");
    item.textContent = `${info.level}: ${info.label} — ${getCompletedCount(k)}/${info.scenarios.length} complete`;
    item.classList.toggle("locked", !isTechniqueUnlocked(k));
    item.classList.toggle("active", currentTechnique === k);
    item.classList.toggle("done", isTechniqueCompleted(k));
    curriculumListEl.append(item);
  });
}

function renderScenario() {
  const technique = TECHNIQUES[currentTechnique];
  const scenario = getScenario();

  theoryEl.textContent = technique.theory;
  titleEl.textContent = `${technique.level} • ${scenario.title}`;
  instructionEl.textContent = scenario.instruction;
  explanationEl.textContent = "Make your selection, then check it.";
  feedbackEl.textContent = "";
  feedbackEl.className = "feedback";
  selectedCellsEl.textContent = "None";
  progressEl.textContent = `Step ${currentScenarioIndex + 1}/${technique.scenarios.length}`;

  boardEl.innerHTML = "";
  scenario.board.split("").forEach((value, index) => {
    const row = Math.floor(index / 9);
    const col = index % 9;
    const key = `r${row + 1}c${col + 1}`;

    const cell = document.createElement("button");
    cell.type = "button";
    cell.className = "cell";
    cell.dataset.key = key;
    cell.dataset.row = String(row);

    if (value !== "0") {
      cell.classList.add("given");
      cell.textContent = value;
      cell.disabled = true;
    } else if (scenario.candidates[key]) {
      cell.classList.add("candidate");
      cell.textContent = scenario.candidates[key];
    }

    cell.addEventListener("click", () => toggleCell(key, cell));
    boardEl.append(cell);
  });

  renderCurriculum();
}

function toggleCell(key, cellEl) {
  if (selected.has(key)) {
    selected.delete(key);
    cellEl.classList.remove("selected");
  } else {
    selected.add(key);
    cellEl.classList.add("selected");
  }
  selectedCellsEl.textContent = [...selected].sort((a, b) => a.localeCompare(b, undefined, { numeric: true })).join(", ") || "None";
}

function markScenarioCompleted() {
  const solved = progress[currentTechnique];
  if (!solved.includes(currentScenarioIndex)) {
    solved.push(currentScenarioIndex);
    solved.sort((a, b) => a - b);
    saveProgress();
  }
}

function checkSelection() {
  const scenario = getScenario();
  const selectedArr = [...selected].sort();
  const targets = [...scenario.targets].sort();
  const ok = selectedArr.length === targets.length && selectedArr.every((v, i) => v === targets[i]);

  if (ok) {
    markScenarioCompleted();
    syncTechniqueSelect();
    renderCurriculum();
    feedbackEl.textContent = scenario.studyOnly ? "Study checkpoint complete." : "Correct! Great pattern spotting.";
    feedbackEl.className = "feedback ok";
    explanationEl.textContent = scenario.explanation;
    highlightTargets(scenario.targets);
  } else {
    feedbackEl.textContent = "Not quite. Use Hint, then try again.";
    feedbackEl.className = "feedback bad";
  }
}

function highlightTargets(targets) {
  document.querySelectorAll(".cell").forEach((cell) => {
    if (targets.includes(cell.dataset.key)) cell.classList.add("target");
  });
}

function showHint() {
  const scenario = getScenario();
  feedbackEl.textContent = `Hint: start with ${scenario.targets[0]}.`;
  feedbackEl.className = "feedback";
}

function nextScenario() {
  currentScenarioIndex = (currentScenarioIndex + 1) % TECHNIQUES[currentTechnique].scenarios.length;
  selected = new Set();
  renderScenario();
}

init();
