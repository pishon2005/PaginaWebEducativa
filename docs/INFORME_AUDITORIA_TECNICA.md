# Informe de auditoría técnica — FASE 10

## 1. Resumen ejecutivo

Se contrastaron los documentos de arquitectura con el código actual, se revisaron las dependencias, límites cliente/servidor, Auth, datos demo, configuración de Drizzle y rutas, y se hicieron smoke tests del navegador.

**Conclusión:** el proyecto compila y las rutas de muestra revisadas son adaptables. Supabase Auth está integrado en código pero no probado en remoto. La aplicación no está lista para operar con información académica, pagos o cuentas reales: faltan el modelo de perfiles/roles, persistencia de negocio y políticas RLS verificables. No se halló una vulnerabilidad de explotación crítica o alta confirmada en el código examinado.

| Nivel | Resultado |
|---|---|
| Crítico | Ningún hallazgo confirmado. |
| Alto | Bloqueo de producción confirmado: el backend de negocio, la autorización por recurso y RLS aún no están implementados. Es una limitación arquitectónica, no una explotación observada. |
| Medio | Avisos de dependencias de desarrollo y riesgo condicionado de usar Drizzle sin contexto de autorización. |
| Bajo | Aviso de `deepmerge` en la herramienta de desarrollo y mejoras de rendimiento por medir. |

## 2. Alcance y límites

Se revisaron `INVENTARIO_FRONTEND.md`, `REGLAS_NEGOCIO_Y_MODELO_DATOS.md`, `AUTENTICACION_Y_SEGURIDAD.md`, `ARCHIVOS_STORAGE_Y_MATERIALES.md`, `CHAT_NOTIFICACIONES_Y_REALTIME.md`, `API_CONTRACT.md`, `openapi.yaml`, `VERCEL_DEPLOYMENT.md`, `SEGUIMIENTO_IMPLEMENTACION.md`, los contratos/modelos Zod, esquemas Drizzle, clientes Supabase, Proxy, layouts, Server Actions y configuración del proyecto.

La verificación fue local y estática salvo los smoke tests de navegador/rutas. No se contó con variables de entorno reales, proyecto Supabase, datos de prueba remotos ni despliegue Vercel. No se ejecutaron pruebas de explotación, consultas remotas, migraciones, reglas RLS ni operaciones de Storage/Realtime. No se afirma que Auth o RLS hayan sido probados en producción.

## 3. Hallazgos por severidad

### Críticos

- **Ninguno confirmado.**

### Altos

- **Bloqueo de producción, no vulnerabilidad explotada:** no existen servicios/persistencia para las operaciones académicas y administrativas ni un perfil institucional que asigne roles. Las rutas de panel no autorizan por rol y no hay RLS completa, efectiva y verificada; el SQL legacy contiene solo un borrador incompleto. No se deben conectar datos reales ni habilitar módulos de negocio. El código mantiene los paneles en estado pendiente cuando Auth está configurado y falla cerrado en producción si faltan variables Supabase.

### Medios

- **Autorización de Drizzle pendiente (riesgo condicionado):** `getDb()` usa una conexión PostgreSQL de servidor que no establece automáticamente `auth.uid()`/JWT. No tiene consumidores actualmente. Si se usa con una conexión privilegiada para consultas de usuario podría eludir RLS; la configuración debe permanecer inactiva para ese uso hasta definir y probar un contexto autorizado.
- **Vulnerabilidades en dependencias de desarrollo:** `npm audit` reporta 23 moderadas, todas en el árbol de desarrollo. No se reportaron vulnerabilidades en producción. Ver detalle en la sección 6.
- **SQL legacy con RLS parcial/no utilizable (riesgo no desplegado):** `database_schema.sql` activa RLS para ocho tablas, pero define políticas solo para `usuarios`. Las políticas llaman `current_user_id()` antes de declarar la función, cuyo cuerpo es un placeholder que devuelve `NULL`; no es evidencia de autorización efectiva y podría impedir una ejecución limpia del script o denegar el acceso esperado. No se ejecutó ni se sabe que esté desplegado.

### Bajos

- **Dependencia de desarrollo:** `deepmerge` (vía `shadcn`) reporta un riesgo de contaminación de prototipos en objetos devueltos. No está en el árbol de producción.
- **Rendimiento por medir:** Next.js mostró avisos de imagen candidata LCP para `/img/python.webp` y `/img/icono_crecimiento.webp`. Es una señal para medir y revisar carga, no una medición de degradación de Core Web Vitals.

### Corregido durante la auditoría

- El inventario conservaba afirmaciones históricas incorrectas sobre ausencia completa de Auth e incluía `demoUsers` como dato actual. Se actualizó para reflejar el código y separar Auth preparado de autorización/RLS aún pendientes.
- El catálogo y perfiles públicos presentaban cursos, perfiles, precios, reseñas y métricas de ejemplo sin un aviso general. El layout público ahora identifica la demo e indica que checkout no procesa pagos y que no se deben ingresar datos personales ni realizar pagos.

## 4. Arquitectura y seguridad

### Autenticación, sesiones y roles

- Los flujos de Supabase Auth SSR/PKCE, cookies, login/logout, recuperación, callback y cambio de contraseña existen en código. No fueron verificados con Supabase remoto.
- `src/proxy.ts` usa claims para una comprobación optimista de sesión, no para asignar el rol institucional. El layout de dashboard vuelve a validar el usuario en servidor. Como no existe el modelo aprobado de rol/permisos, un usuario autenticado se envía a acceso pendiente.
- Sin variables Supabase, las rutas protegidas responden 503 en producción. La demo de paneles solo se habilita en desarrollo sin configuración, no crea una sesión Auth y muestra una advertencia visible.
- Los Server Actions validan sus entradas en servidor. La acción de selección de rol demo se limita al entorno local sin Supabase y no constituye una autorización real. No se detectó una ruta que conceda permisos administrativos a partir del pathname o de metadata editable.
- Rate limiting, recuperación remota, renovación/expiración y pruebas de acceso cruzado por rol/usuario siguen pendientes.

### Separación cliente/servidor y secretos

- Drizzle, los esquemas de base de datos, el cliente Supabase de servidor y los contratos de servicios están protegidos con `server-only`. La búsqueda de importaciones no encontró importaciones directas de esos módulos desde componentes cliente. El build confirmó que la frontera actual compila.
- El sidebar referencia una Server Action de logout siguiendo el mecanismo de Next.js; no importa credenciales ni Drizzle al navegador.
- No se encontró uso de `service_role`, claves privadas, tokens ni credenciales activas en el código revisado. Las variables de proceso `DATABASE_URL`, `DATABASE_MIGRATION_URL` y las de Supabase están ausentes; solo se encontró `.env.example`, con valores vacíos para variables secretas.
- Hay cuentas, identidades, importes, estadísticas, conversaciones y registros ficticios en fixtures. Las cuentas de navegación demo están en módulo `server-only` y solo se aceptan localmente en desarrollo sin Supabase. Los registros de panel muestran una advertencia de demo.

### PostgreSQL, Drizzle y RLS

- `src/lib/db/index.ts` crea Drizzle de forma lazy y `server-only`; Postgres.js configura `prepare: false`, `max: 1` e `idle_timeout: 20`. Drizzle Kit usa `DATABASE_MIGRATION_URL`, separada de `DATABASE_URL`.
- No se encontraron llamadas a `getDb()` fuera de su definición. No se probaron poolers, SSL, límites de conexión ni consultas contra Supabase.
- El esquema Drizzle y el SQL legacy no constituyen el modelo aprobado de producción. El archivo SQL contiene un borrador incompleto de RLS (ocho tablas activadas, tres políticas en `usuarios` y helper de identidad placeholder); no hay migraciones definitivas ni evidencia de que se haya aplicado a un proyecto. No presentar RLS como instalada, completa o verificada.

### Vercel

- Next.js detecta automáticamente el framework; no se necesita `vercel.json` para la configuración actual. El build local funciona. No se hizo deploy ni se configuraron Preview/Producción.
- Mantener aisladas las variables y los proyectos Supabase por entorno. No agregar `DATABASE_MIGRATION_URL` ni `SUPABASE_SERVICE_ROLE_KEY` al runtime de Vercel sin una operación aprobada que lo requiera.

## 5. Datos, privacidad y demos

- El frontend mezcla contenido público de muestra con formularios visuales y fixtures. Checkout no persiste ni procesa pagos; los archivos, tareas, asistencia, chat y notificaciones tampoco están conectados a backend real.
- Se mantiene la eliminación progresiva: no se retiraron fixtures ni cuentas que sostienen vistas. El nuevo aviso público reduce la posibilidad de confundir el catálogo de muestra con ofertas verificadas.
- Antes de producción, validar los cursos, biografías, productos, precios, reseñas y cualquier cifra con la institución; reemplazar cada fixture solamente cuando exista una fuente real probada.
- No hay almacenamiento binario/Base64 en PostgreSQL ni Storage remoto integrado.

## 6. Auditoría de dependencias

Resultados de los comandos actuales:

| Comando | Resultado | Código de salida |
|---|---:|---:|
| `npm.cmd audit` | 25 avisos: 2 bajos, 23 moderados, 0 altos, 0 críticos. Todos en dependencias de desarrollo. | 1 |
| `npm.cmd audit --omit=dev` | 0 avisos. | 0 |

Los cuatro paquetes directos que originan las cadenas afectadas son dependencias de desarrollo: `drizzle-kit@0.31.11`, `eslint@9.39.5`, `eslint-config-next@16.4.4` y `shadcn@4.23.0`. El informe de auditoría asociado enumera las 25 entradas del árbol y sus dependencias transitivas.

| Paquete vulnerable | Actual | Severidad y rango reportado | Alcance / cadena | Remediación identificada |
|---|---:|---|---|---|
| `deepmerge` | 4.3.1 | Baja; `>=4.2.0 <=4.3.1` | Transitiva de `shadcn` → `@shadcn/registry`. Riesgo de prototype poisoning en el resultado de `mergeObject()`. | npm ofrece `shadcn@1.0.0`, un downgrade/cambio mayor; no aplicado. Revisar una versión compatible del generador que actualice la cadena. |
| `esbuild` | 0.18.20 | Moderada; `<=0.24.2` | Transitiva de Drizzle Kit mediante `@esbuild-kit`. Un sitio podría enviar solicitudes al servidor de desarrollo y leer respuestas. | npm ofrece `drizzle-kit@0.18.1`, downgrade incompatible; no aplicado. Actualizar Drizzle Kit solo cuando la ruta compatible elimine la cadena vulnerable y pasen sus pruebas. |
| `minimatch` | 10.2.6 | Moderada; `<11.0.1` | Transitiva de ESLint/TypeScript-ESLint y `ts-morph`/shadcn. Posible DoS por amplificación de `globparts`. | La primera versión no afectada indicada por el rango es `11.0.1`; npm propone bajar ESLint a 4.0.0, `eslint-config-next` a 12.0.4 o shadcn a 1.0.0. No aplicado; evitar override global sin comprobar compatibilidad. |

No se ejecutó `npm audit fix --force`, no se cambiaron dependencias y no se recomienda un downgrade incompatible. Estos avisos afectan el entorno de herramientas/CI; el resultado de producción sin devDependencies fue limpio en esta ejecución.

## 7. Frontend, responsive y rendimiento

- Se probaron en navegador 11 rutas representativas: inicio, catálogo, checkout, login, dashboards de admin/profesor/alumno/superadmin, cursos admin y chat de profesor/alumno.
- En 360, 768, 1024 y 1440 px, las 44 combinaciones respondieron HTTP 200 y `documentElement.scrollWidth` no superó el ancho de viewport. Se comprobó el aviso público en los cuatro anchos y que el menú móvil de admin abre y muestra navegación.
- Se capturó/revisó la vista móvil del dashboard admin con menú abierto. El muestreo no equivale a una inspección visual exhaustiva de las 62 páginas identificadas por el build.
- No se reportaron rutas rotas en las rutas de humo. El build generó rutas estáticas/dinámicas; la autenticación real y los módulos de negocio no se probaron contra servicios.
- React Query tiene un proveedor global, pero no hay adaptadores/consultas de datos de negocio que permitan evaluar duplicación de solicitudes. No se midieron Web Vitals, Lighthouse, rendimiento de dispositivos reales ni carga remota.
- Durante navegación local, Next mostró advertencias de preload no usado y de imágenes identificadas como candidatas LCP. Medir antes de cambiar prioridades/loading; una prueba de consola no demuestra por sí sola una regresión percibida.

## 8. Contratos y OpenAPI

- Los contratos de `API_CONTRACT.md` distinguen operaciones implementadas en código, preparadas como tipos y pendientes/demo; no hay adaptadores de negocio.
- `docs/openapi.yaml` se parseó como YAML; se comprobó `openapi: 3.1.0` y que el único endpoint personalizado descrito es `GET /auth/callback`. Auth, Storage y Realtime no se duplican como endpoints de la aplicación.
- No existe suite automatizada ni script de test. No se añadió un framework; considerar pruebas acotadas para esquemas Zod y reglas puras antes de conectar módulos.

## 9. Verificaciones ejecutadas

| Verificación | Resultado |
|---|---|
| `npm.cmd run lint` | Correcto, sin errores. |
| `npx.cmd tsc --noEmit` | Correcto, sin errores. |
| `npm.cmd run build` | Correcto en Next.js 16.4.4; generó rutas App Router y Proxy. |
| `npm.cmd audit` | 25 avisos de desarrollo, detallados arriba. |
| `npm.cmd audit --omit=dev` | Correcto; 0 vulnerabilidades. |
| Parseo/estructura de OpenAPI | Correcto; YAML válido y assertion OAS 3.1.0/path único. |
| Navegador responsive | Correcto para 44 combinaciones de ruta/ancho; menú móvil verificado. |
| Smoke test del build de producción sin Supabase | `/admin`, `/superadmin`, `/profesor` y `/alumno` responden 503; `/login` y `/` responden 200 sin controles/cuentas demo. |
| `git diff --check` | Correcto; informe nuevo también revisado por espacios finales. |

No se hicieron pruebas remotas de Auth, PostgreSQL, RLS, Storage, Realtime o Vercel, ni migraciones o despliegues.

## 10. Recomendaciones antes de producción

1. Aprobar el modelo definitivo de perfiles/roles y relaciones; diseñar y probar RLS tabla por tabla y para Storage/Realtime, incluidos intentos negativos de acceso cruzado.
2. No usar Drizzle para operaciones ordinarias de usuario hasta definir y probar el rol/contexto de conexión. Preferir un cliente Supabase con JWT/RLS cuando se ajuste al contrato.
3. Implementar cada módulo con autorización en servidor o RLS efectiva y reemplazar fixtures de manera incremental; comprobar que `Action` y `Route Handler` validan nuevamente identidad, permisos, propiedad y relación académica.
4. Probar Auth, cookies, PKCE, expiración, recuperación, rate limiting y callback en un proyecto Supabase aislado.
5. Configurar Preview y producción separadamente; no desplegar credenciales reales a partir de este entorno.
6. Reevaluar avisos del árbol de desarrollo cuando existan actualizaciones compatibles; repetir ambos `npm audit` tras cada cambio.
7. Añadir pruebas unitarias/integración locales ligeras para validaciones y reglas puras; ejecutar mediciones reales de rendimiento/responsive antes de optimizar.

**Control de fase:** la FASE 10 queda limitada a auditoría, corrección documental y transparencia de la demo. No se creó esquema SQL, migración ni política ejecutable. Esperar autorización expresa antes de iniciar la FASE 11.

## Actualización FASE 14.5 — Limpieza frontend

Se completó la retirada de datos ficticios funcionales y simulaciones de autenticación. Se conservaron landing, identidad visual, formularios, tablas, navegación y componentes reutilizables; las operaciones sin backend ahora informan que están pendientes y no simulan persistencia. Los servicios `unavailable-*` centralizan estados vacíos para evitar inventar registros.

Resultado técnico: lint correcto con avisos no bloqueantes, TypeScript correcto, build de producción correcto y `git diff --check` correcto. La comprobación fue local; no constituye validación funcional de Auth, RLS, Storage, Realtime ni autorización por roles. No se inició la FASE 15.

## Actualización FASE 15 — Supabase Auth

La preparación SSR/PKCE existente se auditó y reutilizó. Login, logout, recuperación, callback y cambio de contraseña permanecen en la única fuente de identidad Supabase Auth. Se corrigió el bypass de rutas protegidas sin configuración en desarrollo, se eliminó el fallback de contraseña demo y se centralizó la validación de destinos internos.

No se ejecutaron pruebas contra usuarios reales, no se crearon cuentas remotas y no se modificaron Development, Production, migraciones, RLS, Storage o Realtime. El flujo requiere validación posterior con un usuario de prueba controlado. La autorización institucional, perfiles, roles e invitaciones son pendientes de FASE 16.
