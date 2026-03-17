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
      sc("Example 1", "Select the naked single.", BOARDS.A, { r1c3: "4", r1c4: "2,6" }, ["r1c3"], "r1c3 is forced to 4."),
      sc("Example 2", "Select the naked single.", BOARDS.A, { r2c2: "7", r2c3: "2,7" }, ["r2c2"], "r2c2 has one candidate."),
      sc("Example 3", "Select the naked single.", BOARDS.A, { r8c1: "2", r8c3: "2,6" }, ["r8c1"], "r8c1 is immediately solved."),
    ],
  },
  hiddenSingle: {
    label: "Hidden Single",
    level: "Foundation",
    theory: "A hidden single is the only place for a digit in a unit.",
    puzzles: [
      sc("Row hidden single", "Select the hidden single for 9.", BOARDS.A, { r4c2: "2,5,7", r4c4: "5,7,9", r4c6: "1,2,7" }, ["r4c4"], "Only r4c4 can take 9."),
      sc("Column hidden single", "Select the hidden single for 1 in column 2.", BOARDS.A, { r1c2: "3,5", r2c2: "3,4", r5c2: "1,4,9" }, ["r5c2"], "1 appears only at r5c2 in the column."),
      sc("Box hidden single", "Select the hidden single in box 1.", BOARDS.A, { r1c1: "1,3,5", r1c2: "3,5", r2c1: "1,4,9" }, ["r2c1"], "In this box, only r2c1 can be 9."),
    ],
  },
  lockedCandidates: {
    label: "Locked Candidates",
    level: "Beginner",
    theory: "If a candidate in a box is locked to one row/column, eliminate it outside the box.",
    puzzles: [
      sc("Pointing pair", "Select the two cells that lock digit 6.", BOARDS.B, { r1c4: "2,6", r1c6: "2,4,6,8", r2c4: "2,3,4" }, ["r1c4", "r1c6"], "6 is locked in row 1 for that box."),
      sc("Pointing triple", "Select the three locked cells in row 3.", BOARDS.B, { r3c4: "2,3", r3c5: "3,6", r3c6: "2,4,6" }, ["r3c4", "r3c5", "r3c6"], "Candidate is confined to one row inside the box."),
      sc("Claiming", "Select the two cells showing a claiming setup.", BOARDS.B, { r4c1: "2,8", r5c1: "1,8", r6c1: "3,9" }, ["r4c1", "r5c1"], "Candidate in line is claimed by a single box."),
    ],
  },
  nakedPair: {
    label: "Naked Pair",
    level: "Beginner",
    theory: "Two cells sharing the same two candidates form a naked pair.",
    puzzles: [
      sc("Row pair", "Select the naked pair (3,6).", BOARDS.B, { r7c3: "3,6", r7c6: "3,6", r7c1: "1,3,6" }, ["r7c3", "r7c6"], "These two cells lock 3/6."),
      sc("Column pair", "Select the naked pair (1,7).", BOARDS.B, { r2c8: "1,7", r5c8: "1,7", r8c8: "2,7" }, ["r2c8", "r5c8"], "Column pair enables eliminations."),
      sc("Box pair", "Select the naked pair in this box.", BOARDS.B, { r1c7: "2,9", r1c8: "2,9", r2c9: "2,4,9" }, ["r1c7", "r1c8"], "Exact two-digit match forms a pair."),
    ],
  },
  hiddenPair: {
    label: "Hidden Pair",
    level: "Intermediate",
    theory: "Two digits that only fit in two cells create a hidden pair.",
    puzzles: [
      sc("Row hidden pair", "Select the hidden pair cells for 2/7.", BOARDS.C, { r4c2: "2,5,7", r4c9: "2,5,7", r4c6: "1,2,7" }, ["r4c2", "r4c9"], "2 and 7 are restricted to these cells."),
      sc("Column hidden pair", "Select the hidden pair cells in column 3.", BOARDS.C, { r2c3: "1,5,9", r5c3: "1,6,9", r8c3: "2,6,7" }, ["r2c3", "r5c3"], "Digits 1 and 9 are hidden as a pair."),
      sc("Box hidden pair", "Select the hidden pair in the center box.", BOARDS.C, { r4c4: "1,5,7", r5c5: "2,8", r6c6: "1,2,7" }, ["r4c4", "r6c6"], "Only those cells can hold 1 and 7."),
    ],
  },
  xWing: {
    label: "X-Wing",
    level: "Intermediate",
    theory: "Two rows/columns with matching candidate positions form an X-Wing.",
    puzzles: [
      sc("X-Wing #1", "Select the four X-Wing corners for 6.", BOARDS.C, { r2c3: "6,7", r2c8: "4,6", r7c3: "3,6", r7c8: "1,6" }, ["r2c3", "r2c8", "r7c3", "r7c8"], "Rows 2 and 7 align in columns 3 and 8."),
      sc("X-Wing #2", "Select the four corners for candidate 4.", BOARDS.C, { r2c2: "2,4,7", r2c7: "3,4,8", r8c2: "2,4,8", r8c7: "2,4,6" }, ["r2c2", "r2c7", "r8c2", "r8c7"], "Matching row positions create the wing."),
      sc("X-Wing #3", "Select the X-Wing corners in columns 2 and 8.", BOARDS.C, { r1c2: "1,4,6", r1c8: "1,4", r5c2: "1,4,5", r5c8: "2,6,9" }, ["r1c2", "r1c8", "r5c2", "r5c8"], "Two-row two-column cycle is formed."),
    ],
  },
  xyWing: {
    label: "XY-Wing",
    level: "Advanced",
    theory: "Pivot (X,Y) with wings (X,Z) and (Y,Z) creates Z-elimination.",
    puzzles: [
      sc("XY-Wing #1", "Select pivot + two wings.", BOARDS.D, { r5c5: "2,8", r5c8: "2,6", r2c5: "6,8" }, ["r5c5", "r5c8", "r2c5"], "Classic XY-Wing structure."),
      sc("XY-Wing #2", "Select pivot + two wings.", BOARDS.D, { r4c4: "1,7", r4c6: "1,5", r6c4: "5,7" }, ["r4c4", "r4c6", "r6c4"], "Pivot shares one candidate with each wing."),
      sc("XY-Wing #3", "Select pivot + two wings.", BOARDS.D, { r2c2: "4,9", r2c5: "4,6", r5c2: "6,9" }, ["r2c2", "r2c5", "r5c2"], "Wings connect through the pivot."),
    ],
  },
  swordfish: {
    label: "Swordfish",
    level: "Advanced",
    theory: "A 3-row/3-column fish pattern that extends X-Wing logic.",
    puzzles: [
      sc("Swordfish #1", "Select the 6 base cells.", BOARDS.D, { r2c2: "2,4,7", r2c7: "3,4,8", r5c2: "1,4,5", r5c7: "4,5,9", r8c2: "2,4,8", r8c7: "2,4,6" }, ["r2c2", "r2c7", "r5c2", "r5c7", "r8c2", "r8c7"], "Three rows share the same candidate columns."),
      sc("Swordfish #2", "Select the 6 base cells for candidate 6.", BOARDS.D, { r1c3: "4,6", r1c8: "1,6", r4c3: "1,6", r4c8: "4,6,8", r7c3: "3,6", r7c8: "1,6" }, ["r1c3", "r1c8", "r4c3", "r4c8", "r7c3", "r7c8"], "Candidate lines up across three rows."),
      sc("Swordfish #3", "Select the 6 fish base cells.", BOARDS.D, { r2c1: "1,4,9", r2c5: "6,8", r5c1: "1,2,9", r5c5: "2,8", r8c1: "2,3,9", r8c5: "5,8" }, ["r2c1", "r2c5", "r5c1", "r5c5", "r8c1", "r8c5"], "Another 3-row fish arrangement."),
    ],
  },
};

export const PROGRESS_KEY = "sudoku-method-3examples-v1";
export const SESSION_KEY  = "sudoku-method-session-v2";
export const MARKS_KEY    = "sudoku-method-marks-v1";
export const THEME_KEY    = "sudoku-theme-v1";
