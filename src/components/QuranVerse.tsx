import { Verse } from '@/data/surahs';
import { cn } from '@/lib/utils';

interface QuranVerseProps {
  verse: Verse;
  verseIndex: number;
  currentWord: { verseIndex: number; wordIndex: number } | null;
}

export const QuranVerse = ({ verse, verseIndex, currentWord }: QuranVerseProps) => {
  const words = verse.arabic.split(' ');
  
  return (
    <div className="py-6 border-b border-border/50 last:border-b-0">
      {/* Verse number badge */}
      {verse.verseNumber && (
        <div className="flex justify-center mb-4">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-medium">
            {verse.verseNumber}
          </span>
        </div>
      )}
      
      {/* Arabic text */}
      <p className="text-center font-arabic text-3xl md:text-4xl leading-loose mb-4 text-foreground" dir="rtl">
        {words.map((word, wordIndex) => {
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
              {word}
            </span>
          );
        })}
      </p>
      
      {/* Transliteration */}
      <p className="text-center font-transliteration text-lg text-muted-foreground italic">
        {verse.transliteration}
      </p>
    </div>
  );
};
