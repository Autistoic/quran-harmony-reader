import { useState, useEffect } from 'react';
import { WirdVerse } from '@/data/wirdSharif';
import { cn } from '@/lib/utils';
import { Play, Pause, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface WirdVerseLineProps {
  isPlaying: boolean;
  verse: WirdVerse;
  verseIndex: number;
  currentWord: { verseIndex: number; wordIndex: number } | null;
  onPlayVerse?: (verseIndex: number) => void;
  onPause?: () => void;
  onPlayWord?: (verseIndex: number, wordIndex: number) => void;
  onPrepareForPractice?: (word: string) => void;
  // Edit-mode props
  editMode?: boolean;
  getCurrentTime?: () => number;
  onUpdateTiming?: (verseIndex: number, wordIndex: number, timing: { start: number; end: number }) => void;
  onPlayFromTime?: (time: number) => void;
  onPauseAudio?: () => void;
}

export const WirdVerseLine = ({
  isPlaying,
  verse,
  verseIndex,
  currentWord,
  onPlayVerse,
  onPause,
  onPlayWord,
  onPrepareForPractice,
  editMode = false,
  getCurrentTime,
  onUpdateTiming,
  onPlayFromTime,
  onPauseAudio,
}: WirdVerseLineProps) => {
  const isThisVersePlaying = isPlaying && currentWord?.verseIndex === verseIndex;
  const [activeWordIndex, setActiveWordIndex] = useState<number | null>(null);

  const handleWordClick = (wordIndex: number) => {
    if (editMode) return; // clicks handled by popover trigger
    onPlayWord?.(verseIndex, wordIndex);
    setActiveWordIndex(prev => (prev === wordIndex ? null : wordIndex));
  };

  const handleAddWord = (word: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onPrepareForPractice?.(word);
    setActiveWordIndex(null);
  };

  return (
    <div className="py-6 border-b border-border/50 last:border-b-0 group">
      {/* Header: play button + repetition badge */}
      <div className="flex justify-center items-center gap-3 mb-4">
        {onPlayVerse && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (isThisVersePlaying) {
                onPause?.();
              } else {
                onPlayVerse(verseIndex);
              }
            }}
            className="h-8 w-8 rounded-full opacity-50 group-hover:opacity-100 transition-opacity text-primary hover:bg-primary/10"
          >
            {isThisVersePlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6 ml-1" />
            )}
          </Button>
        )}
        {verse.repetitions && (
          <span className="inline-flex items-center justify-center px-3 h-7 rounded-full bg-accent/20 text-accent-foreground text-sm font-semibold">
            ×{verse.repetitions}
          </span>
        )}
      </div>

      {/* Transliteration text with word-level highlighting */}
      <p className="text-center font-transliteration text-2xl md:text-3xl leading-loose mb-2 text-foreground">
        {verse.wordTimings.map((wordTiming, wordIndex) => {
          const isHighlighted =
            currentWord?.verseIndex === verseIndex &&
            currentWord?.wordIndex === wordIndex;
          const showAddButton = !editMode && activeWordIndex === wordIndex && onPrepareForPractice;

          const wordSpan = (
            <span
              onClick={() => handleWordClick(wordIndex)}
              className={cn(
                'inline-block mx-1 px-1 rounded transition-all duration-200 cursor-pointer hover:bg-accent/30',
                isHighlighted && 'bg-accent text-accent-foreground font-bold scale-110 shadow-lg',
                editMode && 'ring-1 ring-border/60'
              )}
            >
              {wordTiming.word}
            </span>
          );

          return (
            <span key={wordIndex} className="relative inline-flex flex-col items-center align-middle">
              {editMode ? (
                <Popover>
                  <PopoverTrigger asChild>{wordSpan}</PopoverTrigger>
                  <PopoverContent className="w-72" align="center">
                    <TimingEditor
                      word={wordTiming.word}
                      initialStart={wordTiming.start}
                      initialEnd={wordTiming.end}
                      getCurrentTime={getCurrentTime}
                      isPlaying={isPlaying}
                      onPlayFromTime={onPlayFromTime}
                      onPauseAudio={onPauseAudio}
                      onSave={(start, end) => onUpdateTiming?.(verseIndex, wordIndex, { start, end })}
                    />
                  </PopoverContent>
                </Popover>
              ) : (
                wordSpan
              )}

              {editMode && (
                <span className="font-mono text-[10px] leading-none text-muted-foreground mt-0.5">
                  {wordTiming.start.toFixed(2)}→{wordTiming.end.toFixed(2)}
                </span>
              )}

              {showAddButton && (
                <button
                  onClick={(e) => handleAddWord(wordTiming.word, e)}
                  className="absolute -top-7 left-1/2 -translate-x-1/2 z-10 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:scale-110 transition-transform animate-in fade-in zoom-in-50 duration-150"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              )}
            </span>
          );
        })}
      </p>

      {/* Note */}
      {verse.note && (
        <p className="text-center text-sm text-muted-foreground italic mt-2">
          ({verse.note})
        </p>
      )}
    </div>
  );
};

interface TimingEditorProps {
  word: string;
  initialStart: number;
  initialEnd: number;
  getCurrentTime?: () => number;
  isPlaying?: boolean;
  onPlayFromTime?: (time: number) => void;
  onPauseAudio?: () => void;
  onSave: (start: number, end: number) => void;
}

const TimingEditor = ({ word, initialStart, initialEnd, getCurrentTime, isPlaying, onPlayFromTime, onPauseAudio, onSave }: TimingEditorProps) => {
  const [start, setStart] = useState(initialStart.toString());
  const [end, setEnd] = useState(initialEnd.toString());
  // Track whether *this* editor triggered playback so we don't show pause for other audio
  const [isOwningPlayback, setIsOwningPlayback] = useState(false);
  const stopAtRef = useRef<number | null>(null);

  useEffect(() => {
    setStart(initialStart.toString());
    setEnd(initialEnd.toString());
  }, [initialStart, initialEnd]);

  // If audio stops externally, release ownership
  useEffect(() => {
    if (!isPlaying) {
      setIsOwningPlayback(false);
      stopAtRef.current = null;
    }
  }, [isPlaying]);

  // Auto-pause when reaching `end`
  useEffect(() => {
    if (!isOwningPlayback || stopAtRef.current === null) return;
    let raf: number;
    const tick = () => {
      const t = getCurrentTime?.();
      if (t !== undefined && stopAtRef.current !== null && t >= stopAtRef.current) {
        onPauseAudio?.();
        setIsOwningPlayback(false);
        stopAtRef.current = null;
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isOwningPlayback, getCurrentTime, onPauseAudio]);

  const applyCurrentTo = (field: 'start' | 'end') => {
    const t = getCurrentTime?.();
    if (t === undefined) return;
    const v = (Math.round(t * 100) / 100).toString();
    if (field === 'start') setStart(v);
    else setEnd(v);
  };

  const handleSave = () => {
    const s = parseFloat(start);
    const e = parseFloat(end);
    if (isNaN(s) || isNaN(e)) return;
    onSave(s, e);
  };

  const handlePlayPause = () => {
    if (isOwningPlayback && isPlaying) {
      onPauseAudio?.();
      setIsOwningPlayback(false);
      stopAtRef.current = null;
      return;
    }
    const s = parseFloat(start);
    const e = parseFloat(end);
    if (isNaN(s)) return;
    stopAtRef.current = !isNaN(e) && e > s ? e : null;
    setIsOwningPlayback(true);
    onPlayFromTime?.(s);
  };

  const showPause = isOwningPlayback && isPlaying;

  return (
    <div className="space-y-3">
      <div className="text-sm font-semibold text-center break-all">{word}</div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs w-10 text-muted-foreground">start</span>
          <Input
            type="number"
            step="0.1"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="h-8 text-sm"
          />
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-8 text-xs px-2 whitespace-nowrap"
            onClick={() => applyCurrentTo('start')}
          >
            ahora
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs w-10 text-muted-foreground">end</span>
          <Input
            type="number"
            step="0.1"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="h-8 text-sm"
          />
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-8 text-xs px-2 whitespace-nowrap"
            onClick={() => applyCurrentTo('end')}
          >
            ahora
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 pt-1">
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={handlePlayPause}
          className="gap-1 text-xs"
        >
          {showPause ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
          {showPause ? 'Pausar' : 'Reproducir'}
        </Button>
        <Button type="button" size="sm" onClick={handleSave} className="text-xs">
          Guardar
        </Button>
      </div>
    </div>
  );
};

