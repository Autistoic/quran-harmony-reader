import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { BookOpen, Eye, EyeOff } from "lucide-react";
import LetterDetailCard from "./LetterDetailCard";
import type { WordAnalysisLetter } from "../lib/arabic/wordAnalysisAdapter";

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

            const range = document.createRange();
            try {
                const len = textNode.data.length;
                const start = Math.min(letter.startOffset, len);
                const end = Math.min(letter.endOffset, len);
                range.setStart(textNode, start);
                range.setEnd(textNode, end);
            } catch {
                setRect(null);
                return;
            }
            const rects = range.getClientRects();
            if (rects.length === 0) {
                setRect(null);
                return;
            }
            const containerBox = container.getBoundingClientRect();
            let left = Infinity;
            let right = -Infinity;
            let top = Infinity;
            let bottom = -Infinity;
            for (const r of Array.from(rects)) {
                left = Math.min(left, r.left);
                right = Math.max(right, r.right);
                top = Math.min(top, r.top);
                bottom = Math.max(bottom, r.bottom);
            }
            const padX = 4;
            const padY = 2;
            setRect({
                left: left - containerBox.left - padX,
                top: top - containerBox.top - padY,
                width: right - left + padX * 2,
                height: bottom - top + padY * 2,
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
                            className="relative font-arabic text-6xl sm:text-7xl text-primary leading-relaxed"
                            style={{ direction: "rtl" }}
                        >
                            {rect && (
                                <span
                                    aria-hidden
                                    className="pointer-events-none absolute rounded-md bg-primary/20 transition-all duration-200"
                                    style={{
                                        left: rect.left,
                                        top: rect.top,
                                        width: rect.width,
                                        height: rect.height,
                                        zIndex: 0,
                                    }}
                                />
                            )}
                            <span ref={textRef} className="relative z-[1]">
                                {word}
                            </span>
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
