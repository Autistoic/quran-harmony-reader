## Objetivo
Permitir que al tocar una palabra árabe (o su transliteración) en una sura, el audio salte y comience a reproducirse desde el `start` de esa palabra — solo cuando NO está activo el modo edición (en edición, el click sigue abriendo el popover de timings).

## Cambios

### `src/components/QuranReader.tsx`
- Pasar `playFromWord` (ya existe en `useAudioSync`) como nueva prop `onPlayWord` a `<QuranVerse>`.

### `src/components/QuranVerse.tsx`
- Aceptar nueva prop opcional `onPlayWord?: (verseIndex: number, wordIndex: number) => void`.
- En `renderWord`, cuando `editMode` es `false`:
  - Envolver el span de la palabra con `onClick={() => onPlayWord?.(verseIndex, wordIndex)}`.
  - Añadir clases `cursor-pointer hover:bg-accent/20 rounded` para feedback visual.
- En modo edición no se cambia el comportamiento (sigue abriendo el `Popover`).

## Fuera de alcance
- Wird Sharif (ya tiene click-to-play según memoria del proyecto).
- Cambios al hook `useAudioSync` (ya expone `playFromWord`).
- Cambios en el editor de timings.
