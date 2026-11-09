CREATE OR REPLACE FUNCTION public.set_account_status(
  p_user_id UUID,
  p_status public.account_status
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, auth
AS $$
DECLARE
  actor_id UUID := auth.uid();
  actor_role TEXT;
  target_role TEXT;
  previous_status public.account_status;
  previous_active BOOLEAN;
BEGIN
  IF actor_id IS NULL OR p_user_id IS NULL OR p_status IS NULL THEN
    RAISE EXCEPTION 'invalid account status request' USING ERRCODE = '22023';
  END IF;

  actor_role := public.current_app_role();
  IF actor_role IS NULL OR actor_role NOT IN ('administrador', 'superadministrador') THEN
    RAISE EXCEPTION 'not authorized' USING ERRCODE = '42501';
  END IF;
  IF actor_id = p_user_id THEN
    RAISE EXCEPTION 'cannot modify own account status' USING ERRCODE = '42501';
  END IF;

  PERFORM pg_catalog.pg_advisory_xact_lock(763846205684721);

  SELECT r.nombre, u.estado, u.activo
  INTO STRICT target_role, previous_status, previous_active
  FROM public.usuarios AS u
  JOIN public.roles AS r ON r.id = u.rol_id
  WHERE u.id = p_user_id
  FOR UPDATE OF u;

  IF actor_role = 'administrador'
     AND target_role NOT IN ('estudiante', 'docente') THEN
    RAISE EXCEPTION 'administrator cannot manage this role' USING ERRCODE = '42501';
  END IF;

  IF target_role = 'superadministrador'
     AND actor_role <> 'superadministrador' THEN
    RAISE EXCEPTION 'not authorized' USING ERRCODE = '42501';
  END IF;

  IF previous_status = p_status THEN
    RAISE EXCEPTION 'account status is unchanged' USING ERRCODE = '23514';
  END IF;

  IF NOT (
    (previous_status = 'pendiente' AND p_status = 'activo')
    OR (previous_status = 'activo' AND p_status IN ('suspendido', 'inactivo'))
    OR (previous_status = 'suspendido' AND p_status = 'activo')
  ) THEN
    RAISE EXCEPTION 'account status transition is not permitted' USING ERRCODE = '23514';
  END IF;

  IF target_role = 'superadministrador'
     AND p_status <> 'activo'
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

  UPDATE public.usuarios
  SET estado = p_status,
      activo = (p_status = 'activo')
  WHERE id = p_user_id;

  INSERT INTO public.auditoria (actor_id, entidad, entidad_id, accion, detalle)
  VALUES (
    actor_id,
    'usuarios',
    p_user_id,
    'cambiar_estado',
    pg_catalog.jsonb_build_object(
      'actor_role', actor_role,
      'target_role', target_role,
      'previous_status', previous_status,
      'new_status', p_status,
      'previous_active', previous_active,
      'new_active', (p_status = 'activo')
    )
  );

  RETURN p_user_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.assign_user_role(
  p_user_id UUID,
  p_role_name TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, auth
AS $$
DECLARE
  actor_id UUID := auth.uid();
  actor_role TEXT;
  requested_role_id UUID;
  previous_role TEXT;
  previous_status public.account_status;
  previous_active BOOLEAN;
BEGIN
  IF actor_id IS NULL OR p_user_id IS NULL OR p_role_name IS NULL
     OR p_role_name <> pg_catalog.btrim(p_role_name) THEN
    RAISE EXCEPTION 'invalid role assignment request' USING ERRCODE = '22023';
  END IF;

  actor_role := public.current_app_role();
  IF actor_id = p_user_id OR actor_role <> 'superadministrador' THEN
    RAISE EXCEPTION 'not authorized' USING ERRCODE = '42501';
  END IF;

  SELECT r.id
  INTO STRICT requested_role_id
  FROM public.roles AS r
  WHERE r.nombre = p_role_name
    AND r.nombre IN ('superadministrador', 'administrador', 'docente', 'estudiante');

  PERFORM pg_catalog.pg_advisory_xact_lock(763846205684721);

  SELECT r.nombre, u.estado, u.activo
  INTO STRICT previous_role, previous_status, previous_active
  FROM public.usuarios AS u
  JOIN public.roles AS r ON r.id = u.rol_id
  WHERE u.id = p_user_id
  FOR UPDATE OF u;

  IF previous_role = 'superadministrador'
     AND p_role_name <> 'superadministrador'
     AND previous_status = 'activo'
     AND previous_active
     AND (
       SELECT count(*)
       FROM public.usuarios AS u
       JOIN public.roles AS r ON r.id = u.rol_id
       WHERE r.nombre = 'superadministrador'
         AND u.estado = 'activo'
         AND u.activo
     ) <= 1 THEN
    RAISE EXCEPTION 'cannot demote the last active superadministrator'
      USING ERRCODE = '23514';
  END IF;

  UPDATE public.usuarios
  SET rol_id = requested_role_id
  WHERE id = p_user_id;

  INSERT INTO public.auditoria (actor_id, entidad, entidad_id, accion, detalle)
  VALUES (
    actor_id,
    'usuarios',
    p_user_id,
    'asignar_rol',
    pg_catalog.jsonb_build_object(
      'actor_role', actor_role,
      'previous_role', previous_role,
      'new_role', p_role_name,
      'status_preserved', previous_status,
      'active_preserved', previous_active
    )
  );

  RETURN p_user_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.set_account_status(UUID, public.account_status)
  FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.assign_user_role(UUID, TEXT)
  FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.set_account_status(UUID, public.account_status)
  TO authenticated;
GRANT EXECUTE ON FUNCTION public.assign_user_role(UUID, TEXT)
  TO authenticated;