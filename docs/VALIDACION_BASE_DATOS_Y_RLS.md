# Validación de base de datos y RLS — FASE 12

## Alcance y conclusión

Se revisaron las tres migraciones de `supabase/migrations/`, el esquema Drizzle, la configuración local de Supabase y el SQL consolidado. Se corrigió la extracción del UUID en `can_join_conversation_channel()` y se regeneró el consolidado desde las migraciones oficiales.

**Estado: las tres migraciones se aplicaron en Supabase local y `supabase db reset --local` terminó correctamente**, también después de corregir un `GRANT UPDATE` de perfil que quedaba anulado por un `REVOKE` posterior. El error anterior se debía a intentar cambiar RLS de `storage.objects`, tabla propiedad del rol administrado `supabase_storage_admin`. Se retiró esa activación explícita y también la equivalente para `realtime.messages`; Supabase mantiene RLS habilitada en ambas. La migración 003 ya no modifica privilegios SQL de `storage.objects`; no se cambió ningún propietario ni membresía de rol. Las políticas de Storage y Realtime se conservan.

Se confirmó por catálogos que las 32 tablas públicas tienen RLS, que `storage.objects` y `realtime.messages` tienen RLS, existen las tres políticas de Storage y las dos privadas de Realtime, y los siete buckets están privados. El contenido real de la migración 003 contiene 58 políticas públicas, 3 de Storage y 2 de Realtime, 63 en total; no 61 políticas públicas. La función `can_join_conversation_channel()` existe y la extracción de UUID se ejecuta correctamente. Se ejecutaron pruebas funcionales representativas de Storage y de las políticas por roles, y se volvió a probar Realtime localmente. **La matriz no cubre todas las operaciones, filas, roles, concurrencia ni escenarios de Realtime; RLS no se considera completamente verificada.** Se usaron únicamente claves locales; no se conectó ni modificó un proyecto remoto.

En FASE 14 se añadió inspección remota en modo dry-run. Development exige referencia, URL y límite global exactos; el modo predeterminado no escribe y Production se rechaza explícitamente. La creación remota queda pendiente de autorización independiente.

La comprobación del SDK instalado (`@supabase/supabase-js@2.118.0`) confirmó que reconoce claves `sb_secret_...` y las envía como `apikey`. Para las llamadas de Storage, el provisionador elimina además el `Authorization: Bearer` derivado de una clave no-JWT; así evita errores `Invalid Compact JWS` sin imprimir la clave. El inventario remoto real requiere ejecutar el comando con la clave administrativa en el proceso servidor.

La revisión de todas las migraciones y archivos SQL encontró una sola llamada a una función calificada con sintaxis especial incompatible: `pg_catalog.substring(topic FROM 14)`. Se reemplazó por `pg_catalog.split_part(topic, ':', 2)` después de la validación regex del tópico y antes del cast a UUID. No se identificaron otros casos de ese patrón en las migraciones ni en los SQL del repositorio.

## Migraciones y dependencias

Orden verificado:

1. `202501020001_initial_core_security.sql`: roles, perfil vinculado a `auth.users`, estados de cuenta, auditoría, funciones de timestamp y creación segura del perfil básico.
2. `202501020002_academics_enrollments.sql`: catálogo, cursos, secciones, horarios, sesiones, interesados, reservas, pagos, inscripciones, asistencia, tareas, entregas, quizzes y materiales.
3. `202501020003_privacy_storage_realtime.sql`: conversaciones, notificaciones y metadatos de archivos; autorización, RPC, RLS, Storage y Realtime.

Las referencias entre migraciones siguen ese orden. La migración 002 crea 21 tablas académicas; las tres migraciones crean 32 tablas en total. Se contabilizaron 63 relaciones FK y 35 índices. La consulta local confirmó RLS habilitada en las 32 tablas de `public`. El consolidado [supabase_setup.sql](../supabase/sql/supabase_setup.sql) se regeneró desde el contenido de las tres migraciones, en el mismo orden.

## Provisión controlada de Storage

La migración 003 ya no inserta ni actualiza `storage.buckets` y ya no ejecuta `GRANT`/`REVOKE` sobre `storage.objects`, porque ambas tablas son administradas por Supabase. [scripts/provision-storage-buckets.ts](../scripts/provision-storage-buckets.ts) exige `SUPABASE_SECRET_KEY` solo en el proceso servidor y `SUPABASE_STORAGE_GLOBAL_LIMIT_BYTES` previamente verificado. En Local mantiene la URL loopback y el aprovisionamiento existente; en Development exige referencia y URL exactas, y funciona en dry-run salvo confirmación explícita. Compara visibilidad, límite y MIME de los siete buckets; ante discrepancias termina antes de escribir y nunca usa `updateBucket()`. El segundo lanzamiento es un no-op cuando todo coincide.

La auditoría del repositorio encontró únicamente `download`, `update` de metadatos y `remove` por Storage API en [validate-private-file](../supabase/functions/validate-private-file/index.ts). No hay `.upload()`, `upsert: true`, `.move()`, `.copy()`, `.createSignedUrl()` ni operaciones reales de actualización de objetos en la aplicación; los formularios frontend siguen siendo demos. Por eso las políticas actuales no incluyen `UPDATE`.

### Validación aislada posterior a la corrección

Se creó una instancia Supabase Local temporal con puertos propios; el stack local existente no se reinició ni se reseteó. En la instancia aislada:

- Las tres migraciones modificadas se aplicaron en orden.
- Se confirmaron 32 tablas públicas con RLS habilitada.
- Se confirmaron 58 políticas públicas, 3 de Storage y 2 de Realtime (63 en total).
- Se confirmaron 63 claves foráneas, 28 funciones públicas y 17 triggers públicos.
- Los siete buckets quedaron privados con límites y MIME esperados; `documents`, `submissions` y `media` quedaron en 52.428.800 bytes.
- El provisionador creó un bucket faltante, fue no-op en la segunda ejecución y rechazó una discrepancia de límite/MIME sin sobrescribirla. La configuración se restauró mediante Storage API únicamente en el entorno temporal.
- El límite global se suministró como 52.428.800 bytes después de comprobar `supabase/config.toml`; sin esa variable el provisionador se detuvo antes de consultar o escribir.
- Una operación Storage administrativa local pudo cargar y descargar un objeto de prueba; el acceso anónimo al mismo objeto fue rechazado y el objeto se eliminó mediante Storage API.
- `can_join_conversation_channel()` devolvió `false` sin sesión; las dos políticas de Realtime permanecen presentes. No se creó una conversación ni usuarios de prueba en esta ejecución, por lo que no se declara una prueba WebSocket completa.
- El provisionador rechazó `SUPABASE_TARGET_ENV=production` y URLs no locales. No se conectó Development ni Production.

El consolidado es solo una referencia de lectura. Supabase CLI y los archivos ordenados de `supabase/migrations/` siguen siendo la única vía e historial oficial de aplicación.

## Drizzle y consistencia estructural

Se exportó el DDL desde el esquema Drizzle con Drizzle Kit (sin conexión a una base de datos) y se comparó estáticamente con las migraciones:

- 32 tablas y conjuntos de columnas coincidentes.
- 282 columnas comparadas; las únicas diferencias de texto detectadas fueron espacios en la representación de precisión/escala (`numeric(10, 2)` frente a `numeric(10,2)`).
- 63 FK coincidentes por tabla/columna de origen, destino y acción `ON DELETE`.
- Mismo conjunto de 35 índices y misma cantidad de restricciones `CHECK` por tabla.
- Se corrigieron una restricción de sección que faltaba en Drizzle y un índice que faltaba en SQL.
- Los nombres automáticos de algunas FK pueden diferir entre PostgreSQL y Drizzle Kit; no cambia su relación ni acción referencial, pero un diff futuro puede proponer renombrarlas. No se generó ni aplicó un historial Drizzle paralelo.
- `drizzle.config.ts` dirige cualquier salida de Drizzle Kit a `supabase/migration-drafts/`; no es un directorio de migraciones aplicables. `DATABASE_MIGRATION_URL` no se leyó ni se conectó.

`src/lib/db/schema/tables.ts` y `src/lib/db/index.ts` tienen `server-only`. `getDb()` no tiene referencias en el código de la aplicación. Una conexión directa de Drizzle no recibe automáticamente la identidad JWT del usuario y no debe usarse para consultas ordinarias que dependan de RLS. Las consultas de usuario deben usar Supabase SSR/JS con RLS; cualquier acceso Drizzle privilegiado futuro debe revalidar autorización en servidor y definir un contexto de seguridad comprobado, antes de implementarse.

## Políticas RLS: revisión estática por rol

Esta matriz describe las condiciones que expresan las políticas; **no es el resultado de pruebas con usuarios PostgreSQL/Supabase**.

| Rol | Lecturas permitidas por diseño | Escrituras permitidas por diseño |
|---|---|---|
| Anónimo | Categorías activas, cursos publicados y secciones activas. | Insertar interesados con datos de contacto mínimos; no puede leer tablas privadas. |
| Estudiante | Su perfil, reservas/pagos vinculados a su usuario, inscripciones, asistencias, entregas/intentos propios, recursos de secciones activas en las que está inscrito, conversaciones participantes, notificaciones propias y archivos autorizados. | Actualizar únicamente columnas de perfil concedidas; adjuntar mensajes como remitente autenticado; carga de archivos pendientes conforme a categoría y relación. Las operaciones de reserva/pago/inscripción y asistencia están restringidas a RPC autorizadas. |
| Docente | Sus secciones y datos académicos asignados; interesados de cursos con secciones propias; entregas y asistencias de sus secciones; conversaciones donde participa. | Gestionar contenidos de secciones asignadas y registrar asistencia mediante RPC; no puede asignarse otro rol ni gestionar secciones ajenas. |
| Administrador | Acceso administrativo a tablas autorizadas y a datos de negocio según RLS. | Operaciones críticas por RPC; gestión de catálogo/contenidos según políticas. No dispone de concesión directa para modificar `rol_id`; las asignaciones de rol requieren superadministrador. |
| Superadministrador | Permisos administrativos y lectura autorizada por las políticas. | Puede asignar roles y gestionar estados de otras cuentas mediante RPC; no puede elevarse a sí mismo por esas funciones. |

Las concesiones de columnas limitan cambios de perfil; `usuarios_update_self_or_admin` no es una barrera de rol por sí sola. La asignación de roles se limita con privilegios SQL y con `assign_user_role`. Las tablas privadas no reciben permisos anónimos; las nuevas tablas creadas por `postgres` tienen privilegios por defecto revocados. La prueba local detectó que un `REVOKE UPDATE ON public.usuarios` posterior anulaba el grant por columna. Se movió el grant permitido después de ese `REVOKE`; el perfil propio se actualizó por PostgREST y el cambio directo de `rol_id` siguió denegado.

### Matriz funcional representativa por rol

Las pruebas usaron Auth/JWT y la API local; no son una certificación exhaustiva de todas las combinaciones tabla/operación.

| Rol | Evidencia probada | Resultado |
|---|---|---|
| Anónimo | Lectura del catálogo público e intento de acceso a recursos privados de Storage. | Catálogo permitido; descarga de archivo privado denegada. La inserción de interesado se aceptó en una prueba acotada. No se probaron todas las tablas ni todos los payloads anónimos. |
| Estudiante | Lectura/aislamiento de datos propios y ajenos en tablas de negocio; perfil propio; archivo propio; conversaciones y notificaciones. | Los casos propios permitidos y los ajenos denegados probados respetaron sus políticas. Tras corregir el orden de grants, pudo actualizar campos permitidos de su perfil; `rol_id` fue rechazado por PostgREST. |
| Docente | Datos de secciones asignadas frente a secciones/registros no relacionados. | Los casos asignados permitidos y los ajenos denegados probados respetaron las políticas. No se cubrieron todas las escrituras ni tablas académicas. |
| Administrador | Acceso administrativo representativo y acceso a conversación en la que no participa. | Los datos administrativos probados siguieron sus políticas; ser administrador no permitió leer la conversación privada ajena. No se probaron todos los permisos administrativos. |
| Superadministrador | RPC de asignación de rol y cambio del propio rol. | El cambio de rol a otra cuenta se permitió en el caso probado y el cambio propio se rechazó. No se ejercitó la rama del último superadministrador ni concurrencia. |

Tablas/capacidades incluidas en la ronda representativa: usuarios y perfiles, cursos y secciones, reservas, pagos, inscripciones, asistencia, metadatos/objetos de archivos, conversaciones/mensajes y notificaciones. No implica cobertura de cada comando SQL, función o estado de cada tabla.

| Tabla o grupo | Resultado probado | Cobertura que falta |
|---|---|---|
| `usuarios`, `perfiles_docente` | Lectura propia/ajena en casos seleccionados; actualización de perfil propio permitida después de corregir el grant; `rol_id` no actualizable directamente. | Todas las columnas/roles, cambios administrativos por RPC y casos de cuenta inactiva. |
| `cursos`, `secciones` | Catálogo público anónimo y acceso de docente a secciones asignadas frente a no asignadas en casos seleccionados. | Todas las escrituras y estados de publicación/curso. |
| `reservas`, `pagos`, `inscripciones`, `asistencias` | Acceso relacionado con estudiante/docencia/administración y denegación de filas ajenas en casos representativos. | Todos los estados, RPC, operaciones directas y escenarios concurrentes. |
| `archivos_metadata`, `storage.objects` | A/B/anon probados en listar/consultar metadatos/descarga y borrado. B no vio el objeto ni los metadatos; anon recibió lista vacía y no tuvo permiso SQL para leer metadatos. Se probaron límites, MIME y validación de contenido; faltan otras combinaciones y categorías. | Todas las categorías y operaciones; matriz RLS exhaustiva. |
| `conversaciones`, `mensajes`, `realtime.messages` | Participante autorizado; no participante y administrador no participante denegados en pruebas realizadas. | WebSocket, cambios de membresía y todas las operaciones de mensajes/lecturas. |
| `notificaciones` | Lectura propia y aislamiento frente a otras cuentas en casos seleccionados. | Escrituras, RPC de marcado y acceso administrativo completo. |

### Ejecutor de migraciones, roles SQL y contexto RLS

- **Ejecutor observado localmente:** las 32 tablas públicas son propiedad de `postgres`, y `current_user`/`session_user` de la conexión de inspección son `postgres`; el historial local registra las tres migraciones. Esto confirma el contexto de la base local, no el de un proyecto remoto.
- **Default privileges:** `pg_default_acl` muestra revocaciones restrictivas de tablas, secuencias y funciones para objetos futuros creados por `postgres`; esos son los propietarios observados de las tablas públicas. La instancia también contiene ACL predeterminadas más amplias para objetos creados por `supabase_admin`; no se deben crear objetos de aplicación bajo ese rol ni asumir que los defaults de `postgres` les aplican. `anon` y `authenticated` tienen `BYPASSRLS = false`; `service_role` sí lo tiene, como rol privilegiado de Supabase.
- **`anon`, según los GRANT explícitos de la migración:** SELECT en `categorias`, `cursos`, `secciones`; INSERT solo en las columnas listadas de `interesados`. No recibe grants explícitos para leer/escribir las demás tablas públicas. La política RLS aún decide qué filas puede leer o insertar.
- **`authenticated`, según los GRANT explícitos:** SELECT en las 32 tablas públicas; UPDATE en columnas de perfil de `usuarios`; INSERT en columnas de `mensajes`; INSERT en `archivos_metadata`; INSERT/UPDATE acotados de `perfiles_docente`; INSERT/UPDATE de `configuraciones`; INSERT de `notificaciones`; INSERT en catálogo/contenidos académicos; UPDATE en cursos y contenidos académicos indicados. Se revocan escrituras directas a roles, usuarios, auditoría, reservas, pagos, inscripciones, asistencias, historial, conversaciones, participantes, lecturas y certificados; también UPDATE/DELETE de mensajes, notificaciones, interesados y metadatos de archivos. RLS filtra las filas y columnas protegidas adicionales no se vuelven autorizadas por un GRANT general.
- Las concesiones efectivas se comprobaron con `has_table_privilege`, `has_column_privilege`, `has_function_privilege`, `pg_roles` y `pg_default_acl` en PostgreSQL local. `authenticated` tiene `UPDATE` efectivo solo para las columnas de perfil listadas; no tiene `UPDATE` de tabla ni para `rol_id`. `anon` no tiene bypass de RLS ni grants de escritura en las tablas privadas.
- **Operaciones que requieren Supabase Auth/JWT:** todas las lecturas/escrituras ordinarias que dependan de `auth.uid()`, rol institucional o RLS; se deben ejecutar desde Supabase SSR/JS con el JWT de la sesión del usuario. Admin y superadmin deben invocar los RPC con ese mismo cliente/identidad; el RPC vuelve a verificar permisos. No usar `service_role` para esas operaciones.
- **Drizzle:** su cliente postgres directo no propaga automáticamente el JWT de Supabase ni configura el rol SQL `authenticated`; un `server-only` import no equivale a autorización. `DATABASE_URL` por sí sola no prueba ni aplica RLS. Hasta una decisión e implementación probada, no usar Drizzle para solicitudes ordinarias de usuario. Para cualquier patrón contextual futuro debe demostrarse con el pool real que cada transacción aplica el rol y claims correctos y que se limpian al reutilizar conexiones.

### Hallazgos corregidos

- **Alto, corregido y comprobado localmente:** la migración 003 activa RLS para las tablas de aplicación y define las políticas/grants correspondientes. Las tablas administradas `storage.objects` y `realtime.messages` mantienen RLS de Supabase; no se intenta cambiar su activación.
- **Medio, corregido:** la política de actualización de `usuarios` consultaba la misma tabla protegida por RLS para conservar el rol, lo que podía provocar recursión. Se eliminó esa subconsulta; la protección del rol descansa además en que no se concede `UPDATE(rol_id)` y en el RPC superadministrativo.
- **Alto, corregido estáticamente:** la protección del último superadministrador podía tener una condición de carrera entre cambios simultáneos de estado/rol. Ambos RPC ahora toman un advisory transaction lock compartido antes de comprobar y modificar cuentas.
- **Medio, corregido:** se añadió el bloqueo de la fila de sesión al registrar asistencia para serializar altas concurrentes de asistencia de esa sesión.
- **Medio, corregido:** se regeneró el SQL consolidado, que todavía representaba el esquema anterior, y se sincronizaron el índice docente de cursos y la regla de moneda/precio entre SQL y Drizzle.

## Funciones, transacciones y restricciones

- `create_reservation` bloquea la sección con `FOR UPDATE`, cuenta reservas pendientes/confirmadas e inserta dentro de la misma transacción. Las llamadas concurrentes a ese RPC para la misma sección quedan serializadas; no se validó con PostgreSQL. Las reservas pendientes no expiran automáticamente y pueden consumir capacidad indefinidamente.
- Registro/verificación de pagos, confirmación/cancelación y creación de inscripción vuelven a comprobar rol y estado dentro de RPC `SECURITY DEFINER`, bloquean las filas de pago/reserva correspondientes y escriben auditoría.
- `record_attendance` vuelve a comprobar docente/administrador e inscripción; la fila de sesión se bloquea para evitar inserciones simultáneas duplicadas desde el RPC.
- Las funciones `SECURITY DEFINER` fijan `search_path`, y se revoca `EXECUTE` a `PUBLIC`/`anon` antes de otorgar los permisos necesarios a `authenticated`. Los grants de tabla impiden modificar directamente los campos sensibles protegidos.
- La revisión estática no sustituye pruebas de concurrencia, transacciones abortadas, permisos efectivos del propietario de funciones, ni pruebas de los códigos de error.

## Storage y Realtime

- Los siete buckets están privados (`public = false`). `storage.objects`, propiedad de `supabase_storage_admin`, mantiene RLS habilitada. La migración no altera RLS, propiedad ni estructura interna de Storage; sus tres políticas SELECT/INSERT/DELETE se crearon mediante `CREATE POLICY`. No hay política UPDATE.
- **ACL SQL, RLS y propiedad son distintas:** la ACL incluye grants del propietario administrado a roles de API; los `REVOKE` de la migración no eliminan grants otorgados por otro propietario. La autorización efectiva de las solicitudes API se probó con JWT: no se cambió propietario, no se concedió membresía a roles administrados y no se alteró la tabla interna.
- **Pruebas de objetos:** A subió un objeto PDF y pudo descargarlo tras validarlo mediante la Edge Function `validate-private-file`, que cambió el metadato de `pending` a `active`. B y anon no pudieron descargarlo; B tampoco pudo validar el archivo de A. A pudo crear una URL firmada; el acceso ajeno fue denegado. No se probaron expiración ni reutilización tras el vencimiento.
- **Eliminación:** Storage API respondió `200 []` al intentar borrar un archivo `active`, pero la consulta posterior por Storage API confirmó que el objeto persistía; la respuesta HTTP no se consideró éxito. El borrado de un archivo propio `pending` devolvió respuesta satisfactoria y la consulta posterior/descarga confirmó su desaparición. Los objetos inválidos de prueba se retiraron por Storage API, no mediante SQL.
- **Tamaño y MIME:** configuración global exacta de 50 MiB (52.428.800 bytes) más límites individuales por bucket. En `documents`, un archivo bajo el límite y otro de exactamente 50 MiB fueron aceptados, y 50 MiB + 1 byte (52.428.801) fue rechazado (`HTTP 400`). Un MIME no permitido también fue rechazado (`HTTP 400`). Las mismas configuraciones efectivas se comprobaron en los siete buckets; no se probaron todas las combinaciones límite/MIME para cada bucket.
- **Inspección de contenido:** un archivo con extensión `.pdf` y MIME declarado `application/pdf`, cuyo contenido era texto incorrecto, se cargó inicialmente, pero la Edge Function lo rechazó (`HTTP 422`), dejó el metadato en `quarantined` y retiró el objeto mediante Storage API. Es una verificación básica de firma/discrepancias, no antivirus ni validación completa de estructura. No existe escáner antimalware.
- Los objetos `pending` no pudieron descargarse; la función servidor fue la única ruta probada para pasar un objeto válido a `active`. La validación no equivale a integrar carga persistente en los formularios frontend, que continúan siendo demos. La vinculación de comprobantes de interesados también requiere completar antes la asociación con una cuenta de estudiante.
- Realtime añade únicamente mensajes y notificaciones a la publicación cuando existe `supabase_realtime`. La tabla administrada `realtime.messages`, cuyo dueño observado es `supabase_realtime_admin`, ya tenía RLS habilitada. Sus políticas privadas se crearon sin alterar la tabla.
- En una transacción local reversible se probó `authenticated`: el participante activo leyó y publicó en el canal; un usuario autenticado no participante no leyó filas ni publicó; un tópico malformado fue denegado. No se probaron todos los cambios de membresía, revocación ni suscripción/entrega por WebSocket.

## Validación complementaria del entorno — 2026-11-02

Se comprobó primero que no había proyecto remoto vinculado ni stack Supabase previo. Docker y Supabase CLI estaban disponibles. La primera ejecución aplicó las dos primeras migraciones, pero falló en la tercera al intentar activar RLS en la tabla administrada `storage.objects`; se retiró esa instrucción y también la activación innecesaria en `realtime.messages`. Después:

- Docker CLI/daemon: **disponibles**.
- Supabase CLI: `2.120.0`.
- Proyecto remoto: **ninguno vinculado** (`linked_project: null`); no se utilizaron credenciales remotas.
- Antes de iniciar, los puertos `54321`, `54322`, `54323`, `54324` y `54329` estaban cerrados y no había contenedores Supabase.
- `supabase start`: **correcto**; las tres migraciones se aplicaron. Se informó que no había archivos para el seed configurado `supabase/seed.sql`; no impidió el arranque.
- `supabase db reset --local`: **correcto**; reconstruyó la base local y volvió a aplicar las tres migraciones en orden. El aviso del seed inexistente no impidió el reset.
- Configuración leída: proyecto local `profe`, Postgres major 17, migraciones habilitadas, Realtime y Storage habilitados, signup Auth habilitado para desarrollo local, `auto_expose_new_tables = false`, pooler local deshabilitado. La configuración no provoca por sí misma ninguna conexión.
- No hubo cambios ni conexiones remotas; el reset se limitó al proyecto local desechable `profe`, creado durante esta sesión sin contenedores ni volúmenes de datos previos.
- Se consultaron las tablas de historial, catálogos de PostgreSQL, políticas RLS, buckets, privilegios SQL y definición de función después del reset.
- El reset no aplicó `supabase/sql/supabase_setup.sql`; el consolidado es referencia, no un historial independiente.
- El export de Drizzle valida que Drizzle Kit puede leer el esquema en modo `react-server`; no valida SQL, PostgreSQL, políticas RLS ni extensiones Supabase.

## Resultados clasificados por tipo de evidencia

### Verificado mediante ejecución real

- Disponibilidad de Docker, vínculo remoto ausente y aislamiento del stack local.
- `supabase start` y `supabase db reset --local`; las tres migraciones se aplicaron en orden. El reset de validación tras corregir el grant se limitó a la base local, que no contenía usuarios Auth, filas de aplicación ni objetos Storage antes del reset.
- Supabase CLI 2.120.0 y configuración local leída desde `supabase/config.toml`.
- Regeneración y comparación exacta del SQL consolidado contra los tres archivos fuente.
- Catálogo final: RLS en 32/32 tablas `public`, RLS habilitada en las tablas administradas `storage.objects` y `realtime.messages`, tres políticas Storage, dos de Realtime y siete buckets privados.
- Existencia y definición de `can_join_conversation_channel()`; conversión real del tópico de prueba a UUID.
- Pruebas SQL locales por rol autenticado en Realtime, con participante permitido y no participante/tópico malformado denegados; fixture revertido.
- Pruebas API de Storage con usuarios A/B y anon: lectura/descarga propia frente a ajena, URL firmada, sobrescritura, traversal, eliminación `pending` propia y denegación de eliminación de objetos `active` (existencia comprobada después de cada intento).
- Pruebas representativas por rol en tablas principales, incluidas comprobaciones de aislamiento de usuarios y conversaciones, operaciones de rol y lectura de notificaciones. No representan cobertura exhaustiva.
- Prueba efectiva de `UPDATE` del perfil propio y rechazo de `rol_id` después de reordenar el grant; verificación de privilegios efectivos por columna y tabla.
- Inspección PostgreSQL de dueños, ACL predeterminadas, privilegios, `BYPASSRLS` y las 27 funciones `SECURITY DEFINER`; no se hallaron `search_path` ausentes en esas funciones.
- Export estático de DDL con Drizzle Kit y verificaciones del frontend documentadas abajo.

### Revisado estáticamente, no ejecutado en PostgreSQL

- Orden, dependencias, tablas, relaciones, constraints, índices, funciones, triggers, grants, RLS, Storage y Realtime descritos en el resto de este informe.
- Correspondencia de tablas, columnas, tipos normalizados, FK, índices y constraints CHECK entre los SQL y Drizzle.
- Lógica de las ramas no cubiertas de las políticas de archivos y de los RPC sensibles; las pruebas funcionales descritas no cubren todas sus condiciones.
- Restricciones de privilegios SQL y necesidad de usar Supabase Auth/JWT para que PostgREST aplique la identidad y RLS.

### No probado o no concluyente

- Matriz exhaustiva de todas las operaciones, filas, estados y los cinco roles en todas las tablas. La ronda ejecutada es representativa; no se declara RLS completamente verificada.
- Eliminación de objetos `active` queda verificada como denegada para A y B; la API respondió `200 []`, pero las consultas posteriores confirmaron que los objetos persistían. No se probó cada forma de actualización de metadatos/objetos, aunque la migración no define política UPDATE.
- Límites de carga y MIME: pasaron los casos de archivo pequeño, exactamente 50 MiB, 50 MiB + 1 byte y MIME permitido/no permitido ejecutados. No se probaron exhaustivamente todas las combinaciones de tamaño/MIME para cada bucket.
- Caducidad de URL firmada, análisis antimalware y validación estructural profunda de formatos.
- Ejecución independiente del SQL consolidado para comparar catálogos resultantes; su texto se comparó con las migraciones fuente.
- Pruebas concurrentes de capacidad, reservas únicas, inscripciones, verificación de pagos y protección del último superadministrador. La rama del último superadministrador no se ejercitó directamente.
- Suscripción/entrega por WebSocket, cambios de membresía y revocación de acceso en Realtime.

No se ejecutaron cambios en bases remotas ni se usaron credenciales remotas. El entorno de validación fue Supabase local; el test user y los archivos temporales se limpiaron. El error de propiedad quedó resuelto al no intentar modificar la activación RLS administrada; la creación de políticas fue aceptada sin conceder membresías ni alterar propietarios.

## Pruebas ejecutadas

| Prueba | Resultado |
|---|---|
| Revisión estática de dependencias, tablas, referencias, grants, funciones y políticas | Completada |
| Comparación de tablas/columnas, tipos normalizados, FK, índices y CHECK entre SQL y Drizzle | Coincidencia estructural en los elementos comparados |
| Comparación de cada sección de `supabase_setup.sql` contra su migración de origen | Coincidencia |
| Vínculo remoto y estado previo del entorno | Verificado: `linked_project: null`; ningún contenedor Supabase previo |
| `supabase start` y `supabase db reset --local` | Correctos; las tres migraciones se aplicaron en orden |
| Comparación de SQL consolidado contra migraciones oficiales | Coincidencia exacta con las tres migraciones |
| RLS en tablas públicas y tablas administradas | 32/32 tablas públicas, `storage.objects` y `realtime.messages` tienen RLS habilitada |
| Políticas y buckets Storage | Tres políticas (SELECT/INSERT/DELETE), siete buckets privados con `file_size_limit` y `allowed_mime_types` efectivos. Archivo `active` del propietario accesible; B y anon denegados. |
| Límites Storage | Archivo menor y exactamente 50 MiB aceptados en `documents`; 50 MiB + 1 byte rechazado (`HTTP 400`). Los límites individuales son 5/50/50/10/25/50/15 MiB por bucket, respectivamente. |
| MIME Storage | Un PDF permitido aceptado; MIME fuera de lista rechazado (`HTTP 400`). No se probaron todas las combinaciones de todos los buckets. |
| Validación de contenido | PDF falso con extensión/MIME válidos rechazado por la función (`HTTP 422`), metadato `quarantined` y objeto retirado por API. No equivale a escaneo antimalware. |
| Ciclo de vida y acceso Storage | `pending` no descargable; PDF válido activado a `active` mediante función; propietario descarga, usuario distinto y anon no. Usuario distinto no pudo activar archivo ajeno (`403`). |
| Eliminación Storage | Borrado `active`: `HTTP 200 []`, pero el objeto persistió al comprobarlo por API (denegado). Borrado propio `pending`: el objeto desapareció al comprobarlo por API. |
| Políticas privadas de Realtime | Dos políticas encontradas; pruebas locales permitieron miembro y denegaron no miembro y tópico malformado. |
| Función de canal y extracción UUID | Existe; `split_part` produjo el UUID esperado y la comprobación de canal precede al cast |
| Matriz RLS por roles/tablas | Pruebas API/JWT representativas; perfil propio permitido, `rol_id` directo denegado; aislamiento de relaciones y conversaciones probado en casos seleccionados. **Cobertura parcial, no verificación completa.** |
| Privilegios, defaults y SECURITY DEFINER | Dueño de 32 tablas públicas `postgres`; defaults restrictivos comprobados para `postgres`; 27 funciones SECURITY DEFINER con `search_path` fijo; `anon`/`authenticated` sin `BYPASSRLS`. |
| Inventario de buckets propuestos | Ocho nombres de FASE 7 conciliados con siete lógicos actuales mediante agrupación documentada de documentos; no se creó un bucket adicional. |
| Edge Function `validate-private-file` | Runtime local: sin sesión `401`; usuario distinto sobre archivo ajeno `403`; archivo válido activado; contenido PDF falso rechazado (`422`), puesto en cuarentena y eliminado por Storage API. |
| `npm.cmd run lint` | Correcto |
| `npx.cmd tsc --noEmit` | Correcto para la aplicación; `supabase/functions` está excluido porque usa tipos/runtime Deno, no el runtime TypeScript de Next.js. |
| `npm.cmd run build` | Correcto con Next.js 16.4.4 |
| `git diff --check` | Correcto; solo avisos de conversión de LF/CRLF de Git en archivos del worktree |

## Riesgos y pruebas pendientes

1. Probar combinaciones de límite y MIME para cada bucket y aprobar los límites técnicos para producción.
2. Evaluar e integrar un escáner antimalware aislado; la validación de firma actual no lo sustituye.
3. Completar la matriz anon/estudiante/docente/administrador/superadministrador en las operaciones y tablas aún no cubiertas.
4. Probar concurrencia para capacidad, pagos, inscripción, asistencia y conservación del último superadministrador.
5. Probar expiración de URL firmadas y ciclo de vida/revocación de Realtime.
6. Confirmar el rol propietario de migraciones en cualquier entorno futuro antes de depender de `ALTER DEFAULT PRIVILEGES FOR ROLE postgres`; solo se verificó el contexto local.
7. Mantener bloqueado el uso de Drizzle directo para consultas de usuario hasta decidir y probar el contexto RLS.

**Preparación remota:** no lista para aplicar en un proyecto remoto hasta superar las pruebas PostgreSQL/RLS/Storage/Realtime, revisar el propietario de migraciones y configurar explícitamente límites/MIME con Dashboard o Storage API. La configuración de buckets local no implica su despliegue. El frontend aún no integra las cargas; revisar el flujo antes de habilitarlo. No conectar ni desplegar como parte de esta fase.
