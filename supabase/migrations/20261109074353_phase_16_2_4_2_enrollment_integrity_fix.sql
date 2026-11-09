CREATE OR REPLACE FUNCTION public.create_enrollment(p_reservation_id uuid, p_student_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'pg_catalog', 'public', 'auth'
AS $function$
DECLARE
  reservation_row public.reservas%ROWTYPE;
  section_capacity INTEGER;
  enrolled_count INTEGER;
  section_exists BOOLEAN;
  enrollment_id UUID;
  verified_payment_id UUID;
  interested_email TEXT;
  student_email TEXT;
BEGIN
  IF NOT public.is_app_admin() THEN
    RAISE EXCEPTION 'not authorized' USING ERRCODE = '42501';
  END IF;

  SELECT *
  INTO STRICT reservation_row
  FROM public.reservas
  WHERE id = p_reservation_id
  FOR UPDATE;

  IF reservation_row.estado <> 'confirmada' THEN
    RAISE EXCEPTION 'reservation is not confirmed' USING ERRCODE = '23514';
  END IF;

  SELECT p.id
  INTO verified_payment_id
  FROM public.pagos AS p
  WHERE p.reserva_id = p_reservation_id
    AND p.estado = 'verificado'
  ORDER BY p.updated_at DESC, p.id
  LIMIT 1
  FOR UPDATE;

  IF verified_payment_id IS NULL THEN
    RAISE EXCEPTION 'verified payment required' USING ERRCODE = '23514';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public.usuarios AS u
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
    SELECT lower(i.email)
    INTO interested_email
    FROM public.interesados AS i
    WHERE i.id = reservation_row.interesado_id;

    SELECT lower(u.email)
    INTO student_email
    FROM public.usuarios AS u
    WHERE u.id = p_student_id;

    IF interested_email IS NULL
       OR student_email IS DISTINCT FROM interested_email THEN
      RAISE EXCEPTION 'student does not match reservation contact' USING ERRCODE = '42501';
    END IF;
  END IF;

  SELECT s.capacidad
  INTO section_capacity
  FROM public.secciones AS s
  WHERE s.id = reservation_row.seccion_id
  FOR UPDATE;

  section_exists := FOUND;
  IF NOT section_exists THEN
    RAISE EXCEPTION 'section not found' USING ERRCODE = '23503';
  END IF;

  SELECT count(*)::INTEGER
  INTO enrolled_count
  FROM public.inscripciones AS i
  WHERE i.seccion_id = reservation_row.seccion_id
    AND i.estado IN ('activa', 'suspendida');

  IF section_capacity IS NOT NULL AND enrolled_count >= section_capacity THEN
    RAISE EXCEPTION 'section capacity reached' USING ERRCODE = '23514';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.inscripciones AS i
    WHERE i.estudiante_id = p_student_id
      AND i.seccion_id = reservation_row.seccion_id
  ) THEN
    RAISE EXCEPTION 'student is already enrolled in this section' USING ERRCODE = '23505';
  END IF;

  UPDATE public.reservas
  SET interesado_id = NULL,
      estudiante_id = p_student_id
  WHERE id = p_reservation_id;

  INSERT INTO public.inscripciones (reserva_id, estudiante_id, seccion_id)
  VALUES (p_reservation_id, p_student_id, reservation_row.seccion_id)
  RETURNING id INTO enrollment_id;

  INSERT INTO public.auditoria (actor_id, entidad, entidad_id, accion, detalle)
  VALUES (
    auth.uid(),
    'inscripciones',
    enrollment_id,
    'crear',
    jsonb_build_object(
      'reserva_id', p_reservation_id,
      'interesado_id', reservation_row.interesado_id,
      'estudiante_id', p_student_id,
      'pago_id', verified_payment_id,
      'estado_reserva_anterior', reservation_row.estado,
      'estado_reserva_nuevo', reservation_row.estado
    )
  );

  RETURN enrollment_id;
END;
$function$;

REVOKE EXECUTE ON FUNCTION public.create_enrollment(uuid, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_enrollment(uuid, uuid) TO authenticated;