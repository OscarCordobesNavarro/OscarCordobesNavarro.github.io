import Home from "./pages/Home"
import About from "./pages/About"
import Contact from "./pages/Contact"
import Navbar from "./components/ui/Navbar"


export default function App() {
  return (
    <main className="flex flex-col items-center">
      <Navbar />

      <section className="min-h-screen flex items-center justify-center w-full px-6 py-12">
        <Home />
      </section>

      <section id="sobre-mi" className="min-h-screen flex items-center justify-center w-full px-6 py-12 bg-secondary/30">
        <About />
      </section>

      <section id="contacto" className="min-h-screen flex items-center justify-center w-full px-6 py-12">
        <Contact />
      </section>
    </main>
  )
}