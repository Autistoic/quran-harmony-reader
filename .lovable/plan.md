

## Herramienta de Práctica Pimsleur — Repetición Espaciada

### Resumen

Al presionar una palabra en el Wird (o Quran), ademas de reproducir el audio, aparece un pequeño botón "+" para agregarla a una cola de práctica. Las frases guardadas se revisan con intervalos de repetición espaciada (5, 25, 120, 1440 minutos). Todo se persiste en `localStorage`. Las notificaciones se agregarán cuando la app sea PWA.

### Flujo de usuario

1. El usuario presiona una palabra → se reproduce el audio (como ahora) y aparece un botón "+" junto a la palabra
2. Al presionar "+", la palabra/frase se agrega a la cola de práctica con timestamp actual
3. Desde un botón en el header (ícono de cerebro/libro), se abre un modal/drawer con la lista de frases pendientes de repasar
4. Cada frase muestra cuándo es la próxima revisión
5. Al repasar, el usuario marca "Lo sé" o "Repetir" — si lo sabe, avanza al siguiente intervalo; si no, vuelve al primer intervalo

### Intervalos de repetición

```text
Nivel 0 →  5 min
Nivel 1 → 25 min
Nivel 2 → 2 horas (120 min)
Nivel 3 → 1 día (1440 min)
Nivel 4 → Completado
```

### Cambios

**1. Crear `src/hooks/usePimsleur.ts`**

Hook que maneja la cola de práctica:

- Interfaz `PracticeItem`: `{ id, word, addedAt, nextReview, level }`
- Estado leído/escrito en `localStorage` (key: `pimsleur-items`)
- `addItem(word)`: agrega una frase con `level: 0` y `nextReview: now + 5min`
- `reviewItem(id, success)`: si success, sube de nivel y calcula próximo review; si no, reset a nivel 0
- `removeItem(id)`
- `getDueItems()`: filtra items cuyo `nextReview <= now`
- `items`: lista completa

**2. Crear `src/components/PimsleurModal.tsx`**

Dialog/drawer con:

- Lista de frases pendientes de repaso (las que están "due") arriba
- Lista de todas las frases guardadas abajo
- Cada item muestra: la palabra, el nivel actual, tiempo hasta próximo repaso
- Botones "Lo sé" / "Repetir" para items due
- Botón para eliminar items
- Input text pre-rellenado para agregar frases manualmente

**3. Modificar `src/components/WirdVerseLine.tsx`**

- Al presionar una palabra, además de reproducir audio, mostrar un pequeño botón "+" flotante cerca de la palabra
- Al presionar "+", llamar `addItem(word)` y mostrar un toast de confirmación
- Se usa estado local para trackear qué palabra tiene el "+" visible

**4. Modificar `src/components/WirdReader.tsx`**

- Importar `usePimsleur` y `PimsleurModal`
- Agregar botón en el header para abrir el modal de práctica
- Pasar `addItem` al `WirdVerseLine`

**5. Opcionalmente: misma funcionalidad en `QuranVerse.tsx` y `QuranReader.tsx`**

- Misma lógica de "+" en palabras del Quran reader

### Archivos

| Archivo | Acción |
|---|---|
| `src/hooks/usePimsleur.ts` | Crear — lógica de repetición espaciada + localStorage |
| `src/components/PimsleurModal.tsx` | Crear — UI del modal de práctica |
| `src/components/WirdVerseLine.tsx` | Modificar — botón "+" al presionar palabra |
| `src/components/WirdReader.tsx` | Modificar — integrar hook + botón para abrir modal |

