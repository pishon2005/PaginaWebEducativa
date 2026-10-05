import {
  pgTable,
  uuid,
  varchar,
  integer,
  boolean,
  timestamp,
  decimal,
} from "drizzle-orm/pg-core";
import { usuarios } from "./usuarios";
import { cursos } from "./cursos";

export const inscripciones = pgTable("inscripciones", {
  id: uuid("id").primaryKey().defaultRandom(),
  alumnoId: uuid("alumno_id")
    .notNull()
    .references(() => usuarios.id),
  cursoId: uuid("curso_id")
    .notNull()
    .references(() => cursos.id),
  fechaInscripcion: timestamp("fecha_inscripcion").defaultNow().notNull(),
  progresoPorcentaje: integer("progreso_porcentaje").notNull().default(0),
  completado: boolean("completado").notNull().default(false),
  certificadoEmitido: boolean("certificado_emitido").notNull().default(false),
  certificadoUrl: varchar("certificado_url", { length: 500 }),
});

export const pagos = pgTable("pagos", {
  id: uuid("id").primaryKey().defaultRandom(),
  alumnoId: uuid("alumno_id").references(() => usuarios.id),
  cursoId: uuid("curso_id")
    .notNull()
    .references(() => cursos.id),
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