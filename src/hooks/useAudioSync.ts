import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

interface CurrentWord {
    verseIndex: number;
    wordIndex: number;
}

// Generic interface — any data with audioUrl + verses + wordTimings works
export interface AudioSyncData {
    audioUrl: string;
    verses: { wordTimings: { start: number; end: number }[] }[];
}

export const useAudioSync = (data: AudioSyncData) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentWord, setCurrentWord] = useState<CurrentWord | null>(null);
    const [playbackError, setPlaybackError] = useState(false);
    const animationFrameRef = useRef<number>();
    const stopTimeRef = useRef<number | null>(null);
    const lastProgressUpdateRef = useRef(Number.NEGATIVE_INFINITY);
    const playbackRequestedRef = useRef(false);
    const playAttemptRef = useRef(0);
    const [playbackRate, setPlaybackRateState] = useState(1);

    // Initialize audio
    useEffect(() => {
        const audio = new Audio(data.audioUrl);
        audioRef.current = audio;
        audio.playbackRate = playbackRate;
        stopTimeRef.current = null;
        playbackRequestedRef.current = false;
        playAttemptRef.current += 1;
        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);
        setCurrentWord(null);
        setPlaybackError(false);

        const handleLoadedMetadata = () => {
            setDuration(audio.duration);
        };
        const handlePlaying = () => {
            if (!audio.paused) setIsPlaying(true);
        };
        const handlePause = () => {
            if (audio.paused) setIsPlaying(false);
        };
        const handleEnded = () => {
            playAttemptRef.current += 1;
            setIsPlaying(false);
            setCurrentTime(audio.duration);
            setCurrentWord(null);
            stopTimeRef.current = null;
        };
        const handleError = () => {
            playAttemptRef.current += 1;
            setIsPlaying(false);
            setCurrentWord(null);
            stopTimeRef.current = null;
            if (playbackRequestedRef.current) setPlaybackError(true);
        };

        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('playing', handlePlaying);
        audio.addEventListener('pause', handlePause);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('error', handleError);

        return () => {
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('playing', handlePlaying);
            audio.removeEventListener('pause', handlePause);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('error', handleError);
            audio.pause();
            audio.src = '';
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [data.audioUrl]);

    // Timings are stored in playback order, so a binary search avoids scanning
    // every word on each animation frame.
    const timedWords = useMemo(
        () => data.verses.flatMap((verse, verseIndex) =>
            verse.wordTimings.map((timing, wordIndex) => ({
                ...timing,
                verseIndex,
                wordIndex,
            }))
        ),
        [data.verses],
    );

    const findCurrentWord = useCallback((time: number): CurrentWord | null => {
        let low = 0;
        let high = timedWords.length - 1;

        while (low <= high) {
            const middle = Math.floor((low + high) / 2);
            const timing = timedWords[middle];

            if (time < timing.start) {
                high = middle - 1;
            } else if (time >= timing.end) {
                low = middle + 1;
            } else {
                return { verseIndex: timing.verseIndex, wordIndex: timing.wordIndex };
            }
        }
        return null;
    }, [timedWords]);

    const updateCurrentWord = useCallback((time: number) => {
        const next = findCurrentWord(time);
        setCurrentWord((previous) =>
            previous?.verseIndex === next?.verseIndex && previous?.wordIndex === next?.wordIndex
                ? previous
                : next
        );
    }, [findCurrentWord]);

    // Keep word highlighting frame-accurate, but update the progress display at
    // 10Hz. Memoized verse rows then avoid rerendering for progress-only changes.
    const updateTime = useCallback(() => {
        if (audioRef.current && isPlaying) {
            const time = audioRef.current.currentTime;
            const now = performance.now();

            if (now - lastProgressUpdateRef.current >= 100) {
                lastProgressUpdateRef.current = now;
                setCurrentTime(time);
            }
            updateCurrentWord(time);

            // Auto-stop for single word playback
            if (stopTimeRef.current !== null && time >= stopTimeRef.current) {
                audioRef.current.pause();
                setCurrentTime(time);
                setIsPlaying(false);
                stopTimeRef.current = null;
                return;
            }

            animationFrameRef.current = requestAnimationFrame(updateTime);
        }
    }, [isPlaying, updateCurrentWord]);

    useEffect(() => {
        if (isPlaying) {
            animationFrameRef.current = requestAnimationFrame(updateTime);
        } else if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [isPlaying, updateTime]);

    const play = useCallback((stopAtTime: number | null = null) => {
        const audio = audioRef.current;
        if (!audio) return;

        stopTimeRef.current = stopAtTime;
        playbackRequestedRef.current = true;
        setPlaybackError(false);
        const attempt = ++playAttemptRef.current;

        let playPromise: Promise<void>;
        try {
            playPromise = audio.play();
        } catch {
            stopTimeRef.current = null;
            setIsPlaying(false);
            setPlaybackError(true);
            return;
        }

        void playPromise.then(() => {
            if (audioRef.current === audio && attempt === playAttemptRef.current && !audio.paused) {
                setIsPlaying(true);
            }
        }).catch((error: unknown) => {
            if (audioRef.current !== audio || attempt !== playAttemptRef.current) return;

            const isAbort = typeof error === 'object' && error !== null
                && 'name' in error && error.name === 'AbortError';
            if (isAbort) {
                if (audio.paused) setIsPlaying(false);
                return;
            }

            stopTimeRef.current = null;
            setIsPlaying(false);
            setPlaybackError(true);
        });
    }, []);

    const pause = useCallback(() => {
        if (audioRef.current) {
            playAttemptRef.current += 1;
            audioRef.current.pause();
            setIsPlaying(false);
        }
    }, []);

    const toggle = useCallback(() => {
        if (isPlaying) {
            pause();
        } else {
            play();
        }
    }, [isPlaying, play, pause]);

    const seek = useCallback((time: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
            updateCurrentWord(time);
        }
    }, [updateCurrentWord]);

    const restart = useCallback(() => {
        stopTimeRef.current = null;
        seek(0);
        play();
    }, [seek, play]);

    const playFromVerse = useCallback((verseIndex: number) => {
        const verse = data.verses[verseIndex];

        if (verse && verse.wordTimings.length > 0) {
            stopTimeRef.current = null;

            const startTime = verse.wordTimings[0].start;

            seek(startTime);
            play();
        }
    }, [data.verses, seek, play]);

    const playFromWord = useCallback((verseIndex: number, wordIndex: number) => {
        const verse = data.verses[verseIndex];

        if (verse && verse.wordTimings[wordIndex]) {
            const timing = verse.wordTimings[wordIndex];

            seek(timing.start);
            play(timing.end);
        }
    }, [data.verses, seek, play]);

    const playFromTime = useCallback((time: number) => {
        if (isNaN(time) || time < 0) return;
        stopTimeRef.current = null;
        seek(time);
        play();
    }, [seek, play]);

    const setPlaybackRate = useCallback((rate: number) => {
        setPlaybackRateState(rate);
        if (audioRef.current) {
            audioRef.current.playbackRate = rate;
        }
    }, []);

    const skip = useCallback((seconds: number) => {
        if (audioRef.current) {
            const next = Math.max(0, Math.min(audioRef.current.duration || 1000, audioRef.current.currentTime + seconds));
            seek(next);
        }
    }, [seek]);

    return {
        isPlaying,
        playbackError,
        currentTime,
        duration,
        currentWord,
        playbackRate,
        setPlaybackRate,
        skip,
        play,
        pause,
        toggle,
        seek,
        restart,
        playFromVerse,
        playFromWord,
        playFromTime,
    };
};
