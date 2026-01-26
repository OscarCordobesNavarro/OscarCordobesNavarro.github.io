import Hero from "./components/Hero"
import { Button } from "./components/ui/Button"
import { Github, Linkedin } from "lucide-react"

export default function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex flex-col items-start">
        <Hero />
        <div className="flex flex-col items-start gap-2">

          <p className="mt-8 text-gray-500 text-xl">
            Hola, soy
          </p>
          <h1 className="text-6xl font-bold text-black">
            Óscar Cordobés Navarro
          </h1>
          <p className="text-gray-500 text-xl">
            Ingeniero Informático por la Universidad de La Laguna
          </p>
        </div>
        <div className="mt-8 flex gap-4">
          <Button variant="outline" asChild>
            <a href="https://github.com/OscarCordobesNavarro" target="_blank" rel="noopener noreferrer">
              <Github className="mr-2" /> GitHub
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href="https://www.linkedin.com/in/oscarcordobesnavarro" target="_blank" rel="noopener noreferrer">
              <Linkedin className="mr-2" /> LinkedIn
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
