import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Pencil, Download, RotateCcw, Copy, Check } from 'lucide-react';
import type { WirdData } from '@/data/wirdSharif';
import { formatWirdVerses } from '@/hooks/useTimingOverrides';
import { toast } from 'sonner';

interface TimingEditorPanelProps {
  editMode: boolean;
  onEditModeChange: (value: boolean) => void;
  effectiveWird: WirdData;
  hasOverrides: boolean;
  onReset: () => void;
}

export const TimingEditorPanel = ({
  editMode,
  onEditModeChange,
  effectiveWird,
  hasOverrides,
  onReset,
}: TimingEditorPanelProps) => {
  const [exportOpen, setExportOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const exportText = formatWirdVerses(effectiveWird);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(exportText);
      setCopied(true);
      toast.success('Copiado al portapapeles');
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error('No se pudo copiar');
    }
  };

  const handleReset = () => {
    if (confirm('¿Descartar todos los cambios de timing?')) {
      onReset();
      toast.success('Timings restaurados');
    }
  };

  return (
    <div className="mb-6 rounded-lg border border-dashed border-border/60 bg-card/50 backdrop-blur-sm p-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Pencil className="h-4 w-4 text-muted-foreground" />
          <Label htmlFor="edit-mode-toggle" className="text-sm font-medium cursor-pointer">
            Modo edición de timings
          </Label>
          <Switch
            id="edit-mode-toggle"
            checked={editMode}
            onCheckedChange={onEditModeChange}
          />
          {hasOverrides && (
            <span className="text-xs text-accent-foreground bg-accent/30 rounded-full px-2 py-0.5">
              con cambios
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExportOpen(true)}
            className="gap-1.5"
          >
            <Download className="h-3.5 w-3.5" />
            Exportar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            disabled={!hasOverrides}
            className="gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Resetear
          </Button>
        </div>
      </div>
      {editMode && (
        <p className="text-xs text-muted-foreground mt-2">
          Tocá una palabra para editar sus tiempos. Usá "tiempo actual" para capturar desde el reproductor.
        </p>
      )}

      <Dialog open={exportOpen} onOpenChange={setExportOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Exportar timings</DialogTitle>
            <DialogDescription>
              Copiá este bloque y pegalo reemplazando el array <code>verses: [...]</code> en <code>src/data/wirdSharif.ts</code>.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            readOnly
            value={exportText}
            className="font-mono text-xs h-96 resize-none"
            onFocus={e => e.currentTarget.select()}
          />
          <DialogFooter>
            <Button onClick={handleCopy} className="gap-1.5">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copiado' : 'Copiar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
