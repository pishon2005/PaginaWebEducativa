import "server-only";

import { sql } from "drizzle-orm";
import type { AnyPgColumn } from "drizzle-orm/pg-core";
import {
  bigint,
  boolean,
  check,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgSchema,
  pgTable,
  primaryKey,
  smallint,
  text,
  time,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

const authUsers = pgSchema("auth").table("users", {
  id: uuid("id").primaryKey(),
});

const accountStatus = pgEnum("account_status", [
  "pendiente",
  "activo",
  "suspendido",
  "inactivo",
]);
const learningModality = pgEnum("learning_modality", ["presencial", "virtual"]);
const sectionStatus = pgEnum("section_status", [
  "borrador",
  "activa",
  "finalizada",
  "cancelada",
]);
const reservationStatus = pgEnum("reservation_status", [
  "pendiente_pago",
  "confirmada",
  "cancelada",
]);
const paymentStatus = pgEnum("payment_status", [
  "pendiente",
  "verificado",
  "rechazado",
]);
const enrollmentStatus = pgEnum("enrollment_status", [
  "activa",
  "suspendida",
  "finalizada",
  "cancelada",
]);
const sessionStatus = pgEnum("academic_session_status", [
  "programada",
  "reprogramada",
  "cancelada",
  "realizada",
]);
const attendanceStatus = pgEnum("attendance_status", [
  "presente",
  "ausente",
  "justificado",
]);
const fileCategory = pgEnum("file_category", [
  "profile",
  "student_document",
  "payment_proof",
  "submission",
  "learning_material",
  "video",
  "administrative_document",
  "message_attachment",
]);
const fileStatus = pgEnum("file_status", [
  "pending",
  "active",
  "quarantined",
  "deleted",
]);

const now = () =>
  timestamp("created_at", { withTimezone: true }).defaultNow().notNull();
const updatedAt = () =>
  timestamp("updated_at", { withTimezone: true }).defaultNow().notNull();

export const roles = pgTable(
  "roles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    nombre: text("nombre").notNull(),
    descripcion: text("descripcion"),
    createdAt: now(),
  },
  (table) => ({
    nombreUnique: unique("roles_nombre_key").on(table.nombre),
    validName: check(
      "roles_nombre_valid",
      sql`${table.nombre} IN ('superadministrador', 'administrador', 'docente', 'estudiante')`,
    ),
  }),
);

export const usuarios = pgTable(
  "usuarios",
  {
    id: uuid("id")
      .primaryKey()
      .references(() => authUsers.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    nombre: text("nombre").notNull(),
    apellido: text("apellido").notNull().default(""),
    fotoPerfil: text("foto_perfil"),
    telefono: text("telefono"),
    pais: text("pais"),
    idiomaPreferido: text("idioma_preferido").notNull().default("es"),
    codigoAlumno: text("codigo_alumno"),
    rolId: uuid("rol_id").notNull().references(() => roles.id),
    estado: accountStatus("estado").notNull().default("pendiente"),
    activo: boolean("activo").notNull().default(true),
    emailVerificado: boolean("email_verificado").notNull().default(false),
    primerLogin: boolean("primer_login").notNull().default(true),
    createdAt: now(),
    updatedAt: updatedAt(),
  },
  (table) => ({
    emailUnique: unique("usuarios_email_key").on(table.email),
    codigoAlumnoUnique: unique("usuarios_codigo_alumno_key").on(table.codigoAlumno),
    roleIdx: index("usuarios_rol_id_idx").on(table.rolId),
    statusIdx: index("usuarios_estado_idx").on(table.estado, table.activo),
    emailNotBlank: check(
      "usuarios_email_not_blank",
      sql`length(trim(${table.email})) > 0`,
    ),
    nameNotBlank: check(
      "usuarios_nombre_not_blank",
      sql`length(trim(${table.nombre})) > 0`,
    ),
  }),
);

export const perfilesDocente = pgTable(
  "perfiles_docente",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    usuarioId: uuid("usuario_id")
      .notNull()
      .references(() => usuarios.id, { onDelete: "cascade" }),
    biografia: text("biografia"),
    especialidades: jsonb("especialidades").notNull().default([]),
    certificaciones: jsonb("certificaciones").notNull().default([]),
    linkedinUrl: text("linkedin_url"),
    anosExperiencia: integer("anos_experiencia"),
    createdAt: now(),
    updatedAt: updatedAt(),
  },
  (table) => ({
    userUnique: unique("perfiles_docente_usuario_id_key").on(table.usuarioId),
    experienceCheck: check(
      "perfiles_docente_anos_experiencia_check",
      sql`${table.anosExperiencia} IS NULL OR ${table.anosExperiencia} >= 0`,
    ),
  }),
);

export const configuraciones = pgTable(
  "configuraciones",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    clave: text("clave").notNull(),
    valorJson: jsonb("valor_json"),
    descripcion: text("descripcion"),
    modificadoPor: uuid("modificado_por").references(() => usuarios.id),
    createdAt: now(),
    updatedAt: updatedAt(),
  },
  (table) => ({ claveUnique: unique("configuraciones_clave_key").on(table.clave) }),
);

export const auditoria = pgTable(
  "auditoria",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    actorId: uuid("actor_id").references(() => usuarios.id, { onDelete: "set null" }),
    entidad: text("entidad").notNull(),
    entidadId: uuid("entidad_id"),
    accion: text("accion").notNull(),
    detalle: jsonb("detalle").notNull().default({}),
    resultado: text("resultado").notNull().default("ok"),
    createdAt: now(),
  },
  (table) => ({
    entityIdx: index("auditoria_entidad_idx").on(
      table.entidad,
      table.entidadId,
      table.createdAt.desc(),
    ),
    actorIdx: index("auditoria_actor_idx").on(
      table.actorId,
      table.createdAt.desc(),
    ),
    resultCheck: check(
      "auditoria_resultado_valid",
      sql`${table.resultado} IN ('ok', 'rechazado', 'error')`,
    ),
  }),
);

export const categorias = pgTable(
  "categorias",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    nombre: text("nombre").notNull(),
    slug: text("slug").notNull(),
    descripcion: text("descripcion"),
    activo: boolean("activo").notNull().default(true),
    createdAt: now(),
    updatedAt: updatedAt(),
  },
  (table) => ({
    nameUnique: unique("categorias_nombre_key").on(table.nombre),
    slugUnique: unique("categorias_slug_key").on(table.slug),
    activeIdx: index("categorias_activo_idx").on(table.activo),
  }),
);

export const cursos = pgTable(
  "cursos",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    categoriaId: uuid("categoria_id").references(() => categorias.id, {
      onDelete: "restrict",
    }),
    slug: text("slug").notNull(),
    titulo: text("titulo").notNull(),
    descripcionCorta: text("descripcion_corta"),
    descripcionLarga: text("descripcion_larga"),
    imagenPortada: text("imagen_portada"),
    precio: numeric("precio", { precision: 10, scale: 2 }).notNull().default("0"),
    moneda: text("moneda").notNull().default("PEN"),
    duracionHoras: integer("duracion_horas"),
    nivel: text("nivel").notNull().default("principiante"),
    docenteBaseId: uuid("docente_base_id").references(() => usuarios.id, {
      onDelete: "set null",
    }),
    certificadoActivo: boolean("certificado_activo").notNull().default(true),
    publicado: boolean("publicado").notNull().default(false),
    createdAt: now(),
    updatedAt: updatedAt(),
  },
  (table) => ({
    slugUnique: unique("cursos_slug_key").on(table.slug),
    categoryPublishedIdx: index("cursos_categoria_publicado_idx").on(
      table.categoriaId,
      table.publicado,
    ),
    baseTeacherIdx: index("cursos_docente_base_id_idx").on(table.docenteBaseId),
    priceCheck: check("cursos_precio_check", sql`${table.precio}::numeric >= 0`),
    currencyCheck: check(
      "cursos_moneda_check",
      sql`${table.moneda} ~ '^[A-Z]{3}$'`,
    ),
    durationCheck: check(
      "cursos_duracion_horas_check",
      sql`${table.duracionHoras} IS NULL OR ${table.duracionHoras} > 0`,
    ),
  }),
);

export const secciones = pgTable(
  "secciones",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    cursoId: uuid("curso_id")
      .notNull()
      .references(() => cursos.id, { onDelete: "restrict" }),
    codigo: text("codigo").notNull(),
    modalidad: learningModality("modalidad").notNull(),
    docenteId: uuid("docente_id")
      .notNull()
      .references(() => usuarios.id, { onDelete: "restrict" }),
    capacidad: integer("capacidad"),
    precio: numeric("precio", { precision: 10, scale: 2 }),
    moneda: text("moneda"),
    ubicacion: text("ubicacion"),
    fechaInicio: timestamp("fecha_inicio", { withTimezone: true }),
    fechaFin: timestamp("fecha_fin", { withTimezone: true }),
    reservasDesde: timestamp("reservas_desde", { withTimezone: true }),
    reservasHasta: timestamp("reservas_hasta", { withTimezone: true }),
    estado: sectionStatus("estado").notNull().default("borrador"),
    createdAt: now(),
    updatedAt: updatedAt(),
  },
  (table) => ({
    codeUnique: unique("secciones_codigo_key").on(table.codigo),
    courseStatusIdx: index("secciones_curso_estado_idx").on(
      table.cursoId,
      table.estado,
    ),
    teacherStatusIdx: index("secciones_docente_estado_idx").on(
      table.docenteId,
      table.estado,
    ),
    capacityCheck: check(
      "secciones_capacidad_check",
      sql`${table.capacidad} IS NULL OR ${table.capacidad} > 0`,
    ),
    sectionPriceCheck: check(
      "secciones_precio_check",
      sql`${table.precio} IS NULL OR ${table.precio}::numeric >= 0`,
    ),
    sectionCurrencyCheck: check(
      "secciones_moneda_check",
      sql`${table.moneda} IS NULL OR ${table.moneda} ~ '^[A-Z]{3}$'`,
    ),
    dateRangeCheck: check(
      "secciones_fechas_validas",
      sql`${table.fechaFin} IS NULL OR ${table.fechaInicio} IS NULL OR ${table.fechaFin} > ${table.fechaInicio}`,
    ),
    reservationRangeCheck: check(
      "secciones_reservas_validas",
      sql`${table.reservasHasta} IS NULL OR ${table.reservasDesde} IS NULL OR ${table.reservasHasta} > ${table.reservasDesde}`,
    ),
    currencyRequiresPrice: check(
      "secciones_moneda_requiere_precio",
      sql`${table.moneda} IS NULL OR ${table.precio} IS NOT NULL`,
    ),
  }),
);

export const horariosRecurrentes = pgTable(
  "horarios_recurrentes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    seccionId: uuid("seccion_id")
      .notNull()
      .references(() => secciones.id, { onDelete: "cascade" }),
    diaSemana: smallint("dia_semana").notNull(),
    horaInicio: time("hora_inicio").notNull(),
    horaFin: time("hora_fin").notNull(),
    zonaHoraria: text("zona_horaria").notNull().default("America/Lima"),
    ubicacion: text("ubicacion"),
    activo: boolean("activo").notNull().default(true),
    createdAt: now(),
    updatedAt: updatedAt(),
  },
  (table) => ({
    sectionDayIdx: index("horarios_seccion_dia_idx").on(
      table.seccionId,
      table.diaSemana,
    ),
    dayCheck: check(
      "horarios_recurrentes_dia_semana_check",
      sql`${table.diaSemana} BETWEEN 0 AND 6`,
    ),
    rangeCheck: check(
      "horarios_rango_valido",
      sql`${table.horaFin} > ${table.horaInicio}`,
    ),
  }),
);

export const sesionesAcademicas = pgTable(
  "sesiones_academicas",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    seccionId: uuid("seccion_id")
      .notNull()
      .references(() => secciones.id, { onDelete: "cascade" }),
    titulo: text("titulo").notNull(),
    descripcion: text("descripcion"),
    inicio: timestamp("inicio", { withTimezone: true }).notNull(),
    fin: timestamp("fin", { withTimezone: true }).notNull(),
    modalidad: learningModality("modalidad").notNull(),
    ubicacion: text("ubicacion"),
    estado: sessionStatus("estado").notNull().default("programada"),
    reprogramadaDe: uuid("reprogramada_de").references(
      (): AnyPgColumn => sesionesAcademicas.id,
      { onDelete: "set null" },
    ),
    motivoCambio: text("motivo_cambio"),
    createdAt: now(),
    updatedAt: updatedAt(),
  },
  (table) => ({
    sectionStartIdx: index("sesiones_seccion_inicio_idx").on(
      table.seccionId,
      table.inicio,
    ),
    rangeCheck: check("sesiones_rango_valido", sql`${table.fin} > ${table.inicio}`),
    rescheduleCheck: check(
      "sesiones_reprogramacion_motivo",
      sql`${table.reprogramadaDe} IS NULL OR NULLIF(trim(${table.motivoCambio}), '') IS NOT NULL`,
    ),
  }),
);

export const interesados = pgTable(
  "interesados",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    nombre: text("nombre").notNull(),
    apellido: text("apellido"),
    email: text("email"),
    telefono: text("telefono"),
    cursoId: uuid("curso_id").references(() => cursos.id, { onDelete: "restrict" }),
    origen: text("origen").notNull().default("web"),
    createdAt: now(),
  },
  (table) => ({
    courseCreatedIdx: index("interesados_curso_created_idx").on(
      table.cursoId,
      table.createdAt.desc(),
    ),
    contactCheck: check(
      "interesados_contacto",
      sql`NULLIF(trim(${table.email}), '') IS NOT NULL OR NULLIF(trim(${table.telefono}), '') IS NOT NULL`,
    ),
    lengthCheck: check(
      "interesados_datos_length",
      sql`length(${table.nombre}) <= 120 AND (${table.apellido} IS NULL OR length(${table.apellido}) <= 120) AND (${table.email} IS NULL OR length(${table.email}) <= 320) AND (${table.telefono} IS NULL OR length(${table.telefono}) <= 32) AND length(${table.origen}) <= 30`,
    ),
  }),
);

export const reservas = pgTable(
  "reservas",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    interesadoId: uuid("interesado_id").references(() => interesados.id, {
      onDelete: "restrict",
    }),
    estudianteId: uuid("estudiante_id").references(() => usuarios.id, {
      onDelete: "restrict",
    }),
    seccionId: uuid("seccion_id")
      .notNull()
      .references(() => secciones.id, { onDelete: "restrict" }),
    estado: reservationStatus("estado").notNull().default("pendiente_pago"),
    monto: numeric("monto", { precision: 10, scale: 2 }).notNull(),
    moneda: text("moneda").notNull(),
    creadaPor: uuid("creada_por")
      .notNull()
      .references(() => usuarios.id, { onDelete: "restrict" }),
    createdAt: now(),
    updatedAt: updatedAt(),
  },
  (table) => ({
    sectionStatusIdx: index("reservas_seccion_estado_idx").on(
      table.seccionId,
      table.estado,
    ),
    studentIdx: index("reservas_estudiante_idx").on(
      table.estudianteId,
      table.createdAt.desc(),
    ),
    interestedSectionActiveIdx: uniqueIndex(
      "reservas_interesado_seccion_active_idx",
    )
      .on(table.interesadoId, table.seccionId)
      .where(sql`${table.interesadoId} IS NOT NULL AND ${table.estado} IN ('pendiente_pago', 'confirmada')`),
    requesterCheck: check(
      "reservas_solicitante_unico",
      sql`num_nonnulls(${table.interesadoId}, ${table.estudianteId}) = 1`,
    ),
    amountCheck: check("reservas_monto_check", sql`${table.monto}::numeric >= 0`),
    currencyCheck: check(
      "reservas_moneda_check",
      sql`${table.moneda} ~ '^[A-Z]{3}$'`,
    ),
  }),
);

export const pagos = pgTable(
  "pagos",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    reservaId: uuid("reserva_id")
      .notNull()
      .references(() => reservas.id, { onDelete: "restrict" }),
    monto: numeric("monto", { precision: 10, scale: 2 }).notNull(),
    moneda: text("moneda").notNull(),
    metodoPago: text("metodo_pago").notNull(),
    estado: paymentStatus("estado").notNull().default("pendiente"),
    comprobanteArchivoId: uuid("comprobante_archivo_id").references(
      (): AnyPgColumn => archivosMetadata.id,
      { onDelete: "restrict" },
    ),
    referenciaExterna: text("referencia_externa"),
    verificadoPor: uuid("verificado_por").references(() => usuarios.id, {
      onDelete: "restrict",
    }),
    fechaVerificacion: timestamp("fecha_verificacion", { withTimezone: true }),
    createdAt: now(),
    updatedAt: updatedAt(),
  },
  (table) => ({
    reservationStatusIdx: index("pagos_reserva_estado_idx").on(
      table.reservaId,
      table.estado,
    ),
    verifiedUnique: uniqueIndex("pagos_una_verificacion_por_reserva_idx")
      .on(table.reservaId)
      .where(sql`${table.estado} = 'verificado'`),
    pendingUnique: uniqueIndex("pagos_uno_pendiente_por_reserva_idx")
      .on(table.reservaId)
      .where(sql`${table.estado} = 'pendiente'`),
    amountCheck: check("pagos_monto_check", sql`${table.monto}::numeric >= 0`),
    currencyCheck: check(
      "pagos_moneda_check",
      sql`${table.moneda} ~ '^[A-Z]{3}$'`,
    ),
    verificationCheck: check(
      "pagos_verificacion_consistente",
      sql`(${table.estado} = 'pendiente' AND ${table.verificadoPor} IS NULL AND ${table.fechaVerificacion} IS NULL) OR (${table.estado} IN ('verificado', 'rechazado') AND ${table.verificadoPor} IS NOT NULL AND ${table.fechaVerificacion} IS NOT NULL)`,
    ),
  }),
);

export const inscripciones = pgTable(
  "inscripciones",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    reservaId: uuid("reserva_id")
      .notNull()
      .references(() => reservas.id, { onDelete: "restrict" }),
    estudianteId: uuid("estudiante_id")
      .notNull()
      .references(() => usuarios.id, { onDelete: "restrict" }),
    seccionId: uuid("seccion_id")
      .notNull()
      .references(() => secciones.id, { onDelete: "restrict" }),
    estado: enrollmentStatus("estado").notNull().default("activa"),
    fechaInscripcion: timestamp("fecha_inscripcion", { withTimezone: true })
      .notNull()
      .defaultNow(),
    progresoPorcentaje: smallint("progreso_porcentaje").notNull().default(0),
    completado: boolean("completado").notNull().default(false),
    createdAt: now(),
    updatedAt: updatedAt(),
  },
  (table) => ({
    reservationUnique: unique("inscripciones_reserva_id_key").on(table.reservaId),
    studentSectionUnique: unique("inscripciones_estudiante_id_seccion_id_key").on(
      table.estudianteId,
      table.seccionId,
    ),
    studentStatusIdx: index("inscripciones_estudiante_estado_idx").on(
      table.estudianteId,
      table.estado,
    ),
    progressCheck: check(
      "inscripciones_progreso_porcentaje_check",
      sql`${table.progresoPorcentaje} BETWEEN 0 AND 100`,
    ),
  }),
);

export const asistencias = pgTable(
  "asistencias",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    sesionId: uuid("sesion_id")
      .notNull()
      .references(() => sesionesAcademicas.id, { onDelete: "cascade" }),
    estudianteId: uuid("estudiante_id")
      .notNull()
      .references(() => usuarios.id, { onDelete: "restrict" }),
    estado: attendanceStatus("estado").notNull(),
    registradoPor: uuid("registrado_por")
      .notNull()
      .references(() => usuarios.id, { onDelete: "restrict" }),
    motivo: text("motivo"),
    fechaRegistro: timestamp("fecha_registro", { withTimezone: true })
      .notNull()
      .defaultNow(),
    createdAt: now(),
    updatedAt: updatedAt(),
  },
  (table) => ({
    sessionStudentUnique: unique("asistencias_sesion_id_estudiante_id_key").on(
      table.sesionId,
      table.estudianteId,
    ),
    sessionIdx: index("asistencias_sesion_idx").on(table.sesionId, table.estado),
    justificationCheck: check(
      "asistencias_justificacion",
      sql`${table.estado} <> 'justificado' OR NULLIF(trim(${table.motivo}), '') IS NOT NULL`,
    ),
  }),
);

export const historialAsistencias = pgTable(
  "historial_asistencias",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    asistenciaId: uuid("asistencia_id")
      .notNull()
      .references(() => asistencias.id, { onDelete: "restrict" }),
    actorId: uuid("actor_id")
      .notNull()
      .references(() => usuarios.id, { onDelete: "restrict" }),
    estadoAnterior: attendanceStatus("estado_anterior"),
    estadoNuevo: attendanceStatus("estado_nuevo").notNull(),
    motivo: text("motivo").notNull(),
    createdAt: now(),
  },
);

export const tareas = pgTable(
  "tareas",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    seccionId: uuid("seccion_id")
      .notNull()
      .references(() => secciones.id, { onDelete: "cascade" }),
    titulo: text("titulo").notNull(),
    descripcion: text("descripcion"),
    fechaInicio: timestamp("fecha_inicio", { withTimezone: true }),
    fechaLimite: timestamp("fecha_limite", { withTimezone: true }),
    activo: boolean("activo").notNull().default(true),
    createdAt: now(),
    updatedAt: updatedAt(),
  },
  (table) => ({
    sectionDeadlineIdx: index("tareas_seccion_fecha_idx").on(
      table.seccionId,
      table.fechaLimite,
    ),
    datesCheck: check(
      "tareas_fechas_validas",
      sql`${table.fechaLimite} IS NULL OR ${table.fechaInicio} IS NULL OR ${table.fechaLimite} >= ${table.fechaInicio}`,
    ),
  }),
);

export const entregas = pgTable(
  "entregas",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tareaId: uuid("tarea_id")
      .notNull()
      .references(() => tareas.id, { onDelete: "cascade" }),
    estudianteId: uuid("estudiante_id")
      .notNull()
      .references(() => usuarios.id, { onDelete: "restrict" }),
    archivoId: uuid("archivo_id").references((): AnyPgColumn => archivosMetadata.id, {
      onDelete: "restrict",
    }),
    comentarioEstudiante: text("comentario_estudiante"),
    comentarioDocente: text("comentario_docente"),
    nota: numeric("nota", { precision: 6, scale: 2 }),
    intentoNumero: integer("intento_numero").notNull().default(1),
    estado: text("estado").notNull().default("entregada"),
    fechaEntrega: timestamp("fecha_entrega", { withTimezone: true })
      .notNull()
      .defaultNow(),
    fechaCalificacion: timestamp("fecha_calificacion", { withTimezone: true }),
  },
  (table) => ({
    taskStudentIdx: index("entregas_tarea_estudiante_idx").on(
      table.tareaId,
      table.estudianteId,
    ),
    attemptUnique: unique("entregas_tarea_id_estudiante_id_intento_numero_key").on(
      table.tareaId,
      table.estudianteId,
      table.intentoNumero,
    ),
    gradeCheck: check(
      "entregas_nota_check",
      sql`${table.nota} IS NULL OR ${table.nota}::numeric >= 0`,
    ),
    attemptCheck: check("entregas_intento_numero_check", sql`${table.intentoNumero} > 0`),
    statusCheck: check(
      "entregas_estado_check",
      sql`${table.estado} IN ('entregada', 'calificada', 'tarde', 'anulada')`,
    ),
  }),
);

export const quizzes = pgTable(
  "quizzes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    seccionId: uuid("seccion_id")
      .notNull()
      .references(() => secciones.id, { onDelete: "cascade" }),
    titulo: text("titulo").notNull(),
    descripcion: text("descripcion"),
    tiempoLimiteMinutos: integer("tiempo_limite_minutos"),
    intentosMaximos: integer("intentos_maximos").notNull().default(1),
    mostrarRespuestas: boolean("mostrar_respuestas").notNull().default(false),
    activo: boolean("activo").notNull().default(true),
    createdAt: now(),
    updatedAt: updatedAt(),
  },
  (table) => ({
    sectionIdx: index("quizzes_seccion_idx").on(table.seccionId),
    timeLimitCheck: check(
      "quizzes_tiempo_limite_minutos_check",
      sql`${table.tiempoLimiteMinutos} IS NULL OR ${table.tiempoLimiteMinutos} > 0`,
    ),
    attemptsCheck: check("quizzes_intentos_maximos_check", sql`${table.intentosMaximos} > 0`),
  }),
);

export const quizPreguntas = pgTable(
  "quiz_preguntas",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    quizId: uuid("quiz_id")
      .notNull()
      .references(() => quizzes.id, { onDelete: "cascade" }),
    pregunta: text("pregunta").notNull(),
    tipo: text("tipo").notNull(),
    opciones: jsonb("opciones").notNull().default([]),
    puntaje: numeric("puntaje", { precision: 6, scale: 2 }).notNull(),
    orden: integer("orden").notNull(),
  },
  (table) => ({
    orderUnique: unique("quiz_preguntas_quiz_id_orden_key").on(table.quizId, table.orden),
    scoreCheck: check("quiz_preguntas_puntaje_check", sql`${table.puntaje}::numeric >= 0`),
    orderCheck: check("quiz_preguntas_orden_check", sql`${table.orden} > 0`),
  }),
);

export const quizClavesRespuesta = pgTable("quiz_claves_respuesta", {
  preguntaId: uuid("pregunta_id")
    .primaryKey()
    .references(() => quizPreguntas.id, { onDelete: "cascade" }),
  respuestaCorrecta: jsonb("respuesta_correcta").notNull(),
});

export const quizIntentos = pgTable(
  "quiz_intentos",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    quizId: uuid("quiz_id")
      .notNull()
      .references(() => quizzes.id, { onDelete: "restrict" }),
    estudianteId: uuid("estudiante_id")
      .notNull()
      .references(() => usuarios.id, { onDelete: "restrict" }),
    respuestas: jsonb("respuestas").notNull().default({}),
    nota: numeric("nota", { precision: 6, scale: 2 }),
    intentoNumero: integer("intento_numero").notNull(),
    fechaInicio: timestamp("fecha_inicio", { withTimezone: true })
      .notNull()
      .defaultNow(),
    fechaFin: timestamp("fecha_fin", { withTimezone: true }),
  },
  (table) => ({
    studentIdx: index("quiz_intentos_estudiante_idx").on(table.estudianteId, table.quizId),
    attemptUnique: unique("quiz_intentos_quiz_id_estudiante_id_intento_numero_key").on(
      table.quizId,
      table.estudianteId,
      table.intentoNumero,
    ),
    gradeCheck: check(
      "quiz_intentos_nota_check",
      sql`${table.nota} IS NULL OR ${table.nota}::numeric >= 0`,
    ),
    attemptCheck: check("quiz_intentos_numero_check", sql`${table.intentoNumero} > 0`),
  }),
);

export const criteriosCertificado = pgTable(
  "criterios_certificado",
  {
    cursoId: uuid("curso_id")
      .primaryKey()
      .references(() => cursos.id, { onDelete: "cascade" }),
    asistenciaMinimaPorcentaje: numeric("asistencia_minima_porcentaje", {
      precision: 5,
      scale: 2,
    }),
    notaMinima: numeric("nota_minima", { precision: 6, scale: 2 }),
    requiereRevisionManual: boolean("requiere_revision_manual")
      .notNull()
      .default(true),
    configuradoPor: uuid("configurado_por").references(() => usuarios.id, {
      onDelete: "restrict",
    }),
    updatedAt: updatedAt(),
  },
  (table) => ({
    attendanceCheck: check(
      "criterios_certificado_asistencia_check",
      sql`${table.asistenciaMinimaPorcentaje} IS NULL OR ${table.asistenciaMinimaPorcentaje}::numeric BETWEEN 0 AND 100`,
    ),
    gradeCheck: check(
      "criterios_certificado_nota_check",
      sql`${table.notaMinima} IS NULL OR ${table.notaMinima}::numeric >= 0`,
    ),
  }),
);

export const certificados = pgTable(
  "certificados",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    inscripcionId: uuid("inscripcion_id")
      .notNull()
      .references(() => inscripciones.id, { onDelete: "restrict" }),
    codigo: text("codigo").notNull(),
    emitidoPor: uuid("emitido_por")
      .notNull()
      .references(() => usuarios.id, { onDelete: "restrict" }),
    emitidoEn: timestamp("emitido_en", { withTimezone: true }).notNull().defaultNow(),
    archivoId: uuid("archivo_id").references((): AnyPgColumn => archivosMetadata.id, {
      onDelete: "restrict",
    }),
    createdAt: now(),
  },
  (table) => ({
    enrollmentUnique: unique("certificados_inscripcion_id_key").on(table.inscripcionId),
    codeUnique: unique("certificados_codigo_key").on(table.codigo),
  }),
);

export const materiales = pgTable(
  "materiales",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    seccionId: uuid("seccion_id")
      .notNull()
      .references(() => secciones.id, { onDelete: "cascade" }),
    nombre: text("nombre").notNull(),
    descripcion: text("descripcion"),
    archivoId: uuid("archivo_id").references((): AnyPgColumn => archivosMetadata.id, {
      onDelete: "restrict",
    }),
    propietarioId: uuid("propietario_id")
      .notNull()
      .references(() => usuarios.id, { onDelete: "restrict" }),
    estado: text("estado").notNull().default("activo"),
    createdAt: now(),
    updatedAt: updatedAt(),
  },
  (table) => ({
    sectionIdx: index("materiales_seccion_idx").on(table.seccionId, table.estado),
    statusCheck: check(
      "materiales_estado_check",
      sql`${table.estado} IN ('borrador', 'activo', 'archivado')`,
    ),
  }),
);

export const videos = pgTable(
  "videos",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    seccionId: uuid("seccion_id")
      .notNull()
      .references(() => secciones.id, { onDelete: "cascade" }),
    titulo: text("titulo").notNull(),
    descripcion: text("descripcion"),
    archivoId: uuid("archivo_id").references((): AnyPgColumn => archivosMetadata.id, {
      onDelete: "restrict",
    }),
    duracionSegundos: integer("duracion_segundos"),
    propietarioId: uuid("propietario_id")
      .notNull()
      .references(() => usuarios.id, { onDelete: "restrict" }),
    estado: text("estado").notNull().default("borrador"),
    createdAt: now(),
    updatedAt: updatedAt(),
  },
  (table) => ({
    sectionIdx: index("videos_seccion_idx").on(table.seccionId, table.estado),
    durationCheck: check(
      "videos_duracion_segundos_check",
      sql`${table.duracionSegundos} IS NULL OR ${table.duracionSegundos} > 0`,
    ),
    statusCheck: check(
      "videos_estado_check",
      sql`${table.estado} IN ('borrador', 'activo', 'archivado')`,
    ),
  }),
);

export const conversaciones = pgTable(
  "conversaciones",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    conversationKey: text("conversation_key").notNull(),
    seccionId: uuid("seccion_id").references(() => secciones.id, {
      onDelete: "restrict",
    }),
    createdAt: now(),
  },
  (table) => ({
    keyUnique: unique("conversaciones_conversation_key_key").on(table.conversationKey),
    keyCheck: check(
      "conversaciones_key_not_blank",
      sql`length(trim(${table.conversationKey})) > 0`,
    ),
  }),
);

export const conversacionParticipantes = pgTable(
  "conversacion_participantes",
  {
    conversacionId: uuid("conversacion_id")
      .notNull()
      .references(() => conversaciones.id, { onDelete: "cascade" }),
    usuarioId: uuid("usuario_id")
      .notNull()
      .references(() => usuarios.id, { onDelete: "restrict" }),
    createdAt: now(),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.conversacionId, table.usuarioId] }),
    userRevokedIdx: index("conversacion_participantes_usuario_idx").on(
      table.usuarioId,
      table.revokedAt,
    ),
    revocationCheck: check(
      "participante_revocation_valid",
      sql`${table.revokedAt} IS NULL OR ${table.revokedAt} >= ${table.createdAt}`,
    ),
  }),
);

export const mensajes = pgTable(
  "mensajes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    conversacionId: uuid("conversacion_id")
      .notNull()
      .references(() => conversaciones.id, { onDelete: "restrict" }),
    remitenteId: uuid("remitente_id")
      .notNull()
      .references(() => usuarios.id, { onDelete: "restrict" }),
    archivoId: uuid("archivo_id").references((): AnyPgColumn => archivosMetadata.id, {
      onDelete: "restrict",
    }),
    contenido: text("contenido").notNull(),
    createdAt: now(),
  },
  (table) => ({
    conversationDateIdx: index("mensajes_conversacion_fecha_idx").on(
      table.conversacionId,
      table.createdAt.desc(),
      table.id.desc(),
    ),
    contentCheck: check(
      "mensajes_contenido_length",
      sql`length(trim(${table.contenido})) BETWEEN 1 AND 4000`,
    ),
  }),
);

export const lecturasMensaje = pgTable(
  "lecturas_mensaje",
  {
    mensajeId: uuid("mensaje_id")
      .notNull()
      .references(() => mensajes.id, { onDelete: "cascade" }),
    usuarioId: uuid("usuario_id")
      .notNull()
      .references(() => usuarios.id, { onDelete: "restrict" }),
    leidoEn: timestamp("leido_en", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.mensajeId, table.usuarioId] }),
    userReadIdx: index("lecturas_usuario_idx").on(
      table.usuarioId,
      table.leidoEn.desc(),
    ),
  }),
);

export const notificaciones = pgTable(
  "notificaciones",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    usuarioId: uuid("usuario_id")
      .notNull()
      .references(() => usuarios.id, { onDelete: "cascade" }),
    tipo: text("tipo").notNull(),
    titulo: text("titulo").notNull(),
    mensaje: text("mensaje"),
    urlDestino: text("url_destino"),
    leidaEn: timestamp("leida_en", { withTimezone: true }),
    createdAt: now(),
  },
  (table) => ({
    userCreatedIdx: index("notificaciones_usuario_fecha_idx").on(
      table.usuarioId,
      table.createdAt.desc(),
    ),
    unreadIdx: index("notificaciones_no_leidas_idx")
      .on(table.usuarioId, table.createdAt.desc())
      .where(sql`${table.leidaEn} IS NULL`),
    typeCheck: check(
      "notificaciones_tipo_not_blank",
      sql`length(trim(${table.tipo})) > 0`,
    ),
    titleCheck: check(
      "notificaciones_titulo_not_blank",
      sql`length(trim(${table.titulo})) > 0`,
    ),
  }),
);

export const archivosMetadata = pgTable(
  "archivos_metadata",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    bucketId: text("bucket_id").notNull(),
    objectPath: text("object_path").notNull(),
    nombreOriginal: text("nombre_original").notNull(),
    mimeType: text("mime_type"),
    tamanoBytes: bigint("tamaño_bytes", { mode: "number" }),
    categoria: fileCategory("categoria").notNull(),
    propietarioId: uuid("propietario_id")
      .notNull()
      .references(() => usuarios.id, { onDelete: "restrict" }),
    usuarioRelacionadoId: uuid("usuario_relacionado_id").references(
      () => usuarios.id,
      { onDelete: "restrict" },
    ),
    pagoId: uuid("pago_id").references((): AnyPgColumn => pagos.id, { onDelete: "restrict" }),
    entregaId: uuid("entrega_id").references((): AnyPgColumn => entregas.id, {
      onDelete: "restrict",
    }),
    seccionId: uuid("seccion_id").references(() => secciones.id, {
      onDelete: "restrict",
    }),
    conversacionId: uuid("conversacion_id").references((): AnyPgColumn => conversaciones.id, {
      onDelete: "restrict",
    }),
    estado: fileStatus("estado").notNull().default("pending"),
    createdAt: now(),
    updatedAt: updatedAt(),
  },
  (table) => ({
    pathUnique: unique("archivos_metadata_bucket_id_object_path_key").on(
      table.bucketId,
      table.objectPath,
    ),
    ownerIdx: index("archivos_propietario_idx").on(
      table.propietarioId,
      table.createdAt.desc(),
    ),
    sectionIdx: index("archivos_seccion_idx").on(table.seccionId, table.categoria),
    paymentIdx: index("archivos_pago_idx").on(table.pagoId),
    submissionIdx: index("archivos_entrega_idx").on(table.entregaId),
    bucketCheck: check(
      "archivos_metadata_bucket_id_check",
      sql`${table.bucketId} IN ('profiles', 'documents', 'submissions', 'payments', 'learning-materials', 'media', 'attachments')`,
    ),
    sizeCheck: check(
      "archivos_metadata_tamano_bytes_check",
      sql`${table.tamanoBytes} IS NULL OR ${table.tamanoBytes} >= 0`,
    ),
    linkCountCheck: check(
      "archivos_un_solo_vinculo",
      sql`num_nonnulls(${table.usuarioRelacionadoId}, ${table.pagoId}, ${table.entregaId}, ${table.seccionId}, ${table.conversacionId}) = 1`,
    ),
    categoryLinkCheck: check(
      "archivos_vinculo_categoria",
      sql`(${table.categoria} IN ('profile', 'student_document', 'administrative_document') AND ${table.usuarioRelacionadoId} IS NOT NULL) OR (${table.categoria} = 'payment_proof' AND ${table.pagoId} IS NOT NULL) OR (${table.categoria} = 'submission' AND ${table.entregaId} IS NOT NULL) OR (${table.categoria} IN ('learning_material', 'video') AND ${table.seccionId} IS NOT NULL) OR (${table.categoria} = 'message_attachment' AND ${table.conversacionId} IS NOT NULL)`,
    ),
    pathCheck: check(
      "archivos_ruta_opaca",
      sql`length(trim(${table.objectPath})) > 0 AND ${table.objectPath} !~ '(^/|(^|/)\\.\\.?(/|$)|@)'`,
    ),
    nameCheck: check(
      "archivos_nombre_not_blank",
      sql`length(trim(${table.nombreOriginal})) > 0`,
    ),
    categoryBucketCheck: check(
      "archivos_categoria_bucket",
      sql`(${table.categoria} = 'profile' AND ${table.bucketId} = 'profiles') OR (${table.categoria} IN ('student_document', 'administrative_document') AND ${table.bucketId} = 'documents') OR (${table.categoria} = 'submission' AND ${table.bucketId} = 'submissions') OR (${table.categoria} = 'payment_proof' AND ${table.bucketId} = 'payments') OR (${table.categoria} = 'learning_material' AND ${table.bucketId} = 'learning-materials') OR (${table.categoria} = 'video' AND ${table.bucketId} = 'media') OR (${table.categoria} = 'message_attachment' AND ${table.bucketId} = 'attachments')`,
    ),
  }),
);
