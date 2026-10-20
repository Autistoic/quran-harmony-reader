import { useState } from 'react';
import { Verse } from '@/data/surahs';
import { cn } from '@/lib/utils';
import { Play, Pause, BookOpen, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Link } from 'react-router-dom';
import { TimingEditor } from './TimingEditor';
import { toast } from 'sonner';
import { useTranslation } from '@/i18n';

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
    // Readability options
    showTranslation: boolean;
    showTransliteration?: boolean;
    showWordTranslation?: boolean;
    fontSize?: 'normal' | 'large' | 'xlarge';
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
    showTransliteration = true,
    showWordTranslation = true,
    fontSize = 'large',
}: QuranVerseProps) => {
    const [copied, setCopied] = useState(false);
    const { t } = useTranslation();

    const handleCopyVerse = async () => {
        const textToCopy = `${verse.arabic}\n${verse.transliteration}${verse.translation ? `\n"${verse.translation}"` : ''}`;
        try {
            await navigator.clipboard.writeText(textToCopy);
            setCopied(true);
            toast.success(t("reader.copied") || "Aleya copiada al portapapeles");
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error("No se pudo copiar");
        }
    };

    const arabicFontSizeClass = {
        normal: 'text-2xl md:text-3xl leading-[2.2]',
        large: 'text-3xl md:text-4xl leading-[2.5]',
        xlarge: 'text-4xl md:text-5xl leading-[2.7]',
    }[fontSize];

    const transliterationSizeClass = {
        normal: 'text-xs md:text-sm',
        large: 'text-sm md:text-base',
        xlarge: 'text-base md:text-lg',
    }[fontSize];

    const renderArabicWord = (text: string, wordIndex: number, isHighlighted: boolean) => {
        const wt = verse.wordTimings[wordIndex];
        const wordSpan = (
            <span
                onClick={!editMode && onPlayWord ? () => onPlayWord(verseIndex, wordIndex) : undefined}
                className={cn(
                    'inline-block px-1.5 py-0.5 rounded-lg transition-all duration-200 select-none',
                    editMode && 'cursor-pointer hover:bg-accent/30 ring-1 ring-border/60',
                    !editMode && onPlayWord && 'cursor-pointer hover:bg-primary/10',
                    isHighlighted &&
                        'bg-accent/25 text-foreground ring-1.5 ring-accent/70 shadow-sm scale-[1.04]'
                )}
            >
                {text}
            </span>
        );

        if (!editMode) {
            const wordAnalysisQuery = new URLSearchParams({
                w: wt.word,
                t: wt.translit || '',
                m: wt.translation || '',
            });

            return (
                <Popover>
                    <PopoverTrigger asChild>{wordSpan}</PopoverTrigger>
                    <PopoverContent className="w-auto min-w-[12rem] p-3 text-center bg-popover/95 backdrop-blur-md border-border/80 shadow-lg" align="center">
                        <div className="space-y-2">
                            <div className="font-quran-arabic text-2xl text-primary">{wt.word}</div>
                            {wt.translit && (
                                <div className="text-xs font-transliteration italic text-muted-foreground">
                                    {wt.translit}
                                </div>
                            )}
                            {wt.translation && (
                                <div className="text-xs text-foreground/80 font-medium">
                                    "{wt.translation}"
                                </div>
                            )}
                            <div className="pt-1.5 border-t border-border/60 flex items-center justify-center gap-2">
                                <Button
                                    asChild
                                    size="sm"
                                    variant="outline"
                                    className="h-7 text-xs gap-1 px-2.5 rounded-lg"
                                    onClick={() => onPauseAudio?.()}
                                >
                                    <Link to={`/?${wordAnalysisQuery.toString()}`} aria-label="Analizar palabra">
                                        <BookOpen className="h-3.5 w-3.5 text-primary" />
                                        <span>{t("reader.analyzeWord") || "Analizar"}</span>
                                    </Link>
                                </Button>
                            </div>
                        </div>
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
                        word={wt.word}
                        arabicWord={wt.word}
                        transliteration={wt.translit || undefined}
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
    const isThisVersePlaying = !!isPlaying && currentWord?.verseIndex === verseIndex;

    return (
        <article className="py-7 md:py-9 border-b border-border/50 last:border-b-0 group transition-colors">
            {/* Verse header with number, audio control, and copy action */}
            <div className="flex items-center justify-between mb-5 px-1">
                {/* Ayah number medallion */}
                <div className="flex items-center gap-2.5">
                    {verse.verseNumber && (
                        <div
                            className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-secondary/50 border border-border/80 shadow-2xs group-hover:border-primary/40 transition-colors"
                            title={`Aleya ${verse.verseNumber}`}
                        >
                            <span className="text-xs font-bold text-primary">
                                {verse.verseNumber}
                            </span>
                        </div>
                    )}
                </div>

                {/* Actions: Play verse & Copy */}
                <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                    {onPlayVerse && !editMode && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => (isThisVersePlaying ? onPauseVerse?.() : onPlayVerse(verseIndex))}
                            className="h-8 w-8 rounded-full hover:bg-primary/10 text-primary transition-all"
                            title={isThisVersePlaying ? "Pausar aleya" : "Escuchar aleya"}
                            aria-label={isThisVersePlaying ? "Pausar aleya" : "Escuchar aleya"}
                        >
                            {isThisVersePlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleCopyVerse}
                        className="h-8 w-8 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
                        title="Copiar aleya"
                        aria-label="Copiar texto de la aleya"
                    >
                        {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    </Button>
                </div>
            </div>

            {/* Word-by-word columns: RTL flow with Arabic on top, transliteration middle, word translation bottom */}
            <div
                dir="rtl"
                style={{ direction: 'rtl' }}
                className="flex flex-wrap justify-start items-start gap-x-2.5 gap-y-6 sm:gap-x-4 sm:gap-y-7"
            >
                {verse.wordTimings.map((wordTiming, wordIndex) => {
                    const isHighlighted =
                        currentWord?.verseIndex === verseIndex &&
                        currentWord?.wordIndex === wordIndex;

                    return (
                        <span
                            key={wordIndex}
                            className="flex flex-col items-center max-w-[11rem] text-center"
                        >
                            {/* Arabic word */}
                            <span className={cn('font-quran-arabic text-foreground drop-shadow-2xs', arabicFontSizeClass)}>
                                {renderArabicWord(wordTiming.word, wordIndex, isHighlighted)}
                            </span>

                            {/* Transliteration */}
                            {showTransliteration && (
                                <span
                                    onClick={!editMode && onPlayWord ? () => onPlayWord(verseIndex, wordIndex) : undefined}
                                    className={cn(
                                        'mt-1 font-transliteration text-muted-foreground italic leading-snug break-words rounded-md px-1 transition-all duration-200',
                                        transliterationSizeClass,
                                        !editMode && onPlayWord && 'cursor-pointer hover:bg-accent/20',
                                        editMode && 'ring-1 ring-border/60',
                                        isHighlighted && 'bg-accent/30 text-accent-foreground font-semibold not-italic shadow-xs'
                                    )}
                                >
                                    {wordTiming.translit}
                                </span>
                            )}

                            {/* Word Translation */}
                            {showWordTranslation && hasAnyTranslation && (
                                <span dir="ltr" className="text-[11px] sm:text-xs text-muted-foreground/75 leading-tight break-words mt-1">
                                    {wordTiming.translation || <span className="opacity-25">—</span>}
                                </span>
                            )}

                            {/* Edit-mode timing markers */}
                            {editMode && (
                                <span className="font-mono text-[9px] leading-none text-muted-foreground mt-1.5 px-1 py-0.5 rounded bg-muted">
                                    {wordTiming.start.toFixed(2)}→{wordTiming.end.toFixed(2)}
                                </span>
                            )}
                        </span>
                    );
                })}
            </div>

            {/* Full verse translation in Spanish */}
            {showTranslation && verse.translation && (
                <div
                    className="mt-6 p-3 sm:p-4 rounded-2xl bg-muted/25 border border-border/40 text-left md:text-center text-sm sm:text-base text-foreground/85 leading-relaxed font-transliteration italic transition-all"
                    dir="ltr"
                >
                    <p className="max-w-2xl mx-auto">
                        "{verse.translation}"
                    </p>
                </div>
            )}
        </article>
    );
};
