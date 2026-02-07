export interface WirdWordTiming {
  word: string;
  start: number;
  end: number;
}

export interface WirdVerse {
  transliteration: string;
  wordTimings: WirdWordTiming[];
  repetitions?: number;
  note?: string;
}

export interface WirdData {
  id: string;
  name: string;
  audioUrl: string;
  verses: WirdVerse[];
}

export const wirdSharifSaguir: WirdData = {
  id: "wird-sharif-saguir",
  name: "Wird Sharif Saguir",
  audioUrl: "https://archive.org/download/Wirdi/Wirdi.mp3",
  verses: [
    {
      transliteration: "aU'DHU biLLAHI minash-shaiTAN ir-raYIM",
      repetitions: 10,
      wordTimings: [
        { word: "aU'DHU", start: 0.0, end: 1.0 },
        { word: "biLLAHI", start: 1.0, end: 2.0 },
        { word: "minash-shaiTAN", start: 2.0, end: 3.5 },
        { word: "ir-raYIM", start: 3.5, end: 5.0 },
      ],
    },
    {
      transliteration: "bismiLLAH ir-rahMAN ir-raHIM",
      repetitions: 9,
      wordTimings: [
        { word: "bismiLLAH", start: 50.0, end: 51.5 },
        { word: "ir-rahMAN", start: 51.5, end: 53.0 },
        { word: "ir-raHIM", start: 53.0, end: 55.0 },
      ],
    },
    {
      transliteration: "AsTAGfiruLLAH",
      repetitions: 100,
      note: "AsTAGfiruLLAH AsTAGfiruLLAH",
      wordTimings: [
        { word: "AsTAGfiruLLAH", start: 60.0, end: 62.0 },
      ],
    },
    {
      transliteration:
        "AsTAGfiruLLAH al-a'ZIM al-laDHI LA iLAha ILLA HU al-HAYY ul-qayYUM wa aTUbu iLAYh was-Aluhut-TAWbata wal-magFRata wal-hiDAYata INnahu HUwat-tawWAB ur-raHIM.",
      wordTimings: [
       { word: "AsTAGfiruLLAH", start: 87.0, end: 88.5 },
        { word: "al-a'ZIM", start: 88.5, end: 89.5 },
        { word: "al-laDHI", start: 89.5, end: 90.4 },
        { word: "LA", start: 90.4, end: 90.7 },
        { word: "iLAha", start: 90.7, end: 93.1 },
        { word: "ILLA", start: 93.1, end: 94.0 },
        { word: "HU", start: 94.0, end: 94.5 }, // Comienza justo donde termina ILLA
        { word: "al-HAYY", start: 94.5, end: 95.5 },
        { word: "ul-qayYUM", start: 95.5, end: 96.3 },
        { word: "wa", start: 96.3, end: 96.8 },
        { word: "aTUbu", start: 96.8, end: 97.5 },
        { word: "iLAYh", start: 97.5, end: 98.1 },
        { word: "was-Aluhut-TAWbata", start: 98.1, end: 99.5 },
        { word: "wal-magFRata", start: 99.5, end: 100.7 },
        { word: "wal-hiDAYata", start: 100.7, end: 102.0 },
        { word: "INnahu", start: 102.0, end: 102.8 },
        { word: "HUwat-tawWAB", start: 102.8, end: 103.0 },
        { word: "ur-raHIM.", start: 103.0, end: 105.5 },
      ],
    },
    {
      transliteration: "WA'fu a'nNA ya kaRIM",
      repetitions: 3,
      wordTimings: [
        { word: "WA'fu", start: 106.0, end: 106.8 },
        { word: "a'nNA", start: 106.8, end: 107.4 },
        { word: "ya", start: 107.4, end: 107.7 },
        { word: "kaRIM", start: 107.7, end: 108.5 },
      ],
    },
    {
      transliteration: "wagFIR laNA biFADIlika ya rahMANu ya raHIM",
      repetitions: 3,
      wordTimings: [
        { word: "wagFIR", start: 118.7, end: 119.1 },
        { word: "laNA", start: 119.1, end: 119.6 },
        { word: "biFADIlika", start: 119.6, end: 120.3 },
        { word: "ya", start: 120.3, end: 120.6 },
        { word: "rahMANu", start: 120.6, end: 121.0 },
        { word: "ya", start: 121.0, end: 121.5 },
        { word: "raHIM", start: 121.5, end: 122.5 },
      ],
    },
    {
      transliteration: "Ya MALiku YA qudDUSu YA haFIzu YA ALLAH",
      repetitions: 3,
      wordTimings: [
       { word: "Ya", start: 122.5, end: 122.7 },
        { word: "MALiku", start: 122.7, end: 123.0 },
        { word: "YA", start: 123.0, end: 123.4 },
        { word: "qudDUSu", start: 123.4, end: 123.8 },
        { word: "YA", start: 123.8, end: 124.1 },
        { word: "haFIzu", start: 124.1, end: 124.6 },
        { word: "YA", start: 124.6, end: 124.8 },
        { word: "ALLAH", start: 124.8, end: 126.0 },
      ],
    },
    {
      transliteration:
        "aLLAHUMma SALIi a'LA sayyidiNA muHAMmadin wa a'LA A-li muHAMmadin wa SAHbihi wa SALlim",
      repetitions: 3,
      note: "cruzar los brazos sobre el pecho",
      wordTimings: [
        { word: "aLLAHUMma", start: 375.0, end: 376.2 },
        { word: "SALIi", start: 376.2, end: 377.0 },
        { word: "a'LA", start: 377.0, end: 377.5 },
        { word: "sayyidiNA", start: 377.5, end: 378.5 },
        { word: "muHAMmadin", start: 378.5, end: 379.5 },
        { word: "wa", start: 379.5, end: 379.8 },
        { word: "a'LA", start: 379.8, end: 380.3 },
        { word: "A-li", start: 380.3, end: 380.8 },
        { word: "muHAMmadin", start: 380.8, end: 381.8 },
        { word: "wa", start: 381.8, end: 382.1 },
        { word: "SAHbihi", start: 382.1, end: 383.0 },
        { word: "wa", start: 383.0, end: 383.3 },
        { word: "SALlim", start: 383.3, end: 384.5 },
      ],
    },
    {
      transliteration:
        "aLLAHUMma SALIi a'LA sayyidiNA muHAMmadin MAJtalaf al-malaWAN wa taA'QAbal a'saRAN wa KARRaral yadiDAN wasTA Qbal al-farqgaDAN wa BALlig RUhahu wa arWAha AHIi BAItihi MINNAt-tahiyYAta was-saLAM. wa BArik wa SALIlim a'LAThi kaCIran kaCIran kaCIra. wa SALIa LLAhu a'LA sayYIdiNA muHAMnmadin wa a'LA yaMI'il-anbiYA'i",
      wordTimings: [
        { word: "aLLAHUMma", start: 400.0, end: 401.2 },
        { word: "SALIi", start: 401.2, end: 402.0 },
        { word: "a'LA", start: 402.0, end: 402.5 },
        { word: "sayyidiNA", start: 402.5, end: 403.5 },
        { word: "muHAMmadin", start: 403.5, end: 404.5 },
        { word: "MAJtalaf", start: 404.5, end: 405.5 },
        { word: "al-malaWAN", start: 405.5, end: 406.5 },
        { word: "wa", start: 406.5, end: 406.8 },
        { word: "taA'QAbal", start: 406.8, end: 407.8 },
        { word: "a'saRAN", start: 407.8, end: 408.8 },
        { word: "wa", start: 408.8, end: 409.1 },
        { word: "KARRaral", start: 409.1, end: 410.0 },
        { word: "yadiDAN", start: 410.0, end: 411.0 },
        { word: "wasTA Qbal", start: 411.0, end: 412.0 },
        { word: "al-farqgaDAN", start: 412.0, end: 413.2 },
        { word: "wa", start: 413.2, end: 413.5 },
        { word: "BALlig", start: 413.5, end: 414.3 },
        { word: "RUhahu", start: 414.3, end: 415.2 },
        { word: "wa", start: 415.2, end: 415.5 },
        { word: "arWAha", start: 415.5, end: 416.5 },
        { word: "AHIi", start: 416.5, end: 417.2 },
        { word: "BAItihi", start: 417.2, end: 418.2 },
        { word: "MINNAt-tahiyYAta", start: 418.2, end: 419.8 },
        { word: "was-saLAM.", start: 419.8, end: 421.0 },
        { word: "wa", start: 421.0, end: 421.3 },
        { word: "BArik", start: 421.3, end: 422.0 },
        { word: "wa", start: 422.0, end: 422.3 },
        { word: "SALIlim", start: 422.3, end: 423.3 },
        { word: "a'LAThi", start: 423.3, end: 424.2 },
        { word: "kaCIran", start: 424.2, end: 425.0 },
        { word: "kaCIran", start: 425.0, end: 425.8 },
        { word: "kaCIra.", start: 425.8, end: 426.8 },
        { word: "wa", start: 426.8, end: 427.1 },
        { word: "SALIa", start: 427.1, end: 427.8 },
        { word: "LLAhu", start: 427.8, end: 428.5 },
        { word: "a'LA", start: 428.5, end: 429.0 },
        { word: "sayYIdiNA", start: 429.0, end: 430.0 },
        { word: "muHAMnmadin", start: 430.0, end: 431.0 },
        { word: "wa", start: 431.0, end: 431.3 },
        { word: "a'LA", start: 431.3, end: 431.8 },
        { word: "yaMI'il-anbiYA'i", start: 431.8, end: 433.5 },
      ],
    },
  ],
};
