import { Verse } from '@/data/surahs';
import { cn } from '@/lib/utils';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuranVerseProps {
  verse: Verse;
  verseIndex: number;
  currentWord: { verseIndex: number; wordIndex: number } | null;
  onPlayVerse?: (verseIndex: number) => void;
}

export const QuranVerse = ({ verse, verseIndex, currentWord, onPlayVerse }: QuranVerseProps) => {
  return (
    <div className="py-6 border-b border-border/50 last:border-b-0 group">
      {/* Verse header with number and play button */}
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
            <span
              key={wordIndex}
              className={cn(
                "inline-block mx-1 px-1 rounded transition-all duration-200",
                isHighlighted && "bg-accent text-accent-foreground font-bold scale-110 shadow-lg"
              )}
            >
              {wordTiming.word}
            </span>
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
            <span
              key={wordIndex}
              className={cn(
                "inline-block mx-1 px-1 rounded transition-all duration-200",
                isHighlighted && "bg-accent/50 text-accent-foreground font-semibold"
              )}
            >
              {wordTiming.translit}
            </span>
          );
        })}
      </p>
    </div>
  );
};
