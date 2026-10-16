// @vitest-environment node
import { describe, expect, it } from "vitest";
import { parseArabicWord } from "../arabic/parser";
import { buildCuts, buildStrokeBlocks, buildWordRanges, joinsBetween } from "./strokeBlocks";

describe("stroke block utilities", () => {
  it("groups a normally joining word into one continuous block", () => {
    const letters = parseArabicWord("بمغ");

    expect(letters).toHaveLength(3);
    expect(buildStrokeBlocks(letters)).toEqual([
      { id: 1, startIndex: 0, endIndex: 2, size: 3 },
    ]);
    expect(buildCuts(letters)).toEqual([]);
    expect(joinsBetween(0, letters)).toBe(true);
  });

  it("splits المغضوب into three blocks with breaks after Alif wasla and Waw", () => {
    const letters = parseArabicWord("ٱلمغضوب");

    expect(buildStrokeBlocks(letters)).toEqual([
      { id: 1, startIndex: 0, endIndex: 0, size: 1 },
      { id: 2, startIndex: 1, endIndex: 5, size: 5 },
      { id: 3, startIndex: 6, endIndex: 6, size: 1 },
    ]);
    expect(buildCuts(letters).map(({ afterIndex, reason, causeLetter }) => ({
      afterIndex,
      reason,
      cause: causeLetter.base,
    }))).toEqual([
      { afterIndex: 0, reason: "non-joining-letter", cause: "ٱ" },
      { afterIndex: 5, reason: "non-joining-letter", cause: "و" },
    ]);
  });

  it("keeps consecutive non-joining letters in separate single-letter blocks", () => {
    const letters = parseArabicWord("اربا");

    expect(buildStrokeBlocks(letters)).toEqual([
      { id: 1, startIndex: 0, endIndex: 0, size: 1 },
      { id: 2, startIndex: 1, endIndex: 1, size: 1 },
      { id: 3, startIndex: 2, endIndex: 3, size: 2 },
    ]);
    expect(buildCuts(letters).map((cut) => cut.afterIndex)).toEqual([0, 1]);
  });

  it("keeps Lam-Alif as two joined logical letters for the shared rail glyph", () => {
    const letters = parseArabicWord("لا");

    expect(letters.map(({ base }) => base)).toEqual(["ل", "ا"]);
    expect(joinsBetween(0, letters)).toBe(true);
    expect(buildStrokeBlocks(letters)).toEqual([
      { id: 1, startIndex: 0, endIndex: 1, size: 2 },
    ]);
  });

  it("creates one block and no cuts for a single letter", () => {
    const letters = parseArabicWord("م");

    expect(buildStrokeBlocks(letters)).toEqual([
      { id: 1, startIndex: 0, endIndex: 0, size: 1 },
    ]);
    expect(buildCuts(letters)).toEqual([]);
  });

  it("resets blocks at source whitespace while preserving the word-edge cut", () => {
    const word = "بب بب";
    const letters = parseArabicWord(word);

    expect(buildWordRanges(letters, word)).toEqual([
      { startIndex: 0, endIndex: 1 },
      { startIndex: 2, endIndex: 3 },
    ]);
    expect(buildStrokeBlocks(letters, word)).toEqual([
      { id: 1, startIndex: 0, endIndex: 1, size: 2 },
      { id: 2, startIndex: 2, endIndex: 3, size: 2 },
    ]);
    expect(buildCuts(letters, word).map(({ afterIndex, reason }) => ({ afterIndex, reason }))).toEqual([
      { afterIndex: 1, reason: "word-edge" },
    ]);
  });
});
