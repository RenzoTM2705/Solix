# Solix

Solix es una aplicación web de gestión financiera personal construida con React, TypeScript, Vite, TailwindCSS y Supabase. La app está enfocada en control de capital inicial, registros de ingresos y gastos y gastos programados

## Qué hace la app

- Autenticación de usuarios con Supabase.
- Registro de usuario y configuración inicial del capital.
- Dashboard con resumen financiero, salud financiera y métricas operativas.
- Registro de movimientos financieros.
- Gestión de gastos programados.
- Recuperación y cambio de contraseña por correo.
- Edición de foto de perfil con subida a Supabase Storage.
- Persistencia de sesión con opción de “Recordar mi sesión”.
- Cierre automático por inactividad.

## Stack

- React 19
- TypeScript
- Vite
- React Router
- TailwindCSS
- Supabase
- jsPDF + jsPDF-AutoTable para exportación PDF

## Estructura del proyecto

```text
src/
  main.tsx                      Punto de entrada de la aplicación.
  routes/AppRoutes.tsx          Rutas públicas y protegidas.
  components/                   Componentes reutilizables de UI.
  hooks/                        Hooks de estado y dominio.
  screens/                      Pantallas principales.
  services/                    Lógica de acceso a Supabase.
  types/                       Tipos compartidos del dominio.
  utils/                       Utilidades de filtros, exportación y helpers.
```

## Mapa del código

### Punto de entrada

- [src/main.tsx](src/main.tsx): monta React en el DOM, activa `BrowserRouter` y renderiza las rutas principales.

### Rutas

- [src/routes/AppRoutes.tsx](src/routes/AppRoutes.tsx): define rutas públicas y protegidas.
- Controla acceso con `useAuth` y `useProfile`.
- Aplica cierre por inactividad en rutas autenticadas.

### Servicios

- [src/services/supabase.ts](src/services/supabase.ts): instancia singleton del cliente Supabase.
- [src/services/auth.service.ts](src/services/auth.service.ts): login, signup, logout, recuperación de contraseña, cambio de contraseña, avatar y manejo de sesión.
- [src/services/profile.service.ts](src/services/profile.service.ts): lectura y actualización del perfil del usuario.
- [src/services/transactions.service.ts](src/services/transactions.service.ts): operaciones de movimientos financieros.
- [src/services/scheduledTransactions.service.ts](src/services/scheduledTransactions.service.ts): operaciones de gastos programados.

### Hooks

- [src/hooks/useAuth.ts](src/hooks/useAuth.ts): estado de sesión, login, registro, logout e inicialización de auth.
- [src/hooks/useProfile.ts](src/hooks/useProfile.ts): lectura y refresco de perfil.
- [src/hooks/useInactivityTimeout.ts](src/hooks/useInactivityTimeout.ts): cierre automático por inactividad.
- [src/hooks/useTransactions.ts](src/hooks/useTransactions.ts): carga de movimientos.
- [src/hooks/useScheduledTransactions.ts](src/hooks/useScheduledTransactions.ts): carga de gastos programados.

### Pantallas

- [src/screens/Login/Login.tsx](src/screens/Login/Login.tsx): inicio de sesión con email/contraseña, recordar sesión y acceso a recuperación.
- [src/screens/RegistroUsuario/RegistroUsuario.tsx](src/screens/RegistroUsuario/RegistroUsuario.tsx): registro de usuario.
- [src/screens/ConfigInicial/ConfigInicial.tsx](src/screens/ConfigInicial/ConfigInicial.tsx): captura del capital inicial.
- [src/screens/Dashboard/Dashboard.tsx](src/screens/Dashboard/Dashboard.tsx): tablero principal y resumen ejecutivo.
- [src/screens/Registros/Registros.tsx](src/screens/Registros/Registros.tsx): historial de movimientos.
- [src/screens/GastosProgramados/GastosProgramados.tsx](src/screens/GastosProgramados/GastosProgramados.tsx): administración de gastos programados.
- [src/screens/RecuperarClave/RecuperarClave.tsx](src/screens/RecuperarClave/RecuperarClave.tsx): solicitud de correo para recuperar contraseña.
- [src/screens/ConfirmacionClave/ConfirmacionClave.tsx](src/screens/ConfirmacionClave/ConfirmacionClave.tsx): confirmación del correo enviado.
- [src/screens/CambiarClave/CambiarClave.tsx](src/screens/CambiarClave/CambiarClave.tsx): restablecimiento de contraseña desde el link recibido por correo.

### Componentes

- [src/components/AppTopBar.tsx](src/components/AppTopBar.tsx): barra superior con notificaciones, acciones y menú de perfil.
- [src/components/DashboardSidebar.tsx](src/components/DashboardSidebar.tsx): navegación lateral.
- [src/components/ProfileMenu.tsx](src/components/ProfileMenu.tsx): avatar, cambio de foto, logout e inicio de sesión.
- [src/components/FilterPanelRegistros.tsx](src/components/FilterPanelRegistros.tsx): filtros del historial.
- [src/components/FilterPanelGastos.tsx](src/components/FilterPanelGastos.tsx): filtros de gastos programados.

### Tipos

- [src/types/profile.ts](src/types/profile.ts): forma del perfil de usuario.
- [src/types/transaction.ts](src/types/transaction.ts): forma de los movimientos financieros.
- [src/types/scheduledTransaction.ts](src/types/scheduledTransaction.ts): forma de los gastos programados.

### Utilidades

- [src/utils/registrosFilters.ts](src/utils/registrosFilters.ts): lógica de filtros de registros.
- [src/utils/gastosFilters.ts](src/utils/gastosFilters.ts): lógica de filtros de gastos programados.
- [src/utils/pdfExport.ts](src/utils/pdfExport.ts): exportación a PDF.

## Flujo de autenticación

### Inicio de sesión

1. El usuario entra en [Login](src/screens/Login/Login.tsx).
2. `useAuth.login()` valida credenciales con Supabase.
3. Si se marca “Recordar mi sesión”, la sesión se persiste.
4. Si no se marca, la sesión queda temporal.
5. El acceso se redirige al dashboard o a configuración inicial según corresponda.

### Recuperación de contraseña

1. El usuario hace click en “¿Olvidaste tu contraseña?”.
2. Se abre [RecuperarClave](src/screens/RecuperarClave/RecuperarClave.tsx).
3. Se envía el correo con `supabase.auth.resetPasswordForEmail()`.
4. Supabase redirige a `/cambiar-clave`.
5. La pantalla [CambiarClave](src/screens/CambiarClave/CambiarClave.tsx) permite definir una nueva contraseña.
6. La contraseña se actualiza con `supabase.auth.updateUser()`.
7. Luego se vuelve al Login.

### Cambio de foto de perfil

1. El usuario abre [ProfileMenu](src/components/ProfileMenu.tsx).
2. Selecciona “Cambiar foto”.
3. La imagen se sube al bucket `avatars`.
4. La URL pública se guarda en `profiles.avatar_url`.
5. La app vuelve a mostrar la nueva imagen sin recargar toda la página.

## Base de datos y Supabase

### Tabla `profiles`

La app usa estos campos:

- `id`
- `monto_inicial`
- `is_configured`
- `avatar_url`

Ejemplo de ajuste aplicado:

```sql
alter table public.profiles
add column if not exists avatar_url text;
```

### Bucket de Storage

La subida de foto usa un bucket llamado `avatars`.

Necesitas tener:

- Bucket `avatars` creado.
- Permisos de lectura/escritura para usuarios autenticados.
- Policies de RLS configuradas en `storage.objects`.

### Recomendación de seguridad

- Mantén activada la política de RLS en `profiles`.
- Limita acceso a cada fila con `auth.uid() = id`.
- Permite escritura solo al usuario dueño de su perfil.
- Valida `storage.objects` para que cada usuario escriba solo en su carpeta.

## Variables de entorno

Crea un archivo `.env.local` con estas variables:

```bash
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_anon_key
```

## Configuración necesaria en Supabase

### Authentication

- Email provider habilitado.
- Redirect URLs permitidas:
  - `http://localhost:5173/cambiar-clave`
  - `https://solix.vercel.app/cambiar-clave`
- Opción de requerir sesión reciente para cambio de contraseña: recomendada para producción.

### Storage

- Crear bucket `avatars`.
- Revisar policies para insert, update y select según tu modelo de acceso.

## Scripts

```bash
pnpm dev
pnpm build
pnpm lint
pnpm preview
```

## Requisitos de desarrollo

- Node.js compatible con Vite 8.
- pnpm instalado.
- Proyecto configurado con Supabase.

## Cómo correr el proyecto

1. Instala dependencias.
2. Configura `.env.local`.
3. Asegura que Supabase tenga las tablas, bucket y policies.
4. Ejecuta:

```bash
pnpm dev
```

## Notas de implementación

- El cliente de Supabase se crea como singleton para evitar múltiples instancias.
- El cierre por inactividad se aplica en rutas protegidas.
- La interfaz usa TailwindCSS y mantiene consistencia visual entre pantallas.
- El proyecto ya incluye manejo de recuperación y cambio de contraseña de extremo a extremo.

## Estado actual del proyecto

- Login funcional.
- Registro funcional.
- Recuperación de contraseña funcional.
- Cambio de contraseña funcional.
- Cambio de foto de perfil funcional con Supabase Storage.
- Dashboard y módulos principales integrados.

## Troubleshooting

### No llega el correo de recuperación

- Verifica que el email provider esté habilitado.
- Verifica el correo en Auth Users.
- Revisa logs de Auth en Supabase.
- Confirma redirect URLs.

### Error de RLS al cambiar la foto

- Revisa policies de `public.profiles`.
- Revisa policies de `storage.objects`.
- Verifica que el bucket `avatars` exista.

### El avatar no aparece

- Confirma que `profiles.avatar_url` se está guardando.
- Revisa que la URL devuelta por Storage sea pública o accesible.

## Licencia

Este proyecto no incluye licencia explícita.
