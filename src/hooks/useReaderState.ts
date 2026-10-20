import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export interface ReaderVerse {
    wordTimings: readonly unknown[];
}

export interface WordCursor {
    verseIndex: number;
    wordIndex: number;
}

type CursorDirection = 'prev' | 'next';

export function useReaderState(
    verses: readonly ReaderVerse[],
    currentTime: number,
    readerId: string | number,
) {
    const currentTimeRef = useRef(currentTime);
    useEffect(() => {
        currentTimeRef.current = currentTime;
    }, [currentTime]);

    const getCurrentTime = useCallback(() => currentTimeRef.current, []);
    const [editMode, setEditMode] = useState(false);
    const [openCursor, setOpenCursor] = useState<WordCursor | null>(null);

    const [showTranslation, setShowTranslation] = useState<boolean>(() => {
        try {
            const saved = localStorage.getItem('quran_show_verse_trans');
            return saved !== null ? saved === 'true' : true;
        } catch {
            return true;
        }
    });

    const [fontSize, setFontSizeState] = useState<'normal' | 'large' | 'xlarge'>(() => {
        try {
            const saved = localStorage.getItem('quran_font_size') as 'normal' | 'large' | 'xlarge' | null;
            return saved || 'large';
        } catch {
            return 'large';
        }
    });

    const [showTransliteration, setShowTransliterationState] = useState<boolean>(() => {
        try {
            const saved = localStorage.getItem('quran_show_translit');
            return saved !== null ? saved === 'true' : true;
        } catch {
            return true;
        }
    });

    const [showWordTranslation, setShowWordTranslationState] = useState<boolean>(() => {
        try {
            const saved = localStorage.getItem('quran_show_word_trans');
            return saved !== null ? saved === 'true' : true;
        } catch {
            return true;
        }
    });

    const wordCursors = useMemo(
        () => verses.flatMap((verse, verseIndex) =>
            verse.wordTimings.map((_, wordIndex) => ({ verseIndex, wordIndex }))
        ),
        [verses],
    );

    useEffect(() => {
        setOpenCursor(null);
    }, [readerId]);

    const cursorIndex = useMemo(
        () => openCursor
            ? wordCursors.findIndex(cursor =>
                cursor.verseIndex === openCursor.verseIndex && cursor.wordIndex === openCursor.wordIndex
            )
            : -1,
        [openCursor, wordCursors],
    );

    const hasPrev = cursorIndex > 0;
    const hasNext = cursorIndex >= 0 && cursorIndex < wordCursors.length - 1;

    const navCursor = useCallback((direction: CursorDirection) => {
        if (cursorIndex < 0) return;
        const nextIndex = direction === 'next' ? cursorIndex + 1 : cursorIndex - 1;
        if (nextIndex >= 0 && nextIndex < wordCursors.length) {
            setOpenCursor(wordCursors[nextIndex]);
        }
    }, [cursorIndex, wordCursors]);

    const setFontSize = useCallback((size: 'normal' | 'large' | 'xlarge') => {
        setFontSizeState(size);
        try { localStorage.setItem('quran_font_size', size); } catch {}
    }, []);

    const setShowTransliteration = useCallback((val: boolean | ((prev: boolean) => boolean)) => {
        setShowTransliterationState(prev => {
            const next = typeof val === 'function' ? val(prev) : val;
            try { localStorage.setItem('quran_show_translit', String(next)); } catch {}
            return next;
        });
    }, []);

    const setShowWordTranslation = useCallback((val: boolean | ((prev: boolean) => boolean)) => {
        setShowWordTranslationState(prev => {
            const next = typeof val === 'function' ? val(prev) : val;
            try { localStorage.setItem('quran_show_word_trans', String(next)); } catch {}
            return next;
        });
    }, []);

    const toggleTranslation = useCallback(() => {
        setShowTranslation(isVisible => {
            const next = !isVisible;
            try { localStorage.setItem('quran_show_verse_trans', String(next)); } catch {}
            return next;
        });
    }, []);

    return {
        currentTimeRef,
        getCurrentTime,
        editMode,
        setEditMode,
        openCursor,
        setOpenCursor,
        navCursor,
        hasPrev,
        hasNext,
        showTranslation,
        toggleTranslation,
        fontSize,
        setFontSize,
        showTransliteration,
        setShowTransliteration,
        showWordTranslation,
        setShowWordTranslation,
    };
}
