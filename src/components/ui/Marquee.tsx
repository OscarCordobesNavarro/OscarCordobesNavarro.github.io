import { motion } from "framer-motion"

interface MarqueeProps {
    items: string[]
}

// Mapeo selectivo para tecnologías con nombres especiales en Simple Icons
const TECH_SLUGS: Record<string, string> = {
    "Node.js": "nodedotjs",
    "Express": "express",
    "C++": "cplusplus",
    "GitHub Actions": "githubactions",
    "SQL": "sqlite", // Usamos SQLite como icono representativo de SQL
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
                    // Usamos el CDN de Simple Icons con filtro de color dinámico
                    const iconUrl = `https://cdn.simpleicons.org/${slug}/currentColor`

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
