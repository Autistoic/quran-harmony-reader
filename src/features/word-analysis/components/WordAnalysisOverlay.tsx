import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { parseArabicWord } from "../lib/arabic/parser";
import { toWordAnalysisLetters } from "../lib/arabic/wordAnalysisAdapter";
import WordAnalysisDialog from "./WordAnalysisDialog";
import AlphabetReferenceDialog from "./AlphabetReferenceDialog";

const WORD_QUERY_KEYS = ["w", "t", "m"] as const;

/** Reads the shareable word-analysis URL state and adapts parser data for the UI. */
export function WordAnalysisOverlay() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [referenceOpen, setReferenceOpen] = useState(false);
  const [hideDetails, setHideDetails] = useState(false);

  const word = searchParams.get("w") ?? "";
  const transliteration = searchParams.get("t")?.trim() ?? "";
  const meaning = searchParams.get("m")?.trim() ?? "";
  const parsedLetters = useMemo(() => parseArabicWord(word), [word]);
  const letters = useMemo(() => toWordAnalysisLetters(parsedLetters), [parsedLetters]);

  useEffect(() => {
    setReferenceOpen(false);
  }, [word]);

  const closeAnalysis = () => {
    setReferenceOpen(false);

    if (location.pathname === "/word") {
      navigate("/", { replace: true });
      return;
    }

    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      WORD_QUERY_KEYS.forEach((key) => next.delete(key));
      return next;
    }, { replace: true });
  };

  const isOpen = word.length > 0;

  return (
    <>
      <WordAnalysisDialog
        open={isOpen && !referenceOpen}
        onOpenChange={(open) => {
          if (!open) closeAnalysis();
        }}
        word={word}
        transliteration={transliteration}
        meaning={meaning}
        letters={letters}
        onOpenReference={() => setReferenceOpen(true)}
        hideDetails={hideDetails}
        setHideDetails={setHideDetails}
      />
      <AlphabetReferenceDialog
        open={isOpen && referenceOpen}
        onOpenChange={(open) => {
          if (!open) setReferenceOpen(false);
        }}
        onBackToWord={() => setReferenceOpen(false)}
      />
    </>
  );
}
