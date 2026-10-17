import type { WordAnalysisLetter } from "../arabic/wordAnalysisAdapter";

export type StrokeCutReason = "non-joining-letter" | "word-edge";

export interface StrokeBlock {
  /** One-based order in the word. */
  id: number;
  startIndex: number;
  endIndex: number;
  size: number;
}

export interface StrokeCut {
  afterIndex: number;
  reason: StrokeCutReason;
  /** The final logical letter before the break (including a word boundary). */
  causeLetter: WordAnalysisLetter;
}

export interface LetterWordRange {
  startIndex: number;
  endIndex: number;
}

function hasWhitespaceBetween(
  letters: readonly WordAnalysisLetter[],
  index: number,
  sourceWord?: string,
): boolean {
  if (!sourceWord) return false;
  const current = letters[index];
  const next = letters[index + 1];
  if (!current || !next) return false;
  return /\s/u.test(sourceWord.slice(current.endOffset, next.startOffset));
}

/**
 * Whether two adjacent logical letters share a stroke. `left` is the existing
 * parser metadata for joining to the next letter in reading order, while the
 * next letter's `right` metadata describes accepting that join.
 */
export function joinsBetween(
  index: number,
  letters: readonly WordAnalysisLetter[],
  sourceWord?: string,
): boolean {
  const current = letters[index];
  const next = letters[index + 1];
  return !!current
    && !!next
    && !hasWhitespaceBetween(letters, index, sourceWord)
    && current.joining.left
    && next.joining.right;
}

/** Split the parser's logical letters at source whitespace without changing the letter model. */
export function buildWordRanges(
  letters: readonly WordAnalysisLetter[],
  sourceWord: string,
): LetterWordRange[] {
  if (letters.length === 0) return [];

  const ranges: LetterWordRange[] = [];
  let startIndex = 0;
  for (let index = 0; index < letters.length - 1; index += 1) {
    if (hasWhitespaceBetween(letters, index, sourceWord)) {
      ranges.push({ startIndex, endIndex: index });
      startIndex = index + 1;
    }
  }
  ranges.push({ startIndex, endIndex: letters.length - 1 });
  return ranges;
}

/** Group maximal runs of joined letters; isolated letters remain size-one blocks. */
export function buildStrokeBlocks(
  letters: readonly WordAnalysisLetter[],
  sourceWord?: string,
): StrokeBlock[] {
  const blocks: StrokeBlock[] = [];
  if (letters.length === 0) return blocks;

  let startIndex = 0;
  for (let index = 0; index < letters.length - 1; index += 1) {
    if (!joinsBetween(index, letters, sourceWord)) {
      blocks.push({
        id: blocks.length + 1,
        startIndex,
        endIndex: index,
        size: index - startIndex + 1,
      });
      startIndex = index + 1;
    }
  }

  blocks.push({
    id: blocks.length + 1,
    startIndex,
    endIndex: letters.length - 1,
    size: letters.length - startIndex,
  });
  return blocks;
}

/** Describe each internal join break and each whitespace word boundary. */
export function buildCuts(
  letters: readonly WordAnalysisLetter[],
  sourceWord?: string,
): StrokeCut[] {
  const cuts: StrokeCut[] = [];
  for (let index = 0; index < letters.length - 1; index += 1) {
    const causeLetter = letters[index];
    if (hasWhitespaceBetween(letters, index, sourceWord)) {
      cuts.push({ afterIndex: index, reason: "word-edge", causeLetter });
    } else if (!joinsBetween(index, letters)) {
      cuts.push({ afterIndex: index, reason: "non-joining-letter", causeLetter });
    }
  }
  return cuts;
}
