import { Surah } from '@/data/surahs';

interface SurahHeaderProps {
  surah: Surah;
}

export const SurahHeader = ({ surah }: SurahHeaderProps) => {
  return (
    <div className="text-center mb-8">
      {/* Decorative element */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="h-px w-16 bg-gradient-to-r from-transparent to-accent" />
        <div className="w-3 h-3 rotate-45 bg-accent" />
        <div className="h-px w-16 bg-gradient-to-l from-transparent to-accent" />
      </div>
      
      {/* Surah info */}
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground uppercase tracking-widest">
          Surah {surah.id}
        </p>
        <h1 className="font-arabic text-5xl md:text-6xl text-foreground mb-2">
          {surah.arabicName}
        </h1>
        <h2 className="text-2xl font-transliteration text-primary font-medium">
          {surah.name}
        </h2>
      </div>
      
      {/* Decorative element */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <div className="h-px w-16 bg-gradient-to-r from-transparent to-accent" />
        <div className="w-3 h-3 rotate-45 bg-accent" />
        <div className="h-px w-16 bg-gradient-to-l from-transparent to-accent" />
      </div>
    </div>
  );
};
