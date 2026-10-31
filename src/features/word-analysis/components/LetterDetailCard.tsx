import { useId, type Ref } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Position } from "../lib/arabic/types";
import type { WordAnalysisLetter } from "../lib/arabic/wordAnalysisAdapter";
import { getFullSound, hasShadda } from "../lib/arabic/phonetics";
import { getPhoneticBadges } from "../lib/arabic/phoneticBadges";
import { getContextualForms } from "../lib/arabic/forms";
import type { LetterConnectionState } from "../lib/arabic/joining";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/i18n";

const FORM_ORDER: { key: keyof ReturnType<typeof getContextualForms>; pos: Position }[] = [
  { key: "isolated", pos: "Isolated" },
  { key: "initial", pos: "Initial" },
  { key: "medial", pos: "Medial" },
  { key: "final", pos: "Final" },
];

interface Props {
  letter: WordAnalysisLetter;
  connection: LetterConnectionState;
  index: number;
  selected?: boolean;
  onSelect?: () => void;
  cardRef?: Ref<HTMLButtonElement>;
  cardContainerRef?: Ref<HTMLDivElement>;
  navigationFocused?: boolean;
  isException?: boolean;
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
}: Props) => {
  const forms = getContextualForms(letter.base);
  const { t } = useTranslation();
  const sound = getFullSound(letter) || "∅";
  const phoneticBadges = getPhoneticBadges(letter);
  const formsDescriptionId = useId();

  return (
    <Card
      ref={cardContainerRef}
      dir="ltr"
      className={cn(
        "overflow-hidden rounded-2xl border bg-card/75 text-left transition-all duration-200",
        "hover:bg-card hover:shadow-md",
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
        aria-label={t("wordAnalysis.cardAriaLabel", {
          index: index + 1,
          letter: t(letter.nameKey),
          sound: `/${sound}/`,
          form: t(`wordAnalysis.positions.${connection.position}`),
        })}
        aria-describedby={formsDescriptionId}
        aria-pressed={selected}
        className="flex h-auto w-full flex-col gap-2 rounded-none p-2.5 text-left hover:bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:gap-3 sm:p-3"
      >
        <div className="flex min-h-9 w-full min-w-0 items-center gap-2 sm:gap-3">
          <h3 className="min-w-0 flex-1 truncate font-serif text-sm font-semibold uppercase tracking-wide text-foreground sm:text-base">
            <span className="text-muted-foreground">#{index + 1}</span>
            <span className="px-1.5 text-muted-foreground/60">•</span>
            <span>{t(letter.nameKey)}</span>
          </h3>
          <span className="inline-flex shrink-0 items-center rounded-full border border-border/70 bg-secondary/75 px-3 py-1 font-mono text-sm font-bold tracking-tight text-foreground sm:text-base">
            /{sound}/
          </span>
          {(hasShadda(letter) || letter.vowel || phoneticBadges.length > 0) && (
            <div className="flex max-w-full shrink-0 flex-wrap items-center gap-1">
              {hasShadda(letter) && (
                <span className="rounded-full border border-accent/30 bg-accent/20 px-2 py-1 text-[10px] font-medium text-accent-foreground">
                  {t("wordAnalysis.chips.shaddah")}
                </span>
              )}
              {letter.vowel && (
                <span className="rounded-full border border-accent/20 bg-accent/15 px-2 py-1 text-[10px] font-medium text-accent-foreground">
                  {t(`wordAnalysis.vowels.${letter.vowel.type}`)}
                </span>
              )}
              {phoneticBadges.map(({ key, label }) => (
                <span
                  key={key}
                  className="rounded-full border border-border/70 bg-muted/70 px-2 py-1 text-[10px] font-medium leading-none text-muted-foreground"
                >
                  {label}
                </span>
              ))}
            </div>
          )}
        </div>

        <div
          aria-hidden="true"
          className="grid h-32 w-full grid-cols-4 overflow-hidden rounded-xl border border-foreground/55 bg-background/45 sm:h-40 md:h-44"
        >
          {FORM_ORDER.map(({ key, pos }, formIndex) => {
            const active = connection.position === pos;
            const formLabel = t(`wordAnalysis.contextualFormNames.${pos}`);
            const glyph = forms[key];

            return (
              <div
                key={key}
                role="group"
                aria-label={`${formLabel}: ${glyph}`}
                aria-current={active ? "true" : undefined}
                className={cn(
                  "relative grid min-w-0 grid-rows-[1fr_auto] items-center justify-items-center gap-1 px-1 py-2 text-center transition-colors sm:gap-1.5 sm:px-2 sm:py-3",
                  formIndex < FORM_ORDER.length - 1 && "border-r border-border/80",
                  active
                    ? "z-[1] bg-primary/10 text-foreground ring-2 ring-inset ring-primary/75"
                    : "bg-secondary/10 text-foreground/75",
                )}
              >
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute right-1.5 top-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground sm:right-2 sm:top-2"
                  >
                    <Check aria-hidden="true" className="h-3.5 w-3.5" />
                  </span>
                )}
                <span
                  dir="rtl"
                  aria-hidden="true"
                  className={cn(
                    "grid h-full w-full min-w-0 justify-self-stretch place-items-center text-center font-analysis-arabic text-5xl leading-none sm:text-6xl md:text-7xl",
                    active ? "text-primary" : "text-foreground/85",
                  )}
                >
                  {glyph}
                </span>
                <span className="w-full truncate text-[10px] font-medium uppercase tracking-wide sm:text-xs">
                  {formLabel}
                </span>
              </div>
            );
          })}
        </div>
      </Button>
      <div id={formsDescriptionId} className="sr-only">
        {FORM_ORDER.map(({ key, pos }) => {
          return `${t(`wordAnalysis.contextualFormNames.${pos}`)}: ${forms[key]}. `;
        })}
      </div>
    </Card>
  );
};

export default LetterDetailCard;
