## Extender el modo edición de timings a las Surahs

Ahora mismo el editor de timings vive solo en `WirdReader`. Lo voy a generalizar para que también funcione en `QuranReader` (Al-Fatiha, Al-Ikhlas, etc.), respetando la diferencia clave: las surahs tienen palabras en **árabe + transliteración por palabra** (`word` + `translit`), mientras que el wird solo tiene transliteración.

### Cambios

**1. `useTimingOverrides` — volverlo genérico**
- Actualmente está tipado a `WirdData`. Lo refactorizo para aceptar cualquier objeto con `{ id, audioUrl, verses: [{ wordTimings: [...] }] }` (genéricos en TS).
- El merge de overrides ya solo toca `start`/`end`, así que sirve igual para `WordTiming` (surah) y `WirdWordTiming` (wird) sin perder los campos extra (`translit`, `word`).
- `formatWirdVerses` se separa en dos formatters:
  - `formatWirdVerses(wird)` — sin cambios, formato actual del wird.
  - `formatSurahVerses(surah)` — incluye `arabic`, `verseNumber`, y cada `wordTiming` con `word`, `translit`, `start`, `end`, replicando el estilo de `src/data/surahs.ts`.
- Las claves de `localStorage` ya usan `wird.id`; para surahs uso `surah-${id}` para no colisionar (ej: `wird-timing-overrides:surah-1`).

**2. `TimingEditorPanel` — genérico**
- Acepta una prop `kind: 'wird' | 'surah'` y `effectiveData` (en vez de `effectiveWird`).
- Internamente elige el formatter correcto y muestra la ruta del archivo destino correcta en el dialog (`src/data/wirdSharif.ts` o `src/data/surahs.ts`).
- Aclaración en el texto de export para surahs: "pegá este bloque reemplazando el `verses: [...]` de la surah correspondiente en `src/data/surahs.ts`".

**3. `QuranVerse` — soportar `editMode`**
Agregar las mismas capacidades que tiene `WirdVerseLine`:
- Nuevas props: `editMode`, `getCurrentTime`, `onUpdateTiming(verseIndex, wordIndex, {start, end})`, `onPlayFromTime`, `onPauseAudio`, `isPlaying`.
- En modo edición: debajo de cada palabra árabe (y su translit) muestro `start → end` en mono pequeño. Click en palabra abre el mismo popover de edición (start/end, "usar tiempo actual", reproducir/pausar segmento).
- Reutilizo el sub-componente `TimingEditor` que ya está en `WirdVerseLine.tsx` extrayéndolo a su propio archivo `src/components/TimingEditor.tsx` para que ambos lo usen sin duplicar código.
- En modo edición, el click NO dispara `onPlayVerse` (consistente con el wird).

**4. `QuranReader` — integrar editor**
- Llamar `useTimingOverrides(surah)`, pasar `effectiveSurah` a `useAudioSync` (los highlights se actualizan en vivo al editar, igual que en el wird).
- Renderizar `<TimingEditorPanel kind="surah" ... />` arriba de los versos.
- Mantener `currentTimeRef` vivo para que el popover lea el tiempo actual del audio.
- Pasar `editMode` y handlers a `QuranVerse`.

**5. `TimingEditor` (extraído)**
- Mover el sub-componente `TimingEditor` que vive dentro de `WirdVerseLine.tsx` a `src/components/TimingEditor.tsx` sin cambios funcionales.
- `WirdVerseLine` y `QuranVerse` lo importan desde ahí.

### Archivos

| Archivo | Acción |
|---|---|
| `src/hooks/useTimingOverrides.ts` | Refactor genérico + agregar `formatSurahVerses` |
| `src/components/TimingEditor.tsx` | Crear (extraído de WirdVerseLine) |
| `src/components/TimingEditorPanel.tsx` | Aceptar `kind` y data genérica |
| `src/components/WirdVerseLine.tsx` | Importar `TimingEditor` desde el nuevo archivo |
| `src/components/WirdReader.tsx` | Pasar `kind="wird"` al panel |
| `src/components/QuranVerse.tsx` | Soportar editMode + popover por palabra |
| `src/components/QuranReader.tsx` | Integrar `useTimingOverrides` + panel + handlers |

### Notas

- Los overrides de surahs y del wird viven en localStorage keys separadas, así que editar una no afecta a la otra.
- El export de surah preserva `arabic`, `verseNumber`, `transliteration`, y por cada palabra su `word` + `translit` originales (solo cambian los números).
- Backup/Importar JSON sigue funcionando igual (cada surah/wird tiene su propio archivo de backup con su id).
- Fuera de alcance: editar el `translit` o el `word` mismo desde la UI — solo se editan los timings, igual que en el wird.
