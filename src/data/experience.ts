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
        description: "Desarrollo de procesos de negocio para el ERP propietario de la empresa, usado por distintas empresas nacionales: en su versión de escritorio con Visual Basic, VBScript y SQL, y en su versión web con C#, LINQ y JS, ambas trabajando sobre la misma base de datos y con posibilidad de integración con otros ERPs como SAP.",
        status: "cerrado",
    },
    {
        id: "colaborativos",
        thread: "colaborativa",
        title: "Codesarrollo con otros programadores",
        period: "Enero 2026 – Presente",
        description: "Codesarrollo de software junto a otros programadores en proyectos como tiendas online, webapps, aplicaciones móviles y webs para pequeños comercios, encargándome del desarrollo completo, desde el frontend hasta el despliegue.",
        status: "abierto",
    },
];
