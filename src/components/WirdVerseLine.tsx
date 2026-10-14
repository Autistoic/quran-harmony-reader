import { WirdVerse } from '@/data/wirdSharif';
import { cn } from '@/lib/utils';
import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { TimingEditor } from './TimingEditor';

interface WirdVerseLineProps {
  isPlaying: boolean;
  verse: WirdVerse;
  verseIndex: number;
  currentWord: { verseIndex: number; wordIndex: number } | null;
  onPlayVerse?: (verseIndex: number) => void;
  onPause?: () => void;
  onPlayWord?: (verseIndex: number, wordIndex: number) => void;
  // Edit-mode props
  editMode?: boolean;
  getCurrentTime?: () => number;
  onUpdateTiming?: (verseIndex: number, wordIndex: number, timing: { start: number; end: number }) => void;
  onPlayFromTime?: (time: number) => void;
  onPauseAudio?: () => void;
  openCursor?: { verseIndex: number; wordIndex: number } | null;
  onOpenCursorChange?: (cursor: { verseIndex: number; wordIndex: number } | null) => void;
  onNavCursor?: (dir: 'prev' | 'next') => void;
  hasPrev?: boolean;
  hasNext?: boolean;
  showTranslation?: boolean;
}

export const WirdVerseLine = ({
  isPlaying,
  verse,
  verseIndex,
  currentWord,
  onPlayVerse,
  onPause,
  onPlayWord,
  editMode = false,
  getCurrentTime,
  onUpdateTiming,
  onPlayFromTime,
  onPauseAudio,
  openCursor,
  onOpenCursorChange,
  onNavCursor,
  hasPrev,
  hasNext,
  showTranslation = false,
}: WirdVerseLineProps) => {
  const isThisVersePlaying = isPlaying && currentWord?.verseIndex === verseIndex;
  const handleWordClick = (wordIndex: number) => {
    if (editMode) return; // clicks handled by popover trigger
    onPlayWord?.(verseIndex, wordIndex);
  };

  return (
    <div className="py-6 border-b border-border/50 last:border-b-0 group">
      {/* Header: play button + repetition badge */}
      <div className="flex justify-center items-center gap-3 mb-4">
        {onPlayVerse && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (isThisVersePlaying) {
                onPause?.();
              } else {
                onPlayVerse(verseIndex);
              }
            }}
            className="h-8 w-8 rounded-full opacity-50 group-hover:opacity-100 transition-opacity text-primary hover:bg-primary/10"
          >
            {isThisVersePlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6 ml-1" />
            )}
          </Button>
        )}
        {verse.repetitions && (
          <span className="inline-flex items-center justify-center px-3 h-7 rounded-full bg-accent/20 text-accent-foreground text-sm font-semibold">
            ×{verse.repetitions}
          </span>
        )}
      </div>

      {/* Transliteration text with word-level highlighting */}
      <p className="text-center font-transliteration text-2xl md:text-3xl leading-loose mb-2 text-foreground">
        {verse.wordTimings.map((wordTiming, wordIndex) => {
          const isHighlighted =
            currentWord?.verseIndex === verseIndex &&
            currentWord?.wordIndex === wordIndex;

          const wordSpan = (
            <span
              onClick={() => handleWordClick(wordIndex)}
              className={cn(
                'inline-block mx-1 px-1 rounded transition-all duration-200 cursor-pointer hover:bg-accent/30',
                isHighlighted && 'bg-accent text-accent-foreground font-bold scale-110 shadow-lg',
                editMode && 'ring-1 ring-border/60'
              )}
            >
              {wordTiming.word}
            </span>
          );

          return (
            <span key={wordIndex} className="relative inline-flex flex-col items-center align-middle">
              {editMode ? (
                <Popover
                  open={openCursor?.verseIndex === verseIndex && openCursor?.wordIndex === wordIndex}
                  onOpenChange={(open) =>
                    onOpenCursorChange?.(open ? { verseIndex, wordIndex } : null)
                  }
                >
                  <PopoverTrigger asChild>{wordSpan}</PopoverTrigger>
                  <PopoverContent className="w-72" align="center">
                    <TimingEditor
                      word={wordTiming.word}
                      initialStart={wordTiming.start}
                      initialEnd={wordTiming.end}
                      getCurrentTime={getCurrentTime}
                      isPlaying={isPlaying}
                      onPlayFromTime={onPlayFromTime}
                      onPauseAudio={onPauseAudio}
                      onSave={(start, end) => onUpdateTiming?.(verseIndex, wordIndex, { start, end })}
                      onPrev={() => onNavCursor?.('prev')}
                      onNext={() => onNavCursor?.('next')}
                      hasPrev={hasPrev}
                      hasNext={hasNext}
                    />
                  </PopoverContent>
                </Popover>
              ) : (
                wordSpan
              )}

              {editMode && (
                <span className="font-mono text-[10px] leading-none text-muted-foreground mt-0.5">
                  {wordTiming.start.toFixed(2)}→{wordTiming.end.toFixed(2)}
                </span>
              )}

            </span>
          );
        })}
      </p>

      {/* Translation (full verse) */}
      {showTranslation && verse.translation && (
        <p className="text-center text-base md:text-lg text-foreground/80 mt-3 px-2 leading-relaxed">
          {verse.translation}
        </p>
      )}

      {/* Note */}
      {verse.note && (
        <p className="text-center text-sm text-muted-foreground italic mt-2">
          ({verse.note})
        </p>
      )}
    </div>
  );
};


