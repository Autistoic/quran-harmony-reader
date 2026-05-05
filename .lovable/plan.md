# Soporte de traducción al español en surahs

Agrego el campo de traducción a la estructura de datos y lo muestro en pantalla bajo cada palabra (estilo de la imagen: árabe arriba, transliteración debajo, traducción al pie). Por ahora dejo los valores vacíos (`""`) para que vos los completes después — el soporte queda listo.

## Cambios

### 1. `src/data/surahs.ts` — extender tipos

```ts
export interface WordTiming {
  word: string;
  translit: string;
  translation?: string; // ES, opcional (por palabra)
  start: number;
  end: number;
}

export interface Verse {
  arabic: string;
  transliteration: string;
  translation?: string; // ES, opcional (verso completo)
  verseNumber?: number;
  wordTimings: WordTiming[];
}
```

Agrego `translation: ""` vacío en cada `wordTiming` y `translation: ""` en cada `verse` de las 3 surahs existentes (Al-Fatiha, Al-Ikhlas, Al-Falaq) para que el campo exista y sea fácil rellenar después.

### 2. `src/components/QuranVerse.tsx` — render de la traducción

Debajo de cada palabra (alineado a la columna árabe + translit), agrego una tercera línea con la traducción al español de esa palabra. Misma lógica de RTL que ya usa la transliteración para mantener el orden.

```text
   ٱلْفَلَقِ      بِرَبِّ      أَعُوذُ      قُلْ
   l-falaqi    birabbi    a'ūdhu     qul
   del alba    del Señor  me refugio  Di
```

- Reuso el helper `renderWord` para la línea de traducción (no se resalta con highlight, solo es texto auxiliar).
- Si `translation` está vacío o no existe en una palabra, muestro un placeholder sutil (`—` con opacidad baja) para que se note dónde falta — opcional, lo activo solo en modo normal, no rompe nada si está vacío.
- Estilo: tamaño chico (`text-sm`), color `text-muted-foreground/70`, sin itálica, dir `rtl` igual que la translit (para mantener el orden alineado al árabe).

Y al final del verso, opcionalmente debajo de todo, muestro la traducción del verso completo (`verse.translation`) en LTR centrado, si está presente. Esto da contexto fluido en español del verso entero (no solo palabra por palabra).

### 3. Modo edición sin cambios

El timing editor sigue editando solo `start`/`end`. La traducción se completa manualmente editando `src/data/surahs.ts` (no agrego UI de edición de texto, igual que con `word`/`translit`).

## Archivos

| Archivo | Acción |
|---|---|
| `src/data/surahs.ts` | Agregar campo `translation` a interfaces + `""` en data existente |
| `src/components/QuranVerse.tsx` | Renderizar línea de traducción por palabra + traducción del verso |

## Fuera de alcance

- Wird Sharif (lo dejo para otra iteración si lo querés también).
- Editor de traducción desde la UI.
- Traducciones reales — quedan como `""` para que las completes vos.
