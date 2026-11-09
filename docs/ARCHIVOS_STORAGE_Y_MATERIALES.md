# Archivos privados, Storage y materiales educativos

## Estado y alcance

Diseño de FASE 7 para EDUKATECH, actualizado con las verificaciones y correcciones locales de FASE 12. La tabla de inventario describe el frontend demo y sus flujos aún no conectados; **no afirma que haya una carga integrada en las páginas de la aplicación**. La FASE 12 configuró siete buckets privados en Supabase local y añadió una Edge Function de validación antes de activar metadatos. No hay un proyecto remoto vinculado ni se realizaron operaciones remotas.

La arquitectura prevista mantiene Next.js 16 App Router, Supabase Auth/PostgreSQL/Storage, Drizzle ORM exclusivamente en servidor y Vercel. Los objetos son privados por defecto y el control efectivo debe verificarse tanto en PostgreSQL/RLS como en cada operación de servidor.

## Inventario actual

| Área | Archivos/componentes y comportamiento observado | Estado y destino conceptual |
|---|---|---|
| Foto de perfil | `DemoProfileForm`, usado por los perfiles de alumno y profesor. Permite seleccionar una imagen, pero solo conserva el nombre en estado local; no previsualiza ni sube el archivo. | Demo sin persistencia. Bucket propuesto `profile-media`; relacionar con el perfil del usuario. |
| Comprobante de pago | `DemoCheckoutForm` en `/checkout` solo guarda el nombre y confirma visualmente; no sube bytes. El selector demo limita PDF/JPG/PNG y 10 MiB, en concordancia con el bucket local `payments`. | Demo de pago académico manual. Bucket local `payments`; relacionar con pago/reserva. |
| Revisión de comprobante | La página `/admin/pagos/[id]` muestra un área de vista previa sin recurso asociado. `PaymentReviewActions` solo cambia el estado local. | Sin visor ni comprobante real. El administrador autorizado necesitará una vista firmada y permisos ligados al pago; la verificación sigue siendo manual. |
| Entregas académicas | `DemoAssignmentSubmission` permite seleccionar PDF/ZIP/TXT/JPG/PNG y muestra una confirmación demo tras validación cliente. El archivo no se sube. | Demo sin persistencia. Bucket local `submissions`; asociar estudiante, tarea y sección. Rechazar acceso de otros estudiantes. |
| Portada de curso | `DemoCourseEditor` crea una vista previa local con `URL.createObjectURL`; indica expresamente que no se sube. | Demo. La publicación y visibilidad de portadas aún necesita decisión; no hacer público un bucket privado por defecto. |
| Clases, videos y materiales | `DemoContentManager` ofrece inputs de video/PDF y guarda nombres en estado local; `DemoTaskBuilder` selecciona una guía de video/PDF sin almacenarla. | Demo. Materiales y videos deben asociarse a recurso/actividad de una sección. Bucket `learning-materials` o `course-videos`. |
| Reproductor de lecciones | `DemoLessonViewer` presenta un reproductor decorativo sin `src` de video. Los títulos y nombres PDF proceden de `demo-course-content`/`demo-courses`; reproducción y progreso se declaran de demostración. | No existe reproducción real. Solo estudiantes con inscripción activa/autorizada pueden recibir acceso a medios de su sección. |
| Chat y adjuntos | `DemoChat` deja elegir PDF/ZIP/PNG/JPG y agrega el nombre a un mensaje local; no sube ni envía archivos. | Demo. Bucket `message-attachments`; acceso exclusivo a los dos participantes autorizados de la conversación 1:1. |
| Logotipo/configuración | `DemoSiteSettings` conserva localmente el nombre de un logo; no lo sube. | Demo. Si se implementa, usar `administrative-documents` o un bucket separado y resolver antes si el logo publicado será público. |
| Importación de asistencia | `AttendanceManager` permite importar CSV/XLS/XLSX mediante callback y exportar CSV. No es un repositorio de documentos; el archivo se procesa para importación. | Mantener el flujo separado de Storage; validar estructura/datos en servidor y no conservar el archivo original salvo una política aprobada. |
| Fotos y archivos del modelo legado | Drizzle conserva `usuarios.fotoPerfil`, `pagos.voucherUrl`, `cursos.voucherUrl`, `tareas.archivoUrl` y `mensajes.archivoUrl`. | Son campos URL del esquema existente, no pruebas de archivos almacenados. En fases posteriores evaluar referencias `bucket + object_path`; esta fase no toca Drizzle ni SQL. |
| Documentos de estudiante/administración y recursos docentes | No se encontró un flujo real de selección/subida para documentos personales, documentos administrativos ni biblioteca independiente del docente. | Necesidad futura. Crear interfaces solo al definir el flujo y comprobar relación, finalidad, retención y visibilidad. |

La búsqueda de consumidores no identificó un servicio de Storage ni cargas reales. Los fixtures visuales que alimentan estas vistas siguen teniendo consumidores y **no se eliminan** conforme a la política gradual de datos demo.

## Buckets propuestos

La tabla de ocho nombres es la propuesta original de FASE 7. El mapeo de implementación local, los tamaños y MIME efectivos se detallan en la conciliación siguiente; la configuración local no se ha aplicado ni verificado remotamente.

| Bucket privado propuesto | Uso | Prefijo lógico de ruta |
|---|---|---|
| `profile-media` | Fotos de perfiles y, si se autoriza, otros recursos de perfil. | `{user_id}/{file_id}` |
| `student-documents` | Documentos proporcionados por estudiantes para un trámite autorizado. | `{student_id}/{record_id}/{file_id}` |
| `assignment-submissions` | Entregas y versiones de actividades. | `{section_id}/{assignment_id}/{student_id}/{file_id}` |
| `payment-proofs` | Comprobantes asociados a pagos de matrícula/reserva. No mezclar con pagos de productos de tienda. | `{reservation_id}/{payment_id}/{file_id}` |
| `learning-materials` | PDFs, documentos y materiales operativos de clases/actividades de una sección. | `{section_id}/{resource_id}/{file_id}` |
| `course-videos` | Videos originales del curso solo si se elige Storage como alojamiento audiovisual. | `{section_id}/{resource_id}/{file_id}` |
| `administrative-documents` | Documentos internos de gestión con acceso administrativo específico. | `{record_type}/{record_id}/{file_id}` |
| `message-attachments` | Adjuntos privados de conversaciones individuales autorizadas. | `{conversation_id}/{message_id}/{file_id}` |

### Conciliación con los buckets creados en Supabase local

La FASE 7 enumeró ocho buckets como propuestas separadas. La implementación crea siete buckets privados y define su categoría en `archivos_metadata`: `profile-media` → `profiles`; `student-documents` y `administrative-documents` → `documents`; `assignment-submissions` → `submissions`; `payment-proofs` → `payments`; `learning-materials` → `learning-materials`; `course-videos` → `media`; `message-attachments` → `attachments`. La reducción es intencional: los dos tipos de documentos comparten bucket y se diferencian por categoría/relación.

| Bucket local | Máximo individual | MIME admitidos |
|---|---:|---|
| `profiles` | 5 MiB | `image/jpeg`, `image/png`, `image/webp` |
| `documents` | 50 MiB | `application/pdf`, `image/jpeg`, `image/png` |
| `submissions` | 50 MiB | `application/pdf`, `application/zip`, `text/plain`, `image/jpeg`, `image/png` |
| `payments` | 10 MiB | `application/pdf`, `image/jpeg`, `image/png` |
| `learning-materials` | 25 MiB | `application/pdf` |
| `media` | 50 MiB | `video/mp4`, `video/quicktime`, `video/webm` |
| `attachments` | 15 MiB | `application/pdf`, `application/zip`, `image/jpeg`, `image/png` |

El límite global de Supabase local es **50 MiB = 52.428.800 bytes**; las restricciones por bucket son adicionales y pueden ser menores. La configuración local reside en `supabase/config.toml`. La migración 003 ya no escribe en `storage.buckets`: `scripts/provision-storage-buckets.ts` compara y crea buckets mediante Storage API, exige el límite global previamente verificado y se detiene ante cualquier discrepancia sin usar `updateBucket()`.

Para Development, el provisionador exige `SUPABASE_TARGET_ENV=development`, `SUPABASE_PROJECT_REF=rxncsqoyovcwndgguxii`, la URL exacta `https://rxncsqoyovcwndgguxii.supabase.co`, `SUPABASE_SECRET_KEY` y `SUPABASE_STORAGE_GLOBAL_LIMIT_BYTES=52428800`. La simulación es el comportamiento predeterminado; la creación requiere además `SUPABASE_STORAGE_APPLY=true` y `SUPABASE_STORAGE_CONFIRM=CREATE_BUCKETS_IN_DEVELOPMENT`. Production siempre se rechaza. Los secretos solo deben existir en el proceso servidor y no deben registrarse ni incluirse en documentación o `.env.example`. Con claves nuevas `sb_secret_...`, el cliente envía la clave como `apikey` y elimina el `Authorization: Bearer` no-JWT para evitar `Invalid Compact JWS`; las claves legacy mantienen el flujo Local existente.os despliega.

El servidor genera identificadores opacos para objetos; el nombre original se guarda como metadato y no se usa como ruta. Las rutas no incluyen email, nombre, DNI u otra información personal. El prefijo ordena y ayuda a aplicar políticas, pero **no concede permisos por sí solo**. Una fila de metadatos/relación válida y una autorización comprobada son obligatorias.

Las portadas publicadas y los perfiles docentes que puedan aparecer en páginas públicas necesitan una decisión de producto: mantener el objeto privado y emitir una URL temporal solo tras una comprobación permitida, o definir una transformación pública derivada y aprobada. No hacer público el bucket original ni los archivos académicos.

## Privacidad y matriz de acceso propuesta

La fuente de roles será el perfil/permisos protegido de PostgreSQL, todavía pendiente de implementar. Ni la ruta, ni una propiedad de React, ni `user_metadata`, ni un identificador de carpeta controlado por el navegador constituyen autorización.

| Recurso | Superadministrador | Administrador | Docente | Estudiante |
|---|---|---|---|---|
| Foto de perfil | Solo tareas de plataforma/permisos explícitos; sin lectura indiscriminada. | Gestión autorizada cuando la finalidad lo requiere. | Gestiona la propia; consulta únicamente campos publicados/autorizados. | Gestiona la propia; consulta solo perfiles cuya visibilidad se haya aprobado. |
| Documentos de estudiante | Sin acceso automático por el rol. Acceso excepcional autorizado y auditado. | Gestión global dentro del permiso y necesidad institucional. | Sin acceso por defecto. | Solo sus documentos y operaciones permitidas. |
| Entregas | Sin acceso automático; acceso excepcional auditado. | Gestión autorizada de la operación académica. | Lectura/revisión de estudiantes de secciones asignadas. | Carga y lectura de sus propias entregas. |
| Comprobantes de pago | Sin acceso automático; acceso excepcional auditado. | Revisión manual de pagos dentro del permiso. | Ninguno. | Carga y consulta solo de comprobantes de sus pagos. |
| Materiales y videos de sección | Gestión técnica solo con permiso explícito. | Administración global dentro de permisos. | Crea/actualiza en secciones asignadas. | Lectura solo en secciones con inscripción activa y autorización. |
| Documentos administrativos | Según permiso de plataforma, finalidad y auditoría; no acceso indiscriminado. | Según permiso funcional de administración. | Ninguno, salvo asignación explícita. | Ninguno, salvo acceso explícito a un trámite propio. |
| Adjuntos de chat | Sin acceso al contenido por ser superadmin. | Solo como participante autorizado. | Solo como participante autorizado. | Solo como participante de esa conversación 1:1. |

El administrador tiene capacidad global de gestión institucional, pero el acceso a documentos identificables sigue sujeto al permiso funcional. Una revisión de pago no concede acceso a conversaciones ni a archivos ajenos al pago. Todo acceso administrativo excepcional y toda revisión/descarga sensible debe dejar auditoría. La desactivación de cuenta no elimina el historial.

## RLS de `storage.objects`

Supabase Storage aplica PostgreSQL RLS en `storage.objects`; las tres políticas actuales se definen en la migración oficial 003 sobre la tabla administrada de Supabase, sin cambiar su activación RLS ni su propietario. El diseño original de FASE 7 era una propuesta; el SQL aplicado y la evidencia local vigente se documentan en `VALIDACION_BASE_DATOS_Y_RLS.md`.

1. **`SELECT` / lectura y firma:** la política actual exige una fila relacionada en `archivos_metadata` y `public.can_access_storage_object(bucket_id, name)`. El objeto debe estar `active` y el helper comprobar autorización/relación; las pruebas cubrieron propietario frente a otro usuario y anon, no todas las categorías ni relaciones.
2. **`INSERT` / carga:** la política actual exige `public.can_upload_storage_object(bucket_id, name)`, que relaciona bucket/ruta con metadatos `pending` y autorización RLS. Las pruebas locales ejecutaron cargas reales como usuarios autenticados; no existe aún integración en formularios de aplicación.
3. **`UPDATE` / sustitución:** denegado por defecto. No permitir sobrescritura, cambio de metadatos o movimiento de objeto por el cliente. La sustitución carga un objeto nuevo con ruta nueva y cambia la referencia activa en una transacción autorizada; la limpieza del anterior se ejecuta después.
4. **`DELETE` / borrado:** la política actual delega a `public.can_delete_storage_object`. En los casos probados, el propietario pudo borrar su archivo `pending`; el intento de borrar un archivo `active` no lo eliminó aunque la API respondiera `200 []`. Siempre comprobar la desaparición mediante Storage API; no usar SQL para borrar objetos.
5. **Verificación del permiso:** usar `auth.uid()` para identificar la sesión y una función protegida con `search_path` fijo para consultar perfiles, relaciones y permisos aprobados. No confiar solo en claims de rol ni en la primera carpeta del objeto. Las funciones deberán evitar recursión RLS y concederse con privilegio mínimo.
6. **Identidad del servicio:** las operaciones de usuario se autentican mediante JWT y RLS. La Edge Function `validate-private-file` usa `service_role` exclusivamente en servidor para consultar Storage y actualizar un conjunto restringido de columnas de `archivos_metadata`; la clave nunca se expone al navegador. No usar el rol de servicio para sustituir las comprobaciones del JWT/RPC.
7. **URLs firmadas:** emitirlas solo después de comprobar permiso y estado del objeto. Son credenciales temporales de tipo bearer, pueden compartirse durante su vigencia y no se revocan individualmente con un cambio de rol. Definir TTL corto según la experiencia y el riesgo antes de producción; nunca guardar la URL firmada como referencia permanente.

Las políticas actuales llaman funciones de autorización específicas; el comportamiento de cada relación debe seguir verificándose por rol antes de producción. No se recomienda una sola política del tipo “cualquier usuario autenticado puede leer el bucket” ni permisos basados exclusivamente en `storage.foldername(name)[1]`.

### Matriz de reglas por bucket/operación

La siguiente matriz conserva los criterios funcionales por bucket del diseño de FASE 7. **No equivale a cobertura probada**: las pruebas locales solo cubrieron los casos enumerados en `VALIDACION_BASE_DATOS_Y_RLS.md`.

| Bucket | `SELECT` (listar/leer/firmar) | `INSERT` (cargar) | `UPDATE` | `DELETE` |
|---|---|---|---|---|
| `profile-media` | Titular; otras lecturas solo si el perfil y la imagen se publicaron para esa audiencia. | Titular para su perfil; administración solo con permiso explícito. | Denegar overwrite; cambiar mediante nueva ruta. | Titular/admin autorizado si no hay retención ni referencias bloqueantes. |
| `student-documents` | Titular y administrador con permiso/trámite aplicable. | Titular o admin autorizado al trámite. | Denegar. | Solo proceso controlado, con auditoría y política de retención. |
| `assignment-submissions` | Estudiante propietario y docente asignado a la sección; administración funcional autorizada. | Estudiante inscrito, para su tarea/sección y dentro del estado/plazo institucional aprobado. | Denegar overwrite; una nueva entrega/versionado requiere regla explícita. | Denegar al cliente; proceso autorizado conforme a retención académica. |
| `payment-proofs` | Estudiante relacionado y administrador autorizado para verificar el pago. | Estudiante relacionado o flujo administrativo expresamente autorizado. | Denegar overwrite. | No automático; autorización especial y retención financiera aprobada. |
| `learning-materials` | Estudiante con inscripción activa en esa sección; docente asignado y administrador con alcance. | Docente asignado o administrador autorizado en recurso de sección existente. | Denegar overwrite; reemplazo versionado. | Gestión autorizada, comprobando matrículas/historial y retención. |
| `course-videos` | Igual que materiales: inscripción activa o asignación/permiso administrativo. | Docente asignado o administrador; solo tras seleccionar Storage para video. | Denegar overwrite. | Proceso autorizado y coordinado con la referencia de recurso. |
| `administrative-documents` | Administradores con permiso del tipo de expediente; acceso excepcional superadmin auditado si se aprueba. | Administrador autorizado para el expediente relacionado. | Denegar overwrite. | Solo procedimiento administrativo documentado y auditado. |
| `message-attachments` | Solo los dos participantes autorizados de la conversación. | Participante autorizado al adjunto de un mensaje propio. | Denegar overwrite. | Participante no elimina historial unilateralmente; política de retención y auditoría aplican. |

## Contrato de carga, descarga y ciclo de vida

Se reutilizan `PrivateFileServiceContract`, `PrivateFileMetadata` y `PrivateDownload`; no se crea un segundo servicio genérico. La migración 003 implementa `archivos_metadata` y el estado de archivo `pending`, `active`, `quarantined` o `deleted`. La aplicación frontend todavía no integra una carga persistente; los formularios siguen siendo demos.

1. **Crear intención/registrar metadatos:** el usuario autenticado crea la fila `pending` autorizada por RLS; la ruta opaca, bucket, propietario y relación se comprueban. El navegador no puede cambiar la fila a `active`.
2. **Transferir bytes:** el cliente autenticado sube directamente a Supabase Storage con su sesión y RLS. No enviar binarios/base64 por Server Actions ni Route Handlers: el límite predeterminado de Server Actions en Next.js 16 es 1 MB y los archivos grandes no deben pasar por Vercel. No implementar un endpoint proxy de archivos.
3. **Limitar carga:** `supabase/config.toml` define el máximo global de 50 MiB y máximos/MIME por bucket. El provisionador compara los siete buckets mediante Storage API y solo crea los que faltan; no sobrescribe límites o MIME existentes. La API Storage verifica las restricciones configuradas antes de aceptar la carga.
4. **Validar y activar:** `supabase/functions/validate-private-file` autentica el JWT, exige que el llamante sea propietario y que `can_upload_file` autorice la fila `pending`, descarga el objeto por Storage API, compara tamaño, MIME declarado, extensión y firma/contenido reconocido; solo entonces cambia la fila a `active`. El cliente no puede activar directamente. Nunca confiar en `accept`, `File.type` ni el MIME declarado como evidencia del contenido.
5. **Cuarentena:** si el contenido, extensión, MIME o tamaño no coincide, se cambia el metadato a `quarantined` y se intenta borrar el objeto por Storage API. Un error de borrado queda explícito en la respuesta; el estado no se activa. La función no altera directamente `storage.objects`.
6. **Error/reintento:** comunicar errores tipados (`validation`, `forbidden`, `file_too_large`, `unsupported_file_type`, `offline`, `upload_failed`, `storage_unavailable`, `file_quarantined`). No crear copias activas ni tratar el nombre elegido como éxito.
6. **Cancelar/limpiar:** cancelar la transferencia y dejar el metadato en estado explícito; reconciliar posteriormente objetos temporales huérfanos con una tarea de servidor aprobada. No se configura limpieza automática ni borrado por edad mientras la política de retención esté pendiente.
7. **Previsualizar/descargar:** pedir al servidor una autorización específica. Este devuelve una URL firmada temporal con nombre/tipo y `inline` o `attachment`; el cliente la usa solo para esa operación. HTML/SVG y tipos ejecutables no deben servirse en línea sin una política explícita; usar disposición de descarga y controles de contenido.
8. **Sustituir:** cargar a una ruta nueva; verificarla y cambiar en PostgreSQL la referencia vigente de forma atómica; conservar versiones/auditoría según política y eliminar el objeto previo solo tras comprobar que ya no tiene referencias y que la retención permite borrarlo.
9. **Eliminar:** la operación verifica acceso, dependencias, obligaciones de retención y auditoría. No eliminar automáticamente pagos, matrículas, asistencia, entregas o documentos históricos. La política legal/operativa sigue pendiente.

Los nombres de estado implementados son `pending`, `active`, `quarantined` y `deleted`. Los objetos `pending` y `quarantined` no son descargables ni listables mediante las políticas; la eliminación propia está limitada a `pending`. La validación actual usa firmas de archivo/contenido para PDF, ZIP, texto UTF-8, JPEG, PNG, WebP, MP4/QuickTime y WebM, según el bucket. **No existe antivirus ni escaneo antimalware**: la comprobación de firma identifica formatos y discrepancias simples, no demuestra que un documento sea seguro. Antes de activar archivos en producción debe evaluarse integrar un scanner aislado y límites anti-DoS.

La función usa `service_role` solo dentro del runtime servidor para leer/actualizar las columnas de ciclo de vida autorizadas y operar Storage API; el rol recibió grants selectivos en `archivos_metadata`. Nunca exponer la clave al navegador.

## Validación de archivos

La ayuda cliente en `src/lib/storage/file-policy.ts` valida extensión, tipo declarado y tamaño al seleccionar los archivos de los formularios demo asociados a perfiles, pagos, entregas, chat y materiales. Esto es únicamente UX: `accept`, `File.type` y el helper cliente pueden falsificarse y no inspeccionan bytes. La verificación autoritativa está en la Edge Function y en las reglas Storage.

La Edge Function reconoce firmas simples y comprueba que coincidan el MIME y la extensión permitidos. No es un parser completo ni antivirus. Antes de producción aún se necesita:

- Mantener sincronizados los límites/MIME de `config.toml`, migración, Edge Function y validación cliente.
- Aprobar cuotas/volumen y límites por sesión/usuario además del máximo por bucket.
- Integrar un antivirus/escáner si el riesgo institucional lo requiere y definir su cuarentena/retención.
- Política para archivos comprimidos, formatos activos como SVG/HTML, documentos ofimáticos con macros y nombres duplicados.
- Límites de nombre/ruta compatibles con Supabase Storage y decisión de no sobrescribir objetos.
- Comportamiento ante desconexión, sesión expirada y errores al finalizar o borrar.

Los límites anteriores son configuración técnica local y aún requieren aprobación del producto para producción. El límite de 6 MB es una recomendación de transporte entre carga estándar y TUS, no el tamaño máximo.

## Metadatos de PostgreSQL

La migración 003 implementa `public.archivos_metadata`, vinculada por claves foráneas con usuarios, pagos, entregas, secciones y conversaciones. Su estado (`public.file_status`) es `pending`, `active`, `quarantined` o `deleted`; la tabla no se refleja todavía como modelo Drizzle y los formularios frontend no la consumen. Sus datos incluyen:

| Metadato | Propósito |
|---|---|
| ID del archivo | Identidad durable para contratos y relaciones. |
| Nombre original | Mostrar nombre y preparar un `Content-Disposition` seguro; nunca identifica el objeto. |
| Bucket y ruta de objeto | Referencia permanente a Supabase Storage. `object_path` no es URL firmada ni pública. |
| Tipo MIME detectado y tamaño en bytes | Validación, respuesta de descarga y límites. Conservar tipo declarado por separado solo si se necesita auditoría. |
| Propietario/usuario relacionado | `propietario_id` y opcionalmente `usuario_relacionado_id`; no se registra un uploader separado. |
| Entidad relacionada | FK opcional a pago, entrega, sección o conversación; restricciones hacen corresponder categoría y vínculo. |
| Categoría y estado | `categoria` y `estado` determinan contexto funcional y ciclo de carga. |
| Fechas | `created_at` y `updated_at`; no existe todavía historial detallado de auditoría de escaneo. |
| Reemplazo/versión | No implementado. Las rutas son únicas por bucket y objeto. |

El resto de columnas incluye `id`, `bucket_id`, `object_path`, `nombre_original`, `mime_type`, `tamaño_bytes` y las fechas. No almacenar binarios/Base64 ni URL firmadas en PostgreSQL. `service_role` tiene permiso SELECT y UPDATE solo para las columnas de ciclo de vida necesarias por la Edge Function; `anon`/`authenticated` no tienen UPDATE/DELETE directo de esta tabla. Drizzle aún no refleja esta tabla y debe sincronizarse antes de una futura integración frontend.

## Videos y materiales

| Alternativa | Privacidad y control | Transmisión/funcionalidad | Operación y costo | Cuándo conviene |
|---|---|---|---|---|
| Supabase Storage privado | RLS sobre el objeto y URLs firmadas autorizadas desde servidor. Una URL firmada puede compartirse hasta expirar. | Guarda y entrega el original; se puede reproducir con controles HTML5 si el navegador soporta el formato, pero no aporta por sí solo la plataforma de transcodificación/adaptive bitrate de un servicio de video. | Menos servicios y proveedor; el equipo decide formatos, tamaños, procesamiento y experiencia. Costos de almacenamiento y entrega según plan/uso de Supabase. | PDFs, presentaciones, imágenes y una biblioteca audiovisual pequeña/controlada si se acepta el formato/rendimiento de archivos originales. |
| Proveedor especializado (Cloudflare Stream o Mux) | El servidor emite URLs/tokens de subida y reproducción tras comprobar permisos. Configurar reproducción privada/firmada; un ID o URL de reproducción no debe asumirse secreto ni equivaler a autorización de estudiante. | Procesamiento/transcodificación, entrega adaptativa y reproductor/SDK/analítica según proveedor; suele dar una experiencia más consistente en redes y dispositivos diversos. | Servicio adicional, webhooks y operaciones de altas/bajas; precios dependen del almacenamiento/duración procesada y la entrega/visualización, según el proveedor. Evaluar coste total con uso real y términos de datos. | Catálogo de videos de duración/volumen significativo, reproducción frecuente, necesidad de calidad adaptativa, métricas o flujos de carga grandes. |

**Recomendación de preparación:** usar Supabase Storage privado para documentos, comprobantes, entregas e imágenes. Para videos, comparar con tráfico estimado y requisitos docentes antes de decidir; si se necesita transcodificación/adaptive bitrate o la reproducción va a ser frecuente, preferir una prueba de concepto con un proveedor especializado y reproducción firmada. No se selecciona Cloudflare Stream ni Mux todavía. No subir videos grandes a PostgreSQL.

Si un proveedor externo se aprueba, almacenar en PostgreSQL su identificador de activo, estado de procesamiento, sección/recurso y proveedor; conservar credenciales solo en servidor. El servidor crea cargas directas temporales para usuarios autorizados, verifica webhooks firmados y habilita la reproducción solo al completarse el procesamiento. No almacenar una URL de reproducción firmada como identidad durable del video.

## Decisiones pendientes antes de conectar módulos

1. Integrar frontend con Auth, Storage, metadatos y Edge Function; actualmente los formularios son demos.
2. Aplicar los siete buckets y sus límites/MIME en proyecto remoto mediante Dashboard o Storage API, con autorización administrativa; no asumir que la configuración local los despliega. El script actual está deliberadamente restringido a Supabase Local.
3. Probar todas las combinaciones MIME/límite por bucket y establecer cuotas, número de versiones y aprobación de límites para producción.
4. Política legal de retención/eliminación, especialmente comprobantes, documentos personales, entregas y adjuntos; definir qué significa “eliminar” y quién lo autoriza.
5. Visibilidad de fotos de perfiles docentes y portadas públicas, manteniendo privados los originales.
6. TTL de URLs temporales, comportamiento de previsualización, disposición, reproducción fuera de línea y respuesta ante revocación/cuenta suspendida.
7. Selección de proveedor de video y requisitos de calidad, subtítulos/accesibilidad, descargas, analítica, privacidad, residencia de datos, volumen de carga y minutos de visualización/costo.
8. Integrar escáner antimalware (no existe actualmente), definir limpieza/reconciliación de cargas incompletas y auditoría; no activar purgas automáticas sin aprobación.
9. Añadir `archivos_metadata` al esquema Drizzle y planificar el reemplazo gradual de campos `*Url` por referencias a metadatos.

## Referencias oficiales

- [Supabase Storage: control de acceso y RLS](https://supabase.com/docs/guides/storage/security/access-control)
- [Supabase Storage: funciones helper para políticas](https://supabase.com/docs/guides/storage/schema/helper-functions)
- [Supabase Storage: carga estándar](https://supabase.com/docs/guides/storage/uploads/standard-uploads)
- [Supabase Storage: cargas resumibles TUS](https://supabase.com/docs/guides/storage/uploads/resumable-uploads)
- [Supabase Storage: servir y firmar descargas privadas](https://supabase.com/docs/guides/storage/serving/downloads)
- [Next.js 16: configuración del límite de Server Actions](https://nextjs.org/docs/app/api-reference/config/next-config-js/serverActions#bodysizelimit)
- [Cloudflare Stream: cargas directas autenticadas](https://developers.cloudflare.com/stream/uploading-videos/direct-creator-uploads/)
- [Cloudflare Stream: dimensiones de precios](https://developers.cloudflare.com/stream/pricing/)
- [Mux: cargas directas autenticadas](https://www.mux.com/docs/guides/upload-files-directly)
- [Mux: precios y unidades de facturación](https://www.mux.com/pricing)
