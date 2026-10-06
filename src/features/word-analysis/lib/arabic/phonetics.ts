import { SHADDA } from "./constants";
interface PhoneticLetter {
  consonantSound: string;
  marks: readonly string[];
  vowel?: { type: string; sound: string };
}

/**
 * Build the spoken syllable for a letter: consonant + (optional) vowel.
 * - No vowel or Sukun → just the consonant sound.
 * - Short vowel → consonant + vowel sound (e.g. بِ → "bi").
 * - Long-vowel carrier (Alif/Waw/Ya with empty consonant) → just the long vowel.
 */
export function getFullSound(letter: PhoneticLetter): string {
  const c = letter.marks.includes(SHADDA)
    ? letter.consonantSound.repeat(2)
    : letter.consonantSound;
  const v = letter.vowel;
  if (!v) return c;
  if (v.type === "Sukun") return c;
  return c + v.sound;
}
