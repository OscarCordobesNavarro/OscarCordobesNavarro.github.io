import { motion } from "framer-motion"
import { SITE_DATA } from "../lib/constants"
import Marquee from "../components/ui/Marquee"

export default function About() {
    return (
        <div className="flex flex-col items-center gap-12 max-w-4xl w-full">
            <div className="flex flex-col md:flex-row items-center gap-12 w-full">
                {/* Columna Izquierda: Avatar Animado */}
                <div className="relative">
                    <motion.div
                        initial={{ y: 60, opacity: 0 }}
                        whileInView={{
                            y: 0,
                            opacity: 1,
                            rotate: [0, -10, 10, -10, 0] // Efecto de saludo al entrar
                        }}
                        transition={{
                            y: { duration: 0.8, ease: "easeOut" },
                            opacity: { duration: 0.8 },
                            rotate: { delay: 0.8, duration: 1.5, ease: "easeInOut" }
                        }}
                        viewport={{ amount: 0.5 }}
                        className="w-48 h-48 md:w-64 md:h-64 rounded-full border border-foreground/20 flex items-center justify-center bg-background shadow-sm overflow-hidden"
                    >
                        <img
                            src="/FotoGafas.webp"
                            alt="Óscar Cordobés"
                            className="w-full h-full object-cover filter grayscale"
                        />
                    </motion.div>
                </div>

                {/* Columna Derecha: Texto */}
                <div className="flex-1 text-left">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-foreground/40 mb-6">
                            Sobre mí
                        </h2>
                        <p className="text-lg md:text-xl font-medium leading-relaxed text-foreground text-balance italic">
                            "{SITE_DATA.about}"
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Fila Inferior: Tech Marquee (A toda anchura) */}
            <div className="w-full mt-4">
                <Marquee items={SITE_DATA.technologies} />
            </div>
        </div>
    )
}