CREATE FUNCTION public.is_institutional_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public, auth
AS $$
  SELECT COALESCE(public.current_app_role() = 'administrador', FALSE)
$$;

CREATE FUNCTION public.is_active_user()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public, auth
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.usuarios AS u
    WHERE u.id = auth.uid()
      AND u.estado = 'activo'
      AND u.activo = TRUE
  )
$$;

CREATE FUNCTION public.is_active_student()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public, auth
AS $$
  SELECT COALESCE(public.current_app_role() = 'estudiante', FALSE)
$$;

CREATE FUNCTION public.is_active_teacher()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public, auth
AS $$
  SELECT COALESCE(public.current_app_role() = 'docente', FALSE)
$$;

REVOKE EXECUTE ON FUNCTION public.is_institutional_admin() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_active_user() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_active_student() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_active_teacher() FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.is_institutional_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_active_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_active_student() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_active_teacher() TO authenticated;