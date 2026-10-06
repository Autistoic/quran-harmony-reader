import type { Joining, Vowel } from "./types";

/** Letters that never connect to the letter on their left. */
export const NON_CONNECTING_LEFT = ["ا", "د", "ذ", "ر", "ز", "و"];

interface LetterInfo {
  name: string;
  consonantSound: string;
  joining: Joining;
}

const j = (left: boolean, right: boolean): Joining => ({ left, right });

/** Base Arabic letters with their phonetic + joining metadata. */
export const LETTER_TABLE: Record<string, LetterInfo> = {
  ا: { name: "Alif", consonantSound: "", joining: j(false, true) },
  ٱ: { name: "Alif wasla", consonantSound: "", joining: j(false, true) },
  أ: { name: "Alif with hamza above", consonantSound: "ʾ", joining: j(false, true) },
  إ: { name: "Alif with hamza below", consonantSound: "ʾ", joining: j(false, true) },
  آ: { name: "Alif with madda", consonantSound: "ʾ", joining: j(false, true) },
  ب: { name: "Ba", consonantSound: "b", joining: j(true, true) },
  ت: { name: "Ta", consonantSound: "t", joining: j(true, true) },
  ث: { name: "Tha", consonantSound: "th", joining: j(true, true) },
  ج: { name: "Jim", consonantSound: "j", joining: j(true, true) },
  ح: { name: "Ha", consonantSound: "ḥ", joining: j(true, true) },
  خ: { name: "Kha", consonantSound: "kh", joining: j(true, true) },
  د: { name: "Dal", consonantSound: "d", joining: j(false, true) },
  ذ: { name: "Dhal", consonantSound: "dh", joining: j(false, true) },
  ر: { name: "Ra", consonantSound: "r", joining: j(false, true) },
  ز: { name: "Zay", consonantSound: "z", joining: j(false, true) },
  س: { name: "Sin", consonantSound: "s", joining: j(true, true) },
  ش: { name: "Shin", consonantSound: "sh", joining: j(true, true) },
  ص: { name: "Sad", consonantSound: "ṣ", joining: j(true, true) },
  ض: { name: "Dad", consonantSound: "ḍ", joining: j(true, true) },
  ط: { name: "Ta (emphatic)", consonantSound: "ṭ", joining: j(true, true) },
  ظ: { name: "Za (emphatic)", consonantSound: "ẓ", joining: j(true, true) },
  ع: { name: "Ayn", consonantSound: "ʿ", joining: j(true, true) },
  غ: { name: "Ghayn", consonantSound: "gh", joining: j(true, true) },
  ف: { name: "Fa", consonantSound: "f", joining: j(true, true) },
  ق: { name: "Qaf", consonantSound: "q", joining: j(true, true) },
  ك: { name: "Kaf", consonantSound: "k", joining: j(true, true) },
  ل: { name: "Lam", consonantSound: "l", joining: j(true, true) },
  م: { name: "Mim", consonantSound: "m", joining: j(true, true) },
  ن: { name: "Nun", consonantSound: "n", joining: j(true, true) },
  ه: { name: "Ha (soft)", consonantSound: "h", joining: j(true, true) },
  و: { name: "Waw", consonantSound: "w", joining: j(false, true) },
  ي: { name: "Ya", consonantSound: "y", joining: j(true, true) },
  ء: { name: "Hamza", consonantSound: "ʾ", joining: j(false, false) },
  ؤ: { name: "Waw with hamza", consonantSound: "ʾ", joining: j(false, true) },
  ئ: { name: "Ya with hamza", consonantSound: "ʾ", joining: j(true, true) },
  ة: { name: "Ta marbuta", consonantSound: "h", joining: j(false, true) },
  ى: { name: "Alif maqsura", consonantSound: "", joining: j(false, true) },
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
  [SHADDA]: "Shadda",
};
