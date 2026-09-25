export interface YojnaSetuMetric {
  value: string;
  label: string;
  sublabel: string;
  detail?: string;
}

export interface YojnaSetuAuditItem {
  id: string;
  category: string;
  legacyV1: string;
  hardenedV2: string;
}

export interface YojnaSetuTestGroup {
  name: string;
  count: number;
  description: string;
}

export interface YojnaSetuTestCategory {
  className: string;
  testCount: number;
  focus: string;
}

export interface YojnaSetuDemoScenario {
  id: string;
  title: string;
  persona: string;
  demographics: {
    age: number;
    state: string;
    gender: string;
    caste: string;
    occupation: string;
    annualIncome: string;
    religion: string;
  };
  samplePrompt: string;
  extractedSlots: Record<string, string | number>;
  matchedSchemes: Array<{
    name: string;
    category: "Central" | "State" | "Philanthropic";
    benefit: string;
    eligibilityReason: string;
    documentsRequired: string[];
    deadline?: string;
  }>;
}

export const YOJNA_SETU_DATA = {
  id: "yojna-setu",
  slug: "yojna-setu",
  title: "Yojna Setu",
  editionCode: "YS-V2",
  projectYear: 2026,
  category: "Backend Systems · AI Security",
  status: "Release Ready With Documented Conditions",
  role: "Architecture · Backend · Security · AI Integration",
  summary:
    "A multilingual government scheme discovery system. AI extracts user profile details from conversational messages, while deterministic Java rules evaluate eligibility over 82 normalized schemes.",
  coverImageUrl: "/images/projects/yojna-setu/cover.svg",
  githubUrl: "https://github.com/shivam-shukla888/Yojna-Setu",
  repoNote: "Backend repository pending public release.",

  techStack: [
    "Java 21",
    "Spring Boot 3.2.12",
    "PostgreSQL 17",
    "Supabase",
    "Groq Cloud",
    "Whisper Turbo",
    "Twilio Boundary",
    "Flyway",
    "Bucket4j",
    "Docker",
  ],

  metrics: [
    {
      value: "82",
      label: "NORMALIZED SCHEMES",
      sublabel: "63 Central · 11 State · 8 Philanthropic",
      detail: "Seeded into 1NF relational schema on Supabase PostgreSQL 17.",
    },
    {
      value: "42/42",
      label: "AUTOMATED TESTS PASSING",
      sublabel: "42 Passing Tests Across Core Suites",
      detail: "Backend release-gate verification recorded 42/42 passing tests.",
    },
    {
      value: "0 / 0",
      label: "CRITICAL & HIGH FINDINGS",
      sublabel: "0 Critical / High Findings in Final Security Audit",
      detail: "Verified in release-gate security audit with zero high-severity findings.",
    },
    {
      value: "<1 ms",
      label: "OBSERVED DIRECT SQL QUERY",
      sublabel: "Supabase PostgreSQL 17 Indexed Execution",
      detail:
        "<1 ms reflects observed direct SQL query execution in the verification environment, not end-to-end application latency.",
    },
  ] as YojnaSetuMetric[],

  evidenceAssets: [
    {
      id: "evidence-01",
      title: "Intake & Multi-Variable Demographic Extraction",
      eyebrow: "EVIDENCE 01 // WHATSAPP CONVERSATIONAL INTERACTION",
      src: "/images/projects/yojna-setu/evidence-whatsapp-discovery.png",
      width: 907,
      height: 1600,
      alt: "Historical Yojna Setu WhatsApp interaction showing multilingual profile intake, missing-gender clarification and scheme recommendations.",
      caption:
        "Historical Product Interaction — Captured during original prototype conversational testing.",
      observation:
        "The user triggers a session reset and inputs multi-variable demographic parameters in conversational Hinglish ('namaste, main ek student hoon, 20 saal, UP se, general hoon, income 1.5 lakh , hindu'). The engine extracts the attributes, identifies the missing gender slot, asks for clarification ('Aap purush hain ya mahila?'), and recommends 5 matched schemes upon receiving 'Purush'.",
    },
    {
      id: "evidence-02",
      title: "Temporal Deadlines & Prerequisite Documentation",
      eyebrow: "EVIDENCE 02 // WHATSAPP CONVERSATIONAL INTERACTION",
      src: "/images/projects/yojna-setu/evidence-whatsapp-documents.png",
      width: 896,
      height: 1600,
      alt: "Historical Yojna Setu WhatsApp interaction showing deadline retrieval and document requirements.",
      caption:
        "Historical Product Interaction — Captured during original prototype conversational testing.",
      observation:
        "The user inquires about deadlines by messaging 'Deadline', receiving upcoming dates for UP Mukhyamantri Abhyudaya Yojana. Following with 'Documents', the system delivers the exact documentation checklist required across matching schemes (Aadhaar Card, Ration Card, Income Certificate, Class 12 Marksheet, Admission Letter).",
    },
  ],

  forensicAudit: [
    {
      id: "sec-01",
      category: "Credential Security",
      legacyV1:
        "Plaintext database credentials committed directly in startup shell scripts (start-app.sh).",
      hardenedV2:
        "Environment-based secrets with strict startup validation and complete Git history cleanup.",
    },
    {
      id: "sec-02",
      category: "Eligibility Matching Logic",
      legacyV1:
        "Brittle substring evaluation: scheme.getGender().contains(\"MALE\") erroneously returned true for \"FEMALE\".",
      hardenedV2:
        "Deterministic relational rules (EligibilityEngine) using typed enums and database join criteria.",
    },
    {
      id: "sec-03",
      category: "Media & SSRF Defense",
      legacyV1:
        "Unvalidated remote media downloads allowing potential SSRF against private networks and metadata endpoints.",
      hardenedV2:
        "SSRF protection: HTTPS enforcement, Twilio host allowlist, private IP blocking, and bounded streaming.",
    },
    {
      id: "sec-04",
      category: "Conversation State",
      legacyV1:
        "In-memory ConcurrentHashMap causing state loss across server restarts and cross-thread concurrency issues.",
      hardenedV2:
        "Persistent database-backed conversation state machine (ConversationSession) with session recovery.",
    },
    {
      id: "sec-05",
      category: "Webhook Idempotency",
      legacyV1:
        "Retried provider webhooks generated duplicate outbound messages and corrupted multi-step state.",
      hardenedV2:
        "Idempotency layer: in-memory cache backed by unique constraints on webhook_events in PostgreSQL.",
    },
  ] as YojnaSetuAuditItem[],

  testCategories: [
    {
      name: "Eligibility Rules",
      count: 6,
      description: "Deterministic age bounds, income ceilings, gender matching, and state residency rules.",
    },
    {
      name: "Webhook Security",
      count: 7,
      description: "HMAC signature verification, replay protection, and provider response formatting.",
    },
    {
      name: "Media / SSRF Security",
      count: 16,
      description: "Host allowlisting, private IP blocking, 5MB bounded streaming, and redirect re-validation.",
    },
    {
      name: "Conversation Flow",
      count: 13,
      description: "Multi-turn state transitions, slot clarification, legacy endpoint removal, and container startup.",
    },
  ] as YojnaSetuTestGroup[],

  testingMatrix: [
    {
      className: "MediaUrlSecurityValidatorTest",
      testCount: 12,
      focus: "SSRF prevention, private IP blocking, AWS metadata endpoint blocking, and host allowlist validation.",
    },
    {
      className: "EligibilityEngineTest",
      testCount: 6,
      focus: "Deterministic rules evaluation: age bounds, income limits, gender matching, and state residency criteria.",
    },
    {
      className: "TwilioWebhookHardeningTest",
      testCount: 5,
      focus: "Replay attack defense, HMAC signature verification, and idempotency guarantees.",
    },
    {
      className: "AdminSchemeSecurityTest",
      testCount: 4,
      focus: "Admin endpoint authentication, API key validation, and IDOR protection.",
    },
    {
      className: "ConversationOrchestratorTest",
      testCount: 4,
      focus: "State machine transitions, multi-turn demographic accumulation, and slot clarification prompts.",
    },
    {
      className: "LegacyRouteEliminationTest",
      testCount: 4,
      focus: "Verification that deprecated and unauthenticated prototype endpoints return HTTP 404/410.",
    },
    {
      className: "SafeMediaDownloadServiceTest",
      testCount: 4,
      focus: "5MB stream bounding, MIME type enforcement, and redirect re-validation.",
    },
    {
      className: "TwilioWebhookControllerTest",
      testCount: 2,
      focus: "Inbound payload deserialization and provider response formatting.",
    },
    {
      className: "YojnaSetuApplicationTests",
      testCount: 1,
      focus: "Spring Boot 3.2 container startup and dependency injection context verification.",
    },
  ] as YojnaSetuTestCategory[],

  releaseConditions: {
    verified: [
      "Supabase PostgreSQL 17 live connectivity and yojna_setu schema isolation.",
      "82 normalized welfare schemes seeded with relational child tables.",
      "Groq Cloud AI connectivity for multilingual demographic extraction (gpt-oss-20b).",
      "Whisper Large V3 Turbo connectivity for voice-note transcription.",
      "42/42 automated unit, integration, and security tests passing.",
      "Historical plaintext credentials completely expunged from reachable repository history.",
      "Strict PII log masking and blind-indexed phone storage verified.",
    ],
    documentedConditions: [
      {
        area: "Twilio WhatsApp Delivery",
        status: "NOT VERIFIED IN PRODUCTION",
        description:
          "Live production WhatsApp delivery over Twilio was not verified with live carrier traffic due to sandbox constraints. Webhook reception, HMAC verification, and response serialization are fully verified via automated suites.",
      },
      {
        area: "Database Authorization (RLS)",
        status: "NOT IMPLEMENTED AT DB LAYER",
        description:
          "PostgreSQL Row Level Security (RLS) is not currently implemented on the database tables; all access authorization is enforced strictly within the Spring Boot application service layer via authenticated database roles.",
      },
      {
        area: "Rate Limiting Architecture",
        status: "PROCESS-LOCAL ONLY",
        description:
          "Bucket4j rate-limiting tokens are stored in local JVM memory. While effective for single-instance deployments, horizontal scaling across multiple instances requires a centralized Redis token bucket.",
      },
    ],
  },

  demoScenarios: [
    {
      id: "up-farmer",
      title: "UP Female Smallholder Farmer",
      persona: "Rural smallholder farmer in Uttar Pradesh seeking agricultural and health security.",
      samplePrompt: "Namaste, main 34 saal ki mahila hoon, UP se. Main kisan hoon aur meri saalana aamdani 75000 rupaye hai. OBC category.",
      demographics: {
        age: 34,
        state: "Uttar Pradesh",
        gender: "Female",
        caste: "OBC",
        occupation: "Farmer",
        annualIncome: "₹75,000",
        religion: "Hindu",
      },
      extractedSlots: {
        age: 34,
        state: "Uttar Pradesh",
        gender: "FEMALE",
        caste: "OBC",
        occupation: "FARMER",
        annual_income: 75000,
        religion: "HINDU",
      },
      matchedSchemes: [
        {
          name: "PM-KISAN Samman Nidhi",
          category: "Central",
          benefit: "Direct income support of ₹6,000 per year in three installments for landholding farmer families.",
          eligibilityReason: "Active farmer, landholding criteria satisfied, income within prescribed ceiling.",
          documentsRequired: ["Aadhaar Card", "Land Ownership Proof (Khasra/Khatauni)", "Bank Passbook"],
          deadline: "Rolling Annual Enrollment",
        },
        {
          name: "Ayushman Bharat PMJAY",
          category: "Central",
          benefit: "Health insurance cover of up to ₹5,00,000 per family per year for secondary and tertiary hospitalization.",
          eligibilityReason: "Low-income rural household meeting deprivation criteria.",
          documentsRequired: ["Aadhaar Card", "Ration Card", "Income Certificate"],
        },
        {
          name: "UP Mahila Samarthya Yojana",
          category: "State",
          benefit: "Financial and technical support for rural women self-help groups and agrarian enterprises.",
          eligibilityReason: "Female resident of Uttar Pradesh engaged in agrarian micro-enterprise.",
          documentsRequired: ["Aadhaar Card", "UP Domicile Certificate", "Bank Account Details"],
        },
      ],
    },
    {
      id: "maharashtra-student",
      title: "Maharashtra Undergraduate Student",
      persona: "College student pursuing higher technical education in Maharashtra.",
      samplePrompt: "Hello, I am a 20 year old male student from Maharashtra, general category, family income 1.8 Lakh per annum.",
      demographics: {
        age: 20,
        state: "Maharashtra",
        gender: "Male",
        caste: "General",
        occupation: "Student",
        annualIncome: "₹1,80,000",
        religion: "Hindu",
      },
      extractedSlots: {
        age: 20,
        state: "Maharashtra",
        gender: "MALE",
        caste: "GENERAL",
        occupation: "STUDENT",
        annual_income: 180000,
      },
      matchedSchemes: [
        {
          name: "Central Sector Scholarship for College and University Students",
          category: "Central",
          benefit: "Financial assistance of ₹12,000 per year at graduation level for higher education.",
          eligibilityReason: "Student enrolled in degree course, age 18–25, family income below ₹4.5 Lakh.",
          documentsRequired: ["Aadhaar Card", "Class 12 Marksheet", "Income Certificate", "Admission Letter", "Bank Passbook"],
          deadline: "31 October 2026",
        },
        {
          name: "Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh Shishyavrutti Yojna",
          category: "State",
          benefit: "50% tuition and exam fee reimbursement for economically weaker students in professional courses.",
          eligibilityReason: "Resident of Maharashtra, family income <= ₹8 Lakh, enrolled in recognized professional college.",
          documentsRequired: ["Maharashtra Domicile Certificate", "Income Certificate", "College Fee Receipt", "CAP Allotment Letter"],
          deadline: "15 November 2026",
        },
        {
          name: "PM Vidya Lakshmi Education Loan Scheme",
          category: "Central",
          benefit: "Interest subsidy on education loans for technical and professional higher education courses.",
          eligibilityReason: "Admitted to higher education institution, family income under ₹4.5 Lakh.",
          documentsRequired: ["Admission Letter", "Fee Structure Breakdown", "Aadhaar Card", "Income Certificate"],
        },
      ],
    },
    {
      id: "senior-citizen",
      title: "Senior Citizen Pensioner",
      persona: "68-year-old retired citizen seeking old-age social security and medical support.",
      samplePrompt: "Pranam, meri umar 68 saal hai, Bihar se hoon, koi regular income nahi hai, BPL card dharak.",
      demographics: {
        age: 68,
        state: "Bihar",
        gender: "Male",
        caste: "SC",
        occupation: "Retired / Unemployed",
        annualIncome: "₹0 (BPL)",
        religion: "Hindu",
      },
      extractedSlots: {
        age: 68,
        state: "Bihar",
        occupation: "UNEMPLOYED",
        annual_income: 0,
        bpl_status: true,
      },
      matchedSchemes: [
        {
          name: "Indira Gandhi National Old Age Pension Scheme (IGNOAPS)",
          category: "Central",
          benefit: "Monthly social security pension of ₹500 directly transferred to bank account.",
          eligibilityReason: "Age 60+, living below the poverty line (BPL).",
          documentsRequired: ["Aadhaar Card", "Age Proof Certificate", "BPL Ration Card", "Bank Passbook"],
        },
        {
          name: "Ayushman Bharat PMJAY Senior Citizen Scheme",
          category: "Central",
          benefit: "Universal health cover of ₹5,00,000 dedicated for citizens aged 70 and above, regardless of income.",
          eligibilityReason: "Senior citizen approaching universal benefit threshold, immediate BPL coverage applies.",
          documentsRequired: ["Aadhaar Card", "Age Verification Document", "Ration Card"],
        },
        {
          name: "Mukhyamantri Vridhjan Pension Yojana (Bihar)",
          category: "State",
          benefit: "Monthly pension of ₹400 for elderly persons aged 60+ residing in Bihar.",
          eligibilityReason: "Bihar resident aged 60+, not receiving any other government pension.",
          documentsRequired: ["Bihar Domicile Certificate", "Aadhaar Card", "Bank Account Details"],
        },
      ],
    },
  ] as YojnaSetuDemoScenario[],
};
