// @vitest-environment node
import { describe, expect, it } from "vitest";
import { parseArabicWord } from "./parser";
import { buildCuts, buildStrokeBlocks, isLamAlifAt, joinsBetween } from "./strokeBlocks";

const sizes = (w: string) => buildStrokeBlocks(parseArabicWord(w), w).map((b) => b.size);

describe("strokeBlocks", () => {
  it("normal word: المغضوب → Alif wasla | 5-letter block | Ba", () => {
    const w = "ٱلْمَغْضُوبِ";
    const letters = parseArabicWord(w);
    expect(sizes(w)).toEqual([1, 5, 1]);
    const cuts = buildCuts(letters, w);
    expect(cuts.map((c) => c.afterIndex)).toEqual([0, 5]);
    expect(cuts.every((c) => c.reason === "non-joining-letter")).toBe(true);
    expect(cuts[1].causeLetter.base).toBe("و");
  });

  it("word starting with a non-joining letter: وإياك", () => {
    expect(sizes("وإياك")).toEqual([1, 1, 2, 1]);
  });

  it("consecutive non-joining letters: دار", () => {
    const letters = parseArabicWord("دار");
    expect(sizes("دار")).toEqual([1, 1, 1]);
    expect(buildCuts(letters).map((c) => c.causeLetter.base)).toEqual(["د", "ا"]);
  });

  it("lam-alif is one ligature inside one block", () => {
    const letters = parseArabicWord("لا");
    expect(joinsBetween(letters, 0)).toBe(true);
    expect(isLamAlifAt(letters, 0)).toBe(true);
    expect(sizes("لا")).toEqual([2]);
  });

  it("single letter: one block, no cuts", () => {
    const letters = parseArabicWord("ب");
    expect(sizes("ب")).toEqual([1]);
    expect(buildCuts(letters)).toEqual([]);
  });

  it("spaces reset the rail with a word-edge cut", () => {
    const w = "بسم الله";
    const letters = parseArabicWord(w);
    const cuts = buildCuts(letters, w);
    expect(cuts[0]).toMatchObject({ afterIndex: 2, reason: "word-edge" });
    expect(buildStrokeBlocks(letters, w).at(-1)?.wordIndex).toBe(1);
  });
});
