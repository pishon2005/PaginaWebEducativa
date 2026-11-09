# Contexto de proyecto para backend

## A. Información general

- Nombre: EDUKATECH
- Objetivo: Plataforma educativa para cursos, pagos, matrículas, contenidos y comunicación institucional.
- Alcance: frontend y preparación del backend en un entorno Next.js 16 + Supabase PostgreSQL + Supabase Auth + Storage + Realtime + Drizzle.
- Estado real: frontend rico y documentado; backend aún no integrado con un proyecto Supabase definitivo ni con migraciones ejecutadas en producción.

## B. Tecnologías

- Framework: Next.js 16.4.4 con App Router.
- UI: React 19, TypeScript, Tailwind CSS 4.
- ORM: Drizzle ORM.
- Base de datos: PostgreSQL en Supabase.
- Autenticación: Supabase Auth con flujo SSR y PKCE.
- Storage: Supabase Storage privado.
- Realtime: Supabase Realtime.
- Despliegue: Vercel.
- Herramientas: ESLint, TypeScript, Drizzle Kit, Supabase CLI.

## C. Arquitectura

### Organización

El proyecto mantiene una estructura de aplicación Next.js con carpetas de App Router, componentes compartidos, servicios, modelos y esquema Drizzle.

### Frontend

El frontend incluye rutas públicas, dashboards de estudiante/docente/administrador, formularios de autenticación, catálogo de cursos, gestión académica, chat demo, notificaciones, contacto WhatsApp y áreas administrativas.

### Backend integrado en Next.js

Se han documentado y preparado:

- Server Actions para operaciones seguras del servidor.
- Route Handlers para callbacks y endpoints personalizados.
- Servicios tipados y contratos en `src/lib/service-contracts.ts`.
- `src/lib/supabase/server.ts` para acceso autorizado por sesión.

### Acceso a datos

- Drizzle está presente para acceso tipado desde servidor.
- El acceso de producción debe respetar el contexto autenticado de Supabase.
- Las consultas no privilegiadas no deben usar una conexión de servicio.

## D. Usuarios y permisos

Roles principales:

- Superadministrador
- Administrador
- Docente
- Estudiante

Reglas clave:

- El usuario autenticado vive en `auth.users`.
- El perfil y el estado institucional residen en `public.usuarios`.
- Los roles no deben depender de `user_metadata` modificable por el cliente.
- La creación de estudiantes se debe hacer tras verificación de pago y validación administrativa.
- Los docentes y administradores deben crearse mediante flujo administrativo autorizado.

## E. Páginas y funcionalidades

El frontend actual contempla módulos de:

- autenticación,
- catálogo de cursos,
- panel de estudiantes,
- panel docente,
- panel administrativo,
- panel superadministrativo,
- archivos privados,
- chat y notificaciones,
- pagos y comprobantes,
- contenidos académicos,
- configuración institucional.

No todas estas áreas tienen backend real integrado. La documentación distingue entre implementado, preparado, pendiente y no verificado.

## F. Reglas de negocio

### Cursos y secciones

- El curso representa la oferta general.
- La sección representa una edición concreta.
- Cada sección puede tener docente, modalidad, fechas, horarios y capacidad.
- Las convocatorias pueden tener múltiples estados y no deben duplicar la lógica del curso.

### Interesados

- Un interesado puede expresar interés sin estar autenticado.
- Este dato no equivale a una reserva ni a una inscripción.
- Debe quedar limitado a la información mínima requerida.

### Reservas

- Hay un flujo de reserva y verificación de pago.
- Las reservas deben respetar capacidad de la sección.
- La operación debe ser atómica para evitar sobrecapacidad.

### Pagos

- Verificación es manual.
- El comprobante debe ir a Storage privado.
- Separación clara entre pago, reserva e inscripción.

### Inscripciones

- La inscripción representa acceso autorizado a una convocatoria.
- Debe producirse tras reserva + pago verificado + habilitación de cuenta.

### Horarios y asistencia

- La zona horaria esperada es `America/Lima`.
- Se diferencia horario recurrente, sesión concreta, reprogramación y asistencia.
- No se admite asistencia duplicada por sesión.

### Certificados

- Se diseñan con criterios configurables por curso.
- No se fijan porcentajes universales sin aprobación.

## G. Modelo de datos

Entidades clave:

- `roles`, `usuarios`, `perfiles_docente`, `configuraciones`, `auditoria`
- `categorias`, `cursos`, `secciones`, `horarios_recurrentes`, `sesiones_academicas`
- `interesados`, `reservas`, `pagos`, `inscripciones`
- `tareas`, `quizzes`, `evaluaciones`
- `materiales`, `videos`
- `conversaciones`, `conversacion_participantes`, `mensajes`, `notificaciones`
- `archivos_metadata`

La estructura refleja la intención y los documentos de negocio, pero no constituye una verificación final sobre una base real.

## H. Base de datos

- PostgreSQL: base principal de producción en Supabase.
- Drizzle: modelo tipado desde servidor.
- Migraciones: historia oficial en `supabase/migrations/`.
- Script consolidado: `supabase/sql/supabase_setup.sql`.
- Conexiones: separar `DATABASE_URL` de `DATABASE_MIGRATION_URL` y evitar uso de conexiones privilegiadas en consultas normales.

## I. Seguridad

- Supabase Auth para identidad.
- RLS a definir por tabla y por rol.
- Roles protegidos y no asignables desde metadata visible del cliente.
- `service_role` no se expone.
- Las rutas y paneles del frontend deben depender de un backend y un RLS real.

## J. Archivos y Storage

Todos los archivos académicos, administrativos y personales deben ser privados por defecto.

Buckets propuestos:

- `profiles`
- `documents`
- `submissions`
- `payments`
- `learning-materials`
- `media`
- `admin-documents`
- `attachments`

Los archivos públicos del sitio quedan en assets estáticos del proyecto, no en buckets privados.

## K. Chat y Realtime

- Chat privado 1:1.
- Participantes autorizados únicamente.
- Sin grupos ni acceso indiscriminado del superadministrador.
- Realtime con políticas por miembro autorizado.

## L. Notificaciones y WhatsApp

- Se mantiene la burbuja de contacto público de WhatsApp.
- El enlace se usa solo para contacto del sitio, no como ventana de autenticación ni de datos protegidos.
- Las notificaciones internas se gestionan con registros de estado, destino y leída.

## M. Estadísticas

Se documentan indicadores basados en registros reales:

- estudiantes matriculados,
- pagos verificados,
- asistencia,
- completitud de cursos,
- interacciones en chat,
- material entregado.

No se debe utilizar almacenamiento estadístico artificial.

## N. API

Se mantienen:

- Supabase Auth para sesiones e invitaciones.
- PostgreSQL para persistencia.
- Storage para archivos privados.
- Realtime para mensajes y notificaciones.
- Server Actions y Route Handlers para operaciones específicas del servidor.
- Drizzle para consultas tipadas.

## O. Vercel

La configuración se prepara de forma documental, no ejecutada:

- variables por entorno,
- build command y carpeta de salida,
- configuración de rutas y serverless,
- separación entre preview y producción,
- no secretos en repositorio.

## P. Estado de preparación

### Implementado

- frontend en Next.js,
- documentación técnica,
- contratos y modelos,
- configuración y preparación de Supabase Auth,
- protección fail-closed de rutas.

### Preparado

- acceso SSR, PKCE y page protection,
- estructura de base de datos propuesta,
- contratos API y OpenAPI,
- diseño de Storage y Realtime,
- documentación de Vercel.

### Pendiente de backend

- aplicar las migraciones existentes en un Supabase local desechable y validar su resultado,
- pruebas RLS reales por rol y de acceso cruzado,
- completar las funciones de activación/escaneo y vinculación final de archivos,
- servicios del backend,
- verificación real de auth y roles,
- integración con storage y realtime,
- despliegue real en Vercel.

## Q. Errores y limitaciones

- El proyecto remoto `EDUKATECH Development` está identificado y vinculado al CLI, pero todavía no se han aplicado migraciones remotas.
- Las migraciones se aplicaron y validaron en el PostgreSQL local; el dry-run remoto está bloqueado por falta de contraseña PostgreSQL.
- Las políticas RLS tienen pruebas locales representativas, pero no se ha demostrado su comportamiento remoto ni se considera la cobertura completa.
- No se debe afirmar que RLS, Storage, Realtime o Auth funcionen en producción sin pruebas reales.
- El frontend sigue siendo un entorno de exploración y de representación visual.
- La migración 003 no administra directamente `storage.buckets` ni ACL de `storage.objects`. Los siete buckets se provisionan mediante `scripts/provision-storage-buckets.ts`, restringido a Supabase Local, con comparación previa y rechazo ante discrepancias.
- La auditoría del SQL contabiliza 21 tablas en la migración 002 y 58 políticas públicas en la migración 003, además de 3 políticas de Storage y 2 de Realtime.
- La validación aislada posterior confirmó la aplicación de las tres migraciones, 32 tablas con RLS, siete buckets privados y el comportamiento fail-closed/idempotente del provisionador. La validación Realtime ejecutada fue básica; no constituye una certificación WebSocket completa.

## R. Plan de desarrollo del backend

1. Completar el dry-run de `EDUKATECH Development` y revisar preexistencias.
2. Obtener autorización explícita antes de aplicar las migraciones remotas.
3. Implementar perfiles y roles.
4. Validar auth con `auth.users` y RLS.
5. Crear servicios y repositorios.
6. Gestionar cursos, secciones y horarios.
7. Publicar interesados, reservas y pagos.
8. Implementar inscripciones y asistencia.
9. Definir archivos privados y metadatos.
10. Realizar chat y notificaciones con Realtime.
11. Probar estadísticas.
12. Preparar despliegue final en Vercel.

## S. Instrucciones para el siguiente desarrollador

- Revisar primero `docs/CONTEXTO_PROYECTO_BACKEND.md`.
- Revisar `docs/API_CONTRACT.md` y `docs/openapi.yaml`.
- Revisar `src/lib/db/schema` y `drizzle.config.ts`.
- Revisar `src/lib/supabase/*` para entender el entorno preparado.
- Revisar `database_schema.sql` como referencia histórica, pero no como esquema de producción verificado.
- Trabajar siempre con migraciones y no crear un historial paralelo.
- Documentar cualquier decisión que establezca permisos, roles o flujo de negocio.

Este documento representa el punto de partida real para continuar la implementación del backend sin repetir investigación de dominio.

## Estado tras FASE 14.5

El frontend ya no presenta registros académicos ficticios como información real ni permite autenticación demo. Las rutas y componentes conservan su estructura visual, navegación y contratos de presentación, pero muestran estados vacíos o de integración cuando todavía no existe un servicio real. Supabase Auth SSR/PKCE permanece preparado, sin implementar todavía el flujo completo de autenticación institucional ni servicios de negocio.

No se realizaron cambios remotos ni en Production durante esta fase. La validación funcional por roles, WebSocket, persistencia, responsive en navegador y la integración real quedan pendientes de la FASE 15.

## Estado tras FASE 15

Supabase Auth quedó conectado en código mediante clientes SSR/navegador con PKCE, cookies, login, logout, recuperación, callback y actualización de contraseña. El proxy y el layout validan la existencia de una sesión en servidor; sin configuración, las rutas protegidas se bloquean también en desarrollo.

El registro público es informativo y no crea cuentas. No se implementaron invitaciones administrativas ni asignación de roles: un usuario autenticado sin perfil institucional aprobado se redirige a `acceso-pendiente`. No se modificaron migraciones, tablas, políticas, Storage, Realtime, Production ni Vercel.
