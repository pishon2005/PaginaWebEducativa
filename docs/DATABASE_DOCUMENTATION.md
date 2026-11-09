# Documentación de base de datos

## Estado

Este documento describe el modelo propuesto y revisado durante la FASE 12. Las migraciones se aplicaron y validaron en Supabase PostgreSQL local; todavía no se han aplicado ni validado en el proyecto remoto Development. La estrategia aprobada mantiene:

- Migraciones oficiales en `supabase/migrations/`.
- Drizzle como capa tipada y consultora desde servidor.
- Un script consolidado de referencia en `supabase/sql/supabase_setup.sql`.
- RLS y permisos expresados en las migraciones; la ejecución local tiene pruebas representativas y la cobertura completa por rol sigue pendiente. La aplicación remota requiere dry-run y autorización explícita.

## Arquitectura general

La base de datos se diseña sobre PostgreSQL/Supabase y cubre:

- autenticación y perfiles de usuarios,
- gestión académica,
- reservas, pagos e inscripciones,
- archivos privados,
- chat y notificaciones,
- auditoría y configuración institucional.

La intención es mantener las tablas y relaciones alineadas con la arquitectura actual del proyecto Next.js 16, la estructura Drizzle y los contratos previamente documentados.

## Diagrama entidad-relación

```text
roles 1---* usuarios 1---* perfiles_docente
   |             |
   |             +---* reservas ---* pagos
   |             |
   |             +---* inscripciones ---* asistencias
   |             |
   |             +---* conversaciones ---* mensajes
   |             +---* notificaciones
   |
   +---* categorias 1---* cursos 1---* secciones 1---* horarios_recurrentes
                                      |
                                      +---* sesiones_academicas
                                      +---* tareas
                                      +---* quizzes
                                      +---* evaluaciones
                                      +---* materiales
                                      +---* videos
                                      +---* interesados
                                      +---* archivos_metadata
```

## Entidades principales

### 1. Seguridad y perfiles

- `roles`: enumeración institucional de acceso.
- `usuarios`: perfil principal vinculado a `auth.users`.
- `perfiles_docente`: datos profesionales del docente.
- `configuraciones`: configuraciones institucionales.
- `auditoria`: acciones administrativas y de sistema.

### 2. Académico

- `categorias`: agrupación de cursos.
- `cursos`: oferta académica general.
- `secciones`: instancia concreta de un curso.
- `horarios_recurrentes`: programación recurrente de una sección.
- `sesiones_academicas`: sesiones concretas del calendario.
- `tareas`: actividades por sección.
- `quizzes`: evaluaciones por sección.
- `evaluaciones`: resultados de estudiantes.
- `materiales`: recursos privados de aprendizaje y administración.
- `videos`: recursos audiovisuales privados.

### 3. Inscripción, pago y asistencia

- `interesados`: personas que expresan interés sin autenticarse.
- `reservas`: registro de una plaza reservada por convocatoria.
- `pagos`: comprobantes y estado de validación manual.
- `inscripciones`: acceso autorizado de estudiante a una sección.
- `asistencias`: control de asistencia de cada estudiante por sesión.

### 4. Comunicación y archivos

- `conversaciones`: conversaciones privadas.
- `conversacion_participantes`: miembros autorizados.
- `mensajes`: contenido del chat.
- `notificaciones`: avisos y alertas.
- `archivos_metadata`: metadatos persistentes del contenido de Storage.

## Tipos y enumeraciones

- `app_role`: `superadministrador`, `administrador`, `docente`, `estudiante`
- `account_status`: `pendiente`, `activo`, `suspendido`, `inactivo`
- `modalidad`: `presencial`, `virtual`, `hibrida`
- `seccion_estado`: `borrador`, `activa`, `finalizada`, `cancelada`
- `reserva_estado`: `pendiente_pago`, `confirmada`, `cancelada`
- `pago_estado`: `pendiente`, `verificado`, `rechazado`, `reembolsado`
- `inscripcion_estado`: `activa`, `suspendida`, `finalizada`, `cancelada`
- `asistencia_estado`: `presente`, `ausente`, `justificado`, `reprogramado`

## Reglas y restricciones

- La identidad del usuario se mantiene en `auth.users` y el perfil en `public.usuarios`.
- La relación entre `usuarios` y `roles` es por campo `rol` y no por metadata del cliente.
- Las reservas y pagos están separados para mantener trazabilidad y revisión manual.
- La inscripción depende de una reserva confirmada y de la validación de pago.
- La asistencia se registra por sesión con una restricción de unicidad.
- Los archivos se almacenan en Storage privado y solo se registran sus metadatos en PostgreSQL.
- Todo cambio sensible debe quedar en una tabla de auditoría.

## Índices y rendimiento

Se incluyen índices para:

- usuarios por `email` y `auth_user_id`,
- cursos por `categoria_id` y `docente_base_id`,
- secciones y reservas por convocatoria,
- pagos por reserva,
- mensajes por conversación y fecha,
- notificaciones por usuario,
- metadatos de archivos por propietario.

## Seguridad

La prioridad es respetar la regla de autorización de Supabase:

- `auth.users` gestiona identidad.
- `public.usuarios` guarda el perfil institucional.
- RLS se define por tabla y no por guards visuales.
- No se aceptan metadatos del usuario como fuente de roles.
- Los archivos privados se manejan a través de Storage con políticas restringidas.
- El `service_role` nunca se expone al navegador ni a componentes visuales.

## Storage

Los buckets propuestos son privados por defecto:

- `profiles`
- `documents`
- `submissions`
- `payments`
- `learning-materials`
- `media`
- `admin-documents`
- `attachments`

Los recursos públicos del sitio siguen siendo activos estáticos del proyecto, no contenido institucional privado.

## Realtime

Se habilita para conversaciones y notificaciones con canales privados y políticas de lectura restringidas. Se exige:

- identidad autenticada,
- pertenencia a la conversación,
- confirmación de autorizar la lectura del contenido.

## Migración y sincronización

La estrategia aprobada es:

1. mantener `supabase/migrations/` como único historial aplicado;
2. conservar `supabase/sql/supabase_setup.sql` como concatenación de referencia, no como una vía de aplicación alternativa;
3. usar Drizzle como esquema tipado y generar borradores únicamente en `supabase/migration-drafts/`;
4. revisar y trasladar manualmente cualquier cambio aprobado al historial oficial antes de aplicarlo con Supabase CLI;
5. no ejecutar `drizzle-kit migrate` ni `drizzle-kit push` para administrar el historial.

## Decisiones pendientes

- Pruebas PostgreSQL reales del modelo de roles y del trigger asociado a `auth.users`.
- Pruebas negativas RLS por rol, propiedad y acceso cruzado.
- Aprobación de proveedor de video si se requiere streaming especializado.
- Verificación real del entorno Supabase y de los buckets privados.
- Configuración final de Vercel y variables de entorno.

## Resultado de validación actual

Las 32 tablas y columnas del esquema Drizzle se compararon con los archivos SQL; también se contrastaron relaciones y acciones de borrado, índices y cantidad de restricciones CHECK. Se corrigieron diferencias de índices y una restricción de sección. La migración consolidada se regeneró desde las tres migraciones oficiales en orden. Supabase local confirmó las migraciones y las pruebas representativas documentadas en [VALIDACION_BASE_DATOS_Y_RLS.md](./VALIDACION_BASE_DATOS_Y_RLS.md). El proyecto remoto Development está vinculado, pero su dry-run está bloqueado por la autenticación PostgreSQL; no se han ejecutado cambios remotos.
