import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { analyzePastedDocument } from '../src/utils/analyzer';
import { SEARCH_DATABASE } from '../src/data/searchDatabase';
import { DocumentAnalysis } from '../src/types';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// 1. Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  const envKeyPresent = !!process.env.GEMINI_API_KEY;
  res.json({
    status: 'online',
    service: 'Ctrl+V Access Backend API',
    version: '1.0.0',
    model: envKeyPresent ? 'gemini-3.8-flash (Frontier LLM)' : 'hybrid-local-nlp (Offline Resilient)',
    geminiConfigured: envKeyPresent,
    supportedEngines: [
      'gemini-3.8-flash',
      'gemini-3.5-flash-lite',
      'rule-based-nlp-v2'
    ],
    timestamp: new Date().toISOString()
  });
});

// 2. Full 5-tier Equalizer Document Analysis Endpoint
app.post('/api/analyze', async (req: Request, res: Response) => {
  try {
    const { text, apiKey, model = 'gemini-3.8-flash', language = 'en' } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text content is required' });
    }

    const keyToUse = apiKey || req.headers['x-gemini-api-key'] || process.env.GEMINI_API_KEY;

    // If Gemini key is available, call Gemini API for advanced frontier analysis
    if (keyToUse && typeof keyToUse === 'string' && keyToUse.trim().length > 10) {
      try {
        const ai = new GoogleGenAI({ apiKey: keyToUse.trim() });
        const systemPrompt = `You are the Ctrl+V Access AI Equalizer. 
Analyze the following bureaucratic, legal, or medical document and return ONLY a valid JSON object matching this schema:
{
  "title": "Clear concise title",
  "category": "healthcare" | "disability" | "education" | "housing" | "employment" | "legal",
  "readingGradeOriginal": number (e.g. 15.4),
  "readingGradeSimplified": number (e.g. 5.0),
  "jargonDictionary": [{ "term": "string", "plainMeaning": "string" }],
  "urgencyLevel": "critical" | "high" | "medium" | "info",
  "deadline": "string or null",
  "daysRemaining": number,
  "keyInstitution": "string",
  "level1Summary": {
    "plainEnglish": "A warm, accessible 5th-grade plain-English explanation without jargon",
    "bulletPoints": ["Key takeaway 1", "Key takeaway 2", "Key takeaway 3"],
    "bottomLine": "The 30-second essential bottom line",
    "tone": "Empathic and clear"
  },
  "level2Rights": {
    "statutoryRights": ["List of citizen rights under relevant laws"],
    "legalCitations": ["Specific acts, codes, or guidelines, e.g. NICE NG17, Equality Act 2010"],
    "hiddenEntitlements": ["Concessions or protections available to the user"],
    "appealDeadlineDays": number,
    "statutoryAuthority": "Name of governing legal standard"
  },
  "level3Checklist": [
    {
      "id": "step-1",
      "task": "Action title",
      "description": "Clear step instructions",
      "completed": false,
      "urgency": "high" | "medium" | "low",
      "requiredDoc": "Evidence or form name"
    }
  ],
  "level4AppealDraft": {
    "subject": "Formal Subject Line",
    "recipient": "Appeals Department / Decision Maker",
    "letterBody": "A complete, polite, legally referenced formal appeal letter with placeholders [Your Name], [Reference Number]",
    "legalBasis": "Summary of legal grounds"
  },
  "smartFormBridge": [
    {
      "field": "Portal Field Name",
      "question": "What the government form is asking",
      "explanation": "What they are actually testing",
      "suggestedAnswer": "A calibrated, factual response ready to paste back",
      "tips": "Practical advice"
    }
  ]
}
Language requested: ${language}.
Output pure JSON with no markdown wrapping.`;

        const response = await ai.models.generateContent({
          model: model || 'gemini-3.8-flash',
          contents: `${systemPrompt}\n\nDOCUMENT TO EQUALIZE:\n${text}`
        });

        const rawOutput = response.text || '';
        // Extract JSON if wrapped in markdown code fence
        const jsonMatch = rawOutput.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          const result: DocumentAnalysis = {
            id: `doc-${Date.now()}`,
            rawText: text,
            jargonTermsCount: parsed.jargonDictionary?.length || 0,
            ...parsed
          };
          return res.json({
            success: true,
            source: 'gemini-frontier',
            model: model,
            data: result
          });
        }
      } catch (geminiErr: any) {
        console.warn('Gemini API call failed or key was invalid, falling back to local NLP engine:', geminiErr?.message);
        // Fallback directly to high-accuracy local NLP engine
      }
    }

    // Default robust fallback: local NLP engine
    const analysis = analyzePastedDocument(text);
    return res.json({
      success: true,
      source: 'local-hybrid-nlp',
      model: 'rule-based-nlp-v2',
      data: analysis
    });
  } catch (error: any) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze document', details: error.message });
  }
});

// 3. Statutory Rights Search Endpoint
app.post('/api/rights/search', (req: Request, res: Response) => {
  try {
    const { query = '', category } = req.body;
    const q = query.toLowerCase().trim();

    let results = SEARCH_DATABASE;

    if (category && category !== 'all') {
      results = results.filter(item => item.category === category);
    }

    if (q) {
      results = results.filter(item => {
        const titleMatch = item.title.toLowerCase().includes(q);
        const authMatch = item.statutoryAuthority.toLowerCase().includes(q);
        const sumMatch = item.summary.toLowerCase().includes(q);
        const kwMatch = item.keywords.some(k => k.toLowerCase().includes(q));
        return titleMatch || authMatch || sumMatch || kwMatch;
      });
    }

    res.json({
      success: true,
      count: results.length,
      results: results.map(r => ({
        id: r.id,
        title: r.title,
        category: r.category,
        statutoryAuthority: r.statutoryAuthority,
        summary: r.summary,
        keywords: r.keywords,
        documentAnalysis: r.documentAnalysis
      }))
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Search failed', details: error.message });
  }
});

// 4. Custom Appeal Generator Endpoint
app.post('/api/appeal/generate', (req: Request, res: Response) => {
  try {
    const { recipient, patientName, referenceId, grounds, statutoryCitation } = req.body;

    const appealLetter = `FORMAL NOTICE OF PROCEDURAL REVIEW & STATUTORY RECONSIDERATION

Date: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
To: ${recipient || 'Appeals and Formal Complaints Directorate'}
Reference / Claim ID: ${referenceId || '[INSERT REFERENCE NUMBER]'}
Claimant / Patient: ${patientName || '[INSERT FULL NAME]'}

Dear Appeals Officer,

I am writing to formally request an urgent reconsideration and procedural review regarding the decision notice issued concerning my case. 

STATUTORY & CLINICAL GROUNDS FOR APPEAL:
${grounds || 'The initial determination failed to take into account my documented medical evidence, daily living impairments, and mandatory statutory guidelines.'}

RELEVANT LEGAL STANDARD:
This appeal is submitted pursuant to ${statutoryCitation || 'statutory guidance and administrative due process regulations'}. The original assessment failed to adhere to the required legal threshold of assessing whether activities can be performed safely, reliably, repeatedly, and in a reasonable time.

EVIDENCE ENCLOSED:
1. Primary clinical evidence and specialist medical reports.
2. Personal impact statement regarding daily functional limitations.
3. Relevant statutory citations and policy guidance.

I request that this decision be reviewed immediately by an independent decision-maker. Pending this review, I request that all current support and services remain in effect.

Yours sincerely,

${patientName || '[YOUR SIGNATURE AND PRINTED NAME]'}
Contact: [YOUR PHONE NUMBER / EMAIL ADDRESS]`;

    res.json({
      success: true,
      letter: appealLetter,
      generatedAt: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to generate appeal', details: error.message });
  }
});

// 5. Adaption Platform Invent-a-Dataset endpoint
app.post('/api/adaption/dataset', (req: Request, res: Response) => {
  const { domain = 'healthcare-accessibility', language = 'en', count = 5 } = req.body;
  
  res.json({
    success: true,
    sponsor: 'Adaption Platform Integration',
    feature: 'Invent-a-Dataset / Adaptive Data',
    domain,
    language,
    count,
    samples: [
      {
        id: 'ds-01',
        originalGrade: 16.2,
        simplifiedGrade: 5.1,
        sourceType: 'NHS Continuous Glucose Monitor Denial',
        remedy: 'NICE NG17 statutory appeal'
      },
      {
        id: 'ds-02',
        originalGrade: 15.8,
        simplifiedGrade: 4.8,
        sourceType: 'DWP PIP 0-Points Mobility Notice',
        remedy: 'Regulation 4(2A) reliably/repeatedly test'
      },
      {
        id: 'ds-03',
        originalGrade: 14.9,
        simplifiedGrade: 5.0,
        sourceType: 'University DSA Exam Time Denial',
        remedy: 'Equality Act 2010 Section 20 anticipatory duty'
      }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`[Ctrl+V Access Backend] Server running on http://localhost:${PORT}`);
  console.log(`[Ctrl+V Access Backend] Health check: http://localhost:${PORT}/api/health`);
});
