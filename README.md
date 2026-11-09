# EDUKATECH

Plataforma educativa en español para cursos de tecnología y mecatrónica. El repositorio contiene el frontend Next.js y el esquema Drizzle en desarrollo; la autenticación, persistencia, pagos, chat y archivos aún son flujos de demostración y no están conectados a producción.

## Documentación

- [Contexto vigente](./CONTEXTO_PROYECTO.md)
- [Inventario del frontend](./docs/INVENTARIO_FRONTEND.md)
- [Reglas de negocio y modelo de datos](./docs/REGLAS_NEGOCIO_Y_MODELO_DATOS.md)
- [Historial técnico](./PROJECT_CONTEXT.md) — documento histórico; las decisiones vigentes prevalecen.

## Tecnologías

- Next.js 16 App Router, React 19, TypeScript y Tailwind CSS 4.
- Arquitectura oficial: Vercel + Supabase (PostgreSQL, Auth, Storage privado y Realtime) con Drizzle conservado para acceso tipado en servidor.
- Para detalle y estado real de integración, consulta el [contexto vigente](./CONTEXTO_PROYECTO.md).

## Desarrollo local

Instala las dependencias con `npm install` y ejecuta:

```bash
npm run dev
```

Scripts disponibles:

```bash
npm run lint
npm run build
npm run start
```

La autenticación actual es solo de demostración. No introduzcas secretos en el cliente ni asumas que los paneles están protegidos por autorización de servidor.
