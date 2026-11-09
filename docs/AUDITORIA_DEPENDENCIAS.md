# Auditoría de dependencias — FASE 6

## Alcance y resultado

Auditoría del árbol instalado con `npm audit` y `npm audit --omit=dev`. Se revisó el árbol completo, no se ejecutaron pruebas de explotación.

| Comprobación | Resultado |
|---|---:|
| Árbol completo | 25 avisos: 2 bajos, 23 moderados, 0 altos, 0 críticos |
| Dependencias de producción (`--omit=dev`) | 0 avisos |
| Dependencias instaladas directamente | `drizzle-kit`, `eslint`, `eslint-config-next` y `shadcn` |
| Avisos transitivos | 21 |
| `shadcn` en producción | No; se mantiene en `devDependencies` |

Todos los paquetes señalados pertenecen al árbol de desarrollo, como confirma la auditoría de producción. Esta clasificación reduce la exposición del bundle/runtime productivo, pero no elimina el riesgo al ejecutar herramientas localmente o en CI.

## Paquetes afectados

La columna “Raíz” identifica el grupo directo del árbol; los demás paquetes se alcanzan transitivamente. Los rangos reproducen el campo `range` que devuelve npm. `*` significa que npm atribuye el aviso a la cadena transitiva completa y no proporcionó un rango más específico para ese paquete.

| Paquete instalado | Versión | Severidad | Raíz | Rango/aviso informado |
|---|---:|---|---|---|
| `@esbuild-kit/core-utils` | 3.3.2 | Moderada | `drizzle-kit` | `*`; aviso transitivo de `esbuild` |
| `@esbuild-kit/esm-loader` | 2.6.5 | Moderada | `drizzle-kit` | `*`; depende de `@esbuild-kit/core-utils` |
| `@eslint-community/eslint-utils` | 4.10.1 | Moderada | `eslint` / `eslint-config-next` | `*`; aviso transitivo de `eslint` |
| `@eslint/config-array` | 0.21.2 | Moderada | `eslint` | `*`; aviso transitivo de `minimatch` |
| `@eslint/eslintrc` | 3.3.7 | Moderada | `eslint` | `0.0.1 || >=0.1.1`; aviso transitivo de `minimatch` |
| `@next/eslint-plugin-next` | 16.4.4 | Moderada | `eslint-config-next` | `>=16.3.0-canary.0`; aviso transitivo de `@eslint-community/eslint-utils` |
| `@shadcn/registry` | 0.2.1 | Baja | `shadcn` | `<=0.0.0-rc-20261007105214 || >=0.1.0`; aviso de `deepmerge` |
| `@ts-morph/common` | 0.27.0 | Moderada | `shadcn` | `>=0.9.0`; aviso transitivo de `minimatch` |
| `@typescript-eslint/eslint-plugin` | 8.72.1 | Moderada | `eslint-config-next` | `*`; cadena de ESLint/TypeScript-ESLint |
| `@typescript-eslint/parser` | 8.72.1 | Moderada | `eslint-config-next` | `*`; cadena de ESLint/TypeScript-ESLint |
| `@typescript-eslint/type-utils` | 8.72.1 | Moderada | `eslint-config-next` | `>=5.62.1-alpha.0`; cadena de TypeScript-ESLint |
| `@typescript-eslint/typescript-estree` | 8.72.1 | Moderada | `eslint-config-next` | `>=6.16.0`; aviso transitivo de `minimatch` |
| `@typescript-eslint/utils` | 8.72.1 | Moderada | `eslint-config-next` | `*`; cadena de ESLint/TypeScript-ESLint |
| `deepmerge` | 4.3.1 | Baja | `shadcn` | `>=4.2.0`; riesgo de contaminación de prototipos en objetos devueltos |
| `drizzle-kit` | 0.31.11 | Moderada | Directa | `0.19.0 - 1.0.0-beta.1-fd8bfcc`; cadena de `@esbuild-kit/esm-loader` |
| `esbuild` | 0.18.20 | Moderada | `drizzle-kit` | `<=0.24.2`; aviso relacionado con el servidor de desarrollo de esbuild |
| `eslint` | 9.39.5 | Moderada | Directa | `0.7.1 - 2.0.0-rc.1 || >=4.1.0`; avisos transitivos de utilidades y `minimatch` |
| `eslint-config-next` | 16.4.4 | Moderada | Directa | `>=10.2.1-canary.2`; cadena de plugins ESLint |
| `eslint-plugin-import` | 2.32.0 | Moderada | `eslint-config-next` | `>=1.15.0`; aviso transitivo de `minimatch` |
| `eslint-plugin-jsx-a11y` | 6.10.2 | Moderada | `eslint-config-next` | `>=6.5.0`; aviso transitivo de `minimatch` |
| `eslint-plugin-react` | 7.37.5 | Moderada | `eslint-config-next` | `>=7.23.0`; aviso transitivo de `minimatch` |
| `minimatch` | 10.2.6 | Moderada | ESLint / TypeScript-ESLint / `shadcn` | `<11.0.1`; riesgo de denegación de servicio en patrones glob |
| `shadcn` | 4.23.0 | Moderada | Directa, solo desarrollo | `<=0.0.0-rc-20261007105214 || >=2.0.0`; cadena de registro, `deepmerge` y `ts-morph` |
| `ts-morph` | 26.0.0 | Moderada | `shadcn` | `>=10.0.2`; cadena de `@ts-morph/common` |
| `typescript-eslint` | 8.72.1 | Moderada | `eslint-config-next` | `*`; cadena de TypeScript-ESLint y ESLint |

## Remediación y decisión

- `shadcn` no tiene importaciones de runtime y se movió a `devDependencies`; así se eliminó de la superficie productiva. Su aviso permanece en la auditoría completa.
- No se añadió un `overrides` global para `minimatch`/`esbuild`, ni se actualizaron masivamente ESLint, `eslint-config-next` o Drizzle Kit: las propuestas de npm disponibles incluyen downgrades o cambios mayores incompatibles con la configuración vigente de Next.js 16 y las herramientas actuales.
- Para `shadcn`, npm también sugiere `shadcn@1.0.0`, un cambio mayor hacia atrás respecto a la versión instalada. No se aplicó.
- Para `drizzle-kit`, npm sugiere `0.18.1`, anterior a la versión instalada. No se aplicó.
- Para ESLint, npm sugiere ESLint 4 o una versión incompatible/anterior de `eslint-config-next`. No se aplicó.
- No se usó `npm audit fix --force`. Se recomienda reevaluar los avisos de desarrollo cuando existan versiones corregidas compatibles; antes de una actualización se deben ejecutar lint, TypeScript y build.

Este resultado no acredita que el código del proyecto esté libre de vulnerabilidades ni sustituye una revisión de seguridad. Solo describe los avisos del árbol de dependencias al realizar esta auditoría.
