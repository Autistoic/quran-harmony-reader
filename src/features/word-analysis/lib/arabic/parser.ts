import { HARAKAT_MAP, LETTER_TABLE, SHADDA, TATWEEL } from "./constants";
import { applyPositions } from "./joining";
import type { LetterData, Vowel, VowelType } from "./types";

/**
 * Parse an Arabic word string into structured LetterData.
 *
 * - Recognized base letters become LetterData entries.
 * - Harakat (Fatha/Kasra/Damma/Sukun) attach to the previous letter.
 * - Alif/Waw/Ya following a matching short vowel are interpreted as long-vowel
 *   carriers (Fatha+Alif → LongA on previous, Alif becomes vowel-only).
 * - Positions are computed automatically from joining behavior.
 * - Offsets address the original (un-normalized) string, as used by DOM Range.
 */
export function parseArabicWord(input: string): LetterData[] {
  const letters: LetterData[] = [];

  for (const { character: ch, startOffset, endOffset } of getNormalizedSourceCharacters(input)) {
    if (/\s/u.test(ch)) continue;
    const info = LETTER_TABLE[ch];
    if (info) {
      letters.push({
        base: ch,
        display: ch,
        nameKey: info.nameKey,
        consonantSound: info.consonantSound,
        marks: [],
        joining: { ...info.joining },
        position: "Isolated",
        startOffset,
        endOffset,
      });
      continue;
    }
    const mark = HARAKAT_MAP[ch];
    if ((mark || ch === SHADDA) && letters.length > 0) {
      const prev = letters[letters.length - 1];
      if (mark) prev.vowel = mark;
      prev.marks.push(ch);
      prev.display += ch;
      prev.endOffset = endOffset;
      continue;
    }
    if (ch === TATWEEL) continue;
    if (import.meta.env?.DEV) {
      console.warn("[arabic parser] ignoring unknown codepoint", ch, ch.charCodeAt(0).toString(16));
    }
  }

  // Long-vowel detection: collapse short-vowel + matching carrier into a Long vowel.
  const LONG_PAIRS: Record<string, { from: VowelType; to: VowelType; sound: Vowel["sound"] }> = {
    ا: { from: "Fatha", to: "LongA", sound: "ā" },
    و: { from: "Damma", to: "LongU", sound: "ū" },
    ي: { from: "Kasra", to: "LongI", sound: "ī" },
    ى: { from: "Fatha", to: "LongA", sound: "ā" },
  };

  for (let i = 1; i < letters.length; i++) {
    const cur = letters[i];
    const prev = letters[i - 1];
    const pair = LONG_PAIRS[cur.base];
    if (!pair) continue;
    if (cur.vowel && cur.vowel.type !== "Sukun") continue;
    if (prev.vowel?.type !== pair.from) continue;
    // Mark carrier as a long-vowel-only letter.
    cur.consonantSound = "";
    cur.vowel = { type: pair.to, sound: pair.sound };
  }

  return applyPositions(letters);
}

interface NormalizedSourceCharacter {
  character: string;
  startOffset: number;
  endOffset: number;
}

/**
 * Normalize grapheme-like base/mark clusters individually while retaining
 * their exact UTF-16 ranges in the source. This lets the parser recognize
 * canonically equivalent Arabic text without applying normalized offsets to
 * the unmodified word rendered by the UI.
 */
function getNormalizedSourceCharacters(input: string): NormalizedSourceCharacter[] {
  const clusters: Array<{ text: string; startOffset: number; endOffset: number }> = [];
  let offset = 0;

  for (const character of input) {
    const endOffset = offset + character.length;
    if (/\p{M}/u.test(character) && clusters.length > 0) {
      clusters[clusters.length - 1].text += character;
      clusters[clusters.length - 1].endOffset = endOffset;
    } else {
      clusters.push({ text: character, startOffset: offset, endOffset });
    }
    offset = endOffset;
  }

  return clusters.flatMap(({ text, startOffset, endOffset }) =>
    Array.from(text.normalize("NFC"), (character) => ({ character, startOffset, endOffset })),
  );
}
