import { useEffect, useRef, useState } from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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

export const TimingEditor = ({
  word,
  initialStart,
  initialEnd,
  getCurrentTime,
  isPlaying,
  onPlayFromTime,
  onPauseAudio,
  onSave,
}: TimingEditorProps) => {
  const [start, setStart] = useState(initialStart.toString());
  const [end, setEnd] = useState(initialEnd.toString());
  const [isOwningPlayback, setIsOwningPlayback] = useState(false);
  const stopAtRef = useRef<number | null>(null);

  useEffect(() => {
    setStart(initialStart.toString());
    setEnd(initialEnd.toString());
  }, [initialStart, initialEnd]);

  useEffect(() => {
    if (!isPlaying) {
      setIsOwningPlayback(false);
      stopAtRef.current = null;
    }
  }, [isPlaying]);

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
