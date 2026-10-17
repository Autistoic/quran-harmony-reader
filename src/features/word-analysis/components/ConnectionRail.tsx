import { useCallback, useLayoutEffect, useRef, useState, type CSSProperties, type MutableRefObject } from "react";
import { Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverArrow, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTranslation } from "@/i18n";
import type { WordAnalysisLetter } from "../lib/arabic/wordAnalysisAdapter";
import { joinsBetween, type LetterWordRange, type StrokeBlock, type StrokeCut } from "../lib/utils/strokeBlocks";

interface CardLayout {
  centers: number[];
  cutCenters: number[];
  height: number;
  width: number;
}

/** Measure every card-header center relative to the rail column, including after expansion and font/viewport changes. */
function useCardPositions(
  cardRefs: MutableRefObject<Array<HTMLButtonElement | null>>,
  cardContainerRefs: MutableRefObject<Array<HTMLDivElement | null>>,
  cardCount: number,
  indexOffset: number,
) {
  const railRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<CardLayout>({ centers: [], cutCenters: [], height: 0, width: 0 });

  const measure = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const railBox = rail.getBoundingClientRect();
    const measured = Array.from({ length: cardCount }, (_, index) => {
      const globalIndex = index + indexOffset;
      const card = cardRefs.current[globalIndex];
      const cardContainer = cardContainerRefs.current[globalIndex];
      if (!card || !cardContainer) return { center: Number.NaN, top: Number.NaN, bottom: Number.NaN };
      const headerBox = card.getBoundingClientRect();
      const cardBox = cardContainer.getBoundingClientRect();
      const wrapperBox = cardContainer.parentElement?.getBoundingClientRect() ?? cardBox;
      const nextContainer = cardRefs.current[globalIndex + 1];
      const nextWrapper = nextContainer?.parentElement;
      const nextTop = nextWrapper?.getBoundingClientRect().top ?? cardBox.bottom;
      return {
        center: headerBox.top + headerBox.height / 2 - railBox.top,
        cutCenter: (wrapperBox.bottom + nextTop) / 2 - railBox.top,
      };
    });
    const next = {
      centers: measured.map((position) => position.center),
      cutCenters: measured.map((position) => position.cutCenter),
      height: railBox.height,
      width: railBox.width,
    };
    setLayout((current) => {
      const isSame = (a: number[], b: number[]) => a.length === b.length && a.every((value, index) =>
        Number.isNaN(value) && Number.isNaN(b[index]) || Math.abs(value - b[index]) < 0.5,
      );
      if (isSame(current.centers, next.centers) && isSame(current.cutCenters, next.cutCenters)
        && Math.abs(current.height - next.height) < 0.5 && Math.abs(current.width - next.width) < 0.5) return current;
      return next;
    });
  }, [cardContainerRefs, cardCount, cardRefs, indexOffset]);

  useLayoutEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    let cancelled = false;
    const update = () => {
      if (!cancelled) measure();
    };
    const animationFrame = requestAnimationFrame(update);
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
    observer?.observe(rail);
    for (let index = indexOffset; index < indexOffset + cardCount; index += 1) {
      const card = cardRefs.current[index];
      const cardContainer = cardContainerRefs.current[index];
      if (card) observer?.observe(card);
      if (cardContainer) observer?.observe(cardContainer);
    }
    window.addEventListener("resize", update);
    document.fonts?.ready.then(update).catch(() => undefined);

    return () => {
      cancelled = true;
      cancelAnimationFrame(animationFrame);
      observer?.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [cardCount, cardContainerRefs, cardRefs, indexOffset, measure]);

  return { railRef, ...layout };
}

interface RailBlock extends StrokeBlock {
  key: string;
}

interface VisibleNode {
  index: number;
  endIndex: number;
  letterIndexes: number[];
  y: number;
  blockKey: string;
  blockId: number;
  isLigature: boolean;
}

interface Props {
  letters: readonly WordAnalysisLetter[];
  word: string;
  ranges: readonly LetterWordRange[];
  blocks: readonly RailBlock[];
  cuts: readonly StrokeCut[];
  cardRefs: MutableRefObject<Array<HTMLButtonElement | null>>;
  cardContainerRefs: MutableRefObject<Array<HTMLDivElement | null>>;
  indexOffset: number;
  totalLetters: number;
  selectedIndex: number | null;
  selectedBlockKey: string | null;
  onSelectIndex: (index: number) => void;
  onOpenReference?: () => void;
}

const ALIF_VARIANTS = new Set(["ا", "ٱ", "أ", "إ", "آ"]);
const NON_JOINING_RULE_LETTERS = ["ا", "د", "ذ", "ر", "ز", "و"];
const BLOCK_TONES = ["--stroke-block-1", "--stroke-block-2", "--stroke-block-3"] as const;

function isLamAlifPair(first: WordAnalysisLetter | undefined, second: WordAnalysisLetter | undefined): boolean {
  return first?.base === "ل" && !!second && ALIF_VARIANTS.has(second.base);
}

function getJoinState(letters: readonly WordAnalysisLetter[], index: number, word: string, total: number): string {
  const previous = index > 0 && joinsBetween(index - 1, letters, word);
  const next = index < total - 1 && joinsBetween(index, letters, word);
  if (previous && next) return "both";
  if (previous) return "previous";
  if (next) return "next";
  return "none";
}

function RailCut({
  cut,
  letter,
  onOpenReference,
  t,
}: {
  cut: StrokeCut;
  letter: WordAnalysisLetter;
  onOpenReference?: () => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}) {
  const [open, setOpen] = useState(false);
  const letterName = t(letter.nameKey);
  const causeGlyph = ALIF_VARIANTS.has(letter.base) ? "ا" : letter.base;
  const isKnownCause = NON_JOINING_RULE_LETTERS.includes(causeGlyph);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={t("wordAnalysis.rail.aria.cut", { letter: letterName })}
          aria-expanded={open}
          title={t("wordAnalysis.rail.cutLabel", { letter: letterName })}
          className="connection-cut-trigger inline-flex h-full w-full items-center justify-center rounded-full bg-background/90 text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-foreground/70"
        >
          <span className="inline-flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[hsl(var(--connection-cut))] text-background shadow-sm ring-2 ring-background">
            <Scissors aria-hidden="true" className="h-3 w-3" />
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent side="right" align="center" sideOffset={10} className="relative w-72 rounded-xl border-border bg-popover p-4 shadow-xl">
        <PopoverArrow className="fill-popover stroke-border" />
        <div className="relative space-y-2.5">
          <h3 className="text-sm font-semibold text-foreground">
            {t("wordAnalysis.rail.popover.title", { letter: letterName })}
          </h3>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {cut.reason === "word-edge"
              ? t("wordAnalysis.rail.cutReason.wordEdge")
              : t("wordAnalysis.rail.cutReason.nonJoining", { letter: letterName })}
          </p>
          <div className="rounded-lg bg-secondary/55 px-3 py-2.5">
            <p className="text-[11px] font-medium leading-snug text-foreground">
              {t("wordAnalysis.rail.popover.ruleIntro")}
            </p>
            <div className="mt-1.5 flex items-center gap-2 font-arabic text-lg text-muted-foreground" dir="rtl" aria-label={t("wordAnalysis.rail.popover.ruleLetters")}>
              {NON_JOINING_RULE_LETTERS.map((glyph) => (
                <span key={glyph} className={isKnownCause && glyph === causeGlyph ? "rounded bg-[hsl(var(--connection-cut-tint))] px-1 font-bold text-[hsl(var(--connection-cut-foreground))] ring-1 ring-[hsl(var(--connection-cut))]/30" : "px-0.5"}>
                  {glyph}
                </span>
              ))}
            </div>
          </div>
          {onOpenReference && (
            <Button
              type="button"
              variant="link"
              size="sm"
              onClick={() => {
                setOpen(false);
                onOpenReference();
              }}
              className="h-9 px-0 text-xs font-semibold"
            >
              {t("wordAnalysis.rail.popover.learnMore")}
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

const ConnectionRail = ({ letters, word, ranges, blocks, cuts, cardRefs, cardContainerRefs, indexOffset, totalLetters, selectedIndex, selectedBlockKey, onSelectIndex, onOpenReference }: Props) => {
  const { t } = useTranslation();
  const { railRef, centers, cutCenters, height, width } = useCardPositions(cardRefs, cardContainerRefs, letters.length, indexOffset);
  const rangeForLetter = new Array<LetterWordRange | undefined>(letters.length);
  ranges.forEach((range) => {
    for (let index = range.startIndex; index <= range.endIndex; index += 1) rangeForLetter[index] = range;
  });
  const blockForLetter = new Array<RailBlock | undefined>(letters.length);
  blocks.forEach((block) => {
    for (let index = block.startIndex; index <= block.endIndex; index += 1) blockForLetter[index] = block;
  });

  const visibleNodes: VisibleNode[] = [];
  for (let index = 0; index < letters.length; index += 1) {
    const paired = isLamAlifPair(letters[index], letters[index + 1])
      && joinsBetween(index, letters, word)
      && rangeForLetter[index]?.startIndex === rangeForLetter[index + 1]?.startIndex;
    const letterIndexes = paired ? [index, index + 1] : [index];
    const endIndex = letterIndexes[letterIndexes.length - 1];
    const firstY = centers[index];
    const lastY = centers[endIndex];
    visibleNodes.push({
      index,
      endIndex,
      letterIndexes,
      y: Number.isFinite(firstY) && Number.isFinite(lastY) ? (firstY + lastY) / 2 : Number.NaN,
      blockKey: blockForLetter[index]?.key ?? `block-${index}`,
      blockId: blockForLetter[index]?.id ?? 1,
      isLigature: !!paired,
    });
    if (paired) index += 1;
  }

  const railWidth = width || 28;
  const centerX = railWidth / 2;
  const trackSegments = visibleNodes.slice(0, -1).flatMap((node, position) => {
    const next = visibleNodes[position + 1];
    const range = rangeForLetter[node.endIndex];
    if (!Number.isFinite(node.y) || !Number.isFinite(next.y)) return [];
    const cut = cuts.find((item) => item.afterIndex === node.endIndex);
    const sameWord = range?.startIndex === rangeForLetter[next.index]?.startIndex;
    if (!sameWord && cut?.reason !== "word-edge") return [];
    return [{ node, next, joined: sameWord && joinsBetween(node.endIndex, letters, word), cut, wordEdge: !sameWord, cutY: cutCenters[node.endIndex] }];
  });

  const blockSpans = blocks.filter((block) => block.size >= 2).map((block) => {
    const firstNode = visibleNodes.find((node) => node.letterIndexes.includes(block.startIndex));
    const lastNode = visibleNodes.find((node) => node.letterIndexes.includes(block.endIndex));
    return { block, firstY: firstNode?.y, lastY: lastNode?.y };
  });

  return (
    <div
      ref={railRef}
      role="list"
      aria-label={t("wordAnalysis.rail.aria.list")}
      className="connection-rail relative h-full min-h-full w-6 self-stretch overflow-visible min-[481px]:w-7"
    >
      <svg aria-hidden="true" focusable="false" className="absolute inset-0 h-full w-full overflow-visible" viewBox={`0 0 ${railWidth} ${Math.max(height, 1)}`} preserveAspectRatio="none" fill="none">
        {blockSpans.map(({ block, firstY, lastY }) => {
          if (!Number.isFinite(firstY) || !Number.isFinite(lastY)) return null;
          const top = Math.min(firstY as number, lastY as number) - 11;
          const spanHeight = Math.max(22, Math.abs((lastY as number) - (firstY as number)) + 22);
          return (
            <rect
              key={`block-${block.key}`}
              x={centerX - 11}
              y={top}
              width="22"
              height={spanHeight}
              rx="11"
              fill={`hsl(var(${BLOCK_TONES[(block.id - 1) % BLOCK_TONES.length]}) / 0.15)`}
              stroke={`hsl(var(${BLOCK_TONES[(block.id - 1) % BLOCK_TONES.length]}) / 0.2)`}
              strokeWidth="1"
            />
          );
        })}

        {trackSegments.map(({ node, next, joined, wordEdge, cutY }) => (
          <path
            key={`track-${node.index}`}
            d={wordEdge
              ? `M ${centerX - 7} ${(node.y + next.y) / 2} L ${centerX + 7} ${(node.y + next.y) / 2}`
              : joined
                ? `M ${centerX} ${node.y} L ${centerX} ${next.y}`
                : `M ${centerX} ${node.y} L ${centerX} ${(Number.isFinite(cutY) ? cutY : (node.y + next.y) / 2) - 12} M ${centerX} ${(Number.isFinite(cutY) ? cutY : (node.y + next.y) / 2) + 12} L ${centerX} ${next.y}`}
            stroke={wordEdge ? "hsl(var(--connection-cut))" : "hsl(var(--rail-track))"}
            strokeWidth={wordEdge ? "2.5" : "1.5"}
            strokeLinecap="round"
            strokeDasharray={joined ? undefined : "3 4"}
          />
        ))}
        {trackSegments.filter(({ joined }) => joined).map(({ node, next }, index) => {
          const active = selectedBlockKey === node.blockKey;
          const length = Math.abs(next.y - node.y);
          return (
            <g key={`stroke-${node.index}`} className={active ? "connection-stroke-pulse" : undefined}>
              <path
                d={`M ${centerX} ${node.y} L ${centerX} ${next.y}`}
                pathLength="1"
                stroke={`hsl(var(${BLOCK_TONES[(node.blockId - 1) % BLOCK_TONES.length]}))`}
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray="1"
                className="connection-stroke-draw"
                style={{ "--draw-delay": `${index * 60}ms`, "--stroke-length": `${length}px` } as CSSProperties}
              />
            </g>
          );
        })}

        {trackSegments.filter(({ joined }) => !joined).map(({ node, next, cutY }) => (
          <line
            key={`cut-notch-${node.index}`}
            x1={centerX - 4}
            x2={centerX + 4}
            y1={Number.isFinite(cutY) ? cutY : (node.y + next.y) / 2}
            y2={Number.isFinite(cutY) ? cutY : (node.y + next.y) / 2}
            stroke="hsl(var(--connection-cut))"
            strokeWidth="2"
            strokeLinecap="round"
          />
        ))}

        {visibleNodes.filter((node) => Number.isFinite(node.y)).map((node) => {
          const isActive = node.letterIndexes.includes(selectedIndex ?? -1);
          const isHighlighted = selectedBlockKey === node.blockKey;
          const radius = isActive ? 10 : 7;
          const blockTone = BLOCK_TONES[(node.blockId - 1) % BLOCK_TONES.length];
          return (
            <g key={`node-glyph-${node.index}`} transform={`translate(${centerX} ${node.y})`}>
              <g className={isHighlighted && !isActive ? "connection-rail-node-highlight" : undefined}>
                {isActive && <circle r="16" fill="hsl(var(--primary) / 0.18)" />}
                {node.letterIndexes.length > 1 && <circle r="13" fill={`hsl(var(${blockTone}) / 0.45)`} />}
                <circle
                  r={radius}
                  fill={isActive ? "hsl(var(--primary))" : "hsl(var(--background))"}
                  stroke={isActive ? "hsl(var(--primary))" : `hsl(var(${blockTone}))`}
                  strokeWidth="2"
                  data-active={isActive}
                  className="connection-rail-node-circle"
                />
                <circle r="2" fill={isActive ? "hsl(var(--primary-foreground))" : `hsl(var(${blockTone}))`} />
                {node.isLigature && (
                  <>
                    <rect x="-9" y="-22" width="18" height="11" rx="5.5" fill={`hsl(var(${blockTone}))`} />
                    <text x="0" y="-14" textAnchor="middle" fontSize="7" fontWeight="700" fill="hsl(var(--background))">
                      ×2
                    </text>
                  </>
                )}
              </g>
            </g>
          );
        })}
      </svg>


      {visibleNodes.map((node) => {
        if (!Number.isFinite(node.y)) return null;
        const representative = letters[node.index];
        const joinState = getJoinState(letters, node.index, word, letters.length);
        const nodeLabel = node.isLigature
          ? t("wordAnalysis.rail.aria.ligature", { start: node.index + indexOffset + 1, end: node.endIndex + indexOffset + 1, count: totalLetters, block: node.blockId })
          : t("wordAnalysis.rail.aria.node", {
            index: node.index + indexOffset + 1,
            count: totalLetters,
            letter: t(representative.nameKey),
            joins: t(`wordAnalysis.rail.aria.joining.${joinState}`),
            block: node.blockId,
          });
        return (
          <div key={`node-hit-${node.index}`} role="listitem" aria-label={nodeLabel} className="absolute left-1/2 top-0 z-10 h-11 w-11 -translate-x-1/2 -translate-y-1/2" style={{ top: node.y }}>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={nodeLabel}
              aria-current={node.letterIndexes.includes(selectedIndex ?? -1) ? "true" : undefined}
              onClick={() => onSelectIndex(node.index)}
              className="h-full w-full rounded-full bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
            />
          </div>
        );
      })}


      {trackSegments.filter(({ joined }) => !joined).map(({ node, next, cut, cutY }) => {
        if (!cut) return null;
        const markerLetter = cut.causeLetter;
        const label = t("wordAnalysis.rail.cutLabel", { letter: t(markerLetter.nameKey) });
        return (
          <div key={`cut-${cut.afterIndex}`} role="presentation" className="absolute left-1/2 z-20 h-11 w-11 -translate-x-1/2 -translate-y-1/2" style={{ top: Number.isFinite(cutY) ? cutY : (node.y + next.y) / 2 }}>
            <RailCut
              cut={cut}
              letter={markerLetter}
              onOpenReference={onOpenReference}
              t={t}
            />
            <span title={label} className="connection-cut-label pointer-events-none absolute left-[calc(100%+5px)] top-1/2 max-w-[min(15rem,calc(100vw-7rem))] -translate-y-1/2 truncate rounded-md border border-[hsl(var(--connection-cut))]/30 bg-[hsl(var(--connection-cut-tint))] px-2 py-1 text-[11px] font-semibold leading-none text-[hsl(var(--connection-cut-foreground))] shadow-sm">
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default ConnectionRail;
