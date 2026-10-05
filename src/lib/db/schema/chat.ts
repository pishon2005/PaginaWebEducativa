import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
  text,
  integer,
  primaryKey,
} from "drizzle-orm/pg-core";
import { usuarios } from "./usuarios";
import { cursos, semanas } from "./cursos";

export const conversaciones = pgTable("conversaciones", {
  id: uuid("id").primaryKey().defaultRandom(),
  tipo: varchar("tipo", { length: 20 }).notNull().default("privada"),
  cursoId: uuid("curso_id").references(() => cursos.id, {
    onDelete: "cascade",
  }),
  nombre: varchar("nombre", { length: 200 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const conversacionParticipantes = pgTable(
  "conversacion_participantes",
  {
    conversacionId: uuid("conversacion_id")
      .notNull()
      .references(() => conversaciones.id, { onDelete: "cascade" }),
    usuarioId: uuid("usuario_id")
      .notNull()
      .references(() => usuarios.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.conversacionId, table.usuarioId] }),
  })
);

export const mensajes = pgTable("mensajes", {
  id: uuid("id").primaryKey().defaultRandom(),
  conversacionId: uuid("conversacion_id")
    .notNull()
    .references(() => conversaciones.id, { onDelete: "cascade" }),
  remitenteId: uuid("remitente_id")
    .notNull()
    .references(() => usuarios.id),
  contenido: text("contenido"),
  archivoUrl: varchar("archivo_url", { length: 500 }),
  leido: boolean("leido").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const foroTemas = pgTable("foro_temas", {
  id: uuid("id").primaryKey().defaultRandom(),
  cursoId: uuid("curso_id")
    .notNull()
    .references(() => cursos.id, { onDelete: "cascade" }),
  semanaId: uuid("semana_id").references(() => semanas.id, {
    onDelete: "set null",
  }),
  autorId: uuid("autor_id")
    .notNull()
    .references(() => usuarios.id),
  titulo: varchar("titulo", { length: 300 }).notNull(),
  contenido: text("contenido").notNull(),
  fijado: boolean("fijado").notNull().default(false),
  cerrado: boolean("cerrado").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const foroRespuestas = pgTable("foro_respuestas", {
  id: uuid("id").primaryKey().defaultRandom(),
  temaId: uuid("tema_id")
    .notNull()
    .references(() => foroTemas.id, { onDelete: "cascade" }),
  autorId: uuid("autor_id")
    .notNull()
    .references(() => usuarios.id),
  contenido: text("contenido").notNull(),
  esSolucion: boolean("es_solucion").notNull().default(false),
  votos: integer("votos").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const notificaciones = pgTable("notificaciones", {
  id: uuid("id").primaryKey().defaultRandom(),
  usuarioId: uuid("usuario_id")
    .notNull()
    .references(() => usuarios.id, { onDelete: "cascade" }),
  tipo: varchar("tipo", { length: 50 }).notNull(),
  titulo: varchar("titulo", { length: 200 }).notNull(),
  mensaje: text("mensaje"),
  urlDestino: varchar("url_destino", { length: 500 }),
  leida: boolean("leida").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});