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
