

## App móvil instalable con notificaciones de repaso

### Enfoque recomendado

La forma más simple y efectiva es hacer tu app **instalable desde el navegador** (PWA ligera) usando solo un `manifest.json` — sin service workers complejos. Para las **notificaciones de repaso**, usamos la Web Notifications API nativa del navegador, que funciona en Android y en escritorio (en iOS tiene soporte limitado).

No necesitás publicar en App Store ni Google Play. Los usuarios visitan tu sitio, la instalan desde el menú del navegador, y reciben notificaciones cuando tienen frases para repasar.

### Limitaciones importantes

- **iOS (iPhone/iPad)**: Las notificaciones web solo funcionan en iOS 16.4+ y requieren que el usuario instale la app en la pantalla de inicio primero
- **Android + Desktop**: Funcionan sin problemas
- Las notificaciones solo funcionan en la versión publicada (surah-sync.lovable.app), no en el editor de Lovable

### Cambios

**1. Crear `public/manifest.json`**
- Nombre, íconos, colores del tema, `display: "standalone"`
- Hace la app instalable desde el navegador

**2. Crear íconos PWA en `public/`**
- Ícono 192x192 y 512x512 (SVG generado)

**3. Actualizar `index.html`**
- Enlazar el manifest
- Agregar meta tags para mobile (theme-color, apple-mobile-web-app)

**4. Crear `src/hooks/useNotifications.ts`**
- Pedir permiso de notificaciones al usuario
- Función `scheduleReviewNotification(item)` que usa `setTimeout` para disparar una notificación cuando una frase está lista para repasar
- Fallback: si no hay permiso, no hace nada (la app sigue funcionando sin notificaciones)

**5. Modificar `src/hooks/usePimsleur.ts`**
- Al agregar o revisar un item, programar la notificación para el próximo intervalo
- Al cerrar y reabrir la app, reprogramar notificaciones para items pendientes

**6. Modificar `src/components/PimsleurModal.tsx`**
- Agregar botón para activar notificaciones (pide permiso al navegador)
- Mostrar estado de notificaciones (activadas/desactivadas)

### Archivos

| Archivo | Acción |
|---|---|
| `public/manifest.json` | Crear |
| `public/icon-192.svg`, `public/icon-512.svg` | Crear |
| `index.html` | Modificar — enlazar manifest + meta tags mobile |
| `src/hooks/useNotifications.ts` | Crear — lógica de notificaciones web |
| `src/hooks/usePimsleur.ts` | Modificar — integrar notificaciones |
| `src/components/PimsleurModal.tsx` | Modificar — botón activar notificaciones |

