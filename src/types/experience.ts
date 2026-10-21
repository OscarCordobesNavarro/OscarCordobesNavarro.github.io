// Ids cerrados: Experience.tsx coloca cada hito a mano en el grafo, así que el compilador debe
// avisar si se renombra o falta alguno en data/experience.ts.
export type ExperienceId = "fin-carrera" | "hanami8" | "eturia" | "colaborativos";

export interface ExperienceItem {
    id: ExperienceId;
    thread: "principal" | "colaborativa";
    title: string;
    period: string;
    description: string;
    status: "cerrado" | "abierto";
}
