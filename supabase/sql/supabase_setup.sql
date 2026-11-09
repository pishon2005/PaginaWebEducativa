-- Consolidated reference generated from the official Supabase migration sequence.
-- Do not apply independently; use Supabase CLI and the ordered files in supabase/migrations.

-- BEGIN supabase\migrations\202501020001_initial_core_security.sql
-- EDUKATECH migration 001: identity, institutional roles and audit foundation.
-- All application identities are Supabase Auth UUIDs; passwords are never copied.

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

CREATE TYPE public.account_status AS ENUM (
  'pendiente',
  'activo',
  'suspendido',
  'inactivo'
);

CREATE TABLE public.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL UNIQUE,
  descripcion TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT roles_nombre_valid CHECK (
    nombre IN ('superadministrador', 'administrador', 'docente', 'estudiante')
  )
);

INSERT INTO public.roles (nombre, descripcion) VALUES
  ('superadministrador', 'Administración global de la plataforma'),
  ('administrador', 'Administración institucional'),
  ('docente', 'Gestión de secciones académicas asignadas'),
  ('estudiante', 'Acceso a convocatorias con inscripción activa');

CREATE TABLE public.usuarios (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL DEFAULT '',
  foto_perfil TEXT,
  telefono TEXT,
  pais TEXT,
  idioma_preferido TEXT NOT NULL DEFAULT 'es',
  codigo_alumno TEXT UNIQUE,
  rol_id UUID NOT NULL REFERENCES public.roles(id),
  estado public.account_status NOT NULL DEFAULT 'pendiente',
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  email_verificado BOOLEAN NOT NULL DEFAULT FALSE,
  primer_login BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT usuarios_email_not_blank CHECK (length(trim(email)) > 0),
  CONSTRAINT usuarios_nombre_not_blank CHECK (length(trim(nombre)) > 0)
);

CREATE TABLE public.perfiles_docente (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL UNIQUE REFERENCES public.usuarios(id) ON DELETE CASCADE,
  biografia TEXT,
  especialidades JSONB NOT NULL DEFAULT '[]'::jsonb,
  certificaciones JSONB NOT NULL DEFAULT '[]'::jsonb,
  linkedin_url TEXT,
  anos_experiencia INTEGER CHECK (anos_experiencia IS NULL OR anos_experiencia >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.configuraciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clave TEXT NOT NULL UNIQUE,
  valor_json JSONB,
  descripcion TEXT,
  modificado_por UUID REFERENCES public.usuarios(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.auditoria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES public.usuarios(id) ON DELETE SET NULL,
  entidad TEXT NOT NULL,
  entidad_id UUID,
  accion TEXT NOT NULL,
  detalle JSONB NOT NULL DEFAULT '{}'::jsonb,
  resultado TEXT NOT NULL DEFAULT 'ok',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT auditoria_resultado_valid CHECK (resultado IN ('ok', 'rechazado', 'error'))
);

CREATE INDEX usuarios_rol_id_idx ON public.usuarios (rol_id);
CREATE INDEX usuarios_estado_idx ON public.usuarios (estado, activo);
CREATE INDEX auditoria_entidad_idx ON public.auditoria (entidad, entidad_id, created_at DESC);
CREATE INDEX auditoria_actor_idx ON public.auditoria (actor_id, created_at DESC);

CREATE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = pg_catalog
AS $$
BEGIN
  NEW.updated_at := pg_catalog.now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER usuarios_set_updated_at
BEFORE UPDATE ON public.usuarios
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER perfiles_docente_set_updated_at
BEFORE UPDATE ON public.perfiles_docente
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER configuraciones_set_updated_at
BEFORE UPDATE ON public.configuraciones
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Safe profile bootstrap: Auth metadata is used only for display-name fields.
-- Role and account status are fixed by trusted database defaults/catalog data.
CREATE FUNCTION public.create_basic_profile_for_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  student_role_id UUID;
BEGIN
  SELECT r.id INTO STRICT student_role_id
  FROM public.roles AS r
  WHERE r.nombre = 'estudiante';

  INSERT INTO public.usuarios (
    id, email, nombre, apellido, rol_id, estado, email_verificado
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NULLIF(pg_catalog.left(NEW.raw_user_meta_data ->> 'nombre', 100), ''), 'Usuario'),
    COALESCE(pg_catalog.left(NEW.raw_user_meta_data ->> 'apellido', 100), ''),
    student_role_id,
    'pendiente',
    COALESCE(NEW.email_confirmed_at IS NOT NULL, FALSE)
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

CREATE TRIGGER auth_user_profile_bootstrap
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.create_basic_profile_for_auth_user();

REVOKE ALL ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.create_basic_profile_for_auth_user() FROM PUBLIC, anon, authenticated;
-- END supabase\migrations\202501020001_initial_core_security.sql

-- BEGIN supabase\migrations\202501020002_academics_enrollments.sql
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
-- END supabase\migrations\202501020002_academics_enrollments.sql

-- BEGIN supabase\migrations\202501020003_privacy_storage_realtime.sql
-- EDUKATECH migration 003: private communication, file metadata, authorization,
-- transaction-safe workflows, Storage and Realtime policies.

CREATE TYPE public.file_category AS ENUM (
  'profile',
  'student_document',
  'payment_proof',
  'submission',
  'learning_material',
  'video',
  'administrative_document',
  'message_attachment'
);

CREATE TYPE public.file_status AS ENUM ('pending', 'active', 'quarantined', 'deleted');

CREATE TABLE public.conversaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_key TEXT NOT NULL UNIQUE,
  seccion_id UUID REFERENCES public.secciones(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT conversaciones_key_not_blank CHECK (length(trim(conversation_key)) > 0)
);

CREATE TABLE public.conversacion_participantes (
  conversacion_id UUID NOT NULL REFERENCES public.conversaciones(id) ON DELETE CASCADE,
  usuario_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  revoked_at TIMESTAMPTZ,
  PRIMARY KEY (conversacion_id, usuario_id),
  CONSTRAINT participante_revocation_valid CHECK (revoked_at IS NULL OR revoked_at >= created_at)
);

CREATE TABLE public.mensajes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversacion_id UUID NOT NULL REFERENCES public.conversaciones(id) ON DELETE RESTRICT,
  remitente_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE RESTRICT,
  archivo_id UUID,
  contenido TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT mensajes_contenido_length CHECK (
    length(trim(contenido)) BETWEEN 1 AND 4000
  )
);

CREATE TABLE public.lecturas_mensaje (
  mensaje_id UUID NOT NULL REFERENCES public.mensajes(id) ON DELETE CASCADE,
  usuario_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE RESTRICT,
  leido_en TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (mensaje_id, usuario_id)
);

CREATE TABLE public.notificaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL,
  titulo TEXT NOT NULL,
  mensaje TEXT,
  url_destino TEXT,
  leida_en TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT notificaciones_tipo_not_blank CHECK (length(trim(tipo)) > 0),
  CONSTRAINT notificaciones_titulo_not_blank CHECK (length(trim(titulo)) > 0)
);

CREATE TABLE public.archivos_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket_id TEXT NOT NULL CHECK (
    bucket_id IN (
      'profiles',
      'documents',
      'submissions',
      'payments',
      'learning-materials',
      'media',
      'attachments'
    )
  ),
  object_path TEXT NOT NULL,
  nombre_original TEXT NOT NULL,
  mime_type TEXT,
  tamaño_bytes BIGINT CHECK (tamaño_bytes IS NULL OR tamaño_bytes >= 0),
  categoria public.file_category NOT NULL,
  propietario_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE RESTRICT,
  usuario_relacionado_id UUID REFERENCES public.usuarios(id) ON DELETE RESTRICT,
  pago_id UUID REFERENCES public.pagos(id) ON DELETE RESTRICT,
  entrega_id UUID REFERENCES public.entregas(id) ON DELETE RESTRICT,
  seccion_id UUID REFERENCES public.secciones(id) ON DELETE RESTRICT,
  conversacion_id UUID REFERENCES public.conversaciones(id) ON DELETE RESTRICT,
  estado public.file_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (bucket_id, object_path),
  CONSTRAINT archivos_un_solo_vinculo CHECK (
    num_nonnulls(usuario_relacionado_id, pago_id, entrega_id, seccion_id, conversacion_id) = 1
  ),
  CONSTRAINT archivos_vinculo_categoria CHECK (
    (categoria IN ('profile', 'student_document', 'administrative_document')
      AND usuario_relacionado_id IS NOT NULL)
    OR (categoria = 'payment_proof' AND pago_id IS NOT NULL)
    OR (categoria = 'submission' AND entrega_id IS NOT NULL)
    OR (categoria IN ('learning_material', 'video') AND seccion_id IS NOT NULL)
    OR (categoria = 'message_attachment' AND conversacion_id IS NOT NULL)
  ),
  CONSTRAINT archivos_ruta_opaca CHECK (
    length(trim(object_path)) > 0
    AND object_path !~ '(^/|(^|/)\.\.?(/|$)|@)'
  ),
  CONSTRAINT archivos_nombre_not_blank CHECK (length(trim(nombre_original)) > 0),
  CONSTRAINT archivos_categoria_bucket CHECK (
    (categoria = 'profile' AND bucket_id = 'profiles')
    OR (categoria IN ('student_document', 'administrative_document') AND bucket_id = 'documents')
    OR (categoria = 'submission' AND bucket_id = 'submissions')
    OR (categoria = 'payment_proof' AND bucket_id = 'payments')
    OR (categoria = 'learning_material' AND bucket_id = 'learning-materials')
    OR (categoria = 'video' AND bucket_id = 'media')
    OR (categoria = 'message_attachment' AND bucket_id = 'attachments')
  )
);

ALTER TABLE public.pagos
  ADD CONSTRAINT pagos_comprobante_archivo_fk
  FOREIGN KEY (comprobante_archivo_id) REFERENCES public.archivos_metadata(id) ON DELETE RESTRICT;
ALTER TABLE public.entregas
  ADD CONSTRAINT entregas_archivo_fk
  FOREIGN KEY (archivo_id) REFERENCES public.archivos_metadata(id) ON DELETE RESTRICT;
ALTER TABLE public.materiales
  ADD CONSTRAINT materiales_archivo_fk
  FOREIGN KEY (archivo_id) REFERENCES public.archivos_metadata(id) ON DELETE RESTRICT;
ALTER TABLE public.videos
  ADD CONSTRAINT videos_archivo_fk
  FOREIGN KEY (archivo_id) REFERENCES public.archivos_metadata(id) ON DELETE RESTRICT;
ALTER TABLE public.certificados
  ADD CONSTRAINT certificados_archivo_fk
  FOREIGN KEY (archivo_id) REFERENCES public.archivos_metadata(id) ON DELETE RESTRICT;
ALTER TABLE public.mensajes
  ADD CONSTRAINT mensajes_archivo_fk
  FOREIGN KEY (archivo_id) REFERENCES public.archivos_metadata(id) ON DELETE RESTRICT;

CREATE INDEX conversacion_participantes_usuario_idx
ON public.conversacion_participantes (usuario_id, revoked_at);
CREATE INDEX mensajes_conversacion_fecha_idx
ON public.mensajes (conversacion_id, created_at DESC, id DESC);
CREATE INDEX lecturas_usuario_idx ON public.lecturas_mensaje (usuario_id, leido_en DESC);
CREATE INDEX notificaciones_usuario_fecha_idx
ON public.notificaciones (usuario_id, created_at DESC);
CREATE INDEX notificaciones_no_leidas_idx
ON public.notificaciones (usuario_id, created_at DESC) WHERE leida_en IS NULL;
CREATE INDEX archivos_propietario_idx ON public.archivos_metadata (propietario_id, created_at DESC);
CREATE INDEX archivos_seccion_idx ON public.archivos_metadata (seccion_id, categoria);
CREATE INDEX archivos_pago_idx ON public.archivos_metadata (pago_id);
CREATE INDEX archivos_entrega_idx ON public.archivos_metadata (entrega_id);

CREATE TRIGGER archivos_metadata_set_updated_at BEFORE UPDATE ON public.archivos_metadata
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Helper functions read protected profile/relationship rows as the migration owner.
-- They expose only boolean/role results, use a fixed search_path, and are not writable.
CREATE FUNCTION public.current_app_role()
RETURNS TEXT
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public, auth
AS $$
  SELECT r.nombre
  FROM public.usuarios AS u
  JOIN public.roles AS r ON r.id = u.rol_id
  WHERE u.id = auth.uid()
    AND u.activo
    AND u.estado = 'activo'
$$;

CREATE FUNCTION public.is_app_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public, auth
AS $$
  SELECT COALESCE(public.current_app_role() IN ('administrador', 'superadministrador'), FALSE)
$$;

CREATE FUNCTION public.is_superadmin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public, auth
AS $$
  SELECT COALESCE(public.current_app_role() = 'superadministrador', FALSE)
$$;

CREATE FUNCTION public.is_section_teacher(p_section_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public, auth
AS $$
  SELECT COALESCE(
    public.current_app_role() = 'docente'
    AND EXISTS (
      SELECT 1
      FROM public.secciones AS s
      WHERE s.id = p_section_id AND s.docente_id = auth.uid()
    ),
    FALSE
  )
$$;

CREATE FUNCTION public.is_enrolled_in_section(p_section_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public, auth
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.inscripciones AS i
    JOIN public.usuarios AS u ON u.id = i.estudiante_id
    JOIN public.roles AS r ON r.id = u.rol_id
    WHERE i.seccion_id = p_section_id
      AND i.estudiante_id = auth.uid()
      AND i.estado = 'activa'
      AND r.nombre = 'estudiante'
      AND u.activo
      AND u.estado = 'activo'
  )
$$;

CREATE FUNCTION public.is_conversation_participant(p_conversation_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public, auth
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.conversacion_participantes AS cp
    WHERE cp.conversacion_id = p_conversation_id
      AND cp.usuario_id = auth.uid()
      AND cp.revoked_at IS NULL
      AND public.current_app_role() IS NOT NULL
  )
$$;

CREATE FUNCTION public.can_access_file(p_file_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public, auth
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.archivos_metadata AS f
    WHERE f.id = p_file_id
      AND f.estado = 'active'
      AND (
        (
          f.propietario_id = auth.uid()
          AND (
            f.categoria <> 'message_attachment'
            OR (
              f.conversacion_id IS NOT NULL
              AND public.is_conversation_participant(f.conversacion_id)
            )
          )
        )
        OR (
          f.categoria <> 'message_attachment'
          AND public.is_app_admin()
        )
        OR (
          f.categoria IN ('learning_material', 'video', 'submission')
          AND f.seccion_id IS NOT NULL
          AND public.is_section_teacher(f.seccion_id)
        )
        OR (
          f.categoria IN ('learning_material', 'video')
          AND f.seccion_id IS NOT NULL
          AND public.is_enrolled_in_section(f.seccion_id)
        )
        OR (
          f.categoria = 'message_attachment'
          AND f.conversacion_id IS NOT NULL
          AND public.is_conversation_participant(f.conversacion_id)
        )
        OR (
          f.categoria = 'payment_proof'
          AND EXISTS (
            SELECT 1
            FROM public.pagos AS p
            JOIN public.reservas AS r ON r.id = p.reserva_id
            WHERE p.id = f.pago_id
              AND r.estudiante_id = auth.uid()
          )
        )
        OR (
          f.categoria = 'submission'
          AND EXISTS (
            SELECT 1
            FROM public.entregas AS e
            WHERE e.id = f.entrega_id AND e.estudiante_id = auth.uid()
          )
        )
        OR (
          f.categoria IN ('profile', 'student_document')
          AND f.usuario_relacionado_id = auth.uid()
        )
      )
  )
$$;

CREATE FUNCTION public.can_upload_file(p_file_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public, auth
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.archivos_metadata AS f
    WHERE f.id = p_file_id
      AND f.propietario_id = auth.uid()
      AND f.estado = 'pending'
      AND (
        (
          f.categoria IN ('profile', 'student_document')
          AND f.usuario_relacionado_id = auth.uid()
        )
        OR (
          f.categoria IN ('payment_proof', 'submission')
          AND (
            public.is_app_admin()
            OR (
              f.categoria = 'payment_proof'
              AND EXISTS (
                SELECT 1
                FROM public.pagos AS p
                JOIN public.reservas AS r ON r.id = p.reserva_id
                WHERE p.id = f.pago_id AND r.estudiante_id = auth.uid()
              )
            )
            OR (
              f.categoria = 'submission'
              AND EXISTS (
                SELECT 1
                FROM public.entregas AS e
                WHERE e.id = f.entrega_id AND e.estudiante_id = auth.uid()
              )
            )
          )
        )
        OR (
          f.categoria IN ('learning_material', 'video')
          AND f.seccion_id IS NOT NULL
          AND (public.is_app_admin() OR public.is_section_teacher(f.seccion_id))
        )
        OR (
          f.categoria = 'administrative_document'
          AND public.is_app_admin()
        )
        OR (
          f.categoria = 'message_attachment'
          AND f.conversacion_id IS NOT NULL
          AND public.is_conversation_participant(f.conversacion_id)
        )
      )
  )
$$;

CREATE FUNCTION public.can_manage_file(p_file_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public, auth
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.archivos_metadata AS f
    WHERE f.id = p_file_id
      AND (
        (
          f.propietario_id = auth.uid()
          AND f.categoria IN ('profile', 'student_document')
        )
        OR (
          f.categoria NOT IN ('message_attachment', 'payment_proof')
          AND public.is_app_admin()
        )
        OR (
          f.categoria IN ('learning_material', 'video', 'submission')
          AND f.seccion_id IS NOT NULL
          AND public.is_section_teacher(f.seccion_id)
        )
        OR (
          f.categoria = 'message_attachment'
          AND f.conversacion_id IS NOT NULL
          AND public.is_conversation_participant(f.conversacion_id)
        )
      )
  )
$$;

REVOKE ALL ON FUNCTION public.current_app_role() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.is_app_admin() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.is_superadmin() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.is_section_teacher(UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.is_enrolled_in_section(UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.is_conversation_participant(UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.can_access_file(UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.can_upload_file(UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.can_manage_file(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.current_app_role() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_app_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_superadmin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_section_teacher(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_enrolled_in_section(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_conversation_participant(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_access_file(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_upload_file(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_manage_file(UUID) TO authenticated;

CREATE FUNCTION public.create_reservation(p_section_id UUID, p_interested_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, auth
AS $$
DECLARE
  section_row public.secciones%ROWTYPE;
  course_row public.cursos%ROWTYPE;
  reservation_id UUID;
  active_reservations BIGINT;
  interest_course_id UUID;
BEGIN
  IF NOT public.is_app_admin() THEN
    RAISE EXCEPTION 'not authorized' USING ERRCODE = '42501';
  END IF;

  SELECT * INTO STRICT section_row
  FROM public.secciones
  WHERE id = p_section_id
  FOR UPDATE;

  IF section_row.estado <> 'activa'
     OR (section_row.reservas_desde IS NOT NULL AND now() < section_row.reservas_desde)
     OR (section_row.reservas_hasta IS NOT NULL AND now() > section_row.reservas_hasta) THEN
    RAISE EXCEPTION 'section unavailable for reservation' USING ERRCODE = '23514';
  END IF;

  SELECT * INTO STRICT course_row
  FROM public.cursos
  WHERE id = section_row.curso_id;

  SELECT i.curso_id INTO STRICT interest_course_id
  FROM public.interesados AS i
  WHERE i.id = p_interested_id;

  IF interest_course_id IS NOT NULL AND interest_course_id <> section_row.curso_id THEN
    RAISE EXCEPTION 'interest does not match course' USING ERRCODE = '23514';
  END IF;

  SELECT r.id INTO reservation_id
  FROM public.reservas AS r
  WHERE r.interesado_id = p_interested_id
    AND r.seccion_id = p_section_id
    AND r.estado IN ('pendiente_pago', 'confirmada');
  IF reservation_id IS NOT NULL THEN
    RETURN reservation_id;
  END IF;

  SELECT count(*) INTO active_reservations
  FROM public.reservas AS r
  WHERE r.seccion_id = p_section_id
    AND r.estado IN ('pendiente_pago', 'confirmada');

  IF section_row.capacidad IS NOT NULL AND active_reservations >= section_row.capacidad THEN
    RAISE EXCEPTION 'section capacity reached' USING ERRCODE = '23514';
  END IF;

  INSERT INTO public.reservas (
    interesado_id, seccion_id, estado, monto, moneda, creada_por
  )
  VALUES (
    p_interested_id,
    p_section_id,
    'pendiente_pago',
    COALESCE(section_row.precio, course_row.precio),
    COALESCE(section_row.moneda, course_row.moneda),
    auth.uid()
  )
  RETURNING id INTO reservation_id;

  INSERT INTO public.auditoria (actor_id, entidad, entidad_id, accion, detalle)
  VALUES (
    auth.uid(), 'reservas', reservation_id, 'crear',
    jsonb_build_object('seccion_id', p_section_id, 'interesado_id', p_interested_id)
  );

  RETURN reservation_id;
END;
$$;

CREATE FUNCTION public.verify_payment(p_payment_id UUID, p_approved BOOLEAN)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, auth
AS $$
DECLARE
  payment_row public.pagos%ROWTYPE;
BEGIN
  IF NOT public.is_app_admin() THEN
    RAISE EXCEPTION 'not authorized' USING ERRCODE = '42501';
  END IF;

  SELECT * INTO STRICT payment_row
  FROM public.pagos
  WHERE id = p_payment_id
  FOR UPDATE;

  IF payment_row.estado <> 'pendiente' THEN
    RAISE EXCEPTION 'payment already reviewed' USING ERRCODE = '23505';
  END IF;

  UPDATE public.pagos
  SET estado = CASE WHEN p_approved THEN 'verificado'::public.payment_status
                    ELSE 'rechazado'::public.payment_status END,
      verificado_por = auth.uid(),
      fecha_verificacion = now()
  WHERE id = p_payment_id;

  INSERT INTO public.auditoria (actor_id, entidad, entidad_id, accion, detalle)
  VALUES (
    auth.uid(), 'pagos', p_payment_id,
    CASE WHEN p_approved THEN 'verificar' ELSE 'rechazar' END,
    jsonb_build_object('reserva_id', payment_row.reserva_id)
  );

  RETURN p_payment_id;
END;
$$;

CREATE FUNCTION public.register_payment(
  p_reservation_id UUID,
  p_method TEXT,
  p_reference TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, auth
AS $$
DECLARE
  reservation_row public.reservas%ROWTYPE;
  payment_id UUID;
BEGIN
  IF NOT public.is_app_admin() THEN
    RAISE EXCEPTION 'not authorized' USING ERRCODE = '42501';
  END IF;
  IF NULLIF(trim(p_method), '') IS NULL OR length(p_method) > 40
     OR (p_reference IS NOT NULL AND length(p_reference) > 200) THEN
    RAISE EXCEPTION 'invalid payment details' USING ERRCODE = '22023';
  END IF;

  SELECT * INTO STRICT reservation_row
  FROM public.reservas
  WHERE id = p_reservation_id
  FOR UPDATE;
  IF reservation_row.estado <> 'pendiente_pago' THEN
    RAISE EXCEPTION 'reservation is not awaiting payment' USING ERRCODE = '23514';
  END IF;
  IF EXISTS (
    SELECT 1 FROM public.pagos
    WHERE reserva_id = p_reservation_id AND estado = 'verificado'
  ) THEN
    RAISE EXCEPTION 'reservation already has verified payment' USING ERRCODE = '23514';
  END IF;

  INSERT INTO public.pagos (
    reserva_id, monto, moneda, metodo_pago, referencia_externa
  )
  VALUES (
    reservation_row.id, reservation_row.monto, reservation_row.moneda,
    trim(p_method), p_reference
  )
  RETURNING id INTO payment_id;

  INSERT INTO public.auditoria (actor_id, entidad, entidad_id, accion, detalle)
  VALUES (auth.uid(), 'pagos', payment_id, 'registrar',
          jsonb_build_object('reserva_id', p_reservation_id));
  RETURN payment_id;
END;
$$;

CREATE FUNCTION public.confirm_reservation(p_reservation_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, auth
AS $$
DECLARE
  reservation_row public.reservas%ROWTYPE;
BEGIN
  IF NOT public.is_app_admin() THEN
    RAISE EXCEPTION 'not authorized' USING ERRCODE = '42501';
  END IF;

  SELECT * INTO STRICT reservation_row
  FROM public.reservas WHERE id = p_reservation_id FOR UPDATE;

  IF reservation_row.estado = 'confirmada' THEN
    RETURN reservation_row.id;
  END IF;
  IF reservation_row.estado <> 'pendiente_pago'
     OR NOT EXISTS (
       SELECT 1 FROM public.pagos p
       WHERE p.reserva_id = p_reservation_id AND p.estado = 'verificado'
     ) THEN
    RAISE EXCEPTION 'verified payment and pending reservation required' USING ERRCODE = '23514';
  END IF;

  UPDATE public.reservas SET estado = 'confirmada'
  WHERE id = p_reservation_id;
  INSERT INTO public.auditoria (actor_id, entidad, entidad_id, accion, detalle)
  VALUES (auth.uid(), 'reservas', p_reservation_id, 'confirmar', '{}'::jsonb);
  RETURN p_reservation_id;
END;
$$;

CREATE FUNCTION public.cancel_reservation(p_reservation_id UUID, p_reason TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, auth
AS $$
DECLARE
  reservation_row public.reservas%ROWTYPE;
BEGIN
  IF NOT public.is_app_admin() OR NULLIF(trim(p_reason), '') IS NULL THEN
    RAISE EXCEPTION 'not authorized or cancellation reason missing' USING ERRCODE = '42501';
  END IF;

  SELECT * INTO STRICT reservation_row
  FROM public.reservas WHERE id = p_reservation_id FOR UPDATE;
  IF reservation_row.estado = 'cancelada' THEN
    RETURN reservation_row.id;
  END IF;
  IF EXISTS (SELECT 1 FROM public.inscripciones i WHERE i.reserva_id = p_reservation_id) THEN
    RAISE EXCEPTION 'reservation with enrollment cannot be cancelled' USING ERRCODE = '23514';
  END IF;

  UPDATE public.reservas SET estado = 'cancelada'
  WHERE id = p_reservation_id;
  INSERT INTO public.auditoria (actor_id, entidad, entidad_id, accion, detalle)
  VALUES (auth.uid(), 'reservas', p_reservation_id, 'cancelar',
          jsonb_build_object('motivo', p_reason));
  RETURN p_reservation_id;
END;
$$;

CREATE FUNCTION public.set_account_status(p_user_id UUID, p_status public.account_status)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, auth
AS $$
DECLARE
  target_role TEXT;
BEGIN
  IF NOT public.is_app_admin() OR p_user_id = auth.uid() THEN
    RAISE EXCEPTION 'not authorized' USING ERRCODE = '42501';
  END IF;

  PERFORM pg_catalog.pg_advisory_xact_lock(763846205684721);

  SELECT r.nombre INTO STRICT target_role
  FROM public.usuarios AS u
  JOIN public.roles AS r ON r.id = u.rol_id
  WHERE u.id = p_user_id
  FOR UPDATE OF u;

  IF target_role = 'superadministrador' AND NOT public.is_superadmin() THEN
    RAISE EXCEPTION 'not authorized' USING ERRCODE = '42501';
  END IF;
  IF target_role = 'superadministrador' AND p_status <> 'activo'
     AND (
       SELECT count(*)
       FROM public.usuarios AS u
       JOIN public.roles AS r ON r.id = u.rol_id
       WHERE r.nombre = 'superadministrador'
         AND u.estado = 'activo'
         AND u.activo
     ) <= 1 THEN
    RAISE EXCEPTION 'cannot deactivate the last active superadministrator'
      USING ERRCODE = '23514';
  END IF;

  UPDATE public.usuarios SET estado = p_status, activo = (p_status = 'activo')
  WHERE id = p_user_id;

  INSERT INTO public.auditoria (actor_id, entidad, entidad_id, accion, detalle)
  VALUES (auth.uid(), 'usuarios', p_user_id, 'cambiar_estado',
          jsonb_build_object('estado', p_status));

  RETURN p_user_id;
END;
$$;

CREATE FUNCTION public.assign_user_role(p_user_id UUID, p_role_name TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, auth
AS $$
DECLARE
  role_id UUID;
BEGIN
  IF NOT public.is_superadmin() OR p_user_id = auth.uid() THEN
    RAISE EXCEPTION 'not authorized' USING ERRCODE = '42501';
  END IF;

  PERFORM pg_catalog.pg_advisory_xact_lock(763846205684721);

  SELECT id INTO STRICT role_id
  FROM public.roles
  WHERE nombre = p_role_name;

  IF EXISTS (
    SELECT 1
    FROM public.usuarios AS target
    JOIN public.roles AS target_role ON target_role.id = target.rol_id
    WHERE target.id = p_user_id
      AND target_role.nombre = 'superadministrador'
      AND p_role_name <> 'superadministrador'
      AND target.estado = 'activo'
      AND target.activo
      AND (
        SELECT count(*)
        FROM public.usuarios AS u
        JOIN public.roles AS r ON r.id = u.rol_id
        WHERE r.nombre = 'superadministrador'
          AND u.estado = 'activo'
          AND u.activo
      ) <= 1
  ) THEN
    RAISE EXCEPTION 'cannot demote the last active superadministrator'
      USING ERRCODE = '23514';
  END IF;

  UPDATE public.usuarios SET rol_id = role_id
  WHERE id = p_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'user profile not found' USING ERRCODE = 'P0002';
  END IF;

  INSERT INTO public.auditoria (actor_id, entidad, entidad_id, accion, detalle)
  VALUES (auth.uid(), 'usuarios', p_user_id, 'asignar_rol',
          jsonb_build_object('rol', p_role_name));

  RETURN p_user_id;
END;
$$;

CREATE FUNCTION public.create_enrollment(p_reservation_id UUID, p_student_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, auth
AS $$
DECLARE
  reservation_row public.reservas%ROWTYPE;
  enrollment_id UUID;
  student_email TEXT;
  interested_email TEXT;
BEGIN
  IF NOT public.is_app_admin() THEN
    RAISE EXCEPTION 'not authorized' USING ERRCODE = '42501';
  END IF;

  SELECT * INTO STRICT reservation_row
  FROM public.reservas
  WHERE id = p_reservation_id
  FOR UPDATE;

  IF reservation_row.estado <> 'confirmada' THEN
    RAISE EXCEPTION 'reservation is not confirmed' USING ERRCODE = '23514';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.pagos AS p
    WHERE p.reserva_id = p_reservation_id AND p.estado = 'verificado'
  ) THEN
    RAISE EXCEPTION 'verified payment required' USING ERRCODE = '23514';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.usuarios AS u
    JOIN public.roles AS r ON r.id = u.rol_id
    WHERE u.id = p_student_id
      AND r.nombre = 'estudiante'
      AND u.estado = 'activo'
      AND u.activo
  ) THEN
    RAISE EXCEPTION 'active student account required' USING ERRCODE = '23514';
  END IF;

  IF reservation_row.estudiante_id IS NOT NULL
     AND reservation_row.estudiante_id <> p_student_id THEN
    RAISE EXCEPTION 'reservation belongs to another student' USING ERRCODE = '42501';
  END IF;

  IF reservation_row.interesado_id IS NOT NULL THEN
    SELECT lower(email) INTO interested_email
    FROM public.interesados WHERE id = reservation_row.interesado_id;
    SELECT lower(email) INTO student_email
    FROM public.usuarios WHERE id = p_student_id;
    IF interested_email IS NULL OR student_email IS DISTINCT FROM interested_email THEN
      RAISE EXCEPTION 'student does not match reservation contact' USING ERRCODE = '42501';
    END IF;
  END IF;

  UPDATE public.reservas SET estudiante_id = p_student_id
  WHERE id = p_reservation_id;

  INSERT INTO public.inscripciones (reserva_id, estudiante_id, seccion_id)
  VALUES (p_reservation_id, p_student_id, reservation_row.seccion_id)
  ON CONFLICT (reserva_id) DO UPDATE
    SET estudiante_id = EXCLUDED.estudiante_id,
        seccion_id = EXCLUDED.seccion_id
  RETURNING id INTO enrollment_id;

  INSERT INTO public.auditoria (actor_id, entidad, entidad_id, accion, detalle)
  VALUES (auth.uid(), 'inscripciones', enrollment_id, 'crear',
          jsonb_build_object('reserva_id', p_reservation_id));

  RETURN enrollment_id;
END;
$$;

CREATE FUNCTION public.record_attendance(
  p_session_id UUID,
  p_student_id UUID,
  p_status public.attendance_status,
  p_reason TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, auth
AS $$
DECLARE
  section_id UUID;
  attendance_id UUID;
  old_status public.attendance_status;
  actor_id UUID := auth.uid();
BEGIN
  SELECT s.seccion_id INTO STRICT section_id
  FROM public.sesiones_academicas AS s
  WHERE s.id = p_session_id
  FOR UPDATE;

  IF NOT public.is_app_admin() AND NOT public.is_section_teacher(section_id) THEN
    RAISE EXCEPTION 'not authorized' USING ERRCODE = '42501';
  END IF;

  IF NOT public.is_enrolled_in_section_for_student(section_id, p_student_id) THEN
    RAISE EXCEPTION 'student is not enrolled in this section' USING ERRCODE = '42501';
  END IF;

  SELECT a.id, a.estado INTO attendance_id, old_status
  FROM public.asistencias AS a
  WHERE a.sesion_id = p_session_id AND a.estudiante_id = p_student_id
  FOR UPDATE;

  IF attendance_id IS NOT NULL THEN
    IF NULLIF(trim(p_reason), '') IS NULL THEN
      RAISE EXCEPTION 'correction reason required' USING ERRCODE = '23514';
    END IF;

    INSERT INTO public.historial_asistencias (
      asistencia_id, actor_id, estado_anterior, estado_nuevo, motivo
    ) VALUES (attendance_id, actor_id, old_status, p_status, p_reason);

    UPDATE public.asistencias
    SET estado = p_status, registrado_por = actor_id, motivo = p_reason, updated_at = now()
    WHERE id = attendance_id;
  ELSE
    INSERT INTO public.asistencias (
      sesion_id, estudiante_id, estado, registrado_por, motivo
    ) VALUES (p_session_id, p_student_id, p_status, actor_id, p_reason)
    RETURNING id INTO attendance_id;
  END IF;

  RETURN attendance_id;
END;
$$;

CREATE FUNCTION public.is_enrolled_in_section_for_student(p_section_id UUID, p_student_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public, auth
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.inscripciones AS i
    WHERE i.seccion_id = p_section_id AND i.estudiante_id = p_student_id
      AND i.estado = 'activa'
  )
$$;

CREATE FUNCTION public.start_private_conversation(p_other_user_id UUID, p_section_id UUID DEFAULT NULL)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, auth
AS $$
DECLARE
  actor_role TEXT := public.current_app_role();
  other_role TEXT;
  student_id UUID;
  teacher_id UUID;
  conversation_key TEXT;
  conversation_id UUID;
BEGIN
  IF auth.uid() IS NULL OR p_other_user_id = auth.uid() THEN
    RAISE EXCEPTION 'not authorized' USING ERRCODE = '42501';
  END IF;

  SELECT r.nombre INTO STRICT other_role
  FROM public.usuarios AS u
  JOIN public.roles AS r ON r.id = u.rol_id
  WHERE u.id = p_other_user_id AND u.activo AND u.estado = 'activo';

  IF actor_role = 'estudiante' AND other_role = 'docente' AND p_section_id IS NOT NULL THEN
    student_id := auth.uid();
    teacher_id := p_other_user_id;
  ELSIF actor_role = 'docente' AND other_role = 'estudiante' AND p_section_id IS NOT NULL THEN
    student_id := p_other_user_id;
    teacher_id := auth.uid();
  ELSIF actor_role = 'administrador' AND other_role IN ('estudiante', 'docente')
        AND p_section_id IS NULL THEN
    student_id := CASE WHEN other_role = 'estudiante' THEN p_other_user_id ELSE NULL END;
    teacher_id := CASE WHEN other_role = 'docente' THEN p_other_user_id ELSE NULL END;
  ELSIF actor_role IN ('estudiante', 'docente') AND other_role = 'administrador'
        AND p_section_id IS NULL THEN
    student_id := CASE WHEN actor_role = 'estudiante' THEN auth.uid() ELSE NULL END;
    teacher_id := CASE WHEN actor_role = 'docente' THEN auth.uid() ELSE NULL END;
  ELSE
    RAISE EXCEPTION 'conversation pair is not allowed' USING ERRCODE = '42501';
  END IF;

  IF p_section_id IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.secciones AS s
      WHERE s.id = p_section_id AND s.docente_id = teacher_id
    ) OR NOT public.is_enrolled_in_section_for_student(p_section_id, student_id) THEN
      RAISE EXCEPTION 'section relationship required' USING ERRCODE = '42501';
    END IF;
  END IF;

  conversation_key := COALESCE(p_section_id::TEXT, 'support') || ':' ||
    LEAST(auth.uid()::TEXT, p_other_user_id::TEXT) || ':' ||
    GREATEST(auth.uid()::TEXT, p_other_user_id::TEXT);

  INSERT INTO public.conversaciones (conversation_key, seccion_id)
  VALUES (conversation_key, p_section_id)
  ON CONFLICT (conversation_key) DO NOTHING;

  SELECT c.id INTO STRICT conversation_id
  FROM public.conversaciones AS c
  WHERE c.conversation_key = conversation_key
  FOR UPDATE;

  INSERT INTO public.conversacion_participantes (conversacion_id, usuario_id)
  VALUES (conversation_id, auth.uid()), (conversation_id, p_other_user_id)
  ON CONFLICT (conversacion_id, usuario_id) DO NOTHING;

  RETURN conversation_id;
END;
$$;

CREATE FUNCTION public.mark_message_read(p_message_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, auth
AS $$
DECLARE
  conversation_id UUID;
BEGIN
  SELECT m.conversacion_id INTO STRICT conversation_id
  FROM public.mensajes AS m
  WHERE m.id = p_message_id;

  IF NOT public.is_conversation_participant(conversation_id) THEN
    RAISE EXCEPTION 'not authorized' USING ERRCODE = '42501';
  END IF;

  INSERT INTO public.lecturas_mensaje (mensaje_id, usuario_id)
  VALUES (p_message_id, auth.uid())
  ON CONFLICT (mensaje_id, usuario_id) DO NOTHING;
END;
$$;

CREATE FUNCTION public.mark_notification_read(p_notification_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, auth
AS $$
BEGIN
  UPDATE public.notificaciones
  SET leida_en = COALESCE(leida_en, now())
  WHERE id = p_notification_id AND usuario_id = auth.uid();

  IF NOT FOUND THEN
    RAISE EXCEPTION 'notification not found' USING ERRCODE = 'P0002';
  END IF;
END;
$$;

CREATE FUNCTION public.can_join_conversation_channel()
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public, auth, realtime
AS $$
DECLARE
  topic TEXT := realtime.topic();
  conversation_id UUID;
BEGIN
  IF auth.uid() IS NULL OR topic !~ '^conversation:[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$' THEN
    RETURN FALSE;
  END IF;
  conversation_id := pg_catalog.split_part(topic, ':', 2)::UUID;
  RETURN public.is_conversation_participant(conversation_id);
END;
$$;

CREATE FUNCTION public.can_access_storage_object(p_bucket_id TEXT, p_object_path TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public, auth
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.archivos_metadata AS f
    WHERE f.bucket_id = p_bucket_id
      AND f.object_path = p_object_path
      AND public.can_access_file(f.id)
  )
$$;

CREATE FUNCTION public.can_upload_storage_object(p_bucket_id TEXT, p_object_path TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public, auth
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.archivos_metadata AS f
    WHERE f.bucket_id = p_bucket_id
      AND f.object_path = p_object_path
      AND public.can_upload_file(f.id)
  )
$$;

CREATE FUNCTION public.can_delete_storage_object(p_bucket_id TEXT, p_object_path TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public, auth
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.archivos_metadata AS f
    WHERE f.bucket_id = p_bucket_id
      AND f.object_path = p_object_path
      AND f.estado = 'pending'
      AND public.can_manage_file(f.id)
  )
$$;

REVOKE ALL ON FUNCTION public.is_enrolled_in_section_for_student(UUID, UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.create_reservation(UUID, UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.verify_payment(UUID, BOOLEAN) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.register_payment(UUID, TEXT, TEXT) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.confirm_reservation(UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.cancel_reservation(UUID, TEXT) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.set_account_status(UUID, public.account_status) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.assign_user_role(UUID, TEXT) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.create_enrollment(UUID, UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.record_attendance(UUID, UUID, public.attendance_status, TEXT) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.start_private_conversation(UUID, UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.mark_message_read(UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.mark_notification_read(UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.can_join_conversation_channel() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.can_access_storage_object(TEXT, TEXT) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.can_upload_storage_object(TEXT, TEXT) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.can_delete_storage_object(TEXT, TEXT) FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.create_reservation(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.verify_payment(UUID, BOOLEAN) TO authenticated;
GRANT EXECUTE ON FUNCTION public.register_payment(UUID, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.confirm_reservation(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.cancel_reservation(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.set_account_status(UUID, public.account_status) TO authenticated;
GRANT EXECUTE ON FUNCTION public.assign_user_role(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_enrollment(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.record_attendance(UUID, UUID, public.attendance_status, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.start_private_conversation(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.mark_message_read(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.mark_notification_read(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_join_conversation_channel() TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_access_storage_object(TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_upload_storage_object(TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_delete_storage_object(TEXT, TEXT) TO authenticated;

-- RLS is active on every application table exposed through the public schema.
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.perfiles_docente ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.configuraciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auditoria ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cursos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.secciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.horarios_recurrentes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sesiones_academicas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interesados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pagos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inscripciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asistencias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.historial_asistencias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tareas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entregas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_preguntas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_claves_respuesta ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_intentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.criterios_certificado ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materiales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversacion_participantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mensajes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lecturas_mensaje ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notificaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.archivos_metadata ENABLE ROW LEVEL SECURITY;

-- Explicit grants: no default table privileges, and no anonymous access to private rows.
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE ALL ON TABLES FROM PUBLIC, anon, authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE ALL ON SEQUENCES FROM PUBLIC, anon, authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA public TO anon, authenticated;
REVOKE ALL ON TABLE
  public.roles, public.usuarios, public.perfiles_docente, public.configuraciones,
  public.auditoria, public.categorias, public.cursos, public.secciones,
  public.horarios_recurrentes, public.sesiones_academicas, public.interesados,
  public.reservas, public.pagos, public.inscripciones, public.asistencias,
  public.historial_asistencias, public.tareas, public.entregas, public.quizzes,
  public.quiz_preguntas, public.quiz_claves_respuesta, public.quiz_intentos,
  public.criterios_certificado, public.certificados, public.materiales, public.videos,
  public.conversaciones, public.conversacion_participantes, public.mensajes,
  public.lecturas_mensaje, public.notificaciones, public.archivos_metadata
FROM PUBLIC, anon, authenticated;

GRANT SELECT ON TABLE
  public.categorias, public.cursos, public.secciones, public.roles,
  public.usuarios, public.perfiles_docente, public.configuraciones, public.auditoria,
  public.horarios_recurrentes, public.sesiones_academicas, public.interesados,
  public.reservas, public.pagos, public.inscripciones, public.asistencias,
  public.historial_asistencias, public.tareas, public.entregas, public.quizzes,
  public.quiz_preguntas, public.quiz_claves_respuesta, public.quiz_intentos,
  public.criterios_certificado, public.certificados, public.materiales, public.videos,
  public.conversaciones, public.conversacion_participantes, public.mensajes,
  public.lecturas_mensaje, public.notificaciones, public.archivos_metadata
TO authenticated;

GRANT SELECT ON TABLE public.categorias, public.cursos, public.secciones TO anon;
GRANT INSERT (nombre, apellido, email, telefono, curso_id)
ON public.interesados TO anon, authenticated;
GRANT INSERT (conversacion_id, remitente_id, archivo_id, contenido)
ON public.mensajes TO authenticated;
GRANT INSERT ON public.archivos_metadata TO authenticated;
GRANT INSERT (usuario_id, biografia, especialidades, certificaciones, linkedin_url, anos_experiencia)
ON public.perfiles_docente TO authenticated;
GRANT UPDATE (biografia, especialidades, certificaciones, linkedin_url, anos_experiencia)
ON public.perfiles_docente TO authenticated;
GRANT INSERT (clave, valor_json, descripcion)
ON public.configuraciones TO authenticated;
GRANT UPDATE (valor_json, descripcion)
ON public.configuraciones TO authenticated;
GRANT INSERT (usuario_id, tipo, titulo, mensaje, url_destino)
ON public.notificaciones TO authenticated;
GRANT INSERT ON
  public.categorias, public.cursos, public.secciones, public.horarios_recurrentes,
  public.sesiones_academicas, public.tareas, public.quizzes, public.quiz_preguntas,
  public.quiz_claves_respuesta, public.criterios_certificado, public.materiales,
  public.videos TO authenticated;
GRANT UPDATE (titulo, descripcion_corta, descripcion_larga, imagen_portada, nivel)
ON public.cursos TO authenticated;
GRANT UPDATE ON
  public.categorias, public.secciones, public.horarios_recurrentes,
  public.sesiones_academicas, public.tareas, public.quizzes, public.quiz_preguntas,
  public.quiz_claves_respuesta, public.criterios_certificado, public.materiales,
  public.videos TO authenticated;

-- RLS policies: public catalog; authenticated access follows identity and relationships.
CREATE POLICY roles_authenticated_read ON public.roles
FOR SELECT TO authenticated USING (TRUE);

CREATE POLICY usuarios_read_self_or_admin ON public.usuarios
FOR SELECT TO authenticated
USING (id = auth.uid() OR public.is_app_admin());
CREATE POLICY usuarios_update_self_or_admin ON public.usuarios
FOR UPDATE TO authenticated
USING (id = auth.uid() OR public.is_app_admin())
WITH CHECK (id = auth.uid() OR public.is_app_admin());
CREATE POLICY perfiles_docente_read_authorized ON public.perfiles_docente
FOR SELECT TO authenticated
USING (
  usuario_id = auth.uid()
  OR public.is_app_admin()
  OR EXISTS (
    SELECT 1 FROM public.secciones AS s
    WHERE s.docente_id = perfiles_docente.usuario_id
      AND public.is_enrolled_in_section(s.id)
  )
);
CREATE POLICY perfiles_docente_write_self_or_admin ON public.perfiles_docente
FOR ALL TO authenticated
USING (
  public.is_app_admin()
  OR (usuario_id = auth.uid() AND public.current_app_role() = 'docente')
)
WITH CHECK (
  public.is_app_admin()
  OR (usuario_id = auth.uid() AND public.current_app_role() = 'docente')
);
CREATE POLICY configuraciones_admin_only ON public.configuraciones
FOR ALL TO authenticated
USING (public.is_app_admin()) WITH CHECK (public.is_app_admin());
CREATE POLICY auditoria_admin_read ON public.auditoria
FOR SELECT TO authenticated USING (public.is_app_admin());

CREATE POLICY categorias_public_active ON public.categorias
FOR SELECT TO anon USING (activo);
CREATE POLICY categorias_authenticated_read ON public.categorias
FOR SELECT TO authenticated USING (activo OR public.is_app_admin());
CREATE POLICY categorias_admin_manage ON public.categorias
FOR ALL TO authenticated USING (public.is_app_admin()) WITH CHECK (public.is_app_admin());
CREATE POLICY cursos_public_published ON public.cursos
FOR SELECT TO anon USING (publicado);
CREATE POLICY cursos_authenticated_read ON public.cursos
FOR SELECT TO authenticated USING (
  publicado OR public.is_app_admin() OR docente_base_id = auth.uid()
  OR EXISTS (SELECT 1 FROM public.secciones s WHERE s.curso_id = cursos.id
             AND public.is_section_teacher(s.id))
);
CREATE POLICY cursos_admin_manage ON public.cursos
FOR ALL TO authenticated USING (public.is_app_admin()) WITH CHECK (public.is_app_admin());
CREATE POLICY cursos_teacher_manage_assigned ON public.cursos
FOR UPDATE TO authenticated USING (
  public.current_app_role() = 'docente'
  AND (
    docente_base_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.secciones s WHERE s.curso_id = cursos.id
               AND public.is_section_teacher(s.id))
  )
) WITH CHECK (
  public.current_app_role() = 'docente'
  AND (
    docente_base_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.secciones s WHERE s.curso_id = cursos.id
               AND public.is_section_teacher(s.id))
  )
);
CREATE POLICY secciones_public_active ON public.secciones
FOR SELECT TO anon USING (estado = 'activa');
CREATE POLICY secciones_authenticated_read ON public.secciones
FOR SELECT TO authenticated USING (
  estado = 'activa' OR public.is_app_admin()
  OR docente_id = auth.uid() OR public.is_enrolled_in_section(id)
);
CREATE POLICY secciones_admin_manage ON public.secciones
FOR ALL TO authenticated USING (public.is_app_admin()) WITH CHECK (public.is_app_admin());
CREATE POLICY horarios_read_related ON public.horarios_recurrentes
FOR SELECT TO authenticated USING (
  public.is_app_admin() OR public.is_section_teacher(seccion_id)
  OR public.is_enrolled_in_section(seccion_id)
);
CREATE POLICY horarios_teacher_manage ON public.horarios_recurrentes
FOR ALL TO authenticated USING (
  public.is_app_admin() OR public.is_section_teacher(seccion_id)
) WITH CHECK (
  public.is_app_admin() OR public.is_section_teacher(seccion_id)
);
CREATE POLICY sesiones_read_related ON public.sesiones_academicas
FOR SELECT TO authenticated USING (
  public.is_app_admin() OR public.is_section_teacher(seccion_id)
  OR public.is_enrolled_in_section(seccion_id)
);
CREATE POLICY sesiones_teacher_manage ON public.sesiones_academicas
FOR ALL TO authenticated USING (
  public.is_app_admin() OR public.is_section_teacher(seccion_id)
) WITH CHECK (
  public.is_app_admin() OR public.is_section_teacher(seccion_id)
);

CREATE POLICY interesados_admin_read ON public.interesados
FOR SELECT TO authenticated USING (public.is_app_admin());
CREATE POLICY interesados_teacher_read_assigned_course ON public.interesados
FOR SELECT TO authenticated USING (
  curso_id IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM public.secciones s
    WHERE s.curso_id = interesados.curso_id
      AND public.is_section_teacher(s.id)
  )
);
CREATE POLICY interesados_insert_public ON public.interesados
FOR INSERT TO anon, authenticated WITH CHECK (
  length(trim(nombre)) > 0
  AND (NULLIF(trim(email), '') IS NOT NULL OR NULLIF(trim(telefono), '') IS NOT NULL)
);
CREATE POLICY reservas_read_owner_staff ON public.reservas
FOR SELECT TO authenticated USING (
  estudiante_id = auth.uid() OR public.is_app_admin()
  OR (interesado_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.secciones s WHERE s.id = reservas.seccion_id
      AND public.is_section_teacher(s.id)
  ))
);
CREATE POLICY pagos_read_owner_admin ON public.pagos
FOR SELECT TO authenticated USING (
  public.is_app_admin()
  OR EXISTS (SELECT 1 FROM public.reservas r
             WHERE r.id = pagos.reserva_id AND r.estudiante_id = auth.uid())
);
CREATE POLICY inscripciones_read_owner_staff ON public.inscripciones
FOR SELECT TO authenticated USING (
  estudiante_id = auth.uid() OR public.is_app_admin()
  OR public.is_section_teacher(seccion_id)
);
CREATE POLICY asistencias_read_owner_staff ON public.asistencias
FOR SELECT TO authenticated USING (
  estudiante_id = auth.uid() OR public.is_app_admin()
  OR public.is_section_teacher((SELECT s.seccion_id FROM public.sesiones_academicas s
                                  WHERE s.id = asistencias.sesion_id))
);
CREATE POLICY asistencias_teacher_manage ON public.asistencias
FOR INSERT TO authenticated WITH CHECK (
  public.is_app_admin()
  OR public.is_section_teacher((SELECT s.seccion_id FROM public.sesiones_academicas s
                                 WHERE s.id = asistencias.sesion_id))
);
CREATE POLICY historial_asistencias_admin_read ON public.historial_asistencias
FOR SELECT TO authenticated USING (
  public.is_app_admin()
  OR EXISTS (
    SELECT 1 FROM public.asistencias a
    JOIN public.sesiones_academicas s ON s.id = a.sesion_id
    WHERE a.id = historial_asistencias.asistencia_id
      AND public.is_section_teacher(s.seccion_id)
  )
);

CREATE POLICY tareas_read_enrolled_staff ON public.tareas
FOR SELECT TO authenticated USING (
  public.is_app_admin() OR public.is_section_teacher(seccion_id)
  OR public.is_enrolled_in_section(seccion_id)
);
CREATE POLICY tareas_teacher_manage ON public.tareas
FOR ALL TO authenticated USING (
  public.is_app_admin() OR public.is_section_teacher(seccion_id)
) WITH CHECK (
  public.is_app_admin() OR public.is_section_teacher(seccion_id)
);
CREATE POLICY entregas_read_owner_staff ON public.entregas
FOR SELECT TO authenticated USING (
  estudiante_id = auth.uid() OR public.is_app_admin()
  OR EXISTS (SELECT 1 FROM public.tareas t
             WHERE t.id = entregas.tarea_id AND public.is_section_teacher(t.seccion_id))
);
CREATE POLICY entregas_student_submit ON public.entregas
FOR INSERT TO authenticated WITH CHECK (
  estudiante_id = auth.uid() AND EXISTS (
    SELECT 1 FROM public.tareas t
    WHERE t.id = entregas.tarea_id AND public.is_enrolled_in_section(t.seccion_id)
  )
);
CREATE POLICY entregas_staff_review ON public.entregas
FOR UPDATE TO authenticated USING (
  public.is_app_admin() OR EXISTS (
    SELECT 1 FROM public.tareas t
    WHERE t.id = entregas.tarea_id AND public.is_section_teacher(t.seccion_id)
  )
) WITH CHECK (
  public.is_app_admin() OR EXISTS (
    SELECT 1 FROM public.tareas t
    WHERE t.id = entregas.tarea_id AND public.is_section_teacher(t.seccion_id)
  )
);
CREATE POLICY quizzes_read_enrolled_staff ON public.quizzes
FOR SELECT TO authenticated USING (
  public.is_app_admin() OR public.is_section_teacher(seccion_id)
  OR public.is_enrolled_in_section(seccion_id)
);
CREATE POLICY quizzes_teacher_manage ON public.quizzes
FOR ALL TO authenticated USING (
  public.is_app_admin() OR public.is_section_teacher(seccion_id)
) WITH CHECK (
  public.is_app_admin() OR public.is_section_teacher(seccion_id)
);
CREATE POLICY quiz_questions_read_enrolled_staff ON public.quiz_preguntas
FOR SELECT TO authenticated USING (
  public.is_app_admin()
  OR EXISTS (SELECT 1 FROM public.quizzes q WHERE q.id = quiz_preguntas.quiz_id
             AND public.is_section_teacher(q.seccion_id))
  OR EXISTS (SELECT 1 FROM public.quizzes q WHERE q.id = quiz_preguntas.quiz_id
             AND public.is_enrolled_in_section(q.seccion_id))
);
CREATE POLICY quiz_questions_teacher_manage ON public.quiz_preguntas
FOR ALL TO authenticated USING (
  public.is_app_admin()
  OR EXISTS (SELECT 1 FROM public.quizzes q WHERE q.id = quiz_preguntas.quiz_id
             AND public.is_section_teacher(q.seccion_id))
) WITH CHECK (
  public.is_app_admin()
  OR EXISTS (SELECT 1 FROM public.quizzes q WHERE q.id = quiz_preguntas.quiz_id
             AND public.is_section_teacher(q.seccion_id))
);
CREATE POLICY quiz_answer_keys_staff_only ON public.quiz_claves_respuesta
FOR ALL TO authenticated USING (
  public.is_app_admin()
  OR EXISTS (
    SELECT 1 FROM public.quiz_preguntas qp JOIN public.quizzes q ON q.id = qp.quiz_id
    WHERE qp.id = quiz_claves_respuesta.pregunta_id AND public.is_section_teacher(q.seccion_id)
  )
) WITH CHECK (
  public.is_app_admin()
  OR EXISTS (
    SELECT 1 FROM public.quiz_preguntas qp JOIN public.quizzes q ON q.id = qp.quiz_id
    WHERE qp.id = quiz_claves_respuesta.pregunta_id AND public.is_section_teacher(q.seccion_id)
  )
);
CREATE POLICY quiz_attempts_read_owner_staff ON public.quiz_intentos
FOR SELECT TO authenticated USING (
  estudiante_id = auth.uid() OR public.is_app_admin()
  OR EXISTS (SELECT 1 FROM public.quizzes q WHERE q.id = quiz_intentos.quiz_id
             AND public.is_section_teacher(q.seccion_id))
);
CREATE POLICY quiz_attempts_student_insert ON public.quiz_intentos
FOR INSERT TO authenticated WITH CHECK (
  estudiante_id = auth.uid() AND EXISTS (
    SELECT 1 FROM public.quizzes q
    WHERE q.id = quiz_intentos.quiz_id AND public.is_enrolled_in_section(q.seccion_id)
  )
);
CREATE POLICY certificate_criteria_read ON public.criterios_certificado
FOR SELECT TO authenticated USING (public.is_app_admin());
CREATE POLICY certificate_criteria_admin_manage ON public.criterios_certificado
FOR ALL TO authenticated USING (public.is_app_admin()) WITH CHECK (public.is_app_admin());
CREATE POLICY certificates_read_owner_staff ON public.certificados
FOR SELECT TO authenticated USING (
  public.is_app_admin()
  OR EXISTS (SELECT 1 FROM public.inscripciones i
             WHERE i.id = certificados.inscripcion_id AND i.estudiante_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.inscripciones i
             WHERE i.id = certificados.inscripcion_id
               AND public.is_section_teacher(i.seccion_id))
);
CREATE POLICY materials_read_enrolled_staff ON public.materiales
FOR SELECT TO authenticated USING (
  public.is_app_admin() OR public.is_section_teacher(seccion_id)
  OR public.is_enrolled_in_section(seccion_id)
);
CREATE POLICY materials_teacher_manage ON public.materiales
FOR ALL TO authenticated USING (
  public.is_app_admin() OR public.is_section_teacher(seccion_id)
) WITH CHECK (
  public.is_app_admin()
  OR (public.is_section_teacher(seccion_id) AND propietario_id = auth.uid())
);
CREATE POLICY videos_read_enrolled_staff ON public.videos
FOR SELECT TO authenticated USING (
  public.is_app_admin() OR public.is_section_teacher(seccion_id)
  OR public.is_enrolled_in_section(seccion_id)
);
CREATE POLICY videos_teacher_manage ON public.videos
FOR ALL TO authenticated USING (
  public.is_app_admin() OR public.is_section_teacher(seccion_id)
) WITH CHECK (
  public.is_app_admin()
  OR (public.is_section_teacher(seccion_id) AND propietario_id = auth.uid())
);

CREATE POLICY conversaciones_read_participants ON public.conversaciones
FOR SELECT TO authenticated USING (public.is_conversation_participant(id));
CREATE POLICY conversation_participants_read_related ON public.conversacion_participantes
FOR SELECT TO authenticated USING (
  usuario_id = auth.uid() OR public.is_conversation_participant(conversacion_id)
);
CREATE POLICY mensajes_read_participants ON public.mensajes
FOR SELECT TO authenticated USING (public.is_conversation_participant(conversacion_id));
CREATE POLICY mensajes_insert_participant ON public.mensajes
FOR INSERT TO authenticated WITH CHECK (
  remitente_id = auth.uid()
  AND public.is_conversation_participant(conversacion_id)
  AND (
    archivo_id IS NULL
    OR EXISTS (
      SELECT 1 FROM public.archivos_metadata f
      WHERE f.id = mensajes.archivo_id
        AND f.categoria = 'message_attachment'
        AND f.conversacion_id = mensajes.conversacion_id
        AND f.propietario_id = auth.uid()
        AND public.can_access_file(f.id)
    )
  )
);
CREATE POLICY message_reads_read_own ON public.lecturas_mensaje
FOR SELECT TO authenticated USING (usuario_id = auth.uid());
CREATE POLICY notificaciones_read_own ON public.notificaciones
FOR SELECT TO authenticated USING (usuario_id = auth.uid() OR public.is_app_admin());
CREATE POLICY notificaciones_admin_insert ON public.notificaciones
FOR INSERT TO authenticated WITH CHECK (public.is_app_admin());

CREATE POLICY archivos_metadata_read_authorized ON public.archivos_metadata
FOR SELECT TO authenticated USING (public.can_access_file(id));
CREATE POLICY archivos_metadata_insert_authorized ON public.archivos_metadata
FOR INSERT TO authenticated WITH CHECK (
  propietario_id = auth.uid()
  AND estado = 'pending'
  AND (
    (
      categoria IN ('profile', 'student_document')
      AND usuario_relacionado_id = auth.uid()
    )
    OR (
      categoria = 'payment_proof'
      AND EXISTS (
        SELECT 1
        FROM public.pagos p
        JOIN public.reservas r ON r.id = p.reserva_id
        WHERE p.id = pago_id AND r.estudiante_id = auth.uid()
      )
    )
    OR (
      categoria = 'submission'
      AND EXISTS (
        SELECT 1 FROM public.entregas e
        WHERE e.id = entrega_id AND e.estudiante_id = auth.uid()
      )
    )
    OR (
      categoria IN ('learning_material', 'video')
      AND seccion_id IS NOT NULL
      AND (public.is_app_admin() OR public.is_section_teacher(seccion_id))
    )
    OR (
      categoria = 'administrative_document'
      AND public.is_app_admin()
    )
    OR (
      categoria = 'message_attachment'
      AND conversacion_id IS NOT NULL
      AND public.is_conversation_participant(conversacion_id)
    )
  )
);
-- Keep protected system-of-record fields writable only through guarded RPCs.
REVOKE INSERT, UPDATE, DELETE ON TABLE
  public.roles, public.usuarios, public.auditoria, public.reservas, public.pagos,
  public.inscripciones, public.asistencias, public.historial_asistencias,
  public.conversaciones, public.conversacion_participantes, public.lecturas_mensaje,
  public.certificados
FROM anon, authenticated;
GRANT UPDATE (nombre, apellido, foto_perfil, telefono, pais, idioma_preferido)
ON public.usuarios TO authenticated;
REVOKE UPDATE, DELETE ON TABLE public.interesados FROM anon, authenticated;
REVOKE UPDATE, DELETE ON TABLE public.notificaciones FROM anon, authenticated;
REVOKE UPDATE, DELETE ON TABLE public.mensajes FROM anon, authenticated;
REVOKE UPDATE, DELETE ON TABLE public.archivos_metadata FROM anon, authenticated;

GRANT SELECT ON TABLE public.archivos_metadata TO service_role;
GRANT UPDATE (estado, mime_type, tamaño_bytes, updated_at)
ON public.archivos_metadata TO service_role;

-- RPC privileges are re-applied after the blanket table-level restrictions.
GRANT EXECUTE ON FUNCTION public.create_reservation(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.verify_payment(UUID, BOOLEAN) TO authenticated;
GRANT EXECUTE ON FUNCTION public.register_payment(UUID, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.confirm_reservation(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.cancel_reservation(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.set_account_status(UUID, public.account_status) TO authenticated;
GRANT EXECUTE ON FUNCTION public.assign_user_role(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_enrollment(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.record_attendance(UUID, UUID, public.attendance_status, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.start_private_conversation(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.mark_message_read(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.mark_notification_read(UUID) TO authenticated;

CREATE POLICY private_storage_read ON storage.objects
FOR SELECT TO authenticated
USING (public.can_access_storage_object(bucket_id, name));
CREATE POLICY private_storage_insert ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (public.can_upload_storage_object(bucket_id, name));
CREATE POLICY private_storage_delete ON storage.objects
FOR DELETE TO authenticated
USING (public.can_delete_storage_object(bucket_id, name));

CREATE POLICY private_conversation_channel_read ON realtime.messages
FOR SELECT TO authenticated
USING (private AND public.can_join_conversation_channel());
CREATE POLICY private_conversation_channel_write ON realtime.messages
FOR INSERT TO authenticated
WITH CHECK (private AND public.can_join_conversation_channel());

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'mensajes'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.mensajes;
    END IF;
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'notificaciones'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.notificaciones;
    END IF;
  END IF;
END;
$$;
-- END supabase\migrations\202501020003_privacy_storage_realtime.sql

