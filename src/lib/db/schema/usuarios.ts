import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
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
  codigoAlumno: varchar("codigo_alumno", { length: 20 }).unique(),
  rolId: uuid("rol_id").references(() => roles.id).notNull(),
  activo: boolean("activo").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});