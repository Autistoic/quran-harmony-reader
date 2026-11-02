import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { QuranReader } from '@/components/QuranReader';
import { getSurahById, surahs, Surah } from '@/data/surahs';
import { PrayerTimes } from "@/components/PrayerTimes";
import { Navbar } from "@/components/Navbar";
import { WordAnalysisOverlay } from "@/features/word-analysis/components/WordAnalysisOverlay";

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const surahParam = searchParams.get('surah');
  const parsedSurahId = surahParam && /^\d+$/.test(surahParam)
    ? Number(surahParam)
    : Number.NaN;
  const currentSurah = getSurahById(parsedSurahId) ?? surahs[0];

  useEffect(() => {
    if (surahParam === null || getSurahById(parsedSurahId)) return;

    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      next.delete('surah');
      return next;
    }, { replace: true });
  }, [parsedSurahId, setSearchParams, surahParam]);

  const handleSurahNavigate = (surah: Surah) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      next.set('surah', String(surah.id));
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <Navbar />
      <PrayerTimes />
      <QuranReader
        surah={currentSurah}
        onNavigate={handleSurahNavigate}
      />
      <WordAnalysisOverlay />
    </div>
  );
};

export default Index;
