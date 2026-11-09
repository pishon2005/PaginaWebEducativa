DROP POLICY configuraciones_admin_only ON public.configuraciones;
CREATE POLICY configuraciones_superadmin_only
ON public.configuraciones
FOR ALL
TO authenticated
USING (public.is_superadmin())
WITH CHECK (public.is_superadmin());

DROP POLICY auditoria_admin_read ON public.auditoria;
CREATE POLICY auditoria_scoped_read
ON public.auditoria
FOR SELECT
TO authenticated
USING (
  public.is_superadmin()
  OR (
    public.is_institutional_admin()
    AND actor_id = auth.uid()
  )
);

DROP POLICY usuarios_read_self_or_admin ON public.usuarios;
CREATE POLICY usuarios_read_scoped
ON public.usuarios
FOR SELECT
TO authenticated
USING (
  id = auth.uid()
  OR public.is_superadmin()
  OR (
    public.is_institutional_admin()
    AND EXISTS (
      SELECT 1
      FROM public.roles AS target_role
      WHERE target_role.id = usuarios.rol_id
        AND target_role.nombre IN ('docente', 'estudiante')
    )
  )
);

DROP POLICY perfiles_docente_write_self_or_admin ON public.perfiles_docente;
CREATE POLICY perfiles_docente_write_scoped
ON public.perfiles_docente
FOR ALL
TO authenticated
USING (
  (
    usuario_id = auth.uid()
    AND public.current_app_role() = 'docente'
  )
  OR public.is_superadmin()
  OR (
    public.is_institutional_admin()
    AND EXISTS (
      SELECT 1
      FROM public.usuarios AS target_user
      JOIN public.roles AS target_role ON target_role.id = target_user.rol_id
      WHERE target_user.id = perfiles_docente.usuario_id
        AND target_role.nombre IN ('docente', 'estudiante')
    )
  )
)
WITH CHECK (
  (
    usuario_id = auth.uid()
    AND public.current_app_role() = 'docente'
  )
  OR public.is_superadmin()
  OR (
    public.is_institutional_admin()
    AND EXISTS (
      SELECT 1
      FROM public.usuarios AS target_user
      JOIN public.roles AS target_role ON target_role.id = target_user.rol_id
      WHERE target_user.id = perfiles_docente.usuario_id
        AND target_role.nombre IN ('docente', 'estudiante')
    )
  )
);

DROP POLICY notificaciones_read_own ON public.notificaciones;
CREATE POLICY notificaciones_read_own_scoped
ON public.notificaciones
FOR SELECT
TO authenticated
USING (usuario_id = auth.uid());

DROP POLICY notificaciones_admin_insert ON public.notificaciones;
CREATE POLICY notificaciones_admin_insert_scoped
ON public.notificaciones
FOR INSERT
TO authenticated
WITH CHECK (
  (
    public.is_superadmin()
    OR public.is_institutional_admin()
  )
  AND EXISTS (
    SELECT 1
    FROM public.usuarios AS recipient
    WHERE recipient.id = notificaciones.usuario_id
      AND recipient.estado IN ('pendiente', 'activo')
  )
);

DROP POLICY materials_teacher_manage ON public.materiales;
CREATE POLICY materials_manage_scoped
ON public.materiales
FOR ALL
TO authenticated
USING (
  public.is_app_admin()
  OR (
    public.is_section_teacher(seccion_id)
    AND propietario_id = auth.uid()
  )
)
WITH CHECK (
  public.is_app_admin()
  OR (
    public.is_section_teacher(seccion_id)
    AND propietario_id = auth.uid()
  )
);

DROP POLICY videos_teacher_manage ON public.videos;
CREATE POLICY videos_manage_scoped
ON public.videos
FOR ALL
TO authenticated
USING (
  public.is_app_admin()
  OR (
    public.is_section_teacher(seccion_id)
    AND propietario_id = auth.uid()
  )
)
WITH CHECK (
  public.is_app_admin()
  OR (
    public.is_section_teacher(seccion_id)
    AND propietario_id = auth.uid()
  )
);