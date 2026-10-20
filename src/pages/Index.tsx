import { useState } from 'react';
import { QuranReader } from '@/components/QuranReader';
import { surahs, Surah } from '@/data/surahs';
import { PrayerTimes } from "@/components/PrayerTimes";
import { Navbar } from "@/components/Navbar";
import { WordAnalysisOverlay } from "@/features/word-analysis/components/WordAnalysisOverlay";

const Index = () => {
  const [currentSurah, setCurrentSurah] = useState<Surah>(surahs[0]);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <Navbar />
      <PrayerTimes />
      <QuranReader
        surah={currentSurah}
        onNavigate={setCurrentSurah}
      />
      <WordAnalysisOverlay />
    </div>
  );
};

export default Index;
