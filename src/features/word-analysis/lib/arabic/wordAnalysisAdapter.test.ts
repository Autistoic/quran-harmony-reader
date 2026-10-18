// @vitest-environment node
import { describe, expect, it } from "vitest";
import { surahAlFatiha } from "@/data/surahs";
import { parseArabicWord } from "./parser";
import { toWordAnalysisLetters } from "./wordAnalysisAdapter";
import { WORD_SEGMENT_OVERRIDES } from "./wordOverrides";

describe("toWordAnalysisLetters transliteration alignment", () => {
  it("aligns every Al-Fatiha word within its transliteration", () => {
    const results: Array<{ word: string; translit: string; status: "OVERRIDE" | "HEURISTIC" }> = [];

    for (const verse of surahAlFatiha.verses) {
      for (const wordTiming of verse.wordTimings) {
        const parsedLetters = parseArabicWord(wordTiming.word);
        const analysisLetters = toWordAnalysisLetters(parsedLetters, wordTiming.word, wordTiming.translit);
        const usedOverride = Object.prototype.hasOwnProperty.call(WORD_SEGMENT_OVERRIDES, wordTiming.word);

        expect(analysisLetters, `analysis result for ${wordTiming.word}`).toHaveLength(parsedLetters.length);
        for (const letter of analysisLetters) {
          const start = letter.transliterationStartOffset;
          const end = letter.transliterationEndOffset;

          expect(start, `start offset for ${wordTiming.word} (${letter.base})`).toBeDefined();
          expect(end, `end offset for ${wordTiming.word} (${letter.base})`).toBeDefined();
          expect(start!).toBeGreaterThanOrEqual(0);
          expect(end!).toBeLessThanOrEqual(wordTiming.translit.length);
          expect(start!).toBeLessThanOrEqual(end!);
        }

        results.push({
          word: wordTiming.word,
          translit: wordTiming.translit,
          status: usedOverride ? "OVERRIDE" : "HEURISTIC",
        });
      }
    }

    console.table(results);
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((result) => result.status === "OVERRIDE")).toBe(true);
    expect(results.some((result) => result.status === "HEURISTIC")).toBe(true);
  });

  it("uses the registered segments for a solar-letter word", () => {
    const word = "ٱلرَّحْمَـٰنِ";
    const transliteration = "r-raḥmāni";
    const segments = WORD_SEGMENT_OVERRIDES[word];
    const analysisLetters = toWordAnalysisLetters(parseArabicWord(word), word, transliteration);

    expect(analysisLetters).toHaveLength(segments.length);
    expect(analysisLetters.map((letter) => transliteration.slice(
      letter.transliterationStartOffset,
      letter.transliterationEndOffset,
    ))).toEqual(["", "r", "ra", "ḥ", "mā", "ni"]);
  });

  it("uses heuristic alignment for a regular word without an override", () => {
    const word = "بِسْمِ";
    const transliteration = "bismi";
    const analysisLetters = toWordAnalysisLetters(parseArabicWord(word), word, transliteration);

    expect(Object.prototype.hasOwnProperty.call(WORD_SEGMENT_OVERRIDES, word)).toBe(false);
    expect(analysisLetters.map((letter) => transliteration.slice(
      letter.transliterationStartOffset,
      letter.transliterationEndOffset,
    ))).toEqual(["bi", "s", "mi"]);
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
        const analysisLetters = toWordAnalysisLetters(letters, wt.word, wt.translit);

        // Extraemos el trozo de transliteración que le tocó a cada letra usando los offsets
        const letterSegments = analysisLetters.map((l) => {
          const start = l.transliterationStartOffset ?? 0;
          const end = l.transliterationEndOffset ?? 0;
          const slice = wt.translit.slice(start, end);
          // Representamos visualmente los huecos vacíos (como la Lam solar) con [empty]
          return slice === "" ? "[empty]" : `"${slice}"`;
        });

        const usedOverride = Boolean(WORD_SEGMENT_OVERRIDES[wt.word]);

        detailedReport.push({
          word: wt.word,
          translit: wt.translit,
          status: usedOverride ? "OVERRIDE" : "HEURISTIC",
          segments: letterSegments.join(" | "),
        });
      });
    });

    console.table(detailedReport);
    expect(detailedReport.length).toBeGreaterThan(0);
  });
});
