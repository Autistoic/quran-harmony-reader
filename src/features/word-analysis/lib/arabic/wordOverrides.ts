/** UTF-16 transliteration ranges, in parsed Arabic letter order. */
export type WordSegmentOverride = readonly (readonly [number, number])[];

/**
 * Rangos [inicio, fin) sobre la transliteración, uno por letra árabe.
 * Convención:
 *  - La consonante incluye su vocal (y la vocal larga si hay madd).
 *  - La letra de madd resalta solo el carácter largo (solapa con la consonante).
 *  - El guion pertenece a la lām del artículo.
 *  - Rango vacío [n, n] = letra muda (alif de waṣl en continuación).
 * Clave: "palabra|transliteración".
 */
export const WORD_SEGMENT_OVERRIDES: Readonly<Record<string, WordSegmentOverride>> = {
    // ── Artículo + letra solar ──

    // ٱ ل ر ح م ـٰ ن  (7)

    "ٱلرَّحْمَـٰنِ|r-raḥmāni": [[0, 0], [0, 2], [2, 4], [4, 5], [5, 7], [7, 9]],
    "ٱلرَّحْمَـٰنِ|ar-raḥmāni": [[0, 1], [1, 3], [3, 5], [5, 6], [6, 8], [8, 10]],
    "ٱلْعَـٰلَمِينَ|l-ʿālamīn": [[0, 0], [0, 2], [2, 4], [4, 6], [6, 8], [7, 8], [8, 9]],
    // ٱ ل ر ح ي م  (6)
    "ٱلرَّحِيمِ|r-raḥīm": [[0, 0], [0, 2], [2, 4], [4, 6], [5, 6], [6, 7]],

    // ٱ ل ص ر ط  (5) — la ر lleva fatḥa + alif jañjarīya → "rā"
    "ٱلصِّرَٰطَ|ṣ-ṣirāṭa": [[0, 0], [0, 2], [2, 4], [4, 6], [6, 8]],

    // ٱ ل ض آ ل ي ن  (7)
    "ٱلضَّآلِّينَ|ḍ-ḍāllīn": [[0, 0], [0, 2], [2, 4], [3, 4], [4, 7], [6, 7], [7, 8]],

    // ٱ ل ن ا س  (5)
    "ٱلنَّاسِ|n-nās": [[0, 0], [0, 2], [2, 4], [3, 4], [4, 5]],
    "ٱلنَّاسِ|an-nās": [[0, 1], [1, 3], [3, 5], [4, 5], [5, 6]],

    // ٱ ل د ي ن  (5)
    "ٱلدِّينِ|d-dīn": [[0, 0], [0, 2], [2, 4], [3, 4], [4, 5]],

    // ٱ ل ذ ي ن  (5) — la lām con shadda lleva la fatḥa: "lla"
    "ٱلَّذِينَ|lladhīna": [[0, 0], [0, 3], [3, 6], [5, 6], [6, 8]],

    // ٱ ل ل ه  (4)
    "ٱللَّهِ|llāhi": [[0, 0], [0, 1], [1, 3], [3, 5]],

    // ── Correcciones de la heurística (desplazamientos) ──

    // ن س ت ع ي ن  (6)
    "نَسْتَعِينُ|nastaʿīn": [[0, 2], [2, 3], [3, 5], [5, 7], [6, 7], [7, 8]],

    // ٱ ل م س ت ق ي م  (8)
    "ٱلْمُسْتَقِيمَ|l-mustaqīm": [[0, 0], [0, 2], [2, 4], [4, 5], [5, 7], [7, 9], [8, 9], [9, 10]],

    // ٱ ل م غ ض و ب  (7) — "gh" es una unidad
    "ٱلْمَغْضُوبِ|l-maghḍūbi": [[0, 0], [0, 2], [2, 4], [4, 6], [6, 8], [7, 8], [8, 10]],

    // ── Solo por consistencia de convención (la heurística los da válidos pero sin solapar) ──
    // ٱ ه د ن ا  (5)
    "ٱهْدِنَا|ihdinā": [[0, 1], [1, 2], [2, 4], [4, 6], [5, 6]],

    // إ ي ا ك  (4)
    "إِيَّاكَ|iyyāka": [[0, 1], [1, 4], [3, 4], [4, 6]],

    // و إ ي ا ك  (5)
    "وَإِيَّاكَ|wa-iyyāka": [[0, 2], [3, 4], [4, 7], [6, 7], [7, 9]],

    // و ل ا  (3)
    "وَلَا|wa-lā": [[0, 2], [3, 5], [4, 5]],

    // l-waswāsi (9 caracteres)
    "ٱلْوَسْوَاسِ|l-waswāsi": [[0, 0], [0, 2], [2, 4], [4, 5], [5, 7], [6, 7], [7, 9]],

    // al-waswāsi (10 caracteres)
    "ٱلْوَسْوَاسِ|al-waswāsi": [[0, 1], [1, 3], [3, 5], [5, 6], [6, 8], [7, 8], [8, 10]],
};

export const overrideKey = (word: string, translit: string) =>
    `${word.normalize("NFC")}|${translit.normalize("NFC")}`;

export const NORMALIZED_OVERRIDES: ReadonlyMap<string, WordSegmentOverride> = new Map(
    Object.entries(WORD_SEGMENT_OVERRIDES).map(([k, v]) => {
        const i = k.lastIndexOf("|");
        return [overrideKey(k.slice(0, i), k.slice(i + 1)), v] as const;
    }),
);

export const getOverride = (word: string, translit: string) =>
    NORMALIZED_OVERRIDES.get(overrideKey(word, translit));
