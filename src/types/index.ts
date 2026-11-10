export type Category = 
  | 'healthcare' 
  | 'disability' 
  | 'education' 
  | 'housing' 
  | 'employment' 
  | 'legal';

export interface ChecklistItem {
  id: string;
  task: string;
  description: string;
  completed: boolean;
  urgency: 'high' | 'medium' | 'low';
  requiredDoc?: string;
}

export interface FormFieldBridge {
  field: string;
  question: string;
  explanation: string;
  suggestedAnswer: string;
  tips: string;
}

export interface DocumentAnalysis {
  id: string;
  title: string;
  category: Category;
  rawText: string;
  readingGradeOriginal: number; // e.g. 15.2
  readingGradeSimplified: number; // e.g. 5.1
  jargonTermsCount: number;
  jargonDictionary: { term: string; plainMeaning: string }[];
  urgencyLevel: 'critical' | 'high' | 'medium' | 'info';
  deadline: string | null;
  daysRemaining?: number;
  keyInstitution: string;
  level1Summary: {
    plainEnglish: string;
    bulletPoints: string[];
    bottomLine: string;
    tone: string;
  };
  level2Rights: {
    statutoryRights: string[];
    legalCitations: string[];
    hiddenEntitlements: string[];
    appealDeadlineDays: number;
    statutoryAuthority: string;
  };
  level3Checklist: ChecklistItem[];
  level4AppealDraft: {
    subject: string;
    recipient: string;
    letterBody: string;
    legalBasis: string;
  };
  smartFormBridge: FormFieldBridge[];
}

export interface AccessibilitySettings {
  dyslexicFont: boolean;
  bionicReading: boolean;
  highContrast: boolean;
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  speechRate: number; // 0.8 to 1.5
  language: string;
}
