import type { Project } from "../../types/project";

export const SistemaTickets: Project = {
    id: "SistemaTickets",
    title: "SistemaTickets",
    subtitle: "Plataforma de venta de entradas — Arquitectura de Microservicios",
    shortDescription: "Proyecto de venta de entradas construido con 7 microservicios independientes utilizando Spring Boot para explorar los microservicios y eventos.",
    tags: ["Java", "Spring Boot", "React", "Docker", "RabbitMQ", "Redis", "PostgreSQL"],
    image: "/projects/SistemaTickets/PortadaProyecto.webp",
    github: "https://github.com/OscarCordobesNavarro/ticket-system-microservices",
    certificate: "https://www.udemy.com/certificate/UC-80c5dde9-d1c2-4147-a9fa-356e3df5f7e5/",
    heroTitle: "SistemaTickets — Sistema de Gestión",
    challengeQuestion: "Proyecto para aprender sobre microservicios y eventos utilizando Spring Boot",
    challenge: "Este proyecto surge para llevar a la práctica los conceptos teóricos del curso Arquitectura Software Moderna: DDD, Eventos, Microservicios de Daniel Blanco Calviño. El objetivo es aplicar estos conocimientos en un entorno realista, utilizando herramientas actuales y explorando a fondo la arquitectura de microservicios basada en eventos. Para ello, a modo de ejemplo, se ha diseñado una plataforma de venta de entradas dividida en dominios específicos (eventos, reservas, pagos, usuarios, etc...), donde cada servicio gestiona su propia lógica y se comunica con los demás para completar el flujo de negocio.",
    architecture: {
        text: "El sistema está compuesto por 7 microservicios independientes, y en el caso que el microservicio lo necesite, tiene su propia base de datos. La comunicación entre servicios combina llamadas síncronas (OpenFeign) para validaciones en tiempo real y mensajería asíncrona (RabbitMQ) para el flujo de pago y notificaciones.",
        services: [
            { name: "API Gateway", role: "Punto de entrada único, autenticación JWT y Rate Limiting", tech: "Spring Cloud Gateway" },
            { name: "User Service", role: "Gestión de usuarios y emisión de tokens de seguridad", tech: "Spring Boot + PostgreSQL" },
            { name: "Catalog Service", role: "Administración del catálogo de eventos y tipos de tickets", tech: "Spring Boot + PostgreSQL" },
            { name: "Booking Service", role: "Gestión de reservas y control de stock en tiempo real", tech: "Spring Boot + Redis + PostgreSQL" },
            { name: "Payment Service", role: "Procesamiento de pagos y gestión de fallos", tech: "RabbitMQ + Consumer" },
            { name: "Notification Service", role: "Envío de tickets y confirmaciones transaccionales", tech: "RabbitMQ + Logging" },
            { name: "Discovery Service", role: "Registro y descubrimiento de instancias de servicios", tech: "Netflix Eureka" }
        ],
        patterns: [
            "Microservices Architecture",
            "Database per Service",
            "Event-Driven Design",
            "Saga Pattern",
            "Service Discovery",
            "API Gateway Pattern"
        ],
        diagram: [
            { from: "React Frontend", to: "API Gateway :8080", type: "HTTP" },
            { from: "API Gateway", to: "Discovery (Eureka)", type: "lb://" },
            { from: "Booking Service", to: "Redis", type: "Stock Atómico" },
            { from: "Booking Service", to: "RabbitMQ", type: "Async" }
        ]
    },
    stack: [
        { layer: "Backend", tech: "Java 21, Spring Boot 3.4, Maven" },
        { layer: "Gateway", tech: "Spring Cloud Gateway" },
        { layer: "Descubrimiento", tech: "Netflix Eureka" },
        { layer: "Seguridad", tech: "JWT (JJWT), Spring Security 6" },
        { layer: "Base de datos", tech: "PostgreSQL 15" },
        { layer: "Cache / Stock", tech: "Redis" },
        { layer: "Mensajería", tech: "RabbitMQ" },
        { layer: "Comunicación interna", tech: "Spring Cloud OpenFeign" },
        { layer: "Frontend", tech: "React 19, TypeScript, Vite" },
        { layer: "Contenedores", tech: "Docker & Docker Compose" },
        { layer: "Migraciones", tech: "Flyway" },
        { layer: "Documentación API", tech: "SpringDoc OpenAPI (Swagger)" }
    ],
    decisions: [
        {
            title: "Stock atómico con Redis",
            problem: "Dos usuarios compran la última entrada al mismo tiempo. Sin coordinación, ambos podrían completar la compra.",
            solution: "Operación DECR de Redis. Redis es monohilo, por lo que el decremento es atómico e indivisible. Si el resultado < 0, se ejecuta INCR como compensación.",
            color: "green"
        },
        {
            title: "Identidad Protegida (Passport Pattern)",
            problem: "La validación en cada microservicio consume recursos y dispersa el secreto (JWT Secret) por toda la infraestructura.",
            solution: "Delegación en el Gateway para validación perimetral. Una vez autenticado, se propaga la identidad mediante headers internos seguros, reduciendo la latencia y centralizando la confianza.",
            color: "orange"
        },
        {
            title: "Saga Pattern para pagos",
            problem: "El pago implica múltiples servicios. Si falla a mitad, ¿cómo se deshace la reserva y se recupera el stock?",
            solution: "Choreography-based Saga via RabbitMQ. El payment-service publica booking.failed → el booking-service cancela la reserva y devuelve el stock.",
            color: "cyan"
        },
        {
            title: "Estado: Database-per-Service",
            problem: "El acoplamiento de datos en una base única impide que los servicios escalen de forma independiente y genera dependencias críticas entre dominios.",
            solution: "Cada microservicio tiene su propia base de datos si lo necesita. La consistencia se garantiza mediante mensajería y el patrón Saga.",
            color: "white"
        },
        {
            title: "Swagger UI Centralizado",
            problem: "Consultar la documentación de 7 microservicios en puertos diferentes rompe el flujo de desarrollo y dificulta las pruebas de integración.",
            solution: "Agregación en el Gateway mediante SpringDoc. Todos los contratos OpenAPI se consolidan en un único punto para facilitar el testing y la documentación.",
            color: "pink"
        },
        {
            title: "Comunicación Híbrida (Feign + RabbitMQ)",
            problem: "Una arquitectura 100% síncrona bloquea al usuario y es frágil ante caídas. Una 100% asíncrona dificulta las validaciones de negocio en tiempo real.",
            solution: "Uso de OpenFeign para validaciones críticas de dominio (existencia de usuario/evento) garantizando integridad, y RabbitMQ para procesos pesados (pagos/notificaciones) logrando una respuesta al usuario en milisegundos.",
            color: "purple"
        }
    ],
    metrics: [
        { label: "Microservicios", value: "7" },
        { label: "Bases de datos", value: "4" },
        { label: "Comunicación", value: "Dual" },
        { label: "Stack", value: "Java + React" }
    ],
    gallery: [
        "/projects/SistemaTickets/VistaFrontEnd.webp",
        "/projects/SistemaTickets/AllSwaggers.webp",
        "/projects/SistemaTickets/VistaEurekaDockerRabbit.webp",
        "/projects/SistemaTickets/VistaSistema.webp"
    ]
};
