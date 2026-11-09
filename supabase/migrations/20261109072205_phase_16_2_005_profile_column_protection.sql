REVOKE UPDATE ON TABLE public.usuarios FROM PUBLIC, anon, authenticated;

GRANT UPDATE (
  nombre,
  apellido,
  foto_perfil,
  telefono,
  pais,
  idioma_preferido
) ON TABLE public.usuarios TO authenticated;

DROP POLICY usuarios_update_self_or_admin ON public.usuarios;

CREATE POLICY usuarios_update_self_or_admin ON public.usuarios
FOR UPDATE TO authenticated
USING (
  id = auth.uid()
  AND estado IN ('pendiente', 'activo')
  AND activo = TRUE
)
WITH CHECK (
  id = auth.uid()
  AND estado IN ('pendiente', 'activo')
  AND activo = TRUE
);