export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  description: string;
  year?: string;
  certificateUrl: string;
}

export type SkillTier = "Core" | "Working" | "Exposure";

export interface SkillItem {
  name: string;
  icon?: string;
  tier: SkillTier;
}

export interface SkillCategory {
  title: string;
  description: string;
  skills: SkillItem[];
}

export interface ServiceItem {
  id: string;
  code: string;
  title: string;
  summary: string;
  deliverables: string[];
  engagement: string;
  subject: string;
}

export interface FocusArea {
  id: string;
  title: string;
  description: string;
  category: string;
}

export interface DigitalProductPreview {
  id: string;
  title: string;
  category: "templates" | "boilerplates" | "agent_tools";
  status: "In Development" | "Available" | "Case Study";
  summary: string;
  tech: string[];
  link?: string;
}

export const CERTIFICATIONS: CertificationItem[] = [
  {
    id: "aws-cloud-practitioner",
    title: "AWS Cloud Practitioner Essentials",
    issuer: "AWS Training & Certification",
    description:
      "Foundational certification covering AWS Cloud concepts, core services (EC2, S3, RDS), security controls, and pricing models — applied directly in deploying Yojna Setu on AWS EC2.",
    certificateUrl:
      "https://drive.google.com/file/d/1_eiCRXeDsavFe0KLQ0MRZbmvYeNuTgy4/view",
  },
  {
    id: "walmart-swe-simulation",
    title: "Advanced Software Engineering Job Simulation",
    issuer: "Walmart Global Tech (Forage)",
    description:
      "Simulated software engineering tasks including relational system design, data structure optimization, and backend debugging.",
    certificateUrl:
      "https://drive.google.com/file/d/1cPBkED0kVAYWTF4LU-dZhMWap4H8Frr8/view",
  },
  {
    id: "softpro-java-spring",
    title: "Java with Spring Boot Internship",
    issuer: "Soft Pro",
    description:
      "Completion certificate for backend internship developing RESTful APIs with Java, Spring Boot, Hibernate ORM, and MySQL following clean MVC architecture.",
    certificateUrl:
      "https://drive.google.com/file/d/1KmW_xZv7xv9pjj2SH0k3hvzHvs_ZrNS9/view",
  },
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: "Backend Engineering",
    description: "Server architecture, API design, and domain business logic in Java & Spring Boot.",
    skills: [
      { name: "Java", icon: "/images/tech/java.svg", tier: "Core" },
      { name: "Spring Boot", icon: "/images/tech/spring.svg", tier: "Core" },
      { name: "REST APIs", tier: "Core" },
      { name: "MVC Architecture", tier: "Core" },
      { name: "Hibernate ORM", icon: "/images/tech/hibernate.svg", tier: "Working" },
      { name: "Spring Security", tier: "Working" },
    ],
  },
  {
    title: "AI & Automation",
    description: "Conversational workflows, prompt engineering, and tool calling with LLM APIs.",
    skills: [
      { name: "Groq API (Llama 3)", tier: "Core" },
      { name: "Twilio WhatsApp API", tier: "Core" },
      { name: "Prompt Engineering", tier: "Core" },
      { name: "Tool Calling", tier: "Working" },
      { name: "LangChain4j", tier: "Exposure" },
      { name: "Python", icon: "/images/tech/python.svg", tier: "Exposure" },
    ],
  },
  {
    title: "Databases & Storage",
    description: "Relational modeling, indexing, and transactional data persistence.",
    skills: [
      { name: "MySQL", icon: "/images/tech/mysql.webp", tier: "Core" },
      { name: "PostgreSQL", tier: "Working" },
      { name: "Supabase", tier: "Working" },
      { name: "Redis", tier: "Exposure" },
    ],
  },
  {
    title: "Frontend & Web",
    description: "Component-driven user interfaces, state management, and responsive styling.",
    skills: [
      { name: "React", icon: "/images/tech/react.webp", tier: "Working" },
      { name: "TypeScript", icon: "/images/tech/typescript.webp", tier: "Working" },
      { name: "Tailwind CSS", tier: "Working" },
      { name: "Next.js", icon: "/images/tech/next1.webp", tier: "Working" },
      { name: "JavaScript", icon: "/images/tech/javascript.webp", tier: "Working" },
    ],
  },
  {
    title: "Real-Time & Creative Web",
    description: "WebSocket communication, 3D viewport canvas, and micro-interactions.",
    skills: [
      { name: "WebSockets (STOMP/SockJS)", tier: "Working" },
      { name: "Three.js", tier: "Exposure" },
      { name: "GSAP", tier: "Exposure" },
      { name: "Motion", tier: "Exposure" },
    ],
  },
  {
    title: "Cloud, DevOps & Tools",
    description: "Deployment, testing, containerization, and version control workflows.",
    skills: [
      { name: "Git & GitHub", tier: "Core" },
      { name: "Maven", tier: "Core" },
      { name: "Postman", tier: "Working" },
      { name: "AWS EC2", tier: "Working" },
      { name: "Docker", tier: "Working" },
    ],
  },
];

export const SERVICES_CATALOG: ServiceItem[] = [
  {
    id: "backend-systems",
    code: "SRV-01",
    title: "Backend Systems & APIs",
    summary:
      "Implementation of RESTful APIs, domain business logic, relational database models, and authentication layers using Java and Spring Boot.",
    deliverables: [
      "RESTful API design and implementation in Java / Spring Boot",
      "Database schema modeling with PostgreSQL/MySQL & Hibernate ORM",
      "Stateless authentication via Spring Security and JWT rotation",
      "Automated unit and integration test coverage",
    ],
    engagement: "Fixed-Scope Sprints or Backend Engineering",
    subject: "Backend Systems Inquiry",
  },
  {
    id: "ai-automation",
    code: "SRV-02",
    title: "AI & Workflow Automation",
    summary:
      "Connecting conversational LLMs to backend data and messaging webhooks — from WhatsApp bots to structured tool-calling pipelines.",
    deliverables: [
      "WhatsApp bots using Twilio API and Groq LLMs",
      "Decoupled hybrid workflows (LLM understands, application code validates)",
      "Structured prompt engineering with validated JSON outputs",
      "Domain knowledge retrieval grounded in verified databases",
    ],
    engagement: "Proof-of-Concept to System Integration",
    subject: "AI & Automation Inquiry",
  },
  {
    id: "fullstack-apps",
    code: "SRV-03",
    title: "Full-Stack Web Development",
    summary:
      "Web applications combining Spring Boot backend services with responsive React or Next.js user interfaces.",
    deliverables: [
      "Clean separation of backend services and frontend SPAs",
      "Responsive React / Next.js interfaces with Tailwind CSS",
      "Event-driven updates via WebSockets (STOMP/SockJS)",
      "Server-side validation for form and payment security",
    ],
    engagement: "Full Application Builds & Enhancements",
    subject: "Full-Stack Project Inquiry",
  },
  {
    id: "creative-web",
    code: "SRV-04",
    title: "Creative Web Engineering",
    summary:
      "Editorial web interfaces with subtle motion, Three.js interactive visual viewports, and clean typography.",
    deliverables: [
      "Interactive 3D canvas integration with fallback states",
      "Micro-interactions with reduced-motion support",
      "Zero-layout-shift responsive layouts across mobile and desktop",
      "Semantic HTML5 structure and Open Graph SEO metadata",
    ],
    engagement: "Design Engineering & Web Experiences",
    subject: "Creative Web Engineering Inquiry",
  },
];

export const FOCUS_AREAS: FocusArea[] = [
  {
    id: "whatsapp-ai",
    title: "WhatsApp Assistants",
    category: "Conversational Workflows",
    description:
      "Building conversational systems on WhatsApp using Twilio, Groq, and Spring Boot for scheme discovery and lead qualification.",
  },
  {
    id: "voice-ai",
    title: "Voice-First Interfaces",
    category: "Speech Exploration",
    description:
      "Exploring multilingual voice interaction prototypes for small business owners to track inventory and sales without complex menus.",
  },
  {
    id: "rag-systems",
    title: "Domain Retrieval",
    category: "Information Grounding",
    description:
      "Grounding conversational models in verified relational data and regulatory registries rather than relying on unstructured hallucinations.",
  },
  {
    id: "automation-workflows",
    title: "Backend Automations",
    category: "System Integration",
    description:
      "Connecting LLM conversational parsing with transactional backend APIs, database writes, and external notification webhooks.",
  },
];

export const DIGITAL_PRODUCTS_PREVIEWS: DigitalProductPreview[] = [
  {
    id: "yojna-setu-blueprint",
    title: "Yojna Setu Architecture Blueprint",
    category: "agent_tools",
    status: "Case Study",
    summary:
      "Open case study & architectural reference for decoupled WhatsApp assistants combining Groq NLP extraction with deterministic Java rules engines.",
    tech: ["Java 21", "Spring Boot", "Groq", "Twilio", "PostgreSQL"],
    link: "/projects/yojna-setu",
  },
  {
    id: "spring-boot-starter-kit",
    title: "Spring Boot 3 API Boilerplate",
    category: "boilerplates",
    status: "In Development",
    summary:
      "A structured backend starter kit featuring Spring Security 6, JWT rotation, database migrations, rate limiting, and clean MVC architecture.",
    tech: ["Java 17", "Spring Boot 3", "PostgreSQL", "JJWT", "Docker"],
  },
  {
    id: "editorial-portfolio-kit",
    title: "Editorial Developer Portfolio Kit",
    category: "templates",
    status: "In Development",
    summary:
      "A typographic, Swiss-inspired Next.js portfolio template built with Tailwind CSS, micro-interactions, accessible components, and zero AI fluff.",
    tech: ["Next.js 16", "React 19", "Tailwind CSS", "TypeScript"],
  },
];
