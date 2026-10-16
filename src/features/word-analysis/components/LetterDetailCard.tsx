import { useId, useState, type Ref } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Position } from "../lib/arabic/types";
import type { WordAnalysisLetter } from "../lib/arabic/wordAnalysisAdapter";
import { getFullSound, hasShadda } from "../lib/arabic/phonetics";
import { getContextualForms } from "../lib/arabic/forms";
import type { LetterConnectionState } from "../lib/arabic/joining";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/i18n";

const FORM_ORDER: { key: keyof ReturnType<typeof getContextualForms>; pos: Position; label: string }[] = [
  { key: "final", pos: "Final", label: "fin" },
  { key: "medial", pos: "Medial", label: "med" },
  { key: "initial", pos: "Initial", label: "ini" },
  { key: "isolated", pos: "Isolated", label: "iso" },
];

interface Props {
  letter: WordAnalysisLetter;
  connection: LetterConnectionState;
  index: number;
  selected?: boolean;
  onSelect?: () => void;
  hideDetails?: boolean;
  cardRef?: Ref<HTMLButtonElement>;
  cardContainerRef?: Ref<HTMLDivElement>;
  navigationFocused?: boolean;
  isException?: boolean;
  onBlockHover?: (active: boolean) => void;
  onLetterHover?: (active: boolean) => void;
  onLetterFocus?: (active: boolean) => void;
}

const LetterDetailCard = ({
  letter,
  connection,
  index,
  selected,
  onSelect,
  cardRef,
  cardContainerRef,
  navigationFocused,
  isException,
  onBlockHover,
  onLetterHover,
  onLetterFocus,
}: Props) => {
  const forms = getContextualForms(letter.base);
  const activeForm = forms[connection.position.toLowerCase() as keyof typeof forms];
  const { t } = useTranslation();
  const [showForms, setShowForms] = useState(false);
  const formsId = useId();

  const toggleForms = () => {
    setShowForms((visible) => !visible);
  };

  return (
    <Card
      ref={cardContainerRef}
      dir="ltr"
      onMouseEnter={() => {
        onBlockHover?.(true);
        onLetterHover?.(true);
      }}
      onMouseLeave={() => {
        onBlockHover?.(false);
        onLetterHover?.(false);
      }}
      className={cn(
        "group overflow-visible rounded-2xl border bg-card/75 text-left transition-all duration-200",
        "hover:border-primary/50 hover:bg-card hover:shadow-md",
        navigationFocused && "letter-card-focus-flash",
        isException && "border-l-[3px] border-l-[hsl(var(--connection-cut))]",
        selected ? "border-primary ring-2 ring-primary/40 bg-primary/5 shadow-sm" : "border-border/80 shadow-xs",
      )}
    >
      <Button
        ref={cardRef}
        type="button"
        variant="ghost"
        onClick={onSelect}
        onFocus={() => {
          onBlockHover?.(true);
          onLetterFocus?.(true);
        }}
        onBlur={() => {
          onBlockHover?.(false);
          onLetterFocus?.(false);
        }}
        aria-pressed={selected}
        className="grid h-auto w-full grid-cols-1 gap-4 rounded-t-2xl p-4 text-left hover:bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:grid-cols-[minmax(0,1fr)_minmax(14rem,0.9fr)] sm:items-center sm:gap-5 sm:p-5"
      >
        <div className="flex min-w-0 flex-col items-start gap-2.5">
          <div className="flex min-w-0 items-center gap-2 text-muted-foreground/70">
            <span className="shrink-0 text-xs font-mono tracking-wider">#{index + 1}</span>
            <span className="text-muted-foreground/40">•</span>
            <span className="truncate text-sm font-medium text-muted-foreground sm:text-base">{t(letter.nameKey)}</span>
          </div>
          <span className="inline-flex w-fit items-center rounded-md border border-border/50 bg-secondary/60 px-3 py-1 font-mono text-base font-bold tracking-tight text-foreground shadow-2xs sm:text-lg">
            /{getFullSound(letter) || "∅"}/
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="rounded-md border border-border/30 bg-secondary/80 px-2.5 py-1 text-xs font-medium text-secondary-foreground">
              {t(`wordAnalysis.positions.${connection.position}`)}
            </span>
            {hasShadda(letter) && (
              <span className="rounded-md border border-accent/30 bg-accent/25 px-2.5 py-1 text-xs font-semibold text-accent-foreground">
                {t("wordAnalysis.chips.shaddah")}
              </span>
            )}
            {letter.vowel && (
              <span className="rounded-md border border-accent/20 bg-accent/20 px-2.5 py-1 text-xs font-medium text-accent-foreground">
                {t(`wordAnalysis.vowels.${letter.vowel.type}`)}
                {letter.vowel.sound ? ` → ${letter.vowel.sound}` : " → ∅"}
              </span>
            )}
          </div>
        </div>
        <span
          role="img"
          aria-label={`${t("wordAnalysis.positions.Isolated")}: ${forms.isolated}; ${t(`wordAnalysis.positions.${connection.position}`)}: ${activeForm}`}
          className="grid w-full grid-cols-2 gap-3 sm:max-w-[18rem] sm:justify-self-end sm:gap-4"
          style={{ direction: "rtl" }}
        >
          <span className="flex min-h-[7.25rem] min-w-0 flex-col items-center justify-center gap-2 rounded-lg px-2 py-2 text-center sm:min-h-[8rem] sm:px-3">
            <span aria-hidden="true" className="font-arabic text-5xl leading-normal text-muted-foreground/65 sm:text-6xl">
              {forms.isolated}
            </span>
            <span className="w-full text-[10px] leading-snug text-muted-foreground sm:text-xs">
              {t("wordAnalysis.referenceGlyph")}
            </span>
          </span>
          <span className="flex min-h-[7.25rem] min-w-0 flex-col items-center justify-center gap-2 rounded-lg border border-primary/30 border-r-2 bg-primary/10 px-2 py-2 text-center shadow-xs sm:min-h-[8rem] sm:px-3">
            <span aria-hidden="true" className="font-arabic text-6xl leading-normal text-primary drop-shadow-2xs transition-transform duration-200 group-hover:scale-105 sm:text-7xl">
              {activeForm}
            </span>
            <span className="w-full text-[10px] leading-snug text-primary sm:text-xs">
              {t("wordAnalysis.contextGlyph", { position: t(`wordAnalysis.positions.${connection.position}`) })}
            </span>
          </span>
        </span>
      </Button>

      <div className="flex justify-end px-2 pb-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={t(showForms ? "wordAnalysis.hideForms" : "wordAnalysis.viewForms")}
          aria-expanded={showForms}
          aria-controls={formsId}
          onClick={toggleForms}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ChevronDown
            aria-hidden="true"
            className={cn("h-4 w-4 transition-transform duration-200 motion-reduce:transition-none", showForms && "rotate-180")}
          />
        </Button>
      </div>

      <div
        id={formsId}
        aria-hidden={!showForms}
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-300 motion-reduce:transition-none",
          showForms ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div className={cn("px-3", showForms && "border-t border-border/50 pb-3 pt-2 sm:px-3.5")}>
            <div className="flex w-full justify-between gap-1" style={{ direction: "ltr" }}>
              {FORM_ORDER.map(({ key, pos, label }) => {
                const active = connection.position === pos;
                return (
                  <div
                    key={key}
                    className={cn(
                      "flex min-h-[3.1rem] flex-1 flex-col items-center justify-between rounded-lg px-1 py-1 transition-colors",
                      active
                        ? "bg-primary/15 font-medium text-primary ring-1 ring-primary/40"
                        : "bg-secondary/30 text-foreground/75 hover:bg-secondary/50",
                    )}
                  >
                    <div className="flex flex-1 items-center justify-center overflow-visible py-0.5">
                      <span className="font-arabic text-xl leading-normal">{forms[key]}</span>
                    </div>
                    <span className="mt-0.5 text-[9px] uppercase tracking-wider opacity-65">
                      {t(`wordAnalysis.forms.${label}`)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default LetterDetailCard;
