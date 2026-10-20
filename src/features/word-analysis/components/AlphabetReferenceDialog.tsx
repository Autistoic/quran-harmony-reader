import { ArrowLeft } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { LETTER_TABLE } from "../lib/arabic/constants";
import { getContextualForms } from "../lib/arabic/forms";
import { cn } from "@/lib/utils";

import { useTranslation } from "@/i18n";

interface AlphabetReferenceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBackToWord?: () => void;
}

const FORM_KEYS: { key: "isolated" | "initial" | "medial" | "final"; labelKey: string }[] = [
  { key: "isolated", labelKey: "wordAnalysis.table.isolated" },
  { key: "initial", labelKey: "wordAnalysis.table.initial" },
  { key: "medial", labelKey: "wordAnalysis.table.medial" },
  { key: "final", labelKey: "wordAnalysis.table.final" },
];

const AlphabetReferenceDialog = ({ open, onOpenChange, onBackToWord }: AlphabetReferenceDialogProps) => {
  const entries = Object.entries(LETTER_TABLE);
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl w-[95vw] max-h-[90vh] p-0 overflow-hidden flex flex-col gap-0">
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-6 pt-6 pb-4">
          {onBackToWord && (
            <button
              type="button"
              onClick={onBackToWord}
              className="mb-2 inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary/40 px-2.5 py-1 text-xs text-foreground/80 hover:bg-secondary hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {t("common.backToWord")}
            </button>
          )}
          <DialogTitle className="text-lg font-semibold">{t("wordAnalysis.referenceTitle")}</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-1">
            {t("wordAnalysis.referenceDescription")}
          </DialogDescription>
        </div>

        <div className="overflow-y-auto">
          {/* Sticky column header */}
          <div
            className="sticky top-0 z-[5] grid items-center gap-2 border-b border-border bg-muted/40 px-4 py-2 text-[10px] uppercase tracking-wider text-muted-foreground"
            style={{ gridTemplateColumns: "minmax(64px,1fr) minmax(48px,0.8fr) repeat(4, minmax(48px,1fr))", direction: "ltr" }}
          >
            <span>{t("wordAnalysis.table.name")}</span>
            <span>{t("wordAnalysis.table.sound")}</span>
            {FORM_KEYS.map(({ key, labelKey }) => (
              <span key={key} className="text-center">{t(labelKey)}</span>
            ))}
          </div>

          <div className="divide-y divide-border">
            {entries.map(([base, info], idx) => {
              const forms = getContextualForms(base);
              return (
                <div
                  key={base}
                  className={cn(
                    "grid items-center gap-2 px-4 py-2 hover:bg-muted/30 transition-colors",
                    idx % 2 === 1 && "bg-muted/10",
                  )}
                  style={{ gridTemplateColumns: "minmax(64px,1fr) minmax(48px,0.8fr) repeat(4, minmax(48px,1fr))", direction: "ltr" }}
                >
                  <span className="text-sm font-medium text-foreground">{t(info.nameKey)}</span>
                  <span className="text-xs text-muted-foreground">/{info.consonantSound || "∅"}/</span>
                  {FORM_KEYS.map(({ key }) => (
                    <span
                      key={key}
                      className={cn(
                        "text-center leading-none font-analysis-arabic",
                        key === "isolated" ? "text-primary" : "text-foreground/85",
                      )}
                      style={{
                        direction: "rtl",
                        fontSize: "clamp(1.75rem, 4.5vw, 2.5rem)",
                      }}
                    >
                      {forms[key]}
                    </span>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AlphabetReferenceDialog;
