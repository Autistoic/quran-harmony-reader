/**
 * Exact transliteration fragments for words whose written Arabic spelling
 * does not map cleanly to the displayed pronunciation (for example, solar
 * letter assimilation). Empty fragments mark letters with no separate
 * transliteration glyph in that word.
 *
 * Keep fragments in the same logical order as parseArabicWord output. The
 * adapter searches for them in order so spacing and punctuation remain intact.
 */
export const WORD_SEGMENT_OVERRIDES: Readonly<Record<string, readonly string[]>> = {
  // ٱلرَّحْمَـٰنِ: the lam is assimilated into the doubled r.
  "ٱلرَّحْمَـٰنِ": ["", "r", "ra", "ḥ", "mā", "ni"],
  // ٱلرَّحِيمِ: the lam is assimilated into the doubled r.
  "ٱلرَّحِيمِ": ["", "r", "ra", "ḥ", "ī", "m"],
  // ٱلصِّرَٰطَ: the lam is assimilated into the doubled emphatic ṣ.
  "ٱلصِّرَٰطَ": ["", "ṣ", "ṣi", "rā", "ṭa"],
  // ٱلضَّآلِّينَ: both solar-letter gemination and the long-vowel spelling.
  "ٱلضَّآلِّينَ": ["", "ḍ", "ḍ", "ā", "ll", "ī", "n"],
  // ٱلنَّاسِ: the lam is assimilated into the doubled n.
  "ٱلنَّاسِ": ["", "n", "n", "ā", "s"],

  // --- NUEVAS INCORPORACIONES (Optimizadas de la auditoría) ---
  
  // ٱلدِّينِ (d-dīn): the lam is assimilated into the d.
  "ٱلدِّينِ": ["", "d-", "dīn", "ī", "n"],
  
  // ٱلَّذِينَ (lladhīna): solar assimilation with dhāl.
  "ٱلَّذِينَ": ["", "ll", "a", "dhī", "na"],
  
  // ٱللَّهِ (llāhi): Allah's name with heavy foundational lam.
  "ٱللَّهِ": ["", "ll", "āh", "i"],
};
