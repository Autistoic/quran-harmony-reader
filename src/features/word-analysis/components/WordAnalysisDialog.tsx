import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ArrowLeft, ArrowRight } from "lucide-react";
import LetterDetailCard from "./LetterDetailCard";
import ConnectionRail from "./ConnectionRail";
import type { WordAnalysisLetter } from "../lib/arabic/wordAnalysisAdapter";
import { getLetterConnection } from "../lib/arabic/joining";
import { buildCuts, buildStrokeBlocks, buildWordRanges } from "../lib/utils/strokeBlocks";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/i18n";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    word: string;
    transliteration: string;
    meaning: string;
    letters: WordAnalysisLetter[];
    onOpenReference?: () => void;
    selectedIndex?: number | null;
    onSelectedIndexChange?: (i: number | null) => void;
    hideDetails: boolean;
    setHideDetails: (hideDetails: boolean) => void;
}

const ARABIC_HIGHLIGHT_VERTICAL_BLEED = 48;

interface HighlightRect {
    left: number;
    top: number;
    width: number;
    height: number;
    containerWidth: number;
    containerHeight: number;
}


const WordAnalysisDialog = ({ open, onOpenChange, word, transliteration, meaning, letters, onOpenReference, selectedIndex: controlledSelected, onSelectedIndexChange, hideDetails, setHideDetails }: Props) => {
    const { t } = useTranslation();
    const [internalSelected, setInternalSelected] = useState<number | null>(null);
    const isControlled = controlledSelected !== undefined;
    const selectedIndex = isControlled ? controlledSelected : internalSelected;
    const setSelectedIndex = useCallback((i: number | null) => {
        if (!isControlled) setInternalSelected(i);
        onSelectedIndexChange?.(i);
    }, [isControlled, onSelectedIndexChange]);
    const [rect, setRect] = useState<HighlightRect | null>(null);
    const [transliterationRect, setTransliterationRect] = useState<HighlightRect | null>(null);
    const [focusedCardIndex, setFocusedCardIndex] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);
    const transliterationContainerRef = useRef<HTMLSpanElement>(null);
    const transliterationRef = useRef<HTMLSpanElement>(null);
    const letterListRef = useRef<HTMLDivElement>(null);
    const letterCardRefs = useRef<Array<HTMLButtonElement | null>>([]);
    const letterCardContainerRefs = useRef<Array<HTMLDivElement | null>>([]);
    const focusFlashTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const wordGroups = useMemo(() => buildWordRanges(letters, word).map((range, groupIndex) => {
        const groupLetters = letters.slice(range.startIndex, range.endIndex + 1);
        const blocks = buildStrokeBlocks(groupLetters).map((block) => ({
            ...block,
            key: `word-${range.startIndex}-block-${block.id}`,
        }));
        return {
            ...range,
            index: groupIndex,
            letters: groupLetters,
            blocks,
            cuts: buildCuts(groupLetters, word),
        };
    }), [letters, word]);
    const blockKeyByLetter = useMemo(() => {
        const keys: Array<string | undefined> = new Array(letters.length);
        wordGroups.forEach((group) => group.blocks.forEach((block) => {
            for (let index = block.startIndex; index <= block.endIndex; index += 1) {
                keys[group.startIndex + index] = block.key;
            }
        }));
        return keys;
    }, [letters.length, wordGroups]);
    const selectedBlockKey = selectedIndex === null ? null : blockKeyByLetter[selectedIndex] ?? null;
    const canGoPrevious = selectedIndex !== null && selectedIndex > 0;
    const canGoNext = letters.length > 0 && (selectedIndex === null || selectedIndex < letters.length - 1);
    const focusLetterCard = (index: number) => {
        const card = letterCardRefs.current[index];
        const list = letterListRef.current;
        if (!card) return;

        if (list) {
            const listRect = list.getBoundingClientRect();
            const cardRect = card.getBoundingClientRect();
            const cardTop = list.scrollTop + cardRect.top - listRect.top;
            const centeredTop = cardTop - (list.clientHeight - cardRect.height) / 2;

            list.scrollTo({ top: centeredTop, behavior: "smooth" });
        }
        card.focus({ preventScroll: true });
        setFocusedCardIndex(index);
        if (focusFlashTimeout.current) clearTimeout(focusFlashTimeout.current);
        focusFlashTimeout.current = setTimeout(() => setFocusedCardIndex(null), 900);
    };
    const selectLetter = (index: number) => {
        setSelectedIndex(index);
        focusLetterCard(index);
    };
    const goPrevious = () => {
        if (selectedIndex !== null && canGoPrevious) selectLetter(selectedIndex - 1);
    };
    const goNext = () => {
        if (canGoNext) selectLetter(selectedIndex === null ? 0 : selectedIndex + 1);
    };
    const handleHeaderKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
        if (event.key === "ArrowLeft") {
            if (!canGoNext) return;
            event.preventDefault();
            goNext();
        } else if (event.key === "ArrowRight") {
            if (!canGoPrevious) return;
            event.preventDefault();
            goPrevious();
        }
    };

    // Reset selection when dialog closes or word changes (uncontrolled mode only)
    useEffect(() => {
        if (!open && !isControlled) setInternalSelected(null);
    }, [open, isControlled]);

    useEffect(() => {
        if (!isControlled) setInternalSelected(null);
    }, [word, isControlled]);

    useEffect(() => () => {
        if (focusFlashTimeout.current) clearTimeout(focusFlashTimeout.current);
    }, []);

    useLayoutEffect(() => {
        const compute = () => {
            if (selectedIndex === null) {
                setRect(null);
                return;
            }
            const container = containerRef.current;
            const span = textRef.current;
            if (!container || !span) return;
            const textNode = span.firstChild;
            if (!(textNode instanceof Text)) return;
            const letter = letters[selectedIndex];
            if (!letter) return;

            const len = textNode.data.length;
            const start = Math.min(letter.startOffset, len);
            const end = Math.min(letter.endOffset, len);
            if (start >= end) {
                setRect(null);
                return;
            }

            // 1. Measure the base letter independently to determine its visual body anchor
            const baseLen = Math.min(letter.base.length || 1, end - start);
            let baseLeft = Infinity;
            let baseRight = -Infinity;
            try {
                const baseRange = document.createRange();
                baseRange.setStart(textNode, start);
                baseRange.setEnd(textNode, Math.min(start + baseLen, len));
                for (const r of Array.from(baseRange.getClientRects())) {
                    if (r.width > 0 || r.height > 0) {
                        baseLeft = Math.min(baseLeft, r.left);
                        baseRight = Math.max(baseRight, r.right);
                    }
                }
            } catch {
                // Ignore baseRange measurement errors if any
            }

            // 2. Measure the full cluster including attached diacritics (harakat, shaddah, dagger alif)
            const fullRange = document.createRange();
            try {
                fullRange.setStart(textNode, start);
                fullRange.setEnd(textNode, end);
            } catch {
                setRect(null);
                return;
            }

            const rects = fullRange.getClientRects();
            const unionBounding = fullRange.getBoundingClientRect();
            const allRects = Array.from(rects);
            if (unionBounding.width > 0 && unionBounding.height > 0) {
                allRects.push(unionBounding);
            }

            if (allRects.length === 0 && (baseLeft === Infinity || baseRight === -Infinity)) {
                setRect(null);
                return;
            }

            let left = Infinity;
            let right = -Infinity;
            let top = Infinity;
            let bottom = -Infinity;

            for (const r of allRects) {
                if (r.width === 0 && r.height === 0) continue;
                left = Math.min(left, r.left);
                right = Math.max(right, r.right);
                top = Math.min(top, r.top);
                bottom = Math.max(bottom, r.bottom);
            }

            if (left === Infinity || right === -Infinity) {
                if (baseLeft !== Infinity && baseRight !== -Infinity) {
                    left = baseLeft;
                    right = baseRight;
                } else {
                    setRect(null);
                    return;
                }
            }

            // 3. Compensate for skew from attached elongation/diacritics (e.g. Dagger Alif or exit ligation)
            // In Arabic RTL, exit strokes and superscripts extend to the left (towards the next letter).
            // For closed-loop glyphs like Mim (م), if marks pull the cluster's center to the left,
            // we expand the right edge to fully embrace the head/loop of the character.
            if (baseLeft !== Infinity && baseRight !== -Infinity && baseRight > baseLeft) {
                const baseCenter = (baseLeft + baseRight) / 2;
                const fullCenter = (left + right) / 2;
                const leftwardSkew = baseCenter - fullCenter;
                if (leftwardSkew > 0) {
                    right = Math.max(right, right + leftwardSkew);
                }
            }

            const containerBox = container.getBoundingClientRect();
            // 4. Bounding box buffer: +3.5px horizontal padding, +5px vertical padding
            const padX = 3.5;
            const padY = 5;

            const localTop = Math.max(0, top - containerBox.top - padY);
            const localBottom = Math.min(containerBox.height, bottom - containerBox.top + padY);
            if (localBottom <= localTop) {
                setRect(null);
                return;
            }

            setRect({
                left: left - containerBox.left - padX,
                top: localTop,
                width: right - left + padX * 2,
                height: localBottom - localTop,
                containerWidth: containerBox.width,
                containerHeight: containerBox.height,
            });
        };

        // Recompute after layout, after fonts load, and on resize.
        const raf = requestAnimationFrame(compute);
        const onResize = () => compute();
        window.addEventListener("resize", onResize);
        document.fonts?.ready.then(compute).catch(() => undefined);
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", onResize);
        };
    }, [selectedIndex, word, letters, open]);

    useLayoutEffect(() => {
        const compute = () => {
            if (selectedIndex === null || hideDetails) {
                setTransliterationRect(null);
                return;
            }
            const container = transliterationContainerRef.current;
            const span = transliterationRef.current;
            const letter = letters[selectedIndex];
            const textNode = span?.firstChild;
            if (!container || !span || !letter || !(textNode instanceof Text)) {
                setTransliterationRect(null);
                return;
            }

            if (letter.transliterationStartOffset === undefined || letter.transliterationEndOffset === undefined) {
                setTransliterationRect(null);
                return;
            }
            const start = Math.max(0, Math.min(letter.transliterationStartOffset, textNode.data.length));
            const end = Math.max(start, Math.min(letter.transliterationEndOffset, textNode.data.length));
            if (start >= end) {
                setTransliterationRect(null);
                return;
            }

            const range = document.createRange();
            try {
                range.setStart(textNode, start);
                range.setEnd(textNode, end);
            } catch {
                setTransliterationRect(null);
                return;
            }

            const rangeRect = range.getBoundingClientRect();
            if (rangeRect.width <= 0 || rangeRect.height <= 0) {
                setTransliterationRect(null);
                return;
            }
            const containerRect = container.getBoundingClientRect();
            const padX = 2;
            const padY = 2;
            setTransliterationRect({
                left: rangeRect.left - containerRect.left - padX,
                top: rangeRect.top - containerRect.top - padY,
                width: rangeRect.width + padX * 2,
                height: rangeRect.height + padY * 2,
                containerWidth: containerRect.width,
                containerHeight: containerRect.height,
            });
        };

        const raf = requestAnimationFrame(compute);
        window.addEventListener("resize", compute);
        document.fonts?.ready.then(compute).catch(() => undefined);
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", compute);
        };
    }, [selectedIndex, transliteration, letters, open, hideDetails]);


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] p-0 bg-background border-border flex flex-col overflow-hidden">
                <DialogTitle className="sr-only">{transliteration} — {word}</DialogTitle>

                {/* Sticky header */}
                <div
                    className="sticky top-0 z-20 isolate relative bg-background/95 backdrop-blur border-b border-border shadow-sm px-0 pt-4 sm:pt-6 pb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                    role="group"
                    aria-label={t("wordAnalysis.letterNavigation")}
                    tabIndex={0}
                    onKeyDown={handleHeaderKeyDown}
                >

                    <div className="relative z-10 flex min-w-0 flex-col items-center gap-5 px-12 text-center sm:gap-6 sm:px-20">
                        {!hideDetails && (
                            <DialogDescription className="text-base uppercase tracking-widest text-muted-foreground">
                                <span ref={transliterationContainerRef} className="relative inline-block">
                                    <span ref={transliterationRef} className={cn("relative z-[1] transition-colors duration-200", selectedIndex !== null && transliterationRect ? "text-muted-foreground/50" : undefined)}>
                                        {transliteration}
                                    </span>
                                    {transliterationRect && selectedIndex !== null && (
                                        <span
                                            aria-hidden
                                            className="pointer-events-none absolute rounded-sm bg-primary/15 ring-1 ring-primary/40 transition-all duration-200"
                                            style={{
                                                left: transliterationRect.left,
                                                top: transliterationRect.top,
                                                width: transliterationRect.width,
                                                height: transliterationRect.height,
                                                zIndex: 0,
                                            }}
                                        />
                                    )}
                                </span>
                            </DialogDescription>
                        )}
                        <div
                            ref={containerRef}
                            className="relative mt-8 font-analysis-arabic text-7xl sm:text-8xl md:text-9xl leading-[4.6] select-none"
                            style={{ direction: "rtl" }}
                        >
                            {/* Precision highlight remains tied to the active logical letter. */}
                            {rect && (
                                <span
                                    aria-hidden
                                    className="pointer-events-none absolute rounded-md bg-primary/15 ring-1 ring-primary/40 transition-all duration-200"
                                    style={{
                                        left: rect.left,
                                        top: -ARABIC_HIGHLIGHT_VERTICAL_BLEED,
                                        width: rect.width,
                                        height: rect.containerHeight + ARABIC_HIGHLIGHT_VERTICAL_BLEED * 2,
                                        zIndex: 0,
                                    }}
                                />
                            )}

                            {/* Preserve the full word's contextual Arabic shaping. */}
                            <span
                                ref={textRef}
                                className={cn(
                                    "relative z-[1] transition-colors duration-200",
                                    selectedIndex !== null ? "text-muted-foreground/35" : "text-primary"
                                )}
                            >
                                {word}
                            </span>


                            {/* Reveal only the active letter while preserving the shaped word layer. */}
                            {rect && (
                                <span
                                    aria-hidden
                                    className="pointer-events-none absolute inset-0 z-[2] font-analysis-arabic text-primary transition-all duration-200"
                                    style={{
                                        clipPath: `inset(-1.5em ${Math.max(0, rect.containerWidth - (rect.left + rect.width))}px -1.5em ${Math.max(0, rect.left)}px)`,
                                    }}
                                >
                                    {word}
                                </span>
                            )}
                        </div>
                        {!hideDetails && (
                            <p className="mt-10 text-sm italic text-muted-foreground">"{meaning}"</p>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={goNext}
                        disabled={!canGoNext}
                        aria-disabled={!canGoNext}
                        aria-label={t("wordAnalysis.nextLetter")}
                        title={t("wordAnalysis.nextLetter")}
                        className="absolute inset-y-0 left-0 z-20 flex w-12 flex-col items-center justify-center gap-2 border-r border-border/60 bg-background/30 text-foreground/75 transition-colors hover:bg-secondary/55 hover:text-foreground active:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40 sm:w-20"
                    >
                        <ArrowLeft aria-hidden="true" className="h-5 w-5" />
                        <span className="hidden px-1 text-center text-xs font-medium sm:inline">{t("wordAnalysis.nextLetter")}</span>
                    </button>
                    <button
                        type="button"
                        onClick={goPrevious}
                        disabled={!canGoPrevious}
                        aria-disabled={!canGoPrevious}
                        aria-label={t("wordAnalysis.previousLetter")}
                        title={t("wordAnalysis.previousLetter")}
                        className="absolute inset-y-0 right-0 z-20 flex w-12 flex-col items-center justify-center gap-2 border-l border-border/60 bg-background/30 text-foreground/75 transition-colors hover:bg-secondary/55 hover:text-foreground active:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40 sm:w-20"
                    >
                        <ArrowRight aria-hidden="true" className="h-5 w-5" />
                        <span className="hidden px-1 text-center text-xs font-medium sm:inline">{t("wordAnalysis.previousLetter")}</span>
                    </button>
                </div>

                {/* Scrollable body */}
                <div ref={letterListRef} className="min-h-0 flex-1 overflow-y-auto px-6 py-4" onKeyDown={handleHeaderKeyDown}>
                    <div className="flex flex-col gap-3">
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground px-1" dir="rtl">
                            {t("common.readingOrder")}
                        </span>
                        <div dir="rtl" className="flex flex-col gap-4">
                            {wordGroups.map((group, groupIndex) => (
                                <section key={`word-${group.startIndex}`} aria-label={t("wordAnalysis.rail.aria.word", { index: groupIndex + 1 })}>
                                    {groupIndex > 0 && (
                                        <div role="separator" aria-label={t("wordAnalysis.rail.aria.wordEdge")} className="mb-4 flex items-center gap-3 px-1">
                                            <span className="h-px flex-1 bg-[hsl(var(--connection-cut))]/50" />
                                            <span className="rounded-full border border-[hsl(var(--connection-cut))]/30 bg-[hsl(var(--connection-cut-tint))] px-2.5 py-1 text-[10px] font-semibold text-[hsl(var(--connection-cut-foreground))]">
                                                {t("wordAnalysis.rail.wordSeparator")}
                                            </span>
                                            <span className="h-px flex-1 bg-[hsl(var(--connection-cut))]/50" />
                                        </div>
                                    )}
                                    <div dir="ltr" className="grid grid-cols-[24px_minmax(0,1fr)] items-stretch gap-x-3 min-[481px]:grid-cols-[28px_minmax(0,1fr)]">
                                        <ConnectionRail
                                            letters={group.letters}
                                            word={word}
                                            ranges={[{ startIndex: 0, endIndex: group.letters.length - 1 }]}
                                            blocks={group.blocks}
                                            cuts={group.cuts.filter((cut) => cut.reason !== "word-edge")}
                                            cardRefs={letterCardRefs}
                                            cardContainerRefs={letterCardContainerRefs}
                                            indexOffset={group.startIndex}
                                            totalLetters={letters.length}
                                            selectedIndex={selectedIndex !== null && selectedIndex >= group.startIndex && selectedIndex <= group.endIndex ? selectedIndex - group.startIndex : null}
                                            selectedBlockKey={selectedBlockKey}
                                            onSelectIndex={(index) => selectLetter(group.startIndex + index)}
                                            onOpenReference={onOpenReference}
                                        />
                                        <div className="flex min-w-0 flex-col gap-3">
                                            {group.letters.map((letter, localIndex) => {
                                                const index = group.startIndex + localIndex;
                                                const block = group.blocks.find((item) => item.startIndex <= localIndex && item.endIndex >= localIndex);
                                                const isBlockStart = block?.startIndex === localIndex;
                                                const hasCutAfter = group.cuts.some((cut) => cut.afterIndex === localIndex && cut.reason === "non-joining-letter");
                                                return (
                                                    <div key={index} className={hasCutAfter && localIndex < group.letters.length - 1 ? "mb-[22px]" : undefined}>
                                                        {isBlockStart && block.size >= 2 && (
                                                            <div className="mb-1 flex min-h-5 items-center justify-end pr-2">
                                                                <span
                                                                    data-active={selectedBlockKey === block.key}
                                                                    className="connection-block-label max-w-full truncate rounded-md border bg-background/95 px-2 py-0.5 text-[11px] font-semibold shadow-sm"
                                                                    style={{
                                                                        color: `hsl(var(${["--stroke-block-1", "--stroke-block-2", "--stroke-block-3"][(block.id - 1) % 3]}))`,
                                                                        borderColor: `hsl(var(${["--stroke-block-1", "--stroke-block-2", "--stroke-block-3"][(block.id - 1) % 3]}) / 0.35)`,
                                                                    }}
                                                                >
                                                                    {t("wordAnalysis.rail.block.many", { block: block.id, count: block.size })}
                                                                </span>
                                                            </div>
                                                        )}
                                                        <LetterDetailCard
                                                            cardRef={(node) => { letterCardRefs.current[index] = node; }}
                                                            cardContainerRef={(node) => { letterCardContainerRefs.current[index] = node; }}
                                                            letter={letter}
                                                            connection={getLetterConnection(group.letters, localIndex)}
                                                            index={index}
                                                            selected={selectedIndex === index}
                                                            navigationFocused={focusedCardIndex === index}
                                                            isException={getLetterConnection(group.letters, localIndex).previousBreaksConnection}
                                                            onSelect={() => setSelectedIndex(selectedIndex === index ? null : index)}
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </section>
                            ))}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default WordAnalysisDialog;
