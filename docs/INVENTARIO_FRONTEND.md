# Inventario completo del frontend - EDUKATECH

> Documento de fase 1 generado sin modificar la lógica ni el código de la aplicación. El alcance se limita a revisión del frontend existente, rutas, componentes, formularios, estados y datos de demostración.

> **Actualización FASE 10:** este inventario conserva su alcance histórico, pero sus conclusiones de autenticación y datos se contrastaron con el código actual. Supabase Auth tiene flujos SSR implementados sin verificación remota; los paneles de desarrollo, catálogo, perfiles, métricas y transacciones siguen siendo demostrativos.

## 1. Resumen ejecutivo

El proyecto es una aplicación Next.js 16 con App Router, React 19 y TypeScript. La experiencia está organizada en tres grandes bloques:

- Sitio público para adquisición, promoción y navegación de cursos.
- Flujos de Supabase Auth preparados y navegación de demo local con cuatro perfiles.
- Dashboard por rol con pantallas de gestión académica y operativa.

El proyecto combina:

- UI moderna con Tailwind CSS 4.
- Componentes reutilizables de diseño y formularios.
- Datos de prueba locales y fixtures mockeados.
- Modelado con Drizzle para PostgreSQL; no hay consumidores de `getDb()` ni operaciones de negocio conectadas.

La aplicación sigue siendo principalmente una demo frontend. El código de autenticación Supabase existe, pero no se verificó contra un proyecto remoto y aún no hay perfiles, roles institucionales ni RLS implementados.

## 2. Stack tecnológico observado

### Framework y runtime
- Next.js 16.4.4
- App Router
- React 19.2.8
- TypeScript 5
- Tailwind CSS 4

### Librerías relevantes
- TanStack React Query v5
- React Hook Form
- Zod
- Lucide React
- date-fns
- next-themes
- shadcn/ui base components
- Drizzle ORM + postgres

### Fuentes y layout
- Inter cargada con `next/font/google`
- Layout global y proveedores de tema/query en `src/app/layout.tsx`

## 3. Estructura general del frontend

### Directorios principales
- `src/app` para páginas y layouts
- `src/components` para UI y módulos funcionales
- `src/lib` para datos demo, mocks, helpers y esquema DB
- `public/img` para assets visuales

### Rutas agrupadas por Next.js
- `(public)`
- `(auth)`
- `(dashboard)`

Los grupos de rutas no forman parte del path final, pero sí estructuran la navegación real del proyecto.

## 4. Inventario de páginas y rutas

### 4.1 Sitio público

| Ruta | Archivo | Descripción |
|---|---|---|
| `/` | `src/app/(public)/page.tsx` | Landing page con Hero, cursos, investigaciones y comunidad. |
| `/cursos` | `src/app/(public)/cursos/page.tsx` | Catálogo público con filtros por nivel, precio, duración y modalidad. |
| `/cursos/[slug]` | `src/app/(public)/cursos/[slug]/page.tsx` | Detalle dinámico del curso. |
| `/profesores/[slug]` | `src/app/(public)/profesores/[slug]/page.tsx` | Perfil público del profesor. |
| `/tienda` | `src/app/(public)/tienda/page.tsx` | Tienda de componentes mecatrónicos, catálogo de productos. |
| `/checkout` | `src/app/(public)/checkout/page.tsx` | Proceso de inscripción/compra con comprobante manual. |
| `/certificados/[code]` | `src/app/(public)/certificados/[code]/page.tsx` | Consulta de certificado por código. |
| `/login` | `src/app/(auth)/login/page.tsx` | Supabase Auth cuando está configurado; navegación demo solo en desarrollo local sin configuración. |
| `/registro` | `src/app/(auth)/registro/page.tsx` | Informa que el alta depende de invitación institucional; no crea cuentas. |
| `/forgot-password` | `src/app/(auth)/forgot-password/page.tsx` | Solicita recuperación a Supabase cuando está configurado; sin verificación remota de correo. |
| `/reset-password` | `src/app/(auth)/reset-password/page.tsx` | Cambia contraseña con Supabase en el flujo real; modo visual local solo en desarrollo sin configuración. |
| `/nosotros` | `src/app/(public)/nosotros/page.tsx` | Página institucional legacy. |
| `/recursos` | `src/app/(public)/recursos/page.tsx` | Página de recursos legacy. |

### 4.2 Autenticación

| Ruta | Archivo | Estado |
|---|---|---|
| `/login` | `src/app/(auth)/login/page.tsx` | Usa Supabase Auth cuando está configurado; conserva cuentas de navegación demo solo en desarrollo local sin configuración. No se validó contra un proyecto Supabase. |
| `/registro` | `src/app/(auth)/registro/page.tsx` | Presenta flujo de inscripción; sin backend real. |
| `/forgot-password` | `src/app/(auth)/forgot-password/page.tsx` | Solicita recuperación a Supabase cuando está configurado; no se verificó entrega de correo. |
| `/reset-password` | `src/app/(auth)/reset-password/page.tsx` | Cambia la contraseña mediante Supabase en el flujo real; conserva una presentación local solo para desarrollo sin configuración. |

### 4.3 Dashboard y paneles por rol

#### Superadmin
- `/superadmin`
- `/superadmin/administradores`
- `/superadmin/roles`
- `/superadmin/notificaciones`

#### Admin
- `/admin`
- `/admin/cursos`
- `/admin/cursos/nuevo`
- `/admin/cursos/[id]`
- `/admin/cursos/[id]/alumnos`
- `/admin/cursos/[id]/asistencia`
- `/admin/cursos/[id]/semanas`
- `/admin/usuarios`
- `/admin/usuarios/[id]`
- `/admin/pagos`
- `/admin/pagos/[id]`
- `/admin/reportes`
- `/admin/configuracion`
- `/admin/notificaciones`

#### Profesor
- `/profesor`
- `/profesor/mis-cursos`
- `/profesor/mis-cursos/[id]`
- `/profesor/mis-cursos/[id]/alumnos`
- `/profesor/mis-cursos/[id]/asistencia`
- `/profesor/mis-cursos/[id]/contenido`
- `/profesor/mis-cursos/[id]/quizzes`
- `/profesor/mis-cursos/[id]/tareas`
- `/profesor/mis-cursos/[id]/tareas/[tareaId]`
- `/profesor/mis-cursos/[id]/tareas/[tareaId]/entregas`
- `/profesor/chat`
- `/profesor/calendario`
- `/profesor/notificaciones`
- `/profesor/perfil`

#### Alumno
- `/alumno`
- `/alumno/mis-cursos`
- `/alumno/mis-cursos/[id]`
- `/alumno/mis-cursos/[id]/asistencia`
- `/alumno/mis-cursos/[id]/clases/[claseId]`
- `/alumno/mis-cursos/[id]/notas`
- `/alumno/mis-cursos/[id]/quizzes`
- `/alumno/mis-cursos/[id]/quizzes/[quizId]`
- `/alumno/mis-cursos/[id]/semanas/[semanaId]`
- `/alumno/mis-cursos/[id]/tareas`
- `/alumno/mis-cursos/[id]/tareas/[tareaId]`
- `/alumno/calendario`
- `/alumno/certificados`
- `/alumno/chat`
- `/alumno/notificaciones`
- `/alumno/perfil`

## 5. Inventario de componentes principales

### 5.1 Layout y navegación

| Componente | Archivo | Función |
|---|---|---|
| `Navbar` | `src/components/layout/navbar.tsx` | Menú principal del sitio público con enlaces, mobile menu y CTA. |
| `Sidebar` | `src/components/layout/sidebar.tsx` | Menú lateral de dashboards según rol. |
| `DashboardTopbar` | `src/components/layout/sidebar.tsx` | Topbar del dashboard con identidad del rol, notificaciones y menú móvil. |
| `Footer` | `src/components/layout/footer.tsx` | Footer del sitio público. |
| `QueryProvider` | `src/components/layout/query-provider.tsx` | Proveedor de React Query global. |

### 5.2 Público

| Componente | Archivo | Función |
|---|---|---|
| `Hero` | `src/components/public/hero.tsx` | Carrusel de fondos y CTA principal. |
| `BenefitsBar` | `src/components/public/benefits-bar.tsx` | Indicadores promocionales. |
| `CoursesSection` | `src/components/public/courses-section.tsx` | Sección de cursos de la home. |
| `ResearchSection` | `src/components/public/research-section.tsx` | Bloque de investigación/proyectos. |
| `CommunitySection` | `src/components/public/community-section.tsx` | Bloque de comunidad. |

### 5.3 Shared / Reutilizables

| Componente | Archivo | Función |
|---|---|---|
| `CourseCatalog` | `src/components/shared/course-catalog.tsx` | Catálogo con búsqueda y filtros. |
| `TeacherCourseHeader` | `src/components/shared/teacher-course-header.tsx` | Encabezado de curso para profesor con tabs. |
| `StudentCourseHeader` | `src/components/shared/student-course-header.tsx` | Encabezado de curso para alumno con tabs. |
| `AdminCourseHeader` | `src/components/shared/admin-course-header.tsx` | Encabezado de curso para admin con tabs. |
| `PageHeader` | `src/components/shared/page-header.tsx` | Encabezado básico de páginas. |
| `StatCard` | `src/components/shared/stat-card.tsx` | Tarjeta de métricas. |
| `EmptyState` | `src/components/shared/empty-state.tsx` | Estado vacío de secciones. |
| `DemoChat` | `src/components/shared/demo-chat.tsx` | Chat local de demostración con ejemplos 1:1; no persiste mensajes ni carga adjuntos. |
| `DemoCalendar` | `src/components/shared/demo-calendar.tsx` | Calendario de actividades. |
| `DemoNotifications` | `src/components/shared/demo-notifications.tsx` | Notificaciones de demo. |
| `DemoCourseContentStudio` | `src/components/shared/demo-course-content-studio.tsx` | Studio de contenido. |
| `DemoLessonViewer` | `src/components/shared/demo-lesson-viewer.tsx` | Reproductor/visor de clases. |
| `DemoStudentProgress` | `src/components/shared/demo-student-progress.tsx` | Progreso de alumnos. |
| `DemoCreateSection` | `src/components/shared/demo-create-section.tsx` | Creación de secciones. |
| `DemoContentManager` | `src/components/shared/demo-content-manager.tsx` | Gestión demo de contenido. |
| `PrintCertificateButton` | `src/components/shared/print-certificate-button.tsx` | Botón para imprimir certificado. |
| `PaymentReviewActions` | `src/components/shared/payment-review-actions.tsx` | Acciones de revisión pagos. |
| `AdminUsersManager` | `src/components/shared/admin-users-manager.tsx` | Gestión de usuarios de admin. |
| `DemoCourseEnrollments` | `src/components/shared/demo-course-enrollments.tsx` | Inscripciones demo. |
| `DemoGradingQueue` | `src/components/shared/demo-grading-queue.tsx` | Cola de calificaciones demo. |

### 5.4 Formularios

| Formulario | Archivo | Función |
|---|---|---|
| `DemoCheckoutForm` | `src/components/forms/demo-checkout-form.tsx` | Compra/inscripción con método Yape/Plin y comprobante. |
| `DemoResetPasswordForm` | `src/components/forms/demo-reset-password-form.tsx` | Cambio local de contraseña demo. |
| `DemoCourseEditor` | `src/components/forms/demo-course-editor.tsx` | Crear/editar curso. |
| `DemoTaskBuilder` | `src/components/forms/demo-task-builder.tsx` | Crear tareas. |
| `DemoQuizBuilder` | `src/components/forms/demo-quiz-builder.tsx` | Crear quizzes. |
| `DemoQuiz` | `src/components/forms/demo-quiz.tsx` | Resolver quiz visual. |
| `DemoAssignmentSubmission` | `src/components/forms/demo-assignment-submission.tsx` | Entrega de tareas. |
| `DemoProfileForm` | `src/components/forms/demo-profile-form.tsx` | Perfil del usuario. |
| `DemoAdminUserEditor` | `src/components/forms/demo-admin-user-editor.tsx` | Edición de usuarios admin. |
| `DemoSiteSettings` | `src/components/forms/demo-site-settings.tsx` | Configuración institucional. |
| `DemoPageEditor` | `src/components/forms/demo-page-editor.tsx` | Edición demo de páginas. |

### 5.5 Asistencia (módulo de negocio destacado)

| Componente | Archivo | Función |
|---|---|---|
| `AttendanceManager` | `src/components/asistencia/attendance-manager.tsx` | Tomar lista por clase, filtros por estado/modalidad, guardar y exportar. |
| `StudentAttendanceView` | `src/components/asistencia/student-attendance-view.tsx` | Vista del alumno con historial, resumen y selección de modalidad. |
| `AttendanceSummary` | `src/components/asistencia/attendance-summary.tsx` | Resumen widget para dashboards. |
| `ModalitySelector` | `src/components/asistencia/modality-selector.tsx` | Selector visual de modalidad virtual/presencial. |

### 5.6 UI base shadcn

Se observa la infraestructura de componentes base en `src/components/ui`:
- `avatar`, `badge`, `button`, `calendar`, `card`, `checkbox`, `dialog`, `dropdown-menu`, `input`, `label`, `popover`, `progress`, `scroll-area`, `select`, `separator`, `sheet`, `skeleton`, `switch`, `table`, `tabs`, `textarea`, `tooltip`

## 6. Funcionalidades por módulo

### 6.1 Módulo público

#### Home / landing
- Hero con carrusel automático de fondos.
- CTA principal hacia cursos.
- Sección de cursos destacados.
- Sección de investigación/proyectos.
- Sección comunitaria.

#### Catálogo de cursos
- Búsqueda por texto.
- Filtros por nivel, precio, duración y modalidad.
- URL con parámetro `modalidad` para navegaciones directas.
- Cards con información de curso, instructor, duración y botón de detalle.

#### Detalle de curso
- Información general del curso.
- Descripción y datos de instructor.
- CTA de inscripción o compra.
- Enlace de checkout con curso preseleccionado.

#### Perfil de profesor
- Vista pública del profesor y datos de perfil.
- Información de especialidad/currículum mockeado.

#### Checkout
- Formulario con datos del alumno.
- Selección de Yape / Plin.
- Carga local de voucher.
- Validación de tipo y tamaño de archivo.
- Confirmación final de demo.

#### Certificados
- Búsqueda por código de certificado.
- Vista de comprobación simulada.

### 6.2 Módulo de autenticación

- Login real mediante Supabase Auth/Server Actions cuando está configurado; cuatro cuentas demo limitadas a desarrollo local sin configuración.
- Supabase SSR mantiene la sesión en cookies y `src/proxy.ts` renueva la sesión y aplica una comprobación optimista.
- Los paneles con Supabase configurado permanecen bloqueados hasta completar la fuente de perfiles/roles y permisos; no se validó la integración con credenciales remotas.
- Recuperación y cambio de contraseña usan Supabase cuando está configurado; las vistas demo locales no representan una cuenta autenticada.

### 6.3 Dashboard de superadmin

- Resumen de plataforma.
- Gestión de administradores.
- Roles y permisos.
- Estado de la plataforma y seguridad demo.

### 6.4 Dashboard de admin

- Resumen general de KPI del negocio.
- Acceso a cursos, usuarios, pagos, reportes y configuración.
- “Crear curso” CTA.
- Estado de pagos pendientes y actividad reciente.

### 6.5 Dashboard de profesor

- Resumen docente.
- Cursos a cargo.
- Alumnos y seguimiento.
- Revisión de entregas/calificaciones.
- Gestión de contenido, semanas y clases.
- Acciones de asistencia por sección y clase.
- Chat y calendario.

### 6.6 Dashboard de alumno

- Resumen de progreso.
- Cursos activos.
- Tareas y fechas límite.
- Quizzes e intentos.
- Notas y progreso.
- Asistencia por clase y modalidad.
- Chat, calendario, perfil, certificados.

### 6.7 Módulo de asistencia

La app incluye un flujo completo de asistencia demo:

- Profesor puede marcar asistencia por clase.
- Alumno puede consultar su historial y elegir modalidad si la sección lo permite.
- Admin puede ver asistencia por sección.
- Filtros por búsqueda, estado, modalidad y “sin registro”.
- Cambios simulados con respuestas locales y toast-like mensajes.

## 7. Datos que maneja la aplicación

### 7.1 Datos demo principales
Archivo: `src/lib/demo-data.ts`

- `demoCoursesList`
- `DemoCourseInfo`
- `demoAssignments`
- `DemoAssignment`
- `demoQuizzes`
- `DemoQuizInfo`

### 7.2 Datos de contenido del curso
Archivo: `src/lib/demo-course-content.ts`

- Contenido educativo del curso.
- Lecciones, semanas y estructura demo.

### 7.3 Datos de asistencia
Archivo: `src/lib/asistencia/demo-asistencia.ts`

- Secciones demo.
- Clases por sección.
- Estados de asistencia.
- Preferencias de modalidad.
- Resumen de alumnos y grupos.

### 7.4 Datos de navegación y role identity
- El flujo demo local usa `sessionStorage` para mantener navegación por rol; no es la fuente de verdad ni un mecanismo de autenticación de producción.
- Las sesiones de Supabase usan cookies SSR; los perfiles/roles de PostgreSQL y sus políticas RLS aún están pendientes de implementación.
- El `Sidebar` calcula el rol a partir de la ruta activa.
- Los nombres e identidades demo son hardcodeados en el cliente.

## 8. Relaciones entre módulos

### Flujo principal público
- Landing → Catálogo → Detalle → Checkout → Inscripción demo

### Flujo principal de autenticación
- Login → Dashboard según rol → Panel del rol → subtareas (cursos, asistencia, pagos, usuarios, etc.)

### Flujo de curso
- Curso público → detalle → inscripción → panel del alumno → contenido, tareas, quizzes, notas, asistencia

### Flujo de profesor
- Dashboard → cursos → contenido → tareas → entregas → calificaciones → asistencia

### Flujo de admin
- Dashboard → cursos/usuarios/pagos → gestión operativa → reportes/configuración

### Flujo de atención al estudiante
- curso activo → asistencias → historial → vista de modalidad → próxima clase / fechas límite

## 9. Funcionalidades simuladas o incompletas

Estas funcionalidades aparecen operativas visualmente, pero siguen siendo demo o no persisten en backend real:

- Las cuentas hardcodeadas y `sessionStorage` solo sostienen la navegación demo en desarrollo local sin Supabase; no se ofrecen como autenticación en producción.
- Compra/inscripción con comprobante local y confirmación visual.
- Todo el flujo de admin/profesor/alumno usa datos mockeados.
- Las operaciones académicas, administrativas y de pago aún no tienen persistencia productiva.
- Supabase Auth SSR, gestión de cookies y `src/proxy.ts` están preparados, pero los permisos de perfil/rol/RLS y la validación con proyecto remoto están pendientes.
- No hay conexión productiva verificada para los módulos ni para PostgreSQL/Drizzle.
- Los formularios tienen mensajes de “demo” y no interactúan con un backend.
- Chat y notificaciones funcionan como UI maqueta, no como canal real de comunicación.
- El contacto flotante de WhatsApp se muestra solo en el layout público; abre una conversación externa y no se integra con el chat interno.
- Los archivos adjuntos (voucher, documentos) no se suben a almacenamiento real.

## 10. Archivos examinados para este inventario

### Archivos principales revisados
- `src/app/layout.tsx`
- `src/app/(public)/page.tsx`
- `src/app/(public)/cursos/page.tsx`
- `src/app/(public)/checkout/page.tsx`
- `src/app/(auth)/login/page.tsx`
- `src/app/(auth)/forgot-password/page.tsx`
- `src/app/(auth)/reset-password/page.tsx`
- `src/app/(dashboard)/layout.tsx`
- `src/app/(dashboard)/admin/page.tsx`
- `src/app/(dashboard)/profesor/page.tsx`
- `src/app/(dashboard)/alumno/page.tsx`
- `src/app/(dashboard)/superadmin/page.tsx`
- `src/components/layout/navbar.tsx`
- `src/components/layout/sidebar.tsx`
- `src/components/public/hero.tsx`
- `src/components/shared/course-catalog.tsx`
- `src/components/forms/demo-checkout-form.tsx`
- `src/components/forms/demo-reset-password-form.tsx`
- `src/components/asistencia/attendance-manager.tsx`
- `src/lib/demo-data.ts`
- `src/lib/demo-course-content.ts`
- `src/lib/asistencia/demo-asistencia.ts`
- `src/lib/db/index.ts`
- `src/lib/db/schema/usuarios.ts`
- `src/lib/db/schema/cursos.ts`
- `src/lib/db/schema/tareas.ts`
- `src/lib/db/schema/pagos.ts`
- `src/lib/db/schema/chat.ts`

## 11. Conclusión de la fase 1

La aplicación presenta un frontend amplio y navegación visual por roles, pero las pantallas de negocio siguen siendo de prototipo o demo:

- Los flujos de Supabase Auth están implementados en código, pero no se han probado remotamente; perfiles, roles institucionales y RLS aún no existen.
- No hay persistencia conectada para las operaciones académicas, administrativas, pagos, archivos, chat ni notificaciones.
- No hay almacenamiento real de archivos ni backend de negocio con autorización por recurso.
- Drizzle está configurado para servidor, pero `getDb()` no tiene consumidores.
- Los datos del catálogo, precios, reseñas, perfiles y métricas públicas son ejemplos locales. El layout público ahora presenta un aviso visible y el checkout indica que no procesa pagos.

La aplicación requiere un modelo de permisos, RLS y servicios de datos probados antes de operar con información o transacciones reales. Este inventario no declara la demo lista para producción.

Este inventario queda como referencia base antes de iniciar la siguiente fase.
