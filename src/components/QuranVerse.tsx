import { Verse } from '@/data/surahs';
import { cn } from '@/lib/utils';
import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { TimingEditor } from './TimingEditor';

interface QuranVerseProps {
    verse: Verse;
    verseIndex: number;
    currentWord: { verseIndex: number; wordIndex: number } | null;
    onPlayVerse?: (verseIndex: number) => void;
    onPauseVerse?: () => void;
    onPlayWord?: (verseIndex: number, wordIndex: number) => void;
    // Edit-mode
    editMode?: boolean;
    isPlaying?: boolean;
    getCurrentTime?: () => number;
    onUpdateTiming?: (verseIndex: number, wordIndex: number, timing: { start: number; end: number }) => void;
    onPlayFromTime?: (time: number) => void;
    onPauseAudio?: () => void;
    openCursor?: { verseIndex: number; wordIndex: number } | null;
    onOpenCursorChange?: (cursor: { verseIndex: number; wordIndex: number } | null) => void;
    onNavCursor?: (dir: 'prev' | 'next') => void;
    hasPrev?: boolean;
    hasNext?: boolean;
    showTranslation: boolean;
}

export const QuranVerse = ({
    verse,
    verseIndex,
    currentWord,
    onPlayVerse,
    onPauseVerse,
    onPlayWord,
    editMode = false,
    isPlaying,
    getCurrentTime,
    onUpdateTiming,
    onPlayFromTime,
    onPauseAudio,
    openCursor,
    onOpenCursorChange,
    onNavCursor,
    hasPrev,
    hasNext,
    showTranslation,
}: QuranVerseProps) => {
    const renderWord = (
        text: string,
        wordIndex: number,
        isHighlighted: boolean,
        isArabic: boolean
    ) => {
        const wt = verse.wordTimings[wordIndex];
        const wordSpan = (
            <span
                onClick={!editMode && onPlayWord ? () => onPlayWord(verseIndex, wordIndex) : undefined}
                className={cn(
                    'inline-block mx-1 px-1 rounded transition-all duration-200',
                    editMode && 'cursor-pointer hover:bg-accent/30 ring-1 ring-border/60',
                    !editMode && onPlayWord && 'cursor-pointer hover:bg-accent/20',
                    isArabic && isHighlighted && 'bg-accent text-accent-foreground font-bold scale-110 shadow-lg',
                    !isArabic && isHighlighted && 'bg-accent/50 text-accent-foreground font-semibold'
                )}
            >
                {text}
            </span>
        );

        if (!editMode) {
            if (!isArabic) return wordSpan;

            const learnArabicUrl = `https://learn-arab.lovable.app/word?w=${encodeURIComponent(
                wt.word
            )}&t=${encodeURIComponent(
                wt.translit || ''
            )}&m=${encodeURIComponent(
                wt.translation || ''
            )}`;

            return (
                <Popover>
                    <PopoverTrigger asChild>
                        {wordSpan}
                    </PopoverTrigger>

                    <PopoverContent className="w-56 text-center">
                        <Button asChild size="sm" className="w-full">
                            <a href={learnArabicUrl} target="_blank">
                                Abrir diccionario
                            </a>
                        </Button>
                    </PopoverContent>
                </Popover>
            );
        }

        const isOpen =
            openCursor?.verseIndex === verseIndex && openCursor?.wordIndex === wordIndex;

        return (
            <span className="relative inline-flex flex-col items-center align-middle">
                <Popover
                    open={isOpen && isArabic}
                    onOpenChange={(open) => {
                        if (!isArabic) return;
                        onOpenCursorChange?.(open ? { verseIndex, wordIndex } : null);
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
                                onPrev={() => onNavCursor?.('prev')}
                                onNext={() => onNavCursor?.('next')}
                                hasPrev={hasPrev}
                                hasNext={hasNext}
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
                {onPlayVerse && !editMode && (() => {
                    const isThisVersePlaying = !!isPlaying && currentWord?.verseIndex === verseIndex;
                    return (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => (isThisVersePlaying ? onPauseVerse?.() : onPlayVerse(verseIndex))}
                            className="h-8 w-8 rounded-full opacity-50 group-hover:opacity-100 transition-opacity text-primary hover:bg-primary/10"
                        >
                            {isThisVersePlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                    );
                })()}
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

            {/* Spanish translation - per-word, RTL to align with Arabic order */}
            {verse.wordTimings.some((w) => w.translation) && (
                <p className="text-center text-sm text-muted-foreground/70 mt-1" dir="rtl">
                    {verse.wordTimings.map((wordTiming, wordIndex) => (
                        <span key={wordIndex} className="inline-block mx-1 px-1">
                            {wordTiming.translation || <span className="opacity-30">—</span>}
                        </span>
                    ))}
                </p>
            )}

            {/* Full verse translation in Spanish (LTR) */}
            {showTranslation && verse.translation && (
                <p className="text-center text-base text-foreground/80 mt-3 italic max-w-2xl mx-auto" dir="ltr">
                    {verse.translation}
                </p>
            )}
        </div>
    );
};
