// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { getFullSound } from './phonetics';
import { parseArabicWord } from './parser';

describe('parseArabicWord', () => {
  it('recognizes Alif wasla and retains shadda and vowel marks', () => {
    const letters = parseArabicWord('ٱلرَّحْمَـٰنِ');

    expect(letters[0].name).toBe('Alif wasla');
    expect(letters.find(letter => letter.base === 'ر')?.marks).toEqual(['َ', 'ّ']);
    expect(letters.find(letter => letter.base === 'م')?.marks).toEqual(['َ', 'ٰ']);
  });

  it('retains tanween and includes it in the phonetic sound', () => {
    const [letter] = parseArabicWord('مٌ');

    expect(letter.marks).toEqual(['ٌ']);
    expect(letter.vowel?.type).toBe('TanweenDamma');
    expect(getFullSound(letter)).toBe('mun');
  });

  it('applies shadda to the consonant sound and skips tatweel', () => {
    const [letter] = parseArabicWord('بَّـ');

    expect(letter.display).toBe('بَّ');
    expect(getFullSound(letter)).toBe('bba');
  });

  it('returns UTF-16 offsets into the original word for heavily marked text', () => {
    const word = 'ٱلرَّحْمَـٰنِ';
    const letters = parseArabicWord(word);

    for (const letter of letters) {
      expect(word.slice(letter.startOffset, letter.endOffset)).toContain(letter.base);
      expect(letter.startOffset).toBeLessThan(letter.endOffset);
    }

    const ra = letters.find((letter) => letter.base === 'ر');
    expect(ra && word.slice(ra.startOffset, ra.endOffset)).toBe('رَّ');
    const mim = letters.find((letter) => letter.base === 'م');
    expect(mim && word.slice(mim.startOffset, mim.endOffset)).toBe('مَـٰ');
  });

  it('maps NFC parsing back to decomposed source offsets', () => {
    const word = 'ا\u0654\u064Eب\u0651\u064F';
    const [alif, ba] = parseArabicWord(word);

    expect(alif.base).toBe('أ');
    expect(word.slice(alif.startOffset, alif.endOffset)).toBe('ا\u0654\u064E');
    expect(ba.base).toBe('ب');
    expect(word.slice(ba.startOffset, ba.endOffset)).toBe('ب\u0651\u064F');
  });
});
