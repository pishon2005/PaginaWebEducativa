/**
 * Tipos para el sistema de asistencia (tomado de lista)
 * Modalidades: virtual, presencial, hibrida
 */

export type ModalidadClase = "virtual" | "presencial" | "hibrida";
export type ModalidadAsistencia = "virtual" | "presencial";
export type EstadoAsistencia = "presente" | "ausente" | "tardanza" | "justificado";
export type MetodoRegistroAsistencia = "manual" | "qr" | "self" | "importado";
export type EstadoSeccion = "borrador" | "activa" | "finalizada" | "cancelada";

// ============================================================================
// TIPOS BASE (Curso, Sección, Semana, Clase)
// ============================================================================

export interface CursoBase {
  id: string;
  slug: string;
  titulo: string;
  descripcionCorta: string | null;
  descripcionLarga: string | null;
  imagenPortada: string | null;
  precio: number;
  moneda: string;
  duracionHoras: number | null;
  nivel: string;
  profesorBaseId: string | null;
  certificadoActivo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Seccion {
  id: string;
  cursoId: string;
  codigo: string;
  modalidad: ModalidadClase;
  profesorId: string;
  capacidad: number | null;
  horario: string | null;
  ubicacion: string | null;
  fechaInicio: Date | null;
  fechaFin: Date | null;
  estado: EstadoSeccion;
  permitirEleccionModalidad: boolean;
  horasLimiteEleccion: number;
  requerirJustificacion: boolean;
  permitirAutoRegistro: boolean;
  ventanaAutoRegistroMinutos: number;
  createdAt: Date;
  updatedAt: Date;
  // Relaciones
  curso?: CursoBase;
  profesor?: { id: string; nombre: string; apellido: string; email: string };
}

export interface Semana {
  id: string;
  seccionId: string;
  numero: number;
  titulo: string;
  descripcion: string | null;
  createdAt: Date;
}

export interface ClaseConAsistencia {
  id: string;
  semanaId: string;
  numero: number;
  titulo: string;
  descripcion: string | null;
  videoUrl: string | null;
  duracionMinutos: number | null;
  modalidad: ModalidadClase;
  ubicacionPresencial: string | null;
  capacidadPresencial: number | null;
  fechaProgramada: Date | null;
  publicado: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Relaciones
  semana?: Semana & { numero: number };
  seccion?: Seccion;
}

export interface PreferenciaModalidad {
  id: string;
  alumnoId: string;
  claseId: string;
  modalidadElegida: ModalidadAsistencia;
  fechaEleccion: Date;
  updatedAt: Date;
}

export interface Asistencia {
  id: string;
  alumnoId: string;
  claseId: string;
  modalidadAsistencia: ModalidadAsistencia;
  estado: EstadoAsistencia;
  metodoRegistro: MetodoRegistroAsistencia;
  observaciones: string | null;
  registradoPor: string | null;
  fechaRegistro: Date;
  createdAt: Date;
  updatedAt: Date;
  // Datos relacionados (joins)
  alumno?: {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
    codigoAlumno: string | null;
    fotoPerfil: string | null;
  };
  clase?: ClaseConAsistencia;
}

export interface ConfiguracionAsistencia {
  id: string;
  seccionId: string;
  permitirEleccionModalidad: boolean;
  horasLimiteEleccion: number;
  requerirJustificacion: boolean;
  permitirAutoRegistro: boolean;
  ventanaAutoRegistroMinutos: number;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// TIPOS PARA VISTAS CONSOLIDADAS
// ============================================================================

// Para el profesor: vista consolidada de asistencia por clase
export interface AsistenciaClaseProfesor {
  clase: ClaseConAsistencia;
  seccion: Seccion;
  totalInscritos: number;
  presentes: number;
  ausentes: number;
  tardanzas: number;
  justificados: number;
  porModalidad: {
    virtual: { presentes: number; ausentes: number; total: number };
    presencial: { presentes: number; ausentes: number; total: number };
  };
  alumnos: AsistenciaAlumnoDetalle[];
}

export interface AsistenciaAlumnoDetalle {
  alumnoId: string;
  nombre: string;
  apellido: string;
  email: string;
  codigoAlumno: string | null;
  fotoPerfil: string | null;
  modalidadElegida: ModalidadAsistencia | null;
  asistencia: Asistencia | null;
  puedeRegistrar: boolean; // Si está dentro de la ventana de auto-registro
}

// Para el alumno: su estado de asistencia en una sección
export interface AsistenciaAlumnoSeccion {
  seccionId: string;
  seccionCodigo: string;
  cursoTitulo: string;
  modalidadSeccion: ModalidadClase;
  clases: AsistenciaClaseAlumno[];
  resumen: {
    totalClases: number;
    asistidas: number;
    ausentes: number;
    porcentajeAsistencia: number;
  };
}

export interface AsistenciaClaseAlumno {
  claseId: string;
  claseNumero: number;
  claseTitulo: string;
  fechaClase: Date | null;
  modalidadClase: ModalidadClase;
  ubicacionPresencial: string | null;
  modalidadElegida: ModalidadAsistencia | null;
  puedeCambiarModalidad: boolean;
  horasRestantesEleccion: number | null;
  asistencia: {
    estado: EstadoAsistencia | null;
    modalidadAsistencia: ModalidadAsistencia | null;
    fechaRegistro: Date | null;
    metodoRegistro: MetodoRegistroAsistencia | null;
  } | null;
}

// Formularios
export interface FormularioTomarAsistencia {
  claseId: string;
  registros: RegistroAsistencia[];
}

export interface RegistroAsistencia {
  alumnoId: string;
  estado: EstadoAsistencia;
  modalidadAsistencia: ModalidadAsistencia;
  observaciones?: string;
}

export interface FormularioEleccionModalidad {
  claseId: string;
  modalidadElegida: ModalidadAsistencia;
}

// Estadísticas
export interface EstadisticasAsistenciaSeccion {
  seccionId: string;
  totalClases: number;
  totalAlumnos: number;
  promedioAsistencia: number;
  porModalidad: {
    virtual: { total: number; presentes: number; porcentaje: number };
    presencial: { total: number; presentes: number; porcentaje: number };
  };
  porSemana: EstadisticasAsistenciaSemana[];
  alumnosEnRiesgo: AlumnoRiesgoAsistencia[];
}

export interface EstadisticasAsistenciaSemana {
  semanaId: string;
  semanaNumero: number;
  semanaTitulo: string;
  totalClases: number;
  promedioAsistencia: number;
}

export interface AlumnoRiesgoAsistencia {
  alumnoId: string;
  nombre: string;
  apellido: string;
  email: string;
  porcentajeAsistencia: number;
  clasesAusentesConsecutivas: number;
  ultimaAsistencia: Date | null;
}

// Constantes para UI
export const MODALIDAD_LABELS: Record<ModalidadClase, string> = {
  virtual: "Virtual",
  presencial: "Presencial",
  hibrida: "Híbrida",
};

export const MODALIDAD_ASISTENCIA_LABELS: Record<ModalidadAsistencia, string> = {
  virtual: "Virtual",
  presencial: "Presencial",
};

export const ESTADO_SECCION_LABELS: Record<EstadoSeccion, string> = {
  borrador: "Borrador",
  activa: "Activa",
  finalizada: "Finalizada",
  cancelada: "Cancelada",
};

export const ESTADO_ASISTENCIA_LABELS: Record<EstadoAsistencia, string> = {
  presente: "Presente",
  ausente: "Ausente",
  tardanza: "Tardanza",
  justificado: "Justificado",
};

export const ESTADO_ASISTENCIA_COLORES: Record<EstadoAsistencia, string> = {
  presente: "bg-green-100 text-green-800 border-green-200",
  ausente: "bg-red-100 text-red-800 border-red-200",
  tardanza: "bg-yellow-100 text-yellow-800 border-yellow-200",
  justificado: "bg-blue-100 text-blue-800 border-blue-200",
};

export const ESTADO_ASISTENCIA_ICONOS: Record<EstadoAsistencia, string> = {
  presente: "check-circle",
  ausente: "x-circle",
  tardanza: "clock",
  justificado: "shield-check",
};

export const METODO_REGISTRO_LABELS: Record<MetodoRegistroAsistencia, string> = {
  manual: "Manual (Profesor)",
  qr: "Código QR",
  self: "Auto-registro",
  importado: "Importado",
};