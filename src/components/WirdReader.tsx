import { useState, useRef, useEffect } from 'react';
import { WirdData } from '@/data/wirdSharif';
import { useAudioSync } from '@/hooks/useAudioSync';
import { usePimsleur } from '@/hooks/usePimsleur';
import { useTimingOverrides } from '@/hooks/useTimingOverrides';
import { WirdVerseLine } from './WirdVerseLine';
import { AudioPlayer } from './AudioPlayer';
import { PimsleurModal } from './PimsleurModal';
import { TimingEditorPanel } from './TimingEditorPanel';
import { Link } from 'react-router-dom';
import { ChevronLeft, Brain, Languages } from 'lucide-react';
import { Button } from './ui/button';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from './ui/pagination';

interface WirdReaderProps {
    wird: WirdData;
}

export const WirdReader = ({ wird }: WirdReaderProps) => {
    const { effectiveData: effectiveWird, setWordTiming, resetAll, hasOverrides, overrideCount, exportBackup, importBackup } = useTimingOverrides(wird);

    const {
        isPlaying,
        currentTime,
        duration,
        currentWord,
        toggle,
        seek,
        restart,
        pause,
        playFromVerse,
        playFromWord,
        playFromTime,
    } = useAudioSync(effectiveWird);

    // Keep a live ref to currentTime so the edit popover can read it on demand
    const currentTimeRef = useRef(currentTime);
    useEffect(() => {
        currentTimeRef.current = currentTime;
    }, [currentTime]);

    const { items, dueItems, addItem, reviewItem, removeItem } = usePimsleur();
    const [practiceOpen, setPracticeOpen] = useState(false);
    const [prefillWord, setPrefillWord] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [openCursor, setOpenCursor] = useState<{ verseIndex: number; wordIndex: number } | null>(null);
    const [showTranslations, setShowTranslations] = useState(false);

    // Pagination
    const pages = Array.from(
        new Set(effectiveWird.verses.map((v) => v.page ?? 1))
    ).sort((a, b) => a - b);
    const [currentPage, setCurrentPage] = useState<number>(pages[0] ?? 1);

    // Auto-jump page when current playing word lands on a different page
    useEffect(() => {
        if (!currentWord) return;
        const versePage = effectiveWird.verses[currentWord.verseIndex]?.page ?? 1;
        if (versePage !== currentPage) setCurrentPage(versePage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentWord?.verseIndex]);

    const navCursor = (dir: 'prev' | 'next') => {
        if (!openCursor) return;
        const verses = effectiveWird.verses;
        let { verseIndex, wordIndex } = openCursor;
        if (dir === 'next') {
            if (wordIndex + 1 < verses[verseIndex].wordTimings.length) wordIndex += 1;
            else if (verseIndex + 1 < verses.length) { verseIndex += 1; wordIndex = 0; }
            else return;
        } else {
            if (wordIndex > 0) wordIndex -= 1;
            else if (verseIndex > 0) { verseIndex -= 1; wordIndex = verses[verseIndex].wordTimings.length - 1; }
            else return;
        }
        setOpenCursor({ verseIndex, wordIndex });
    };

    const hasPrev = !!openCursor && (openCursor.wordIndex > 0 || openCursor.verseIndex > 0);
    const hasNext = !!openCursor && (
        openCursor.wordIndex + 1 < effectiveWird.verses[openCursor.verseIndex].wordTimings.length ||
        openCursor.verseIndex + 1 < effectiveWird.verses.length
    );

    const handlePrepareForPractice = (word: string) => {
        setPrefillWord(word);
        setPracticeOpen(true);
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Background pattern */}
            <div className="fixed inset-0 opacity-5 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent" />
            </div>

            <div className="relative max-w-3xl mx-auto px-4 py-8 md:py-12">
                {/* Back navigation + Practice button */}
                <div className="mb-6 flex items-center justify-between">
                    <Button variant="outline" size="sm" asChild>
                        <Link to="/" className="flex items-center gap-2">
                            <ChevronLeft className="h-4 w-4" />
                            <span>Volver a Surahs</span>
                        </Link>
                    </Button>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowTranslations((v) => !v)}
                            className="flex items-center gap-2"
                            aria-pressed={showTranslations}
                        >
                            <Languages className="h-4 w-4" />
                            <span>{showTranslations ? 'Ocultar' : 'Traducción'}</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPracticeOpen(true)}
                            className="flex items-center gap-2"
                        >
                            <Brain className="h-4 w-4" />
                            <span>Práctica</span>
                            {dueItems.length > 0 && (
                                <span className="ml-1 inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                                    {dueItems.length}
                                </span>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <div className="h-px w-16 bg-gradient-to-r from-transparent to-accent" />
                        <div className="w-3 h-3 rotate-45 bg-accent" />
                        <div className="h-px w-16 bg-gradient-to-l from-transparent to-accent" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-3xl md:text-4xl font-transliteration text-primary font-medium">
                            {wird.name}
                        </h1>
                    </div>
                    <div className="flex items-center justify-center gap-4 mt-6">
                        <div className="h-px w-16 bg-gradient-to-r from-transparent to-accent" />
                        <div className="w-3 h-3 rotate-45 bg-accent" />
                        <div className="h-px w-16 bg-gradient-to-l from-transparent to-accent" />
                    </div>
                </div>

                {/* Pagination (top) */}
                {pages.length > 1 && (
                    <div className="mb-4">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={(e) => {
                                            e.preventDefault();
                                            const idx = pages.indexOf(currentPage);
                                            if (idx > 0) setCurrentPage(pages[idx - 1]);
                                        }}
                                        className={pages.indexOf(currentPage) === 0 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                    />
                                </PaginationItem>
                                {pages.map((p) => (
                                    <PaginationItem key={p}>
                                        <PaginationLink
                                            isActive={p === currentPage}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setCurrentPage(p);
                                            }}
                                            className="cursor-pointer"
                                        >
                                            {p}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}
                                <PaginationItem>
                                    <PaginationNext
                                        onClick={(e) => {
                                            e.preventDefault();
                                            const idx = pages.indexOf(currentPage);
                                            if (idx < pages.length - 1) setCurrentPage(pages[idx + 1]);
                                        }}
                                        className={pages.indexOf(currentPage) === pages.length - 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}

                {/* Verses */}
                <div className="bg-card/80 backdrop-blur-sm rounded-3xl border border-border/50 p-6 md:p-10 shadow-xl mb-8">
                    {effectiveWird.verses.map((verse, index) => {
                        const versePage = verse.page ?? 1;
                        if (versePage !== currentPage) return null;
                        return (
                            <WirdVerseLine
                                isPlaying={isPlaying}
                                key={index}
                                verse={verse}
                                verseIndex={index}
                                currentWord={currentWord}
                                onPlayVerse={playFromVerse}
                                onPause={pause}
                                onPlayWord={playFromWord}
                                onPrepareForPractice={handlePrepareForPractice}
                                editMode={editMode}
                                getCurrentTime={() => currentTimeRef.current}
                                onUpdateTiming={setWordTiming}
                                onPlayFromTime={playFromTime}
                                onPauseAudio={pause}
                                openCursor={openCursor}
                                onOpenCursorChange={setOpenCursor}
                                onNavCursor={navCursor}
                                hasPrev={hasPrev}
                                hasNext={hasNext}
                                showTranslation={showTranslations}
                            />
                        );
                    })}
                </div>

                {/* Audio Player */}
                <div className="sticky bottom-4 z-10">
                    <AudioPlayer
                        isPlaying={isPlaying}
                        currentTime={currentTime}
                        duration={duration}
                        onToggle={toggle}
                        onSeek={seek}
                        onRestart={restart}
                    />
                </div>

                {/* Timing editor panel */}
                <TimingEditorPanel
                    kind="wird"
                    editMode={editMode}
                    onEditModeChange={setEditMode}
                    effectiveData={effectiveWird}
                    hasOverrides={hasOverrides}
                    overrideCount={overrideCount}
                    onReset={resetAll}
                    onExportBackup={exportBackup}
                    onImportBackup={importBackup}
                />

                {/* Instructions */}
                <p className="text-center text-sm text-muted-foreground mt-8">
                    {editMode
                        ? 'Modo edición activo: tocá una palabra para ajustar sus tiempos.'
                        : 'Presiona play para escuchar la recitación. Las palabras se resaltarán conforme avanza el audio. Tocá una palabra para practicarla.'}
                </p>
            </div>

            {/* Pimsleur Practice Modal */}
            <PimsleurModal
                open={practiceOpen}
                onOpenChange={(open) => {
                    setPracticeOpen(open);
                    if (!open) setPrefillWord('');
                }}
                items={items}
                dueItems={dueItems}
                onAdd={addItem}
                onReview={reviewItem}
                onRemove={removeItem}
                prefillWord={prefillWord}
                onClearPrefill={() => setPrefillWord('')}
            />
        </div>
    );
};
