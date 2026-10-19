// @vitest-environment node
import { describe, expect, it } from "vitest";
import { surahAlFatiha } from "@/data/surahs";
import { parseArabicWord } from "./parser";
import { toWordAnalysisLetters } from "./wordAnalysisAdapter";
import { NORMALIZED_OVERRIDES, getOverride, overrideKey } from "./wordOverrides";

/** Devuelve el trozo de transliteración asignado a cada letra. */
function segmentsOf(word: string, translit: string): string[] {
  const t = translit.normalize("NFC");
  return toWordAnalysisLetters(parseArabicWord(word), word, translit).map((letter) =>
    t.slice(letter.transliterationStartOffset, letter.transliterationEndOffset),
  );
}

/** Un override cuenta como "usado" solo si su cantidad de rangos coincide con las letras parseadas. */
function isOverrideUsed(word: string, translit: string, letterCount: number): boolean {
  const override = getOverride(word, translit);
  return override !== undefined && override.length === letterCount;
}

describe("toWordAnalysisLetters transliteration alignment", () => {
  it("aligns every Al-Fatiha word within its transliteration", () => {
    const results: Array<{ word: string; translit: string; status: "OVERRIDE" | "HEURISTIC" }> = [];

    for (const verse of surahAlFatiha.verses) {
      for (const wordTiming of verse.wordTimings) {
        const parsedLetters = parseArabicWord(wordTiming.word);
        const analysisLetters = toWordAnalysisLetters(parsedLetters, wordTiming.word, wordTiming.translit);
        const translitLength = wordTiming.translit.normalize("NFC").length;

        expect(analysisLetters, `analysis result for ${wordTiming.word}`).toHaveLength(parsedLetters.length);
        for (const letter of analysisLetters) {
          const start = letter.transliterationStartOffset;
          const end = letter.transliterationEndOffset;

          expect(start, `start offset for ${wordTiming.word} (${letter.base})`).toBeDefined();
          expect(end, `end offset for ${wordTiming.word} (${letter.base})`).toBeDefined();
          expect(start!).toBeGreaterThanOrEqual(0);
          expect(end!).toBeLessThanOrEqual(translitLength);
          expect(start!).toBeLessThanOrEqual(end!);
        }

        results.push({
          word: wordTiming.word,
          translit: wordTiming.translit,
          status: isOverrideUsed(wordTiming.word, wordTiming.translit, parsedLetters.length)
            ? "OVERRIDE"
            : "HEURISTIC",
        });
      }
    }

    console.table(results);
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((result) => result.status === "OVERRIDE")).toBe(true);
    expect(results.some((result) => result.status === "HEURISTIC")).toBe(true);
  });

  it("uses explicit registered ranges for d-dīn", () => {
    const word = "ٱلدِّينِ";
    const transliteration = "d-dīn";
    const ranges = getOverride(word, transliteration);

    expect(ranges, "override registered for d-dīn").toBeDefined();
    expect(segmentsOf(word, transliteration)).toEqual(["", "d-", "dī", "ī", "n"]);
    expect(ranges!).toHaveLength(parseArabicWord(word).length);
    // La dāl (dī) y la yā' (ī) comparten el carácter largo: mismo final, inicio distinto.
    expect(ranges![2][0]).toBeLessThan(ranges![3][0]);
    expect(ranges![2][1]).toBe(ranges![3][1]);
  });

  it("distinguishes the two transliterations of al-raḥmān", () => {
    const word = "ٱلرَّحْمَـٰنِ";

    expect(segmentsOf(word, "r-raḥmāni")).toEqual(["", "r-", "ra", "ḥ", "mā", "ni"]);
    expect(segmentsOf(word, "ar-raḥmāni")).toEqual(["a", "r-", "ra", "ḥ", "mā", "ni"]);
  });

  it("uses heuristic alignment for a regular word without an override", () => {
    const word = "بِسْمِ";
    const transliteration = "bismi";

    expect(getOverride(word, transliteration)).toBeUndefined();
    expect(segmentsOf(word, transliteration)).toEqual(["bi", "s", "mi"]);
  });

  it("does not apply an override registered for a different transliteration", () => {
    const word = "ٱلرَّحْمَـٰنِ";

    expect(getOverride(word, "r-raḥmāni")).toBeDefined();
    expect(getOverride(word, "something-else")).toBeUndefined();
  });

  it("falls back to heuristic alignment when a registered range is invalid", () => {
    const word = "بِسْمِ";
    const transliteration = "bismi";
    const key = overrideKey(word, transliteration);
    const registry = NORMALIZED_OVERRIDES as Map<string, readonly (readonly [number, number])[]>;

    try {
      for (const invalidRanges of [
        [[0, 1]],
        [[0, 1], [1, 99], [2, 3]],
      ] as const) {
        registry.set(key, invalidRanges);
        expect(segmentsOf(word, transliteration)).toEqual(["bi", "s", "mi"]);
      }
    } finally {
      registry.delete(key);
    }
  });
});

describe("Override invariants", () => {
  it("every registered override matches its word and transliteration", () => {
    for (const [key, ranges] of NORMALIZED_OVERRIDES) {
      const i = key.lastIndexOf("|");
      const word = key.slice(0, i);
      const translit = key.slice(i + 1);
      const letters = parseArabicWord(word);

      expect(ranges, `range count for ${key}`).toHaveLength(letters.length);

      for (const [start, end] of ranges) {
        expect(start, `start in ${key}`).toBeGreaterThanOrEqual(0);
        expect(start, `start<=end in ${key}`).toBeLessThanOrEqual(end);
        expect(end, `end within translit in ${key}`).toBeLessThanOrEqual(translit.length);
      }

      // Los inicios no deben retroceder: el solapamiento solo se permite hacia el final del rango previo.
      for (let n = 1; n < ranges.length; n++) {
        expect(ranges[n][0], `monotonic start at ${n} in ${key}`).toBeGreaterThanOrEqual(ranges[n - 1][0]);
      }

      // La unión de los rangos debe llegar hasta el final de la transliteración.
      const maxEnd = Math.max(...ranges.map(([, end]) => end));
      expect(maxEnd, `coverage of ${key}`).toBe(translit.length);
    }
  });

  it("every override used in Al-Fatiha is actually applied (not silently discarded)", () => {
    for (const verse of surahAlFatiha.verses) {
      for (const wt of verse.wordTimings) {
        const override = getOverride(wt.word, wt.translit);
        if (!override) continue;
        expect(override, `override length for ${wt.word} (${wt.translit})`).toHaveLength(
          parseArabicWord(wt.word).length,
        );
      }
    }
  });
});

describe("Batch Word Analysis & Substring Slicing Test", () => {
  it("should extract and display the resulting transliteration segments for each letter", () => {
    const detailedReport: Array<{
      word: string;
      translit: string;
      status: string;
      segments: string;
    }> = [];

    surahAlFatiha.verses.forEach((verse) => {
      verse.wordTimings.forEach((wt) => {
        const letters = parseArabicWord(wt.word);
        const letterSegments = segmentsOf(wt.word, wt.translit).map((slice) =>
          slice === "" ? "[empty]" : `"${slice}"`,
        );

        detailedReport.push({
          word: wt.word,
          translit: wt.translit,
          status: isOverrideUsed(wt.word, wt.translit, letters.length) ? "OVERRIDE" : "HEURISTIC",
          segments: letterSegments.join(" | "),
        });
      });
    });

    console.table(detailedReport);
    expect(detailedReport.length).toBeGreaterThan(0);
  });
});