import { useRef, useState } from 'react';
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
import { Pencil, Download, RotateCcw, Copy, Check, Save, Upload } from 'lucide-react';
import type { WirdData } from '@/data/wirdSharif';
import type { Surah } from '@/data/surahs';
import { formatWirdVerses, formatSurahVerses } from '@/hooks/useTimingOverrides';
import { toast } from 'sonner';

type Kind = 'wird' | 'surah';

interface TimingEditorPanelProps {
  kind: Kind;
  editMode: boolean;
  onEditModeChange: (value: boolean) => void;
  effectiveData: WirdData | Surah;
  hasOverrides: boolean;
  overrideCount: number;
  onReset: () => void;
  onExportBackup: () => void;
  onImportBackup: (file: File) => Promise<{ count: number }>;
}

export const TimingEditorPanel = ({
  kind,
  editMode,
  onEditModeChange,
  effectiveData,
  hasOverrides,
  overrideCount,
  onReset,
  onExportBackup,
  onImportBackup,
}: TimingEditorPanelProps) => {
  const [exportOpen, setExportOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const targetFile = kind === 'wird' ? 'src/data/wirdSharif.ts' : 'src/data/surahs.ts';
  const exportText =
    kind === 'wird'
      ? formatWirdVerses(effectiveData as WirdData)
      : formatSurahVerses(effectiveData as Surah);
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(exportText);
      setCopied(true);
      toast.success(`Copiado. Pegalo en ${targetFile} para guardarlo definitivamente.`);
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

  const handleImportClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { count } = await onImportBackup(file);
      toast.success(`Importados ${count} cambios`);
    } catch {
      toast.error('Archivo inválido');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
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
              {overrideCount} cambios
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={onExportBackup} disabled={!hasOverrides} className="gap-1.5">
            <Save className="h-3.5 w-3.5" />
            Backup
          </Button>
          <Button variant="outline" size="sm" onClick={handleImportClick} className="gap-1.5">
            <Upload className="h-3.5 w-3.5" />
            Importar
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={handleFileChange}
          />
          <Button variant="outline" size="sm" onClick={() => setExportOpen(true)} className="gap-1.5">
            <Download className="h-3.5 w-3.5" />
            Exportar código
          </Button>
          <Button variant="ghost" size="sm" onClick={handleReset} disabled={!hasOverrides} className="gap-1.5">
            <RotateCcw className="h-3.5 w-3.5" />
            Resetear
          </Button>
        </div>
      </div>

      <p className="text-[11px] text-muted-foreground mt-2">
        Guardado local en <code className="text-foreground/80">{hostname}</code>. Los cambios viven solo en este navegador/dominio. Para que persistan en todos lados: <strong>Exportar código</strong> y pegarlo en <code>{targetFile}</code>.
      </p>

      {editMode && (
        <p className="text-xs text-muted-foreground mt-1">
          Tocá una palabra para editar sus tiempos. Usá "ahora" para capturar desde el reproductor.
        </p>
      )}

      <Dialog open={exportOpen} onOpenChange={setExportOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Exportar timings</DialogTitle>
            <DialogDescription>
              {kind === 'wird' ? (
                <>Copiá este bloque y pegalo reemplazando el array <code>verses: [...]</code> en <code>{targetFile}</code>.</>
              ) : (
                <>Copiá este bloque y pegalo reemplazando el <code>verses: [...]</code> de la surah correspondiente en <code>{targetFile}</code>.</>
              )}
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
