import { Surah } from '@/data/surahs';
import { useAudioSync } from '@/hooks/useAudioSync';
import { QuranVerse } from './QuranVerse';
import { AudioPlayer } from './AudioPlayer';
import { SurahHeader } from './SurahHeader';

interface QuranReaderProps {
  surah: Surah;
}

export const QuranReader = ({ surah }: QuranReaderProps) => {
  const {
    isPlaying,
    currentTime,
    duration,
    currentWord,
    toggle,
    seek,
    restart,
  } = useAudioSync(surah);

  return (
    <div className="min-h-screen bg-background">
      {/* Background pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent" />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <SurahHeader surah={surah} />

        {/* Verses */}
        <div className="bg-card/80 backdrop-blur-sm rounded-3xl border border-border/50 p-6 md:p-10 shadow-xl mb-8">
          {surah.verses.map((verse, index) => (
            <QuranVerse
              key={index}
              verse={verse}
              verseIndex={index}
              currentWord={currentWord}
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

        {/* Instructions */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          Presiona play para escuchar la recitación. Las palabras se resaltarán conforme avanza el audio.
        </p>
      </div>
    </div>
  );
};
