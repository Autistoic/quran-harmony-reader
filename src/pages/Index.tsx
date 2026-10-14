import { useState } from 'react';
import { Link } from 'react-router-dom';
import { QuranReader } from '@/components/QuranReader';
import { surahs, Surah } from '@/data/surahs';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';
import { PrayerTimes } from "@/components/PrayerTimes";
import { WordAnalysisOverlay } from "@/features/word-analysis/components/WordAnalysisOverlay";


import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useTranslation } from "@/i18n";

const Index = () => {
  const [currentSurah, setCurrentSurah] = useState<Surah>(surahs[0]);
  const { t } = useTranslation();

  return (
    <div>
      {/* Top Header Navigation */}
      <div className="max-w-3xl mx-auto px-4 pt-6 flex items-center justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link to="/wird-sharif" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span>{t("nav.wirdSharif")}</span>
          </Link>
        </Button>
        <LanguageSwitcher />
      </div>
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
