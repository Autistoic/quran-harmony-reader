export interface WordTiming {
    word: string;
    translit: string; // transliteration for this word
    start: number; // in seconds
    end: number;   // in seconds
}

export interface Verse {
    arabic: string;
    transliteration: string;
    verseNumber?: number;
    wordTimings: WordTiming[];
}

export interface Surah {
    id: number;
    name: string;
    arabicName: string;
    audioUrl: string;
    verses: Verse[];
}

// Surah Al-Fatiha (1)
export const surahAlFatiha: Surah = {
    id: 1,
    name: "Al-Fatiha",
    arabicName: "الفاتحة",
    audioUrl: "https://archive.org/download/00.-fatiha-suresi/00.Fatiha%20suresi.mp3",
    verses: [
        {
            arabic: "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ",
            transliteration: "bismi llāhi r-raḥmāni r-raḥīm",
            verseNumber: 1,
            wordTimings: [
                { word: "بِسْمِ", translit: "bismi", start: 0.0, end: 0.8 },
                { word: "ٱللَّهِ", translit: "llāhi", start: 0.8, end: 1.5 },
                { word: "ٱلرَّحْمَـٰنِ", translit: "r-raḥmāni", start: 1.5, end: 3.5 },
                { word: "ٱلرَّحِيمِ", translit: "r-raḥīm", start: 3.5, end: 4.5 } // Fin del verso y pausa
            ]
        },
        {
            arabic: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ",
            transliteration: "al-ḥamdu lillāhi rabbi l-ʿālamīn",
            verseNumber: 2,
            wordTimings: [
                { word: "ٱلْحَمْدُ", translit: "al-ḥamdu", start: 7.0, end: 7.9 },
                { word: "لِلَّهِ", translit: "lillāhi", start: 7.9, end: 9.0 },
                { word: "رَبِّ", translit: "rabbi", start: 9.0, end: 9.8 },
                { word: "ٱلْعَـٰلَمِينَ", translit: "l-ʿālamīn", start: 9.8, end: 11.0 }
            ]
        },
        {
            arabic: "ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ",
            transliteration: "ar-raḥmāni r-raḥīm",
            verseNumber: 3,
            wordTimings: [
                { word: "ٱلرَّحْمَـٰنِ", translit: "ar-raḥmāni", start: 13.5, end: 14.8 },
                { word: "ٱلرَّحِيمِ", translit: "r-raḥīm", start: 14.8, end: 16.5 }
            ]
        },
        {
            arabic: "مَـٰلِكِ يَوْمِ ٱلدِّينِ",
            transliteration: "māliki yawmi d-dīn",
            verseNumber: 4,
            wordTimings: [
                { word: "مَـٰلِكِ", translit: "māliki", start: 16.5, end: 17.0 },
                { word: "يَوْمِ", translit: "yawmi", start: 17.0, end: 17.6 },
                { word: "ٱلدِّينِ", translit: "d-dīn", start: 17.6, end: 21.0 }
            ]
        },
        {
            arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
            transliteration: "iyyāka naʿbudu wa-iyyāka nastaʿīn",
            "verseNumber": 5,
            "wordTimings": [
                { "word": "إِيَّاكَ", "translit": "iyyāka", "start": 21.0, "end": 22.0 },
                { "word": "نَعْبُدُ", "translit": "naʿbudu", "start": 22.0, "end": 23.0 },
                { "word": "وَإِيَّاكَ", "translit": "wa-iyyāka", "start": 23.0, "end": 24.3 },
                { "word": "نَسْتَعِينُ", "translit": "nastaʿīn", "start": 24.3, "end": 27.0 }
            ]
        },
        {
            arabic: "ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ",
            transliteration: "ihdinā ṣ-ṣirāṭa l-mustaqīm",
            "verseNumber": 6,
            "wordTimings": [
                { "word": "ٱهْدِنَا", "translit": "ihdinā", "start": 30.5, "end": 31.3 },
                { "word": "ٱلصِّرَٰطَ", "translit": "ṣ-ṣirāṭa", "start": 31.3, "end": 32.7 },
                { "word": "ٱلْمُسْتَقِيمَ", "translit": "l-mustaqīm", "start": 32.7, "end": 35.5 }
            ]
        },
        {
            arabic: "صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ",
            transliteration: "ṣirāṭa lladhīna anʿamta ʿalayhim ghayri l-maghḍūbi ʿalayhim wa-lā ḍ-ḍāllīn",
            verseNumber: 7,
            wordTimings: [
                { "word": "صِرَٰطَ", "translit": "ṣirāṭa", "start": 38.1, "end": 39.0 },
                { "word": "ٱلَّذِينَ", "translit": "lladhīna", "start": 39.0, "end": 40.5 },
                { "word": "أَنْعَمْتَ", "translit": "anʿamta", "start": 40.5, "end": 41.8 },
                { "word": "عَلَيْهِمْ", "translit": "ʿalayhim", "start": 41.8, "end": 42.9 },
                { "word": "غَيْرِ", "translit": "ghayri", "start": 42.6, "end": 44.3 },
                { "word": "ٱلْمَغْضُوبِ", "translit": "l-maghḍūbi", "start": 44.3, "end": 45.9 },
                { "word": "عَلَيْهِمْ", "translit": "ʿalayhim", "start": 45.9, "end": 46.8 },
                { "word": "وَلَا", "translit": "wa-lā", "start": 46.8, "end": 48.4 },
                { "word": "ٱلضَّآلِّينَ", "translit": "ḍ-ḍāllīn", "start": 48.4, "end": 54.0 }
            ]
        }
    ]
};

// Surah Al-Ikhlas (112)
export const surahAlIkhlas: Surah = {
    id: 112,
    name: "Al-Ikhlas",
    arabicName: "الإخلاص",
    audioUrl: "https://archive.org/download/112.-ihlas-suresi/112.Ihlas%20suresi.mp3",
    verses: [
        {
            arabic: "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ",
            transliteration: "bismi llāhi r-raḥmāni r-raḥīm",
            wordTimings: [
                { word: "بِسْمِ", translit: "bismi", start: 0.0, end: 0.8 },
                { word: "ٱللَّهِ", translit: "llāhi", start: 0.8, end: 1.5 },
                { word: "ٱلرَّحْمَـٰنِ", translit: "r-raḥmāni", start: 1.5, end: 2.5 },
                { word: "ٱلرَّحِيمِ", translit: "r-raḥīm", start: 2.5, end: 3.8 }
            ]
        },
        {
            arabic: "قُلْ هُوَ ٱللَّهُ أَحَدٌ",
            transliteration: "qul huwa llāhu aḥad",
            verseNumber: 1,
            wordTimings: [
                { word: "قُلْ", translit: "qul", start: 9.3, end: 9.9 },
                { word: "هُوَ", translit: "huwa", start: 9.9, end: 10.4 },
                { word: "ٱللَّهُ", translit: "llāhu", start: 10.4, end: 11.2 },
                { word: "أَحَدٌ", translit: "aḥad", start: 11.2, end: 12.5 }
            ]
        },
        {
            arabic: "ٱللَّهُ ٱلصَّمَدُ",
            transliteration: "allāhu ṣ-ṣamad",
            verseNumber: 2,
            wordTimings: [
                { word: "ٱللَّهُ", translit: "allāhu", start: 14.2, end: 15.2 },
                { word: "ٱلصَّمَدُ", translit: "ṣ-ṣamad", start: 15.2, end: 16.8 }
            ]
        },
        {
            arabic: "لَمْ يَلِدْ وَلَمْ يُولَدْ",
            transliteration: "lam yalid wa-lam yūlad",
            verseNumber: 3,
            wordTimings: [
                { word: "لَمْ", translit: "lam", start: 18.5, end: 19.0 },
                { word: "يَلِدْ", translit: "yalid", start: 19.0, end: 19.8 },
                { word: "وَلَمْ", translit: "wa-lam", start: 19.8, end: 20.4 },
                { word: "يُولَدْ", translit: "yūlad", start: 20.4, end: 21.8 }
            ]
        },
        {
            arabic: "وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ",
            transliteration: "wa-lam yakun lahū kufuwan aḥad",
            verseNumber: 4,
            wordTimings: [
                { word: "وَلَمْ", translit: "wa-lam", start: 23.3, end: 23.9 },
                { word: "يَكُن", translit: "yakun", start: 24.1, end: 24.6 },
                { word: "لَّهُۥ", translit: "lahū", start: 24.6, end: 26.6 },
                { word: "كُفُوًا", translit: "kufuwan", start: 26.6, end: 27.3 },
                { word: "أَحَدٌۢ", translit: "aḥad", start: 27.3, end: 28.2 }
            ]
        }
    ]
};

// Surah Al-Falaq (113)
export const surahAlFalaq: Surah = {
    id: 113,
    name: "Al-Falaq",
    arabicName: "الفلق",
    audioUrl: "https://archive.org/download/113-al-falaq_202605/113%20Al-Falaq%20%D8%A7%D9%84%D9%81%D9%84%D9%82.mp3",
    verses: [
        {
            arabic: "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ",
            transliteration: "bismi llāhi r-raḥmāni r-raḥīm",
            wordTimings: [
                { word: "بِسْمِ", translit: "bismi", start: 0.0, end: 0.8 },
                { word: "ٱللَّهِ", translit: "llāhi", start: 0.8, end: 1.5 },
                { word: "ٱلرَّحْمَـٰنِ", translit: "r-raḥmāni", start: 1.5, end: 2.0 },
                { word: "ٱلرَّحِيمِ", translit: "r-raḥīm", start: 2.0, end: 2.5 },
            ],
        },
        {
            arabic: "قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ",
            transliteration: "qul ’a‘ūdhu birabbi l-falaq",
            verseNumber: 1,
            wordTimings: [
                { word: "قُلْ", translit: "qul", start: 2.9, end: 3.85 },
                { word: "أَعُوذُ", translit: "’a‘ūdhu", start: 3.9, end: 4.6 },
                { word: "بِرَبِّ", translit: "birabbi", start: 4.7, end: 5.4 },
                { word: "ٱلْفَلَقِ", translit: "l-falaq", start: 5.41, end: 6.6 },
            ],
        },
        {
            arabic: "مِن شَرِّ مَا خَلَقَ",
            transliteration: "min sharri mā khalaq",
            verseNumber: 2,
            wordTimings: [
                { word: "مِن شَرِّ", translit: "min sharri", start: 6.7, end: 8.2 },
                { word: "مَا خَلَقَ", translit: "mā khalaq", start: 8.23, end: 9.5 },
            ],
        },
        {
            arabic: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ",
            transliteration: "wamin sharri ghāsiqin ’idhā waqab",
            verseNumber: 3,
            wordTimings: [
                { word: "وَمِن شَرِّ", translit: "wamin sharri", start: 9.5, end: 11.1 },
                { word: "غَاسِقٍ", translit: "ghāsiqin", start: 11.1, end: 12.2 },
                { word: "إِذَا وَقَبَ", translit: "’idhā waqab", start: 12.25, end: 13.6 },
            ],
        },
        {
            arabic: "وَمِن شَرِّ ٱلنَّفَّـٰـثَـٰتِ فِى ٱلْعُقَدِ",
            transliteration: "wamin sharri n-naffāthāti fi l-‘uqad",
            verseNumber: 4,
            wordTimings: [
                { word: "وَمِن شَرِّ", translit: "wamin sharri", start: 13.8, end: 15.7 },
                { word: "ٱلنَّفَّـٰـثَـٰتِ", translit: "n-naffāthāti", start: 15.7, end: 17.6 },
                { word: "فِى ٱلْعُقَدِ", translit: "fi l-‘uqad", start: 17.55, end: 19.0 },
            ],
        },
        {
            arabic: "وَمِن شَرِ حَاسِدٍ إِذَا حَسَدَ",
            transliteration: "wamin sharri ḥāsidin idhā ḥasad",
            verseNumber: 5,
            wordTimings: [
                { word: "وَمِن شَرِ", translit: "wamin sharri", start: 19.1, end: 20.5 },
                { word: "حَاسِدٍ", translit: "ḥāsidin", start: 20.6, end: 21.5 },
                { word: "إِذَا حَسَدَ", translit: "idhā ḥasad", start: 21.7, end: 23.1 },
            ],
        },
    ],
};

// Export all surahs for easy access
export const surahs: Surah[] = [surahAlFatiha, surahAlIkhlas, surahAlFalaq];

// Helper to get surah by ID
export const getSurahById = (id: number): Surah | undefined => {
    return surahs.find(s => s.id === id);
};
