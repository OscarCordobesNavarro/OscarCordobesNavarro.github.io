# DESIGN.md

Lenguaje de diseño del portfolio. Este documento describe **lo que ya existe implementado**
(extraído de `src/index.css` y los componentes reales), no un ideal aspiracional. Sirve para que
cualquiera que toque UI — humano, Claude u OpenCode — mantenga la coherencia visual en vez de
reinventar patrones. Si cambiás el diseño en el código, actualizá este archivo en el mismo PR:
un documento de diseño desactualizado es peor que no tenerlo.

## Principios

- **Monocromo + acento cero.** No hay color de marca. Todo el sistema es escala de grises
  (`--fg`/`--bg`/`--primary`/`--secondary`/`--accent`, todos negros/blancos/grises). El color
  puntual (emerald para "disponible", rojo/azul/etc. en las tarjetas de decisiones técnicas) se
  reserva para señalizar estado o categorizar contenido dinámico — nunca para decoración.
- **Fotografía en escala de grises.** Todas las fotos personales (`grayscale`, a veces
  `contrast`) refuerzan el monocromo; las imágenes de proyecto siguen el mismo patrón y solo
  recuperan color al hacer hover (`grayscale group-hover:grayscale-0`), como micro-recompensa de
  interacción.
- **Blanco de sobra.** Secciones a `min-h-screen`, paddings generosos (`py-20`/`py-24`,
  `p-8 md:p-12`), `space-y-16` entre bloques dentro del modal de proyecto. No comprimir contenido.
- **Todo muy redondeado.** Nada de esquinas vivas: botones `rounded-md`, pills `rounded-full`,
  tarjetas `rounded-2xl`/`rounded-3xl`/`rounded-[2.5rem]`. Es una decisión consistente, no una
  mezcla accidental de radios.
- **Jerarquía por opacidad, no por color.** Ver la escala de `foreground/N` más abajo — es el
  mecanismo principal para dar énfasis o quitarlo.

## Color

Definido como variables CSS en `src/index.css`, mapeadas a tokens de Tailwind v4 vía `@theme`.
**Nunca hardcodear un hex** para fondo/texto/borde de UI — usar las clases `bg-background`,
`text-foreground`, `bg-primary`, `bg-secondary`, `bg-accent` (y sus `-foreground` correspondientes)
para que el modo oscuro (clase `.dark` en `<html>`) funcione automáticamente.

| Token | Claro | Oscuro | Uso |
|---|---|---|---|
| `background` / `foreground` | `#ffffff` / `#0a0a0a` | `#0a0a0a` / `#fafafa` | fondo y texto base |
| `primary` / `primary-foreground` | `#000000` / `#ffffff` | `#ffffff` / `#000000` | botón `default`, CTAs |
| `secondary` / `secondary-foreground` | `#f3f4f6` / `#111827` | `#171717` / `#f5f5f5` | fondos de tarjetas, badges |
| `accent` / `accent-foreground` | `#f3f4f6` / `#171717` | `#262626` / `#f5f5f5` | hover de botones `ghost`/`outline` |

El toggle de tema (`Navbar.tsx`) agrega/quita la clase `.dark` en `document.documentElement` y
persiste la preferencia en `localStorage("theme")`, con fallback a `prefers-color-scheme`.

### Escala de opacidad sobre `foreground`

El patrón más usado del proyecto para jerarquía visual. Se aplica tanto a texto como a bordes
(`border-foreground/N`, `bg-foreground/N`):

| Opacidad | Uso típico |
|---|---|
| `/5` | bordes casi invisibles entre secciones (`border-t border-foreground/5`) |
| `/10` | bordes de tarjetas y contenedores (`border border-foreground/10`) |
| `/20`–`/30` | fondos sutiles de tarjetas (`bg-secondary/20`, `bg-foreground/5` en badges) |
| `/40` | labels/eyebrows y texto terciario (ver tipografía) |
| `/60`–`/70` | texto secundario / cuerpo de párrafo |
| `/80` | texto casi al máximo énfasis, íconos activos |

Colores de acento puntuales (solo para estado o categorización, nunca decorativos): `emerald`
para "disponible" (punto pulsante en `Contact.tsx`), y una paleta fija de 8 colores
(`red/blue/yellow/green/purple/orange/cyan/pink` + `white` como neutro) para clasificar
"Decisiones Técnicas" en `ProjectModal.tsx` — siempre como `border-{color}-500/20 bg-{color}-500/5`
con un ícono de Lucide a juego.

## Tipografía

- **Familia:** `Inter` (variable `--font-sans`, con fallback a system-ui/sans-serif).
- **Patrón "eyebrow"** (label de sección, repetido en `About`, `Contact`, `Projects`):
  `text-sm font-bold uppercase tracking-[0.2em] text-foreground/40`. Es el marcador consistente
  de "esto es un título de sección", siempre antes del heading real.
- **Headings grandes:** `font-bold tracking-tight`, tamaños responsivos agresivos
  (ej. `text-4xl md:text-6xl` en el hero del modal, `text-3xl md:text-5xl` en títulos de sección),
  casi siempre con `text-balance` para que el wrap no quede feo.
- **Cuerpo de texto:** `leading-relaxed`, color `text-foreground/60` a `/80` según énfasis, nunca
  `text-foreground` puro salvo para el texto más importante de la sección (ej. la bio en `About`).
- **Micro-labels** (tags, badges, nombres de capa en tablas): muy pequeños y muy espaciados —
  `text-[10px]` o `text-xs`, `font-bold uppercase tracking-wider` / `tracking-widest`.

## Espaciado y radios

- Secciones de página: `min-h-screen`, `px-6 py-12` a `py-24`.
- Contenedores de contenido: `max-w-4xl` (Home/About), `max-w-6xl` (Projects), `max-w-3xl`
  (Contact card).
- Radios: `rounded-md` en controles pequeños (botones), `rounded-full` en pills/avatares/nav,
  `rounded-xl`–`rounded-3xl` (incluyendo el custom `rounded-[2.5rem]` de las tarjetas de
  proyecto) en contenedores grandes. No usar `rounded-lg` sin motivo — no aparece en el código
  actual, la escala salta de `md` a `xl`+.

## Componentes base (`src/components/ui/`)

- **`Button`**: variantes `default | destructive | outline | secondary | ghost | link`, tamaños
  `default | sm | lg | icon`, soporta `asChild` para renderizar como `<a>` conservando el
  estilo. Antes de crear un botón custom, comprobar si una variante/tamaño ya cubre el caso.
- **`Navbar`**: pill flotante centrada (`fixed top-6 left-1/2 -translate-x-1/2`, `rounded-full`,
  `bg-background/70 backdrop-blur-md`), enlaces por ancla (`#sobre-mi`, `#proyectos`,
  `#contacto`), separador vertical (`w-px h-4 bg-gray-200 dark:bg-neutral-800`) antes del toggle
  de tema.
- **`ProjectModal`**: overlay + panel a pantalla completa en mobile / con márgenes en desktop
  (`fixed inset-0 md:inset-10`), estructura de secciones fija (Hero → Reto → Arquitectura → Stack
  → Decisiones → Galería → Métricas → footer de cierre), cada sección nueva de un proyecto debe
  seguir ese mismo orden y las mismas clases de "eyebrow" (`text-sm font-bold uppercase
  tracking-widest text-foreground/40`).
- **`Marquee`**: loop infinito horizontal con degradado de fade en los bordes
  (`bg-gradient-to-r/l from-background to-transparent`), lista de tecnologías duplicada `[...items, ...items]`
  para el loop, íconos vía CDN de Simple Icons con `/currentColor` para heredar el tema.

## Movimiento (Framer Motion)

Patrones consistentes a reutilizar — no inventar timings nuevos sin motivo:

- **Scroll reveal** (secciones/tarjetas que aparecen al hacer scroll): `initial={{ opacity: 0, y: 20 }}`
  → `whileInView={{ opacity: 1, y: 0 }}`, `viewport={{ once: true }}`, `duration: 0.8`. En listas
  (ej. grid de proyectos), stagger con `delay: index * 0.1`.
- **Modal/overlay:** `AnimatePresence` + overlay con fade simple (`opacity 0→1`), panel con
  `opacity/y/scale` y transición `type: "spring", damping: 25, stiffness: 200`.
- **Marquee:** animación lineal continua, `duration: 35`, `ease: "linear"`, `repeat: Infinity`.
- **Micro-interacciones puntuales:** el saludo del avatar en `About` (rotación en keyframes con
  delay tras la entrada) y el tilt 3D de la tarjeta de contacto (`useMotionValue` + `useSpring` +
  `useTransform` sobre la posición del mouse, con `translateZ` para dar profundidad) son efectos
  "firma" del sitio — no son un patrón genérico para reusar en cualquier componente, son
  deliberadamente puntuales.
- **Transiciones de color/tema:** manejadas globalmente en `index.css`
  (`transition-property: color, background-color, border-color, ...`, `300ms`,
  `cubic-bezier(0.4, 0, 0.2, 1)`) — no hace falta declarar transición de color por componente.

## Iconografía e imágenes

- Iconos de UI: `lucide-react`, tamaños en pasos de Tailwind (`w-4 h-4`, `w-5 h-5`, `w-6 h-6`).
- Logos de tecnologías: CDN de Simple Icons (`https://cdn.simpleicons.org/<slug>/currentColor`),
  con mapeo manual de slugs especiales en `TECH_SLUGS` (`Marquee.tsx`) cuando el nombre no
  coincide con el slug de Simple Icons.
- Fotos personales: siempre `filter grayscale`, formato `.webp` en `public/`.

## Fuera de alcance de este documento

No cubre contenido/copy (eso es `SITE_DATA` en `src/lib/constants.ts` y `src/data/projects/`) ni
la política de qué se delega a OpenCode (eso vive en `AGENTS.md`). Si algo acá queda obsoleto
porque el diseño evolucionó, corregilo — este archivo describe el código, no al revés.
