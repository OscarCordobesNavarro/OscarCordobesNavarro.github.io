import { motion, AnimatePresence } from "framer-motion"
import { X, Github, Server, Database, Zap, ShieldCheck, Award, TrendingUp, Cpu, Lock, Share2, Layout } from "lucide-react"
import { useEffect, useState } from "react"
import type { Project } from "../../types/project"

interface ProjectModalProps {
    project: Project | null
    isOpen: boolean
    onClose: () => void
}

export default function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null)

    // Cerrar con ESC y bloquear scroll
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
        }
        if (isOpen) {
            document.body.style.overflow = "hidden"
            window.addEventListener("keydown", handleEsc)
        }
        return () => {
            document.body.style.overflow = "unset"
            window.removeEventListener("keydown", handleEsc)
        }
    }, [isOpen, onClose])

    if (!project) return null

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-background/80 backdrop-blur-md z-[60] cursor-zoom-out"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.95 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-0 md:inset-10 z-[70] bg-background border border-foreground/10 md:rounded-3xl shadow-2xl overflow-hidden flex flex-col"
                    >
                        {/* Header Fijo */}
                        <div className="flex items-center justify-between p-6 border-b border-foreground/5 bg-background/50 backdrop-blur-md sticky top-0 z-10">
                            <div className="flex items-center gap-4">
                                <h2 className="text-xl font-bold">{project.title}</h2>
                                <div className="hidden md:flex gap-2">
                                    {project.tags.slice(0, 3).map((tag: string) => (
                                        <span key={tag} className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-secondary rounded-full transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Scrollable Area */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <div className="max-w-4xl mx-auto p-6 md:p-12 space-y-16 pb-32">

                                {/* SECCIÓN 1: Hero del Proyecto de Estudio */}
                                <header className="space-y-6">
                                    <div className="space-y-2">
                                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance">
                                            {project.heroTitle || project.title}
                                        </h1>
                                        <p className="text-xl text-foreground/60 text-balance leading-relaxed">
                                            {project.subtitle}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {project.tags.map((tag: string) => (
                                            <span key={tag} className="text-xs font-medium px-3 py-1 rounded-md border border-foreground/10 bg-secondary/30">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="pt-4 flex flex-wrap gap-4">
                                        <a
                                            href={project.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-full font-bold hover:opacity-90 transition-opacity"
                                        >
                                            <Github className="w-5 h-5" />
                                            Ver Código en GitHub
                                        </a>
                                        {project.certificate && (
                                            <a
                                                href={project.certificate}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 px-6 py-3 border border-foreground/10 rounded-full font-bold hover:bg-secondary transition-colors"
                                            >
                                                <Award className="w-5 h-5" />
                                                Ver Certificado
                                            </a>
                                        )}
                                    </div>
                                </header>

                                {/* SECCIÓN 2: El Reto */}
                                <section className="space-y-8 border-t border-foreground/5 pt-16">
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-foreground/40">El Reto</h3>
                                    <div className="space-y-6">
                                        <h4 className="text-3xl md:text-4xl font-bold leading-tight text-balance max-w-3xl">
                                            {project.challengeQuestion}
                                        </h4>
                                        <div className="h-px w-20 bg-foreground/10" />
                                        <p className="text-lg text-foreground/70 leading-relaxed max-w-4xl">
                                            {project.challenge}
                                        </p>
                                    </div>
                                </section>

                                {/* SECCIÓN 3: Arquitectura */}
                                <section className="space-y-12 bg-secondary/20 p-8 md:p-12 rounded-3xl border border-foreground/5">
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-bold uppercase tracking-widest text-foreground/40">Arquitectura del Sistema</h3>
                                        <p className="text-lg text-foreground/80 leading-relaxed max-w-2xl">
                                            {project.architecture.text}
                                        </p>
                                    </div>

                                    {/* Inventario de Microservicios */}
                                    {project.architecture.services && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {project.architecture.services.map((svc, i: number) => (
                                                <div key={i} className="p-5 bg-background border border-foreground/10 rounded-2xl shadow-sm space-y-3 group hover:border-foreground/20 transition-colors">
                                                    <div className="font-bold text-sm text-foreground">{svc.name}</div>
                                                    <p className="text-[11px] text-foreground/60 leading-relaxed h-10 overflow-hidden line-clamp-2">
                                                        {svc.role}
                                                    </p>
                                                    <div className="pt-2 border-t border-foreground/5 text-[9px] font-mono text-foreground/40 uppercase tracking-tighter">
                                                        {svc.tech}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Patrones de Arquitectura */}
                                    {project.architecture.patterns && (
                                        <div className="space-y-4 pt-4">
                                            <div className="text-[10px] font-bold uppercase tracking-widest text-foreground/30">Patrones Implementados</div>
                                            <div className="flex flex-wrap gap-2">
                                                {project.architecture.patterns.map((pattern: string, i: number) => (
                                                    <span key={i} className="px-3 py-1.5 bg-foreground/5 rounded-md text-[10px] font-bold uppercase tracking-widest text-foreground/60 border border-foreground/5">
                                                        {pattern}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Diagrama (opcional, si no hay servicios) */}
                                    {!project.architecture.services && project.architecture.diagram && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {project.architecture.diagram.map((step: any, i: number) => (
                                                <div key={i} className="flex items-center gap-4 p-4 bg-background border border-foreground/5 rounded-xl">
                                                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-foreground/5 font-mono text-xs">0{i + 1}</div>
                                                    <div className="flex-1">
                                                        <div className="text-xs uppercase tracking-tighter text-foreground/40 font-bold">{step.type}</div>
                                                        <div className="font-medium">{step.from} → {step.to}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </section>

                                {/* SECCIÓN 4: Stack Tecnológico */}
                                <section className="space-y-8">
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-foreground/40">Stack Tecnológico</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full border-collapse">
                                            <tbody className="divide-y divide-foreground/5">
                                                {project.stack.map((item: any, i: number) => (
                                                    <tr key={i} className="group hover:bg-secondary/30 transition-colors">
                                                        <td className="py-4 pr-8 font-bold text-foreground/40 uppercase text-[10px] tracking-widest w-1/3">
                                                            {item.layer}
                                                        </td>
                                                        <td className="py-4 text-lg font-medium">
                                                            {item.tech}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </section>

                                {/* SECCIÓN 5: Decisiones Técnicas */}
                                <section className="space-y-8">
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-foreground/40">Decisiones Técnicas</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {project.decisions.map((decision: any, i: number) => {
                                            const colors: any = {
                                                red: "border-red-500/20 bg-red-500/5",
                                                blue: "border-blue-500/20 bg-blue-500/5",
                                                yellow: "border-yellow-500/20 bg-yellow-500/5",
                                                green: "border-green-500/20 bg-green-500/5",
                                                purple: "border-purple-500/20 bg-purple-500/5",
                                                orange: "border-orange-500/20 bg-orange-500/5",
                                                cyan: "border-cyan-500/20 bg-cyan-500/5",
                                                pink: "border-pink-500/20 bg-pink-500/5",
                                                white: "border-foreground/10 bg-secondary/20"
                                            }
                                            const icons: any = {
                                                red: <Zap className="w-5 h-5 text-red-500" />,
                                                blue: <ShieldCheck className="w-5 h-5 text-blue-500" />,
                                                yellow: <Server className="w-5 h-5 text-yellow-500" />,
                                                green: <TrendingUp className="w-5 h-5 text-green-500" />,
                                                purple: <Cpu className="w-5 h-5 text-purple-400" />,
                                                orange: <Lock className="w-5 h-5 text-orange-500" />,
                                                cyan: <Share2 className="w-5 h-5 text-cyan-400" />,
                                                pink: <Layout className="w-5 h-5 text-pink-400" />,
                                                white: <Database className="w-5 h-5 text-foreground/60" />
                                            }
                                            return (
                                                <div key={i} className={`p-8 rounded-2xl border ${colors[decision.color]} space-y-4`}>
                                                    <div className="flex items-center gap-3">
                                                        {icons[decision.color]}
                                                        <h4 className="font-bold text-lg">{decision.title}</h4>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div className="text-xs font-bold uppercase text-foreground/40">Problema</div>
                                                        <p className="text-sm text-foreground/70">{decision.problem}</p>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div className="text-xs font-bold uppercase text-foreground/40">Solución</div>
                                                        <p className="text-sm font-medium">{decision.solution}</p>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </section>

                                {/* SECCIÓN 6: Galería */}
                                <section className="space-y-8">
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-foreground/40">Galería del Proyecto</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {project.gallery.map((img: string, i: number) => (
                                            <div
                                                key={i}
                                                onClick={() => setSelectedImage(img)}
                                                className="aspect-video bg-secondary/20 rounded-2xl border border-foreground/5 overflow-hidden group cursor-zoom-in"
                                            >
                                                <img
                                                    src={img}
                                                    alt={`Captura ${i + 1}`}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* SECCIÓN 7: Métricas */}
                                <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {project.metrics.map((metric: any, i: number) => (
                                        <div key={i} className="p-6 bg-secondary/20 rounded-2xl border border-foreground/5 text-center space-y-1">
                                            <div className="text-3xl font-bold">{metric.value}</div>
                                            <div className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">{metric.label}</div>
                                        </div>
                                    ))}
                                </section>

                                <footer className="pt-20 text-center space-y-6">
                                    <div className="h-px w-24 bg-foreground/10 mx-auto" />
                                    <p className="text-foreground/40 font-medium">Fin del Proyecto de Estudio</p>
                                    <button
                                        onClick={onClose}
                                        className="text-sm font-bold uppercase tracking-widest hover:bg-foreground hover:text-background px-8 py-3 rounded-full border border-foreground transition-all"
                                    >
                                        Cerrar Vista
                                    </button>
                                </footer>
                            </div>
                        </div>
                    </motion.div>
                    {/* Fullscreen Lightbox */}
                    <AnimatePresence>
                        {selectedImage && (
                            <>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setSelectedImage(null)}
                                    className="fixed inset-0 bg-black/90 z-[100] cursor-zoom-out"
                                />
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="fixed inset-4 md:inset-20 z-[101] pointer-events-none flex items-center justify-center"
                                >
                                    <img
                                        src={selectedImage}
                                        alt="Imagen ampliada"
                                        className="max-w-full max-h-full object-contain rounded-xl shadow-2xl pointer-events-auto"
                                    />
                                    <button
                                        onClick={() => setSelectedImage(null)}
                                        className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-colors pointer-events-auto"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </>
            )}
        </AnimatePresence>
    )
}

