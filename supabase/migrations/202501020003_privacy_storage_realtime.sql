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
