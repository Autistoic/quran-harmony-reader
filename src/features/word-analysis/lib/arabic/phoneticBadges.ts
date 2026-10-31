import type { VowelType } from "./types";

export interface PhoneticBadge {
  key: string;
  label: string;
}

const SHORT_VOWEL_BADGES: Partial<Record<VowelType, string>> = {
  Fatha: "a",
  Kasra: "i",
  Damma: "u",
};

/** Return supplemental phonetic badges for a letter, independently of UI layout. */
export function getPhoneticBadges(letter: { vowel?: { type: VowelType } }): PhoneticBadge[] {
  const label = letter.vowel && SHORT_VOWEL_BADGES[letter.vowel.type];
  return label ? [{ key: "short-vowel", label }] : [];
}
