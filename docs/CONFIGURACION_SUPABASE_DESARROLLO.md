# Configuración de Supabase Development

## Estado al 2026-11-06

Esta nota registra únicamente comprobaciones de la ETAPA A de FASE 13. El proyecto remoto está identificado y vinculado al CLI, pero **no se han aplicado migraciones ni cambiado ajustes remotos**. La etapa está bloqueada antes del dry-run porque la contraseña de PostgreSQL del proyecto Development no está disponible en la sesión CLI.

## Proyecto y CLI

| Dato | Resultado comprobado |
|---|---|
| Organización | `EDUKATECH Development` |
| Proyecto | `EDUKATECH Development` |
| Project Reference | `rxncsqoyovcwndgguxii` |
| Región | `us-west-2` |
| Estado | `ACTIVE_HEALTHY` al consultar la lista de proyectos |
| CLI | Supabase CLI `2.120.0` |
| Autenticación CLI | `supabase projects list` y `supabase orgs list` respondieron correctamente; no hizo falta ejecutar `supabase login` |
| Vinculación local | `supabase link --project-ref rxncsqoyovcwndgguxii` terminó correctamente; el marcador local apunta a ese ref |
| Producción | No se seleccionó ni vinculó |

El proyecto `proyectos_personales` aparece como otro proyecto, pero no se vinculó ni se modificó. La vinculación del CLI solo registra el destino de comandos en este repositorio; no aplica el esquema.

## Separación de entornos

Los perfiles locales están ignorados por Git. No se imprimieron ni documentaron valores de claves.

| Archivo | Uso actual |
|---|---|
| `.env.local` | Supabase local en Docker: API y PostgreSQL en loopback. `DATABASE_URL` y `DATABASE_MIGRATION_URL` apuntan a la base local. `SUPABASE_SERVICE_ROLE_KEY` queda vacío en la aplicación. |
| `.env.development.local` | Supabase Development: URL y clave publicable verificadas contra el Project Reference. Las dos URLs de PostgreSQL y la clave privilegiada están vacías, de modo que no hereda conexiones locales ni credenciales de servicio. |
| `.env.example` | Solo contiene los seis nombres de variable documentados y valores vacíos. |

Se comprobó con la guía y el cargador instalado de Next.js que `.env.development.local` tiene precedencia sobre `.env.local` para `NODE_ENV=development`; también se ejecutó el cargador real y se confirmó que no completa las variables PostgreSQL vacías con valores locales. En la configuración de producción local del cargador, `.env.local` selecciona exclusivamente el endpoint de loopback. `.gitignore` excluye ambos perfiles y no hay archivos de entorno rastreados.

Para cambiar temporalmente el servidor de desarrollo a Supabase local, renombrar (no borrar) `.env.development.local`, ejecutar `npm.cmd run dev`, y restaurar el nombre al finalizar. Con el archivo activo, `npm.cmd run dev` usa Supabase Development para Auth/SDK. Las conexiones PostgreSQL de Development permanecen deshabilitadas hasta que se obtengan y verifiquen sus URLs.

El valor que existía previamente en `SUPABASE_SERVICE_ROLE_KEY` no coincidió con la clave local ni con las claves del proyecto Development; por seguridad no se trasladó a ninguno de los perfiles. Si pertenece a otro proyecto y sigue vigente, rotarlo en el proyecto de origen. La aplicación no consume actualmente esa clave.

## Migraciones e historial remoto

La fuente oficial sigue siendo `supabase/migrations/`; Drizzle Kit solo genera borradores y `supabase/sql/supabase_setup.sql` es consolidado de referencia.

`supabase migration list --linked` mostró las versiones locales `202501020001`, `202501020002` y `202501020003` sin versión remota aplicada. Esto indica que las migraciones oficiales no constan en el historial remoto; **no demuestra que la base remota esté vacía**.

Se comprobó que la CLI admite `supabase db push --dry-run`, `--skip-vault` y `--project-ref`. Se intentó la revisión con:

```powershell
supabase db push --dry-run --skip-vault --project-ref rxncsqoyovcwndgguxii
```

Falló al autenticar la conexión temporal de PostgreSQL por falta de una contraseña válida (`SQLSTATE 28P01`). Por tanto:

- El dry-run **no terminó** y no se conoce su salida de cambios.
- No se inspeccionaron tablas, historial real de esquema ni conflictos remotos.
- No se aplicaron migraciones, no se ejecutó reset remoto y no se actualizaron secretos Vault (`--skip-vault`).
- No se dispone aún de lista validada de objetos remotos preexistentes.

Para reintentar, introducir personalmente la contraseña en el terminal integrado y ejecutar un dry-run con `--skip-vault`. No pegar ni compartir la contraseña:

```powershell
$secure = Read-Host "Contraseña PostgreSQL de EDUKATECH Development" -AsSecureString
$ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
try {
  $env:SUPABASE_DB_PASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr)
  supabase db push --dry-run --skip-vault --project-ref rxncsqoyovcwndgguxii
} finally {
  Remove-Item Env:\SUPABASE_DB_PASSWORD -ErrorAction SilentlyContinue
  [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr)
}
```

Al finalizar el dry-run se debe presentar el destino, versiones pendientes, objetos, cambios de acceso, Storage/Realtime y riesgos. **Detenerse y pedir autorización expresa antes de `supabase db push` real.** No usar `db reset --linked`.

## Inventario estático que proponen las migraciones

El análisis estático de las tres migraciones registra:

- 32 tablas `public`: `roles`, `usuarios`, `perfiles_docente`, `configuraciones`, `auditoria`, `categorias`, `cursos`, `secciones`, `horarios_recurrentes`, `sesiones_academicas`, `interesados`, `reservas`, `pagos`, `inscripciones`, `asistencias`, `historial_asistencias`, `tareas`, `entregas`, `quizzes`, `quiz_preguntas`, `quiz_claves_respuesta`, `quiz_intentos`, `criterios_certificado`, `certificados`, `materiales`, `videos`, `conversaciones`, `conversacion_participantes`, `mensajes`, `lecturas_mensaje`, `notificaciones` y `archivos_metadata`.
- 28 funciones `public`: `set_updated_at`, `create_basic_profile_for_auth_user`, `current_app_role`, `is_app_admin`, `is_superadmin`, `is_section_teacher`, `is_enrolled_in_section`, `is_conversation_participant`, `can_access_file`, `can_upload_file`, `can_manage_file`, `create_reservation`, `verify_payment`, `register_payment`, `confirm_reservation`, `cancel_reservation`, `set_account_status`, `assign_user_role`, `create_enrollment`, `record_attendance`, `is_enrolled_in_section_for_student`, `start_private_conversation`, `mark_message_read`, `mark_notification_read`, `can_join_conversation_channel`, `can_access_storage_object`, `can_upload_storage_object` y `can_delete_storage_object`.
- 63 políticas creadas: `roles_authenticated_read`, `usuarios_read_self_or_admin`, `usuarios_update_self_or_admin`, `perfiles_docente_read_authorized`, `perfiles_docente_write_self_or_admin`, `configuraciones_admin_only`, `auditoria_admin_read`, `categorias_public_active`, `categorias_authenticated_read`, `categorias_admin_manage`, `cursos_public_published`, `cursos_authenticated_read`, `cursos_admin_manage`, `cursos_teacher_manage_assigned`, `secciones_public_active`, `secciones_authenticated_read`, `secciones_admin_manage`, `horarios_read_related`, `horarios_teacher_manage`, `sesiones_read_related`, `sesiones_teacher_manage`, `interesados_admin_read`, `interesados_teacher_read_assigned_course`, `interesados_insert_public`, `reservas_read_owner_staff`, `pagos_read_owner_admin`, `inscripciones_read_owner_staff`, `asistencias_read_owner_staff`, `asistencias_teacher_manage`, `historial_asistencias_admin_read`, `tareas_read_enrolled_staff`, `tareas_teacher_manage`, `entregas_read_owner_staff`, `entregas_student_submit`, `entregas_staff_review`, `quizzes_read_enrolled_staff`, `quizzes_teacher_manage`, `quiz_questions_read_enrolled_staff`, `quiz_questions_teacher_manage`, `quiz_answer_keys_staff_only`, `quiz_attempts_read_owner_staff`, `quiz_attempts_student_insert`, `certificate_criteria_read`, `certificate_criteria_admin_manage`, `certificates_read_owner_staff`, `materials_read_enrolled_staff`, `materials_teacher_manage`, `videos_read_enrolled_staff`, `videos_teacher_manage`, `conversaciones_read_participants`, `conversation_participants_read_related`, `mensajes_read_participants`, `mensajes_insert_participant`, `message_reads_read_own`, `notificaciones_read_own`, `notificaciones_admin_insert`, `archivos_metadata_read_authorized`, `archivos_metadata_insert_authorized`, `private_storage_read`, `private_storage_insert`, `private_storage_delete`, `private_conversation_channel_read` y `private_conversation_channel_write`.
- 32 activaciones RLS para tablas de aplicación, 10 tipos y 35 índices según el análisis previo local.
- Siete buckets privados en la configuración/migración; políticas de Storage y Realtime sobre tablas administradas por Supabase, sin cambiar su propietario ni activar RLS explícitamente en esas tablas.

No se encontraron instrucciones `DROP`, `TRUNCATE` ni `DELETE FROM`. Esto no descarta incompatibilidades ni efectos sobre datos/permisos: existen `CREATE TABLE`, funciones, políticas y GRANT/REVOKE; además, la migración actualiza la privacidad, límites y MIME de buckets existentes mediante `ON CONFLICT DO UPDATE`. No se debe aplicar hasta completar dry-run, inspeccionar preexistencias y obtener autorización.

Los nombres anteriores son el contenido estático de los archivos oficiales, **no una predicción confirmada de lo que el dry-run remoto aplicará**.

## Auth y redirecciones

La aplicación tiene PKCE, cookies SSR y callback `GET /auth/callback`; recuperación redirige a `/auth/callback?next=/reset-password`. No existe el flujo de invitación administrativa ni se crean usuarios reales. El acceso a paneles continúa fail-closed porque el modelo de permisos de aplicación no está integrado.

Se ajustó `supabase/config.toml` para el entorno local:

- `site_url = http://localhost:3000`.
- Lista de redirección exacta: `http://localhost:3000/auth/callback`.
- Registro general y registro por email deshabilitados.

La configuración local está en el archivo; los contenedores ya activos no se reiniciaron para aplicarla. En Development no se modificaron ni comprobaron ajustes de Auth, correo, plantillas o allowlist. Revisarlos en Dashboard tras autorizar la etapa remota; no enviar invitaciones durante la configuración.

El SMTP local usa Inbucket para pruebas. No se configuró SMTP remoto; el proveedor de correo por defecto tiene límites y no debe usarse para invitaciones reales. La integración Auth remota todavía no se probó.

## PostgreSQL y Drizzle

- En local se ejecutó `SELECT 1` mediante Postgres.js contra loopback: correcto.
- `DATABASE_URL` local es una conexión directa a PostgreSQL local; Drizzle usa `prepare: false`, `max: 1` e `idle_timeout: 20`.
- No se configuró URL PostgreSQL remota. Tras la autorización correspondiente, usar Transaction Pooler para runtime serverless si Drizzle se habilita; evaluar conexión directa o Session Pooler para tareas administrativas/migraciones según soporte de red y TLS.
- Las migraciones de Supabase siguen siendo el único historial oficial. No ejecutar Drizzle Kit para migrar.
- `getDb()` no tiene consumidores identificados en la app; la conexión propietaria no transmite JWT ni contexto RLS. No usarla para lecturas/escrituras ordinarias de usuario.

## Storage y Realtime

Los siguientes valores están definidos para el entorno local; no se comprobaron en Development remoto:

| Bucket | Límite | MIME permitidos |
|---|---:|---|
| `profiles` | 5 MiB | JPEG, PNG, WebP |
| `documents` | 50 MiB | PDF, JPEG, PNG |
| `submissions` | 50 MiB | PDF, ZIP, texto plano, JPEG, PNG |
| `payments` | 10 MiB | PDF, JPEG, PNG |
| `learning-materials` | 25 MiB | PDF |
| `media` | 50 MiB | MP4, QuickTime, WebM |
| `attachments` | 15 MiB | PDF, ZIP, JPEG, PNG |

Global local: 50 MiB. Los siete buckets son privados. El historial local incluye pruebas funcionales representativas; RLS no está completamente verificada y no existe análisis antimalware. La validación por firmas no lo sustituye. No habilitar carga de archivos reales.

Las políticas locales de Realtime requieren canal privado y autorización de participante. Se probó parcialmente localmente; no se probaron revocación y entrega WebSocket de forma exhaustiva. No crear conversaciones reales ni usar canales públicos.

## Vercel

No se encontró CLI de Vercel ni directorio de enlace `.vercel`; no hay proyecto Vercel comprobado ni se realizó despliegue. Mantener:

- Development: Supabase Development.
- Preview: Development controlado o proyecto aislado de pruebas.
- Production: pendiente; no conectar ni desplegar.

Configurar variables separadas en el panel solo después de comprobar el destino. No agregar `SUPABASE_SERVICE_ROLE_KEY` ni `DATABASE_MIGRATION_URL` al runtime Vercel. El `DATABASE_URL` runtime sigue pendiente hasta definir una estrategia RLS segura para Drizzle.

## Verificaciones ejecutadas

| Comprobación | Resultado |
|---|---|
| Docker Server | `29.9.2` |
| Supabase local PostgreSQL | Consulta de solo lectura `SELECT 1`: correcta |
| Supabase local Auth | Endpoint de health: HTTP 200 |
| Supabase CLI autenticada | Lista de proyectos y organizaciones disponible |
| Proyecto exacto | Nombre/ref/organización/región/estado confirmados; CLI vinculado a Development |
| Variables locales y remotas | Cargador Next verificado; local y Development no mezclan las URLs PostgreSQL |
| Entornos ignorados por Git | `.env.local` y `.env.development.local` ignorados; ninguno rastreado |
| Historial de migraciones remoto | Las tres versiones no aparecen aplicadas en el historial consultado |
| Dry-run remoto | Bloqueado por autenticación de PostgreSQL; no se obtuvo diff |
| Migraciones remotas | No aplicadas |
| Auth, Storage, Realtime remotos | No configurados ni verificados |
| Vercel | No vinculado ni desplegado |

El stack local tiene PostgreSQL, Auth, REST, Storage y Realtime respondiendo; Docker mostraba el contenedor Vector en reinicio y algunos servicios opcionales detenidos. No se hizo reset ni se modificaron datos locales.

## Próximos pasos y parada

1. El operador introduce personalmente la contraseña de PostgreSQL Development en su terminal y ejecuta el comando dry-run seguro de arriba; no compartir la contraseña ni incluirla en historial.
2. Revisar la salida completa del dry-run, preexistencias y posibles conflictos.
3. Presentar el informe de impacto y pedir autorización expresa para aplicar las migraciones.
4. No ejecutar `supabase db push` real, configuración remota de Auth/Storage/Realtime, creación de usuarios, operaciones de Vercel ni despliegues antes de esa autorización.
5. Si el dry-run revela divergencias, detenerse y documentarlas; no reparar automáticamente.

**FASE 13 permanece en ETAPA A y bloqueada antes del dry-run. No se ha iniciado la ETAPA B.**
