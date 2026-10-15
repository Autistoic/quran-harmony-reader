import { useCallback, useLayoutEffect, useMemo, useState, type RefObject } from "react";
import { Scissors } from "lucide-react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/i18n";
import type { WordAnalysisLetter } from "../lib/arabic/wordAnalysisAdapter";
import { getLetterConnection } from "../lib/arabic/joining";
import {
  NEVER_JOIN_NEXT,
  isLamAlifAt,
  joinsBetween,
  type StrokeBlock,
  type StrokeCut,
} from "../lib/arabic/strokeBlocks";

export interface RailLayout {
  nodeY: number[];
  cutY: Record<number, number>;
  height: number;
}

/** Measures card header centers and cut-gap centers relative to the list container. */
export function useCardPositions(
  containerRef: RefObject<HTMLElement>,
  headerRefs: RefObject<Array<HTMLElement | null>>,
  cutRefs: RefObject<Record<number, HTMLElement | null>>,
  deps: unknown[],
): RailLayout {
  const [layout, setLayout] = useState<RailLayout>({ nodeY: [], cutY: {}, height: 0 });

  const measure = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const c = container.getBoundingClientRect();
    const center = (el: HTMLElement | null | undefined) => {
      if (!el) return 0;
      const r = el.getBoundingClientRect();
      return r.top - c.top + r.height / 2;
    };
    const nodeY = (headerRefs.current ?? []).map(center);
    const cutY: Record<number, number> = {};
    for (const [k, el] of Object.entries(cutRefs.current ?? {})) if (el) cutY[Number(k)] = center(el);
    setLayout((prev) => {
      const same = prev.height === c.height
        && prev.nodeY.length === nodeY.length
        && prev.nodeY.every((y, i) => Math.abs(y - nodeY[i]) < 0.5)
        && Object.keys(cutY).length === Object.keys(prev.cutY).length
        && Object.entries(cutY).every(([k, y]) => Math.abs((prev.cutY[Number(k)] ?? -1) - y) < 0.5);
      return same ? prev : { nodeY, cutY, height: c.height };
    });
  }, [containerRef, headerRefs, cutRefs]);

  useLayoutEffect(() => {
    measure();
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(container);
    Array.from(container.querySelectorAll("[data-rail-measure]")).forEach((el) => ro.observe(el));
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure).catch(() => undefined);
    const raf = requestAnimationFrame(measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [measure, ...deps]);

  return layout;
}

export const blockTone = (blockIndex: number) => `hsl(var(--block-${(blockIndex % 3) + 1}))`;

interface NodeGroup {
  indices: number[];
  y: number;
}

interface Props {
  letters: WordAnalysisLetter[];
  source: string;
  blocks: StrokeBlock[];
  cuts: StrokeCut[];
  blockOf: number[];
  layout: RailLayout;
  activeIndex: number | null;
  hoveredBlock: number | null;
  onHoverBlock: (block: number | null) => void;
  onSelect: (index: number) => void;
  onOpenReference?: () => void;
  narrow: boolean;
}

const ConnectionRail = ({
  letters, source, blocks, cuts, blockOf, layout, activeIndex, hoveredBlock, onHoverBlock, onSelect, onOpenReference, narrow,
}: Props) => {
  const { t } = useTranslation();
  const width = narrow ? 24 : 28;
  const cx = width / 2;
  const nodeR = narrow ? 6 : 7;
  const ready = layout.nodeY.length === letters.length && letters.length > 0;

  const groups = useMemo<NodeGroup[]>(() => {
    if (!ready) return [];
    const out: NodeGroup[] = [];
    for (let i = 0; i < letters.length; i++) {
      if (isLamAlifAt(letters, i, source)) {
        out.push({ indices: [i, i + 1], y: (layout.nodeY[i] + layout.nodeY[i + 1]) / 2 });
        i++;
      } else {
        out.push({ indices: [i], y: layout.nodeY[i] });
      }
    }
    return out;
  }, [letters, source, layout.nodeY, ready]);

  const activeBlock = activeIndex !== null ? blockOf[activeIndex] : null;
  const emphasisBlock = hoveredBlock ?? activeBlock;

  if (!ready) return null;

  const name = (i: number) => t(letters[i].nameKey);
  const statusOf = (i: number) => {
    const c = getLetterConnection(letters, i);
    const prev = i > 0 && joinsBetween(letters, i - 1, source);
    const next = joinsBetween(letters, i, source) || c.connectsNext && false;
    return prev ? (next ? "both" : "previous") : next ? "next" : "none";
  };

  let segmentCounter = 0;

  return (
    <div className="absolute inset-y-0 left-0" style={{ width }}>
      <svg
        aria-hidden="true"
        width={width}
        height={layout.height}
        viewBox={`0 0 ${width} ${layout.height}`}
        className="absolute left-0 top-0 overflow-visible"
      >
        {/* Block brackets */}
        {blocks.map((b, bi) => {
          if (b.size < 2) return null;
          const y1 = layout.nodeY[b.startIndex];
          const y2 = layout.nodeY[b.endIndex];
          return (
            <rect
              key={b.id}
              x={cx - 11}
              y={y1 - 11}
              width={22}
              height={y2 - y1 + 22}
              rx={11}
              fill={blockTone(bi)}
              fillOpacity={emphasisBlock === bi ? 0.2 : 0.12}
              className="transition-[fill-opacity] duration-200"
            />
          );
        })}

        {/* Track between consecutive nodes: solid when joined, dashed at cuts */}
        {groups.slice(0, -1).map((g, gi) => {
          const last = g.indices[g.indices.length - 1];
          const joined = joinsBetween(letters, last, source);
          return (
            <line
              key={`track-${gi}`}
              x1={cx}
              x2={cx}
              y1={g.y}
              y2={groups[gi + 1].y}
              stroke="hsl(var(--rail-track))"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeDasharray={joined ? undefined : "3 4"}
            />
          );
        })}

        {/* Word separators */}
        {cuts.filter((c) => c.reason === "word-edge").map((c) => {
          const y = layout.cutY[c.afterIndex];
          if (y === undefined) return null;
          return (
            <line key={`word-${c.afterIndex}`} x1={0} x2={width} y1={y - 14} y2={y - 14} stroke="hsl(var(--muted-foreground))" strokeOpacity={0.5} strokeWidth={2} strokeLinecap="round" />
          );
        })}

        {/* Hero stroke segments */}
        {groups.slice(0, -1).map((g, gi) => {
          const last = g.indices[g.indices.length - 1];
          if (!joinsBetween(letters, last, source)) return null;
          const bi = blockOf[last];
          const order = segmentCounter++;
          return (
            <line
              key={`seg-${gi}-${bi === activeBlock ? activeIndex : "x"}`}
              x1={cx}
              x2={cx}
              y1={g.y}
              y2={groups[gi + 1].y}
              pathLength={1}
              stroke={blockTone(bi)}
              strokeWidth={5}
              strokeLinecap="round"
              className={cn("rail-draw cursor-pointer", bi === activeBlock && "rail-pulse")}
              style={{
                animationDelay: bi === activeBlock ? undefined : `${order * 60}ms`,
                opacity: emphasisBlock !== null && emphasisBlock !== bi ? 0.45 : 1,
                pointerEvents: "stroke",
              }}
              onMouseEnter={() => onHoverBlock(bi)}
              onMouseLeave={() => onHoverBlock(null)}
            >
              <title>{t("wordAnalysis.rail.segmentLabel")}</title>
            </line>
          );
        })}

        {/* Nodes */}
        {groups.map((g) => {
          const i = g.indices[0];
          const bi = blockOf[i];
          const active = activeIndex !== null && g.indices.includes(activeIndex);
          const hovered = hoveredBlock === bi && blocks[bi]?.size > 1;
          const scale = active ? 10 / nodeR : hovered ? 1.12 : 1;
          return (
            <g key={`node-${i}`}>
              {active && <circle cx={cx} cy={g.y} r={16} fill={blockTone(bi)} fillOpacity={0.18} />}
              <g className="rail-node" style={{ transform: `scale(${scale})` }}>
                <circle cx={cx} cy={g.y} r={nodeR} fill={active ? blockTone(bi) : "hsl(var(--card))"} stroke={blockTone(bi)} strokeWidth={2 / scale} />
                <circle cx={cx} cy={g.y} r={2 / scale} fill={active ? "hsl(var(--primary-foreground))" : blockTone(bi)} />
              </g>
              {g.indices.length > 1 && (
                <g>
                  <rect x={cx + 6} y={g.y - 17} width={18} height={12} rx={6} fill="hsl(var(--card))" stroke={blockTone(bi)} strokeWidth={1} />
                  <text x={cx + 15} y={g.y - 8.5} textAnchor="middle" fontSize={8} fontWeight={700} fill={blockTone(bi)}>×2</text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* Interactive layer: nodes list + cut markers */}
      <ul role="list" aria-label={t("wordAnalysis.rail.railLabel")} className="absolute inset-0 m-0 list-none p-0">
        {groups.map((g) => {
          const i = g.indices[0];
          const bi = blockOf[i];
          const label = g.indices.length > 1
            ? t("wordAnalysis.rail.ligatureLabel", { index: i + 1, next: i + 2, total: letters.length, block: bi + 1 })
            : t("wordAnalysis.rail.nodeLabel", {
              index: i + 1, total: letters.length, name: name(i),
              status: t(`wordAnalysis.rail.status_${statusOf(i)}`), block: bi + 1,
            });
          return (
            <li key={`hit-${i}`} role="listitem" className="absolute" style={{ top: g.y - 22, left: cx - 22 }}>
              <button
                type="button"
                aria-label={label}
                aria-current={activeIndex !== null && g.indices.includes(activeIndex) ? "true" : undefined}
                className="h-11 w-11 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onClick={() => onSelect(i)}
                onMouseEnter={() => onHoverBlock(bi)}
                onMouseLeave={() => onHoverBlock(null)}
                onFocus={() => onHoverBlock(bi)}
                onBlur={() => onHoverBlock(null)}
              />
            </li>
          );
        })}
      </ul>

      {cuts.map((cut) => {
        const y = layout.cutY[cut.afterIndex];
        if (y === undefined) return null;
        const causeName = t(cut.causeLetter.nameKey);
        const prevSide = cut.reason === "non-joining-letter" && cut.causeIndex !== cut.afterIndex;
        const isWord = cut.reason === "word-edge";
        return (
          <Popover key={`cut-${cut.afterIndex}`}>
            <PopoverTrigger asChild>
              <button
                type="button"
                aria-label={t(isWord ? "wordAnalysis.rail.cutLabelWord" : "wordAnalysis.rail.cutLabel", { letter: name(cut.afterIndex) })}
                className="rail-shake group/cut absolute flex h-11 w-11 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                style={{ top: y - 22, left: cx - 22 }}
              >
                <span className={cn(
                  "flex h-[18px] w-[18px] items-center justify-center rounded-full shadow-sm ring-2 ring-background transition-transform group-hover/cut:scale-110",
                  isWord ? "bg-muted-foreground" : "bg-cut",
                )}>
                  <Scissors aria-hidden="true" className="h-2.5 w-2.5 text-primary-foreground" strokeWidth={2.75} />
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent side="right" align="center" className="w-72 border-cut/30 p-4 text-left">
              <PopoverPrimitive.Arrow className="fill-popover" width={14} height={7} />
              <p className="text-sm font-semibold text-foreground">
                {t(isWord ? "wordAnalysis.rail.popoverTitleWord" : "wordAnalysis.rail.popoverTitle")}
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                {t(isWord ? "wordAnalysis.rail.popoverWhyWord" : prevSide ? "wordAnalysis.rail.popoverWhyPrev" : "wordAnalysis.rail.popoverWhy", { letter: causeName })}
              </p>
              <p className="mt-3 text-xs font-medium text-foreground">{t("wordAnalysis.rail.popoverRule")}</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5" dir="rtl">
                {NEVER_JOIN_NEXT.map((l) => {
                  const hit = !isWord && (cut.causeLetter.base === l || (l === "ا" && ["ٱ", "أ", "إ", "آ"].includes(cut.causeLetter.base)));
                  return (
                    <span
                      key={l}
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-md border font-arabic text-xl leading-none",
                        hit ? "border-cut bg-cut-soft text-cut-foreground ring-2 ring-cut/40" : "border-border bg-secondary/50 text-foreground/80",
                      )}
                    >
                      {l}
                    </span>
                  );
                })}
              </div>
              {onOpenReference && (
                <button type="button" onClick={onOpenReference} className="mt-3 text-xs font-semibold text-primary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">
                  {t("wordAnalysis.rail.learnMore")} →
                </button>
              )}
            </PopoverContent>
          </Popover>
        );
      })}
    </div>
  );
};

export default ConnectionRail;
