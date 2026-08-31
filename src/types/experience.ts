export interface ExperienceItem {
    id: string;
    thread: "principal" | "colaborativa";
    title: string;
    period: string;
    description: string;
    status: "cerrado" | "abierto";
}
