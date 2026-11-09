# Autenticación y seguridad

## Estado de implementación

La integración está preparada con `@supabase/ssr` y `@supabase/supabase-js`. El proyecto remoto de desarrollo está identificado, pero Auth remoto todavía no se ha configurado ni probado; el perfil `.env.development.local` contiene únicamente la URL y la clave publicable, sin conexiones PostgreSQL ni clave privilegiada.

- PKCE se configura en los clientes de navegador y servidor.
- El cliente de navegador es singleton; el cliente de servidor es por solicitud y usa cookies de Next.js.
- [`src/proxy.ts`](../src/proxy.ts) actualiza/valida optimistamente claims, renueva cookies y protege las rutas `/admin`, `/superadmin`, `/profesor` y `/alumno`.
- Los layouts de panel verifican el usuario nuevamente en servidor mediante `auth.getUser()`.
- Login, logout, recuperación y restablecimiento de contraseña están implementados mediante Server Actions/Route Handler y el flujo de cookies SSR.
- El callback `/auth/callback` intercambia el código PKCE por una sesión y solo acepta destinos locales.
- La recuperación responde de forma genérica para no confirmar si una cuenta existe.
- El restablecimiento requiere una sesión válida del callback, valida la nueva contraseña en servidor y cierra la sesión al terminar.
- La sesión persistente estándar de Supabase permanece habilitada mediante cookies SSR; se eliminó el checkbox "Mantener sesión" porque no controlaba ninguna opción real de sesión temporal.
- El registro público no crea cuentas. Las cuentas deben venir de una invitación autorizada; el flujo de invitación aún no se implementa.

## Roles y autorización: bloqueo intencional

Los cuatro roles permitidos en el dominio son `superadmin`, `admin`, `profesor` y `alumno`. Aún no existe un modelo de perfil/permisos aprobado e implementado en PostgreSQL que relacione de forma segura una identidad de Supabase Auth con uno de esos roles.

Por ese motivo:

- No se usan `user_metadata`, `app_metadata`, `sessionStorage`, el pathname ni datos enviados por el cliente como fuente de rol.
- Si Supabase está configurado, el login crea la sesión y dirige a una pantalla que informa que el acceso está pendiente. Las rutas del panel están protegidas y el layout vuelve a comprobar al usuario.
- El acceso a paneles falla cerrado hasta aprobar e implementar el perfil y las políticas RLS.
- Actualmente no existe navegación demo en rutas protegidas: si faltan las variables públicas de Supabase, el Proxy redirige a `/login?error=auth-config` también en desarrollo. Las pantallas públicas pueden seguir renderizando estados vacíos, pero nunca crean una sesión ni conceden permisos reales.
- Los servicios, Server Actions y Route Handlers que consulten datos protegidos deberán volver a autorizar en servidor; el Proxy no reemplaza esos controles.

No se implementa invitación administrativa. Para hacerlo hacen falta el perfil y permiso de administrador, reserva, pago verificado e inscripción relacionados; la validación debe ocurrir en servidor y la clave `service_role` debe permanecer exclusivamente en servidor. La clave administrativa está documentada como reservada y actualmente no se consume.

## Variables de entorno

`.env.example` contiene nombres sin valores:

| Variable | Alcance | Uso |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Pública | URL del proyecto Supabase. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Pública | Clave publicable para clientes SSR/navegador. No concede privilegios por sí sola; RLS es obligatoria. |
| `NEXT_PUBLIC_SITE_URL` | Pública | URL canónica usada para callback de recuperación; en desarrollo puede omitirse y se usa `http://localhost:3000`. |
| `DATABASE_URL` | Servidor | Conexión de ejecución PostgreSQL de Drizzle; no se lee desde los clientes Supabase de Auth. En Vercel debe usar el pooler runtime y no establecerse hasta aprobar el uso de Drizzle con autorización/RLS. |
| `DATABASE_MIGRATION_URL` | Solo operador/migraciones | Conexión directa o de sesión para Drizzle Kit. No configurar como variable runtime de Vercel ni usarla durante el build/deploy. |
| `SUPABASE_SERVICE_ROLE_KEY` | Exclusiva de servidor | Reservada para una futura invitación revisada; no usada. Nunca exponer al navegador. |

Para desarrollo local, usar valores impresos por `supabase start` en `.env.local`; para Development remoto, usar `.env.development.local` únicamente en un proceso lanzado con `NODE_ENV=development`. Next.js resuelve, en orden, `process.env`, `.env.development.local`, `.env.local`, `.env.development` y `.env`; por tanto, con `npm run dev`, `.env.development.local` prevalece sobre `.env.local` cuando ambas definen la misma variable. Debe revisarse la URL efectiva antes de cada prueba para no mezclar destinos. Ambos archivos están ignorados por Git; no copiar claves reales al repositorio. En producción, configurar las variables en el entorno de Vercel. El despliegue no debe habilitar paneles hasta tener perfil, roles y RLS implementados.

## Controles de datos

- Habilitar y probar RLS en cada tabla de PostgreSQL antes de conectar módulos.
- Aplicar políticas por identidad, propietario, rol autorizado y relación académica.
- No confiar en guards del frontend ni en claims manipulables.
- Los clientes privilegiados no deben usarse para operaciones de usuario; se reservarán a tareas administrativas justificadas.
- No registrar contraseñas, cookies, JWT, códigos PKCE ni claves en logs.
- Mantener cookies gestionadas por `@supabase/ssr`; no escribir tokens manualmente en `localStorage` o `sessionStorage`.
- Aplicar controles equivalentes en cada Server Action, Route Handler, servicio, repositorio y operación administrativa real.

## Verificación y límites

El proyecto Development está vinculado al CLI, pero las migraciones siguen pendientes y la conexión PostgreSQL remota no pudo validarse porque falta la contraseña del proyecto. Por tanto, login remoto, persistencia real de sesión, renovación/expiración remota, envío de correo, callback PKCE real y logout remoto no se pueden declarar probados. La validación local cubre compilación, lint, tipos y health de Auth local. No existe suite automatizada de tests configurada.

Pendiente antes de habilitar acceso real:

1. Configurar proyecto/URLs permitidas y plantillas de correo en Supabase.
2. Aprobar e implementar perfil institucional, asignación de roles y RLS.
3. Implementar autorización de cada operación de servidor.
4. Implementar invitaciones solo después de conectar pago verificado, reserva e inscripción.
5. Probar roles, cuentas, sesión expirada, recuperación y permisos con un proyecto de prueba dedicado.
6. Definir protección de rate limiting y restricciones anti-abuso para formularios de autenticación.
7. Eliminar cualquier variable privilegiada no utilizada de los archivos de entorno de ejecución antes de compartirlos o ejecutar procesos remotos; `SUPABASE_SERVICE_ROLE_KEY` no forma parte del flujo actual de Auth.

## FASE 15.2 — Auditoría de preparación para pruebas reales

### Estado remoto no verificado

No se consultó ni modificó el Dashboard de Development. Antes de probar Auth se debe verificar manualmente:

- Site URL y Redirect URLs, incluyendo exactamente `/auth/callback`.
- Proveedor Email habilitado.
- Confirm Email según la política institucional.
- `Allow new users to sign up` deshabilitado.
- Anonymous sign-ins deshabilitado.
- SMTP y remitente configurados para el entorno de prueba.
- Plantilla de recuperación compatible con el enlace PKCE de Supabase.
- Política de contraseñas compatible con la validación de la aplicación.
- Duración de sesión, refresh token y expiración configurados según la política aprobada.

### Trigger y sincronización de correo

`public.create_basic_profile_for_auth_user()` se ejecuta únicamente con un trigger `AFTER INSERT ON auth.users`. En ese momento copia `NEW.email_confirmed_at IS NOT NULL` a `public.usuarios.email_verificado`.

La auditoría del repositorio no encontró ninguna actualización posterior de `email_verificado`, ningún trigger `UPDATE` sobre `auth.users` para sincronizarlo y ninguna política o función que consulte ese campo. La autorización actual depende de `usuarios.activo`, `usuarios.estado` y `roles`, no de `email_verificado`.

Por tanto, una confirmación posterior del correo puede dejar el campo institucional desactualizado. La solución mínima recomendada es definir, antes de usar ese campo para autorización o activar cuentas, un trigger `AFTER UPDATE OF email_confirmed_at ON auth.users` con una función `SECURITY DEFINER` de `search_path` fijo que actualice únicamente el perfil correspondiente. No se implementa en esta fase; alternativamente, puede declararse `email_verificado` como dato informativo y consultar Auth en el flujo que realmente requiera confirmación.

### Entornos y URL de recuperación

La aplicación solo lee variables públicas de Supabase desde `src/lib/supabase/config.ts`. Los clientes Auth no leen claves privilegiadas. La URL efectiva de `resetPasswordForEmail()` es:

`{NEXT_PUBLIC_SITE_URL}/auth/callback?next=/reset-password`

Con la configuración local auditada, el origen esperado es `http://localhost:3000`, por lo que la URL exacta es:

`http://localhost:3000/auth/callback?next=/reset-password`

Para Development remoto debe sustituirse `NEXT_PUBLIC_SITE_URL` por el dominio autorizado que se utilice en la prueba. El callback intercambia el código PKCE y limita el destino a rutas internas.

### Preflight seguro para Development

Antes de iniciar la aplicación para una prueba remota, ejecutar desde PowerShell sin imprimir valores:

```powershell
$expected = "https://rxncsqoyovcwndgguxii.supabase.co"
$url = (Get-Content .env.development.local | Where-Object { $_ -match '^NEXT_PUBLIC_SUPABASE_URL=' }) -replace '^NEXT_PUBLIC_SUPABASE_URL=', ''
$url = $url.Trim().TrimEnd('/')
$keyPresent = (Get-Content .env.development.local | Where-Object { $_ -match '^NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=\S+' }).Count -gt 0
$sitePresent = (Get-Content .env.development.local | Where-Object { $_ -match '^NEXT_PUBLIC_SITE_URL=\S+' }).Count -gt 0
Write-Output "Destino: $url"
Write-Output "Project Reference correcto: $($url -eq $expected)"
Write-Output "NEXT_PUBLIC_SUPABASE_URL presente: $([bool]$url)"
Write-Output "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY presente: $keyPresent"
Write-Output "NEXT_PUBLIC_SITE_URL presente: $sitePresent"
Write-Output "Resultado: $(if ($url -eq $expected -and $keyPresent -and $sitePresent) { 'APTO para iniciar en Development' } else { 'NO APTO' })"
```

La comprobación anterior inspecciona el archivo remoto y no prueba la precedencia de un `process.env` ya exportado. Antes de `npm run dev`, limpiar cualquier variable Supabase heredada del proceso o abrir una consola nueva y repetir el preflight. No ejecutar esta prueba con `.env.local` seleccionado, porque apunta a Supabase Local.

### Cuenta sintética e invitación

No crear todavía la cuenta. Cuando exista autorización explícita, usar exclusivamente una dirección sintética controlada por el usuario en **Supabase Dashboard → Authentication → Users → Add user → Send invitation**. No usar datos de alumnos ni cuentas institucionales. El trigger `auth_user_profile_bootstrap` creará el perfil asociado, asignará `estudiante` y dejará `pendiente`; no debe aceptarse ningún rol enviado en metadata.

El SMTP predeterminado de Supabase tiene restricciones de entrega, límites de envío y puede estar limitado a direcciones autorizadas del proyecto. Para pruebas reales con otros destinatarios o mayor volumen se requiere SMTP personalizado. No se configura SMTP ni se envían correos en esta fase.

### FASE 15.3.1 — Cierre de preparación

La plantilla de recuperación debe conservar el destino recibido por Supabase usando `{{ .RedirectTo }}` en el enlace de recuperación, en lugar de reconstruir una URL fija. La aplicación envía:

`{NEXT_PUBLIC_SITE_URL}/auth/callback?next=/reset-password`

El callback recibe el código PKCE, intercambia la sesión y redirige internamente a `/reset-password`. No se modifica la plantilla ni la configuración remota durante esta fase.

`email_verificado` sigue siendo un campo potencialmente desactualizado después de confirmar el correo. Antes de la Fase 16 se recomienda una migración autorizada con sincronización segura desde `auth.users.email_confirmed_at`, o declarar Auth como fuente primaria y no usar el duplicado para autorización.

La cuenta sintética ya fue confirmada por Supabase y registra un inicio de sesión. No se debe reenviar la invitación ni crear otra cuenta. Para esa cuenta, el siguiente paso es usar exclusivamente el flujo de recuperación PKCE existente.

### Aceptación de invitaciones

Las invitaciones futuras de Supabase no reutilizarán el callback PKCE de recuperación. El endpoint local `GET /auth/confirm` queda preparado para una plantilla personalizada con `token_hash`; además, `/auth/invite` queda preparado para la plantilla predeterminada `{{ .ConfirmationURL }}`, que entrega la sesión en el fragmento del navegador. La página elimina el fragmento, usa `setSession()` y redirige a `/reset-password?flow=invite` sin registrar tokens ni aceptar destinos externos.

La plantilla Invite User de Development debe configurarse manualmente, después de revisar el Site URL:

```html
<h2>Invitación a EDUKATECH</h2>
<p>Has sido invitado a crear tu cuenta en EDUKATECH.</p>
<p><a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=invite">Aceptar invitación y establecer contraseña</a></p>
<p>Si no esperabas esta invitación, puedes ignorar este mensaje.</p>
```

La plantilla de recuperación no se modifica: conserva `{{ .RedirectTo }}` y el callback PKCE `/auth/callback?next=/reset-password`. La aceptación de invitación y la recuperación solo permiten cambiar la contraseña después de validar una sesión Supabase en servidor.

### Estado de la cuenta sintética

La cuenta `930c12e7-4502-479e-8df2-ed83e9d2db2b` fue confirmada el 2026-11-07 y registró `last_sign_in_at` en ese momento, según la verificación manual del usuario. La invitación anterior no debe reutilizarse como mecanismo de recuperación. No se consultaron tokens ni se realizaron cambios remotos en esta actualización.
