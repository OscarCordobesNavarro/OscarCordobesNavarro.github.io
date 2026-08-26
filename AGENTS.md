# AGENTS.md

Este archivo lo lee cualquier agente que trabaje en este repo: Claude Code (orquestador) y
OpenCode (implementador delegado vía la skill `opencode-delegate`). La sección 1 es contexto
general del proyecto — léela primero, sea cual sea el agente. La sección 2 es la política de
delegación que `opencode-delegate` consulta antes de elegir modelo y alcance de cada tarea.

## 1. Contexto del proyecto

### Qué es esto

Portfolio personal de Óscar Cordobés Navarro, publicado en GitHub Pages
(`OscarCordobesNavarro.github.io`). Sitio estático de una sola página (secciones ancladas:
Home, Sobre mí, Proyectos, Contacto), sin backend ni base de datos. El contenido "sensible"
(bio, datos de contacto, listado de proyectos) vive centralizado en código, no en un CMS.

### Stack

- **Framework:** React 19 + TypeScript, bundler Vite 7 (plugin `@vitejs/plugin-react-swc`)
- **Estilos:** Tailwind CSS v4 (config vía `@tailwindcss/vite`, sin `tailwind.config.js` clásico;
  variables de tema en `src/index.css`)
- **Animaciones:** Framer Motion
- **Iconos:** lucide-react
- **Routing:** react-router-dom está instalado pero el sitio es de una sola página con scroll a
  anclas (`#sobre-mi`, `#contacto`); no asumas rutas multi-página sin confirmarlo primero
- **Sin test runner configurado.** No hay Jest/Vitest/Playwright en el repo todavía.

### Estructura (`src/`)

```
src/
├── App.tsx              # orquesta las secciones ancladas dentro de <main>
├── main.tsx              # entry point
├── index.css              # Tailwind v4 + variables de tema (claro/oscuro)
├── components/ui/         # componentes base reutilizables (Button, Navbar, Marquee, ProjectModal...)
├── pages/                 # una "página"/sección por archivo (Home, About, Contact, Projects)
├── data/projects/         # datos de cada proyecto del portfolio, un archivo por proyecto + index.ts
├── lib/constants.ts       # SITE_DATA: nombre, bio, enlaces, info de contacto — dato maestro del sitio
└── types/                 # tipos compartidos (ej. project.ts)
```

Convenciones que ya sigue el código existente:

- Componentes en PascalCase, un componente por archivo, en `components/ui/` o `pages/` según si
  es reutilizable o es una sección de página.
- El contenido textual/estructural del sitio (nombre, bio, links, contacto) se centraliza en
  `src/lib/constants.ts` (`SITE_DATA`) — no hardcodear estos datos sueltos en componentes.
- Los datos de cada proyecto van en `src/data/projects/<Nombre>.ts` y se agregan al índice en
  `src/data/projects/index.ts`; el tipo está en `src/types/project.ts`.
- Estilado con clases Tailwind directamente en JSX; sin CSS-in-JS ni módulos `.module.css`.
- Soporte claro/oscuro vía variables de tema en `index.css` — no introducir colores hardcodeados
  que rompan el modo oscuro.

### Lenguaje de diseño

Antes de tocar cualquier UI (componentes, páginas, estilos, animaciones), leer
[`DESIGN.md`](./DESIGN.md): color, tipografía, espaciado/radios, patrones de Framer Motion e
iconografía ya establecidos. No inventar un patrón nuevo si `DESIGN.md` ya cubre el caso.

### Comandos (gates del proyecto)

- Dev server: `npm run dev`
- Lint: `npm run lint`
- Build (incluye type-check): `npm run build` — corre `tsc -b && vite build`, así que cubre
  el type-check; no existe un script de type-check aislado.
- Preview de build: `npm run preview`
- Tests: no hay suite configurada. No asumir ni delegar tareas que dependan de "correr los tests".

## 2. Política de delegación a OpenCode (vía `opencode-delegate`)

El problema que resuelve esta sección: Claude Code consume tokens de la suscripción de Claude
más rápido de lo que esa suscripción los repone. La idea es que Claude actúe como la "mente
maestra" — planifica, decide arquitectura, escribe el brief — y delegue la implementación
mecánica o de alcance acotado a OpenCode, corriendo sobre la suscripción flat-rate de OpenCode Go
(sin costo por token). Claude sigue siendo quien revisa el diff y hace el commit; nunca cede esa
responsabilidad.

### Modelos permitidos (flat-rate, sin costo por token)

> Completar con la salida real de `opencode models` / panel de suscripción.
> No usar ningún modelo fuera de esta lista sin confirmación explícita del humano
> (riesgo de facturación por token vía OpenRouter u otros proveedores metered).

- `opencode-go/deepseek-v4-flash` — uso: trabajo mecánico y de bajo riesgo (ver abajo)
- `opencode-go/minimax-m3` — uso: lógica más compleja dentro de lo delegable (ver abajo)

### Qué SÍ delegar a OpenCode

Usar `opencode-go/deepseek-v4-flash` (rápido/barato) para:
- Renombrar variables, funciones, archivos en todo el repo
- Migraciones mecánicas (ej. cambiar una librería por otra con API equivalente)
- Generar tests unitarios repetitivos para código ya diseñado y estable (una vez exista un runner de tests en el repo)
- Boilerplate: componentes/páginas repetidas, formularios repetidos, secciones con patrón ya establecido (ej. otra `ProjectModal`)
- Barridos de lint/formato/tipado que no requieren decisiones de diseño
- Actualizar documentación/comentarios en base a código ya escrito

Usar `opencode-go/minimax-m3` (más capaz, "algo de chicha") para:
- Refactors medianos con algo de ambigüedad pero alcance acotado y bien descrito
- Bugs con causa ya identificada por Claude, donde solo falta implementar el fix
- Features chicas de un solo dominio (ej. una página nueva con su ruta y componente) cuando el diseño
  ya fue decidido en la conversación con Claude y está completo en el brief

### Qué NO delegar (se queda con Claude directo)

- Diseño de arquitectura o decisiones que afectan varios módulos/dominios (estructura de `src/`, routing, estado global)
- Debugging exploratorio (causa no identificada aún)
- Cambios en contenido/datos personales sensibles del portfolio (`SITE_DATA`, textos de "about", información de contacto)
- Cualquier tarea donde el contexto acumulado de la conversación importa y no se puede
  resumir por completo en un brief autosuficiente
- Tareas chicas que Claude resuelve inline en pocos minutos (el overhead de delegar no vale la pena)

### Reglas del brief

- Un brief = una tarea. No mezclar objetivos.
- Siempre incluir: objetivo, estado actual, qué cambiar, qué NO tocar, los comandos de gates
  de la sección 1, y el contrato de reporte esperado.
- Siempre aclarar explícitamente: "No hagas commit, yo reviso y commiteo."
- Si la tarea no encaja claramente en "SÍ delegar" de arriba, preguntar al humano antes de
  despachar, no asumir.

### Revisión (recordatorio, ya lo exige la skill)

- Re-correr los gates uno mismo (`npm run lint`, `npm run build`), nunca confiar en el autoreporte de OpenCode.
- Leer el diff completo contra el brief: sin scope creep, sin faltantes.
- Commit lo hace Claude, no OpenCode.
