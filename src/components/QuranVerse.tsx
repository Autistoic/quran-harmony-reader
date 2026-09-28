import { Verse } from '@/data/surahs';
import { cn } from '@/lib/utils';
import { Play, Pause, BookOpen } from 'lucide-react';
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
    const renderArabicWord = (text: string, wordIndex: number, isHighlighted: boolean) => {
        const wt = verse.wordTimings[wordIndex];
        const wordSpan = (
            <span
                onClick={!editMode && onPlayWord ? () => onPlayWord(verseIndex, wordIndex) : undefined}
                className={cn(
                    'inline-block mx-1 px-1 rounded transition-all duration-200',
                    editMode && 'cursor-pointer hover:bg-accent/30 ring-1 ring-border/60',
                    !editMode && onPlayWord && 'cursor-pointer hover:bg-accent/20',
                    isHighlighted && 'bg-accent text-accent-foreground font-bold scale-110 shadow-lg'
                )}
            >
                {text}
            </span>
        );

        if (!editMode) {
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

                    <PopoverContent className="w-auto p-2" align="center">
                        <Button
                            asChild
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => onPauseAudio?.()}
                        >
                            <a href={learnArabicUrl} target="_blank" aria-label="Abrir diccionario">
                                <BookOpen className="h-4 w-4" />
                            </a>
                        </Button>
                    </PopoverContent>
                </Popover>
            );
        }

        const isOpen =
            openCursor?.verseIndex === verseIndex && openCursor?.wordIndex === wordIndex;

        return (
            <Popover
                open={isOpen}
                onOpenChange={(open) => {
                    onOpenCursorChange?.(open ? { verseIndex, wordIndex } : null);
                }}
            >
                <PopoverTrigger asChild>{wordSpan}</PopoverTrigger>
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
            </Popover>
        );
    };

    const hasAnyTranslation = verse.wordTimings.some((w) => w.translation);

    return (
        <div className="py-8 border-b border-border/40 last:border-b-0 group">
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
                    <span className="inline-flex items-center justify-center w-8 h-8 rotate-45 rounded-md border border-gold/60 text-primary text-sm font-medium"><span className="-rotate-45">
                        {verse.verseNumber}
                    </span></span>
                )}
            </div>

            {/* Word-by-word columns (quran.com style): RTL flow, each word is a
                self-contained column with Arabic on top, transliteration in the
                middle and translation at the bottom. */}
            <div
                dir="rtl"
                style={{ direction: 'rtl' }}
                className="flex flex-wrap justify-start items-start gap-x-2 gap-y-5"
            >
                {verse.wordTimings.map((wordTiming, wordIndex) => {
                    const isHighlighted =
                        currentWord?.verseIndex === verseIndex &&
                        currentWord?.wordIndex === wordIndex;

                    return (
                        <span
                            key={wordIndex}
                            className="flex flex-col items-center max-w-[10rem] text-center"
                        >
                            {/* Top: Arabic text */}
                            <span className="font-arabic text-3xl md:text-4xl leading-loose text-foreground">
                                {renderArabicWord(wordTiming.word, wordIndex, isHighlighted)}
                            </span>

                            {/* Middle: transliteration (highlights sync with Arabic) */}
                            <span
                                onClick={!editMode && onPlayWord ? () => onPlayWord(verseIndex, wordIndex) : undefined}
                                className={cn(
                                    'mt-2 font-transliteration text-sm md:text-base text-muted-foreground italic leading-snug break-words rounded transition-all duration-200',
                                    !editMode && onPlayWord && 'cursor-pointer hover:bg-accent/20',
                                    editMode && 'ring-1 ring-border/60 px-1',
                                    isHighlighted && 'bg-accent/50 text-accent-foreground font-semibold not-italic'
                                )}
                            >
                                {wordTiming.translit}
                            </span>

                            {/* Bottom: per-word translation */}
                            {hasAnyTranslation && (
                                <span className="text-xs text-muted-foreground/70 leading-snug break-words mt-0.5">
                                    {wordTiming.translation || <span className="opacity-30">—</span>}
                                </span>
                            )}

                            {/* Edit-mode timing labels */}
                            {editMode && (
                                <span className="font-mono text-[10px] leading-none text-muted-foreground mt-1">
                                    {wordTiming.start.toFixed(2)}→{wordTiming.end.toFixed(2)}
                                </span>
                            )}
                        </span>
                    );
                })}
            </div>

            {/* Full verse translation in Spanish (LTR) */}
            {showTranslation && verse.translation && (
                <p className="text-center text-base text-foreground/80 mt-4 italic max-w-2xl mx-auto" dir="ltr">
                    {verse.translation}
                </p>
            )}
        </div>
    );
};
