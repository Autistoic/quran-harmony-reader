import { ArrowLeft, ArrowRight, Link2, Unlink2 } from "lucide-react";
import type { Position } from "../lib/arabic/types";
import type { WordAnalysisLetter } from "../lib/arabic/wordAnalysisAdapter";
import { getFullSound, hasShadda } from "../lib/arabic/phonetics";
import { getContextualForms } from "../lib/arabic/forms";
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
  index: number;
  selected?: boolean;
  onSelect?: () => void;
  hideDetails?: boolean;
}

const LetterDetailCard = ({ letter, index, selected, onSelect, hideDetails }: Props) => {
  const forms = getContextualForms(letter.base);
  const { t } = useTranslation();

  return (
    <button
      type="button"
      dir="ltr"
      onClick={onSelect}
      className={cn(
        "flex flex-col gap-3 rounded-xl border bg-card/70 p-3.5 sm:p-4 text-left transition-colors overflow-visible",
        selected
          ? "border-primary ring-2 ring-primary/40 bg-primary/5"
          : "border-border hover:border-primary/40",
      )}
    >
      {/* Header: items-start prevents tall Arabic ink from dragging the header into the top border */}
      <div className="flex items-start justify-between gap-3 w-full">
        <div className="flex flex-col gap-1 pt-1">
          <div className="flex items-baseline gap-2">
            <span className="text-[10px] font-mono text-muted-foreground font-semibold">#{index + 1}</span>
            <span className="text-sm font-semibold text-foreground tracking-tight">{letter.name}</span>
          </div>
          {!hideDetails && (
            <span className="text-xs text-muted-foreground font-mono">/{getFullSound(letter) || "∅"}/</span>
          )}
        </div>

        {/* Hero Arabic Letter Display: min-h and leading-normal provide full vertical breathing room for stacked tashkeel */}
        <div className="flex items-center justify-end min-h-[3.5rem] px-1 py-1 overflow-visible">
          <span className="font-arabic text-3xl sm:text-4xl text-primary leading-normal select-none">
            {letter.display}
          </span>
        </div>
      </div>

      {/* Chips: Position + Shaddah + Vowel */}
      <div className="flex flex-wrap gap-1.5 items-center">
        <span className="rounded bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
          {t(`wordAnalysis.positions.${letter.position}`)}
        </span>
        {hasShadda(letter) && (
          <span className="rounded bg-accent/20 px-2 py-0.5 text-[10px] font-medium text-accent">
            {t("wordAnalysis.chips.shaddah")}
          </span>
        )}
        {letter.vowel && (
          <span className="rounded bg-accent/20 px-2 py-0.5 text-[10px] font-medium text-accent">
            {t(`wordAnalysis.vowels.${letter.vowel.type}`)}
            {letter.vowel.sound ? ` → ${letter.vowel.sound}` : " → ∅"}
          </span>
        )}
      </div>

      {/* Forms strip: min-h and leading-normal protect ascenders, tatweel, and descending tails */}
      <div className="flex flex-col gap-1 w-full pt-1">
        <div className="flex justify-between gap-1" style={{ direction: "ltr" }}>
          {FORM_ORDER.map(({ key, pos, label }) => {
            const active = letter.position === pos;
            return (
              <div
                key={key}
                className={cn(
                  "flex flex-1 flex-col items-center justify-between rounded px-1 py-1.5 transition-colors min-h-[3.75rem]",
                  active ? "bg-primary/15 text-primary ring-1 ring-primary/40 font-medium" : "bg-secondary/30 text-foreground/80",
                )}
              >
                <div className="flex-1 flex items-center justify-center w-full overflow-visible py-0.5">
                  <span className="font-arabic text-2xl leading-normal">
                    {forms[key]}
                  </span>
                </div>
                <span className="text-[9px] uppercase tracking-wider opacity-70 mt-0.5">
                  {t(`wordAnalysis.forms.${label}`)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Joining Strip: actual contextual connection derived from position */}
      {(() => {
        const connectedLeft = letter.position === "Medial" || letter.position === "Initial";
        const connectedRight = letter.position === "Medial" || letter.position === "Final";
        return (
          <div className="flex items-center justify-center gap-1.5 pt-1.5 w-full border-t border-border/40" style={{ direction: "ltr" }}>
            <ArrowLeft size={12} className="text-muted-foreground/60" />
            {connectedLeft ? (
              <Link2 size={14} className="text-primary" />
            ) : (
              <Unlink2 size={14} className="text-muted-foreground/50" />
            )}
            <span className="mx-1.5 text-lg leading-normal text-foreground font-arabic min-w-[1.25rem] text-center">
              {letter.base}
            </span>
            {connectedRight ? (
              <Link2 size={14} className="text-primary" />
            ) : (
              <Unlink2 size={14} className="text-muted-foreground/50" />
            )}
            <ArrowRight size={12} className="text-muted-foreground/60" />
          </div>
        );
      })()}
    </button>
  );
};

export default LetterDetailCard;
