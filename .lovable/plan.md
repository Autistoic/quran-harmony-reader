

## Prefill + edición libre en el modal Pimsleur

### Resumen
Al presionar "+" en una palabra, se abre el modal con esa palabra en el input, pero el usuario puede editarla libremente — borrar, agregar más texto, o pegar una frase completa antes de confirmar. El input será editable y suficientemente grande para frases.

### Cambios

**1. `src/components/WirdVerseLine.tsx`**
- El botón "+" llama un callback `onPrepareForPractice(word)` en vez de `onAddToPractice(word)` directamente
- Se elimina el toast automático del "+"

**2. `src/components/WirdReader.tsx`**
- Nuevo estado `prefillWord`
- Al recibir `onPrepareForPractice`, setea `prefillWord` y abre el modal
- Pasa `prefillWord` + callback `onClearPrefill` al modal

**3. `src/components/PimsleurModal.tsx`**
- Nueva prop `prefillWord?: string`
- Cuando el modal se abre con `prefillWord`, pobla el input con ese valor
- El input queda completamente editable — el usuario puede borrar la palabra, escribir más, o pegar una frase entera
- Solo se agrega a la cola al presionar el botón de confirmar
- Después de agregar, se limpia el input y el prefill

### Archivos

| Archivo | Acción |
|---|---|
| `src/components/WirdVerseLine.tsx` | Modificar |
| `src/components/WirdReader.tsx` | Modificar |
| `src/components/PimsleurModal.tsx` | Modificar |

