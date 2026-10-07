import { ArrowLeft, ArrowRight, Link2, Unlink2 } from "lucide-react";
import type { Position } from "../lib/arabic/types";
import type { WordAnalysisLetter } from "../lib/arabic/wordAnalysisAdapter";
import { getFullSound } from "../lib/arabic/phonetics";
import { getContextualForms } from "../lib/arabic/forms";
import { cn } from "@/lib/utils";

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

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex flex-col gap-2 rounded-xl border bg-card/70 p-3 sm:p-4 text-left transition-colors",
        selected
          ? "border-primary ring-2 ring-primary/40 bg-primary/5"
          : "border-border hover:border-primary/40",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-baseline gap-2">
          <span className="text-[10px] font-mono text-muted-foreground">#{index + 1}</span>
          <span className="text-sm font-semibold text-foreground">{letter.name}</span>
          {!hideDetails && ( <span className="text-xs text-muted-foreground">/{getFullSound(letter) || "∅"}/</span>)}
        </div>
        <span
          className="font-arabic text-3xl text-primary leading-none"
        >
          {letter.display}
        </span>
      </div>

      {/* Chips */}
      <div className="flex flex-wrap gap-1">
        <span className="rounded bg-secondary px-2 py-0.5 text-[10px] text-secondary-foreground">
          {letter.position}
        </span>
        {letter.vowel && (
          <span className="rounded bg-accent/20 px-2 py-0.5 text-[10px] text-accent">
            {letter.vowel.type}
            {letter.vowel.sound ? ` → ${letter.vowel.sound}` : " → ∅"}
          </span>
        )}
      </div>

      {/* Forms strip */}
      <div className="flex flex-col gap-1">
        {/* <span className="text-[9px] uppercase tracking-wider text-muted-foreground">
          Forms (iso → ini → med → fin)
        </span> */}
        <div className="flex justify-between gap-1" style={{ direction: "ltr" }}>
          {FORM_ORDER.map(({ key, pos, label }) => {
            const active = letter.position === pos;
            return (
              <div
                key={key}
                className={cn(
                  "flex flex-1 flex-col items-center gap-0.5 rounded px-1 py-1.5 transition-colors",
                  active ? "bg-primary/15 text-primary ring-1 ring-primary/40" : "bg-secondary/30 text-foreground/80",
                )}
              >
                <span
                  className="font-arabic text-2xl leading-none"
                >
                  {forms[key]}
                </span>
                <span className="text-[9px] uppercase tracking-wider opacity-70">{label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Joining — actual connection state derived from position, not intrinsic capability.
           Visual left = next letter (left in RTL), visual right = previous letter (right in RTL). */}
      {(() => {
        const connectedLeft = letter.position === "Medial" || letter.position === "Initial";
        const connectedRight = letter.position === "Medial" || letter.position === "Final";
        return (
          <div className="flex items-center justify-center gap-1.5 pt-1" style={{ direction: "ltr" }}>
            <ArrowLeft size={12} className="text-muted-foreground/60" />
            {connectedLeft ? (
              <Link2 size={14} className="text-primary" />
            ) : (
              <Unlink2 size={14} className="text-muted-foreground/50" />
            )}
            <span className="mx-1 text-base text-foreground font-arabic">
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
