import { useState } from 'react';
import { QuranReader } from '@/components/QuranReader';
import { surahs, Surah } from '@/data/surahs';

const Index = () => {
  const [currentSurah, setCurrentSurah] = useState<Surah>(surahs[0]);

  return (
    <QuranReader 
      surah={currentSurah} 
      onNavigate={setCurrentSurah}
    />
  );
};

export default Index;
