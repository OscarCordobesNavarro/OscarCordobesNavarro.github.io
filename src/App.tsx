import Hero from "./components/Hero"
import { Button } from "./components/ui/Button"
import { Github, Linkedin } from "lucide-react"

export default function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      <div className="flex flex-col items-start w-full max-w-4xl">
        <Hero />
        <div className="flex flex-col items-start gap-2">
          <p className="mt-8 text-gray-500 text-lg md:text-xl">
            Hola, soy
          </p>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-black leading-tight whitespace-nowrap">
            Óscar Cordobés Navarro
          </h1>
          <p className="text-gray-500 text-lg md:text-xl">
            Ingeniero Informático por la Universidad de La Laguna
          </p>
        </div>
        <div className="mt-8 flex flex-wrap gap-4">
          <Button variant="outline" asChild>
            <a href="https://github.com/OscarCordobesNavarro" target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" /> GitHub
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href="https://www.linkedin.com/in/oscarcordobesnavarro" target="_blank" rel="noopener noreferrer">
              <Linkedin className="mr-2 h-4 w-4" /> LinkedIn
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
