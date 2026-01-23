import { QuranReader } from '@/components/QuranReader';
import { surahAlIkhlas } from '@/data/surahs';

const Index = () => {
  return <QuranReader surah={surahAlIkhlas} />;
};

export default Index;
