import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { surahs, Surah } from '@/data/surahs';

interface SurahNavigationProps {
  currentSurah: Surah;
  onNavigate: (surah: Surah) => void;
}

export const SurahNavigation = ({ currentSurah, onNavigate }: SurahNavigationProps) => {
  const currentIndex = surahs.findIndex(s => s.id === currentSurah.id);
  const prevSurah = currentIndex > 0 ? surahs[currentIndex - 1] : null;
  const nextSurah = currentIndex < surahs.length - 1 ? surahs[currentIndex + 1] : null;

  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      <Button
        variant="outline"
        size="sm"
        onClick={() => prevSurah && onNavigate(prevSurah)}
        disabled={!prevSurah}
        className="flex items-center gap-2"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">
          {prevSurah ? prevSurah.name : 'Anterior'}
        </span>
      </Button>

      <span className="text-sm text-muted-foreground">
        {currentIndex + 1} / {surahs.length}
      </span>

      <Button
        variant="outline"
        size="sm"
        onClick={() => nextSurah && onNavigate(nextSurah)}
        disabled={!nextSurah}
        className="flex items-center gap-2"
      >
        <span className="hidden sm:inline">
          {nextSurah ? nextSurah.name : 'Siguiente'}
        </span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
