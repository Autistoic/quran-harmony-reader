import { useState, useEffect } from 'react';
import { WirdData } from '@/data/wirdSharif';
import { useAudioSync } from '@/hooks/useAudioSync';
import { useTimingOverrides } from '@/hooks/useTimingOverrides';
import { useReaderState } from '@/hooks/useReaderState';
import { WirdVerseLine } from './WirdVerseLine';
import { AudioPlayer } from './AudioPlayer';
import { TimingEditorPanel } from './TimingEditorPanel';
import { Navbar } from './Navbar';
import { Languages, BookOpen } from 'lucide-react';
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
        playbackRate,
        setPlaybackRate,
        skip,
        toggle,
        seek,
        restart,
        pause,
        playFromVerse,
        playFromWord,
        playFromTime,
    } = useAudioSync(effectiveWird);

    const {
        getCurrentTime,
        editMode,
        setEditMode,
        openCursor,
        setOpenCursor,
        navCursor,
        hasPrev,
        hasNext,
        showTranslation: showTranslations,
        toggleTranslation,
    } = useReaderState(effectiveWird.verses, currentTime, effectiveWird.id);

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

    return (
        <div className="min-h-screen bg-background text-foreground pb-28 sm:pb-32 transition-colors">
            <Navbar />

            {/* Background pattern */}
            <div className="fixed inset-0 opacity-5 pointer-events-none">
                <div className="absolute inset-0 bg-radial from-primary via-transparent to-transparent" />
            </div>

            <main className="relative max-w-3xl mx-auto px-4 py-6 md:py-10">
                {/* Header card */}
                <div className="text-center mb-8 rounded-3xl border border-border/70 bg-card/60 backdrop-blur-md p-6 sm:p-10 shadow-sm">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold tracking-wider uppercase mb-4">
                        <span>Litania Espiritual</span>
                        <span>•</span>
                        <span>{effectiveWird.verses.length} versos</span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-transliteration text-primary font-medium tracking-tight mb-3">
                        {wird.name}
                    </h1>

                    <div className="flex items-center justify-center gap-3 my-4 max-w-xs mx-auto">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-accent/60" />
                        <div className="w-2.5 h-2.5 rotate-45 bg-accent/80 border border-background shadow-xs" />
                        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-accent/60" />
                    </div>

                    {/* Translation toggle button in header */}
                    <div className="flex justify-center mt-4">
                        <Button
                            variant={showTranslations ? "secondary" : "outline"}
                            size="sm"
                            onClick={toggleTranslation}
                            className="flex items-center gap-2 rounded-xl text-xs h-8"
                            aria-pressed={showTranslations}
                        >
                            <Languages className="h-3.5 w-3.5" />
                            <span>{showTranslations ? 'Ocultar traducción' : 'Mostrar traducción'}</span>
                        </Button>
                    </div>
                </div>

                {/* Pagination (top) */}
                {pages.length > 1 && (
                    <div className="mb-6 flex justify-center">
                        <Pagination>
                            <PaginationContent className="bg-card/70 backdrop-blur-md border border-border/70 p-1 rounded-2xl shadow-2xs">
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={(e) => {
                                            e.preventDefault();
                                            const idx = pages.indexOf(currentPage);
                                            if (idx > 0) setCurrentPage(pages[idx - 1]);
                                        }}
                                        className={pages.indexOf(currentPage) === 0 ? 'pointer-events-none opacity-40' : 'cursor-pointer'}
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
                                            className={`cursor-pointer rounded-xl ${p === currentPage ? 'bg-primary text-primary-foreground font-bold shadow-xs' : ''}`}
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
                                        className={pages.indexOf(currentPage) === pages.length - 1 ? 'pointer-events-none opacity-40' : 'cursor-pointer'}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}

                {/* Verses Container */}
                <div className="bg-card/80 backdrop-blur-sm rounded-3xl border border-border/70 p-6 md:p-10 shadow-sm mb-8 transition-colors">
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
                                editMode={editMode}
                                getCurrentTime={getCurrentTime}
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

                {/* Floating Bottom Audio Player */}
                <div className="fixed bottom-4 left-4 right-4 max-w-xl mx-auto z-30">
                    <AudioPlayer
                        isPlaying={isPlaying}
                        currentTime={currentTime}
                        duration={duration}
                        playbackRate={playbackRate}
                        onToggle={toggle}
                        onSeek={seek}
                        onRestart={restart}
                        onSkip={skip}
                        onPlaybackRateChange={setPlaybackRate}
                        title={effectiveWird.name}
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
                <p className="text-center text-xs text-muted-foreground mt-8 max-w-md mx-auto leading-relaxed">
                    {editMode
                        ? 'Modo edición activo: tocá una palabra para ajustar sus tiempos.'
                        : 'Presiona play para escuchar la recitación. Las palabras se iluminarán conforme avanza el audio.'}
                </p>
            </main>
        </div>
    );
};
