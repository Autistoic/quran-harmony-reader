export interface WordTiming {
  word: string;
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
  audioUrl: "", // TODO: Add MP3 URL
  verses: [
    {
      arabic: "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ",
      transliteration: "bi-smi-llāhi-r-raḥmāni-r-raḥīm(i)",
      verseNumber: 1,
      wordTimings: [
        { word: "بِسْمِ", start: 0.0, end: 0.8 },
        { word: "ٱللَّهِ", start: 0.8, end: 1.5 },
        { word: "ٱلرَّحْمَـٰنِ", start: 1.5, end: 2.5 },
        { word: "ٱلرَّحِيمِ", start: 2.5, end: 3.5 }
      ]
    },
    {
      arabic: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ",
      transliteration: "al-ḥamdu li-llāhi rabbi-l-ʿālamīn(a)",
      verseNumber: 2,
      wordTimings: [
        { word: "ٱلْحَمْدُ", start: 3.5, end: 4.2 },
        { word: "لِلَّهِ", start: 4.2, end: 4.8 },
        { word: "رَبِّ", start: 4.8, end: 5.3 },
        { word: "ٱلْعَـٰلَمِينَ", start: 5.3, end: 6.5 }
      ]
    },
    {
      arabic: "ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ",
      transliteration: "ar-raḥmāni-r-raḥīm(i)",
      verseNumber: 3,
      wordTimings: [
        { word: "ٱلرَّحْمَـٰنِ", start: 6.5, end: 7.5 },
        { word: "ٱلرَّحِيمِ", start: 7.5, end: 8.5 }
      ]
    },
    {
      arabic: "مَـٰلِكِ يَوْمِ ٱلدِّينِ",
      transliteration: "māliki yawmi-d-dīn(i)",
      verseNumber: 4,
      wordTimings: [
        { word: "مَـٰلِكِ", start: 8.5, end: 9.2 },
        { word: "يَوْمِ", start: 9.2, end: 9.8 },
        { word: "ٱلدِّينِ", start: 9.8, end: 10.8 }
      ]
    },
    {
      arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
      transliteration: "iyyāka naʿbudu wa-iyyāka nastaʿīn(u)",
      verseNumber: 5,
      wordTimings: [
        { word: "إِيَّاكَ", start: 10.8, end: 11.5 },
        { word: "نَعْبُدُ", start: 11.5, end: 12.2 },
        { word: "وَإِيَّاكَ", start: 12.2, end: 13.0 },
        { word: "نَسْتَعِينُ", start: 13.0, end: 14.2 }
      ]
    },
    {
      arabic: "ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ",
      transliteration: "ihdinā-ṣ-ṣirāṭa-l-mustaqīm(a)",
      verseNumber: 6,
      wordTimings: [
        { word: "ٱهْدِنَا", start: 14.2, end: 15.0 },
        { word: "ٱلصِّرَٰطَ", start: 15.0, end: 15.8 },
        { word: "ٱلْمُسْتَقِيمَ", start: 15.8, end: 17.0 }
      ]
    },
    {
      arabic: "صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ",
      transliteration: "ṣirāṭa-lladhīna anʿamta ʿalayhim ghayri-l-maghḍūbi ʿalayhim wa-lā-ḍ-ḍāllīn",
      verseNumber: 7,
      wordTimings: [
        { word: "صِرَٰطَ", start: 17.0, end: 17.6 },
        { word: "ٱلَّذِينَ", start: 17.6, end: 18.3 },
        { word: "أَنْعَمْتَ", start: 18.3, end: 19.0 },
        { word: "عَلَيْهِمْ", start: 19.0, end: 19.7 },
        { word: "غَيْرِ", start: 19.7, end: 20.3 },
        { word: "ٱلْمَغْضُوبِ", start: 20.3, end: 21.2 },
        { word: "عَلَيْهِمْ", start: 21.2, end: 21.9 },
        { word: "وَلَا", start: 21.9, end: 22.4 },
        { word: "ٱلضَّآلِّينَ", start: 22.4, end: 23.5 }
      ]
    }
  ]
};

// Surah Al-Ikhlas (112) with estimated timings
export const surahAlIkhlas: Surah = {
  id: 112,
  name: "Al-Ikhlas",
  arabicName: "الإخلاص",
  audioUrl: "https://archive.org/download/112.-ihlas-suresi/112.Ihlas%20suresi.mp3",
  verses: [
    {
      arabic: "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ",
      transliteration: "bi-smi llāhi r-raḥmāni r-raḥīm(i)",
      wordTimings: [
        { word: "بِسْمِ", start: 0.0, end: 0.8 },
        { word: "ٱللَّهِ", start: 0.8, end: 1.5 },
        { word: "ٱلرَّحْمَـٰنِ", start: 1.5, end: 2.5 },
        { word: "ٱلرَّحِيمِ", start: 2.5, end: 3.8 }
      ]
    },
    {
      arabic: "قُلْ هُوَ ٱللَّهُ أَحَدٌ",
      transliteration: "qul huwa llāhu aḥad(un)",
      verseNumber: 1,
      wordTimings: [
        { word: "قُلْ", start: 9.3, end: 9.9 },
        { word: "هُوَ", start: 9.9, end: 10.4 },
        { word: "ٱللَّهُ", start: 10.4, end: 11.2 },
        { word: "أَحَدٌ", start: 11.2, end: 12.5 }
      ]
    },
    {
      arabic: "ٱللَّهُ ٱلصَّمَدُ",
      transliteration: "allāhu ṣ-ṣamad(u)",
      verseNumber: 2,
      wordTimings: [
        { word: "ٱللَّهُ", start: 14.2, end: 15.2 },
        { word: "ٱلصَّمَدُ", start: 15.2, end: 16.8 }
      ]
    },
    {
      arabic: "لَمْ يَلِدْ وَلَمْ يُولَدْ",
      transliteration: "lam yalid wa-lam yūlad",
      verseNumber: 3,
      wordTimings: [
        { word: "لَمْ", start: 18.5, end: 19.0 },
        { word: "يَلِدْ", start: 19.0, end: 19.8 },
        { word: "وَلَمْ", start: 19.8, end: 20.4 },
        { word: "يُولَدْ", start: 20.4, end: 21.8 }
      ]
    },
    {
      arabic: "وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ",
      transliteration: "wa-lam yaku l-lahū kufuwan aḥad(um)",
      verseNumber: 4,
      wordTimings: [
        { word: "وَلَمْ", start: 23.3, end: 23.9 },
        { word: "يَكُن", start: 24.1, end: 24.6 },
        { word: "لَّهُۥ", start: 24.6, end: 26.6 },
        { word: "كُفُوًا", start: 26.6, end: 27.3 },
        { word: "أَحَدٌۢ", start: 27.3, end: 28.2 }
      ]
    }
  ]
};

// Export all surahs for easy access
export const surahs: Surah[] = [surahAlFatiha, surahAlIkhlas];

// Helper to get surah by ID
export const getSurahById = (id: number): Surah | undefined => {
  return surahs.find(s => s.id === id);
};
