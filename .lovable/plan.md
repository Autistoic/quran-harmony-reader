## Objetivo

Cambiar el comportamiento del click en una palabra del Corán:
- Antes: reproducía solo esa palabra y se detenía.
- Ahora: reproduce desde esa palabra en adelante sin detenerse.
- El botón "Abrir diccionario" pasa a ser un ícono pequeño y, al tocarlo, pausa el audio antes de abrir el enlace.

## Cambios

### 1. `src/hooks/useAudioSync.ts`
En `playFromWord`, no fijar `stopTimeRef`. Reproducir desde `timing.start` sin auto-pause.

```ts
const playFromWord = useCallback((verseIndex, wordIndex) => {
  const verse = data.verses[verseIndex];
  if (verse && verse.wordTimings[wordIndex]) {
    stopTimeRef.current = null; // antes: timing.end
    seek(verse.wordTimings[wordIndex].start);
    play();
  }
}, [data.verses, seek, play]);
```

### 2. `src/components/QuranVerse.tsx`
- Reemplazar el botón "Abrir diccionario" dentro del `PopoverContent` por un botón chico solo con ícono (`BookOpen` de `lucide-react`), con `size="icon"` y `variant="ghost"` o `"secondary"`.
- Al hacer click en el ícono, llamar a `onPauseAudio?.()` antes de abrir el enlace (`onClick` en el `<a>` o wrapper).
- Reducir el ancho del `PopoverContent` (`w-auto` o `w-fit`) ya que solo lleva un ícono.

```jsx
<PopoverContent className="w-auto p-2" align="center">
  <Button asChild size="icon" variant="ghost" className="h-8 w-8"
          onClick={() => onPauseAudio?.()}>
    <a href={learnArabicUrl} target="_blank" aria-label="Abrir diccionario">
      <BookOpen className="h-4 w-4" />
    </a>
  </Button>
</PopoverContent>
```

- `QuranVerse` ya recibe `onPauseAudio` desde `QuranReader` (usado en modo edición), así que se reutiliza sin cambios en props.

## Archivos a modificar

- `src/hooks/useAudioSync.ts`
- `src/components/QuranVerse.tsx`
