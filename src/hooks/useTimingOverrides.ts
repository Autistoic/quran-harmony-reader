import { useState, useCallback, useEffect, useMemo } from 'react';
import type { WirdData } from '@/data/wirdSharif';
import type { Surah } from '@/data/surahs';

export interface TimingOverride {
  start: number;
  end: number;
}

// { [verseIndex]: { [wordIndex]: { start, end } } }
export type OverridesMap = Record<number, Record<number, TimingOverride>>;

// Generic shape any data needs to satisfy
interface OverridableData {
  id: string | number;
  verses: { wordTimings: { start: number; end: number }[] }[];
}

const storageKey = (id: string) => `wird-timing-overrides:${id}`;

const loadOverrides = (id: string): OverridesMap => {
  try {
    const raw = localStorage.getItem(storageKey(id));
    if (!raw) return {};
    return JSON.parse(raw) as OverridesMap;
  } catch {
    return {};
  }
};

const saveOverrides = (id: string, overrides: OverridesMap) => {
  try {
    localStorage.setItem(storageKey(id), JSON.stringify(overrides));
  } catch {
    // ignore
  }
};

export function useTimingOverrides<T extends OverridableData>(data: T, idPrefix = '') {
  const fullId = `${idPrefix}${data.id}`;
  const [overrides, setOverrides] = useState<OverridesMap>(() => loadOverrides(fullId));

  useEffect(() => {
    setOverrides(loadOverrides(fullId));
  }, [fullId]);

  useEffect(() => {
    saveOverrides(fullId, overrides);
  }, [fullId, overrides]);

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

  // Build an effective data object with overrides merged into wordTimings
  const effectiveData: T = useMemo(() => {
    const verses = data.verses.map((verse, vIdx) => {
      const verseOverrides = overrides[vIdx];
      if (!verseOverrides) return verse;
      const wordTimings = verse.wordTimings.map((wt, wIdx) => {
        const o = verseOverrides[wIdx];
        if (!o) return wt;
        return { ...wt, start: o.start, end: o.end };
      });
      return { ...verse, wordTimings };
    });
    return { ...data, verses } as T;
  }, [data, overrides]);

  const hasOverrides = useMemo(() => Object.keys(overrides).length > 0, [overrides]);

  const overrideCount = useMemo(() => {
    let n = 0;
    for (const v of Object.values(overrides)) n += Object.keys(v).length;
    return n;
  }, [overrides]);

  const exportBackup = useCallback(() => {
    const payload = {
      id: fullId,
      exportedAt: new Date().toISOString(),
      overrides,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timing-overrides-${fullId}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [fullId, overrides]);

  const importBackup = useCallback(
    async (file: File): Promise<{ count: number }> => {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const incoming: OverridesMap = parsed.overrides ?? parsed;
      if (typeof incoming !== 'object' || incoming === null) {
        throw new Error('Formato inválido');
      }
      setOverrides(prev => {
        const merged: OverridesMap = { ...prev };
        for (const [vIdx, words] of Object.entries(incoming)) {
          merged[Number(vIdx)] = { ...(merged[Number(vIdx)] ?? {}), ...(words as Record<number, TimingOverride>) };
        }
        return merged;
      });
      let count = 0;
      for (const v of Object.values(incoming)) count += Object.keys(v as object).length;
      return { count };
    },
    []
  );

  return {
    overrides,
    effectiveData,
    setWordTiming,
    clearWordOverride,
    resetAll,
    hasOverrides,
    overrideCount,
    exportBackup,
    importBackup,
  };
}

// ---------- Formatters ----------

const fmt = (n: number): string => {
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

export function formatSurahVerses(surah: Surah): string {
  const lines: string[] = [];
  lines.push('verses: [');
  surah.verses.forEach(verse => {
    lines.push('  {');
    lines.push(`    arabic: ${jsString(verse.arabic)},`);
    lines.push(`    transliteration: ${jsString(verse.transliteration)},`);
    if (verse.verseNumber !== undefined) {
      lines.push(`    verseNumber: ${verse.verseNumber},`);
    }
    lines.push('    wordTimings: [');
    verse.wordTimings.forEach(wt => {
      lines.push(
        `      { word: ${jsString(wt.word)}, translit: ${jsString(wt.translit)}, start: ${fmt(wt.start)}, end: ${fmt(wt.end)} },`
      );
    });
    lines.push('    ],');
    lines.push('  },');
  });
  lines.push('],');
  return lines.join('\n');
}
