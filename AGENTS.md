# AGENTS.md

Este archivo lo lee cualquier agente que trabaje en este repo. Contiene el contexto general
del proyecto.

## Contexto del proyecto

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
- Tests: no hay suite configurada. No asumir tareas que dependan de "correr los tests".
