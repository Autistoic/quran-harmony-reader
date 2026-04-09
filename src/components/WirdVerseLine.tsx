import { useState } from 'react';
import { WirdVerse } from '@/data/wirdSharif';
import { cn } from '@/lib/utils';
import { Play, Pause, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface WirdVerseLineProps {    
  isPlaying: boolean;
  verse: WirdVerse;
  verseIndex: number;
  currentWord: { verseIndex: number; wordIndex: number } | null;
  onPlayVerse?: (verseIndex: number) => void;
  onPause?: () => void;
  onPlayWord?: (verseIndex: number, wordIndex: number) => void;
  onPrepareForPractice?: (word: string) => void;
}

export const WirdVerseLine = ({ isPlaying, verse, verseIndex, currentWord, onPlayVerse, onPause, onPlayWord, onPrepareForPractice }: WirdVerseLineProps) => {
  const isThisVersePlaying = isPlaying && currentWord?.verseIndex === verseIndex;
  const [activeWordIndex, setActiveWordIndex] = useState<number | null>(null);

  const handleWordClick = (wordIndex: number) => {
    onPlayWord?.(verseIndex, wordIndex);
    setActiveWordIndex(prev => (prev === wordIndex ? null : wordIndex));
  };

  const handleAddWord = (word: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onPrepareForPractice?.(word);
    setActiveWordIndex(null);
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
          const showAddButton = activeWordIndex === wordIndex && onPrepareForPractice;

          return (
            <span key={wordIndex} className="relative inline-block">
              <span
                onClick={() => handleWordClick(wordIndex)}
                className={cn(
                  "inline-block mx-1 px-1 rounded transition-all duration-200 cursor-pointer hover:bg-accent/30",
                  isHighlighted && "bg-accent text-accent-foreground font-bold scale-110 shadow-lg"
                )}
              >
                {wordTiming.word}
              </span>
              {showAddButton && (
                <button
                  onClick={(e) => handleAddWord(wordTiming.word, e)}
                  className="absolute -top-7 left-1/2 -translate-x-1/2 z-10 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:scale-110 transition-transform animate-in fade-in zoom-in-50 duration-150"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              )}
            </span>
          );
        })}
      </p>

      {/* Note */}
      {verse.note && (
        <p className="text-center text-sm text-muted-foreground italic mt-2">
          ({verse.note})
        </p>
      )}
    </div>
  );
};
