export interface ProjectDecision {
    title: string;
    problem: string;
    solution: string;
    color: "red" | "blue" | "yellow" | "white" | "green" | "purple" | "orange" | "cyan" | "pink";
}

export interface Microservice {
    name: string;
    role: string;
    tech: string;
}

export interface ProjectMetric {
    label: string;
    value: string;
}

export interface ProjectStackItem {
    layer: string;
    tech: string;
}

export interface ProjectDiagramStep {
    from: string;
    to: string;
    type: string;
}

export interface Project {
    id: string;
    title: string;
    heroTitle?: string;
    subtitle: string;
    shortDescription: string;
    tags: string[];
    image: string;
    github: string;
    certificate?: string;
    challengeQuestion?: string;
    challenge: string;
    architecture: {
        text: string;
        services?: Microservice[];
        patterns?: string[];
        diagram: ProjectDiagramStep[];
    };
    stack: ProjectStackItem[];
    decisions: ProjectDecision[];
    metrics: ProjectMetric[];
    gallery: string[];
}
