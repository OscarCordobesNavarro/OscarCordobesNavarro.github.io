import Home from "./pages/Home"
import About from "./pages/About"
import Contact from "./pages/Contact"
import Experience from "./pages/Experience"
import Projects from "./pages/Projects"
import Navbar from "./components/ui/Navbar"


export default function App() {
  return (
    <main className="flex flex-col items-center">
      <Navbar />

      <section id="inicio" className="min-h-screen flex items-center justify-center w-full px-6 py-12">
        <Home />
      </section>

      <section id="sobre-mi" className="min-h-screen flex items-center justify-center w-full px-6 py-12 bg-secondary/30">
        <About />
      </section>

      <section id="experiencia" className="min-h-screen flex items-center justify-center w-full px-6 py-12">
        <Experience />
      </section>

      <section id="proyectos" className="min-h-screen flex items-center justify-center w-full bg-secondary/10">
        <Projects />
      </section>

      <section id="contacto" className="min-h-screen flex items-center justify-center w-full px-6 py-12">
        <Contact />
      </section>
    </main>
  )
}