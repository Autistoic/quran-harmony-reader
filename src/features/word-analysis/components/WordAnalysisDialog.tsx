import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { BookOpen, Eye, EyeOff } from "lucide-react";
import LetterDetailCard from "./LetterDetailCard";
import type { WordAnalysisLetter } from "../lib/arabic/wordAnalysisAdapter";
import { cn } from "@/lib/utils";

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

interface HighlightRect {
    left: number;
    top: number;
    width: number;
    height: number;
    containerWidth: number;
    containerHeight: number;
}

const WordAnalysisDialog = ({ open, onOpenChange, word, transliteration, meaning, letters, onOpenReference, selectedIndex: controlledSelected, onSelectedIndexChange, hideDetails, setHideDetails }: Props) => {
    const [internalSelected, setInternalSelected] = useState<number | null>(null);
    const isControlled = controlledSelected !== undefined;
    const selectedIndex = isControlled ? controlledSelected : internalSelected;
    const setSelectedIndex = (i: number | null) => {
        if (!isControlled) setInternalSelected(i);
        onSelectedIndexChange?.(i);
    };
    const [rect, setRect] = useState<HighlightRect | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);
    const toggleHideDetails = () => {
        setHideDetails(!hideDetails);
    };

    // Reset selection when dialog closes or word changes (uncontrolled mode only)
    useEffect(() => {
        if (!open && !isControlled) setInternalSelected(null);
    }, [open, isControlled]);

    useEffect(() => {
        if (!isControlled) setInternalSelected(null);
    }, [word, isControlled]);

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

            setRect({
                left: left - containerBox.left - padX,
                top: top - containerBox.top - padY,
                width: right - left + padX * 2,
                height: bottom - top + padY * 2,
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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] p-0 bg-background border-border flex flex-col overflow-hidden">
                <DialogTitle className="sr-only">{transliteration} — {word}</DialogTitle>

                {/* Sticky header */}
                <div className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-border px-6 pt-6 pb-4">
                    <div className="flex items-center gap-2">
                        {onOpenReference && (
                            <button
                                type="button"
                                onClick={onOpenReference}
                                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary/40 px-2.5 py-1 text-xs text-foreground/80 hover:bg-secondary hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                                aria-label="Open letter reference"
                            >
                                <BookOpen className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">Reference</span>
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={toggleHideDetails}
                            className="inline-flex items-center justify-center rounded-md border border-border px-2 py-1"
                        >
                            {hideDetails ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    </div>

                    <div className="flex flex-col items-center gap-2 pr-8">
                        {!hideDetails && (
                            <DialogDescription className="text-xs uppercase tracking-widest text-muted-foreground">
                                {transliteration}
                            </DialogDescription>
                        )}
                        <div
                            ref={containerRef}
                            className="relative font-arabic text-7xl sm:text-8xl md:text-9xl leading-relaxed select-none"
                            style={{ direction: "rtl" }}
                        >
                            {/* Precision highlight background pill */}
                            {rect && (
                                <span
                                    aria-hidden
                                    className="pointer-events-none absolute rounded-md bg-primary/15 ring-1 ring-primary/40 transition-all duration-200"
                                    style={{
                                        left: rect.left,
                                        top: rect.top,
                                        width: rect.width,
                                        height: rect.height,
                                        zIndex: 0,
                                    }}
                                />
                            )}

                            {/* Base text layer: full word preserved for unbroken shaping, dimmed when letter active */}
                            <span
                                ref={textRef}
                                className={cn(
                                    "relative z-[1] transition-colors duration-200",
                                    selectedIndex !== null ? "text-muted-foreground/35" : "text-primary"
                                )}
                            >
                                {word}
                            </span>

                            {/* Active text layer: intact word clipped to active letter bounds */}
                            {rect && (
                                <span
                                    aria-hidden
                                    className="pointer-events-none absolute inset-0 z-[2] font-arabic text-primary transition-all duration-200"
                                    style={{
                                        clipPath: `inset(${Math.max(0, rect.top)}px ${Math.max(0, rect.containerWidth - (rect.left + rect.width))}px ${Math.max(0, rect.containerHeight - (rect.top + rect.height))}px ${Math.max(0, rect.left)}px round 6px)`,
                                    }}
                                >
                                    {word}
                                </span>
                            )}
                        </div>
                        {!hideDetails && (
                            <p className="text-sm italic text-muted-foreground">"{meaning}"</p>
                        )}
                    </div>
                </div>

                {/* Scrollable body */}
                <div className="overflow-y-auto px-6 py-4">
                    <div className="flex flex-col gap-2">
                        {/* <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Letters (reading order, right → left) — tap a card to highlight
            </span> */}
                        <div className="grid gap-3 sm:grid-cols-2">
                            {letters.map((letter, i) => (
                                <LetterDetailCard
                                    key={i}
                                    letter={letter}
                                    index={i}
                                    selected={selectedIndex === i}
                                    onSelect={() => setSelectedIndex(selectedIndex === i ? null : i)}
                                    hideDetails={hideDetails}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default WordAnalysisDialog;
