import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
  text,
  jsonb,
  integer,
} from "drizzle-orm/pg-core";

export const roles = pgTable("roles", {
  id: uuid("id").primaryKey().defaultRandom(),
  nombre: varchar("nombre", { length: 50 }).notNull().unique(),
  descripcion: varchar("descripcion", { length: 200 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const usuarios = pgTable("usuarios", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  nombre: varchar("nombre", { length: 100 }).notNull(),
  apellido: varchar("apellido", { length: 100 }).notNull(),
  fotoPerfil: varchar("foto_perfil", { length: 500 }),
  telefono: varchar("telefono", { length: 20 }),
  pais: varchar("pais", { length: 100 }),
  idiomaPreferido: varchar("idioma_preferido", { length: 10 })
    .notNull()
    .default("es"),
  codigoAlumno: varchar("codigo_alumno", { length: 20 }).unique(),
  rolId: uuid("rol_id")
    .notNull()
    .references(() => roles.id),
  activo: boolean("activo").notNull().default(true),
  emailVerificado: boolean("email_verificado").notNull().default(false),
  primerLogin: boolean("primer_login").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const perfilesProfesor = pgTable("perfiles_profesor", {
  id: uuid("id").primaryKey().defaultRandom(),
  usuarioId: uuid("usuario_id")
    .notNull()
    .unique()
    .references(() => usuarios.id, { onDelete: "cascade" }),
  biografia: text("biografia"),
  especialidades: jsonb("especialidades").$type<string[]>(),
  certificaciones: jsonb("certificaciones").$type<
    { nombre: string; institucion: string; año: number; url?: string }[]
  >(),
  linkedinUrl: varchar("linkedin_url", { length: 500 }),
  añosExperiencia: integer("años_experiencia"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});