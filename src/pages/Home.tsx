import { Github, Linkedin } from "lucide-react"
import { Button } from "../components/ui/Button"
import { SITE_DATA } from "../lib/constants"

// Mapeamos los strings de constantes a componentes reales de Lucide
const ICONS = {
    github: Github,
    linkedin: Linkedin,
}

export default function Home() {
    return (
        <div className="flex flex-col items-start w-full max-w-4xl">
            {/* Tu componente de imagen que ya tenías */}
            <div className="rounded-full border border-foreground w-32 h-32 flex items-center justify-center overflow-hidden">
                <img
                    src="/icon.webp"
                    alt="Icono personal"
                    className="w-full h-full object-contain transition-all duration-300"
                />
            </div>

            <div className="flex flex-col items-start gap-2 w-full">
                <p className="mt-8 text-foreground/60 text-lg md:text-xl font-medium tracking-tight">
                    Hola, soy
                </p>

                <h1 className="text-[1.65rem] min-[390px]:text-3xl sm:text-5xl md:text-6xl font-bold font-display tracking-[-0.03em] text-foreground leading-[1.1] text-balance">
                    {SITE_DATA.name}
                </h1>

                <p className="text-foreground/60 text-lg md:text-xl leading-relaxed text-balance">
                    {SITE_DATA.role}
                </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
                {SITE_DATA.socials.map((social) => {
                    const Icon = ICONS[social.icon as keyof typeof ICONS]
                    return (
                        <Button key={social.name} variant="outline" asChild>
                            <a href={social.url} target="_blank" rel="noopener noreferrer">
                                {Icon && <Icon className="mr-2 h-4 w-4" />}
                                {social.name}
                            </a>
                        </Button>
                    )
                })}
            </div>
        </div>
    )
}