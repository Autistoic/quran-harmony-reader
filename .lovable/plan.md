## Refine word-by-word layout in Quran verses (closer to quran.com)

### Summary
Two visual tweaks in `src/components/QuranVerse.tsx`, following the quran.com reference screenshot:

1. **Words aligned to the top-right**
   - The word-columns container currently centers rows (`justify-center`).
   - Change to `justify-start` (with the existing `dir="rtl"`, that flows from the top-right corner, exactly like quran.com).
   - Keep `flex flex-wrap items-start` and natural wrapping to the next line.

2. **More breathing room between the Arabic word and its transliteration**
   - Inside each word column, add a small vertical margin on the transliteration line (e.g. `mt-2`, tuned so Arabic with diacritics never touches the transliteration below it).
   - Slightly increase the row gap between wrapped lines (`gap-y-4` → `gap-y-5`) so stacked columns don't feel cramped.

### Strict constraints
- No logic, state, audio, popover, highlight, or data-binding changes.
- Only markup classes/CSS in `src/components/QuranVerse.tsx` are touched.
- Full-verse Spanish translation block and edit-mode labels stay as-is.

### Files
| File | Action |
|---|---|
| `src/components/QuranVerse.tsx` | Modify (CSS classes only) |
