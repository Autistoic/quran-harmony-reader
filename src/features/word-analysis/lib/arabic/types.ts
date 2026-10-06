export type VowelType =
  | "Fatha"
  | "Kasra"
  | "Damma"
  | "Sukun"
  | "LongA"
  | "LongI"
  | "LongU"
  | "TanweenFatha"
  | "TanweenKasra"
  | "TanweenDamma"
  | "SuperscriptAlif";

export interface Vowel {
  type: VowelType;
  sound: "" | "a" | "i" | "u" | "ā" | "ī" | "ū" | "an" | "in" | "un";
}

export interface Joining {
  /** Connects to the letter on its left (next in logical reading order). */
  left: boolean;
  /** Connects to the letter on its right (previous in logical reading order). */
  right: boolean;
}

export type Position = "Initial" | "Medial" | "Final" | "Isolated";

export interface LetterData {
  base: string;
  display: string;
  name: string;
  consonantSound: string;
  marks: string[];
  vowel?: Vowel;
  joining: Joining;
  position: Position;
  /** UTF-16 start offset in the exact source string passed to the parser. */
  startOffset: number;
  /** UTF-16 end offset (exclusive) in the exact source string passed to the parser. */
  endOffset: number;
}
