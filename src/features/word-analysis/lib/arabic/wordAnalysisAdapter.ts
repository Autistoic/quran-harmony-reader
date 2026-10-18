import type { LetterData, Joining, Position, Vowel } from "./types";
import { WORD_SEGMENT_OVERRIDES } from "./wordOverrides";

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
  /** UTF-16 range in the displayed transliteration string, when available. */
  transliterationStartOffset?: number;
  /** UTF-16 end offset (exclusive) in the displayed transliteration string, when available. */
  transliterationEndOffset?: number;
}

/** Keep parser/domain data separate from the props shape used by the dialog UI. */
export function toWordAnalysisLetters(letters: readonly LetterData[], wordText: string, transliteration = ""): WordAnalysisLetter[] {
  const overrideSegments = WORD_SEGMENT_OVERRIDES[wordText];
  const overrideRanges = overrideSegments?.length === letters.length
    ? alignOverrideSegments(overrideSegments, transliteration)
    : null;
  const transliterationRanges = overrideRanges ?? alignTransliterationRanges(letters, transliteration);
  return letters.map((letter, index) => ({
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
    transliterationStartOffset: transliterationRanges[index]?.start ?? 0,
    transliterationEndOffset: transliterationRanges[index]?.end ?? 0,
  }));
}

/** Resolve registry segments to UTF-16 ranges in the rendered transliteration. */
function alignOverrideSegments(segments: readonly string[], transliteration: string): Array<{ start: number; end: number }> | null {
  const ranges: Array<{ start: number; end: number }> = [];
  let cursor = 0;

  for (const segment of segments) {
    if (segment.length === 0) {
      ranges.push({ start: cursor, end: cursor });
      continue;
    }
    const start = transliteration.indexOf(segment, cursor);
    if (start === -1) return null;
    const end = start + segment.length;
    ranges.push({ start, end });
    cursor = end;
  }

  return ranges;
}

/**
 * Align each parsed Arabic letter to the corresponding run of readable
 * transliteration characters. The input data does not carry a scholarly
 * character-by-character annotation, so phonetic output weights provide a
 * stable mapping while keeping punctuation (such as a hyphen) out of ranges.
 */
function alignTransliterationRanges(letters: readonly LetterData[], transliteration: string): Array<{ start: number; end: number }> {
  const positions: number[] = [];
  for (let offset = 0; offset < transliteration.length;) {
    const codePoint = transliteration.codePointAt(offset);
    if (codePoint === undefined) break;
    const character = String.fromCodePoint(codePoint);
    if (/[\p{L}\p{M}\p{N}]/u.test(character)) positions.push(offset);
    offset += character.length;
  }

  if (letters.length === 0 || positions.length === 0) return letters.map(() => ({ start: 0, end: 0 }));

  const weights = letters.map((letter, index) => {
    const nextIsLongVowelCarrier = letters[index + 1]?.vowel?.type.startsWith("Long") ?? false;
    const consonant = letter.consonantSound === "ʾ" ? "" : letter.consonantSound;
    const repeatedConsonant = letter.marks.includes("\u0651") ? consonant : "";
    const vowel = nextIsLongVowelCarrier && ["a", "i", "u"].includes(letter.vowel?.sound ?? "")
      ? ""
      : letter.vowel?.sound ?? "";
    return Math.max(1, Array.from(`${consonant}${repeatedConsonant}${vowel}`).length);
  });
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  let consumedWeight = 0;

  return weights.map((weight, index) => {
    const firstCharacter = Math.round((consumedWeight / totalWeight) * positions.length);
    consumedWeight += weight;
    const afterLastCharacter = index === weights.length - 1
      ? positions.length
      : Math.round((consumedWeight / totalWeight) * positions.length);
    const startCharacter = Math.min(firstCharacter, positions.length - 1);
    const endCharacter = Math.max(startCharacter + 1, Math.min(afterLastCharacter, positions.length));
    const start = positions[startCharacter];
    const lastCharacterOffset = positions[endCharacter - 1];
    const lastCodePoint = transliteration.codePointAt(lastCharacterOffset);
    const end = lastCodePoint === undefined
      ? transliteration.length
      : lastCharacterOffset + String.fromCodePoint(lastCodePoint).length;
    return { start, end };
  });
}
