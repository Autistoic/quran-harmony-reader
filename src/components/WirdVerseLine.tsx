import { WirdVerse } from '@/data/wirdSharif';
import { cn } from '@/lib/utils';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WirdVerseLineProps {
  verse: WirdVerse;
  verseIndex: number;
  currentWord: { verseIndex: number; wordIndex: number } | null;
  onPlayVerse?: (verseIndex: number) => void;
  onPlayWord?: (verseIndex: number, wordIndex: number) => void;
}

export const WirdVerseLine = ({ verse, verseIndex, currentWord, onPlayVerse, onPlayWord }: WirdVerseLineProps) => {
  return (
    <div className="py-6 border-b border-border/50 last:border-b-0 group">
      {/* Header: play button + repetition badge */}
      <div className="flex justify-center items-center gap-3 mb-4">
        {onPlayVerse && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPlayVerse(verseIndex)}
            className="h-8 w-8 rounded-full opacity-50 group-hover:opacity-100 transition-opacity text-primary hover:bg-primary/10"
          >
            <Play className="h-4 w-4" />
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

          return (
            <span
              key={wordIndex}
              onClick={() => onPlayWord?.(verseIndex, wordIndex)}
              className={cn(
                "inline-block mx-1 px-1 rounded transition-all duration-200 cursor-pointer hover:bg-accent/30",
                isHighlighted && "bg-accent text-accent-foreground font-bold scale-110 shadow-lg"
              )}
            >
              {wordTiming.word}
            </span>
          );
        })}
      </p>

      {/* Note (e.g. "cruzar los brazos sobre el pecho") */}
      {verse.note && (
        <p className="text-center text-sm text-muted-foreground italic mt-2">
          ({verse.note})
        </p>
      )}
    </div>
  );
};
