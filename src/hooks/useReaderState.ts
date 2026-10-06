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
    const [showTranslation, setShowTranslation] = useState(false);

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

    const toggleTranslation = useCallback(() => {
        setShowTranslation(isVisible => !isVisible);
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
    };
}
