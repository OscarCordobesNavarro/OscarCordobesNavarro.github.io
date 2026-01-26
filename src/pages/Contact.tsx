import { useState } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { MapPin, Mail, Car, Check } from "lucide-react"
import { SITE_DATA } from "../lib/constants"

export default function Contact() {
    const [copied, setCopied] = useState(false)

    // Lógica para el efecto de movimiento 3D con el cursor
    const x = useMotionValue(0)
    const y = useMotionValue(0)

    const mouseXSpring = useSpring(x)
    const mouseYSpring = useSpring(y)

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"])
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"])

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const width = rect.width
        const height = rect.height
        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top
        const xPct = mouseX / width - 0.5
        const yPct = mouseY / height - 0.5
        x.set(xPct)
        y.set(yPct)
    }

    const handleMouseLeave = () => {
        x.set(0)
        y.set(0)
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(SITE_DATA.contact.email)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <section className="w-full flex flex-col items-center py-20 px-6">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-foreground/40 mb-12">
                Contacto
            </h2>

            <motion.div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    rotateY,
                    rotateX,
                    transformStyle: "preserve-3d",
                }}
                className="relative w-full max-w-3xl bg-background border border-foreground/10 rounded-3xl shadow-2xl p-8 md:p-12 overflow-hidden group"
            >
                {/* Contenido en dos columnas */}
                <div
                    style={{ transform: "translateZ(50px)" }}
                    className="flex flex-col md:flex-row items-center md:items-start gap-12"
                >
                    {/* LADO IZQUIERDO: Avatar y Punto Pulsante */}
                    <div className="relative">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-foreground/10 overflow-hidden bg-secondary/30">
                            <img
                                src="/FotoGraduacionMinimalista.webp"
                                alt="Óscar Cordobés"
                                className="w-full h-full object-cover filter grayscale"
                            />
                        </div>

                        {/* Punto Pulsante 'Disponible' */}
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-background border border-foreground/10 px-3 py-1 rounded-full shadow-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                                Disponible
                            </span>
                        </div>
                    </div>

                    {/* LADO DERECHO: Información Personal */}
                    <div className="flex-1 text-center md:text-left">
                        <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                            {SITE_DATA.name}
                        </h3>
                        <p className="text-lg text-foreground/60 mb-8 border-b border-foreground/5 pb-6">
                            {SITE_DATA.role}
                        </p>

                        {/* Lista de detalles con iconos */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-center md:justify-start gap-3 text-foreground/80">
                                <MapPin className="w-5 h-5 text-foreground/40" />
                                <span className="font-medium">{SITE_DATA.contact.location}</span>
                            </div>

                            <button
                                onClick={copyToClipboard}
                                className="group/email flex items-center justify-center md:justify-start gap-3 text-foreground/80 hover:text-foreground transition-colors w-full md:w-auto"
                            >
                                <div className="relative w-5 h-5 flex items-center justify-center">
                                    {copied ? (
                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                            <Check className="w-5 h-5 text-emerald-500" />
                                        </motion.div>
                                    ) : (
                                        <Mail className="w-5 h-5 text-foreground/40 group-hover/email:text-foreground/60" />
                                    )}
                                </div>
                                <span className="font-medium underline decoration-foreground/10 underline-offset-4 group-hover/email:decoration-foreground/30">
                                    {copied ? "¡Copiado!" : SITE_DATA.contact.email}
                                </span>
                            </button>

                            <div className="flex items-center justify-center md:justify-start gap-3 text-foreground/80">
                                <Car className="w-5 h-5 text-foreground/40" />
                                <span className="font-medium">{SITE_DATA.contact.availability}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decoración de fondo suave */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />
            </motion.div>
        </section>
    )
}