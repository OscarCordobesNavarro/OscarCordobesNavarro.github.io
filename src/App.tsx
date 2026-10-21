import Navbar from "./components/ui/Navbar"
import { SECTIONS } from "./sections"


export default function App() {
  return (
    <main className="flex flex-col items-center">
      <Navbar />

      {SECTIONS.map(({ id, Component, className }) => (
        <section key={id} id={id} className={`min-h-screen flex items-center justify-center w-full ${className}`}>
          <Component />
        </section>
      ))}
    </main>
  )
}
