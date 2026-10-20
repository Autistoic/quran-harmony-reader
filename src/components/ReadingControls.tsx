import React from "react";
import { Type, Languages, BookOpenText, Eye, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "@/i18n";
import { cn } from "@/lib/utils";

interface ReadingControlsProps {
  fontSize: "normal" | "large" | "xlarge";
  onFontSizeChange: (size: "normal" | "large" | "xlarge") => void;
  showTransliteration: boolean;
  onToggleTransliteration: () => void;
  showWordTranslation: boolean;
  onToggleWordTranslation: () => void;
  showVerseTranslation: boolean;
  onToggleVerseTranslation: () => void;
  className?: string;
}

export const ReadingControls: React.FC<ReadingControlsProps> = ({
  fontSize,
  onFontSizeChange,
  showTransliteration,
  onToggleTransliteration,
  showWordTranslation,
  onToggleWordTranslation,
  showVerseTranslation,
  onToggleVerseTranslation,
  className,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-2 p-2 rounded-2xl bg-card/70 backdrop-blur-md border border-border/60 shadow-xs mb-6 text-xs",
        className
      )}
    >
      {/* Font scale control */}
      <div className="flex items-center gap-1 bg-background/80 rounded-xl p-1 border border-border/60">
        <span className="text-[10px] uppercase font-semibold text-muted-foreground px-2 hidden sm:inline">
          {t("reader.fontSize") || "Tamaño"}
        </span>
        <button
          type="button"
          onClick={() => onFontSizeChange("normal")}
          className={cn(
            "px-2.5 py-1 rounded-lg text-xs font-medium transition-all",
            fontSize === "normal"
              ? "bg-primary text-primary-foreground font-semibold shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          )}
          title="Normal"
        >
          A
        </button>
        <button
          type="button"
          onClick={() => onFontSizeChange("large")}
          className={cn(
            "px-2.5 py-1 rounded-lg text-sm font-medium transition-all",
            fontSize === "large"
              ? "bg-primary text-primary-foreground font-semibold shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          )}
          title="Grande"
        >
          A+
        </button>
        <button
          type="button"
          onClick={() => onFontSizeChange("xlarge")}
          className={cn(
            "px-2.5 py-1 rounded-lg text-base font-medium transition-all",
            fontSize === "xlarge"
              ? "bg-primary text-primary-foreground font-semibold shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          )}
          title="Muy Grande"
        >
          A++
        </button>
      </div>

      {/* Visibility Toggles */}
      <div className="flex items-center gap-1.5">
        {/* Transliteration toggle button */}
        <Button
          variant={showTransliteration ? "secondary" : "ghost"}
          size="sm"
          onClick={onToggleTransliteration}
          className={cn(
            "h-8 px-2.5 rounded-xl text-xs gap-1.5 border transition-all",
            showTransliteration
              ? "border-primary/40 bg-primary/10 text-primary font-medium"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
          title={showTransliteration ? "Ocultar transliteración" : "Mostrar transliteración"}
          aria-pressed={showTransliteration}
        >
          <Type className="h-3.5 w-3.5" />
          <span className="hidden md:inline">{t("reader.transliteration") || "Transliteración"}</span>
        </Button>

        {/* Word translation toggle button */}
        <Button
          variant={showWordTranslation ? "secondary" : "ghost"}
          size="sm"
          onClick={onToggleWordTranslation}
          className={cn(
            "h-8 px-2.5 rounded-xl text-xs gap-1.5 border transition-all",
            showWordTranslation
              ? "border-primary/40 bg-primary/10 text-primary font-medium"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
          title={showWordTranslation ? "Ocultar traducción por palabra" : "Mostrar traducción por palabra"}
          aria-pressed={showWordTranslation}
        >
          <Languages className="h-3.5 w-3.5" />
          <span className="hidden md:inline">{t("reader.wordTranslation") || "Por palabra"}</span>
        </Button>

        {/* Full verse translation toggle button */}
        <Button
          variant={showVerseTranslation ? "secondary" : "ghost"}
          size="sm"
          onClick={onToggleVerseTranslation}
          className={cn(
            "h-8 px-2.5 rounded-xl text-xs gap-1.5 border transition-all",
            showVerseTranslation
              ? "border-primary/40 bg-primary/10 text-primary font-medium"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
          title={showVerseTranslation ? "Ocultar traducción de versos" : "Mostrar traducción de versos"}
          aria-pressed={showVerseTranslation}
        >
          <BookOpenText className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{t("reader.verseTranslation") || "Verso completo"}</span>
        </Button>
      </div>
    </div>
  );
};
