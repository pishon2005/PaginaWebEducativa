CREATE OR REPLACE FUNCTION public.verify_payment(
  p_payment_id UUID,
  p_approved BOOLEAN
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, auth
AS $$
DECLARE
  payment_row public.pagos%ROWTYPE;
  reservation_row public.reservas%ROWTYPE;
BEGIN
  IF auth.uid() IS NULL OR p_payment_id IS NULL OR p_approved IS NULL
     OR NOT public.is_app_admin() THEN
    RAISE EXCEPTION 'not authorized' USING ERRCODE = '42501';
  END IF;

  SELECT * INTO STRICT payment_row
  FROM public.pagos
  WHERE id = p_payment_id
  FOR UPDATE;

  SELECT * INTO STRICT reservation_row
  FROM public.reservas
  WHERE id = payment_row.reserva_id
  FOR UPDATE;

  IF payment_row.estado <> 'pendiente' THEN
    RAISE EXCEPTION 'payment already reviewed' USING ERRCODE = '23505';
  END IF;
  IF reservation_row.estado <> 'pendiente_pago' THEN
    RAISE EXCEPTION 'reservation is not awaiting payment' USING ERRCODE = '23514';
  END IF;

  UPDATE public.pagos
  SET estado = CASE WHEN p_approved THEN 'verificado'::public.payment_status
                    ELSE 'rechazado'::public.payment_status END,
      verificado_por = auth.uid(),
      fecha_verificacion = pg_catalog.now()
  WHERE id = p_payment_id;

  INSERT INTO public.auditoria (actor_id, entidad, entidad_id, accion, detalle)
  VALUES (
    auth.uid(),
    'pagos',
    p_payment_id,
    CASE WHEN p_approved THEN 'verificar' ELSE 'rechazar' END,
    pg_catalog.jsonb_build_object(
      'actor_role', public.current_app_role(),
      'reserva_id', payment_row.reserva_id,
      'previous_status', payment_row.estado,
      'new_status', CASE WHEN p_approved THEN 'verificado' ELSE 'rechazado' END
    )
  );

  RETURN p_payment_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.register_payment(
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
  IF auth.uid() IS NULL OR p_reservation_id IS NULL
     OR NOT public.is_app_admin() THEN
    RAISE EXCEPTION 'not authorized' USING ERRCODE = '42501';
  END IF;
  IF NULLIF(pg_catalog.btrim(p_method), '') IS NULL
     OR length(p_method) > 40
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
    WHERE reserva_id = p_reservation_id
      AND estado IN ('pendiente', 'verificado')
    FOR UPDATE
  ) THEN
    RAISE EXCEPTION 'reservation already has an active payment' USING ERRCODE = '23514';
  END IF;

  INSERT INTO public.pagos (
    reserva_id, monto, moneda, metodo_pago, referencia_externa
  )
  VALUES (
    reservation_row.id, reservation_row.monto, reservation_row.moneda,
    pg_catalog.btrim(p_method), p_reference
  )
  RETURNING id INTO payment_id;

  INSERT INTO public.auditoria (actor_id, entidad, entidad_id, accion, detalle)
  VALUES (
    auth.uid(),
    'pagos',
    payment_id,
    'registrar',
    pg_catalog.jsonb_build_object(
      'actor_role', public.current_app_role(),
      'reserva_id', p_reservation_id,
      'estado', 'pendiente'
    )
  );
  RETURN payment_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.record_attendance(
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
  session_row public.sesiones_academicas%ROWTYPE;
  attendance_id UUID;
  old_status public.attendance_status;
  actor_id UUID := auth.uid();
  actor_role TEXT := public.current_app_role();
BEGIN
  IF actor_id IS NULL OR p_session_id IS NULL OR p_student_id IS NULL
     OR p_status IS NULL OR actor_role IS NULL THEN
    RAISE EXCEPTION 'invalid attendance request' USING ERRCODE = '22023';
  END IF;

  SELECT * INTO STRICT session_row
  FROM public.sesiones_academicas
  WHERE id = p_session_id
  FOR UPDATE;

  IF session_row.estado = 'cancelada' THEN
    RAISE EXCEPTION 'cancelled session cannot receive attendance' USING ERRCODE = '23514';
  END IF;
  IF actor_role NOT IN ('administrador', 'superadministrador')
     AND NOT public.is_section_teacher(session_row.seccion_id) THEN
    RAISE EXCEPTION 'not authorized' USING ERRCODE = '42501';
  END IF;
  IF NOT public.is_enrolled_in_section_for_student(session_row.seccion_id, p_student_id) THEN
    RAISE EXCEPTION 'student is not enrolled in this section' USING ERRCODE = '42501';
  END IF;
  IF p_status = 'justificado' AND NULLIF(pg_catalog.btrim(p_reason), '') IS NULL THEN
    RAISE EXCEPTION 'justification reason required' USING ERRCODE = '23514';
  END IF;

  SELECT a.id, a.estado
  INTO attendance_id, old_status
  FROM public.asistencias AS a
  WHERE a.sesion_id = p_session_id
    AND a.estudiante_id = p_student_id
  FOR UPDATE;

  IF attendance_id IS NOT NULL THEN
    IF NULLIF(pg_catalog.btrim(p_reason), '') IS NULL THEN
      RAISE EXCEPTION 'correction reason required' USING ERRCODE = '23514';
    END IF;

    INSERT INTO public.historial_asistencias (
      asistencia_id, actor_id, estado_anterior, estado_nuevo, motivo
    )
    VALUES (attendance_id, actor_id, old_status, p_status, p_reason);

    UPDATE public.asistencias
    SET estado = p_status,
        registrado_por = actor_id,
        motivo = p_reason,
        updated_at = pg_catalog.now()
    WHERE id = attendance_id;

    INSERT INTO public.auditoria (actor_id, entidad, entidad_id, accion, detalle)
    VALUES (
      actor_id,
      'asistencias',
      attendance_id,
      'corregir',
      pg_catalog.jsonb_build_object(
        'actor_role', actor_role,
        'session_id', p_session_id,
        'student_id', p_student_id,
        'previous_status', old_status,
        'new_status', p_status,
        'motivo', p_reason
      )
    );
  ELSE
    INSERT INTO public.asistencias (
      sesion_id, estudiante_id, estado, registrado_por, motivo
    )
    VALUES (p_session_id, p_student_id, p_status, actor_id, p_reason)
    RETURNING id INTO attendance_id;

    INSERT INTO public.auditoria (actor_id, entidad, entidad_id, accion, detalle)
    VALUES (
      actor_id,
      'asistencias',
      attendance_id,
      'registrar',
      pg_catalog.jsonb_build_object(
        'actor_role', actor_role,
        'session_id', p_session_id,
        'student_id', p_student_id,
        'new_status', p_status
      )
    );
  END IF;

  RETURN attendance_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.mark_notification_read(p_notification_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, auth
AS $$
BEGIN
  IF auth.uid() IS NULL OR p_notification_id IS NULL
     OR NOT public.is_active_user() THEN
    RAISE EXCEPTION 'not authorized' USING ERRCODE = '42501';
  END IF;

  UPDATE public.notificaciones
  SET leida_en = COALESCE(leida_en, pg_catalog.now())
  WHERE id = p_notification_id
    AND usuario_id = auth.uid();

  IF NOT FOUND THEN
    RAISE EXCEPTION 'notification not found' USING ERRCODE = 'P0002';
  END IF;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.verify_payment(UUID, BOOLEAN) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.register_payment(UUID, TEXT, TEXT) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.record_attendance(UUID, UUID, public.attendance_status, TEXT) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.mark_notification_read(UUID) FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.verify_payment(UUID, BOOLEAN) TO authenticated;
GRANT EXECUTE ON FUNCTION public.register_payment(UUID, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.record_attendance(UUID, UUID, public.attendance_status, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.mark_notification_read(UUID) TO authenticated;