import { useState, useCallback, useEffect, useMemo } from 'react';
import type { TimingOverride, OverridesMap } from '@/types/timingOverrides';
import {
  downloadTimingOverridesBackup,
  loadTimingOverrides,
  readTimingOverridesBackup,
  saveTimingOverrides,
} from '@/lib/timingOverridesStorage';

export type { TimingOverride, OverridesMap } from '@/types/timingOverrides';
// Keep formatter exports available for existing imports while the implementations live in lib.
export { formatSurahVerses, formatWirdVerses } from '@/lib/timingCodeFormatters';

// Minimum data shape needed to apply timing overrides.
interface OverridableData {
  id: string | number;
  verses: { wordTimings: { start: number; end: number }[] }[];
}

export function useTimingOverrides<T extends OverridableData>(data: T, idPrefix = '') {
  const fullId = `${idPrefix}${data.id}`;
  const [overrideState, setOverrideState] = useState(() => ({
    id: fullId,
    overrides: loadTimingOverrides(fullId),
  }));

  useEffect(() => {
    if (overrideState.id !== fullId) {
      setOverrideState({ id: fullId, overrides: loadTimingOverrides(fullId) });
    }
  }, [fullId, overrideState.id]);

  useEffect(() => {
    if (overrideState.id === fullId) {
      saveTimingOverrides(fullId, overrideState.overrides);
    }
  }, [fullId, overrideState]);

  const overrides = useMemo(
    () => overrideState.id === fullId ? overrideState.overrides : {},
    [fullId, overrideState],
  );

  const updateOverrides = useCallback((update: (current: OverridesMap) => OverridesMap) => {
    setOverrideState(previous => {
      const current = previous.id === fullId
        ? previous.overrides
        : loadTimingOverrides(fullId);
      return { id: fullId, overrides: update(current) };
    });
  }, [fullId]);

  const setWordTiming = useCallback(
    (verseIndex: number, wordIndex: number, timing: TimingOverride) => {
      updateOverrides(prev => ({
        ...prev,
        [verseIndex]: {
          ...(prev[verseIndex] ?? {}),
          [wordIndex]: { start: timing.start, end: timing.end },
        },
      }));
    },
    [updateOverrides]
  );

  const clearWordOverride = useCallback((verseIndex: number, wordIndex: number) => {
    updateOverrides(prev => {
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
  }, [updateOverrides]);

  const resetAll = useCallback(() => {
    updateOverrides(() => ({}));
  }, [updateOverrides]);

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
    return Object.assign({}, data, { verses });
  }, [data, overrides]);

  const hasOverrides = useMemo(() => Object.keys(overrides).length > 0, [overrides]);

  const overrideCount = useMemo(() => {
    let n = 0;
    for (const v of Object.values(overrides)) n += Object.keys(v).length;
    return n;
  }, [overrides]);

  const exportBackup = useCallback(() => {
    downloadTimingOverridesBackup(fullId, overrides);
  }, [fullId, overrides]);

  const importBackup = useCallback(
    async (file: File): Promise<{ count: number }> => {
      const { overrides: incoming, count } = await readTimingOverridesBackup(file);
      updateOverrides(prev => {
        const merged: OverridesMap = { ...prev };
        for (const [vIdx, words] of Object.entries(incoming)) {
          merged[Number(vIdx)] = { ...(merged[Number(vIdx)] ?? {}), ...words };
        }
        return merged;
      });
      return { count };
    },
    [updateOverrides]
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
