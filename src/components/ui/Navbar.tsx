import { Button } from "./Button"
import { Sun, Moon, Home, User, Briefcase, Mail } from "lucide-react"
import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"

const NAV_SECTIONS = [
    { id: "inicio", label: "Inicio", href: "#inicio", icon: Home },
    { id: "sobre-mi", label: "Sobre mí", href: "#sobre-mi", icon: User },
    { id: "proyectos", label: "Proyectos", href: "#proyectos", icon: Briefcase },
    { id: "contacto", label: "Contacto", href: "#contacto", icon: Mail },
] as const

type SectionId = (typeof NAV_SECTIONS)[number]["id"]

export default function Navbar() {
    const [isDark, setIsDark] = useState(false)
    const [activeSection, setActiveSection] = useState<SectionId>("inicio")

    // useEffect para inicializar el tema al cargar la página
    useEffect(() => {
        const isDarkStored = localStorage.getItem("theme") === "dark"
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

        if (isDarkStored || (!localStorage.getItem("theme") && prefersDark)) {
            setIsDark(true)
            document.documentElement.classList.add("dark")
        }
    }, [])

    // Scroll-spy: detecta qué sección está en el centro del viewport
    useEffect(() => {
        const sectionIds = NAV_SECTIONS.map((s) => s.id)
        const elements = sectionIds
            .map((id) => document.getElementById(id))
            .filter((el): el is HTMLElement => el !== null)

        if (elements.length === 0) return

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

                if (visible[0]) {
                    setActiveSection(visible[0].target.id as SectionId)
                }
            },
            {
                rootMargin: "-50% 0px -50% 0px",
                threshold: 0,
            }
        )

        elements.forEach((el) => observer.observe(el))

        return () => observer.disconnect()
    }, [])

    const toggleTheme = () => {
        const newTheme = !isDark
        setIsDark(newTheme)

        if (newTheme) {
            document.documentElement.classList.add("dark")
            localStorage.setItem("theme", "dark")
        } else {
            document.documentElement.classList.remove("dark")
            localStorage.setItem("theme", "light")
        }
    }

    return (
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-fit px-4">
            <div className="flex items-center gap-0.5 xs:gap-1 sm:gap-2 px-2 xs:px-3 py-2 bg-background/70 backdrop-blur-md border border-foreground/10 rounded-full shadow-lg shadow-black/5 mx-auto">
                {NAV_SECTIONS.map((section) => {
                    const isActive = activeSection === section.id
                    const Icon = section.icon
                    return (
                        <Button
                            key={section.id}
                            variant="ghost"
                            size="sm"
                            className={`relative !rounded-full px-1.5 xs:px-3 text-xs sm:text-sm ${isActive ? "text-foreground" : "text-foreground/60 hover:text-foreground"}`}
                            asChild
                        >
                            <a href={section.href} aria-label={section.label}>
                                {isActive && (
                                    <motion.span
                                        layoutId="navbar-active-pill"
                                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                        className="absolute inset-0 -z-10 rounded-full bg-secondary shadow-sm shadow-black/10"
                                    />
                                )}
                                <Icon className="relative z-10 h-4 w-4 xs:hidden" aria-hidden="true" />
                                <span className="relative z-10 hidden xs:inline">{section.label}</span>
                            </a>
                        </Button>
                    )
                })}

                <div className="w-px h-4 bg-foreground/10 mx-0.5 sm:mx-1" />

                <Button
                    variant="ghost"
                    size="icon"
                    className="!rounded-full w-8 h-8 flex-shrink-0"
                    onClick={toggleTheme}
                    aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
                >
                    <AnimatePresence mode="wait" initial={false}>
                        {isDark ? (
                            <motion.span
                                key="sun"
                                initial={{ scale: 0, rotate: -90, opacity: 0 }}
                                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                                exit={{ scale: 0, rotate: 90, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="inline-flex"
                            >
                                <Sun className="h-4 w-4" />
                            </motion.span>
                        ) : (
                            <motion.span
                                key="moon"
                                initial={{ scale: 0, rotate: -90, opacity: 0 }}
                                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                                exit={{ scale: 0, rotate: 90, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="inline-flex"
                            >
                                <Moon className="h-4 w-4 text-foreground/70" />
                            </motion.span>
                        )}
                    </AnimatePresence>
                </Button>
            </div>
        </nav>
    )
}
