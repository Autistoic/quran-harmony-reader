import type { LetterConnectionState } from "../lib/arabic/joining";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/i18n";

interface Props {
  connection: LetterConnectionState;
  className?: string;
}

const ConnectionStrip = ({ connection, className }: Props) => {
  const { t } = useTranslation();
  const statusKey = connection.connectsPrevious
    ? connection.connectsNext
      ? "both"
      : "previousOnly"
    : connection.connectsNext
      ? "nextOnly"
      : "none";

  return (
    <div className={cn("flex min-w-0 flex-col items-center justify-center gap-1.5 text-center", className)}>
      <svg
        aria-hidden="true"
        viewBox="0 0 200 36"
        className="h-8 w-full max-w-48 overflow-visible"
        fill="none"
      >
        <g stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round">
          {connection.connectsNext ? (
            <line x1="28" y1="18" x2="94" y2="18" />
          ) : connection.hasNext ? (
            <>
              <line x1="28" y1="18" x2="57" y2="18" />
              <line x1="72" y1="18" x2="91" y2="18" />
            </>
          ) : null}
          {connection.connectsPrevious ? (
            <line x1="106" y1="18" x2="172" y2="18" />
          ) : connection.hasPrevious ? (
            <>
              <line x1="109" y1="18" x2="128" y2="18" />
              <line x1="143" y1="18" x2="172" y2="18" />
            </>
          ) : null}
        </g>
        {connection.hasNext && <circle cx="22" cy="18" r="4" fill="hsl(var(--muted-foreground))" />}
        {connection.hasPrevious && <circle cx="178" cy="18" r="4" fill="hsl(var(--muted-foreground))" />}
        <circle cx="100" cy="18" r="6" fill="hsl(var(--primary))" />
      </svg>

      <span className="text-[10px] font-medium leading-tight text-foreground sm:text-xs">
        {t(`wordAnalysis.connection.${statusKey}`)}
      </span>

      {connection.previousBreaksConnection && connection.previous && (
        <span className="max-w-full text-[10px] leading-snug text-muted-foreground sm:text-[11px]">
          {t("wordAnalysis.connection.whyPrevious", {
            position: t(`wordAnalysis.positions.${connection.position}`),
            previous: t(connection.previous.nameKey),
          })}
        </span>
      )}
    </div>
  );
};

export default ConnectionStrip;
