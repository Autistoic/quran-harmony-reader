## Refactor: word-by-word layout in Quran verses (quran.com style)

### Summary
Restructure the verse body in `src/components/QuranVerse.tsx` so each word becomes a self-contained vertical column (Arabic on top, transliteration in the middle, translation at the bottom), laid out RTL from the top-right corner — matching quran.com's word-by-word layout. No logic, state, audio, or data changes.

### Current state
The verse currently renders three separate stacked paragraphs: one Arabic line, one transliteration line, one translation line (each RTL). Word popovers (play/dictionary), edit-mode timing popovers, and highlighting all already work per-word.

### Changes (single file: `src/components/QuranVerse.tsx`)

1. **Replace the three paragraphs with one word-columns container**
   - One flex-wrap container with `dir="rtl"` (`style={{ direction: 'rtl' }}` plus `flex flex-wrap justify-center items-start gap-x-2 gap-y-3`).
   - Words flow naturally right-to-left and wrap to the next line, starting from the top-right.

2. **Per-word column block**
   - Each word is wrapped in `flex flex-col items-center` (column layout, centered).
   - Stack order inside each column:
     1. Arabic word (`font-arabic`, larger size) — wrapped in the existing Popover (play + dictionary icon in normal mode, TimingEditor in edit mode).
     2. Transliteration (`font-transliteration`, smaller, muted).
     3. Per-word translation (small, muted) — only when data exists.
   - Edit-mode timing labels (`start→end`) move inside the column, under the other elements.

3. **Prevent overlap between columns**
   - Constrain long transliterations/translations with `max-w-[10rem]` (approx.) and `break-words` so a long word can't push into or overlap neighbors; adjust the value so typical words fit on one line.
   - Consistent horizontal gap between columns; keep per-word padding/hover behavior as-is.

4. **Keep everything else intact**
   - Play/pause verse button, verse number badge, currentWord highlighting, click-to-play, dictionary popover (pauses audio), edit-mode popover + cursor navigation, full-verse Spanish translation (LTR) toggle, and the per-word data bindings — all unchanged.
   - Wird section (`WirdVerseLine`) is not touched.

### Files
| File | Action |
|---|---|
| `src/components/QuranVerse.tsx` | Modify (layout/markup/CSS only) |
