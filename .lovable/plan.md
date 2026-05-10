## Problema

En `QuranReader.tsx` el botón "Mostrar/Ocultar Traducción" está dentro de un `div` con `fixed top-0 z-10`, lo que lo deja pegado arriba a la izquierda, encima del header y la navegación. Queda mal alineado y tapa contenido.

## Solución propuesta

Integrar el botón dentro del contenedor sticky del `AudioPlayer` (que ya está siempre visible abajo), como un pequeño botón flotante alineado a la derecha, justo encima del reproductor.

### Cambios en `src/components/QuranReader.tsx`

1. **Eliminar** el bloque actual:
   ```jsx
   <div className="fixed top-0 z-10">
     <Button ...>...</Button>
   </div>
   ```

2. **Agregar** el botón dentro del contenedor `sticky bottom-4`, encima del `<AudioPlayer />`:
   ```jsx
   <div className="sticky bottom-4 z-10 space-y-2">
     <div className="flex justify-end">
       <Button
         variant="secondary"
         size="sm"
         onClick={toggleShowTranslation}
         className="shadow-md rounded-full"
       >
         <Languages className="h-4 w-4 mr-1" />
         {showTranslation ? 'Ocultar' : 'Mostrar'} traducción
       </Button>
     </div>
     <AudioPlayer ... />
   </div>
   ```

3. Importar el icono `Languages` de `lucide-react` (mismo patrón ya usado en `WirdReader.tsx`).

## Resultado

- El botón queda siempre visible (sticky junto al reproductor).
- Alineado a la derecha, sin tapar el header ni la navegación.
- Estilo consistente con el resto de la app (mismo icono `Languages` que en Wird Sharif).

## Archivos a modificar

- `src/components/QuranReader.tsx`
