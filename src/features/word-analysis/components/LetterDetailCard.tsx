import type { Ref } from "react";
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
  cardRef?: Ref<HTMLButtonElement>;
  navigationFocused?: boolean;
}

const LetterDetailCard = ({ letter, index, selected, onSelect, hideDetails, cardRef, navigationFocused }: Props) => {
  const forms = getContextualForms(letter.base);
  const { t } = useTranslation();

  return (
    <button
      ref={cardRef}
      type="button"
      dir="ltr"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "group flex flex-col gap-2 rounded-2xl border bg-card/75 p-3 sm:p-3.5 text-left transition-all duration-200 overflow-visible",
        "hover:shadow-md hover:border-primary/50 hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        navigationFocused && "letter-card-focus-flash",
        selected
          ? "border-primary ring-2 ring-primary/40 bg-primary/5 shadow-sm"
          : "border-border/80 shadow-xs",
      )}
    >
      {/* 1. Header: Dominant Hero Glyph (~2x Scale) + Elevated Phonetics */}
      <div className="flex items-center justify-between gap-3 w-full">
        {/* Left Column: Subdued Sequence + Prominent Phonetic Pronunciation + Secondary Letter Name */}
        <div className="flex flex-col gap-1 min-w-0">
          {/* Demoted Index and Letter Name */}
          <div className="flex items-center gap-1.5 text-muted-foreground/70">
            <span className="text-[10px] font-mono tracking-wider">#{index + 1}</span>
            <span className="text-muted-foreground/40">•</span>
            <span className="text-xs font-medium text-muted-foreground truncate">{letter.name}</span>
          </div>

          {/* Elevated Phonetic Sound (Highest value reading anchor for learners) */}
          {!hideDetails && (
            <div className="flex items-center">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md font-mono text-base sm:text-lg font-bold text-foreground bg-secondary/60 border border-border/50 tracking-tight shadow-2xs">
                /{getFullSound(letter) || "∅"}/
              </span>
            </div>
          )}
        </div>

        {/* Right Column: Hero Arabic Letter Glyph (~2x Scale, 48px-60px) */}
        <div className="flex items-center justify-end min-h-[3.5rem] sm:min-h-[4rem] px-1.5 py-0.5 overflow-visible">
          <span className="font-arabic text-4xl sm:text-5xl text-primary leading-normal select-none drop-shadow-2xs transition-transform duration-200 group-hover:scale-105">
            {letter.display}
          </span>
        </div>
      </div>

      {/* 2. Metadata Chips: Position + Shaddah + Vowel */}
      <div className="flex flex-wrap gap-1 items-center">
        <span className="rounded-md bg-secondary/80 px-2 py-0.5 text-[10px] font-medium text-secondary-foreground border border-border/30">
          {t(`wordAnalysis.positions.${letter.position}`)}
        </span>
        {hasShadda(letter) && (
          <span className="rounded-md bg-accent/25 px-2 py-0.5 text-[10px] font-semibold text-accent-foreground border border-accent/30">
            {t("wordAnalysis.chips.shaddah")}
          </span>
        )}
        {letter.vowel && (
          <span className="rounded-md bg-accent/20 px-2 py-0.5 text-[10px] font-medium text-accent border border-accent/20">
            {t(`wordAnalysis.vowels.${letter.vowel.type}`)}
            {letter.vowel.sound ? ` → ${letter.vowel.sound}` : " → ∅"}
          </span>
        )}
      </div>

      {/* 3. Forms strip: Isolated, Initial, Medial, Final representations */}
      <div className="flex flex-col gap-1 w-full pt-0">
        <div className="flex justify-between gap-1" style={{ direction: "ltr" }}>
          {FORM_ORDER.map(({ key, pos, label }) => {
            const active = letter.position === pos;
            return (
              <div
                key={key}
                className={cn(
                  "flex flex-1 flex-col items-center justify-between rounded-lg px-1 py-1 transition-colors min-h-[3.1rem]",
                  active
                    ? "bg-primary/15 text-primary ring-1 ring-primary/40 font-medium"
                    : "bg-secondary/30 text-foreground/75 hover:bg-secondary/50",
                )}
              >
                <div className="flex-1 flex items-center justify-center w-full overflow-visible py-0.5">
                  <span className="font-arabic text-xl leading-normal">
                    {forms[key]}
                  </span>
                </div>
                <span className="text-[9px] uppercase tracking-wider opacity-65 mt-0.5">
                  {t(`wordAnalysis.forms.${label}`)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Joining Strip: Progressive disclosure (ultra-subtle resting state, lights up on hover/focus) */}
      {/* {(() => {
        const connectedLeft = letter.position === "Medial" || letter.position === "Initial";
        const connectedRight = letter.position === "Medial" || letter.position === "Final";
        return (
          <div
            className={cn(
              "flex items-center justify-center gap-2 pt-2 w-full border-t border-border/30",
              "opacity-60 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-200",
            )}
            style={{ direction: "ltr" }}
          >
            <ArrowLeft size={11} className="text-muted-foreground/60 transition-colors group-hover:text-muted-foreground" />
            {connectedLeft ? (
              <Link2 size={13} className="text-primary transition-colors" />
            ) : (
              <Unlink2 size={13} className="text-muted-foreground/40 transition-colors" />
            )}
            <span className="mx-1 text-base leading-normal text-foreground font-arabic min-w-[1.25rem] text-center">
              {letter.base}
            </span>
            {connectedRight ? (
              <Link2 size={13} className="text-primary transition-colors" />
            ) : (
              <Unlink2 size={13} className="text-muted-foreground/40 transition-colors" />
            )}
            <ArrowRight size={11} className="text-muted-foreground/60 transition-colors group-hover:text-muted-foreground" />
          </div>
        );
      })()} */}
    </button>
  );
};

export default LetterDetailCard;
