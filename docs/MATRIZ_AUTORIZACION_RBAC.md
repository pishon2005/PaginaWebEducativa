# EDUKATECH — Matriz de autorización RBAC

> Fase 16.1.5. Documento de diseño y auditoría. No es una migración ejecutable.
> No se realizaron cambios de SQL, RLS, permisos, datos ni usuarios.

## 1. Estado de autoridad

La identidad procede de `auth.users.id`. El rol efectivo se obtiene mediante
`public.usuarios.rol_id` y `public.roles.nombre`. Los UUID de roles y la
metadata de Auth no son fuentes de autorización.

El estado institucional efectivo requiere:

```text
public.usuarios.estado = 'activo'
public.usuarios.activo = true
```

La sesión Auth, por sí sola, no concede autorización institucional.

## 2. Roles definitivos

| Rol | Capacidades aprobadas | Límites |
|---|---|---|
| `superadministrador` | Administración global, gestión de administradores, roles, configuración, auditoría y todos los recursos institucionales | No obtiene acceso automático al chat ni a archivos personales |
| `administrador` | Estudiantes, docentes, cursos, secciones, reservas, pagos, matrículas y gestión académica | No asigna roles, no gestiona administradores/superadministradores ni configuración global |
| `docente` | Recursos, tareas, quizzes, asistencia y estudiantes de sus secciones | No accede a otras secciones, pagos globales, roles ni estados |
| `estudiante` | Perfil propio, inscripciones, recursos asignados, entregas, intentos y resultados propios | No accede a otros estudiantes, answer keys ni módulos administrativos |

## 3. Helpers requeridos

| Helper | Contrato |
|---|---|
| `current_app_role()` | Devuelve el nombre de rol solo para un perfil `activo=true` y `estado='activo'` |
| `is_superadmin()` | `current_app_role() = 'superadministrador'` |
| `is_institutional_admin()` | `current_app_role() = 'administrador'` |
| `is_app_admin()` | Agrupa ambos administradores únicamente en operaciones explícitamente comunes |
| `is_active_user()` | Perfil existente con `activo=true` y `estado='activo'` |
| `is_active_student()` | Usuario activo cuyo rol es `estudiante` |
| `is_active_teacher()` | Usuario activo cuyo rol es `docente` |

`is_app_admin()` no debe autorizar universalmente configuración, auditoría,
roles, gestión de administradores, documentos privados ni superadministradores.

## 4. Matriz por dominio

| Dominio | Superadministrador | Administrador | Docente | Estudiante |
|---|---|---|---|---|
| Usuarios | CRUD global, con protección del propio rol/estado | Gestiona estudiantes/docentes | Perfil propio | Campos propios no privilegiados |
| Roles | Asigna cualquier rol a terceros | Sin asignación | Sin asignación | Sin asignación |
| Estados | Gestiona terceros según jerarquía | Estudiantes/docentes | No | No |
| Configuración | CRUD global | Lectura solo si se aprueba explícitamente | No | No |
| Auditoría | Lectura global | Lectura acotada al ámbito | No | No |
| Cursos | CRUD global | CRUD institucional | Actualiza cursos asignados | Lectura publicada |
| Secciones | CRUD global | CRUD institucional | Secciones asignadas | Lectura disponible/inscrita |
| Reservas | Gestiona globalmente | Gestiona institucionalmente | Consulta relacionada | Consulta propia |
| Pagos | Verifica y gestiona | Verifica y gestiona | No | Consulta propia |
| Matrículas | Crea y gestiona | Crea y gestiona | Consulta asignada | Consulta propia |
| Asistencia | Corrige con motivo y auditoría | Corrige con motivo y auditoría | Registra/corrige sus secciones | Consulta propia |
| Materiales/videos | CRUD global | CRUD institucional | CRUD de secciones propias | Lectura inscrita |
| Tareas/quizzes | CRUD global | CRUD institucional | CRUD de secciones propias | Entrega/intento propios |
| Answer keys | Gestiona | Gestiona si se aprueba | Solo quizzes asignados | Nunca |
| Storage | Acceso excepcional auditado | Documentos institucionales autorizados | Secciones asignadas | Archivos propios/asignados |
| Conversaciones | Solo participante | Solo participante | Solo participante | Solo participante |

## 5. Estados

| Estado | `activo` propuesto | Rol efectivo | Módulos académicos | Storage/Realtime |
|---|---:|---|---|---|
| `pendiente` | `true` por el trigger histórico | No | No | No institucional |
| `activo` | `true` | Sí | Según rol/relación | Según rol/relación |
| `suspendido` | `false` | No | No | No |
| `inactivo` | `false` | No | No | No |

La correspondencia propuesta no se aplica todavía. El trigger histórico crea
`pendiente + activo=true`, por lo que no se debe añadir una restricción de
igualdad sin migración de datos y pruebas de compatibilidad.

Transiciones:

| Transición | Actor |
|---|---|
| `pendiente → activo` de estudiante/docente | Administrador o superadministrador |
| `pendiente → activo` de administrador | Solo superadministrador |
| `activo ↔ suspendido` de estudiante/docente | Administrador o superadministrador |
| Cambio de administrador/superadministrador | Solo superadministrador |
| Cambio del propio estado | Prohibido |
| Desactivación del último superadministrador | Siempre prohibida |

## 6. Perfil y columnas

El usuario solo debe modificar:

```text
nombre, apellido, foto_perfil, telefono, pais, idioma_preferido
```

Deben estar protegidas:

```text
id, email, rol_id, estado, activo, email_verificado, primer_login,
created_at, updated_at, codigo_alumno
```

El email se cambia mediante Supabase Auth y confirmación; no mediante
`UPDATE public.usuarios.email`.

## 7. Storage y Realtime

| Categoría | Estudiante | Docente | Administrador | Superadministrador |
|---|---|---|---|---|
| `profile` | Propio | Propio | Solo relación autorizada | Solo acceso excepcional |
| `student_document` | Propio | No global | Documentos institucionales autorizados | Supervisión auditada |
| `payment_proof` | Propio | No | Reserva/pago autorizado | Supervisión auditada |
| `submission` | Propia | Secciones asignadas | Ámbito institucional | Ámbito institucional |
| `learning_material` / `video` | Sección inscrita | Sección asignada | Institucional autorizado | Institucional autorizado |
| `administrative_document` | No | No | Solo operación explícita | Solo operación explícita |
| `message_attachment` | Participante | Participante | Participante | Participante |

El chat permanece privado por participantes. El rol administrativo no concede
acceso global.

## 8. `email_verificado`

La fuente primaria es `auth.users.email_confirmed_at`. El campo
`public.usuarios.email_verificado` solo se copia durante el bootstrap y puede
quedar obsoleto. No se utilizará para autorización hasta definir sincronización
segura; la opción preferida es conservarlo como dato informativo.

## 9. Decisiones cerradas para Fase 16.2

Estas reglas quedan fijadas como diseño de autorización para la siguiente fase.
No implican que ya estén implementadas en SQL.

| Operación | Superadministrador | Administrador |
|---|---|---|
| Asignar roles | Sí, a terceros; nunca autoasignación | No |
| Gestionar estudiantes/docentes | Sí | Sí |
| Gestionar administradores | Sí | No |
| Gestionar superadministradores | Solo con protección del último activo | No |
| Configuración global | Sí | No |
| Auditoría global | Sí | No; solo alcance institucional futuro |
| Reservas, pagos y matrículas | Sí | Sí |
| Operaciones académicas | Sí | Sí |
| Storage personal | Solo acceso excepcional auditado | Solo finalidad/relación autorizada |
| Chat | Solo como participante | Solo como participante |

`is_app_admin()` podrá compartirse únicamente en operaciones expresamente
comunes. Configuración, auditoría global, roles, estados privilegiados y acceso
excepcional a documentos usarán helpers exclusivos.

## 10. Decisiones sobre FOR ALL y DELETE

Las políticas `FOR ALL` no se separarán automáticamente. En Fase 16.2 cada
tabla se probará por operación:

- SELECT: conservar la relación académica o propiedad correspondiente.
- INSERT: exigir actor, relación y parámetros válidos.
- UPDATE: limitar columnas y conservar `WITH CHECK`.
- DELETE: denegar por defecto a docentes cuando solo exista asignación de
  sección; preferir eliminación lógica cuando el modelo lo permita.

En particular, docentes no podrán eliminar por el solo hecho de estar asignados:
horarios, sesiones, tareas, quizzes, preguntas, claves de respuesta, materiales
o videos. Las entregas, intentos, pagos, matrículas, auditoría y registros de
asistencia permanecerán protegidos contra DELETE directo.

## 11. Decisión sobre email_verificado

`public.usuarios.email_verificado` se conserva únicamente como dato informativo.
La autoridad es `auth.users.email_confirmed_at`. No se creará una migración
exclusiva para sincronizarlo salvo necesidad funcional aprobada posteriormente.

## 12. Estado de implementación

| Elemento | Estado |
|---|---|
| Helpers diferenciados | Propuesto |
| Separación admin/superadmin | Diseño cerrado; pendiente de migración |
| Protección de columnas | Diseño cerrado; pendiente de migración |
| Políticas RLS nuevas | No implementadas |
| Storage excepcional auditado | Diseño cerrado; pendiente de migración |
| Pruebas 4 × 4 | Preparadas; ejecución posterior a implementación |

## 13. Veredicto de preparación

**APTO CON CONDICIONES para iniciar la Fase 16.2.**

La arquitectura y las decisiones bloqueantes están cerradas. La autorización
solo puede iniciar con migraciones hacia adelante, pruebas locales y sin
modificar las migraciones históricas.
