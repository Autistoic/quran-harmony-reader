import { useState, useEffect, useRef, useCallback } from 'react';

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
  const animationFrameRef = useRef<number>();

  // Initialize audio
  useEffect(() => {
    const audio = new Audio(data.audioUrl);
    audioRef.current = audio;

    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });

    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setCurrentWord(null);
    });

    return () => {
      audio.pause();
      audio.src = '';
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [data.audioUrl]);

  // Find current word based on time
  const findCurrentWord = useCallback((time: number): CurrentWord | null => {
    for (let verseIndex = 0; verseIndex < data.verses.length; verseIndex++) {
      const verse = data.verses[verseIndex];
      for (let wordIndex = 0; wordIndex < verse.wordTimings.length; wordIndex++) {
        const timing = verse.wordTimings[wordIndex];
        if (time >= timing.start && time < timing.end) {
          return { verseIndex, wordIndex };
        }
      }
    }
    return null;
  }, [data.verses]);

  // Update loop
  const updateTime = useCallback(() => {
    if (audioRef.current && isPlaying) {
      const time = audioRef.current.currentTime;
      setCurrentTime(time);
      setCurrentWord(findCurrentWord(time));
      animationFrameRef.current = requestAnimationFrame(updateTime);
    }
  }, [isPlaying, findCurrentWord]);

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

  const play = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current) {
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
      setCurrentWord(findCurrentWord(time));
    }
  }, [findCurrentWord]);

  const restart = useCallback(() => {
    seek(0);
    play();
  }, [seek, play]);

  const playFromVerse = useCallback((verseIndex: number) => {
    const verse = data.verses[verseIndex];
    if (verse && verse.wordTimings.length > 0) {
      const startTime = verse.wordTimings[0].start;
      seek(startTime);
      play();
    }
  }, [data.verses, seek, play]);

  const playFromWord = useCallback((verseIndex: number, wordIndex: number) => {
    const verse = data.verses[verseIndex];
    if (verse && verse.wordTimings[wordIndex]) {
      seek(verse.wordTimings[wordIndex].start);
      play();
    }
  }, [data.verses, seek, play]);

  const playFromTime = useCallback((time: number) => {
    if (isNaN(time) || time < 0) return;
    seek(time);
    play();
  }, [seek, play]);

  return {
    isPlaying,
    currentTime,
    duration,
    currentWord,
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
