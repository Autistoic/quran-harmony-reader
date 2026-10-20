import { Surah } from '@/data/surahs';
import { useTranslation } from '@/i18n';

interface SurahHeaderProps {
  surah: Surah;
}

export const SurahHeader = ({ surah }: SurahHeaderProps) => {
  const { t } = useTranslation();
  const verseCount = surah.verses.length;

  return (
    <header className="relative text-center mb-10 overflow-hidden rounded-3xl border border-border/70 bg-card/60 backdrop-blur-md p-6 sm:p-10 shadow-sm">
      {/* Decorative background glow */}
      <div className="absolute inset-0 bg-radial from-primary/5 via-transparent to-transparent pointer-events-none" />

      {/* Surah metadata badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold tracking-wider uppercase mb-4">
        <span>Sura {surah.id}</span>
        <span>•</span>
        <span>{verseCount} {t("nav.verses") || "aleyas"}</span>
      </div>

      {/* Grand Arabic Name */}
      <div className="my-2">
        <h1 className="font-quran-arabic text-5xl sm:text-6xl md:text-7xl text-foreground font-normal tracking-wide drop-shadow-2xs select-none">
          {surah.arabicName}
        </h1>
      </div>

      {/* Transliterated English/Spanish Title */}
      <h2 className="text-xl sm:text-2xl font-transliteration text-primary font-medium mt-2">
        {surah.name}
      </h2>

      {/* Islamic Ornamental Divider */}
      <div className="flex items-center justify-center gap-3 my-6 max-w-xs mx-auto">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-accent/60" />
        <div className="w-2.5 h-2.5 rotate-45 bg-accent/80 border border-background shadow-xs" />
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-accent/60" />
      </div>

      {/* Bismillah calligraphy banner for all surahs except Tawbah (Surah 9) */}
      {surah.id !== 9 && (
        <div className="relative inline-block px-8 py-3 rounded-2xl bg-secondary/30 border border-border/60">
          <p
            className="font-quran-arabic text-2xl sm:text-3xl text-foreground/90 tracking-wide select-none"
            dir="rtl"
            aria-label="En el nombre de Dios, el Clemente, el Misericordioso"
          >
            بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
          </p>
        </div>
      )}
    </header>
  );
};
