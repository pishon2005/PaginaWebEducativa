import {
  pgTable,
  uuid,
  varchar,
  integer,
  boolean,
  timestamp,
  text,
  decimal,
  bigint,
  primaryKey,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { usuarios } from "./usuarios";

// ============================================================================
// CURSO BASE (Plantilla general - info compartida entre secciones)
// ============================================================================

export const cursos = pgTable("cursos", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  titulo: varchar("titulo", { length: 200 }).notNull(),
  descripcionCorta: varchar("descripcion_corta", { length: 500 }),
  descripcionLarga: text("descripcion_larga"),
  imagenPortada: varchar("imagen_portada", { length: 500 }),
  precio: decimal("precio", { precision: 10, scale: 2 }).notNull().default("0"),
  moneda: varchar("moneda", { length: 3 }).notNull().default("PEN"),
  duracionHoras: integer("duracion_horas"),
  nivel: varchar("nivel", { length: 20 }).notNull().default("principiante"),
  // El profesor base del curso (puede ser distinto por sección)
  profesorBaseId: uuid("profesor_base_id").references(() => usuarios.id),
  certificadoActivo: boolean("certificado_activo").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ============================================================================
// SECCIONES (Instancias específicas: virtual, presencial, hibrida)
// ============================================================================

export const secciones = pgTable("secciones", {
  id: uuid("id").primaryKey().defaultRandom(),
  cursoId: uuid("curso_id")
    .notNull()
    .references(() => cursos.id, { onDelete: "cascade" }),
  // Código único de la sección (ej: "PY-2026-V1", "PY-2026-P1")
  codigo: varchar("codigo", { length: 50 }).notNull().unique(),
  // Modalidad de la sección: virtual, presencial, hibrida
  modalidad: varchar("modalidad", { length: 20 }).notNull().default("virtual"),
  // Profesor específico de esta sección
  profesorId: uuid("profesor_id")
    .notNull()
    .references(() => usuarios.id),
  // Capacidad máxima
  capacidad: integer("capacidad"),
  // Horario (ej: "Lunes y Miércoles 19:00-21:00")
  horario: varchar("horario", { length: 200 }),
  // Ubicación física (para presencial/hibrida)
  ubicacion: varchar("ubicacion", { length: 300 }),
  // Fecha de inicio y fin
  fechaInicio: timestamp("fecha_inicio"),
  fechaFin: timestamp("fecha_fin"),
  // Estado: borrador, activa, finalizada, cancelada
  estado: varchar("estado", { length: 20 }).notNull().default("borrador"),
  // Configuración de asistencia específica de la sección
  permitirEleccionModalidad: boolean("permitir_eleccion_modalidad").notNull().default(true),
  horasLimiteEleccion: integer("horas_limite_eleccion").notNull().default(2),
  requerirJustificacion: boolean("requerir_justificacion").notNull().default(false),
  permitirAutoRegistro: boolean("permitir_auto_registro").notNull().default(false),
  ventanaAutoRegistroMinutos: integer("ventana_auto_registro_minutos").notNull().default(15),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  uniqueCursoCodigo: uniqueIndex("unique_curso_codigo").on(table.cursoId, table.codigo),
}));

// ============================================================================
// SEMANAS (Pertenecen a una sección)
// ============================================================================

export const semanas = pgTable("semanas", {
  id: uuid("id").primaryKey().defaultRandom(),
  seccionId: uuid("seccion_id")
    .notNull()
    .references(() => secciones.id, { onDelete: "cascade" }),
  numero: integer("numero").notNull(),
  titulo: varchar("titulo", { length: 200 }).notNull(),
  descripcion: text("descripcion"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  uniqueSeccionNumero: uniqueIndex("unique_seccion_numero").on(table.seccionId, table.numero),
}));

// ============================================================================
// CLASES (Pertenecen a una semana de una sección)
// ============================================================================

export const clases = pgTable("clases", {
  id: uuid("id").primaryKey().defaultRandom(),
  semanaId: uuid("semana_id")
    .notNull()
    .references(() => semanas.id, { onDelete: "cascade" }),
  numero: integer("numero").notNull(),
  titulo: varchar("titulo", { length: 200 }).notNull(),
  descripcion: text("descripcion"),
  videoUrl: varchar("video_url", { length: 500 }),
  duracionMinutos: integer("duracion_minutos"),
  // Modalidad de la clase (hereda de la sección pero puede sobrescribirse)
  modalidad: varchar("modalidad", { length: 20 }).notNull().default("virtual"),
  // Para clases híbridas/presenciales: ubicación específica
  ubicacionPresencial: varchar("ubicacion_presencial", { length: 300 }),
  // Capacidad máxima para presencial (puede ser distinta a la sección)
  capacidadPresencial: integer("capacidad_presencial"),
  // Fecha programada de la clase
  fechaProgramada: timestamp("fecha_programada"),
  publicado: boolean("publicado").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  uniqueSemanaNumero: uniqueIndex("unique_semana_numero").on(table.semanaId, table.numero),
}));

export const materiales = pgTable("materiales", {
  id: uuid("id").primaryKey().defaultRandom(),
  claseId: uuid("clase_id")
    .notNull()
    .references(() => clases.id, { onDelete: "cascade" }),
  nombre: varchar("nombre", { length: 200 }).notNull(),
  tipo: varchar("tipo", { length: 20 }).notNull(),
  url: varchar("url", { length: 500 }).notNull(),
  tamañoBytes: bigint("tamaño_bytes", { mode: "number" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================================================================
// INSCRIPCIONES (A una sección, no al curso base)
// ============================================================================

export const inscripciones = pgTable("inscripciones", {
  id: uuid("id").primaryKey().defaultRandom(),
  alumnoId: uuid("alumno_id")
    .notNull()
    .references(() => usuarios.id),
  seccionId: uuid("seccion_id")
    .notNull()
    .references(() => secciones.id),
  fechaInscripcion: timestamp("fecha_inscripcion").defaultNow().notNull(),
  progresoPorcentaje: integer("progreso_porcentaje").notNull().default(0),
  completado: boolean("completado").notNull().default(false),
  certificadoEmitido: boolean("certificado_emitido").notNull().default(false),
  certificadoUrl: varchar("certificado_url", { length: 500 }),
}, (table) => ({
  uniqueAlumnoSeccion: primaryKey({ columns: [table.alumnoId, table.seccionId] }),
}));

// ============================================================================
// PAGOS (Por inscripción a sección)
// ============================================================================

export const pagos = pgTable("pagos", {
  id: uuid("id").primaryKey().defaultRandom(),
  alumnoId: uuid("alumno_id").references(() => usuarios.id),
  seccionId: uuid("seccion_id")
    .notNull()
    .references(() => secciones.id),
  monto: decimal("monto", { precision: 10, scale: 2 }).notNull(),
  moneda: varchar("moneda", { length: 3 }).notNull().default("PEN"),
  metodoPago: varchar("metodo_pago", { length: 20 }).notNull().default("yape"),
  estado: varchar("estado", { length: 20 }).notNull().default("pendiente"),
  voucherUrl: varchar("voucher_url", { length: 500 }),
  referenciaExterna: varchar("referencia_externa", { length: 200 }),
  aprobadoPor: uuid("aprobado_por").references(() => usuarios.id),
  fechaPago: timestamp("fecha_pago").defaultNow().notNull(),
  fechaAprobacion: timestamp("fecha_aprobacion"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================================================================
// SISTEMA DE ASISTENCIA (Por clase de sección)
// ============================================================================

// Preferencia de modalidad del alumno por clase
export const preferenciasModalidad = pgTable("preferencias_modalidad", {
  id: uuid("id").primaryKey().defaultRandom(),
  alumnoId: uuid("alumno_id")
    .notNull()
    .references(() => usuarios.id, { onDelete: "cascade" }),
  claseId: uuid("clase_id")
    .notNull()
    .references(() => clases.id, { onDelete: "cascade" }),
  modalidadElegida: varchar("modalidad_elegida", { length: 20 }).notNull(), // 'virtual' | 'presencial'
  fechaEleccion: timestamp("fecha_eleccion").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  uniqueAlumnoClase: primaryKey({ columns: [table.alumnoId, table.claseId] }),
}));

// Registro de asistencia
export const asistencias = pgTable("asistencias", {
  id: uuid("id").primaryKey().defaultRandom(),
  alumnoId: uuid("alumno_id")
    .notNull()
    .references(() => usuarios.id, { onDelete: "cascade" }),
  claseId: uuid("clase_id")
    .notNull()
    .references(() => clases.id, { onDelete: "cascade" }),
  modalidadAsistencia: varchar("modalidad_asistencia", { length: 20 }).notNull(), // 'virtual' | 'presencial'
  estado: varchar("estado", { length: 20 }).notNull().default("presente"), // 'presente', 'ausente', 'tardanza', 'justificado'
  metodoRegistro: varchar("metodo_registro", { length: 20 }).notNull().default("manual"),
  observaciones: text("observaciones"),
  registradoPor: uuid("registrado_por").references(() => usuarios.id),
  fechaRegistro: timestamp("fecha_registro").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  uniqueAlumnoClase: primaryKey({ columns: [table.alumnoId, table.claseId] }),
}));

// Configuración de asistencia por sección (sobrescribe la del curso base)
export const configuracionAsistencia = pgTable("configuracion_asistencia", {
  id: uuid("id").primaryKey().defaultRandom(),
  seccionId: uuid("seccion_id")
    .notNull()
    .unique()
    .references(() => secciones.id, { onDelete: "cascade" }),
  permitirEleccionModalidad: boolean("permitir_eleccion_modalidad").notNull().default(true),
  horasLimiteEleccion: integer("horas_limite_eleccion").notNull().default(2),
  requerirJustificacion: boolean("requerir_justificacion").notNull().default(false),
  permitirAutoRegistro: boolean("permitir_auto_registro").notNull().default(false),
  ventanaAutoRegistroMinutos: integer("ventana_auto_registro_minutos").notNull().default(15),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});