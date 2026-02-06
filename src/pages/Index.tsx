import { useState } from 'react';
import { Link } from 'react-router-dom';
import { QuranReader } from '@/components/QuranReader';
import { surahs, Surah } from '@/data/surahs';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';

const Index = () => {
  const [currentSurah, setCurrentSurah] = useState<Surah>(surahs[0]);

  return (
    <div>
      {/* Link to Wird Sharif */}
      <div className="max-w-3xl mx-auto px-4 pt-6">
        <Button variant="outline" size="sm" asChild>
          <Link to="/wird-sharif" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span>Wird Sharif Saguir</span>
          </Link>
        </Button>
      </div>
      <QuranReader
        surah={currentSurah}
        onNavigate={setCurrentSurah}
      />
    </div>
  );
};

export default Index;
