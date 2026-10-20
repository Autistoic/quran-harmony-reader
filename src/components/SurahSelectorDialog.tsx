import { useState, useMemo } from "react";
import { Surah, surahs } from "@/data/surahs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, Check, BookOpen } from "lucide-react";
import { useTranslation } from "@/i18n";
import { cn } from "@/lib/utils";

interface SurahSelectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentSurah: Surah;
  onSelectSurah: (surah: Surah) => void;
}

export const SurahSelectorDialog = ({
  open,
  onOpenChange,
  currentSurah,
  onSelectSurah,
}: SurahSelectorDialogProps) => {
  const [search, setSearch] = useState("");
  const { t } = useTranslation();

  const filteredSurahs = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return surahs;
    return surahs.filter(
      (s) =>
        s.id.toString() === q ||
        s.name.toLowerCase().includes(q) ||
        s.arabicName.includes(q)
    );
  }, [search]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden bg-card border-border shadow-xl">
        <DialogHeader className="p-4 pb-2 border-b border-border/50 bg-muted/30">
          <DialogTitle className="text-base font-semibold flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            <span>{t("nav.selectSurah") || "Seleccionar Sura"}</span>
          </DialogTitle>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("nav.searchSurah") || "Buscar por nombre o número..."}
              className="pl-9 bg-background/80 h-9 text-sm"
              autoFocus
            />
          </div>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1">
          {filteredSurahs.map((surah) => {
            const isSelected = surah.id === currentSurah.id;
            return (
              <button
                key={surah.id}
                type="button"
                onClick={() => {
                  onSelectSurah(surah);
                  onOpenChange(false);
                }}
                className={cn(
                  "w-full flex items-center justify-between p-3 rounded-xl transition-all text-left",
                  isSelected
                    ? "bg-primary/10 border border-primary/30 text-foreground font-medium shadow-xs"
                    : "hover:bg-muted/60 text-foreground/80 hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-lg text-xs font-semibold",
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {surah.id}
                  </span>
                  <div>
                    <div className="text-sm font-medium leading-none">
                      {surah.name}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {surah.verses.length} {t("nav.verses") || "versículos"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-quran-arabic text-xl text-primary">
                    {surah.arabicName}
                  </span>
                  {isSelected && (
                    <Check className="h-4 w-4 text-primary shrink-0" />
                  )}
                </div>
              </button>
            );
          })}

          {filteredSurahs.length === 0 && (
            <div className="text-center py-8 text-sm text-muted-foreground">
              {t("nav.noSurahFound") || "No se encontraron suras"}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
