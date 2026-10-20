/**
 * Datos de demostración para el sistema de asistencia con secciones
 * Estructura: Curso Base -> Secciones (virtual/presencial/hibrida) -> Semanas -> Clases
 */

import type {
  ModalidadClase,
  ModalidadAsistencia,
  EstadoAsistencia,
  MetodoRegistroAsistencia,
  EstadoSeccion,
  CursoBase,
  Seccion,
  Semana,
  ClaseConAsistencia,
  PreferenciaModalidad,
  Asistencia,
  ConfiguracionAsistencia,
  AsistenciaClaseProfesor,
  AsistenciaAlumnoDetalle,
  AsistenciaAlumnoSeccion,
  AsistenciaClaseAlumno,
} from "./tipos";

// ============================================================================
// CURSOS BASE (Plantillas generales)
// ============================================================================

export const demoCursosBase: CursoBase[] = [
  {
    id: "curso-1",
    slug: "fundamentos-python",
    titulo: "Fundamentos de Python",
    descripcionCorta: "Aprende a programar con proyectos guiados desde cero.",
    descripcionLarga: "Curso completo de Python para principiantes...",
    imagenPortada: "/img/python.webp",
    precio: 189,
    moneda: "PEN",
    duracionHoras: 24,
    nivel: "principiante",
    profesorBaseId: "prof-1",
    certificadoActivo: true,
    createdAt: new Date("2026-01-15"),
    updatedAt: new Date("2026-01-15"),
  },
  {
    id: "curso-2",
    slug: "desarrollo-web-react",
    titulo: "Desarrollo Web con React",
    descripcionCorta: "Diseña interfaces y crea aplicaciones web modernas.",
    descripcionLarga: "Curso de React para desarrolladores...",
    imagenPortada: "/img/procesador.webp",
    precio: 229,
    moneda: "PEN",
    duracionHoras: 32,
    nivel: "intermedio",
    profesorBaseId: "prof-1",
    certificadoActivo: true,
    createdAt: new Date("2026-02-01"),
    updatedAt: new Date("2026-02-01"),
  },
  {
    id: "curso-3",
    slug: "excel-negocios",
    titulo: "Excel para Negocios",
    descripcionCorta: "Organiza datos, automatiza tareas y crea reportes claros.",
    descripcionLarga: "Curso de Excel aplicado a negocios...",
    imagenPortada: "/img/icono_crecimiento.webp",
    precio: 149,
    moneda: "PEN",
    duracionHoras: 18,
    nivel: "principiante",
    profesorBaseId: "prof-2",
    certificadoActivo: true,
    createdAt: new Date("2026-03-01"),
    updatedAt: new Date("2026-03-01"),
  },
];

// ============================================================================
// SECCIONES (Instancias específicas por modalidad)
// ============================================================================

export const demoSecciones: Seccion[] = [
  // Curso 1: Fundamentos de Python - 3 secciones
  {
    id: "sec-1-v",
    cursoId: "curso-1",
    codigo: "PY-2026-V1",
    modalidad: "virtual",
    profesorId: "prof-1",
    capacidad: 50,
    horario: "Lunes y Miércoles 19:00-21:00 (Online)",
    ubicacion: null,
    fechaInicio: new Date("2026-09-01"),
    fechaFin: new Date("2026-11-15"),
    estado: "activa",
    permitirEleccionModalidad: false,
    horasLimiteEleccion: 2,
    requerirJustificacion: false,
    permitirAutoRegistro: true,
    ventanaAutoRegistroMinutos: 15,
    createdAt: new Date("2026-08-01"),
    updatedAt: new Date("2026-08-01"),
    curso: demoCursosBase[0],
    profesor: { id: "prof-1", nombre: "Ana María", apellido: "Campos", email: "profesor@edukatech.pe" },
  },
  {
    id: "sec-1-p",
    cursoId: "curso-1",
    codigo: "PY-2026-P1",
    modalidad: "presencial",
    profesorId: "prof-1",
    capacidad: 30,
    horario: "Martes y Jueves 18:00-20:00",
    ubicacion: "Aula 101 - Edificio Principal",
    fechaInicio: new Date("2026-09-01"),
    fechaFin: new Date("2026-11-15"),
    estado: "activa",
    permitirEleccionModalidad: false,
    horasLimiteEleccion: 2,
    requerirJustificacion: true,
    permitirAutoRegistro: true,
    ventanaAutoRegistroMinutos: 15,
    createdAt: new Date("2026-08-01"),
    updatedAt: new Date("2026-08-01"),
    curso: demoCursosBase[0],
    profesor: { id: "prof-1", nombre: "Ana María", apellido: "Campos", email: "profesor@edukatech.pe" },
  },
  {
    id: "sec-1-h",
    cursoId: "curso-1",
    codigo: "PY-2026-H1",
    modalidad: "hibrida",
    profesorId: "prof-1",
    capacidad: 35,
    horario: "Viernes 17:00-20:00",
    ubicacion: "Aula 101 - Edificio Principal",
    fechaInicio: new Date("2026-09-01"),
    fechaFin: new Date("2026-11-15"),
    estado: "activa",
    permitirEleccionModalidad: true,
    horasLimiteEleccion: 4,
    requerirJustificacion: false,
    permitirAutoRegistro: true,
    ventanaAutoRegistroMinutos: 15,
    createdAt: new Date("2026-08-01"),
    updatedAt: new Date("2026-08-01"),
    curso: demoCursosBase[0],
    profesor: { id: "prof-1", nombre: "Ana María", apellido: "Campos", email: "profesor@edukatech.pe" },
  },
  // Curso 2: React - 2 secciones
  {
    id: "sec-2-v",
    cursoId: "curso-2",
    codigo: "RE-2026-V1",
    modalidad: "virtual",
    profesorId: "prof-1",
    capacidad: 40,
    horario: "Lunes y Miércoles 19:00-21:00 (Online)",
    ubicacion: null,
    fechaInicio: new Date("2026-10-01"),
    fechaFin: new Date("2026-12-15"),
    estado: "activa",
    permitirEleccionModalidad: false,
    horasLimiteEleccion: 2,
    requerirJustificacion: false,
    permitirAutoRegistro: true,
    ventanaAutoRegistroMinutos: 15,
    createdAt: new Date("2026-09-01"),
    updatedAt: new Date("2026-09-01"),
    curso: demoCursosBase[1],
    profesor: { id: "prof-1", nombre: "Ana María", apellido: "Campos", email: "profesor@edukatech.pe" },
  },
  {
    id: "sec-2-h",
    cursoId: "curso-2",
    codigo: "RE-2026-H1",
    modalidad: "hibrida",
    profesorId: "prof-1",
    capacidad: 25,
    horario: "Sábados 09:00-13:00",
    ubicacion: "Aula 205 - Edificio Tech",
    fechaInicio: new Date("2026-10-01"),
    fechaFin: new Date("2026-12-15"),
    estado: "activa",
    permitirEleccionModalidad: true,
    horasLimiteEleccion: 4,
    requerirJustificacion: true,
    permitirAutoRegistro: false,
    ventanaAutoRegistroMinutos: 10,
    createdAt: new Date("2026-09-01"),
    updatedAt: new Date("2026-09-01"),
    curso: demoCursosBase[1],
    profesor: { id: "prof-1", nombre: "Ana María", apellido: "Campos", email: "profesor@edukatech.pe" },
  },
  // Curso 3: Excel - 1 sección presencial
  {
    id: "sec-3-p",
    cursoId: "curso-3",
    codigo: "XL-2026-P1",
    modalidad: "presencial",
    profesorId: "prof-2",
    capacidad: 30,
    horario: "Martes y Jueves 18:00-20:00",
    ubicacion: "Aula Informática 1",
    fechaInicio: new Date("2026-09-15"),
    fechaFin: new Date("2026-11-30"),
    estado: "activa",
    permitirEleccionModalidad: false,
    horasLimiteEleccion: 1,
    requerirJustificacion: false,
    permitirAutoRegistro: true,
    ventanaAutoRegistroMinutos: 20,
    createdAt: new Date("2026-08-15"),
    updatedAt: new Date("2026-08-15"),
    curso: demoCursosBase[2],
    profesor: { id: "prof-2", nombre: "Mariana", apellido: "Torres", email: "mariana@edukatech.pe" },
  },
];

// ============================================================================
// SEMANAS (Por sección)
// ============================================================================

export const demoSemanas: Semana[] = [
  // Sección 1-V (Virtual) - 3 semanas
  { id: "sem-1v-1", seccionId: "sec-1-v", numero: 1, titulo: "Primeros pasos", descripcion: "Configuración del entorno y variables", createdAt: new Date("2026-09-01") },
  { id: "sem-1v-2", seccionId: "sec-1-v", numero: 2, titulo: "Decisiones y repetición", descripcion: "Condicionales, bucles y colecciones", createdAt: new Date("2026-09-15") },
  { id: "sem-1v-3", seccionId: "sec-1-v", numero: 3, titulo: "Funciones y proyecto", descripcion: "Funciones, módulos y proyecto final", createdAt: new Date("2026-10-01") },
  // Sección 1-P (Presencial) - 3 semanas
  { id: "sem-1p-1", seccionId: "sec-1-p", numero: 1, titulo: "Primeros pasos", descripcion: "Configuración del entorno y variables", createdAt: new Date("2026-09-01") },
  { id: "sem-1p-2", seccionId: "sec-1-p", numero: 2, titulo: "Decisiones y repetición", descripcion: "Condicionales, bucles y colecciones", createdAt: new Date("2026-09-15") },
  { id: "sem-1p-3", seccionId: "sec-1-p", numero: 3, titulo: "Funciones y proyecto", descripcion: "Funciones, módulos y proyecto final", createdAt: new Date("2026-10-01") },
  // Sección 1-H (Híbrida) - 3 semanas
  { id: "sem-1h-1", seccionId: "sec-1-h", numero: 1, titulo: "Primeros pasos", descripcion: "Configuración del entorno y variables", createdAt: new Date("2026-09-01") },
  { id: "sem-1h-2", seccionId: "sec-1-h", numero: 2, titulo: "Decisiones y repetición", descripcion: "Condicionales, bucles y colecciones", createdAt: new Date("2026-09-15") },
  { id: "sem-1h-3", seccionId: "sec-1-h", numero: 3, titulo: "Funciones y proyecto", descripcion: "Funciones, módulos y proyecto final", createdAt: new Date("2026-10-01") },
  // Sección 2-V (Virtual) - 3 semanas
  { id: "sem-2v-1", seccionId: "sec-2-v", numero: 1, titulo: "Componentes y entorno", descripcion: "Configuración, componentes y props", createdAt: new Date("2026-10-01") },
  { id: "sem-2v-2", seccionId: "sec-2-v", numero: 2, titulo: "Estado e interacción", descripcion: "Estado, eventos, formularios y consumo de APIs", createdAt: new Date("2026-10-15") },
  { id: "sem-2v-3", seccionId: "sec-2-v", numero: 3, titulo: "Aplicación final", descripcion: "Estructura, accesibilidad y proyecto de cierre", createdAt: new Date("2026-11-01") },
  // Sección 2-H (Híbrida) - 3 semanas
  { id: "sem-2h-1", seccionId: "sec-2-h", numero: 1, titulo: "Componentes y entorno", descripcion: "Configuración, componentes y props", createdAt: new Date("2026-10-01") },
  { id: "sem-2h-2", seccionId: "sec-2-h", numero: 2, titulo: "Estado e interacción", descripcion: "Estado, eventos, formularios y consumo de APIs", createdAt: new Date("2026-10-15") },
  { id: "sem-2h-3", seccionId: "sec-2-h", numero: 3, titulo: "Aplicación final", descripcion: "Estructura, accesibilidad y proyecto de cierre", createdAt: new Date("2026-11-01") },
  // Sección 3-P (Presencial) - 3 semanas
  { id: "sem-3p-1", seccionId: "sec-3-p", numero: 1, titulo: "Fundamentos de hojas de cálculo", descripcion: "Entorno, fórmulas esenciales y formato", createdAt: new Date("2026-09-15") },
  { id: "sem-3p-2", seccionId: "sec-3-p", numero: 2, titulo: "Análisis y reportes", descripcion: "Filtros, tablas dinámicas y funciones para decisiones", createdAt: new Date("2026-10-01") },
  { id: "sem-3p-3", seccionId: "sec-3-p", numero: 3, titulo: "Automatización", descripcion: "Preparar tareas repetitivas y proyecto de análisis", createdAt: new Date("2026-10-15") },
];

// ============================================================================
// CLASES (Por semana de sección)
// ============================================================================

export const demoClases: ClaseConAsistencia[] = [
  // Sección 1-V (Virtual) - Semana 1
  { id: "cl-1v-1-1", semanaId: "sem-1v-1", numero: 1, titulo: "Bienvenida y entorno de trabajo", descripcion: "Configuración del entorno de desarrollo", videoUrl: "https://ejemplo.com/v1", duracionMinutos: 10, modalidad: "virtual", ubicacionPresencial: null, capacidadPresencial: null, fechaProgramada: new Date("2026-09-01T19:00:00"), publicado: true, createdAt: new Date("2026-08-15"), updatedAt: new Date("2026-08-15"), semana: demoSemanas[0] },
  { id: "cl-1v-1-2", semanaId: "sem-1v-1", numero: 2, titulo: "Variables y tipos de datos", descripcion: "Tipos primitivos, variables y constantes", videoUrl: "https://ejemplo.com/v2", duracionMinutos: 18, modalidad: "virtual", ubicacionPresencial: null, capacidadPresencial: null, fechaProgramada: new Date("2026-09-03T19:00:00"), publicado: true, createdAt: new Date("2026-08-15"), updatedAt: new Date("2026-08-15"), semana: demoSemanas[0] },
  { id: "cl-1v-1-3", semanaId: "sem-1v-1", numero: 3, titulo: "Tu primer programa", descripcion: "Escribiendo y ejecutando tu primer script", videoUrl: "https://ejemplo.com/v3", duracionMinutos: 22, modalidad: "virtual", ubicacionPresencial: null, capacidadPresencial: null, fechaProgramada: new Date("2026-09-08T19:00:00"), publicado: true, createdAt: new Date("2026-08-15"), updatedAt: new Date("2026-08-15"), semana: demoSemanas[0] },
  // Semana 2
  { id: "cl-1v-2-1", semanaId: "sem-1v-2", numero: 4, titulo: "Condicionales en la práctica", descripcion: "Uso de if, elif, else", videoUrl: "https://ejemplo.com/v4", duracionMinutos: 16, modalidad: "virtual", ubicacionPresencial: null, capacidadPresencial: null, fechaProgramada: new Date("2026-09-15T19:00:00"), publicado: true, createdAt: new Date("2026-08-15"), updatedAt: new Date("2026-08-15"), semana: demoSemanas[1] },
  { id: "cl-1v-2-2", semanaId: "sem-1v-2", numero: 5, titulo: "Bucles y colecciones", descripcion: "For, while, listas, tuplas y diccionarios", videoUrl: "https://ejemplo.com/v5", duracionMinutos: 20, modalidad: "virtual", ubicacionPresencial: null, capacidadPresencial: null, fechaProgramada: new Date("2026-09-17T19:00:00"), publicado: true, createdAt: new Date("2026-08-15"), updatedAt: new Date("2026-08-15"), semana: demoSemanas[1] },
  { id: "cl-1v-2-3", semanaId: "sem-1v-2", numero: 6, titulo: "Reto: automatiza una tarea", descripcion: "Proyecto práctico integrando lo aprendido", videoUrl: "https://ejemplo.com/v6", duracionMinutos: 25, modalidad: "virtual", ubicacionPresencial: null, capacidadPresencial: null, fechaProgramada: new Date("2026-09-22T19:00:00"), publicado: true, createdAt: new Date("2026-08-15"), updatedAt: new Date("2026-08-15"), semana: demoSemanas[1] },
  // Semana 3
  { id: "cl-1v-3-1", semanaId: "sem-1v-3", numero: 7, titulo: "Funciones reutilizables", descripcion: "Definición, parámetros, retorno y scope", videoUrl: "https://ejemplo.com/v7", duracionMinutos: 18, modalidad: "virtual", ubicacionPresencial: null, capacidadPresencial: null, fechaProgramada: new Date("2026-10-01T19:00:00"), publicado: true, createdAt: new Date("2026-08-15"), updatedAt: new Date("2026-08-15"), semana: demoSemanas[2] },
  { id: "cl-1v-3-2", semanaId: "sem-1v-3", numero: 8, titulo: "Organización del código", descripcion: "Módulos, paquetes y mejores prácticas", videoUrl: "https://ejemplo.com/v8", duracionMinutos: 20, modalidad: "virtual", ubicacionPresencial: null, capacidadPresencial: null, fechaProgramada: new Date("2026-10-06T19:00:00"), publicado: true, createdAt: new Date("2026-08-15"), updatedAt: new Date("2026-08-15"), semana: demoSemanas[2] },
  { id: "cl-1v-3-3", semanaId: "sem-1v-3", numero: 9, titulo: "Proyecto final guiado", descripcion: "Desarrollo completo de un proyecto integrador", videoUrl: "https://ejemplo.com/v9", duracionMinutos: 30, modalidad: "virtual", ubicacionPresencial: null, capacidadPresencial: null, fechaProgramada: new Date("2026-10-08T19:00:00"), publicado: true, createdAt: new Date("2026-08-15"), updatedAt: new Date("2026-08-15"), semana: demoSemanas[2] },

  // Sección 1-P (Presencial) - Semana 1
  { id: "cl-1p-1-1", semanaId: "sem-1p-1", numero: 1, titulo: "Bienvenida y entorno de trabajo", descripcion: "Configuración del entorno de desarrollo", videoUrl: null, duracionMinutos: 120, modalidad: "presencial", ubicacionPresencial: "Aula 101 - Edificio Principal", capacidadPresencial: 30, fechaProgramada: new Date("2026-09-02T18:00:00"), publicado: true, createdAt: new Date("2026-08-15"), updatedAt: new Date("2026-08-15"), semana: demoSemanas[3] },
  { id: "cl-1p-1-2", semanaId: "sem-1p-1", numero: 2, titulo: "Variables y tipos de datos", descripcion: "Tipos primitivos, variables y constantes", videoUrl: null, duracionMinutos: 120, modalidad: "presencial", ubicacionPresencial: "Aula 101 - Edificio Principal", capacidadPresencial: 30, fechaProgramada: new Date("2026-09-04T18:00:00"), publicado: true, createdAt: new Date("2026-08-15"), updatedAt: new Date("2026-08-15"), semana: demoSemanas[3] },
  { id: "cl-1p-1-3", semanaId: "sem-1p-1", numero: 3, titulo: "Tu primer programa", descripcion: "Escribiendo y ejecutando tu primer script", videoUrl: null, duracionMinutos: 120, modalidad: "presencial", ubicacionPresencial: "Aula 101 - Edificio Principal", capacidadPresencial: 30, fechaProgramada: new Date("2026-09-09T18:00:00"), publicado: true, createdAt: new Date("2026-08-15"), updatedAt: new Date("2026-08-15"), semana: demoSemanas[3] },
  // Semana 2
  { id: "cl-1p-2-1", semanaId: "sem-1p-2", numero: 4, titulo: "Condicionales en la práctica", descripcion: "Uso de if, elif, else", videoUrl: null, duracionMinutos: 120, modalidad: "presencial", ubicacionPresencial: "Aula 101 - Edificio Principal", capacidadPresencial: 30, fechaProgramada: new Date("2026-09-16T18:00:00"), publicado: true, createdAt: new Date("2026-08-15"), updatedAt: new Date("2026-08-15"), semana: demoSemanas[4] },
  { id: "cl-1p-2-2", semanaId: "sem-1p-2", numero: 5, titulo: "Bucles y colecciones", descripcion: "For, while, listas, tuplas y diccionarios", videoUrl: null, duracionMinutos: 120, modalidad: "presencial", ubicacionPresencial: "Aula 101 - Edificio Principal", capacidadPresencial: 30, fechaProgramada: new Date("2026-09-18T18:00:00"), publicado: true, createdAt: new Date("2026-08-15"), updatedAt: new Date("2026-08-15"), semana: demoSemanas[4] },
  { id: "cl-1p-2-3", semanaId: "sem-1p-2", numero: 6, titulo: "Reto: automatiza una tarea", descripcion: "Proyecto práctico integrando lo aprendido", videoUrl: null, duracionMinutos: 120, modalidad: "presencial", ubicacionPresencial: "Aula 101 - Edificio Principal", capacidadPresencial: 30, fechaProgramada: new Date("2026-09-23T18:00:00"), publicado: true, createdAt: new Date("2026-08-15"), updatedAt: new Date("2026-08-15"), semana: demoSemanas[4] },
  // Semana 3
  { id: "cl-1p-3-1", semanaId: "sem-1p-3", numero: 7, titulo: "Funciones reutilizables", descripcion: "Definición, parámetros, retorno y scope", videoUrl: null, duracionMinutos: 120, modalidad: "presencial", ubicacionPresencial: "Aula 101 - Edificio Principal", capacidadPresencial: 30, fechaProgramada: new Date("2026-10-02T18:00:00"), publicado: true, createdAt: new Date("2026-08-15"), updatedAt: new Date("2026-08-15"), semana: demoSemanas[5] },
  { id: "cl-1p-3-2", semanaId: "sem-1p-3", numero: 8, titulo: "Organización del código", descripcion: "Módulos, paquetes y mejores prácticas", videoUrl: null, duracionMinutos: 120, modalidad: "presencial", ubicacionPresencial: "Aula 101 - Edificio Principal", capacidadPresencial: 30, fechaProgramada: new Date("2026-10-07T18:00:00"), publicado: true, createdAt: new Date("2026-08-15"), updatedAt: new Date("2026-08-15"), semana: demoSemanas[5] },
  { id: "cl-1p-3-3", semanaId: "sem-1p-3", numero: 9, titulo: "Proyecto final guiado", descripcion: "Desarrollo completo de un proyecto integrador", videoUrl: null, duracionMinutos: 120, modalidad: "presencial", ubicacionPresencial: "Aula 101 - Edificio Principal", capacidadPresencial: 30, fechaProgramada: new Date("2026-10-09T18:00:00"), publicado: true, createdAt: new Date("2026-08-15"), updatedAt: new Date("2026-08-15"), semana: demoSemanas[5] },

  // Sección 1-H (Híbrida) - Semana 1
  { id: "cl-1h-1-1", semanaId: "sem-1h-1", numero: 1, titulo: "Bienvenida y entorno de trabajo", descripcion: "Configuración del entorno de desarrollo", videoUrl: "https://ejemplo.com/h1", duracionMinutos: 180, modalidad: "hibrida", ubicacionPresencial: "Aula 101 - Edificio Principal", capacidadPresencial: 35, fechaProgramada: new Date("2026-09-05T17:00:00"), publicado: true, createdAt: new Date("2026-08-15"), updatedAt: new Date("2026-08-15"), semana: demoSemanas[6] },
  { id: "cl-1h-1-2", semanaId: "sem-1h-1", numero: 2, titulo: "Variables y tipos de datos", descripcion: "Tipos primitivos, variables y constantes", videoUrl: "https://ejemplo.com/h2", duracionMinutos: 180, modalidad: "hibrida", ubicacionPresencial: "Aula 101 - Edificio Principal", capacidadPresencial: 35, fechaProgramada: new Date("2026-09-12T17:00:00"), publicado: true, createdAt: new Date("2026-08-15"), updatedAt: new Date("2026-08-15"), semana: demoSemanas[6] },
  { id: "cl-1h-1-3", semanaId: "sem-1h-1", numero: 3, titulo: "Tu primer programa", descripcion: "Escribiendo y ejecutando tu primer script", videoUrl: "https://ejemplo.com/h3", duracionMinutos: 180, modalidad: "hibrida", ubicacionPresencial: "Aula 101 - Edificio Principal", capacidadPresencial: 35, fechaProgramada: new Date("2026-09-19T17:00:00"), publicado: true, createdAt: new Date("2026-08-15"), updatedAt: new Date("2026-08-15"), semana: demoSemanas[6] },
  // Semana 2
  { id: "cl-1h-2-1", semanaId: "sem-1h-2", numero: 4, titulo: "Condicionales en la práctica", descripcion: "Uso de if, elif, else", videoUrl: "https://ejemplo.com/h4", duracionMinutos: 180, modalidad: "hibrida", ubicacionPresencial: "Aula 101 - Edificio Principal", capacidadPresencial: 35, fechaProgramada: new Date("2026-09-26T17:00:00"), publicado: true, createdAt: new Date("2026-08-15"), updatedAt: new Date("2026-08-15"), semana: demoSemanas[7] },
  { id: "cl-1h-2-2", semanaId: "sem-1h-2", numero: 5, titulo: "Bucles y colecciones", descripcion: "For, while, listas, tuplas y diccionarios", videoUrl: "https://ejemplo.com/h5", duracionMinutos: 180, modalidad: "hibrida", ubicacionPresencial: "Aula 101 - Edificio Principal", capacidadPresencial: 35, fechaProgramada: new Date("2026-10-03T17:00:00"), publicado: true, createdAt: new Date("2026-08-15"), updatedAt: new Date("2026-08-15"), semana: demoSemanas[7] },
  { id: "cl-1h-2-3", semanaId: "sem-1h-2", numero: 6, titulo: "Reto: automatiza una tarea", descripcion: "Proyecto práctico integrando lo aprendido", videoUrl: "https://ejemplo.com/h6", duracionMinutos: 180, modalidad: "hibrida", ubicacionPresencial: "Aula 101 - Edificio Principal", capacidadPresencial: 35, fechaProgramada: new Date("2026-10-10T17:00:00"), publicado: true, createdAt: new Date("2026-08-15"), updatedAt: new Date("2026-08-15"), semana: demoSemanas[7] },
  // Semana 3
  { id: "cl-1h-3-1", semanaId: "sem-1h-3", numero: 7, titulo: "Funciones reutilizables", descripcion: "Definición, parámetros, retorno y scope", videoUrl: "https://ejemplo.com/h7", duracionMinutos: 180, modalidad: "hibrida", ubicacionPresencial: "Aula 101 - Edificio Principal", capacidadPresencial: 35, fechaProgramada: new Date("2026-10-17T17:00:00"), publicado: true, createdAt: new Date("2026-08-15"), updatedAt: new Date("2026-08-15"), semana: demoSemanas[8] },
  { id: "cl-1h-3-2", semanaId: "sem-1h-3", numero: 8, titulo: "Organización del código", descripcion: "Módulos, paquetes y mejores prácticas", videoUrl: "https://ejemplo.com/h8", duracionMinutos: 180, modalidad: "hibrida", ubicacionPresencial: "Aula 101 - Edificio Principal", capacidadPresencial: 35, fechaProgramada: new Date("2026-10-24T17:00:00"), publicado: true, createdAt: new Date("2026-08-15"), updatedAt: new Date("2026-08-15"), semana: demoSemanas[8] },
  { id: "cl-1h-3-3", semanaId: "sem-1h-3", numero: 9, titulo: "Proyecto final guiado", descripcion: "Desarrollo completo de un proyecto integrador", videoUrl: "https://ejemplo.com/h9", duracionMinutos: 180, modalidad: "hibrida", ubicacionPresencial: "Aula 101 - Edificio Principal", capacidadPresencial: 35, fechaProgramada: new Date("2026-10-31T17:00:00"), publicado: true, createdAt: new Date("2026-08-15"), updatedAt: new Date("2026-08-15"), semana: demoSemanas[8] },

  // Sección 2-V (Virtual) - Solo 3 clases demo
  { id: "cl-2v-1-1", semanaId: "sem-2v-1", numero: 1, titulo: "Bienvenida y herramientas", descripcion: "Configuración del entorno: Node, Vite, Git", videoUrl: "https://ejemplo.com/react1", duracionMinutos: 12, modalidad: "virtual", ubicacionPresencial: null, capacidadPresencial: null, fechaProgramada: new Date("2026-10-01T19:00:00"), publicado: true, createdAt: new Date("2026-09-15"), updatedAt: new Date("2026-09-15"), semana: demoSemanas[9] },
  { id: "cl-2v-1-2", semanaId: "sem-2v-1", numero: 2, titulo: "Componentes y propiedades", descripcion: "Creando componentes funcionales y pasando props", videoUrl: "https://ejemplo.com/react2", duracionMinutos: 24, modalidad: "virtual", ubicacionPresencial: null, capacidadPresencial: null, fechaProgramada: new Date("2026-10-06T19:00:00"), publicado: true, createdAt: new Date("2026-09-15"), updatedAt: new Date("2026-09-15"), semana: demoSemanas[9] },
  { id: "cl-2v-1-3", semanaId: "sem-2v-1", numero: 3, titulo: "Composición de interfaces", descripcion: "Children, composición vs herencia, patrones", videoUrl: "https://ejemplo.com/react3", duracionMinutos: 20, modalidad: "virtual", ubicacionPresencial: null, capacidadPresencial: null, fechaProgramada: new Date("2026-10-08T19:00:00"), publicado: true, createdAt: new Date("2026-09-15"), updatedAt: new Date("2026-09-15"), semana: demoSemanas[9] },

  // Sección 2-H (Híbrida) - Solo 3 clases demo
  { id: "cl-2h-1-1", semanaId: "sem-2h-1", numero: 1, titulo: "Bienvenida y herramientas", descripcion: "Configuración del entorno: Node, Vite, Git", videoUrl: "https://ejemplo.com/reacth1", duracionMinutos: 240, modalidad: "hibrida", ubicacionPresencial: "Aula 205 - Edificio Tech", capacidadPresencial: 25, fechaProgramada: new Date("2026-10-04T09:00:00"), publicado: true, createdAt: new Date("2026-09-15"), updatedAt: new Date("2026-09-15"), semana: demoSemanas[12] },
  { id: "cl-2h-1-2", semanaId: "sem-2h-1", numero: 2, titulo: "Componentes y propiedades", descripcion: "Creando componentes funcionales y pasando props", videoUrl: "https://ejemplo.com/reacth2", duracionMinutos: 240, modalidad: "hibrida", ubicacionPresencial: "Aula 205 - Edificio Tech", capacidadPresencial: 25, fechaProgramada: new Date("2026-10-11T09:00:00"), publicado: true, createdAt: new Date("2026-09-15"), updatedAt: new Date("2026-09-15"), semana: demoSemanas[12] },
  { id: "cl-2h-1-3", semanaId: "sem-2h-1", numero: 3, titulo: "Composición de interfaces", descripcion: "Children, composición vs herencia, patrones", videoUrl: "https://ejemplo.com/reacth3", duracionMinutos: 240, modalidad: "hibrida", ubicacionPresencial: "Aula 205 - Edificio Tech", capacidadPresencial: 25, fechaProgramada: new Date("2026-10-18T09:00:00"), publicado: true, createdAt: new Date("2026-09-15"), updatedAt: new Date("2026-09-15"), semana: demoSemanas[12] },

  // Sección 3-P (Presencial) - Solo 3 clases demo
  { id: "cl-3p-1-1", semanaId: "sem-3p-1", numero: 1, titulo: "Entorno y organización de datos", descripcion: "Interfaz de Excel, celdas, rangos, formato", videoUrl: null, duracionMinutos: 120, modalidad: "presencial", ubicacionPresencial: "Aula Informática 1", capacidadPresencial: 30, fechaProgramada: new Date("2026-09-16T18:00:00"), publicado: true, createdAt: new Date("2026-09-01"), updatedAt: new Date("2026-09-01"), semana: demoSemanas[15] },
  { id: "cl-3p-1-2", semanaId: "sem-3p-1", numero: 2, titulo: "Fórmulas esenciales", descripcion: "SUM, AVERAGE, IF, VLOOKUP, referencias", videoUrl: null, duracionMinutos: 120, modalidad: "presencial", ubicacionPresencial: "Aula Informática 1", capacidadPresencial: 30, fechaProgramada: new Date("2026-09-18T18:00:00"), publicado: true, createdAt: new Date("2026-09-01"), updatedAt: new Date("2026-09-01"), semana: demoSemanas[15] },
  { id: "cl-3p-1-3", semanaId: "sem-3p-1", numero: 3, titulo: "Formato y claridad", descripcion: "Formato condicional, validación de datos", videoUrl: null, duracionMinutos: 120, modalidad: "presencial", ubicacionPresencial: "Aula Informática 1", capacidadPresencial: 30, fechaProgramada: new Date("2026-09-23T18:00:00"), publicado: true, createdAt: new Date("2026-09-01"), updatedAt: new Date("2026-09-01"), semana: demoSemanas[15] },
];

// ============================================================================
// FUNCIONES HELPER
// ============================================================================

export function getCursoBase(cursoId: string): CursoBase | undefined {
  return demoCursosBase.find((c) => c.id === cursoId);
}

export function getSeccionesByCurso(cursoId: string): Seccion[] {
  return demoSecciones.filter((s) => s.cursoId === cursoId);
}

export function getSeccion(seccionId: string): Seccion | undefined {
  return demoSecciones.find((s) => s.id === seccionId);
}

export function getSemanasBySeccion(seccionId: string): Semana[] {
  return demoSemanas.filter((s) => s.seccionId === seccionId);
}

export function getClasesBySeccion(seccionId: string): ClaseConAsistencia[] {
  const semanas = getSemanasBySeccion(seccionId);
  const semanaIds = semanas.map((s) => s.id);
  return demoClases.filter((c) => semanaIds.includes(c.semanaId));
}

export function getClasesBySemana(semanaId: string): ClaseConAsistencia[] {
  return demoClases.filter((c) => c.semanaId === semanaId);
}

export function getClase(claseId: string): ClaseConAsistencia | undefined {
  return demoClases.find((c) => c.id === claseId);
}

// ============================================================================
// CONFIGURACIÓN DE ASISTENCIA POR SECCIÓN (DEMO)
// ============================================================================

export const demoConfiguracionAsistencia: Record<string, ConfiguracionAsistencia> = {
  "sec-1-v": { id: "cfg-1v", seccionId: "sec-1-v", permitirEleccionModalidad: false, horasLimiteEleccion: 2, requerirJustificacion: false, permitirAutoRegistro: true, ventanaAutoRegistroMinutos: 15, createdAt: new Date("2026-08-01"), updatedAt: new Date("2026-08-01") },
  "sec-1-p": { id: "cfg-1p", seccionId: "sec-1-p", permitirEleccionModalidad: false, horasLimiteEleccion: 2, requerirJustificacion: true, permitirAutoRegistro: true, ventanaAutoRegistroMinutos: 15, createdAt: new Date("2026-08-01"), updatedAt: new Date("2026-08-01") },
  "sec-1-h": { id: "cfg-1h", seccionId: "sec-1-h", permitirEleccionModalidad: true, horasLimiteEleccion: 4, requerirJustificacion: false, permitirAutoRegistro: true, ventanaAutoRegistroMinutos: 15, createdAt: new Date("2026-08-01"), updatedAt: new Date("2026-08-01") },
  "sec-2-v": { id: "cfg-2v", seccionId: "sec-2-v", permitirEleccionModalidad: false, horasLimiteEleccion: 2, requerirJustificacion: false, permitirAutoRegistro: true, ventanaAutoRegistroMinutos: 15, createdAt: new Date("2026-09-01"), updatedAt: new Date("2026-09-01") },
  "sec-2-h": { id: "cfg-2h", seccionId: "sec-2-h", permitirEleccionModalidad: true, horasLimiteEleccion: 4, requerirJustificacion: true, permitirAutoRegistro: false, ventanaAutoRegistroMinutos: 10, createdAt: new Date("2026-09-01"), updatedAt: new Date("2026-09-01") },
  "sec-3-p": { id: "cfg-3p", seccionId: "sec-3-p", permitirEleccionModalidad: false, horasLimiteEleccion: 1, requerirJustificacion: false, permitirAutoRegistro: true, ventanaAutoRegistroMinutos: 20, createdAt: new Date("2026-08-15"), updatedAt: new Date("2026-08-15") },
};

export function getConfiguracionAsistencia(seccionId: string): ConfiguracionAsistencia {
  return demoConfiguracionAsistencia[seccionId] ?? {
    id: `cfg-${seccionId}`,
    seccionId,
    permitirEleccionModalidad: true,
    horasLimiteEleccion: 2,
    requerirJustificacion: false,
    permitirAutoRegistro: true,
    ventanaAutoRegistroMinutos: 15,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

// ============================================================================
// PREFERENCIAS DE MODALIDAD (DEMO) - Solo para secciones híbridas
// ============================================================================

export const demoPreferenciasModalidad: PreferenciaModalidad[] = [
  // Alumno Valeria (id: "4") en sección híbrida 1-H
  { id: "pref-1", alumnoId: "4", claseId: "cl-1h-1-1", modalidadElegida: "virtual", fechaEleccion: new Date("2026-09-01T10:00:00"), updatedAt: new Date("2026-09-01T10:00:00") },
  { id: "pref-2", alumnoId: "4", claseId: "cl-1h-1-2", modalidadElegida: "presencial", fechaEleccion: new Date("2026-09-10T14:00:00"), updatedAt: new Date("2026-09-10T14:00:00") },
  { id: "pref-3", alumnoId: "4", claseId: "cl-1h-1-3", modalidadElegida: "virtual", fechaEleccion: new Date("2026-09-15T09:00:00"), updatedAt: new Date("2026-09-15T09:00:00") },
  { id: "pref-4", alumnoId: "4", claseId: "cl-1h-2-1", modalidadElegida: "presencial", fechaEleccion: new Date("2026-09-20T11:00:00"), updatedAt: new Date("2026-09-20T11:00:00") },
  { id: "pref-5", alumnoId: "4", claseId: "cl-1h-2-2", modalidadElegida: "virtual", fechaEleccion: new Date("2026-09-25T16:00:00"), updatedAt: new Date("2026-09-25T16:00:00") },
  // Alumno Valeria en sección híbrida 2-H
  { id: "pref-6", alumnoId: "4", claseId: "cl-2h-1-1", modalidadElegida: "presencial", fechaEleccion: new Date("2026-10-01T10:00:00"), updatedAt: new Date("2026-10-01T10:00:00") },
  { id: "pref-7", alumnoId: "4", claseId: "cl-2h-1-2", modalidadElegida: "virtual", fechaEleccion: new Date("2026-10-05T14:00:00"), updatedAt: new Date("2026-10-05T14:00:00") },
];

export function getPreferenciasModalidad(alumnoId: string, seccionId: string): PreferenciaModalidad[] {
  const clases = getClasesBySeccion(seccionId);
  const claseIds = clases.map((c) => c.id);
  return demoPreferenciasModalidad.filter((p) => p.alumnoId === alumnoId && claseIds.includes(p.claseId));
}

export function getPreferenciaModalidad(alumnoId: string, claseId: string): PreferenciaModalidad | undefined {
  return demoPreferenciasModalidad.find((p) => p.alumnoId === alumnoId && p.claseId === claseId);
}

// ============================================================================
// REGISTROS DE ASISTENCIA (DEMO)
// ============================================================================

export const demoAsistencias: Asistencia[] = [
  // Sección 1-H (Híbrida) - Valeria
  { id: "asist-1", alumnoId: "4", claseId: "cl-1h-1-1", modalidadAsistencia: "virtual", estado: "presente", metodoRegistro: "self", observaciones: null, registradoPor: "4", fechaRegistro: new Date("2026-09-05T17:05:00"), createdAt: new Date("2026-09-05T17:05:00"), updatedAt: new Date("2026-09-05T17:05:00"), alumno: { id: "4", nombre: "Valeria", apellido: "Rojas", email: "alumno@edukatech.pe", codigoAlumno: "ALU-2026-001", fotoPerfil: null } },
  { id: "asist-2", alumnoId: "4", claseId: "cl-1h-1-2", modalidadAsistencia: "presencial", estado: "presente", metodoRegistro: "qr", observaciones: null, registradoPor: "4", fechaRegistro: new Date("2026-09-12T17:02:00"), createdAt: new Date("2026-09-12T17:02:00"), updatedAt: new Date("2026-09-12T17:02:00"), alumno: { id: "4", nombre: "Valeria", apellido: "Rojas", email: "alumno@edukatech.pe", codigoAlumno: "ALU-2026-001", fotoPerfil: null } },
  { id: "asist-3", alumnoId: "4", claseId: "cl-1h-1-3", modalidadAsistencia: "virtual", estado: "presente", metodoRegistro: "self", observaciones: null, registradoPor: "4", fechaRegistro: new Date("2026-09-19T17:03:00"), createdAt: new Date("2026-09-19T17:03:00"), updatedAt: new Date("2026-09-19T17:03:00"), alumno: { id: "4", nombre: "Valeria", apellido: "Rojas", email: "alumno@edukatech.pe", codigoAlumno: "ALU-2026-001", fotoPerfil: null } },
  { id: "asist-4", alumnoId: "4", claseId: "cl-1h-2-1", modalidadAsistencia: "presencial", estado: "presente", metodoRegistro: "qr", observaciones: null, registradoPor: "4", fechaRegistro: new Date("2026-09-26T17:01:00"), createdAt: new Date("2026-09-26T17:01:00"), updatedAt: new Date("2026-09-26T17:01:00"), alumno: { id: "4", nombre: "Valeria", apellido: "Rojas", email: "alumno@edukatech.pe", codigoAlumno: "ALU-2026-001", fotoPerfil: null } },
  { id: "asist-5", alumnoId: "4", claseId: "cl-1h-2-2", modalidadAsistencia: "virtual", estado: "tardanza", metodoRegistro: "manual", observaciones: "Se conectó 15 min tarde", registradoPor: "prof-1", fechaRegistro: new Date("2026-10-03T17:20:00"), createdAt: new Date("2026-10-03T17:20:00"), updatedAt: new Date("2026-10-03T17:20:00"), alumno: { id: "4", nombre: "Valeria", apellido: "Rojas", email: "alumno@edukatech.pe", codigoAlumno: "ALU-2026-001", fotoPerfil: null } },
  { id: "asist-6", alumnoId: "4", claseId: "cl-1h-2-3", modalidadAsistencia: "presencial", estado: "justificado", metodoRegistro: "manual", observaciones: "Certificado médico adjunto", registradoPor: "prof-1", fechaRegistro: new Date("2026-10-10T17:00:00"), createdAt: new Date("2026-10-10T17:00:00"), updatedAt: new Date("2026-10-10T17:00:00"), alumno: { id: "4", nombre: "Valeria", apellido: "Rojas", email: "alumno@edukatech.pe", codigoAlumno: "ALU-2026-001", fotoPerfil: null } },
  // Sección 1-V (Virtual) - Valeria
  { id: "asist-7", alumnoId: "4", claseId: "cl-1v-1-1", modalidadAsistencia: "virtual", estado: "presente", metodoRegistro: "self", observaciones: null, registradoPor: "4", fechaRegistro: new Date("2026-09-01T19:05:00"), createdAt: new Date("2026-09-01T19:05:00"), updatedAt: new Date("2026-09-01T19:05:00"), alumno: { id: "4", nombre: "Valeria", apellido: "Rojas", email: "alumno@edukatech.pe", codigoAlumno: "ALU-2026-001", fotoPerfil: null } },
  { id: "asist-8", alumnoId: "4", claseId: "cl-1v-1-2", modalidadAsistencia: "virtual", estado: "presente", metodoRegistro: "manual", observaciones: null, registradoPor: "prof-1", fechaRegistro: new Date("2026-09-03T19:10:00"), createdAt: new Date("2026-09-03T19:10:00"), updatedAt: new Date("2026-09-03T19:10:00"), alumno: { id: "4", nombre: "Valeria", apellido: "Rojas", email: "alumno@edukatech.pe", codigoAlumno: "ALU-2026-001", fotoPerfil: null } },
  // Sección 2-H (Híbrida) - Valeria
  { id: "asist-9", alumnoId: "4", claseId: "cl-2h-1-1", modalidadAsistencia: "presencial", estado: "presente", metodoRegistro: "qr", observaciones: null, registradoPor: "4", fechaRegistro: new Date("2026-10-04T09:02:00"), createdAt: new Date("2026-10-04T09:02:00"), updatedAt: new Date("2026-10-04T09:02:00"), alumno: { id: "4", nombre: "Valeria", apellido: "Rojas", email: "alumno@edukatech.pe", codigoAlumno: "ALU-2026-001", fotoPerfil: null } },
  { id: "asist-10", alumnoId: "4", claseId: "cl-2h-1-2", modalidadAsistencia: "virtual", estado: "presente", metodoRegistro: "self", observaciones: null, registradoPor: "4", fechaRegistro: new Date("2026-10-11T09:03:00"), createdAt: new Date("2026-10-11T09:03:00"), updatedAt: new Date("2026-10-11T09:03:00"), alumno: { id: "4", nombre: "Valeria", apellido: "Rojas", email: "alumno@edukatech.pe", codigoAlumno: "ALU-2026-001", fotoPerfil: null } },
  // Otros alumnos para vista profesor (sección 1-H)
  { id: "asist-11", alumnoId: "1", claseId: "cl-1h-1-1", modalidadAsistencia: "presencial", estado: "presente", metodoRegistro: "qr", observaciones: null, registradoPor: "1", fechaRegistro: new Date("2026-09-05T17:01:00"), createdAt: new Date("2026-09-05T17:01:00"), updatedAt: new Date("2026-09-05T17:01:00"), alumno: { id: "1", nombre: "Juan", apellido: "Pérez", email: "juan@email.com", codigoAlumno: "ALU-2026-002", fotoPerfil: null } },
  { id: "asist-12", alumnoId: "2", claseId: "cl-1h-1-1", modalidadAsistencia: "virtual", estado: "presente", metodoRegistro: "self", observaciones: null, registradoPor: "2", fechaRegistro: new Date("2026-09-05T17:02:00"), createdAt: new Date("2026-09-05T17:02:00"), updatedAt: new Date("2026-09-05T17:02:00"), alumno: { id: "2", nombre: "María", apellido: "López", email: "maria@email.com", codigoAlumno: "ALU-2026-003", fotoPerfil: null } },
  { id: "asist-13", alumnoId: "5", claseId: "cl-1h-1-1", modalidadAsistencia: "presencial", estado: "ausente", metodoRegistro: "manual", observaciones: null, registradoPor: "prof-1", fechaRegistro: new Date("2026-09-05T17:00:00"), createdAt: new Date("2026-09-05T17:00:00"), updatedAt: new Date("2026-09-05T17:00:00"), alumno: { id: "5", nombre: "Diego", apellido: "Salas", email: "diego@email.com", codigoAlumno: "ALU-2026-004", fotoPerfil: null } },
  { id: "asist-14", alumnoId: "6", claseId: "cl-1h-1-1", modalidadAsistencia: "virtual", estado: "presente", metodoRegistro: "self", observaciones: null, registradoPor: "6", fechaRegistro: new Date("2026-09-05T17:03:00"), createdAt: new Date("2026-09-05T17:03:00"), updatedAt: new Date("2026-09-05T17:03:00"), alumno: { id: "6", nombre: "Lucía", apellido: "Torres", email: "lucia@email.com", codigoAlumno: "ALU-2026-005", fotoPerfil: null } },
];

export function getAsistenciasPorClase(claseId: string): Asistencia[] {
  return demoAsistencias.filter((a) => a.claseId === claseId);
}

export function getAsistenciasPorAlumno(alumnoId: string, seccionId: string): Asistencia[] {
  const clases = getClasesBySeccion(seccionId);
  const claseIds = clases.map((c) => c.id);
  return demoAsistencias.filter((a) => a.alumnoId === alumnoId && claseIds.includes(a.claseId));
}

export function getAsistencia(alumnoId: string, claseId: string): Asistencia | undefined {
  return demoAsistencias.find((a) => a.alumnoId === alumnoId && a.claseId === claseId);
}

// ============================================================================
// ALUMNOS INSCRITOS POR SECCIÓN (DEMO)
// ============================================================================

const demoAlumnosInscritos: Record<string, { id: string; nombre: string; apellido: string; email: string; codigoAlumno: string; fotoPerfil: string | null }[]> = {
  "sec-1-v": [
    { id: "1", nombre: "Juan", apellido: "Pérez", email: "juan@email.com", codigoAlumno: "ALU-2026-002", fotoPerfil: null },
    { id: "2", nombre: "María", apellido: "López", email: "maria@email.com", codigoAlumno: "ALU-2026-003", fotoPerfil: null },
    { id: "4", nombre: "Valeria", apellido: "Rojas", email: "alumno@edukatech.pe", codigoAlumno: "ALU-2026-001", fotoPerfil: null },
    { id: "5", nombre: "Diego", apellido: "Salas", email: "diego@email.com", codigoAlumno: "ALU-2026-004", fotoPerfil: null },
    { id: "6", nombre: "Lucía", apellido: "Torres", email: "lucia@email.com", codigoAlumno: "ALU-2026-005", fotoPerfil: null },
  ],
  "sec-1-p": [
    { id: "1", nombre: "Juan", apellido: "Pérez", email: "juan@email.com", codigoAlumno: "ALU-2026-002", fotoPerfil: null },
    { id: "4", nombre: "Valeria", apellido: "Rojas", email: "alumno@edukatech.pe", codigoAlumno: "ALU-2026-001", fotoPerfil: null },
    { id: "7", nombre: "Carlos", apellido: "Ruiz", email: "carlos@email.com", codigoAlumno: "ALU-2026-006", fotoPerfil: null },
  ],
  "sec-1-h": [
    { id: "1", nombre: "Juan", apellido: "Pérez", email: "juan@email.com", codigoAlumno: "ALU-2026-002", fotoPerfil: null },
    { id: "2", nombre: "María", apellido: "López", email: "maria@email.com", codigoAlumno: "ALU-2026-003", fotoPerfil: null },
    { id: "4", nombre: "Valeria", apellido: "Rojas", email: "alumno@edukatech.pe", codigoAlumno: "ALU-2026-001", fotoPerfil: null },
    { id: "5", nombre: "Diego", apellido: "Salas", email: "diego@email.com", codigoAlumno: "ALU-2026-004", fotoPerfil: null },
    { id: "6", nombre: "Lucía", apellido: "Torres", email: "lucia@email.com", codigoAlumno: "ALU-2026-005", fotoPerfil: null },
  ],
  "sec-2-v": [
    { id: "1", nombre: "Juan", apellido: "Pérez", email: "juan@email.com", codigoAlumno: "ALU-2026-002", fotoPerfil: null },
    { id: "4", nombre: "Valeria", apellido: "Rojas", email: "alumno@edukatech.pe", codigoAlumno: "ALU-2026-001", fotoPerfil: null },
  ],
  "sec-2-h": [
    { id: "4", nombre: "Valeria", apellido: "Rojas", email: "alumno@edukatech.pe", codigoAlumno: "ALU-2026-001", fotoPerfil: null },
    { id: "8", nombre: "Sofía", apellido: "Herrera", email: "sofia@email.com", codigoAlumno: "ALU-2026-007", fotoPerfil: null },
  ],
  "sec-3-p": [
    { id: "2", nombre: "María", apellido: "López", email: "maria@email.com", codigoAlumno: "ALU-2026-003", fotoPerfil: null },
    { id: "5", nombre: "Diego", apellido: "Salas", email: "diego@email.com", codigoAlumno: "ALU-2026-004", fotoPerfil: null },
  ],
};

export function getAlumnosInscritos(seccionId: string) {
  return demoAlumnosInscritos[seccionId] ?? [];
}

// ============================================================================
// VISTAS CONSOLIDADAS PARA PROFESOR
// ============================================================================

export function getAsistenciaClaseProfesor(seccionId: string, claseId: string): AsistenciaClaseProfesor {
  const seccion = getSeccion(seccionId);
  const clase = getClase(claseId);
  const alumnos = getAlumnosInscritos(seccionId);
  const asistencias = getAsistenciasPorClase(claseId);
  const preferencias = demoPreferenciasModalidad.filter((p) => p.claseId === claseId);

  if (!seccion || !clase) {
    throw new Error(`Sección ${seccionId} o clase ${claseId} no encontrada`);
  }

  const alumnosDetalle: AsistenciaAlumnoDetalle[] = alumnos.map((alumno) => {
    const asistencia = asistencias.find((a) => a.alumnoId === alumno.id);
    const preferencia = preferencias.find((p) => p.alumnoId === alumno.id);
    return {
      alumnoId: alumno.id,
      nombre: alumno.nombre,
      apellido: alumno.apellido,
      email: alumno.email,
      codigoAlumno: alumno.codigoAlumno,
      fotoPerfil: alumno.fotoPerfil,
      modalidadElegida: preferencia?.modalidadElegida ?? null,
      asistencia: asistencia ?? null,
      puedeRegistrar: false,
    };
  });

  const presentes = asistencias.filter((a) => a.estado === "presente").length;
  const ausentes = asistencias.filter((a) => a.estado === "ausente").length;
  const tardanzas = asistencias.filter((a) => a.estado === "tardanza").length;
  const justificados = asistencias.filter((a) => a.estado === "justificado").length;

  const virtualAsistencias = asistencias.filter((a) => a.modalidadAsistencia === "virtual");
  const presencialAsistencias = asistencias.filter((a) => a.modalidadAsistencia === "presencial");

  return {
    clase,
    seccion,
    totalInscritos: alumnos.length,
    presentes,
    ausentes,
    tardanzas,
    justificados,
    porModalidad: {
      virtual: {
        presentes: virtualAsistencias.filter((a) => a.estado === "presente").length,
        ausentes: virtualAsistencias.filter((a) => a.estado === "ausente").length,
        total: virtualAsistencias.length,
      },
      presencial: {
        presentes: presencialAsistencias.filter((a) => a.estado === "presente").length,
        ausentes: presencialAsistencias.filter((a) => a.estado === "ausente").length,
        total: presencialAsistencias.length,
      },
    },
    alumnos: alumnosDetalle,
  };
}

// ============================================================================
// VISTA PARA ALUMNO
// ============================================================================

export function getAsistenciaAlumnoSeccion(alumnoId: string, seccionId: string): AsistenciaAlumnoSeccion {
  const seccion = getSeccion(seccionId);
  const clases = getClasesBySeccion(seccionId);
  const asistencias = getAsistenciasPorAlumno(alumnoId, seccionId);
  const preferencias = getPreferenciasModalidad(alumnoId, seccionId);
  const config = getConfiguracionAsistencia(seccionId);

  if (!seccion) {
    throw new Error(`Sección ${seccionId} no encontrada`);
  }

  const clasesAlumno: AsistenciaClaseAlumno[] = clases.map((clase) => {
    const asistencia = asistencias.find((a) => a.claseId === clase.id);
    const preferencia = preferencias.find((p) => p.claseId === clase.id);
    const horasRestantes = 24; // TODO: calcular real

    return {
      claseId: clase.id,
      claseNumero: clase.numero,
      claseTitulo: clase.titulo,
      fechaClase: clase.fechaProgramada,
      modalidadClase: clase.modalidad,
      ubicacionPresencial: clase.ubicacionPresencial,
      modalidadElegida: preferencia?.modalidadElegida ?? null,
      puedeCambiarModalidad: config.permitirEleccionModalidad && horasRestantes > 0,
      horasRestantesEleccion: config.permitirEleccionModalidad ? horasRestantes : null,
      asistencia: asistencia
        ? {
            estado: asistencia.estado,
            modalidadAsistencia: asistencia.modalidadAsistencia,
            fechaRegistro: asistencia.fechaRegistro,
            metodoRegistro: asistencia.metodoRegistro,
          }
        : null,
    };
  });

  const totalClases = clases.length;
  const asistidas = clasesAlumno.filter((c) => c.asistencia?.estado === "presente" || c.asistencia?.estado === "tardanza" || c.asistencia?.estado === "justificado").length;
  const ausentes = clasesAlumno.filter((c) => c.asistencia?.estado === "ausente").length;
  const porcentajeAsistencia = totalClases > 0 ? Math.round((asistidas / totalClases) * 100) : 0;

  return {
    seccionId,
    seccionCodigo: seccion.codigo,
    cursoTitulo: seccion.curso?.titulo ?? "Curso",
    modalidadSeccion: seccion.modalidad,
    clases: clasesAlumno,
    resumen: {
      totalClases,
      asistidas,
      ausentes,
      porcentajeAsistencia,
    },
  };
}