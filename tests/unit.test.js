// unit.test.js — tests for pure functions in data.js
import { parseCellKey, sc, METHOD_ORDER, METHODS, BOARDS } from "../data.js";

// ── parseCellKey ──────────────────────────────────────────────────────────────
describe("parseCellKey", () => {
  test("r1c1 → { row: 0, col: 0 }", () => {
    expect(parseCellKey("r1c1")).toEqual({ row: 0, col: 0 });
  });
  test("r9c9 → { row: 8, col: 8 }", () => {
    expect(parseCellKey("r9c9")).toEqual({ row: 8, col: 8 });
  });
  test("r5c3 → { row: 4, col: 2 }", () => {
    expect(parseCellKey("r5c3")).toEqual({ row: 4, col: 2 });
  });
  test("r3c7 → { row: 2, col: 6 }", () => {
    expect(parseCellKey("r3c7")).toEqual({ row: 2, col: 6 });
  });
  test("row and col are numbers, not strings", () => {
    const { row, col } = parseCellKey("r2c8");
    expect(typeof row).toBe("number");
    expect(typeof col).toBe("number");
  });
});

// ── sc helper ─────────────────────────────────────────────────────────────────
describe("sc helper", () => {
  test("produces correct scenario shape", () => {
    const result = sc("Name", "Do this.", BOARDS.A, { r1c1: "1,2" }, ["r1c1"], "Because.");
    expect(result).toEqual({
      name:        "Name",
      instruction: "Do this.",
      board:       BOARDS.A,
      candidates:  { r1c1: "1,2" },
      targets:     ["r1c1"],
      explanation: "Because.",
    });
  });
  test("preserves multiple targets", () => {
    const targets = ["r1c1", "r2c3", "r5c5"];
    const result  = sc("T", "I", BOARDS.B, {}, targets, "E");
    expect(result.targets).toEqual(targets);
  });
});

// ── BOARDS ────────────────────────────────────────────────────────────────────
describe("BOARDS", () => {
  const keys = ["A", "B", "C", "D"];
  test.each(keys)("board %s is exactly 81 characters", (key) => {
    expect(BOARDS[key]).toHaveLength(81);
  });
  test.each(keys)("board %s contains only digits 0–9", (key) => {
    expect(BOARDS[key]).toMatch(/^[0-9]{81}$/);
  });
  test("all four boards are distinct", () => {
    const values = Object.values(BOARDS);
    const unique = new Set(values);
    expect(unique.size).toBe(4);
  });
});

// ── METHOD_ORDER ──────────────────────────────────────────────────────────────
describe("METHOD_ORDER", () => {
  test("contains exactly 8 techniques", () => {
    expect(METHOD_ORDER).toHaveLength(8);
  });
  test("all keys exist in METHODS", () => {
    METHOD_ORDER.forEach((key) => {
      expect(METHODS).toHaveProperty(key);
    });
  });
  test("has no duplicate entries", () => {
    expect(new Set(METHOD_ORDER).size).toBe(METHOD_ORDER.length);
  });
});

// ── METHODS structure ─────────────────────────────────────────────────────────
describe("METHODS structure", () => {
  test("every method has label, level, theory and puzzles", () => {
    METHOD_ORDER.forEach((key) => {
      expect(METHODS[key]).toHaveProperty("label");
      expect(METHODS[key]).toHaveProperty("level");
      expect(METHODS[key]).toHaveProperty("theory");
      expect(METHODS[key]).toHaveProperty("puzzles");
    });
  });

  test("every method has exactly 3 puzzles", () => {
    METHOD_ORDER.forEach((key) => {
      expect(METHODS[key].puzzles).toHaveLength(3);
    });
  });

  test("every puzzle board is 81 characters of digits", () => {
    METHOD_ORDER.forEach((key) => {
      METHODS[key].puzzles.forEach((puzzle) => {
        expect(puzzle.board).toHaveLength(81);
        expect(puzzle.board).toMatch(/^[0-9]{81}$/);
      });
    });
  });

  test("every puzzle has name, instruction, candidates, targets, explanation", () => {
    METHOD_ORDER.forEach((key) => {
      METHODS[key].puzzles.forEach((puzzle) => {
        expect(puzzle).toHaveProperty("name");
        expect(puzzle).toHaveProperty("instruction");
        expect(puzzle).toHaveProperty("candidates");
        expect(puzzle).toHaveProperty("targets");
        expect(puzzle).toHaveProperty("explanation");
      });
    });
  });

  test("every puzzle has at least one target", () => {
    METHOD_ORDER.forEach((key) => {
      METHODS[key].puzzles.forEach((puzzle) => {
        expect(puzzle.targets.length).toBeGreaterThan(0);
      });
    });
  });

  test("every target is a valid r#c# key", () => {
    const pattern = /^r[1-9]c[1-9]$/;
    METHOD_ORDER.forEach((key) => {
      METHODS[key].puzzles.forEach((puzzle) => {
        puzzle.targets.forEach((target) => {
          expect(target).toMatch(pattern);
        });
      });
    });
  });

  test("every candidate key is a valid r#c# key", () => {
    const pattern = /^r[1-9]c[1-9]$/;
    METHOD_ORDER.forEach((key) => {
      METHODS[key].puzzles.forEach((puzzle) => {
        Object.keys(puzzle.candidates).forEach((cellKey) => {
          expect(cellKey).toMatch(pattern);
        });
      });
    });
  });

  test("levels are one of the four expected values", () => {
    const validLevels = new Set(["Foundation", "Beginner", "Intermediate", "Advanced"]);
    METHOD_ORDER.forEach((key) => {
      expect(validLevels.has(METHODS[key].level)).toBe(true);
    });
  });

  test("Foundation and Beginner techniques use boards A or B", () => {
    ["nakedSingle", "hiddenSingle", "lockedCandidates", "nakedPair"].forEach((key) => {
      METHODS[key].puzzles.forEach((puzzle) => {
        expect([BOARDS.A, BOARDS.B]).toContain(puzzle.board);
      });
    });
  });

  test("Intermediate and Advanced techniques use boards C or D", () => {
    ["hiddenPair", "xWing", "xyWing", "swordfish"].forEach((key) => {
      METHODS[key].puzzles.forEach((puzzle) => {
        expect([BOARDS.C, BOARDS.D]).toContain(puzzle.board);
      });
    });
  });
});
