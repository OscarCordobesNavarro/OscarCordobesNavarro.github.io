import { useState } from "react"
import { motion } from "framer-motion"
import { PROJECTS } from "../data/projects"
import type { Project } from "../types/project"
import { ArrowUpRight, Server } from "lucide-react"
import ProjectModal from "../components/ui/ProjectModal"

export default function Projects() {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null)

    return (
        <section id="proyectos" className="w-full max-w-6xl px-6 py-24">
            <div className="flex flex-col gap-12">
                <div className="flex flex-col gap-4">
                    <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-foreground/40">
                        Proyectos
                    </h2>
                    <h3 className="text-3xl md:text-5xl font-bold tracking-tight">
                        Alguno de los proyectos que he ido haciendo para aprender
                    </h3>
                </div>

                {/* Grid de Proyectos */}
                <div className="grid grid-cols-1 md:grid-cols-1 gap-12">
                    {PROJECTS.map((project: Project, index: number) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            onClick={() => setSelectedProject(project)}
                            className="group relative cursor-pointer"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-secondary/20 rounded-[2.5rem] p-4 md:p-8 border border-foreground/5 hover:border-foreground/10 transition-all duration-500 overflow-hidden">

                                {/* Imagen de Portada */}
                                <div className="aspect-[16/10] bg-secondary/80 rounded-[1.5rem] overflow-hidden relative border border-foreground/5">
                                    {/* Placeholder visual */}
                                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-secondary to-background">
                                        <Server className="w-12 h-12 text-foreground/10" />
                                    </div>
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 opacity-0"
                                        onLoad={(e) => (e.currentTarget.style.opacity = "1")}
                                    />

                                    {/* Badge con el rol o tipo */}
                                    <div className="absolute top-6 left-6 px-4 py-2 bg-background/80 backdrop-blur-md rounded-full border border-foreground/5 text-[10px] font-bold uppercase tracking-widest">
                                        Proyecto
                                    </div>
                                </div>

                                {/* Info de la Tarjeta */}
                                <div className="flex flex-col gap-6 p-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-3xl font-bold group-hover:translate-x-1 transition-transform duration-500 flex items-center gap-2">
                                                {project.title}
                                            </h4>
                                            <div className="w-12 h-12 rounded-full border border-foreground/10 flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-all duration-500">
                                                <ArrowUpRight className="w-5 h-5" />
                                            </div>
                                        </div>
                                        <p className="text-foreground/60 text-lg leading-relaxed">
                                            {project.subtitle}
                                        </p>
                                    </div>

                                    <p className="text-md text-foreground/40 font-medium">
                                        {project.shortDescription}
                                    </p>

                                    <div className="flex flex-wrap gap-2">
                                        {project.tags.map((tag: string) => (
                                            <span key={tag} className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 bg-background border border-foreground/5 rounded-full">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Modal de Detalle */}
            <ProjectModal
                project={selectedProject}
                isOpen={!!selectedProject}
                onClose={() => setSelectedProject(null)}
            />
        </section>
    )
}
