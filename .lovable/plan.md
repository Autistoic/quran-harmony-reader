## Modo edición de timings

### Idea
Un modo que activás con un toggle en la página del Wird. Mientras está activo:
- Cada palabra muestra sus tiempos actuales (`start` / `end`) debajo.
- Al hacer click en una palabra, se abre un pequeño editor inline con dos inputs (start, end) prellenados con los valores actuales.
- Hay botones rápidos: **"Usar tiempo actual"** (toma el `currentTime` del audio para start o end), **"Reproducir desde aquí"**, y **"Guardar"**.
- Los cambios se guardan en memoria (estado local) + `localStorage` para no perderlos al refrescar.
- Un panel flotante muestra el **output final** como texto listo para copiar, con el formato exacto del código (`{ word: "...", start: X, end: Y },`) — podés copiar solo una verse o todo el array.

Todo esto es una herramienta de autor, **no modifica `wirdSharif.ts`** — el código fuente sigue siendo la fuente de verdad. Vos pegás el output cuando estés conforme.

### Flujo de uso
1. Activás "Modo edición" (toggle arriba).
2. Reproducís el audio normalmente.
3. Cuando escuchás que una palabra está desincronizada, pausás, clickeás la palabra y ajustás. El botón "Usar tiempo actual" toma el `currentTime` del reproductor — así no tenés que tipear números.
4. Cuando terminás, abrís el panel "Exportar", copiás el bloque y lo pegás en `src/data/wirdSharif.ts`.
5. Un botón "Resetear overrides" vuelve a los tiempos originales del archivo.

### Detalles técnicos

**Estado de overrides**
- Nuevo hook `useTimingOverrides(wirdId)` que mantiene un objeto `{ [verseIndex]: { [wordIndex]: { start, end } } }` persistido en `localStorage` con key `wird-timing-overrides:{wirdId}`.
- Función `getEffectiveTimings(verse, verseIndex)` que mergea los overrides sobre los timings originales. El reader usa esto para sincronizar el audio con los valores editados en tiempo real.

**Integración con `useAudioSync`**
- `WirdReader` arma un `effectiveWird` (clon del wird con los overrides aplicados en `wordTimings`) y se lo pasa al `useAudioSync`. Así editar un tiempo actualiza el highlight inmediatamente.

**Nuevo componente `TimingEditorPanel`**
- Toggle "Modo edición" (Switch del design system).
- Cuando activo: pasa `editMode=true` a `WirdVerseLine`.
- Botón "Exportar" abre un `Dialog` con un `<textarea readOnly>` que contiene el array `verses` formateado tal como está en `wirdSharif.ts`, y un botón "Copiar al portapapeles".
- Botón "Resetear" con confirmación.

**Cambios en `WirdVerseLine`**
- Nueva prop `editMode: boolean` y `onUpdateTiming(verseIndex, wordIndex, { start, end })`.
- En modo edición:
  - Debajo de cada palabra renderiza un pequeño texto monoespaciado `0.00 → 0.00`.
  - Click en palabra abre un popover con dos inputs numéricos (step 0.1), botones "← usar tiempo actual" junto a cada input, "▶ reproducir desde start", "Guardar", "Cancelar".
  - El click en modo edición NO dispara `onPrepareForPractice` (se desactiva ese comportamiento mientras editás).

**Formato de export**
Genera exactamente:
```
{
  transliteration: "...",
  repetitions: 3,
  wordTimings: [
    { word: "aLLAHUMma", start: 375.0, end: 376.2 },
    ...
  ],
},
```
Preserva campos existentes (`repetitions`, `note`, `transliteration`) y solo reemplaza los números de timing.

### Archivos

| Archivo | Acción |
|---|---|
| `src/hooks/useTimingOverrides.ts` | Crear — estado + persistencia + merge + export formatter |
| `src/components/TimingEditorPanel.tsx` | Crear — toggle, botón exportar, dialog de copiar, reset |
| `src/components/WirdVerseLine.tsx` | Modificar — prop `editMode`, mostrar tiempos, popover de edición por palabra |
| `src/components/WirdReader.tsx` | Modificar — estado de editMode, aplicar overrides al wird antes de useAudioSync, render del panel |

### Fuera de alcance
- No se edita automáticamente `wirdSharif.ts` (es lo que pediste: generar texto para pegar).
- No se agrega al Quran Reader todavía — primero probamos en el Wird. Si funciona bien, lo extendemos.