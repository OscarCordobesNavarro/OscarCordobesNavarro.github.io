import { Button } from "./Button"
import { Sun, Moon } from "lucide-react"
import { useState, useEffect } from "react"

export default function Navbar() {
    const [isDark, setIsDark] = useState(false)

    // useEffect para inicializar el tema al cargar la página
    useEffect(() => {
        const isDarkStored = localStorage.getItem("theme") === "dark"
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

        if (isDarkStored || (!localStorage.getItem("theme") && prefersDark)) {
            setIsDark(true)
            document.documentElement.classList.add("dark")
        }
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
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
            <div className="flex items-center gap-2 px-3 py-2 bg-background/70 backdrop-blur-md border border-gray-200 dark:border-neutral-800 rounded-full shadow-lg shadow-black/5">
                <Button variant="ghost" size="sm" className="rounded-full" asChild>
                    <a href="#">Inicio</a>
                </Button>
                <Button variant="ghost" size="sm" className="rounded-full" asChild>
                    <a href="#sobre-mi">Sobre mí</a>
                </Button>
                <Button variant="ghost" size="sm" className="rounded-full" asChild>
                    <a href="#contacto">Contacto</a>
                </Button>

                <div className="w-px h-4 bg-gray-200 dark:bg-neutral-800 mx-1" />

                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full w-8 h-8"
                    onClick={toggleTheme}
                >
                    {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4 text-gray-600" />}
                </Button>
            </div>
        </nav>
    )
}