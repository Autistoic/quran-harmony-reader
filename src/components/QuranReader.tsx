import { useState } from 'react';
import { Surah } from '@/data/surahs';
import { useAudioSync } from '@/hooks/useAudioSync';
import { useTimingOverrides } from '@/hooks/useTimingOverrides';
import { useReaderState } from '@/hooks/useReaderState';
import { QuranVerse } from './QuranVerse';
import { AudioPlayer } from './AudioPlayer';
import { SurahHeader } from './SurahHeader';
import { SurahNavigation } from './SurahNavigation';
import { TimingEditorPanel } from './TimingEditorPanel';
import { ReadingControls } from './ReadingControls';
import { useTranslation } from '@/i18n';

interface QuranReaderProps {
    surah: Surah;
    onNavigate?: (surah: Surah) => void;
}

export const QuranReader = ({ surah, onNavigate }: QuranReaderProps) => {
    const { t } = useTranslation();
    const {
        effectiveData: effectiveSurah,
        setWordTiming,
        resetAll,
        hasOverrides,
        overrideCount,
        exportBackup,
        importBackup,
    } = useTimingOverrides(surah, 'surah-');

    const {
        isPlaying,
        playbackError,
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
    } = useAudioSync(effectiveSurah);

    const {
        getCurrentTime,
        editMode,
        setEditMode,
        openCursor,
        setOpenCursor,
        navCursor,
        hasPrev,
        hasNext,
        showTranslation,
        toggleTranslation,
        fontSize,
        setFontSize,
        showTransliteration,
        setShowTransliteration,
        showWordTranslation,
        setShowWordTranslation,
    } = useReaderState(effectiveSurah.verses, currentTime, effectiveSurah.id);

    return (
        <div className="min-h-screen bg-background pb-28 sm:pb-32 transition-colors">
            {/* Background subtle radial pattern */}
            <div className="fixed inset-0 opacity-5 pointer-events-none">
                <div className="absolute inset-0 bg-radial from-primary via-transparent to-transparent" />
            </div>

            <main className="relative max-w-3xl mx-auto px-4 py-6 md:py-10">
                {/* Surah Navigation selector & prev/next */}
                {onNavigate && (
                    <SurahNavigation currentSurah={effectiveSurah} onNavigate={onNavigate} />
                )}

                {/* Surah Header with Bismillah banner */}
                <SurahHeader surah={effectiveSurah} />

                {/* Reading Preferences Toolbar */}
                <ReadingControls
                    fontSize={fontSize}
                    onFontSizeChange={setFontSize}
                    showTransliteration={showTransliteration}
                    onToggleTransliteration={() => setShowTransliteration((prev) => !prev)}
                    showWordTranslation={showWordTranslation}
                    onToggleWordTranslation={() => setShowWordTranslation((prev) => !prev)}
                    showVerseTranslation={showTranslation}
                    onToggleVerseTranslation={toggleTranslation}
                />

                {/* Verses Container */}
                <section
                    aria-label={`Versículos de ${effectiveSurah.name}`}
                    className="bg-card rounded-3xl border border-border/70 px-5 py-6 sm:px-8 sm:py-8 md:px-12 md:py-10 shadow-sm mb-8 transition-colors"
                >
                    {effectiveSurah.verses.map((verse, index) => (
                        <QuranVerse
                            key={index}
                            surahId={effectiveSurah.id}
                            verse={verse}
                            verseIndex={index}
                            currentWord={currentWord?.verseIndex === index ? currentWord : null}
                            onPlayVerse={playFromVerse}
                            onPauseVerse={pause}
                            onPlayWord={playFromWord}
                            editMode={editMode}
                            isPlaying={isPlaying}
                            getCurrentTime={getCurrentTime}
                            onUpdateTiming={setWordTiming}
                            onPlayFromTime={playFromTime}
                            onPauseAudio={pause}
                            openCursor={openCursor}
                            onOpenCursorChange={setOpenCursor}
                            onNavCursor={navCursor}
                            hasPrev={hasPrev}
                            hasNext={hasNext}
                            showTranslation={showTranslation}
                            showTransliteration={showTransliteration}
                            showWordTranslation={showWordTranslation}
                            fontSize={fontSize}
                        />
                    ))}
                </section>

                {/* Sticky Audio Player Floating Bar */}
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
                        title={effectiveSurah.name}
                        playbackError={playbackError}
                    />
                </div>

                {/* Timing editor panel */}
                <TimingEditorPanel
                    kind="surah"
                    editMode={editMode}
                    onEditModeChange={setEditMode}
                    effectiveData={effectiveSurah}
                    hasOverrides={hasOverrides}
                    overrideCount={overrideCount}
                    onReset={resetAll}
                    onExportBackup={exportBackup}
                    onImportBackup={importBackup}
                />

                {/* Instructions / Guidance */}
                <p className="text-center text-xs text-muted-foreground mt-8 max-w-md mx-auto leading-relaxed">
                    {editMode
                        ? 'Modo edición activo: tocá una palabra árabe para ajustar sus tiempos.'
                        : 'Tocá cualquier palabra para escucharla o analizar sus letras. Las palabras se iluminan armónicamente con el audio.'}
                </p>
            </main>
        </div>
    );
};
