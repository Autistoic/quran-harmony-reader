import { useState, useRef, useEffect } from 'react';
import { Surah } from '@/data/surahs';
import { useAudioSync } from '@/hooks/useAudioSync';
import { useTimingOverrides } from '@/hooks/useTimingOverrides';
import { QuranVerse } from './QuranVerse';
import { AudioPlayer } from './AudioPlayer';
import { SurahHeader } from './SurahHeader';
import { SurahNavigation } from './SurahNavigation';
import { TimingEditorPanel } from './TimingEditorPanel';

interface QuranReaderProps {
  surah: Surah;
  onNavigate?: (surah: Surah) => void;
}

export const QuranReader = ({ surah, onNavigate }: QuranReaderProps) => {
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
  } = useAudioSync(effectiveSurah);

  const currentTimeRef = useRef(currentTime);
  useEffect(() => {
    currentTimeRef.current = currentTime;
  }, [currentTime]);

  const [editMode, setEditMode] = useState(false);
  const [openCursor, setOpenCursor] = useState<{ verseIndex: number; wordIndex: number } | null>(null);

  const navCursor = (dir: 'prev' | 'next') => {
    if (!openCursor) return;
    const verses = effectiveSurah.verses;
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
    openCursor.wordIndex + 1 < effectiveSurah.verses[openCursor.verseIndex].wordTimings.length ||
    openCursor.verseIndex + 1 < effectiveSurah.verses.length
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Background pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent" />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 py-8 md:py-12">
        {/* Navigation */}
        {onNavigate && (
          <SurahNavigation currentSurah={effectiveSurah} onNavigate={onNavigate} />
        )}

        {/* Header */}
        <SurahHeader surah={effectiveSurah} />

        {/* Verses */}
        <div className="bg-card/80 backdrop-blur-sm rounded-3xl border border-border/50 p-6 md:p-10 shadow-xl mb-8">
          {effectiveSurah.verses.map((verse, index) => (
            <QuranVerse
              key={index}
              verse={verse}
              verseIndex={index}
              currentWord={currentWord}
              onPlayVerse={playFromVerse}
              onPauseVerse={pause}
              onPlayWord={playFromWord}
              editMode={editMode}
              isPlaying={isPlaying}
              getCurrentTime={() => currentTimeRef.current}
              onUpdateTiming={setWordTiming}
              onPlayFromTime={playFromTime}
              onPauseAudio={pause}
              openCursor={openCursor}
              onOpenCursorChange={setOpenCursor}
              onNavCursor={navCursor}
              hasPrev={hasPrev}
              hasNext={hasNext}
            />
          ))}
        </div>

        {/* Audio Player - Fixed at bottom on mobile */}
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
        {/* Instructions */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          {editMode
            ? 'Modo edición activo: tocá una palabra árabe para ajustar sus tiempos.'
            : 'Presiona play para escuchar la recitación. Las palabras se resaltarán conforme avanza el audio.'}
        </p>
      </div>
    </div>
  );
};
