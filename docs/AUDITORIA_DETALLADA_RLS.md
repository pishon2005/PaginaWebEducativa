# EDUKATECH — Auditoría detallada RLS y funciones

> Fase 16.1.5. Auditoría de las migraciones existentes. No es una migración.
> Las expresiones SQL completas y autoritativas permanecen en
> `supabase/migrations/202501020003_privacy_storage_realtime.sql`; las líneas
> indicadas permiten verificarlas sin duplicar una segunda fuente ejecutable.

## 1. Conteo y semántica

- 58 políticas en tablas `public`.
- 3 políticas en `storage.objects`.
- 2 políticas en `realtime.messages`.
- 63 políticas totales en la migración.
- Todas se declaran `PERMISSIVE` implícitamente; no se encontró `AS RESTRICTIVE`.
- Las políticas aplicables se combinan con OR.
- Las políticas Storage/Realtime no deben activar RLS ni cambiar propietarios administrados por Supabase.

`public.usuarios` usa una política de actualización amplia, pero el grant de
columnas limita actualmente los campos editables. Esto no sustituye una
protección explícita de columnas institucionales.

## 2. Inventario exacto de las 58 políticas públicas

La siguiente tabla conserva nombre, tabla, comando, rol PostgreSQL, ubicación
de la expresión completa y evaluación. `USING`/`WITH CHECK` deben leerse
literalmente en la ubicación indicada; no existe otra versión consolidada.

| # | Política | Tabla | Comando | Rol PG | SQL completo | Riesgo |
|---:|---|---|---|---|---|---|
| 1 | `roles_authenticated_read` | `roles` | SELECT | authenticated | líneas 1231–1232 | Catálogo de roles visible; solo lectura |
| 2 | `usuarios_read_self_or_admin` | `usuarios` | SELECT | authenticated | líneas 1234–1235 | `is_app_admin()` ve todos los perfiles |
| 3 | `usuarios_update_self_or_admin` | `usuarios` | UPDATE | authenticated | líneas 1237–1239 | Debe proteger columnas y jerarquía |
| 4 | `perfiles_docente_read_authorized` | `perfiles_docente` | SELECT | authenticated | líneas 1241–1251 | Admin global sin ámbito |
| 5 | `perfiles_docente_write_self_or_admin` | `perfiles_docente` | ALL | authenticated | líneas 1252–1260 | `FOR ALL` incluye DELETE |
| 6 | `configuraciones_admin_only` | `configuraciones` | ALL | authenticated | líneas 1262–1263 | Debe ser superadmin |
| 7 | `auditoria_admin_read` | `auditoria` | SELECT | authenticated | líneas 1265–1266 | Falta ámbito administrativo |
| 8 | `categorias_public_active` | `categorias` | SELECT | anon | líneas 1268–1268 | Catálogo público previsto |
| 9 | `categorias_authenticated_read` | `categorias` | SELECT | authenticated | líneas 1270–1270 | Pendientes ven catálogo |
| 10 | `categorias_admin_manage` | `categorias` | ALL | authenticated | líneas 1272–1272 | Admin/superadmin agrupados |
| 11 | `cursos_public_published` | `cursos` | SELECT | anon | líneas 1274–1274 | Catálogo publicado |
| 12 | `cursos_authenticated_read` | `cursos` | SELECT | authenticated | líneas 1276–1280 | Revisar contenido privado |
| 13 | `cursos_admin_manage` | `cursos` | ALL | authenticated | líneas 1282–1282 | Admin/superadmin agrupados |
| 14 | `cursos_teacher_manage_assigned` | `cursos` | UPDATE | authenticated | líneas 1284–1298 | Revisar publicación por docente |
| 15 | `secciones_public_active` | `secciones` | SELECT | anon | líneas 1300–1300 | Catálogo público |
| 16 | `secciones_authenticated_read` | `secciones` | SELECT | authenticated | líneas 1302–1305 | Pendiente ve secciones activas |
| 17 | `secciones_admin_manage` | `secciones` | ALL | authenticated | líneas 1307–1307 | Admin/superadmin agrupados |
| 18 | `horarios_read_related` | `horarios_recurrentes` | SELECT | authenticated | líneas 1309–1312 | Relación correcta |
| 19 | `horarios_teacher_manage` | `horarios_recurrentes` | ALL | authenticated | líneas 1314–1318 | Docente puede DELETE; confirmar |
| 20 | `sesiones_read_related` | `sesiones_academicas` | SELECT | authenticated | líneas 1320–1323 | Relación correcta |
| 21 | `sesiones_teacher_manage` | `sesiones_academicas` | ALL | authenticated | líneas 1325–1328 | Docente puede DELETE; confirmar |
| 22 | `interesados_admin_read` | `interesados` | SELECT | authenticated | líneas 1332–1332 | Admin global |
| 23 | `interesados_teacher_read_assigned_course` | `interesados` | SELECT | authenticated | líneas 1334–1341 | Relación por curso |
| 24 | `interesados_insert_public` | `interesados` | INSERT | anon, authenticated | líneas 1343–1346 | Requiere rate limiting |
| 25 | `reservas_read_owner_staff` | `reservas` | SELECT | authenticated | líneas 1348–1354 | Admin global |
| 26 | `pagos_read_owner_admin` | `pagos` | SELECT | authenticated | líneas 1356–1360 | Admin global |
| 27 | `inscripciones_read_owner_staff` | `inscripciones` | SELECT | authenticated | líneas 1362–1365 | Admin global |
| 28 | `asistencias_read_owner_staff` | `asistencias` | SELECT | authenticated | líneas 1367–1371 | Admin global |
| 29 | `asistencias_teacher_manage` | `asistencias` | INSERT | authenticated | líneas 1373–1377 | Correcciones solo por RPC |
| 30 | `historial_asistencias_admin_read` | `historial_asistencias` | SELECT | authenticated | líneas 1379–1388 | Admin global |
| 31 | `tareas_read_enrolled_staff` | `tareas` | SELECT | authenticated | líneas 1390–1393 | Relación correcta |
| 32 | `tareas_teacher_manage` | `tareas` | ALL | authenticated | líneas 1395–1399 | Docente puede DELETE |
| 33 | `entregas_read_owner_staff` | `entregas` | SELECT | authenticated | líneas 1401–1405 | Admin global |
| 34 | `entregas_student_submit` | `entregas` | INSERT | authenticated | líneas 1407–1412 | Propiedad e inscripción correctas |
| 35 | `entregas_staff_review` | `entregas` | UPDATE | authenticated | líneas 1414–1424 | Revisar columnas modificables |
| 36 | `quizzes_read_enrolled_staff` | `quizzes` | SELECT | authenticated | líneas 1426–1429 | Relación correcta |
| 37 | `quizzes_teacher_manage` | `quizzes` | ALL | authenticated | líneas 1431–1435 | Docente puede DELETE |
| 38 | `quiz_questions_read_enrolled_staff` | `quiz_preguntas` | SELECT | authenticated | líneas 1437–1443 | No incluye answer keys |
| 39 | `quiz_questions_teacher_manage` | `quiz_preguntas` | ALL | authenticated | líneas 1445–1453 | Docente puede DELETE |
| 40 | `quiz_answer_keys_staff_only` | `quiz_claves_respuesta` | ALL | authenticated | líneas 1455–1467 | Admin/docente; excluir estudiantes |
| 41 | `quiz_attempts_read_owner_staff` | `quiz_intentos` | SELECT | authenticated | líneas 1469–1473 | Admin global |
| 42 | `quiz_attempts_student_insert` | `quiz_intentos` | INSERT | authenticated | líneas 1475–1480 | Propiedad e inscripción correctas |
| 43 | `certificate_criteria_read` | `criterios_certificado` | SELECT | authenticated | línea 1482 | Debe confirmarse alcance |
| 44 | `certificate_criteria_admin_manage` | `criterios_certificado` | ALL | authenticated | líneas 1484–1484 | Configuración global |
| 45 | `certificates_read_owner_staff` | `certificados` | SELECT | authenticated | líneas 1486–1493 | Relación correcta |
| 46 | `materials_read_enrolled_staff` | `materiales` | SELECT | authenticated | líneas 1495–1498 | Admin global |
| 47 | `materials_teacher_manage` | `materiales` | ALL | authenticated | líneas 1500–1505 | `USING` admin/docente; `WITH CHECK` más estrecho |
| 48 | `videos_read_enrolled_staff` | `videos` | SELECT | authenticated | líneas 1507–1510 | Admin global |
| 49 | `videos_teacher_manage` | `videos` | ALL | authenticated | líneas 1512–1517 | `USING` admin/docente; `WITH CHECK` más estrecho |
| 50 | `conversaciones_read_participants` | `conversaciones` | SELECT | authenticated | líneas 1520–1520 | Chat privado correcto |
| 51 | `conversation_participants_read_related` | `conversacion_participantes` | SELECT | authenticated | líneas 1522–1524 | Relación correcta |
| 52 | `mensajes_read_participants` | `mensajes` | SELECT | authenticated | líneas 1526–1526 | Chat privado correcto |
| 53 | `mensajes_insert_participant` | `mensajes` | INSERT | authenticated | líneas 1528–1542 | Debe conservar estado activo |
| 54 | `message_reads_read_own` | `lecturas_mensaje` | SELECT | authenticated | líneas 1544–1544 | Escritura solo RPC |
| 55 | `notificaciones_read_own` | `notificaciones` | SELECT | authenticated | líneas 1546–1546 | Admin lee todas |
| 56 | `notificaciones_admin_insert` | `notificaciones` | INSERT | authenticated | líneas 1548–1548 | Destinatarios requieren límites |
| 57 | `archivos_metadata_read_authorized` | `archivos_metadata` | SELECT | authenticated | líneas 1551–1551 | Depende de `can_access_file` |
| 58 | `archivos_metadata_insert_authorized` | `archivos_metadata` | INSERT | authenticated | líneas 1553–1575 | Admin puede documentos administrativos |

La numeración y las ubicaciones se verificaron contra la migración histórica.
No se encontró una política `RESTRICTIVE` fuera de ese archivo mediante la
revisión de las migraciones locales.

## 3. Efecto de `FOR ALL`

Las políticas `FOR ALL` aplican la expresión `USING` a SELECT/UPDATE/DELETE y
`WITH CHECK` a INSERT/UPDATE. Por ello, un docente asignado puede eliminar
recursos de su sección cuando la política no añade una condición de propietario.
Esto afecta especialmente a:

```text
perfiles_docente_write_self_or_admin
horarios_teacher_manage
sesiones_teacher_manage
tareas_teacher_manage
quizzes_teacher_manage
quiz_questions_teacher_manage
quiz_answer_keys_staff_only
```

La separación futura debe demostrar equivalencia operación por operación antes
de sustituir una política.

## 4. Privilegios PostgreSQL

La migración revoca INSERT/UPDATE/DELETE de tablas protegidas a `anon` y
`authenticated`, y después concede a `authenticated` únicamente las columnas
de perfil permitidas:

```sql
GRANT UPDATE (nombre, apellido, foto_perfil, telefono, pais, idioma_preferido)
ON public.usuarios TO authenticated;
```

Debe verificarse nuevamente en el entorno local que no exista un grant de UPDATE
a nivel de tabla, ni privilegios heredados desde PUBLIC, ni secuencias/vistas
que permitan eludir la protección. No se ejecutó esa comprobación remota en esta
fase.

## 5. Funciones públicas

Existen 28 funciones. Las funciones de migración 001 son
`set_updated_at()` y `create_basic_profile_for_auth_user()`. La migración 003
contiene los 26 helpers/RPC restantes.

| Función | Tipo | Estado/rol | Propiedad/relación | Auditoría | Riesgo |
|---|---|---|---|---|---|
| `current_app_role()` | SECURITY DEFINER, SQL | activo | JOIN usuario/rol | No | No distingue email confirmado |
| `is_app_admin()` | SECURITY DEFINER, SQL | indirecto | Agrupa admin/superadmin | No | Agrupación demasiado amplia |
| `is_superadmin()` | SECURITY DEFINER, SQL | indirecto | Rol exacto | No | Base correcta |
| `is_section_teacher()` | SECURITY DEFINER, SQL | Docente activo | Sección asignada | No | Revisar estado de sección |
| `is_enrolled_in_section()` | SECURITY DEFINER, SQL | Estudiante activo | Inscripción propia activa | No | Base correcta |
| `is_conversation_participant()` | SECURITY DEFINER, SQL | Rol efectivo | Participante no revocado | No | Base correcta |
| `can_access_file()` | SECURITY DEFINER, SQL | Indirecto | Propietario/relación/admin | No | Admin tiene acceso amplio |
| `can_upload_file()` | SECURITY DEFINER, SQL | Indirecto | Propietario/categoría | No | Admin agrupado |
| `can_manage_file()` | SECURITY DEFINER, SQL | No uniforme | Propietario/docente/admin | No | Rama de propietario no exige rol activo |
| `create_reservation()` | SECURITY DEFINER, PL/pgSQL | `is_app_admin()` | Sección/interés/capacidad | Sí | Admin global |
| `verify_payment()` | SECURITY DEFINER, PL/pgSQL | `is_app_admin()` | Pago bloqueado | Sí | Separación pendiente |
| `register_payment()` | SECURITY DEFINER, PL/pgSQL | `is_app_admin()` | Reserva pendiente | Sí | Separación pendiente |
| `confirm_reservation()` | SECURITY DEFINER, PL/pgSQL | `is_app_admin()` | Pago verificado | Sí | Separación pendiente |
| `cancel_reservation()` | SECURITY DEFINER, PL/pgSQL | `is_app_admin()` | Sin matrícula | Sí | Separación pendiente |
| `set_account_status()` | SECURITY DEFINER, PL/pgSQL | Admin; objetivo jerárquico parcial | No propio; último superadmin | Sí | Admin gestiona demasiado |
| `assign_user_role()` | SECURITY DEFINER, PL/pgSQL | Superadmin | No propio; último superadmin | Sí | Requiere validación de jerarquía completa |
| `create_enrollment()` | SECURITY DEFINER, PL/pgSQL | `is_app_admin()` | Reserva/pago/email/estudiante activo | Sí | Ámbito administrativo |
| `record_attendance()` | SECURITY DEFINER, PL/pgSQL | Admin/docente asignado | Inscripción activa | No general | Correcciones sin auditoría completa |
| `is_enrolled_in_section_for_student()` | SECURITY DEFINER, SQL | Inscripción activa | Estudiante suministrado | No | Helper interno debe limitarse |
| `start_private_conversation()` | SECURITY DEFINER, PL/pgSQL | Roles activos | Pareja/sección | No | No acceso global, correcto |
| `mark_message_read()` | SECURITY DEFINER, PL/pgSQL | Participante | Conversación | No | Correcta |
| `mark_notification_read()` | SECURITY DEFINER, PL/pgSQL | No explícito | Notificación propia | No | No exige estado activo |
| `can_join_conversation_channel()` | SECURITY DEFINER, PL/pgSQL | Participante activo | UUID/canal | No | Correcta como base |
| `can_access_storage_object()` | SECURITY DEFINER, SQL | Indirecto | Bucket/ruta/archivo | No | Hereda acceso admin amplio |
| `can_upload_storage_object()` | SECURITY DEFINER, SQL | Indirecto | Bucket/ruta/archivo | No | Hereda acceso admin amplio |
| `can_delete_storage_object()` | SECURITY DEFINER, SQL | Indirecto | Pending + gestión | No | No cubre claramente activos |
| `set_updated_at()` | Trigger | N/A | Trigger interno | No | EXECUTE revocado |
| `create_basic_profile_for_auth_user()` | Trigger SECURITY DEFINER | Rol fijo estudiante | Auth UID | No | `email_verificado` puede quedar obsoleto |

Todas las funciones SECURITY DEFINER de las migraciones fijan `search_path`
explícito. Las funciones sensibles revocan EXECUTE a `PUBLIC`/`anon` y lo
conceden a `authenticated`; la lógica interna sigue siendo la barrera principal.

## 6. `email_verificado`

La auditoría local no encontró referencias funcionales actuales fuera del
bootstrap y documentación. La fuente de verdad debe seguir siendo
`auth.users.email_confirmed_at`. El campo duplicado no debe entrar en RLS ni
RPC hasta definir sincronización segura.

## 7. Prioridades

1. Separar `is_institutional_admin()` de `is_superadmin()`.
2. Corregir `set_account_status()` y protección de columnas.
3. Revisar `can_manage_file()` y acceso administrativo a Storage.
4. Auditar todas las operaciones derivadas de `FOR ALL`.
5. Añadir auditoría de correcciones de asistencia.
6. Ejecutar pruebas reales por rol/estado y WebSocket.

## 8. Cierre de decisiones de Fase 16.1.5

### Jerarquía

Se fija la siguiente separación para la implementación futura:

- `is_superadmin()`: exclusivamente `superadministrador`.
- `is_institutional_admin()`: exclusivamente `administrador`.
- `is_app_admin()`: únicamente operaciones deliberadamente comunes.
- `is_active_user()`: perfil existente con `estado='activo'` y `activo=true`.
- `is_active_student()` y `is_active_teacher()`: helper activo más rol exacto.

El administrador gestiona estudiantes, docentes, cursos, secciones, reservas,
pagos, matrículas y operaciones académicas. No asigna roles, no gestiona
administradores o superadministradores y no modifica configuración global.

### Estados

Se conserva la combinación histórica `pendiente + activo=true` creada por el
trigger. No se añadirá una restricción de igualdad entre ambas columnas.

| Estado | activo | Rol efectivo | Acceso institucional |
|---|---:|---|---|
| pendiente | true | No | No |
| activo | true | Sí, según rol | Sí |
| suspendido | false | No | No |
| inactivo | false | No | No |

`set_account_status()` deberá impedir autoactualización, respetar la jerarquía
de objetivos y preservar al último superadministrador activo.

### Perfil y grants

El UPDATE directo del usuario queda limitado a:

```text
nombre, apellido, foto_perfil, telefono, pais, idioma_preferido
```

`id`, `email`, `rol_id`, `estado`, `activo`, `email_verificado`, `primer_login`,
`created_at`, `updated_at` y `codigo_alumno` requieren Auth o RPC autorizada.
La Fase 16.2 deberá comprobar que no exista un UPDATE de tabla que reabra esas
columnas después del grant por columna.

### FOR ALL, Storage y Realtime

Las políticas `FOR ALL` se evaluarán separando SELECT, INSERT, UPDATE y DELETE
en pruebas, sin reemplazo mecánico. DELETE de docentes queda denegado por
defecto cuando la única condición sea la asignación de sección.

Storage se autoriza por categoría, propietario y relación académica. Ningún
administrador obtiene acceso global automático a archivos personales y ningún
rol administrativo obtiene acceso global al chat. El acceso excepcional a
documentos deberá ser una operación autorizada y auditada.

Realtime debe rechazar nuevos joins de perfiles suspendidos y participantes
revocados. La persistencia de una sesión Auth nunca equivale a autorización.

### Email

`auth.users.email_confirmed_at` es la fuente de verdad. `email_verificado` se
mantiene como dato informativo y no participa en RLS, RPC ni guards. No se
propone una migración exclusiva para este campo.

## 9. Estado de auditoría

Las decisiones de diseño están cerradas, pero la implementación y la evidencia
de pruebas siguen pendientes. El estado correcto para la transición es:

**APTO CON CONDICIONES para iniciar Fase 16.2.**

Las condiciones son las migraciones hacia adelante, revisión local, pruebas
negativas por rol/estado, Storage/Realtime y verificación de que la cuenta
sintética permanece pendiente.
