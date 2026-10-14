import type { WirdData } from '@/data/wirdSharif';
import type { Surah } from '@/data/surahs';

const formatNumber = (value: number): string => {
  const rounded = Math.round(value * 100) / 100;
  const formatted = rounded.toString();
  return formatted.includes('.') ? formatted : `${formatted}.0`;
};

const formatString = (value: string) => `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;

export function formatWirdVerses(wird: WirdData): string {
  const lines: string[] = ['verses: ['];
  wird.verses.forEach(verse => {
    lines.push('  {');
    lines.push(`    transliteration: ${formatString(verse.transliteration)},`);
    if (verse.repetitions !== undefined) {
      lines.push(`    repetitions: ${verse.repetitions},`);
    }
    if (verse.note !== undefined) {
      lines.push(`    note: ${formatString(verse.note)},`);
    }
    lines.push('    wordTimings: [');
    verse.wordTimings.forEach(word => {
      lines.push(`      { word: ${formatString(word.word)}, start: ${formatNumber(word.start)}, end: ${formatNumber(word.end)} },`);
    });
    lines.push('    ],');
    lines.push('  },');
  });
  lines.push('],');
  return lines.join('\n');
}

export function formatSurahVerses(surah: Surah): string {
  const lines: string[] = ['verses: ['];
  surah.verses.forEach(verse => {
    lines.push('  {');
    lines.push(`    arabic: ${formatString(verse.arabic)},`);
    lines.push(`    transliteration: ${formatString(verse.transliteration)},`);
    if (verse.verseNumber !== undefined) {
      lines.push(`    verseNumber: ${verse.verseNumber},`);
    }
    lines.push('    wordTimings: [');
    verse.wordTimings.forEach(word => {
      lines.push(`      { word: ${formatString(word.word)}, translit: ${formatString(word.translit)}, start: ${formatNumber(word.start)}, end: ${formatNumber(word.end)} },`);
    });
    lines.push('    ],');
    lines.push('  },');
  });
  lines.push('],');
  return lines.join('\n');
}
