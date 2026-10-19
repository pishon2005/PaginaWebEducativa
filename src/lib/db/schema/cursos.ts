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
} from "drizzle-orm/pg-core";
import { usuarios } from "./usuarios";

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
  profesorId: uuid("profesor_id")
    .notNull()
    .references(() => usuarios.id),
  publicado: boolean("publicado").notNull().default(false),
  certificadoActivo: boolean("certificado_activo").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const semanas = pgTable("semanas", {
  id: uuid("id").primaryKey().defaultRandom(),
  cursoId: uuid("curso_id")
    .notNull()
    .references(() => cursos.id, { onDelete: "cascade" }),
  numero: integer("numero").notNull(),
  titulo: varchar("titulo", { length: 200 }).notNull(),
  descripcion: text("descripcion"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

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
  // Modalidad de la clase: virtual, presencial, hibrida
  modalidad: varchar("modalidad", { length: 20 }).notNull().default("virtual"),
  // Para clases híbridas: ubicación física
  ubicacionPresencial: varchar("ubicacion_presencial", { length: 300 }),
  // Capacidad máxima para presencial
  capacidadPresencial: integer("capacidad_presencial"),
  publicado: boolean("publicado").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

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
// SISTEMA DE ASISTENCIA
// ============================================================================

// Preferencia de modalidad del alumno por clase (virtual/presencial)
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
  // Un alumno solo puede tener una preferencia por clase
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
  // Modalidad en la que asistió realmente
  modalidadAsistencia: varchar("modalidad_asistencia", { length: 20 }).notNull(), // 'virtual' | 'presencial'
  // Estado de asistencia
  estado: varchar("estado", { length: 20 }).notNull().default("presente"), // 'presente', 'ausente', 'tardanza', 'justificado'
  // Método de registro: manual (profesor), auto (qr), self (alumno)
  metodoRegistro: varchar("metodo_registro", { length: 20 }).notNull().default("manual"),
  // Observaciones del profesor
  observaciones: text("observaciones"),
  // Quién registró la asistencia (profesor o admin)
  registradoPor: uuid("registrado_por").references(() => usuarios.id),
  fechaRegistro: timestamp("fecha_registro").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  // Un alumno solo puede tener un registro de asistencia por clase
  uniqueAlumnoClase: primaryKey({ columns: [table.alumnoId, table.claseId] }),
}));

// Configuración de asistencia por curso
export const configuracionAsistencia = pgTable("configuracion_asistencia", {
  id: uuid("id").primaryKey().defaultRandom(),
  cursoId: uuid("curso_id")
    .notNull()
    .unique()
    .references(() => cursos.id, { onDelete: "cascade" }),
  // Permitir que alumnos elijan modalidad
  permitirEleccionModalidad: boolean("permitir_eleccion_modalidad").notNull().default(true),
  // Horas antes de la clase para cerrar elección de modalidad
  horasLimiteEleccion: integer("horas_limite_eleccion").notNull().default(2),
  // Requerir justificación para ausencias
  requerirJustificacion: boolean("requerir_justificacion").notNull().default(false),
  // Permitir auto-registro por QR
  permitirAutoRegistro: boolean("permitir_auto_registro").notNull().default(false),
  // Ventana de tiempo para auto-registro (minutos antes/después)
  ventanaAutoRegistroMinutos: integer("ventana_auto_registro_minutos").notNull().default(15),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});