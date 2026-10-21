import { motion } from "framer-motion"
import { Coffee } from "lucide-react"

interface MarqueeProps {
    items: string[]
}

// Mapeo selectivo para tecnologías con nombres especiales en Simple Icons
const TECH_SLUGS: Record<string, string> = {
    "Node.js": "nodedotjs",
    "C++": "cplusplus",
    "GitHub Actions": "githubactions",
    "SQL": "sqlite", // Usamos SQLite como icono representativo de SQL
}

// Versión fijada del paquete en el CDN: con @latest, un cambio de slug o de logo en Simple Icons
// se colaría en el sitio sin tocar el código. Subirla a mano y revisar el marquee al hacerlo.
const SIMPLE_ICONS_VERSION = "16.35.0"

// Iconos servidos localmente en vez del CDN, para tecnologías donde su versión ahí no es la
// reconocible (Redis rebrandeó su logo en 2024; aquí se sirve el clásico de capas apiladas,
// autoalojado en public/icons).
const LOCAL_ICONS: Record<string, string> = {
    "Redis": "/icons/redis.svg",
}

// Tecnologías sin un icono de marca válido en Simple Icons (ej. "Java" está reservado por Oracle
// y el sustituto "openjdk" es un logo distinto, no reconocible). Para estas usamos un icono de
// lucide-react ya incluido en el proyecto, en vez de depender de un SVG externo.
const CUSTOM_ICONS: Record<string, typeof Coffee> = {
    "Java": Coffee,
}

export default function Marquee({ items }: MarqueeProps) {
    return (
        <div className="relative flex overflow-hidden border-y border-foreground/5 py-8 w-full mt-12 mb-8 group">
            <motion.div
                className="flex whitespace-nowrap gap-24 px-8 items-center"
                animate={{ x: ["0%", "-50%"] }}
                transition={{
                    duration: 35,
                    ease: "linear",
                    repeat: Infinity,
                }}
            >
                {/* Renderizamos la lista dos veces para el loop infinito */}
                {[...items, ...items].map((item, index) => {
                    const slug = TECH_SLUGS[item] || item.toLowerCase().replace(/ /g, "")
                    // Servimos los SVG del paquete npm "simple-icons" vía jsDelivr (CDN oficial,
                    // fiable y no bloqueado por adblockers), salvo excepciones autoalojadas en
                    // LOCAL_ICONS o resueltas con CUSTOM_ICONS. Vienen en negro sólido; el filtro
                    // CSS de abajo los desatura y los invierte en modo oscuro.
                    const iconUrl = LOCAL_ICONS[item] ?? `https://cdn.jsdelivr.net/npm/simple-icons@${SIMPLE_ICONS_VERSION}/icons/${slug}.svg`
                    const CustomIcon = CUSTOM_ICONS[item]
                    // grayscale desatura cualquier color de marca (incl. el Redis autoalojado) y
                    // dark:invert voltea el negro a blanco en modo oscuro, para que nunca quede
                    // negro-sobre-negro al pasar el ratón (antes se usaba contrast-0/hover:contrast-100,
                    // que revelaba el negro original y lo hacía invisible en modo oscuro).
                    const iconFilterClasses = "grayscale dark:invert opacity-60 group-hover/item:opacity-100 transition-all duration-300"

                    return (
                        <div key={index} className="flex items-center gap-4 group/item">
                            {CustomIcon ? (
                                <CustomIcon className={`w-6 h-6 md:w-8 md:h-8 text-foreground ${iconFilterClasses}`} />
                            ) : (
                                <img
                                    src={iconUrl}
                                    alt={item}
                                    className={`w-6 h-6 md:w-8 md:h-8 ${iconFilterClasses}`}
                                    onError={(e) => (e.currentTarget.style.display = 'none')}
                                />
                            )}
                            <span
                                className="text-xs md:text-sm font-bold uppercase tracking-[0.3em] text-foreground/80 group-hover/item:text-foreground transition-colors cursor-default"
                            >
                                {item}
                            </span>
                        </div>
                    )
                })}
            </motion.div>

            {/* Degradados laterales suave (fade) */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        </div>
    )
}
