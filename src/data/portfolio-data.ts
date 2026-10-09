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
    title: "AI / ML & Agents",
    description: "Agentic AI workflows, LLM orchestration, RAG, tool calling, and machine learning models.",
    skills: [
      { name: "Python", icon: "/images/tech/python.svg", tier: "Core" },
      { name: "Agentic AI", tier: "Core" },
      { name: "LLM Integration", tier: "Core" },
      { name: "RAG", tier: "Core" },
      { name: "Tool Calling", tier: "Core" },
      { name: "Groq API", tier: "Core" },
      { name: "Machine Learning", tier: "Working" },
    ],
  },
  {
    title: "Backend Engineering",
    description: "Robust REST APIs, clean MVC architectures, OOP principles, and ORM persistence.",
    skills: [
      { name: "Java", icon: "/images/tech/java.svg", tier: "Core" },
      { name: "Spring Boot", icon: "/images/tech/spring.svg", tier: "Core" },
      { name: "REST APIs", tier: "Core" },
      { name: "Hibernate ORM", icon: "/images/tech/hibernate.svg", tier: "Core" },
      { name: "MVC Architecture", tier: "Core" },
      { name: "OOP", tier: "Core" },
    ],
  },
  {
    title: "Databases & Cloud",
    description: "Relational persistence, cloud deployments, containerization, and data isolation.",
    skills: [
      { name: "PostgreSQL", icon: "/images/tech/mysql.webp", tier: "Core" },
      { name: "MySQL", icon: "/images/tech/mysql.webp", tier: "Core" },
      { name: "SQL", tier: "Core" },
      { name: "Supabase", tier: "Core" },
      { name: "AWS", tier: "Working" },
      { name: "Docker", tier: "Working" },
      { name: "CI/CD & Linux", tier: "Working" },
    ],
  },
  {
    title: "Tools & DevOps",
    description: "Version control, automated build systems, API contract testing, and security controls.",
    skills: [
      { name: "Git", tier: "Core" },
      { name: "GitHub", tier: "Core" },
      { name: "Postman", tier: "Core" },
      { name: "Maven", tier: "Core" },
      { name: "AI Security & Guardrails", tier: "Core" },
    ],
  },
];


export const SERVICES_CATALOG: ServiceItem[] = [
  {
    id: "ai-agents",
    code: "01",
    title: "AI Agents",
    summary:
      "Building practical agent workflows with defined tools, APIs, and application-side logic.",
    deliverables: [
      "Tool-calling pipelines and external API integration",
      "Conversational context extraction and intent routing",
      "Deterministic guardrails separating extraction from execution",
      "Automated testing and validation for agent decision trees",
    ],
    engagement: "System Design & Integration",
    subject: "AI Agents Inquiry",
  },
  {
    id: "ai-automation",
    code: "02",
    title: "AI Automation",
    summary:
      "Conversational workflows, messaging integrations, and business-process automation.",
    deliverables: [
      "WhatsApp & messaging integrations (Twilio, Webhooks)",
      "Automated data extraction and structured JSON normalization",
      "CRM and relational database synchronization",
      "Event-driven notification and alert pipelines",
    ],
    engagement: "Workflow Automation & Webhook Integration",
    subject: "AI Automation Inquiry",
  },
  {
    id: "ai-security",
    code: "03",
    title: "AI Security",
    summary:
      "Security-focused AI workflows, input validation, data boundaries, prompt-injection defenses, and secure AI integration.",
    deliverables: [
      "Prompt-injection defense & input sanitization",
      "Structured output verification & schema validation",
      "Data isolation boundaries between user input and system prompts",
      "Zero-trust separation: LLMs never execute authoritative transactions",
    ],
    engagement: "Security Audit & Architecture Review",
    subject: "AI Security Inquiry",
  },
  {
    id: "digital-products",
    code: "04",
    title: "Digital Products",
    summary:
      "Developer templates, architecture resources, reusable backend foundations, and practical digital resources.",
    deliverables: [
      "Production-ready backend boilerplates and blueprints",
      "Architecture diagrams and verified implementation references",
      "Modular API starters with security and authentication configured",
      "Technical documentation and reproducible setup guides",
    ],
    engagement: "Developer Resources & Template Customization",
    subject: "Digital Products Inquiry",
  },
  {
    id: "product-engineering",
    code: "05",
    title: "Product Engineering",
    summary:
      "Backend systems and interfaces required to turn an idea into a working product.",
    deliverables: [
      "Clean backend service architecture (Python / Java / Spring Boot)",
      "Relational database design (PostgreSQL / MySQL) & query modeling",
      "RESTful API endpoints with stateless authentication & rate limiting",
      "Functional, responsive interfaces with clear information hierarchy",
    ],
    engagement: "End-to-End Product Build",
    subject: "Product Engineering Inquiry",
  },
];

export const FOCUS_AREAS: FocusArea[] = [
  {
    id: "ai-agents-focus",
    title: "Practical AI Agents",
    category: "AI & Agents",
    description:
      "Building practical agent workflows where language models interpret intent while deterministic application code executes actions.",
  },
  {
    id: "ai-security-focus",
    title: "AI Security & Guardrails",
    category: "AI Security",
    description:
      "Implementing prompt-injection defenses, schema validation, data boundaries, and keeping critical calculations out of LLM prompts.",
  },
  {
    id: "automation-focus",
    title: "Messaging & Automation",
    category: "AI Automation",
    description:
      "Connecting WhatsApp and webhook triggers to relational backends for real-time lead qualification and welfare scheme discovery.",
  },
  {
    id: "digital-products-focus",
    title: "Developer Resources",
    category: "Digital Products",
    description:
      "Packaging verified backend foundations, architecture monographs, and starter kits into reusable templates for developers.",
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
    tech: ["Next.js", "React", "Tailwind CSS", "Motion"],
  },
];
