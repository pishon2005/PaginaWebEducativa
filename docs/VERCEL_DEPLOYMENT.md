# Preparación de despliegue en Vercel

## Estado

El proyecto está configurado como aplicación Next.js 16.4.4 App Router y el build de Next.js genera rutas estáticas/dinámicas y un `Proxy`. No se creó `vercel.json`, no se realizó despliegue y no se probaron credenciales remotas. Vercel detecta Next.js desde `package.json`; no se debe forzar salida estática.

La aplicación todavía es principalmente demo y sus paneles dependen de datos locales. Auth está integrado en código pero no verificado contra Supabase; perfiles/roles/RLS y datos reales siguen pendientes. **No habilitar tráfico productivo de módulos de negocio** hasta desplegar un modelo y políticas probados.

## Configuración de compilación

Configuración actual del paquete:

| Ajuste                     | Valor                                                                                                                                                                      |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework                  | Next.js detectado automáticamente                                                                                                                                          |
| Instalación                | `npm install` / lockfile `package-lock.json`                                                                                                                               |
| Build                      | `npm run build` (en Windows local: `npm.cmd run build`)                                                                                                                    |
| Desarrollo                 | `npm run dev`                                                                                                                                                              |
| Inicio local de producción | `npm run start`                                                                                                                                                            |
| Lint                       | `npm run lint`                                                                                                                                                             |
| TypeScript                 | `npx tsc --noEmit`                                                                                                                                                         |
| Output directory           | Dejar el valor automático de Next.js/Vercel; no declarar `out` ni export estático                                                                                          |
| Node.js                    | Runtime Node.js administrado por Next.js/Vercel; fijar versión de Node compatible en Vercel al aprobarla. La versión de Node no está fijada en `package.json` actualmente. |
| Funciones                  | Route Handlers/Server Actions quedan en runtime Next.js administrado; sin límites `maxDuration` configurados                                                               |
| Rutas                      | App Router; no se necesita configuración manual para `src/app` ni rewrite de `/auth/callback`                                                                              |

No añadir `vercel.json` para repetir defaults automáticos. Añadir configuración solo si se aprueba una necesidad concreta (región, headers, redirects, cron o timeout) y probarla en Preview.

## Variables por entorno

Configurar cada entorno por separado en **Project → Settings → Environment Variables**. No copiar `.env.local` al repositorio, no colocar secretos en variables `NEXT_PUBLIC_*`, y no incluir valores en logs, capturas o documentación.

| Variable                               | Dev local                                                                     | Preview                                                                     | Producción                                                                     | Alcance / requisito                                                                                                                                      |
| -------------------------------------- | ----------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`             | URL del proyecto local/de desarrollo                                          | Proyecto Supabase aislado de preview                                        | Proyecto Supabase de producción                                                | Pública de configuración. No compartir proyectos entre preview y producción si los datos/usuarios no están aislados.                                     |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable key local                                                         | Publishable key de proyecto preview                                         | Publishable key de producción                                                  | Pública, diseñada para cliente; efectiva solo con RLS correcta. No equivale a service role.                                                              |
| `NEXT_PUBLIC_SITE_URL`                 | `http://localhost:3000` (puede omitirse en desarrollo según el helper actual) | URL canónica del deployment Preview elegido                                 | Dominio HTTPS canónico de producción                                           | Pública; debe coincidir con Supabase Auth Site URL/redirect allowlist. Evitar comodines amplios para previews.                                           |
| `DATABASE_URL`                         | Pool de ejecución local si se habilita Drizzle                                | Supavisor transaction pooler del proyecto de preview si se habilita Drizzle | Supavisor transaction pooler del proyecto de producción si se habilita Drizzle | Secreto solo servidor. No configurarlo en Vercel mientras los módulos no utilicen Drizzle.                                                               |
| `SUPABASE_SERVICE_ROLE_KEY`            | No establecer                                                                 | No establecer                                                               | No establecer                                                                  | Reservada; no existe cliente/operación que la consuma. No habilitar hasta diseñar una operación administrativa justificada; nunca `NEXT_PUBLIC_`.        |
| `DATABASE_MIGRATION_URL`               | Solo en máquina/entorno operador que ejecute Drizzle Kit                      | No establecer en runtime de Vercel                                          | No establecer en runtime de Vercel                                             | Secreto de operador para migraciones, directa o Supavisor session pooler. Separada de la URL de ejecución. No ejecutar migraciones durante build/deploy. |

`.env.example` contiene los nombres sin valores. Para crear `.env.local`, copiar el ejemplo y completar únicamente secretos recibidos del proyecto correcto. `.gitignore` excluye `.env*` excepto `.env.example`.

### Separación local, preview y producción

1. **Local:** usar un proyecto Supabase local/aislado; callback permitido a `http://localhost:3000/auth/callback`. Mantener cuentas demo solo en el modo de desarrollo actual sin Supabase; nunca tratarlas como roles o datos Auth.
2. **Preview:** crear proyecto Supabase separado, con base/usuarios de prueba y RLS equivalente. Crear variables en Vercel solo para Preview. Configurar redirecciones Auth específicas para el hostname aprobado; no permitir cualquier subdominio/deployment si no es necesario.
3. **Producción:** variables del proyecto real y dominio canónico HTTPS. Usar cuentas/productos y RLS de producción; no fixtures. Activar cada módulo solo después de verificar login, RLS, permisos, carga y errores en Preview.
4. Mantener rotación/revocación de secretos en el proveedor. En un cambio de proyecto, verificar que URL y clave pertenezcan al mismo proyecto y que Redirect URLs coincidan exactamente.

## Supabase Auth y dominios de callback

El Route Handler existente es `GET /auth/callback`; intercambia código PKCE usando cookies SSR y redirige únicamente a una ruta local validada. En Supabase Auth registrar callbacks exactos para local, dominio Preview autorizado y dominio productivo; no incluir tokens en query strings propios, ni registrar el parámetro `code`. La integración no está probada contra un proyecto remoto y el acceso a dashboard queda pendiente de perfil/rol/RLS.

## Base de datos, Supavisor y Drizzle

### Runtime serverless

- La inicialización actual de `src/lib/db/index.ts` es lazy, está protegida con `server-only` y comparte un cliente `postgres` por instancia de función.
- El pool runtime requiere URL Supavisor de **transaction mode** cuando se ejecuta en Vercel serverless. `prepare: false` evita prepared statements del lado cliente, incompatibles con ese modo. El código limita cada instancia a `max: 1` y `idle_timeout: 20` para evitar que cada instancia cree un pool amplio y para cerrar conexiones ociosas.
- `DATABASE_URL` es solo para runtime. No aceptar una URL directa de base pública sin necesidad; mantener SSL/URL provista por Supabase y revisar `max connections` con concurrencia real antes de producción.
- No crear conexión al importar módulos, una conexión por consulta, ni llamar `end()` tras cada petición de una función reutilizable. El singleton no significa conexión eterna garantizada: Vercel puede congelar/descartar instancias; Postgres.js reconecta según el ciclo de ejecución.

### Migraciones

- Drizzle Kit usa `DATABASE_MIGRATION_URL` y falla explícitamente si no está configurada. La URL es de operador, no debe desplegarse como runtime.
- Para migraciones elegir conexión directa o Supavisor **session mode** según la accesibilidad de red/configuración del proyecto. No aplicar migraciones a través del pool transaction mode.
- Ejecutar migraciones de forma manual/CI controlada contra el entorno correcto, con revisión de SQL, backup/rollback y credencial de privilegio mínimo disponible. No correr `drizzle-kit migrate` automáticamente en `next build` o cada deployment.
- No hay historial de migraciones aprobado en esta fase. El esquema Drizzle actual diverge del modelo conceptual y no debe migrarse a una base real sin reconciliación, RLS, pruebas y revisión.

### Límite de autorización de Drizzle

El driver de servidor de Drizzle no lleva automáticamente la cookie Auth del usuario ni establece `auth.uid()`/claims de Supabase. Una conexión de `DATABASE_URL` con un rol propietario o privilegiado puede eludir RLS. El hecho de importar `getDb()` desde servidor **no** hace autorizada una consulta.

Antes de permitir consultas de usuario con Drizzle, elegir y probar una estrategia explícita: preferir Supabase JS con sesión/JWT del usuario para operaciones sujetas directamente a RLS; para operaciones SQL complejas, usar funciones transaccionales aprobadas invocadas bajo JWT/RLS o un rol DB de mínimo privilegio con contexto transaccional verificado y grants/policies probados. No simular `auth.uid()` en una conexión global. Nunca elevar a service role para una consulta normal.

## Rutas, funciones y datos

- Conservar Vercel/Next.js App Router; no configurar `output: "export"` ni servidor Express.
- Server Components leen mediante DAL `server-only` y devuelven DTO mínimos. Server Actions verifican entrada, sesión, permiso y pertenencia en cada invocación.
- Proxy realiza actualización de sesión y guard optimista, no autorización única. RLS de PostgreSQL y Storage es obligatoria.
- No pasar archivos grandes por Vercel. El browser transfiere directamente a Storage usando el mecanismo autorizado; los Route Handlers/Actions procesan solo metadatos/intent.
- No cachear respuestas privadas/perfiles/roles/archivos/chats entre usuarios. Catálogo público solo se cachea tras definir etiquetas y revalidación; no hay estrategia de caché productiva aprobada todavía.
- Mantener logs sin contraseñas, JWT, cookies, PKCE, URLs firmadas, comprobantes ni contenido privado.

## Despliegue inicial seguro

1. Confirmar que no hay cambios de demo/fixture empaquetados como datos de producción.
2. Crear proyecto Supabase de Preview y producción; configurar URL/keys y callback allowlist.
3. Reconciliar esquema, migraciones y RLS con pruebas directas de usuario anónimo y de cada rol.
4. Ejecutar local `npm run lint`, `npx tsc --noEmit`, `npm run build` y smoke tests con variables no productivas.
5. Configurar variables Vercel por entorno; **no** agregar `DATABASE_MIGRATION_URL` ni `SUPABASE_SERVICE_ROLE_KEY` mientras no haya justificación y operación revisada.
6. Desplegar Preview desde rama controlada; probar callback, redirecciones, errores, seguridad de rutas y consultas/Storage directas.
7. Promover a producción solo con autorización, pruebas contra entorno aislado satisfactorias y plan de migración/rollback.

No se ejecutó ningún deploy ni se contactó Supabase durante la FASE 9. El build local verifica compilación de Next.js, no la integración con una cuenta de Vercel.

## Decisiones pendientes

- Versión de Node.js fijada para Vercel.
- Región de Vercel y ubicación/región Supabase (latencia y residencia de datos).
- Proyecto dedicado para Preview, dominios y allowlist Auth.
- Aprobación del modelo final/migraciones; estrategia concreta de RLS para Drizzle.
- Si `DATABASE_URL` se habilita en Vercel, junto con límites de conexiones y pooler/proyecto correctos.
- Política para build/deploy promotion, rollback, copias, observabilidad, rate limiting, tareas programadas y proveedor de video.
- No se crea `vercel.json` hasta tener requisito verificable que no cubra la detección automática de Next.js.

## Referencias oficiales

- [Next.js: Deploying](https://nextjs.org/docs/app/getting-started/deploying)
- [Vercel: Next.js](https://vercel.com/docs/frameworks/nextjs)
- [Vercel: Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Supabase: Connect to Postgres](https://supabase.com/docs/guides/database/connecting-to-postgres)
- [Supabase: Supavisor](https://supabase.com/docs/guides/database/connecting-to-postgres#supavisor)
- [postgres.js: Options](https://github.com/porsager/postgres#options)
