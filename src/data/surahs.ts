export interface WordTiming {
    word: string;
    translit: string; // transliteration for this word
    translation?: string; // Spanish translation for this word (optional)
    start: number; // in seconds
    end: number;   // in seconds
}

export interface Verse {
    arabic: string;
    transliteration: string;
    translation?: string; // Spanish translation for the full verse (optional)
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
            translation: "En el nombre de Dios, el Compasivo con toda la creación, el Misericordioso con los creyentes.",
            verseNumber: 1,
            wordTimings: [
                { word: "بِسْمِ", translit: "bismi", translation: "en (el) nombre", start: 0.0, end: 0.8 },
                { word: "ٱللَّهِ", translit: "llāhi", translation: "(de) Allah", start: 0.8, end: 1.5 },
                { word: "ٱلرَّحْمَـٰنِ", translit: "r-raḥmāni", translation: "el Clementísimo", start: 1.5, end: 3.5 },
                { word: "ٱلرَّحِيمِ", translit: "r-raḥīm", translation: "el Misericordiosísimo", start: 3.5, end: 4.5 }
            ]
        },
        {
            arabic: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ",
            transliteration: "al-ḥamdu lillāhi rabbi l-ʿālamīn",
            translation: "Todas las alabanzas son para Dios, Señor de todo cuanto existe.",
            verseNumber: 2,
            wordTimings: [
                { word: "ٱلْحَمْدُ", translit: "al-ḥamdu", translation: "todas las alabanzas y agradecimientos", start: 7.0, end: 7.9 },
                { word: "لِلَّهِ", translit: "lillāhi", translation: "(sean) para Allah", start: 7.9, end: 9.0 },
                { word: "رَبِّ", translit: "rabbi", translation: "el Señor", start: 9.0, end: 9.8 },
                { word: "ٱلْعَـٰلَمِينَ", translit: "l-ʿālamīn", translation: "del universo", start: 9.8, end: 11.0 }
            ]
        },
        {
            arabic: "ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ",
            transliteration: "ar-raḥmāni r-raḥīm",
            translation: "El Compasivo, el Misericordioso.",
            verseNumber: 3,
            wordTimings: [
                { word: "ٱلرَّحْمَـٰنِ", translit: "ar-raḥmāni", translation: "el Clementísimo", start: 13.5, end: 14.8 },
                { word: "ٱلرَّحِيمِ", translit: "r-raḥīm", translation: "el Misericordiosísimo", start: 14.8, end: 16.5 }
            ]
        },
        {
            arabic: "مَـٰلِكِ يَوْمِ ٱلدِّينِ",
            transliteration: "māliki yawmi d-dīn",
            translation: "Soberano absoluto del Día del Juicio Final.",
            verseNumber: 4,
            wordTimings: [
                { word: "مَـٰلِكِ", translit: "māliki", translation: "(el) Soberano", start: 16.5, end: 17.0 },
                { word: "يَوْمِ", translit: "yawmi", translation: "(del) Día", start: 17.0, end: 17.6 },
                { word: "ٱلدِّينِ", translit: "d-dīn", translation: "(del) Juicio", start: 17.6, end: 21.0 }
            ]
        },
        {
            arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
            transliteration: "iyyāka naʿbudu wa-iyyāka nastaʿīn",
            translation: "Solo a Ti te adoramos y solo de Ti imploramos ayuda.",
            verseNumber: 5,
            wordTimings: [
                { word: "إِيَّاكَ", translit: "iyyāka", translation: "solo a Ti", start: 21.0, end: 22.0 },
                { word: "نَعْبُدُ", translit: "naʿbudu", translation: "adoramos", start: 22.0, end: 23.0 },
                { word: "وَإِيَّاكَ", translit: "wa-iyyāka", translation: "y solo a Ti", start: 23.0, end: 24.3 },
                { word: "نَسْتَعِينُ", translit: "nastaʿīn", translation: "pedimos ayuda", start: 24.3, end: 27.0 }
            ]
        },
        {
            arabic: "ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ",
            transliteration: "ihdinā ṣ-ṣirāṭa l-mustaqīm",
            translation: "¡Guíanos por el camino recto!",
            verseNumber: 6,
            wordTimings: [
                { word: "ٱهْدِنَا", translit: "ihdinā", translation: "guíanos", start: 30.5, end: 31.3 },
                { word: "ٱلصِّرَٰطَ", translit: "ṣ-ṣirāṭa", translation: "(hacia) el camino", start: 31.3, end: 32.7 },
                { word: "ٱلْمُسْتَقِيمَ", translit: "l-mustaqīm", translation: "recto", start: 32.7, end: 35.5 }
            ]
        },
        {
            arabic: "صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ",
            transliteration: "ṣirāṭa lladhīna anʿamta ʿalayhim ghayri l-maghḍūbi ʿalayhim wa-lā ḍ-ḍāllīn",
            translation: "El camino de los que has colmado con Tus favores, no el de los que han caído en Tu ira, ni el de los que se extraviaron.",
            verseNumber: 7,
            wordTimings: [
                { word: "صِرَٰطَ", translit: "ṣirāṭa", translation: "(el) camino", start: 38.1, end: 39.0 },
                { word: "ٱلَّذِينَ", translit: "lladhīna", translation: "(de) aquellos", start: 39.0, end: 40.5 },
                { word: "أَنْعَمْتَ", translit: "anʿamta", translation: "Tú has concedido (Tus) favores", start: 40.5, end: 41.8 },
                { word: "عَلَيْهِمْ", translit: "ʿalayhim", translation: "sobre ellos", start: 41.8, end: 42.9 },
                { word: "غَيْرِ", translit: "ghayri", translation: "no (de)", start: 42.6, end: 44.3 },
                { word: "ٱلْمَغْضُوبِ", translit: "l-maghḍūbi", translation: "aquellos que incurrieron en (Tu) ira", start: 44.3, end: 45.9 },
                { word: "عَلَيْهِمْ", translit: "ʿalayhim", translation: "sobre ellos mismos", start: 45.9, end: 46.8 },
                { word: "وَلَا", translit: "wa-lā", translation: "y no", start: 46.8, end: 48.4 },
                { word: "ٱلضَّآلِّينَ", translit: "ḍ-ḍāllīn", translation: "(de) aquellos que se extravían", start: 48.4, end: 54.0 }
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
            translation: "Di: “Me refugio en el Señor del amanecer",
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
            translation: "de todo el mal que existe en lo que Él creó",
            verseNumber: 2,
            wordTimings: [
                { word: "مِن", translit: "min", start: 6.7, end: 7.4 },
                { word: "شَرِّ", translit: "sharri", start: 7.4, end: 8.2 },
                { word: "مَا", translit: "mā", start: 8.23, end: 8.9 },
                { word: "خَلَقَ", translit: "khalaq", start: 8.9, end: 9.5 },
            ],
        },
        {
            arabic: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ",
            transliteration: "wamin sharri ghāsiqin ’idhā waqab",
            translation: "del mal de la oscuridad de la noche cuando se extiende",
            verseNumber: 3,
            wordTimings: [
                { word: "وَمِن", translit: "wamin", start: 9.5, end: 10.3 },
                { word: "شَرِّ", translit: "sharri", start: 10.3, end: 11.1 },
                { word: "غَاسِقٍ", translit: "ghāsiqin", start: 11.1, end: 12.2 },
                { word: "إِذَا", translit: "’idhā", start: 12.25, end: 12.9 },
                { word: "وَقَبَ", translit: "waqab", start: 12.9, end: 13.6 },
            ],
        },
        {
            arabic: "وَمِن شَرِّ ٱلنَّفَّـٰـثَـٰتِ فِى ٱلْعُقَدِ",
            transliteration: "wamin sharri n-naffāthāti fi l-‘uqad",
            translation: "del mal de las [hechiceras] sopladoras de nudos",
            verseNumber: 4,
            wordTimings: [
                { word: "وَمِن", translit: "wamin", start: 13.8, end: 14.7 },
                { word: "شَرِّ", translit: "sharri", start: 14.7, end: 15.7 },
                { word: "ٱلنَّفَّـٰـثَـٰتِ", translit: "n-naffāthāti", start: 15.7, end: 17.6 },
                { word: "فِى", translit: "fi", start: 17.55, end: 18.2 },
                { word: "ٱلْعُقَدِ", translit: "l-‘uqad", start: 18.2, end: 19.0 },
            ],
        },
        {
            arabic: "وَمِن شَرِ حَاسِدٍ إِذَا حَسَدَ",
            transliteration: "wamin sharri ḥāsidin idhā ḥasad",
            translation: "y del mal del envidioso cuando envidia",
            verseNumber: 5,
            wordTimings: [
                { word: "وَمِن", translit: "wamin", start: 19.1, end: 19.8 },
                { word: "شَرِ", translit: "sharri", start: 19.8, end: 20.5 },
                { word: "حَاسِدٍ", translit: "ḥāsidin", start: 20.6, end: 21.5 },
                { word: "إِذَا", translit: "idhā", start: 21.7, end: 22.3 },
                { word: "حَسَدَ", translit: "ḥasad", start: 22.3, end: 23.1 },
            ],
        }
    ],
};

// Surah An-Nas (114)
export const surahAnNas: Surah = {
    id: 114,
    name: "An-Nas",
    arabicName: "الناس",
    audioUrl: "https://archive.org/download/114-an-nas_202605/114%20An-Nas%20%D8%A7%D9%84%D9%86%D8%A7%D8%B3.mp3",
    verses: [
        {
            arabic: "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ",
            transliteration: "bismi l-lāhi r-raḥmāni r-raḥīm",
            translation: "En el nombre de Allah, el Compasivo, el Misericordioso.",
            verseNumber: 0,
            wordTimings: [
                { word: "بِسْمِ", translit: "bismi", translation: "en el nombre", start: 0.0, end: 0 },
                { word: "ٱللَّهِ", translit: "l-lāhi", translation: "de Allah", start: 0, end: 0 },
                { word: "ٱلرَّحْمَـٰنِ", translit: "r-raḥmāni", translation: "el Compasivo", start: 0, end: 0 },
                { word: "ٱلرَّحِيمِ", translit: "r-raḥīm", translation: "el Misericordioso", start: 0, end: 0 },
            ],
        },
        {
            arabic: "قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ",
            transliteration: "qul ʾaʿūdhu birabbi n-nās",
            translation: "Di: “Me refugio en el Señor de los seres humanos,”",
            verseNumber: 1,
            wordTimings: [
                { word: "قُلْ", translit: "qul", translation: "di", start: 3.46, end: 3.76 },
                { word: "أَعُوذُ", translit: "aʿūdhu", translation: "me refugio", start: 3.86, end: 4.5 },
                { word: "بِرَبِّ", translit: "birabbi", translation: "en el Señor", start: 4.55, end: 5.4 },
                { word: "ٱلنَّاسِ", translit: "n-nās", translation: "de los seres humanos", start: 5.4, end: 7.6 },
            ],
        },
        {
            arabic: "مَلِكِ ٱلنَّاسِ",
            transliteration: "maliki n-nās",
            translation: "en el Rey Soberano de los seres humanos,",
            verseNumber: 2,
            wordTimings: [
                { word: "مَلِكِ", translit: "maliki", translation: "el Rey Soberano", start: 7.7, end: 8.5 },
                { word: "ٱلنَّاسِ", translit: "n-nās", translation: "de los seres humanos", start: 8.5, end: 10.6 },
            ],
        },
        {
            arabic: "إِلَـٰهِ ٱلنَّاسِ",
            transliteration: "ʾilāhi n-nās",
            translation: "en el [único] Dios de los seres humanos,",
            verseNumber: 3,
            wordTimings: [
                { word: "إِلَـٰهِ", translit: "ʾilāhi", translation: "el Dios", start: 10.6, end: 11.6 },
                { word: "ٱلنَّاسِ", translit: "n-nās", translation: "de los seres humanos", start: 11.6, end: 14.1 },
            ],
        },
        {
            arabic: "مِن شَرِّ ٱلْوَسْوَاسِ ٱلْخَنَّاسِ",
            transliteration: "min sharri l-waswāsi l-khannās",
            translation: "de la maldad del [demonio] susurrador que huye [cuando el nombre de Dios es mencionado],",
            verseNumber: 4,
            wordTimings: [
                { word: "مِن", translit: "min", translation: "de", start: 14.5, end: 15.3 },
                { word: "شَرِّ", translit: "sharri", translation: "la maldad", start: 15.3, end: 15.8 },
                { word: "ٱلْوَسْوَاسِ", translit: "l-waswāsi", translation: "del susurrador", start: 15.9, end: 17.0 },
                { word: "ٱلْخَنَّاسِ", translit: "l-khannās", translation: "que huye / se retrae", start: 16.9, end: 19.8 },
            ],
        },
        {
            arabic: "ٱلَّذِى يُوَسْوِسُ فِى صُدُورِ ٱلنَّاسِ",
            transliteration: "alladhī yuwaswisu fī ṣudūri n-nās",
            translation: "que susurra en los corazones de los seres humanos,",
            verseNumber: 5,
            wordTimings: [
                { word: "ٱلَّذِى", translit: "alladhī", translation: "quien", start: 20.0, end: 21.1 },
                { word: "يُوَسْوِسُ", translit: "yuwaswisu", translation: "susurra", start: 21.0, end: 21.9 },
                { word: "فِى", translit: "fī", translation: "en", start: 21.9, end: 22.1 },
                { word: "صُدُورِ", translit: "ṣudūri", translation: "los corazones", start: 22.3, end: 23.0 },
                { word: "ٱلنَّاسِ", translit: "n-nās", translation: "de los seres humanos", start: 23.1, end: 25.2 },
            ],
        },
        {
            arabic: "مِنَ ٱلْجِنَّةِ وَٱلنَّاسِ",
            transliteration: "mina l-jinnati wa n-nās",
            translation: "y existe entre los yinn y entre los seres humanos.”",
            verseNumber: 6,
            wordTimings: [
                { word: "مِنَ", translit: "mina", translation: "de entre", start: 25.5, end: 25.8 },
                { word: "ٱلْجِنَّةِ", translit: "l-jinnati", translation: "los yinn", start: 25.8, end: 27.7 },
                { word: "وَٱلنَّاسِ", translit: "wa n-nās", translation: "y los seres humanos", start: 27.8, end: 31.3 },
            ],
        },
    ],
};

// Export all surahs for easy access
export const surahs: Surah[] = [surahAlFatiha, surahAlIkhlas, surahAlFalaq, surahAnNas];

// Helper to get surah by ID
export const getSurahById = (id: number): Surah | undefined => {
    return surahs.find(s => s.id === id);
};
