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
  publicado: boolean("publicado").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
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