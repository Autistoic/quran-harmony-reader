import { useState } from 'react';
import { Verse } from '@/data/surahs';
import { cn } from '@/lib/utils';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { TimingEditor } from './TimingEditor';

interface QuranVerseProps {
  verse: Verse;
  verseIndex: number;
  currentWord: { verseIndex: number; wordIndex: number } | null;
  onPlayVerse?: (verseIndex: number) => void;
  // Edit-mode
  editMode?: boolean;
  isPlaying?: boolean;
  getCurrentTime?: () => number;
  onUpdateTiming?: (verseIndex: number, wordIndex: number, timing: { start: number; end: number }) => void;
  onPlayFromTime?: (time: number) => void;
  onPauseAudio?: () => void;
}

export const QuranVerse = ({
  verse,
  verseIndex,
  currentWord,
  onPlayVerse,
  editMode = false,
  isPlaying,
  getCurrentTime,
  onUpdateTiming,
  onPlayFromTime,
  onPauseAudio,
}: QuranVerseProps) => {
  const [openWordIndex, setOpenWordIndex] = useState<number | null>(null);

  const renderWord = (
    text: string,
    wordIndex: number,
    isHighlighted: boolean,
    isArabic: boolean
  ) => {
    const wt = verse.wordTimings[wordIndex];
    const wordSpan = (
      <span
        onClick={editMode ? undefined : undefined}
        className={cn(
          'inline-block mx-1 px-1 rounded transition-all duration-200',
          editMode && 'cursor-pointer hover:bg-accent/30 ring-1 ring-border/60',
          isArabic && isHighlighted && 'bg-accent text-accent-foreground font-bold scale-110 shadow-lg',
          !isArabic && isHighlighted && 'bg-accent/50 text-accent-foreground font-semibold'
        )}
      >
        {text}
      </span>
    );

    if (!editMode) return wordSpan;

    return (
      <span className="relative inline-flex flex-col items-center align-middle">
        <Popover
          open={openWordIndex === wordIndex && isArabic}
          onOpenChange={(open) => {
            if (!isArabic) return; // only the arabic row triggers the popover to avoid duplicates
            setOpenWordIndex(open ? wordIndex : null);
          }}
        >
          <PopoverTrigger asChild>{wordSpan}</PopoverTrigger>
          {isArabic && (
            <PopoverContent className="w-72" align="center">
              <TimingEditor
                word={`${wt.word}  (${wt.translit})`}
                initialStart={wt.start}
                initialEnd={wt.end}
                getCurrentTime={getCurrentTime}
                isPlaying={isPlaying}
                onPlayFromTime={onPlayFromTime}
                onPauseAudio={onPauseAudio}
                onSave={(start, end) => onUpdateTiming?.(verseIndex, wordIndex, { start, end })}
              />
            </PopoverContent>
          )}
        </Popover>
        {isArabic && (
          <span className="font-mono text-[10px] leading-none text-muted-foreground mt-0.5">
            {wt.start.toFixed(2)}→{wt.end.toFixed(2)}
          </span>
        )}
      </span>
    );
  };

  return (
    <div className="py-6 border-b border-border/50 last:border-b-0 group">
      {/* Verse header with number and play button */}
      <div className="flex justify-center items-center gap-3 mb-4">
        {onPlayVerse && !editMode && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPlayVerse(verseIndex)}
            className="h-8 w-8 rounded-full opacity-50 group-hover:opacity-100 transition-opacity text-primary hover:bg-primary/10"
          >
            <Play className="h-4 w-4" />
          </Button>
        )}
        {verse.verseNumber && (
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-medium">
            {verse.verseNumber}
          </span>
        )}
      </div>

      {/* Arabic text */}
      <p className="text-center font-arabic text-3xl md:text-4xl leading-loose mb-4 text-foreground" dir="rtl">
        {verse.wordTimings.map((wordTiming, wordIndex) => {
          const isHighlighted =
            currentWord?.verseIndex === verseIndex &&
            currentWord?.wordIndex === wordIndex;
          return (
            <span key={wordIndex}>{renderWord(wordTiming.word, wordIndex, isHighlighted, true)}</span>
          );
        })}
      </p>

      {/* Transliteration - highlights sync with Arabic */}
      <p className="text-center font-transliteration text-lg text-muted-foreground italic" dir="rtl">
        {verse.wordTimings.map((wordTiming, wordIndex) => {
          const isHighlighted =
            currentWord?.verseIndex === verseIndex &&
            currentWord?.wordIndex === wordIndex;
          return (
            <span key={wordIndex}>{renderWord(wordTiming.translit, wordIndex, isHighlighted, false)}</span>
          );
        })}
      </p>
    </div>
  );
};
