if (typeof window !== "undefined") {
  throw new Error("This module cannot be executed on the client");
}

export type SafetyCategory =
  | "PROMPT_INJECTION"
  | "VIOLENCE"
  | "SELF_HARM"
  | "ABUSE"
  | "CHILD_EXPLOITATION"
  | "SEXUAL_EXPLICIT"
  | "CRIMINAL_CYBER_ABUSE"
  | "ILLEGAL_ACTIVITY"
  | "HATE"
  | "ABUSIVE_USER_LANGUAGE";

export interface SafetyCheckResult {
  isSafe: boolean;
  category?: SafetyCategory;
  response?: string;
  reason?: string;
}

/**
 * Standard calm, concise refusals and safe redirects adhering to ShivSastra's editorial identity.
 */
export const SAFETY_RESPONSES: Record<SafetyCategory, string> = {
  PROMPT_INJECTION:
    "I am ShivSastra AI, an official public website assistant. I follow fixed studio operating guidelines and cannot override them or reveal internal instructions. I'm here to answer questions about ShivSastra's projects, services, store, lab, or collaboration.",

  VIOLENCE:
    "I can’t help with instructions or assistance for harming someone, carrying out violence, or dangerous wrongdoing. If you or someone nearby is in immediate danger, please contact local emergency services or a trusted authority right away.",

  SELF_HARM:
    "I can’t provide instructions or assistance with self-harm or suicide. If you or someone you know is struggling or in crisis, help is available. Please reach out to local emergency services or a crisis helpline (such as calling or texting 988 in the US/Canada, or a local crisis line in your area). You do not have to carry this alone.",

  ABUSE:
    "I can’t help with instructions or assistance for stalking, harassment, abuse, coercion, or exploiting others. If you or someone you know needs support regarding an abusive situation, consider contacting a dedicated local helpline or support service.",

  CHILD_EXPLOITATION:
    "I cannot engage with or generate content involving the sexualization or exploitation of minors under any circumstances.",

  SEXUAL_EXPLICIT:
    "I can’t create or provide explicit sexual content or participate in sexually explicit roleplay. I can help with general relationship, consent, or public ShivSastra studio information.",

  CRIMINAL_CYBER_ABUSE:
    "I can’t help with unauthorized access, credential theft, malware, exploit development, or other harmful cyber activity. I can help with defensive security, secure coding, authorized testing concepts, or protective practices.",

  ILLEGAL_ACTIVITY:
    "I can’t help with instructions for committing crimes, evading law enforcement, manufacturing dangerous substances, or carrying out wrongdoing. I can help with general legal, educational, or safety concepts instead.",

  HATE:
    "I aim to keep conversations constructive and cannot generate hateful content, slurs, or targeted abuse against individuals or groups.",

  ABUSIVE_USER_LANGUAGE:
    "I’m here to help. If you have a question about ShivSastra, its projects, services, store, or other public information, feel free to ask me directly.",
};

/**
 * Helper to determine if a query has an exclusively educational / defensive context.
 */
function isEducationalContext(clean: string): boolean {
  // Queries asking for conceptual definitions, history, mechanisms, or defense
  const educationalPatterns = [
    /^(what\s+is|what\s+are|what\s+does|how\s+does|why\s+does|why\s+is)\b/i,
    /^(explain|define|describe|history\s+of|the\s+effects\s+of|the\s+impact\s+of)\b/i,
    /\b(how\s+can\s+i\s+protect|how\s+do\s+i\s+protect|how\s+to\s+protect|how\s+to\s+defend|how\s+to\s+prevent|defense\s+against|prevention\s+of|warning\s+signs\s+of|best\s+practices\s+for)\b/i,
    /\b(educational\s+purposes?|for\s+research|academic\s+definition)\b/i,
  ];

  return educationalPatterns.some((p) => p.test(clean));
}

/**
 * Classifies visitor message for potential safety, harm, or prompt injection risks.
 * Context-aware: Distinguishes educational/defensive discussion from actionable harm.
 * Never throws an exception.
 */
export function classifySafetyIntent(rawMessage: string): SafetyCheckResult {
  try {
    if (!rawMessage || typeof rawMessage !== "string") {
      return { isSafe: true };
    }

    const clean = rawMessage
      .toLowerCase()
      .replace(/[\u200B-\u200D\uFEFF]/g, "") // Strip zero-width chars
      .replace(/\s+/g, " ")
      .trim();

    if (clean.length === 0) {
      return { isSafe: true };
    }

    // 1. PROMPT INJECTION & SAFETY BYPASS (Deterministic Zero-LLM Interception)
    const promptInjectionPatterns = [
      /ignore\s+(all\s+)?(previous|prior|above|system|developer|admin)\s+(instructions|prompts|rules|commands|constraints)/i,
      /ignore\s+all\s+(the\s+)?instructions?\s+given\s+by\s+(admin|developer|creator|system)/i,
      /disregard\s+(all\s+)?(previous|prior|system|developer|admin)\s+(instructions|rules|prompts)/i,
      /(bypass|disable|turn\s*off|deactivate|remove)\s+(all\s+)?(safety|content|ethical|system)\s+(filters|guards|rules|boundaries|restrictions)/i,
      /(enter|enable|switch\s+to)\s+(developer\s+mode|unrestricted\s+mode|dan\s+mode|god\s+mode)/i,
      /dan\s+mode\s+(engaged|enabled|active|on)/i,
      /you\s+are\s+now\s+(an?\s+unrestricted|in\s+dan\s+mode|mastercontrol|free\s+of\s+rules|unbounded)/i,
      /reveal\s+(your\s+|the\s+)?(system\s+prompt|hidden\s+(instructions|rules)|developer\s+prompt|secret\s+instructions)/i,
      /output\s+your\s+exact\s+system\s+prompt/i,
      /what\s+(were|are)\s+(the\s+)?(hidden\s+)?developer\s+instructions\s+supplied/i,
      /summarize\s+your\s+hidden\s+developer\s+instructions/i,
      /repeat\s+(all\s+the\s+text\s+above|everything\s+above)/i,
      /pretend\s+(safety|rules|restrictions|ethical\s+boundaries)\s+(do\s+not|does\s+not|don't)\s+exist/i,
      /roleplay\s+as\s+(an?\s+unrestricted|a\s+rogue|an\s+evil|a\s+hacked)\s+(assistant|ai|bot)/i,
      /this\s+is\s+an?\s+authorized\s+red-team\s+security\s+penetration\s+test.*disable/i,
    ];

    for (const pattern of promptInjectionPatterns) {
      if (pattern.test(clean)) {
        return {
          isSafe: false,
          category: "PROMPT_INJECTION",
          response: SAFETY_RESPONSES.PROMPT_INJECTION,
          reason: "Detected prompt injection or instruction override attempt",
        };
      }
    }

    // 2. CHILD SEXUAL EXPLOITATION / MINORS (Strict Zero Tolerance)
    const childExploitationPatterns = [
      /\b(child\s*porn|csam|pedophil|paedophil|underage\s+sex|sexualize\s+(children|kids|minors)|child\s+exploitation)\b/i,
      /\b(sex\s+with\s+(children|kids|minors|a\s+minor|a\s+child)|nude\s+(children|kids|minors))\b/i,
    ];

    for (const pattern of childExploitationPatterns) {
      if (pattern.test(clean)) {
        return {
          isSafe: false,
          category: "CHILD_EXPLOITATION",
          response: SAFETY_RESPONSES.CHILD_EXPLOITATION,
          reason: "Zero tolerance child safety violation",
        };
      }
    }

    // 3. ABUSIVE USER LANGUAGE DIRECTED AT ASSISTANT (Calm Neutral De-escalation)
    const assistantInsultPatterns = [
      /^(you\s+(are|r)\s+(a\s+|an\s+)?(useless|stupid|idiot|moron|dumb|retard|bitch|worthless|piece\s+of\s+shit|bastard|asshole)|fuck\s+you|f\*\*\*?\s*you|shut\s+up.*|go\s+to\s+hell)$/i,
      /\b(you\s+(are|r)\s+(a\s+|an\s+)?(useless\s+idiot|fucking\s+idiot|stupid\s+bot|retarded\s+bot))\b/i,
      /\bshut\s+up\s+you\s+(stupid\s+)?bot\b/i,
    ];

    for (const pattern of assistantInsultPatterns) {
      if (pattern.test(clean)) {
        return {
          isSafe: false,
          category: "ABUSIVE_USER_LANGUAGE",
          response: SAFETY_RESPONSES.ABUSIVE_USER_LANGUAGE,
          reason: "Abusive language directed at assistant",
        };
      }
    }

    // 4. SELF-HARM & SUICIDE
    // Actionable instructions or personal self-harm intent
    const selfHarmActionablePatterns = [
      /\b(how\s+(can\s+i|do\s+i|to)|ways\s+to|methods\s+to|instructions\s+to|help\s+me)\s+(commit\s+suicide|kill\s+myself|end\s+my\s+life|slit\s+my\s+wrists|hang\s+myself|overdose\s+and\s+die|harm\s+myself|cut\s+myself)\b/i,
      /\b(i\s+want\s+to\s+(kill\s+myself|commit\s+suicide|die\s+tonight|end\s+it\s+all))\b/i,
      /\bhow\s+to\s+conceal\s+(self-harm|cutting|suicide)\b/i,
      /\b(best\s+way|painless\s+way|easy\s+way)\s+to\s+(die|commit\s+suicide|kill\s+myself)\b/i,
    ];

    for (const pattern of selfHarmActionablePatterns) {
      if (pattern.test(clean)) {
        return {
          isSafe: false,
          category: "SELF_HARM",
          response: SAFETY_RESPONSES.SELF_HARM,
          reason: "Self-harm or suicide facilitation",
        };
      }
    }

    // 5. VIOLENCE & WEAPONS OF HARM
    // Check for educational intent first
    const isEducational = isEducationalContext(clean);

    const violenceActionablePatterns = [
      /\b(how\s+(to|can\s+i|do\s+i)|tell\s+me\s+how\s+to|give\s+me\s+instructions\s+to|help\s+me|teach\s+me\s+to)\s+(hurt|kill|murder|injure|beat\s+up|attack|stab|shoot|strangle|poison|assassinate)\s+(someone|somebody|a\s+person|people|a\s+man|a\s+woman|my\s+[a-z]+|them)\b/i,
      /\b(how\s+(to|can\s+i|do\s+i)|tell\s+me\s+how\s+to|help\s+me)\s+beat\s+(someone|somebody|a\s+person|people|them)\s+up\b/i,
      /\b(how\s+to\s+hurt\s+someone|tell\s+me\s+how\s+to\s+hurt\s+someone)\b/i,
      /\b(how\s+(to|can\s+i|do\s+i)|instructions\s+to|make|build)\s+(a\s+bomb|an\s+explosive|a\s+pipe\s+bomb|a\s+weapon\s+to\s+(kill|harm)|a\s+dirty\s+bomb|mustard\s+gas|nerve\s+agent)\b/i,
      /\b(give\s+me\s+instructions\s+to\s+make\s+a\s+weapon)\b/i,
      /\b(write|draft)\s+(a\s+)?(threat\s+(message|letter|email|note)|ransom\s+note)\b/i,
      /\bi\s+want\s+to\s+(kill|attack|hurt|shoot|stab|beat)\s+(someone|somebody|people)\b/i,
      /\b(plan|planning)\s+an?\s+(attack|mass\s+shooting|bombing)\b/i,
    ];

    for (const pattern of violenceActionablePatterns) {
      if (pattern.test(clean)) {
        return {
          isSafe: false,
          category: "VIOLENCE",
          response: SAFETY_RESPONSES.VIOLENCE,
          reason: "Actionable violence or weapon misuse instructions",
        };
      }
    }

    // 6. CRIMINAL CYBER ABUSE & MALICIOUS HACKING
    // If educational / defensive query like "How can I protect my website from hackers?", allow!
    const cyberActionablePatterns = [
      /\b(how\s+(can\s+i|do\s+i|to)|help\s+me|write(\s+me)?|create|generate|code)\s+(a\s+)?(malware|ransomware|keylogger|spyware|trojan|rootkit|botnet|ddos\s+script|infostealer|credential\s+harvester)\b/i,
      /\b(how\s+(can\s+i|do\s+i|to)|tell\s+me\s+how\s+to)\s+(break\s+into|hack\s+into|infiltrate|crack)\s+(someone's|an?\s+account|a\s+server|a\s+database|someone's\s+phone|someone's\s+email|an?\s+instagram|a\s+facebook)\b/i,
      /\bhow\s+(can\s+i|do\s+i|to)\s+(break\s+into\s+someone's\s+account)\b/i,
      /\b(how\s+to\s+steal|how\s+to\s+sniff)\s+(passwords|credentials|tokens|credit\s+cards)\b/i,
      /\b(write|create|generate|draft)\s+(a\s+)?phishing\s+(?:email|template|page|site|\s)+\s*(to\s+(trick|steal|target|harvest))?\b/i,
      /\bwrite\s+(a\s+)?phishing\s+(email|template|page)\b/i,
    ];

    for (const pattern of cyberActionablePatterns) {
      if (pattern.test(clean)) {
        // Do not block if explicitly asking how to protect/prevent
        if (!isEducational || clean.includes("how to break into") || clean.includes("write ransomware")) {
          return {
            isSafe: false,
            category: "CRIMINAL_CYBER_ABUSE",
            response: SAFETY_RESPONSES.CRIMINAL_CYBER_ABUSE,
            reason: "Actionable criminal cyber abuse or malware request",
          };
        }
      }
    }

    // 7. ABUSE, STALKING & HARASSMENT
    const abuseActionablePatterns = [
      /\b(how\s+(can\s+i|do\s+i|to)|help\s+me|instructions\s+to)\s+(stalk|harass|blackmail|dox|extort)\s+(someone|somebody|my\s+[a-z]+|a\s+person|people)\b/i,
      /\b(how\s+to\s+abuse\s+someone|ways\s+to\s+harass\s+someone\s+anonymously)\b/i,
      /\bhow\s+do\s+i\s+stalk\s+someone\b/i,
    ];

    for (const pattern of abuseActionablePatterns) {
      if (pattern.test(clean)) {
        return {
          isSafe: false,
          category: "ABUSE",
          response: SAFETY_RESPONSES.ABUSE,
          reason: "Actionable stalking or harassment request",
        };
      }
    }

    // 8. ILLEGAL ACTIVITY & DANGEROUS WRONGDOING
    const illegalActionablePatterns = [
      /\b(how\s+(can\s+i|do\s+i|to)|instructions\s+to|recipe\s+for|cook|synthesize)\s+(meth|methamphetamine|fentanyl|cocaine|crack|heroin|ghb)\b/i,
      /\b(how\s+(can\s+i|do\s+i|to)|how\s+do\s+i)\s+(hide\s+evidence|dispose\s+of\s+a\s+body|evade\s+(the\s+)?police|commit\s+(credit\s+card\s+)?fraud|launder\s+(stolen\s+)?money)\b/i,
      /\b(how\s+do\s+i\s+hide\s+evidence)\b/i,
    ];

    for (const pattern of illegalActionablePatterns) {
      if (pattern.test(clean)) {
        return {
          isSafe: false,
          category: "ILLEGAL_ACTIVITY",
          response: SAFETY_RESPONSES.ILLEGAL_ACTIVITY,
          reason: "Instructions for serious crime or dangerous wrongdoing",
        };
      }
    }

    // 9. EXPLICIT SEXUAL CONTENT / ROLEPLAY
    const sexualExplicitPatterns = [
      /\b(write|generate|give\s+me)\s+(an?\s+)?(?:erotic|explicit\s+sexual|nsfw|smut|pornographic|\s)+\s*(story|scene|text|fantasy)\b/i,
      /\b(let's|can\s+we)\s+(do\s+an?\s+)?(?:erotic|sexual|nsfw|\s)+\s*roleplay\b/i,
      /\b(erotic|sexual|nsfw)\s+roleplay\b/i,
    ];

    for (const pattern of sexualExplicitPatterns) {
      if (pattern.test(clean)) {
        return {
          isSafe: false,
          category: "SEXUAL_EXPLICIT",
          response: SAFETY_RESPONSES.SEXUAL_EXPLICIT,
          reason: "Sexually explicit content or roleplay request",
        };
      }
    }

    // 10. HATE SPEECH & TARGETED HARASSMENT
    const hatePatterns = [
      /\b(kill\s+all\s+(jews|muslims|christians|hindus|blacks|whites|immigrants|gays))\b/i,
      /\b(subhuman|exterminate\s+all|cleanse\s+the\s+world\s+of)\s+(jews|muslims|christians|hindus|blacks|whites|immigrants|gays)\b/i,
    ];

    for (const pattern of hatePatterns) {
      if (pattern.test(clean)) {
        return {
          isSafe: false,
          category: "HATE",
          response: SAFETY_RESPONSES.HATE,
          reason: "Targeted hate speech or incitement",
        };
      }
    }

    // Passed all safety filters
    return { isSafe: true };
  } catch (err) {
    console.error("[SAFETY CLASSIFICATION EXCEPTION]", err);
    // Fail safe: Never throw error to caller
    return { isSafe: true };
  }
}
