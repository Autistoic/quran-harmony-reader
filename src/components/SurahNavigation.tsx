import { useState } from 'react';
import { ChevronLeft, ChevronRight, ListFilter } from 'lucide-react';
import { Button } from './ui/button';
import { surahs, Surah } from '@/data/surahs';
import { SurahSelectorDialog } from './SurahSelectorDialog';
import { useTranslation } from '@/i18n';

interface SurahNavigationProps {
  currentSurah: Surah;
  onNavigate: (surah: Surah) => void;
}

export const SurahNavigation = ({ currentSurah, onNavigate }: SurahNavigationProps) => {
  const [selectorOpen, setSelectorOpen] = useState(false);
  const { t } = useTranslation();
  const currentIndex = surahs.findIndex((s) => s.id === currentSurah.id);
  const prevSurah = currentIndex > 0 ? surahs[currentIndex - 1] : null;
  const nextSurah = currentIndex < surahs.length - 1 ? surahs[currentIndex + 1] : null;

  return (
    <>
      <div className="flex items-center justify-between gap-2 sm:gap-4 mb-6 p-2 rounded-2xl bg-card/60 backdrop-blur-md border border-border/60 shadow-xs">
        {/* Previous Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => prevSurah && onNavigate(prevSurah)}
          disabled={!prevSurah}
          className="flex items-center gap-1.5 h-9 px-3 rounded-xl hover:bg-muted/70 disabled:opacity-30 transition-all"
          title={prevSurah ? `${t("nav.previous") || "Anterior"}: ${prevSurah.name}` : undefined}
          aria-label={prevSurah ? `Ir a ${prevSurah.name}` : "Sura anterior"}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline text-xs font-medium">
            {prevSurah ? prevSurah.name : (t("nav.previous") || "Anterior")}
          </span>
        </Button>

        {/* Quick Surah Selector trigger */}
        <button
          type="button"
          onClick={() => setSelectorOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border/80 bg-background/80 hover:bg-muted/80 hover:border-primary/40 transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-2xs"
          title={t("nav.selectSurah") || "Seleccionar Sura"}
        >
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-[11px] font-bold">
            {currentSurah.id}
          </span>
          <span className="text-xs sm:text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
            {currentSurah.name}
          </span>
          <span className="font-quran-arabic text-primary text-sm sm:text-base leading-none">
            {currentSurah.arabicName}
          </span>
          <ListFilter className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors ml-0.5" />
        </button>

        {/* Next Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => nextSurah && onNavigate(nextSurah)}
          disabled={!nextSurah}
          className="flex items-center gap-1.5 h-9 px-3 rounded-xl hover:bg-muted/70 disabled:opacity-30 transition-all"
          title={nextSurah ? `${t("nav.next") || "Siguiente"}: ${nextSurah.name}` : undefined}
          aria-label={nextSurah ? `Ir a ${nextSurah.name}` : "Siguiente sura"}
        >
          <span className="hidden sm:inline text-xs font-medium">
            {nextSurah ? nextSurah.name : (t("nav.next") || "Siguiente")}
          </span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <SurahSelectorDialog
        open={selectorOpen}
        onOpenChange={setSelectorOpen}
        currentSurah={currentSurah}
        onSelectSurah={onNavigate}
      />
    </>
  );
};
