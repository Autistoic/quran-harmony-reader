import { getLetterConnection } from "./joining";
import type { LetterData } from "./types";

export type StrokeLetter = Pick<LetterData, "base" | "joining" | "nameKey"> &
  Partial<Pick<LetterData, "startOffset" | "endOffset">>;

/** The six letters that never join the next one (plus their hamza/wasla variants handled by joining data). */
export const NEVER_JOIN_NEXT = ["ا", "د", "ذ", "ر", "ز", "و"] as const;

const ALIF_FORMS = ["ا", "أ", "إ", "آ", "ٱ"];

export interface StrokeBlock {
  id: string;
  startIndex: number;
  endIndex: number;
  size: number;
  /** Index of the space-separated word this block belongs to. */
  wordIndex: number;
}

export type CutReason = "non-joining-letter" | "word-edge";

export interface StrokeCut {
  afterIndex: number;
  reason: CutReason;
  causeIndex: number;
  causeLetter: StrokeLetter;
}

/** True when a whitespace sits between letter i and i+1 in the source text. */
export function hasWordBreakBetween(letters: readonly StrokeLetter[], i: number, source?: string): boolean {
  if (!source) return false;
  const a = letters[i]?.endOffset;
  const b = letters[i + 1]?.startOffset;
  if (a === undefined || b === undefined) return false;
  return /\s/u.test(source.slice(a, b));
}

/** Letter i and i+1 are joined iff i can join next and i+1 can join previous (and no space between). */
export function joinsBetween(letters: readonly StrokeLetter[], i: number, source?: string): boolean {
  if (i < 0 || i >= letters.length - 1) return false;
  if (hasWordBreakBetween(letters, i, source)) return false;
  return getLetterConnection(letters, i).connectsNext;
}

/** Lam followed by a joined Alif renders as a single ligature glyph (لا). */
export function isLamAlifAt(letters: readonly StrokeLetter[], i: number, source?: string): boolean {
  return letters[i]?.base === "ل" && ALIF_FORMS.includes(letters[i + 1]?.base ?? "") && joinsBetween(letters, i, source);
}

export function buildStrokeBlocks(letters: readonly StrokeLetter[], source?: string): StrokeBlock[] {
  const blocks: StrokeBlock[] = [];
  let start = 0;
  let wordIndex = 0;
  for (let i = 0; i < letters.length; i++) {
    if (i === letters.length - 1 || !joinsBetween(letters, i, source)) {
      blocks.push({ id: `block-${blocks.length}`, startIndex: start, endIndex: i, size: i - start + 1, wordIndex });
      if (hasWordBreakBetween(letters, i, source)) wordIndex++;
      start = i + 1;
    }
  }
  return blocks;
}

export function buildCuts(letters: readonly StrokeLetter[], source?: string): StrokeCut[] {
  const cuts: StrokeCut[] = [];
  for (let i = 0; i < letters.length - 1; i++) {
    if (joinsBetween(letters, i, source)) continue;
    const reason: CutReason = hasWordBreakBetween(letters, i, source) ? "word-edge" : "non-joining-letter";
    const current = letters[i];
    const causeIndex = reason === "word-edge" || !current.joining.left ? i : i + 1;
    cuts.push({ afterIndex: i, reason, causeIndex, causeLetter: letters[causeIndex] });
  }
  return cuts;
}
