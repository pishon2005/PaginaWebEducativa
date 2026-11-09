# EDUKATECH — contexto vigente del proyecto

> Actualizado el 2026-11-02. Este documento resume el estado actual. La arquitectura aprobada y las reglas de negocio vigentes están en los documentos enlazados abajo; las notas extensas de implementación histórica se conservan en [PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md).

## Producto y estado actual

EDUKATECH es una plataforma educativa en español para cursos de tecnología y mecatrónica. El repositorio contiene un frontend amplio con catálogo público, autenticación de demostración y paneles para superadministrador, administrador, docente y estudiante.

La aplicación todavía es principalmente una demo:

- El acceso demo se limita a navegación de desarrollo en servidor; no crea una sesión real y no se permite en producción. La integración con Supabase Auth está preparada, pero no se ha validado con credenciales externas.
- Las rutas del panel requieren Auth cuando Supabase está configurado, pero permanecen bloqueadas hasta implementar un perfil PostgreSQL aprobado y sus permisos/RLS.
- Las páginas y formularios usan datos ficticios/locales; los cambios no persisten en un backend conectado.
- Los comprobantes, videos y adjuntos no están integrados a Storage.
- Chat, notificaciones, asistencia, pagos y estadísticas son vistas de demostración.
- El esquema Drizzle existe, pero no está conectado de extremo a extremo a flujos de aplicación.
- El módulo `/tienda` es un catálogo visual de productos; su alcance comercial está pendiente de aprobación y no debe mezclarse con pagos académicos.

## Arquitectura oficial

- Next.js 16 con App Router, React 19 y TypeScript.
- Vercel para despliegue y ejecución de servidor.
- Supabase PostgreSQL como única base principal de producción, además de Supabase Auth, Storage privado y Realtime según permisos.
- Drizzle se conserva para esquemas y acceso tipado desde servidor.
- Se prioriza Supabase CLI para el desarrollo local.
- Las migraciones SQL de Supabase se plantean como historial oficial del esquema y Drizzle como representación tipada sincronizada.
- RLS, Storage y canales Realtime deben aplicar autorización por identidad, propiedad y relación. El uso de Drizzle no implica por sí mismo RLS.

Esta arquitectura está decidida; no se deben proponer alternativas de proveedor ni reemplazar Drizzle sin justificación técnica.

## Reglas iniciales aprobadas

- Cursos generales se ofrecen mediante secciones/convocatorias concretas, presenciales o virtuales.
- Los intereses pueden enviarse sin iniciar sesión; interés, reserva, pago, cuenta e inscripción son estados/procesos separados.
- Reserva asociada a una sección y periodo configurado por administración. Sin vencimientos automáticos ni mínimos de interesados inventados.
- Pago manual, sin pasarela ni pagos parciales. El administrador autorizado verifica; cuenta e inscripción se crean/habilitan posteriormente mediante proceso validado en servidor.
- Contenidos, tareas y quizzes operativos pertenecen a una sección; asistencia se registra por sesión académica en `America/Lima`.
- Chat privado 1:1, solo entre parejas autorizadas; el rol de superadministrador no concede acceso indiscriminado.
- Una organización inicial, sin modelo multiinstitución/multisede. Una categoría principal por curso.
- La historia académica, pagos, inscripciones y auditoría no se eliminan automáticamente. La política final de retención queda pendiente antes de producción.

El detalle aprobado, incluidas las decisiones aún pendientes, se mantiene en [docs/REGLAS_NEGOCIO_Y_MODELO_DATOS.md](./docs/REGLAS_NEGOCIO_Y_MODELO_DATOS.md).

## Documentación de referencia

| Documento | Propósito |
|---|---|
| [docs/INVENTARIO_FRONTEND.md](./docs/INVENTARIO_FRONTEND.md) | Rutas, páginas, vistas, formularios, módulos por rol y funcionalidades simuladas. |
| [docs/REGLAS_NEGOCIO_Y_MODELO_DATOS.md](./docs/REGLAS_NEGOCIO_Y_MODELO_DATOS.md) | Reglas confirmadas, modelo conceptual, RLS, comparación de esquemas y pendientes. |
| [docs/AUTENTICACION_Y_SEGURIDAD.md](./docs/AUTENTICACION_Y_SEGURIDAD.md) | Integración Supabase Auth preparada, protección, límites y dependencias de autorización. |
| [PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md) | Registro técnico e histórico detallado; sus propuestas antiguas de arquitectura están supersedidas por las decisiones vigentes. |
| [AGENTS.md](./AGENTS.md) | Instrucciones del agente para este repositorio. |

## Stack y comandos

- Next.js 16.4.4, React 19.2.8, TypeScript 5, Tailwind CSS 4.
- Drizzle ORM y `postgres`; Supabase CLI/configuración local presente, sin integración activa del frontend.
- `npm run dev`: desarrollo; `npm run build`: build; `npm run lint`: ESLint.
- `package.json` no define un script de pruebas.

No ejecutar migraciones ni conectar bases de datos como parte de una limpieza documental/frontend.
