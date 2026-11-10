import { calculateReadingGrade } from '../utils/analyzer';
import { DocumentAnalysis } from '../types';

const RAW_SCENARIOS: DocumentAnalysis[] = [
  {
    id: 'healthcare-denial',
    title: 'NHS / Health Trust: Continuous Glucose Monitor & Funding Denial',
    category: 'healthcare',
    keyInstitution: 'Integrated Care Board (ICB) Prior Approval Panel',
    urgencyLevel: 'critical',
    deadline: '28 days from date of notice (Dec 08, 2026)',
    daysRemaining: 28,
    readingGradeOriginal: 16.4,
    readingGradeSimplified: 5.2,
    jargonTermsCount: 14,
    rawText: `NOTICE OF INDIVIDUAL FUNDING REQUEST (IFR) DETERMINATION
Reference: IFR-2026-88941-CL
Patient NHS No: 492 881 9920
Date: 10 November 2026

Dear Patient,

The Clinical Commissioning Panel met on 04 November 2026 to adjudicate the exceptional funding application submitted on your behalf by your Consultant Endocrinologist for the provision of a Continuous Glucose Monitoring (CGM) sensor telemetry system and associated sensor disposables.

Following consideration of the clinical dossier pursuant to Policy Directive ICB-POL-77 (Section 4.3: "Prior Authorization Thresholds for Type 1 Diabetes Mellitus Cohorts"), the Panel resolved that your submission failed to satisfy the requisite threshold of clinical exceptionalism. Specifically, while the medical narrative documents recurrent nocturnal hypoglycaemic excursions and impaired hypoglycaemia awareness (Gold Score 4), the panel noted that secondary-line subcutaneous insulin pump therapy had not been titrated to maximum clinical tolerance, nor was there documented evidence of sustained HbA1c elevation exceeding 75 mmol/mol across two consecutive quarters.

Consequently, pursuant to Regulation 12 of the National Health Service (Commissioning Board and Clinical Commissioning Groups) Regulations 2012, funding authorization is hereby REFUSED.

You maintain a right to submit a formal request for procedural review within twenty-eight (28) calendar days of the date of this correspondence. Grounds for procedural review are restricted exclusively to substantive procedural defects or failure to consider submitted clinical evidence. Late submissions will not be entertained.`,
    jargonDictionary: [
      { term: 'Clinical Exceptionalism', plainMeaning: 'A rule stating you must prove you are substantially sicker or different from anyone else with your condition to get standard treatment.' },
      { term: 'Nocturnal Hypoglycaemic Excursions', plainMeaning: 'Dangerous drops in blood sugar that happen while you are asleep and cannot feel them.' },
      { term: 'Impaired Hypoglycaemia Awareness (Gold Score 4)', plainMeaning: 'Your body no longer sends warning signs (like shaking or sweating) before your sugar crashes.' },
      { term: 'Titrated to Maximum Clinical Tolerance', plainMeaning: 'Pushing your insulin dose to the highest possible level before trying this monitor.' },
      { term: 'Substantive Procedural Defects', plainMeaning: 'Proof that the panel broke its own meeting rules, lost your records, or ignored your doctor\'s letters.' }
    ],
    level1Summary: {
      plainEnglish: `The NHS said no. They will not pay for your glucose monitor. They say your sugar is not low enough yet. They say you must try more changes to your pump first. But your own doctor says your low sugar at night is a real risk to your life. That matters. You can ask them to look again. You have 28 days to do it.`,
      bulletPoints: [
        'Decision: REFUSED funding for your CGM sensor.',
        'Why they rejected it: They claim you have not tried enough traditional treatments, despite your doctor\'s recommendation.',
        'Immediate risk: Night-time blood sugar crashes without warning symptoms.',
        'Your deadline: You have 28 calendar days (until Dec 08, 2026) to file an appeal.'
      ],
      bottomLine: 'Do not panic. You have the right to a review, and a letter from your doctor citing NICE Guideline NG17 makes your appeal much stronger.',
      tone: 'Defensive bureaucratic denial based on cost-containment; legally vulnerable on patient safety.'
    },
    level2Rights: {
      statutoryAuthority: 'NHS Constitution & NICE Guideline NG17 (Type 1 Diabetes)',
      statutoryRights: [
        'Right to NICE-Approved Standard of Care: NICE Guideline NG17 mandates CGM access for all adults with Type 1 diabetes experiencing impaired hypoglycaemia awareness (Gold Score ≥ 4).',
        'Right to Fair Administrative Review under the NHS Constitution (Principle 1 & Patient Right 3a).',
        'Right to Emergency Clinical Escalation: If nocturnal hypos pose acute loss of consciousness, your GP can lodge an Urgent Safety Re-determination within 72 hours.'
      ],
      legalCitations: [
        'NICE Guideline NG17: Type 1 diabetes in adults: diagnosis and management (Recommendation 1.6.10)',
        'The National Health Service (Commissioning Board and Clinical Commissioning Groups) Regulations 2012, Regulation 12',
        'Equality Act 2010 (Section 20: Duty to make reasonable adjustments for chronic conditions)'
      ],
      hiddenEntitlements: [
        'Free NHS Prescription Exemption Certificate (FP92A)',
        'Right to emergency loan sensors via your local hospital diabetes specialist nurse while the appeal is pending',
        'Council Tax band reduction if you require dedicated medical equipment at home'
      ],
      appealDeadlineDays: 28
    },
    level3Checklist: [
      {
        id: 'c1',
        task: 'Download the Auto-Drafted Appeal Letter below',
        description: 'Review the personalized appeal letter generated in Tab 4 and insert your NHS Number and consultant name.',
        completed: false,
        urgency: 'high'
      },
      {
        id: 'c2',
        task: 'Contact your Consultant Endocrinologist / Diabetes Specialist Nurse',
        description: 'Ask them for a brief "Risk of Severe Nocturnal Hypoglycaemic Event" clinical letter citing NICE Guideline NG17.',
        completed: false,
        urgency: 'high',
        requiredDoc: 'Endocrinology Clinical Support Letter'
      },
      {
        id: 'c3',
        task: 'Export your 14-day or 30-day pump/meter glucose logs',
        description: 'Print or export the PDF logs showing overnight readings under 3.5 mmol/L to prove Gold Score 4 unawareness.',
        completed: false,
        urgency: 'medium',
        requiredDoc: '30-Day Glucose Telemetry Log'
      },
      {
        id: 'c4',
        task: 'Send appeal letter via Tracked Postal Mail & Email',
        description: 'Email the IFR Coordinator at your ICB and post a signed physical copy before Dec 08, 2026.',
        completed: false,
        urgency: 'high'
      }
    ],
    level4AppealDraft: {
      subject: 'URGENT: Formal Procedural Review & Reconsideration — IFR-2026-88941-CL (NHS No: 492 881 9920)',
      recipient: 'Integrated Care Board (ICB) Prior Approval Appeals Panel',
      legalBasis: 'NICE Guideline NG17 (Rec 1.6.10) & NHS Constitution Patient Rights',
      letterBody: `To: The Clinical Commissioning Appeals Committee
Reference: IFR-2026-88941-CL
Patient NHS Number: 492 881 9920
Date: 10 November 2026

FORMAL REQUEST FOR PROCEDURAL RECONSIDERATION & CLINICAL SAFETY REVIEW

I am writing to formally challenge the refusal of Individual Funding Request IFR-2026-88941-CL, dated 10 November 2026, regarding the provision of a Continuous Glucose Monitoring (CGM) telemetry sensor system.

1. FAILURE TO APPLY STATUTORY NICE GUIDANCE (NG17):
The Panel's decision relies upon Local Policy Directive ICB-POL-77 Section 4.3, asserting that secondary-line subcutaneous pump titration is a prerequisite. This directly contravenes national statutory guidance set forth in NICE Guideline NG17 (Recommendation 1.6.10), which explicitly mandates that continuous glucose monitoring MUST be offered to all adults with Type 1 Diabetes who exhibit impaired hypoglycaemia awareness (Gold score ≥ 4).

2. PATIENT SAFETY & UNREASONABLE CLINICAL RISK:
The Panel’s suggestion to further titrate insulin pump therapy in an individual with documented nocturnal hypoglycaemic excursions and Gold Score 4 unawareness creates an immediate and life-threatening risk of fatal nocturnal hypoglycaemia. Pushing insulin dosages higher in the absence of real-time telemetry alarms is clinically contraindicated.

3. PROCEDURAL DEFECT:
The Panel failed to consider the primary clinical risk assessment submitted by my Consultant Endocrinologist, constituting a substantive defect under Regulation 12 of the NHS Regulations 2012.

RELIEF REQUESTED:
I request an immediate expedited reassessment by an independent clinical reviewer, and the immediate authorization of CGM telemetry pending formal panel confirmation.

Yours sincerely,
[Your Full Name]
[Your Address]
[Your Telephone Number / Email]`
    },
    smartFormBridge: [
      {
        field: 'Reason for Exceptionalism',
        question: 'Explain why your condition cannot be managed through standard contracted pathways?',
        explanation: 'The ICB wants you to explain what makes your risk different from a standard diabetic patient.',
        suggestedAnswer: 'I suffer from documented nocturnal hypoglycaemic unawareness (Gold Score 4), meaning I do not awaken or experience autonomic warning signs during severe nocturnal drops. Standard finger-prick testing cannot alert me while asleep, posing an imminent risk of hypoglycaemic coma.',
        tips: 'Do not talk about comfort or convenience; focus 100% on medical safety and failure of biological warning systems.'
      },
      {
        field: 'Alternative Therapies Attempted',
        question: 'Detail all prior therapeutic interventions and reasons for discontinuation.',
        explanation: 'They want proof you didn\'t just jump to an expensive device without trying basic care.',
        suggestedAnswer: 'I have strictly adhered to multiple daily injections (MDI) and continuous subcutaneous insulin infusion (CSII) under consultant supervision. Increasing insulin basal rates without telemetry alarms has repeatedly triggered unannounced severe hypoglycaemic episodes.',
        tips: 'Emphasize that the treatment was attempted under medical supervision and produced adverse events.'
      }
    ]
  },
  {
    id: 'disability-pip',
    title: 'Disability Assessment (PIP): 0 Points Award & Mandatory Reconsideration',
    category: 'disability',
    keyInstitution: 'Department for Work and Pensions (DWP)',
    urgencyLevel: 'critical',
    deadline: '28 calendar days from decision date (Dec 06, 2026)',
    daysRemaining: 26,
    readingGradeOriginal: 15.8,
    readingGradeSimplified: 4.8,
    jargonTermsCount: 16,
    rawText: `DEPARTMENT FOR WORK AND PENSIONS
Personal Independence Payment (PIP) Decision Notice
Date of Decision: 08 November 2026
National Insurance Number: AB 12 34 56 C

Dear Claimant,

We have considered your claim for Personal Independence Payment following your telephone consultation with an Independent Assessment Services Healthcare Professional on 14 October 2026.

DECISION:
You are not entitled to either the Daily Living component or the Mobility component of Personal Independence Payment from 10 July 2026.

HOW WE MADE OUR DECISION:
We looked at the assessment report and all the medical evidence available. 
- Preparing Food: You stated you suffer from chronic spinal neuropathy, fibromyalgia, and severe panic disorder which restricts standing. However, during the assessment, you were observed to speak in full sentences without overt dyspnea and demonstrated adequate cognitive recall. The Healthcare Professional opined that you retain functional grip and bilateral upper limb dexterity sufficient to microwave a simple meal or use adapted utensils. 0 points awarded.
- Planning and Following Journeys: You stated you cannot undertake unfamiliar journeys unaccompanied due to overwhelming psychological distress. However, as you drove to the supermarket on one occasion last month and attended your GP surgery, you can plan and follow a journey safely and reliably without supervision. 0 points awarded.

Your total score for Daily Living is 0 points. Your total score for Mobility is 0 points. You require 8 points for the standard rate and 12 points for the enhanced rate.

WHAT TO DO IF YOU DISAGREE:
You must ask us for a Mandatory Reconsideration within one month of the date on this letter (by 08 December 2026). You must state specifically which descriptors you believe apply and provide corroborating medical evidence.`,
    jargonDictionary: [
      { term: 'Safely, Reliably, and Repeatedly (Regulation 4(2A))', plainMeaning: 'The legal rule that if doing something causes severe pain, takes more than twice as long as normal, or leaves you exhausted for days, you CANNOT legally be counted as able to do it.' },
      { term: 'Overt Dyspnea / Adequate Cognitive Recall', plainMeaning: 'The assessor noted you were breathing normally and remembered your birthday during a phone call, using that to claim your physical spine doesn\'t hurt.' },
      { term: 'Functional Grip and Dexterity', plainMeaning: 'Claiming that because you can hold a fork, you are able to chop raw ingredients, handle boiling water, and stand over a hot stove safely.' },
      { term: 'Mandatory Reconsideration', plainMeaning: 'The mandatory step where a different DWP officer reviews the file before you can take them to an independent judicial tribunal (where over 70% of appeals win).' }
    ],
    level1Summary: {
      plainEnglish: `The DWP gave you 0 points. That means no money for daily life or for getting around. They made this choice after one short phone call. They did not read your doctor's notes. The law says a task only counts if you can do it safely, again and again, and without pain. If you can't, you should get points. You can ask them to look again. Do it by December 8, 2026.`,
      bulletPoints: [
        'Decision: 0 points awarded (Claim completely rejected).',
        'Assessor flaw: Confused phone call conversation with physical ability to cook, stand, and travel safely.',
        'The law on your side: Regulation 4(2A) requires you to perform tasks "reliably, safely, repeatedly, and in a reasonable time".',
        'Deadline: 28 days to lodge Mandatory Reconsideration.'
      ],
      bottomLine: 'Do not be discouraged. 65% of PIP decisions that reach a tribunal hearing are overturned in the claimant\'s favour (DWP official statistics, April 2026).',
      tone: 'Adversarial administrative dismissal based on informal phone observations.'
    },
    level2Rights: {
      statutoryAuthority: 'Social Security (Personal Independence Payment) Regulations 2013',
      statutoryRights: [
        'Right to Regulation 4(2A) Reliability Protection: You can only be assessed as able to do an activity if you can do it: safely, to an acceptable standard, repeatedly, and within a reasonable time (less than twice the normal time).',
        'Right to Independent Judicial Tribunal: If the DWP refuses to change the decision, you have the right to a free, independent tribunal hearing before a judge and a doctor.',
        'Right to Full Assessor PA4 Report: You are legally entitled to request the full written notes and clinical rationale compiled by the private contractor assessor.'
      ],
      legalCitations: [
        'Regulation 4(2A) of the Social Security (Personal Independence Payment) Regulations 2013',
        'Upper Tribunal Precedent [2016] UKUT 0540 (AAC) regarding "unfamiliar journeys and overwhelming psychological distress"',
        'Equality Act 2010 Public Sector Equality Duty'
      ],
      hiddenEntitlements: [
        'Free Companion Bus Pass / Disabled Person\'s Railcard',
        'Warm Home Discount / Cold Weather Payments eligibility',
        'Disability Cost of Living Support and exemption from the Benefit Cap'
      ],
      appealDeadlineDays: 28
    },
    level3Checklist: [
      {
        id: 'p1',
        task: 'Request the PA4 Assessment Report immediately',
        description: 'Call DWP on 0800 121 4433 and say: "Please send me a copy of my PA4 Medical Assessment Report under the Data Protection Act."',
        completed: false,
        urgency: 'high'
      },
      {
        id: 'p2',
        task: 'Prepare your Regulation 4(2A) Evidence Statement',
        description: 'Explain in writing why microwaving or driving once does NOT mean you can do it safely, repeatedly, and without pain 50% of days.',
        completed: false,
        urgency: 'high'
      },
      {
        id: 'p3',
        task: 'Request a GP or Consultant "Fit for Work / Daily Living" summary letter',
        description: 'Ask your doctor to specify: "Patient suffers severe neuropathic pain and cannot stand for >5 mins or travel without severe panic."',
        completed: false,
        urgency: 'medium',
        requiredDoc: 'GP Medical Summary Letter'
      },
      {
        id: 'p4',
        task: 'Submit the Mandatory Reconsideration Notice',
        description: 'Use the auto-drafted notice in Tab 4, sign it, and send it by Recorded Tracked Delivery to the DWP address on your letter.',
        completed: false,
        urgency: 'high'
      }
    ],
    level4AppealDraft: {
      subject: 'MANDATORY RECONSIDERATION REQUEST — National Insurance: AB 12 34 56 C',
      recipient: 'Department for Work and Pensions (PIP Dispute Resolution Team)',
      legalBasis: 'Regulation 4(2A) PIP Regulations 2013 & Upper Tribunal Case Law UKUT 0540',
      letterBody: `To: Department for Work and Pensions
PIP Dispute Resolution Team
Date: 10 November 2026
National Insurance Number: AB 12 34 56 C

MANDATORY RECONSIDERATION NOTICE: FORMAL CHALLENGE TO DECISION DATED 08/11/2026

I am formally requesting a Mandatory Reconsideration of the decision dated 08 November 2026 awarding 0 points for Daily Living and 0 points for Mobility.

The Decision Maker erred in law and fact by failing to apply the statutory criteria of Regulation 4(2A) of the Social Security (Personal Independence Payment) Regulations 2013, which mandates that a claimant cannot be treated as able to carry out an activity unless they can do so:
(a) Safely;
(b) To an acceptable standard;
(c) Repeatedly; and
(d) Within a reasonable time period.

1. ACTIVITY 1: PREPARING FOOD (Descriptor 1e / 1f)
The assessor noted that because I have bilateral hand dexterity and spoke on the telephone, I can prepare food. This is an egregious error. Due to spinal neuropathy and severe chronic pain, I cannot stand at a kitchen counter for more than 4 minutes without acute muscular spasms. I cannot safely lift a pan of boiling water without dropping hazard. Furthermore, preparing food on one day renders me bedbound for the following 24 hours; therefore, I cannot perform this repeatedly. I satisfy Descriptor 1e (Needs supervision or assistance to prepare or cook a simple meal — 4 points).

2. ACTIVITY 11: PLANNING AND FOLLOWING JOURNEYS (Descriptor 11d)
The assessor recorded that because I drove to a nearby chemist once, I can travel safely. As established in Upper Tribunal decision [2016] UKUT 0540, a single isolated journey does not demonstrate the ability to navigate unfamiliar journeys reliably. Due to severe panic disorder and agoraphobia, I experience acute dissociation and cannot undertake any unfamiliar journey without being accompanied by another person. I satisfy Descriptor 11d (Cannot follow the course of an unfamiliar journey without assistance — 10 points).

TOTAL ENTITLEMENT:
Daily Living: 8+ Points (Standard Rate)
Mobility: 10+ Points (Standard Rate)

Please reconsider this decision and award entitlement from 10 July 2026.

Yours sincerely,
[Your Full Name]
[Your Address]
[National Insurance: AB 12 34 56 C]`
    },
    smartFormBridge: [
      {
        field: 'Describing Good Days vs Bad Days',
        question: 'How many days a week do you experience difficulty preparing a meal or moving around?',
        explanation: 'The law uses the "50% rule" — if your condition affects you on 4 or more days out of 7, it is legally considered to affect you all the time.',
        suggestedAnswer: 'My condition fluctuates, but I experience severe neuropathic pain, limb stiffness, and disabling fatigue on at least 5 out of 7 days per week. On my "better" days, preparing a simple meal takes over 45 minutes and leaves me exhausted for the remainder of the day.',
        tips: 'Always state the frequency in days per week (e.g. "at least 5 out of 7 days") to satisfy the legal statutory majority test.'
      }
    ]
  },
  {
    id: 'university-dsa',
    title: 'University Academic Accommodations & Disabled Students Allowance (DSA) Appeal',
    category: 'education',
    keyInstitution: 'University Academic Accommodations & Student Support Committee',
    urgencyLevel: 'high',
    deadline: '14 days from notification (Nov 24, 2026)',
    daysRemaining: 14,
    readingGradeOriginal: 14.9,
    readingGradeSimplified: 5.0,
    jargonTermsCount: 11,
    rawText: `FACULTY ACADEMIC STANDARDS AND DISABILITY SUPPORT OFFICE
Notification of Accommodation Assessment
Case Ref: DSA-ACAD-2026-4412
Date: 10 November 2026

Dear Student,

The Central Panel for Reasonable Adjustments has reviewed your application for academic accommodations submitted for the 2026/2027 academic term, including your request for a 25% examination time concession, specialized captioning assistive software licenses, and flexible coursework submission deadlines.

We regret to notify you that your petition for accommodations has been DENIED. 

RATIONALE:
The psychological and psychometric assessment documentation provided was executed in May 2022. Pursuant to University Academic Regulation Section 14.2(b), psychometric evaluations for specific learning differences (SpLD) and attention deficit hyperactivity disorder (ADHD) must have been completed within thirty-six (36) calendar months preceding the commencement of the current academic year to be deemed diagnostically valid. 

Furthermore, your petition for flexible deadline extensions would substantively alter the fundamental competency benchmarks of the core curriculum modules.

You are advised that you may re-apply upon commissioning and submitting a new, updated diagnostic assessment conducted by a qualified Educational Psychologist at your own expense. You may lodge a formal stage 2 appeal within 14 days.`,
    jargonDictionary: [
      { term: 'Psychometric Recency Requirement (36 months)', plainMeaning: 'An arbitrary university rule claiming that a permanent neurological condition like ADHD or dyslexia "expires" after 3 years unless you pay £500+ for a new private test.' },
      { term: 'Fundamental Competency Benchmarks', plainMeaning: 'An excuse used by schools claiming that giving you extra time or flexible dates lowers academic standards for other students.' },
      { term: 'Anticipatory Duty of Reasonable Adjustments', plainMeaning: 'Under the Equality Act 2010, the university is legally required to remove barriers BEFORE you fail, and cannot place arbitrary financial costs onto disabled students.' }
    ],
    level1Summary: {
      plainEnglish: `The school said no to your exam help. That means no extra time and no help with software. They say your test for ADHD or dyslexia is too old. They want you to pay for a new one. But these do not go away with age. The law says the school must help you. It can't make you pay to prove it again. You have 14 days to ask them to change it.`,
      bulletPoints: [
        'Decision: All requested accommodations REJECTED.',
        'Their excuse: Diagnostic report is 4 years old (they want one under 3 years old).',
        'The legal reality: The Equality Act 2010 prohibits universities from imposing unnecessary financial hurdles or assuming permanent conditions expire.',
        'Appeal deadline: 14 calendar days (Nov 24, 2026).'
      ],
      bottomLine: 'Universities routinely drop this 36-month requirement the moment a formal Stage 2 grievance citing the Equality Act 2010 is lodged.',
      tone: 'Bureaucratic gatekeeping using outdated administrative policies that violate disability equality law.'
    },
    level2Rights: {
      statutoryAuthority: 'Equality Act 2010 (Part 6: Further and Higher Education)',
      statutoryRights: [
        'Right to Anticipatory Reasonable Adjustments (Section 20 & 91 of Equality Act 2010): Universities must take reasonable steps to prevent disabled students from being placed at a substantial disadvantage.',
        'Protection against Disability-Related Discrimination (Section 15): Refusing adjustments based on arbitrary recency policies is unlawful if the underlying impairment persists.',
        'Exemption from Financial Surcharges (Section 20(13)): The service provider cannot require the disabled person to pay any part of the cost of providing the reasonable adjustment.'
      ],
      legalCitations: [
        'Equality Act 2010 (c. 15), Part 6, Chapter 2 (Higher Education)',
        'SASC (SpLD Assessment Standards Committee) National Guidance on Diagnostic Longevity',
        'Office of the Independent Adjudicator (OIA) Good Practice Framework: Supporting Disabled Students'
      ],
      hiddenEntitlements: [
        'Access to the University Student Hardship Fund for assistive equipment',
        'Interim provisional exam concessions while your formal appeal is investigated',
        'Free campus ergonomic workspace equipment loans'
      ],
      appealDeadlineDays: 14
    },
    level3Checklist: [
      {
        id: 'u1',
        task: 'Download and fill out the Stage 2 Appeal Draft in Tab 4',
        description: 'Insert your Student ID number, degree programme, and academic advisor name.',
        completed: false,
        urgency: 'high'
      },
      {
        id: 'u2',
        task: 'Contact the Student Union Disability Advocate',
        description: 'Send a copy of your appeal to your Students\' Union Advice Centre — their advocates provide free representation.',
        completed: false,
        urgency: 'high'
      },
      {
        id: 'u3',
        task: 'Request an Immediate Interim Concession Order',
        description: 'Demand that 25% extra time be provisionally applied to any tests or exams scheduled within the next 30 days while the appeal proceeds.',
        completed: false,
        urgency: 'medium'
      }
    ],
    level4AppealDraft: {
      subject: 'STAGE 2 FORMAL ACADEMIC APPEAL: Refusal of Reasonable Adjustments (Case: DSA-ACAD-2026-4412)',
      recipient: 'University Central Academic Appeals Panel & Dean of Student Affairs',
      legalBasis: 'Equality Act 2010 (Section 20 & Section 91) & OIA Framework',
      letterBody: `To: The Central Academic Appeals Panel
Copy to: Dean of Student Affairs & Student Union Disability Officer
Case Reference: DSA-ACAD-2026-4412
Date: 10 November 2026

FORMAL STAGE 2 APPEAL: UNLAWFUL REFUSAL OF REASONABLE ADJUSTMENTS UNDER EQUALITY ACT 2010

I am writing to formally lodge a Stage 2 Academic Appeal against the decision notice dated 10 November 2026 refusing my application for academic accommodations (25% extra time, assistive software, and coursework flexibility).

1. UNLAWFUL IMPOSITION OF 36-MONTH RECENCY RULE:
The Committee refused my application on the grounds that my specialist diagnostic report was issued in May 2022 (Regulation 14.2(b)). Attention Deficit Hyperactivity Disorder (ADHD) and Specific Learning Differences are lifelong neurological conditions recognized as disabilities under Section 6 of the Equality Act 2010. The SpLD Assessment Standards Committee (SASC) national framework explicitly confirms that diagnostic reports produced by qualified assessors do not expire. Demanding that I commission a duplicate private evaluation at a cost of £500+ breaches Section 20(13) of the Equality Act 2010, which strictly prohibits charging disabled individuals for reasonable adjustments.

2. ANTICIPATORY STATUTORY DUTY UNDER SECTION 20 & 91:
Higher education institutions owe an anticipatory duty to disabled students. The assertion that providing 25% extra time would compromise "competency benchmarks" is contrary to the Office of the Independent Adjudicator (OIA) guidance, as extra time simply levels the cognitive playing field regarding processing speed.

REQUEST FOR IMMEDIATE RELIEF:
1. Immediate reversal of the decision and full authorization of the requested adjustments.
2. An interim concession order applying the 25% time adjustment to all upcoming assessments pending resolution.

Yours sincerely,
[Your Full Name]
[Student ID Number]
[Degree Programme]`
    },
    smartFormBridge: [
      {
        field: 'Impact on Assessment',
        question: 'Describe how your disability impacts your capacity to perform timed written assessments.',
        explanation: 'Focus on executive function, working memory processing speed, and cognitive fatigue rather than general studying.',
        suggestedAnswer: 'Under timed examination pressure, my working memory processing speed and executive function are impaired by approximately 30-40% relative to peers, causing severe sensory overload and blocking retrieval of learned concepts unless provided a 25% rest-break buffer.',
        tips: 'Use specific terms like "working memory capacity" and "information retrieval delay" rather than emotional distress.'
      }
    ]
  },
  {
    id: 'housing-assistance',
    title: 'Municipal Housing Authority: Section 8 / Emergency Subsidy Cancellation Notice',
    category: 'housing',
    keyInstitution: 'City Department of Housing and Community Development',
    urgencyLevel: 'critical',
    deadline: '10 business days from receipt (Nov 24, 2026)',
    daysRemaining: 10,
    readingGradeOriginal: 15.5,
    readingGradeSimplified: 5.1,
    jargonTermsCount: 13,
    rawText: `METROPOLITAN HOUSING AUTHORITY
DIVISION OF TENANT-BASED RENTAL ASSISTANCE
NOTICE OF INTENT TO TERMINATE HOUSING CHOICE VOUCHER SUBSIDY
Voucher ID: HCV-99210-WEST
Issue Date: 10 November 2026

Dear Voucher Holder:

PLEASE TAKE NOTICE that pursuant to 24 C.F.R. § 982.551 and Municipal Housing Administrative Plan Chapter 15, the Metropolitan Housing Authority hereby intends to TERMINATE your Housing Choice Voucher subsidy effective November 30, 2026.

GROUNDS FOR PROPOSED TERMINATION:
Failure to supply required verification documentation during annual recertification cycle. Specifically, you failed to submit third-party employer wage verification forms (Form HUD-9886 and supplementary verification of variable gig income) by the deadline of October 28, 2026. Failure to comply with family obligations under federal regulations constitutes mandatory grounds for voucher cancellation.

YOUR RIGHT TO AN INFORMAL HEARING:
You have the right to request an Informal Hearing prior to termination pursuant to 24 C.F.R. § 982.555. To exercise this right, your written request for an Informal Hearing MUST BE RECEIVED by the Housing Authority within TEN (10) BUSINESS DAYS from the date of this notice (no later than 5:00 PM on November 24, 2026).

FAILURE TO TIMELY SUBMIT A WRITTEN HEARING REQUEST WILL RESULT IN AUTOMATIC TERMINATION OF YOUR RENTAL SUBSIDY, AND YOUR LANDLORD WILL BE NOTIFIED IMMEDIATELY OF THE CESSATION OF HOUSING ASSISTANCE PAYMENTS (HAP).`,
    jargonDictionary: [
      { term: '24 C.F.R. § 982.551 (Family Obligations)', plainMeaning: 'The federal rules governing paperwork that housing authorities use to disqualify low-income families over missing documents.' },
      { term: 'Informal Hearing (24 C.F.R. § 982.555)', plainMeaning: 'A formal legal hearing before an independent hearing officer where you can present evidence and stop your eviction.' },
      { term: 'Cessation of Housing Assistance Payments (HAP)', plainMeaning: 'The government stops paying your landlord, meaning you would immediately owe the full market rent and face eviction.' }
    ],
    level1Summary: {
      plainEnglish: `The housing office wants to stop your rent help on November 30. They say you sent your pay forms late. If they stop it, your landlord may ask for full rent. You could lose your home. But you can stop this now. Ask for a hearing before November 24, 2026. Once you ask, they can't stop your help until the hearing is done.`,
      bulletPoints: [
        'Notice: Intent to terminate your rent voucher subsidy.',
        'Why: Missing employer income paperwork from your October review.',
        'CRITICAL DEADLINE: Exactly 10 business days (Nov 24, 2026 at 5:00 PM) to request a hearing.',
        'Golden Rule: Filing the hearing request freezes your voucher so you cannot be cut off yet.'
      ],
      bottomLine: 'As long as you submit the simple 1-page hearing request letter before Nov 24, the law forbids them from stopping your rent payments.',
      tone: 'Hostile bureaucratic eviction trigger based on paperwork technicalities.'
    },
    level2Rights: {
      statutoryAuthority: 'Federal Housing Act & HUD Regulations 24 C.F.R. § 982.555',
      statutoryRights: [
        'Automatic Stay of Termination: Under HUD regulations, once a timely request for an informal hearing is filed, Housing Assistance Payments (HAP) MUST continue until a final written hearing decision is issued.',
        'Right to Discovery of Agency File: You are entitled to examine and copy all documents and records in your Housing Authority case file before the hearing.',
        'Reasonable Accommodation for Disability / Illness: If illness, hospitalization, or disability prevented you from meeting the paperwork deadline, the Housing Authority MUST grant a reasonable accommodation extension.'
      ],
      legalCitations: [
        '24 Code of Federal Regulations (C.F.R.) § 982.555 (Informal hearing for participant)',
        'Fair Housing Act (42 U.S.C. §§ 3601-3619) — Duty to Provide Reasonable Accommodations',
        'Goldberg v. Kelly, 397 U.S. 254 (Constitutional Due Process protections prior to welfare benefit termination)'
      ],
      hiddenEntitlements: [
        'Free Legal Aid / Tenants\' Rights Union representation',
        'Emergency Utility Relief / Low-Income Home Energy Assistance Program (LIHEAP)',
        'Retroactive income adjustment if your work hours were cut'
      ],
      appealDeadlineDays: 10
    },
    level3Checklist: [
      {
        id: 'h1',
        task: 'Hand-deliver or certified-mail the Hearing Request in Tab 4',
        description: 'Submit the formal hearing request letter to the Housing Authority office and demand a date-stamped receipt.',
        completed: false,
        urgency: 'high'
      },
      {
        id: 'h2',
        task: 'Collect the missing income / paystub documents',
        description: 'Obtain your last 60 days of paystubs or bank statements showing your true gig/hourly income.',
        completed: false,
        urgency: 'high',
        requiredDoc: '60-Day Paystubs or Bank Statements'
      },
      {
        id: 'h3',
        task: 'Request Reasonable Accommodation letter from your doctor (if health-related)',
        description: 'If ADHD, illness, or crisis caused the delay, ask your doctor for a letter stating you require accommodation.',
        completed: false,
        urgency: 'medium',
        requiredDoc: 'Doctor Reasonable Accommodation Note'
      }
    ],
    level4AppealDraft: {
      subject: 'URGENT: TIMELY REQUEST FOR INFORMAL HEARING & STAY OF TERMINATION (Voucher ID: HCV-99210-WEST)',
      recipient: 'Hearing Office, Metropolitan Housing Authority',
      legalBasis: '24 C.F.R. § 982.555 & Goldberg v. Kelly (Due Process)',
      letterBody: `To: Metropolitan Housing Authority
Informal Hearing Office & Voucher Administrator
Date: 10 November 2026
Voucher ID: HCV-99210-WEST

TIMELY WRITTEN REQUEST FOR INFORMAL HEARING & CONTINUATION OF HAP SUBSIDY

I am writing to formally request an Informal Hearing pursuant to 24 C.F.R. § 982.555 in response to the Notice of Intent to Terminate my Housing Choice Voucher subsidy dated 10 November 2026.

1. TIMELY SUBMISSION:
This request is delivered within the ten (10) business day window expiring November 24, 2026. Pursuant to federal regulation and constitutional due process (Goldberg v. Kelly), my Housing Assistance Payments (HAP) to my landlord must continue uninterrupted pending the outcome of the hearing.

2. SUBMISSION OF VERIFICATION DOCUMENTS:
The alleged failure to submit third-party income verification was due to administrative delays beyond my control (unresponsiveness of gig platform payroll reporting). I am actively compiling all certified bank deposits and will present the complete verification dossier at the hearing.

3. REQUEST FOR FILE DISCOVERY:
Pursuant to 24 C.F.R. § 982.555(e)(2), I formally request access to inspect and copy all documents, records, and internal notes contained within my case file prior to the scheduled hearing date.

Please confirm receipt of this hearing request and notify me of the hearing date and time.

Yours sincerely,
[Your Full Name]
[Your Address]
[Your Phone Number]`
    },
    smartFormBridge: [
      {
        field: 'Explanation of Mitigating Circumstances',
        question: 'Explain why verification documents were not returned within the prescribed 30-day recertification window.',
        explanation: 'The hearing officer wants to see a credible, non-willful explanation for the paperwork delay.',
        suggestedAnswer: 'The delay in submitting income documentation was non-willful. My variable gig employer does not maintain a physical HR department, resulting in significant delays in obtaining automated payroll verification transcripts. I made good-faith efforts to contact my caseworker to request an extension.',
        tips: 'Emphasize that the failure was non-willful and that you are in full compliance now.'
      }
    ]
  }
];

// Reading grades are measured with the same Flesch-Kincaid formula the engine uses, not hand-entered.
export const SCENARIOS: DocumentAnalysis[] = RAW_SCENARIOS.map((s) => ({
  ...s,
  readingGradeOriginal: calculateReadingGrade(s.rawText),
  readingGradeSimplified: calculateReadingGrade(s.level1Summary.plainEnglish),
  jargonTermsCount: s.jargonDictionary.length,
}));
