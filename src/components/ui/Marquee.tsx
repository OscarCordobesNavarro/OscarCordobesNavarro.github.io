import { motion } from "framer-motion"

interface MarqueeProps {
    items: string[]
}

// Mapeo selectivo para tecnologías con nombres especiales en Simple Icons
const TECH_SLUGS: Record<string, string> = {
    "Node.js": "nodedotjs",
    "C++": "cplusplus",
    "GitHub Actions": "githubactions",
    "SQL": "sqlite", // Usamos SQLite como icono representativo de SQL
    "Java": "openjdk", // Simple Icons no tiene un icono "java" (nombre reservado por marca)
}

// Iconos servidos localmente en vez del CDN de Simple Icons, para tecnologías donde su versión
// actual ahí no es la reconocible (Redis rebrandeó su logo en 2024; aquí se sirve el clásico de
// capas apiladas, autoalojado en public/icons).
const LOCAL_ICONS: Record<string, string> = {
    "Redis": "/icons/redis.svg",
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
                    // Usamos el CDN de Simple Icons con filtro de color dinámico, salvo excepciones
                    // autoalojadas en LOCAL_ICONS
                    const iconUrl = LOCAL_ICONS[item] ?? `https://cdn.simpleicons.org/${slug}/currentColor`

                    return (
                        <div key={index} className="flex items-center gap-4 group/item">
                            <img
                                src={iconUrl}
                                alt={item}
                                className="w-6 h-6 md:w-8 md:h-8 opacity-80 group-hover/item:opacity-100 transition-all duration-300 contrast-0 hover:contrast-100 grayscale"
                                onError={(e) => (e.currentTarget.style.display = 'none')}
                            />
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
