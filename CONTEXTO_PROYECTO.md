# Contexto del proyecto: ProyectoClases

Documento de traspaso para que otra persona o IA pueda entender el estado actual del repositorio y continuar el desarrollo sin confundir la demo de interfaz con un backend de producción.

## Resumen

ProyectoClases (paquete `profe`) es una plataforma educativa en español para cursos virtuales. El repositorio contiene:

- Sitio público de promoción, catálogo y detalle de cursos, perfiles docentes, checkout y consulta de certificados.
- Vistas de panel para cuatro perfiles: superadministrador, administrador, profesor y alumno.
- Interfaces de demostración para cursos, contenido/lecciones, tareas, quizzes, entregas, calificaciones, foros, chat, pagos, usuarios, reportes y configuración.
- Un esquema de datos PostgreSQL modelado con Drizzle, pero no una aplicación conectada de extremo a extremo a una base de datos.

**Estado funcional importante:** la mayor parte de las rutas y formularios es una demo de frontend. Los datos visibles suelen ser valores estáticos o de ejemplo; varias interacciones solo cambian estado en el navegador y no persisten. El login usa cuatro cuentas conocidas codificadas en el cliente y guarda el rol en `sessionStorage`; no autentica contra un proveedor ni protege rutas en el servidor. Checkout acepta una selección local de archivo, pero no lo sube ni procesa un pago. Formularios y acciones tienen mensajes explícitos de demo en diferentes pantallas.

## Tecnologías

### Aplicación y UI

- **Next.js 16.3.8**, App Router, React Server Components y rutas basadas en `src/app`.
- **React 19.2.8** y **TypeScript 5**, con `strict: true`.
- **Tailwind CSS 4**, PostCSS y `tw-animate-css`.
- Componentes de UI locales en `src/components/ui`, con configuración shadcn (`components.json`, estilo `base-nova`); `@base-ui/react` es una dependencia.
- **Lucide React** para iconos.
- **React Hook Form**, **Zod** y `@hookform/resolvers` están disponibles como dependencias para formularios/validación.
- **TanStack React Query v5** está conectado globalmente mediante `QueryProvider`; no se encontró uso de consultas de negocio a servicios del backend en las páginas examinadas.
- `next-themes` está instalado y el proveedor global está configurado para tema claro forzado.
- Fuentes: Inter mediante `next/font/google`.
- Utilidades adicionales: `date-fns`, `class-variance-authority`, `cn`, `server-only`.

### Datos / infraestructura

- **PostgreSQL** como dialecto configurado para Drizzle ORM, usando el driver `postgres`.
- **Drizzle ORM + drizzle-kit**: hay un helper de conexión y esquema TypeScript en `src/lib/db`. La conexión requiere `DATABASE_URL` y se inicializa de forma diferida.
- **Supabase CLI/configuración**: existe `supabase/config.toml`, pero no se aprecia integración de Supabase Auth/Storage ni consumo de Supabase desde las pantallas.
- El archivo Drizzle busca configuración en `.env.local`. No se debe asumir que existe una base, variables, migraciones generadas o datos semilla: no se encontraron migraciones ni una capa de servicios/repositorios/API funcional en la estructura revisada.

### Herramientas y scripts

```bash
npm run dev      # servidor de desarrollo Next.js
npm run build    # build de producción
npm run start    # servidor Next.js de producción
npm run lint     # ESLint
```

No hay scripts de pruebas en `package.json`. Los directorios `tests/` (con subdirectorios `api`, `decisiones`, `e2e`, `integration`, `unit`), `docs/` y `srcappapi/api/` no contenían archivos en la inspección. El nombre `srcappapi` está en la raíz y no forma parte de la ruta convencional de API de Next (`src/app/api`).

## Funcionalidad presente por área

### Sitio público

- Inicio con secciones de presentación, cursos, proyectos/beneficios y comunidad.
- Catálogo con búsqueda y filtros locales por nivel, precio máximo y duración.
- Página de detalle de curso dinámica por `slug`.
- Perfil público de profesor dinámica por `slug` (el contenido revisado usa datos estáticos).
- Checkout con datos de alumno, selección de Yape/Plin y selección local de voucher; muestra confirmación simulada.
- Ruta pública de certificado por código.

### Acceso y recuperación

- Login visual con cuentas de demostración para los cuatro roles.
- Recuperación y restablecimiento de contraseña en flujo simulado; no se envían correos ni se verifica una contraseña en servidor.
- El usuario alumno demo se dirige a una pantalla de restablecimiento al ser su primer acceso.

### Superadministrador

- Resumen de plataforma, listado/alta de administradores y pantallas de roles/permisos.

### Administrador

- Panel/resumen con métricas de ejemplo.
- Gestión de cursos, semanas y alumnos inscritos.
- Gestión de usuarios y pagos, incluidos detalles/revisión de pago.
- Reportes y configuración institucional.

### Profesor

- Panel y listado/detalle de cursos.
- Gestión de alumnos, semanas, clases/contenido y chat asociado al curso.
- Creación/listado de quizzes.
- Creación y gestión de tareas, revisión de entregas/calificaciones.
- Chat y foro del profesor.

### Alumno

- Panel, cursos inscritos, detalle del curso, semanas y clases.
- Tareas y entregas, quizzes e intentos, notas.
- Chat, foro, calendario, certificados y perfil.

**Alcance real de estas áreas:** son principalmente pantallas navegables y flujos de presentación. Los números, nombres, registros y notificaciones están hardcodeados o cargados desde fixtures locales; los formularios con prefijo `demo-` anuncian que no persisten los cambios. Verificar cada pantalla antes de reutilizarla como comportamiento de producción.

## Modelo de datos planteado

El esquema Drizzle modela estas entidades:

- `usuarios.ts`: roles, usuarios y perfiles de profesor.
- `cursos.ts`: cursos, semanas, clases y materiales.
- `pagos.ts`: inscripciones y pagos.
- `tareas.ts`: tareas, entregas, quizzes, preguntas e intentos de quiz.
- `chat.ts`: conversaciones, participantes, mensajes, temas/respuestas de foro y notificaciones.

Estas tablas expresan la dirección prevista del producto, pero la existencia del esquema no significa que las páginas ya realicen CRUD persistente. Antes de implementar funcionalidades, conviene decidir y crear la capa faltante: migraciones, servicios/repositorios, validación del lado servidor, autorización y endpoints o Server Actions.

## Árbol del proyecto

```text
.
├── AGENTS.md
├── CLAUDE.md
├── CONTEXTO_PROYECTO.md
├── README.md
├── package.json
├── package-lock.json
├── next.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── postcss.config.mjs
├── drizzle.config.ts
├── components.json
├── public/
│   ├── img/                         # Imágenes y recursos del sitio
│   └── *.svg                        # Recursos del starter de Next.js
├── src/
│   ├── app/
│   │   ├── layout.tsx               # Layout global, idioma, tema y Query Provider
│   │   ├── globals.css
│   │   ├── (public)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx             # Inicio
│   │   │   ├── checkout/page.tsx
│   │   │   ├── certificados/[code]/page.tsx
│   │   │   ├── cursos/page.tsx
│   │   │   ├── cursos/[slug]/page.tsx
│   │   │   └── profesores/[slug]/page.tsx
│   │   ├── (auth)/
│   │   │   ├── layout.tsx
│   │   │   ├── login/page.tsx
│   │   │   ├── forgot-password/page.tsx
│   │   │   └── reset-password/page.tsx
│   │   └── (dashboard)/
│   │       ├── layout.tsx
│   │       ├── superadmin/
│   │       │   ├── page.tsx
│   │       │   ├── administradores/page.tsx
│   │       │   └── roles/page.tsx
│   │       ├── admin/
│   │       │   ├── page.tsx
│   │       │   ├── configuracion/page.tsx
│   │       │   ├── cursos/page.tsx
│   │       │   ├── cursos/nuevo/page.tsx
│   │       │   ├── cursos/[id]/page.tsx
│   │       │   ├── cursos/[id]/alumnos/page.tsx
│   │       │   ├── cursos/[id]/semanas/page.tsx
│   │       │   ├── pagos/page.tsx
│   │       │   ├── pagos/[id]/page.tsx
│   │       │   ├── reportes/page.tsx
│   │       │   ├── usuarios/page.tsx
│   │       │   └── usuarios/[id]/page.tsx
│   │       ├── profesor/
│   │       │   ├── page.tsx
│   │       │   ├── chat/page.tsx
│   │       │   ├── foro/page.tsx
│   │       │   └── mis-cursos/
│   │       │       ├── page.tsx
│   │       │       └── [id]/
│   │       │           ├── page.tsx
│   │       │           ├── alumnos/page.tsx
│   │       │           ├── chat/page.tsx
│   │       │           ├── clases/page.tsx
│   │       │           ├── contenido/page.tsx
│   │       │           ├── semanas/page.tsx
│   │       │           ├── quizzes/page.tsx
│   │       │           ├── quizzes/nuevo/page.tsx
│   │       │           └── tareas/
│   │       │               ├── page.tsx
│   │       │               ├── nueva/page.tsx
│   │       │               └── [tareaId]/
│   │       │                   ├── page.tsx
│   │       │                   └── entregas/page.tsx
│   │       └── alumno/
│   │           ├── page.tsx
│   │           ├── calendario/page.tsx
│   │           ├── certificados/page.tsx
│   │           ├── chat/page.tsx
│   │           ├── perfil/page.tsx
│   │           └── mis-cursos/
│   │               ├── page.tsx
│   │               └── [id]/
│   │                   ├── page.tsx
│   │                   ├── chat/page.tsx
│   │                   ├── clases/[claseId]/page.tsx
│   │                   ├── foro/page.tsx
│   │                   ├── notas/page.tsx
│   │                   ├── quizzes/page.tsx
│   │                   ├── quizzes/[quizId]/page.tsx
│   │                   ├── semanas/[semanaId]/page.tsx
│   │                   └── tareas/
│   │                       ├── page.tsx
│   │                       └── [tareaId]/page.tsx
│   ├── components/
│   │   ├── forms/                   # Formularios demo (demo-*)
│   │   ├── layout/                  # Navbar, footer, sidebar, providers
│   │   ├── public/                  # Bloques de página pública
│   │   ├── shared/                  # Catálogo, chat, foros, contenido, etc.
│   │   └── ui/                      # Primitivas de interfaz reutilizables
│   └── lib/
│       ├── db/
│       │   ├── index.ts             # Conexión diferida a PostgreSQL
│       │   └── schema/              # Esquemas Drizzle por dominio
│       ├── demo-course-content.ts
│       ├── demo-courses.ts
│       └── utils.ts
├── supabase/
│   └── config.toml
├── docs/                            # Vacío en la inspección
├── tests/                           # Carpetas unit/integration/e2e/api/decisiones, sin archivos
└── srcappapi/api/                   # Directorio vacío; no es src/app/api
```

Los segmentos entre paréntesis (`(public)`, `(auth)`, `(dashboard)`) son grupos de rutas de Next.js y no forman parte de la URL. Los segmentos entre corchetes (`[id]`, `[slug]`, etc.) son parámetros dinámicos.

## Archivos y convenciones para empezar

- `src/app/layout.tsx`: layout raíz con `lang="es"`, fuente Inter, `ThemeProvider` y `QueryProvider`.
- `src/app/(dashboard)/layout.tsx`: estructura compartida del panel con sidebar y barra superior.
- `src/components/layout/sidebar.tsx`: navegación por rol; el rol mostrado procede de la sesión demo.
- `src/lib/demo-courses.ts` y `src/lib/demo-course-content.ts`: fixtures usados por distintas pantallas del curso.
- `src/lib/db/index.ts`: `getDb()` valida `DATABASE_URL` y entrega Drizzle; mantiene una instancia en memoria durante el proceso.
- `drizzle.config.ts`: esquema en `src/lib/db/schema`, salida esperada de migraciones en `src/lib/db/migrations`.
- Alias TypeScript `@/*` resuelve a `src/*`.
- Los componentes `demo-*` deben considerarse prototipos hasta que se conecten a una persistencia real.

## Próximos pasos sugeridos para continuar

1. Confirmar alcance de producto y backend: PostgreSQL directo con Drizzle o Supabase como plataforma principal; evitar operar dos estrategias sin una decisión.
2. Preparar variables de entorno locales y configuración segura; no guardar secretos en el repositorio.
3. Generar y aplicar migraciones Drizzle; definir datos iniciales necesarios.
4. Diseñar autenticación real y autorización por rol en servidor antes de exponer datos o acciones de administración.
5. Añadir capa de acceso a datos/servicios y conectar primero un flujo vertical (por ejemplo catálogo → detalle → pago/inscripción).
6. Reemplazar los fixtures/formularios demo gradualmente y especificar manejo real de archivos, pagos, correo y certificados.
7. Añadir pruebas unitarias, integración y E2E; actualmente no hay suite ni scripts de test configurados.

## Nota del estado local

Al inspeccionar el repositorio había cambios locales sin commit en páginas del sitio público, estilos, navbar/footer y catálogo de cursos, además de componentes públicos e imágenes nuevos. Este documento no debe usarse como motivo para descartar esos cambios: comprobar el estado de Git antes de limpiar o reemplazar archivos.
