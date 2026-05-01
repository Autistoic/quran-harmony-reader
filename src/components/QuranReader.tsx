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
    playFromTime,
  } = useAudioSync(effectiveSurah);

  const currentTimeRef = useRef(currentTime);
  useEffect(() => {
    currentTimeRef.current = currentTime;
  }, [currentTime]);

  const [editMode, setEditMode] = useState(false);

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
              editMode={editMode}
              isPlaying={isPlaying}
              getCurrentTime={() => currentTimeRef.current}
              onUpdateTiming={setWordTiming}
              onPlayFromTime={playFromTime}
              onPauseAudio={pause}
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
