# Seguimiento de implementación

Registro de fases, decisiones aprobadas, cambios y comprobaciones de EDUKATECH. Este documento no sustituye al inventario frontend ni al modelo conceptual.

## Arquitectura y alcance aprobados

- Next.js 16 App Router, React 19 y TypeScript.
- Vercel para despliegue; Supabase PostgreSQL como única base principal de producción, además de Auth, Storage privado y Realtime según permisos.
- Drizzle se conserva para el acceso tipado desde servidor. La estrategia prevista mantiene las migraciones SQL de Supabase como historial oficial y Drizzle sincronizado.
- La FASE 2 establece como referencia inicial las reglas de negocio documentadas en [REGLAS_NEGOCIO_Y_MODELO_DATOS.md](./REGLAS_NEGOCIO_Y_MODELO_DATOS.md).
- No se han implementado en la FASE 3 conexiones, servicios de backend, cambios de esquema, SQL ni migraciones.

## Estado de fases

| Fase | Estado | Resultado |
|---|---|---|
| 0. Diagnóstico | Completada | Stack, arquitectura y estado general documentados; arquitectura de producción aprobada por el usuario. |
| 1. Inventario frontend | Completada | [INVENTARIO_FRONTEND.md](./INVENTARIO_FRONTEND.md) registra rutas, vistas, módulos, roles y comportamiento simulado. |
| 2. Reglas y modelo de datos | Completada | [REGLAS_NEGOCIO_Y_MODELO_DATOS.md](./REGLAS_NEGOCIO_Y_MODELO_DATOS.md) recoge reglas confirmadas, modelo conceptual, RLS, comparación de esquemas y pendientes. |
| 3. Limpieza y datos temporales | Completada | Depuración documental y de fixtures no utilizados, correcciones frontend acotadas y validación del build. |
| 4. Reestructuración y preparación del frontend | Completada | Diagnósticos ESLint corregidos, contratos y validaciones tipadas preparados y límites de servidor reforzados. |
| 5. Autenticación, autorización y seguridad | Completada como preparación | Supabase Auth SSR, PKCE y protección fail-closed preparados; acceso real permanece bloqueado hasta configurar Supabase y modelo PostgreSQL de perfiles/RLS. |
| 6. Módulos académicos y administrativos | Completada como preparación | Contratos, modelos, validaciones y reglas estadísticas ampliados. No se conectó un backend ni se simularon operaciones reales. |
| 7. Archivos privados, videos y materiales educativos | Completada como preparación | Inventario, buckets privados propuestos, reglas RLS y ciclo de vida documentados; contratos y metadatos ampliados sin crear recursos remotos ni migraciones. |
| 8. Chat privado, notificaciones y contacto | Completada como preparación | Contratos y modelos tipados ampliados, guía de RLS/Realtime documentada y contacto público WhatsApp integrado; no hay persistencia ni conexión remota. |
| 9. Contratos API, servicios y Vercel | Completada como preparación | Catálogo de operaciones, OpenAPI limitado al callback Auth y guía Vercel; no hay backend de negocio ni despliegue. |
| 10. Verificaciones, correcciones y seguridad | Completada como auditoría | Contraste de documentación/código, auditoría de dependencias, smoke test responsive y aviso explícito para contenido público demo; backend, RLS y servicios remotos siguen pendientes. |
| 11. Diseño de base de datos | Completada como preparación | Modelo PostgreSQL/Drizzle y migraciones iniciales preparados; no aplicados a una base de datos. |
| 12. Validación de base de datos, migraciones y seguridad | Validación local parcial; no certificada completamente | Se corrigió la extracción UUID y el acceso a tablas administradas; se ajustaron límites/MIME de siete buckets y se probó la función servidor de validación de archivos. Pasaron pruebas representativas de Storage y roles; la matriz RLS sigue incompleta y no existe antivirus. Se espera autorización; no se avanza a FASE 13. |

## FASE 5 — Autenticación, autorización y seguridad

### Integración preparada

- Se verificó que los paquetes oficiales no estaban instalados y se añadieron `@supabase/ssr@^0.12.7` y `@supabase/supabase-js@^2.118.0` a `package.json`/lockfile.
- La auditoría detectó un aviso crítico en Next.js y otros avisos altos. Next.js y `eslint-config-next` se actualizaron a la versión compatible corregida 16.4.4; `npm audit fix` aplicó además actualizaciones compatibles. El informe posterior quedó en 25 avisos (2 bajos, 23 moderados), sin altos ni críticos. No se aplicaron upgrades forzados de majors para limpiar las vulnerabilidades moderadas restantes.
- Se crearon cliente singleton de navegador, cliente SSR de servidor por solicitud y `src/proxy.ts` (junto a `src/app`, según la convención de Next.js 16). Los clientes se configuran para PKCE y cookies; el Proxy usa `auth.getClaims()` para renovar/verificar de forma optimista, y las rutas de panel realizan una comprobación adicional con `auth.getUser()`.
- Login y logout reales están implementados como Server Actions cuando se configura Supabase. La recuperación envía un enlace con retorno al callback PKCE; el Route Handler intercambia el código y el formulario de restablecimiento valida y cambia contraseña en servidor.
- El callback valida el destino y no acepta redirecciones externas. La respuesta de recuperación no revela si el correo está registrado.
- El registro público ya no simula la creación de cuentas: informa que el alta depende de invitación institucional.
- `.env.example` documenta variables públicas, de servidor y una clave administrativa reservada no utilizada; `.gitignore` permite versionar únicamente ese ejemplo.

### Autorización y límites pendientes

- No existen tablas definitivas de perfil/roles, políticas RLS, pagos verificados ni matrículas conectadas. No se inventó un esquema paralelo ni se tomó el rol desde claims/metadatos editables, navegador o ruta.
- Con Supabase configurado, la sesión autenticada redirige a acceso pendiente y los paneles no muestran contenido hasta implementar la fuente de permisos aprobada. Sin configuración, solo el entorno de desarrollo permite navegación demo; no se crea una sesión y Proxy deniega las rutas en producción.
- No se creó clave `service_role`, cliente privilegiado ni operación de invitación. La invitación requiere verificar desde servidor administrador/permiso, pago, datos y relación con reserva/inscripción.
- Persisten componentes y datos demo de paneles para desarrollo visual; no se eliminaron masivamente. El login demo permanece en código del servidor y no se ofrece si Auth está configurado o en producción. El formulario de cambio simulado solo queda disponible localmente durante desarrollo.
- La política definitiva de retención sigue pendiente. RLS es requisito para conectar tablas; los guards de Next no la sustituyen.

### Archivos creados, modificados y eliminados

- **Creados:** `.env.example`, `docs/AUTENTICACION_Y_SEGURIDAD.md`, `src/proxy.ts`, `src/app/(auth)/actions.ts`, `src/app/auth/callback/route.ts`, `src/app/acceso-pendiente/page.tsx`, `src/components/forms/reset-password-form.tsx`, `src/lib/auth/demo-accounts.ts`, `src/lib/supabase/config.ts`, `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`.
- **Modificados:** `AGENTS.md` (actualización gestionada por Next.js 16.4.4 durante `next dev`), `.gitignore`, `CONTEXTO_PROYECTO.md`, `PROJECT_CONTEXT.md`, `docs/INVENTARIO_FRONTEND.md`, `docs/SEGUIMIENTO_IMPLEMENTACION.md`, `package.json`, `package-lock.json`, `src/app/(auth)/login/page.tsx`, `src/app/(auth)/forgot-password/page.tsx`, `src/app/(auth)/registro/page.tsx`, `src/app/(auth)/reset-password/page.tsx`, `src/app/(dashboard)/layout.tsx`, `src/components/layout/sidebar.tsx`, `src/lib/domain.ts`, `src/lib/service-contracts.ts`.
- **Eliminados:** ninguno. El componente de restablecimiento demo se conserva exclusivamente para el flujo local sin Supabase.

### Comprobaciones y resultado

- `npm.cmd run lint`: correcto.
- `npx.cmd tsc --noEmit`: correcto.
- `npm.cmd run build`: correcto en Next.js 16.4.4; las rutas de panel se generan dinámicamente y se detecta `ƒ Proxy (Middleware)`.
- Smoke test de producción sin variables Supabase: `/admin` y `/superadmin` responden 503; login no muestra controles demo; reset no muestra la simulación; el registro no crea cuentas.
- Smoke test de desarrollo sin Supabase: la navegación demo entra a `/admin` y logout vuelve a `/login`. Esto solo demuestra el flujo de navegación local, no autentica contra Supabase.
- No hay suite automatizada de tests declarada. No se ejecutaron pruebas externas de Auth, sesiones, recuperación por correo o permisos por falta de proyecto/credenciales.
- La auditoría actualizada deja 25 avisos (2 bajos, 23 moderados), sin vulnerabilidades altas ni críticas. El análisis solo de producción deja 6 (2 bajos, 4 moderados). `npm audit fix` aplicó actualizaciones compatibles sin `--force`; las vulnerabilidades moderadas restantes requieren cambios incompatibles o revisión separada.
- No se probaron credenciales, correos, sesiones reales ni renovación remota: no existen credenciales de Supabase en el entorno. No declarar Auth como verificado en producción.
- No hay script de pruebas automatizadas configurado. Faltan tests con proyecto Supabase aislado para credenciales inválidas, login/logout, sesión expirada, roles, recuperación y acceso directo.

**Estado:** FASE 5 completada como preparación de arquitectura y flujos. No habilitar autenticación/paneles en producción hasta validar contra Supabase y completar perfiles, roles y RLS. No iniciar FASE 6 sin autorización expresa.

## Cambios de la FASE 3

### Documentación

- `README.md`: sustituido el contenido genérico de inicio por una descripción del proyecto, stack, comandos y referencias documentales.
- `CONTEXTO_PROYECTO.md`: consolidado como resumen vigente de producto, arquitectura, reglas aprobadas y estado de la demo.
- `PROJECT_CONTEXT.md`: conservado como historial técnico, señalando que las instrucciones antiguas de arquitectura están supersedidas.
- `docs/SEGUIMIENTO_IMPLEMENTACION.md`: creado este registro.

### Frontend y datos demo

- `src/lib/demo-data.ts`: eliminadas las cuentas ficticias `demoUsers`, que no tenían consumidores. Se conservan las cuentas propias del login demo y los fixtures activos que sostienen las pantallas.
- `src/lib/demo-data.ts`: las consultas de tareas y quizzes dejan de sustituir un curso sin datos por los fixtures del curso 1.
- `src/app/(dashboard)/alumno/mis-cursos/[id]/tareas/[tareaId]/page.tsx` y `src/app/(dashboard)/profesor/mis-cursos/[id]/tareas/[tareaId]/page.tsx`: una tarea inexistente para el curso solicitado produce una respuesta 404 en vez de mostrar otra tarea.
- `src/app/(dashboard)/alumno/mis-cursos/[id]/notas/page.tsx`: las notas solo usan resultados individuales disponibles; ya no se interpreta el promedio grupal de un quiz como la nota individual del estudiante. Se muestra un estado vacío cuando no hay calificaciones y no se asigna universalmente el estado “Aprobado”.
- La autenticación demo se conserva deliberadamente para mantener la navegación de desarrollo hasta que se implemente su reemplazo.

### Archivos creados y eliminados

- **Creados en la FASE 3:** `docs/SEGUIMIENTO_IMPLEMENTACION.md`.
- **Eliminados en la FASE 3:** ninguno.
- Los documentos de FASE 1 y FASE 2 ya existían como entregables de esas fases y se conservaron sin cambios durante esta limpieza.

## Comprobaciones

- `npm.cmd run build`: correcto; compilación, TypeScript y generación de rutas completados.
- ESLint sobre los cuatro archivos de frontend modificados: correcto.
- `npm.cmd run lint` completo: no pasa por errores preexistentes en páginas de asistencia (`admin`, `alumno` y `profesor`), `src/components/asistencia/modality-selector.tsx` y `src/components/shared/course-catalog.tsx`; también reporta advertencias de variables sin uso. Estos archivos no se modificaron porque esos hallazgos no eran necesarios para corregir los fallos de aislamiento de fixtures y calificaciones incluidos en esta fase.
- `package.json` no define un script de pruebas.

## Estado al cierre de FASE 3

La aplicación continúa siendo principalmente una demo con datos locales. No se conectó Supabase ni se alteraron Drizzle, el SQL legacy o la configuración de base de datos. El alcance comercial de `/tienda`, las cuentas demo y los fixtures activos quedan como se describe en la documentación vigente. La FASE 4 no debe comenzar sin autorización expresa.

## FASE 4 — Reestructuración y preparación del frontend

### Decisiones y límites

- Se conserva Next.js App Router; no se creó un servidor Express ni se añadió un framework alternativo.
- No se implementaron conexiones Supabase, operaciones de servidor, adaptadores falsos ni servicios vacíos.
- Se separaron modelos compartidos (`src/lib/models.ts`), esquemas y tipos validados (`src/lib/domain.ts`), y contratos de operaciones (`src/lib/service-contracts.ts`). Los contratos de operación llevan `server-only`; los contratos de aplicación no se deben interpretar como autorización. Las implementaciones futuras deben comprobar sesión, rol, propiedad y relación en servidor/RLS.
- Los contratos contemplan autenticación, cuentas, usuarios, cursos, docentes, estudiantes, secciones, interés, reservas, pagos manuales, matrículas, asistencia, sesiones, contenido, archivos privados, chat, notificaciones y estadísticas. Los servicios devuelven datos y dejan que los errores tipados se propaguen para que React Query conserve un único estado de consulta; las Server Actions pueden serializar `ActionResult`. No hay contrato de postulación formal: la decisión aprobada la excluye y el interés es un proceso independiente.
- Se tiparon `America/Lima`, las modalidades presencial/virtual, los estados de cuenta, reservas, pagos y asistencia, y la justificación requerida para modificar asistencia. Los esquemas Zod compartidos cubren inicio de sesión demo, interés, cambios de asistencia y mensajes.
- React Query ya estaba instalado y su proveedor ya envuelve la aplicación. No se agregaron hooks ni consultas sin un backend. El contrato de error diferencia sesión expirada, no autenticado, acceso denegado, validación, no encontrado, conflicto, desconexión y error desconocido. Los futuros `useQuery` deben ser la fuente del estado de carga/error; `[]` representa resultados vacíos, y las Server Actions pueden serializar `ActionResult` sin duplicar el ciclo de vida de React Query.
- React Hook Form y `zodResolver` ya estaban instalados. El login demo ahora usa el esquema compartido; mantiene sus cuentas, destinos y almacenamiento demo. Otros formularios de demostración no se migraron porque no tienen persistencia y hacerlo excedería una preparación segura sin cambiar el flujo aprobado.
- `src/lib/db/index.ts` ya estaba protegido por `server-only`; se añadieron guardas equivalentes a todos los módulos de esquema Drizzle (`usuarios.ts`, `cursos.ts`, `tareas.ts`, `pagos.ts`, `chat.ts`). Drizzle continúa exclusivamente del lado servidor.

### Diagnósticos ESLint corregidos

Los seis errores y las dieciséis advertencias observados al cierre de FASE 3 se volvieron a reproducir antes de modificar archivos.

- **Seis errores corregidos:** tres actualizaciones síncronas de estado en efectos de páginas de asistencia; dos efectos duplicados/de sincronización de estado en el selector de modalidad; y una actualización síncrona de estado al leer la modalidad de la URL en el catálogo. Las vistas de asistencia ahora derivan los datos de ruta y query params; los componentes locales reconcilian cambios de sus props durante el render en vez de sincronizarlos con efectos.
- **Dieciséis advertencias corregidas:** se conectaron los handlers de asistencia que ya tenían el mismo comportamiento que los callbacks en línea; se eliminaron imports y cálculos demostrablemente no usados.
- No se desactivaron reglas de ESLint.

### Archivos de la FASE 4

**Modificados:** `src/app/(auth)/login/page.tsx`; páginas de asistencia de admin, alumno y profesor en `src/app/(dashboard)/`; `src/components/asistencia/modality-selector.tsx`; `src/components/asistencia/student-attendance-view.tsx`; `src/components/shared/course-catalog.tsx`; `src/lib/asistencia/demo-asistencia.ts`; los cinco esquemas `src/lib/db/schema/{usuarios,cursos,tareas,pagos,chat}.ts`; y este seguimiento.

**Creados:** `src/lib/domain.ts`, `src/lib/models.ts` y `src/lib/service-contracts.ts`.

**Eliminados:** ninguno.

**Dependencias agregadas/actualizadas:** ninguna. Se reutilizan las dependencias existentes `zod`, `react-hook-form`, `@hookform/resolvers`, `@tanstack/react-query` y `server-only`.

### Verificación de FASE 4

- `npm.cmd run lint`: correcto, sin errores ni advertencias; los 6 errores y 16 warnings reportados al final de FASE 3 ya no aparecen.
- `npx.cmd tsc --noEmit`: correcto.
- `npm.cmd run build`: correcto; Next.js 16.3.8 compiló, completó TypeScript y generó sus 38 páginas estáticas; el build enumeró correctamente las rutas estáticas y dinámicas.
- `git diff --check`: correcto.
- No hay archivos de prueba en `tests/` ni un script `test` en `package.json`; por tanto no había suite automatizada que ejecutar.

La autenticación sigue siendo demo y los contratos aún no tienen implementaciones. No se cambió el esquema de base de datos, no se instalaron dependencias y no se inició la FASE 5. Se requiere autorización expresa para continuar.

## Política aprobada de datos demo para las próximas fases

**Aprobada por el usuario el 2026-11-02.** El estado final deseado es que las funcionalidades de producción utilicen servicios reales y no dependan de usuarios ficticios, contraseñas temporales ni operaciones simuladas. Esta política no autoriza una eliminación masiva en la fase actual.

### Clasificación inicial verificada

La búsqueda estática actual identificó 25 archivos con nombre `demo*`; todos tienen al menos un consumidor en `src/`. **No se identificaron archivos con nombre demo sin consumidores en esta revisión**, por lo que no se elimina ninguno ahora. La búsqueda se basa en referencias textuales/imports; antes de eliminar un archivo, verificar también imports indirectos, exports, rutas y pruebas.

- **Fuentes de datos demo y fixtures visuales actualmente consumidos:** `src/lib/demo-data.ts`, `src/lib/demo-courses.ts`, `src/lib/demo-course-content.ts` y `src/lib/asistencia/demo-asistencia.ts`. Alimentan catálogos, dashboards, actividades académicas, cursos, asistencia, pagos y calendarios de demostración. Son datos locales de desarrollo visual, no fixtures de pruebas automatizadas.
- **Componentes de demostración utilizados por vistas:** `src/components/forms/demo-admin-user-editor.tsx`, `demo-assignment-submission.tsx`, `demo-checkout-form.tsx`, `demo-course-editor.tsx`, `demo-page-editor.tsx`, `demo-profile-form.tsx`, `demo-quiz-builder.tsx`, `demo-quiz.tsx`, `demo-reset-password-form.tsx`, `demo-site-settings.tsx`, `demo-task-builder.tsx`; y `src/components/shared/demo-calendar.tsx`, `demo-chat.tsx`, `demo-content-manager.tsx`, `demo-course-content-studio.tsx`, `demo-course-enrollments.tsx`, `demo-create-section.tsx`, `demo-grading-queue.tsx`, `demo-lesson-viewer.tsx`, `demo-notifications.tsx`, `demo-student-progress.tsx`. Se mantienen mientras sus pantallas sigan dependiendo de ellos y hasta reemplazar cada módulo.
- **Autenticación demo:** `src/app/(auth)/login/page.tsx` conserva las cuentas y contraseñas hardcodeadas; `src/app/(auth)/registro/page.tsx`, `src/app/(auth)/forgot-password/page.tsx`, `src/app/(auth)/reset-password/page.tsx` y `src/components/forms/demo-reset-password-form.tsx` siguen teniendo flujos de presentación/demo. No retirar cuentas, contraseñas ni `sessionStorage` hasta implementar y verificar Supabase Auth, sesiones, rutas protegidas y permisos reales.
- **Simulaciones de operaciones de negocio:** incluyen editores y formularios `demo-*` indicados arriba, así como las páginas que los consumen para checkout, administración de usuarios/cursos, tareas, quizzes, pagos y asistencia. También existen callbacks locales, datos escritos directamente en vistas y respuestas temporizadas. El inventario por módulo deberá hacerse antes de reemplazar cada flujo; su nombre o aspecto no convierte la operación en persistente.
- **Datos de pruebas automatizadas:** no se encontraron archivos de prueba en `tests/`, archivos `*.test.*`/`*.spec.*` ni un script `test` en `package.json`. Los datos demo actuales **no** se clasifican como fixtures de pruebas automatizadas. Si se agregan pruebas, sus factories/fixtures deben separarse de `src/lib/demo-*` y no reutilizar credenciales de acceso.
- **Archivos demo sin consumidores:** ninguno de los 25 archivos con nombre demo revisados. La limpieza anterior retiró únicamente la exportación `demoUsers` sin consumidores de `src/lib/demo-data.ts`; no se borró el archivo porque conserva otros datos consumidos.

### Regla de transición por módulo

En cada módulo, de forma secuencial:

1. Implementar el acceso real a Supabase PostgreSQL/Auth/Storage/Realtime según corresponda, desde el límite correcto de servidor o cliente y con validación y autorización de servidor/RLS.
2. Comprobar datos persistidos reales y probar lecturas/escrituras con permisos de cada rol y relaciones/propiedad aplicables.
3. Verificar estados de carga, datos, vacío, error, sin conexión, acceso denegado y sesión expirada, además de validación.
4. Migrar las vistas y formularios consumidores del módulo al servicio real y etiquetar claramente cualquier fixture de desarrollo que quede disponible.
5. Buscar todos los consumidores de los datos/componentes demo de ese módulo. Eliminar únicamente los recursos ya sustituidos que no tengan consumidores legítimos; mantener y aislar fixtures necesarios para desarrollo o pruebas.
6. Ejecutar pruebas, TypeScript, lint/build y búsqueda de referencias rotas; registrar archivos eliminados y motivo en este seguimiento.

Los fixtures de desarrollo no deben entrar en consultas o bundles de producción ni presentarse como registros reales. Su aislamiento (por ejemplo, carga exclusivamente en entorno de desarrollo y datos de pruebas separados) deberá comprobarse al preparar cada módulo. No se debe ocultar la dependencia demo con fallbacks con apariencia exitosa.

### Cierre integral de la futura integración

Solo después de integrar todos los módulos, hacer un barrido global de `demo`, `mock`, datos estáticos y credenciales; comprobar sus consumidores, retirar simulaciones innecesarias y las credenciales temporales; verificar que estadísticas y vistas operativas procedan de registros persistidos y que no existan referencias rotas. Mantener el login demo hasta verificar Supabase Auth y protección de rutas; después eliminar usuarios/contraseñas hardcodeados, la autenticación simulada y el uso de `sessionStorage` como autenticación.

**Estado tras FASE 5:** la aplicación sigue siendo una demostración y no está preparada para producción. La política anterior queda como restricción para el trabajo futuro; no se eliminaron masivamente otros archivos demo.

## FASE 6 — Preparación de módulos académicos y administrativos

### Alcance y arquitectura

- Se ampliaron los contratos existentes de cursos/categorías, secciones, demanda, reservas, pagos manuales, usuarios, contenido por sección y estadísticas por rol. Se añadieron filtros tipados para cursos, secciones y rangos de fechas, y operaciones explícitas de confirmación/cancelación manual de reservas.
- Se ampliaron DTOs de resúmenes administrativos, disponibilidad, pagos/verificaciones, auditoría y estadísticas de administración y docentes.
- Se añadieron validaciones Zod reutilizables para administración de cursos/secciones, filtros, orden de fechas, revisiones de pago y recursos didácticos. El rol `superadmin` no se admite en la entrada ordinaria de creación/invitación de cuentas.
- Los contratos permanecen bajo `server-only`. No se implementaron adaptadores, consultas, Server Actions, Route Handlers, servicios falsos ni conexión Supabase. Los contratos no otorgan permisos: cada futura operación deberá verificar sesión, identidad, rol/permisos, relación con curso/sección/reserva y política RLS desde servidor/PostgreSQL.
- Confirmar reservas con disponibilidad exige una operación atómica/transaccional en PostgreSQL; el conteo presentado por la interfaz no garantiza por sí solo la última plaza.
- La reserva puede cancelarse manualmente por un actor autorizado; no se incorporaron vencimientos ni cancelaciones automáticas. Se mantuvo pendiente el catálogo institucional de estados de sección.
- Se especificaron fuentes y cálculos posibles para los KPIs. Porcentajes de asistencia, progreso, calificación, conversión e ingresos permanecen nulos/no disponibles hasta que se aprueben fórmula, denominador, ámbito y moneda. Las reglas se registran en [REGLAS_NEGOCIO_Y_MODELO_DATOS.md](./REGLAS_NEGOCIO_Y_MODELO_DATOS.md).
- El inventario de autenticación se actualizó para reflejar cookies SSR/Proxy preparadas y la limitación real de las cuentas demo: navegación local en desarrollo sin Supabase, no autenticación de producción.
- El dashboard de desarrollo muestra un aviso cuando no hay Supabase configurado para aclarar que los registros son demostrativos y no persisten. No se eliminó ningún fixture, cuenta demo ni autenticación demo.

### Auditoría de dependencias

- `npm audit`: 25 avisos en el árbol completo (2 bajos, 23 moderados, cero altos/críticos); 4 dependencias directas afectadas y 21 transitivas.
- `npm audit --omit=dev`: cero avisos. Todos los avisos corresponden al árbol de desarrollo. Se movió `shadcn` a `devDependencies` tras confirmar que no tiene consumidores/importaciones de runtime.
- No se añadieron dependencias ni se aplicó `--force`, downgrades incompatibles ni overrides globales. La tabla individual, rangos y decisión de remediación están en [AUDITORIA_DEPENDENCIAS.md](./AUDITORIA_DEPENDENCIAS.md).

### Archivos de FASE 6

- **Modificados:** `src/lib/domain.ts`, `src/lib/models.ts`, `src/lib/service-contracts.ts`, `src/app/(dashboard)/layout.tsx`, `package.json`, `package-lock.json`, `docs/REGLAS_NEGOCIO_Y_MODELO_DATOS.md`, `docs/INVENTARIO_FRONTEND.md` y este seguimiento.
- **Creados:** `docs/AUDITORIA_DEPENDENCIAS.md`.
- **Eliminados:** ninguno.
- **Dependencias agregadas:** ninguna. `shadcn` solo cambió de `dependencies` a `devDependencies`.

### Pendientes y verificación

- **Correcto:** `npm.cmd run lint`, `npx.cmd tsc --noEmit`, `npm.cmd run build`, `npx.cmd prettier --check src/lib/domain.ts src/lib/service-contracts.ts src/lib/models.ts` y `git diff --check`.
- **Correcto:** `npm.cmd audit --omit=dev` devuelve cero avisos. `npm.cmd audit` devuelve 25 avisos, todos del árbol de desarrollo; consultar [AUDITORIA_DEPENDENCIAS.md](./AUDITORIA_DEPENDENCIAS.md).
- El build de Next.js 16.4.4 compiló, completó TypeScript, generó páginas y reconoció `ƒ Proxy (Middleware)`.
- No se ejecutó una suite automatizada porque el repositorio no tiene pruebas ni script `test`.
- No hay credenciales ni proyecto Supabase remoto disponible; por tanto, no se probaron datos persistidos, operaciones, permisos/RLS, Storage o informes reales.
- Los paneles y flujos de negocio continúan consumiendo datos demo; esta fase no los presenta como persistidos ni elimina demos compartidos.
- No hay una suite automatizada ni un script `test` configurado.
- La integración de tablas, transacciones de cupos, estados institucionales, fórmulas estadísticas, permisos/RLS y flujos reales sigue pendiente de fases posteriores.
- No se cambia ni se genera SQL, esquema Drizzle o migración en esta fase.

**Estado final:** FASE 6 completada como preparación tipada/documental, no como implementación backend. La aplicación no está lista para producción. FASE 7 no se ha iniciado; requiere autorización expresa.

## FASE 7 — Archivos privados, videos y materiales educativos

### Inventario y arquitectura

- Se inventariaron los formularios de perfil, checkout/comprobantes, entregas académicas, edición de cursos/portadas, gestión de clases y materiales, guías de tareas, chat/adjuntos, configuración del sitio, reproductor de lecciones, revisión administrativa de pagos e importación CSV de asistencia.
- Las selecciones de archivo observadas son demostrativas: guardan nombres/estado local o muestran una vista previa local; no se encontró subida real a Storage. La revisión de pago muestra un área de vista previa sin recurso asociado y el reproductor de video no tiene una fuente multimedia real.
- Se registraron los campos URL existentes en esquemas Drizzle legacy; no se modificaron los esquemas ni se trató una URL como prueba de objeto real.
- [ARCHIVOS_STORAGE_Y_MATERIALES.md](./ARCHIVOS_STORAGE_Y_MATERIALES.md) propone ocho buckets privados y organización por IDs opacos, sin PII en rutas, matriz por rol/recurso, RLS de `storage.objects`, flujo de autorización/carga/descarga/reemplazo/eliminación, metadatos PostgreSQL y comparación de video.
- Los permisos propuestos requieren relaciones autorizadas desde PostgreSQL: propietario, pago, entrega, inscripción activa, asignación docente, documento administrativo o participante de conversación 1:1. El rol superadministrador no otorga acceso indiscriminado a documentos, pagos o chat.
- La arquitectura evita pasar bytes de archivos por Server Actions/Route Handlers de Vercel. El diseño propone intención autorizada en servidor, carga directa por el cliente autenticado con RLS, y finalización/reconciliación desde servidor. La guía oficial Supabase se usa para escoger carga estándar en archivos pequeños y TUS resumible en cargas mayores o redes inestables; el umbral recomendado por el proveedor no es un límite institucional.
- Se propone guardar rutas permanentes `bucket + objectPath` y metadatos de archivo en PostgreSQL; las URLs firmadas se emiten solo temporalmente tras autorización y nunca se guardan como referencias. No se utiliza `service_role`.
- La recomendación inicial es Supabase Storage privado para documentos e imágenes; decidir si videos permanecen en Storage o pasan a Cloudflare Stream/Mux tras definir requisitos de transmisión, privacidad, residencia y volumen/costo. No se integró ningún proveedor de video.

### Contratos y validaciones

- Se amplió `PrivateFileServiceContract` para intención/finalización/reintento/cancelación de carga, previsualización, descarga, reemplazo y eliminación autorizada.
- Se ampliaron `PrivateFileMetadata`, `PrivateDownload` y `LearningResource`; se añadieron `PrivateUploadIntent` y `PrivateUploadProgress`. La referencia durable es bucket/ruta e ID, no URL firmada.
- Se añadieron esquemas compartidos para bucket/categoría/tipo de relación/estado, nombre seguro, tipo MIME sintáctico, tamaño positivo y referencia de entidad; no se establece máximo definitivo.
- No se añadió implementación, cliente de Storage, acción/endpoint, RLS ejecutable, política SQL, tabla Drizzle ni variable de entorno. Los controles definitivos de extensión/MIME/tamaño, inspección real, cuarentena y retención quedan pendientes.

### Datos demo, archivos y dependencias

- Se conservaron fixtures y todos los componentes demo: siguen teniendo consumidores y aún no hay servicios reales que los sustituyan.
- No se modificaron vistas ni se añadió carga/descarga funcional; las interfaces existentes siguen siendo demostraciones.
- **Modificados:** `src/lib/domain.ts`, `src/lib/models.ts`, `src/lib/service-contracts.ts` y este seguimiento.
- **Creados:** `docs/ARCHIVOS_STORAGE_Y_MATERIALES.md`.
- **Eliminados:** ninguno.
- **Dependencias agregadas:** ninguna.

### Verificaciones y pendientes

- `npm.cmd run lint`: correcto.
- `npx.cmd tsc --noEmit`: correcto.
- `npm.cmd run build`: correcto; las vistas/rutas existentes compilaron sin cambios visuales ni de comportamiento.
- `git diff --check`: correcto.
- No se pudo probar Supabase Storage/RLS, carga TUS, permisos, URLs firmadas ni proveedor de video: no existe proyecto remoto ni credenciales. No se ejecutó ninguna operación remota.
- Antes de producción deben definirse perfiles/roles y relaciones/RLS, límites y MIME por categoría, TTL de URLs, política de cuarentena/antivirus, retención, visibilidad de portadas/perfiles, buckets reales, estrategia de limpieza y proveedor de video.

**Estado final:** FASE 7 completada como inventario y preparación tipada/documental; Storage y medios reales no están implementados.

## FASE 8 — Chat privado, notificaciones y contacto

### Alcance realizado

- Se documentaron las reglas de chat 1:1 aprobadas: estudiante-docente asignado, estudiante-administrador para soporte y docente-administrador. No hay grupos ni acceso automático del superadministrador al contenido.
- Se alinearon los ejemplos visibles de `DemoChat` a conversaciones individuales autorizables, se retiraron filtros/grupos y conteos de participantes, y se aclararon los textos de acceso docente/alumno. Sigue siendo un fixture local; no se quitó su entrada de adjuntos ni se afirma que cargue archivos: solo conserva el nombre local seleccionado.
- Se ampliaron esquemas y contratos de chat con inicio/recuperación, filtros, cursores compuestos, historial paginado, recibos individuales, envío, marcación de lectura y conteo de no leídos. Se añadieron filtros, estado y conteo para notificaciones persistentes, además de contratos cliente-seguros de suscripción con eventos mínimos y función de baja.
- Los eventos Realtime diseñados anuncian identificadores; no llevan cuerpos de mensajes, datos personales ni JWT. Se documentó la alternativa preparada de Broadcast privado con autorización en `realtime.messages` y recuperación del contenido mediante consultas RLS.
- Se agregó la burbuja pública de WhatsApp con el número aprobado y texto acordado. Se integra solo en el layout público; enlace en pestaña nueva, `noopener`, `noreferrer`, `no-referrer` y etiqueta accesible.
- [CHAT_NOTIFICACIONES_Y_REALTIME.md](./CHAT_NOTIFICACIONES_Y_REALTIME.md) registra el diseño de datos propuesto, RLS, autorización en cada operación, revocación, paginación, límites y pendientes.
- El esquema Drizzle actual no se cambió: su participación no limita a dos, tiene un `leido` global y referencia `archivoUrl`; las notificaciones usan un booleano y destino libre. No implementa las reglas necesarias. Cualquier ajuste requiere diseño/migración aprobados y pruebas con RLS.

### Estado, archivos y dependencias

- Chat y notificaciones siguen siendo demostraciones; sus arrays/estado local no son persistentes ni se conectan con PostgreSQL/Realtime. No se añadieron adaptadores, Server Actions, Route Handlers, SQL, políticas ejecutables, canales, buckets ni servicios vacíos.
- **Modificados:** `src/lib/domain.ts`, `src/lib/models.ts`, `src/lib/service-contracts.ts`, `src/components/shared/demo-chat.tsx`, `src/app/(public)/layout.tsx`, `src/app/(dashboard)/alumno/chat/page.tsx`, `src/app/(dashboard)/profesor/chat/page.tsx`, `docs/INVENTARIO_FRONTEND.md` y este seguimiento.
- **Creados:** `src/lib/whatsapp.ts`, `src/components/shared/whatsapp-contact.tsx`, `docs/CHAT_NOTIFICACIONES_Y_REALTIME.md`.
- **Eliminados:** ninguno. Fixtures mantenidos porque las vistas todavía los consumen.
- **Dependencias agregadas:** ninguna.

### Pendientes y verificación

- Faltan credenciales/proyecto Supabase, esquema aprobado de mensajes/participantes/lecturas/notificaciones, RLS tabla por tabla y de Realtime, operaciones servidor y relaciones de matrícula/permiso de soporte.
- No se modificó `src/lib/db/schema/chat.ts`; las diferencias y migraciones necesarias están documentadas. No se hicieron operaciones remotas ni se probó WhatsApp contra una cuenta comercial.
- Ejecutar en esta fase: `npm.cmd run lint`, `npx.cmd tsc --noEmit`, `npm.cmd run build` y `git diff --check`. No hay script de pruebas automatizadas declarado.
- No declarar chat, notificaciones persistentes o Realtime disponibles en producción hasta ejecutar pruebas de integración/seguridad con Supabase. Verificar de forma específica acceso cruzado por IDs, intentos de añadir terceros, acceso no participante, recibos privados, notificaciones ajenas, revocación, desconexión y duplicados.

**Estado final:** FASE 8 completada como preparación de contratos/documentación y contacto público. Chat privado, notificaciones persistentes y Realtime no están implementados ni verificados remotamente. La aplicación no está lista para producción. FASE 9 no se ha iniciado; detenerse y esperar autorización expresa.

## FASE 9 — Contratos API, servicios y preparación de Vercel

### Diseño de operaciones y mecanismos

- Se revisaron inventario, reglas de negocio, documentos de Storage, chat, autenticación, seguimiento, esquemas Drizzle, contratos/modelos Zod, servicios, clientes Supabase, Next.js y variables de entorno.
- [API_CONTRACT.md](./API_CONTRACT.md) mapea las operaciones de Auth, perfiles/roles, cursos/categorías, secciones/horarios, interesados, checkout/reservas, pagos/matrículas, sesiones/asistencia, tareas/quizzes/certificados, archivos/videos, chat/notificaciones, estadísticas, auditoría y configuración. Cada operación distingue mecanismo, solicitud/respuesta, validación, autorización, errores, reglas y estado implementado/preparado/pendiente.
- Se confirmó que `service-contracts.ts` contiene interfaces `server-only`, pero no se encontraron adaptadores ni consumidores de `getDb()`. Las pantallas de negocio siguen siendo demos. No se crearon servicios vacíos ni se atribuyó persistencia a sus contratos.
- Se agregaron los códigos normalizados de error `operation_not_allowed`, `rate_limited`, `unavailable` e `internal` a `ServiceErrorCode`; esto amplía el vocabulario tipado, no instala manejo automático ni cambia el estado de las operaciones.
- Se separaron explícitamente Auth, Supabase JS con RLS, Storage, Realtime, Server Components, Server Actions, Route Handlers y Drizzle. RLS/contexto de identidad para Drizzle queda bloqueante: una conexión de base de datos no hereda `auth.uid()`/JWT, y no se permite usar una conexión privilegiada como acceso normal a datos de usuario.
- OpenAPI solo incluye el Route Handler existente `GET /auth/callback`; no se añadieron REST endpoints de negocio, Storage, Auth, chat o CRUD. La especificación reutiliza modelos de error/seguridad y documenta el código PKCE como sensible y de un solo uso.
- No se seleccionó un servicio externo de video ni se añadió un webhook. La tienda visual permanece fuera del dominio académico hasta confirmar si es comercio real.

### Vercel, variables y pooling

- [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) documenta build Next.js automático, App Router/Proxy, variables separadas de desarrollo/Preview/producción, callbacks exactos, salida no estática, Preview aislado y pasos sin deploy real. No se creó `vercel.json`, ya que Vercel puede detectar Next.js automáticamente.
- Se identificó que el cliente runtime de Postgres.js ya usaba `prepare: false`, requerido por Supavisor transaction mode. Se limitó ahora el pool de cada instancia serverless a `max: 1` y `idle_timeout: 20`; el singleton continúa lazy y `server-only`.
- Se separó `DATABASE_MIGRATION_URL` de `DATABASE_URL`: Drizzle Kit ahora exige URL de migraciones directa/session pooler y no reutiliza la URL runtime de transacciones. El ejemplo de entorno mantiene ambas vacías. La URL de migraciones no debe configurarse como variable de runtime en Vercel.
- El pool, Supavisor y configuración se evaluaron estáticamente; no hay credenciales para medir conexiones o verificar el pooler remoto. No se ejecutó migración.
- Se actualizó [AUTENTICACION_Y_SEGURIDAD.md](./AUTENTICACION_Y_SEGURIDAD.md) para distinguir la variable runtime y la de migraciones.

### Archivos y dependencias

- **Creados:** `docs/API_CONTRACT.md`, `docs/openapi.yaml`, `docs/VERCEL_DEPLOYMENT.md`.
- **Modificados:** `.env.example`, `drizzle.config.ts`, `src/lib/db/index.ts`, `src/lib/domain.ts`, `docs/AUTENTICACION_Y_SEGURIDAD.md`, este seguimiento.
- **Eliminados:** ninguno.
- **Dependencias agregadas:** ninguna; OpenAPI se parseó con `js-yaml` ya presente en el árbol de dependencias.
- **Configuración/despliegues:** no se creó configuración específica de Vercel ni se hizo deploy; el proveedor debe detectar Next.js automáticamente.

### Errores, límites y verificación

- **Corregido:** la misma `DATABASE_URL` servía tanto a runtime como a Drizzle Kit. Se separó la URL de migración, se evita transaction pooling para migraciones, y se acotó el pool serverless.
- **Riesgo documentado sin habilitar:** `getDb()` no establece contexto de sesión/RLS y no tiene consumidores actuales; no utilizarlo para CRUD de usuarios hasta probar la estrategia de claims/rol DB y políticas. Se recomienda Supabase JS con JWT/RLS para acceso ordinario.
- **Lint:** `npm.cmd run lint` correcto.
- **TypeScript:** `npx.cmd tsc --noEmit` correcto.
- **Build:** `npm.cmd run build` correcto en Next.js 16.4.4; se generaron las rutas App Router y `Proxy`.
- **OpenAPI:** `js-yaml` parseó `docs/openapi.yaml` y se validaron assertions estructurales: OAS 3.1.0, secciones obligatorias, único path `/auth/callback`, método GET y respuesta redirect 307. No se añadió un validador OAS externo.
- **Formato:** Prettier escribió solo los documentos nuevos y los archivos pequeños de configuración de DB. Los documentos preexistentes largos no se reformatearon para evitar cambios no relacionados.
- **`git diff --check`:** correcto antes del formato final; volver a ejecutar tras el cierre de documentación.
- No hay suite automatizada configurada. No se probaron Supabase, Postgres, RLS, Auth, Storage, Realtime, pools remotos ni Vercel; no se expusieron credenciales ni se hizo deployment.

**Estado final:** FASE 9 completada como diseño de operaciones, documentación OpenAPI/entornos y ajuste local del pool. No existe backend de negocio ni integración remota verificada; los módulos reales siguen pendientes de esquema, RLS, adaptadores y pruebas con proyecto aislado. No comenzar FASE 10 sin autorización expresa.

## FASE 10 — Verificaciones generales, correcciones y seguridad

### Estado contrastado

- Se contrastaron los documentos de inventario, reglas de negocio, autenticación, Storage, chat/Realtime, contratos API, OpenAPI, Vercel y seguimiento con las rutas, servicios, esquemas, clientes y configuración presentes.
- Supabase Auth SSR/PKCE y el callback tienen código real, pero no se probaron con un proyecto remoto. El Proxy protege rutas de panel de forma optimista; el layout vuelve a verificar la sesión y mantiene el acceso en estado pendiente porque todavía no existe un modelo implementado de perfiles/roles institucionales.
- Los paneles y operaciones académicas/administrativas, el chat, las notificaciones, Storage y la persistencia siguen siendo demo o contrato. `getDb()` permanece `server-only` y sin consumidores; no hereda `auth.uid()`/JWT ni debe usarse para consultas de usuario hasta aprobar y probar el contexto de autorización.
- `database_schema.sql` sí contiene texto RLS legacy: habilita ocho tablas, pero solo declara tres políticas sobre `usuarios`; dependen de `current_user_id()`, definido después y con un cuerpo placeholder que devuelve `NULL`. No se verificó ni aplicó el script, por lo que no demuestra RLS efectiva. Faltan migraciones definitivas y políticas completas/probadas. Las variables de Supabase y PostgreSQL no están configuradas en este entorno; no se usó acceso remoto, `service_role` ni despliegue.
- Se corrigieron descripciones obsoletas de autenticación y datos en [INVENTARIO_FRONTEND.md](./INVENTARIO_FRONTEND.md). El catálogo y perfiles públicos usan fixtures (incluidos precios, biografías y métricas); se añadió un aviso global que los identifica como demostración y aclara que el checkout no procesa pagos. No se retiraron fixtures ni cuentas demo que sostienen vistas.

### Seguridad, datos y arquitectura

- Ningún hallazgo crítico ni alto de explotación quedó confirmado en el código examinado. El bloqueo de producción es arquitectónico y confirmado: no habilitar operaciones de negocio hasta implementar perfiles/roles, autorización por recurso, persistencia y RLS verificable.
- En producción sin configuración Supabase, Proxy devuelve 503 en rutas protegidas. Con Auth configurado, el layout obtiene el usuario y redirige a acceso pendiente; no concede paneles por pathname ni por metadata editable. La navegación demo opera solo en desarrollo sin configuración, muestra una advertencia y no crea sesión Auth.
- Los módulos Drizzle, el cliente Supabase de servidor y los contratos de servicio están delimitados con `server-only`; la búsqueda de imports desde páginas/componentes cliente no encontró importaciones directas de esos módulos. El build confirmó que la separación compila. El import de Server Action desde el sidebar es una referencia de acción de Next.js, no una importación de credenciales/Drizzle al navegador.
- No se encontró uso de `service_role`, claves privadas, tokens o secretos activos en el código fuente auditado. Las variables sensibles están vacías en `.env.example`; variables del proceso y archivos `.env` reales no están presentes en este entorno. Los datos personales de panel son fixtures de demostración.
- Riesgo condicionado (medio): una conexión Drizzle privilegiada no establece por sí sola el contexto de identidad de Supabase ni `auth.uid()`. No hay consumidores hoy; no habilitar acceso ordinario de usuario hasta definir y probar RLS o una estrategia contextual equivalente.
- Rate limiting de Auth, pruebas remotas de PKCE/cookies/recuperación y verificaciones de acceso cruzado por usuario/rol están pendientes; no se simularon.

### Dependencias

- `npm.cmd audit`: 25 avisos, 2 bajos y 23 moderados, cero altos/críticos; los cuatro paquetes directos afectados son de desarrollo (`drizzle-kit`, `eslint`, `eslint-config-next`, `shadcn`), con dependencias transitivas.
- `npm.cmd audit --omit=dev`: cero avisos. El árbol de producción no reportó vulnerabilidades en la fecha de esta revisión.
- Los avisos se agrupan en `deepmerge` (contaminación de prototipos, baja; transitive de shadcn), `esbuild` (servidor dev puede recibir peticiones arbitrarias, moderada; dependencia de Drizzle Kit) y `minimatch` (DoS por amplificación de glob, moderada; cadenas de ESLint/TypeScript-ESLint/shadcn). Las versiones afectadas y dependencias relacionadas se detallan en [AUDITORIA_DEPENDENCIAS.md](./AUDITORIA_DEPENDENCIAS.md).
- npm propone resolver las cadenas con downgrades incompatibles (entre ellos Drizzle Kit 0.18.1, ESLint 4.0.0, `eslint-config-next` 12.0.4 y shadcn 1.0.0). No se usó `--force`, no se aplicó ningún downgrade y no se cambiaron dependencias en FASE 10. Revaluar versiones compatibles y overrides solo con pruebas.

### Responsive, rendimiento y verificación

- Se probaron en navegador 11 rutas representativas (pública, catálogo, checkout, login, dashboards de los cuatro roles, cursos admin y chat docente/alumno) a 360, 768, 1024 y 1440 px: 44/44 respuestas HTTP 200 y cero desbordamientos horizontales. El aviso público se comprobó a los cuatro anchos; el menú móvil de admin se abrió y mostró navegación. Es un smoke test representativo, no una inspección visual exhaustiva de todas las 62 páginas.
- En el navegador de desarrollo Next.js avisó que las imágenes `/img/python.webp` e `/img/icono_crecimiento.webp` fueron candidatas LCP y sugirió revisar `loading="eager"`; también avisó de precargas no usadas durante la navegación. No se hicieron mediciones de Core Web Vitals/Lighthouse ni cambios especulativos de carga.
- React Query tiene proveedor global pero no hay adaptadores/consultas reales que permitan medir repetición o sobrecarga. No se encontró uso de `getDb()`; no se midieron consultas de base, conexiones Supavisor ni tráfico remoto.
- No existe script/runner de pruebas automatizadas. No se añadió infraestructura de test; queda pendiente incorporar pruebas acotadas para validaciones y reglas puras cuando se confirme el runner apropiado.
- `docs/openapi.yaml` se parseó como YAML y se comprobaron OAS 3.1.0 y el único endpoint personalizado `GET /auth/callback`.
- `npm.cmd run lint`: correcto. `npx.cmd tsc --noEmit`: correcto. `npm.cmd run build`: correcto; Next generó páginas estáticas/dinámicas y Proxy. `git diff --check`: correcto tras la documentación final.

### Archivos y cambios de FASE 10

- **Creados:** `docs/INFORME_AUDITORIA_TECNICA.md`.
- **Modificados:** `docs/INVENTARIO_FRONTEND.md`, `docs/REGLAS_NEGOCIO_Y_MODELO_DATOS.md`, `docs/SEGUIMIENTO_IMPLEMENTACION.md`, `src/app/(public)/layout.tsx`.
- **Eliminados:** ninguno.
- **Dependencias instaladas/actualizadas:** ninguna.
- **Errores corregidos:** afirmaciones obsoletas del inventario sobre autenticación e `demoUsers`; falta de señal visible de que el catálogo, los perfiles y las cifras públicas son demo.

### Pendientes antes de producción

1. Diseñar y aprobar el modelo de base de datos de producción, roles/perfiles y políticas RLS; ejecutar pruebas negativas de acceso cruzado.
2. Implementar servicios por módulo con autorización en cada Server Action/Route Handler o cliente bajo RLS y reemplazar fixtures solo cuando cada vista esté verificada.
3. Probar Auth, sesiones, recuperación, callbacks y rate limiting en un proyecto Supabase aislado.
4. Configurar Preview y producción con proyectos/variables aislados y probar despliegue real solo con autorización.
5. Reevaluar avisos de desarrollo cuando existan versiones compatibles corregidas; medir Web Vitals y verificar la estrategia de carga de imágenes.
6. Agregar pruebas automáticas acotadas para esquemas Zod y reglas de negocio sin depender de Supabase remoto.

**Estado final:** FASE 10 completada como auditoría y corrección documental/de transparencia. No se creó SQL ni se conectó infraestructura remota. Detenerse aquí y esperar autorización expresa antes de la FASE 11.

## FASE 11 — Diseño definitivo de base de datos, SQL para Supabase y documentación final

### Alcance realizado

- Se consolidó la estrategia definitiva de base de datos para PostgreSQL/Supabase bajo la lógica aprobada por el proyecto: roles, perfiles, cursos, secciones, reservas, pagos, inscripciones, asistencia, contenidos, archivos privados, chat, notificaciones, auditoría y configuración institucional.
- Se creó el historial de migraciones preparatorio en `supabase/migrations/` como fuente oficial de cambios de esquema.
- Se generó el script consolidado `supabase/sql/supabase_setup.sql` para revisión, documentación y despliegue inicial desde el SQL Editor de Supabase.
- Se documentó la arquitectura final de la base de datos en `docs/DATABASE_DOCUMENTATION.md`.
- Se creó el documento de contexto para backend `docs/CONTEXTO_PROYECTO_BACKEND.md` con la información técnica necesaria para continuar la implementación sin volver a investigar todo el repositorio.
- Se generó el informe final de integración `docs/INFORME_FINAL_INTEGRACION.md`.

### Archivos creados

- `supabase/migrations/202501020001_initial_core_security.sql`
- `supabase/migrations/202501020002_academics_enrollments.sql`
- `supabase/migrations/202501020003_privacy_storage_realtime.sql`
- `supabase/sql/supabase_setup.sql`
- `docs/DATABASE_DOCUMENTATION.md`
- `docs/CONTEXTO_PROYECTO_BACKEND.md`
- `docs/INFORME_FINAL_INTEGRACION.md`

### Estado del esquema propuesto

- El diseño final mantiene la separación entre `auth.users` y el perfil institucional.
- Los roles principales son `superadministrador`, `administrador`, `docente` y `estudiante`.
- La lógica de reservas, pagos, inscripciones y asistencia se modela con estados explícitos y restricciones de unicidad.
- Los archivos privados se modelan en Storage con metadatos en PostgreSQL; no se almacenan archivos binarios ni Base64 en la base relacional.
- El chat se modela como conversaciones privadas y mensajes autorizados por participante.
- Las notificaciones y la auditoría se mantienen como registros persistentes y trazables.

### Limitaciones actuales

- El esquema se prepara y documenta, pero no se ejecuta en un proyecto Supabase real.
- No se verifican políticas RLS definitivas ni permisos de producción en un entorno activo.
- No se realiza un despliegue real ni se connecta a Vercel.
- La preparación es técnica y documental, no un estado de producción validado.

### Verificación final de esta fase

- Los archivos SQL y la documentación se han generado en el repositorio.
- La estructura del proyecto permanece sin romper las rutas ni la compilación del frontend.
- Las validaciones del proyecto que se pidieron para esta fase se ejecutarán y documentarán en la sesión actual antes de cerrar la entrega.

**Estado final de la FASE 11:** completada como preparación documental y estructural del backend. El proyecto queda listo para iniciar la integración real con Supabase y la implementación del backend operativo, sin comenzar la construcción completa del mismo en esta fase.

## FASE 12 — Validación de base de datos, migraciones y seguridad

### Alcance y cambios

- Se verificó el orden de las tres migraciones oficiales y se compararon estáticamente sus 32 tablas con Drizzle: nombres/columnas, tipos normalizados, 63 relaciones FK y reglas de borrado, 35 índices y restricciones `CHECK`.
- Se reemplazó el consolidado SQL desactualizado por la secuencia exacta de las migraciones, con marcadores por archivo y verificación de cada sección contra su fuente.
- Las migraciones definen RLS para las tablas `public` y políticas y grants explícitos. Se añadieron privilegios por defecto restrictivos para objetos creados por `postgres`; la configuración local deja de exponer automáticamente nuevas tablas. La inspección local confirmó RLS efectiva en las tablas públicas y en las tablas administradas comprobadas.
- Se reemplazó la llamada `pg_catalog.substring(topic FROM 14)` por `pg_catalog.split_part(topic, ':', 2)` en la migración oficial, conservando la validación del formato antes del cast a UUID; el consolidado se regeneró desde las migraciones.
- Tras el error `must be owner of table objects`, se retiró `ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY`; también se quitó la activación equivalente de `realtime.messages`. Se conservaron las cinco políticas `CREATE POLICY` y no se cambiaron propietarios ni membresías de roles Supabase administrados.
- La prueba de perfil encontró que el `REVOKE UPDATE ON public.usuarios` posterior anulaba el grant por columna. El grant de actualización de campos no sensibles se movió después del `REVOKE`; el usuario pudo cambiar su teléfono por PostgREST y el cambio directo de `rol_id` siguió denegado. El SQL consolidado se regeneró y las tres migraciones se volvieron a aplicar localmente.
- Se corrigió la recursión de la política de actualización de perfiles; la escritura de `rol_id` no está concedida directamente.
- Se serializaron los cambios de rol/estado para proteger el último superadministrador ante solicitudes concurrentes y se bloquea la sesión durante el registro de asistencia.
- Se sincronizaron Drizzle y SQL en un índice de docente de cursos y la regla de moneda/precio de secciones. Drizzle Kit ahora exporta a un directorio de borradores y Supabase conserva el historial aplicado oficial.
- El límite global de Storage quedó en 50 MiB y los siete buckets tienen tamaños y listas MIME específicos en `supabase/config.toml`. La migración 003 conserva las políticas, pero ya no escribe en `storage.buckets` ni altera privilegios de `storage.objects`; `scripts/provision-storage-buckets.ts` compara y crea únicamente buckets faltantes en un entorno local explícito.
- La Edge Function `validate-private-file` verifica JWT/propiedad, autorización de carga pendiente, tamaño, MIME, extensión y firmas de contenido antes de activar; el contenido inválido queda `quarantined` y se elimina mediante Storage API. Es validación básica, no antivirus.
- La validación local comprobó tamaño bajo el límite y exactamente 50 MiB aceptados en `documents`; 50 MiB + 1 byte y MIME no permitido rechazados; PDF falso rechazado (`422`), puesto en cuarentena y eliminado por API; `pending` restringido; archivo válido activado y descargable solo por el propietario; borrado `active` denegado (aunque la API devolvió `200 []`, el objeto persistió) y borrado propio `pending` confirmado mediante consulta posterior por API.
- Los siete buckets permanecen privados. La reducción de ocho propuestas de FASE 7 a siete buckets se justifica al compartir `documents` para documentos estudiantiles y administrativos con categorías separadas.
- Las cargas de las pantallas frontend siguen siendo demos, sin persistencia. El helper cliente valida solo extensión/MIME declarado/tamaño para UX; la Edge Function es la comprobación servidor probada. Las firmas no validan por completo la estructura del archivo ni reemplazan un análisis antimalware.

### Archivos creados y modificados en FASE 12

- **Creado:** [VALIDACION_BASE_DATOS_Y_RLS.md](./VALIDACION_BASE_DATOS_Y_RLS.md).
- **Modificados:** las tres migraciones oficiales, `supabase/sql/supabase_setup.sql`, `supabase/config.toml`, `supabase/functions/validate-private-file/index.ts`, `src/lib/storage/file-policy.ts`, formularios/componentes demo de Storage, `tsconfig.json` (excluye las Edge Functions Deno del tipo de proyecto Next.js), `drizzle.config.ts`, `src/lib/db/schema/tables.ts`, [ARCHIVOS_STORAGE_Y_MATERIALES.md](./ARCHIVOS_STORAGE_Y_MATERIALES.md), [VALIDACION_BASE_DATOS_Y_RLS.md](./VALIDACION_BASE_DATOS_Y_RLS.md), [DATABASE_DOCUMENTATION.md](./DATABASE_DOCUMENTATION.md), [CONTEXTO_PROYECTO_BACKEND.md](./CONTEXTO_PROYECTO_BACKEND.md) y este seguimiento.
- **Eliminados:** ninguno.
- **Dependencias:** ninguna instalada o actualizada en esta fase.

### Verificaciones y limitaciones

- `npm.cmd run lint`: correcto.
- `npx.cmd tsc --noEmit`: correcto.
- `npm.cmd run build`: correcto en Next.js 16.4.4.
- `git diff --check`: correcto; solo se mostraron avisos de conversión de LF/CRLF de Git.
- El 2026-11-02 se confirmó `linked_project: null`, ningún contenedor/volumen Supabase previo y Docker local disponible. En la repetición final se confirmó que no había usuarios Auth, filas de aplicación ni objetos Storage antes del reset; el proyecto local no tenía metadatos de vínculo (`supabase/.temp/project-ref` ausente). El reset explícito `supabase db reset --local` terminó correctamente y aplicó las tres migraciones en orden. No se usaron credenciales remotas.
- La consulta local confirmó RLS en las 32 tablas públicas y en ambas tablas administradas; se crearon las políticas existentes de Storage y Realtime. Los siete buckets son privados y muestran límites MIME/tamaño efectivos. Los dueños siguen siendo `supabase_storage_admin` y `supabase_realtime_admin`.
- Se verificó `can_join_conversation_channel()` y la extracción UUID. Pruebas SQL transaccionales de Realtime permitieron acceso al participante y denegaron al usuario ajeno y al tópico malformado.
- La matriz funcional por API/JWT cubrió anon, estudiante, docente, administrador y superadministrador en casos seleccionados de usuarios/perfiles, catálogo, reservas, pagos, inscripciones, asistencia, archivos, conversaciones y notificaciones. No cubre todas las tablas/operaciones ni concurrencia; RLS no se declara completamente verificada.
- Storage: los límites y MIME se comprobaron por configuración en los siete buckets; un archivo menor y uno exactamente de 50 MiB en `documents` fueron aceptados, 50 MiB + 1 byte fue rechazado (`400`) y MIME no permitido rechazado (`400`). PDF falso con extensión/MIME válidos fue rechazado por `validate-private-file` (`422`), quedó en `quarantined` y se eliminó por Storage API. Archivo válido pasó de `pending` a `active`; el propietario pudo descargarlo y B/anon no. B no pudo validar archivo ajeno (`403`); un objeto `pending` no fue descargable. La URL firmada del propietario funcionó; no se probó expiración.
- Eliminación: archivo `active` no fue eliminado; pese a `200 []`, la consulta posterior por Storage API confirmó su persistencia. El borrado propio `pending` sí se verificó tras la operación. No se borraron objetos mediante SQL. Los fixtures de prueba se limpiaron mediante API.
- No existe antivirus/escaneo antimalware; la inspección de firma detecta algunos tipos y discrepancias simples, pero no es análisis de seguridad ni validación completa de formatos. Los formularios de carga del frontend son demos y aún no están integrados con el flujo servidor.
- La ACL, las políticas RLS y la propiedad de Storage se revisaron como capas distintas. El propietario de las tablas públicas es `postgres`; los defaults para `postgres` son restrictivos. Se observaron defaults más amplios de `supabase_admin`, que no es el dueño de las tablas de aplicación verificadas. Las 27 funciones `SECURITY DEFINER` inspeccionadas fijan `search_path`; `anon` y `authenticated` no tienen `BYPASSRLS`.
- Se compararon los ocho buckets de diseño FASE 7 con los siete creados localmente. La migración agrupa `student-documents` y `administrative-documents` bajo `documents`, y los otros seis usos se asignan explícitamente a `profiles`, `submissions`, `payments`, `learning-materials`, `media` y `attachments`. No se creó ningún bucket adicional.

### FASE 14 — Preparación y simulación de Storage en Development

- Se mantiene el flujo local existente con URL loopback, límite global explícito y clave administrativa solo en servidor.
- Development exige `SUPABASE_TARGET_ENV=development`, la referencia `rxncsqoyovcwndgguxii`, la URL exacta del proyecto y `SUPABASE_STORAGE_GLOBAL_LIMIT_BYTES=52428800`.
- El modo Development es dry-run por defecto: consulta los siete buckets, muestra faltantes y discrepancias, y no crea, actualiza ni elimina recursos.
- La escritura remota requiere explícitamente `SUPABASE_STORAGE_APPLY=true` y `SUPABASE_STORAGE_CONFIRM=CREATE_BUCKETS_IN_DEVELOPMENT`; no se usa `updateBucket()` y Production se rechaza.
- No se crearon buckets remotos ni se modificaron políticas, migraciones o Production. La creación queda pendiente de autorización independiente.calmente. La migración agrupa `student-documents` y `administrative-documents` bajo `documents`, y los otros seis usos se asignan explícitamente a `profiles`, `submissions`, `payments`, `learning-materials`, `media` y `attachments`. No se creó ningún bucket adicional.
- El acceso de usuario a través de Drizzle sigue sin estrategia contextual RLS probada; `getDb()` no se usa en la aplicación. No debe emplearse para consultas ordinarias de usuario.
- La migración 003 contiene 58 políticas públicas, tres de Storage y dos de Realtime (63 totales); el conteo real no es de 61 políticas públicas. La migración 002 crea 21 tablas. La matriz anon/estudiante/docente/administrador/superadministrador sigue siendo representativa, no exhaustiva. RLS no se declara completamente verificada. La configuración de buckets y la validación solo se comprobaron localmente; para producción se requiere configuración autorizada del Dashboard o Storage API y verificación independiente.
- El provisionador local exige `SUPABASE_TARGET_ENV=local`, rechaza URLs no loopback, requiere el límite global verificado y falla sin modificar buckets cuando detecta una discrepancia. No usa `updateBucket()` ni expone claves privilegiadas.
- Validación aislada posterior: las tres migraciones aplicaron en puertos separados; se confirmaron 32 tablas con RLS, 58 políticas públicas + 3 Storage + 2 Realtime, 63 FK, siete buckets privados y límites/MIME correctos. El provisionador creó un bucket faltante, fue idempotente en la segunda ejecución y rechazó una discrepancia sin sobrescribirla. Storage administrativo funcionó y el acceso anónimo fue rechazado; no se ejecutó una prueba WebSocket completa.

**Estado de la FASE 12:** las tres migraciones y el consolidado están validados en Supabase local; límites/MIME, ciclo pending/active/quarantined, acceso y eliminación se probaron en Storage. RLS por roles/tablas y operaciones de negocio tienen cobertura parcial; faltan pruebas exhaustivas, antimalware y validación profunda de formatos. No se inicia la FASE 13; se espera autorización expresa.

## FASE 14.5 — Limpieza integral del frontend

- Se retiraron los módulos de datos ficticios funcionales y sus imports: cursos, contenido, asistencia, pagos, tareas, quizzes, alumnos, chat y notificaciones.
- Se eliminó el acceso demo, el selector artificial de roles, la contraseña compartida y el fallback de dashboards sin sesión. Las rutas protegidas fallan cerrado y el formulario de login conserva su presentación sin crear sesiones ficticias.
- Los componentes visuales se conservaron y ahora muestran estados de integración, vacío o no disponibilidad. Las acciones que aún no tienen servicio no confirman guardados ni usan temporizadores para simular operaciones.
- Se eliminaron los archivos de datos demo `src/lib/demo-data.ts`, `src/lib/demo-courses.ts`, `src/lib/demo-course-content.ts`, `src/lib/asistencia/demo-asistencia.ts` y `src/lib/auth/demo-accounts.ts`.
- La autenticación real, los servicios de negocio, las pruebas por rol y la conexión de módulos a Supabase permanecen pendientes para la FASE 15.
- Validación: `npm.cmd run lint` (correcto, con avisos de parámetros de compatibilidad sin uso), `npx.cmd tsc --noEmit` (correcto), `npm.cmd run build` (correcto) y `git diff --check` (correcto). No se modificaron migraciones, Supabase, Production, Storage ni Vercel.

## FASE 15 — Integración funcional de Supabase Auth

- Se confirmó una única fuente de identidad: Supabase Auth mediante `@supabase/ssr`, PKCE y cookies SSR.
- Login, logout, recuperación, cambio de contraseña y callback usan operaciones reales de Supabase; no se crean sesiones paralelas ni se guardan tokens manualmente.
- Las rutas protegidas se bloquean también en desarrollo cuando falta la configuración de Supabase. La ausencia de configuración ya no permite continuar hacia un dashboard.
- Se eliminó el último fallback de restablecimiento de contraseña demo. El registro público conserva una pantalla informativa y no ejecuta `signUp()`.
- Los destinos de login y callback se validan como rutas internas para evitar redirecciones externas.
- La autorización por rol, perfiles institucionales e invitaciones administrativas siguen pendientes de la FASE 16; un usuario autenticado permanece en `acceso-pendiente`.
- Validación de esta fase: TypeScript y lint correctos; lint conserva 52 advertencias no bloqueantes heredadas de parámetros de compatibilidad y servicios `unavailable-*`. No se probaron credenciales reales, usuarios remotos ni Production.
