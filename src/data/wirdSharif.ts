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
    page?: number;
    translation?: string;
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
                { word: "aLLAHUMma", start: 144.0, end: 145.2 },
                { word: "SALIi", start: 145.2, end: 145.8 },
                { word: "a'LA", start: 145.8, end: 146.3 },
                { word: "sayyidiNA", start: 146.3, end: 147.2 },
                { word: "muHAMmadin", start: 147.2, end: 148.0 },
                { word: "MAJtalaf", start: 148.0, end: 148.6 },
                { word: "al-malaWAN", start: 148.6, end: 149.3 },
                { word: "wa", start: 149.3, end: 149.5 },
                { word: "taA'QAbal", start: 149.5, end: 150.1 },
                { word: "a'saRAN", start: 150.1, end: 151.0 }, // Ajustado el final
                { word: "wa", start: 151.0, end: 151.3 },
                { word: "KARRaral", start: 151.3, end: 152.2 },
                { word: "yadiDAN", start: 152.2, end: 153.2 },
                { word: "wasTA Qbal", start: 153.2, end: 154.2 },
                { word: "al-farqgaDAN", start: 154.2, end: 155.5 },
                { word: "wa", start: 155.5, end: 155.8 },
                { word: "BALlig", start: 155.8, end: 156.6 },
                { word: "RUhahu", start: 156.6, end: 157.4 },
                { word: "wa", start: 157.4, end: 157.7 },
                { word: "arWAha", start: 157.7, end: 158.5 },
                { word: "AHIi", start: 158.5, end: 158.8 }, // Más corto
                { word: "BAItihi", start: 158.8, end: 159.3 }, // Pegado a AHIi
                { word: "MINNAt-tahiyYAta", start: 159.3, end: 160.5 },
                { word: "was-saLAM.", start: 160.5, end: 161.5 },
                { word: "wa", start: 161.5, end: 161.7 },
                { word: "BArik", start: 161.7, end: 162.2 },
                { word: "wa", start: 162.2, end: 162.4 },
                { word: "SALIlim", start: 162.4, end: 163.0 },
                { word: "a'LAThi", start: 163.0, end: 163.6 },
                { word: "kaCIran", start: 163.6, end: 164.1 },
                { word: "kaCIran", start: 164.1, end: 164.6 },
                { word: "kaCIra.", start: 164.6, end: 165.0 },
                // Pequeña pausa de 0.2s aquí
                { word: "wa", start: 165.5, end: 165.7 },
                { word: "SALIa", start: 165.7, end: 166.1 },
                { word: "LLAhu", start: 166.1, end: 166.5 },
                { word: "a'LA", start: 166.5, end: 166.8 },
                { word: "sayYIdiNA", start: 166.8, end: 167.5 },
                { word: "muHAMnmadin", start: 167.5, end: 168.2 },
                { word: "wa", start: 168.2, end: 168.4 },
                { word: "a'LA", start: 168.4, end: 168.8 },
                { word: "yaMI'il-anbiYA'i", start: 168.8, end: 170.3 },
            ],
        },
        // ===== Página 2 =====
        {
            page: 2,
            transliteration: "wal-mursaLIN wal-awliYA'i was-SAliHIN wa a'LA malA-Ikatika",
            wordTimings: [
                { word: "wal-mursaLIN", start: 170.92, end: 173.0 },
                { word: "wal-awliYA'i", start: 173.0, end: 175.0 },
                { word: "was-SAliHIN", start: 175.0, end: 176.0 },
                { word: "wa", start: 176.5, end: 176.95 },
                { word: "a'LA", start: 176.9, end: 177.4 },
                { word: "malA-Ikatika", start: 177.4, end: 178.4 },
            ],
        },
        {
            page: 2,
            transliteration: "wal-muQARraBIN wa a'LA AHli taA'tika aymaL'N min AHlis-samaWAti wa AHlil-araDin.",
            wordTimings: [
                { word: "wal-muQARraBIN", start: 0, end: 0 },
                { word: "wa", start: 0, end: 0 },
                { word: "a'LA", start: 0, end: 0 },
                { word: "AHli", start: 0, end: 0 },
                { word: "taA'tika", start: 0, end: 0 },
                { word: "aymaL'N", start: 0, end: 0 },
                { word: "min", start: 0, end: 0 },
                { word: "AHlis-samaWAti", start: 0, end: 0 },
                { word: "wa", start: 0, end: 0 },
                { word: "AHlil-araDin.", start: 0, end: 0 },
            ],
        },
        {
            page: 2,
            transliteration: "wa ridWANu LLAhi taA'la a'LA A-li raSULiLLAHi wa as-HAbihi aymaL'N bi-RAHmatika ya arHAMar-RAhiMIN.",
            wordTimings: [
                { word: "wa", start: 0, end: 0 },
                { word: "ridWANu", start: 0, end: 0 },
                { word: "LLAhi", start: 0, end: 0 },
                { word: "taA'la", start: 0, end: 0 },
                { word: "a'LA", start: 0, end: 0 },
                { word: "A-li", start: 0, end: 0 },
                { word: "raSULiLLAHi", start: 0, end: 0 },
                { word: "wa", start: 0, end: 0 },
                { word: "as-HAbihi", start: 0, end: 0 },
                { word: "aymaL'N", start: 0, end: 0 },
                { word: "bi-RAHmatika", start: 0, end: 0 },
                { word: "ya", start: 0, end: 0 },
                { word: "arHAMar-RAhiMIN.", start: 0, end: 0 },
            ],
        },
        {
            page: 2,
            transliteration: "AMIN. wal-HAMdu liLLAHi RABBil-A'laMIN.",
            note: "pasar las manos por el rostro",
            wordTimings: [
                { word: "AMIN.", start: 0, end: 0 },
                { word: "wal-HAMdu", start: 0, end: 0 },
                { word: "liLLAHi", start: 0, end: 0 },
                { word: "RABBil-A'laMIN.", start: 0, end: 0 },
            ],
        },
        {
            page: 2,
            transliteration: "bismiLLAH ir-rahMAN ir-raHIM",
            wordTimings: [
                { word: "bismiLLAH", start: 0, end: 0 },
                { word: "ir-rahMAN", start: 0, end: 0 },
                { word: "ir-raHIM", start: 0, end: 0 },
            ],
        },
        {
            page: 2,
            transliteration: "qul huwa LLAHu AHad aLLAHus-SAMad lam yalid wa lam YUlad wa lam YAKul-laHU KUFuan AHad.",
            repetitions: 3,
            wordTimings: [
                { word: "qul", start: 0, end: 0 },
                { word: "huwa", start: 0, end: 0 },
                { word: "LLAHu", start: 0, end: 0 },
                { word: "AHad", start: 0, end: 0 },
                { word: "aLLAHus-SAMad", start: 0, end: 0 },
                { word: "lam", start: 0, end: 0 },
                { word: "yalid", start: 0, end: 0 },
                { word: "wa", start: 0, end: 0 },
                { word: "lam", start: 0, end: 0 },
                { word: "YUlad", start: 0, end: 0 },
                { word: "wa", start: 0, end: 0 },
                { word: "lam", start: 0, end: 0 },
                { word: "YAKul-laHU", start: 0, end: 0 },
                { word: "KUFuan", start: 0, end: 0 },
                { word: "AHad.", start: 0, end: 0 },
            ],
        },
        {
            page: 2,
            transliteration: "bismiLLAH ir-rahMAN ir-raHIM",
            wordTimings: [
                { word: "bismiLLAH", start: 0, end: 0 },
                { word: "ir-rahMAN", start: 0, end: 0 },
                { word: "ir-raHIM", start: 0, end: 0 },
            ],
        },
        {
            page: 2,
            transliteration: "qul aU'dhu biRABBil-FALaqi SHARri ma JALaqga wa min SHARri GAsigin iDHA WA Qab wa min SHARrin-nafFAZAti fil-U'qadi wa min SHARri HAsidin idha HASad",
            wordTimings: [
                { word: "qul", start: 0, end: 0 },
                { word: "aU'dhu", start: 0, end: 0 },
                { word: "biRABBil-FALaqi", start: 0, end: 0 },
                { word: "SHARri", start: 0, end: 0 },
                { word: "ma", start: 0, end: 0 },
                { word: "JALaqga", start: 0, end: 0 },
                { word: "wa", start: 0, end: 0 },
                { word: "min", start: 0, end: 0 },
                { word: "SHARri", start: 0, end: 0 },
                { word: "GAsigin", start: 0, end: 0 },
                { word: "iDHA", start: 0, end: 0 },
                { word: "WA", start: 0, end: 0 },
                { word: "Qab", start: 0, end: 0 },
                { word: "wa", start: 0, end: 0 },
                { word: "min", start: 0, end: 0 },
                { word: "SHARrin-nafFAZAti", start: 0, end: 0 },
                { word: "fil-U'qadi", start: 0, end: 0 },
                { word: "wa", start: 0, end: 0 },
                { word: "min", start: 0, end: 0 },
                { word: "SHARri", start: 0, end: 0 },
                { word: "HAsidin", start: 0, end: 0 },
                { word: "idha", start: 0, end: 0 },
                { word: "HASad", start: 0, end: 0 },
            ],
        },
    ],
};
