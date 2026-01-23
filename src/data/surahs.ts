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
  audioUrl: "", // TODO: Add MP3 URL
  verses: [
    {
      arabic: "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ",
      transliteration: "bismi llāhi r-raḥmāni r-raḥīm",
      verseNumber: 1,
      wordTimings: [
        { word: "بِسْمِ", translit: "bismi", start: 0.0, end: 0.8 },
        { word: "ٱللَّهِ", translit: "llāhi", start: 0.8, end: 1.5 },
        { word: "ٱلرَّحْمَـٰنِ", translit: "r-raḥmāni", start: 1.5, end: 2.5 },
        { word: "ٱلرَّحِيمِ", translit: "r-raḥīm", start: 2.5, end: 3.5 }
      ]
    },
    {
      arabic: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ",
      transliteration: "al-ḥamdu lillāhi rabbi l-ʿālamīn",
      verseNumber: 2,
      wordTimings: [
        { word: "ٱلْحَمْدُ", translit: "al-ḥamdu", start: 3.5, end: 4.2 },
        { word: "لِلَّهِ", translit: "lillāhi", start: 4.2, end: 4.8 },
        { word: "رَبِّ", translit: "rabbi", start: 4.8, end: 5.3 },
        { word: "ٱلْعَـٰلَمِينَ", translit: "l-ʿālamīn", start: 5.3, end: 6.5 }
      ]
    },
    {
      arabic: "ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ",
      transliteration: "ar-raḥmāni r-raḥīm",
      verseNumber: 3,
      wordTimings: [
        { word: "ٱلرَّحْمَـٰنِ", translit: "ar-raḥmāni", start: 6.5, end: 7.5 },
        { word: "ٱلرَّحِيمِ", translit: "r-raḥīm", start: 7.5, end: 8.5 }
      ]
    },
    {
      arabic: "مَـٰلِكِ يَوْمِ ٱلدِّينِ",
      transliteration: "māliki yawmi d-dīn",
      verseNumber: 4,
      wordTimings: [
        { word: "مَـٰلِكِ", translit: "māliki", start: 8.5, end: 9.2 },
        { word: "يَوْمِ", translit: "yawmi", start: 9.2, end: 9.8 },
        { word: "ٱلدِّينِ", translit: "d-dīn", start: 9.8, end: 10.8 }
      ]
    },
    {
      arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
      transliteration: "iyyāka naʿbudu wa-iyyāka nastaʿīn",
      verseNumber: 5,
      wordTimings: [
        { word: "إِيَّاكَ", translit: "iyyāka", start: 10.8, end: 11.5 },
        { word: "نَعْبُدُ", translit: "naʿbudu", start: 11.5, end: 12.2 },
        { word: "وَإِيَّاكَ", translit: "wa-iyyāka", start: 12.2, end: 13.0 },
        { word: "نَسْتَعِينُ", translit: "nastaʿīn", start: 13.0, end: 14.2 }
      ]
    },
    {
      arabic: "ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ",
      transliteration: "ihdinā ṣ-ṣirāṭa l-mustaqīm",
      verseNumber: 6,
      wordTimings: [
        { word: "ٱهْدِنَا", translit: "ihdinā", start: 14.2, end: 15.0 },
        { word: "ٱلصِّرَٰطَ", translit: "ṣ-ṣirāṭa", start: 15.0, end: 15.8 },
        { word: "ٱلْمُسْتَقِيمَ", translit: "l-mustaqīm", start: 15.8, end: 17.0 }
      ]
    },
    {
      arabic: "صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ",
      transliteration: "ṣirāṭa lladhīna anʿamta ʿalayhim ghayri l-maghḍūbi ʿalayhim wa-lā ḍ-ḍāllīn",
      verseNumber: 7,
      wordTimings: [
        { word: "صِرَٰطَ", translit: "ṣirāṭa", start: 17.0, end: 17.6 },
        { word: "ٱلَّذِينَ", translit: "lladhīna", start: 17.6, end: 18.3 },
        { word: "أَنْعَمْتَ", translit: "anʿamta", start: 18.3, end: 19.0 },
        { word: "عَلَيْهِمْ", translit: "ʿalayhim", start: 19.0, end: 19.7 },
        { word: "غَيْرِ", translit: "ghayri", start: 19.7, end: 20.3 },
        { word: "ٱلْمَغْضُوبِ", translit: "l-maghḍūbi", start: 20.3, end: 21.2 },
        { word: "عَلَيْهِمْ", translit: "ʿalayhim", start: 21.2, end: 21.9 },
        { word: "وَلَا", translit: "wa-lā", start: 21.9, end: 22.4 },
        { word: "ٱلضَّآلِّينَ", translit: "ḍ-ḍāllīn", start: 22.4, end: 23.5 }
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

// Export all surahs for easy access
export const surahs: Surah[] = [surahAlFatiha, surahAlIkhlas];

// Helper to get surah by ID
export const getSurahById = (id: number): Surah | undefined => {
  return surahs.find(s => s.id === id);
};
