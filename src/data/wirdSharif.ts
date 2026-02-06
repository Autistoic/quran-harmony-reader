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

// NOTE: Los tiempos (start/end) son aproximados y deben ajustarse
// escuchando el audio real para lograr sincronización perfecta.

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
        { word: "AsTAGfiruLLAH", start: 100.0, end: 102.0 },
      ],
    },
    {
      transliteration:
        "AsTAGfiruLLAH al-a'ZIM al-laDHI LA iLAha ILLA HU al-HAYY ul-qayYUM wa aTUbu iLAYh was-Aluhut-TAWbata wal-magFRata wal-hiDAYata INnahu HUwat-tawWAB ur-raHIM.",
      wordTimings: [
        { word: "AsTAGfiruLLAH", start: 300.0, end: 301.5 },
        { word: "al-a'ZIM", start: 301.5, end: 302.5 },
        { word: "al-laDHI", start: 302.5, end: 303.3 },
        { word: "LA", start: 303.3, end: 303.7 },
        { word: "iLAha", start: 303.7, end: 304.3 },
        { word: "ILLA", start: 304.3, end: 304.8 },
        { word: "HU", start: 304.8, end: 305.2 },
        { word: "al-HAYY", start: 305.2, end: 306.0 },
        { word: "ul-qayYUM", start: 306.0, end: 307.0 },
        { word: "wa", start: 307.0, end: 307.3 },
        { word: "aTUbu", start: 307.3, end: 308.0 },
        { word: "iLAYh", start: 308.0, end: 308.6 },
        { word: "was-Aluhut-TAWbata", start: 308.6, end: 310.0 },
        { word: "wal-magFRata", start: 310.0, end: 311.2 },
        { word: "wal-hiDAYata", start: 311.2, end: 312.5 },
        { word: "INnahu", start: 312.5, end: 313.3 },
        { word: "HUwat-tawWAB", start: 313.3, end: 314.5 },
        { word: "ur-raHIM.", start: 314.5, end: 316.0 },
      ],
    },
    {
      transliteration: "WA'fu a'nNA ya kaRIM",
      repetitions: 3,
      wordTimings: [
        { word: "WA'fu", start: 320.0, end: 321.0 },
        { word: "a'nNA", start: 321.0, end: 321.8 },
        { word: "ya", start: 321.8, end: 322.2 },
        { word: "kaRIM", start: 322.2, end: 323.5 },
      ],
    },
    {
      transliteration: "wagFIR laNA biFADIlika ya rahMANu ya raHIM",
      repetitions: 3,
      wordTimings: [
        { word: "wagFIR", start: 335.0, end: 336.0 },
        { word: "laNA", start: 336.0, end: 336.7 },
        { word: "biFADIlika", start: 336.7, end: 338.0 },
        { word: "ya", start: 338.0, end: 338.3 },
        { word: "rahMANu", start: 338.3, end: 339.2 },
        { word: "ya", start: 339.2, end: 339.5 },
        { word: "raHIM", start: 339.5, end: 341.0 },
      ],
    },
    {
      transliteration: "Ya MALiku YA qudDUSu YA haFIzu YA ALLAH",
      repetitions: 3,
      wordTimings: [
        { word: "Ya", start: 355.0, end: 355.4 },
        { word: "MALiku", start: 355.4, end: 356.2 },
        { word: "YA", start: 356.2, end: 356.6 },
        { word: "qudDUSu", start: 356.6, end: 357.5 },
        { word: "YA", start: 357.5, end: 357.9 },
        { word: "haFIzu", start: 357.9, end: 358.7 },
        { word: "YA", start: 358.7, end: 359.1 },
        { word: "ALLAH", start: 359.1, end: 360.5 },
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
