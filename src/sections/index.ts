import type { ComponentType } from "react"
import { Home as HomeIcon, User, History, Briefcase, Mail, type LucideIcon } from "lucide-react"
import Home from "./Home"
import About from "./About"
import Experience from "./Experience"
import Projects from "./Projects"
import Contact from "./Contact"

interface SiteSection {
    id: string
    label: string
    icon: LucideIcon
    Component: ComponentType
    // Clases propias del <section> que la envuelve en App (padding y fondo alterno)
    className: string
}

// Fuente única de las secciones ancladas: App las renderiza en este orden y la Navbar
// construye su menú (y el scroll-spy) a partir de la misma lista.
export const SECTIONS = [
    { id: "inicio", label: "Inicio", icon: HomeIcon, Component: Home, className: "px-6 py-12" },
    { id: "sobre-mi", label: "Sobre mí", icon: User, Component: About, className: "px-6 py-12 bg-secondary/30" },
    { id: "experiencia", label: "Experiencia", icon: History, Component: Experience, className: "px-6 py-12" },
    { id: "proyectos", label: "Proyectos", icon: Briefcase, Component: Projects, className: "bg-secondary/10" },
    { id: "contacto", label: "Contacto", icon: Mail, Component: Contact, className: "px-6 py-12" },
] as const satisfies readonly SiteSection[]

export type SectionId = (typeof SECTIONS)[number]["id"]
