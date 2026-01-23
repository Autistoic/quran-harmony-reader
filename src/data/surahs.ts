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
  "id": 112,
  "name": "Al-Ikhlas",
  "arabicName": "الإخلاص",
  "audioUrl": "https://archive.org/download/112.-ihlas-suresi/112.Ihlas%20suresi.mp3",
  "verses": [
    {
      "arabic": "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ",
      "transliteration": "bi-smi llāhi r-raḥmāni r-raḥīm(i)",
      "wordTimings": [
        { "word": "بِسْمِ", "start": 0.0, "end": 0.8 },
        { "word": "ٱللَّهِ", "start": 0.8, "end": 1.5 },
        { "word": "ٱلرَّحْمَـٰنِ", "start": 1.5, "end": 2.5 },
        { "word": "ٱلرَّحِيمِ", "start": 2.5, "end": 3.8 }
      ]
    },
    {
      "arabic": "قُلْ هُوَ ٱللَّهُ أَحَدٌ",
      "transliteration": "qul huwa llāhu aḥad(un)",
      "verseNumber": 1,
      "wordTimings": [
        { "word": "قُلْ", "start": 9.3, "end": 9.9 },
        { "word": "هُوَ", "start": 9.9, "end": 10.4 },
        { "word": "ٱللَّهُ", "start": 10.4, "end": 11.2 },
        { "word": "أَحَدٌ", "start": 11.2, "end": 12.5 }
      ]
    },
    {
      "arabic": "ٱللَّهُ ٱلصَّمَدُ",
      "transliteration": "allāhu ṣ-ṣamad(u)",
      "verseNumber": 2,
      "wordTimings": [
        { "word": "ٱللَّهُ", "start": 14.2, "end": 15.2 },
        { "word": "ٱلصَّمَدُ", "start": 15.2, "end": 16.8 }
      ]
    },
    {
      "arabic": "لَمْ يَلِدْ وَلَمْ يُولَدْ",
      "transliteration": "lam yalid wa-lam yūlad",
      "verseNumber": 3,
      "wordTimings": [
        { "word": "لَمْ", "start": 18.5, "end": 19.0 },
        { "word": "يَلِدْ", "start": 19.0, "end": 19.8 },
        { "word": "وَلَمْ", "start": 19.8, "end": 20.4 },
        { "word": "يُولَدْ", "start": 20.4, "end": 21.8 }
      ]
    },
    {
      "arabic": "وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ",
      "transliteration": "wa-lam yaku l-lahū kufuwan aḥad(um)",
      "verseNumber": 4,
      "wordTimings": [
        { "word": "وَلَمْ", "start": 23.3, "end": 23.9 },
        { "word": "يَكُن", "start": 24.1, "end": 24.6 },
        { "word": "لَّهُۥ", "start": 24.6, "end": 26.6 },
        { "word": "كُفُوًا", "start": 26.6, "end": 27.3 },
        { "word": "أَحَدٌۢ", "start": 27.3, "end": 28.2 }
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
