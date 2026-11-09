# EDUKATECH — Plan de implementación de seguridad

> Fase 16.1.5. Plan futuro. No se aplicaron migraciones ni cambios de código.

## 1. Dependencias y reglas

Las migraciones históricas no deben editarse. Cada corrección futura debe ser
una migración nueva hacia adelante, probada localmente y aplicada solo tras
autorización explícita. El consolidado SQL debe regenerarse desde las
migraciones oficiales.

Orden obligatorio:

```text
helpers → privilegios de perfil → RPC administrativas
→ políticas RLS → Storage/Realtime → frontend → pruebas por rol
```

## 2. Orden definitivo de migraciones propuestas

### Migración 004 — Helpers de autorización

Crear:

```text
is_institutional_admin()
is_active_user()
is_active_student()
is_active_teacher()
```

Mantener `is_app_admin()` solo donde ambos administradores deban compartir
deliberadamente una operación. No modificar la semántica histórica hasta tener
pruebas de equivalencia.

Dependencia: ninguna; debe preceder a toda política que diferencie roles.

### Migración 005 — Perfil y privilegios

- Revocar cualquier UPDATE de tabla que contradiga el grant de columnas.
- Conservar únicamente los seis campos de perfil no privilegiados.
- Proteger `id`, `email`, `rol_id`, `estado`, `activo`, `email_verificado`,
  `primer_login`, timestamps y `codigo_alumno`.
- Crear operaciones server-side para actualizar perfiles administrativos.
- No modificar directamente `auth.users.email`.

Dependencia: 004. Debe validarse después de los grants porque el orden ACL
puede anular un grant de columna.

### Migración 006 — Jerarquía administrativa

- `assign_user_role()` solo para superadministrador.
- `set_account_status()` con jerarquía actor/objetivo.
- Administrador no puede gestionar administradores ni superadministradores.
- Superadministrador no puede autoelevarse ni dejar cero superadministradores.
- Registrar actor, objetivo, transición, motivo y resultado.

Dependencia: 004 y 005.

### Migración 007 — RPC y auditoría

- Añadir auditoría de correcciones de asistencia.
- Revisar `mark_notification_read()` para perfiles suspendidos.
- Revisar validación activa en `can_manage_file()`.
- Validar que cada RPC mutadora compruebe actor, estado y relación.
- Mantener `SECURITY DEFINER`, `search_path` fijo y EXECUTE restringido.

Dependencia: 004–006. Las políticas deben conservar autorización equivalente
por operación antes de restringir capacidades.

### Migración 008 — RLS por capacidad

Sustituir usos de `is_app_admin()` solamente después de documentar el efecto
actual de cada política. Prioridades:

```text
configuraciones
auditoria
roles
usuarios
criterios_certificado
documentos administrativos
notificaciones
reservas/pagos/matrículas
```

No separar `FOR ALL` mecánicamente. Para cada política se deben comparar
SELECT, INSERT, UPDATE y DELETE antes y después.

Dependencia: 004–007. No se modifican propietarios ni RLS administrada de
Storage/Realtime.

### Migración 009 — Storage y Realtime

- Mantener RLS administrada por Supabase en `storage.objects` y
  `realtime.messages`.
- No cambiar propietarios ni roles administrados.
- Limitar documentos por categoría, propietario y relación.
- Añadir operación excepcional de documentos con auditoría.
- Mantener chat privado por participantes, incluido el superadministrador.

### Migración 010 — Email institucional

Decisión cerrada: conservar `email_verificado` como dato informativo y no usarlo
en autorización. No se planifica una migración exclusiva para este campo. Si
aparece una necesidad funcional posterior, deberá aprobarse un diseño específico
sin convertir el duplicado en fuente de autoridad.

## 3. Integración frontend

- Guards server-side basados en la autorización real.
- Estados diferenciados: `pending`, `forbidden`, `suspended`, `unauthorized`.
- Acciones privilegiadas solo mediante Server Actions/RPC.
- La UI nunca decide el rol.
- No ocultar un error de RLS como éxito.
- Mantener logout disponible para perfiles bloqueados.

## 4. Preparación y ejecución de pruebas 4 × 4

Cada combinación requiere una identidad Auth real o un entorno local con claims
`authenticated` correctos:

| Rol | pendiente | activo | suspendido | inactivo |
|---|---|---|---|---|
| superadministrador | bloqueo | acceso global aprobado | bloqueo | bloqueo |
| administrador | bloqueo | acceso institucional | bloqueo | bloqueo |
| docente | bloqueo | secciones propias | bloqueo | bloqueo |
| estudiante | bloqueo/catálogo | recursos propios/asignados | bloqueo | bloqueo |

Para cada celda:

- SELECT propio y cruzado.
- INSERT propio y ajeno.
- UPDATE permitido y columna protegida.
- DELETE propio, ajeno y recurso asignado.
- RPC permitida y RPC privilegiada.
- Storage SELECT/INSERT/DELETE.
- Realtime read/write.
- Ruta privada directa.
- Sesión abierta antes y después de suspensión.

Las pruebas deben estar preparadas antes de crear las migraciones nuevas. Su
ejecución completa corresponde después de aplicar los cambios en Supabase Local;
no es un bloqueo para escribir la primera migración.

## 5. Pruebas automatizables y manuales

Automatizables localmente:

- Políticas RLS por operación.
- Column grants.
- RPC positiva/negativa.
- Último superadministrador.
- Acceso cruzado entre estudiantes/docentes.
- Estado efectivo y helpers.
- Storage metadata y buckets.

Requieren validación manual o integración:

- Cookies y renovación SSR tras suspensión.
- Realtime WebSocket con revocación.
- Flujo de cambio de email y confirmación Auth.
- Navegación frontend y respuestas 401/403.
- Acceso excepcional auditado a documentos.

No se debe usar `service_role` para representar un usuario normal. Las pruebas
de usuario deben ejecutarse con sesiones Auth reales o roles JWT equivalentes en
un entorno local aislado.

## 6. Criterios de aceptación

### Para comenzar Fase 16.2

- Diseño de roles, estados, columnas y Storage aprobado.
- Migraciones históricas congeladas.
- Casos 4 × 4 preparados.
- Entorno local desechable confirmado.
- Plan de rollback compensatorio definido.

### Durante Fase 16.2

- Cada migración se aplica localmente en orden.
- Se comprueban grants y EXECUTE después de cada cambio.
- Se ejecutan pruebas negativas de IDOR, autoasignación y acceso cruzado.
- Se mantienen chat privado y protección del último superadministrador.

### Para cerrar Fase 16.2 y pasar a 16.3

1. La matriz admin/superadmin esté aprobada.
2. Las columnas sensibles estén protegidas y verificadas.
3. Las 58 políticas tengan pruebas por operación.
4. Las RPC mutadoras tengan pruebas positivas y negativas.
5. Storage no permita acceso global por rol.
6. Realtime rechace participantes revocados o suspendidos.
7. `email_verificado` no sea una fuente obsoleta de autorización.
8. La cuenta sintética siga pendiente y sin modificaciones.

## 7. Aprobaciones institucionales de alcance

Estas decisiones no cambian las reglas mínimas cerradas en esta fase, pero deben
resolverse antes de ampliar el alcance institucional:

- Alcance exacto de auditoría administrativa.
- Catálogo de documentos institucionales.
- Política de catálogo para perfiles pendientes.
- Operaciones de configuración adicionales.
- Retención y eliminación lógica de recursos académicos.

Estado de transición: **APTO CON CONDICIONES para iniciar Fase 16.2**.
