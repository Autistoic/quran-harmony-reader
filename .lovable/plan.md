## Objetivo
Agregar traducción al español por verso en el Wird Sharif (frase completa, no palabra por palabra) y un botón global para mostrar/ocultar todas las traducciones.

## Cambios

### `src/data/wirdSharif.ts`
- Agregar campo opcional `translation?: string` a la interfaz `WirdVerse`.
- Dejar los versos existentes sin traducción por ahora (se completarán después). Opcionalmente puedo precargar 1-2 traducciones de ejemplo si querés; confirmame.

### `src/components/WirdReader.tsx`
- Nuevo estado local `showTranslations` (boolean, default `false`).
- Nuevo botón en la barra superior (junto a "Volver" / "Práctica") con ícono `Languages` de lucide y texto "Traducción", que togglea `showTranslations`. Variant `outline`, mismo tamaño que los otros.
- Pasar `showTranslation={showTranslations}` a `<WirdVerseLine>`.

### `src/components/WirdVerseLine.tsx`
- Aceptar nuevas props: `showTranslation?: boolean`.
- Después del `<p>` de transliteración (y antes/después de la nota), renderizar:
  ```tsx
  {showTranslation && verse.translation && (
    <p className="text-center text-base md:text-lg text-muted-foreground mt-3 px-4">
      {verse.translation}
    </p>
  )}
  ```
- Si `showTranslation` está activo pero el verso no tiene traducción, no mostrar nada (silencioso).

## Fuera de alcance
- Traducción palabra por palabra (Quran ya lo hace, acá no se pidió).
- Persistencia del toggle en localStorage (se puede agregar luego si querés).
- Cargar las traducciones reales de cada verso (las completás vos editando el archivo).
