

## Agregar Service Worker para habilitar instalación en Android

### Problema
Chrome en Android necesita estos requisitos para mostrar el prompt "Agregar a pantalla de inicio":
1. ✅ Manifest válido con `display: standalone`
2. ✅ Servido por HTTPS
3. ❌ **Service worker registrado** — falta esto

### Solución
Instalar `vite-plugin-pwa` y configurarlo con las precauciones necesarias para que no interfiera con el preview de Lovable.

### Cambios

**1. Instalar `vite-plugin-pwa`**

**2. Configurar `vite.config.ts`**
- Agregar `VitePWA` con `registerType: "autoUpdate"`
- `devOptions: { enabled: false }` para no interferir en desarrollo
- `navigateFallbackDenylist: [/^\/~oauth/]` para no cachear rutas de auth
- Manifest inline (mover la config del JSON al plugin)

**3. Agregar guarda en `src/main.tsx`**
- Detectar si la app corre dentro del iframe de Lovable o en preview
- Si es preview/iframe, desregistrar cualquier service worker existente
- Esto evita problemas de cache stale en el editor

**4. Eliminar `public/manifest.json`**
- El plugin genera el manifest automáticamente

### Nota importante
- La instalación y el service worker solo funcionan en la versión publicada (surah-sync.lovable.app), no en el editor de Lovable
- En Android, después de visitar la app publicada, Chrome debería mostrar un mini-banner o la opción en el menú (⋮ → "Instalar app")

### Archivos

| Archivo | Acción |
|---|---|
| `vite.config.ts` | Modificar — agregar VitePWA plugin |
| `src/main.tsx` | Modificar — guarda anti-iframe/preview |
| `public/manifest.json` | Eliminar — el plugin lo genera |

