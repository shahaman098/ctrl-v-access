import { DocumentAnalysis } from '../types';
import { SCENARIOS } from './scenarios';

export interface SearchResultItem {
  id: string;
  title: string;
  category: 'healthcare' | 'disability' | 'education' | 'housing' | 'employment' | 'legal';
  statutoryAuthority: string;
  summary: string;
  keywords: string[];
  documentAnalysis: DocumentAnalysis;
}

export const SEARCH_DATABASE: SearchResultItem[] = [
  {
    id: 'healthcare-denial',
    title: 'NHS Continuous Glucose Monitor (CGM) & Medical Device Prior Approval',
    category: 'healthcare',
    statutoryAuthority: 'NICE Guideline NG17 (Rec 1.6.10) & NHS Constitution',
    summary: 'Challenging funding refusal for telemetry sensors and diabetic supplies based on Gold Score 4 impaired hypoglycaemia awareness.',
    keywords: ['cgm', 'glucose', 'diabetes', 'insulin', 'nhs', 'nice', 'sensor', 'dexcom', 'freestyle', 'ifr', 'denial', 'endocrinologist'],
    documentAnalysis: SCENARIOS[0]
  },
  {
    id: 'disability-pip',
    title: 'Personal Independence Payment (PIP): 0 Points Award & Mandatory Reconsideration',
    category: 'disability',
    statutoryAuthority: 'Social Security (PIP) Regulations 2013, Regulation 4(2A)',
    summary: 'Overturning 0-points mobility and daily living decisions using the statutory "reliably, safely, repeatedly, in a reasonable time" test.',
    keywords: ['pip', 'disability', 'dwp', 'mandatory reconsideration', 'tribunal', 'points', 'mobility', 'daily living', 'chronic pain', 'fibromyalgia', 'panic'],
    documentAnalysis: SCENARIOS[1]
  },
  {
    id: 'university-dsa',
    title: 'University Disabled Students Allowance (DSA) & Exam Time Concessions',
    category: 'education',
    statutoryAuthority: 'Equality Act 2010 (Part 6: Higher Education) & OIA Framework',
    summary: 'Appealing arbitrary 36-month diagnostic recency rules that refuse 25% exam extra time and assistive software for ADHD/dyslexia.',
    keywords: ['university', 'dsa', 'exam', 'extra time', 'adhd', 'dyslexia', 'accommodations', 'reasonable adjustments', 'student', 'assessment', 'sasc'],
    documentAnalysis: SCENARIOS[2]
  },
  {
    id: 'housing-assistance',
    title: 'Housing Choice Voucher (Section 8) Termination & Informal Hearing Stay',
    category: 'housing',
    statutoryAuthority: 'HUD 24 C.F.R. § 982.555 & Goldberg v. Kelly Due Process',
    summary: 'Freezing voucher cancellation and eviction threats caused by paperwork deadlines by invoking statutory informal hearing rights.',
    keywords: ['housing', 'section 8', 'voucher', 'rent', 'eviction', 'hud', 'hap', 'recertification', 'informal hearing', 'stay', 'subsidy'],
    documentAnalysis: SCENARIOS[3]
  },
  {
    id: 'prescription-exemption',
    title: 'NHS Prescription Exemption Certificate (FP92A) Medical Exemption',
    category: 'healthcare',
    statutoryAuthority: 'National Health Service (Charges for Drugs and Appliances) Regulations 2015',
    summary: 'Entitlement to 100% free NHS prescriptions for patients with diabetes, epilepsy, hypoparathyroidism, or permanent physical disabilities.',
    keywords: ['prescription', 'free medication', 'fp92a', 'nhs exemption', 'drugs', 'pharmacy', 'epilepsy', 'exemption certificate'],
    documentAnalysis: {
      ...SCENARIOS[0],
      id: 'prescription-exemption',
      title: 'NHS Medical Prescription Exemption (FP92A) Rights',
      rawText: `NATIONAL HEALTH SERVICE (CHARGES FOR DRUGS AND APPLIANCES) REGULATIONS 2015
Medical Exemption Certificate (FP92A) Guidance
Department of Health and Social Care

Qualifying Medical Conditions for Prescription Charge Exemption:
1. Permanent fistula requiring continuous surgical dressing.
2. Form of hypoadrenalism (e.g., Addison's disease) for which specific substitution therapy is essential.
3. Diabetes insipidus and other forms of hypopituitarism.
4. Diabetes mellitus, except where treatment is by diet alone.
5. Hypoparathyroidism.
6. Myasthenia gravis.
7. Myxoedema (hypothyroidism) requiring thyroid hormone replacement.
8. Epilepsy requiring continuous anticonvulsive therapy.
9. Continuing physical disability which means the patient cannot go out without the help of another person.`,
      level1Summary: {
        plainEnglish: 'If you have a qualifying chronic condition (such as diabetes, epilepsy, or a permanent mobility disability), you are legally entitled to 100% free NHS prescriptions. You do NOT need to pay the standard £9.90 charge per item. You simply need an FP92A form signed by your GP.',
        bulletPoints: [
          'Entitlement: 100% Free prescriptions across all medications.',
          'Qualifying conditions: Diabetes, epilepsy, hypothyroidism, or physical disabilities restricting going out alone.',
          'Form needed: Ask GP surgery for Form FP92A.',
          'Validity: 5-year renewable certificate with automatic renewal reminders.'
        ],
        bottomLine: 'Do not pay out-of-pocket for essential prescription medication if you have a qualifying diagnosis. The exemption is statutory under NHS regulations.',
        tone: 'Statutory medical entitlement to zero-cost medication.'
      }
    }
  },
  {
    id: 'access-to-work',
    title: 'Access to Work Grant: Government Workplace Accommodations & Equipment',
    category: 'employment',
    statutoryAuthority: 'Disabled Persons (Employment) Act & DWP Access to Work Guidance 2026',
    summary: 'Government grants up to £66,000/year to pay for assistive technology, ergonomic chairs, taxi travel to work, and ADHD job coaches.',
    keywords: ['access to work', 'grant', 'workplace', 'job', 'adhd coach', 'taxi', 'equipment', 'software', 'screen reader', 'dwp grant'],
    documentAnalysis: {
      ...SCENARIOS[1],
      id: 'access-to-work',
      title: 'DWP Access to Work Grant Assessment & Workplace Adjustments',
      category: 'employment',
      rawText: `DEPARTMENT FOR WORK AND PENSIONS
ACCESS TO WORK OPERATIONAL GUIDELINES
Eligibility and Award Thresholds

Access to Work is a publicly funded employment support programme that aims to help more disabled people start or stay in work.
Maximum Cap: £66,000 per person per year.
Eligible Provisions:
- Special aids and equipment (specialist keyboards, speech-to-text software, ergonomic workstations).
- Adaptations to premises.
- Travel to work (taxi fare subsidies if public transport is inaccessible due to impairment).
- Support workers (ADHD executive function coaching, British Sign Language interpreters, travel companions).`,
      level1Summary: {
        plainEnglish: 'Access to Work is a government grant that pays for your disability support at work. It does not need to be repaid and does not affect other benefits. It covers assistive software, taxi fares if you cannot take trains/buses, and specialized ADHD or job coaches.',
        bulletPoints: [
          'Annual Cap: Up to £66,000 per year in funding.',
          'What it covers: Taxis to work, specialized software, noise-canceling headsets, ergonomic equipment, and personal coaching.',
          'Who qualifies: Employed, self-employed, apprentices, or anyone with a confirmed job offer.',
          'Your employer does not pay: The government directly covers the grant.'
        ],
        bottomLine: 'Apply immediately upon accepting a job offer. Access to Work guarantees accommodations without placing financial burden on your employer.',
        tone: 'Statutory employment support grant.'
      }
    }
  },
  {
    id: 'warm-home-discount',
    title: 'Warm Home Discount & Cold Weather Payment Relief for Vulnerable Households',
    category: 'housing',
    statutoryAuthority: 'Warm Home Discount (England and Wales) Regulations & Energy Act',
    summary: 'Automatic £150 annual credit on winter electricity bills plus emergency cold-weather subsidies for low-income and disabled residents.',
    keywords: ['warm home discount', 'electricity', 'winter bill', 'cold weather', 'energy grant', 'heating', 'utility bill', 'fuel poverty'],
    documentAnalysis: {
      ...SCENARIOS[3],
      id: 'warm-home-discount',
      title: 'Warm Home Discount Scheme Statutory Utility Relief',
      rawText: `DEPARTMENT FOR ENERGY SECURITY AND NET ZERO
Warm Home Discount Scheme (Core Group 1 and Core Group 2)

The Warm Home Discount Scheme provides an annual £150 rebate on domestic electricity accounts to households who meet statutory low-income and high-energy-cost criteria.
Eligibility:
- Core Group 1: Guarantee Credit element of Pension Credit.
- Core Group 2: Low-income threshold with high energy cost metric (receiving PIP, DLA, Universal Credit with housing element).
Energy suppliers are legally mandated to apply the credit directly to bill accounts before March 31.`,
      level1Summary: {
        plainEnglish: 'The Warm Home Discount gives eligible low-income and disabled households a £150 direct deduction on their winter electricity bill. You do not receive cash; your energy supplier applies the discount directly to your bill or sends prepayment vouchers.',
        bulletPoints: [
          'Rebate: £150 one-off discount applied to electricity bills.',
          'Who qualifies: People receiving disability benefits (PIP/DLA) or Universal Credit with low income.',
          'How to claim: Most suppliers apply it automatically; if not received by January, you have a right to challenge.',
          'Prepayment meters: Top-up vouchers sent by post or SMS.'
        ],
        bottomLine: 'Verify your eligibility before mid-winter. Energy companies are legally obligated under the Energy Act to issue these rebates.',
        tone: 'Statutory fuel poverty protection.'
      }
    }
  }
];
