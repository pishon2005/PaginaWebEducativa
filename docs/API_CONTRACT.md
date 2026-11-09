# Contrato de operaciones y servicios

## 1. Propósito y estado

Este contrato asigna las operaciones que necesita el frontend a Supabase o a Next.js sin crear una API REST paralela. Es una especificación de preparación; salvo el flujo de autenticación indicado abajo, **no hay adaptadores de datos ni operaciones de negocio conectadas**. Los contratos TypeScript existentes son interfaces, no implementaciones.

Estados:

- **Implementada en código, no verificada remotamente:** hay una Server Action o Route Handler funcional en el repositorio, pero no se dispone de credenciales para verificar Supabase.
- **Preparada:** existe un contrato tipado en `src/lib/service-contracts.ts` o `src/lib/domain.ts`; no ejecuta consultas ni mutaciones.
- **Pendiente:** existe una funcionalidad visual o regla de negocio, pero falta un contrato suficientemente concreto o el modelo aprobado.
- **Demo:** la pantalla/fixture continúa usando estado local o datos ficticios; no es una operación real.

Las rutas Supabase del SDK (`/auth/v1`, `/rest/v1`, `/storage/v1`, `/realtime/v1`) son servicios gestionados por Supabase, no endpoints personalizados de esta aplicación. Las Server Actions usan el transporte interno de Next.js y no son una API REST pública estable. El único Route Handler personalizado existente es `GET /auth/callback`; está descrito en [openapi.yaml](./openapi.yaml).

## 2. Mecanismo por tipo de operación

| Mecanismo                                                | Uso previsto                                                                                                                                                      | Límite de seguridad                                                                                                                                                                                                                                                  |
| -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Supabase Auth (`@supabase/ssr`, `@supabase/supabase-js`) | Login, logout, sesión/cookies, recuperación, cambio de contraseña, callback PKCE e invitaciones administrativas.                                                  | La sesión identifica; no asigna por sí sola roles de EDUKATECH. Invitaciones requieren autorización de servidor, pago verificado e inscripción.                                                                                                                      |
| Supabase JS con sesión del usuario y RLS                 | Lecturas públicas filtradas y lecturas/escrituras sencillas donde RLS exprese completamente la autorización. También Storage y suscripciones Realtime privadas.   | No usar la publishable key como sustituto de RLS. Comprobar propiedad y relación académica desde políticas de PostgreSQL.                                                                                                                                            |
| Supabase PostgreSQL                                      | Fuente persistente de perfiles/permisos, cursos, convocatorias, pagos, actividad y estadísticas.                                                                  | El esquema actual no está listo para reflejar el modelo definitivo; aún faltan tablas, constraints y políticas.                                                                                                                                                      |
| Next.js Server Components                                | Consultas de lectura inicial del servidor mediante una capa de acceso autenticada que devuelve DTO mínimos.                                                       | Verificar usuario, rol/permisos y relación por recurso. No pasar filas completas ni secretos a componentes cliente.                                                                                                                                                  |
| Next.js Server Actions                                   | Mutaciones de la aplicación, especialmente operaciones administrativas o transaccionales. Cada acción revalida identidad, permiso, entrada y entidad relacionada. | Una Server Action se puede invocar directamente por POST; no confiar en la página, Proxy, formulario o identificadores recibidos.                                                                                                                                    |
| Next.js Route Handlers                                   | Callback PKCE actual y, si se adoptan, webhooks externos firmados.                                                                                                | No añadir endpoints CRUD por costumbre. Validar firma/origen, idempotencia, cuerpo y códigos HTTP.                                                                                                                                                                   |
| Drizzle ORM (`server-only`)                              | Consultas tipadas internas desde servidor cuando el esquema y el rol de conexión estén aprobados.                                                                 | `DATABASE_URL` directa no transporta automáticamente `auth.uid()`/JWT ni garantiza RLS. No ejecutar consultas ordinarias de usuario con rol propietario/privilegiado. Usar Supabase JS bajo JWT/RLS o un contexto/rol transaccional expresamente diseñado y probado. |
| Supabase Storage                                         | Carga directa del navegador autenticado tras intención autorizada; descarga/preview privado por acceso RLS o URL firmada temporal.                                | Buckets privados, permisos sobre objeto y relación de negocio; nunca almacenar URL firmada como referencia permanente.                                                                                                                                               |
| Supabase Realtime                                        | Broadcast privado de señal mínima y posterior lectura autorizada desde PostgreSQL.                                                                                | RLS de tablas y `realtime.messages`; canal/UUID no es autorización. No transmitir el cuerpo del mensaje en el evento.                                                                                                                                                |

### Estado observado de la capa de datos

- `src/lib/service-contracts.ts` importa `server-only`; los contratos de servicio no son módulos cliente.
- `src/lib/db/index.ts` crea Drizzle de forma lazy y reutiliza el cliente a nivel de instancia. Ahora configura `prepare: false`, `max: 1` e `idle_timeout: 20` para reducir conexiones por función serverless y admitir Supavisor en modo transacción.
- No se encontraron consumidores de `getDb()` ni implementaciones de los contratos en `src/`. No hay CRUD de negocio implementado mediante Drizzle ni mediante Supabase JS.
- `DATABASE_MIGRATION_URL` se reserva para Drizzle Kit fuera del runtime; `DATABASE_URL` será solo el pool de ejecución. La URL de migraciones debe ser directa o de sesión, no el pool transaccional.
- El esquema Drizzle no está armonizado: `pagos.ts` vuelve a declarar pagos e inscripciones en otro modelo; `cursos.ts` incluye secciones, pagos, inscripciones y asistencia; roles y usuarios no se relacionan todavía con `auth.users`; tareas/quizzes usan curso mientras semanas pertenecen a secciones; chat usa lectura global y membresía sin límite de dos. No se consulta el esquema como si ya fuera el contrato aprobado.

## 3. Convenciones de solicitudes y respuestas

- ID de entidad: UUID validado en la capa de entrada contra el formato de la entidad; un UUID válido nunca equivale a permiso.
- Fechas de negocio: ISO 8601; horarios recurrentes interpretados en `America/Lima`. La base almacena instantes inequívocos.
- Listados: parámetros explícitos de filtro/cursor/límite; respuesta con `items` y cursor siguiente cuando se implemente. Límites ya tipados en algunos contratos (máximo 100); donde no existe esquema, el límite requiere aprobación antes del adaptador.
- Mutaciones de Server Actions: usar `{ ok: true, data } | { ok: false, error }` (`ActionResult<T>`); retornar DTO mínimo, nunca fila Drizzle/claims/tokens.
- Lecturas Supabase directas: devolver únicamente campos permitidos por RLS; errores de PostgREST se normalizan a los códigos de aplicación.
- Los payloads recibidos nunca deciden el actor, el rol, el dueño, el estado de pago, el destinatario de una notificación ni el estado de la cuenta.
- Las operaciones de checkout, archivos, tareas y otros formularios siguen siendo demo. Su estado local no debe reinterpretarse como respuesta satisfactoria de una operación de servicio.

## 4. Errores normalizados

`ServiceErrorCode` en `src/lib/domain.ts` es el vocabulario de aplicación. Los códigos HTTP siguientes aplican al Route Handler OpenAPI; para Server Actions, Next.js usa su protocolo interno y la interfaz debe normalizar el `ActionResult`.

| Código de aplicación                                          | HTTP de referencia | Mensaje al usuario                                                                                      | Resolución                                                                                          |
| ------------------------------------------------------------- | -----------------: | ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `unauthenticated`                                             |                401 | Inicia sesión para continuar.                                                                           | Usuario: iniciar sesión.                                                                            |
| `session_expired`                                             |                401 | La sesión expiró; vuelve a iniciar sesión.                                                              | Usuario: autenticarse de nuevo.                                                                     |
| `forbidden`                                                   |                403 | No tienes permiso para esta operación.                                                                  | Usuario: no reintentar con otra entidad; soporte si cree que es error.                              |
| `validation`                                                  |            400/422 | Revisa los campos indicados.                                                                            | Usuario: corregir el formulario.                                                                    |
| `not_found`                                                   |                404 | No se encontró el recurso solicitado. Para recursos privados, no revelar si existe para otros usuarios. | Usuario: revisar enlace/identificador.                                                              |
| `conflict`                                                    |                409 | El recurso cambió o la operación ya se procesó.                                                         | Usuario: actualizar la vista; no reintentar ciegamente.                                             |
| `operation_not_allowed`                                       |            405/409 | La operación no está disponible en este estado.                                                         | Usuario: revisar estado/contactar administración.                                                   |
| `rate_limited`                                                |                429 | Se alcanzó el límite; intenta más tarde.                                                                | Usuario: esperar; técnico: revisar regla anti-abuso.                                                |
| `offline`                                                     |                503 | No hay conexión con el servicio.                                                                        | Usuario: reintentar con acción explícita.                                                           |
| `unavailable`                                                 |                503 | El servicio no está disponible temporalmente.                                                           | Técnico: revisar Supabase/Vercel y observabilidad.                                                  |
| `not_configured`                                              |                503 | La función aún no está configurada.                                                                     | Técnico: completar variables/servicio; nunca fallback con apariencia de éxito.                      |
| `file_too_large`, `unsupported_file_type`, `file_quarantined` |        413/415/403 | Explicar el límite o estado aprobado.                                                                   | Usuario: elegir archivo admisible o esperar revisión.                                               |
| `upload_failed`, `storage_unavailable`                        |            502/503 | No se completó la carga.                                                                                | Usuario: conservar referencia temporal/reintentar conforme a intención; técnico: verificar Storage. |
| `internal`, `unknown`                                         |                500 | No se pudo completar la operación.                                                                      | Técnico: investigar con ID de correlación; no mostrar SQL, secretos o stack.                        |

No existe actualmente un mapper general de excepciones de base/Auth a este contrato. Implementarlo junto con cada adaptador, registrar un identificador de correlación y no registrar contraseña, cookie, JWT, código PKCE, contenido de chat ni PII innecesaria.

## 5. Matriz de operaciones

La columna **Método/recurso** indica el límite de aplicación/servicio, no crea una ruta HTTP. Las solicitudes y DTO nombrados abajo describen el contrato previsto. Estado **Preparada** significa solo interface/tipo, no funcionamiento.

### Autenticación

| Operación                  | Método / recurso                                       | Rol                                    | Seguridad                                                                                                                 | Estado                                       |
| -------------------------- | ------------------------------------------------------ | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| Obtener sesión             | Supabase Auth SDK desde Server Component/Server Action | Usuario actual                         | Cookie SSR; no leer tokens manualmente                                                                                    | Implementada en código; sin prueba remota    |
| Iniciar sesión             | Server Action `signInAction` → Supabase Auth           | Anónimo                                | Zod, PKCE/cookies, respuesta de credenciales genérica                                                                     | Implementada en código; sin prueba remota    |
| Cerrar sesión              | Server Action `signOutAction` → Supabase Auth          | Usuario actual                         | Revocar sesión y limpiar cookies                                                                                          | Implementada en código; sin prueba remota    |
| Solicitar recuperación     | Server Action → `resetPasswordForEmail`                | Anónimo                                | Email validado; respuesta no revela cuenta existente                                                                      | Implementada en código; sin prueba de correo |
| Intercambiar callback PKCE | `GET /auth/callback` → Supabase Auth                   | Anónimo con código PKCE de un solo uso | Validar `next` local; no exponer código ni tokens                                                                         | Implementada en código; sin prueba remota    |
| Actualizar contraseña      | Server Action → `updateUser`                           | Sesión del flujo reset                 | Sesión PKCE válida, contraseña confirmada y mínimo existente                                                              | Implementada en código; sin prueba remota    |
| Invitar/habilitar cuenta   | Server Action + Supabase Auth Admin API                | Admin autorizado                       | Verificar permiso, pago verificado, reserva/inscripción, rol permitido y auditoría; sin servicio privilegiado actualmente | Pendiente                                    |

Detalles por operación:

- **Obtener sesión:** solicitud sin parámetros. Respuesta `AuthSession { userId, role, accountStatus } | null`; hasta implementar perfil protegido no se puede resolver el DTO completo de rol. Auth identifica al usuario; rol/estado provienen del perfil PostgreSQL protegido. Errores de sesión expirada o servicio no disponible; nunca considerar `user_metadata` como autorización.
- **Iniciar sesión:** entrada `{ email, password }`, validada con `SignInInputSchema`; respuesta de la acción `{ redirectTo }` o error genérico. Supabase verifica credenciales; no se crea cuenta ni se concede rol. La navegación demo solo funciona en desarrollo sin Supabase y no es una sesión real.
- **Cerrar sesión:** sin payload de identidad; respuesta redirect `/login`. El servidor elimina sesión. Error de red debe comunicarse explícitamente; nunca conservar una sesión local simulada en producción.
- **Solicitar recuperación:** entrada email, respuesta genérica de éxito para no enumerar cuentas. Supabase entrega el enlace si corresponde; validar `NEXT_PUBLIC_SITE_URL` y callback permitido. Error de validación/configuración/conectividad.
- **Callback PKCE:** query `code` requerida y `next` local opcional; salida redirect al destino validado o login con error genérico. El código es de un solo uso y no debe registrarse. Next.js intercambia la sesión mediante cookies SSR; no aceptar URLs externas ni retornar tokens.
- **Actualizar contraseña:** entrada contraseña/confirmación; respuesta éxito sin credenciales. Requiere usuario Auth del flujo de reset; al cambiar, se cierra sesión. Error de validación, sesión expirada, política Auth o proveedor.
- **Invitar/habilitar:** solicitud con reserva/inscripción existente y datos validados; rol limitado `admin|profesor|alumno` según la política. Respuesta perfil mínimo e invitación iniciada. El servidor comprueba actor/permisos y pago de matrícula verificado en la misma operación lógica; no se habilita hasta implementar tablas/relaciones/RLS y clave administrativa solo servidor.

### Usuarios, administradores, docentes y estudiantes

| Operación                                                 | Método / recurso                       | Rol                                                     | Seguridad                                               | Estado                             |
| --------------------------------------------------------- | -------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------- | ---------------------------------- |
| Leer/actualizar perfil propio                             | Supabase JS + RLS o Server Action      | Cualquier usuario autenticado                           | `user_id = auth.uid`; campos allowlist sin rol/estado   | Preparada                          |
| Listar/ver perfiles administrativos                       | Server Component/Action + DAL          | Admin; superadmin según recurso                         | Filtro/paginación y permiso funcional                   | Preparada                          |
| Crear/invitar administrador                               | Server Action + Auth Admin API         | Superadmin                                              | Solo rol admin; auditoría; no autoasignación superadmin | Preparada, sin operación real      |
| Suspender cuenta                                          | Server Action + DAL/Auth               | Admin autorizado; superadmin para admins según política | Comprobar actor, no autoelevar, preservar historial     | Preparada                          |
| Listar/ver perfil público docente                         | Supabase JS/RLS o Server Component     | Público                                                 | Solo campos publicados; filtros/paginación              | Preparada                          |
| Actualizar perfil docente propio                          | Server Action + RLS/DAL                | Docente                                                 | ID derivado de sesión; bio/especialidades en allowlist  | Pendiente de contrato específico   |
| Leer resumen/inscripciones propias de estudiante          | Supabase JS con RLS / Server Component | Estudiante                                              | Propiedad por `auth.uid()`                              | Preparada                          |
| Listar alumnos de sección                                 | Supabase JS con RLS / Server Component | Docente asignado o admin autorizado                     | Sección y matrícula comprobadas; devolver PII mínima    | Preparada                          |
| Consultar/gestionar roles y administradores de plataforma | Server Action + DAL                    | Superadmin                                              | Rol fuente de perfil protegido; cambios auditados       | Parcial; lista/roles visuales demo |

Detalles:

- Perfil propio recibe `UserProfileUpdate` y responde `UserProfile`; Zod adicional y reglas por campo son necesarias. Email/rol/estado no se cambian por esa operación.
- Listados reciben filtros de `UserAdministrationFilter`; respuesta es colección paginada pendiente de cursor común. Se comprueba el rol y el ámbito en servidor/RLS; no confiar en `role` del query.
- La cuenta de estudiante tras pago requiere el identificador de reserva en servidor; no permitir correo/rol/estado privilegiado autoseleccionados por un cliente no autorizado. Errores: pago no verificado, reserva inexistente, email duplicado, conflicto, forbidden.
- El CRUD de perfiles públicos no autoriza la lectura de documentación privada ni datos de contacto ocultos.

### Cursos y categorías

| Operación                     | Método / recurso                   | Rol                                   | Seguridad                                                 | Estado    |
| ----------------------------- | ---------------------------------- | ------------------------------------- | --------------------------------------------------------- | --------- |
| Listar cursos publicados      | Supabase JS/RLS o Server Component | Público                               | RLS limita a publicados; filtros explícitos y límite      | Preparada |
| Leer curso por slug           | Supabase JS/RLS o Server Component | Público                               | Slug validado; devolver campos públicos                   | Preparada |
| Listar/crear/actualizar curso | Server Component/Action + DAL      | Admin                                 | RLS más permiso administrativo; categoría principal única | Preparada |
| Listar categorías             | Supabase JS/RLS                    | Público/autenticado según publicación | Solo catálogo permitido                                   | Preparada |
| Crear/actualizar categoría    | Server Action + DAL                | Admin                                 | Slug único validado y permisos                            | Preparada |

- Solicitud pública de catálogo: filtros del UI (modalidad/nivel/precio/duración) solo aplican cuando los atributos y reglas existan. Respuesta `CourseSummary[]`; datos demo actuales no son fallback.
- Curso por slug inexistente/no publicado responde `not_found`. Evitar diferencia que permita filtrar borradores.
- Mutación administra `CourseAdministrationInput` (título, slug, categoría, descripción y publicación); Zod ya limita longitud/formato. El actor y el ID de auditoría se derivan en servidor.
- Categoría es única por curso de acuerdo a modelo aprobado; conflicto de slug y referencias inválidas devuelven `conflict`/`validation`.
- No se define borrado destructivo de cursos con actividad; archivar/despublicar requiere regla institucional.

### Secciones, horarios, interesados y reservas

| Operación                                    | Método / recurso                                        | Rol                                                           | Seguridad                                                                        | Estado    |
| -------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------- | -------------------------------------------------------------------------------- | --------- |
| Listar secciones por curso / propias         | Supabase JS/RLS o Server Component                      | Público (publicadas), docente asignado, estudiante inscrito   | RLS por publicación/asignación/inscripción                                       | Preparada |
| Listar/crear/actualizar secciones y horarios | Server Action + DAL                                     | Admin                                                         | Validar curso, docente, modalidad, fechas, horario y permiso                     | Preparada |
| Consultar disponibilidad                     | Supabase JS/RLS o Server Component                      | Público/alumno/admin según estado                             | Respuesta informativa; no reserva cupo                                           | Preparada |
| Registrar interés público                    | Server Action                                           | Anónimo                                                       | Campos mínimos, rate limit/captcha por definir, no crea cuenta ni reserva        | Preparada |
| Consultar demanda                            | Supabase JS/RLS o Server Component                      | Admin; docente solo agregado de cursos asignados              | No exponer PII al docente por defecto                                            | Preparada |
| Iniciar checkout/solicitar reserva           | Server Action una vez aprobada la transición de negocio | Visitante/alumno según flujo final                            | Vincular curso, sección, interesado y periodo abierto; sin crear pago verificado | Pendiente |
| Listar reservas                              | Server Component/Supabase JS con RLS                    | Alumno propietario; admin; docente sin PII solo si se aprueba | Propiedad/permiso y filtros                                                      | Preparada |
| Confirmar/cancelar reserva                   | Server Action transaccional                             | Admin autorizado                                              | Transición manual; control de cupo atómico; auditoría                            | Preparada |

- Sección entrada existente `SectionAdministrationInput` incluye curso, docente, modalidad presencial/virtual, fechas, capacidad, horarios en `America/Lima`, ventana y estado. El catálogo definitivo de estados sigue pendiente; no aceptar un valor libre sin catálogo.
- Disponibilidad responde `SectionAvailability`; no promete que aún exista cupo a la hora de confirmar.
- Interés entrada `CourseInterestInput` (nombre, correo, teléfono opcional, curso, modalidad, horario opcional); respuesta `void`/acuse genérico. Validar curso publicado y protección antiabuso. No crear postulación, usuario, pago o reserva como efecto colateral.
- Demanda recibe `CourseDemandFilter`; devuelve agregados `CourseDemandSummary`. Docente limita a sus secciones/cursos y no obtiene PII si no se aprueba expresamente.
- Reserva listados usan `ReservationAdministrationFilter` y RLS/propiedad. Confirmar/cancelar requiere estado permitido y actor admin; la disponibilidad/cupo se verifica atómicamente en Postgres. Sin vencimientos/cancelaciones automáticas.
- Crear reserva como operación iniciada por estudiante aún no tiene contrato tipado ni regla completa; no inferirla de un interés o checkout demo.
- El checkout actual permite elegir Yape/Plin y seleccionar un comprobante local, pero no define un backend. Método admitido, importe, relación con reserva y si el visitante puede reservar sin cuenta requieren definición antes de exponer una mutación.

### Pagos e inscripciones

| Operación                                  | Método / recurso                         | Rol                                    | Seguridad                                                           | Estado            |
| ------------------------------------------ | ---------------------------------------- | -------------------------------------- | ------------------------------------------------------------------- | ----------------- |
| Enviar comprobante y crear reporte de pago | Storage SDK + Server Action de metadatos | Alumno propietario                     | Reserva válida, objeto privado y controles de Storage               | Pendiente         |
| Ver pagos propios / lista revisión         | Supabase JS/RLS o Server Component       | Alumno propio; Admin para revisión     | Separar resultado propio de consulta administrativa                 | Preparada parcial |
| Ver pago e historial                       | Supabase JS/RLS o Server Component       | Propietario y admin de revisión        | No exponer voucher a roles no autorizados                           | Preparada         |
| Verificar/rechazar pago                    | Server Action transaccional              | Admin con permiso de pagos             | `PaymentReviewInput`, motivo y auditoría; pago total manual         | Preparada         |
| Consultar inscripción propia/por sección   | Supabase JS/RLS                          | Alumno propio, docente asignado, admin | Relación de sección; datos mínimos                                  | Preparada         |
| Confirmar inscripción desde reserva pagada | Server Action transaccional              | Admin autorizado                       | Pago verificado, cuenta habilitada/invitación y reserva relacionada | Preparada         |

- La entrada de pago contendrá reserva, importe/moneda/método permitidos y referencia de archivo; no aceptar estado `verified`, revisor, usuario de destino o URL firmada del navegador.
- La carga de comprobante debe crear intención Storage separada; la referencia guardada es ID/ruta durable. Confirmar revisión crea historial inmutable de actor/decisión/fecha/nota.
- No hay pasarela, pago parcial ni webhook financiero. El esquema actual no contiene tabla final `payment_reviews` ni relación aprobada a reserva; revisar pagos está bloqueado hasta diseño/migración.
- Inscripción responde DTO `EnrollmentSummary`; confirmar requiere verificación servidor y una transacción idempotente para no duplicar matrícula/invitación. Una reserva o pago por sí solo no da acceso al contenido.

### Horarios, sesiones, asistencia y progreso

| Operación                         | Método / recurso                                                                  | Rol                                                | Seguridad                                                                | Estado                                 |
| --------------------------------- | --------------------------------------------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------ | -------------------------------------- |
| Listar sesiones por sección       | Supabase JS/RLS o Server Component                                                | Alumno inscrito, docente asignado, admin           | RLS sobre inscripción/asignación                                         | Preparada parcial                      |
| Cargar calendario del usuario     | Supabase JS/RLS o Server Component compuesto por secciones y sesiones autorizadas | Estudiante/docente actual                          | Derivar el ámbito de inscripciones/asignaciones; no aceptar otro userId  | Pendiente de operación agregada        |
| Crear/reprogramar/cancelar sesión | Server Action + DAL                                                               | Admin/docente asignado según permiso               | Cambios trazables, zona Lima; cancelación autorizada                     | Parcial (reprogramar/cancelar tipadas) |
| Leer asistencia                   | Supabase JS/RLS                                                                   | Alumno propia; docente/admin según sección         | Propiedad/relación, no exponer otros registros al alumno                 | Preparada parcial                      |
| Registrar asistencia              | Server Action o Supabase JS con RLS                                               | Docente asignado/admin autorizado                  | Sesión y matrícula comprobadas; estudiante ID no concede permiso         | Preparada                              |
| Corregir asistencia               | Server Action transaccional                                                       | Docente responsable/admin autorizado               | `AttendanceChangeInput` con justificación; historial actor/antes/después | Preparada                              |
| Consultar progreso/calificaciones | Supabase JS/RLS                                                                   | Alumno propio; docente de sección; admin funcional | No mostrar respuestas correctas/PII no requeridas                        | Pendiente                              |

- La modalidad se toma de la sección; no se acepta desde un navegador para individualizarla por sesión. No implementar `preferencias_modalidad` demo.
- La interfaz de asistencia soporta guardar/exportar e importación local CSV/XLSX; importación masiva real requerirá formato aprobado, validación por fila, autorización e informe de errores; no se transporta como endpoint de archivo grande sin necesidad.
- Cambios posteriores a toma de lista exigen permiso, justificación y log. No se define porcentaje ni progreso computado hasta aprobar fórmula/denominador.
- La tabla Drizzle actual vincula asistencia a `claseId`, no a la entidad conceptual definitiva `academic_sessions`; contrato de lectura no es funcional hasta reconciliar el modelo.

### Tareas, quizzes y certificados

| Operación                                            | Método / recurso                                                           | Rol                                | Seguridad                                                              | Estado                           |
| ---------------------------------------------------- | -------------------------------------------------------------------------- | ---------------------------------- | ---------------------------------------------------------------------- | -------------------------------- |
| Listar/leer tareas de sección                        | Supabase JS/RLS o Server Component                                         | Alumno inscrito; docente asignado  | Filtrar por sección y publicación                                      | Pendiente de servicio específico |
| Crear/actualizar tarea y rúbrica                     | Server Action + DAL                                                        | Docente asignado/admin autorizado  | Validar fechas, sección y rúbrica; cambios auditables                  | Pendiente                        |
| Entregar/reintentar tarea                            | Storage SDK + Server Action de metadatos                                   | Alumno inscrito y titular          | Plazo/intent count según regla aprobada, archivo privado               | Pendiente                        |
| Listar/revisar/calificar entregas                    | Server Component/Action                                                    | Docente asignado; admin funcional  | Protección de respuestas, notas y archivo de estudiante                | Pendiente                        |
| Listar/leer quiz                                     | Supabase JS/RLS                                                            | Alumno inscrito/docente asignado   | DTO alumno excluye respuestas correctas                                | Pendiente                        |
| Crear/editar quiz y preguntas                        | Server Action + DAL                                                        | Docente asignado/admin autorizado  | Preguntas/clave de respuesta solo servidor; validar versión y puntajes | Pendiente                        |
| Iniciar/enviar intento                               | Server Action transaccional                                                | Alumno inscrito                    | Límite de intentos/tiempo; respuestas y nota calculadas en servidor    | Pendiente                        |
| Consultar resultado                                  | Supabase JS/RLS                                                            | Alumno dueño; docente asignado     | No revelar clave hasta regla de publicación                            | Pendiente                        |
| Listar certificados propios/verificar código público | Supabase JS/RLS o Server Component; verificación pública de campos mínimos | Alumno propio / público por código | Código validado y respuesta anti-enumeración mínima                    | Pendiente                        |

Las interfaces actuales no incluyen contratos específicos de tareas, entregas, quizzes, intentos ni certificados. No se inventan todavía DTOs/esquemas porque faltan reglas aprobadas sobre tipos de pregunta, equipos/grupos, rúbrica, límite de intentos, puntuación, retención y criterios de certificación. Los 50 MB y los tipos del input demo no son límites productivos.

### Materiales, videos y archivos privados

| Operación                      | Método / recurso                                                    | Rol                                                 | Seguridad                                                         | Estado              |
| ------------------------------ | ------------------------------------------------------------------- | --------------------------------------------------- | ----------------------------------------------------------------- | ------------------- |
| Listar/leer recurso de sección | Supabase JS/RLS o Server Component                                  | Alumno inscrito, docente asignado, admin autorizado | Relación activa y campos mínimos                                  | Preparada           |
| Crear/actualizar contenido     | Server Action + DAL                                                 | Docente asignado/admin autorizado                   | Sección autorizada y `LearningResourceInput`                      | Preparada           |
| Solicitar intención de carga   | Server Action + DAL                                                 | Titular/docente/admin autorizado según entidad      | `PrivateFileUploadInput`; ruta/bucket generados server-side       | Preparada           |
| Subir bytes                    | Supabase Storage JS, autenticado y directo                          | Actor autorizado                                    | RLS de bucket/ruta y sesión; no Vercel proxy                      | Preparada           |
| Finalizar/reintentar/cancelar  | Server Action + DAL                                                 | Creador autorizado                                  | Verificar objeto/estado/relación; idempotencia                    | Preparada           |
| Descargar/previsualizar        | Supabase Storage RLS o Server Action que emite URL firmada temporal | Propietario/inscrito/docente/admin según archivo    | RLS/relación del objeto, Content-Disposition seguro               | Preparada           |
| Reemplazar/eliminar archivo    | Server Action + DAL/Storage                                         | Propietario/actor autorizado                        | Nueva ruta versionada, retención/auditoría, verificar referencias | Preparada           |
| Crear/reproducir video         | Storage privado o proveedor especializado por decidir               | Docente/admin y estudiante inscrito                 | Token/reproducción temporal, sin URL pública durable              | Pendiente proveedor |

- `PrivateFileServiceContract` ya define intención, completion, retry, cancel, preview, download, replace y delete; no hay implementación, buckets reales ni límites por categoría.
- La subida de bytes es transferencia directa del cliente al servicio Storage con sesión bajo RLS. Server Action crea la intención/autoriza y finaliza; nunca enviar binario grande/Base64 por Action/Route Handler.
- Las URLs firmadas son temporales y bearer; no incluirlas en logs/BD ni usar como ID. MIME real, escaneo, cuarentena, TTL, tamaño/extensiones y retención están pendientes.
- No se decidió Supabase Storage versus Cloudflare Stream/Mux para videos. No añadir endpoint hasta elegir proveedor. Si se eligiera un proveedor con webhook, crear Route Handler firmado e idempotente en una fase posterior.

### Chat y notificaciones

| Operación                           | Método / recurso                                         | Rol                                 | Seguridad                                                      | Estado    |
| ----------------------------------- | -------------------------------------------------------- | ----------------------------------- | -------------------------------------------------------------- | --------- |
| Listar/iniciar conversación         | Supabase JS/RLS o Server Action para creación autorizada | Participantes de parejas permitidas | Exactamente 1:1 y relación estudiante-docente asignado/soporte | Preparada |
| Leer historial paginado             | Supabase JS/RLS / Server Component                       | Participante activo                 | Cursor compuesto, filtro por membresía                         | Preparada |
| Enviar/marcar lectura               | Server Action o Supabase JS con RLS                      | Participante activo                 | Remitente de sesión; lectura por usuario                       | Preparada |
| Suscribirse Realtime                | Supabase Realtime JS, canal privado                      | Participante activo                 | Policy `realtime.messages`, payload solo con ID/fecha          | Preparada |
| Listar/contar/marcar notificaciones | Supabase JS/RLS; Server Action para marcar               | Destinatario autenticado            | `recipient_id = auth.uid()`                                    | Preparada |
| Crear notificación                  | Transacción/outbox servidor                              | Servicio de negocio autorizado      | Destinatario derivado de relación, tipo y link allowlisted     | Pendiente |

Detalle de request/response:

- Conversación recibe `ConversationStartInput`; respuesta `PrivateConversation` con dos participantes, resumen/no leídos. Zod comprueba forma, servidor comprueba roles/asignación/matrícula/soporte y transacción evita pares duplicados. Grupos y acceso automático superadmin prohibidos.
- Historial recibe ID y `MessageHistoryQuery`; `MessageHistoryPage` contiene mensajes más `nextCursor`. La misma identidad activa se valida en cada consulta; ID existente sin permiso no diferencia existencia.
- Envío recibe `SendMessageInput` y respuesta `PrivateMessage`. El ID de remitente deriva de sesión. El texto se limita a 4000 chars en schema existente; idempotencia de envío debe añadirse al diseño final. No hay envío real.
- Evento Realtime no incluye contenido; reconectar implica volver a consultar con RLS. Dar de baja canal al salir/cambiar sesión. Revocación no puede deshacer eventos ya recibidos.
- Notificación recibe `NotificationListFilter`; respuesta es una lista propia más conteo. `markRead` y `markAllRead` solo afectan destinatario actual. Creación, destinatario y destino se derivan server-side.

### Estadísticas, auditoría y configuración administrativa

| Operación                         | Método / recurso                     | Rol                                                | Seguridad                                                    | Estado                       |
| --------------------------------- | ------------------------------------ | -------------------------------------------------- | ------------------------------------------------------------ | ---------------------------- |
| Estadística del rol actual        | Supabase JS/RLS o Server Component   | Usuario actual                                     | Ámbito según perfil real y relaciones                        | Preparada                    |
| Estadística institucional         | Server Component + DAL/RPC           | Admin autorizado                                   | Agregados mínimos; consulta segura/índices                   | Preparada                    |
| Estadística de plataforma         | Server Component + DAL/RPC           | Superadmin                                         | Alcance de plataforma; no contenido privado de chat/archivos | Preparada                    |
| Listar auditoría                  | Supabase JS/RLS o Server Component   | Admin/superadmin según ámbito                      | Filtros, no mutación; redactar PII/secrets                   | Preparada                    |
| Escribir evento de auditoría      | Transacción desde operación servidor | Proceso servidor                                   | Append-only; actor derivado y acción controlada              | Pendiente                    |
| Leer/actualizar ajustes del sitio | Server Component/Action + DAL        | Público solo campos publicados; admin para cambiar | Allowlist de campos, sin valores secretos en cliente         | Pendiente de contrato/modelo |

- DTO de estadísticas existentes cubren conteos, demanda, enrolamientos y asistencia, pero no todos los paneles ni fórmulas aprobadas. `attendancePercentage` solo es válido tras aprobar denominador.
- Auditoría recibe `AuditLogFilter` y responde `AuditLogSummary[]`; usuario no puede crear, cambiar o borrar logs.
- Configuración visual demo muestra nombre, descripción, email, color y logo. Persistencia, secreto/scope de campos, almacenamiento del logo y roles exactos no están aprobados; no realizar operación real.

### Tienda de productos

La ruta `/tienda` muestra catálogo de componentes mecatrónicos, pero el alcance comercial no está aprobado y el modelo académico excluye sus ventas. No se asigna servicio ni endpoint de checkout a esta tienda en FASE 9. Si se confirma como comercio real, requiere contrato/modelo separado para catálogo, inventario, pedidos, pagos y devoluciones; no reutilizar reservas, pagos manuales o inscripciones como sustituto.

## 6. Contratos y separación de servicios

Contratos existentes que se reutilizan:

- `AuthServiceContract`, `UserServiceContract`, `AccountAdministrationServiceContract`.
- `CourseServiceContract`, `CourseAdministrationServiceContract`, `CourseCategoryServiceContract`, `TeacherServiceContract`, `StudentServiceContract`.
- `SectionServiceContract`, `SectionAdministrationServiceContract`, `CourseInterestServiceContract`, `ReservationServiceContract`, `PaymentServiceContract`, `EnrollmentServiceContract`.
- `AttendanceServiceContract`, `AcademicSessionServiceContract`, `LearningContentServiceContract`, `LearningContentAdministrationServiceContract`, `PrivateFileServiceContract`.
- `ChatServiceContract`, `NotificationServiceContract`, `StatisticsServiceContract`, `AuditLogServiceContract`.

No se crearon implementaciones vacías ni clientes mock. Falta diseñar contratos/modelos validables para tareas/entregas, quizzes/intentos, certificados, creación de notificaciones, settings administrativos y alguna operación pública de checkout/reserva. Se documentan como pendientes para no cristalizar reglas o DTOs que no han sido aprobados.

Al implementar:

1. Dejar cliente-browser solo para Supabase SDK con clave publicable, Storage bajo RLS y Realtime privado; importa únicamente tipos/isomorphic modules no privilegiados.
2. Dejar cliente SSR por request para cookies Auth/RLS. No compartir sesión en variables globales ni cachear DTO sensible entre usuarios.
3. Mantener servicios/DAO/Drizzle en archivos `server-only`; las Server Actions solo parsean entrada, delegan al DAL autenticado, normalizan errores y revalidan UI.
4. React Query administra estados client-side para consultas cacheables cuando sean realmente invocadas desde cliente; no duplicar `useState` de datos como fuente de verdad. Definir keys por usuario/rol/entidad e invalidarlas al mutar/cambiar sesión.
5. Server Components pueden leer a través del DAL y pasar DTO mínimos. No importar `service-contracts.ts` a componentes cliente por su guard `server-only`.
6. Usar `ActionResult<T>` para Actions; retorno sin secretos/filas completas. Server Components pueden lanzar errores tipados hacia boundaries; los endpoints HTTP normalizan a OpenAPI.
7. El acceso directo por Supabase JS y el acceso por Drizzle no deben coexistir para la misma operación hasta documentar qué RLS aplica. Una conexión de servidor con privilegios elevados no es un atajo para datos del usuario.

## 7. Seguridad, persistencia y observabilidad

- Perfil/rol en PostgreSQL protegido es fuente de autorización; no cliente, pathname o metadata editable.
- RLS obligatorio en todas las tablas de negocio y `storage.objects`; Realtime privado con policy independiente.
- Cada acción directa/ID recibido vuelve a comprobar propiedad y relación (sección asignada, inscripción, pago, participante).
- Acciones administrativas sensibles requieren transacción/función segura, actor y auditoría. Invitación no disponible antes de verificar pago y reserva en el backend.
- No existe `service_role` instalado o cliente admin; variable reservada en `.env.example`, no necesaria en Vercel ahora. Nunca usarla en navegador.
- No registrar contraseñas, JWT, URL firmada, código PKCE, contenido de chat ni voucher. Logs técnicos usan request/correlation ID, acción, resultado y entidad no sensible.
- Añadir limitación de frecuencia donde hay abuso/costo (login/recuperación, interés, invitación, subida, creación de mensaje); proveedor/umbrales están pendientes.
- Consultas con paginación y selección de columnas; evitar N+1, recounts en cada render y consultas duplicadas. Cache pública solo cuando sea segura y con tags/invalidación; no cachear perfil, permisos, archivos o datos privados entre usuarios.

## 8. Decisiones y bloqueos pendientes

1. Alinear esquema Drizzle con Auth/roles/perfiles y resolver la duplicación de `pagos`/`inscripciones`, secciones/sesiones y relación de tareas/quizzes.
2. Definir estrategia única de conexión de usuario con RLS. `getDb()` actual no establece contexto JWT; no habilitar consultas Drizzle de usuarios hasta probar rol, `auth.uid()`, transaction-local settings y pooling, o usar Supabase JS user-scoped.
3. Definir tablas, migraciones y RLS para reserva, reviews de pago, inscripciones, certificados, archivos, lecturas/notificaciones, auditoría, tareas y quizzes.
4. Terminar reglas de estados de sección/reserva, capacidad atómica, usuarios/roles, códigos de quiz, límites de intentos, puntuación, rúbrica, certificados y settings.
5. Acordar límites MIME/tamaño, TUS, análisis de contenido, Storage y proveedor video, notificaciones/outbox, retención, rate limit y CAPTCHA.
6. Proporcionar configuración Supabase/Vercel de desarrollo y entorno aislado para validar cada permiso/operación; ninguna credencial se requiere para esta preparación.
7. No desplegar ni declarar módulo productivo hasta pruebas de integración con cada rol, RLS directa, errores, ausencia/datos/error/carga, expiración y red desconectada.

## 9. Referencias de fase

- [INVENTARIO_FRONTEND.md](./INVENTARIO_FRONTEND.md)
- [REGLAS_NEGOCIO_Y_MODELO_DATOS.md](./REGLAS_NEGOCIO_Y_MODELO_DATOS.md)
- [AUTENTICACION_Y_SEGURIDAD.md](./AUTENTICACION_Y_SEGURIDAD.md)
- [ARCHIVOS_STORAGE_Y_MATERIALES.md](./ARCHIVOS_STORAGE_Y_MATERIALES.md)
- [CHAT_NOTIFICACIONES_Y_REALTIME.md](./CHAT_NOTIFICACIONES_Y_REALTIME.md)
- Next.js 16 local docs consultados: `mutating-data`, `route-handlers`, `data-security`, `deploying` y `proxy` bajo `node_modules/next/dist/docs/01-app/`.

## FASE 15 — Auth implementado

Las operaciones de autenticación disponibles son:

- `signInAction`: valida correo y contraseña con Zod y ejecuta `signInWithPassword` en servidor.
- `signOutAction`: invalida la sesión Supabase y redirige a `/login`.
- `requestPasswordResetAction`: solicita recuperación con respuesta neutral para no revelar si existe una cuenta.
- `updatePasswordAction`: exige sesión de recuperación, valida confirmación y ejecuta `updateUser`.
- `GET /auth/callback`: intercambia el código PKCE y solo permite destinos internos.

El registro público no expone `signUp()`. Las invitaciones requieren autorización institucional y quedan fuera de esta fase. Las rutas privadas exigen sesión, pero la autorización por rol y perfil permanece pendiente.
