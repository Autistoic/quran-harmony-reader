export interface TimingOverride {
  start: number;
  end: number;
}

// { [verseIndex]: { [wordIndex]: { start, end } } }
export type OverridesMap = Record<number, Record<number, TimingOverride>>;
