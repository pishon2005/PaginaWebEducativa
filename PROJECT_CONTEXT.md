# Proyecto EDUKATECH - Documentación Completa de Contexto

> **Última actualización**: 2026-10-26
> **Versión**: 1.0.0
> **Framework**: Next.js 16.3.8 (App Router) + React 19.2.8 + TypeScript 5 + Tailwind CSS 4

---

## 📋 Resumen del Proyecto

**EDUKATECH Technology Division** - Plataforma educativa en español para cursos virtuales de mecatrónica, programación y tecnología.

### Stack Tecnológico
- **Frontend**: Next.js 16.3.8 (App Router), React 19.2.8, TypeScript 5
- **Styling**: Tailwind CSS 4, tw-animate-css, shadcn/ui components
- **Database**: PostgreSQL + Drizzle ORM + drizzle-kit
- **State Management**: TanStack React Query v5
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Images**: Next.js Image Optimization

---

## 📁 Estructura de Carpetas Completa

```
profe/
├── public/
│   └── img/                    # Imágenes estáticas (fondos, logos, productos)
├── src/
│   ├── app/                    # App Router - Páginas y layouts
│   │   ├── (public)/           # Rutas públicas (layout público)
│   │   │   ├── page.tsx        # Homepage
│   │   │   ├── layout.tsx      # Layout público
│   │   │   ├── cursos/         # Catálogo y detalle de cursos
│   │   │   │   ├── page.tsx    # Catálogo
│   │   │   │   └── [slug]/page.tsx  # Detalle
│   │   │   ├── profesores/     # Perfil público de profesores
│   │   │   │   └── [slug]/page.tsx
│   │   │   ├── tienda/         # 🆕 Tienda de componentes mecatrónicos
│   │   │   │   └── page.tsx
│   │   │   ├── checkout/       # Checkout de cursos
│   │   │   ├── certificados/   # Verificación de certificados
│   │   │   │   └── [code]/page.tsx
│   │   │   ├── login/          # Login
│   │   │   ├── registro/       # Registro
│   │   │   ├── forgot-password/ # Recuperación contraseña
│   │   │   ├── reset-password/ # Restablecer contraseña
│   │   │   └── nosotros/       # Página nosotros (legacy)
│   │   │
│   │   ├── (dashboard)/        # Rutas privadas (layout dashboard)
│   │   │   ├── layout.tsx      # Layout con sidebar
│   │   │   ├── page.tsx        # Dashboard según rol
│   │   │   ├── alumno/         # Dashboard alumno
│   │   │   │   ├── page.tsx
│   │   │   │   ├── calendario/page.tsx
│   │   │   │   ├── certificados/page.tsx
│   │   │   │   ├── chat/page.tsx
│   │   │   │   ├── mis-cursos/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── [id]/page.tsx
│   │   │   │   │   ├── [id]/asistencia/page.tsx  🆕
│   │   │   │   │   ├── [id]/clases/[claseId]/page.tsx
│   │   │   │   │   ├── [id]/notas/page.tsx
│   │   │   │   │   ├── [id]/quizzes/page.tsx
│   │   │   │   │   ├── [id]/quizzes/[quizId]/page.tsx
│   │   │   │   │   ├── [id]/semanas/[semanaId]/page.tsx
│   │   │   │   │   ├── [id]/tareas/page.tsx
│   │   │   │   │   ├── [id]/tareas/[tareaId]/page.tsx
│   │   │   │   ├── notificaciones/page.tsx
│   │   │   │   ├── perfil/page.tsx
│   │   │   ├── profesor/       # Dashboard profesor
│   │   │   │   ├── page.tsx
│   │   │   │   ├── calendario/page.tsx
│   │   │   │   ├── chat/page.tsx
│   │   │   │   ├── mis-cursos/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── [id]/page.tsx
│   │   │   │   │   ├── [id]/alumnos/page.tsx
│   │   │   │   │   ├── [id]/asistencia/page.tsx  🆕
│   │   │   │   │   ├── [id]/contenido/page.tsx
│   │   │   │   │   ├── [id]/quizzes/page.tsx
│   │   │   │   │   ├── [id]/tareas/page.tsx
│   │   │   │   │   ├── [id]/tareas/[tareaId]/page.tsx
│   │   │   │   │   ├── [id]/tareas/[tareaId]/entregas/page.tsx
│   │   │   │   ├── notificaciones/page.tsx
│   │   │   │   ├── perfil/page.tsx
│   │   │   ├── admin/          # Dashboard admin
│   │   │   │   ├── page.tsx
│   │   │   │   ├── configuracion/page.tsx
│   │   │   │   ├── cursos/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── [id]/page.tsx
│   │   │   │   │   ├── [id]/alumnos/page.tsx
│   │   │   │   │   ├── [id]/asistencia/page.tsx  🆕
│   │   │   │   │   ├── [id]/semanas/page.tsx
│   │   │   │   │   ├── nuevo/page.tsx
│   │   │   │   ├── notificaciones/page.tsx
│   │   │   │   ├── pagos/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── [id]/page.tsx
│   │   │   │   ├── reportes/page.tsx
│   │   │   │   ├── usuarios/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── [id]/page.tsx
│   │   │   ├── superadmin/     # Dashboard superadmin
│   │   │   │   ├── page.tsx
│   │   │   │   ├── administradores/page.tsx
│   │   │   │   ├── notificaciones/page.tsx
│   │   │   │   ├── roles/page.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │
│   │   ├── (auth)/             # Rutas de autenticación
│   │   │   ├── layout.tsx
│   │   │   ├── login/page.tsx
│   │   │   ├── registro/page.tsx
│   │   │   ├── forgot-password/page.tsx
│   │   │   ├── reset-password/page.tsx
│   │   │
│   │   ├── globals.css         # Estilos globales + animaciones
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Redirect a home
│   │
│   ├── components/
│   │   ├── ui/                 # Componentes base shadcn/ui (22 componentes)
│   │   ├── layout/             # Navbar, Sidebar, Footer, QueryProvider
│   │   ├── public/             # Componentes públicos (Hero, BenefitsBar, etc.)
│   │   ├── shared/             # Componentes compartidos (headers, cards, demo)
│   │   ├── forms/              # Formularios (demo)
│   │   └── asistencia/         # 🆕 Componentes de asistencia (4 componentes)
│   │
│   ├── lib/
│   │   ├── db/
│   │   │   ├── schema/         # Esquemas Drizzle ORM (7 archivos)
│   │   │   │   ├── usuarios.ts # Usuarios, roles, perfiles profesor
│   │   │   │   ├── cursos.ts   # Cursos, secciones, semanas, clases, materiales
│   │   │   │   ├── tareas.ts   # Tareas, entregas, quizzes, preguntas
│   │   │   │   ├── pagos.ts    # Inscripciones, pagos
│   │   │   │   ├── chat.ts     # Conversaciones, mensajes, foros, notificaciones
│   │   │   │   └── index.ts    # Exports
│   │   │   └── index.ts        # Conexión DB
│   │   │
│   │   ├── asistencia/         # 🆕 Lógica de asistencia (3 archivos)
│   │   │   ├── tipos.ts        # Tipos TypeScript
│   │   │   ├── demo-asistencia.ts # Datos demo
│   │   │   └── index.ts
│   │   │
│   │   ├── demo-data.ts        # Datos demo (cursos, usuarios, tareas, quizzes)
│   │   ├── demo-courses.ts     # Helpers para cursos demo
│   │   ├── demo-course-content.ts # Contenido demo de cursos
│   │   └── utils.ts            # Utilidades (cn, etc.)
│   │
│   ├── hooks/                  # Custom hooks
│   └── types/                  # Tipos globales
│
├── drizzle.config.ts           # Config Drizzle
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── components.json             # Config shadcn/ui
└── database_schema.sql         # Script SQL completo PostgreSQL
```

---

## 🗄️ Esquema de Base de Datos (Drizzle ORM) - Detalle Completo

### Tablas Principales

| Tabla | Descripción | Relaciones Clave |
|-------|-------------|------------------|
| `roles` | Roles: superadmin, admin, profesor, alumno | 1:N → usuarios |
| `usuarios` | Usuarios del sistema | N:1 → roles, 1:1 → perfiles_profesor |
| `perfiles_profesor` | Perfil extendido de profesores | 1:1 → usuarios |
| `cursos` | Plantillas de cursos (info general) | 1:N → secciones |
| `secciones` | Instancias específicas (virtual/presencial/hibrida) | N:1 → cursos, 1:N → semanas, inscripciones |
| `semanas` | Módulos/semanas de una sección | N:1 → secciones, 1:N → clases |
| `clases` | Clases individuales | N:1 → semanas, 1:N → materiales, asistencias |
| `materiales` | Recursos de clase (PDF, videos, links) | N:1 → clases |
| `inscripciones` | Alumno inscrito en sección | N:1 → usuarios, N:1 → secciones |
| `pagos` | Pagos por inscripción | N:1 → usuarios, N:1 → secciones |
| `tareas` | Tareas asignadas | N:1 → cursos, N:1 → semanas |
| `entregas` | Entregas de tareas | N:1 → tareas, N:1 → usuarios |
| `quizzes` | Evaluaciones | N:1 → cursos, N:1 → semanas |
| `quiz_preguntas` | Preguntas de quiz | N:1 → quizzes |
| `quiz_intentos` | Intentos de quiz | N:1 → quizzes, N:1 → usuarios |
| `asistencias` | 🆕 Registro de asistencia | N:1 → usuarios, N:1 → clases |
| `preferencias_modalidad` | 🆕 Elección virtual/presencial | N:1 → usuarios, N:1 → clases |
| `configuracion_asistencia` | 🆕 Config por sección | 1:1 → secciones |
| `conversaciones` | Chat (privado/grupal/curso) | N:1 → cursos |
| `conversacion_participantes` | Participantes de chat | N:M → conversaciones, usuarios |
| `mensajes` | Mensajes de chat | N:1 → conversaciones, N:1 → usuarios |
| `foro_temas` | Temas de foro | N:1 → cursos, N:1 → semanas |
| `foro_respuestas` | Respuestas de foro | N:1 → foro_temas, N:1 → usuarios |
| `notificaciones` | Notificaciones usuario | N:1 → usuarios |

### 🆕 Sistema de Secciones (Nuevo - 2026-10-26)

```
Curso Base (Plantilla)
    │
    ├── Sección 1: Virtual (código: PY-2026-V1)
    │   ├── Profesor: Ana María Campos
    │   ├── Horario: Lun/Mié 19:00-21:00 (Online)
    │   ├── Capacidad: 50
    │   ├── Semanas → Clases → Asistencias
    │
    ├── Sección 2: Presencial (código: PY-2026-P1)
    │   ├── Profesor: Ana María Campos
    │   ├── Horario: Mar/Jue 18:00-20:00
    │   ├── Ubicación: Aula 101
    │   ├── Capacidad: 30
    │
    └── Sección 3: Híbrida (código: PY-2026-H1)
        ├── Profesor: Ana María Campos
        ├── Horario: Viernes 17:00-20:00
        ├── Ubicación: Aula 101
        ├── Capacidad: 35
        ├── Permite elección modalidad: SÍ
```

---

## 🎨 Componentes Clave - Catálogo Completo

### Layout (`components/layout/`)
| Componente | Descripción |
|------------|-------------|
| `Navbar` | Navegación principal + mobile sheet con Sheet |
| `Sidebar` | Navegación dashboard colapsible |
| `Footer` | Footer público con links |
| `QueryProvider` | TanStack Query provider global |

### Público (`components/public/`)
| Componente | Descripción |
|------------|-------------|
| `Hero` | Carrusel automático 6 fondos + chico_fondo sincronizado (solo slide 1) |
| `BenefitsBar` | Barra de beneficios (envío, garantía, devolución, soporte) |
| `CoursesSection` | Sección de cursos en homepage |
| `CommunitySection` | Sección comunidad |
| `ProjectsSection` | Sección proyectos |
| `BenefitsBar` | Barra de beneficios |

### Shared - Dashboard (`components/shared/`)
| Componente | Descripción |
|------------|-------------|
| `TeacherCourseHeader` | Header profesor con tabs (Resumen, Contenido, Tareas, Evaluaciones, **Asistencia**, Alumnos) |
| `StudentCourseHeader` | Header alumno con tabs (Contenido, Tareas, Evaluaciones, **Asistencia**, Notas) |
| `AdminCourseHeader` | Header admin con tabs (Información, Contenido, Alumnos, **Asistencia**) |
| `CourseCatalog` | Catálogo público con filtros |
| `DemoContentManager` | Editor de contenido demo |
| `DemoLessonViewer` | Visor de lecciones demo |
| `DemoStudentProgress` | Progreso alumnos demo |
| `DemoCourseContentStudio` | Studio de contenido curso |
| `DemoCalendar` | Calendario demo |
| `DemoChat` | Chat demo |
| `DemoNotifications` | Notificaciones demo |
| `EmptyState` | Estado vacío reutilizable |
| `PageHeader` | Header de página estándar |
| `StatCard` | Tarjeta de estadística |
| `PrintCertificateButton` | Botón imprimir certificado |

### 🆕 Asistencia (`components/asistencia/`)
| Componente | Descripción |
|------------|-------------|
| `AttendanceManager` | Panel profesor: tomar lista, filtros, marcar todos, observaciones, exportar/importar |
| `StudentAttendanceView` | Vista alumno: historial, filtros, elegir modalidad híbrida, resumen % |
| `AttendanceSummary` | Widget resumen dashboards (próximas/recientes, %) |
| `ModalitySelector` | Selector visual virtual/presencial para alumno |

### Forms (`components/forms/`)
| Componente | Descripción |
|------------|-------------|
| `DemoCourseEditor` | Editor crear/editar curso (tabs: Info, Contenido, Config) |
| `DemoTaskBuilder` | Constructor de tareas |
| `DemoQuizBuilder` | Constructor de quizzes |
| `DemoQuiz` | Visor de quiz interactivo |
| `DemoAssignmentSubmission` | Entrega de tareas |
| `DemoProfileForm` | Formulario perfil |
| `DemoAdminUserEditor` | Editor usuarios admin |
| `DemoCheckoutForm` | Formulario checkout |
| `DemoResetPasswordForm` | Formulario reset password |
| `DemoSiteSettings` | Configuración sitio |

### UI Base (`components/ui/`) - 22 componentes shadcn
`avatar, badge, button, calendar, card, checkbox, dialog, dropdown-menu, input, label, popover, progress, scroll-area, select, separator, sheet, skeleton, switch, table, tabs, textarea, tooltip`

---

## 🛣️ Rutas Principales - Mapa Completo

### Públicas (`(public)/`)
| Ruta | Componente | Descripción |
|------|------------|-------------|
| `/` | `page.tsx` | Homepage con Hero + catálogo |
| `/cursos` | `cursos/page.tsx` | Catálogo con filtros |
| `/cursos/[slug]` | `cursos/[slug]/page.tsx` | Detalle curso |
| `/profesores/[slug]` | `profesores/[slug]/page.tsx` | Perfil público profesor |
| `/tienda` | `tienda/page.tsx` | 🆕 Tienda mecatrónica |
| `/checkout` | `checkout/page.tsx` | Checkout cursos |
| `/certificados/[code]` | `certificados/[code]/page.tsx` | Verificar certificado |
| `/login` | `(auth)/login/page.tsx` | Login |
| `/registro` | `(auth)/registro/page.tsx` | Registro |
| `/forgot-password` | `(auth)/forgot-password/page.tsx` | Recuperar password |
| `/reset-password` | `(auth)/reset-password/page.tsx` | Reset password |
| `/nosotros` | `nosotros/page.tsx` | Página nosotros (legacy) |
| `/recursos` | `recursos/page.tsx` | Recursos (legacy) |
| `/profesores/[slug]` | `profesores/[slug]/page.tsx` | Perfil profesor |

### Dashboard - Alumno (`(dashboard)/alumno/`)
| Ruta | Descripción |
|------|-------------|
| `/alumno` | Dashboard con widget asistencia |
| `/alumno/mis-cursos` | Lista cursos inscritos |
| `/alumno/mis-cursos/[id]` | Detalle curso |
| `/alumno/mis-cursos/[id]/asistencia` | 🆕 Ver asistencia + elegir modalidad |
| `/alumno/mis-cursos/[id]/clases/[claseId]` | Visor lección |
| `/alumno/mis-cursos/[id]/tareas` | Lista tareas |
| `/alumno/mis-cursos/[id]/tareas/[tareaId]` | Detalle tarea + entrega |
| `/alumno/mis-cursos/[id]/quizzes` | Lista quizzes |
| `/alumno/mis-cursos/[id]/quizzes/[quizId]` | Tomar quiz |
| `/alumno/mis-cursos/[id]/notas` | Ver notas |
| `/alumno/mis-cursos/[id]/semanas/[semanaId]/page.tsx` | Detalle semana |
| `/alumno/calendario` | Calendario |
| `/alumno/certificados` | Certificados |
| `/alumno/chat` | Chat |
| `/alumno/notificaciones` | Notificaciones |
| `/alumno/perfil` | Perfil |

### Dashboard - Profesor (`(dashboard)/profesor/`)
| Ruta | Descripción |
|------|-------------|
| `/profesor` | Dashboard con widget próxima clase |
| `/profesor/mis-cursos` | Lista cursos a cargo |
| `/profesor/mis-cursos/[id]` | Detalle curso |
| `/profesor/mis-cursos/[id]/asistencia` | 🆕 Tomar lista (selector sección + clase) |
| `/profesor/mis-cursos/[id]/contenido` | Editor contenido |
| `/profesor/mis-cursos/[id]/tareas` | Gestión tareas |
| `/profesor/mis-cursos/[id]/tareas/[tareaId]` | Detalle tarea |
| `/profesor/mis-cursos/[id]/tareas/[tareaId]/entregas` | Revisar entregas |
| `/profesor/mis-cursos/[id]/quizzes` | Gestión quizzes |
| `/profesor/mis-cursos/[id]/alumnos` | Lista alumnos + progreso |
| `/profesor/calendario` | Calendario |
| `/profesor/chat` | Chat |
| `/profesor/notificaciones` | Notificaciones |
| `/profesor/perfil` | Perfil |

### Dashboard - Admin (`(dashboard)/admin/`)
| Ruta | Descripción |
|------|-------------|
| `/admin` | Dashboard métricas |
| `/admin/cursos` | Lista cursos |
| `/admin/cursos/nuevo` | Crear curso |
| `/admin/cursos/[id]` | Editar curso |
| `/admin/cursos/[id]/asistencia` | 🆕 Ver asistencia por sección/clase |
| `/admin/cursos/[id]/alumnos` | Alumnos inscritos |
| `/admin/cursos/[id]/semanas` | Gestión semanas |
| `/admin/usuarios` | Gestión usuarios |
| `/admin/usuarios/[id]` | Detalle usuario |
| `/admin/pagos` | Lista pagos |
| `/admin/pagos/[id]` | Detalle + aprobar/rechazar |
| `/admin/reportes` | Reportes |
| `/admin/configuracion` | Configuración |

### Superadmin (`(dashboard)/superadmin/`)
| Ruta | Descripción |
|------|-------------|
| `/superadmin` | Dashboard |
| `/superadmin/administradores` | Gestión admins |
| `/superadmin/roles` | Gestión roles |
| `/superadmin/notificaciones` | Notificaciones |

---

## 🔄 FASES DE DESARROLLO - Historial de Eventos Importantes

### FASE 0: Fundación (Base del Proyecto)
- ✅ Setup Next.js 16 + TypeScript + Tailwind 4
- ✅ Configuración Drizzle ORM + PostgreSQL
- ✅ Setup shadcn/ui + Tailwind 4
- ✅ Esquema base: usuarios, roles, cursos, tareas, pagos, chat
- ✅ Datos demo en `lib/demo-data.ts`

### FASE 1: Hero Carousel (2026-10-25)
**Archivos**: `components/public/hero.tsx`, `app/globals.css`
- ✅ Carrusel automático 6 fondos (5s c/u, fade 700ms)
- ✅ Imagen `chico_fondo` **solo en Fondo1**, transiciona sincronizado
- ✅ Texto "De cero a proyectos reales" **100% fijo**
- ✅ Sin controles (puntos, flechas, play/pause)
- ✅ `loading="eager"` en todas las imágenes (LCP optimizado)
- ✅ `prefers-reduced-motion` support
- **Config**: `AUTO_PLAY_INTERVAL = 5000`, transición 700ms ease-in-out

### FASE 2: Navbar & Navegación (2026-10-26)
**Archivos**: `components/layout/navbar.tsx`
- ✅ Items: Inicio, Cursos, Proyectos, Investigaciones, **Tienda**, Contacto
- ✅ Eliminados: Recursos, Nosotros (ahora en Contacto)
- ✅ Mobile quick links actualizados con iconos Cpu
- ✅ Imports limpios (eliminados FlaskConical, Users)

### FASE 3: Tienda Mecatrónica (2026-10-26)
**Archivos**: `app/(public)/tienda/page.tsx`
- ✅ Nueva ruta `/tienda` agregada al navbar
- ✅ 8 productos mecatrónicos demo con imágenes placeholder
- ✅ Categorías filtrables (tabs): Todos, Kits, Microcontroladores, Robótica, Sensores, Fabricación, Instrumentos, Herramientas
- ✅ Grid responsive 1/2/4 columnas
- ✅ Badges: "Más vendido", "Nuevo", "Oferta", "Agotado"
- ✅ Precios con tachado, stock, botón añadir deshabilitado si agotado
- ✅ Beneficios (envío >S/500, garantía 1 año, devolución 30 días, soporte)
- ✅ CTA final a contacto

### FASE 6: Actualización Cursos Homepage (2026-10-26)
**Archivos**: `src/components/public/courses-section.tsx`, `src/app/(public)/page.tsx`
- ✅ 4 cursos reemplazados por nuevos tipos de curso:
  - **Curso de nivelación** (Virtual, 8 clases, NIVELACIÓN, libro.webp, emerald→teal→green)
  - **Curso de taller** (Presencial, 12 clases, TALLER, tuerca.webp, amber→orange→amber)
  - **Curso libre** (Virtual, 6 clases, LIBRE, libro.webp, violet→purple→pink)
  - **Curso aplicativo** (Híbrida, 10 clases, APLICATIVO, icono_laptop.webp, blue→indigo→cyan)
- ✅ Eliminada dependencia de `demoCoursesList` en homepage
- ✅ Cursos hardcodeados localmente en `page.tsx` y `courses-section.tsx`
- ✅ Imágenes existentes reutilizadas: libro.webp, tuerca.webp, icono_laptop.webp
- ✅ Build exitoso - 38 rutas generadas

### FASE 4: Sistema de Asistencia Completo (2026-10-26)
**Archivos**: `lib/asistencia/`, `components/asistencia/`, `app/(dashboard)/*/asistencia/`

#### 4.1 Esquema DB (`lib/db/schema/cursos.ts` - actualizado)
- ✅ `asistencias` - Registro asistencia por clase
- ✅ `preferencias_modalidad` - Elección virtual/presencial por alumno/clase
- ✅ `configuracion_asistencia` - Config por sección (permite elección, horas límite, auto-registro QR)

#### 4.2 Tipos y Datos Demo (`lib/asistencia/`)
- ✅ `tipos.ts` - Tipos completos: `ModalidadClase`, `EstadoAsistencia`, `AsistenciaClaseProfesor`, `AsistenciaAlumnoSeccion`, etc.
- ✅ `demo-asistencia.ts` - 6 secciones demo, 36 clases, asistencias demo, preferencias demo

#### 4.3 Componentes UI (`components/asistencia/`)
- ✅ `AttendanceManager` - Panel profesor: tomar lista, filtros, marcar todos, observaciones, exportar/importar CSV
- ✅ `StudentAttendanceView` - Vista alumno: historial, filtros, elegir modalidad híbrida, resumen %
- ✅ `AttendanceSummary` - Widget resumen dashboards (próximas/recientes, %)
- ✅ `ModalitySelector` - Selector visual virtual/presencial para alumno

#### 4.4 Integración en Rutas
- ✅ `/profesor/mis-cursos/[id]/asistencia` - Selector sección → clase → tomar lista
- ✅ `/alumno/mis-cursos/[id]/asistencia` - Selector sección → historial + elegir modalidad
- ✅ `/admin/cursos/[id]/asistencia` - Vista admin por sección/clase
- ✅ Tabs "Asistencia" agregados en headers: profesor, alumno, admin
- ✅ Widget `AttendanceSummary` en dashboards profesor y alumno

### FASE 5: Sistema de Secciones (2026-10-26)
**Archivos**: `lib/db/schema/cursos.ts` (reescrito completo)
- ✅ `cursos` = plantilla base (info general, precio, imagen)
- ✅ `secciones` = instancias con modalidad, profesor, horario, ubicación, fechas
- ✅ `semanas` pertenecen a sección (no a curso base)
- ✅ `clases` pertenecen a semana de sección
- ✅ `inscripciones` a nivel de sección (no curso base)
- ✅ `asistencias` por clase de sección
- ✅ 3 secciones demo para "Fundamentos de Python": Virtual, Presencial, Híbrida

---

## 🎯 Rutas de Asistencia - Flujo Completo

### Profesor: Tomar Lista
```
/profesor/mis-cursos/[id]/asistencia?seccionId=sec-1-h&claseId=cl-1h-1-1
  1. Selector sección (dropdown) → navega con router.push
  2. Selector clase (dropdown) → navega con router.push
  3. AttendanceManager: tabla alumnos con botones rápidos (P/A/T/J)
  3. Expandir fila → cambiar estado, modalidad, observaciones
  4. Guardar → simula API 500ms → toast éxito
```

### Alumno: Ver Asistencia
```
/alumno/mis-cursos/[id]/asistencia?seccionId=sec-1-h
  1. Selector sección (dropdown en header) → navega con router.push
  2. StudentAttendanceView: resumen %, próximas clases, historial
  3. Filtros: estado, modalidad, vista lista/calendario
  3. Expandir clase → ver detalle + elegir modalidad (si híbrida y permitido)
  4. Cambiar modalidad → simula API 500ms → toast éxito
```

### Admin: Ver Asistencia
```
/admin/cursos/[id]/asistencia?seccionId=sec-1-h&claseId=cl-1h-1-1
  1. Selector sección → selector clase (mismo patrón profesor)
  2. AttendanceManager en modo lectura/escritura
```

---

## 🛠️ Configuración y Scripts

### package.json Scripts
```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint"
}
```

### Variables de Entorno Requeridas (`.env.local`)
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/edukatech"
```

### Drizzle Commands
```bash
npx drizzle-kit generate    # Generar migraciones
npx drizzle-kit migrate     # Aplicar migraciones
npx drizzle-kit studio      # UI visual (opcional)
```

### Build & Lint
```bash
npm run build   # Build producción (type-check incluido)
npm run lint    # ESLint
npm run dev     # Desarrollo (Turbopack)
```

---

## 📝 Convenciones y Patrones

### Componentes
- **Client Components**: `"use client"` directive al inicio
- **Server Components**: Por defecto (async/await en pages)
- **Naming**: PascalCase para componentes, camelCase para props

### Estilos
- **Tailwind CSS 4** + `cn()` utility (`lib/utils.ts`)
- **Colores**: `neutral-950` (texto), `orange-600` (primary), `neutral-200` (bordes)
- **Animaciones**: Definidas en `globals.css` (slide-in, fade-in, prefers-reduced-motion)

### Tipos
- **TypeScript strict mode** activado
- **Tipos centralizados**: `lib/asistencia/tipos.ts`, `lib/db/schema/index.ts`

### Base de Datos
- **UUIDs** como PK con `defaultRandom()`
- **Timestamps**: `createdAt`, `updatedAt` con `defaultNow()`
- **Foreign Keys**: `onDelete: "cascade"` o `"set null"` según caso
- **Índices únicos**: `unique()` en emails, códigos, combinaciones

---

## 🔗 Archivos de Referencia Rápida

| Archivo | Propósito |
|---------|-----------|
| `database_schema.sql` | Script SQL completo PostgreSQL |
| `drizzle.config.ts` | Config Drizzle ORM |
| `src/lib/db/schema/index.ts` | Exports de esquemas |
| `src/lib/asistencia/tipos.ts` | Tipos TypeScript asistencia |
| `src/lib/asistencia/demo-asistencia.ts` | Datos demo asistencia |
| `src/components/public/hero.tsx` | Hero carousel |
| `src/components/layout/navbar.tsx` | Navegación principal |
| `src/app/(public)/tienda/page.tsx` | Página tienda |
| `src/app/(dashboard)/profesor/mis-cursos/[id]/asistencia/page.tsx` | Tomar lista |
| `src/app/(dashboard)/alumno/mis-cursos/[id]/asistencia/page.tsx` | Ver asistencia alumno |
| `src/app/(dashboard)/admin/cursos/[id]/asistencia/page.tsx` | Admin asistencia |

---

## 🎯 Próximos Pasos Sugeridos (Roadmap)

### Fase 6: Gestión de Secciones (Admin/Profesor)
- [ ] CRUD secciones en `/admin/cursos/[id]/secciones`
- [ ] Asignar profesor, horario, modalidad, capacidad
- [ ] Clonar secciones entre cursos

### Fase 7: Catálogo Público con Secciones
- [ ] `/cursos/[slug]` muestra secciones disponibles (badges virtual/presencial/hibrida)
- [ ] Filtros por modalidad, horario, profesor
- [ ] Inscripción a sección específica

### Fase 8: Checkout/Inscripción a Sección
- [ ] Selección de sección en `/checkout`
- [ ] Validar capacidad, fechas, prerrequisitos
- [ ] Integración pagos (Yape/Plin) real

### Fase 9: APIs Reales + Autenticación Real
- [ ] Reemplazar demo data con endpoints API
- [ ] NextAuth.js o similar para auth real
- [ ] Middleware protección rutas dashboard

### Fase 10: QR/Autoregistro Asistencia
- [ ] Generar QR por clase
- [ ] Endpoint auto-registro alumno
- [ ] Validación geolocalización/tiempo

### Fase 11: Reportes y Analytics
- [ ] Exportar asistencia Excel/PDF
- [ ] Dashboard analytics (asistencia por curso, alumno en riesgo)
- [ ] Alertas automáticas (baja asistencia)

---

## 📌 Notas Críticas para Continuidad

### Hero Carousel - NO TOCAR
- Texto "De cero a proyectos reales" + botones + chico_fondo (slide 1 only) = **FIJOS**
- Solo modificar: array `backgrounds` en `hero.tsx`
- Transición: 700ms ease-in-out, 5s intervalo (`AUTO_PLAY_INTERVAL`)

### Asistencia - Puntos Clave
- Modalidad híbrida: Solo en secciones con `permitirEleccionModalidad: true`
- Chico_fondo: Solo aparece en slide 0 (Fondo1), transiciona con él
- Secciones: Profesor/Alumno/Admin deben seleccionar sección → clase

### Tienda - Placeholders
- Imágenes en `/public/img/` (kit-arduino.webp, raspberry-pi.webp, etc.)
- Categorías en array `categories` en `tienda/page.tsx`
- Productos en array `products` con campos completos

### Base de Datos - Migraciones
```bash
npx drizzle-kit generate  # Generar migraciones
npx drizzle-kit migrate   # Aplicar migraciones
```

---

## 📌 Archivos Creados/Modificados en Esta Sesión (2026-10-26)

### Creados
1. `src/app/(public)/tienda/page.tsx` - Página tienda completa
2. `src/lib/asistencia/tipos.ts` - Tipos TypeScript asistencia
3. `src/lib/asistencia/demo-asistencia.ts` - Datos demo asistencia
3. `src/lib/asistencia/index.ts` - Exports asistencia
4. `src/components/asistencia/attendance-manager.tsx` - Panel profesor
5. `src/components/asistencia/student-attendance-view.tsx` - Vista alumno
6. `src/components/asistencia/attendance-summary.tsx` - Widget resumen
7. `src/components/asistencia/modality-selector.tsx` - Selector modalidad
8. `src/components/asistencia/index.ts` - Exports componentes
9. `PROJECT_CONTEXT.md` - Este documento

### Modificados
1. `src/components/public/hero.tsx` - Hero carousel simplificado + sincronizado
2. `src/components/layout/navbar.tsx` - Navbar actualizado + Tienda
3. `src/components/layout/student-course-header.tsx` - Tab Asistencia
4. `src/components/shared/teacher-course-header.tsx` - Tab Asistencia
5. `src/components/shared/admin-course-header.tsx` - Tab Asistencia
6. `src/lib/db/schema/cursos.ts` - **Reescrito completo** (sistema secciones)
7. `src/lib/db/schema/index.ts` - Removidos inscripciones/pagos exports
8. `src/app/(dashboard)/profesor/mis-cursos/[id]/asistencia/page.tsx` - Nueva ruta
9. `src/app/(dashboard)/alumno/mis-cursos/[id]/asistencia/page.tsx` - Nueva ruta
9. `src/app/(dashboard)/admin/cursos/[id]/asistencia/page.tsx` - Nueva ruta
10. `src/app/(dashboard)/profesor/page.tsx` - Widget próxima clase
10. `src/app/(dashboard)/alumno/page.tsx` - Widget asistencia
11. `src/app/globals.css` - Animaciones carrusel
12. `src/lib/asistencia/demo-asistencia.ts` - Reescrito para secciones
13. `src/lib/asistencia/tipos.ts` - Actualizado para secciones
14. `src/components/public/courses-section.tsx` - **Nuevos 4 modalidades** (nivelación, taller, libre, aplicativo)
15. `src/app/(public)/page.tsx` - **Cursos hardcodeados** (eliminada dependencia demoCoursesList)
16. `src/lib/demo-data.ts` - **Campo modalidadCurso** agregado a cursos demo
17. `src/components/shared/course-catalog.tsx` - **Filtro modalidadCurso** + lectura URL
18. `src/app/(public)/cursos/page.tsx` - **Suspense wrapper** para useSearchParams

---

*Documento generado para mantener contexto completo entre sesiones de desarrollo.*
*Última actualización: 2026-10-26 01:22*
│   │   │   ├── admin/          # Dashboard admin
│   │   │   └── superadmin/     # Dashboard superadmin
│   │   │
│   │   ├── (auth)/             # Rutas de autenticación
│   │   │   └── layout.tsx
│   │   │
│   │   ├── globals.css         # Estilos globales + animaciones
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Redirect a home
│   │
│   ├── components/
│   │   ├── ui/                 # Componentes base shadcn/ui
│   │   ├── layout/             # Navbar, Sidebar, Footer
│   │   ├── public/             # Componentes públicos (Hero, BenefitsBar, etc.)
│   │   ├── shared/             # Componentes compartidos (headers, cards)
│   │   ├── forms/              # Formularios (demo)
│   │   └── asistencia/         # 🆕 Componentes de asistencia
│   │
│   ├── lib/
│   │   ├── db/
│   │   │   ├── schema/         # Esquemas Drizzle ORM
│   │   │   │   ├── usuarios.ts # Usuarios, roles, perfiles profesor
│   │   │   │   ├── cursos.ts   # Cursos, secciones, semanas, clases, materiales
│   │   │   │   ├── tareas.ts   # Tareas, entregas, quizzes, preguntas
│   │   │   │   ├── pagos.ts    # Inscripciones, pagos
│   │   │   │   ├── chat.ts     # Conversaciones, mensajes, foros, notificaciones
│   │   │   │   └── index.ts    # Exports
│   │   │   └── index.ts        # Conexión DB
│   │   │
│   │   ├── asistencia/         # 🆕 Lógica de asistencia
│   │   │   ├── tipos.ts        # Tipos TypeScript
│   │   │   ├── demo-asistencia.ts # Datos demo
│   │   │   └── index.ts
│   │   │
│   │   ├── demo-data.ts        # Datos demo (cursos, usuarios, tareas, quizzes)
│   │   ├── demo-courses.ts     # Helpers para cursos demo
│   │   ├── demo-course-content.ts # Contenido demo de cursos
│   │   └── utils.ts            # Utilidades (cn, etc.)
│   │
│   ├── hooks/                  # Custom hooks
│   └── types/                  # Tipos globales
│
├── drizzle.config.ts           # Config Drizzle
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── components.json             # Config shadcn/ui
└── database_schema.sql         # Script SQL completo PostgreSQL
```

---

## 🗄️ Esquema de Base de Datos (Drizzle ORM)

### Tablas Principales

| Tabla | Descripción | Relaciones |
|-------|-------------|------------|
| `roles` | Roles: superadmin, admin, profesor, alumno | 1:N → usuarios |
| `usuarios` | Usuarios del sistema | N:1 → roles, 1:1 → perfiles_profesor |
| `perfiles_profesor` | Perfil extendido de profesores | 1:1 → usuarios |
| `cursos` | Plantillas de cursos (info general) | 1:N → secciones |
| `secciones` | Instancias específicas (virtual/presencial/hibrida) | N:1 → cursos, 1:N → semanas, inscripciones |
| `semanas` | Módulos/semanas de una sección | N:1 → secciones, 1:N → clases |
| `clases` | Clases individuales | N:1 → semanas, 1:N → materiales, asistencias |
| `materiales` | Recursos de clase (PDF, videos, links) | N:1 → clases |
| `inscripciones` | Alumno inscrito en sección | N:1 → usuarios, N:1 → secciones |
| `pagos` | Pagos por inscripción | N:1 → usuarios, N:1 → secciones |
| `tareas` | Tareas asignadas | N:1 → cursos, N:1 → semanas |
| `entregas` | Entregas de tareas | N:1 → tareas, N:1 → usuarios |
| `quizzes` | Evaluaciones | N:1 → cursos, N:1 → semanas |
| `quiz_preguntas` | Preguntas de quiz | N:1 → quizzes |
| `quiz_intentos` | Intentos de quiz | N:1 → quizzes, N:1 → usuarios |
| `asistencias` | 🆕 Registro de asistencia | N:1 → usuarios, N:1 → clases |
| `preferencias_modalidad` | 🆕 Elección virtual/presencial | N:1 → usuarios, N:1 → clases |
| `configuracion_asistencia` | 🆕 Config por sección | 1:1 → secciones |
| `conversaciones` | Chat (privado/grupal/curso) | N:1 → cursos |
| `mensajes` | Mensajes de chat | N:1 → conversaciones, N:1 → usuarios |
| `foro_temas` | Temas de foro | N:1 → cursos, N:1 → semanas |
| `foro_respuestas` | Respuestas de foro | N:1 → foro_temas, N:1 → usuarios |
| `notificaciones` | Notificaciones usuario | N:1 → usuarios |

### 🆕 Sistema de Secciones (Nuevo)
- **Curso Base**: Plantilla con info general (título, descripción, precio, imagen)
- **Secciones**: Instancias específicas con modalidad (virtual/presencial/hibrida), profesor, horario, ubicación, fechas
- **Inscripciones**: A nivel de sección (no curso base)
- **Asistencia**: Por clase de sección, con sincronización fondo + imagen chico

---

## 🎨 Componentes Clave

### Layout
| Componente | Ubicación | Descripción |
|------------|-----------|-------------|
| `Navbar` | `components/layout/navbar.tsx` | Navegación principal + mobile sheet |
| `Sidebar` | `components/layout/sidebar.tsx` | Navegación dashboard |
| `Footer` | `components/layout/footer.tsx` | Footer público |

### Público
| Componente | Ubicación | Descripción |
|------------|-----------|-------------|
| `Hero` | `components/public/hero.tsx` | Carrusel fondo + chico_fondo sincronizado |
| `BenefitsBar` | `components/public/benefits-bar.tsx` | Barra de beneficios |
| `CourseCatalog` | `components/shared/course-catalog.tsx` | Catálogo cursos |

### Shared (Dashboard)
| Componente | Ubicación | Descripción |
|------------|-----------|-------------|
| `TeacherCourseHeader` | `components/shared/teacher-course-header.tsx` | Header profesor con tabs |
| `StudentCourseHeader` | `components/shared/student-course-header.tsx` | Header alumno con tabs |
| `AdminCourseHeader` | `components/shared/admin-course-header.tsx` | Header admin con tabs |

### 🆕 Asistencia
| Componente | Ubicación | Descripción |
|------------|-----------|-------------|
| `AttendanceManager` | `components/asistencia/attendance-manager.tsx` | Panel profesor para tomar lista |
| `StudentAttendanceView` | `components/asistencia/student-attendance-view.tsx` | Vista alumno historial + elegir modalidad |
| `AttendanceSummary` | `components/asistencia/attendance-summary.tsx` | Widget resumen dashboards |
| `ModalitySelector` | `components/asistencia/modality-selector.tsx` | Selector virtual/presencial |

---

## 🛣️ Rutas Principales

### Públicas
| Ruta | Descripción |
|------|-------------|
| `/` | Homepage con Hero + catálogo |
| `/cursos` | Catálogo de cursos |
| `/cursos/[slug]` | Detalle de curso |
| `/profesores/[slug]` | Perfil público profesor |
| `/tienda` | 🆕 Tienda componentes mecatrónicos |
| `/checkout` | Checkout cursos |
| `/certificados/[code]` | Verificación certificado |
| `/login`, `/registro` | Auth |
| `/#proyectos`, `/#investigaciones`, `/#contacto` | Anclas en homepage |

### Dashboard (Protegidas)
| Ruta | Rol | Descripción |
|------|-----|-------------|
| `/alumno` | Alumno | Dashboard + mis cursos |
| `/alumno/mis-cursos/[id]/asistencia` | Alumno | 🆕 Ver asistencia + elegir modalidad |
| `/profesor` | Profesor | Dashboard + mis cursos |
| `/profesor/mis-cursos/[id]/asistencia` | Profesor | 🆕 Tomar lista + elegir sección/clase |
| `/admin` | Admin | Gestión cursos, usuarios, pagos |
| `/admin/cursos/[id]/asistencia` | Admin | 🆕 Ver asistencia por sección/clase |
| `/superadmin` | Superadmin | Gestión admins, roles |

---

## 🔄 Cambios Recientes (2026-10-26)

### 1. Hero Carousel (`components/public/hero.tsx`)
- ✅ Carrusel automático de 6 fondos (5s c/u, fade 700ms)
- ✅ Imagen `chico_fondo` **solo en Fondo1**, transiciona sincronizado
- ✅ Texto "De cero a proyectos reales" **100% fijo**
- ✅ Sin controles (puntos, flechas, play/pause)
- ✅ `loading="eager"` en todas las imágenes (LCP optimizado)
- ✅ `prefers-reduced-motion` support

### 2. Navbar (`components/layout/navbar.tsx`)
- ✅ Items: Inicio, Cursos, Proyectos, Investigaciones, **Tienda**, Contacto
- ✅ Eliminados: Recursos, Nosotros (ahora en Contacto)
- ✅ Mobile quick links actualizados

### 3. Tienda (`app/(public)/tienda/page.tsx`)
- ✅ Nueva ruta `/tienda`
- ✅ 8 productos mecatrónicos demo
- ✅ Categorías filtrables (tabs)
- ✅ Grid responsive 1/2/4 columnas
- ✅ Badges, precios tachados, stock, botón añadir
- ✅ Beneficios + CTA final

### 4. Sistema de Asistencia (`lib/asistencia/`, `components/asistencia/`)
- ✅ Esquema DB: `asistencias`, `preferencias_modalidad`, `configuracion_asistencia`
- ✅ Secciones sincronizadas con fondo + chico_fondo
- ✅ Profesor: `AttendanceManager` (tomar lista, filtros, exportar)
- ✅ Alumno: `StudentAttendanceView` (historial, elegir modalidad híbrida)
- ✅ Dashboard widgets: `AttendanceSummary`
- ✅ Integración en headers: tabs "Asistencia" en profesor/alumno/admin

### 5. Sistema de Secciones (DB)
- ✅ `cursos` = plantilla base
- ✅ `secciones` = instancias (virtual/presencial/hibrida)
- ✅ `inscripciones` a nivel de sección
- ✅ `asistencias` por clase de sección

### FASE 6: Filtros de Modalidad de Curso en Catálogo (2026-10-26)
**Archivos**: `src/lib/demo-data.ts`, `src/components/shared/course-catalog.tsx`
- ✅ Nuevo filtro "Modalidad de curso" con 4 opciones: Nivelación, Taller, Libre, Aplicativo
- ✅ Campo `modalidadCurso` agregado a `DemoCourseInfo` y asignado a cursos demo
- ✅ `CourseCatalog` con select filtro + lógica `matchesModalidadCurso`
- ✅ Build exitoso - 38 rutas

### FASE 7: Homepage + Catálogo con Filtros URL (2026-10-26)
**Archivos**: `src/components/public/courses-section.tsx`, `src/components/shared/course-catalog.tsx`, `src/app/(public)/cursos/page.tsx`
- ✅ Homepage: 4 cards son **modalidades** que navegan a `/cursos?modalidad=key`
- ✅ `CourseCatalog` lee `searchParams.get('modalidad')` via `useSearchParams` + `useEffect`
- ✅ `/cursos/page.tsx` envuelto en `<Suspense>` para `useSearchParams`
- ✅ URLs: `/cursos?modalidad=nivelacion|taller|libre|aplicativo`
- ✅ Build exitoso - 38 rutas

---

## 🚀 Cómo Ejecutar

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev        # http://localhost:3000

# Build producción
npm run build

# Lint
npm run lint

# Base de datos (requiere PostgreSQL)
# 1. Configurar DATABASE_URL en .env.local
# 2. npx drizzle-kit generate
# 3. npx drizzle-kit migrate
# 4. npx drizzle-kit studio (opcional)
```

---

## 📝 Notas Importantes para Futuro Desarrollo

### Hero Carousel
- **No tocar**: Texto "De cero a proyectos reales" + botones + chico_fondo (slide 1 only)
- **Modificar**: Array `backgrounds` en `hero.tsx` para agregar/quitar fondos
- **Transición**: 700ms ease-in-out, 5s intervalo (`AUTO_PLAY_INTERVAL`)

### Asistencia
- **Modalidad híbrida**: Solo en secciones con `permitirEleccionModalidad: true`
- **Chico_fondo**: Solo aparece en slide 0 (Fondo1), transiciona con él
- **Secciones**: Profesor/Alumno/Admin deben seleccionar sección → clase

### Tienda
- **Imágenes**: Placeholders en `/public/img/` (kit-arduino.webp, raspberry-pi.webp, etc.)
- **Categorías**: Definidas en array `categories` en `tienda/page.tsx`
- **Productos**: Array `products` con campos: id, name, price, originalPrice, badge, inStock

### Base de Datos
- **Migraciones**: `npx drizzle-kit generate` + `npx drizzle-kit migrate`
- **Schema**: En `src/lib/db/schema/` (archivos por dominio)
- **Seed**: Datos demo en `lib/demo-data.ts` y `lib/asistencia/demo-asistencia.ts`

### Convenciones
- **Client Components**: `"use client"` directive
- **Server Components**: Por defecto (async/await en pages)
- **Estilos**: Tailwind CSS 4 + `cn()` utility
- **Iconos**: Lucide React
- **Tipos**: TypeScript strict mode

---

## 🔗 Archivos de Referencia Rápida

| Archivo | Propósito |
|---------|-----------|
| `database_schema.sql` | Script SQL completo PostgreSQL |
| `drizzle.config.ts` | Config Drizzle ORM |
| `src/lib/db/schema/index.ts` | Exports de esquemas |
| `src/lib/asistencia/tipos.ts` | Tipos TypeScript asistencia |
| `src/lib/asistencia/demo-asistencia.ts` | Datos demo asistencia |
| `src/components/public/hero.tsx` | Hero carousel |
| `src/components/layout/navbar.tsx` | Navegación principal |
| `src/app/(public)/tienda/page.tsx` | Página tienda |
| `src/app/(dashboard)/profesor/mis-cursos/[id]/asistencia/page.tsx` | Tomar lista |
| `src/app/(dashboard)/alumno/mis-cursos/[id]/asistencia/page.tsx` | Ver asistencia alumno |

---

## 🎯 Próximos Pasos Sugeridos

1. **Fase 2 - Gestión de Secciones**: CRUD secciones en admin/profesor
2. **Fase 3 - Catálogo Público**: Mostrar secciones (badges virtual/presencial/hibrida)
3. **Fase 4 - Checkout/Inscripción**: Selección de sección en compra
4. **Fase 5 - APIs Reales**: Reemplazar demo data con endpoints reales
5. **Fase 6 - QR/Autoregistro**: Auto-registro asistencia via QR
6. **Fase 7 - Reportes**: Exportar asistencia, analytics

---

*Documento generado automáticamente para mantener contexto entre sesiones.*