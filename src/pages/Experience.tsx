import { useRef, useState, type RefObject } from "react"
import { motion } from "framer-motion"
import { Calendar, GraduationCap, Building2, Users, Briefcase } from "lucide-react"
import { EXPERIENCE } from "../data/experience"
import type { ExperienceItem } from "../types/experience"
import { useLinkPath } from "../hooks/useLinkPath"

// Punto hueco: mismo tamaño que los nodos cerrados (bg-foreground), pero sin rellenar — el
// lenguaje visual del grafo es "relleno = evento cerrado, hueco = punto donde el hilo sigue hoy".
const HOLLOW_DOT = "w-3 h-3 rounded-full border-2 border-foreground bg-background shrink-0"

// Icono de "página" por tipo de hito — un guiño al icono de página de Notion, no decoración suelta.
const ITEM_ICON: Record<string, typeof GraduationCap> = {
    "fin-carrera": GraduationCap,
    hanami8: Building2,
    eturia: Briefcase,
    colaborativos: Users,
}

// Guion de tiempos del grafo (en segundos, relativos al instante en que entra en pantalla).
// Un único disparador arranca esta secuencia entera — no son reveals independientes por scroll,
// es una coreografía: primero el tronco, una pausa antes de que se trace la bifurcación (para que
// se lea como una decisión, no como algo simultáneo), la tarjeta de la rama, la fusión, y por
// último el punto "Hoy". El punto de cada fila nace un pelín antes que su tarjeta (DOT_LEAD) —
// "el hito ocurre, y luego se despliega la tarjeta", no los dos a la vez.
const DOT_LEAD = 0.1
const TIMELINE = {
    finCarrera: 0,
    hanami8: 0.2,
    forkCurve: 0.65,
    colaborativos: 1.05,
    mergeCurve: 1.55,
    eturia: 1.8,
    hoy: 2.2,
}

// Cada carril vertical se traza (scaleY 0 → 1) igual que las curvas, en vez de estar ya pintado
// de fondo: arranca justo cuando nace el punto de origen y, en condiciones normales, termina justo
// cuando aparece el punto (o la curva) al que llega. Cuando ese hueco es muy corto (p. ej. entre
// finCarrera y hanami8, separados solo 0.1s) se fuerza una duración mínima para que el trazo siga
// siendo legible — puede terminar de dibujarse un pelín después de que el siguiente punto ya haya
// aparecido, y no se nota.
const MIN_LINE_DURATION = 0.35
const LINE = {
    finCarrera: { delay: 0, duration: Math.max(TIMELINE.hanami8 - DOT_LEAD, MIN_LINE_DURATION) },
    hanami8: {
        delay: Math.max(TIMELINE.hanami8 - DOT_LEAD, 0),
        duration: Math.max(TIMELINE.forkCurve - Math.max(TIMELINE.hanami8 - DOT_LEAD, 0), MIN_LINE_DURATION),
    },
    // Tramo del tronco dentro del bloque de bifurcación: va desde el punto donde nace la rama
    // hasta donde arranca la fila de Eturia (ya fuera de ese bloque, en flujo normal).
    trunk: { delay: TIMELINE.forkCurve, duration: Math.max(TIMELINE.eturia - TIMELINE.forkCurve, MIN_LINE_DURATION) },
    colaborativos: {
        delay: Math.max(TIMELINE.colaborativos - DOT_LEAD, 0),
        duration: Math.max(
            TIMELINE.mergeCurve - Math.max(TIMELINE.colaborativos - DOT_LEAD, 0),
            MIN_LINE_DURATION,
        ),
    },
    // Línea de la propia fila de Eturia, que conecta su punto con el punto final "Hoy".
    eturia: {
        delay: Math.max(TIMELINE.eturia - DOT_LEAD, 0),
        duration: Math.max(TIMELINE.hoy - Math.max(TIMELINE.eturia - DOT_LEAD, 0), MIN_LINE_DURATION),
    },
}

// Tarjeta con filas de "propiedades" al estilo tarjeta de base de datos de Notion: icono de tipo +
// título, una propiedad (fecha, con icono) y descripción tras un separador sutil. Tarjeta clara
// con sombra suave en vez de fondo teñido — el detalle está en la estructura, no en un elemento
// físico (nada de perforaciones, bandas sólidas ni monospace).
function TimelineCard({
    item,
    hasEntered,
    delay,
}: {
    item: ExperienceItem
    hasEntered: boolean
    delay: number
}) {
    const Icon = ITEM_ICON[item.id] ?? GraduationCap
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: "easeOut", delay }}
            className="rounded-xl bg-background border border-foreground/10 shadow-sm hover:shadow-md hover:border-foreground/20 transition-[box-shadow,border-color] duration-300 p-4"
        >
            <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-secondary/50">
                    <Icon className="h-4 w-4 text-foreground/70" />
                </div>
                <h4 className="font-bold font-display tracking-[-0.01em] text-base">{item.title}</h4>
            </div>

            <div className="mt-3 flex items-center gap-1.5 text-foreground/50">
                <Calendar className="h-3.5 w-3.5" />
                <span className="text-sm">{item.period}</span>
            </div>

            <p className="mt-3 pt-3 border-t border-foreground/5 text-sm text-foreground/60 leading-relaxed">
                {item.description}
            </p>
        </motion.div>
    )
}

// Fila de línea de tiempo: carril (punto + línea que se estira sola vía flex) + tarjeta.
// `dotRef` permite anclar el punto como origen/destino de un conector medido (ver useLinkPath).
//
// `hasEntered`/`delay` llegan desde `Experience`, que orquesta TODA la secuencia con un único
// disparador (ver `TIMELINE`) — la fila ya no decide por sí sola cuándo aparece. La entrada usa un
// tween suave (`easeOut`), igual que la tarjeta; el muelle (spring, con rebote) se reserva para el
// hover posterior, que sí es una interacción "viva" en tiempo real.
function TimelineRow({
    item,
    hasEntered,
    delay,
    dotRef,
    lineDelay,
    lineDuration,
}: {
    item: ExperienceItem
    hasEntered: boolean
    delay: number
    dotRef?: RefObject<HTMLSpanElement | null>
    lineDelay: number
    lineDuration: number
}) {
    const [isActive, setIsActive] = useState(false)
    const [enterTransitionDone, setEnterTransitionDone] = useState(false)

    return (
        <div
            className="flex gap-4 md:gap-6"
            onMouseEnter={() => setIsActive(true)}
            onMouseLeave={() => setIsActive(false)}
        >
            <div className="flex flex-col items-center w-6 shrink-0">
                <motion.span
                    ref={dotRef}
                    initial={{ scale: 0 }}
                    animate={{ scale: !hasEntered ? 0 : isActive ? 1.5 : 1 }}
                    transition={
                        enterTransitionDone
                            ? { type: "spring", stiffness: 300, damping: 20 }
                            : { duration: 0.4, ease: "easeOut", delay: Math.max(delay - DOT_LEAD, 0) }
                    }
                    onAnimationComplete={() => {
                        setEnterTransitionDone(true)
                    }}
                    className={`mt-2 h-3 w-3 shrink-0 rounded-full bg-foreground border-2 border-background ${isActive ? "ring-4 ring-foreground/15" : ""}`}
                />
                <motion.span
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: hasEntered ? 1 : 0 }}
                    style={{ transformOrigin: "top" }}
                    transition={{ duration: lineDuration, ease: "easeInOut", delay: lineDelay }}
                    className="flex-1 w-px bg-foreground/15 my-1"
                />
            </div>
            <div className="flex-1 pb-8">
                <TimelineCard item={item} hasEntered={hasEntered} delay={delay} />
            </div>
        </div>
    )
}

// La curva se traza (no aparece de golpe) como un paso más del guion — `hasEntered` + `delay`
// llegan de `Experience`, igual que en `TimelineRow`, para que forme parte de la misma coreografía.
function Connector({ path, hasEntered, delay }: { path: string | null; hasEntered: boolean; delay: number }) {
    if (!path) return null
    return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
            <motion.path
                d={path}
                className="stroke-foreground/15"
                strokeWidth="1"
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: hasEntered ? 1 : 0 }}
                transition={{ duration: 0.5, ease: "easeInOut", delay }}
            />
        </svg>
    )
}

export default function Experience() {
    const finCarrera = EXPERIENCE.find((item) => item.id === "fin-carrera")!
    const hanami8 = EXPERIENCE.find((item) => item.id === "hanami8")!
    const eturia = EXPERIENCE.find((item) => item.id === "eturia")!
    const colaborativos = EXPERIENCE.find((item) => item.id === "colaborativos")!

    const graphRef = useRef<HTMLDivElement>(null)
    const [hasEntered, setHasEntered] = useState(false)

    // Curva de bifurcación: del punto donde el tronco se separa hasta el primer punto de la rama.
    const forkPointRef = useRef<HTMLSpanElement>(null)
    const branchDotRef = useRef<HTMLSpanElement>(null)
    const forkPath = useLinkPath(graphRef, forkPointRef, branchDotRef)

    // Curva de fusión: del final de la rama de vuelta al punto donde el tronco retoma con Eturia.
    const branchEndRef = useRef<HTMLSpanElement>(null)
    const eturiaDotRef = useRef<HTMLSpanElement>(null)
    const mergePath = useLinkPath(graphRef, branchEndRef, eturiaDotRef)
    const hoyDotRef = useRef<HTMLSpanElement>(null)

    return (
        <section className="w-full max-w-6xl px-6 py-24">
            <div className="flex flex-col gap-12">
                <div className="flex flex-col gap-4">
                    <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-foreground/40">
                        Experiencia
                    </h2>
                    <h3 className="text-3xl md:text-5xl font-bold font-display tracking-tight text-balance">
                        Un vistazo a mi trayectoria
                    </h3>
                </div>

                <motion.div
                    ref={graphRef}
                    onViewportEnter={() => setHasEntered(true)}
                    viewport={{ once: true, amount: 0 }}
                    className="relative flex flex-col w-full max-w-2xl"
                >
                    <Connector path={forkPath} hasEntered={hasEntered} delay={TIMELINE.forkCurve} />
                    <Connector path={mergePath} hasEntered={hasEntered} delay={TIMELINE.mergeCurve} />

                    <TimelineRow
                        item={finCarrera}
                        hasEntered={hasEntered}
                        delay={TIMELINE.finCarrera}
                        lineDelay={LINE.finCarrera.delay}
                        lineDuration={LINE.finCarrera.duration}
                    />
                    <TimelineRow
                        item={hanami8}
                        hasEntered={hasEntered}
                        delay={TIMELINE.hanami8}
                        lineDelay={LINE.hanami8.delay}
                        lineDuration={LINE.hanami8.duration}
                    />

                    {/* Bloque de bifurcación: el tronco sigue recto hasta donde retoma con la fila
                        de Eturia, justo debajo de este bloque; la rama fluye en normal flow a la
                        derecha y su propia curva de fusión (mergePath) la reconecta con el punto de
                        esa fila. El alto de este bloque lo marca la rama — el tronco se estira para
                        llegar abajo. El carril del tronco es un flex-col (línea `flex-1` + punto al
                        final), igual que en TimelineRow. */}
                    <div className="relative">
                        <div className="absolute left-0 top-0 bottom-0 w-6 flex flex-col items-center">
                            <span ref={forkPointRef} className="w-px h-0" />
                            <motion.span
                                initial={{ scaleY: 0 }}
                                animate={{ scaleY: hasEntered ? 1 : 0 }}
                                style={{ transformOrigin: "top" }}
                                transition={{ duration: LINE.trunk.duration, ease: "easeInOut", delay: LINE.trunk.delay }}
                                className="flex-1 w-px bg-foreground/15 my-1"
                            />
                        </div>

                        <div className="pl-10 md:pl-12 pt-8">
                            <TimelineRow
                                item={colaborativos}
                                hasEntered={hasEntered}
                                delay={TIMELINE.colaborativos}
                                dotRef={branchDotRef}
                                lineDelay={LINE.colaborativos.delay}
                                lineDuration={LINE.colaborativos.duration}
                            />
                            <div className="flex w-6 justify-center">
                                <span ref={branchEndRef} className="w-px h-0" />
                            </div>
                            <div className="h-16" />
                        </div>
                    </div>

                    {/* El tronco retoma aquí, ya fusionado con la rama de colaborativos (el punto
                        de esta fila es el destino de mergePath), y sigue hasta el punto "Hoy". */}
                    <TimelineRow
                        item={eturia}
                        hasEntered={hasEntered}
                        delay={TIMELINE.eturia}
                        dotRef={eturiaDotRef}
                        lineDelay={LINE.eturia.delay}
                        lineDuration={LINE.eturia.duration}
                    />

                    {/* Punto final "Hoy": hueco y con pulso, dice "el hilo sigue hoy". */}
                    <div className="flex items-center gap-4 md:gap-6">
                        <div className="flex w-6 shrink-0 items-center justify-center">
                            <span className="relative flex h-3 w-3 shrink-0 items-center justify-center">
                                <motion.span
                                    aria-hidden="true"
                                    className="absolute inline-flex h-full w-full rounded-full border-2 border-foreground/30"
                                    initial={{ opacity: 0, scale: 1 }}
                                    animate={
                                        hasEntered
                                            ? { opacity: [0.6, 0], scale: [1, 2.2] }
                                            : { opacity: 0, scale: 1 }
                                    }
                                    transition={{
                                        duration: 1.8,
                                        ease: "easeOut",
                                        repeat: Infinity,
                                        repeatDelay: 0.6,
                                        delay: TIMELINE.hoy + 0.4,
                                    }}
                                />
                                <motion.span
                                    ref={hoyDotRef}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: hasEntered ? 1 : 0 }}
                                    transition={{ duration: 0.4, ease: "easeOut", delay: TIMELINE.hoy }}
                                    className={HOLLOW_DOT}
                                />
                            </span>
                        </div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-foreground/40">
                            Hoy
                        </span>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
