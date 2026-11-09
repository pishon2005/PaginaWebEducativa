-- EDUKATECH migration 002: academic offering, reservations and learning records.

CREATE TYPE public.learning_modality AS ENUM ('presencial', 'virtual');
CREATE TYPE public.section_status AS ENUM ('borrador', 'activa', 'finalizada', 'cancelada');
CREATE TYPE public.reservation_status AS ENUM ('pendiente_pago', 'confirmada', 'cancelada');
CREATE TYPE public.payment_status AS ENUM ('pendiente', 'verificado', 'rechazado');
CREATE TYPE public.enrollment_status AS ENUM ('activa', 'suspendida', 'finalizada', 'cancelada');
CREATE TYPE public.academic_session_status AS ENUM ('programada', 'reprogramada', 'cancelada', 'realizada');
CREATE TYPE public.attendance_status AS ENUM ('presente', 'ausente', 'justificado');

CREATE TABLE public.categorias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  descripcion TEXT,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.cursos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  categoria_id UUID REFERENCES public.categorias(id) ON DELETE RESTRICT,
  slug TEXT NOT NULL UNIQUE,
  titulo TEXT NOT NULL,
  descripcion_corta TEXT,
  descripcion_larga TEXT,
  imagen_portada TEXT,
  precio NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (precio >= 0),
  moneda TEXT NOT NULL DEFAULT 'PEN' CHECK (moneda ~ '^[A-Z]{3}$'),
  duracion_horas INTEGER CHECK (duracion_horas IS NULL OR duracion_horas > 0),
  nivel TEXT NOT NULL DEFAULT 'principiante',
  docente_base_id UUID REFERENCES public.usuarios(id) ON DELETE SET NULL,
  certificado_activo BOOLEAN NOT NULL DEFAULT TRUE,
  publicado BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.secciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  curso_id UUID NOT NULL REFERENCES public.cursos(id) ON DELETE RESTRICT,
  codigo TEXT NOT NULL UNIQUE,
  modalidad public.learning_modality NOT NULL,
  docente_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE RESTRICT,
  capacidad INTEGER CHECK (capacidad IS NULL OR capacidad > 0),
  precio NUMERIC(10,2) CHECK (precio IS NULL OR precio >= 0),
  moneda TEXT CHECK (moneda IS NULL OR moneda ~ '^[A-Z]{3}$'),
  ubicacion TEXT,
  fecha_inicio TIMESTAMPTZ,
  fecha_fin TIMESTAMPTZ,
  reservas_desde TIMESTAMPTZ,
  reservas_hasta TIMESTAMPTZ,
  estado public.section_status NOT NULL DEFAULT 'borrador',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT secciones_fechas_validas CHECK (
    fecha_fin IS NULL OR fecha_inicio IS NULL OR fecha_fin > fecha_inicio
  ),
  CONSTRAINT secciones_reservas_validas CHECK (
    reservas_hasta IS NULL OR reservas_desde IS NULL OR reservas_hasta > reservas_desde
  ),
  CONSTRAINT secciones_moneda_requiere_precio CHECK (moneda IS NULL OR precio IS NOT NULL)
);

CREATE TABLE public.horarios_recurrentes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seccion_id UUID NOT NULL REFERENCES public.secciones(id) ON DELETE CASCADE,
  dia_semana SMALLINT NOT NULL CHECK (dia_semana BETWEEN 0 AND 6),
  hora_inicio TIME NOT NULL,
  hora_fin TIME NOT NULL,
  zona_horaria TEXT NOT NULL DEFAULT 'America/Lima',
  ubicacion TEXT,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT horarios_rango_valido CHECK (hora_fin > hora_inicio)
);

CREATE TABLE public.sesiones_academicas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seccion_id UUID NOT NULL REFERENCES public.secciones(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  inicio TIMESTAMPTZ NOT NULL,
  fin TIMESTAMPTZ NOT NULL,
  modalidad public.learning_modality NOT NULL,
  ubicacion TEXT,
  estado public.academic_session_status NOT NULL DEFAULT 'programada',
  reprogramada_de UUID REFERENCES public.sesiones_academicas(id) ON DELETE SET NULL,
  motivo_cambio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT sesiones_rango_valido CHECK (fin > inicio),
  CONSTRAINT sesiones_reprogramacion_motivo CHECK (
    reprogramada_de IS NULL OR NULLIF(trim(motivo_cambio), '') IS NOT NULL
  )
);

CREATE TABLE public.interesados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  apellido TEXT,
  email TEXT,
  telefono TEXT,
  curso_id UUID REFERENCES public.cursos(id) ON DELETE RESTRICT,
  origen TEXT NOT NULL DEFAULT 'web',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT interesados_contacto CHECK (
    NULLIF(trim(email), '') IS NOT NULL OR NULLIF(trim(telefono), '') IS NOT NULL
  ),
  CONSTRAINT interesados_datos_length CHECK (
    length(nombre) <= 120
    AND (apellido IS NULL OR length(apellido) <= 120)
    AND (email IS NULL OR length(email) <= 320)
    AND (telefono IS NULL OR length(telefono) <= 32)
    AND length(origen) <= 30
  )
);

CREATE TABLE public.reservas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interesado_id UUID REFERENCES public.interesados(id) ON DELETE RESTRICT,
  estudiante_id UUID REFERENCES public.usuarios(id) ON DELETE RESTRICT,
  seccion_id UUID NOT NULL REFERENCES public.secciones(id) ON DELETE RESTRICT,
  estado public.reservation_status NOT NULL DEFAULT 'pendiente_pago',
  monto NUMERIC(10,2) NOT NULL CHECK (monto >= 0),
  moneda TEXT NOT NULL CHECK (moneda ~ '^[A-Z]{3}$'),
  creada_por UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT reservas_solicitante_unico CHECK (num_nonnulls(interesado_id, estudiante_id) = 1)
);

CREATE UNIQUE INDEX reservas_interesado_seccion_active_idx
ON public.reservas (interesado_id, seccion_id)
WHERE interesado_id IS NOT NULL AND estado IN ('pendiente_pago', 'confirmada');

CREATE TABLE public.pagos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reserva_id UUID NOT NULL REFERENCES public.reservas(id) ON DELETE RESTRICT,
  monto NUMERIC(10,2) NOT NULL CHECK (monto >= 0),
  moneda TEXT NOT NULL CHECK (moneda ~ '^[A-Z]{3}$'),
  metodo_pago TEXT NOT NULL,
  estado public.payment_status NOT NULL DEFAULT 'pendiente',
  comprobante_archivo_id UUID,
  referencia_externa TEXT,
  verificado_por UUID REFERENCES public.usuarios(id) ON DELETE RESTRICT,
  fecha_verificacion TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT pagos_verificacion_consistente CHECK (
    (estado = 'pendiente' AND verificado_por IS NULL AND fecha_verificacion IS NULL)
    OR (estado IN ('verificado', 'rechazado') AND verificado_por IS NOT NULL AND fecha_verificacion IS NOT NULL)
  )
);

CREATE UNIQUE INDEX pagos_una_verificacion_por_reserva_idx
ON public.pagos (reserva_id)
WHERE estado = 'verificado';
CREATE UNIQUE INDEX pagos_uno_pendiente_por_reserva_idx
ON public.pagos (reserva_id)
WHERE estado = 'pendiente';

CREATE TABLE public.inscripciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reserva_id UUID NOT NULL UNIQUE REFERENCES public.reservas(id) ON DELETE RESTRICT,
  estudiante_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE RESTRICT,
  seccion_id UUID NOT NULL REFERENCES public.secciones(id) ON DELETE RESTRICT,
  estado public.enrollment_status NOT NULL DEFAULT 'activa',
  fecha_inscripcion TIMESTAMPTZ NOT NULL DEFAULT now(),
  progreso_porcentaje SMALLINT NOT NULL DEFAULT 0 CHECK (progreso_porcentaje BETWEEN 0 AND 100),
  completado BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (estudiante_id, seccion_id)
);

CREATE TABLE public.asistencias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sesion_id UUID NOT NULL REFERENCES public.sesiones_academicas(id) ON DELETE CASCADE,
  estudiante_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE RESTRICT,
  estado public.attendance_status NOT NULL,
  registrado_por UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE RESTRICT,
  motivo TEXT,
  fecha_registro TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (sesion_id, estudiante_id),
  CONSTRAINT asistencias_justificacion CHECK (
    estado <> 'justificado' OR NULLIF(trim(motivo), '') IS NOT NULL
  )
);

CREATE TABLE public.historial_asistencias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asistencia_id UUID NOT NULL REFERENCES public.asistencias(id) ON DELETE RESTRICT,
  actor_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE RESTRICT,
  estado_anterior public.attendance_status,
  estado_nuevo public.attendance_status NOT NULL,
  motivo TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.tareas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seccion_id UUID NOT NULL REFERENCES public.secciones(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  fecha_inicio TIMESTAMPTZ,
  fecha_limite TIMESTAMPTZ,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT tareas_fechas_validas CHECK (
    fecha_limite IS NULL OR fecha_inicio IS NULL OR fecha_limite >= fecha_inicio
  )
);

CREATE TABLE public.entregas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tarea_id UUID NOT NULL REFERENCES public.tareas(id) ON DELETE CASCADE,
  estudiante_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE RESTRICT,
  archivo_id UUID,
  comentario_estudiante TEXT,
  comentario_docente TEXT,
  nota NUMERIC(6,2) CHECK (nota IS NULL OR nota >= 0),
  intento_numero INTEGER NOT NULL DEFAULT 1 CHECK (intento_numero > 0),
  estado TEXT NOT NULL DEFAULT 'entregada' CHECK (
    estado IN ('entregada', 'calificada', 'tarde', 'anulada')
  ),
  fecha_entrega TIMESTAMPTZ NOT NULL DEFAULT now(),
  fecha_calificacion TIMESTAMPTZ,
  UNIQUE (tarea_id, estudiante_id, intento_numero)
);

CREATE TABLE public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seccion_id UUID NOT NULL REFERENCES public.secciones(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  tiempo_limite_minutos INTEGER CHECK (
    tiempo_limite_minutos IS NULL OR tiempo_limite_minutos > 0
  ),
  intentos_maximos INTEGER NOT NULL DEFAULT 1 CHECK (intentos_maximos > 0),
  mostrar_respuestas BOOLEAN NOT NULL DEFAULT FALSE,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.quiz_preguntas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  pregunta TEXT NOT NULL,
  tipo TEXT NOT NULL,
  opciones JSONB NOT NULL DEFAULT '[]'::jsonb,
  puntaje NUMERIC(6,2) NOT NULL CHECK (puntaje >= 0),
  orden INTEGER NOT NULL CHECK (orden > 0),
  UNIQUE (quiz_id, orden)
);

CREATE TABLE public.quiz_claves_respuesta (
  pregunta_id UUID PRIMARY KEY REFERENCES public.quiz_preguntas(id) ON DELETE CASCADE,
  respuesta_correcta JSONB NOT NULL
);

CREATE TABLE public.quiz_intentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE RESTRICT,
  estudiante_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE RESTRICT,
  respuestas JSONB NOT NULL DEFAULT '{}'::jsonb,
  nota NUMERIC(6,2) CHECK (nota IS NULL OR nota >= 0),
  intento_numero INTEGER NOT NULL CHECK (intento_numero > 0),
  fecha_inicio TIMESTAMPTZ NOT NULL DEFAULT now(),
  fecha_fin TIMESTAMPTZ,
  UNIQUE (quiz_id, estudiante_id, intento_numero)
);

CREATE TABLE public.criterios_certificado (
  curso_id UUID PRIMARY KEY REFERENCES public.cursos(id) ON DELETE CASCADE,
  asistencia_minima_porcentaje NUMERIC(5,2) CHECK (
    asistencia_minima_porcentaje IS NULL OR asistencia_minima_porcentaje BETWEEN 0 AND 100
  ),
  nota_minima NUMERIC(6,2) CHECK (nota_minima IS NULL OR nota_minima >= 0),
  requiere_revision_manual BOOLEAN NOT NULL DEFAULT TRUE,
  configurado_por UUID REFERENCES public.usuarios(id) ON DELETE RESTRICT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.certificados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inscripcion_id UUID NOT NULL UNIQUE REFERENCES public.inscripciones(id) ON DELETE RESTRICT,
  codigo TEXT NOT NULL UNIQUE,
  emitido_por UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE RESTRICT,
  emitido_en TIMESTAMPTZ NOT NULL DEFAULT now(),
  archivo_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.materiales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seccion_id UUID NOT NULL REFERENCES public.secciones(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  archivo_id UUID,
  propietario_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE RESTRICT,
  estado TEXT NOT NULL DEFAULT 'activo' CHECK (estado IN ('borrador', 'activo', 'archivado')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seccion_id UUID NOT NULL REFERENCES public.secciones(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  archivo_id UUID,
  duracion_segundos INTEGER CHECK (duracion_segundos IS NULL OR duracion_segundos > 0),
  propietario_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE RESTRICT,
  estado TEXT NOT NULL DEFAULT 'borrador' CHECK (estado IN ('borrador', 'activo', 'archivado')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX categorias_activo_idx ON public.categorias (activo);
CREATE INDEX cursos_categoria_publicado_idx ON public.cursos (categoria_id, publicado);
CREATE INDEX cursos_docente_base_id_idx ON public.cursos (docente_base_id);
CREATE INDEX secciones_curso_estado_idx ON public.secciones (curso_id, estado);
CREATE INDEX secciones_docente_estado_idx ON public.secciones (docente_id, estado);
CREATE INDEX horarios_seccion_dia_idx ON public.horarios_recurrentes (seccion_id, dia_semana);
CREATE INDEX sesiones_seccion_inicio_idx ON public.sesiones_academicas (seccion_id, inicio);
CREATE INDEX interesados_curso_created_idx ON public.interesados (curso_id, created_at DESC);
CREATE INDEX reservas_seccion_estado_idx ON public.reservas (seccion_id, estado);
CREATE INDEX reservas_estudiante_idx ON public.reservas (estudiante_id, created_at DESC);
CREATE INDEX pagos_reserva_estado_idx ON public.pagos (reserva_id, estado);
CREATE INDEX inscripciones_estudiante_estado_idx ON public.inscripciones (estudiante_id, estado);
CREATE INDEX asistencias_sesion_idx ON public.asistencias (sesion_id, estado);
CREATE INDEX tareas_seccion_fecha_idx ON public.tareas (seccion_id, fecha_limite);
CREATE INDEX entregas_tarea_estudiante_idx ON public.entregas (tarea_id, estudiante_id);
CREATE INDEX quizzes_seccion_idx ON public.quizzes (seccion_id);
CREATE INDEX quiz_intentos_estudiante_idx ON public.quiz_intentos (estudiante_id, quiz_id);
CREATE INDEX materiales_seccion_idx ON public.materiales (seccion_id, estado);
CREATE INDEX videos_seccion_idx ON public.videos (seccion_id, estado);

CREATE TRIGGER categorias_set_updated_at BEFORE UPDATE ON public.categorias
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER cursos_set_updated_at BEFORE UPDATE ON public.cursos
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER secciones_set_updated_at BEFORE UPDATE ON public.secciones
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER horarios_set_updated_at BEFORE UPDATE ON public.horarios_recurrentes
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER sesiones_set_updated_at BEFORE UPDATE ON public.sesiones_academicas
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER reservas_set_updated_at BEFORE UPDATE ON public.reservas
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER pagos_set_updated_at BEFORE UPDATE ON public.pagos
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER inscripciones_set_updated_at BEFORE UPDATE ON public.inscripciones
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER asistencias_set_updated_at BEFORE UPDATE ON public.asistencias
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER tareas_set_updated_at BEFORE UPDATE ON public.tareas
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER quizzes_set_updated_at BEFORE UPDATE ON public.quizzes
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER materiales_set_updated_at BEFORE UPDATE ON public.materiales
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER videos_set_updated_at BEFORE UPDATE ON public.videos
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
