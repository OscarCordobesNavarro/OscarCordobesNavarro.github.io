import Image from "next/image";
import Link from "next/link";
import { Github, Linkedin, Hammer } from "lucide-react";

import { Button } from "./components/Button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-12 md:py-24">
      <div className="container max-w-3xl">
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <div className="mb-8 overflow-hidden rounded-full border border-gray-200">
            <Image
              src="/notionFace.png"
              alt="Óscar Cordobés Navarro"
              width={150}
              height={150}
              className="h-[150px] w-[150px] object-cover"
              priority
            />
          </div>

          <p className="mb-1 text-lg text-gray-600">Hola, soy</p>
          <h1 className="mb-2 text-4xl font-bold tracking-tight text-black sm:text-5xl md:text-6xl">
            Óscar Cordobés Navarro
          </h1>

          <p className="mb-8 text-lg text-gray-600 md:text-xl">
            Estudiante de Ingeniería Informática en la Universidad de La Laguna
          </p>

          <div className="flex gap-4">
            <Button
              variant="outline"
              size="lg"
              className="gap-2 rounded-md border-gray-200 hover:bg-gray-100 hover:text-black"
              asChild
            >
              <Link
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-5 w-5" />
                <span>GitHub</span>
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="gap-2 rounded-md border-gray-200 hover:bg-gray-100 hover:text-black"
              asChild
            >
              <Link
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="h-5 w-5" />
                <span>LinkedIn</span>
              </Link>
            </Button>
          </div>

          <div className="mt-12 flex justify-center text-gray-500">
            <div className="flex items-center gap-1.5 border-t border-gray-200 pt-4 text-xs">
              <Hammer className="h-3.5 w-3.5" />
              <span>En obras</span>
              <Hammer className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
