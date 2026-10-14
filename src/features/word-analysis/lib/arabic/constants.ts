import type { Joining, Vowel } from "./types";

/** Letters that cannot connect onward to the next letter in reading order. */
export const NON_CONNECTING_LEFT: readonly string[] = [
  "ا", "ٱ", "أ", "إ", "آ", "د", "ذ", "ر", "ز", "و", "ى", "ء", "ؤ", "ة",
];

interface LetterInfo {
  nameKey: string;
  consonantSound: string;
  joining: Joining;
}

const j = (left: boolean, right: boolean): Joining => ({ left, right });

/** Base Arabic letters with their phonetic + joining metadata. */
export const LETTER_TABLE: Record<string, LetterInfo> = {
  ا: { nameKey: "wordAnalysis.letters.alif", consonantSound: "", joining: j(false, true) },
  ٱ: { nameKey: "wordAnalysis.letters.alifWasla", consonantSound: "", joining: j(false, true) },
  أ: { nameKey: "wordAnalysis.letters.alifHamzaAbove", consonantSound: "ʾ", joining: j(false, true) },
  إ: { nameKey: "wordAnalysis.letters.alifHamzaBelow", consonantSound: "ʾ", joining: j(false, true) },
  آ: { nameKey: "wordAnalysis.letters.alifMadda", consonantSound: "ʾ", joining: j(false, true) },
  ب: { nameKey: "wordAnalysis.letters.ba", consonantSound: "b", joining: j(true, true) },
  ت: { nameKey: "wordAnalysis.letters.ta", consonantSound: "t", joining: j(true, true) },
  ث: { nameKey: "wordAnalysis.letters.tha", consonantSound: "th", joining: j(true, true) },
  ج: { nameKey: "wordAnalysis.letters.jim", consonantSound: "j", joining: j(true, true) },
  ح: { nameKey: "wordAnalysis.letters.ha", consonantSound: "ḥ", joining: j(true, true) },
  خ: { nameKey: "wordAnalysis.letters.kha", consonantSound: "kh", joining: j(true, true) },
  د: { nameKey: "wordAnalysis.letters.dal", consonantSound: "d", joining: j(false, true) },
  ذ: { nameKey: "wordAnalysis.letters.dhal", consonantSound: "dh", joining: j(false, true) },
  ر: { nameKey: "wordAnalysis.letters.ra", consonantSound: "r", joining: j(false, true) },
  ز: { nameKey: "wordAnalysis.letters.zay", consonantSound: "z", joining: j(false, true) },
  س: { nameKey: "wordAnalysis.letters.sin", consonantSound: "s", joining: j(true, true) },
  ش: { nameKey: "wordAnalysis.letters.shin", consonantSound: "sh", joining: j(true, true) },
  ص: { nameKey: "wordAnalysis.letters.sad", consonantSound: "ṣ", joining: j(true, true) },
  ض: { nameKey: "wordAnalysis.letters.dad", consonantSound: "ḍ", joining: j(true, true) },
  ط: { nameKey: "wordAnalysis.letters.taEmphatic", consonantSound: "ṭ", joining: j(true, true) },
  ظ: { nameKey: "wordAnalysis.letters.zaEmphatic", consonantSound: "ẓ", joining: j(true, true) },
  ع: { nameKey: "wordAnalysis.letters.ayn", consonantSound: "ʿ", joining: j(true, true) },
  غ: { nameKey: "wordAnalysis.letters.ghayn", consonantSound: "gh", joining: j(true, true) },
  ف: { nameKey: "wordAnalysis.letters.fa", consonantSound: "f", joining: j(true, true) },
  ق: { nameKey: "wordAnalysis.letters.qaf", consonantSound: "q", joining: j(true, true) },
  ك: { nameKey: "wordAnalysis.letters.kaf", consonantSound: "k", joining: j(true, true) },
  ل: { nameKey: "wordAnalysis.letters.lam", consonantSound: "l", joining: j(true, true) },
  م: { nameKey: "wordAnalysis.letters.mim", consonantSound: "m", joining: j(true, true) },
  ن: { nameKey: "wordAnalysis.letters.nun", consonantSound: "n", joining: j(true, true) },
  ه: { nameKey: "wordAnalysis.letters.haSoft", consonantSound: "h", joining: j(true, true) },
  و: { nameKey: "wordAnalysis.letters.waw", consonantSound: "w", joining: j(false, true) },
  ي: { nameKey: "wordAnalysis.letters.ya", consonantSound: "y", joining: j(true, true) },
  ء: { nameKey: "wordAnalysis.letters.hamza", consonantSound: "ʾ", joining: j(false, false) },
  ؤ: { nameKey: "wordAnalysis.letters.wawHamza", consonantSound: "ʾ", joining: j(false, true) },
  ئ: { nameKey: "wordAnalysis.letters.yaHamza", consonantSound: "ʾ", joining: j(true, true) },
  ة: { nameKey: "wordAnalysis.letters.taMarbuta", consonantSound: "h", joining: j(false, true) },
  ى: { nameKey: "wordAnalysis.letters.alifMaqsura", consonantSound: "", joining: j(false, true) },
};

/** Harakat (vowel marks) by Unicode codepoint. */
export const HARAKAT_MAP: Record<string, Vowel> = {
  "\u064E": { type: "Fatha", sound: "a" },
  "\u0650": { type: "Kasra", sound: "i" },
  "\u064F": { type: "Damma", sound: "u" },
  "\u0652": { type: "Sukun", sound: "" },
  "\u064B": { type: "TanweenFatha", sound: "an" },
  "\u064D": { type: "TanweenKasra", sound: "in" },
  "\u064C": { type: "TanweenDamma", sound: "un" },
  "\u0670": { type: "SuperscriptAlif", sound: "ā" },
};

export const SHADDA = "\u0651";
export const TATWEEL = "\u0640";

export const DIACRITIC_NAMES: Record<string, string> = {
  [SHADDA]: "wordAnalysis.diacritics.shaddah",
};
