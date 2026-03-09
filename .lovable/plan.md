

## Login solo con contraseña (sin base de datos)

### Resumen
Una pantalla de contraseña simple. Sin usuario, sin registro, sin DB. La contraseña se valida contra un valor hardcodeado. Una vez ingresada correctamente, se guarda en `localStorage` y no se vuelve a pedir.

### Cambios

**1. Crear `src/hooks/useAuth.ts`**
- Estado `isAuthenticated` basado en `localStorage.getItem('auth') === 'true'`
- `login(password)`: compara contra contraseña hardcodeada, si es correcta guarda `localStorage.setItem('auth', 'true')`, retorna true
- `logout()`: limpia localStorage

**2. Crear `src/pages/Login.tsx`**
- Un input de contraseña centrado en pantalla
- Boton "Entrar"
- Mensaje de error si la contraseña es incorrecta
- Estilo coherente con el tema existente (emerald/gold/cream)

**3. Modificar `src/App.tsx`**
- Usar `useAuth` para verificar autenticación
- Si no autenticado, mostrar `<Login onSuccess />` en lugar de las rutas
- Si autenticado, mostrar rutas normales

**4. Modificar `src/pages/Index.tsx`**
- Agregar boton pequeño de "Cerrar sesión" en la esquina

### Archivos

| Archivo | Accion |
|---|---|
| `src/hooks/useAuth.ts` | Crear |
| `src/pages/Login.tsx` | Crear |
| `src/App.tsx` | Modificar |
| `src/pages/Index.tsx` | Modificar |

