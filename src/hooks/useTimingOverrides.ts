import { useState, useCallback, useEffect, useMemo } from 'react';
import type { WirdData, WirdVerse, WirdWordTiming } from '@/data/wirdSharif';

export interface TimingOverride {
  start: number;
  end: number;
}

// { [verseIndex]: { [wordIndex]: { start, end } } }
export type OverridesMap = Record<number, Record<number, TimingOverride>>;

const storageKey = (wirdId: string) => `wird-timing-overrides:${wirdId}`;

const loadOverrides = (wirdId: string): OverridesMap => {
  try {
    const raw = localStorage.getItem(storageKey(wirdId));
    if (!raw) return {};
    return JSON.parse(raw) as OverridesMap;
  } catch {
    return {};
  }
};

const saveOverrides = (wirdId: string, overrides: OverridesMap) => {
  try {
    localStorage.setItem(storageKey(wirdId), JSON.stringify(overrides));
  } catch {
    // ignore
  }
};

export function useTimingOverrides(wird: WirdData) {
  const [overrides, setOverrides] = useState<OverridesMap>(() => loadOverrides(wird.id));

  useEffect(() => {
    setOverrides(loadOverrides(wird.id));
  }, [wird.id]);

  useEffect(() => {
    saveOverrides(wird.id, overrides);
  }, [wird.id, overrides]);

  const setWordTiming = useCallback(
    (verseIndex: number, wordIndex: number, timing: TimingOverride) => {
      setOverrides(prev => ({
        ...prev,
        [verseIndex]: {
          ...(prev[verseIndex] ?? {}),
          [wordIndex]: { start: timing.start, end: timing.end },
        },
      }));
    },
    []
  );

  const clearWordOverride = useCallback((verseIndex: number, wordIndex: number) => {
    setOverrides(prev => {
      const next = { ...prev };
      if (!next[verseIndex]) return next;
      const verseCopy = { ...next[verseIndex] };
      delete verseCopy[wordIndex];
      if (Object.keys(verseCopy).length === 0) {
        delete next[verseIndex];
      } else {
        next[verseIndex] = verseCopy;
      }
      return next;
    });
  }, []);

  const resetAll = useCallback(() => {
    setOverrides({});
  }, []);

  // Build an effective wird with overrides merged in
  const effectiveWird: WirdData = useMemo(() => {
    const verses: WirdVerse[] = wird.verses.map((verse, vIdx) => {
      const verseOverrides = overrides[vIdx];
      if (!verseOverrides) return verse;
      const wordTimings: WirdWordTiming[] = verse.wordTimings.map((wt, wIdx) => {
        const o = verseOverrides[wIdx];
        if (!o) return wt;
        return { ...wt, start: o.start, end: o.end };
      });
      return { ...verse, wordTimings };
    });
    return { ...wird, verses };
  }, [wird, overrides]);

  const hasOverrides = useMemo(() => Object.keys(overrides).length > 0, [overrides]);

  return {
    overrides,
    effectiveWird,
    setWordTiming,
    clearWordOverride,
    resetAll,
    hasOverrides,
  };
}

// Format a number like the source file: minimal trailing zero but keep one decimal
const fmt = (n: number): string => {
  // round to 2 decimals, drop trailing zeros but keep at least 1 decimal
  const rounded = Math.round(n * 100) / 100;
  const s = rounded.toString();
  return s.includes('.') ? s : `${s}.0`;
};

const jsString = (s: string) => `"${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;

export function formatWirdVerses(wird: WirdData): string {
  const lines: string[] = [];
  lines.push('verses: [');
  wird.verses.forEach(verse => {
    lines.push('  {');
    lines.push(`    transliteration: ${jsString(verse.transliteration)},`);
    if (verse.repetitions !== undefined) {
      lines.push(`    repetitions: ${verse.repetitions},`);
    }
    if (verse.note !== undefined) {
      lines.push(`    note: ${jsString(verse.note)},`);
    }
    lines.push('    wordTimings: [');
    verse.wordTimings.forEach(wt => {
      lines.push(
        `      { word: ${jsString(wt.word)}, start: ${fmt(wt.start)}, end: ${fmt(wt.end)} },`
      );
    });
    lines.push('    ],');
    lines.push('  },');
  });
  lines.push('],');
  return lines.join('\n');
}
