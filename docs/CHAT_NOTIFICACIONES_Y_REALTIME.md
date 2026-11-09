# Chat privado, notificaciones y Realtime

## Alcance y estado

Esta guía define la preparación de la FASE 8 para Next.js 16 App Router, Supabase PostgreSQL/Auth/Realtime, Drizzle y Vercel. No es una migración ni demuestra que exista una integración remota. No se crearon tablas, políticas ejecutables, acciones, consultas, suscripciones Supabase o datos de producción.

Las pantallas `DemoChat` y `DemoNotificationsPage` continúan siendo fixtures locales. Sus cambios de estado solo viven en el navegador; elegir un archivo en el chat únicamente muestra su nombre y no lo sube ni lo envía. Los contratos preparados no son servicios ni realizan operaciones. No se eliminaron fixtures porque todavía sostienen las vistas.

## Reglas del chat

- Solo se permiten conversaciones 1:1: estudiante con docente asignado, estudiante con administrador para soporte, y docente con administrador.
- No existen conversaciones de grupo, de curso con varios estudiantes ni entre compañeros/colegas.
- Superadministrador no recibe acceso automático por rol. Cualquier acceso excepcional debe ser un permiso funcional explícito, limitado, autorizado y auditado; la decisión de añadir ese permiso sigue pendiente.
- El usuario autenticado se obtiene en servidor. El remitente, el rol y la pertenencia nunca se aceptan como autoridad desde el navegador.
- Un ID de conversación no concede acceso. Cada lectura, envío, consulta de recibos y suscripción vuelve a comprobar la identidad y la participación activa.
- Al crear o recuperar una conversación, el servidor valida los dos perfiles y la relación permitida. Para estudiante-docente debe comprobar matrícula/inscripción activa en una sección y docente asignado; los pares con administración requieren identidad de administrador y permiso de soporte. La sección, si aplica, se resuelve desde datos de confianza, no de campos libres del cliente.
- La relación válida, la unicidad del par y la revocación deben imponerse en PostgreSQL mediante restricciones/índices, transacciones y RLS; la validación del formulario no las sustituye.

## Contratos tipados preparados

Los esquemas compartidos de `src/lib/domain.ts` validan el destinatario, una sección contextual opcional, filtros y cursores estables, límite de página y cuerpo de mensaje (1–4000 caracteres tras trim). Zod no autoriza al participante ni verifica matrícula, permisos, contenido adjunto o sesión.

`src/lib/service-contracts.ts` declara:

- Listado de conversaciones autorizadas con búsqueda y cursor; inicio/recuperación idempotente de conversación autorizada.
- Historial paginado por cursor compuesto (`sentAt`, `messageId`) y envío de texto.
- Marcar leído por mensaje o hasta un mensaje concreto y consulta de no leídos.
- Bandeja propia de notificaciones con filtro por tipo, estado de lectura, cursor compuesto (`createdAt`, `notificationId`), conteo no leído y marcar una/todas como leídas.

Los modelos de `src/lib/models.ts` representan explícitamente dos participantes, resumen del último mensaje, cantidad no leída, fecha de lectura del usuario y estado local de envío. El recibo de lectura debe ser por participante (por mensaje o mediante un cursor `last_read_at` por participante), no un booleano global que revele la lectura de una persona a la otra.

Las interfaces cliente-seguras de suscripción viven en los modelos compartidos y devuelven una función de baja. Los eventos solo anuncian `message_available` con ID/conversación/fecha o `notification_available` con ID/fecha; no contienen el mensaje, datos personales ni JWT. Al llegar un evento, el cliente vuelve a consultar el registro mediante una operación autorizada y RLS.

Las interfaces de servicio siguen protegidas por `server-only`. En una implementación, Server Actions o Route Handlers deben autenticar y autorizar cada llamada, validar entradas, verificar relación/participación dentro de la operación y usar Drizzle solo en servidor. No se añade un API REST separado. Las acciones no deben transportar binarios de adjuntos.

## Persistencia propuesta (no es SQL definitivo)

El modelo persistente debe poder representar:

- Conversación individual, contexto opcional de sección y dos participantes con relación/estado de participación y fecha de revocación.
- Mensaje de texto con remitente, conversación, fecha, identificador estable y estado; los adjuntos se referencian por ID permanente de archivo (`bucket + objectPath` administrado por Storage), no por bytes, Base64 o URL firmada.
- Lectura individual por participante, no un solo `mensajes.leido` compartido.
- Notificación destinataria, tipo controlado, título/cuerpo, entidad e ID relacionados, fecha de creación y fecha de lectura.

El esquema Drizzle actual en `src/lib/db/schema/chat.ts` es legado/conceptual y no se cambió: contempla tipo/nombre y curso en la conversación, cualquier cantidad de participantes, un booleano de lectura global y `archivoUrl`; las notificaciones usan `leida` y URL de destino libre. No garantiza por sí solo las reglas 1:1, recibos privados, referencias seguras a Storage ni persistencia real. Antes de conectarlo se debe diseñar y aprobar el cambio de esquema, constraints, índices, migraciones oficiales y políticas RLS; esta fase no genera SQL ni edita Drizzle.

## RLS y autorización de datos

Políticas propuestas sujetas al modelo final:

1. **Conversaciones:** `SELECT` solo para participantes activos. Las escrituras de estructura se reservan a una operación transaccional del servidor que compruebe el par permitido; no admitir que el cliente agregue a un tercer participante o cambie el contexto.
2. **Participantes:** un usuario solo puede consultar su propia relación y las relaciones de la conversación en la que ya participa. No puede autoañadirse, reactivar una relación revocada ni añadir a otro usuario.
3. **Mensajes:** `SELECT` solo si el usuario es participante activo. `INSERT` exige que `sender_id = auth.uid()` y que el usuario siga activo; el servidor valida el límite, texto permitido y conversación. Cliente no puede cambiar remitente, fecha ni lectura ni borrar/modificar historia ajena.
4. **Lecturas:** cada participante solo consulta/actualiza su propio recibo y solo en mensajes de conversaciones en las que es participante. No revelar cuándo el otro participante leyó, salvo que se apruebe esa función.
5. **Notificaciones:** solo el destinatario lee y marca como leídas sus propias filas. Creación, destinatario, tipo, referencia y destino son exclusivamente de servidor/operación autorizada; no existe endpoint para que un usuario se genere notificaciones ni notifique a otro.
6. **Administración:** no dar acceso global por rol de administrador o superadministrador a mensajes. El acceso a soporte es por par explícito; cualquier acceso excepcional requiere permiso, motivo, registro de auditoría y política aprobada.

Aplicar RLS a todas las tablas, incluidos los recibos y relaciones auxiliares; probar también con consultas directas al API de datos y con la clave `anon`. Las comprobaciones del Proxy, UI y Server Actions no sustituyen RLS. Nunca incluir `service_role` en código cliente ni usarla para eludir políticas en operaciones de usuario.

## Supabase Realtime

### Opción preparada: Broadcast privado con señal mínima

- Usar tópicos opacos por conversación, por ejemplo `conversation:<uuid>`, y un tópico propio de notificaciones. El tópico/UUID no es un secreto ni prueba autorización.
- Requerir canales privados (`private: true`) y desactivar acceso público a Realtime en la configuración del proyecto.
- Autorizar la unión al tópico mediante políticas de `realtime.messages` que consulten identidad, participación vigente y permiso. Notificaciones solo se publican al tópico individual del destinatario.
- Emitir señales pequeñas (`message_available`, `notification_available`) sin contenido, remitente legible, datos personales o token. El cliente recupera la fila por una consulta RLS-protegida.
- Dar de baja al cambiar de usuario/conversación, al cerrar sesión y al desmontar el componente; no crear canales duplicados por render. Tratar reconexión/expiración como estados visibles y volver a cargar desde PostgreSQL.

### Alternativa: Postgres Changes

Postgres Changes puede transmitir inserciones en tablas replicadas y evaluar RLS, pero puede enviar más metadatos de fila, requiere habilitar replicación y su entrega/escala debe medirse. No usarlo para publicar cuerpos de mensajes sin necesidad. La política final podrá cambiar tras pruebas de escala, límites de Realtime y requerimientos de latencia.

### Revocación y recuperación

En cada nueva consulta y unión se verifica la participación vigente. Una revocación debe impedir nuevos joins y nuevas consultas. Si se revoca una sesión activa, la aplicación debe renovar credenciales/revalidar autorización y cerrar el canal; no prometer retirar eventos ya entregados a un cliente conectado. PostgreSQL sigue siendo el historial/fuente de verdad y la reconexión recupera cambios consultando con autorización.

## Notificaciones persistentes

Las notificaciones se crean en la misma transacción del cambio de negocio o mediante un proceso idempotente/outbox para no perder eventos entre la escritura y la publicación. Realtime solo avisa de que existe una fila; no reemplaza la persistencia ni es una bandeja de entrada.

El destinatario se calcula en servidor a partir de la relación de negocio. El tipo pertenece a un catálogo limitado; la navegación se deriva de `relatedEntityType + relatedEntityId` y de una ruta permitida comprobada por el servidor, no de un `href` arbitrario controlable por el cliente. Marcar una notificación o todas debe actualizar únicamente filas del usuario actual. Los conteos de no leídas deben provenir de PostgreSQL, no de fixtures o contadores locales.

## Paginación, rendimiento y errores

- Orden descendente por fecha y un ID estable como desempate; cursores opacos compuestos evitan saltos/duplicados cuando hay timestamps iguales. Mostrar los mensajes recuperados en orden cronológico.
- Limitar páginas (máximo tipado actual: 100), no cargar historial completo. Definir índices para participante/conversación, mensajes (`conversation_id`, fecha, id), destinatario/lectura/fecha de notificación y lecturas; confirmar planes con datos representativos.
- Obtener historial y contador de no leídos con consultas acotadas; no cargar el cuerpo de mensajes en el listado si solo se necesita una vista previa.
- Errores esperados deben diferenciar sesión ausente/expirada, permiso denegado, entidad inexistente (sin filtrar si una conversación privada existe), validación, desconexión y conflicto. No registrar cuerpo privado ni JWT.
- No implementar reintentos de envío ciegos: usar ID de idempotencia para evitar mensajes duplicados tras timeout/reconexión. Retención, edición/borrado y política de entrega/duplicados requieren aprobación.

## Adjuntos de mensajes

Los adjuntos siguen la arquitectura de [ARCHIVOS_STORAGE_Y_MATERIALES.md](./ARCHIVOS_STORAGE_Y_MATERIALES.md): bucket privado, autorización de ambos participantes activos, metadatos en PostgreSQL y objeto en Storage. Esta fase no agrega carga, previsualización, URL firmada ni persistencia de archivos. No enviar archivos por Server Actions ni tratar el nombre seleccionado por `DemoChat` como un adjunto real.

## WhatsApp público

Se integró una burbuja de contacto solo en `src/app/(public)/layout.tsx`, con el número aprobado `51934218292` y el mensaje acordado de consulta sobre cursos, modalidades, horarios e inscripciones. Abre `https://wa.me/...` en otra pestaña con `noopener noreferrer` y `no-referrer`, etiqueta accesible y foco visible. El número y mensaje centralizados en `src/lib/whatsapp.ts` son configuración pública de contacto, no credenciales.

El enlace inicia una conversación externa de WhatsApp; no representa chat interno, no almacena mensajes y no confirma que la empresa tenga WhatsApp Business configurado. No se instaló un SDK ni se envía información del usuario desde la web.

## Pendientes antes de declarar integración real

- Aprobar el modelo definitivo y migraciones para pareja única, participantes/revocación, contexto de sección, lectura individual, notificaciones y outbox/idempotencia.
- Definir reglas ante fin/suspensión de inscripción, permisos de soporte, acceso excepcional administrativo, retención, bloqueo/reporte, edición/eliminación y manejo de adjuntos.
- Implementar operaciones servidor/Drizzle con verificación de sesión, autorización, validación y transacciones; activar y probar RLS tabla por tabla.
- Configurar proyecto Supabase, canales privados y políticas `realtime.messages`; medir conexiones, reconexión y límites.
- Probar login/sesión, consultas directas denegadas, intentos de añadir terceros, acceso cruzado a IDs, envío duplicado, cursores, recibos privados, notificaciones ajenas, revocación, desconexión y accesibilidad.
- Ejecutar pruebas de integración con usuarios de los cuatro roles y datos aislados. No hay credenciales de un proyecto remoto en este entorno; no se hizo ninguna operación remota y no se afirma que chat, notificaciones o Realtime estén funcionando en producción.
