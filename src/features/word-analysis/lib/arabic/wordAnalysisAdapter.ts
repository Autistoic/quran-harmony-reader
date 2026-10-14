import type { LetterData, Joining, Position, Vowel } from "./types";

/** Presentation model consumed by the word-analysis UI. */
export interface WordAnalysisLetter {
  base: string;
  display: string;
  nameKey: string;
  consonantSound: string;
  marks: readonly string[];
  vowel?: Vowel;
  joining: Joining;
  position: Position;
  startOffset: number;
  endOffset: number;
}

/** Keep parser/domain data separate from the props shape used by the dialog UI. */
export function toWordAnalysisLetters(letters: readonly LetterData[]): WordAnalysisLetter[] {
  return letters.map((letter) => ({
    base: letter.base,
    display: letter.display,
    nameKey: letter.nameKey,
    consonantSound: letter.consonantSound,
    marks: [...letter.marks],
    vowel: letter.vowel ? { ...letter.vowel } : undefined,
    joining: { ...letter.joining },
    position: letter.position,
    startOffset: letter.startOffset,
    endOffset: letter.endOffset,
  }));
}
