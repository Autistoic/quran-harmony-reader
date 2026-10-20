import { Play, Pause, RotateCcw, RotateCw, Gauge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslation } from '@/i18n';

interface AudioPlayerProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate?: number;
  onToggle: () => void;
  onSeek: (time: number) => void;
  onRestart: () => void;
  onSkip?: (seconds: number) => void;
  onPlaybackRateChange?: (rate: number) => void;
  title?: string;
}

const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const AudioPlayer = ({
  isPlaying,
  currentTime,
  duration,
  playbackRate = 1,
  onToggle,
  onSeek,
  onRestart,
  onSkip,
  onPlaybackRateChange,
  title,
}: AudioPlayerProps) => {
  const { t } = useTranslation();
  const speeds = [0.75, 1, 1.25];

  return (
    <div className="relative rounded-2xl sm:rounded-3xl border border-border/80 bg-card/90 backdrop-blur-xl p-3 sm:p-4 shadow-xl transition-all">
      <div className="flex flex-col gap-2">
        {/* Top: optional title or scrubber */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] sm:text-xs font-mono text-muted-foreground w-10 text-right shrink-0">
            {formatTime(currentTime)}
          </span>
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={0.1}
            onValueChange={(value) => onSeek(value[0])}
            className="flex-1 cursor-pointer"
            aria-label="Progreso del audio"
          />
          <span className="text-[11px] sm:text-xs font-mono text-muted-foreground w-10 shrink-0">
            {formatTime(duration)}
          </span>
        </div>

        {/* Bottom controls row */}
        <div className="flex items-center justify-between gap-2 mt-1">
          {/* Left: Restart & Rewind 5s */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={onRestart}
              className="h-8 w-8 sm:h-9 sm:w-9 rounded-full text-muted-foreground hover:text-foreground transition-colors"
              title="Reiniciar"
              aria-label="Reiniciar audio"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            {onSkip && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onSkip(-5)}
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-full text-muted-foreground hover:text-foreground transition-colors"
                title="Retroceder 5 segundos"
                aria-label="Retroceder 5 segundos"
              >
                <span className="text-[10px] font-bold">-5s</span>
              </Button>
            )}
          </div>

          {/* Center: Play/Pause button */}
          <div className="flex items-center gap-2">
            <Button
              onClick={onToggle}
              size="icon"
              className="h-11 w-11 sm:h-12 sm:w-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:scale-105 active:scale-95 transition-all"
              aria-label={isPlaying ? "Pausar recitación" : "Reproducir recitación"}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5 ml-0.5" />
              )}
            </Button>
          </div>

          {/* Right: Forward 5s & Speed control */}
          <div className="flex items-center gap-1">
            {onSkip && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onSkip(5)}
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-full text-muted-foreground hover:text-foreground transition-colors"
                title="Adelantar 5 segundos"
                aria-label="Adelantar 5 segundos"
              >
                <span className="text-[10px] font-bold">+5s</span>
              </Button>
            )}

            {onPlaybackRateChange && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground gap-1"
                    title="Velocidad de reproducción"
                    aria-label={`Velocidad actual: ${playbackRate}x`}
                  >
                    <span>{playbackRate}x</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[6rem] bg-popover/95 backdrop-blur-md">
                  {speeds.map((rate) => (
                    <DropdownMenuItem
                      key={rate}
                      onClick={() => onPlaybackRateChange(rate)}
                      className={`cursor-pointer text-xs justify-center font-medium ${
                        playbackRate === rate ? "bg-primary/10 text-primary font-bold" : ""
                      }`}
                    >
                      {rate}x
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
