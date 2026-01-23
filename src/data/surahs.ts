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

// Surah Al-Ikhlas (112) with estimated timings
// Total audio duration is approximately 12 seconds
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
        { word: "ٱلرَّحِيمِ", start: 2.5, end: 3.8 },
      ]
    },
    {
      arabic: "قُلْ هُوَ ٱللَّهُ أَحَدٌ",
      transliteration: "qul huwa llāhu aḥad(un)",
      verseNumber: 1,
      wordTimings: [
        { word: "قُلْ", start: 3.8, end: 4.3 },
        { word: "هُوَ", start: 4.3, end: 4.7 },
        { word: "ٱللَّهُ", start: 4.7, end: 5.3 },
        { word: "أَحَدٌ", start: 5.3, end: 6.2 },
      ]
    },
    {
      arabic: "ٱللَّهُ ٱلصَّمَدُ",
      transliteration: "allāhu ṣ-ṣamad(u)",
      verseNumber: 2,
      wordTimings: [
        { word: "ٱللَّهُ", start: 6.2, end: 7.0 },
        { word: "ٱلصَّمَدُ", start: 7.0, end: 8.2 },
      ]
    },
    {
      arabic: "لَمْ يَلِدْ وَلَمْ يُولَدْ",
      transliteration: "lam yalid wa-lam yūlad",
      verseNumber: 3,
      wordTimings: [
        { word: "لَمْ", start: 8.2, end: 8.6 },
        { word: "يَلِدْ", start: 8.6, end: 9.1 },
        { word: "وَلَمْ", start: 9.1, end: 9.6 },
        { word: "يُولَدْ", start: 9.6, end: 10.5 },
      ]
    },
    {
      arabic: "وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ",
      transliteration: "wa-lam yaku l-lahū kufuwan aḥad(um)",
      verseNumber: 4,
      wordTimings: [
        { word: "وَلَمْ", start: 10.5, end: 11.0 },
        { word: "يَكُن", start: 11.0, end: 11.4 },
        { word: "لَّهُۥ", start: 11.4, end: 11.8 },
        { word: "كُفُوًا", start: 11.8, end: 12.5 },
        { word: "أَحَدٌۢ", start: 12.5, end: 13.5 },
      ]
    }
  ]
};

// Export all surahs for easy access
export const surahs: Surah[] = [surahAlIkhlas];

// Helper to get surah by ID
export const getSurahById = (id: number): Surah | undefined => {
  return surahs.find(s => s.id === id);
};
