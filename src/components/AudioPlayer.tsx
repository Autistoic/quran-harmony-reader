import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface AudioPlayerProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onToggle: () => void;
  onSeek: (time: number) => void;
  onRestart: () => void;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const AudioPlayer = ({
  isPlaying,
  currentTime,
  duration,
  onToggle,
  onSeek,
  onRestart,
}: AudioPlayerProps) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
      <div className="flex items-center gap-4">
        {/* Restart button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onRestart}
          className="text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="h-5 w-5" />
        </Button>

        {/* Play/Pause button */}
        <Button
          onClick={onToggle}
          size="lg"
          className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
        >
          {isPlaying ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="h-6 w-6 ml-1" />
          )}
        </Button>

        {/* Progress bar */}
        <div className="flex-1 flex items-center gap-3">
          <span className="text-sm text-muted-foreground min-w-[40px]">
            {formatTime(currentTime)}
          </span>
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={0.1}
            onValueChange={(value) => onSeek(value[0])}
            className="flex-1"
          />
          <span className="text-sm text-muted-foreground min-w-[40px]">
            {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  );
};
