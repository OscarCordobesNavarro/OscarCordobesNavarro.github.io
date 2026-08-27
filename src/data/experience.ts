import type { ExperienceItem } from "../types/experience";

export const EXPERIENCE: ExperienceItem[] = [
    {
        id: "fin-carrera",
        thread: "principal",
        title: "Fin de la carrera",
        period: "09/02/2026",
        description: "Graduado en Ingeniería Informática",
        status: "cerrado",
    },
    {
        id: "hanami8",
        thread: "principal",
        title: "Becario en Hanami8",
        period: "11/03/2026 – 09/08/2026",
        description: "Incorporación como becario, desarrollando tareas de programación en equipo.",
        status: "cerrado",
    },
    {
        id: "colaborativos",
        thread: "colaborativa",
        title: "Codesarrollo con otros programadores",
        period: "Enero 2026 – Presente",
        description: "Codesarrollo de software junto a otros programadores en distintos proyectos, aportando en diseño, arquitectura y buenas prácticas.",
        status: "abierto",
    },
];
