import {
  pgTable,
  uuid,
  varchar,
  integer,
  boolean,
  timestamp,
  text,
  decimal,
  jsonb,
} from "drizzle-orm/pg-core";
import { usuarios } from "./usuarios";
import { cursos, semanas } from "./cursos";

export const tareas = pgTable("tareas", {
  id: uuid("id").primaryKey().defaultRandom(),
  cursoId: uuid("curso_id")
    .notNull()
    .references(() => cursos.id, { onDelete: "cascade" }),
  semanaId: uuid("semana_id").references(() => semanas.id, {
    onDelete: "set null",
  }),
  titulo: varchar("titulo", { length: 200 }).notNull(),
  descripcion: text("descripcion"),
  tipo: varchar("tipo", { length: 20 }).notNull().default("individual"),
  fechaInicio: timestamp("fecha_inicio").notNull(),
  fechaLimite: timestamp("fecha_limite").notNull(),
  permitirReenvio: boolean("permitir_reenvio").notNull().default(false),
  maxReenvios: integer("max_reenvios").notNull().default(0),
  pesoNota: decimal("peso_nota", { precision: 5, scale: 2 })
    .notNull()
    .default("0"),
  rubrica: jsonb("rubrica").$type<
    { criterio: string; descripcion: string; puntajeMaximo: number }[]
  >(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const entregas = pgTable("entregas", {
  id: uuid("id").primaryKey().defaultRandom(),
  tareaId: uuid("tarea_id")
    .notNull()
    .references(() => tareas.id, { onDelete: "cascade" }),
  alumnoId: uuid("alumno_id")
    .notNull()
    .references(() => usuarios.id),
  archivoUrl: varchar("archivo_url", { length: 500 }),
  comentarioAlumno: text("comentario_alumno"),
  comentarioProfesor: text("comentario_profesor"),
  nota: decimal("nota", { precision: 5, scale: 2 }),
  intentoNumero: integer("intento_numero").notNull().default(1),
  estado: varchar("estado", { length: 20 }).notNull().default("entregado"),
  fechaEntrega: timestamp("fecha_entrega").defaultNow().notNull(),
  fechaCalificacion: timestamp("fecha_calificacion"),
});

export const quizzes = pgTable("quizzes", {
  id: uuid("id").primaryKey().defaultRandom(),
  cursoId: uuid("curso_id")
    .notNull()
    .references(() => cursos.id, { onDelete: "cascade" }),
  semanaId: uuid("semana_id").references(() => semanas.id, {
    onDelete: "set null",
  }),
  titulo: varchar("titulo", { length: 200 }).notNull(),
  descripcion: text("descripcion"),
  tiempoLimiteMinutos: integer("tiempo_limite_minutos"),
  intentosMaximos: integer("intentos_maximos").notNull().default(1),
  mostrarRespuestas: boolean("mostrar_respuestas").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const quizPreguntas = pgTable("quiz_preguntas", {
  id: uuid("id").primaryKey().defaultRandom(),
  quizId: uuid("quiz_id")
    .notNull()
    .references(() => quizzes.id, { onDelete: "cascade" }),
  pregunta: text("pregunta").notNull(),
  tipo: varchar("tipo", { length: 20 }).notNull(),
  opciones: jsonb("opciones").$type<{ texto: string; esCorrecta: boolean }[]>(),
  puntaje: decimal("puntaje", { precision: 5, scale: 2 }).notNull(),
  orden: integer("orden").notNull(),
});

export const quizIntentos = pgTable("quiz_intentos", {
  id: uuid("id").primaryKey().defaultRandom(),
  quizId: uuid("quiz_id")
    .notNull()
    .references(() => quizzes.id),
  alumnoId: uuid("alumno_id")
    .notNull()
    .references(() => usuarios.id),
  respuestas: jsonb("respuestas"),
  nota: decimal("nota", { precision: 5, scale: 2 }),
  intentoNumero: integer("intento_numero").notNull().default(1),
  fechaInicio: timestamp("fecha_inicio").defaultNow().notNull(),
  fechaFin: timestamp("fecha_fin"),
});