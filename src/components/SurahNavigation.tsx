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
      <div className="mb-6 flex min-w-0 items-center justify-between gap-1 rounded-2xl border border-border/60 bg-card/60 p-2 shadow-xs backdrop-blur-md sm:gap-4">
        {/* Previous Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => prevSurah && onNavigate(prevSurah)}
          disabled={!prevSurah}
          className="flex h-9 shrink-0 items-center gap-1.5 rounded-xl px-2 transition-all hover:bg-muted/70 disabled:opacity-30 sm:px-3"
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
          className="group flex min-w-0 max-w-full flex-1 items-center justify-center gap-1 overflow-hidden rounded-xl border border-border/80 bg-background/80 px-1.5 py-1.5 shadow-2xs transition-all hover:border-primary/40 hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:flex-none sm:gap-2 sm:px-3"
          title={t("nav.selectSurah") || "Seleccionar Sura"}
        >
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
            {currentSurah.id}
          </span>
          <span className="min-w-0 truncate text-xs font-semibold text-foreground transition-colors group-hover:text-primary sm:text-sm">
            {currentSurah.name}
          </span>
          <span className="max-w-[3.5rem] shrink font-quran-arabic text-sm leading-none text-primary sm:max-w-none sm:text-base">
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
          className="flex h-9 shrink-0 items-center gap-1.5 rounded-xl px-2 transition-all hover:bg-muted/70 disabled:opacity-30 sm:px-3"
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
