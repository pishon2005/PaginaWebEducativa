/**
 * Datos de demostración para el sistema de asistencia
 * Compatible con el sistema demo existente
 */

import type {
  ModalidadClase,
  ModalidadAsistencia,
  EstadoAsistencia,
  MetodoRegistroAsistencia,
  ClaseConAsistencia,
  PreferenciaModalidad,
  Asistencia,
  ConfiguracionAsistencia,
  AsistenciaClaseProfesor,
  AsistenciaAlumnoDetalle,
  AsistenciaAlumnoCurso,
  AsistenciaClaseAlumno,
} from "./tipos";

// ============================================================================
// CONFIGURACIÓN DE ASISTENCIA POR CURSO (DEMO)
// ============================================================================

export const demoConfiguracionAsistencia: Record<string, ConfiguracionAsistencia> = {
  "1": {
    id: "cfg-1",
    cursoId: "1",
    permitirEleccionModalidad: true,
    horasLimiteEleccion: 2,
    requerirJustificacion: false,
    permitirAutoRegistro: true,
    ventanaAutoRegistroMinutos: 15,
    createdAt: new Date("2026-01-15"),
    updatedAt: new Date("2026-01-15"),
  },
  "2": {
    id: "cfg-2",
    cursoId: "2",
    permitirEleccionModalidad: true,
    horasLimiteEleccion: 4,
    requerirJustificacion: true,
    permitirAutoRegistro: false,
    ventanaAutoRegistroMinutos: 10,
    createdAt: new Date("2026-02-01"),
    updatedAt: new Date("2026-02-01"),
  },
  "3": {
    id: "cfg-3",
    cursoId: "3",
    permitirEleccionModalidad: false,
    horasLimiteEleccion: 1,
    requerirJustificacion: false,
    permitirAutoRegistro: true,
    ventanaAutoRegistroMinutos: 20,
    createdAt: new Date("2026-03-01"),
    updatedAt: new Date("2026-03-01"),
  },
};

export function getConfiguracionAsistencia(cursoId: string): ConfiguracionAsistencia {
  return demoConfiguracionAsistencia[cursoId] ?? {
    id: `cfg-${cursoId}`,
    cursoId,
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
// CLASES CON MODALIDAD (EXTENDIENDO DEMO EXISTENTE)
// ============================================================================

// Extender las clases demo con modalidad
export const demoClasesConModalidad: Record<string, ClaseConAsistencia[]> = {
  "1": [ // Fundamentos de Python
    {
      id: "clase-1-1",
      numero: 1,
      titulo: "Bienvenida y entorno de trabajo",
      descripcion: "Configuración del entorno de desarrollo y primeros pasos",
      videoUrl: "https://ejemplo.com/video1",
      duracionMinutos: 10,
      modalidad: "hibrida",
      ubicacionPresencial: "Aula 101 - Edificio Principal",
      capacidadPresencial: 30,
      publicado: true,
      semanaId: "semana-1",
      semanaNumero: 1,
      semanaTitulo: "Primeros pasos",
    },
    {
      id: "clase-1-2",
      numero: 2,
      titulo: "Variables y tipos de datos",
      descripcion: "Tipos primitivos, variables y constantes en Python",
      videoUrl: "https://ejemplo.com/video2",
      duracionMinutos: 18,
      modalidad: "virtual",
      ubicacionPresencial: null,
      capacidadPresencial: null,
      publicado: true,
      semanaId: "semana-1",
      semanaNumero: 1,
      semanaTitulo: "Primeros pasos",
    },
    {
      id: "clase-1-3",
      numero: 3,
      titulo: "Tu primer programa",
      descripcion: "Escribiendo y ejecutando tu primer script en Python",
      videoUrl: "https://ejemplo.com/video3",
      duracionMinutos: 22,
      modalidad: "presencial",
      ubicacionPresencial: "Laboratorio de Cómputo A",
      capacidadPresencial: 25,
      publicado: true,
      semanaId: "semana-1",
      semanaNumero: 1,
      semanaTitulo: "Primeros pasos",
    },
    {
      id: "clase-1-4",
      numero: 4,
      titulo: "Condicionales en la práctica",
      descripcion: "Uso de if, elif, else para toma de decisiones",
      videoUrl: "https://ejemplo.com/video4",
      duracionMinutos: 16,
      modalidad: "hibrida",
      ubicacionPresencial: "Aula 101 - Edificio Principal",
      capacidadPresencial: 30,
      publicado: true,
      semanaId: "semana-2",
      semanaNumero: 2,
      semanaTitulo: "Decisiones y repetición",
    },
    {
      id: "clase-1-5",
      numero: 5,
      titulo: "Bucles y colecciones",
      descripcion: "For, while, listas, tuplas y diccionarios",
      videoUrl: "https://ejemplo.com/video5",
      duracionMinutos: 20,
      modalidad: "virtual",
      ubicacionPresencial: null,
      capacidadPresencial: null,
      publicado: true,
      semanaId: "semana-2",
      semanaNumero: 2,
      semanaTitulo: "Decisiones y repetición",
    },
    {
      id: "clase-1-6",
      numero: 6,
      titulo: "Reto: automatiza una tarea",
      descripcion: "Proyecto práctico integrando lo aprendido",
      videoUrl: "https://ejemplo.com/video6",
      duracionMinutos: 25,
      modalidad: "presencial",
      ubicacionPresencial: "Laboratorio de Cómputo B",
      capacidadPresencial: 20,
      publicado: true,
      semanaId: "semana-2",
      semanaNumero: 2,
      semanaTitulo: "Decisiones y repetición",
    },
    {
      id: "clase-1-7",
      numero: 7,
      titulo: "Funciones reutilizables",
      descripcion: "Definición, parámetros, retorno y scope",
      videoUrl: "https://ejemplo.com/video7",
      duracionMinutos: 18,
      modalidad: "hibrida",
      ubicacionPresencial: "Aula 101 - Edificio Principal",
      capacidadPresencial: 30,
      publicado: true,
      semanaId: "semana-3",
      semanaNumero: 3,
      semanaTitulo: "Funciones y proyecto",
    },
    {
      id: "clase-1-8",
      numero: 8,
      titulo: "Organización del código",
      descripcion: "Módulos, paquetes y mejores prácticas",
      videoUrl: "https://ejemplo.com/video8",
      duracionMinutos: 20,
      modalidad: "virtual",
      ubicacionPresencial: null,
      capacidadPresencial: null,
      publicado: true,
      semanaId: "semana-3",
      semanaNumero: 3,
      semanaTitulo: "Funciones y proyecto",
    },
    {
      id: "clase-1-9",
      numero: 9,
      titulo: "Proyecto final guiado",
      descripcion: "Desarrollo completo de un proyecto integrador",
      videoUrl: "https://ejemplo.com/video9",
      duracionMinutos: 30,
      modalidad: "presencial",
      ubicacionPresencial: "Laboratorio de Cómputo A",
      capacidadPresencial: 25,
      publicado: true,
      semanaId: "semana-3",
      semanaNumero: 3,
      semanaTitulo: "Funciones y proyecto",
    },
  ],
  "2": [ // Desarrollo web con React
    {
      id: "clase-2-1",
      numero: 1,
      titulo: "Bienvenida y herramientas",
      descripcion: "Configuración del entorno: Node, Vite, Git",
      videoUrl: "https://ejemplo.com/react1",
      duracionMinutos: 12,
      modalidad: "virtual",
      ubicacionPresencial: null,
      capacidadPresencial: null,
      publicado: true,
      semanaId: "semana-2-1",
      semanaNumero: 1,
      semanaTitulo: "Componentes y entorno",
    },
    {
      id: "clase-2-2",
      numero: 2,
      titulo: "Componentes y propiedades",
      descripcion: "Creando componentes funcionales y pasando props",
      videoUrl: "https://ejemplo.com/react2",
      duracionMinutos: 24,
      modalidad: "hibrida",
      ubicacionPresencial: "Aula 205 - Edificio Tech",
      capacidadPresencial: 25,
      publicado: true,
      semanaId: "semana-2-1",
      semanaNumero: 1,
      semanaTitulo: "Componentes y entorno",
    },
    {
      id: "clase-2-3",
      numero: 3,
      titulo: "Composición de interfaces",
      descripcion: "Children, composición vs herencia, patrones",
      videoUrl: "https://ejemplo.com/react3",
      duracionMinutos: 20,
      modalidad: "virtual",
      ubicacionPresencial: null,
      capacidadPresencial: null,
      publicado: true,
      semanaId: "semana-2-1",
      semanaNumero: 1,
      semanaTitulo: "Componentes y entorno",
    },
  ],
  "3": [ // Excel para negocios
    {
      id: "clase-3-1",
      numero: 1,
      titulo: "Entorno y organización de datos",
      descripcion: "Interfaz de Excel, celdas, rangos, formato",
      videoUrl: "https://ejemplo.com/excel1",
      duracionMinutos: 12,
      modalidad: "presencial",
      ubicacionPresencial: "Aula Informática 1",
      capacidadPresencial: 30,
      publicado: true,
      semanaId: "semana-3-1",
      semanaNumero: 1,
      semanaTitulo: "Fundamentos de hojas de cálculo",
    },
    {
      id: "clase-3-2",
      numero: 2,
      titulo: "Fórmulas esenciales",
      descripcion: "SUM, AVERAGE, IF, VLOOKUP, referencias",
      videoUrl: "https://ejemplo.com/excel2",
      duracionMinutos: 20,
      modalidad: "presencial",
      ubicacionPresencial: "Aula Informática 1",
      capacidadPresencial: 30,
      publicado: true,
      semanaId: "semana-3-1",
      semanaNumero: 1,
      semanaTitulo: "Fundamentos de hojas de cálculo",
    },
  ],
};

export function getClasesConModalidad(cursoId: string): ClaseConAsistencia[] {
  return demoClasesConModalidad[cursoId] ?? [];
}

export function getClaseConModalidad(cursoId: string, claseId: string): ClaseConAsistencia | undefined {
  return demoClasesConModalidad[cursoId]?.find((c) => c.id === claseId);
}

// ============================================================================
// PREFERENCIAS DE MODALIDAD (DEMO)
// ============================================================================

// Alumno demo: Valeria Rojas (id: "4", email: "alumno@edukatech.pe")
export const demoPreferenciasModalidad: PreferenciaModalidad[] = [
  // Curso 1 - Valeria eligió virtual para clases híbridas
  { id: "pref-1", alumnoId: "4", claseId: "clase-1-1", modalidadElegida: "virtual", fechaEleccion: new Date("2026-09-01T10:00:00"), updatedAt: new Date("2026-09-01T10:00:00") },
  { id: "pref-2", alumnoId: "4", claseId: "clase-1-4", modalidadElegida: "presencial", fechaEleccion: new Date("2026-09-15T14:00:00"), updatedAt: new Date("2026-09-15T14:00:00") },
  { id: "pref-3", alumnoId: "4", claseId: "clase-1-7", modalidadElegida: "virtual", fechaEleccion: new Date("2026-10-01T09:00:00"), updatedAt: new Date("2026-10-01T09:00:00") },
  // Curso 2
  { id: "pref-4", alumnoId: "4", claseId: "clase-2-2", modalidadElegida: "presencial", fechaEleccion: new Date("2026-09-10T11:00:00"), updatedAt: new Date("2026-09-10T11:00:00") },
];

export function getPreferenciasModalidad(alumnoId: string, cursoId: string): PreferenciaModalidad[] {
  const clases = getClasesConModalidad(cursoId);
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
  // Clase 1-1 (Híbrida) - Valeria eligió virtual, asistió virtual
  {
    id: "asist-1",
    alumnoId: "4",
    claseId: "clase-1-1",
    modalidadAsistencia: "virtual",
    estado: "presente",
    metodoRegistro: "self",
    observaciones: null,
    registradoPor: "4",
    fechaRegistro: new Date("2026-09-01T18:05:00"),
    createdAt: new Date("2026-09-01T18:05:00"),
    updatedAt: new Date("2026-09-01T18:05:00"),
    alumno: { id: "4", nombre: "Valeria", apellido: "Rojas", email: "alumno@edukatech.pe", codigoAlumno: "ALU-2026-001", fotoPerfil: null },
  },
  // Clase 1-2 (Virtual) - Valeria asistió
  {
    id: "asist-2",
    alumnoId: "4",
    claseId: "clase-1-2",
    modalidadAsistencia: "virtual",
    estado: "presente",
    metodoRegistro: "manual",
    observaciones: null,
    registradoPor: "3", // Profesor Ana María
    fechaRegistro: new Date("2026-09-08T18:10:00"),
    createdAt: new Date("2026-09-08T18:10:00"),
    updatedAt: new Date("2026-09-08T18:10:00"),
    alumno: { id: "4", nombre: "Valeria", apellido: "Rojas", email: "alumno@edukatech.pe", codigoAlumno: "ALU-2026-001", fotoPerfil: null },
  },
  // Clase 1-3 (Presencial) - Valeria no asistió
  {
    id: "asist-3",
    alumnoId: "4",
    claseId: "clase-1-3",
    modalidadAsistencia: "presencial",
    estado: "ausente",
    metodoRegistro: "manual",
    observaciones: "Problemas de transporte",
    registradoPor: "3",
    fechaRegistro: new Date("2026-09-15T18:15:00"),
    createdAt: new Date("2026-09-15T18:15:00"),
    updatedAt: new Date("2026-09-15T18:15:00"),
    alumno: { id: "4", nombre: "Valeria", apellido: "Rojas", email: "alumno@edukatech.pe", codigoAlumno: "ALU-2026-001", fotoPerfil: null },
  },
  // Clase 1-4 (Híbrida) - Valeria eligió presencial, asistió
  {
    id: "asist-4",
    alumnoId: "4",
    claseId: "clase-1-4",
    modalidadAsistencia: "presencial",
    estado: "presente",
    metodoRegistro: "qr",
    observaciones: null,
    registradoPor: "4",
    fechaRegistro: new Date("2026-09-22T18:02:00"),
    createdAt: new Date("2026-09-22T18:02:00"),
    updatedAt: new Date("2026-09-22T18:02:00"),
    alumno: { id: "4", nombre: "Valeria", apellido: "Rojas", email: "alumno@edukatech.pe", codigoAlumno: "ALU-2026-001", fotoPerfil: null },
  },
  // Clase 1-5 (Virtual) - Valeria llegó tarde
  {
    id: "asist-5",
    alumnoId: "4",
    claseId: "clase-1-5",
    modalidadAsistencia: "virtual",
    estado: "tardanza",
    metodoRegistro: "manual",
    observaciones: "Se conectó 15 min tarde",
    registradoPor: "3",
    fechaRegistro: new Date("2026-09-29T18:20:00"),
    createdAt: new Date("2026-09-29T18:20:00"),
    updatedAt: new Date("2026-09-29T18:20:00"),
    alumno: { id: "4", nombre: "Valeria", apellido: "Rojas", email: "alumno@edukatech.pe", codigoAlumno: "ALU-2026-001", fotoPerfil: null },
  },
  // Clase 1-6 (Presencial) - Valeria justificada
  {
    id: "asist-6",
    alumnoId: "4",
    claseId: "clase-1-6",
    modalidadAsistencia: "presencial",
    estado: "justificado",
    metodoRegistro: "manual",
    observaciones: "Certificado médico adjunto",
    registradoPor: "3",
    fechaRegistro: new Date("2026-10-06T18:00:00"),
    createdAt: new Date("2026-10-06T18:00:00"),
    updatedAt: new Date("2026-10-06T18:00:00"),
    alumno: { id: "4", nombre: "Valeria", apellido: "Rojas", email: "alumno@edukatech.pe", codigoAlumno: "ALU-2026-001", fotoPerfil: null },
  },
  // Clase 1-7 (Híbrida) - Valeria eligió virtual, asistió
  {
    id: "asist-7",
    alumnoId: "4",
    claseId: "clase-1-7",
    modalidadAsistencia: "virtual",
    estado: "presente",
    metodoRegistro: "self",
    observaciones: null,
    registradoPor: "4",
    fechaRegistro: new Date("2026-10-13T18:03:00"),
    createdAt: new Date("2026-10-13T18:03:00"),
    updatedAt: new Date("2026-10-13T18:03:00"),
    alumno: { id: "4", nombre: "Valeria", apellido: "Rojas", email: "alumno@edukatech.pe", codigoAlumno: "ALU-2026-001", fotoPerfil: null },
  },
  // Otros alumnos para vista profesor
  {
    id: "asist-8",
    alumnoId: "1",
    claseId: "clase-1-1",
    modalidadAsistencia: "presencial",
    estado: "presente",
    metodoRegistro: "qr",
    observaciones: null,
    registradoPor: "1",
    fechaRegistro: new Date("2026-09-01T18:01:00"),
    createdAt: new Date("2026-09-01T18:01:00"),
    updatedAt: new Date("2026-09-01T18:01:00"),
    alumno: { id: "1", nombre: "Juan", apellido: "Pérez", email: "juan@email.com", codigoAlumno: "ALU-2026-002", fotoPerfil: null },
  },
  {
    id: "asist-9",
    alumnoId: "2",
    claseId: "clase-1-1",
    modalidadAsistencia: "virtual",
    estado: "presente",
    metodoRegistro: "self",
    observaciones: null,
    registradoPor: "2",
    fechaRegistro: new Date("2026-09-01T18:02:00"),
    createdAt: new Date("2026-09-01T18:02:00"),
    updatedAt: new Date("2026-09-01T18:02:00"),
    alumno: { id: "2", nombre: "María", apellido: "López", email: "maria@email.com", codigoAlumno: "ALU-2026-003", fotoPerfil: null },
  },
  {
    id: "asist-10",
    alumnoId: "5",
    claseId: "clase-1-1",
    modalidadAsistencia: "presencial",
    estado: "ausente",
    metodoRegistro: "manual",
    observaciones: null,
    registradoPor: "3",
    fechaRegistro: new Date("2026-09-01T18:00:00"),
    createdAt: new Date("2026-09-01T18:00:00"),
    updatedAt: new Date("2026-09-01T18:00:00"),
    alumno: { id: "5", nombre: "Diego", apellido: "Salas", email: "diego@email.com", codigoAlumno: "ALU-2026-004", fotoPerfil: null },
  },
  {
    id: "asist-11",
    alumnoId: "6",
    claseId: "clase-1-1",
    modalidadAsistencia: "virtual",
    estado: "presente",
    metodoRegistro: "self",
    observaciones: null,
    registradoPor: "6",
    fechaRegistro: new Date("2026-09-01T18:03:00"),
    createdAt: new Date("2026-09-01T18:03:00"),
    updatedAt: new Date("2026-09-01T18:03:00"),
    alumno: { id: "6", nombre: "Lucía", apellido: "Torres", email: "lucia@email.com", codigoAlumno: "ALU-2026-005", fotoPerfil: null },
  },
];

export function getAsistenciasPorClase(claseId: string): Asistencia[] {
  return demoAsistencias.filter((a) => a.claseId === claseId);
}

export function getAsistenciasPorAlumno(alumnoId: string, cursoId: string): Asistencia[] {
  const clases = getClasesConModalidad(cursoId);
  const claseIds = clases.map((c) => c.id);
  return demoAsistencias.filter((a) => a.alumnoId === alumnoId && claseIds.includes(a.claseId));
}

export function getAsistencia(alumnoId: string, claseId: string): Asistencia | undefined {
  return demoAsistencias.find((a) => a.alumnoId === alumnoId && a.claseId === claseId);
}

// ============================================================================
// VISTAS CONSOLIDADAS PARA PROFESOR
// ============================================================================

// Alumnos inscritos demo por curso
const demoAlumnosInscritos: Record<string, { id: string; nombre: string; apellido: string; email: string; codigoAlumno: string; fotoPerfil: string | null }[]> = {
  "1": [
    { id: "1", nombre: "Juan", apellido: "Pérez", email: "juan@email.com", codigoAlumno: "ALU-2026-002", fotoPerfil: null },
    { id: "2", nombre: "María", apellido: "López", email: "maria@email.com", codigoAlumno: "ALU-2026-003", fotoPerfil: null },
    { id: "4", nombre: "Valeria", apellido: "Rojas", email: "alumno@edukatech.pe", codigoAlumno: "ALU-2026-001", fotoPerfil: null },
    { id: "5", nombre: "Diego", apellido: "Salas", email: "diego@email.com", codigoAlumno: "ALU-2026-004", fotoPerfil: null },
    { id: "6", nombre: "Lucía", apellido: "Torres", email: "lucia@email.com", codigoAlumno: "ALU-2026-005", fotoPerfil: null },
  ],
  "2": [
    { id: "1", nombre: "Juan", apellido: "Pérez", email: "juan@email.com", codigoAlumno: "ALU-2026-002", fotoPerfil: null },
    { id: "4", nombre: "Valeria", apellido: "Rojas", email: "alumno@edukatech.pe", codigoAlumno: "ALU-2026-001", fotoPerfil: null },
  ],
  "3": [
    { id: "2", nombre: "María", apellido: "López", email: "maria@email.com", codigoAlumno: "ALU-2026-003", fotoPerfil: null },
    { id: "5", nombre: "Diego", apellido: "Salas", email: "diego@email.com", codigoAlumno: "ALU-2026-004", fotoPerfil: null },
  ],
};

export function getAlumnosInscritos(cursoId: string) {
  return demoAlumnosInscritos[cursoId] ?? [];
}

export function getAsistenciaClaseProfesor(cursoId: string, claseId: string): AsistenciaClaseProfesor {
  const clase = getClaseConModalidad(cursoId, claseId);
  const alumnos = getAlumnosInscritos(cursoId);
  const asistencias = getAsistenciasPorClase(claseId);
  const preferencias = demoPreferenciasModalidad.filter((p) => p.claseId === claseId);

  if (!clase) {
    throw new Error(`Clase ${claseId} no encontrada`);
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
      puedeRegistrar: false, // TODO: calcular basado en ventana de auto-registro
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

export function getAsistenciaAlumnoCurso(alumnoId: string, cursoId: string): AsistenciaAlumnoCurso {
  const clases = getClasesConModalidad(cursoId);
  const asistencias = getAsistenciasPorAlumno(alumnoId, cursoId);
  const preferencias = getPreferenciasModalidad(alumnoId, cursoId);
  const config = getConfiguracionAsistencia(cursoId);

  const curso = { id: cursoId, title: "Fundamentos de Python" }; // Simplificado

  const clasesAlumno: AsistenciaClaseAlumno[] = clases.map((clase) => {
    const asistencia = asistencias.find((a) => a.claseId === clase.id);
    const preferencia = preferencias.find((p) => p.claseId === clase.id);
    const horasRestantes = 24; // TODO: calcular real

    return {
      claseId: clase.id,
      claseNumero: clase.numero,
      claseTitulo: clase.titulo,
      fechaClase: null, // TODO: calcular desde semana
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
    cursoId,
    cursoTitulo: curso.title,
    clases: clasesAlumno,
    resumen: {
      totalClases,
      asistidas,
      ausentes,
      porcentajeAsistencia,
    },
  };
}