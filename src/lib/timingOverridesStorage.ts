import type { TimingOverride, OverridesMap } from '@/types/timingOverrides';

const storageKey = (id: string) => `wird-timing-overrides:${id}`;

export function loadTimingOverrides(id: string): OverridesMap {
  try {
    const raw = localStorage.getItem(storageKey(id));
    if (!raw) return {};
    return parseOverrides(JSON.parse(raw));
  } catch {
    return {};
  }
}

export function saveTimingOverrides(id: string, overrides: OverridesMap): void {
  try {
    localStorage.setItem(storageKey(id), JSON.stringify(overrides));
  } catch {
    // Storage may be disabled or full; keep the in-memory edits available.
  }
}

export function downloadTimingOverridesBackup(id: string, overrides: OverridesMap): void {
  const payload = {
    id,
    exportedAt: new Date().toISOString(),
    overrides,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `timing-overrides-${id}-${Date.now()}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export async function readTimingOverridesBackup(file: File): Promise<{ overrides: OverridesMap; count: number }> {
  const parsed: unknown = JSON.parse(await file.text());
  const candidate = isRecord(parsed) && 'overrides' in parsed ? parsed.overrides : parsed;
  const overrides = parseOverrides(candidate);
  const count = Object.values(overrides).reduce((total, words) => total + Object.keys(words).length, 0);
  return { overrides, count };
}

function parseOverrides(value: unknown): OverridesMap {
  if (!isRecord(value)) {
    throw new Error('Formato inválido');
  }

  const result: OverridesMap = {};
  for (const [verseKey, verseValue] of Object.entries(value)) {
    const verseIndex = Number(verseKey);
    if (!Number.isInteger(verseIndex) || verseIndex < 0 || !isRecord(verseValue)) {
      throw new Error('Formato inválido');
    }

    const words: Record<number, TimingOverride> = {};
    for (const [wordKey, timingValue] of Object.entries(verseValue)) {
      const wordIndex = Number(wordKey);
      if (!Number.isInteger(wordIndex) || wordIndex < 0 || !isTimingOverride(timingValue)) {
        throw new Error('Formato inválido');
      }
      words[wordIndex] = timingValue;
    }
    result[verseIndex] = words;
  }

  return result;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isTimingOverride(value: unknown): value is TimingOverride {
  if (!isRecord(value)) return false;
  return typeof value.start === 'number' && Number.isFinite(value.start)
    && typeof value.end === 'number' && Number.isFinite(value.end);
}
