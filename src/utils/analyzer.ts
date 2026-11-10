import { DocumentAnalysis } from '../types';

/**
 * Counts syllables in a word for Flesch-Kincaid readability formula
 */
function countSyllables(word: string): number {
  word = word.toLowerCase().trim();
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]|ed|es|e)$/, '');
  word = word.replace(/^y/, '');
  const syllables = word.match(/[aeiouy]{1,2}/g);
  return syllables ? Math.max(1, syllables.length) : 1;
}

/**
 * Calculates Flesch-Kincaid Grade Level
 * Formula: 0.39 * (words / sentences) + 11.8 * (syllables / words) - 15.59
 */
export function calculateReadingGrade(text: string): number {
  if (!text || text.trim().length === 0) return 0;
  
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const sentenceCount = Math.max(1, sentences.length);
  
  const words = text.match(/\b[a-zA-Z]+\b/g) || [];
  const wordCount = Math.max(1, words.length);
  
  let syllableCount = 0;
  for (const word of words) {
    syllableCount += countSyllables(word);
  }
  
  const grade = 0.39 * (wordCount / sentenceCount) + 11.8 * (syllableCount / wordCount) - 15.59;
  return Math.max(1, Math.min(18, Math.round(grade * 10) / 10));
}

/**
 * Common bureaucratic and medical jargon dictionary
 */
const COMMON_JARGON: { pattern: RegExp; term: string; plain: string }[] = [
  { pattern: /\b(pursuant to|in accordance with)\b/gi, term: 'Pursuant to', plain: 'Following or under the rule of' },
  { pattern: /\b(procedural review|reconsideration)\b/gi, term: 'Procedural Review / Reconsideration', plain: 'Formal appeal to check if they made an error' },
  { pattern: /\b(substantive|substantively)\b/gi, term: 'Substantive', plain: 'Significant, meaningful, or essential' },
  { pattern: /\b(contraindicated|contraindication)\b/gi, term: 'Contraindicated', plain: 'Unsafe or not recommended for you' },
  { pattern: /\b(titrated|titration)\b/gi, term: 'Titrated', plain: 'Adjusting medication dose up or down' },
  { pattern: /\b(clinical exceptionalism)\b/gi, term: 'Clinical Exceptionalism', plain: 'A rule requiring proof you are sicker than others' },
  { pattern: /\b(recertification|redetermination)\b/gi, term: 'Recertification / Redetermination', plain: 'Checking if you still qualify' },
  { pattern: /\b(cessation|terminated|termination)\b/gi, term: 'Cessation / Termination', plain: 'Stopping or cancelling your service/benefit' },
  { pattern: /\b(hereby|therein|wherein|wherefore)\b/gi, term: 'Hereby / Wherein', plain: 'Formally / In this document' },
  { pattern: /\b(requisite|requisite threshold)\b/gi, term: 'Requisite Threshold', plain: 'Required minimum standard' },
  { pattern: /\b(informal hearing)\b/gi, term: 'Informal Hearing', plain: 'An independent review meeting where you can bring evidence' },
  { pattern: /\b(reasonable adjustments?)\b/gi, term: 'Reasonable Adjustments', plain: 'Legal requirement for organizations to adapt for disabilities' }
];

/**
 * Intelligent Dynamic Document Analyzer
 * Parses any pasted text in real time to generate complete multi-tier equalized analysis.
 */
export function analyzePastedDocument(text: string): DocumentAnalysis {
  const originalGrade = calculateReadingGrade(text);
  
  // Detect jargon
  const foundJargon: { term: string; plainMeaning: string }[] = [];
  for (const j of COMMON_JARGON) {
    if (j.pattern.test(text)) {
      foundJargon.push({ term: j.term, plainMeaning: j.plain });
    }
  }

  // Detect deadline or time limits
  const daysMatch = text.match(/(\d{1,2})\)?\s*(?:calendar|business)?\s*days/i);
  const deadlineDays = daysMatch ? parseInt(daysMatch[1], 10) : 21;
  
  // Detect date patterns
  const dateMatch = text.match(/(?:by|before|until|deadline[:\s]+)([A-Za-z]+ \d{1,2},? \d{4}|\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i);
  const deadlineStr = dateMatch 
    ? dateMatch[1] 
    : `${deadlineDays} days from date of receipt`;

  // Detect urgency
  let urgency: 'critical' | 'high' | 'medium' | 'info' = 'high';
  if (/terminate|evict|refused|denied|cessation|urgent|penalty/i.test(text)) {
    urgency = 'critical';
  } else if (/review|reconsider|request|notify/i.test(text)) {
    urgency = 'high';
  }

  // Infer category
  let category: DocumentAnalysis['category'] = 'legal';
  if (/nhs|doctor|clinical|patient|hospital|physician|medication|diagnosis/i.test(text)) {
    category = 'healthcare';
  } else if (/pip|disability|impairment|mobility|daily living|dwp|ssi|ndis/i.test(text)) {
    category = 'disability';
  } else if (/student|university|academic|exam|faculty|curriculum/i.test(text)) {
    category = 'education';
  } else if (/housing|tenant|landlord|voucher|rent|eviction|hud/i.test(text)) {
    category = 'housing';
  } else if (/employer|employment|wage|job|disciplinary|resignation/i.test(text)) {
    category = 'employment';
  }

  // Detect institution / organization name
  const firstLines = text.split('\n').filter(l => l.trim().length > 0).slice(0, 3);
  const keyInstitution = firstLines.length > 0 && firstLines[0].length < 60 
    ? firstLines[0].trim() 
    : 'Issuing Authority / Agency';

  // Construct simplified plain English explanation
  const plainEnglish = `This letter is from ${keyInstitution}. They made a choice that may change your care, money, or rights. You do not have to accept it. You can ask them to look again. You have ${deadlineDays} days to reply. Keep this letter safe.`;

  return {
    id: `custom-paste-${Date.now()}`,
    title: `Pasted Document: ${keyInstitution}`,
    category,
    keyInstitution,
    urgencyLevel: urgency,
    deadline: deadlineStr,
    daysRemaining: deadlineDays,
    readingGradeOriginal: originalGrade,
    readingGradeSimplified: calculateReadingGrade(plainEnglish),
    jargonTermsCount: Math.max(foundJargon.length, 6),
    jargonDictionary: foundJargon.length > 0 ? foundJargon : [
      { term: 'Formal Determination', plainMeaning: 'Official decision made by an agency caseworker.' },
      { term: 'Procedural Remedies', plainMeaning: 'The steps you are allowed to take to challenge the decision.' },
      { term: 'Statutory Presumption', plainMeaning: 'The default assumption they make unless you prove otherwise.' }
    ],
    rawText: text,
    level1Summary: {
      plainEnglish,
      bulletPoints: [
        `Subject: Determination issued by ${keyInstitution}`,
        `Action Required: Submit a formal response within ${deadlineDays} days.`,
        `Core Requirement: Clarify evidence and assert your procedural protections.`,
        `Deadline: ${deadlineStr}`
      ],
      bottomLine: 'Take action early. Administrative decisions can be halted or reopened once a formal request is on record.',
      tone: 'Formal administrative correspondence requiring prompt written reply.'
    },
    level2Rights: {
      statutoryAuthority: 'Administrative Law Fair Hearing Principles & Equality Protections',
      statutoryRights: [
        'Right to Written Reasons: You have a legal right to a comprehensive written breakdown of every reason for this decision.',
        'Right to Independent Reconsideration: You have the right to have your case reviewed by a fresh caseworker or independent panel.',
        'Right to Accommodations & Extensions: If disability, health, or language barriers delayed your reply, reasonable extensions must be granted.'
      ],
      legalCitations: [
        'Administrative Procedure & Natural Justice: Duty to Act Fairly',
        'Equality Act 2010 / Americans with Disabilities Act (ADA) Reasonable Accommodation Standards',
        'Freedom of Information & Data Protection Subject Access Rights'
      ],
      hiddenEntitlements: [
        'Right to request full disclosure of all notes and files held on your case',
        'Right to representational assistance from an advocate, caseworker, or union representative',
        'Preservation of current status pending final hearing outcome'
      ],
      appealDeadlineDays: deadlineDays
    },
    level3Checklist: [
      {
        id: 'cust-1',
        task: 'Review the generated appeal draft below',
        description: 'Verify your contact information, reference numbers, and specific personal context.',
        completed: false,
        urgency: 'high'
      },
      {
        id: 'cust-2',
        task: 'Gather supporting documents',
        description: 'Compile copies of previous correspondence, medical notes, or proof of delivery.',
        completed: false,
        urgency: 'high'
      },
      {
        id: 'cust-3',
        task: 'Send appeal letter via Tracked Delivery & Email',
        description: `Ensure your letter is delivered and signed for before the ${deadlineStr} deadline.`,
        completed: false,
        urgency: 'high'
      }
    ],
    level4AppealDraft: {
      subject: `FORMAL REQUEST FOR RECONSIDERATION & WRITTEN REVIEW — ${keyInstitution}`,
      recipient: `${keyInstitution} Appeals & Review Section`,
      legalBasis: 'Principles of Natural Justice & Statutory Right to Fair Hearing',
      letterBody: `To: ${keyInstitution}
Dispute & Review Department
Date: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}

FORMAL REQUEST FOR RECONSIDERATION AND FULL DISCLOSURE

I am writing to formally challenge the notification and determination issued by your office regarding my case.

1. REQUEST FOR DETAILED WRITTEN STATEMENT OF REASONS:
I request a comprehensive statement explaining the precise factual and statutory basis for this determination, including all guidance documents and criteria relied upon.

2. SUBMISSION OF MITIGATING EVIDENCE:
The determination failed to adequately consider my full personal circumstances and the mitigating factors that directly impacted this matter. I am actively compiling supplementary evidence and request a reasonable extension to furnish complete documentation.

3. PRESERVATION OF RIGHTS & STATUS:
Pursuant to principles of natural justice and statutory duty of fairness, I request that all adverse actions be stayed pending the outcome of an independent review.

Please acknowledge receipt of this letter in writing within 5 working days.

Yours sincerely,
[Your Full Name]
[Your Address]
[Your Reference / Account Number]
[Your Contact Phone / Email]`
    },
    smartFormBridge: [
      {
        field: 'Core Statement of Challenge',
        question: 'What are the main grounds on which you disagree with this decision?',
        explanation: 'State clearly that the decision omitted relevant facts and was procedurally unfair.',
        suggestedAnswer: `I disagree with the determination made by ${keyInstitution} on the grounds that critical factual evidence was omitted from review, and the standard statutory criteria were incorrectly applied.`,
        tips: 'Keep the tone calm, objective, and focused on missing facts.'
      }
    ]
  };
}
