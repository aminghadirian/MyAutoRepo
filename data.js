// data.js — Sudoku Technique Trainer: all static data and pure utilities
// ES modules are always in strict mode.

// Four different Sudoku boards assigned by difficulty tier so each technique
// group gets a visually distinct puzzle backdrop.
export const BOARDS = {
  A: "530070000600195000098000060800060003400803001700020006060000280000419005000080079",
  B: "003020600900305001001806400008102900700000008006708200002609500800203009005010300",
  C: "200080300060070084030500209000105408000000000402706000301007040720040060004010003",
  D: "000000907000420180000705026100904000050000040000507009920108000034059000507000000",
};

/** Build a scenario object. */
export function sc(name, instruction, board, candidates, targets, explanation) {
  return { name, instruction, board, candidates, targets, explanation };
}

/** Parse a cell key like "r3c7" → { row: 2, col: 6 } (0-indexed). */
export function parseCellKey(key) {
  const m = key.match(/^r(\d+)c(\d+)$/);
  return { row: Number(m[1]) - 1, col: Number(m[2]) - 1 };
}

export const METHOD_ORDER = [
  "nakedSingle",
  "hiddenSingle",
  "lockedCandidates",
  "nakedPair",
  "hiddenPair",
  "xWing",
  "xyWing",
  "swordfish",
];

export const METHODS = {
  nakedSingle: {
    label: "Naked Single",
    level: "Foundation",
    theory: "A naked single is a cell with only one possible digit.",
    puzzles: [
      sc("Example 1", "Pencil in the single candidate for the naked single cell.", BOARDS.A, { r5c5: "5", r4c4: "5,7,9", r4c6: "1,4,7" }, ["r5c5"], "r5c5 can only be 5 — all other digits are eliminated by row 5, column 5, or box 5."),
      sc("Example 2", "Pencil in the single candidate for the naked single cell.", BOARDS.A, { r7c6: "7", r7c5: "3,5", r6c6: "1,4" }, ["r7c6"], "r7c6 can only be 7 — every other digit appears in row 7, column 6, or box 8."),
      sc("Example 3", "Pencil in the single candidate for the naked single cell.", BOARDS.A, { r7c9: "4", r6c8: "4,5,9" }, ["r7c9"], "r7c9 is forced to 4 — all other digits are excluded by row 7, column 9, or box 9."),
    ],
  },
  hiddenSingle: {
    label: "Hidden Single",
    level: "Foundation",
    theory: "A hidden single is the only place for a digit in a unit.",
    puzzles: [
      sc("Row hidden single", "Pencil 5 into the hidden single cell in row 3.", BOARDS.A, { r3c7: "1,3,4,5,7", r3c5: "3,4", r3c9: "2,4,7" }, ["r3c7"], "r3c7 is the only cell in row 3 that can hold 5 — no other empty cell in that row has 5 as a candidate."),
      sc("Column hidden single", "Pencil 4 into the hidden single cell in column 5.", BOARDS.A, { r3c5: "3,4", r7c5: "3,5", r5c5: "5" }, ["r3c5"], "r3c5 is the only cell in column 5 that can hold 4 — check every other empty cell in the column."),
      sc("Box hidden single", "Pencil 8 into the hidden single cell in box 7.", BOARDS.A, { r8c2: "2,7,8", r8c1: "2,3", r8c3: "2,3,7" }, ["r8c2"], "r8c2 is the only cell in box 7 (bottom-left) that can hold 8."),
    ],
  },
  lockedCandidates: {
    label: "Locked Candidates",
    level: "Beginner",
    theory: "If a candidate in a box is locked to one row/column, eliminate it outside the box.",
    puzzles: [
      sc("Pointing pair", "Pencil digit 6 into the two cells that lock it.", BOARDS.B, { r1c4: "2,6", r1c6: "2,4,6,8", r2c4: "2,3,4" }, ["r1c4", "r1c6"], "6 is locked in row 1 for that box."),
      sc("Pointing triple", "Pencil the candidate into the three locked cells in row 3.", BOARDS.B, { r3c4: "2,3", r3c5: "3,6", r3c6: "2,4,6" }, ["r3c4", "r3c5", "r3c6"], "Candidate is confined to one row inside the box."),
      sc("Claiming", "Pencil the candidate into the two claiming cells.", BOARDS.B, { r4c1: "2,8", r5c1: "1,8", r6c1: "3,9" }, ["r4c1", "r5c1"], "Candidate in line is claimed by a single box."),
    ],
  },
  nakedPair: {
    label: "Naked Pair",
    level: "Beginner",
    theory: "Two cells sharing the same two candidates form a naked pair.",
    puzzles: [
      sc("Row pair", "Pencil 3 and 6 into both naked pair cells.", BOARDS.B, { r7c3: "3,6", r7c6: "3,6", r7c1: "1,3,6" }, ["r7c3", "r7c6"], "These two cells lock 3/6."),
      sc("Column pair", "Pencil 1 and 7 into both naked pair cells.", BOARDS.B, { r2c8: "1,7", r5c8: "1,7", r8c8: "2,7" }, ["r2c8", "r5c8"], "Column pair enables eliminations."),
      sc("Box pair", "Pencil the pair candidates into both naked pair cells in this box.", BOARDS.B, { r1c7: "2,9", r1c8: "2,9", r2c9: "2,4,9" }, ["r1c7", "r1c8"], "Exact two-digit match forms a pair."),
    ],
  },
  hiddenPair: {
    label: "Hidden Pair",
    level: "Intermediate",
    theory: "Two digits that only fit in two cells create a hidden pair.",
    puzzles: [
      sc("Row hidden pair", "Pencil 2 and 7 into both hidden pair cells.", BOARDS.C, { r4c2: "2,5,7", r4c9: "2,5,7", r4c6: "1,2,7" }, ["r4c2", "r4c9"], "2 and 7 are restricted to these cells."),
      sc("Column hidden pair", "Pencil 1 and 9 into both hidden pair cells in column 3.", BOARDS.C, { r2c3: "1,5,9", r5c3: "1,6,9", r8c3: "2,6,7" }, ["r2c3", "r5c3"], "Digits 1 and 9 are hidden as a pair."),
      sc("Box hidden pair", "Pencil 1 and 7 into both hidden pair cells in the center box.", BOARDS.C, { r4c4: "1,5,7", r5c5: "2,8", r6c6: "1,2,7" }, ["r4c4", "r6c6"], "Only those cells can hold 1 and 7."),
    ],
  },
  xWing: {
    label: "X-Wing",
    level: "Intermediate",
    theory: "Two rows/columns with matching candidate positions form an X-Wing.",
    puzzles: [
      sc("X-Wing #1", "Pencil the candidates into all four X-Wing corner cells for 6.", BOARDS.C, { r2c3: "6,7", r2c8: "4,6", r7c3: "3,6", r7c8: "1,6" }, ["r2c3", "r2c8", "r7c3", "r7c8"], "Rows 2 and 7 align in columns 3 and 8."),
      sc("X-Wing #2", "Pencil the candidates into all four corner cells for candidate 4.", BOARDS.C, { r2c2: "2,4,7", r2c7: "3,4,8", r8c2: "2,4,8", r8c7: "2,4,6" }, ["r2c2", "r2c7", "r8c2", "r8c7"], "Matching row positions create the wing."),
      sc("X-Wing #3", "Pencil the candidates into the X-Wing corners in columns 2 and 8.", BOARDS.C, { r1c2: "1,4,6", r1c8: "1,4", r5c2: "1,4,5", r5c8: "2,6,9" }, ["r1c2", "r1c8", "r5c2", "r5c8"], "Two-row two-column cycle is formed."),
    ],
  },
  xyWing: {
    label: "XY-Wing",
    level: "Advanced",
    theory: "Pivot (X,Y) with wings (X,Z) and (Y,Z) creates Z-elimination.",
    puzzles: [
      sc("XY-Wing #1", "Pencil the candidates into the pivot and both wing cells.", BOARDS.D, { r5c5: "2,8", r5c8: "2,6", r2c5: "6,8" }, ["r5c5", "r5c8", "r2c5"], "Classic XY-Wing structure."),
      sc("XY-Wing #2", "Pencil the candidates into the pivot and both wing cells.", BOARDS.D, { r4c4: "1,7", r4c6: "1,5", r6c4: "5,7" }, ["r4c4", "r4c6", "r6c4"], "Pivot shares one candidate with each wing."),
      sc("XY-Wing #3", "Pencil the candidates into the pivot and both wing cells.", BOARDS.D, { r2c2: "4,9", r2c5: "4,6", r5c2: "6,9" }, ["r2c2", "r2c5", "r5c2"], "Wings connect through the pivot."),
    ],
  },
  swordfish: {
    label: "Swordfish",
    level: "Advanced",
    theory: "A 3-row/3-column fish pattern that extends X-Wing logic.",
    puzzles: [
      sc("Swordfish #1", "Pencil the candidates into all 6 Swordfish base cells.", BOARDS.D, { r2c2: "2,4,7", r2c7: "3,4,8", r5c2: "1,4,5", r5c7: "4,5,9", r8c2: "2,4,8", r8c7: "2,4,6" }, ["r2c2", "r2c7", "r5c2", "r5c7", "r8c2", "r8c7"], "Three rows share the same candidate columns."),
      sc("Swordfish #2", "Pencil the candidates into all 6 base cells for candidate 6.", BOARDS.D, { r1c3: "4,6", r1c8: "1,6", r4c3: "1,6", r4c8: "4,6,8", r7c3: "3,6", r7c8: "1,6" }, ["r1c3", "r1c8", "r4c3", "r4c8", "r7c3", "r7c8"], "Candidate lines up across three rows."),
      sc("Swordfish #3", "Pencil the candidates into all 6 fish base cells.", BOARDS.D, { r2c1: "1,4,9", r2c5: "6,8", r5c1: "1,2,9", r5c5: "2,8", r8c1: "2,3,9", r8c5: "5,8" }, ["r2c1", "r2c5", "r5c1", "r5c5", "r8c1", "r8c5"], "Another 3-row fish arrangement."),
    ],
  },
};

export const PROGRESS_KEY = "sudoku-method-3examples-v1";
export const SESSION_KEY  = "sudoku-method-session-v2";
export const MARKS_KEY    = "sudoku-method-marks-v1";
export const THEME_KEY    = "sudoku-theme-v1";
