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
`index.css` declara `@custom-variant dark (&:where(.dark, .dark *));` para que el variant `dark:`
de Tailwind v4 reaccione a esa clase (por defecto v4 solo mira `prefers-color-scheme`, no la
clase manual) — cualquier uso de `dark:` en el repo depende de esa declaración.

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
- Breakpoints: además de los de Tailwind (`sm`/`md`/`lg`...), `index.css` define uno propio,
  `--breakpoint-xs: 25rem` (400px), dentro del bloque `@theme` — para el fallback de iconos del
  `Navbar` en pantallas muy estrechas. Usar `xs:`/`max-xs:` si se necesita otro punto de corte por
  debajo de `sm` en el futuro, en vez de valores arbitrarios sueltos.

## Componentes base (`src/components/ui/`)

- **`Button`**: variantes `default | destructive | outline | secondary | ghost | link`, tamaños
  `default | sm | lg | icon`, soporta `asChild` para renderizar como `<a>` conservando el
  estilo. Antes de crear un botón custom, comprobar si una variante/tamaño ya cubre el caso.
- **`Navbar`**: pill flotante centrada (`fixed top-6 left-1/2 -translate-x-1/2`, `rounded-full`,
  `bg-background/70 backdrop-blur-md`), enlaces por ancla (`#inicio`, `#sobre-mi`, `#proyectos`,
  `#contacto`), separador vertical (`w-px h-4 bg-foreground/10`) antes del toggle de tema. Bordes
  y separadores usan siempre `border-foreground/10` / `bg-foreground/10` (nunca `gray-*`
  hardcodeado) para que el modo oscuro funcione automáticamente. El link de la sección activa
  (detectada por scroll-spy con `IntersectionObserver`, línea central del viewport) se marca con
  una cápsula que se desliza entre links vía `layoutId` compartido de Framer Motion — no un cambio
  de color de fondo por variante de `Button`. Ver "Cápsula deslizante" en Movimiento, más abajo. El
  icono Sun/Moon del toggle transiciona con `AnimatePresence` (scale + rotate + opacity, 300ms) en
  vez de cambiar de golpe. Los botones del navbar fuerzan `!rounded-full` (important modifier) en
  vez de `rounded-full` a secas: el `Button` base trae `rounded-md` tanto en `baseButtonClass` como
  en `sizeClasses`, y por cómo Tailwind v4 ordena las reglas en la hoja compilada, `rounded-md`
  puede ganar la cascada aunque `rounded-full` aparezca después en el `className` — no fiarse del
  orden de las clases para resolver conflictos de la misma propiedad, usar `!important` cuando haga
  falta forzarlo. Por debajo de 400px de viewport (breakpoint `xs`, ver Espaciado/Tipografía y
  `index.css`), cada link cambia su texto por un icono de `lucide-react` (`Home`, `User`,
  `Briefcase`, `Mail`) para que la píldora quepa en móviles estrechos sin desbordar ni requerir
  scroll — el `<a>` lleva `aria-label` con el nombre de la sección y el icono `aria-hidden="true"`
  para que el nombre accesible no dependa de qué variante visual esté activa.
- **`ProjectModal`**: overlay + panel a pantalla completa en mobile / con márgenes en desktop
  (`fixed inset-0 md:inset-10`), estructura de secciones fija (Hero → Reto → Arquitectura → Stack
  → Decisiones → Galería → Métricas → footer de cierre), cada sección nueva de un proyecto debe
  seguir ese mismo orden y las mismas clases de "eyebrow" (`text-sm font-bold uppercase
  tracking-widest text-foreground/40`).
- **`Marquee`**: loop infinito horizontal con degradado de fade en los bordes
  (`bg-gradient-to-r/l from-background to-transparent`), lista de tecnologías duplicada `[...items, ...items]`
  para el loop, íconos vía CDN de Simple Icons con `/currentColor` para heredar el tema.
- **`Experience`** (línea de tiempo tipo grafo, sección "Experiencia"): el tronco se construye por
  **filas flex**, no por posicionamiento absoluto — cada fila (`TimelineRow`) es `flex gap-4
  md:gap-6` con un "carril" de ancho fijo (`w-6 shrink-0`) que contiene el punto (`w-3 h-3
  rounded-full bg-foreground border-2 border-background`) y una línea (`flex-1 w-px
  bg-foreground/15`) que se estira sola para llenar la altura de la fila gracias al stretch por
  defecto de flexbox — nunca medir alturas por JS para las líneas rectas. **Regla del carril:
  punto y línea van siempre en secuencia dentro del mismo `flex flex-col` (punto → línea, o línea →
  punto), nunca superpuestos vía `position: absolute`** — así una línea nunca atraviesa un punto.

  **La tarjeta y su punto reaccionan juntos**: `TimelineRow` guarda un `isActive` local
  (`onMouseEnter`/`onMouseLeave` sobre toda la fila) y anima el punto con Framer Motion
  (`motion.span`, `animate={{ scale: isActive ? 1.5 : 1 }}`) más un `ring-4 ring-foreground/15`
  condicional — pasar el ratón por la tarjeta resalta su nodo en la línea de tiempo, en vez de
  vivir como dos representaciones sin relación del mismo hito. Como el `scale` es un transform (no
  cambia el box-model), no dispara el `ResizeObserver` de `useLinkPath` — las curvas de
  bifurcación/fusión no "tiemblan" cuando su punto de destino crece al hover.

  El hover no existe en móvil — para que la sección tenga presencia también ahí, el grafo se
  "construye solo" al entrar en pantalla, con animaciones disparadas **una vez por scroll y
  reproducidas en un tiempo fijo** (nunca ligadas al progreso continuo del scroll, que sí exigiría
  alargar la sección para notarse).

  **Toda la entrada es una única coreografía, no reveals independientes.** Un solo
  `onViewportEnter` vive en el contenedor `graphRef` (`viewport={{once:true, amount:0}}`, dispara
  en cuanto el grafo asoma, sin exigir que ya sea mayormente visible) y controla un `hasEntered`
  en `Experience`, pasado como prop a cada fila/curva/punto — nada decide por sí solo cuándo
  aparece. El guion vive en una constante `TIMELINE` con los delays de cada paso, en segundos,
  pensados como una historia: tronco (`finCarrera:0`, `hanami8:0.2`) → pausa → se traza la
  bifurcación (`forkCurve:0.65`) → aparece la tarjeta de la rama (`colaborativos:1.05`) → se traza
  la fusión (`mergeCurve:1.55`) → punto "Hoy" (`hoy:1.9`). Cambiar el ritmo de la secuencia es
  cambiar esos números, no reescribir la lógica de disparo. Dentro de cada fila, el punto nace
  `DOT_LEAD` (0.1s) **antes** que su tarjeta — "el hito ocurre, y luego se despliega la
  tarjeta" — en vez de que ambos aparezcan en el mismo instante.

  La entrada usa siempre un tween suave (`duration:0.4–0.6, ease:"easeOut"`), nunca spring. El
  **spring** (`stiffness:300 damping:20`) se reserva exclusivamente para el hover posterior (una
  interacción "viva" en tiempo real, donde el rebote sí tiene sentido) — `TimelineRow` alterna la
  `transition` del punto entre tween (antes de que `onAnimationComplete` marque la entrada como
  terminada, vía un `useRef` que no dispara re-render) y spring (después), para que ambas fases
  usen la física que les corresponde sin mezclarse. Las curvas de `Connector` animan `pathLength`
  de `0` a `1` (`duration:0.5, ease:"easeInOut"`) con el mismo patrón `animate` + `delay` del
  guion, no su propio `whileInView`.

  Un primer intento dejaba que cada `TimelineRow` decidiera su propio momento de entrada con un
  `onViewportEnter` independiente (`viewport={{once:true, amount:0.4}}`) — funcionaba, pero se
  sentía como reveals sueltos según por dónde cruzaba el scroll, no como una secuencia con
  intención. Mover el disparador a un único punto y el ritmo a una tabla de tiempos es lo que le da
  la sensación de estar "trabajado": la coreografía es la misma la primera vez que se ve la
  sección, sin depender de la velocidad de scroll del usuario.

  **Nunca `transition-all` (ni `transition-opacity`/`transition-transform`) en un elemento que
  Framer Motion también anima.** La tarjeta llevaba `transition-all duration-300` (pensado solo
  para el hover de sombra/borde) — pero como Framer Motion escribe `opacity`/`transform` por JS en
  el mismo elemento, la transición CSS intentaba re-interpolar esos mismos cambios con su propia
  duración y easing, en paralelo a la animación de Framer Motion. El resultado era exactamente
  "sube suave y luego un salto brusco al final": dos motores de animación distintos peleando por
  las mismas propiedades, no un problema de spring/tween como se pensó al principio. Arreglado
  acotando la transición CSS a las propiedades que de verdad la necesitan
  (`transition-[box-shadow,border-color]`). Regla general: si un elemento tiene `animate`/
  `whileInView` de Framer Motion sobre `opacity`, `x`/`y` o `scale`, su `className` no debe incluir
  `transition-all` — listar explícitamente solo las propiedades CSS que sí quieres que transicione
  por CSS (color, sombra, borde...).

  (Un primer intento posicionaba el punto final "Hoy" con `absolute bottom-0` sobre una línea
  `absolute top-0 bottom-0` que ocupaba todo el alto, confiando en que el relleno `bg-background`
  del punto tapara el tramo de línea por detrás; se descartó porque la línea sí llegaba a atravesar
  visualmente el punto — la solución robusta es que compartan el mismo flujo secuencial, igual que
  en `TimelineRow`.)

  El grafo bifurca y luego **fusiona**: el tronco sigue recto desde "Becario en Hanami8" hasta un
  único punto final compartido ("Hoy"); la rama ("Codesarrollo...") se separa con una curva y,
  tras su tarjeta, otra curva la reconecta con ese mismo punto — como un fork y un merge. Ambas
  curvas usan exactamente la misma construcción (mismo componente `Connector`, mismo
  `CURVE_STRENGTH`), así que comparten forma; solo cambian sus dos puntos de referencia. (Antes de
  fusionar en un único punto se probó con dos finales "Presente" independientes, uno por hilo — se
  descartó: si cada uno vive en su propia rama del layout, terminan a alturas distintas y dos "hoy"
  descolocados entre sí no se leen como el mismo instante.)

  Cada curva **se mide de verdad**, con el hook `src/hooks/useLinkPath.ts`: toma dos refs (origen y
  destino) más el ref de un contenedor `relative` común (`graphRef`, compartido por las dos
  curvas), mide sus posiciones reales con `getBoundingClientRect()` dentro de un `ResizeObserver`
  (recalcula ante cualquier reflow — texto que envuelve distinto, cambio de breakpoint, resize de
  ventana — sin código responsive a medida) y construye el `path` **a mano** con una curva Bézier
  cúbica de fuerza vertical fija (`CURVE_STRENGTH`, actualmente 32px) — se probó primero con
  `linkVertical` de `d3-shape` (descartado y desinstalado), pero ese generador calcula el "bump"
  proporcional a la distancia total entre los puntos, y aquí el salto horizontal es mucho mayor que
  el vertical, así que la curva salía casi plana; con una fuerza fija en vez de proporcional se
  consigue el "swoosh" suave sin depender de una librería — por eso cada curva necesita también un
  poco de recorrido vertical real cerca de sus dos extremos (`pt-8` al empezar la rama; un `<div
  className="h-16" />` de aire al terminarla, **antes de este valor había un `h-8` = 32px que
  coincidía exactamente con `CURVE_STRENGTH`, un caso degenerado en el que los puntos de control
  quedan uno encima del otro y la curva sale casi plana — la distancia entre origen y destino debe
  quedar claramente por encima de `CURVE_STRENGTH`, no igualarla**) en vez de que origen y destino
  queden casi a la misma altura. El origen de la curva de bifurcación (`forkPointRef`) es un ancla
  invisible (`w-px h-0`) colocada en el carril del tronco **después** de la tarjeta de "Becario en
  Hanami8" (no en su punto) — anclarla en el punto de Hanami8 hacía que la curva cruzara por encima
  de esa tarjeta al recorrer su rango vertical completo antes de girar hacia la rama.

  El *destino* de una curva casi siempre es el centro de un punto real (un nodo, no un ancla
  invisible) — sin recortarlo, el trazo terminaría dentro del círculo en vez de detenerse justo
  antes de tocarlo. `useLinkPath` resta un margen fijo (`TARGET_MARGIN`, 9px) a la coordenada Y del
  destino, acercando el final del trazo al origen; como en este grafo el destino siempre queda por
  debajo del origen, restar el margen equivale a "parar un poco antes de llegar". El componente
  `Connector` solo dibuja `<path d={path} className="stroke-foreground/15" strokeWidth="1" .../>`
  sobre un `<svg className="absolute inset-0 ...">` — **mismo color y grosor que las líneas rectas
  del tronco** (`bg-foreground/15`, 1px), nunca un estilo distinto para una curva; y nunca
  coordenadas fijas a mano para la *posición* (solo `CURVE_STRENGTH` y `TARGET_MARGIN` son
  constantes ajustadas a ojo). Los intentos anteriores de conector (SVG con `viewBox` fijo, corner
  en L, `linkVertical` de `d3-shape`) se descartaron por, respectivamente: no seguir la posición
  real de las tarjetas, no gustar visualmente, y salir demasiado plana para este aspect ratio.
  Cualquier otro conector entre dos elementos del layout debería reusar `useLinkPath` en vez de
  volver a codificar coordenadas.

  Las tarjetas siguen un lenguaje tipo **"ficha de base de datos" de Notion**: icono de tipo +
  título, una fila de "propiedad" (fecha, con icono) y descripción tras un separador sutil —
  `rounded-xl bg-background border border-foreground/10 shadow-sm` (tarjeta clara con sombra
  suave, no `bg-secondary` teñido) que gana `hover:shadow-md hover:border-foreground/20` al pasar
  el ratón. De arriba abajo:

  1. **Icono de tipo + título**: un icono de `lucide-react` distinto por hito
     (`ITEM_ICON`, mapeado por `item.id`: `GraduationCap`/`Building2`/`Users`) dentro de una
     insignia pequeña (`h-7 w-7 rounded-md bg-secondary/50`), como el icono de página de una
     entrada de Notion, seguido del título en `font-bold text-base`.
  2. **Fila de propiedad** (fecha): icono `Calendar` (`h-3.5 w-3.5`) + el período en
     `text-sm`, todo en `text-foreground/50` — exactamente el patrón de Notion de "icono gris
     pequeño + valor" para una propiedad de base de datos. Deliberadamente **no** se añadió una
     segunda propiedad de "estado" (Cerrado/Activo): ese dato ya lo transmite el punto del grafo
     (relleno vs. hueco) y repetirlo como texto sería redundante.
  3. **Descripción**: tras un separador sutil (`mt-3 pt-3 border-t border-foreground/5`),
     `text-sm text-foreground/60 leading-relaxed`.

  Se descartaron dos intentos previos antes de llegar aquí: una banda de cabecera en color
  invertido (`bg-foreground` sólido) con perforación de "ticket físico" — se sentía como un bloque
  de alerta/notificación, chocaba con el "nunca color sólido, todo por opacidad" del resto del
  sitio; y antes de eso, un código de barras decorativo al pie, puro relleno ornamental sin aportar
  estructura. La lección: cualquier detalle nuevo para esta sección debe construirse con los
  mismos recursos que ya usa el sitio (iconos `lucide-react`, opacidad sobre `foreground`, sombra
  suave) en vez de introducir metáforas de objetos físicos (ticket, sello, terminal) que no
  aparecen en ningún otro sitio del portfolio. No siguen el patrón de tarjeta grande de `Projects`
  a propósito — son mucho más compactas.

  El punto "Hoy" es **hueco** (`border-2 border-foreground bg-background`, sin relleno) — mismo
  tamaño que los nodos cerrados, el lenguaje visual es "relleno = evento cerrado, hueco = punto
  donde el hilo sigue hoy", sin color ni animación fuera de la paleta (se descartó un primer
  intento que reutilizaba el punto pulsante "Disponible" de `Contact.tsx` en emerald, por quedar
  fuera de la paleta monocroma). El texto de cada nodo es siempre cronología en lenguaje llano — la
  metáfora de grafo de git es solo visual, nunca aparece como palabra ("branch", "commit", "merge",
  etc.) en el copy.

## Movimiento (Framer Motion)

Patrones consistentes a reutilizar — no inventar timings nuevos sin motivo:

- **Scroll reveal** (secciones/tarjetas que aparecen al hacer scroll): `initial={{ opacity: 0, y: 20 }}`
  → `whileInView={{ opacity: 1, y: 0 }}`, `viewport={{ once: true }}`, `duration: 0.8`. En listas
  (ej. grid de proyectos), stagger con `delay: index * 0.1`.
- **Modal/overlay:** `AnimatePresence` + overlay con fade simple (`opacity 0→1`), panel con
  `opacity/y/scale` y transición `type: "spring", damping: 25, stiffness: 200`.
- **Cápsula deslizante (`Navbar`):** indicador de estado activo que se mueve entre elementos
  hermanos compartiendo `layoutId` (shared layout animation), en vez de `AnimatePresence`. Cada
  elemento seleccionable monta un `motion.span layoutId="navbar-active-pill"` (mismo `layoutId` en
  todos) `absolute inset-0 -z-10 rounded-full bg-secondary shadow-sm shadow-black/10`, con
  `transition={{ type: "spring", damping: 25, stiffness: 200 }}` (mismo spring que modal/overlay).
  El relleno usa `bg-secondary` (no `bg-background`) a propósito: en modo oscuro `--bg` y `--secondary`
  son casi indistinguibles del fondo si se usa `background`, así que la cápsula necesita el token de
  "superficie elevada" para notarse en ambos temas. El elemento contenedor necesita `relative` y el
  contenido (icono/texto) `relative z-10` para quedar por encima de la cápsula. Patrón a reutilizar
  para cualquier futuro selector tipo tabs/segmented control — no repetir el approach de "bloque de
  color sólido por variante" que se descartó aquí.
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
