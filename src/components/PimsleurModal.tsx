import { useState, useEffect } from 'react';
import { PracticeItem } from '@/hooks/usePimsleur';
import { useNotifications } from '@/hooks/useNotifications';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, X, Trash2, Plus, Clock, Bell, BellOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PimsleurModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: PracticeItem[];
  dueItems: PracticeItem[];
  onAdd: (word: string) => void;
  onReview: (id: string, success: boolean) => void;
  onRemove: (id: string) => void;
  prefillWord?: string;
  onClearPrefill?: () => void;
}

const LEVEL_LABELS = ['5 min', '25 min', '2 h', '1 día', '✓'];

function timeUntil(ts: number): string {
  if (ts === Infinity) return 'Completado';
  const diff = ts - Date.now();
  if (diff <= 0) return 'Ahora';
  const mins = Math.ceil(diff / 60_000);
  if (mins < 60) return `${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ${mins % 60}m`;
  return `${Math.floor(hrs / 24)}d`;
}

export const PimsleurModal = ({
  open,
  onOpenChange,
  items,
  dueItems,
  onAdd,
  onReview,
  onRemove,
  prefillWord,
  onClearPrefill,
}: PimsleurModalProps) => {
  const [newWord, setNewWord] = useState('');
  const { enabled: notifEnabled, supported: notifSupported, toggleEnabled } = useNotifications();

  useEffect(() => {
    if (open && prefillWord) {
      setNewWord(prefillWord);
      onClearPrefill?.();
    }
  }, [open, prefillWord]);

  const handleAdd = () => {
    if (newWord.trim()) {
      onAdd(newWord.trim());
      setNewWord('');
    }
  };

  const completedCount = items.filter(i => i.level >= 4).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>🧠</span> Práctica Pimsleur
          </DialogTitle>
          <DialogDescription>
            Repetición espaciada: 5min → 25min → 2h → 1 día
          </DialogDescription>
          {notifSupported && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleEnabled}
              className="flex items-center gap-1.5 text-xs mt-1"
            >
              {notifEnabled ? (
                <>
                  <Bell className="h-3.5 w-3.5 text-primary" />
                  Notificaciones activas
                </>
              ) : (
                <>
                  <BellOff className="h-3.5 w-3.5 text-muted-foreground" />
                  Activar notificaciones
                </>
              )}
            </Button>
          )}
        </DialogHeader>

        {/* Add new word */}
        <div className="flex gap-2">
          <Input
            placeholder="Agregar frase..."
            value={newWord}
            onChange={e => setNewWord(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
          />
          <Button size="icon" onClick={handleAdd} variant="outline">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Due items */}
        {dueItems.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-primary flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              Para repasar ({dueItems.length})
            </h3>
            {dueItems.map(item => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-2 p-3 rounded-lg bg-accent/10 border border-accent/20"
              >
                <div className="min-w-0">
                  <p className="font-transliteration text-lg truncate">{item.word}</p>
                  <p className="text-xs text-muted-foreground">
                    Nivel {item.level} · {LEVEL_LABELS[item.level]}
                  </p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onReview(item.id, false)}
                    className="h-8 px-2 text-destructive hover:text-destructive"
                  >
                    <X className="h-3.5 w-3.5 mr-1" />
                    Repetir
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onReview(item.id, true)}
                    className="h-8 px-2"
                  >
                    <Check className="h-3.5 w-3.5 mr-1" />
                    Lo sé
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* All items */}
        {items.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Todas las frases ({items.length}) · {completedCount} completadas
            </h3>
            {items
              .filter(i => !dueItems.some(d => d.id === i.id))
              .map(item => (
                <div
                  key={item.id}
                  className={cn(
                    "flex items-center justify-between gap-2 p-2 rounded-lg border border-border/50",
                    item.level >= 4 && "opacity-60"
                  )}
                >
                  <div className="min-w-0">
                    <p className="font-transliteration truncate">{item.word}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.level >= 4
                        ? '✓ Completado'
                        : `Nivel ${item.level} · próximo: ${timeUntil(item.nextReview)}`}
                    </p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onRemove(item.id)}
                    className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
          </div>
        )}

        {items.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-6">
            Presioná una palabra en la recitación y tocá "+" para agregarla aquí.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
};
